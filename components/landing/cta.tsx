"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CTA() {
  const router = useRouter();

  return (
    <section className="py-28 px-6 lg:px-8 bg-[#080809] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#121218] via-[#150a0c] to-[#1a0c0e] border border-white/10 overflow-hidden shadow-2xl">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 elsewedy-grid opacity-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8102e]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative px-8 py-16 lg:px-16 lg:py-20 z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 mb-6">
                Institutional Quality Standard
              </span>

              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                Start Assessing with
                <br />
                <span className="bg-gradient-to-r from-[#c8102e] via-[#ff4d6a] to-white bg-clip-text text-transparent">
                  Institutional Precision
                </span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-300 mb-8 leading-relaxed">
                Join Elsewedy Technical Academy departments in streamlining evaluations,
                tracking multi-trial competency recovery, and enforcing academic integrity.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Multi-Trial Grading Cycles (Trials A-D)",
                  "Standardized Rubric Matrices",
                  "Role-Based Governance (Control / Assessor / Verifier)",
                  "Complete Immutable Audit Trails",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#c8102e]/20 border border-[#c8102e]/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d6a]" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#c8102e] via-[#e8192f] to-[#a00d25] hover:opacity-95 text-white font-bold text-sm shadow-[0_8px_24px_rgba(200,16,46,0.38)] hover:shadow-[0_12px_28px_rgba(200,16,46,0.52)] active:scale-[0.99] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Access Assessment System</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Centralized Assessment System Operational • v2.4 CAS</span>
          </div>
          <div>
            © 2026 Elsewedy Electric & Technical Academy. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
