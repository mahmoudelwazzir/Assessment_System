"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import DotGrid from "@/components/ui/DotGrid";
import { MagneticButton } from "./magnetic-button";
import { motion } from "framer-motion";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0b0f19] to-slate-950">
      {/* React Bits Dot Grid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={2}
          gap={32}
          baseColor="#334155"
          activeColor="#c8102e"
          proximity={160}
          shockRadius={220}
          shockStrength={6}
          resistance={700}
          returnDuration={1.5}
        />
      </div>

      {/* Subtle radial ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full text-center py-20 z-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 shadow-lg mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#c8102e]" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Elsewedy Assessment Infrastructure
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
        >
          Institutional Assessment
          <br />
          <span className="bg-gradient-to-r from-[#c8102e] via-red-400 to-[#c8102e] bg-clip-text text-transparent">
            for Engineering Excellence
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Precision tools for technical evaluations. Streamline candidate scoring,
          track multi-trial competencies, and enforce institutional quality with automated audits.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton
            onClick={() => router.push("/login")}
            className="px-8 py-3.5 rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-red-900/20"
          >
            Access Portal
            <ArrowRight className="w-4 h-4 ml-2 inline-block" />
          </MagneticButton>
          <MagneticButton
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 rounded-xl border border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold text-base transition-all duration-300 shadow-lg backdrop-blur-sm"
          >
            Explore Platform
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
