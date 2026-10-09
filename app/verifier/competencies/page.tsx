"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, useCreateCourse } from "@/hooks/use-api";
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom";
import type { Course } from "@/lib/api-client";

export default function VerifierCompetenciesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const { data: courses, isLoading, error, refetch } = useCourses();
  const { deleteCourse, isLoading: isDeleting } = useCreateCourse();

  const classes = useMemo(() => {
    if (!courses) return ["All"];
    const uniqueClasses = new Set(
      courses.map((c) => c.levelName).filter((l): l is string => Boolean(l)),
    );
    return [
      "All",
      ...Array.from(uniqueClasses).sort((a, b) => {
        const order = ["Juniors", "Wheelers", "Seniors"];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      }),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass =
        selectedClass === "All" || course.levelName === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [courses, searchQuery, selectedClass]);

  const handleEdit = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    router.push(`/verifier/competencies/edit/${course.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete.id);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete competency:", error);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
    }
  };

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

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Curriculum Governance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <BookOpen className="w-3.5 h-3.5" />
                {courses?.length || 0} Modules Cataloged
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Competency Specifications
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Define curricula rubrics, learning outcomes, and technical
              milestones. Verifiers can review and maintain all standard courses.
            </p>
          </div>

          <Button
            onClick={() => router.push("/verifier/competencies/add")}
            className="rounded-2xl px-5 py-6 bg-gradient-to-r from-[#c8102e] to-[#e8192f] hover:from-[#b00d27] hover:to-[#c8102e] text-white font-bold shadow-lg shadow-[#c8102e]/25 shrink-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Competency
          </Button>
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
              value={selectedClass}
              onValueChange={setSelectedClass}
              disabled={isLoading}
            >
              <SelectTrigger className="w-48 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#16161f] border-slate-200/80 dark:border-white/10 font-semibold">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All Classes" : c}
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
            Catalog Directory ({filteredCourses.length})
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Hover to edit or remove modules
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
          ) : filteredCourses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
              No competencies match your search criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#c8102e] dark:group-hover:text-[#ff4d6a] transition-colors">
                          {course.title}
                        </h3>
                        {course.levelName && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/10">
                            <GraduationCap className="w-3 h-3 text-amber-500" />
                            {course.levelName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {course.description ||
                          "Standard technical competency specification."}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-neutral-500">
                        {course.durationHours && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.durationHours} Hours
                          </span>
                        )}
                        <span>·</span>
                        <span className="font-mono">ID: #{course.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(e, course)}
                      className="rounded-xl h-9 text-xs font-bold border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:text-white hover:bg-[#c8102e] hover:border-[#c8102e]"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, course)}
                      className="rounded-xl h-9 text-xs font-bold border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Dialog */}
      <AlertDialogCustom
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Competency Module"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? All linked sub-tasks will be affected.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Module"}
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
