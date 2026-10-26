# Design Specification: Migration from Next.js to Node.js (React + Vite) & Workspace Restructuring

## 1. Overview & Goals

- **Goal**: Re-architect the Elsewedy Assessment System by replacing Next.js (`.next`) with a pure Node.js-based React (Vite) frontend, organizing project files into dedicated `frontend/` and `backend/` directories, and removing `main` from the project directory name (`sewedy-assessment-system`).
- **Core Requirements**:
  1. Eliminate Next.js dependencies, `.next` build artifacts, and App Router server-side coupling.
  2. Maintain 100% visual fidelity, animations, Tailwind styling, and existing UI components (Elsewedy brand colors, dark/light themes).
  3. Keep the ASP.NET Core backend (`AssessmentWebApi`) 100% operational in an isolated `backend/` folder connected to the existing cloud database.
  4. Provide a root-level Node.js `package.json` for unified scripts and dependencies.
  5. Provide a safe and verified procedure to rename the root folder from `sewedy-assessment-system-main` to `sewedy-assessment-system`.

---

## 2. Directory Architecture

```text
sewedy-assessment-system/
├── frontend/                          # Client application (React + Vite, Node.js runtime)
│   ├── public/                        # Static assets (images, icons, logos)
│   ├── src/
│   │   ├── components/                # UI components (Radix primitives, assess forms, layout)
│   │   ├── hooks/                     # Custom React hooks (useApi, useToast, etc.)
│   │   ├── lib/                       # API clients, auth context, types, mock data
│   │   ├── pages/                     # Routed views
│   │   │   ├── assessor/
│   │   │   ├── controller/
│   │   │   ├── verifier/
│   │   │   ├── dashboard/
│   │   │   ├── landing/
│   │   │   └── login/
│   │   ├── styles/                    # Global CSS, theme styles, animations
│   │   ├── App.tsx                    # React Router configuration
│   │   └── main.tsx                   # Vite React root mount
│   ├── index.html                     # Single-page application entry point
│   ├── package.json                   # Frontend dependencies (React, Vite, Tailwind, Radix)
│   ├── tsconfig.json                  # TypeScript config for client
│   └── vite.config.ts                 # Vite bundler configuration & proxy
├── backend/                           # Server application (ASP.NET Core Web API)
│   ├── AssessmentWebApi/              # C# solution, controllers, models, repositories
│   └── AssessmentWebApi.slnx          # Solution file
├── package.json                       # Root Node.js workspace configuration
├── README.md                          # Updated setup & running instructions
└── .gitignore                         # Configured for node_modules, dist, bin, obj
```

---

## 3. Detailed Component & Framework Migration

### 3.1 Routing (`react-router-dom`)
Replace Next.js App Router file-system routing with declarative `react-router-dom` v6/v7 in `frontend/src/App.tsx`:
- `/` -> `<Navigate to="/login" replace />`
- `/login` -> `<LoginPage />`
- `/landing` -> `<LandingPage />`
- `/dashboard` -> `<StudentDashboardPage />`
- `/controller` -> `<ControllerLayout />` with child routes:
  - `dashboard` -> `<ControllerDashboardPage />`
  - `cycles` -> `<ControllerCyclesPage />`
  - `cycles/:cycleId` -> `<ControllerCycleDetailsPage />`
  - `assign` -> `<ControllerAssignPage />`
  - `enroll` -> `<ControllerEnrollPage />`
  - `questions-grading` -> `<QuestionsGradingPage />`
  - `reports` -> `<ControllerReportsPage />`
  - `statistics` -> `<ControllerStatisticsPage />`
  - `students` -> `<ControllerStudentsPage />`
  - `students/:studentId` -> `<ControllerStudentDetailsPage />`
- `/assessor` -> `<AssessorLayout />` with child routes:
  - `students` -> `<AssessorStudentsPage />`
  - `assess/:studentId` -> `<AssessorAssessPage />`
  - `automated-grading` -> `<AssessorAutomatedGradingPage />`
  - `competencies` -> `<AssessorCompetenciesPage />`
  - `reports` -> `<AssessorReportsPage />`
  - `submissions` -> `<AssessorSubmissionsPage />`
- `/verifier` -> `<VerifierLayout />` with child routes:
  - `competencies` -> `<VerifierCompetenciesPage />`
  - `competencies/add` -> `<VerifierAddCompetencyPage />`
  - `competencies/edit/:id` -> `<VerifierEditCompetencyPage />`
  - `log` -> `<VerifierLogPage />`
  - `report` -> `<VerifierReportPage />`
  - `reports` -> `<VerifierReportsPage />`
  - `results` -> `<VerifierResultsPage />`
  - `review/:resultId` -> `<VerifierReviewResultPage />`

### 3.2 Navigation & Next.js Imports Replacement
- `next/navigation`:
  - `useRouter()` -> replace with `useNavigate()` from `react-router-dom`.
  - `useParams()` -> replace with `useParams()` from `react-router-dom`.
  - `usePathname()` -> replace with `useLocation().pathname` from `react-router-dom`.
  - `redirect(path)` -> replace with `<Navigate to={path} replace />` or `navigate(path)`.
- `next/link`:
  - `<Link href="...">` -> `<Link to="...">` from `react-router-dom`.
- `next/image`:
  - Replace `<Image src="..." alt="..." />` with standard `<img>` or lightweight image helper preserving styling and responsiveness.
- `next-themes`:
  - Implement a zero-dependency `ThemeProvider` in `frontend/src/lib/theme-provider.tsx` using `localStorage` and `document.documentElement.classList.toggle('dark')`, matching the exact `useTheme` interface (`theme`, `setTheme`).
- Fonts:
  - Use system fonts + Google Manrope font imported via standard CSS in `frontend/src/styles/globals.css`.

### 3.3 Backend Isolation & Persistence
- Move `AssessmentWebApi` directly into `backend/`.
- Verify `.csproj`, `appsettings.json`, and database connection string remain unchanged.
- Backend continues running on `http://localhost:5247`.
- Vite proxy configured in `vite.config.ts`:
  ```ts
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5247',
        changeOrigin: true,
      }
    }
  }
  ```

---

## 4. Root Directory Renaming Procedure

- Target folder name: `sewedy-assessment-system` (removing `-main` / `main`).
- Because Windows locks active working directories held by open VS Code / CLI processes:
  1. The refactoring and build verification will be performed inside the current directory.
  2. Once complete, an automated PowerShell script and manual command will be provided to rename `sewedy-assessment-system-main` to `sewedy-assessment-system`.
  3. A temporary directory junction or direct rename ensures zero data loss.

---

## 5. Verification Plan

1. **Frontend Build**: Run `npm run build` in `frontend/` to ensure clean TypeScript compilation with Vite.
2. **Dev Server**: Run `npm run dev` and verify port 3000 serves all pages without console errors.
3. **Routing & Auth**: Test navigation between `/login`, `/controller/dashboard`, `/assessor/students`, `/verifier/results`, and `/dashboard`.
4. **Backend Connectivity**: Verify API requests succeed against `http://localhost:5247` or via Vite proxy `/api`.
5. **No Next Artifacts**: Confirm `.next/`, `next.config.mjs`, and `next-env.d.ts` are completely removed.

