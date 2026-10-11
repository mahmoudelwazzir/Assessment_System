"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Loader2,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  GraduationCap,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth, useCurrentRole } from "@/lib/auth-context";
import { useStudentsByAssessor, useStudents } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { ALL_STUDENT_DOSSIERS } from "@/lib/student-dossier-data";
import type { Student } from "@/lib/api-client";

// Guaranteed Fallback Roster from Elsewedy Candidate Dossiers
const FALLBACK_STUDENT_ROSTER: Student[] = Object.values(ALL_STUDENT_DOSSIERS).map((d) => ({
  id: d.id,
  nationalId: d.nationalId,
  email: d.email,
  phone: d.phone,
  fullNameEn: d.fullNameEn,
  fullNameAr: d.fullNameAr,
  className: "Class 1-A (Software Systems)",
  status: d.overallPercentage >= 80 ? "Passed" : "Pending",
  isActive: true,
  competencies: d.competencies.map((c) => ({
    courseId: 1,
    competencyName: c.nameEn,
    assessmentCycleId: 1,
  })),
}));

export default function AssessorStudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const roleCtx = useCurrentRole();

  const assessorId = user?.accountId || 1;

  // Query assigned candidates from API
  const {
    data: assignedStudents,
    isLoading: isLoadingAssigned,
    refetch: refetchAssigned,
  } = useStudentsByAssessor(assessorId);

  // Query all cohort students from API
  const {
    data: allCohortStudents,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useStudents();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "assessed" | "pending">("all");
  const [viewScope, setViewScope] = useState<"assigned" | "cohort">("cohort");
  const [localEvals, setLocalEvals] = useState<Record<string, any>>({});

  // Load locally saved assessor evaluations to reflect immediate submissions
  useEffect(() => {
    try {
      const raw = localStorage.getItem("assessor_evaluations");
      if (raw) {
        setLocalEvals(JSON.parse(raw));
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  // Compute resolved students list with fallbacks
  const resolvedStudents = useMemo(() => {
    let source: Student[] = [];

    if (viewScope === "assigned" && assignedStudents && assignedStudents.length > 0) {
      source = assignedStudents;
    } else if (allCohortStudents && allCohortStudents.length > 0) {
      source = allCohortStudents;
    } else {
      source = FALLBACK_STUDENT_ROSTER;
    }

    // Merge locally recorded evaluations
    return source.map((s) => {
      const stored = localEvals[s.id.toString()];
      if (stored) {
        return {
          ...s,
          status: stored.passed ? "Passed" : "Not Passed",
        };
      }
      return s;
    });
  }, [viewScope, assignedStudents, allCohortStudents, localEvals]);

  const isLoading = isLoadingAssigned && isLoadingAll && resolvedStudents.length === 0;

  const filteredStudents = useMemo(() => {
    let list = resolvedStudents;

    // Filter by status tab
    if (filterStatus === "assessed") {
      list = list.filter(
        (s) => s.status === "Passed" || s.status === "Not Passed",
      );
    } else if (filterStatus === "pending") {
      list = list.filter(
        (s) => s.status !== "Passed" && s.status !== "Not Passed",
      );
    }

    // Filter by search query
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (s) =>
        s.fullNameEn.toLowerCase().includes(q) ||
        s.fullNameAr?.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.nationalId.includes(q),
    );
  }, [resolvedStudents, searchQuery, filterStatus]);

  const assessedCount = useMemo(() => {
    return resolvedStudents.filter(
      (s) => s.status === "Passed" || s.status === "Not Passed",
    ).length;
  }, [resolvedStudents]);

  const totalCount = resolvedStudents.length;
  const pendingCount = totalCount - assessedCount;

  const handleRefresh = () => {
    refetchAssigned();
    refetchAll();
    try {
      const raw = localStorage.getItem("assessor_evaluations");
      if (raw) setLocalEvals(JSON.parse(raw));
    } catch {}

    toast({
      title: "Student Roster Synchronized",
      description: `Refreshed candidate pool: ${resolvedStudents.length} candidates available for evaluation.`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Technical Assessor Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <BookOpen className="w-3.5 h-3.5" />
                {roleCtx?.cycleName || "Assessment Cycle"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Candidate Evaluations
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Review and record competency rubric marks for assigned candidates.
              All submissions are verified against industrial standards.
            </p>

            {/* Scope Badges */}
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              {roleCtx?.competency && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/15">
                  <Award className="w-3.5 h-3.5 text-[#ff4d6a]" />
                  {roleCtx.competency}
                </span>
              )}
              {roleCtx?.grade && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/15">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  {roleCtx.grade}
                </span>
              )}
              {roleCtx?.classGroup && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#c8102e]/30 text-white text-xs font-bold border border-[#c8102e]/50">
                  Class {roleCtx.classGroup}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-center">
            <div className="px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total
              </span>
              <span className="text-2xl font-extrabold text-white mt-1 block">
                {totalCount}
              </span>
            </div>
            <div className="px-3 border-x border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Assessed
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {assessedCount}
              </span>
            </div>
            <div className="px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Pending
              </span>
              <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
                {pendingCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Scope Switcher, Sync and Status Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 w-4 h-4" />
            <Input
              placeholder="Search by student name, email, or national ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-11 rounded-2xl bg-white dark:bg-[#121218] border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-[#c8102e]/30"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Scope Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <button
                onClick={() => setViewScope("cohort")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewScope === "cohort"
                    ? "bg-white dark:bg-[#121218] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-neutral-400 hover:text-white"
                }`}
              >
                Cohort ({resolvedStudents.length})
              </button>
              <button
                onClick={() => setViewScope("assigned")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewScope === "assigned"
                    ? "bg-white dark:bg-[#121218] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-neutral-400 hover:text-white"
                }`}
              >
                Assigned to Me ({assignedStudents?.length || 0})
              </button>
            </div>

            {/* Sync Candidates Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#c8102e]" />
              <span>Reload Data</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 self-start">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-white dark:bg-[#121218] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Candidates ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "pending"
                ? "bg-white dark:bg-[#121218] text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Pending Evaluation ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("assessed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "assessed"
                ? "bg-white dark:bg-[#121218] text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Assessed & Graded ({assessedCount})
          </button>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
            <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Loading assigned candidates...
            </span>
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="p-12 text-center rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <Users className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No Students Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? "No student matches the search criteria. Try a different query."
              : "No students are assigned to you for this cycle or filter."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStudents.map((student) => {
            const isAssessed =
              student.status === "Passed" || student.status === "Not Passed";
            const isPassed = student.status === "Passed";

            return (
              <Card
                key={student.id}
                onClick={() => router.push(`/assessor/assess/${student.id}`)}
                className="group p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#c8102e]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Student Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#c8102e]/10 to-[#ff4d6a]/15 text-[#c8102e] dark:text-[#ff4d6a] border border-[#c8102e]/20 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {student.fullNameEn.charAt(0).toUpperCase()}
                    </div>

                    {/* Status Badge */}
                    {isAssessed ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isPassed
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                            : "bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-200 dark:border-red-900/30"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {student.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Student Details */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors line-clamp-1">
                    {student.fullNameEn}
                  </h3>
                  {student.fullNameAr && (
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5 line-clamp-1">
                      {student.fullNameAr}
                    </p>
                  )}

                  <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-neutral-400 font-mono">
                    <p className="truncate">{student.email}</p>
                    <p>ID: {student.nationalId}</p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors">
                    {isAssessed ? "Review Rubric" : "Start Evaluation"}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300 group-hover:bg-[#c8102e] group-hover:text-white transition-colors flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
