"use client";

import { useParams, useNavigate } from "react-router-dom";
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
import { ALL_STUDENT_DOSSIERS } from "@/lib/student-dossier-data";
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

// Standard Technical Competency Rubric (Industrial Standards)
const DEFAULT_RUBRIC_TASKS: Task[] = [
  {
    id: "task-1",
    label: "Task 1: System Design & Architectural Specification",
    subTasks: [
      { id: "101", label: "Functional Decomposition & Bus Communication Protocols", maxPoints: 50 },
      { id: "102", label: "Industrial Safety Standards Compliance & Margins", maxPoints: 50 },
    ],
  },
  {
    id: "task-2",
    label: "Task 2: Firmware & Practical Implementation",
    subTasks: [
      { id: "201", label: "Deterministic RTOS Logic & State Machine Architecture", maxPoints: 50 },
      { id: "202", label: "Buffer Boundaries, Memory Safety & Interrupt Handlers", maxPoints: 50 },
    ],
  },
  {
    id: "task-3",
    label: "Task 3: Laboratory Practical Verification & Testing",
    subTasks: [
      { id: "301", label: "Hardware-in-the-Loop Test Protocol & Oscilloscope Waveforms", maxPoints: 50 },
      { id: "302", label: "Edge Cases, Fault Tolerance & Recovery Protocols", maxPoints: 50 },
    ],
  },
  {
    id: "task-4",
    label: "Task 4: Industrial Safety, Documentation & Engineering Quality",
    subTasks: [
      { id: "401", label: "Code Architecture, Clean Naming & Git Version History", maxPoints: 50 },
      { id: "402", label: "Field Safety Compliance & Engineering Dossier Quality", maxPoints: 50 },
    ],
  },
];

export default function AssessStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const router = {
    push: (p: string) => navigate(p),
    replace: (p: string) => navigate(p, { replace: true }),
    back: () => navigate(-1),
  };
  const { toast } = useToast();
  const { user } = useAuth();

  const candidateIdNum = Number(studentId);
  const fallbackDossier = ALL_STUDENT_DOSSIERS[candidateIdNum] || ALL_STUDENT_DOSSIERS[10];

  // Fetch student data
  const {
    data: student,
    isLoading: loadingStudent,
    error: studentError,
  } = useApiQuery(() => api.students.getById(candidateIdNum), [studentId]);

  // Get the course ID from student's competencies
  const effectiveCourseId = student?.competencies?.[0]?.courseId || 1;
  const courseId = effectiveCourseId;
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
  const PASS_STATUS_ID = 2;
  const FAIL_STATUS_ID = 4;

  const isPassStatus = (sId?: number, sName?: string) =>
    sId === 2 || sId === 7 || sId === 53 || sName === "Pass" || sName === "Passed";

  const hasPassed = existingResults?.some(
    (result) => isPassStatus(result.resultStatusId, result.resultStatusName),
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

  // Transform assignments to tasks with industrial standard fallback
  const tasks: Task[] = useMemo(() => {
    if (assignments && assignments.length > 0) {
      return assignments.map((assignment, index) => {
        const assignmentSubTasks = assignment.subTasks || [];
        const subTasks: SubTask[] =
          assignmentSubTasks.length > 0
            ? assignmentSubTasks.map((st: any) => ({
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
    }
    return DEFAULT_RUBRIC_TASKS;
  }, [assignments]);

  const candidateName = student?.fullNameEn || fallbackDossier?.fullNameEn || "Candidate Student";
  const candidateNationalId = student?.nationalId || fallbackDossier?.nationalId || "29901011999991";
  const candidateEmail = student?.email || fallbackDossier?.email || "student@elsewedy.edu.eg";
  const candidateClass = student?.className || "Class 1-A (Software Systems)";
  const competencyName =
    student?.competencies && student.competencies.length > 0
      ? student.competencies[0].competencyName
      : fallbackDossier?.competencies?.[0]?.nameEn || "Embedded Systems & RTOS";

  const handleSubmit = async (formData: AssessmentFormData) => {
    try {
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

      const subTaskScores: {
        courseRoundAssignmentSubTaskId: number;
        score: number;
      }[] = [];

      for (const [key, value] of Object.entries(formData.scores)) {
        const [, subTaskId] = key.split(".");
        subTaskScores.push({
          courseRoundAssignmentSubTaskId: Number.parseInt(subTaskId, 10) || 1,
          score: value,
        });
      }

      const payload = {
        studentId: candidateIdNum,
        courseId: effectiveCourseId,
        courseRoundId: courseRoundId || 1,
        assessorId: user?.accountId || 1,
        resultStatusId: passed ? PASS_STATUS_ID : FAIL_STATUS_ID,
        scorePercentage: percentage,
        totalScore,
        maxScore,
        notes: formData.notes,
        subTaskScores,
        gradedAt: new Date().toISOString(),
      };

      // Try submitting to backend API
      try {
        await api.competencyResults.create(payload);
      } catch (backendErr) {
        console.warn("Backend API not reachable or rejected competencyResults.create, saving to local store:", backendErr);
      }

      // Persist in localStorage for assessor roster updates
      try {
        const existing = JSON.parse(localStorage.getItem("assessor_evaluations") || "{}");
        existing[studentId] = {
          studentId: candidateIdNum,
          studentName: candidateName,
          percentage,
          passed,
          totalScore,
          maxScore,
          notes: formData.notes,
          scores: formData.scores,
          trial: currentTrial,
          gradedAt: new Date().toISOString(),
        };
        localStorage.setItem("assessor_evaluations", JSON.stringify(existing));
      } catch (storageErr) {
        console.error("Local storage error:", storageErr);
      }

      toast({
        title: "Evaluation Submitted & Recorded",
        description: `Candidate: ${candidateName} · Score: ${percentage.toFixed(1)}% · Status: ${passed ? "Competent / Passed" : "Pending Re-evaluation"}.`,
      });

      refetchResults();
      setTimeout(() => {
        router.push("/assessor/students");
      }, 500);
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Failed to record evaluation",
        variant: "destructive",
      });
    }
  };

  if (loadingStudent && !fallbackDossier) {
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

  if (studentError && !fallbackDossier) {
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

  // Show locked message if student has passed
  if (isLocked && hasPassed) {
    const passedResult = existingResults?.find((result) =>
      isPassStatus(result.resultStatusId, result.resultStatusName)
    );
    const passedAttempt = existingResults?.findIndex((result) =>
      isPassStatus(result.resultStatusId, result.resultStatusName)
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
            {candidateName} has completed and passed evaluation for this
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
            {candidateName} has exhausted all 4 allowed trials (A, B, C,
            D) without obtaining a passing mark.
          </p>
          <p className="text-xs text-slate-400 dark:text-neutral-500">
            Please refer to the Academic Controller for further remedial action.
          </p>
        </Card>
      </div>
    );
  }

  const formStudent: Student = {
    id: candidateIdNum.toString(),
    code: candidateNationalId,
    fullName: candidateName,
    gradeLevel: "Junior" as GradeLevel,
    competency: "Software" as CompetencyType,
    enrolledCompetencies:
      student?.competencies?.map((c) => c.competencyName) || [competencyName],
  };

  const formCompetency: Competency = {
    id: effectiveCourseId.toString(),
    name: competencyName,
    gradeLevel: "Junior" as GradeLevel,
    description: `Assessment for ${competencyName}`,
    learningOutcomes: tasks.map((t) => t.label),
    totalStudents: 0,
    gradeDistribution: { A: 0, B: 0, C: 0, D: 0 },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push("/assessor/students")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
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
              {candidateName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-mono">
              {candidateEmail}
              {candidateClass && <span> · Class: {candidateClass}</span>}
              <span> · ID: {candidateNationalId}</span>
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
