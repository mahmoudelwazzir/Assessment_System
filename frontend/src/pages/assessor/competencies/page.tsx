"use client";

import { useState, useMemo } from "react";
import {
  Loader2,
  Search,
  BookOpen,
  Sparkles,
  GraduationCap,
  Clock,
  Layers,
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
import { useCourses } from "@/hooks/use-api";

export default function AssessorCompetenciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");

  const { data: courses, isLoading, error } = useCourses();

  const grades = useMemo(() => {
    if (!courses) return ["All"];
    const uniqueGrades = new Set(
      courses.map((c) => c.gradeName).filter((g): g is string => Boolean(g)),
    );
    return [
      "All",
      ...Array.from(uniqueGrades).sort((a, b) => a.localeCompare(b)),
    ];
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade =
        selectedGrade === "All" || c.gradeName === selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }, [courses, searchQuery, selectedGrade]);

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <p className="text-[#c8102e] font-bold text-lg mb-2">
            Failed to Load Competencies
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
                Curriculum Framework
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <BookOpen className="w-3.5 h-3.5" />
                {courses?.length || 0} Modules Total
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Technical Competencies
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Academic course catalog, competency rubric specifications, and
              industrial learning outcomes taught across Elsewedy Academy.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Filtered
            </span>
            <span className="text-2xl font-extrabold text-white block mt-0.5">
              {filtered.length} Modules
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 w-4 h-4" />
            <Input
              placeholder="Search competencies by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 text-xs sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              disabled={isLoading}
            >
              <SelectTrigger className="w-48 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 font-semibold">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g === "All" ? "All Grades" : g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Competencies List */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Catalog Directory ({filtered.length})
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Official curriculum modules
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
                <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                  Loading competencies catalog...
                </span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
              No competencies match your search criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="p-5 sm:px-6 sm:py-5 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors">
                        {course.title}
                      </h3>
                      {course.gradeName && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10">
                          <GraduationCap className="w-3 h-3 text-amber-500" />
                          {course.gradeName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {course.description ||
                        "Standard technical curriculum competency program."}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-neutral-500">
                      {course.durationHours && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.durationHours} Training Hours
                        </span>
                      )}
                      <span>·</span>
                      <span className="font-mono">Module #{course.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
