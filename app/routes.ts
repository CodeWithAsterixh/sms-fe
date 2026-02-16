import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("../src/views/components/layout/AppLayout.tsx", [
    index("../src/views/pages/Dashboard.tsx"),
    route("students", "../src/views/pages/StudentsPage.tsx"),
    route("students/:uid", "../src/views/pages/StudentProfilePage.tsx"),
    route("users", "../src/views/pages/UsersPage.tsx"),
    route("roles", "../src/views/pages/RolesPage.tsx"),
    route("attendance", "../src/views/pages/AttendancePage.tsx"),
  ]),
  route("login", "../src/views/pages/LoginPage.tsx"),
] satisfies RouteConfig;
