"use client";

import { Award, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

export function Stats() {
  const stats = [
    {
      value: "100%",
      label: "Audit Traceability",
      description: "Immutable evaluation history across cycles",
      icon: ShieldCheck,
    },
    {
      value: "4 Trials",
      label: "Structured Recovery",
      description: "Progressive remediation path (Trials A-D)",
      icon: TrendingUp,
    },
    {
      value: "3 Tiers",
      label: "Verification Hierarchy",
      description: "Control, Technical Assessor & Verifier roles",
      icon: Award,
    },
    {
      value: "0.0s",
      label: "Discrepancy Drift",
      description: "Instant rubric sync with central database",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="stats" className="py-24 px-6 lg:px-8 bg-[#0a0a0f] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8102e]/15 border border-[#c8102e]/30 mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d6a]">
              Quality Assurance Standards
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Institutional Rigor by the Numbers
          </h2>
          <p className="text-base text-neutral-300 leading-relaxed">
            Standardized technical education governance across industrial competencies.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-[#c8102e]/40 hover:bg-white/[0.05] transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#c8102e]/15 border border-[#c8102e]/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <stat.icon className="w-6 h-6 text-[#ff4d6a]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-neutral-200 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-neutral-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

