"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  BookOpen,
  ClipboardList,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStudent } from "@/hooks/use-api";

export default function ControllerStudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();

  const {
    data: student,
    isLoading,
    error,
  } = useStudent(studentId ? Number.parseInt(studentId, 10) : null);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading candidate dossier...
          </span>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-3xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <p className="text-[#c8102e] font-bold text-lg mb-2">
            Candidate Profile Not Found
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            {error?.message || "Student record could not be loaded."}
          </p>
          <button
            onClick={() => router.push("/controller/students")}
            className="text-xs font-bold text-slate-700 dark:text-neutral-300 hover:text-[#c8102e] transition-colors"
          >
            ← Back to Student Directory
          </button>
        </Card>
      </div>
    );
  }

  const initials = student.fullNameEn
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isPassed = student.status === "Passed";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <button
          onClick={() => router.push("/controller/students")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students Directory
        </button>
      </div>

      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-[#ff4d6a] font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-inner">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Candidate Dossier
                </span>
                {student.className && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    {student.className}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {student.fullNameEn}
              </h1>

              {student.fullNameAr && (
                <p className="text-xs text-slate-300 font-medium">
                  {student.fullNameAr}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Enrollment Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1.5 ${
                isPassed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-500/20 text-slate-200 border border-slate-500/30"
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              {student.status || "Active Candidate"}
            </span>
          </div>
        </div>
      </div>

      {/* Info Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              National ID
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono truncate">
            {student.nationalId}
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Email Address
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono truncate">
            {student.email}
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Phone Number
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono truncate">
            {student.phone || "Not recorded"}
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Competencies
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#c8102e] dark:text-[#ff4d6a]">
            {student.competencies?.length || 0}
          </p>
        </Card>
      </div>

      {/* Enrolled Competencies Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Assigned Technical Modules & Cycles
        </h2>

        {!student.competencies || student.competencies.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">
              No Competencies Enrolled
            </p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
              Enroll this candidate in courses through the Cohort Enrollment portal.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.competencies.map((comp) => (
              <Card
                key={comp.assessmentCycleId}
                className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {comp.competencyName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                      Cycle Round {comp.roundNumber ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-neutral-300">
                  {comp.cycleStartDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 dark:text-neutral-500">
                        Start Date:
                      </span>
                      <span className="font-mono font-semibold">
                        {new Date(comp.cycleStartDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {comp.cycleEndDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 dark:text-neutral-500">
                        End Date:
                      </span>
                      <span className="font-mono font-semibold">
                        {new Date(comp.cycleEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
