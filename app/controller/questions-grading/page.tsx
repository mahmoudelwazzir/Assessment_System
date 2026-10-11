"use client";

import React, { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Download,
  Layers,
  Award,
  ChevronRight,
  ShieldCheck,
  Check,
  Cpu,
  Code2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Sample pre-configured Question Banks generated from import
interface QuestionItem {
  id: string;
  competency: string;
  type: "Multiple Choice" | "Code Implementation" | "Metrology Calculation";
  question: string;
  points: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "Q-101",
    competency: "Smart Metering & DLMS/COSEM Protocols",
    type: "Multiple Choice",
    question: "What is the primary function of the Association Request (AARQ) in DLMS/COSEM communication?",
    points: 10,
    difficulty: "Intermediate",
  },
  {
    id: "Q-102",
    competency: "Smart Metering & DLMS/COSEM Protocols",
    type: "Metrology Calculation",
    question: "Calculate the active power error percentage when calibrated at 0.5 inductive power factor under IEC 62056 Class 0.2S.",
    points: 25,
    difficulty: "Advanced",
  },
  {
    id: "Q-103",
    competency: "Embedded Firmware & RTOS Architecture",
    type: "Code Implementation",
    question: "Implement a thread-safe FreeRTOS queue producer for high-frequency ADC current and voltage sampling.",
    points: 30,
    difficulty: "Advanced",
  },
  {
    id: "Q-104",
    competency: "System Architecture & Cloud Telemetry",
    type: "Code Implementation",
    question: "Write an MQTT topic payload parser for JSON-wrapped smart grid tamper alarms with HMAC-SHA256 validation.",
    points: 20,
    difficulty: "Intermediate",
  },
];

// Sample Automated Grading Student Run
interface AutoGradingRun {
  studentId: number;
  studentName: string;
  className: string;
  assignment: string;
  testCasesPassed: number;
  totalTestCases: number;
  codeQualityScore: number;
  computedGrade: number;
  status: "Pass" | "Fail" | "Grading";
}

const INITIAL_STUDENT_RUNS: AutoGradingRun[] = [
  {
    studentId: 10,
    studentName: "Abd alhadi eabd alhamaid",
    className: "Class 1-A (Software Systems)",
    assignment: "DLMS Optical Port Communication Handshake",
    testCasesPassed: 10,
    totalTestCases: 10,
    codeQualityScore: 98,
    computedGrade: 97,
    status: "Pass",
  },
  {
    studentId: 4,
    studentName: "Ibrahim Adel",
    className: "Class 1-A (Software Systems)",
    assignment: "DLMS Optical Port Communication Handshake",
    testCasesPassed: 9,
    totalTestCases: 10,
    codeQualityScore: 89,
    computedGrade: 91,
    status: "Pass",
  },
  {
    studentId: 12,
    studentName: "Ahmed Hassan Mostafa",
    className: "Class 1-A (Software Systems)",
    assignment: "DLMS Optical Port Communication Handshake",
    testCasesPassed: 8,
    totalTestCases: 10,
    codeQualityScore: 82,
    computedGrade: 84,
    status: "Pass",
  },
  {
    studentId: 15,
    studentName: "Nourhan Mostafa El-Sayed",
    className: "Class 1-B (Smart Metering)",
    assignment: "FreeRTOS Priority Preemption & Mutex Lock",
    testCasesPassed: 10,
    totalTestCases: 10,
    codeQualityScore: 95,
    computedGrade: 96,
    status: "Pass",
  },
  {
    studentId: 16,
    studentName: "Youssef Amr Abdelrahman",
    className: "Class 1-B (Smart Metering)",
    assignment: "FreeRTOS Priority Preemption & Mutex Lock",
    testCasesPassed: 7,
    totalTestCases: 10,
    codeQualityScore: 74,
    computedGrade: 73,
    status: "Pass",
  },
  {
    studentId: 19,
    studentName: "Ziad Tamer Mansour",
    className: "Class 2-A (Embedded Systems)",
    assignment: "MQTT Telemetry Ingestion Microservice",
    testCasesPassed: 9,
    totalTestCases: 10,
    codeQualityScore: 90,
    computedGrade: 92,
    status: "Pass",
  },
  {
    studentId: 22,
    studentName: "Reem Sherif Kamal",
    className: "Class 2-B (Industrial Automation)",
    assignment: "IEC 62056 Metrological Compliance Test Suite",
    testCasesPassed: 10,
    totalTestCases: 10,
    codeQualityScore: 94,
    computedGrade: 95,
    status: "Pass",
  },
];

export default function QuestionsAndAutomatedGradingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"questions" | "grading">("questions");

  // Question Import States
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Automated Grading States
  const [studentRuns, setStudentRuns] = useState<AutoGradingRun[]>(INITIAL_STUDENT_RUNS);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);

  // Handle Mock Excel/CSV File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsImporting(true);

    setTimeout(() => {
      setIsImporting(false);
      // Append newly parsed questions
      const parsed: QuestionItem[] = [
        {
          id: `Q-${Math.floor(105 + Math.random() * 50)}`,
          competency: "Smart Metering & DLMS/COSEM Protocols",
          type: "Metrology Calculation",
          question: `Imported from ${file.name}: Verify CRC-16 polynomial checksum calculation across HDLC framing buffer.`,
          points: 20,
          difficulty: "Advanced",
        },
        {
          id: `Q-${Math.floor(155 + Math.random() * 50)}`,
          competency: "System Architecture & Cloud Telemetry",
          type: "Code Implementation",
          question: `Imported from ${file.name}: Construct asynchronous batch pipeline inserting 5,000 meter load profiles per second into TimescaleDB.`,
          points: 30,
          difficulty: "Advanced",
        },
      ];
      setQuestions((prev) => [...parsed, ...prev]);

      toast({
        title: "File Successfully Imported",
        description: `Parsed and validated 2 new competency questions from ${file.name}.`,
      });
    }, 1200);
  };

  // Run Automated Grading Simulation
  const handleRunAutomatedGrading = () => {
    setIsGrading(true);
    setGradingProgress(10);

    const interval = setInterval(() => {
      setGradingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGrading(false);
          toast({
            title: "Automated Grading Completed",
            description: "All candidate test cases, code style metrics, and final grades calculated successfully.",
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/40 text-xs font-semibold uppercase tracking-wider text-red-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Assessment Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Question Generation & Automated Grading
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Import assessment questions via Excel/CSV, generate question banks, and run automated unit testing and grading for student submissions.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "questions"
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              1. Question Generation
            </button>
            <button
              onClick={() => setActiveTab("grading")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "grading"
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              2. Automated Grading
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: QUESTION GENERATION VIA FILE IMPORTATION                            */}
      {/* ========================================================================= */}
      {activeTab === "questions" && (
        <div className="space-y-6">
          {/* File Upload Zone */}
          <Card className="p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 text-[#c8102e] flex items-center justify-center mx-auto shadow-sm">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Import Questions from File
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                  Upload an Excel (.xlsx, .xls) or CSV file with questions, answer keys, points, and difficulty ratings.
                </p>
              </div>

              {/* Upload Input */}
              <div className="relative inline-block">
                <input
                  type="file"
                  id="question-file-input"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="question-file-input"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8102e] hover:bg-[#a80d26] text-white text-xs font-bold cursor-pointer shadow-md transition-all active:scale-95"
                >
                  {isImporting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Parsing & Validating...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Select Excel or CSV File</span>
                    </>
                  )}
                </label>
              </div>

              {fileName && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Active Imported File: <strong>{fileName}</strong>
                </p>
              )}

              <div className="pt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Template Download",
                      description: "Question_Import_Template.csv has been prepared for your assessment format.",
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#c8102e] hover:underline font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blank CSV Question Template</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Question Bank Items */}
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generated Questions ({questions.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Ready to deploy across upcoming assessment cycles.
                </p>
              </div>
              <Badge className="bg-[#c8102e]/10 text-[#c8102e] border-[#c8102e]/20">
                Live Question Bank
              </Badge>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-[#c8102e]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#c8102e]">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        • {q.competency}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {q.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          q.difficulty === "Advanced"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {q.points} Points
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUTOMATED GRADING & RESULTS ENGINE                                 */}
      {/* ========================================================================= */}
      {activeTab === "grading" && (
        <div className="space-y-6">
          {/* Engine Controls */}
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Automated Evaluation Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Execute automated test suites, evaluate answer correctness, and compile final grades.
              </p>
            </div>

            <Button
              onClick={handleRunAutomatedGrading}
              disabled={isGrading}
              className="bg-[#c8102e] hover:bg-[#a80d26] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              {isGrading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating ({gradingProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Auto-Grading Engine</span>
                </>
              )}
            </Button>
          </Card>

          {/* Evaluation Results Table */}
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Graded Submissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Instant calculation of unit tests, code style quality, and competency percentages.
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                All Passed
              </Badge>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Assignment</th>
                  <th className="py-3 px-3 text-center">Unit Tests</th>
                  <th className="py-3 px-3 text-center">Code Quality</th>
                  <th className="py-3 px-3 text-center">Computed Grade</th>
                  <th className="py-3 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {studentRuns.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {r.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: #{r.studentId}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-neutral-300">
                      {r.className}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-neutral-300">
                      {r.assignment}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {r.testCasesPassed} / {r.totalTestCases}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {r.codeQualityScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="text-sm font-extrabold text-[#c8102e]">
                        {r.computedGrade}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

