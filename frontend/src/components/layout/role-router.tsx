"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/ui/spinner";
import { PendingAssignmentScreen } from "./pending-assignment-screen";

interface RoleRouterProps {
  children: React.ReactNode;
}

// Which path prefixes each role is allowed to access
const ROLE_PREFIXES: Record<string, string> = {
  controller: "/controller",
  assessor: "/assessor",
  verifier: "/verifier",
};

export function RoleRouter({ children }: RoleRouterProps) {
  const { user, isLoading, roleContext, isRoleLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const router = { push: (path: string) => navigate(path) };

  useEffect(() => {
    if (isLoading || isRoleLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    console.log("🎯 RoleRouter - user:", user);
    console.log("🎯 RoleRouter - roleContext:", roleContext);

    const accountRole = user.accountRole;

    // For controller, always allow controller routes
    if (accountRole === "controller") {
      if (!pathname.startsWith("/controller")) {
        router.push("/controller/dashboard");
      }
      return;
    }

    // For assessors and verifiers, check their assigned role from roleContext
    const assignedRole = roleContext?.assignedRole || accountRole;
    if (assignedRole === "assessor" && !pathname.startsWith("/assessor")) {
      if (pathname === "/controller/reports") {
        router.push("/assessor/reports");
        return;
      }
      if (pathname === "/controller/questions-grading") {
        router.push("/assessor/automated-grading");
        return;
      }
      router.push("/assessor/students");
    } else if (assignedRole === "verifier" && !pathname.startsWith("/verifier")) {
      if (pathname === "/controller/reports") {
        router.push("/verifier/reports");
        return;
      }
      router.push("/verifier/results");
    }
  }, [user, isLoading, isRoleLoading, roleContext, pathname, router]);

  if (isLoading || isRoleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">Resolving your role...</p>
      </div>
    );
  }

  if (!user) return null;

  // Only block if user has no role at all and no assignment
  if (user.accountRole !== "controller" && user.accountRole !== "verifier" && !roleContext) {
    return <PendingAssignmentScreen />;
  }

  return <>{children}</>;
}
