"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Sparkles,
  ClipboardList,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";

const TRIAL_LETTERS = ["A", "B", "C", "D"];
const PASS_STATUS_ID = 53;

export default function SubmissionsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: allResults, isLoading } = useApiQuery(
    () =>
      user?.accountId ? api.competencyResults.getAll({}) : Promise.resolve([]),
    [user?.accountId],
  );

  const myResults =
    allResults?.filter((r) => r.assessorId === user?.accountId) || [];

  const resultsByStudent = myResults.reduce(
    (acc, result) => {
      const key = `${result.studentId}-${result.courseId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    },
    {} as Record<string, typeof myResults>,
  );

  const latestResults = Object.values(resultsByStudent).map((results) => {
    const sorted = results.sort(
      (a, b) =>
        new Date(b.gradedAt || b.createdAt).getTime() -
        new Date(a.gradedAt || a.createdAt).getTime(),
    );
    return {
      ...sorted[0],
      attemptCount: results.length,
      hasPassed: results.some((r) => r.resultStatusId === PASS_STATUS_ID),
    };
  });

  const counts = {
    passed: latestResults.filter((r) => r.hasPassed).length,
    failed: latestResults.filter((r) => !r.hasPassed && r.attemptCount < 4)
      .length,
    maxAttempts: latestResults.filter(
      (r) => !r.hasPassed && r.attemptCount >= 4,
    ).length,
    total: latestResults.length,
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading your assessment history...
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
                Grading Log
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <ClipboardList className="w-3.5 h-3.5" />
                {latestResults.length} Submissions Logged
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Assessment Submissions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Audit log of all student marks evaluated and submitted by your
              account. Inspect outcomes, trial numbers, and verification statuses.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Pass Rate
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 block mt-0.5">
              {counts.total > 0
                ? `${Math.round((counts.passed / counts.total) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Passed Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {counts.passed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Satisfied competency
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              In Progress / Retake
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
            {counts.failed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Pending further trials
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Max Attempts Reached
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#c8102e] dark:text-[#ff4d6a]">
            {counts.maxAttempts}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            4 trials exhausted
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Total Candidates
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10 flex items-center justify-center font-bold text-xs">
              ∑
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {counts.total}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Total evaluated
          </p>
        </Card>
      </div>

      {/* Submissions List Card */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">
            Submission Entries ({latestResults.length})
          </h2>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Click row to view or re-evaluate
          </span>
        </div>

        {latestResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
            No assessment submissions recorded yet for your account.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {latestResults.map((result) => {
              const isPassed = result.resultStatusId === PASS_STATUS_ID;
              const trial =
                TRIAL_LETTERS[Math.min(result.attemptCount - 1, 3)];
              const scorePercentage =
                result.scorePercentage !== undefined &&
                result.scorePercentage !== null
                  ? result.scorePercentage.toFixed(1)
                  : result.totalScore && result.maxScore
                    ? ((result.totalScore / result.maxScore) * 100).toFixed(1)
                    : "N/A";

              const initials = (result.studentName || "??")
                .split(" ")
                .filter(Boolean)
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={result.id}
                  onClick={() =>
                    router.push(`/assessor/assess/${result.studentId}`)
                  }
                  className="p-5 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-[#c8102e]/40 border border-transparent transition-colors">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors truncate">
                          {result.studentName || "Unknown Student"}
                        </h4>
                        <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
                          · {result.courseName || "Competency Module"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400 mt-1 flex-wrap font-mono">
                        <span>Trial {trial}</span>
                        {result.gradedAt && (
                          <>
                            <span>·</span>
                            <span>
                              {new Date(result.gradedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`text-xl font-extrabold tracking-tight ${
                        isPassed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[#c8102e] dark:text-[#ff4d6a]"
                      }`}
                    >
                      {scorePercentage}%
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isPassed
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                          : result.attemptCount >= 4
                            ? "bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-200 dark:border-red-900/30"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : result.attemptCount >= 4 ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {isPassed
                        ? "Passed"
                        : result.attemptCount >= 4
                          ? "Failed"
                          : "In Progress"}
                    </span>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-400 group-hover:bg-[#c8102e] group-hover:text-white transition-colors flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
