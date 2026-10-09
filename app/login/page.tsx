"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  ArrowLeft,
  Info,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

// Quick Preset Accounts matching database
const DEMO_ROLES = [
  {
    id: "control",
    roleName: "Control",
    title: "System Admin / Control",
    email: "controler@gmail.com",
    password: "123456",
    badge: "Control Panel",
    border: "border-red-500/40",
    text: "text-red-400",
    description: "Manage cycles, assign roles, enroll students & view analytics.",
  },
  {
    id: "assessor",
    roleName: "Assessor",
    title: "Technical Assessor",
    email: "eng2@gmail.com",
    password: "123456",
    badge: "Grading Portal",
    border: "border-amber-500/40",
    text: "text-amber-400",
    description: "Conduct evaluations, grade assignments & submit attempt marks.",
  },
  {
    id: "verifier",
    roleName: "Verifier",
    title: "Internal Verifier",
    email: "eng@gmail.com",
    password: "123456",
    badge: "Verification QA",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    description: "Review assessor marks, approve submissions & export reports.",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSelectRole = (role: (typeof DEMO_ROLES)[0]) => {
    setSelectedRole(role.id);
    setEmail(role.email);
    setPassword(role.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter both your email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);

      toast({
        title: "Welcome Back",
        description: "Signed in successfully. Redirecting...",
      });

      // Role-based redirection from storage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        switch (user.accountRole) {
          case "controller":
            router.push("/controller/dashboard");
            break;
          case "assessor":
            router.push("/assessor/students");
            break;
          case "verifier":
            router.push("/verifier/results");
            break;
          default:
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
    <div className="min-h-screen bg-[#080809] text-[#f2f2f7] flex flex-col font-sans selection:bg-[#c8102e]/30 selection:text-white relative">
      {/* Main Dual-Panel Split Screen */}
      <div className="flex-1 grid lg:grid-cols-12 min-h-screen">
        {/* ========================================================================= */}
        {/* LEFT PANEL: ELSEWEDY BRAND SHOWCASE (SOLID, OPAQUE, SHARP)               */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#0a0a0e] border-r border-white/10 flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
          {/* Subtle Accent Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#c8102e]/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#e8192f]/10 blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 elsewedy-grid opacity-25 pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <Link href="/" className="inline-block group transition-transform">
              <div className="w-52 xl:w-60">
                <Image
                  src="/elsewedy-logo.png"
                  alt="Elsewedy Logo"
                  width={240}
                  height={80}
                  priority
                  className="w-full h-auto object-contain filter brightness-110 drop-shadow-md"
                />
              </div>
            </Link>

            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6a] animate-pulse" />
                Centralized Access System
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                v2.4 CAS
              </span>
            </div>
          </div>

          {/* Center Showcase Narrative */}
          <div className="relative z-10 my-auto py-10 max-w-xl">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Next-Gen Assessment &{" "}
              <span className="text-[#e8192f]">
                Competency Platform
              </span>
            </h1>

            <p className="mt-4 text-sm xl:text-base text-neutral-300 leading-relaxed">
              Unified educational operations for Elsewedy Technical Academy.
              Standardized rubric evaluation, multi-tier grading integrity, and
              instant credential tracking across all technical disciplines.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid gap-3.5">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                <div className="p-2 rounded-lg bg-[#c8102e]/20 text-[#ff4d6a] mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Standardized Rubric Grading
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Objective evaluation matrices tailored to modern industrial competencies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                <div className="p-2 rounded-lg bg-[#c8102e]/20 text-[#ff4d6a] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Multi-Tier Verification QA
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Comprehensive checks and balances with internal verifier approvals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                <div className="p-2 rounded-lg bg-[#c8102e]/20 text-[#ff4d6a] mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Cycle & Workload Governance
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Real-time cycle scheduling, candidate enrollment, and automated audit trails.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security & Uptime Notice */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Assessment Services Operational</span>
            </div>
            <span>© 2026 Elsewedy Electric</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: INTERACTIVE SIGN-IN WORKSPACE                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-6 bg-[#0e0e13] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 relative overflow-y-auto">
          {/* Top Bar: Navigation & Tools */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer"
                title="View Demo Credentials"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#ff4d6a]" />
                <span className="hidden sm:inline">Accounts Guide</span>
              </button>

              <ThemeToggle />
            </div>
          </div>

          {/* Center Form Box */}
          <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <Image
                src="/elsewedy-logo.png"
                alt="Elsewedy Logo"
                width={200}
                height={70}
                className="h-12 w-auto object-contain brightness-110"
              />
            </div>

            {/* Header Titles */}
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Sign In
              </h2>
              <p className="mt-1.5 text-sm text-neutral-300">
                Sign in to your Elsewedy account to access the assessment portal.
              </p>
            </div>

            {/* Quick-Fill Role Selector */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff4d6a]" />
                  Quick Fill by Role
                </span>
                <span className="text-[11px] text-neutral-400">
                  Click to fill credentials
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {DEMO_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl text-center border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-[#c8102e]/25 border-[#c8102e] shadow-[0_0_16px_rgba(200,16,46,0.35)] text-white"
                          : "bg-white/[0.04] border-white/15 hover:border-white/30 text-neutral-200 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xs font-bold">{role.roleName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {role.id === "control"
                          ? "Admin"
                          : role.id === "assessor"
                            ? "Assessor"
                            : "Verifier"}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#e8192f] shadow-[0_0_8px_#e8192f]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedRole && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-neutral-300 flex items-center gap-2 px-1">
                  <Info className="w-4 h-4 text-[#ff4d6a] shrink-0" />
                  <span>
                    {
                      DEMO_ROLES.find((r) => r.id === selectedRole)
                        ?.description
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
                >
                  Email Address or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@elsewedy.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedRole(null);
                    }}
                    disabled={isLoading}
                    className="h-12 pl-10 bg-[#16161d] border-white/15 hover:border-white/25 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25 text-white placeholder:text-neutral-500 rounded-xl text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-xs text-[#ff4d6a] hover:underline cursor-pointer"
                  >
                    Need credentials?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </div>
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
                    className="h-12 pl-10 pr-10 bg-[#16161d] border-white/15 hover:border-white/25 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25 text-white placeholder:text-neutral-500 rounded-xl text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-[#16161d] text-[#c8102e] focus:ring-[#c8102e] transition-colors"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-gradient-to-r from-[#c8102e] via-[#e8192f] to-[#a00d25] hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-[0_8px_24px_rgba(200,16,46,0.38)] hover:shadow-[0_12px_28px_rgba(200,16,46,0.52)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in to CAS...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Bottom Security Badge */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Protected by Elsewedy Centralized Authentication System
              </span>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 text-center lg:text-left text-xs text-neutral-400">
            <span>
              Elsewedy Education Portal • Internal Technical Evaluation
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HELP & DEMO ACCOUNTS MODAL                                               */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141419] border border-white/15 rounded-2xl p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#c8102e]/20 text-[#ff4d6a]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Verified Test Accounts</h3>
                  <p className="text-xs text-neutral-300">
                    Configured in database with password: <code className="text-white font-mono bg-white/15 px-1.5 py-0.5 rounded">123456</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-neutral-400 hover:text-white text-lg px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {DEMO_ROLES.map((role) => (
                <div
                  key={role.id}
                  className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {role.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${role.border} ${role.text} bg-white/5`}>
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-mono mt-1">
                      {role.email}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {role.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSelectRole(role);
                      setShowHelpModal(false);
                    }}
                    className="bg-white/10 hover:bg-[#c8102e] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
              <Button
                onClick={() => setShowHelpModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs h-9 px-4 rounded-xl cursor-pointer"
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
