import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, Shield } from "lucide-react";

export const NAVIGATION_LINKS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", permission: null },
  { to: "/students", icon: GraduationCap, label: "Students", permission: "view_students" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attendance", permission: "view_attendance" },
  { to: "/users", icon: Users, label: "Users", permission: "view_users" },
  { to: "/roles", icon: Shield, label: "Roles", permission: "manage_roles" },
];
