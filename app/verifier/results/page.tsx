"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  AlertCircle,
  Users,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  Filter,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { useCurrentRole } from "@/lib/auth-context";

export default function VerifierResultsPage() {
  const router = useRouter();
  const roleCtx = useCurrentRole();

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAssessor, setFilterAssessor] = useState("All");
  const [search, setSearch] = useState("");

  // Fetch competency results for the current cycle
  const {
    data: results,
    isLoading,
    error,
  } = useApiQuery(
    () =>
      roleCtx?.cycleId
        ? api.competencyResults.getAll({
            courseRoundId: Number(roleCtx.cycleId),
          })
        : Promise.resolve([]),
    [roleCtx?.cycleId],
  );

  // Get unique assessors for filter
  const assessors = useMemo(() => {
    if (!results) return [];
    const uniqueAssessors = new Map<number, string>();
    results.forEach((r) => {
      if (r.assessorId && r.assessorName) {
        uniqueAssessors.set(r.assessorId, r.assessorName);
      }
    });
    return Array.from(uniqueAssessors.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [results]);

  // Filter results
  const filtered = useMemo(() => {
    if (!results) return [];

    return results.filter((r) => {
      // Filter by status
      if (filterStatus !== "All" && r.resultStatusName !== filterStatus)
        return false;

      // Filter by assessor
      if (filterAssessor !== "All" && r.assessorId !== Number(filterAssessor))
        return false;

      // Search by student name, course name, or assessor name
      if (search.trim()) {
        const q = search.toLowerCase();
        const studentMatch = r.studentName?.toLowerCase().includes(q) || false;
        const courseMatch = r.courseName?.toLowerCase().includes(q) || false;
        const assessorMatch =
          r.assessorName?.toLowerCase().includes(q) || false;
        if (!studentMatch && !courseMatch && !assessorMatch) return false;
      }

      return true;
    });
  }, [results, filterStatus, filterAssessor, search]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!results)
      return { total: 0, passed: 0, notPassed: 0, assessorsCount: 0 };

    const uniqueAssessors = new Set(results.map((r) => r.assessorId));

    return {
      total: results.length,
      passed: results.filter((r) => r.resultStatusName === "Pass").length,
      notPassed: results.filter((r) => r.resultStatusName === "Not Pass")
        .length,
      assessorsCount: uniqueAssessors.size,
    };
  }, [results]);

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#c8102e] mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Error Loading Results
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
        {/* Decorative glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Internal Verifier QA
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Calendar className="w-3.5 h-3.5" />
                {roleCtx?.cycleName || "All Active Cycles"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assessment Quality Assurance
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Audit submitted marks, verify scoring integrity across assessor
              panels, and validate academic outcomes before publishing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              QA Audit Active
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Total Submissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {stats.total}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Evaluations recorded
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Passed Outcomes
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.passed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            {stats.total > 0
              ? `${Math.round((stats.passed / stats.total) * 100)}% pass rate`
              : "0%"}
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Requires Re-eval
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#c8102e] dark:text-[#ff4d6a]">
            {stats.notPassed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Not pass status
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Active Assessors
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {stats.assessorsCount}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
            Grading instructors
          </p>
        </Card>
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 w-4 h-4" />
            <Input
              placeholder="Search candidate, competency, or assessor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 text-xs sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filterAssessor}
              onValueChange={setFilterAssessor}
              disabled={isLoading}
            >
              <SelectTrigger className="w-48 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 font-semibold">
                <SelectValue placeholder="All Assessors" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Assessors</SelectItem>
                {assessors.map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
              disabled={isLoading}
            >
              <SelectTrigger className="w-36 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 font-semibold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Not Pass">Not Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results List */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Verification Queue ({filtered.length} Submissions)
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Click row to view & audit rubric
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
              <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                Loading verification records...
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">
              No Assessment Submissions Found
            </p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
              There are no submissions matching your current filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((result) => {
              const isPassed = result.resultStatusName === "Pass";

              const percentage =
                result.scorePercentage !== undefined &&
                result.scorePercentage !== null
                  ? result.scorePercentage.toFixed(1)
                  : result.totalScore && result.maxScore
                    ? ((result.totalScore / result.maxScore) * 100).toFixed(1)
                    : "N/A";

              return (
                <div
                  key={result.id}
                  onClick={() => router.push(`/verifier/review/${result.id}`)}
                  className="p-5 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-[#c8102e]/40 border border-transparent transition-colors">
                      #{result.id}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors truncate">
                          {result.studentName || `Student #${result.studentId}`}
                        </h4>
                        <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
                          · {result.courseName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400 mt-1 flex-wrap">
                        {result.assessorName && (
                          <span>Assessor: {result.assessorName}</span>
                        )}
                        <span>·</span>
                        <span>
                          {new Date(result.gradedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/5">
                    <div className="text-left sm:text-right">
                      <p
                        className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                          isPassed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-[#c8102e] dark:text-[#ff4d6a]"
                        }`}
                      >
                        {percentage}%
                      </p>
                      {result.totalScore !== undefined &&
                        result.maxScore !== undefined && (
                          <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                            {result.totalScore} / {result.maxScore} pts
                          </p>
                        )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isPassed
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                          : "bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-200 dark:border-red-900/30"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {isPassed ? "Pass" : "Not Pass"}
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
