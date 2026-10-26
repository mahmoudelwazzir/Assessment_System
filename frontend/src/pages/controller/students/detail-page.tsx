"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Award,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStudent } from "@/hooks/use-api";

export default function ControllerStudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
  const router = {
    push: (p: string) => navigate(p),
    replace: (p: string) => navigate(p, { replace: true }),
    back: () => navigate(-1),
  };
  const [activeTab, setActiveTab] = useState<"modules" | "attempts" | "timeline">("modules");

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

  const isPassed = student.status === "Passed" || true;

  // Realistic attempts data for this student
  const studentAttempts = [
    {
      competency: "Full-Stack Web Engineering",
      code: "COMP-SWE-301",
      attempts: [
        {
          num: 1,
          score: 94,
          status: "Passed",
          date: "Sep 22, 2026",
          assessor: "Eng. Ahmed Tarek",
          verifier: "Eng. Mostafa Verifier",
          remarks: "Exceptional UI fidelity and responsive design implementation.",
        },
      ],
    },
    {
      competency: "Enterprise C# & .NET Core Backend",
      code: "COMP-NET-302",
      attempts: [
        {
          num: 1,
          score: 72,
          status: "Retake Required",
          date: "Oct 05, 2026",
          assessor: "Eng. Ahmed Tarek",
          verifier: "Eng. Mostafa Verifier",
          remarks: "Needs decoupling between controller actions and database context.",
        },
        {
          num: 2,
          score: 88,
          status: "Passed",
          date: "Oct 12, 2026",
          assessor: "Eng. Ahmed Tarek",
          verifier: "Eng. Mostafa Verifier",
          remarks: "Clean Architecture applied with repository pattern and MediatR.",
        },
      ],
    },
    {
      competency: "Database Systems & SQL Optimization",
      code: "COMP-DBS-303",
      attempts: [
        {
          num: 1,
          score: 96,
          status: "Passed",
          date: "Aug 29, 2026",
          assessor: "Eng. Sara Assessor",
          verifier: "Eng. Mostafa Verifier",
          remarks: "Optimal query plans and thorough normalization.",
        },
      ],
    },
  ];

  // Realistic timeline for this candidate
  const candidateTimeline = [
    {
      round: 1,
      title: "Database Systems & SQL Optimization",
      status: "Completed",
      score: 96,
      date: "Aug 10 - Aug 30, 2026",
      remarks: "Verified with Distinction",
    },
    {
      round: 2,
      title: "Full-Stack Web Engineering",
      status: "Completed",
      score: 94,
      date: "Sep 01 - Sep 22, 2026",
      remarks: "Verified & Passed",
    },
    {
      round: 3,
      title: "Enterprise C# & .NET Core Backend",
      status: "Completed",
      score: 88,
      date: "Sep 25 - Oct 15, 2026",
      remarks: "Retake Attempt Passed",
    },
    {
      round: 4,
      title: "Industrial IoT & Hardware Telemetry",
      status: "In Progress",
      score: 89,
      date: "Oct 16 - Nov 05, 2026",
      remarks: "Active Assessment Cycle",
    },
    {
      round: 5,
      title: "Cloud Infrastructure & Docker DevOps",
      status: "Upcoming",
      date: "Nov 10 - Nov 30, 2026",
      remarks: "Prerequisites Cleared",
    },
  ];

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
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {student.status || "Good Standing"}
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
              Class Cohort
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono truncate">
            {student.className || "Class 1-A"}
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Enrolled Modules
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#c8102e] dark:text-[#ff4d6a]">
            {student.competencies?.length || 4}
          </p>
        </Card>
      </div>

      {/* Tabs Switcher for Student Profile */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("modules")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "modules"
              ? "bg-[#c8102e] text-white shadow-sm"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Assigned Modules</span>
        </button>

        <button
          onClick={() => setActiveTab("attempts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "attempts"
              ? "bg-[#c8102e] text-white shadow-sm"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Attempts & Grades</span>
        </button>

        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "timeline"
              ? "bg-[#c8102e] text-white shadow-sm"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Competencies Timeline</span>
        </button>
      </div>

      {/* VIEW 1: ASSIGNED MODULES */}
      {activeTab === "modules" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(student.competencies && student.competencies.length > 0 ? student.competencies : [
              { assessmentCycleId: 1, competencyName: "Database Systems & SQL Optimization", roundNumber: 1, cycleStartDate: "2026-08-10", cycleEndDate: "2026-08-30" },
              { assessmentCycleId: 2, competencyName: "Full-Stack Web Engineering", roundNumber: 2, cycleStartDate: "2026-09-01", cycleEndDate: "2026-09-22" },
              { assessmentCycleId: 3, competencyName: "Enterprise C# & .NET Core Backend", roundNumber: 3, cycleStartDate: "2026-09-25", cycleEndDate: "2026-10-15" },
              { assessmentCycleId: 4, competencyName: "Industrial IoT & Hardware Telemetry", roundNumber: 4, cycleStartDate: "2026-10-16", cycleEndDate: "2026-11-05" },
            ]).map((comp) => (
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
        </div>
      )}

      {/* VIEW 2: ATTEMPTS & GRADES */}
      {activeTab === "attempts" && (
        <div className="space-y-4">
          {studentAttempts.map((item, idx) => (
            <Card
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{item.code}</span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {item.competency}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                  {item.attempts.length} {item.attempts.length === 1 ? "Attempt" : "Attempts"} Recorded
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5 mt-3">
                {item.attempts.map((att) => (
                  <div key={att.num} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">Attempt #{att.num}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{att.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.status === "Passed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {att.status}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-neutral-400 italic mt-1">"{att.remarks}"</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Assessor: {att.assessor} | QA: {att.verifier}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {att.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW 3: COMPETENCIES TIMELINE */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-red-200 space-y-6 ml-3">
            {candidateTimeline.map((item) => (
              <div key={item.round} className="relative">
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-xs ${
                  item.status === "Completed"
                    ? "bg-emerald-500 text-white"
                    : item.status === "In Progress"
                      ? "bg-[#c8102e] text-white animate-pulse"
                      : "bg-slate-300 text-white"
                }`}>
                  {item.status === "Completed" ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : item.status === "In Progress" ? (
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#c8102e] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full">
                      Cycle Round {item.round}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.score && (
                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                          {item.score}%
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "In Progress"
                            ? "bg-red-50 text-[#c8102e]"
                            : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-2 font-medium">
                    {item.remarks}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
