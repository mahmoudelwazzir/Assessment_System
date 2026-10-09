"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom";
import {
  useCourses,
  useCreateCourse,
  useCourseRoundAssignments,
} from "@/hooks/use-api";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api-client";
import type { GradeLevel } from "@/lib/types";

const GRADE_LEVELS: GradeLevel[] = ["Junior", "Wheeler", "Senior"];

// Map grade levels to LevelStatusId (based on typical database schema)
const GRADE_LEVEL_TO_ID: Record<GradeLevel, number> = {
  Junior: 1,
  Wheeler: 2,
  Senior: 3,
};

interface Subtask {
  id?: number; // Add ID for existing subtasks
  name: string;
  grade: number;
}

interface Task {
  id?: number; // Add ID for existing tasks
  name: string;
  subtasks: Subtask[];
}

export default function VerifierEditCompetencyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = Number(params.id);

  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: assignments, isLoading: loadingAssignments } =
    useCourseRoundAssignments(id);
  const { update, isLoading: isUpdating } = useCreateCourse();

  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Junior");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState(40);
  const [tasks, setTasks] = useState<Task[]>([
    { name: "", subtasks: [{ name: "", grade: 0 }] },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [deletedMaterialIds, setDeletedMaterialIds] = useState<number[]>([]);

  const course = courses?.find((c) => c.id === id);
  const isSubmitting = isUpdating;

  // Load course data
  useEffect(() => {
    if (course) {
      setName(course.title);
      setDescription(course.description);
      setDurationHours(course.durationHours || 40);
      // Note: gradeLevel would need to be derived from course.levelName
      if (course.levelName) {
        setGradeLevel(course.levelName as GradeLevel);
      }
    }
  }, [course]);

  // Load tasks from CourseRoundAssignments
  useEffect(() => {
    if (assignments && assignments.length > 0) {
      setIsLoadingTasks(true);
      try {
        console.log("Loading assignments:", assignments);

        // Each assignment represents a task
        // The description contains subtask breakdown
        const loadedTasks: Task[] = assignments.map((assignment) => {
          // Parse subtask breakdown from description
          // Format: "Subtasks: name1: X points, name2: Y points"
          const subtasks: Subtask[] = [];

          if (assignment.description) {
            const subtaskMatch =
              assignment.description.match(/Subtasks:\s*(.+)/);
            if (subtaskMatch) {
              const subtaskStr = subtaskMatch[1];
              const parts = subtaskStr.split(/,\s*/);

              for (const part of parts) {
                const match = part.match(
                  /^(.+?):\s*(\d+(?:\.\d+)?)\s*points?$/,
                );
                if (match) {
                  subtasks.push({
                    id: undefined, // Subtasks are embedded in assignment description
                    name: match[1].trim(),
                    grade: Number.parseFloat(match[2]),
                  });
                }
              }
            }
          }

          return {
            id: assignment.id,
            name: assignment.title,
            subtasks: subtasks.length > 0 ? subtasks : [{ name: "", grade: 0 }],
          };
        });

        console.log("Loaded tasks structure:", loadedTasks);

        if (loadedTasks.length > 0) {
          setTasks(loadedTasks);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    }
  }, [assignments]);

  const handleAddTask = () => {
    setTasks([...tasks, { name: "", subtasks: [{ name: "", grade: 0 }] }]);
  };

  const handleRemoveTask = (taskIndex: number) => {
    const taskToRemove = tasks[taskIndex];
    // Track assignment for deletion
    if (taskToRemove.id) {
      setDeletedMaterialIds((prev) => [...prev, taskToRemove.id!]);
    }
    setTasks(tasks.filter((_, i) => i !== taskIndex));
  };

  const handleTaskNameChange = (taskIndex: number, value: string) => {
    const updated = [...tasks];
    updated[taskIndex].name = value;
    setTasks(updated);
  };

  const handleAddSubtask = (taskIndex: number) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks.push({ name: "", grade: 0 });
    setTasks(updated);
  };

  const handleRemoveSubtask = (taskIndex: number, subtaskIndex: number) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks = updated[taskIndex].subtasks.filter(
      (_, i) => i !== subtaskIndex,
    );
    setTasks(updated);
  };

  const handleSubtaskNameChange = (
    taskIndex: number,
    subtaskIndex: number,
    value: string,
  ) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks[subtaskIndex].name = value;
    setTasks(updated);
  };

  const handleSubtaskGradeChange = (
    taskIndex: number,
    subtaskIndex: number,
    value: string,
  ) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks[subtaskIndex].grade = parseFloat(value) || 0;
    setTasks(updated);
  };

  const getTaskTotal = (task: Task) => {
    return task.subtasks.reduce((sum, st) => sum + st.grade, 0);
  };

  const isTaskValid = (task: Task) => {
    // Check if total equals 100
    if (getTaskTotal(task) !== 100) return false;
    // Check if any subtask has 0 or negative points
    if (task.subtasks.some((st) => st.grade <= 0)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all tasks
    const invalidTasks = tasks.filter((task) => !isTaskValid(task));
    if (invalidTasks.length > 0) {
      setErrorMessage(
        "Each task's subtasks must sum to exactly 100 and all subtasks must have points greater than 0.",
      );
      setShowAlert(true);
      return;
    }

    try {
      // Step 1: Update the course
      await update(id, {
        title: name,
        description: description,
        durationHours: durationHours,
        levelStatusId: GRADE_LEVEL_TO_ID[gradeLevel],
      });

      // Step 2: Delete removed assignments
      for (const assignmentId of deletedMaterialIds) {
        try {
          await api.courseRoundAssignments.delete(assignmentId);
        } catch (error) {
          console.error(`Failed to delete assignment ${assignmentId}:`, error);
        }
      }

      // Step 3: Update/Create assignments (CourseRoundAssignments)
      for (const task of tasks) {
        const totalGrade = getTaskTotal(task);

        // Create a description that includes subtask breakdown
        const subtaskBreakdown = task.subtasks
          .map((st) => `${st.name}: ${st.grade} points`)
          .join(", ");

        if (!task.id) {
          // New task - create assignment
          const existingAssignment = assignments?.find(
            (a) => a.title === task.name,
          );
          const deadline =
            existingAssignment?.deadline ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          await api.courseRoundAssignments.create({
            title: task.name,
            description: `Subtasks: ${subtaskBreakdown}`,
            deadline: deadline,
            totalGrade: totalGrade,
            courseId: id,
            instructorId: user?.accountId || 0,
          });
        } else {
          // Existing task - update assignment
          const existingAssignment = assignments?.find((a) => a.id === task.id);
          await api.courseRoundAssignments.update(task.id, {
            title: task.name,
            description: `Subtasks: ${subtaskBreakdown}`,
            totalGrade: totalGrade,
            deadline: existingAssignment?.deadline,
          });
        }
      }

      router.push("/verifier/competencies");
    } catch (error) {
      console.error("Error updating competency:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update competency",
      );
      setShowAlert(true);
    }
  };

  if (loadingCourses || loadingAssignments || isLoadingTasks) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] p-12 flex flex-col items-center justify-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#c8102e]" />
          <span className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading competency parameters...
          </span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] p-8 text-center shadow-sm">
          <p className="text-red-500 font-semibold mb-2">Competency record not found</p>
          <Button onClick={() => router.back()} variant="outline" className="rounded-xl mt-2">
            Return to Competencies
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border border-white/10 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-300 hover:text-white hover:bg-white/10 mb-2 -ml-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Button>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
              Curriculum Revision
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Edit Competency
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Modify course details, target standards, and calibrate subtask grading distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Competency Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Structural Engineering"
                required
                className="mt-2 rounded-xl border-slate-200 dark:border-white/10 focus-visible:ring-[#c8102e]"
              />
            </div>

            {/* Grade Level */}
            <div>
              <Label htmlFor="gradeLevel" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Target Grade Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={gradeLevel}
                onValueChange={(value) => setGradeLevel(value as GradeLevel)}
              >
                <SelectTrigger className="mt-2 rounded-xl border-slate-200 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {GRADE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description & Objectives <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the core learning outcomes and competency requirements..."
              required
              rows={4}
              className="mt-2 rounded-xl border-slate-200 dark:border-white/10 focus-visible:ring-[#c8102e]"
            />
          </div>

          {/* Duration Hours */}
          <div>
            <Label htmlFor="duration" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Duration (Hours) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              placeholder="40"
              required
              min="1"
              className="mt-2 max-w-xs rounded-xl border-slate-200 dark:border-white/10 focus-visible:ring-[#c8102e]"
            />
          </div>

          {/* Tasks Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assessment Tasks & Subtasks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Each task represents an assignment unit. Subtask grades must sum to exactly 100 points.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="rounded-xl border-slate-200 dark:border-white/10 hover:border-[#c8102e] hover:text-[#c8102e]"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Task
              </Button>
            </div>

            <div className="space-y-4">
              {tasks.map((task, taskIndex) => {
                const total = getTaskTotal(task);
                const isValid = isTaskValid(task);
                return (
                  <div
                    key={taskIndex}
                    className={`rounded-2xl border transition-all p-5 ${
                      !isValid && total > 0
                        ? "border-red-500/50 bg-red-50/10 dark:bg-red-950/10"
                        : "border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#c8102e]/10 text-[#c8102e] font-bold text-xs flex items-center justify-center shrink-0">
                        {taskIndex + 1}
                      </div>
                      <Input
                        value={task.name}
                        onChange={(e) =>
                          handleTaskNameChange(taskIndex, e.target.value)
                        }
                        placeholder={`Task ${taskIndex + 1} title`}
                        required
                        className="flex-1 rounded-xl bg-white dark:bg-[#121217] border-slate-200 dark:border-white/10"
                      />
                      {tasks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTask(taskIndex)}
                          className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="pl-4 sm:pl-10 space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Subtasks & Grading Rubric
                      </div>
                      {task.subtasks.map((subtask, subtaskIndex) => (
                        <div key={subtaskIndex} className="flex items-center gap-2">
                          <Input
                            value={subtask.name}
                            onChange={(e) =>
                              handleSubtaskNameChange(
                                taskIndex,
                                subtaskIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Subtask ${subtaskIndex + 1} name`}
                            required
                            className="flex-1 rounded-xl bg-white dark:bg-[#121217] border-slate-200 dark:border-white/10 text-sm"
                          />
                          <div className="relative w-28 shrink-0">
                            <Input
                              type="number"
                              value={subtask.grade}
                              onChange={(e) =>
                                handleSubtaskGradeChange(
                                  taskIndex,
                                  subtaskIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="Grade"
                              required
                              min="0.01"
                              max="100"
                              step="0.01"
                              className="w-full pr-7 rounded-xl bg-white dark:bg-[#121217] border-slate-200 dark:border-white/10 text-sm font-semibold"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                              pts
                            </span>
                          </div>
                          {task.subtasks.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveSubtask(taskIndex, subtaskIndex)
                              }
                              className="rounded-xl text-slate-400 hover:text-red-500 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddSubtask(taskIndex)}
                          className="w-fit text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#c8102e] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add Subtask
                        </Button>

                        <div
                          className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                            isValid
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : total > 0
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                : "bg-slate-100 dark:bg-white/5 text-slate-500"
                          }`}
                        >
                          Total: {total.toFixed(2)} / 100 pts
                          {!isValid && total > 0 && " (Must equal 100)"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
            <Button
              type="submit"
              className="bg-[#c8102e] hover:bg-[#a00d24] text-white shadow-lg shadow-[#c8102e]/20 rounded-xl px-6 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Competency...
                </>
              ) : (
                "Update Competency"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-xl border-slate-200 dark:border-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <AlertDialogCustom
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={errorMessage.includes("sum") ? "Invalid Task Grades" : "Validation Error"}
        description={
          errorMessage ||
          "Each task's subtasks must sum to exactly 100. Please check your task grades and try again."
        }
      />
    </div>
  );
}
