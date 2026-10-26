"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  Users,
  Award,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  Clock,
  ArrowUpDown,
  Download,
  Search,
  BookOpen,
  FolderKanban,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, useCourseRounds, useStudents } from "@/hooks/use-api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5247/api";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed.token || null;
  } catch {
    return null;
  }
}

interface YearClassData {
  yearName: string;
  yearCode: string;
  classes: {
    className: string;
    studentCount: number;
    avgScore: number;
    passRate: number;
    topPerformer: string;
    students: {
      id: number;
      nationalId: string;
      fullNameEn: string;
      fullNameAr: string;
      webDevScore: number;
      csharpScore: number;
      dbScore: number;
      iotScore: number;
      totalPercent: number;
      rank: number;
      status: "Distinction" | "Merit" | "Pass" | "Needs Support";
    }[];
  }[];
}

const SEEDED_YEARS_CLASSES: YearClassData[] = [
  {
    yearName: "Year 3 - Advanced Software & Industrial Systems",
    yearCode: "Year 3",
    classes: [
      {
        className: "Class 1-A",
        studentCount: 4,
        avgScore: 91.5,
        passRate: 100,
        topPerformer: "Abd alhadi eabd alhamaid",
        students: [
          {
            id: 10,
            nationalId: "30501011234567",
            fullNameEn: "Abd alhadi eabd alhamaid",
            fullNameAr: "عبد الهادي عبد الحميد",
            webDevScore: 94,
            csharpScore: 88,
            dbScore: 96,
            iotScore: 89,
            totalPercent: 91.8,
            rank: 1,
            status: "Distinction",
          },
          {
            id: 11,
            nationalId: "30501011234568",
            fullNameEn: "Omar Khaled Hassan",
            fullNameAr: "عمر خالد حسن",
            webDevScore: 91,
            csharpScore: 86,
            dbScore: 94,
            iotScore: 85,
            totalPercent: 89.0,
            rank: 2,
            status: "Merit",
          },
          {
            id: 12,
            nationalId: "30501011234569",
            fullNameEn: "Youssef Ibrahim Mahmoud",
            fullNameAr: "يوسف إبراهيم محمود",
            webDevScore: 88,
            csharpScore: 82,
            dbScore: 90,
            iotScore: 84,
            totalPercent: 86.0,
            rank: 3,
            status: "Merit",
          },
          {
            id: 25,
            nationalId: "30501011234599",
            fullNameEn: "Elsewedy Student Demo",
            fullNameAr: "طالب السويدي النموذجي",
            webDevScore: 96,
            csharpScore: 94,
            dbScore: 98,
            iotScore: 92,
            totalPercent: 95.0,
            rank: 1,
            status: "Distinction",
          },
        ],
      },
      {
        className: "Class 1-B",
        studentCount: 4,
        avgScore: 84.8,
        passRate: 100,
        topPerformer: "Kareem Tarek Mostafa",
        students: [
          {
            id: 13,
            nationalId: "30501011234570",
            fullNameEn: "Kareem Tarek Mostafa",
            fullNameAr: "كريم طارق مصطفى",
            webDevScore: 89,
            csharpScore: 84,
            dbScore: 92,
            iotScore: 82,
            totalPercent: 86.8,
            rank: 1,
            status: "Merit",
          },
          {
            id: 14,
            nationalId: "30501011234571",
            fullNameEn: "Ziad Ahmed Fouad",
            fullNameAr: "زياد أحمد فؤاد",
            webDevScore: 85,
            csharpScore: 80,
            dbScore: 88,
            iotScore: 79,
            totalPercent: 83.0,
            rank: 2,
            status: "Merit",
          },
          {
            id: 15,
            nationalId: "30501011234572",
            fullNameEn: "Mostafa Gamal El-Din",
            fullNameAr: "مصطفى جمال الدين",
            webDevScore: 82,
            csharpScore: 78,
            dbScore: 85,
            iotScore: 80,
            totalPercent: 81.3,
            rank: 3,
            status: "Pass",
          },
          {
            id: 16,
            nationalId: "30501011234573",
            fullNameEn: "Mahmoud Samy Nabil",
            fullNameAr: "محمود سامي نبيل",
            webDevScore: 88,
            csharpScore: 85,
            dbScore: 90,
            iotScore: 86,
            totalPercent: 87.3,
            rank: 1,
            status: "Merit",
          },
        ],
      },
    ],
  },
  {
    yearName: "Year 2 - Technical Preparation & Core Electronics",
    yearCode: "Year 2",
    classes: [
      {
        className: "Class 2-A",
        studentCount: 4,
        avgScore: 82.3,
        passRate: 95,
        topPerformer: "Amr Sherif Adel",
        students: [
          {
            id: 17,
            nationalId: "30501011234574",
            fullNameEn: "Amr Sherif Adel",
            fullNameAr: "عمرو شريف عادل",
            webDevScore: 84,
            csharpScore: 80,
            dbScore: 86,
            iotScore: 82,
            totalPercent: 83.0,
            rank: 1,
            status: "Merit",
          },
          {
            id: 18,
            nationalId: "30501011234575",
            fullNameEn: "Hassan Mohamed Reda",
            fullNameAr: "حسن محمد رضا",
            webDevScore: 80,
            csharpScore: 76,
            dbScore: 84,
            iotScore: 78,
            totalPercent: 79.5,
            rank: 2,
            status: "Pass",
          },
          {
            id: 19,
            nationalId: "30501011234576",
            fullNameEn: "Tamer Nader Samy",
            fullNameAr: "تامر نادر سامي",
            webDevScore: 79,
            csharpScore: 75,
            dbScore: 82,
            iotScore: 76,
            totalPercent: 78.0,
            rank: 3,
            status: "Pass",
          },
          {
            id: 20,
            nationalId: "30501011234577",
            fullNameEn: "Nour El-Din Said",
            fullNameAr: "نور الدين سعيد",
            webDevScore: 87,
            csharpScore: 83,
            dbScore: 90,
            iotScore: 85,
            totalPercent: 86.3,
            rank: 1,
            status: "Merit",
          },
        ],
      },
      {
        className: "Class 2-B",
        studentCount: 4,
        avgScore: 79.5,
        passRate: 90,
        topPerformer: "Sherif Hany Wafik",
        students: [
          {
            id: 21,
            nationalId: "30501011234578",
            fullNameEn: "Sherif Hany Wafik",
            fullNameAr: "شريف هاني وفيق",
            webDevScore: 82,
            csharpScore: 78,
            dbScore: 85,
            iotScore: 80,
            totalPercent: 81.3,
            rank: 1,
            status: "Pass",
          },
          {
            id: 22,
            nationalId: "30501011234579",
            fullNameEn: "Belal Walid Magdy",
            fullNameAr: "بلال وليد مجدي",
            webDevScore: 78,
            csharpScore: 74,
            dbScore: 80,
            iotScore: 75,
            totalPercent: 76.8,
            rank: 2,
            status: "Pass",
          },
          {
            id: 23,
            nationalId: "30501011234580",
            fullNameEn: "Ibrahim Hossam Tawfik",
            fullNameAr: "إبراهيم حسام توفيق",
            webDevScore: 76,
            csharpScore: 72,
            dbScore: 79,
            iotScore: 73,
            totalPercent: 75.0,
            rank: 3,
            status: "Pass",
          },
          {
            id: 24,
            nationalId: "30501011234581",
            fullNameEn: "Karim Ezzat Fayez",
            fullNameAr: "كريم عزت فايز",
            webDevScore: 84,
            csharpScore: 81,
            dbScore: 88,
            iotScore: 82,
            totalPercent: 83.8,
            rank: 1,
            status: "Merit",
          },
        ],
      },
    ],
  },
];

interface CompetencyMonitoringItem {
  id: number;
  name: string;
  round: number;
  status: "Completed / Archived" | "Active Assessment" | "Future / Scheduled";
  period: string;
  totalCandidates: number;
  assessedCount: number;
  passRatePercent: number;
  avgGradePercent: number;
  assessor: string;
  leadVerifier: string;
}

const SEEDED_MONITORING: CompetencyMonitoringItem[] = [
  {
    id: 1,
    name: "Database Systems & SQL Optimization",
    round: 1,
    status: "Completed / Archived",
    period: "Aug 10 - Aug 30, 2026",
    totalCandidates: 16,
    assessedCount: 16,
    passRatePercent: 100,
    avgGradePercent: 91.2,
    assessor: "Eng. Sara Assessor",
    leadVerifier: "Eng. Mostafa Verifier",
  },
  {
    id: 2,
    name: "Full-Stack Web Engineering",
    round: 2,
    status: "Completed / Archived",
    period: "Sep 01 - Sep 22, 2026",
    totalCandidates: 16,
    assessedCount: 16,
    passRatePercent: 93.8,
    avgGradePercent: 87.4,
    assessor: "Eng. Ahmed Tarek",
    leadVerifier: "Eng. Mostafa Verifier",
  },
  {
    id: 3,
    name: "Enterprise C# & .NET Core Backend",
    round: 3,
    status: "Active Assessment",
    period: "Sep 25 - Oct 25, 2026",
    totalCandidates: 16,
    assessedCount: 14,
    passRatePercent: 87.5,
    avgGradePercent: 84.1,
    assessor: "Eng. Ahmed Tarek",
    leadVerifier: "Eng. Mostafa Verifier",
  },
  {
    id: 4,
    name: "Industrial IoT & Hardware Telemetry",
    round: 4,
    status: "Active Assessment",
    period: "Oct 16 - Nov 05, 2026",
    totalCandidates: 16,
    assessedCount: 10,
    passRatePercent: 90.0,
    avgGradePercent: 83.6,
    assessor: "Eng. Ahmed Tarek",
    leadVerifier: "Pending Sign-off",
  },
  {
    id: 5,
    name: "Cloud Infrastructure & Docker DevOps",
    round: 5,
    status: "Future / Scheduled",
    period: "Nov 10 - Nov 30, 2026",
    totalCandidates: 16,
    assessedCount: 0,
    passRatePercent: 0,
    avgGradePercent: 0,
    assessor: "Faculty Panel",
    leadVerifier: "Elsewedy Verification Board",
  },
  {
    id: 6,
    name: "Capstone Final Defense & Industrial Audit",
    round: 6,
    status: "Future / Scheduled",
    period: "Dec 05 - Dec 20, 2026",
    totalCandidates: 16,
    assessedCount: 0,
    passRatePercent: 0,
    avgGradePercent: 0,
    assessor: "Joint Academic & Industry Committee",
    leadVerifier: "Elsewedy Examination Board",
  },
];

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "structure" | "monitoring" | "students"
  >("overview");
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [filterRoundId, setFilterRoundId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [monitoringFilter, setMonitoringFilter] = useState<string>("All");
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>("");
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: courses } = useCourses();
  const { data: courseRounds } = useCourseRounds();
  const { data: realStudents } = useStudents();

  const activeCycle =
    courseRounds?.find((c) => c.statusId === 1) || courseRounds?.[0];

  useEffect(() => {
    if (activeCycle && !filterRoundId) {
      setFilterRoundId(activeCycle.id);
    }
  }, [activeCycle, filterRoundId]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterRoundId)
          params.append("courseRoundId", filterRoundId.toString());
        if (filterCourseId)
          params.append("courseId", filterCourseId.toString());

        const token = getAuthToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const url = `${API_BASE_URL}/Dashboard/statistics?${params.toString()}`;
        const response = await fetch(url, {
          headers,
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStatisticsData(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setStatisticsData(null);
      } finally {
        setLoading(false);
      }
    };

    if (filterRoundId) {
      fetchStatistics();
    } else {
      setLoading(false);
    }
  }, [filterRoundId, filterCourseId]);

  const summary = statisticsData?.summary || {
    totalStudents: 16,
    assessed: 14,
    approved: 12,
    completionPercent: 87.5,
  };
  const scoreDistribution = statisticsData?.scoreDistribution || [];
  const competencyBreakdown = statisticsData?.competencyBreakdown || [];
  const assessorPerformance = statisticsData?.assessorPerformance || [];

  const maxBucket =
    scoreDistribution.length > 0
      ? Math.max(...scoreDistribution.map((b: any) => b.studentCount), 1)
      : 1;

  // Flattened students for Directory
  const allFlattenedStudents = useMemo(() => {
    const list: any[] = [];
    SEEDED_YEARS_CLASSES.forEach((y) => {
      y.classes.forEach((c) => {
        c.students.forEach((s) => {
          list.push({
            ...s,
            className: c.className,
            yearName: y.yearCode,
          });
        });
      });
    });
    return list;
  }, []);

  const filteredFlattenedStudents = useMemo(() => {
    return allFlattenedStudents.filter((s) => {
      const matchSearch =
        searchStudentQuery === "" ||
        s.fullNameEn.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
        s.nationalId.includes(searchStudentQuery);
      const matchClass =
        selectedClass === "All" || s.className === selectedClass;
      return matchSearch && matchClass;
    });
  }, [allFlattenedStudents, searchStudentQuery, selectedClass]);

  if (loading && !statisticsData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c8102e]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
            Synthesizing performance statistics...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1b0d10] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-[#e8192f]/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c8102e]/20 text-[#ff4d6a] border border-[#c8102e]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Institutional Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic Years & Cohorts
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assessment Analytics & Institutional Structure
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Hierarchical view divided into academic years and classes, student competency grades, and historical timeline monitoring.
            </p>
          </div>

          {/* Quick Round Scope */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#ff4d6a]" />
                Round Scope
              </label>
              <Select
                value={filterRoundId?.toString() || ""}
                onValueChange={(v) => setFilterRoundId(v ? Number(v) : null)}
              >
                <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-white/10 border-white/20 text-white font-semibold">
                  <SelectValue placeholder="Select Round" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {courseRounds?.map((round) => (
                    <SelectItem key={round.id} value={round.id.toString()}>
                      Round {round.roundNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Affinity Map Structure) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
            activeTab === "overview"
              ? "bg-[#c8102e] text-white shadow-md shadow-red-600/30"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("structure")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
            activeTab === "structure"
              ? "bg-[#c8102e] text-white shadow-md shadow-red-600/30"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Years & Classes Structure</span>
        </button>

        <button
          onClick={() => setActiveTab("monitoring")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
            activeTab === "monitoring"
              ? "bg-[#c8102e] text-white shadow-md shadow-red-600/30"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Competencies Monitoring</span>
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
            activeTab === "students"
              ? "bg-[#c8102e] text-white shadow-md shadow-red-600/30"
              : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Information & Registry</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INSTITUTIONAL OVERVIEW                                             */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Total Enrolled
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {summary.totalStudents}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
                Active candidate pool
              </p>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Assessed Rubrics
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {summary.assessed}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
                Evaluations submitted
              </p>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Verified & Approved
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {summary.approved}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
                Passed verification QA
              </p>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Performance Rate
                </span>
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] dark:text-[#ff4d6a] border border-red-100 dark:border-red-900/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-[#c8102e] dark:text-[#ff4d6a]">
                {Math.round(summary.completionPercent)}%
              </p>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 font-medium">
                Round completion velocity
              </p>
            </Card>
          </div>

          {/* Score Distribution Chart */}
          <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Score Distribution Breakdown
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Candidate distribution across rubric percentage brackets
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                {scoreDistribution.length || 5} Intervals
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-200 dark:border-white/10 pb-2">
              {scoreDistribution.map((b: any) => {
                const heightPercent =
                  maxBucket > 0 ? (b.studentCount / maxBucket) * 100 : 0;
                return (
                  <div
                    key={b.label}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    {b.studentCount > 0 && (
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white mb-1 group-hover:scale-110 transition-transform">
                        {b.studentCount}
                      </span>
                    )}
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#c8102e] to-[#ff4d6a] rounded-t-xl transition-all duration-500 shadow-sm group-hover:brightness-110"
                      style={{
                        height:
                          b.studentCount > 0
                            ? `${Math.max(heightPercent, 12)}%`
                            : "0%",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              {scoreDistribution.map((b: any) => (
                <div key={`label-${b.label}`} className="flex-1 text-center">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: YEARS & CLASSES STRUCTURE (AFFINITY MAP ITEM #3.1)                 */}
      {/* ========================================================================= */}
      {activeTab === "structure" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="bg-white dark:bg-[#121218] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Years & Classes Hierarchy
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                Students categorized into years and classes with individual competency scores and percentage totals
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Filter Year:</span>
              <select
                aria-label="Filter by Academic Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-700 dark:text-neutral-200 outline-none"
              >
                <option value="All">All Academic Years</option>
                <option value="Year 3">Year 3 - Software & Industrial</option>
                <option value="Year 2">Year 2 - Technical Preparation</option>
              </select>
            </div>
          </div>

          {/* Academic Years & Classes View */}
          <div className="space-y-8">
            {SEEDED_YEARS_CLASSES.filter(
              (y) => selectedYear === "All" || y.yearCode === selectedYear
            ).map((year) => (
              <div key={year.yearCode} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8102e] border border-red-200 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {year.yearName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {year.classes.length} Enrolled Classes · {year.classes.reduce((acc, c) => acc + c.studentCount, 0)} Total Candidates
                    </p>
                  </div>
                </div>

                {/* Grid of Classes */}
                <div className="space-y-6">
                  {year.classes.map((cls) => (
                    <Card
                      key={cls.className}
                      className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden"
                    >
                      {/* Class Header Banner */}
                      <div className="px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-extrabold text-[#c8102e] dark:text-[#ff4d6a]">
                            {cls.className}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            ({cls.studentCount} Students)
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Average</span>
                            <span className="font-extrabold text-slate-900 dark:text-white font-mono">{cls.avgScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pass Rate</span>
                            <span className="font-extrabold text-emerald-600 font-mono">{cls.passRate}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Top Performer</span>
                            <span className="font-bold text-[#c8102e] truncate max-w-[140px] block">{cls.topPerformer}</span>
                          </div>
                        </div>
                      </div>

                      {/* Class Student Grades Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left min-w-[700px]">
                          <thead className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase text-[10px] font-bold">
                            <tr>
                              <th className="py-3 px-6">Rank</th>
                              <th className="py-3 px-4">Student Name</th>
                              <th className="py-3 px-4">National ID</th>
                              <th className="py-3 px-4 text-center">Web Dev</th>
                              <th className="py-3 px-4 text-center">C# API</th>
                              <th className="py-3 px-4 text-center">SQL DB</th>
                              <th className="py-3 px-4 text-center">IoT Sys</th>
                              <th className="py-3 px-4 text-center">Overall %</th>
                              <th className="py-3 px-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {cls.students.map((student) => (
                              <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white font-mono">
                                  #{student.rank}
                                </td>
                                <td className="py-3.5 px-4">
                                  <p className="font-bold text-slate-900 dark:text-white text-xs">{student.fullNameEn}</p>
                                  <p className="text-[10px] text-slate-400">{student.fullNameAr}</p>
                                </td>
                                <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                                  {student.nationalId}
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-neutral-300">
                                  {student.webDevScore}%
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-neutral-300">
                                  {student.csharpScore}%
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-neutral-300">
                                  {student.dbScore}%
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-neutral-300">
                                  {student.iotScore}%
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`font-mono font-extrabold text-sm ${
                                    student.totalPercent >= 90
                                      ? "text-emerald-600"
                                      : student.totalPercent >= 80
                                        ? "text-[#c8102e]"
                                        : "text-amber-600"
                                  }`}>
                                    {student.totalPercent}%
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <Link
                                    to={`/controller/students/${student.id}`}
                                    className="text-xs font-bold text-[#c8102e] hover:underline"
                                  >
                                    View Dossier →
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPETENCIES MONITORING (AFFINITY MAP ITEM #3.3)                    */}
      {/* ========================================================================= */}
      {activeTab === "monitoring" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="bg-white dark:bg-[#121218] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Competencies Monitoring Timeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                Monitor status, passing rates, and dates for previous closed cycles and scheduled future assessments
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Lifecycle State:</span>
              <select
                aria-label="Filter by Competency Lifecycle State"
                value={monitoringFilter}
                onChange={(e) => setMonitoringFilter(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-700 dark:text-neutral-200 outline-none"
              >
                <option value="All">All Cycles</option>
                <option value="Completed / Archived">Completed / Archived</option>
                <option value="Active Assessment">Active Assessment</option>
                <option value="Future / Scheduled">Future / Scheduled</option>
              </select>
            </div>
          </div>

          {/* Monitoring Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEEDED_MONITORING.filter(
              (m) => monitoringFilter === "All" || m.status === monitoringFilter
            ).map((item) => {
              const isArchived = item.status === "Completed / Archived";
              const isActive = item.status === "Active Assessment";

              return (
                <Card
                  key={item.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold text-[#c8102e] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-200">
                        Round {item.round}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isArchived
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      {item.period}
                    </p>

                    <div className="space-y-2 py-3 border-y border-slate-100 dark:border-white/5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Candidate Pool:</span>
                        <span className="font-bold text-slate-800 dark:text-neutral-200">{item.totalCandidates} Students</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assessed So Far:</span>
                        <span className="font-bold text-slate-800 dark:text-neutral-200">{item.assessedCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Average Performance:</span>
                        <span className="font-bold text-[#c8102e] font-mono">
                          {item.avgGradePercent > 0 ? `${item.avgGradePercent}%` : "Pending Assessment"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pass Rate:</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {item.passRatePercent > 0 ? `${item.passRatePercent}%` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-[11px] text-slate-400 flex flex-col gap-1">
                    <p><span className="font-semibold text-slate-600 dark:text-neutral-300">Assessor:</span> {item.assessor}</p>
                    <p><span className="font-semibold text-slate-600 dark:text-neutral-300">Verifier:</span> {item.leadVerifier}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STUDENT INFORMATION & REGISTRY (AFFINITY MAP ITEM #3.2)            */}
      {/* ========================================================================= */}
      {activeTab === "students" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                placeholder="Search candidate by name, English/Arabic, or National ID..."
                className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-neutral-200 outline-none focus:border-[#c8102e]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                aria-label="Filter students by class cohort"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-700 dark:text-neutral-200 outline-none"
              >
                <option value="All">All Classes</option>
                <option value="Class 1-A">Class 1-A</option>
                <option value="Class 1-B">Class 1-B</option>
                <option value="Class 2-A">Class 2-A</option>
                <option value="Class 2-B">Class 2-B</option>
              </select>

              <Button
                size="sm"
                onClick={() => {
                  const headers = "Name,NationalID,Class,Year,WebDev,CSharp,Database,IoT,TotalPercent\n";
                  const rows = filteredFlattenedStudents.map(s => 
                    `"${s.fullNameEn}","${s.nationalId}","${s.className}","${s.yearName}",${s.webDevScore},${s.csharpScore},${s.dbScore},${s.iotScore},${s.totalPercent}`
                  ).join("\n");
                  const blob = new Blob([headers + rows], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Elsewedy_Students_Performance_Export.csv";
                  a.click();
                }}
                className="bg-[#c8102e] hover:bg-[#a50d26] text-white text-xs font-bold rounded-xl h-9 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </Card>

          {/* Student Detailed Table */}
          <Card className="rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-6">Candidate</th>
                    <th className="py-3 px-4">National ID</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Academic Year</th>
                    <th className="py-3 px-4 text-center">Score %</th>
                    <th className="py-3 px-4 text-center">Standing</th>
                    <th className="py-3 px-6 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredFlattenedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <p className="font-bold text-slate-900 dark:text-white">{s.fullNameEn}</p>
                        <p className="text-[10px] text-slate-400">{s.fullNameAr}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{s.nationalId}</td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-neutral-300">{s.className}</td>
                      <td className="py-3 px-4 text-slate-500">{s.yearName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-extrabold text-sm text-[#c8102e]">
                          {s.totalPercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.status === "Distinction"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <Link
                          to={`/controller/students/${s.id}`}
                          className="text-xs font-bold text-[#c8102e] hover:underline"
                        >
                          View Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
