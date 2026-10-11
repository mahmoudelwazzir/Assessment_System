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
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface TaskItem {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "COMPLETED LATE" | "COMPLETED";
  deadline: string;
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

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const studentName = user?.fullName || "Abd alhadi eabd alhamaid";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: BarChart2 },
    { name: "My Project", icon: FolderKanban },
    { name: "Tasks", icon: CheckSquare },
    { name: "Reports", icon: FileText },
    { name: "My Team Progress", icon: LineChart },
    { name: "Team Reports", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex font-sans antialiased selection:bg-[#d91438]/20">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR MATCHING CAPSTONE MANAGEMENT SYSTEM                          */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-[2px_0_16px_rgba(0,0,0,0.02)] select-none">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
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
              <span className="text-xs font-bold tracking-tight text-slate-700 leading-tight mt-0.5">
                Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#d91438] text-white shadow-md shadow-red-600/30 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Log Out Button */}
        <div className="p-4 border-t border-slate-100">
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[#d91438] hover:bg-red-50/80 transition-colors cursor-pointer"
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
        {/* Role Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-[#d91438] border border-red-200/60 text-xs font-bold tracking-wide uppercase mb-3 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#d91438] animate-pulse" />
          STUDENT DASHBOARD
        </motion.div>

        {/* Header Title with Red Checkmark */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-2"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome,{" "}
            <span className="border-2 border-[#d91438] rounded-xl px-3 py-0.5 text-slate-900 bg-white shadow-xs inline-block">
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
          className="text-slate-500 text-sm mb-8 font-medium"
        >
          Track your capstone progress, deliverables, and upcoming phases
        </motion.p>

        {/* ========================================================================= */}
        {/* CARD 1: TIME MANAGER                                                      */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-shadow"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Time Manager
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Your progress
            </p>
          </div>

          {/* Progress Bar Container with Fluid Spring Fill */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{
                    duration: 1.2,
                    ease: [0.32, 0.72, 0, 1],
                    delay: 0.35,
                  }}
                  className="bg-gradient-to-r from-[#d91438] to-[#ff2b54] h-full rounded-full shadow-[0_0_12px_rgba(217,20,56,0.5)]"
                />
              </div>
              <span className="text-sm font-bold text-[#d91438] shrink-0 font-mono tabular-nums">
                78% submitted
              </span>
            </div>

            {/* Subtext */}
            <div className="text-center pt-2">
              <span className="text-xs font-semibold text-slate-500">
                7 of 9 tasks submitted
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: ALL TASKS (3-COLUMN GRID)                                     */}
        {/* ========================================================================= */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Tasks
          </h2>
          <span className="text-xs font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
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
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SEEDED_TASKS.map((task) => {
            const isPending = task.status === "PENDING";
            const isLate = task.status === "COMPLETED LATE";
            const isCompleted = task.status === "COMPLETED";

            const badgeBg = isPending
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : isLate
                ? "bg-amber-100/80 text-amber-800 border-amber-300"
                : "bg-emerald-50 text-emerald-700 border-emerald-200";

            return (
              <motion.div
                key={task.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
                  },
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 30px -8px rgba(0,0,0,0.08)",
                  borderColor: "rgba(203, 213, 225, 1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left group cursor-default"
              >
                <div>
                  {/* Card Header: Title & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#d91438] transition-colors leading-snug">
                      {task.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border shrink-0 ${badgeBg}`}
                    >
                      <Clock className="w-3 h-3" />
                      {task.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 font-normal">
                    {task.description}
                  </p>
                </div>

                {/* Footer: Deadline & Details Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium truncate">
                    {task.deadline}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                      className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs font-bold px-4 h-8 rounded-lg shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      Details
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
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
              className="w-full max-w-lg bg-white rounded-2xl p-6 text-slate-800 shadow-2xl relative text-left border border-slate-100"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#d91438] tracking-widest uppercase">
                    DELIVERABLE SPECIFICATION
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900 mt-1">
                    {selectedTask.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Status
                    </span>
                    <p className="text-xs font-bold text-[#d91438] mt-0.5">
                      {selectedTask.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Due Date
                    </span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {selectedTask.deadline}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Submission Links & Artifacts
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Google Classroom assignment templates, rubric benchmarks, and file upload dropzone.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTask(null)}
                  className="text-xs h-9 px-4 rounded-xl cursor-pointer"
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
