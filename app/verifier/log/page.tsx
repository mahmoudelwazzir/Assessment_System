"use client";

import { useState, useEffect } from "react";
import { Clock, Sparkles, Activity, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";

export default function VerifierLogPage() {
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const logs = await api.reports.getActivityLog({ limit: 100 });
        setActivityLog(logs || []);
      } catch (error) {
        console.error("Failed to fetch activity log:", error);
        setActivityLog([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Audit Trail
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <History className="w-3.5 h-3.5" />
                {activityLog.length} Recorded Events
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Activity & Audit Log
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Immutable telemetry log recording assessment submissions, verifier
              audits, role modifications, and report dispatches.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Log Status
            </span>
            <span className="text-sm font-extrabold text-emerald-400 block mt-0.5">
              Live Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Log Feed Card */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Event Stream ({activityLog.length} Records)
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Chronological order
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 animate-spin text-[#c8102e] mb-2" />
            <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Loading activity telemetry...
            </span>
          </div>
        ) : activityLog.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
            No system activity logged for this cycle.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {activityLog.map((log: any, idx: number) => (
              <div
                key={log.id || idx}
                className="p-5 sm:px-6 sm:py-4 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-[#c8102e] dark:text-[#ff4d6a] border border-slate-200/80 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {log.actionType || "System Action"}
                    </p>
                    {log.entityType && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                        {log.entityType}
                      </span>
                    )}
                  </div>

                  {log.newValue && (
                    <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1">
                      {log.newValue}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-neutral-500 mt-1 font-mono flex-wrap">
                    {log.entityId && <span>Entity #{log.entityId}</span>}
                    {log.userId && <span>User ID: {log.userId}</span>}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {log.createdAt && (
                    <span className="text-xs text-slate-400 dark:text-neutral-500 font-mono">
                      {new Date(log.createdAt).toLocaleDateString()}{" "}
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
