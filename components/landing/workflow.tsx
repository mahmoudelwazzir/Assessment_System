"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardList,
  UserCheck,
  ShieldCheck,
  BarChart4,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    role: "Control Panel",
    icon: ClipboardList,
    title: "Cycle & Rubric Setup",
    description:
      "Initialize assessment rounds, map industrial competencies, and assign student cohorts to assessors.",
  },
  {
    step: "02",
    role: "Assessor Portal",
    icon: UserCheck,
    title: "Multi-Trial Evaluation",
    description:
      "Execute standardized rubrics for practical and oral demonstrations across structured attempts (Trials A through D).",
  },
  {
    step: "03",
    role: "Verifier Audit",
    icon: ShieldCheck,
    title: "Internal Verification QA",
    description:
      "Sample submissions, inspect grade integrity against institutional rubrics, and authorize final marks.",
  },
  {
    step: "04",
    role: "Executive Oversight",
    icon: BarChart4,
    title: "Institutional Reporting",
    description:
      "Generate certified competency transcripts, identify curriculum gaps, and maintain complete compliance audit trails.",
  },
];

export function Workflow() {
  const router = useRouter();

  return (
    <section id="workflow" className="py-28 px-6 lg:px-8 bg-[#080809] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8102e]/15 border border-[#c8102e]/30 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4d6a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d6a]">
              Operational Lifecycle
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Institutional Workflow Integrity
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            From setup to certification, every milestone is orchestrated with multi-tier checks and balances.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="h-full p-8 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#c8102e]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[#ff4d6a] font-mono">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                      {step.role}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#c8102e]/15 border border-[#c8102e]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <step.icon className="w-6 h-6 text-[#ff4d6a]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.04] via-[#160c0e] to-white/[0.04] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full bg-[#c8102e]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                Begin Student Assessment Now
              </h3>
              <p className="text-sm text-neutral-300">
                Log in to execute rubrics, review candidate submissions, or inspect cycle health.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold text-sm h-12 px-8 shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              Access Assessment Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
