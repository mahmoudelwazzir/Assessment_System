"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  X,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCourseRounds,
  useCourses,
  useCreateCourseRound,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function CyclesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: courseRounds, isLoading, error, refetch } = useCourseRounds();
  const { data: courses } = useCourses();
  const { create: createCourseRound, isLoading: isCreating } =
    useCreateCourseRound();

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

  const [showForm, setShowForm] = useState(false);
  const [newCycle, setNewCycle] = useState({
    courseId: "",
    roundNumber: "",
    startDate: "",
    endDate: "",
  });

  const cyclesByCourse = useMemo(() => {
    if (!courseRounds || !courses) return [];

    const grouped = courses
      .map((course) => {
        const rounds = courseRounds.filter((r) => r.courseId === course.id);
        return {
          course,
          rounds: rounds.sort((a, b) => b.roundNumber - a.roundNumber),
        };
      })
      .filter((g) => g.rounds.length > 0);

    return grouped;
  }, [courseRounds, courses]);

  const handleCreate = async () => {
    if (
      !newCycle.courseId ||
      !newCycle.roundNumber ||
      !newCycle.startDate ||
      !newCycle.endDate
    ) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all cycle parameters.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCourseRound({
        courseId: Number.parseInt(newCycle.courseId, 10),
        roundNumber: Number.parseInt(newCycle.roundNumber, 10),
        startDate: newCycle.startDate,
        endDate: newCycle.endDate,
        isActive: false,
      });

      toast({
        title: "Cycle Created",
        description: `Round ${newCycle.roundNumber} created successfully.`,
      });

      setNewCycle({
        courseId: "",
        roundNumber: "",
        startDate: "",
        endDate: "",
      });
      setShowForm(false);
      refetch();
    } catch (err) {
      toast({
        title: "Error Creating Cycle",
        description:
          err instanceof Error ? err.message : "Failed to create cycle",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#c8102e] mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Error Loading Cycles
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Cycle Management
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <RefreshCw className="w-3.5 h-3.5" />
                {courseRounds?.length || 0} Total Rounds
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assessment Cycles & Rounds
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Define academic windows, launch new assessment rounds, and
              configure competency evaluation timelines across all programs.
            </p>
          </div>

          <Button
            onClick={() => setShowForm((v) => !v)}
            disabled={isLoading}
            className="rounded-2xl px-5 py-6 bg-gradient-to-r from-[#c8102e] to-[#e8192f] hover:from-[#b00d27] hover:to-[#c8102e] text-white font-bold shadow-lg shadow-[#c8102e]/25 shrink-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? "Close Form" : "Create New Cycle"}
          </Button>
        </div>
      </div>

      {/* New Cycle Form Card */}
      {showForm && (
        <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-[#c8102e]/30 shadow-lg animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Configure New Assessment Cycle
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Assign competency discipline, specify round iteration, and set
                start/end validity dates.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label
                htmlFor="cycle-course"
                className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block"
              >
                Course / Competency
              </label>
              <Select
                value={newCycle.courseId}
                onValueChange={(v) =>
                  setNewCycle((p) => ({ ...p, courseId: v }))
                }
              >
                <SelectTrigger id="cycle-course" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="cycle-round"
                className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block"
              >
                Round Number
              </label>
              <Input
                id="cycle-round"
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={newCycle.roundNumber}
                onChange={(e) =>
                  setNewCycle((p) => ({ ...p, roundNumber: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label
                htmlFor="cycle-start"
                className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block"
              >
                Start Date
              </label>
              <Input
                id="cycle-start"
                type="date"
                value={newCycle.startDate}
                onChange={(e) =>
                  setNewCycle((p) => ({ ...p, startDate: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label
                htmlFor="cycle-end"
                className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 block"
              >
                End Date
              </label>
              <Input
                id="cycle-end"
                type="date"
                value={newCycle.endDate}
                onChange={(e) =>
                  setNewCycle((p) => ({ ...p, endDate: e.target.value }))
                }
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={isCreating}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="rounded-xl bg-[#c8102e] hover:bg-[#b00d27] text-white font-bold"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Cycle...
                </>
              ) : (
                "Save & Launch Cycle"
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Cycles Grouped by Course */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
            <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Loading assessment cycles...
            </span>
          </div>
        </div>
      ) : cyclesByCourse.length === 0 ? (
        <Card className="p-12 text-center rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No Assessment Cycles Defined
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            Click &quot;Create New Cycle&quot; above to initialize round schedules.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {cyclesByCourse.map(({ course, rounds }) => (
            <Card
              key={course.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      {course.description || "Technical Competency Module"}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                  {rounds.length} Round{rounds.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rounds.map((round) => {
                  const startDate = round.startDate
                    ? new Date(round.startDate).toLocaleDateString()
                    : "—";
                  const endDate = round.endDate
                    ? new Date(round.endDate).toLocaleDateString()
                    : "—";

                  const cycleStatus = getCycleStatus(round);

                  return (
                    <div
                      key={round.id}
                      onClick={() =>
                        router.push(`/controller/cycles/${round.id}`)
                      }
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-[#c8102e]/40 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-neutral-200 border border-slate-200/80 dark:border-white/10 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                          R{round.roundNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors">
                              Round {round.roundNumber}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cycleStatus.color}`}
                            >
                              {cycleStatus.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5 font-mono">
                            {startDate} → {endDate}
                          </p>
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-white/5 text-slate-400 group-hover:bg-[#c8102e] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
