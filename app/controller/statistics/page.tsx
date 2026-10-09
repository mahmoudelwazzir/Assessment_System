"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
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

export default function StatisticsPage() {
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [filterRoundId, setFilterRoundId] = useState<number | null>(null);
  const [statisticsData, setStatisticsData] = useState<any>(null);
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
    const fetchStatistics = async () => {
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

        const url = `${API_BASE_URL}/Dashboard/statistics?${params.toString()}`;
        const response = await fetch(url, {
          headers,
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStatisticsData(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setStatisticsData(null);
      } finally {
        setLoading(false);
      }
    };

    if (filterRoundId) {
      fetchStatistics();
    } else {
      setLoading(false);
    }
  }, [filterRoundId, filterCourseId]);

  const summary = statisticsData?.summary || {
    totalStudents: 0,
    assessed: 0,
    approved: 0,
    completionPercent: 0,
  };
  const scoreDistribution = statisticsData?.scoreDistribution || [];
  const competencyBreakdown = statisticsData?.competencyBreakdown || [];
  const assessorPerformance = statisticsData?.assessorPerformance || [];

  const maxBucket =
    scoreDistribution.length > 0
      ? Math.max(...scoreDistribution.map((b: any) => b.studentCount), 1)
      : 1;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Synthesizing performance statistics...
          </span>
        </div>
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

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Institutional Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Calendar className="w-3.5 h-3.5" />
                {activeCycle
                  ? `Round ${activeCycle.roundNumber}`
                  : "All Rounds"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assessment Analytics & Telemetry
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Score distributions, competency passing benchmarks, and faculty
              evaluation rates aggregated across Elsewedy Academy.
            </p>
          </div>

          {/* Scope Filters Pill */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#ff4d6a]" />
                Round
              </label>
              <Select
                value={filterRoundId?.toString() || ""}
                onValueChange={(v) => setFilterRoundId(v ? Number(v) : null)}
              >
                <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-white/10 border-white/20 text-white font-semibold">
                  <SelectValue placeholder="Select Round" />
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Total Enrolled
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {summary.totalStudents}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Candidate pool
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Assessed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {summary.assessed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Submitted rubrics
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Verified & Approved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {summary.approved}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Passed verification QA
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Velocity Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#c8102e] dark:text-[#ff4d6a]">
            {Math.round(summary.completionPercent)}%
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Round completion
          </p>
        </Card>
      </div>

      {/* Score Distribution Chart Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Score Distribution Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Candidate distribution across rubric percentage brackets
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
            {scoreDistribution.length} Intervals
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-200 dark:border-white/10 pb-2">
          {scoreDistribution.map((b: any) => {
            const heightPercent =
              maxBucket > 0 ? (b.studentCount / maxBucket) * 100 : 0;
            return (
              <div
                key={b.label}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                {b.studentCount > 0 && (
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white mb-1 group-hover:scale-110 transition-transform">
                    {b.studentCount}
                  </span>
                )}
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-[#c8102e] to-[#ff4d6a] rounded-t-xl transition-all duration-500 shadow-sm group-hover:brightness-110"
                  style={{
                    height:
                      b.studentCount > 0
                        ? `${Math.max(heightPercent, 8)}%`
                        : "0%",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          {scoreDistribution.map((b: any) => (
            <div key={`label-${b.label}`} className="flex-1 text-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Competency Breakdown Table */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">
            Discipline & Competency Breakdown
          </h2>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Progress per curriculum module
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="text-left px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Competency
                </th>
                <th className="text-center px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Enrolled
                </th>
                <th className="text-center px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Assessed
                </th>
                <th className="text-center px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Approved
                </th>
                <th className="text-center px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Avg Score
                </th>
                <th className="text-right px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {competencyBreakdown.map((cs: any) => {
                const percent =
                  cs.students > 0
                    ? Math.round((cs.assessed / cs.students) * 100)
                    : 0;
                return (
                  <tr
                    key={cs.courseId}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {cs.competencyName}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-600 dark:text-neutral-300">
                      {cs.students}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-600 dark:text-neutral-300">
                      {cs.assessed}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {cs.approved}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {cs.avgScorePercent !== null ? (
                        <span
                          className={`font-bold ${
                            cs.avgScorePercent >= 70
                              ? "text-emerald-600 dark:text-emerald-400"
                              : cs.avgScorePercent >= 50
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-[#c8102e] dark:text-[#ff4d6a]"
                          }`}
                        >
                          {Math.round(cs.avgScorePercent)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-28 bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#c8102e] to-[#ff4d6a] h-2 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 w-10 text-right">
                          {percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {competencyBreakdown.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400 dark:text-neutral-500"
                  >
                    No competency data matches the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assessor Performance Card */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">
            Assessor Performance & Grading Completion
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {assessorPerformance.map((a: any, i: number) => {
            const percent =
              a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0;
            return (
              <div
                key={i}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {a.assessorName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    {a.competencyName}
                    {a.className && <span> · Class: {a.className}</span>}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-36 bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-neutral-300 w-16 text-right font-mono">
                    {a.submitted} / {a.total}
                  </span>
                </div>
              </div>
            );
          })}
          {assessorPerformance.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 dark:text-neutral-500">
              No faculty assessors found for this filter scope.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
