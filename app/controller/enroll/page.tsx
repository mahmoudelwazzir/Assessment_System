"use client";

import { useState, useMemo } from "react";
import {
  Save,
  Loader2,
  Users,
  Sparkles,
  BookOpen,
  Calendar,
  CheckSquare,
  Square,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCourses,
  useCourseRounds,
  useStudents,
  useEnrollStudents,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function EnrollPage() {
  const { toast } = useToast();

  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: courseRounds, isLoading: loadingRounds } = useCourseRounds();
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { enroll, isLoading: isEnrolling } = useEnrollStudents();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set(),
  );
  const [filterCompetency, setFilterCompetency] = useState("All");

  // Get unique competencies from students
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

  // Filter students by competency
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (filterCompetency === "All") {
      return students;
    }
    return students.filter((s) => {
      if (!s.competencies || !Array.isArray(s.competencies)) return false;
      return s.competencies.some((c) => c.competencyName === filterCompetency);
    });
  }, [students, filterCompetency]);

  const isLoading = loadingCourses || loadingRounds || loadingStudents;

  const handleToggleStudent = (studentId: number) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(studentId)) {
      newSet.delete(studentId);
    } else {
      newSet.add(studentId);
    }
    setSelectedStudentIds(newSet);
  };

  const handleToggleAll = () => {
    if (selectedStudentIds.size === filteredStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      toast({
        title: "Discipline Required",
        description: "Please select a target competency course.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStudentIds.size === 0) {
      toast({
        title: "Candidates Required",
        description: "Please select at least one candidate for enrollment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await enroll(
        selectedCourseId,
        Array.from(selectedStudentIds),
        selectedCycleId || undefined,
      );

      toast({
        title: "Enrollment Complete",
        description: `Successfully enrolled ${result.enrolled.length} candidate(s) in ${result.competencyName}.`,
      });

      setSelectedStudentIds(new Set());
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description:
          error instanceof Error ? error.message : "Failed to enroll students",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading enrollment modules...
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

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Cohort Operations
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Users className="w-3.5 h-3.5" />
                {filteredStudents.length} Available Students
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Candidate Enrollment
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Assign students to technical competencies and assessment cycles.
              Selected candidates will become eligible for rubric evaluations.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Selected
            </span>
            <span className="text-2xl font-extrabold text-[#ff4d6a] block">
              {selectedStudentIds.size}
            </span>
          </div>
        </div>
      </div>

      {/* Target Configuration Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Enrollment Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1.5">
              Target Competency *
            </label>
            <Select
              value={selectedCourseId?.toString() || ""}
              onValueChange={(v) => setSelectedCourseId(Number(v))}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select competency..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {courses?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1.5">
              Cycle Round (Optional)
            </label>
            <Select
              value={selectedCycleId?.toString() || "none"}
              onValueChange={(v) =>
                setSelectedCycleId(v === "none" ? null : Number(v))
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select round..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none">No Specific Cycle</SelectItem>
                {courseRounds?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    Round {c.roundNumber} {c.isActive ? "(Active)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1.5">
              Filter Candidate Pool
            </label>
            <Select
              value={filterCompetency}
              onValueChange={setFilterCompetency}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedStudentIds.size}
            </span>{" "}
            of {filteredStudents.length} candidate(s) selected for enrollment
          </p>

          <Button
            onClick={handleEnroll}
            disabled={
              isEnrolling || !selectedCourseId || selectedStudentIds.size === 0
            }
            className="rounded-xl px-6 py-5 bg-[#c8102e] hover:bg-[#b00d27] text-white font-bold shadow-md shadow-[#c8102e]/20"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enrolling Candidates...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Confirm & Enroll ({selectedStudentIds.size})
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Candidate Selection List */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Available Candidates ({filteredStudents.length})
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
            className="rounded-xl text-xs font-bold"
          >
            {selectedStudentIds.size === filteredStudents.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
              No students found for this competency filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.has(student.id);
                const initials = student.fullNameEn
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-red-50/60 dark:bg-red-950/20"
                        : ""
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleStudent(student.id)}
                      className="rounded-md"
                    />

                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {student.fullNameEn}
                        </p>
                        {student.className && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400">
                            Class: {student.className}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5 truncate">
                        {student.email} · ID: {student.nationalId}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#c8102e] dark:text-[#ff4d6a]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
