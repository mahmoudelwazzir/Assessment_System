"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useCreateCourse } from "@/hooks/use-api";
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
  name: string;
  grade: number;
}

interface Task {
  name: string;
  subtasks: Subtask[];
}

export default function VerifierAddCompetencyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { create, isLoading: isCreating } = useCreateCourse();

  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Junior");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState(40);
  const [tasks, setTasks] = useState<Task[]>([
    { name: "", subtasks: [{ name: "", grade: 0 }] },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = isCreating;

  const handleAddTask = () => {
    setTasks([...tasks, { name: "", subtasks: [{ name: "", grade: 0 }] }]);
  };

  const handleRemoveTask = (taskIndex: number) => {
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
      // Step 1: Create competency (course)
      const course = await create({
        title: name,
        description: description,
        durationHours: durationHours,
        levelStatusId: GRADE_LEVEL_TO_ID[gradeLevel],
      });

      if (!course?.id) {
        throw new Error("Failed to create course");
      }

      // Step 2: Create assignments (CourseRoundAssignments) for each task
      // Each task becomes an assignment with the total grade being sum of subtasks
      const now = new Date();
      const defaultDeadline = new Date(now);
      defaultDeadline.setMonth(defaultDeadline.getMonth() + 1); // Default 1 month from now

      for (const task of tasks) {
        const totalGrade = getTaskTotal(task);

        // Create a description that includes subtask breakdown
        const subtaskBreakdown = task.subtasks
          .map((st) => `${st.name}: ${st.grade} points`)
          .join(", ");

        await api.courseRoundAssignments.create({
          title: task.name,
          description: `Subtasks: ${subtaskBreakdown}`,
          deadline: defaultDeadline.toISOString(),
          totalGrade: totalGrade,
          courseId: course.id,
          instructorId: user?.accountId || 0,
        });
      }

      router.push("/verifier/competencies");
    } catch (error) {
      console.error("Error creating competency:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create competency",
      );
      setShowAlert(true);
    }
  };

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
              Curriculum Authoring
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Add New Competency
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Define competency parameters, performance objectives, and breakdown tasks totaling 100 points.
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
                placeholder="e.g. Electrical Safety & Circuits"
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
                        placeholder={`Task ${taskIndex + 1} title (e.g. Practical Bench Test)`}
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
                  Creating Competency...
                </>
              ) : (
                "Save & Publish Competency"
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
