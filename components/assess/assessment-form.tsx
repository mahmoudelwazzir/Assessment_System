"use client";

import { useState } from "react";
import { Send, Lock, Zap, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type {
  Grade,
  Student,
  Competency,
  Task,
  TaskScores,
  SubTask,
} from "@/lib/types";

const TRIALS: Grade[] = ["A", "B", "C", "D"];
const PASS_THRESHOLD = 80;

// Given current trial letter, return the next one (or same if already D)
function nextTrial(trial: Grade): Grade {
  const idx = TRIALS.indexOf(trial);
  return TRIALS[Math.min(idx + 1, TRIALS.length - 1)];
}

function taskTotal(task: Task, scores: TaskScores): number {
  return task.subTasks.reduce(
    (sum, st) => sum + (scores[`${task.id}.${st.id}`] ?? 0),
    0,
  );
}

export interface AssessmentFormProps {
  student: Student;
  competency: Competency | null;
  tasks?: Task[]; // Allow external tasks to be passed in
  currentTrial?: Grade;
  initialScores?: TaskScores;
  initialNotes?: string;
  isLocked?: boolean;
  isCycleClosed?: boolean;
  mode?: "page" | "sheet";
  onSaveDraft?: (data: AssessmentFormData) => void;
  onSubmit?: (data: AssessmentFormData) => void;
  onCancel?: () => void;
}

export interface AssessmentFormData {
  scores: TaskScores;
  notes: string;
  grade: Grade;
  trial: Grade;
}

export function AssessmentForm({
  student,
  tasks: externalTasks,
  currentTrial = "A" as Grade,
  initialScores = {},
  initialNotes = "",
  isLocked = false,
  isCycleClosed = false,
  mode = "page",
  onSaveDraft,
  onSubmit,
  onCancel,
}: AssessmentFormProps) {
  const { toast } = useToast();
  // Use real tasks passed from backend API
  const tasks: Task[] = externalTasks || [];

  console.log("=== ASSESSMENT FORM INITIALIZED ===");
  console.log("Student competency:", student.competency);
  console.log("External tasks provided:", externalTasks);
  console.log("Final tasks being used:", tasks);
  console.log("Number of tasks:", tasks.length);

  const [scores, setScores] = useState<TaskScores>(initialScores);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, true])),
  );

  const canEdit = !isLocked && !isCycleClosed;

  const handleScoreChange = (
    taskId: string,
    subTaskId: string,
    raw: string,
  ) => {
    const key = `${taskId}.${subTaskId}`;
    const task = tasks.find((t) => t.id === taskId);
    const subTask = task?.subTasks.find((s) => s.id === subTaskId);
    const max = subTask?.maxPoints ?? 100;
    const num = Math.min(max, Math.max(0, Number.parseInt(raw) || 0));
    setScores((prev) => ({ ...prev, [key]: num }));
  };

  // Per-task totals and pass/fail
  const taskResults = tasks.map((task) => {
    const total = taskTotal(task, scores);
    const passed = total >= PASS_THRESHOLD;
    return { task, total, passed };
  });

  // Overall: average of task totals
  const overallScore =
    tasks.length > 0
      ? Math.round(
          taskResults.reduce((sum, r) => sum + r.total, 0) / tasks.length,
        )
      : 0;

  // Pass = current trial letter, Fail = next trial letter
  const derivedGrade: Grade =
    overallScore >= PASS_THRESHOLD ? currentTrial : nextTrial(currentTrial);
  const allTasksEntered = tasks.every((t) =>
    t.subTasks.every((st) => scores[`${t.id}.${st.id}`] !== undefined),
  );

  const buildData = (): AssessmentFormData => ({
    scores,
    notes,
    grade: derivedGrade,
    trial: currentTrial,
  });

  const handleSubmit = () => {
    if (!allTasksEntered) {
      toast({
        title: "Incomplete",
        description: "Please enter scores for all subtasks.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSubmit?.(buildData());
    }, 400);
  };

  return (
    <div className="space-y-5">
      {/* ── Locked notice ─────────────────────────────────────── */}
      {isLocked && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-300 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
            This result is submitted and locked.
          </p>
        </div>
      )}

      {/* ── Trial banner ──────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Trial {currentTrial}
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Pass threshold: {PASS_THRESHOLD} pts per task
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-3xl font-extrabold tracking-tight ${overallScore >= PASS_THRESHOLD ? "text-emerald-600 dark:text-emerald-400" : "text-[#c8102e] dark:text-[#ff4d6a]"}`}
          >
            {overallScore}
            <span className="text-xs font-bold text-slate-400 dark:text-neutral-500 ml-1">
              /100
            </span>
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mt-0.5">
            Overall avg
          </p>
        </div>
      </div>

      {/* ── Tasks ─────────────────────────────────────────────── */}
      {taskResults.map((taskResult) => {
        const { task, total, passed } = taskResult;
        const isExpanded = expanded[task.id] ?? true;
        return (
          <div
            key={task.id}
            className="border border-slate-200/80 dark:border-white/10 rounded-2xl bg-white dark:bg-[#15151d] overflow-hidden shadow-sm transition-all focus-within:border-[#c8102e]/50"
          >
            {/* Task header */}
            <button
              type="button"
              onClick={() =>
                setExpanded((p) => ({ ...p, [task.id]: !p[task.id] }))
              }
              className="w-full flex items-center justify-between px-5 py-4 bg-transparent hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {task.label}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    passed
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                      : total > 0
                        ? "bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border-red-200 dark:border-red-900/30"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-white/10"
                  }`}
                >
                  {passed ? "Pass" : total > 0 ? "Fail" : "—"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-lg font-extrabold tracking-tight ${passed ? "text-emerald-600 dark:text-emerald-400" : total > 0 ? "text-[#c8102e] dark:text-[#ff4d6a]" : "text-slate-400"}`}
                >
                  {total}
                  <span className="text-xs font-bold text-slate-400 dark:text-neutral-500 ml-1">
                    /100
                  </span>
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Task progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-white/5">
              <div
                className={`h-1 transition-all duration-300 ${passed ? "bg-emerald-500" : "bg-[#c8102e]"}`}
                style={{ width: `${Math.min(total, 100)}%` }}
              />
            </div>

            {/* Subtasks */}
            {isExpanded && (
              <div className="bg-slate-50/50 dark:bg-white/[0.01] px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-slate-100 dark:border-white/5">
                {task.subTasks.map((st: SubTask) => {
                  const key = `${task.id}.${st.id}`;
                  const val = scores[key] ?? 0;
                  const pct =
                    st.maxPoints > 0
                      ? Math.round((val / st.maxPoints) * 100)
                      : 0;
                  const stColor =
                    pct >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : pct >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-[#c8102e] dark:text-[#ff4d6a]";
                  return (
                    <div
                      key={st.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0 group"
                    >
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 group-hover:text-[#c8102e] transition-colors">
                          {st.label}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-0.5 uppercase tracking-wider">
                          Max {st.maxPoints} pts
                        </p>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={st.maxPoints}
                        value={scores[key] ?? ""}
                        onChange={(e) =>
                          handleScoreChange(task.id, st.id, e.target.value)
                        }
                        disabled={!canEdit}
                        placeholder="0"
                        className={`w-20 h-10 text-center border border-slate-200 dark:border-white/10 rounded-xl text-base font-extrabold bg-white dark:bg-[#1a1a24] focus:outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 transition-all disabled:bg-slate-100 dark:disabled:bg-white/5 disabled:text-slate-400 shrink-0 ${stColor}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Overall result summary ────────────────────────────── */}
      {tasks.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
              Result Summary
            </h3>
            <div
              className={`text-3xl font-extrabold tracking-tight ${overallScore >= PASS_THRESHOLD ? "text-emerald-600 dark:text-emerald-400" : "text-[#c8102e] dark:text-[#ff4d6a]"}`}
            >
              {overallScore}%
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {taskResults.map(({ task, total, passed }) => (
              <div
                key={task.id}
                className={`rounded-xl p-3.5 text-center border ${passed ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30" : "bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/30"}`}
              >
                <p className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider truncate mb-1">
                  {task.label.split("–")[0].trim()}
                </p>
                <p
                  className={`text-xl font-extrabold tracking-tight ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-[#c8102e] dark:text-[#ff4d6a]"}`}
                >
                  {total}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-[#c8102e] dark:text-[#ff4d6a]"}`}
                >
                  {passed ? "Pass" : "Fail"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-200 dark:border-white/10">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                Derived Outcome
              </span>
              {overallScore < PASS_THRESHOLD && currentTrial !== "D" && (
                <p className="text-xs font-semibold text-amber-500 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Candidate requires re-evaluation → Advances to Trial {nextTrial(currentTrial)}
                </p>
              )}
            </div>
            {overallScore >= PASS_THRESHOLD ? (
              <span
                className={`text-2xl font-bold tracking-tight px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 ${
                  currentTrial === "A"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : currentTrial === "B"
                      ? "text-blue-500"
                      : currentTrial === "C"
                        ? "text-amber-500"
                        : "text-red-500"
                }`}
              >
                Passed · Trial {currentTrial}
              </span>
            ) : (
              <span className="text-xl font-bold tracking-tight text-amber-500 dark:text-amber-400 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                Pending · Trial {nextTrial(currentTrial)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────────────── */}
      <div className="space-y-2 mt-6">
        <Label
          htmlFor={`notes-${mode}`}
          className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
        >
          Notes & Evaluator Observations
        </Label>
        <Textarea
          id={`notes-${mode}`}
          placeholder="Add any observations or evaluator feedback about this student's performance..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={!canEdit}
          rows={mode === "sheet" ? 3 : 4}
          className="resize-none rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] focus-visible:ring-[#c8102e] p-4 text-sm"
        />
      </div>

      {/* ── Actions ───────────────────────────────────────────── */}
      {canEdit && (
        <div
          className={`mt-8 pt-6 border-t border-slate-200 dark:border-white/10 ${mode === "sheet" ? "pt-4" : ""}`}
        >
          {mode === "page" ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Ensure all task points are verified. Submitting will register the official attempt mark.
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full sm:w-auto min-w-[200px] h-12 px-8 rounded-xl font-semibold text-sm bg-[#c8102e] hover:bg-[#a00d24] text-white shadow-lg shadow-red-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Results...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Evaluation
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="rounded-xl px-5 h-11"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-xl px-6 h-11 bg-[#c8102e] hover:bg-[#a00d24] text-white shadow-md shadow-red-900/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Save Assessment
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
