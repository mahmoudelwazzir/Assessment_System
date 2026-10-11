"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  GraduationCap,
  Layers,
  LogOut,
  Mail,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Building2,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Filter,
  Check,
  Star,
  FileText,
  BadgeCheck,
  MapPin,
  TrendingUp,
  Cpu,
  Flame,
  ArrowUpRight,
  Info,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useStudents } from "@/hooks/use-api";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ALL_STUDENT_DOSSIERS,
  getStudentDossier,
  type StudentDossier,
  type StudentCompetencyDetail,
} from "@/lib/student-dossier-data";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: apiStudents, isLoading: isStudentsLoading } = useStudents();

  // Combine backend students with known dossiers
  const availableStudents = useMemo(() => {
    if (apiStudents && apiStudents.length > 0) {
      return apiStudents;
    }
    // Fallback if API hasn't loaded or offline
    return [
      { id: 10, fullNameEn: "Abd alhadi eabd alhamaid", fullNameAr: "عبد الهادي عبد الحميد", email: "hadym2429@gmail.com", nationalId: "29901011999991", phone: "01012345678" },
      { id: 4, fullNameEn: "Ibrahim Adel", fullNameAr: "إبراهيم عادل", email: "ibrahim.adel1@school.com", nationalId: "30501011234564", phone: "01000000004" },
      { id: 12, fullNameEn: "Ahmed Hassan Mostafa", fullNameAr: "أحمد حسن مصطفى", email: "ahmed.hassan@elsewedy.edu.eg", nationalId: "29903031999993", phone: "01034567890" },
      { id: 13, fullNameEn: "Mariam Tarek Youssef", fullNameAr: "مريم طارق يوسف", email: "mariam.tarek@elsewedy.edu.eg", nationalId: "29904041999994", phone: "01045678901" },
      { id: 14, fullNameEn: "Omar Khaled Farouk", fullNameAr: "عمر خالد فاروق", email: "omar.farouk@elsewedy.edu.eg", nationalId: "29905051999995", phone: "01056789012" },
      { id: 15, fullNameEn: "Nourhan Mostafa El-Sayed", fullNameAr: "نورهان مصطفى السيد", email: "nourhan.sayed@elsewedy.edu.eg", nationalId: "29906061999996", phone: "01067890123" },
      { id: 16, fullNameEn: "Youssef Amr Abdelrahman", fullNameAr: "يوسف عمرو عبد الرحمن", email: "youssef.amr@elsewedy.edu.eg", nationalId: "29907071999997", phone: "01078901234" },
      { id: 17, fullNameEn: "Salma Mohamed Radwan", fullNameAr: "سلمى محمد رضوان", email: "salma.radwan@elsewedy.edu.eg", nationalId: "29908081999998", phone: "01089012345" },
      { id: 18, fullNameEn: "Karim Hany El-Naggar", fullNameAr: "كريم هاني النجار", email: "karim.elnaggar@elsewedy.edu.eg", nationalId: "29909091999999", phone: "01090123456" },
      { id: 19, fullNameEn: "Ziad Tamer Mansour", fullNameAr: "زياد تامر منصور", email: "ziad.mansour@elsewedy.edu.eg", nationalId: "29910101999901", phone: "01001234567" },
      { id: 20, fullNameEn: "Fatma Ahmed Ezzat", fullNameAr: "فاطمة أحمد عزت", email: "fatma.ezzat@elsewedy.edu.eg", nationalId: "29911111999902", phone: "01012345670" },
      { id: 21, fullNameEn: "Mostafa Alaa El-Din", fullNameAr: "مصطفى علاء الدين", email: "mostafa.alaa@elsewedy.edu.eg", nationalId: "29912121999903", phone: "01023456781" },
      { id: 22, fullNameEn: "Reem Sherif Kamal", fullNameAr: "ريم شريف كمال", email: "reem.kamal@elsewedy.edu.eg", nationalId: "29913131999904", phone: "01034567892" },
      { id: 23, fullNameEn: "Hazem Wael Soliman", fullNameAr: "حازم وائل سليمان", email: "hazem.soliman@elsewedy.edu.eg", nationalId: "29914141999905", phone: "01045678903" },
      { id: 24, fullNameEn: "Mona Ashraf Tawfik", fullNameAr: "منى أشرف توفيق", email: "mona.ashraf@elsewedy.edu.eg", nationalId: "29915151999906", phone: "01056789014" },
      { id: 25, fullNameEn: "Elsewedy Student Portal", fullNameAr: "طالب أكاديمية السويدي", email: "student@elsewedy.com", nationalId: "29901019999999", phone: "01099999999" },
    ];
  }, [apiStudents]);

  // Selected student state (defaults to Abd alhadi eabd alhamaid ID 10 or current user)
  const [selectedStudentId, setSelectedStudentId] = useState<number>(10);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Competency filter and selected tab
  const [activeTab, setActiveTab] = useState<"competencies" | "schedule" | "transcript" | "profile">("competencies");
  const [competencyStatusFilter, setCompetencyStatusFilter] = useState<"ALL" | "PASSED" | "IN_PROGRESS" | "UPCOMING">("ALL");

  // Selected competency for inspection modal
  const [inspectedCompetency, setInspectedCompetency] = useState<StudentCompetencyDetail | null>(null);

  // Sync with logged-in user if their email or accountId matches one of the students
  useEffect(() => {
    if (user?.email) {
      const match = availableStudents.find(
        (s) => s.email?.toLowerCase() === user.email?.toLowerCase()
      );
      if (match) {
        setSelectedStudentId(match.id);
      }
    }
  }, [user, availableStudents]);

  // Retrieve or generate dossier
  const activeDossier: StudentDossier = useMemo(() => {
    const rawStudent = availableStudents.find((s) => s.id === selectedStudentId);
    return getStudentDossier(selectedStudentId, rawStudent);
  }, [selectedStudentId, availableStudents]);

  // Filtered competencies
  const displayedCompetencies = useMemo(() => {
    if (competencyStatusFilter === "ALL") return activeDossier.competencies;
    if (competencyStatusFilter === "PASSED") {
      return activeDossier.competencies.filter((c) => c.status.startsWith("Passed"));
    }
    if (competencyStatusFilter === "IN_PROGRESS") {
      return activeDossier.competencies.filter((c) => c.status === "In Progress");
    }
    if (competencyStatusFilter === "UPCOMING") {
      return activeDossier.competencies.filter((c) => c.status === "Upcoming");
    }
    return activeDossier.competencies;
  }, [activeDossier, competencyStatusFilter]);

  // Upcoming scheduled exams
  const upcomingExams = useMemo(() => {
    return activeDossier.competencies.filter((c) => c.status === "Upcoming");
  }, [activeDossier]);

  // Search filtered student selector list
  const filteredStudentsList = useMemo(() => {
    if (!studentSearchQuery.trim()) return availableStudents;
    const q = studentSearchQuery.toLowerCase();
    return availableStudents.filter(
      (s) =>
        s.fullNameEn?.toLowerCase().includes(q) ||
        s.fullNameAr?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.nationalId?.includes(q) ||
        s.id.toString() === q
    );
  }, [availableStudents, studentSearchQuery]);

  const initials = activeDossier.fullNameEn
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#0b0c10] text-slate-900 dark:text-neutral-100 transition-colors duration-300 font-sans pb-16">
      {/* ============================================================== */}
      {/* TOP ACADEMY HEADER & STUDENT SWITCHER BAR                       */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0f1015]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#c8102e]/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                  ELSEWEDY
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-[#c8102e]/10 text-[#c8102e] border border-[#c8102e]/20">
                  Student Dossier
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
                Elsewedy Technical Academy (STA) • National Competency Assessment System
              </p>
            </div>
          </div>

          {/* Student Selector & Global Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Student Directory Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-neutral-200 transition-all shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#c8102e] text-white text-[10px] font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="leading-none font-bold text-slate-900 dark:text-white">
                    {activeDossier.fullNameEn.split(" ")[0]} ({activeDossier.code})
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu to view ANY student */}
              <AnimatePresence>
                {isSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#14151c] border border-slate-200 dark:border-white/15 shadow-2xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
                      <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#c8102e]" />
                        Select Candidate to Inspect
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {availableStudents.length} Students in Cohort
                      </span>
                    </div>

                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search student by name, national ID..."
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#c8102e]"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {filteredStudentsList.map((st) => {
                        const isSelected = st.id === selectedStudentId;
                        return (
                          <button
                            key={st.id}
                            onClick={() => {
                              setSelectedStudentId(st.id);
                              setIsSelectorOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-[#c8102e]/10 text-[#c8102e] font-bold border border-[#c8102e]/30"
                                : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-[#c8102e] text-white"
                                    : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300"
                                }`}
                              >
                                {st.fullNameEn.slice(0, 1)}
                              </div>
                              <div className="truncate">
                                <div className="truncate font-semibold">{st.fullNameEn}</div>
                                <div className="text-[10px] text-slate-400 truncate font-normal">
                                  {st.fullNameAr} • ID: {st.id}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#c8102e] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Print Official Dossier */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-300" />
              <span className="hidden sm:inline">Print Dossier</span>
            </Button>

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="h-8 text-xs font-semibold gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* HERO CANDIDATE PROFILE & IDENTITY BANNER                         */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#161722] to-[#250d12] text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80">
          {/* Subtle Ambient Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#c8102e]/25 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#e8192f]/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#c8102e] to-[#ff4d6a] text-white font-black text-3xl flex items-center justify-center shadow-xl border-2 border-white/20">
                  {initials}
                </div>
                {activeDossier.isLeader && (
                  <div
                    title="Class Leader"
                    className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center gap-1 shadow-md border-2 border-slate-900"
                  >
                    <Star className="w-3 h-3 fill-slate-900" /> Leader
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {activeDossier.fullNameEn}
                  </h1>
                  <span className="text-sm font-bold text-slate-300/80 px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 font-mono">
                    {activeDossier.fullNameAr}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1 font-mono text-[#ff4d6a] font-bold">
                    <GraduationCap className="w-3.5 h-3.5" /> {activeDossier.code}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3.5 h-3.5" /> NID: {activeDossier.nationalId}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" /> {activeDossier.verificationStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                  <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#ff4d6a]" />
                    <span>{activeDossier.departmentEn}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cohort: {activeDossier.cohort}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeDossier.factoryAr}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Academic Standing & Key Metric Pill */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
              <div className="text-left lg:text-right">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Cumulative Mastery Rate
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white flex items-center lg:justify-end gap-2">
                  <span>{activeDossier.overallPercentage}%</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GPA {activeDossier.gpa}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Evaluation Standing: <span className="text-[#ff4d6a] font-bold">Excellent with Honors</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveTab("schedule")}
                  className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#c8102e]/30 gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Next Exam in {activeDossier.competencies.find(c => c.status === "Upcoming")?.countdownDays || 15}d</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KPI METRICS OVERVIEW CARDS                                     */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Passed Competencies */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">الجدارات المجتازة</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {activeDossier.completedCompetenciesCount}
              <span className="text-sm font-normal text-slate-400 ml-1">
                / {activeDossier.competencies.length}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span>مستوفٍ لمعايير الجودة بنجاح</span>
            </div>
          </div>

          {/* Card 2: In-Progress Competency */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">الجدارة الحالية</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {activeDossier.inProgressCompetenciesCount}
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                (قيد التقييم)
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-neutral-400 truncate">
              {activeDossier.competencies.find(c => c.status === "In Progress")?.code || "COMP-IOT-305"} • 89% Progress
            </div>
          </div>

          {/* Card 3: Upcoming Exams */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">الاختبارات القادمة</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {activeDossier.upcomingCompetenciesCount}
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-2">
                مجدولة رسمياً
              </span>
            </div>
            <div className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              أقرب امتحان: 26 نوفمبر 2026
            </div>
          </div>

          {/* Card 4: Factory & Field Attendance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">نسبة الحضور الميداني</span>
              <div className="w-8 h-8 rounded-xl bg-[#c8102e]/10 text-[#c8102e] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {activeDossier.attendanceRate}%
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-neutral-400">
              السلوك والانضباط الصناعي: <span className="font-bold text-slate-900 dark:text-white">{activeDossier.conductScore}/100</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* NAVIGATION TABS (الجدارات / الجدول / السجل الأكاديمي / الملف الشخصي) */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-1 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("competencies")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "competencies"
                  ? "bg-[#c8102e] text-white shadow-md shadow-[#c8102e]/20"
                  : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>الجدارات وسجل الكفاءات ({activeDossier.competencies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "schedule"
                  ? "bg-[#c8102e] text-white shadow-md shadow-[#c8102e]/20"
                  : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>مواعيد الاختبارات القادمة ({upcomingExams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("transcript")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "transcript"
                  ? "bg-[#c8102e] text-white shadow-md shadow-[#c8102e]/20"
                  : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>السجل الأكاديمي المعتمد</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "profile"
                  ? "bg-[#c8102e] text-white shadow-md shadow-[#c8102e]/20"
                  : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4" />
              <span>بيانات الطالب والمحطة التدريبية</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: COMPETENCIES & TECHNICAL SKILLS (الجدارات السابقة والجديدة) */}
        {/* ============================================================== */}
        {activeTab === "competencies" && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> تصفية الجدارات:
                </span>
                <button
                  onClick={() => setCompetencyStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    competencyStatusFilter === "ALL"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 hover:bg-slate-200"
                  }`}
                >
                  جميع الجدارات ({activeDossier.competencies.length})
                </button>
                <button
                  onClick={() => setCompetencyStatusFilter("PASSED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    competencyStatusFilter === "PASSED"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                  }`}
                >
                  المجتازة السابقة ({activeDossier.completedCompetenciesCount})
                </button>
                <button
                  onClick={() => setCompetencyStatusFilter("IN_PROGRESS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    competencyStatusFilter === "IN_PROGRESS"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100"
                  }`}
                >
                  الحالية قيد التقييم ({activeDossier.inProgressCompetenciesCount})
                </button>
                <button
                  onClick={() => setCompetencyStatusFilter("UPCOMING")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    competencyStatusFilter === "UPCOMING"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100"
                  }`}
                >
                  القادمة والجديدة ({activeDossier.upcomingCompetenciesCount})
                </button>
              </div>

              <div className="text-xs text-slate-400">
                اضغط على أي جدارة لعرض كشف المعايير وتوقيع المراجع الخارجي
              </div>
            </div>

            {/* Competency Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCompetencies.map((comp) => {
                const isPassed = comp.status.startsWith("Passed");
                const isInProgress = comp.status === "In Progress";
                const isUpcoming = comp.status === "Upcoming";

                return (
                  <motion.div
                    key={comp.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setInspectedCompetency(comp)}
                    className="group cursor-pointer rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 p-5 shadow-sm hover:shadow-xl hover:border-[#c8102e]/40 dark:hover:border-[#c8102e]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges: Code & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10">
                          {comp.code}
                        </span>

                        {isPassed && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {comp.status === "Passed" ? "مجتازة ومستوفاة" : "مجتازة (دور ثانٍ)"}
                          </Badge>
                        )}
                        {isInProgress && (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[11px] font-bold animate-pulse">
                            <Clock className="w-3 h-3 mr-1" />
                            قيد التقييم الفعلي
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[11px] font-bold">
                            <Calendar className="w-3 h-3 mr-1" />
                            امتحان مجدول
                          </Badge>
                        )}
                      </div>

                      {/* Competency Title in En & Ar */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#c8102e] transition-colors leading-snug">
                        {comp.nameEn}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1 mb-4 font-mono">
                        {comp.nameAr}
                      </p>

                      {/* Score or Next Exam Date Highlight */}
                      {isPassed && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500 dark:text-neutral-400 font-medium">الدرجة الكلية</span>
                            <span className="font-black text-slate-900 dark:text-white text-sm">
                              {comp.score} / {comp.maxScore}
                            </span>
                          </div>
                          <Progress value={comp.score || 0} className="h-1.5" />
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                            <span>تاريخ الاعتماد: {comp.assessmentDate}</span>
                            <span>{comp.attemptsCount === 1 ? "دور أول" : "محاولة ثانية"}</span>
                          </div>
                        </div>
                      )}

                      {isInProgress && (
                        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-amber-800 dark:text-amber-300 font-bold">التقدم التكويني:</span>
                            <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                              89%
                            </span>
                          </div>
                          <Progress value={89} className="h-1.5 bg-amber-200 dark:bg-amber-950" />
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5">
                            المرحلة الحالية: معمل إنترنت الأشياء وبث مستشعرات Modbus
                          </p>
                        </div>
                      )}

                      {isUpcoming && (
                        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 mb-4">
                          <div className="flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> موعد الاختبار:
                            </span>
                            <span className="font-mono">{comp.assessmentDate}</span>
                          </div>
                          <p className="text-[11px] text-blue-700 dark:text-blue-400">
                            الوقت: {comp.assessmentTime || "10:00 AM"}
                          </p>
                          <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-blue-200/50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 font-semibold w-fit">
                            متبقي {comp.countdownDays || 15} يوم على الامتحان
                          </div>
                        </div>
                      )}

                      {/* Criteria Mini Preview */}
                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          معايير الأداء المقيمة:
                        </span>
                        {comp.criteria.slice(0, 2).map((crit, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400">
                            <span className="truncate pr-2">• {crit.nameEn}</span>
                            <span className="font-semibold shrink-0">
                              {isPassed ? `${crit.earned}/${crit.max}` : `${crit.max} pts`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Assessor & Verifier details */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
                      <div className="truncate">
                        <span className="font-bold text-slate-700 dark:text-neutral-300">
                          {isUpcoming ? "اللجنة:" : "المقيم:"}
                        </span>{" "}
                        {comp.assessorName}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#c8102e] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: UPCOMING EXAM SCHEDULE & LOGISTICS                      */}
        {/* ============================================================== */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#c8102e]" />
                    جدول الاختبارات القادمة ولجان التقييم المعتمدة
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    مواعيد اختبارات الجدارات الجديدة المتبقية للطالب للتخرج والاعتماد المهني
                  </p>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs font-bold">
                  {upcomingExams.length} اختبارات مجدولة
                </Badge>
              </div>

              <div className="space-y-5">
                {upcomingExams.map((exam, idx) => (
                  <div
                    key={exam.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4 hover:border-blue-400/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-400">
                            {exam.code}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-bold text-slate-700 dark:text-neutral-300">
                            {exam.level}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                          {exam.nameEn}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                          {exam.nameAr}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0 bg-white dark:bg-black/30 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="text-xs text-slate-400 font-medium">موعد انعقاد اللجنة</div>
                        <div className="text-sm font-black text-[#c8102e] flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.assessmentDate}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                          {exam.assessmentTime}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Location & Hall */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-1">
                        <span className="font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#c8102e]" />
                          مكان ومقر الامتحان
                        </span>
                        <p className="text-slate-600 dark:text-neutral-400">
                          {exam.venueEn}
                        </p>
                        <p className="text-slate-500 dark:text-neutral-500 font-mono text-[11px]">
                          {exam.venueAr}
                        </p>
                      </div>

                      {/* Evaluation Committee */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-1">
                        <span className="font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          أعضاء لجنة التقييم
                        </span>
                        <p className="text-slate-600 dark:text-neutral-400">
                          المقيم: <span className="font-semibold text-slate-900 dark:text-white">{exam.assessorName}</span>
                        </p>
                        <p className="text-slate-600 dark:text-neutral-400">
                          المراجع الخارجي: <span className="font-semibold text-slate-900 dark:text-white">{exam.verifierName}</span>
                        </p>
                      </div>

                      {/* Eligibility Status */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-1">
                        <span className="font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                          حالة الأهلية لدخول الامتحان
                        </span>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                            مؤهل ومستوفٍ للحضور (Eligible)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          متبقي <span className="font-bold text-[#c8102e]">{exam.countdownDays} يوم</span> للجاهزية
                        </p>
                      </div>
                    </div>

                    {/* Required Deliverables & Prerequisites */}
                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/15 border border-blue-200/40 dark:border-blue-900/30 space-y-2">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> المتطلبات والمخرجات الواجب تسليمها قبل موعد الاختبار:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-950 dark:text-blue-200">
                        {exam.upcomingDeliverables?.map((del, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: OFFICIAL ACADEMIC TRANSCRIPT (السجل الأكاديمي المعتمد)   */}
        {/* ============================================================== */}
        {activeTab === "transcript" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
              {/* Header / Seal */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#c8102e] text-white flex items-center justify-center font-black text-2xl shadow-lg">
                    STA
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Elsewedy Technical Academy (STA)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Official Candidate Assessment Transcript & National Competency Record
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Document Ref: STA-TRN-2026-{activeDossier.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs space-y-1">
                  <div>
                    <span className="text-slate-400">Candidate:</span>{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{activeDossier.fullNameEn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">National ID:</span>{" "}
                    <span className="font-mono text-slate-700 dark:text-neutral-300">{activeDossier.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Cohort:</span>{" "}
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">{activeDossier.cohort}</span>
                  </div>
                </div>
              </div>

              {/* Transcript Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Unit Code</th>
                      <th className="py-3 px-3">Competency Title</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-center">Attempt</th>
                      <th className="py-3 px-3 text-center">Score</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3">Assessor / Verifier</th>
                      <th className="py-3 px-3">Audit Stamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {activeDossier.competencies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {c.code}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{c.nameEn}</div>
                          <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">{c.nameAr}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 dark:text-neutral-300">
                          {c.categoryEn}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {c.attemptsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-mono text-[11px]">
                              Round {c.attemptsCount}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center font-black">
                          {c.score ? (
                            <span className="text-slate-900 dark:text-white text-sm">{c.score}%</span>
                          ) : (
                            <span className="text-slate-400 font-normal">Pending</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {c.status.startsWith("Passed") ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                              PASSED
                            </span>
                          ) : c.status === "In Progress" ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                              IN PROGRESS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold text-[10px]">
                              SCHEDULED
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 dark:text-neutral-400 text-[11px]">
                          <div>{c.assessorName}</div>
                          <div className="text-slate-400 text-[10px]">{c.verifierName}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[10px] text-slate-400">
                          {c.verificationStamp || "PENDING-FINAL-AUDIT"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Institutional Signatures Block */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Lead Internal Assessor</div>
                  <div className="font-bold text-slate-900 dark:text-white">Eng. Ahmed Tarek</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] mt-1">✓ Electronically Signed</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">External Verifier & Auditor</div>
                  <div className="font-bold text-slate-900 dark:text-white">Eng. Mostafa Verifier</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] mt-1">✓ Quality Stamp Affixed</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Academy Dean & Controller</div>
                  <div className="font-bold text-slate-900 dark:text-white">Dr. Examination Control Board</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] mt-1">✓ Accredited Record</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CANDIDATE DOSSIER & PERSONAL DETAILS                     */}
        {/* ============================================================== */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
                <User className="w-4 h-4 text-[#c8102e]" />
                البيانات الشخصية والأكاديمية
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">الاسم بالإنجليزية:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeDossier.fullNameEn}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">الاسم باللغة العربية:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeDossier.fullNameAr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">الرقم القومي (14 رقم):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeDossier.nationalId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">كود الطالب الأكاديمي:</span>
                  <span className="font-mono font-bold text-[#c8102e]">{activeDossier.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">البريد الإلكتروني الرسمي:</span>
                  <span className="font-mono text-slate-700 dark:text-neutral-300">{activeDossier.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">رقم الهاتف المحمول:</span>
                  <span className="font-mono text-slate-700 dark:text-neutral-300">{activeDossier.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">تاريخ الميلاد:</span>
                  <span className="text-slate-700 dark:text-neutral-300">{activeDossier.dateOfBirth}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">المحافظة ومقر الإقامة:</span>
                  <span className="text-slate-700 dark:text-neutral-300">{activeDossier.governorateAr}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">رقم هاتف ولي الأمر للطوارئ:</span>
                  <span className="font-mono text-slate-700 dark:text-neutral-300">{activeDossier.guardianPhone}</span>
                </div>
              </div>
            </div>

            {/* Field Training & Factory Station Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
                <Building2 className="w-4 h-4 text-amber-500" />
                المحطة التدريبية والمصنع الميداني
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">مجمع التدريب الصناعي:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeDossier.factoryAr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">القسم والشعبة التخصصية:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeDossier.specializationAr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">الفرقة الدراسية:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeDossier.academicYearAr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">مشرف التدريب بالمصنع:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeDossier.factorySupervisor}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">نسبة الحضور والالتزام:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeDossier.attendanceRate}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">ساعات التدريب العملي المنجزة:</span>
                  <span className="font-bold text-slate-900 dark:text-white">640 ساعة تدريبية</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">حالة الاعتماد النهائي:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                    معتمد ومطابق للمعايير الألمانية والمصرية
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: COMPETENCY CRITERIA & AUDIT DEEP-DIVE                   */}
      {/* ============================================================== */}
      <Dialog
        open={!!inspectedCompetency}
        onOpenChange={(open) => {
          if (!open) setInspectedCompetency(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/15">
          {inspectedCompetency && (
            <div className="space-y-6">
              <DialogHeader className="text-left space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-[#c8102e]/10 text-[#c8102e] border border-[#c8102e]/20">
                    {inspectedCompetency.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    {inspectedCompetency.level}
                  </span>
                </div>
                <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
                  {inspectedCompetency.nameEn}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                  {inspectedCompetency.nameAr} • {inspectedCompetency.categoryEn}
                </DialogDescription>
              </DialogHeader>

              {/* Status & Score Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">حالة التقييم والاعتماد</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {inspectedCompetency.statusAr}
                  </div>
                </div>

                {inspectedCompetency.score && (
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">الدرجة النهائية</div>
                    <div className="text-2xl font-black text-[#c8102e]">
                      {inspectedCompetency.score} / {inspectedCompetency.maxScore}
                    </div>
                  </div>
                )}
              </div>

              {/* Criteria Performance List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#c8102e]" />
                  معايير الأداء ومخرجات التعلم المقيمة (Evaluation Rubrics)
                </h4>

                <div className="space-y-2">
                  {inspectedCompetency.criteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-neutral-200">{crit.nameEn}</span>
                        <span className="font-mono text-slate-900 dark:text-white">
                          {inspectedCompetency.score ? `${crit.earned} / ${crit.max}` : `${crit.max} max`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{crit.nameAr}</div>
                      {inspectedCompetency.score && (
                        <Progress value={(crit.earned / crit.max) * 100} className="h-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessor Feedback */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-neutral-300">
                    ملاحظات وتوجيهات المقيم المسؤول:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {inspectedCompetency.assessorName}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-300 italic leading-relaxed">
                  "{inspectedCompetency.assessorFeedback}"
                </p>
              </div>

              {/* Verifier Verification Seal */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    المراجع الخارجي: {inspectedCompetency.verifierName}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    الختم الرقمي: {inspectedCompetency.verificationStamp || "AUDIT-QUEUED-2026"}
                  </div>
                </div>

                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  {inspectedCompetency.verifierApprovalStatus}
                </Badge>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectedCompetency(null)}
                  className="rounded-xl font-bold text-xs"
                >
                  إغلاق النافذة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
