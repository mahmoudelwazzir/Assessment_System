"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d91438] flex items-center justify-center shadow-md shadow-red-900/20">
              <div className="w-4 h-4 rounded-full border-2 border-white" />
            </div>
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
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#d91438] text-white shadow-md shadow-red-600/30"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Log Out Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[#d91438] hover:bg-red-50/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Role Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#d91438] border border-red-200/60 text-xs font-bold tracking-wide uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-[#d91438]" />
          STUDENT DASHBOARD
        </div>

        {/* Header Title with Red Checkmark */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome,{" "}
            <span className="border-2 border-[#d91438] rounded-xl px-3 py-0.5 text-slate-900 bg-white shadow-sm inline-block">
              {studentName}
            </span>
          </h1>
          <div className="w-7 h-7 rounded-full bg-[#d91438] flex items-center justify-center text-white shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-8 font-medium">
          Track your capstone progress, deliverables, and upcoming phases
        </p>

        {/* ========================================================================= */}
        {/* CARD 1: TIME MANAGER                                                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Time Manager
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Your progress
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#d91438] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: "78%" }}
                />
              </div>
              <span className="text-sm font-bold text-[#d91438] shrink-0 font-mono">
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
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: ALL TASKS (3-COLUMN GRID)                                     */}
        {/* ========================================================================= */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Tasks
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            9 Total Deliverables
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SEEDED_TASKS.map((task) => {
            const isPending = task.status === "PENDING";
            const isLate = task.status === "COMPLETED LATE";
            const isCompleted = task.status === "COMPLETED";

            const badgeBg = isPending
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : isLate
                ? "bg-amber-100/70 text-amber-800 border-amber-300"
                : "bg-emerald-50 text-emerald-700 border-emerald-200";

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all flex flex-col justify-between text-left group"
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
                  <Button
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                    className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs font-bold px-4 h-8 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Task Details Dialog */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 text-slate-800 shadow-2xl relative text-left border border-slate-100">
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
          </div>
        </div>
      )}
    </div>
  );
}
