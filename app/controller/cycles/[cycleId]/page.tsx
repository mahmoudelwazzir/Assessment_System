"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCourseRound,
  useStudents,
  useAssessmentsByCourseRound,
  useCreateCourseRound,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const getCycleStatus = (round: any) => {
  if (!round.startDate || !round.endDate) {
    return {
      status: "unknown",
      label: "No Dates",
      color:
        "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10",
    };
  }

  const now = new Date();
  const start = new Date(round.startDate);
  const end = new Date(round.endDate);

  if (now < start) {
    return {
      status: "upcoming",
      label: "Upcoming",
      color:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
    };
  } else if (now > end) {
    return {
      status: "past",
      label: "Concluded",
      color:
        "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-500 border-slate-200 dark:border-white/10",
    };
  } else {
    return {
      status: "active",
      label: "Active Cycle",
      color:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
    };
  }
};

export default function CycleDetailPage() {
  const { cycleId } = useParams<{ cycleId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const courseRoundId = Number.parseInt(cycleId, 10);

  const {
    data: courseRound,
    isLoading: loadingRound,
    error: roundError,
    refetch,
  } = useCourseRound(courseRoundId);
  const { data: studentsData, isLoading: loadingStudents } = useStudents();
  const {
    data: assessmentsData,
    isLoading: loadingAssessments,
    error: assessmentsError,
  } = useAssessmentsByCourseRound(courseRoundId);

  const { update, deleteCycle, isLoading: isSaving } = useCreateCourseRound();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    roundNumber: "",
    startDate: "",
    endDate: "",
  });

  const students = studentsData ?? [];
  const assessments = assessmentsError ? [] : (assessmentsData ?? []);

  const isLoading = loadingRound || loadingStudents || loadingAssessments;

  const handleEdit = () => {
    if (courseRound) {
      setEditData({
        roundNumber: courseRound.roundNumber.toString(),
        startDate: courseRound.startDate || "",
        endDate: courseRound.endDate || "",
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!courseRound) return;

    try {
      await update(courseRound.id, {
        courseId: courseRound.courseId,
        roundNumber: Number(editData.roundNumber),
        startDate: editData.startDate,
        endDate: editData.endDate,
        isActive: courseRound.isActive,
      });

      toast({
        title: "Cycle Updated",
        description: "Cycle parameters have been saved successfully.",
      });

      setIsEditing(false);
      refetch();
    } catch (err) {
      toast({
        title: "Update Error",
        description:
          err instanceof Error ? err.message : "Failed to update cycle",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!courseRound) return;

    if (
      !confirm(
        `Are you sure you want to delete Round ${courseRound.roundNumber}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteCycle(courseRound.id);

      toast({
        title: "Cycle Deleted",
        description: "The cycle has been removed successfully.",
      });

      router.push("/controller/cycles");
    } catch (err) {
      toast({
        title: "Delete Failed",
        description:
          err instanceof Error ? err.message : "Failed to delete cycle",
        variant: "destructive",
      });
    }
  };

  if (roundError) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#c8102e] mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Error Loading Cycle
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            {roundError.message}
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading cycle telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (!courseRound) {
    return (
      <div className="p-12 text-center text-slate-500">
        Cycle round not found.
      </div>
    );
  }

  const assessed = assessments.filter((a) => a.status !== "Draft").length;
  const total = students.length;
  const completion = total > 0 ? Math.round((assessed / total) * 100) : 0;

  const studentsWithResults = students.map((student) => {
    const assessment = assessments.find((a) => a.studentId === student.id);
    const competency = student.competencies?.[0]?.competencyName || "Discipline";

    return {
      student: {
        ...student,
        competency,
      },
      assessment,
      totalScore: assessment?.totalScore,
      maxScore: assessment?.maxScore,
      percentage:
        assessment?.totalScore && assessment?.maxScore
          ? Math.round((assessment.totalScore / assessment.maxScore) * 100)
          : null,
    };
  });

  const startDate = courseRound.startDate
    ? new Date(courseRound.startDate).toLocaleDateString()
    : "—";
  const endDate = courseRound.endDate
    ? new Date(courseRound.endDate).toLocaleDateString()
    : "—";

  const cycleStatus = getCycleStatus(courseRound);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <button
          onClick={() => router.push("/controller/cycles")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cycles
        </button>
      </div>

      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Round Details
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${cycleStatus.color}`}
              >
                {cycleStatus.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assessment Round {courseRound.roundNumber}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-mono">
              Timeline: {startDate} → {endDate}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={isSaving}
              className="rounded-xl h-10 px-4 text-xs font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit Parameters
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSaving}
              className="rounded-xl h-10 px-4 text-xs font-bold bg-[#c8102e] hover:bg-[#b00d27]"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete Round
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      {isEditing && (
        <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-[#c8102e]/30 shadow-lg animate-in fade-in-50 duration-200">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Edit Cycle Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block">
                Round Number
              </label>
              <Input
                type="number"
                min="1"
                value={editData.roundNumber}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, roundNumber: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block">
                Start Date
              </label>
              <Input
                type="date"
                value={editData.startDate}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, startDate: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block">
                End Date
              </label>
              <Input
                type="date"
                value={editData.endDate}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, endDate: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="rounded-xl bg-[#c8102e] hover:bg-[#b00d27] text-white font-bold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Total Candidates
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {total}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
            Enrolled in round
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Evaluations Finalized
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {assessed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
            Completed rubrics
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Velocity
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#c8102e] dark:text-[#ff4d6a]">
            {completion}%
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
            Overall progress
          </p>
        </Card>
      </div>

      {/* Progress Card */}
      <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Round Assessment Velocity
          </h2>
          <span className="text-2xl font-extrabold text-[#c8102e] dark:text-[#ff4d6a]">
            {completion}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#c8102e] to-[#ff4d6a] h-full rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 font-medium">
          {assessed} of {total} candidates evaluated
        </p>
      </Card>

      {/* Candidate Roster Card */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">
            Enrolled Candidates ({total})
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {studentsWithResults.map(({ student, assessment, percentage }) => {
            const initials = student.fullNameEn
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={student.id}
                className="p-5 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {student.fullNameEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                      {student.email} · {student.competency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {percentage !== null && (
                    <span
                      className={`text-lg font-extrabold tracking-tight ${
                        percentage >= 80
                          ? "text-emerald-600 dark:text-emerald-400"
                          : percentage >= 50
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-[#c8102e] dark:text-[#ff4d6a]"
                      }`}
                    >
                      {percentage}%
                    </span>
                  )}

                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                    {assessment?.status ?? "Pending Evaluation"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
