"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
  Filter,
  ArrowUpRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, useCourseRounds } from "@/hooks/use-api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://sewedyassessmentsys.runasp.net/api";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed.token || null;
  } catch {
    return null;
  }
}

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ElementType;
  trend?: string;
  badgeColor?: string;
}

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  badgeColor = "text-[#c8102e] bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/30",
}: StatCardProps) {
  return (
    <Card className="p-6 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
          {label}
        </span>
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${badgeColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            {trend}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 font-medium">
          {sublabel}
        </p>
      )}
    </Card>
  );
}

export default function ControllerDashboard() {
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [filterRoundId, setFilterRoundId] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: courses } = useCourses();
  const { data: courseRounds } = useCourseRounds();

  const activeCycle =
    courseRounds?.find((c) => c.statusId === 1) || courseRounds?.[0];

  useEffect(() => {
    if (activeCycle && !filterRoundId) {
      setFilterRoundId(activeCycle.id);
    }
  }, [activeCycle, filterRoundId]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterRoundId)
          params.append("courseRoundId", filterRoundId.toString());
        if (filterCourseId)
          params.append("courseId", filterCourseId.toString());

        const token = getAuthToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const url = `${API_BASE_URL}/Dashboard?${params.toString()}`;
        const response = await fetch(url, {
          headers,
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    if (filterRoundId) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [filterRoundId, filterCourseId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading assessment intelligence...
          </span>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {
    totalStudents: 0,
    resultsSubmitted: 0,
    cycleCompletionPercent: 0,
  };
  const assessorProgress = dashboardData?.assessorProgress || [];
  const submissionsByCompetency = dashboardData?.submissionsByCompetency || [];
  const overallCompletion = dashboardData?.overallCompletion || {
    totalStudents: 0,
    assessedStudents: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Operations
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Calendar className="w-3.5 h-3.5" />
                {activeCycle
                  ? `Cycle Round ${activeCycle.roundNumber}`
                  : "No Active Cycle"}
              </span>
              {activeCycle && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    activeCycle.statusId === 1
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                  }`}
                >
                  {activeCycle.statusId === 1 ? "Active Status" : "Concluded"}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Controller Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time monitoring of competency evaluations, assessor submission
              rates, and academic workflow distribution across Elsewedy Academy.
            </p>
          </div>

          {/* Quick Round / Filter Pill Box */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#ff4d6a]" />
                Select Round
              </label>
              <Select
                value={filterRoundId?.toString() || ""}
                onValueChange={(v) => setFilterRoundId(v ? Number(v) : null)}
              >
                <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-white/10 border-white/20 text-white font-semibold">
                  <SelectValue placeholder="Round" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {courseRounds?.map((round) => (
                    <SelectItem key={round.id} value={round.id.toString()}>
                      Round {round.roundNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#ff4d6a]" />
                Competency
              </label>
              <Select
                value={filterCourseId?.toString() || "All"}
                onValueChange={(v) =>
                  setFilterCourseId(v === "All" ? null : Number(v))
                }
              >
                <SelectTrigger className="w-44 h-9 text-xs rounded-xl bg-white/10 border-white/20 text-white font-semibold">
                  <SelectValue placeholder="All Competencies" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Competencies</SelectItem>
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          label="Total Enrolled Students"
          value={summary.totalStudents}
          sublabel="Candidates participating in cycle"
          icon={Users}
          trend="+12% this cycle"
          badgeColor="text-[#c8102e] bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/30"
        />
        <StatCard
          label="Completed Evaluations"
          value={summary.resultsSubmitted}
          sublabel="Candidate assessments finalized"
          icon={CheckCircle2}
          badgeColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30"
        />
        <StatCard
          label="Cycle Completion Rate"
          value={`${summary.cycleCompletionPercent}%`}
          sublabel="Aggregate institutional progress"
          icon={TrendingUp}
          badgeColor="text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30"
        />
      </div>

      {/* Grid: Assessor Progress & Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessor Progress */}
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Assessor Grading Progress
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Evaluation workload per assigned faculty assessor
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
              {assessorProgress.length} Assessors
            </span>
          </div>

          <div className="space-y-4">
            {assessorProgress.length > 0 ? (
              assessorProgress.map((ap: any, i: number) => {
                const percent =
                  ap.total > 0
                    ? Math.round((ap.submitted / ap.total) * 100)
                    : 0;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="font-semibold text-slate-800 dark:text-neutral-200">
                        {ap.assessorName}
                      </div>
                      <div className="text-slate-500 dark:text-neutral-400 font-medium">
                        <span className="text-[#c8102e] dark:text-[#ff4d6a] font-bold">
                          {ap.submitted}
                        </span>{" "}
                        / {ap.total} ({percent}%)
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#c8102e] to-[#ff4d6a] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1.5 truncate">
                      Module: {ap.competencyName}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 dark:text-neutral-500 text-sm">
                No active assessor workloads found for this round.
              </div>
            )}
          </div>
        </Card>

        {/* Submissions by Competency */}
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Submissions by Competency
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Completion rates categorized by technical discipline
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
              {submissionsByCompetency.length} Modules
            </span>
          </div>

          <div className="space-y-4">
            {submissionsByCompetency.length > 0 ? (
              submissionsByCompetency.map((cs: any, i: number) => {
                const percent =
                  cs.total > 0
                    ? Math.round((cs.submitted / cs.total) * 100)
                    : 0;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate max-w-[200px]">
                        {cs.competencyName}
                      </span>
                      <span className="text-slate-500 dark:text-neutral-400 font-medium">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {cs.submitted}
                        </span>{" "}
                        / {cs.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 dark:text-neutral-500 text-sm">
                No competency submission data recorded yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Overall Completion Metric Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Institutional Assessment Velocity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Cumulative progress towards completing all scheduled candidate
              rubric evaluations
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#c8102e] dark:text-[#ff4d6a] tracking-tight">
              {summary.cycleCompletionPercent}%
            </span>
            <p className="text-xs text-slate-400 dark:text-neutral-500 font-medium mt-0.5">
              Cycle completion
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3.5 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#c8102e] via-[#e8192f] to-[#ff4d6a] h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${summary.cycleCompletionPercent}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 font-medium">
          <span>
            {overallCompletion.assessedStudents} of{" "}
            {overallCompletion.totalStudents} candidate assessments submitted
          </span>
          <span>
            {Math.max(
              0,
              overallCompletion.totalStudents -
                overallCompletion.assessedStudents,
            )}{" "}
            pending completion
          </span>
        </div>
      </Card>
    </div>
  );
}
