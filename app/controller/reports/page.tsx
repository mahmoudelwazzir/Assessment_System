"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  ArrowUpDown,
  Search,
  ShieldAlert,
  Bot,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Student scores for export
interface StudentScoreReport {
  id: number;
  fullName: string;
  email: string;
  className: string;
  smartMeteringScore: number;
  rtosScore: number;
  cloudTelemetryScore: number;
  totalScore: number;
  gradePercentage: number;
  rank: number;
}

const INITIAL_REPORT_DATA: StudentScoreReport[] = [
  {
    id: 10,
    fullName: "Abd alhadi eabd alhamaid",
    email: "hadym2429@gmail.com",
    className: "Class 1-A (Software Systems)",
    smartMeteringScore: 96,
    rtosScore: 92,
    cloudTelemetryScore: 95,
    totalScore: 283,
    gradePercentage: 94.3,
    rank: 1,
  },
  {
    id: 15,
    fullName: "Nourhan Mostafa El-Sayed",
    email: "nourhan.sayed@elsewedy.edu.eg",
    className: "Class 1-B (Smart Metering)",
    smartMeteringScore: 95,
    rtosScore: 94,
    cloudTelemetryScore: 92,
    totalScore: 281,
    gradePercentage: 93.7,
    rank: 2,
  },
  {
    id: 22,
    fullName: "Reem Sherif Kamal",
    email: "reem.kamal@elsewedy.edu.eg",
    className: "Class 2-B (Industrial Automation)",
    smartMeteringScore: 94,
    rtosScore: 90,
    cloudTelemetryScore: 93,
    totalScore: 277,
    gradePercentage: 92.3,
    rank: 3,
  },
  {
    id: 19,
    fullName: "Ziad Tamer Mansour",
    email: "ziad.mansour@elsewedy.edu.eg",
    className: "Class 2-A (Embedded Systems)",
    smartMeteringScore: 91,
    rtosScore: 89,
    cloudTelemetryScore: 92,
    totalScore: 272,
    gradePercentage: 90.7,
    rank: 4,
  },
  {
    id: 4,
    fullName: "Ibrahim Adel",
    email: "ibrahim.adel1@school.com",
    className: "Class 1-A (Software Systems)",
    smartMeteringScore: 89,
    rtosScore: 88,
    cloudTelemetryScore: 87,
    totalScore: 264,
    gradePercentage: 88.0,
    rank: 5,
  },
  {
    id: 13,
    fullName: "Mariam Tarek Youssef",
    email: "mariam.tarek@elsewedy.edu.eg",
    className: "Class 1-A (Software Systems)",
    smartMeteringScore: 85,
    rtosScore: 84,
    cloudTelemetryScore: 86,
    totalScore: 255,
    gradePercentage: 85.0,
    rank: 6,
  },
  {
    id: 12,
    fullName: "Ahmed Hassan Mostafa",
    email: "ahmed.hassan@elsewedy.edu.eg",
    className: "Class 1-A (Software Systems)",
    smartMeteringScore: 82,
    rtosScore: 80,
    cloudTelemetryScore: 84,
    totalScore: 246,
    gradePercentage: 82.0,
    rank: 7,
  },
  {
    id: 17,
    fullName: "Salma Mohamed Radwan",
    email: "salma.radwan@elsewedy.edu.eg",
    className: "Class 1-B (Smart Metering)",
    smartMeteringScore: 78,
    rtosScore: 79,
    cloudTelemetryScore: 81,
    totalScore: 238,
    gradePercentage: 79.3,
    rank: 8,
  },
  {
    id: 16,
    fullName: "Youssef Amr Abdelrahman",
    email: "youssef.amr@elsewedy.edu.eg",
    className: "Class 1-B (Smart Metering)",
    smartMeteringScore: 74,
    rtosScore: 75,
    cloudTelemetryScore: 76,
    totalScore: 225,
    gradePercentage: 75.0,
    rank: 9,
  },
  {
    id: 20,
    fullName: "Fatma Ahmed Ezzat",
    email: "fatma.ezzat@elsewedy.edu.eg",
    className: "Class 2-A (Embedded Systems)",
    smartMeteringScore: 70,
    rtosScore: 68,
    cloudTelemetryScore: 72,
    totalScore: 210,
    gradePercentage: 70.0,
    rank: 10,
  },
  {
    id: 23,
    fullName: "Hazem Wael Soliman",
    email: "hazem.soliman@elsewedy.edu.eg",
    className: "Class 2-B (Industrial Automation)",
    smartMeteringScore: 65,
    rtosScore: 66,
    cloudTelemetryScore: 67,
    totalScore: 198,
    gradePercentage: 66.0,
    rank: 11,
  },
];

// Copied Code Detection (Plagiarism Similarity Matrix)
interface PlagiarismIncident {
  id: string;
  assignment: string;
  studentA: string;
  studentB: string;
  similarityPercent: number;
  copiedLines: number;
  fileSource: string;
  status: "Flagged" | "Reviewed" | "Cleared";
}

const PLAGIARISM_INCIDENTS: PlagiarismIncident[] = [
  {
    id: "PLAG-01",
    assignment: "FreeRTOS Priority Preemption & Mutex Lock",
    studentA: "Hazem Wael Soliman",
    studentB: "Youssef Amr Abdelrahman",
    similarityPercent: 91,
    copiedLines: 84,
    fileSource: "freertos_task_sync.c",
    status: "Flagged",
  },
  {
    id: "PLAG-02",
    assignment: "MQTT Telemetry Ingestion Microservice",
    studentA: "Salma Mohamed Radwan",
    studentB: "Karim Hany El-Naggar",
    similarityPercent: 86,
    copiedLines: 52,
    fileSource: "mqtt_subscriber_handler.py",
    status: "Flagged",
  },
];

// AI Code Detection
interface AICodeIncident {
  id: string;
  studentName: string;
  assignment: string;
  aiProbability: number;
  detectedModelPattern: string;
  fileSource: string;
  status: "High Suspicion" | "Moderate" | "Human Verified";
}

const AI_CODE_INCIDENTS: AICodeIncident[] = [
  {
    id: "AI-101",
    studentName: "Hazem Wael Soliman",
    assignment: "DLMS Optical Port Communication Handshake",
    aiProbability: 94,
    detectedModelPattern: "GPT-4o Boilerplate Signature & Generic Comments",
    fileSource: "dlms_client.ts",
    status: "High Suspicion",
  },
  {
    id: "AI-102",
    studentName: "Mona Ashraf Tawfik",
    assignment: "FreeRTOS Priority Preemption & Mutex Lock",
    aiProbability: 82,
    detectedModelPattern: "Claude 3.5 Sonnet Idiomatic Pattern & Error Handlers",
    fileSource: "rtos_kernel.c",
    status: "Moderate",
  },
  {
    id: "AI-103",
    studentName: "Abd alhadi eabd alhamaid",
    assignment: "System Architecture & Cloud Telemetry",
    aiProbability: 8,
    detectedModelPattern: "Natural Human Authored (Hardware Register Level)",
    fileSource: "modbus_driver.c",
    status: "Human Verified",
  },
];

export default function ReportsAndCheatingChecksPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"scores" | "copied_code" | "ai_code">("scores");

  // Sorting for Scores Export (Ascending vs Descending)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedReports = useMemo(() => {
    let list = [...INITIAL_REPORT_DATA];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.totalScore - b.totalScore;
      } else {
        return b.totalScore - a.totalScore;
      }
    });

    return list;
  }, [sortOrder, searchQuery]);

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = "ID,Full Name,Email,Class,Smart Metering,RTOS,Cloud Telemetry,Total Score,Grade Percentage,Rank\n";
    const rows = filteredAndSortedReports
      .map(
        (r) =>
          `${r.id},"${r.fullName}","${r.email}","${r.className}",${r.smartMeteringScore},${r.rtosScore},${r.cloudTelemetryScore},${r.totalScore},${r.gradePercentage}%,#${r.rank}`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Elsewedy_Students_Scores_Report_${sortOrder}_order.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Scores Report Exported",
      description: `Downloaded students' report sorted in ${
        sortOrder === "asc" ? "Ascending" : "Descending"
      } order.`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/40 text-xs font-semibold uppercase tracking-wider text-red-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Assessment Governance & Integrity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Reports Export & Cheating Checks
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Export comprehensive score reports sorted in ascending order, run cross-candidate plagiarism code similarity detection, and analyze AI-generated code likelihood.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("scores")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "scores"
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Scores Export
            </button>
            <button
              onClick={() => setActiveTab("copied_code")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "copied_code"
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Copied Code Detection
            </button>
            <button
              onClick={() => setActiveTab("ai_code")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "ai_code"
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              AI Code Detection
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SCORES EXPORT (SORTED ASCENDING ORDER)                              */}
      {/* ========================================================================= */}
      {activeTab === "scores" && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Students Total Scores Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Sorted in <strong>{sortOrder === "asc" ? "Ascending (Lowest to Highest)" : "Descending (Highest to Lowest)"}</strong> order.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search candidate or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-xl w-48 sm:w-64"
                  />
                </div>

                {/* Sort Toggle Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-9 px-3 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 cursor-pointer flex items-center gap-1.5"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <ArrowUp className="w-3.5 h-3.5 text-[#c8102e]" />
                      <span>Order: Ascending</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3.5 h-3.5 text-[#c8102e]" />
                      <span>Order: Descending</span>
                    </>
                  )}
                </Button>

                {/* Export CSV Button */}
                <Button
                  onClick={handleExportCSV}
                  className="h-9 px-4 text-xs font-bold rounded-xl bg-[#c8102e] hover:bg-[#a80d26] text-white cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Scores Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3 text-center">Smart Metering</th>
                    <th className="py-3 px-3 text-center">RTOS</th>
                    <th className="py-3 px-3 text-center">Cloud Telemetry</th>
                    <th className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-[#c8102e]">
                        <span>Total Score</span>
                        {sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">Percentage</th>
                    <th className="py-3 px-3 text-right">Class Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                  {filteredAndSortedReports.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {s.fullName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {s.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-neutral-300">
                        {s.className}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 dark:text-neutral-300">
                        {s.smartMeteringScore}/100
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 dark:text-neutral-300">
                        {s.rtosScore}/100
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 dark:text-neutral-300">
                        {s.cloudTelemetryScore}/100
                      </td>
                      <td className="py-3.5 px-3 text-center font-extrabold text-[#c8102e] text-sm">
                        {s.totalScore}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {s.gradePercentage}%
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          Rank #{s.rank}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COPIED CODE DETECTION (PLAGIARISM)                                  */}
      {/* ========================================================================= */}
      {activeTab === "copied_code" && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#c8102e]" />
                  <span>Cross-Student Copied Code Detection</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Automated AST (Abstract Syntax Tree) comparison detects copied token sequences and logic duplication between student repositories.
                </p>
              </div>
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                2 Flagged Incidents
              </Badge>
            </div>

            <div className="space-y-4">
              {PLAGIARISM_INCIDENTS.map((inc) => (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-amber-200 dark:border-amber-900/30 hover:border-[#c8102e]/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#c8102e]">
                          {inc.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          {inc.assignment}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {inc.fileSource}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Candidate A: {inc.studentA}
                        </span>
                        <span>↔</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Candidate B: {inc.studentB}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                          {inc.similarityPercent}% Similarity
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {inc.copiedLines} identical lines
                        </p>
                      </div>
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                        {inc.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Code Diff Preview Mockup */}
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-white/5">
                    <div className="text-amber-400 mb-1 font-semibold">
                      // Matched Syntax Token Block (Lines 42-126)
                    </div>
                    <pre className="text-neutral-300">
{`while (xQueueReceive(xMeterDataQueue, &xSample, portMAX_DELAY) == pdPASS) {
    if (xSample.active_power > THRESHOLD_VAL) {
        trigger_overload_flag(xSample.meter_id);
    }
}`}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AI CODE DETECTION                                                  */}
      {/* ========================================================================= */}
      {activeTab === "ai_code" && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span>AI Code Generation Detector (LLM Heuristics)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Calculates perplexity, syntactic uniformity, and LLM signature tokens from GPT-4o, Claude 3.5 Sonnet, and GitHub Copilot.
                </p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                AI Heuristics Scanner
              </Badge>
            </div>

            <div className="space-y-4">
              {AI_CODE_INCIDENTS.map((ai) => (
                <div
                  key={ai.id}
                  className="p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-purple-400">
                        {ai.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {ai.studentName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-neutral-400">
                        • {ai.assignment}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {ai.fileSource}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-neutral-300">
                      Identified Pattern: <strong>{ai.detectedModelPattern}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-lg font-black ${
                          ai.aiProbability > 75
                            ? "text-red-500"
                            : ai.aiProbability > 50
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {ai.aiProbability}% AI Probability
                      </span>
                    </div>

                    <Badge
                      className={
                        ai.status === "High Suspicion"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : ai.status === "Moderate"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }
                    >
                      {ai.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
