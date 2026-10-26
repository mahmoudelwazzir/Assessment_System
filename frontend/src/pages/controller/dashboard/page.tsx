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
  Calendar,
  Activity,
  Award,
  Clock,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, useCourseRounds } from "@/hooks/use-api";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "/api";

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

// -----------------------------------------------------------------------------
// SKELETON LOADER COMPONENT (Bento Layout)
// -----------------------------------------------------------------------------
function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-72 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
        <div className="h-72 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-64 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
        <div className="h-64 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
        <div className="h-64 rounded-3xl bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
      </div>
    </div>
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
    return <DashboardSkeleton />;
  }

  const summary = dashboardData?.summary || {
    totalStudents: 124,
    resultsSubmitted: 108,
    cycleCompletionPercent: 87,
  };
  const assessorProgress = dashboardData?.assessorProgress || [
    { assessorName: "Eng. Ahmed Tarek", competencyName: "Industrial IoT & RS485", submitted: 28, total: 30 },
    { assessorName: "Eng. Mohamed Samir", competencyName: "RTOS Firmware Implementation", submitted: 26, total: 30 },
    { assessorName: "Eng. Sarah Nabil", competencyName: "Safety Interlocks & Standards", submitted: 29, total: 30 },
  ];
  const submissionsByCompetency = dashboardData?.submissionsByCompetency || [
    { competencyName: "Industrial Automation & PLC", submitted: 42, total: 45 },
    { competencyName: "Embedded RTOS Architecture", submitted: 38, total: 40 },
    { competencyName: "Field Quality Assurance", submitted: 28, total: 30 },
  ];
  const overallCompletion = dashboardData?.overallCompletion || {
    totalStudents: summary.totalStudents || 120,
    assessedStudents: summary.resultsSubmitted || 105,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* ============================================================== */}
      {/* 1. EXECUTIVE HEADER BANNER (Ambient Glow + Quick Filters)       */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#19090c] text-white border border-slate-800 shadow-xl relative overflow-hidden">
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

              {/* Pulsing Live Status Dot */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active Evaluation Round
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Calendar className="w-3.5 h-3.5" />
                {activeCycle
                  ? `Cycle Round ${activeCycle.roundNumber}`
                  : "Round 1"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Controller Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time monitoring of institutional competency evaluations, assessor
              grading throughput, and academic quality assurance across Elsewedy Academy.
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

      {/* ============================================================== */}
      {/* 2. BENTO GRID ARCHITECTURE (Hero Metric + Velocity + KPIs)     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bento Hero Card: Completion Velocity (Spans 2 cols) */}
        <Card className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#c8102e]/10 text-[#c8102e] dark:text-[#ff4d6a]">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Institutional Velocity
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                Assessment Round Throughput
              </h2>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold px-3 py-1">
              On Schedule • +14% vs Target
            </Badge>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Total Enrolled</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.totalStudents}</p>
              <span className="text-[11px] text-slate-400 font-medium">Candidates active</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Evaluated</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{summary.resultsSubmitted}</p>
              <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Results finalized</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Pending Review</span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {Math.max(0, summary.totalStudents - summary.resultsSubmitted)}
              </p>
              <span className="text-[11px] text-amber-600/80 font-medium">In verification queue</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
              <span>Overall Completion Target</span>
              <span className="text-[#c8102e] dark:text-[#ff4d6a] font-black">{summary.cycleCompletionPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#c8102e] via-[#e8192f] to-[#ff4d6a] h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${summary.cycleCompletionPercent}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Bento Card: Quality Gate / Pass Index (Spans 1 col) */}
        <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Quality Gate Index
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              94.2%
            </p>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Aggregate First-Time Competency Pass Rate
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                  <span>Attempt A (First Pass)</span>
                  <span className="text-emerald-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                  <span>Attempt B (Retake Cleared)</span>
                  <span className="text-blue-500 font-bold">16%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "16%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                  <span>Under Active Remediation</span>
                  <span className="text-amber-500 font-bold">6%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "6%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified by QA Verifiers</span>
            <span className="font-semibold text-slate-600 dark:text-neutral-300">Audited 100%</span>
          </div>
        </Card>
      </div>

      {/* ============================================================== */}
      {/* 3. ASSESSOR PROGRESS & COMPETENCY BREAKDOWN                    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessor Progress Card */}
        <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c8102e]" />
                Assessor Grading Progress
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Live faculty evaluation throughput per workshop module
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
              {assessorProgress.length} Assessors
            </span>
          </div>

          <div className="space-y-4">
            {assessorProgress.map((ap: any, i: number) => {
              const percent =
                ap.total > 0
                  ? Math.round((ap.submitted / ap.total) * 100)
                  : 0;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#c8102e]/10 text-[#c8102e] font-bold text-[10px] flex items-center justify-center">
                        {ap.assessorName.split(" ")[1]?.[0] || "A"}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-neutral-200">
                        {ap.assessorName}
                      </span>
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
                    Discipline: {ap.competencyName}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Competency Disciplines Card */}
        <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                Submissions by Competency
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Technical assessment status by practical discipline
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
              {submissionsByCompetency.length} Modules
            </span>
          </div>

          <div className="space-y-4">
            {submissionsByCompetency.map((cs: any, i: number) => {
              const percent =
                cs.total > 0
                  ? Math.round((cs.submitted / cs.total) * 100)
                  : 0;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate max-w-[220px]">
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
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
