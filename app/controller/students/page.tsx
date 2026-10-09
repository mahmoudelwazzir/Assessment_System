"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Users,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudents } from "@/hooks/use-api";

export default function ControllerStudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterCompetency, setFilterCompetency] = useState("All");

  const { data: students, isLoading, error } = useStudents();

  // Extract unique competencies from students
  const competencies = useMemo(() => {
    if (!students) return ["All"];
    const uniqueCompetencies = new Set(
      students
        .filter((s) => s.competencies && Array.isArray(s.competencies))
        .flatMap((s) => s.competencies!.map((c) => c.competencyName)),
    );
    return [
      "All",
      ...Array.from(uniqueCompetencies).sort((a, b) => a.localeCompare(b)),
    ];
  }, [students]);

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      if (filterCompetency !== "All") {
        if (!s.competencies || !Array.isArray(s.competencies)) return false;
        const hasCompetency = s.competencies.some(
          (c) => c.competencyName === filterCompetency,
        );
        if (!hasCompetency) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.fullNameEn.toLowerCase().includes(q) ||
          s.fullNameAr?.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.nationalId.includes(q)
        );
      }
      return true;
    });
  }, [students, search, filterCompetency]);

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <p className="text-[#c8102e] font-bold text-lg mb-2">
            Failed to Load Students
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

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Student Registry
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5" />
                Technical Academy Cohorts
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Student Directory & Performance
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Comprehensive index of enrolled students across all disciplines.
              Inspect candidate profiles, active competencies, and assessment
              statuses.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e]/20 text-[#ff4d6a] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                Total Enrolled
              </span>
              <span className="text-2xl font-extrabold text-white block">
                {students?.length || 0} Students
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or national ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 text-xs sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filterCompetency}
              onValueChange={setFilterCompetency}
              disabled={isLoading}
            >
              <SelectTrigger className="w-52 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 font-semibold">
                <SelectValue placeholder="All Competencies" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {competencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All Competencies" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Enrolled Students ({filtered.length})
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Select student to inspect academic record
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
              <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                Loading students registry...
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">
              No Students Found
            </p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
              No student records matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((student) => {
              const initials = student.fullNameEn
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isPassed = student.status === "Passed";
              const isNotPassed = student.status === "Not Passed";

              return (
                <div
                  key={student.id}
                  onClick={() =>
                    router.push(`/controller/students/${student.id}`)
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
                          {student.fullNameEn}
                        </h4>
                        {student.className && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                            Class: {student.className}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400 mt-1 flex-wrap font-mono">
                        <span>{student.email}</span>
                        <span>·</span>
                        <span>National ID: {student.nationalId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {student.status && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isPassed
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                            : isNotPassed
                              ? "bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-200 dark:border-red-900/30"
                              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isNotPassed ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {student.status}
                      </span>
                    )}

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
