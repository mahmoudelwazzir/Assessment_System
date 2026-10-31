"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Moon,
  Sun,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

// =============================================================================
// PRESETS FOR RAPID ACCESS & TESTING (REAL DATABASE ACCOUNTS)
// =============================================================================
const DEMO_PRESETS = [
  {
    role: "Control",
    title: "Lead User (Control / Admin)",
    email: "admin@elsewedy.com",
    password: "123",
    badge: "Control Center",
    badgeClass: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  {
    role: "Assessor",
    title: "Eng. Zainab (Teacher / Assessor)",
    email: "teacher1@elsewedy.com",
    password: "123",
    badge: "Technical Assessor",
    badgeClass: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  {
    role: "Student",
    title: "Hussein Mohamed (Student Portal)",
    email: "student1@elsewedy.com",
    password: "123",
    badge: "Student Portal",
    badgeClass: "border-red-500/30 text-red-400 bg-red-500/10",
  },
  {
    role: "Verifier",
    title: "Student 2 (Verification / QA)",
    email: "student2@elsewedy.com",
    password: "123",
    badge: "Internal QA",
    badgeClass: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
];

// =============================================================================
// AUTHENTIC ELSEWEDY ELECTROMETER LOGO COMPONENT
// Matches https://centerlizedlogin.sewedy.com.eg/login exactly
// =============================================================================
function ElsewedyLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`relative ${
          isSm ? "w-8 h-8" : isLg ? "w-11 h-11" : "w-9 h-9"
        } shrink-0`}
      >
        <img
          src="/elsewedy-emblem.png"
          alt="Elsewedy Electrometer"
          className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(226,24,54,0.4)]"
        />
      </div>
      <div className="flex flex-col text-left leading-none tracking-tight">
        <span
          className={`${
            isSm ? "text-[13px]" : isLg ? "text-[18px]" : "text-[15px]"
          } font-black uppercase tracking-tight`}
        >
          <span className="text-[#a0a5ad]">EL</span>
          <span className="text-[#e21836]">SEWEDY</span>
        </span>
        <span
          className={`${
            isSm ? "text-[8.5px]" : isLg ? "text-[11px]" : "text-[9.5px]"
          } font-black uppercase tracking-wider mt-0.5`}
        >
          <span className="text-[#e21836]">ELECTRO</span>
          <span className="text-[#a0a5ad]">METER</span>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("admin@elsewedy.com");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>("Control");
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  // Mouse spotlight coordinates for the interactive dark grid
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const navigate = useNavigate();
  const router = {
    push: (p: string) => navigate(p),
    replace: (p: string) => navigate(p, { replace: true }),
    back: () => navigate(-1),
  };
  const { login } = useAuth();
  const { toast } = useToast();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSelectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword(preset.password || "123");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter your email or username and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);

      toast({
        title: "Authenticated Successfully",
        description: "Welcome to Elsewedy Electrometer Portal.",
      });

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const role = (user.accountRole || "").toLowerCase();
        if (role === "student") {
          router.push("/dashboard");
        } else if (role === "controller" || role === "control") {
          router.push("/controller/dashboard");
        } else if (role === "assessor") {
          router.push("/assessor/students");
        } else if (role === "verifier") {
          router.push("/verifier/results");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid credentials. Please verify your email and password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f2f2f7] flex flex-col font-sans selection:bg-[#e21836]/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Atmospheric Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-[#e21836] blur-[160px] pointer-events-none"
      />

      <div className="flex-1 grid lg:grid-cols-12 min-h-screen relative z-10">
        {/* ========================================================================= */}
        {/* LEFT PANEL: BRAND SHOWCASE (MATCHES LIVE REFERENCE EXACTLY)               */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleMouseMove}
          className="hidden lg:flex lg:col-span-6 xl:col-span-6 bg-[#07070a] border-r border-white/5 flex-col justify-between p-12 lg:p-16 xl:p-20 relative overflow-hidden select-none"
        >
          {/* Subtle Dotted Matrix Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.16) 1.2px, transparent 1.2px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Dynamic Flashlight Glow that follows cursor on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(226, 24, 54, 0.09), transparent 70%)`,
            }}
          />

          {/* Authentic Concentric Geometric Rings (Top-Right) */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.02, 1],
            }}
            transition={{
              rotate: { duration: 180, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-16 -right-24 w-[600px] h-[600px] pointer-events-none"
          >
            <svg viewBox="0 0 600 600" fill="none" className="w-full h-full">
              <circle
                cx="420"
                cy="180"
                r="105"
                stroke="#e21836"
                strokeWidth="1.2"
                strokeOpacity="0.32"
              />
              <circle
                cx="420"
                cy="180"
                r="195"
                stroke="#e21836"
                strokeWidth="1.2"
                strokeOpacity="0.22"
              />
              <circle
                cx="420"
                cy="180"
                r="290"
                stroke="#e21836"
                strokeWidth="1.2"
                strokeOpacity="0.14"
              />
            </svg>
          </motion.div>

          {/* Diagonal Lines Texture (Bottom-Right, matching reference) */}
          <div className="absolute -bottom-10 right-4 w-96 h-96 pointer-events-none">
            <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
              <line
                x1="60"
                y1="380"
                x2="320"
                y2="40"
                stroke="#e21836"
                strokeWidth="1.6"
                strokeOpacity="0.28"
              />
              <line
                x1="90"
                y1="380"
                x2="350"
                y2="40"
                stroke="#e21836"
                strokeWidth="1.6"
                strokeOpacity="0.28"
              />
              <line
                x1="120"
                y1="380"
                x2="380"
                y2="40"
                stroke="#e21836"
                strokeWidth="1.6"
                strokeOpacity="0.28"
              />
              <line
                x1="150"
                y1="380"
                x2="410"
                y2="40"
                stroke="#e21836"
                strokeWidth="1.6"
                strokeOpacity="0.28"
              />
            </svg>
          </div>

          {/* Top Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <ElsewedyLogo size="md" />
          </motion.div>

          {/* Center Showcase Narrative */}
          <div className="relative z-10 my-auto py-10 max-w-xl text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-6"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#e21836]">
                CENTRALIZED ACCESS SYSTEM
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="text-4xl sm:text-5xl xl:text-[56px] font-black text-white leading-[1.08] tracking-tight mb-6"
            >
              Power Your
              <br />
              <span className="text-[#e21836]">Operations</span>
              <br />
              Intelligently.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[15px] text-neutral-400 leading-relaxed max-w-md"
            >
              Access real-time metering data, analytics, and fleet management
              tools in one secure platform.
            </motion.p>

            {/* Subtle Divider Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-32 h-[1px] bg-white/10 my-8 origin-left"
            />

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-2 gap-4 max-w-sm"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-[#111218]/90 border border-white/5 backdrop-blur-sm hover:border-[#e21836]/40 transition-colors shadow-sm"
              >
                <div className="text-2xl font-black text-[#e21836] tracking-tight tabular-nums">
                  10+
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  SYSTEMS
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-[#111218]/90 border border-white/5 backdrop-blur-sm hover:border-[#e21836]/40 transition-colors shadow-sm"
              >
                <div className="text-2xl font-black text-[#e21836] tracking-tight tabular-nums">
                  99.9%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  UPTIME
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Left Footer Copyright */}
          <div className="relative z-10 pt-4 text-xs text-neutral-600">
            © 2026 Elsewedy Electrometer. All rights reserved.
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: SIGN IN WORKSPACE (PIXEL PERFECT & HIGH ENGAGEMENT)          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 relative overflow-y-auto transition-colors duration-200 border-l border-slate-200/80 dark:border-white/5">
          {/* Top Bar: Functional Dark/Light Mode Pill Badge */}
          <div className="relative z-10 flex items-center justify-end w-full">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer shadow-sm"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Center Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 w-full max-w-[420px] mx-auto my-auto py-6"
          >
            {/* Centered Brand Logo */}
            <div className="flex justify-center mb-6">
              <ElsewedyLogo size="lg" />
            </div>

            {/* Header Titles */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
                Sign in to your Elsewedy Electrometer account to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Email / Username */}
              <div className="space-y-2 text-left">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400"
                >
                  EMAIL OR USERNAME
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="hadym2429@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedRole(null);
                    }}
                    disabled={isLoading}
                    className="h-12 bg-white dark:bg-[#12131b] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 focus:border-[#e21836] focus:ring-2 focus:ring-[#e21836]/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 rounded-xl text-sm transition-all px-4 shadow-2xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 text-left">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400"
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setSelectedRole(null);
                    }}
                    disabled={isLoading}
                    className="h-12 bg-white dark:bg-[#12131b] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 focus:border-[#e21836] focus:ring-2 focus:ring-[#e21836]/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 rounded-xl text-sm transition-all px-4 pr-11 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Change Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-neutral-300"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-[#e21836] text-white shadow-[0_0_8px_rgba(226,24,54,0.6)]"
                        : "border border-slate-300 dark:border-neutral-700 bg-white dark:bg-[#12131b]"
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowAccountsModal(true)}
                  className="text-[#e21836] hover:underline font-medium cursor-pointer transition-colors"
                >
                  Change password?
                </button>
              </div>

              {/* Sign In Button with Luminous Glow & Tactile Response */}
              <motion.div
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#d91438] via-[#e5193f] to-[#c8102e] hover:brightness-110 text-white font-bold rounded-xl text-sm shadow-[0_8px_26px_rgba(226,24,54,0.45)] hover:shadow-[0_10px_34px_rgba(226,24,54,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 group relative overflow-hidden"
                >
                  {/* Sheen sweep animation */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Bottom Access Note */}
            <div className="mt-7 text-center text-xs text-slate-500 dark:text-neutral-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setShowAccountsModal(true)}
                className="text-[#e21836] hover:underline font-medium cursor-pointer"
              >
                Request access
              </button>
            </div>

            {/* Quick Role Fill Selector */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center">
              <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-mono mb-3">
                Quick Preset: click a role to autofill
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {DEMO_PRESETS.map((preset) => {
                  const isSelected = selectedRole === preset.role;
                  return (
                    <motion.button
                      key={preset.role}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#e21836] text-white border-[#e21836] shadow-[0_0_12px_rgba(226,24,54,0.45)]"
                          : "bg-white dark:bg-white/[0.03] text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                      }`}
                    >
                      {preset.role}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="hidden lg:block h-6" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACCOUNTS CREDENTIALS MODAL                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAccountsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-lg bg-white dark:bg-[#141419] border border-slate-200 dark:border-white/15 rounded-2xl p-6 text-slate-900 dark:text-white shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#e21836]/20 text-[#e21836]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Active System Accounts</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Live database accounts with password:{" "}
                      <code className="text-[#e21836] dark:text-white font-mono bg-slate-100 dark:bg-white/15 px-1.5 py-0.5 rounded">
                        123
                      </code>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAccountsModal(false)}
                  className="text-slate-400 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white text-lg px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {DEMO_PRESETS.map((preset) => (
                  <div
                    key={preset.role}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {preset.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${preset.badgeClass}`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-neutral-300 font-mono mt-1">
                        {preset.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleSelectPreset(preset);
                        setShowAccountsModal(false);
                      }}
                      className="bg-[#e21836] hover:bg-[#b80f2d] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-center text-xs text-slate-500 dark:text-neutral-400">
                <span>
                  Default password: <strong>123</strong>
                </span>
                <Button
                  onClick={() => setShowAccountsModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white text-xs h-8 px-4 rounded-xl cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
