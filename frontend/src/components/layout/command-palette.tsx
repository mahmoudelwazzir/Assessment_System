"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  UserPlus,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  Moon,
  Sun,
  LogOut,
  Laptop,
  Search,
  Sparkles,
} from "lucide-react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "@/lib/theme-provider";
import { useAuth } from "@/lib/auth-context";

interface GlobalCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalCommandPalette({
  open,
  onOpenChange,
}: GlobalCommandPaletteProps) {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuth();

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search portal (e.g. students, cycles, radar)..." />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>No matching commands or pages found.</CommandEmpty>

        {/* --- Navigation Group --- */}
        <CommandGroup heading="Quick Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate("/controller/dashboard"))}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4 text-[#c8102e]" />
            <span>Controller Command Center</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/controller/cycles"))}
            className="cursor-pointer"
          >
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span>Assessment Cycle Rounds</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/controller/assign"))}
            className="cursor-pointer"
          >
            <UserCheck className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Assign Faculty Assessors</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/controller/enroll"))}
            className="cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4 text-amber-500" />
            <span>Enroll Candidates</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/assessor/students"))}
            className="cursor-pointer"
          >
            <GraduationCap className="mr-2 h-4 w-4 text-purple-500" />
            <span>Assessor Student Evaluations</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/verifier/results"))}
            className="cursor-pointer"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-teal-500" />
            <span>Verifier Internal QA Gate</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/dashboard"))}
            className="cursor-pointer"
          >
            <Sparkles className="mr-2 h-4 w-4 text-rose-500" />
            <span>Student Portal & Competency Radar</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate("/controller/statistics"))}
            className="cursor-pointer"
          >
            <BarChart3 className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Institutional Analytics & Statistics</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* --- Theme & Preferences --- */}
        <CommandGroup heading="System Preferences">
          <CommandItem
            onSelect={() =>
              runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
            className="cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-slate-700" />
            )}
            <span>Toggle Dark / Light Mode</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => setTheme("system"))}
            className="cursor-pointer"
          >
            <Laptop className="mr-2 h-4 w-4 text-slate-500" />
            <span>System Default Theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* --- Account Actions --- */}
        <CommandGroup heading={`Account (${user?.fullName || "User"})`}>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                logout();
                navigate("/login");
              })
            }
            className="text-red-500 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out Session</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

