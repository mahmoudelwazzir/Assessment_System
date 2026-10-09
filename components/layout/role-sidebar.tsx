"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Users,
  ClipboardList,
  History,
  RefreshCw,
  FileText,
  BookOpen,
  Send,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import type { AccountRole } from "@/lib/types";
import { useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navByRole: Record<AccountRole, NavItem[]> = {
  controller: [
    {
      label: "Dashboard",
      href: "/controller/dashboard",
      icon: LayoutDashboard,
    },
    { label: "Students", href: "/controller/students", icon: Users },
    {
      label: "Enroll Students",
      href: "/controller/enroll",
      icon: ClipboardList,
    },
    {
      label: "Statistics",
      href: "/controller/statistics",
      icon: ClipboardList,
    },
    { label: "Assign Roles", href: "/controller/assign", icon: ClipboardList },
    { label: "Cycles", href: "/controller/cycles", icon: RefreshCw },
  ],
  assessor: [
    { label: "Students", href: "/assessor/students", icon: Users },
    { label: "Competencies", href: "/assessor/competencies", icon: BookOpen },
    { label: "Submissions", href: "/assessor/submissions", icon: FileText },
  ],
  verifier: [
    { label: "Monitor", href: "/verifier/results", icon: ClipboardList },
    { label: "Competencies", href: "/verifier/competencies", icon: BookOpen },
    { label: "Send Report", href: "/verifier/report", icon: Send },
    { label: "Activity Log", href: "/verifier/log", icon: History },
  ],
};

interface RoleSidebarProps {
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

export function RoleSidebar({ isOpen = true, onClose }: RoleSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, roleContext, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/landing");
  };

  const handleNavClick = (href: string) => {
    router.push(href);
    onClose?.();
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const accountRole = user?.accountRole ?? "assessor";
  const effectiveRole = roleContext?.assignedRole || accountRole;
  const navItems = navByRole[effectiveRole] ?? [];

  const roleLabel: Record<AccountRole, string> = {
    controller: "Control",
    assessor: "Assessor",
    verifier: "Verifier",
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Modern Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0c0c11] text-slate-800 dark:text-neutral-200 flex flex-col h-screen border-r border-slate-200/90 dark:border-white/10 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-36">
              <Image
                src="/elsewedy-logo.png"
                alt="Elsewedy Logo"
                width={160}
                height={55}
                className="w-full h-auto object-contain filter brightness-100 dark:brightness-110 drop-shadow-sm"
              />
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c8102e] to-[#e8192f] text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
              {(user?.fullName || "E").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {user?.fullName || "Staff Member"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c8102e]/10 text-[#c8102e] dark:text-[#ff4d6a] border border-[#c8102e]/20">
                  <Shield className="w-3 h-3" />
                  {roleLabel[effectiveRole]}
                </span>
                {roleContext?.classGroup && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-neutral-400 bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded-md">
                    Class {roleContext.classGroup}
                  </span>
                )}
              </div>
            </div>
          </div>

          {roleContext?.cycleName && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/5 text-[10px] text-slate-500 dark:text-neutral-400 font-mono truncate">
              CYCLE: <span className="text-slate-700 dark:text-neutral-200 font-semibold">{roleContext.cycleName}</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Menu Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 font-semibold text-xs cursor-pointer group",
                  isActive
                    ? "bg-[#c8102e] text-white shadow-[0_4px_16px_rgba(200,16,46,0.25)] font-bold"
                    : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                      isActive ? "text-white" : "text-slate-400 dark:text-neutral-400 group-hover:text-slate-700 dark:group-hover:text-white",
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
