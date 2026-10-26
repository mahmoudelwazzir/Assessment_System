import { RoleLayout } from "@/components/layout/role-layout";
import { Outlet } from "react-router-dom";

export default function AssessorLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <RoleLayout>{children || <Outlet />}</RoleLayout>;
}
