"use client";

import { Clock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function PendingAssignmentScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0a0a0f] p-6">
      <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] p-8 sm:p-10 text-center shadow-xl shadow-black/5">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
          <Clock className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          Status: Pending Assignment
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Awaiting Role Assignment
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.fullName || "Colleague"}</span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          You have not been assigned to an active cycle yet. Please notify the Institutional Controller to allocate your evaluation or verification rounds.
        </p>
        <Button
          onClick={handleLogout}
          className="w-full gap-2 rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white shadow-lg shadow-[#c8102e]/20 py-2.5 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Portal
        </Button>
      </div>
    </div>
  );
}
