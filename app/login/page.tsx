"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

// Demo accounts configured in the live database with password: 123456
const DEMO_PRESETS = [
  {
    role: "Student",
    title: "Student (Abd alhadi)",
    email: "hadym2429@gmail.com",
    badge: "Student Portal",
    badgeClass: "border-red-500/30 text-red-400 bg-red-500/10",
  },
  {
    role: "Control",
    title: "System Admin / Control",
    email: "controller@gmail.com",
    badge: "Control Center",
    badgeClass: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  {
    role: "Assessor",
    title: "Technical Assessor",
    email: "eng2@gmail.com",
    badge: "Evaluation QA",
    badgeClass: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  {
    role: "Verifier",
    title: "Internal Verifier",
    email: "eng@gmail.com",
    badge: "Internal QA",
    badgeClass: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("hadym2429@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>("Student");
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSelectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword("123456");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter your email/username and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);

      toast({
        title: "Authenticated Successfully",
        description: "Welcome to Elsewedy Assessment Platform.",
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
    <div className="min-h-screen bg-[#07070a] text-[#f2f2f7] flex flex-col font-sans selection:bg-[#d91438]/30 selection:text-white relative overflow-hidden">
      {/* Dual-Panel Split Screen matching centerlizedlogin.sewedy.com.eg/login */}
      <div className="flex-1 grid lg:grid-cols-12 min-h-screen">
        {/* ========================================================================= */}
        {/* LEFT PANEL: ELSEWEDY ELECTROMETER BRAND SHOWCASE                          */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 bg-[#08080c] border-r border-white/5 flex-col justify-between p-12 xl:p-16 relative overflow-hidden select-none">
          {/* Subtle Geometric Background Art: Concentric Circles & Diagonal Lines */}
          <div className="absolute top-12 right-[-100px] w-[500px] h-[500px] pointer-events-none opacity-20">
            <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
              <circle cx="350" cy="150" r="100" stroke="#d91438" strokeWidth="1.2" />
              <circle cx="350" cy="150" r="180" stroke="#d91438" strokeWidth="1.2" />
              <circle cx="350" cy="150" r="260" stroke="#d91438" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="absolute bottom-16 right-16 w-80 h-80 pointer-events-none opacity-15">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <line x1="20" y1="20" x2="160" y2="180" stroke="#d91438" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="180" y2="180" stroke="#d91438" strokeWidth="1.5" />
              <line x1="60" y1="20" x2="200" y2="180" stroke="#d91438" strokeWidth="1.5" />
              <line x1="80" y1="20" x2="220" y2="180" stroke="#d91438" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d91438] flex items-center justify-center shadow-lg shadow-red-900/40">
                <div className="w-5 h-5 rounded-full border-2 border-white/90" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase leading-none">
                  ELSEWEDY
                </span>
                <span className="text-[11px] font-bold tracking-widest text-[#d91438] uppercase leading-tight mt-0.5">
                  ELECTROMETER
                </span>
              </div>
            </div>
          </div>

          {/* Center Content Headline & Narrative */}
          <div className="relative z-10 my-auto py-8 max-w-xl">
            {/* Tag */}
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d91438] mb-5">
              CENTRALIZED ACCESS SYSTEM
            </p>

            {/* Huge Headline matching screenshot */}
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.12] tracking-tight mb-6">
              Power Your
              <br />
              <span className="text-[#d91438]">Operations</span>
              <br />
              Intelligently.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-neutral-400 leading-relaxed max-w-md">
              Access real-time metering data, analytics, and fleet management tools
              in one secure platform.
            </p>

            {/* Bottom Two Stats Boxes */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-2xl font-black text-[#d91438] tracking-tight">
                  10+
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  SYSTEMS
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-2xl font-black text-[#d91438] tracking-tight">
                  99.9%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  UPTIME
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer Copyright */}
          <div className="relative z-10 pt-4 text-xs text-neutral-500">
            © 2026 Elsewedy Electrometer. All rights reserved.
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: SIGN IN FORM                                                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 bg-[#0a0a0f] flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 relative overflow-y-auto">
          {/* Top Bar: Dark Mode Pill Badge */}
          <div className="relative z-10 flex items-center justify-end w-full">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Moon className="w-3.5 h-3.5 text-neutral-400" />
              <span>Dark</span>
            </button>
          </div>

          {/* Center Form Container */}
          <div className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
            {/* Logo matching screenshot */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-[#d91438] flex items-center justify-center shadow-md">
                <div className="w-4 h-4 rounded-full border-2 border-white/90" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tight text-white uppercase leading-none">
                  ELSEWEDY
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#d91438] uppercase leading-tight mt-0.5">
                  ELECTROMETER
                </span>
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-left mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                Sign in to your Elsewedy Electrometer account to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Email / Username */}
              <div className="space-y-2 text-left">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400"
                >
                  EMAIL OR USERNAME
                </label>
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
                  className="h-12 bg-[#12121a] border-white/10 hover:border-white/20 focus:border-[#d91438] focus:ring-1 focus:ring-[#d91438] text-white placeholder:text-neutral-600 rounded-xl text-sm transition-all px-4"
                />
              </div>

              {/* Password */}
              <div className="space-y-2 text-left">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400"
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
                    className="h-12 bg-[#12121a] border-white/10 hover:border-white/20 focus:border-[#d91438] focus:ring-1 focus:ring-[#d91438] text-white placeholder:text-neutral-600 rounded-xl text-sm transition-all px-4 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Change password row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer ${
                      rememberMe
                        ? "bg-[#d91438] text-white"
                        : "border border-neutral-700 bg-[#12121a]"
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowAccountsModal(true)}
                  className="text-[#d91438] hover:underline font-medium cursor-pointer"
                >
                  Change password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#d91438] to-[#b80f2d] hover:brightness-110 text-white font-bold rounded-xl text-sm shadow-[0_6px_24px_rgba(217,20,56,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </form>

            {/* Bottom Access Note */}
            <div className="mt-8 text-center text-xs text-neutral-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setShowAccountsModal(true)}
                className="text-[#d91438] hover:underline font-medium cursor-pointer"
              >
                Request access
              </button>
            </div>

            {/* Demo Helper & Quick Role Fill Buttons */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-[11px] text-neutral-500 font-mono mb-3">
                Demo: admin@elsewedy.com / password
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {DEMO_PRESETS.map((preset) => {
                  const isSelected = selectedRole === preset.role;
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#d91438] text-white border-[#d91438] shadow-sm"
                          : "bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {preset.role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Empty spacer for bottom balance */}
          <div className="hidden lg:block h-6" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACCOUNTS GUIDE MODAL                                                      */}
      {/* ========================================================================= */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141419] border border-white/15 rounded-2xl p-6 text-white shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#d91438]/20 text-[#d91438]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Active System Accounts</h3>
                  <p className="text-xs text-neutral-400">
                    Live database accounts with password: <code className="text-white font-mono bg-white/15 px-1.5 py-0.5 rounded">123456</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountsModal(false)}
                className="text-neutral-400 hover:text-white text-lg px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {DEMO_PRESETS.map((preset) => (
                <div
                  key={preset.role}
                  className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {preset.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${preset.badgeClass}`}>
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-mono mt-1">
                      {preset.email}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSelectPreset(preset);
                      setShowAccountsModal(false);
                    }}
                    className="bg-[#d91438] hover:bg-[#b80f2d] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-neutral-400">
              <span>Default password: <strong>123456</strong></span>
              <Button
                onClick={() => setShowAccountsModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs h-8 px-4 rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
