"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { AssessmentForm } from "@/components/assess/assessment-form";
import type {
  Task,
  SubTask,
  Student,
  Competency,
  TaskScores,
} from "@/lib/types";
import type { AssessmentFormData } from "@/components/assess/assessment-form";

export default function VerifierReviewPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: result,
    isLoading: loadingResult,
    error: resultError,
    refetch,
  } = useApiQuery(
    () =>
      resultId
        ? api.competencyResults.getById(Number(resultId))
        : Promise.reject(new Error("No result ID provided")),
    [resultId],
  );

  const { data: student, isLoading: loadingStudent } = useApiQuery(
    () =>
      result?.studentId
        ? api.students.getById(result.studentId)
        : Promise.resolve(null),
    [result?.studentId],
  );

  const { data: assignments, isLoading: loadingAssignments } = useApiQuery(
    () =>
      result?.courseId
        ? api.courseRoundAssignments.getAll(result.courseId)
        : Promise.resolve([]),
    [result?.courseId],
  );

  const tasks: Task[] = useMemo(() => {
    if (!assignments || assignments.length === 0) return [];

    return assignments.map((assignment) => {
      const subtasks: SubTask[] = [];

      if (assignment.description) {
        const subtaskMatch = assignment.description.match(/Subtasks:\s*(.+)/);
        if (subtaskMatch) {
          const subtaskStr = subtaskMatch[1];
          const parts = subtaskStr.split(/,\s*/);

          parts.forEach((part, index) => {
            const match = part.match(/^(.+?):\s*(\d+(?:\.\d+)?)\s*points?$/);
            if (match) {
              subtasks.push({
                id: `${assignment.id}-${index}`,
                label: match[1].trim(),
                maxPoints: Number.parseFloat(match[2]),
              });
            }
          });
        }
      }

      if (subtasks.length === 0) {
        subtasks.push({
          id: `${assignment.id}-0`,
          label: "Performance & Demonstration",
          maxPoints: assignment.totalGrade,
        });
      }

      return {
        id: assignment.id.toString(),
        label: assignment.title,
        subTasks: subtasks,
      };
    });
  }, [assignments]);

  const initialScores: TaskScores = {};

  const handleSave = async (data: AssessmentFormData) => {
    if (!result) return;

    try {
      let totalScore = 0;
      let maxScore = 0;

      tasks.forEach((task) => {
        task.subTasks.forEach((subtask) => {
          const key = `${task.id}.${subtask.id}`;
          const score = data.scores[key] || 0;
          totalScore += score;
          maxScore += subtask.maxPoints;
        });
      });

      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const PASS_STATUS_ID = 53;
      const FAIL_STATUS_ID = 54;
      const passed = percentage >= 80;

      await api.competencyResults.update(result.id, {
        totalScore,
        maxScore,
        resultStatusId: passed ? PASS_STATUS_ID : FAIL_STATUS_ID,
        notes: data.notes || undefined,
      });

      toast({
        title: "Audit Saved",
        description: `Assessment verified & updated. Outcome: ${passed ? "Pass" : "Not Pass"}`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Update Error",
        description:
          error instanceof Error ? error.message : "Failed to update record",
        variant: "destructive",
      });
    }
  };

  if (loadingResult || loadingStudent || loadingAssignments) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading assessment audit record...
          </span>
        </div>
      </div>
    );
  }

  if (resultError || !result) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-3xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#c8102e] mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Assessment Record Not Found
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            Could not find result submission #{resultId}.
          </p>
          <Button
            onClick={() => router.push("/verifier/results")}
            className="rounded-xl"
          >
            Return to Monitor
          </Button>
        </Card>
      </div>
    );
  }

  const isPassed = result.resultStatusName === "Pass";
  const percentage =
    result.scorePercentage !== undefined && result.scorePercentage !== null
      ? result.scorePercentage.toFixed(1)
      : result.totalScore && result.maxScore
        ? ((result.totalScore / result.maxScore) * 100).toFixed(1)
        : "0";

  const formStudent: Student = {
    id: result.studentId.toString(),
    code: student?.nationalId || `STU${result.studentId}`,
    fullName:
      result.studentName ||
      student?.fullNameEn ||
      `Student #${result.studentId}`,
    gradeLevel: "Junior",
    competency: "Software",
    enrolledCompetencies: [],
  };

  const formCompetency: Competency = {
    id: result.courseId.toString(),
    name: result.courseName || "Competency",
    gradeLevel: "Junior",
    description: `Verification of ${result.courseName || "competency"}`,
    learningOutcomes: assignments.map((a) => a.title),
    totalStudents: 0,
    gradeDistribution: { A: 0, B: 0, C: 0, D: 0 },
  };

  const currentTrial: "A" | "B" | "C" | "D" = "A";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <button
          onClick={() => router.push("/verifier/results")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verification Monitor
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
                Rubric Verification QA
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5" />
                Record #{result.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formStudent.fullName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {result.courseName} · Graded by{" "}
              <span className="font-semibold text-white">
                {result.assessorName || `Assessor #${result.assessorId}`}
              </span>{" "}
              on {new Date(result.gradedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPassed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {isPassed ? "Pass Status" : "Not Pass"}
            </span>

            <p
              className={`text-3xl font-extrabold mt-2 ${
                isPassed ? "text-emerald-400" : "text-[#ff4d6a]"
              }`}
            >
              {percentage}%
            </p>
            {result.totalScore !== undefined && result.maxScore !== undefined && (
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {result.totalScore} / {result.maxScore} pts
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Audit Form */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Audit Rubric Scoring
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            As an authorized Internal Verifier, review the submitted criteria
            marks and adjust observations if necessary.
          </p>
        </div>

        <AssessmentForm
          student={formStudent}
          competency={formCompetency}
          tasks={tasks}
          currentTrial={currentTrial}
          initialScores={initialScores}
          initialNotes={result.notes || ""}
          isLocked={false}
          isCycleClosed={false}
          mode="sheet"
          onSubmit={handleSave}
          onCancel={() => router.push("/verifier/results")}
        />
      </Card>
    </div>
  );
}
