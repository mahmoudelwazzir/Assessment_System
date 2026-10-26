"use client";

import { RoleSidebar } from "./role-sidebar";
import { RoleRouter } from "./role-router";
import { Menu, ShieldCheck, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalCommandPalette } from "./command-palette";

export function RoleLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, roleContext } = useAuth();

  const roleName =
    roleContext?.assignedRole || user?.accountRole || "User";

  return (
    <RoleRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50/80 dark:bg-[#09090d] text-foreground">
        {/* Role Sidebar */}
        <RoleSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Global Header Bar */}
          <header className="h-16 px-4 lg:px-8 bg-white/80 dark:bg-[#101015]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-neutral-300" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden sm:inline">
                  Elsewedy Assessment System
                </span>
                <span className="text-slate-300 dark:text-neutral-600 hidden sm:inline">
                  /
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8102e]/10 text-[#c8102e] dark:text-[#ff4d6a] border border-[#c8102e]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {roleName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-neutral-400 transition-all cursor-pointer shadow-2xs"
                title="Open Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline font-medium">Search or command...</span>
                <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300 shadow-2xs">
                  Ctrl K
                </kbd>
              </button>

              {/* User details */}
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.fullName || "User"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                  {user?.email}
                </p>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c8102e] to-[#e8192f] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {(user?.fullName || "U").charAt(0).toUpperCase()}
              </div>

              {/* Theme Switcher */}
              <ThemeToggle />
            </div>
          </header>

          {/* Main Scrollable Content */}
          <main className="flex-1 overflow-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      <GlobalCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </RoleRouter>
  );
}
