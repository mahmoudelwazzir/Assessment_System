"use client";

import {
  BarChart3,
  Users,
  FileCheck,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Real-time insights into student performance, competency tracking, and institutional metrics.",
  },
  {
    icon: Users,
    title: "Student Management",
    description:
      "Comprehensive student profiles, assessment history, and progress tracking across all competencies.",
  },
  {
    icon: FileCheck,
    title: "Assessment Workflows",
    description:
      "Streamlined evaluation processes with multi-trial grading, rubric management, and automated calculations.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor individual and cohort progress with detailed analytics and performance trends over time.",
  },
  {
    icon: Shield,
    title: "Institutional Security",
    description:
      "Enterprise-grade security with role-based access control and complete audit trails.",
  },
  {
    icon: Zap,
    title: "Efficient Operations",
    description:
      "Reduce administrative overhead with automated workflows and intelligent task management.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6 lg:px-8 bg-[#0a0a0f] relative overflow-hidden border-t border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#c8102e]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[#e8192f]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8102e]/15 border border-[#c8102e]/30 mb-6 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#ff4d6a] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d6a]">
              Core Capabilities
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Everything You Need for
            <br />
            <span className="bg-gradient-to-r from-[#c8102e] via-[#ff4d6a] to-[#c8102e] bg-clip-text text-transparent">
              Industrial Assessment Excellence
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade infrastructure designed for vocational and engineering education rigor.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#c8102e]/40 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-[#c8102e]/15 border border-[#c8102e]/30 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-[#c8102e]/25 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-[#ff4d6a]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
