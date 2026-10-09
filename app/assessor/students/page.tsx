"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useAuth, useCurrentRole } from "@/lib/auth-context";
import { useStudentsByAssessor } from "@/hooks/use-api";

export default function AssessorStudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const roleCtx = useCurrentRole();

  const assessorId = user?.accountId || null;
  const {
    data: students,
    isLoading,
    error,
  } = useStudentsByAssessor(assessorId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "assessed" | "pending">("all");

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    let list = students;

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
  }, [students, searchQuery, filterStatus]);

  const assessedCount = useMemo(() => {
    if (!students) return 0;
    return students.filter(
      (s) => s.status === "Passed" || s.status === "Not Passed",
    ).length;
  }, [students]);

  const totalCount = students?.length || 0;
  const pendingCount = totalCount - assessedCount;

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <p className="text-[#c8102e] font-bold text-lg mb-2">
            Failed to Load Students
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
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

      {/* Control Bar: Search and Status Filters */}
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "all"
                ? "bg-white dark:bg-[#121218] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "pending"
                ? "bg-white dark:bg-[#121218] text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("assessed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "assessed"
                ? "bg-white dark:bg-[#121218] text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Assessed ({assessedCount})
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
