"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  FolderKanban,
  CheckSquare,
  FileText,
  BarChart2,
  LineChart,
  LogOut,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  GraduationCap,
  Layers,
  Search,
  Moon,
  Sun,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface TaskItem {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "COMPLETED LATE" | "COMPLETED";
  deadline: string;
}

interface CompetencyGradeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  totalScore: number;
  status: "Passed" | "Passed (2nd Attempt)" | "In Progress" | "Upcoming";
  attempts: {
    attemptNumber: number;
    score: number;
    date: string;
    remarks: string;
    assessor: string;
    verifier: string;
    status: "Pass" | "Retake Required" | "Pending";
  }[];
  criteria: {
    name: string;
    earned: number;
    max: number;
  }[];
}

interface TimelineItem {
  roundNumber: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  status: "Completed" | "In Progress" | "Upcoming";
  grade?: number;
  assessor: string;
  verifier: string;
  description: string;
  milestone: string;
}

const SEEDED_TASKS: TaskItem[] = [
  {
    id: "task-1",
    name: "Project Name & Description",
    description:
      "Update your project information by adding a clear, professional Project Name and concise summary.",
    status: "PENDING",
    deadline: "Deadline: Aug 21, 2026, 11:59 PM",
  },
  {
    id: "task-2",
    name: "Empathy Map",
    description:
      "Download the Empathy Map template from Google Classroom and complete it based on user interviews.",
    status: "PENDING",
    deadline: "Deadline: Sep 28, 2026, 11:59 PM",
  },
  {
    id: "task-3",
    name: "Affinity Map",
    description:
      "Download the Affinity Map template from Google Classroom, complete it based on collected user insights.",
    status: "COMPLETED LATE",
    deadline: "Deadline: Oct 03, 2026, 11:59 PM",
  },
  {
    id: "task-4",
    name: "SRS",
    description:
      "Download the SRS template from Google Classroom, complete it according to your project technical specifications.",
    status: "COMPLETED LATE",
    deadline: "Deadline: Oct 15, 2026, 11:59 PM",
  },
  {
    id: "task-5",
    name: "Capstone Development Timeline",
    description:
      "Download the Capstone Development Timeline template from Google Classroom, compile milestone deliverables.",
    status: "PENDING",
    deadline: "Deadline: Oct 25, 2026, 11:59 PM",
  },
  {
    id: "task-6",
    name: "Trello",
    description:
      "Create a Trello account and set up a team for your capstone project. Use the Kanban workflow for tracking.",
    status: "PENDING",
    deadline: "Deadline: Nov 05, 2026, 11:59 PM",
  },
  {
    id: "task-7",
    name: "User Research & Personas",
    description:
      "Conduct field interviews with industrial plant managers and construct archetypal user profiles.",
    status: "COMPLETED",
    deadline: "Deadline: Nov 12, 2026, 11:59 PM",
  },
  {
    id: "task-8",
    name: "System Architecture & Flow",
    description:
      "Design high-level microservices diagram, message queue broker architecture, and schema relationships.",
    status: "COMPLETED",
    deadline: "Deadline: Nov 20, 2026, 11:59 PM",
  },
  {
    id: "task-9",
    name: "Final Defense Presentation",
    description:
      "Prepare pitch deck presentation slides and interactive prototype demonstration for the evaluation committee.",
    status: "PENDING",
    deadline: "Deadline: Dec 01, 2026, 11:59 PM",
  },
];

const SEEDED_COMPETENCIES: CompetencyGradeItem[] = [
  {
    id: "comp-1",
    code: "COMP-SWE-301",
    name: "Full-Stack Web Engineering",
    category: "Software Engineering",
    totalScore: 94,
    status: "Passed",
    attempts: [
      {
        attemptNumber: 1,
        score: 94,
        date: "Sep 22, 2026",
        remarks:
          "Outstanding responsive design, clean Next.js App Router implementation, and comprehensive accessibility audit.",
        assessor: "Eng. Ahmed Tarek (Senior Assessor)",
        verifier: "Eng. Mostafa Verifier (Audit Approved)",
        status: "Pass",
      },
    ],
    criteria: [
      { name: "Frontend State Management & React Hooks", earned: 25, max: 25 },
      { name: "API Client Integration & Error Handling", earned: 24, max: 25 },
      { name: "Responsive Tailwind CSS & Animation", earned: 23, max: 25 },
      { name: "Form Validation & Clean Typography", earned: 22, max: 25 },
    ],
  },
  {
    id: "comp-2",
    code: "COMP-NET-302",
    name: "Enterprise C# & .NET Core Backend",
    category: "Software Engineering",
    totalScore: 88,
    status: "Passed (2nd Attempt)",
    attempts: [
      {
        attemptNumber: 1,
        score: 72,
        date: "Oct 05, 2026",
        remarks:
          "Repository abstraction was tightly coupled to controllers. Needed dedicated DTO mapping.",
        assessor: "Eng. Ahmed Tarek",
        verifier: "Eng. Mostafa Verifier",
        status: "Retake Required",
      },
      {
        attemptNumber: 2,
        score: 88,
        date: "Oct 12, 2026",
        remarks:
          "Refactored to Clean Architecture with MediatR and AutoMapper. Solid improvement in unit tests.",
        assessor: "Eng. Ahmed Tarek",
        verifier: "Eng. Mostafa Verifier",
        status: "Pass",
      },
    ],
    criteria: [
      { name: "Clean Architecture & Dependency Injection", earned: 23, max: 25 },
      { name: "Entity Framework Core & Index Optimization", earned: 22, max: 25 },
      { name: "JWT Security & Role-Based Auth", earned: 21, max: 25 },
      { name: "Unit Testing & Moq Coverage", earned: 22, max: 25 },
    ],
  },
  {
    id: "comp-3",
    code: "COMP-DBS-303",
    name: "Database Systems & SQL Optimization",
    category: "Database & Cloud",
    totalScore: 96,
    status: "Passed",
    attempts: [
      {
        attemptNumber: 1,
        score: 96,
        date: "Aug 29, 2026",
        remarks:
          "Top tier query execution plan analysis, 3NF database normalization, and ACID transaction safety.",
        assessor: "Eng. Sara Assessor",
        verifier: "Eng. Mostafa Verifier",
        status: "Pass",
      },
    ],
    criteria: [
      { name: "Relational Schema Design & Constraints", earned: 25, max: 25 },
      { name: "Stored Procedures & Trigger Logic", earned: 24, max: 25 },
      { name: "Query Indexing & Execution Plans", earned: 24, max: 25 },
      { name: "Data Integrity & Concurrency Control", earned: 23, max: 25 },
    ],
  },
  {
    id: "comp-4",
    code: "COMP-OPS-304",
    name: "Cloud Infrastructure & Docker DevOps",
    category: "DevOps & Cloud",
    totalScore: 82,
    status: "Passed",
    attempts: [
      {
        attemptNumber: 1,
        score: 82,
        date: "Sep 15, 2026",
        remarks:
          "Multi-stage Docker builds configured cleanly. GitHub Actions CI pipeline verified successfully.",
        assessor: "Eng. Ahmed Tarek",
        verifier: "Eng. Mostafa Verifier",
        status: "Pass",
      },
    ],
    criteria: [
      { name: "Containerization & Multi-stage Dockerfile", earned: 21, max: 25 },
      { name: "GitHub Actions CI Pipeline & Automated Tests", earned: 20, max: 25 },
      { name: "Environment Secrets & Config Provider", earned: 21, max: 25 },
      { name: "Health Checks & Reverse Proxy Routing", earned: 20, max: 25 },
    ],
  },
  {
    id: "comp-5",
    code: "COMP-IOT-305",
    name: "Industrial IoT & Hardware Telemetry",
    category: "Industrial Tech",
    totalScore: 89,
    status: "In Progress",
    attempts: [
      {
        attemptNumber: 1,
        score: 89,
        date: "Current Cycle - In Assessment",
        remarks:
          "Sensor telemetry telemetry ingestion verified over MQTT broker. Awaiting final Verifier sign-off.",
        assessor: "Eng. Ahmed Tarek",
        verifier: "Pending Verification",
        status: "Pending",
      },
    ],
    criteria: [
      { name: "MQTT Broker Integration & Packet Parsing", earned: 23, max: 25 },
      { name: "Industrial Modbus Sensor Streaming", earned: 22, max: 25 },
      { name: "Real-time Telemetry WebSocket Dashboard", earned: 22, max: 25 },
      { name: "Fault Tolerance & Hardware Watchdog", earned: 22, max: 25 },
    ],
  },
];

const SEEDED_TIMELINE: TimelineItem[] = [
  {
    roundNumber: 1,
    name: "Database Systems & SQL Optimization",
    category: "Database & Cloud",
    startDate: "Aug 10, 2026",
    endDate: "Aug 30, 2026",
    status: "Completed",
    grade: 96,
    assessor: "Eng. Sara Assessor",
    verifier: "Eng. Mostafa Verifier",
    description: "Design relational database, normalize schemas, optimize SQL queries, and implement transactions.",
    milestone: "Verified with Distinction",
  },
  {
    roundNumber: 2,
    name: "Full-Stack Web Engineering",
    category: "Software Engineering",
    startDate: "Sep 01, 2026",
    endDate: "Sep 22, 2026",
    status: "Completed",
    grade: 94,
    assessor: "Eng. Ahmed Tarek",
    verifier: "Eng. Mostafa Verifier",
    description: "Build reactive Next.js client with TypeScript, state management, and Elsewedy design system.",
    milestone: "Verified & Passed",
  },
  {
    roundNumber: 3,
    name: "Enterprise C# & .NET Core Backend",
    category: "Software Engineering",
    startDate: "Sep 25, 2026",
    endDate: "Oct 15, 2026",
    status: "Completed",
    grade: 88,
    assessor: "Eng. Ahmed Tarek",
    verifier: "Eng. Mostafa Verifier",
    description: "Architect REST API using Clean Architecture, Entity Framework Core, and token security.",
    milestone: "Passed (Retake Cycle Cleared)",
  },
  {
    roundNumber: 4,
    name: "Industrial IoT & Hardware Telemetry",
    category: "Industrial Tech",
    startDate: "Oct 16, 2026",
    endDate: "Nov 05, 2026",
    status: "In Progress",
    grade: 89,
    assessor: "Eng. Ahmed Tarek",
    verifier: "Assigned: Eng. Mostafa",
    description: "Connect plant sensors, capture industrial telemetry over MQTT, and render real-time streams.",
    milestone: "Active Assessment Round (4 Days Left)",
  },
  {
    roundNumber: 5,
    name: "Cloud Infrastructure & Docker DevOps",
    category: "DevOps & Cloud",
    startDate: "Nov 10, 2026",
    endDate: "Nov 30, 2026",
    status: "Upcoming",
    assessor: "Faculty Panel",
    verifier: "Elsewedy Verification Board",
    description: "Containerize microservices, build automated deployment pipelines, and configure cluster monitoring.",
    milestone: "Prerequisites Met - Cohort Scheduled",
  },
  {
    roundNumber: 6,
    name: "Capstone Final Defense & Industrial Audit",
    category: "Final Evaluation",
    startDate: "Dec 05, 2026",
    endDate: "Dec 20, 2026",
    status: "Upcoming",
    assessor: "Joint Academic & Industry Committee",
    verifier: "Elsewedy Technical Board",
    description: "Live prototype demonstration, system architecture defense, and industry panel evaluation.",
    milestone: "Graduation Requirement",
  },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const studentName = user?.fullName || "Abd alhadi eabd alhamaid";
  const studentEmail = user?.email || "student@elsewedy.com";
  const studentClass = "Class 1-A";
  const studentYear = "Year 3 (Software & Industrial Tech)";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: BarChart2, label: "Overview" },
    { name: "Competencies & Grades", icon: Award, label: "Attempts & Grades" },
    { name: "Competencies Timeline", icon: Calendar, label: "Timeline" },
    { name: "Tasks", icon: CheckSquare, label: "Deliverables" },
    { name: "Reports", icon: FileText, label: "Official Reports" },
  ];

  // Calculate student cumulative performance
  const gradedCompetencies = SEEDED_COMPETENCIES.filter((c) => c.status.startsWith("Passed") || c.status === "In Progress");
  const overallAverage = Math.round(
    gradedCompetencies.reduce((acc, c) => acc + c.totalScore, 0) / (gradedCompetencies.length || 1)
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#07070a] text-slate-800 dark:text-neutral-200 flex font-sans antialiased selection:bg-[#d91438]/20 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR                                                              */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white dark:bg-[#0c0c12] border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between shrink-0 shadow-[2px_0_16px_rgba(0,0,0,0.02)] select-none transition-colors duration-200">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d91438] to-[#ff2b54] flex items-center justify-center shadow-md shadow-red-900/20 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white" />
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-tight text-[#d91438] leading-none">
                  Elsewedy
                </span>
                <span className="text-xs font-bold tracking-tight text-slate-700 dark:text-neutral-200 leading-tight mt-0.5">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Quick Dark Mode Toggle in Sidebar Header */}
            <ThemeToggle className="lg:hidden" />
          </div>

          {/* Student Profile Quick Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/10 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d91438]/10 text-[#d91438] dark:text-[#ff4d6a] font-bold text-xs flex items-center justify-center shrink-0 border border-[#d91438]/20">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{studentName}</p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-semibold">{studentClass}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#d91438] text-white shadow-md shadow-red-600/30 font-bold"
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className={`text-[10px] ${isActive ? "text-red-100" : "text-slate-400 dark:text-neutral-500"}`}>
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Theme Toggle and Log Out Button */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 space-y-2">
          {/* Theme Switcher Row in Sidebar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-neutral-300">
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
              <Moon className="w-4 h-4 text-indigo-400 hidden dark:block" />
              <span>Theme Mode</span>
            </span>
            <ThemeToggle />
          </div>

          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-[#d91438] dark:text-[#ff4d6a] hover:bg-red-50/80 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </motion.button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Top Header Controls with Role Badge & Theme Switcher */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#d91438] dark:text-[#ff4d6a] border border-red-200/60 dark:border-red-900/40 text-xs font-bold tracking-wide uppercase shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#d91438] animate-pulse" />
            STUDENT PROFILE & ACADEMIC DOSSIER
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-neutral-300 bg-white dark:bg-[#111118] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
              <GraduationCap className="w-4 h-4 text-[#d91438] dark:text-[#ff4d6a]" />
              <span>{studentYear} · {studentClass}</span>
            </div>

            {/* Top Bar Theme Toggle */}
            <ThemeToggle className="shadow-xs" />
          </div>
        </div>

        {/* Header Title with Red Checkmark */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-2"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome,{" "}
            <span className="border-2 border-[#d91438] rounded-xl px-3 py-0.5 text-slate-900 dark:text-white bg-white dark:bg-[#111118] shadow-xs inline-block">
              {studentName}
            </span>
          </h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.25,
            }}
            className="w-7 h-7 rounded-full bg-[#d91438] flex items-center justify-center text-white shadow-sm"
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-500 dark:text-neutral-400 text-sm mb-8 font-medium"
        >
          Elsewedy Technical Academy · Continuous Competency Evaluation & Capstone Tracking
        </motion.p>

        {/* ========================================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW                                                */}
        {/* ========================================================================= */}
        {activeNav === "Dashboard" && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#111118] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                  Overall Score
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-[#d91438] dark:text-[#ff4d6a]">{overallAverage}%</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                    Distinction
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-2">Weighted average across modules</p>
              </div>

              <div className="bg-white dark:bg-[#111118] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                  Competencies Passed
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">4 / 5</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/30">
                    80% Cleared
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-2">1 module currently active</p>
              </div>

              <div className="bg-white dark:bg-[#111118] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                  Deliverables Status
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">7 / 9</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/30">
                    78% Done
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-2">2 pending tasks in cycle</p>
              </div>

              <div className="bg-white dark:bg-[#111118] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                  Academic Standing
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Rank #2</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                    Top 5%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-2">Within {studentClass}</p>
              </div>
            </div>

            {/* Time Manager Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white dark:bg-[#111118] rounded-2xl p-6 lg:p-8 border border-slate-200/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Capstone Deliverables Time Manager
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 dark:text-neutral-400 mt-0.5">
                    Your semester milestones progress
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveNav("Tasks")}
                  className="text-xs font-bold h-8 rounded-lg border-slate-200 dark:border-white/10 bg-transparent text-slate-700 dark:text-neutral-200"
                >
                  View All Tasks
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 dark:bg-white/10 rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                      className="bg-gradient-to-r from-[#d91438] to-[#ff2b54] h-full rounded-full shadow-[0_0_12px_rgba(217,20,56,0.5)]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#d91438] dark:text-[#ff4d6a] shrink-0 font-mono">
                    78% submitted
                  </span>
                </div>
                <div className="text-center pt-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    7 of 9 capstone deliverables submitted & verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#14141e] dark:to-[#0f0f16] text-white p-6 rounded-2xl border border-slate-700 dark:border-white/10 shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-800/60 inline-block mb-3">
                    Active Assessment Round
                  </span>
                  <h3 className="text-lg font-bold">Industrial IoT & Hardware Telemetry</h3>
                  <p className="text-xs text-slate-300 dark:text-neutral-300 mt-1 leading-relaxed">
                    Round 4 assessment is currently open. Ensure your MQTT telemetry brokers and hardware logs are uploaded before the cutoff.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700/60 dark:border-white/10">
                  <span className="text-xs font-mono text-amber-300 font-semibold">4 Days Remaining</span>
                  <Button
                    size="sm"
                    onClick={() => setActiveNav("Competencies & Grades")}
                    className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    View Rubric
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/30 inline-block mb-3">
                    Latest Assessment Feedback
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise C# & .NET Core Backend</h3>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed italic">
                    "Second attempt cleared with distinction (88%). Clean separation between Domain models and EF Core entities achieved."
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                  <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">Assessor: Eng. Ahmed Tarek</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveNav("Competencies Timeline")}
                    className="text-xs font-bold rounded-lg border-slate-200 dark:border-white/10 bg-transparent text-slate-700 dark:text-neutral-200"
                  >
                    View Timeline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ATTEMPTS & GRADES (AFFINITY MAP ITEM #5.1)                         */}
        {/* ========================================================================= */}
        {activeNav === "Competencies & Grades" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111118] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Competencies, Attempts & Grade History
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                  Complete breakdown of candidate attempts, rubric criteria scores, and assessor notes
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">Filter:</span>
                <select
                  aria-label="Filter competencies by discipline"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-slate-700 dark:text-neutral-200 outline-none focus:border-[#d91438]"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Database & Cloud">Database & Cloud</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Industrial Tech">Industrial Tech</option>
                </select>
              </div>
            </div>

            {/* List of Competency Cards */}
            <div className="space-y-4">
              {SEEDED_COMPETENCIES.filter(
                (c) => filterCategory === "All" || c.category === filterCategory
              ).map((comp) => {
                const isPassed = comp.status.startsWith("Passed");
                const hasRetake = comp.attempts.length > 1;

                return (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#d91438] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 font-bold text-base">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                              {comp.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                              {comp.category}
                            </span>
                            {hasRetake && (
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/30">
                                2 Attempts Recorded
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                            {comp.name}
                          </h3>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 block">
                            Final Score
                          </span>
                          <span className={`text-2xl font-black font-mono ${
                            comp.totalScore >= 90
                              ? "text-emerald-600 dark:text-emerald-400"
                              : comp.totalScore >= 75
                                ? "text-slate-900 dark:text-white"
                                : "text-amber-600 dark:text-amber-400"
                          }`}>
                            {comp.totalScore}%
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            isPassed
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                              : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"
                          }`}
                        >
                          {comp.status}
                        </span>
                      </div>
                    </div>

                    {/* Criteria Breakdown */}
                    <div className="py-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400 mb-3">
                        Rubric Criteria Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {comp.criteria.map((cr, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-100 dark:border-white/10 flex flex-col justify-between"
                          >
                            <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 line-clamp-1">
                              {cr.name}
                            </span>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-white/5">
                              <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">Earned / Max</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                                {cr.earned} / {cr.max}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attempts History */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#d91438] dark:text-[#ff4d6a]" />
                        Attempt History & Assessor Audit
                      </h4>
                      <div className="space-y-2.5">
                        {comp.attempts.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  Attempt #{att.attemptNumber}
                                </span>
                                <span className="text-slate-400 dark:text-neutral-600">·</span>
                                <span className="text-slate-500 dark:text-neutral-400 font-medium">{att.date}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    att.status === "Pass"
                                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                      : att.status === "Retake Required"
                                        ? "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300"
                                        : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                                  }`}
                                >
                                  {att.status}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-neutral-300 italic">"{att.remarks}"</p>
                              <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                                Assessed by: {att.assessor} | QA: {att.verifier}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                                {att.score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: COMPETENCIES TIMELINE (AFFINITY MAP ITEM #5.2)                    */}
        {/* ========================================================================= */}
        {activeNav === "Competencies Timeline" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Academic Competencies Timeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                Progression map tracking previous verified modules, active assessment cycles, and future curriculum milestones
              </p>
            </div>

            {/* Visual Timeline Stream */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-red-200 dark:border-red-950/80 space-y-8 my-6 ml-3">
              {SEEDED_TIMELINE.map((item, index) => {
                const isCompleted = item.status === "Completed";
                const isInProgress = item.status === "In Progress";
                const isUpcoming = item.status === "Upcoming";

                return (
                  <motion.div
                    key={item.roundNumber}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="relative"
                  >
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border-4 border-white dark:border-[#07070a] flex items-center justify-center shadow-xs ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isInProgress
                            ? "bg-[#d91438] text-white animate-pulse"
                            : "bg-slate-300 dark:bg-neutral-700 text-white"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : isInProgress ? (
                        <Clock className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Timeline Content Card */}
                    <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#d91438] dark:text-[#ff4d6a] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-100 dark:border-red-900/30">
                            Cycle Round {item.roundNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500">
                            {item.startDate} — {item.endDate}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.grade !== undefined && (
                            <span className="text-sm font-black font-mono text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                              {item.grade}%
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                                : isInProgress
                                  ? "bg-red-50 dark:bg-red-950/40 text-[#d91438] dark:text-[#ff4d6a] border-red-200 dark:border-red-900/30"
                                  : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                        <div>
                          <span>Faculty Assessor: {item.assessor}</span>
                          <span className="mx-2">·</span>
                          <span>Verifier: {item.verifier}</span>
                        </div>
                        <span className="text-[#d91438] dark:text-[#ff4d6a] font-bold">
                          {item.milestone}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: CAPSTONE DELIVERABLES (TASKS)                                      */}
        {/* ========================================================================= */}
        {activeNav === "Tasks" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Capstone Tasks & Deliverables
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
                  Submissions, Google Classroom deliverables, and deadline tracking
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-neutral-400 bg-white dark:bg-[#111118] px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                9 Total Deliverables
              </span>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {SEEDED_TASKS.map((task) => {
                const isPending = task.status === "PENDING";
                const isLate = task.status === "COMPLETED LATE";

                const badgeBg = isPending
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
                  : isLate
                    ? "bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/40"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";

                return (
                  <motion.div
                    key={task.id}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35 },
                      },
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 12px 30px -8px rgba(0,0,0,0.08)",
                    }}
                    className="bg-white dark:bg-[#111118] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#d91438] dark:group-hover:text-[#ff4d6a] transition-colors leading-snug">
                          {task.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border shrink-0 ${badgeBg}`}
                        >
                          <Clock className="w-3 h-3" />
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-6 font-normal">
                        {task.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium truncate">
                        {task.deadline}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                        className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs font-bold px-4 h-8 rounded-lg cursor-pointer"
                      >
                        Details
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: OFFICIAL REPORTS & TRANSCRIPT                                     */}
        {/* ========================================================================= */}
        {activeNav === "Reports" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Academic Transcript & Official Performance Record
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                  Verified assessment marks and competency certificates authenticated by Elsewedy Examination Board
                </p>
              </div>

              <Button
                onClick={() => {
                  const content = `ELSEWEDY TECHNICAL ACADEMY - STUDENT TRANSCRIPT\nStudent: ${studentName}\nEmail: ${studentEmail}\nClass: ${studentClass}\nCumulative Score: ${overallAverage}%\nStatus: Good Standing (Distinction)\n\nCOMPETENCY GRADES:\n` +
                    SEEDED_COMPETENCIES.map(c => `- ${c.code} ${c.name}: ${c.totalScore}% (${c.status})`).join("\n");
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Transcript_${studentName.replace(/\s+/g, "_")}.txt`;
                  a.click();
                }}
                className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Official Transcript
              </Button>
            </div>

            {/* Official Report Card Mockup */}
            <div className="bg-white dark:bg-[#0c0c12] rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#d91438] dark:text-[#ff4d6a]">
                    ELSEWEDY TECHNICAL ACADEMY
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                    Office of the Registrar & Quality Assurance
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300">DATE: OCT 2026</span>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    STATUS: AUDIT VERIFIED
                  </p>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-neutral-500 font-medium">Candidate:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-neutral-500 font-medium">Academic Year:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">Year 3 - Cohort 2026</p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-neutral-500 font-medium">Cohort Class:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{studentClass}</p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-neutral-500 font-medium">Cumulative GPA:</span>
                  <p className="font-bold text-[#d91438] dark:text-[#ff4d6a] mt-0.5 text-sm">{overallAverage}% (3.84 / 4.0)</p>
                </div>
              </div>

              {/* Competencies Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-slate-100 dark:border-white/10 text-slate-400 dark:text-neutral-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5">Code</th>
                      <th className="py-2.5">Competency Module</th>
                      <th className="py-2.5 text-center">Attempts</th>
                      <th className="py-2.5 text-center">Score</th>
                      <th className="py-2.5 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/10 font-medium text-slate-700 dark:text-neutral-300">
                    {SEEDED_COMPETENCIES.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="py-3 font-mono font-bold text-slate-500 dark:text-neutral-400">{comp.code}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{comp.name}</td>
                        <td className="py-3 text-center">{comp.attempts.length}</td>
                        <td className="py-3 text-center font-mono font-bold text-slate-900 dark:text-white">{comp.totalScore}%</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            comp.status.startsWith("Passed")
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                              : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                          }`}>
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-400 dark:text-neutral-500">
                <div>
                  <p className="font-bold text-slate-700 dark:text-neutral-300">Head of Examination Committee</p>
                  <p className="text-[10px] mt-1">Dr. Tarek Examination Board</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 dark:text-neutral-300">Lead QA Verifier</p>
                  <p className="text-[10px] mt-1">Dr. Mostafa Verification Dept</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Task Details Dialog with AnimatePresence */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-lg bg-white dark:bg-[#12121c] rounded-2xl p-6 text-slate-800 dark:text-neutral-200 shadow-2xl relative text-left border border-slate-100 dark:border-white/10"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-[#d91438] dark:text-[#ff4d6a] tracking-widest uppercase">
                    DELIVERABLE SPECIFICATION
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-1">
                    {selectedTask.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                    Description
                  </label>
                  <p className="text-sm text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 dark:bg-white/[0.04] rounded-xl border border-slate-100 dark:border-white/10">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase">
                      Status
                    </span>
                    <p className="text-xs font-bold text-[#d91438] dark:text-[#ff4d6a] mt-0.5">
                      {selectedTask.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase">
                      Due Date
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-neutral-200 mt-0.5">
                      {selectedTask.deadline}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                    Submission Links & Artifacts
                  </label>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    Google Classroom assignment templates, rubric benchmarks, and file upload dropzone.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTask(null)}
                  className="text-xs h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 bg-transparent text-slate-700 dark:text-neutral-300 cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setSelectedTask(null)}
                  className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs h-9 px-5 rounded-xl cursor-pointer"
                >
                  Open Deliverable
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
