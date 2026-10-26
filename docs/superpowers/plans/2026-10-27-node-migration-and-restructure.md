# Migration from Next.js to Node.js (React + Vite) & Workspace Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-architect Elsewedy Assessment System by moving the frontend from Next.js (`.next`) to standard React + Vite powered by Node.js, isolating the ASP.NET Core backend into `backend/`, organizing the project into a clean monorepo structure, and preparing the root folder renaming to `sewedy-assessment-system`.

**Architecture:** Monorepo with two isolated directories: `frontend/` (React 19, Vite, React Router, Tailwind CSS, Radix UI) and `backend/` (ASP.NET Core Web API with MSSQL connection). A root `package.json` provides unified Node.js dev and build scripts. Next.js App Router and `.next` build caches are completely removed while retaining 100% of the UI design, styles, brand colors, and backend functionality.

**Tech Stack:** Node.js, React 19, TypeScript, Vite, React Router DOM, Tailwind CSS, Radix UI Primitives, Lucide React, Framer Motion, ASP.NET Core 10 Web API.

**Spec:** `docs/superpowers/specs/2026-10-27-node-migration-and-restructure-design.md`

## Global Constraints
- Target directory name: `sewedy-assessment-system` (remove `main` / `-main` suffix).
- Complete elimination of Next.js dependencies, `next.config.mjs`, and `.next` build folder.
- Zero visual changes to UI: preserve `#c8102e` brand color, typography, theme toggles, and Radix components.
- Zero breaking changes to `AssessmentWebApi`: preserve all 11 controllers, database models, and cloud database connectivity on port 5247.

## Review Focus
1. Route transitions and parameter extraction: dynamic routes like `/assessor/assess/:studentId` and `/verifier/review/:resultId` must correctly receive URL parameters via `useParams()`.
2. Auth Context & Role Navigation: `auth-context.tsx` and role redirects must navigate without page refresh or infinite redirect loops.
3. Dark / Light mode: custom `ThemeProvider` must toggle the `.dark` class on `document.documentElement` without hydration mismatch or flash of unstyled content.
4. API Proxy / Base URL: calls to `/api/*` in Vite must properly proxy to `http://localhost:5247` or use `API_CONFIG.BASE_URL`.
5. Asset imports: images, SVG logos, and fonts must resolve correctly in Vite without broken `404` paths.

---

### Task 1: Monorepo & Backend Isolation

**Files:**
- Create: `backend/`
- Modify: Move `AssessmentWebApi` -> `backend/AssessmentWebApi`
- Test: `backend/AssessmentWebApi/AssessmentWebApi/AssessmentWebApi.csproj`

**Interfaces:**
- Consumes: Existing C# controllers and cloud database configuration.
- Produces: Isolated backend directory runnable via `dotnet run`.

- [ ] **Step 1: Create `backend/` directory and relocate `AssessmentWebApi`**
  Move `AssessmentWebApi` folder and its solution files into `backend/`.

- [ ] **Step 2: Verify .NET build compiles in new location**
  Run: `dotnet build backend/AssessmentWebApi/AssessmentWebApi/AssessmentWebApi.csproj`
  Expected: Build succeeded with 0 errors.

- [ ] **Step 3: Commit backend isolation**
  ```bash
  git add backend/
  git commit -m "chore: isolate ASP.NET Core backend into backend/ directory"
  ```

---

### Task 2: Frontend Scaffolding (Vite + React + Tailwind + TS)

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `package.json` (Root orchestration)

**Interfaces:**
- Consumes: Node.js npm package ecosystem.
- Produces: Working Vite build and dev server scripts.

- [ ] **Step 1: Create `frontend/package.json` with dependencies**
  Include React 19, `react-router-dom`, Lucide React, Radix UI primitives, Framer Motion, Tailwind CSS, TypeScript, Vite.

- [ ] **Step 2: Create `frontend/vite.config.ts`**
  Configure `@vitejs/plugin-react`, `@` path alias pointing to `frontend/src`, and `/api` proxy pointing to `http://localhost:5247`.

- [ ] **Step 3: Create `frontend/tsconfig.json` & Tailwind configuration**
  Setup `compilerOptions` with JSX React-JSX, path aliases `@/*` -> `./src/*`, and setup `tailwind.config.ts` and `postcss.config.js`.

- [ ] **Step 4: Create `frontend/index.html`**
  Set title to "Elsewedy Assessment & Competency Management System", set favicon, and include root div `#root` pointing to `/src/main.tsx`.

- [ ] **Step 5: Setup root `package.json` for workspace orchestration**
  Configure `npm run dev` and `npm run build` targeting `frontend/`.

- [ ] **Step 6: Install dependencies in `frontend/`**
  Run: `npm install --prefix frontend`
  Expected: Dependencies installed cleanly.

- [ ] **Step 7: Commit frontend scaffolding**
  ```bash
  git add frontend/package.json frontend/vite.config.ts frontend/tsconfig.json frontend/index.html package.json
  git commit -m "feat(frontend): scaffold pure React + Vite Node.js environment"
  ```

---

### Task 3: Shared Core Migration (Styles, ThemeProvider, Types, Lib & Hooks)

**Files:**
- Create: `frontend/src/styles/globals.css`
- Create: `frontend/src/lib/theme-provider.tsx`
- Create: `frontend/src/lib/utils.ts`
- Create: `frontend/src/lib/types.ts`
- Create: `frontend/src/lib/api-config.ts`
- Create: `frontend/src/lib/api-client.ts`
- Create: `frontend/src/lib/auth-context.tsx`
- Create: `frontend/src/lib/student-dossier-data.ts`
- Create: `frontend/src/hooks/use-api.ts`
- Create: `frontend/src/hooks/use-toast.ts`
- Create: `frontend/src/hooks/use-mobile.tsx`

**Interfaces:**
- Consumes: REST API on `http://localhost:5247/api`.
- Produces: Exported hooks `useApi()`, `useAuth()`, `useTheme()`, `useToast()`, API client utilities.

- [ ] **Step 1: Migrate global styles & fonts**
  Copy `app/globals.css` to `frontend/src/styles/globals.css`, adjusting any font imports to standard Google Fonts import.

- [ ] **Step 2: Implement zero-dependency `ThemeProvider`**
  Create `frontend/src/lib/theme-provider.tsx` exporting `ThemeProvider` and `useTheme()` providing `theme`, `setTheme` with localStorage support.

- [ ] **Step 3: Copy and adapt `lib/` utilities and contexts**
  Migrate `types.ts`, `api-config.ts`, `api-client.ts`, `student-dossier-data.ts`, `utils.ts`, and adapt `auth-context.tsx` to use `useNavigate()` from `react-router-dom` instead of Next `useRouter()`.

- [ ] **Step 4: Copy and adapt custom hooks**
  Migrate `hooks/use-api.ts`, `hooks/use-toast.ts`, and `hooks/use-mobile.tsx` to `frontend/src/hooks/`.

- [ ] **Step 5: Verify TypeScript compilation of core files**
  Run: `npx tsc --noEmit -p frontend/tsconfig.json`
  Expected: Clean compilation of migrated lib and hooks.

- [ ] **Step 6: Commit shared core**
  ```bash
  git add frontend/src/lib frontend/src/hooks frontend/src/styles
  git commit -m "feat(frontend): migrate styles, theme provider, auth context, and hooks"
  ```

---

### Task 4: UI Component Migration

**Files:**
- Create: `frontend/src/components/ui/*` (all Radix primitives & buttons)
- Create: `frontend/src/components/assess/*` (evaluation forms & scoring)
- Create: `frontend/src/components/layout/*` (navigation, role router, header)

**Interfaces:**
- Consumes: Radix UI primitives, Lucide icons, Tailwind classes.
- Produces: Full reusable component library for pages.

- [ ] **Step 1: Copy `components/ui` to `frontend/src/components/ui`**
  Migrate buttons, dialogs, dropdowns, tables, cards, tabs, inputs, toasts.

- [ ] **Step 2: Adapt Next.js imports in components**
  Replace `next/link` with `Link` from `react-router-dom`. Replace `next/image` with standard `<img>`.

- [ ] **Step 3: Copy `components/assess` and `components/layout`**
  Migrate evaluation forms, rubric components, `role-router.tsx`, and navigation headers.

- [ ] **Step 4: Copy public assets (logos, images)**
  Copy contents of `public/` to `frontend/public/`.

- [ ] **Step 5: Run TypeScript check on components**
  Run: `npx tsc --noEmit -p frontend/tsconfig.json`
  Expected: 0 errors in components.

- [ ] **Step 6: Commit components**
  ```bash
  git add frontend/src/components frontend/public
  git commit -m "feat(frontend): migrate UI, layout, and assess components"
  ```

---

### Task 5: Pages & Routing Migration (`react-router-dom`)

**Files:**
- Create: `frontend/src/pages/login/LoginPage.tsx`
- Create: `frontend/src/pages/landing/LandingPage.tsx`
- Create: `frontend/src/pages/dashboard/StudentDashboardPage.tsx`
- Create: `frontend/src/pages/controller/*` (Layout & views)
- Create: `frontend/src/pages/assessor/*` (Layout & views)
- Create: `frontend/src/pages/verifier/*` (Layout & views)
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/main.tsx`

**Interfaces:**
- Consumes: Components, hooks, auth context.
- Produces: Complete SPA routing tree matching all 33 original views.

- [ ] **Step 1: Convert Next page files to React Router page components**
  Adapt imports in all 33 page views:
  - `useRouter()` -> `useNavigate()`
  - `useParams()` -> `useParams()` from `react-router-dom`
  - `usePathname()` -> `useLocation().pathname`
  - `Link href="..."` -> `Link to="..."`
  - Remove `'use client'` directives (standard in Vite).

- [ ] **Step 2: Implement `frontend/src/App.tsx`**
  Declare full `<Routes>` configuration with nested layouts for `/controller`, `/assessor`, `/verifier`, standalone `/login`, `/landing`, `/dashboard`, and fallback redirect.

- [ ] **Step 3: Implement `frontend/src/main.tsx`**
  Mount `App` wrapped with `BrowserRouter`, `ThemeProvider`, and `AuthProvider`.

- [ ] **Step 4: Build test with Vite**
  Run: `npm run build --prefix frontend`
  Expected: Vite build completes successfully, producing production output in `frontend/dist`.

- [ ] **Step 5: Commit pages and routing**
  ```bash
  git add frontend/src/pages frontend/src/App.tsx frontend/src/main.tsx
  git commit -m "feat(frontend): implement React Router pages and complete Vite SPA integration"
  ```

---

### Task 6: Next.js Artifact Clean Up & Documentation

**Files:**
- Delete: `.next/`, `app/`, `components/`, `hooks/`, `lib/`, `styles/`, `next.config.mjs`, `next-env.d.ts`, `components.json`, `tsconfig.tsbuildinfo`
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Restructured directory layout.
- Produces: Clean root repository containing only `frontend/`, `backend/`, and config files.

- [ ] **Step 1: Remove legacy Next.js files and caches**
  Delete `.next`, `next.config.mjs`, `next-env.d.ts`, `components.json`, and root source folders already moved into `frontend/`.

- [ ] **Step 2: Update `.gitignore`**
  Add `frontend/dist`, `frontend/node_modules`, `backend/**/bin`, `backend/**/obj`.

- [ ] **Step 3: Update `README.md`**
  Document the new clean structure, Node.js frontend commands (`npm run dev`), and backend instructions (`dotnet run`).

- [ ] **Step 4: Commit cleanup**
  ```bash
  git add -A
  git commit -m "chore: remove legacy Next.js files and finalize monorepo structure"
  ```

---

### Task 7: Verification & Testing

- [ ] **Step 1: Test frontend production build**
  Run: `npm run build --prefix frontend`
  Expected: Success with 0 errors.

- [ ] **Step 2: Test backend compilation**
  Run: `dotnet build backend/AssessmentWebApi/AssessmentWebApi/AssessmentWebApi.csproj`
  Expected: Build succeeded with 0 errors.

- [ ] **Step 3: Test local dev server start**
  Verify Vite dev server launches on port 3000 without errors.

---

### Task 8: Root Folder Renaming Command (`sewedy-assessment-system`)

**Files:**
- Create: `scripts/rename-project.ps1`

- [ ] **Step 1: Create PowerShell rename helper script**
  Provide safe script that checks directory locks and renames `sewedy-assessment-system-main` to `sewedy-assessment-system`.

- [ ] **Step 2: Commit script and provide direct execution command to user**
