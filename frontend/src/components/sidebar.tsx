"use client";

import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Calendar,
  LayoutList,
  UserCircle,
  FolderKanban,
  CheckSquare,
  FileText,
  BarChart2,
  LineChart,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const router = { push: (path: string) => navigate(path) };
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart2,
    },
    {
      label: "My Project",
      href: "/dashboard",
      icon: FolderKanban,
    },
    {
      label: "Tasks",
      href: "/dashboard",
      icon: CheckSquare,
    },
    {
      label: "Reports",
      href: "/dashboard",
      icon: FileText,
    },
    {
      label: "My Team Progress",
      href: "/dashboard",
      icon: LineChart,
    },
    {
      label: "Team Reports",
      href: "/dashboard",
      icon: BarChart2,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)] justify-between select-none">
      <div>
        {/* Logo Area matching Elsewedy Dashboard */}
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
        <nav className="p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 font-semibold text-sm cursor-pointer",
                  isActive
                    ? "bg-[#d91438] text-white shadow-md shadow-red-600/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#d91438] hover:bg-red-50/80 transition-colors font-bold text-sm cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
