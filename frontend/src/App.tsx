import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { RoleRouter } from "@/components/layout/role-router";

// Pages
import LoginPage from "@/pages/login/page";
import LandingPage from "@/pages/landing/page";
import StudentDashboardPage from "@/pages/dashboard/page";

// Controller
import ControllerLayout from "@/pages/controller/layout";
import ControllerDashboard from "@/pages/controller/dashboard/page";
import CyclesPage from "@/pages/controller/cycles/page";
import CycleDetailPage from "@/pages/controller/cycles/detail-page";
import AssignPage from "@/pages/controller/assign/page";
import EnrollPage from "@/pages/controller/enroll/page";
import QuestionsAndAutomatedGradingPage from "@/pages/controller/questions-grading/page";
import ReportsAndCheatingChecksPage from "@/pages/controller/reports/page";
import StatisticsPage from "@/pages/controller/statistics/page";
import ControllerStudentsPage from "@/pages/controller/students/page";
import ControllerStudentDetailPage from "@/pages/controller/students/detail-page";

// Assessor
import AssessorLayout from "@/pages/assessor/layout";
import AssessorStudentsPage from "@/pages/assessor/students/page";
import AssessStudentPage from "@/pages/assessor/assess/page";
import AssessorAutomatedGradingPage from "@/pages/assessor/automated-grading/page";
import AssessorCompetenciesPage from "@/pages/assessor/competencies/page";
import AssessorReportsPage from "@/pages/assessor/reports/page";
import SubmissionsPage from "@/pages/assessor/submissions/page";

// Verifier
import VerifierLayout from "@/pages/verifier/layout";
import VerifierResultsPage from "@/pages/verifier/results/page";
import VerifierReviewPage from "@/pages/verifier/review/page";
import VerifierCompetenciesPage from "@/pages/verifier/competencies/page";
import VerifierAddCompetencyPage from "@/pages/verifier/competencies/add/page";
import VerifierEditCompetencyPage from "@/pages/verifier/competencies/edit/page";
import VerifierLogPage from "@/pages/verifier/log/page";
import VerifierReportPage from "@/pages/verifier/report/page";
import VerifierReportsPage from "@/pages/verifier/reports/page";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public & Direct Entry Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />

        {/* Controller Routes */}
        <Route
          path="/controller"
          element={
            <RoleRouter>
              <ControllerLayout />
            </RoleRouter>
          }
        >
          <Route index element={<Navigate to="/controller/dashboard" replace />} />
          <Route path="dashboard" element={<ControllerDashboard />} />
          <Route path="cycles" element={<CyclesPage />} />
          <Route path="cycles/:cycleId" element={<CycleDetailPage />} />
          <Route path="assign" element={<AssignPage />} />
          <Route path="enroll" element={<EnrollPage />} />
          <Route path="questions-grading" element={<QuestionsAndAutomatedGradingPage />} />
          <Route path="reports" element={<ReportsAndCheatingChecksPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="students" element={<ControllerStudentsPage />} />
          <Route path="students/:studentId" element={<ControllerStudentDetailPage />} />
        </Route>

        {/* Assessor Routes */}
        <Route
          path="/assessor"
          element={
            <RoleRouter>
              <AssessorLayout />
            </RoleRouter>
          }
        >
          <Route index element={<Navigate to="/assessor/students" replace />} />
          <Route path="students" element={<AssessorStudentsPage />} />
          <Route path="assess/:studentId" element={<AssessStudentPage />} />
          <Route path="automated-grading" element={<AssessorAutomatedGradingPage />} />
          <Route path="competencies" element={<AssessorCompetenciesPage />} />
          <Route path="reports" element={<AssessorReportsPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
        </Route>

        {/* Verifier Routes */}
        <Route
          path="/verifier"
          element={
            <RoleRouter>
              <VerifierLayout />
            </RoleRouter>
          }
        >
          <Route index element={<Navigate to="/verifier/results" replace />} />
          <Route path="results" element={<VerifierResultsPage />} />
          <Route path="review/:resultId" element={<VerifierReviewPage />} />
          <Route path="competencies" element={<VerifierCompetenciesPage />} />
          <Route path="competencies/add" element={<VerifierAddCompetencyPage />} />
          <Route path="competencies/edit/:id" element={<VerifierEditCompetencyPage />} />
          <Route path="log" element={<VerifierLogPage />} />
          <Route path="report" element={<VerifierReportPage />} />
          <Route path="reports" element={<VerifierReportsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster />
      <SonnerToaster />
    </>
  );
}

