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
  Play,
  Eye,
  Check,
  RotateCcw,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Loader2,
  PlusCircle,
  Copy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ALL_STUDENT_DOSSIERS } from "@/lib/student-dossier-data";

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
export interface AICodeIncident {
  id: string;
  studentName: string;
  assignment: string;
  aiProbability: number;
  detectedModelPattern: string;
  fileSource: string;
  status: "High Suspicion" | "Moderate" | "Human Verified";
  codeSnippet: string;
  submittedAt: string;
  perplexityScore: number;
  burstinessScore: number;
  astUniformityScore: number;
  flaggedTokensCount: number;
}

const INITIAL_AI_CODE_INCIDENTS: AICodeIncident[] = [
  {
    id: "AI-101",
    studentName: "Hazem Wael Soliman",
    assignment: "DLMS Optical Port Communication Handshake",
    aiProbability: 94,
    detectedModelPattern: "GPT-4o Boilerplate Signature & Generic Comments",
    fileSource: "dlms_client.ts",
    status: "High Suspicion",
    submittedAt: "2026-10-10 14:22",
    perplexityScore: 18.2,
    burstinessScore: 0.14,
    astUniformityScore: 92,
    flaggedTokensCount: 38,
    codeSnippet: `/**
 * DLMS optical port communication handshake.
 * This function initiates the optical connection with the smart meter.
 */
int dlms_initiate_optical_handshake(const char *port_name, int baud_rate) {
    if (port_name == NULL || baud_rate <= 0) {
        return -1; // Invalid parameters
    }
    // Step 1: Open optical serial communication channel
    SerialPort* port = serial_open(port_name, baud_rate);
    if (!port) {
        return -2; // Port open failure
    }
    // Step 2: Transmit standard IEC 62056-21 start sign: /?!<CR><LF>
    const char* start_seq = "/?!\\r\\n";
    serial_write(port, start_seq, strlen(start_seq));
    // Step 3: Wait for baud identification response from meter
    char buffer[64];
    int bytes_read = serial_read_timeout(port, buffer, sizeof(buffer), 2000);
    if (bytes_read <= 0) {
        serial_close(port);
        return -3; // No response from meter optical eye
    }
    return 0; // Handshake successful
}`,
  },
  {
    id: "AI-102",
    studentName: "Mona Ashraf Tawfik",
    assignment: "FreeRTOS Priority Preemption & Mutex Lock",
    aiProbability: 82,
    detectedModelPattern: "Claude 3.5 Sonnet Idiomatic Pattern & Error Handlers",
    fileSource: "rtos_kernel.c",
    status: "Moderate",
    submittedAt: "2026-10-10 16:45",
    perplexityScore: 32.5,
    burstinessScore: 0.28,
    astUniformityScore: 78,
    flaggedTokensCount: 24,
    codeSnippet: `void vTelemetryWorkerTask(void *pvParameters) {
    TelemetryPacket_t xPacket;
    for (;;) {
        if (xQueueReceive(xTelemetryQueue, &xPacket, pdMS_TO_TICKS(100)) == pdPASS) {
            if (xSemaphoreTake(xBusMutex, pdMS_TO_TICKS(50)) == pdTRUE) {
                bsp_modbus_send_raw(xPacket.data, xPacket.len);
                xSemaphoreGive(xBusMutex);
            } else {
                vTaskDelay(pdMS_TO_TICKS(10));
            }
        }
    }
}`,
  },
  {
    id: "AI-103",
    studentName: "Abd alhadi eabd alhamaid",
    assignment: "System Architecture & Cloud Telemetry",
    aiProbability: 8,
    detectedModelPattern: "Natural Human Authored (Hardware Register Level)",
    fileSource: "modbus_driver.c",
    status: "Human Verified",
    submittedAt: "2026-10-11 11:10",
    perplexityScore: 164.8,
    burstinessScore: 0.88,
    astUniformityScore: 24,
    flaggedTokensCount: 1,
    codeSnippet: `void USART1_IRQHandler(void) {
    uint32_t isrflags = USART1->SR;
    uint32_t cr1its   = USART1->CR1;
    // Direct RXNE register bit check
    if ((isrflags & USART_SR_RXNE) && (cr1its & USART_CR1_RXNEIE)) {
        uint8_t byte = (uint8_t)(USART1->DR & 0xFF);
        BaseType_t xHigherPriorityTaskWoken = pdFALSE;
        // Ringbuffer ISR bypass without dynamic heap
        if (g_rx_head < RX_BUFFER_SIZE) {
            g_raw_frame_buf[g_rx_head++] = byte;
            if (byte == 0x7E && g_rx_head > 4) { // HDLC frame flag
                xSemaphoreGiveFromISR(xDlmsFrameSem, &xHigherPriorityTaskWoken);
            }
        }
        portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
    }
    if (isrflags & USART_SR_ORE) {
        volatile uint32_t dummy = USART1->DR; // Clear overrun flag
        (void)dummy;
    }
}`,
  },
];

export default function ReportsAndCheatingChecksPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"scores" | "copied_code" | "ai_code">("scores");

  // Sorting for Scores Export (Ascending vs Descending)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Code Detection State
  const [aiIncidents, setAiIncidents] = useState<AICodeIncident[]>(INITIAL_AI_CODE_INCIDENTS);
  const [aiFilterStatus, setAiFilterStatus] = useState<"all" | "High Suspicion" | "Moderate" | "Human Verified">("all");
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  
  // Submit Code Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState(ALL_STUDENT_DOSSIERS[10]?.fullNameEn || "Abd alhadi eabd alhamaid");
  const [selectedAssignment, setSelectedAssignment] = useState("FreeRTOS Priority Preemption & Mutex Lock");
  const [inputFileName, setInputFileName] = useState("freertos_task_sync.c");
  const [inputSourceCode, setInputSourceCode] = useState("");
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);

  // Inspect Modal State
  const [inspectingIncident, setInspectingIncident] = useState<AICodeIncident | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // Presets for quick code submission testing
  const sampleAIGeneratedCode = `/**
 * DLMS optical port communication handshake.
 * This function initiates the optical connection with the smart meter.
 */
int dlms_initiate_optical_handshake(const char *port_name, int baud_rate) {
    if (port_name == NULL || baud_rate <= 0) {
        return -1; // Invalid parameters
    }
    // Step 1: Open optical serial communication channel
    SerialPort* port = serial_open(port_name, baud_rate);
    if (!port) {
        return -2; // Port open failure
    }
    // Step 2: Transmit standard IEC 62056-21 start sign: /?!<CR><LF>
    const char* start_seq = "/?!\\r\\n";
    serial_write(port, start_seq, strlen(start_seq));
    // Step 3: Wait for baud identification response from meter
    char buffer[64];
    int bytes_read = serial_read_timeout(port, buffer, sizeof(buffer), 2000);
    if (bytes_read <= 0) {
        serial_close(port);
        return -3; // No response from meter optical eye
    }
    return 0; // Handshake successful
}`;

  const sampleHumanEngineeredCode = `void USART1_IRQHandler(void) {
    uint32_t isrflags = USART1->SR;
    uint32_t cr1its   = USART1->CR1;
    // Direct RXNE register bit check
    if ((isrflags & USART_SR_RXNE) && (cr1its & USART_CR1_RXNEIE)) {
        uint8_t byte = (uint8_t)(USART1->DR & 0xFF);
        BaseType_t xHigherPriorityTaskWoken = pdFALSE;
        // Ringbuffer ISR bypass without dynamic heap
        if (g_rx_head < RX_BUFFER_SIZE) {
            g_raw_frame_buf[g_rx_head++] = byte;
            if (byte == 0x7E && g_rx_head > 4) { // HDLC frame flag
                xSemaphoreGiveFromISR(xDlmsFrameSem, &xHigherPriorityTaskWoken);
            }
        }
        portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
    }
    if (isrflags & USART_SR_ORE) {
        volatile uint32_t dummy = USART1->DR; // Clear overrun flag
        (void)dummy;
    }
}`;

  // Analyze and Submit Student Code Handler
  const handleAnalyzeAndSubmit = () => {
    if (!inputSourceCode.trim()) {
      toast({
        title: "Source Code Required",
        description: "Please paste or write candidate source code before scanning.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzingCode(true);

    setTimeout(() => {
      // Heuristic analysis calculation
      const code = inputSourceCode;
      const lower = code.toLowerCase();

      const hasHardwareRegisters =
        code.includes("->SR") ||
        code.includes("->CR") ||
        code.includes("0x") ||
        code.includes("volatile") ||
        code.includes("portYIELD_FROM_ISR") ||
        code.includes("USART");

      const hasAIPatterns =
        lower.includes("step 1:") ||
        lower.includes("step 2:") ||
        lower.includes("this function") ||
        lower.includes("invalid parameters") ||
        lower.includes("handshake successful") ||
        (code.includes("/**") && code.includes("* @param"));

      let aiProbability = 68;
      let detectedModel = "Claude 3.5 Sonnet Idiomatic Pattern & Error Handlers";
      let status: "High Suspicion" | "Moderate" | "Human Verified" = "Moderate";
      let perplexity = 38.4;
      let burstiness = 0.32;
      let uniformity = 74;
      let flaggedTokens = 18;

      if (hasHardwareRegisters && !hasAIPatterns) {
        aiProbability = 11;
        detectedModel = "Natural Human Authored (Low-Level Hardware Registers)";
        status = "Human Verified";
        perplexity = 158.2;
        burstiness = 0.86;
        uniformity = 22;
        flaggedTokens = 2;
      } else if (hasAIPatterns || code.length > 300) {
        aiProbability = 93;
        detectedModel = "GPT-4o Boilerplate Signature & Generic Sequential Comments";
        status = "High Suspicion";
        perplexity = 16.7;
        burstiness = 0.12;
        uniformity = 94;
        flaggedTokens = 42;
      }

      const newIncident: AICodeIncident = {
        id: `AI-${Math.floor(100 + Math.random() * 900)}`,
        studentName: selectedStudentName,
        assignment: selectedAssignment,
        aiProbability,
        detectedModelPattern: detectedModel,
        fileSource: inputFileName || "submission_source.c",
        status,
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        perplexityScore: perplexity,
        burstinessScore: burstiness,
        astUniformityScore: uniformity,
        flaggedTokensCount: flaggedTokens,
        codeSnippet: inputSourceCode,
      };

      setAiIncidents((prev) => [newIncident, ...prev]);
      setIsAnalyzingCode(false);
      setIsSubmitModalOpen(false);
      setInputSourceCode("");

      toast({
        title: "AI Detection Scan Complete",
        description: `Candidate: ${newIncident.studentName} · Likelihood: ${aiProbability}% (${status})`,
      });
    }, 900);
  };

  // Filtered AI Incidents
  const filteredAIIncidents = useMemo(() => {
    return aiIncidents.filter((inc) => {
      const matchesStatus =
        aiFilterStatus === "all" || inc.status === aiFilterStatus;
      const matchesSearch =
        !aiSearchQuery.trim() ||
        inc.studentName.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
        inc.assignment.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
        inc.fileSource.toLowerCase().includes(aiSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [aiIncidents, aiFilterStatus, aiSearchQuery]);

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
      {/* TAB 3: AI CODE DETECTION (SUBMIT CODE & HEURISTIC SCANNER)                */}
      {/* ========================================================================= */}
      {activeTab === "ai_code" && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            {/* Header with Submit Code Action */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Code Generation Detector & Heuristic Inspector
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-2xl">
                  Inspect student code submissions for AI generation probability using AST uniformity, token perplexity, and LLM signature patterns (GPT-4o, Claude 3.5 Sonnet, Copilot).
                </p>
              </div>

              {/* Action Button: Submit Student Code */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="h-10 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-[#c8102e] hover:from-purple-700 hover:to-[#a00d24] text-white shadow-md shadow-purple-900/20 cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Code for AI Detection</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search candidate name, assignment, or file..."
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl bg-slate-50/50 dark:bg-white/[0.02]"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 self-start sm:self-auto">
                <button
                  onClick={() => setAiFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiFilterStatus === "all"
                      ? "bg-white dark:bg-[#121218] text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  All ({aiIncidents.length})
                </button>
                <button
                  onClick={() => setAiFilterStatus("High Suspicion")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiFilterStatus === "High Suspicion"
                      ? "bg-white dark:bg-[#121218] text-red-600 dark:text-red-400 shadow-sm"
                      : "text-slate-600 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  High ({aiIncidents.filter((i) => i.status === "High Suspicion").length})
                </button>
                <button
                  onClick={() => setAiFilterStatus("Moderate")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiFilterStatus === "Moderate"
                      ? "bg-white dark:bg-[#121218] text-amber-600 dark:text-amber-400 shadow-sm"
                      : "text-slate-600 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  Moderate ({aiIncidents.filter((i) => i.status === "Moderate").length})
                </button>
                <button
                  onClick={() => setAiFilterStatus("Human Verified")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiFilterStatus === "Human Verified"
                      ? "bg-white dark:bg-[#121218] text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  Clean ({aiIncidents.filter((i) => i.status === "Human Verified").length})
                </button>
              </div>
            </div>

            {/* AI Scanned Incidents List */}
            <div className="space-y-4">
              {filteredAIIncidents.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Bot className="w-10 h-10 mx-auto mb-2 opacity-40 text-purple-400" />
                  <p className="text-sm font-semibold">No submissions match the current filter</p>
                </div>
              ) : (
                filteredAIIncidents.map((ai) => (
                  <div
                    key={ai.id}
                    className="p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-purple-400">
                          {ai.id}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {ai.studentName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-neutral-400">
                          • {ai.assignment}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {ai.fileSource}
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          {ai.submittedAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-neutral-300">
                        Identified Signature: <strong>{ai.detectedModelPattern}</strong>
                      </p>

                      {/* Mini Heuristics Bar */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                        <span>Perplexity: <strong className="text-slate-800 dark:text-neutral-200">{ai.perplexityScore}</strong></span>
                        <span>Burstiness: <strong className="text-slate-800 dark:text-neutral-200">{ai.burstinessScore}</strong></span>
                        <span>AST Uniformity: <strong className="text-slate-800 dark:text-neutral-200">{ai.astUniformityScore}%</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="text-right">
                        <span
                          className={`text-lg font-black ${
                            ai.aiProbability > 75
                              ? "text-red-500"
                              : ai.aiProbability > 45
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {ai.aiProbability}% AI Probability
                        </span>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Confidence Index
                        </div>
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

                      {/* Inspect Code Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInspectingIncident(ai);
                          setIsInspectModalOpen(true);
                        }}
                        className="h-8 px-3 text-xs font-semibold rounded-xl border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Inspect Code
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* DIALOG 1: SUBMIT STUDENT CODE FOR AI DETECTION                            */}
          {/* ========================================================================= */}
          <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8">
              <DialogHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Submit Candidate Code for AI Heuristic Inspection
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                  Select a candidate from the cohort or specify their name, paste their source code, and run the multi-factor LLM detection pipeline.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {/* Candidate Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                    Candidate Name
                  </label>
                  <select
                    value={selectedStudentName}
                    onChange={(e) => setSelectedStudentName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    {Object.values(ALL_STUDENT_DOSSIERS).map((d) => (
                      <option key={d.id} value={d.fullNameEn} className="bg-slate-900 text-white">
                        {d.fullNameEn} ({d.departmentEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment & Filename */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                      Competency Task / Assignment
                    </label>
                    <select
                      value={selectedAssignment}
                      onChange={(e) => setSelectedAssignment(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      <option value="FreeRTOS Priority Preemption & Mutex Lock">FreeRTOS Priority Preemption & Mutex Lock</option>
                      <option value="DLMS Optical Port Communication Handshake">DLMS Optical Port Communication Handshake</option>
                      <option value="MQTT Telemetry Ingestion Microservice">MQTT Telemetry Ingestion Microservice</option>
                      <option value="Smart Metering Tamper Detection Firmware">Smart Metering Tamper Detection Firmware</option>
                      <option value="Low-Power STM32 Sleep Mode & RTC Wakeup">Low-Power STM32 Sleep Mode & RTC Wakeup</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                      File Source Name
                    </label>
                    <Input
                      placeholder="e.g. modbus_driver.c or task_sync.ts"
                      value={inputFileName}
                      onChange={(e) => setInputFileName(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Quick Sample Insertion Buttons */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">Quick Test Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInputSourceCode(sampleAIGeneratedCode);
                      setInputFileName("dlms_optical_client.c");
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    Load AI Code (GPT-4o Boilerplate)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputSourceCode(sampleHumanEngineeredCode);
                      setInputFileName("stm32_usart_isr.c");
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                  >
                    Load Human Code (Hardware Registers)
                  </button>
                </div>

                {/* Code Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                      Source Code Content
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {inputSourceCode.split("\n").length} lines · {inputSourceCode.length} chars
                    </span>
                  </div>
                  <Textarea
                    placeholder="Paste student source code here for inspection..."
                    value={inputSourceCode}
                    onChange={(e) => setInputSourceCode(e.target.value)}
                    rows={10}
                    className="font-mono text-xs p-3.5 rounded-2xl bg-slate-900 text-slate-100 border-slate-800 focus:border-purple-500 resize-y"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitModalOpen(false)}
                  disabled={isAnalyzingCode}
                  className="rounded-xl h-10 px-4 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAnalyzeAndSubmit}
                  disabled={isAnalyzingCode || !inputSourceCode.trim()}
                  className="rounded-xl h-10 px-6 text-xs font-bold bg-gradient-to-r from-purple-600 to-[#c8102e] text-white hover:opacity-90 shadow-lg shadow-purple-900/20 flex items-center gap-2"
                >
                  {isAnalyzingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Computing LLM Entropy & Heuristics...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Run AI Heuristics Scan & Submit</span>
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ========================================================================= */}
          {/* DIALOG 2: INSPECT SUBMITTED CODE & DIAGNOSTICS                            */}
          {/* ========================================================================= */}
          <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8">
              {inspectingIncident && (
                <div className="space-y-5">
                  <DialogHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {inspectingIncident.id}
                        </span>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                          AI Inspection Report · {inspectingIncident.studentName}
                        </DialogTitle>
                      </div>
                      <Badge
                        className={
                          inspectingIncident.status === "High Suspicion"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : inspectingIncident.status === "Moderate"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        }
                      >
                        {inspectingIncident.status}
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                      Assignment: {inspectingIncident.assignment} · File: {inspectingIncident.fileSource} · Scanned: {inspectingIncident.submittedAt}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Diagnostic Metrics Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                    <div className="text-center p-2 rounded-xl bg-white dark:bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Probability</span>
                      <span className={`text-xl font-black mt-1 block ${inspectingIncident.aiProbability > 75 ? "text-red-500" : inspectingIncident.aiProbability > 45 ? "text-amber-500" : "text-emerald-500"}`}>
                        {inspectingIncident.aiProbability}%
                      </span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white dark:bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Perplexity Score</span>
                      <span className="text-xl font-bold mt-1 block text-slate-800 dark:text-neutral-200">
                        {inspectingIncident.perplexityScore}
                      </span>
                      <span className="text-[9px] text-slate-400">Lower = More AI</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white dark:bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Burstiness Index</span>
                      <span className="text-xl font-bold mt-1 block text-slate-800 dark:text-neutral-200">
                        {inspectingIncident.burstinessScore}
                      </span>
                      <span className="text-[9px] text-slate-400">Lower = Uniform</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white dark:bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AST Uniformity</span>
                      <span className="text-xl font-bold mt-1 block text-slate-800 dark:text-neutral-200">
                        {inspectingIncident.astUniformityScore}%
                      </span>
                      <span className="text-[9px] text-slate-400">Syntax repetition</span>
                    </div>
                  </div>

                  {/* Pattern Description */}
                  <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs">
                    <span className="font-bold text-purple-400 block mb-0.5">Identified Pattern Signature:</span>
                    <p className="text-slate-700 dark:text-neutral-300">{inspectingIncident.detectedModelPattern}</p>
                  </div>

                  {/* Submitted Source Code Display */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 block">
                      Submitted Source Code ({inspectingIncident.fileSource})
                    </span>
                    <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                      <pre>{inspectingIncident.codeSnippet}</pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAiIncidents((prev) =>
                          prev.map((item) =>
                            item.id === inspectingIncident.id
                              ? { ...item, status: "Human Verified", aiProbability: 5 }
                              : item
                          )
                        );
                        setIsInspectModalOpen(false);
                        toast({
                          title: "Marked as Human Verified",
                          description: `${inspectingIncident.studentName}'s submission cleared.`,
                        });
                      }}
                      className="rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Clear / Verify as Human
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        setIsInspectModalOpen(false);
                        toast({
                          title: "Flagged for Council",
                          description: `${inspectingIncident.studentName}'s submission sent to Academic Integrity Board.`,
                        });
                      }}
                      className="rounded-xl text-xs font-bold bg-[#c8102e] hover:bg-[#a00d24] text-white"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      Refer to Academic Council
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

