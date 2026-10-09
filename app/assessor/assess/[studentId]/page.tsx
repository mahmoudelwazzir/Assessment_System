"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  GraduationCap,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import type {
  Student,
  Competency,
  GradeLevel,
  CompetencyType,
  Task,
  SubTask,
} from "@/lib/types";
import { AssessmentForm } from "@/components/assess/assessment-form";
import type { AssessmentFormData } from "@/components/assess/assessment-form";

export default function AssessStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch student data
  const {
    data: student,
    isLoading: loadingStudent,
    error: studentError,
  } = useApiQuery(() => api.students.getById(Number(studentId)), [studentId]);

  // Get the course ID from student's competencies
  const courseId = student?.competencies?.[0]?.courseId;
  let courseRoundId = student?.competencies?.[0]?.assessmentCycleId;

  // If no courseRoundId in student data, try to get active round for the course
  const { data: courseRounds } = useApiQuery(
    () =>
      courseId && !courseRoundId
        ? api.courseRounds.getByCourse(courseId)
        : Promise.resolve([]),
    [courseId, courseRoundId],
  );

  // Use the first active round or the most recent round
  if (!courseRoundId && courseRounds && courseRounds.length > 0) {
    const activeRound = courseRounds.find((r) => r.statusId === 1);
    courseRoundId =
      activeRound?.id || courseRounds[courseRounds.length - 1]?.id;
  }

  // Fetch existing assessment results for this student
  const {
    data: existingResults,
    isLoading: loadingResults,
    refetch: refetchResults,
  } = useApiQuery(() => {
    if (!courseId) {
      return Promise.resolve([]);
    }

    const filters: any = {
      studentId: Number(studentId),
      courseId: courseId,
    };

    if (courseRoundId) {
      filters.courseRoundId = courseRoundId;
    }

    return api.competencyResults.getAll(filters);
  }, [studentId, courseId, courseRoundId]);

  // Determine current trial and lock status
  const TRIAL_LETTERS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const PASS_STATUS_ID = 53;

  const hasPassed = existingResults?.some(
    (result) => result.resultStatusId === PASS_STATUS_ID,
  );

  const attemptCount = existingResults?.length || 0;
  const currentTrial: "A" | "B" | "C" | "D" =
    hasPassed || attemptCount >= 4
      ? TRIAL_LETTERS[Math.min(attemptCount - 1, 3)]
      : TRIAL_LETTERS[attemptCount];

  const isLocked = hasPassed || attemptCount >= 4;

  // Fetch assignments for the student's course
  const {
    data: assignments,
    isLoading: loadingAssignments,
    error: assignmentsError,
  } = useApiQuery(
    () =>
      courseId
        ? api.courseRoundAssignments.getAll(courseId)
        : Promise.resolve([]),
    [courseId],
  );

  // Check if cycle is closed
  const isCycleClosed = useMemo(() => {
    if (!courseRoundId || !courseRounds) return false;
    const currentRound = courseRounds.find((r) => r.id === courseRoundId);
    if (!currentRound || !currentRound.endDate) return false;
    return new Date() > new Date(currentRound.endDate);
  }, [courseRoundId, courseRounds]);

  // Transform assignments to tasks
  const tasks: Task[] = useMemo(() => {
    if (!assignments || assignments.length === 0) return [];

    return assignments.map((assignment, index) => {
      const assignmentSubTasks = assignment.subTasks || [];
      const subTasks: SubTask[] =
        assignmentSubTasks.length > 0
          ? assignmentSubTasks.map((st) => ({
              id: st.id.toString(),
              label: st.title || `Sub-Task ${st.taskNumber}`,
              maxPoints: st.maxScore || 100,
            }))
          : [
              {
                id: `${assignment.id}-1`,
                label: "Performance & Demonstration",
                maxPoints: assignment.maxScore || 100,
              },
            ];

      return {
        id: assignment.id.toString(),
        label: `${assignment.title || `Assignment ${index + 1}`}`,
        subTasks,
      };
    });
  }, [assignments]);

  const handleSubmit = async (formData: AssessmentFormData) => {
    if (!courseId) {
      toast({
        title: "Configuration Error",
        description: "Student is not enrolled in a valid competency course.",
        variant: "destructive",
      });
      return;
    }

    try {
      const subTaskScores: {
        courseRoundAssignmentSubTaskId: number;
        score: number;
      }[] = [];

      for (const [key, value] of Object.entries(formData.scores)) {
        const [, subTaskId] = key.split(".");
        subTaskScores.push({
          courseRoundAssignmentSubTaskId: Number.parseInt(subTaskId, 10),
          score: value,
        });
      }

      let totalScore = 0;
      let maxScore = 0;

      tasks.forEach((task) => {
        task.subTasks.forEach((st) => {
          const key = `${task.id}.${st.id}`;
          totalScore += formData.scores[key] || 0;
          maxScore += st.maxPoints;
        });
      });

      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const passed = percentage >= 80;

      const payload = {
        studentId: Number(studentId),
        courseId,
        courseRoundId: courseRoundId || 1,
        assessorId: user?.accountId || 1,
        resultStatusId: passed ? 53 : 54,
        scorePercentage: percentage,
        totalScore,
        maxScore,
        notes: formData.notes,
        subTaskScores,
        gradedAt: new Date().toISOString(),
      };

      await api.competencyResults.create(payload);

      toast({
        title: "Assessment Finalized",
        description: `Student ${passed ? "passed" : "did not pass"} with ${percentage.toFixed(1)}%.`,
      });

      refetchResults();
      router.push("/assessor/students");
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Failed to record evaluation",
        variant: "destructive",
      });
    }
  };

  if (loadingStudent || loadingAssignments || loadingResults) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading rubric criteria & candidate profile...
          </span>
        </div>
      </div>
    );
  }

  if (studentError || !student) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-3xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#c8102e] mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Candidate Not Found
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            The candidate profile with ID {studentId} could not be retrieved.
          </p>
          <Button
            onClick={() => router.push("/assessor/students")}
            className="rounded-xl"
          >
            Return to Student List
          </Button>
        </Card>
      </div>
    );
  }

  if (!courseId || !assignments || assignments.length === 0) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-3xl bg-white dark:bg-[#121218] border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Rubric Criteria Not Configured
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            This module does not have assignments or sub-tasks defined yet.
          </p>
          <Button
            onClick={() => router.push("/assessor/students")}
            className="rounded-xl"
          >
            Return to Student List
          </Button>
        </Card>
      </div>
    );
  }

  // Show locked message if student has passed
  if (isLocked && hasPassed) {
    const passedResult = existingResults?.find(
      (result) => result.resultStatusId === PASS_STATUS_ID,
    );
    const passedAttempt = existingResults?.findIndex(
      (result) => result.resultStatusId === PASS_STATUS_ID,
    );
    const passedTrial =
      passedAttempt !== undefined && passedAttempt >= 0
        ? TRIAL_LETTERS[passedAttempt]
        : "A";
    const passedScore = passedResult?.scorePercentage
      ? passedResult.scorePercentage.toFixed(1)
      : passedResult?.totalScore && passedResult?.maxScore
        ? ((passedResult.totalScore / passedResult.maxScore) * 100).toFixed(1)
        : "N/A";

    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
        <button
          onClick={() => router.push("/assessor/students")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assigned Candidates
        </button>

        <Card className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-[#121218] border border-emerald-200 dark:border-emerald-900/40 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
            Candidate Has Passed
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6">
            {student?.fullNameEn} has completed and passed evaluation for this
            competency.
          </p>

          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 block">
                Trial Concluded
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                Trial {passedTrial}
              </span>
            </div>
            <div className="border-l border-emerald-200/60 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 block">
                Official Score
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                {passedScore}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-neutral-500">
            Rubric is sealed and archived in accordance with academic policy.
          </p>
        </Card>
      </div>
    );
  }

  // Show max attempts message
  if (isLocked && attemptCount >= 4) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
        <button
          onClick={() => router.push("/assessor/students")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assigned Candidates
        </button>

        <Card className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-[#121218] border border-red-200 dark:border-red-900/40 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-200 dark:border-red-900/30 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
            Maximum Evaluation Trials Reached
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            {student?.fullNameEn} has exhausted all 4 allowed trials (A, B, C,
            D) without obtaining a passing mark.
          </p>
          <p className="text-xs text-slate-400 dark:text-neutral-500">
            Please refer to the Academic Controller for further remedial action.
          </p>
        </Card>
      </div>
    );
  }

  const competencyName =
    student.competencies && student.competencies.length > 0
      ? student.competencies[0].competencyName
      : "Technical Competency";

  const formStudent: Student = {
    id: student.id.toString(),
    code: student.nationalId,
    fullName: student.fullNameEn,
    gradeLevel: "Junior" as GradeLevel,
    competency: "Software" as CompetencyType,
    enrolledCompetencies:
      student.competencies?.map((c) => c.competencyName) || [],
  };

  const formCompetency: Competency = {
    id: courseId.toString(),
    name: competencyName,
    gradeLevel: "Junior" as GradeLevel,
    description: `Assessment for ${competencyName}`,
    learningOutcomes: assignments.map((a) => a.title),
    totalStudents: 0,
    gradeDistribution: { A: 0, B: 0, C: 0, D: 0 },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push("/assessor/students")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
      </div>

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
                Rubric Assessment Form
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Award className="w-3.5 h-3.5" />
                Trial {currentTrial}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {student.fullNameEn}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-mono">
              {student.email}
              {student.className && <span> · Class: {student.className}</span>}
              <span> · ID: {student.nationalId}</span>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Module
            </span>
            <span className="text-sm font-extrabold text-white block mt-0.5 truncate max-w-[200px]">
              {competencyName}
            </span>
          </div>
        </div>
      </div>

      {/* Assessment Form Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <AssessmentForm
          student={formStudent}
          competency={formCompetency}
          tasks={tasks}
          currentTrial={currentTrial}
          initialScores={{}}
          initialNotes=""
          isLocked={isLocked}
          isCycleClosed={isCycleClosed}
          mode="page"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
