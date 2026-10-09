"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  Shield,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCourseRounds,
  useEngineers,
  useCourseRoundInstructorsByCourseRound,
  useAssignInstructor,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const ROLE_NAME_TO_ID: Record<string, number> = {
  Assessor: 1,
  Control: 2,
  Verifier: 3,
};

interface LocalAssignment {
  courseRoundId: number;
  roleName: string;
}

const getCycleStatus = (round: any) => {
  if (!round.startDate || !round.endDate) {
    return {
      status: "unknown",
      label: "No Dates",
      color:
        "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10",
    };
  }

  const now = new Date();
  const start = new Date(round.startDate);
  const end = new Date(round.endDate);

  if (now < start) {
    return {
      status: "upcoming",
      label: "Upcoming",
      color:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
    };
  } else if (now > end) {
    return {
      status: "past",
      label: "Concluded",
      color:
        "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-500 border-slate-200 dark:border-white/10",
    };
  } else {
    return {
      status: "active",
      label: "Active Cycle",
      color:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
    };
  }
};

export default function AssignPage() {
  const { toast } = useToast();

  const { data: courseRounds, isLoading: loadingRounds } = useCourseRounds();
  const { data: engineers, isLoading: loadingEngineers } = useEngineers();
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

  const {
    data: existingAssignments,
    isLoading: loadingAssignments,
    refetch: refetchAssignments,
  } = useCourseRoundInstructorsByCourseRound(selectedCycleId);

  const { assign, updateRole, isLoading: isSaving } = useAssignInstructor();

  useEffect(() => {
    if (courseRounds && !selectedCycleId) {
      const activeCycle = courseRounds.find((c) => c.isActive);
      if (activeCycle) {
        setSelectedCycleId(activeCycle.id);
      } else if (courseRounds.length > 0) {
        setSelectedCycleId(courseRounds[0].id);
      }
    }
  }, [courseRounds, selectedCycleId]);

  const assignableUsers = useMemo(() => {
    if (!engineers) return [];
    return engineers.filter((e) => e.isActive);
  }, [engineers]);

  const [assignments, setAssignments] = useState<
    Record<number, LocalAssignment>
  >({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (selectedCycleId && assignableUsers.length > 0) {
      const init: Record<number, LocalAssignment> = {};
      assignableUsers.forEach((u) => {
        const existing = existingAssignments?.find(
          (a) => a.accountId === u.id && a.courseRoundId === selectedCycleId,
        );
        init[u.id] = {
          courseRoundId: selectedCycleId,
          roleName: existing?.roleName || "",
        };
      });
      setAssignments(init);
      setSaved({});
    }
  }, [selectedCycleId, assignableUsers, existingAssignments]);

  const handleCycleChange = (cycleId: string) => {
    setSelectedCycleId(Number.parseInt(cycleId, 10));
    setSaved({});
  };

  const handleChange = (userId: number, roleName: string) => {
    setAssignments((prev) => ({
      ...prev,
      [userId]: {
        courseRoundId: selectedCycleId!,
        roleName,
      },
    }));
    setSaved((prev) => ({ ...prev, [userId]: false }));
  };

  const handleSave = async (userId: number) => {
    const a = assignments[userId];
    if (!a.roleName || !selectedCycleId) {
      toast({
        title: "Role Required",
        description: "Please select an assigned role before saving.",
        variant: "destructive",
      });
      return;
    }

    const roleId = ROLE_NAME_TO_ID[a.roleName];
    if (!roleId) {
      toast({
        title: "Invalid Role",
        description: "The selected role is unrecognized.",
        variant: "destructive",
      });
      return;
    }

    try {
      const existing = existingAssignments?.find((e) => e.accountId === userId);

      if (existing) {
        await updateRole(existing.id, roleId);
      } else {
        await assign({
          courseRoundId: selectedCycleId,
          accountId: userId,
          roleId,
        });
      }

      setSaved((prev) => ({ ...prev, [userId]: true }));
      toast({
        title: "Assignment Updated",
        description: `Role assigned successfully for ${assignableUsers.find((u) => u.id === userId)?.fullNameEn}.`,
      });
      refetchAssignments();
    } catch (error) {
      console.error("Assignment error:", error);
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error ? error.message : "Failed to save assignment",
        variant: "destructive",
      });
    }
  };

  const selectedCycle = courseRounds?.find((c) => c.id === selectedCycleId);
  const isLoading = loadingRounds || loadingEngineers || loadingAssignments;

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Loading faculty assignments...
          </span>
        </div>
      </div>
    );
  }

  if (!courseRounds || courseRounds.length === 0) {
    return (
      <div className="py-12 flex justify-center">
        <Card className="p-8 max-w-md w-full text-center rounded-2xl bg-white dark:bg-[#121218] border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            No Active Cycles
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Create an assessment cycle first before configuring role assignments.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Staff Governance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <Shield className="w-3.5 h-3.5" />
                {assignableUsers.length} Faculty Staff
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Faculty Role Allocation
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Designate Assessors and Verifiers for scheduled assessment rounds.
              Permissions and grading privileges apply directly upon saving.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Active Round
            </span>
            <span className="text-xl font-extrabold text-white block mt-0.5">
              Round {selectedCycle?.roundNumber || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Target Round Selector Card */}
      <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <label
              htmlFor="cycle-select"
              className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1.5"
            >
              Select Target Cycle
            </label>
            <Select
              value={selectedCycleId?.toString()}
              onValueChange={handleCycleChange}
            >
              <SelectTrigger id="cycle-select" className="h-11 rounded-xl">
                <SelectValue placeholder="Choose cycle..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {courseRounds.map((c) => {
                  const cycleStatus = getCycleStatus(c);
                  return (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      Round {c.roundNumber} ({cycleStatus.label})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedCycle && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-neutral-300">
              <Calendar className="w-4 h-4 text-[#c8102e]" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Cycle Window:
                </span>{" "}
                <span className="font-mono">
                  {selectedCycle.startDate
                    ? new Date(selectedCycle.startDate).toLocaleDateString()
                    : "—"}{" "}
                  →{" "}
                  {selectedCycle.endDate
                    ? new Date(selectedCycle.endDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Staff Assignment Table */}
      <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Faculty Directory ({assignableUsers.length} Members)
          </p>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
            Select role and save per member
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="text-left px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Staff Member
                </th>
                <th className="text-left px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Assigned Round Role
                </th>
                <th className="text-right px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {assignableUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-slate-400 dark:text-neutral-500"
                  >
                    No eligible staff found for role assignment.
                  </td>
                </tr>
              ) : (
                assignableUsers.map((user) => {
                  const a = assignments[user.id];
                  const isSaved = saved[user.id];
                  const initials = user.fullNameEn
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {user.fullNameEn}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Select
                          value={a?.roleName || ""}
                          onValueChange={(v) => handleChange(user.id, v)}
                          disabled={isSaving}
                        >
                          <SelectTrigger className="w-40 h-10 rounded-xl text-xs font-semibold">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Assessor">
                              Technical Assessor
                            </SelectItem>
                            <SelectItem value="Verifier">
                              Internal Verifier
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isSaved ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleSave(user.id)}
                            disabled={isSaving || !a?.roleName}
                            className="rounded-xl px-4 h-9 text-xs bg-[#c8102e] hover:bg-[#b00d27] text-white font-bold"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5 mr-1.5" />
                                Save Role
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
