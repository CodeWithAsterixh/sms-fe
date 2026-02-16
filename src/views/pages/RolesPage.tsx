import { useState } from "react";
import type { UserRole } from "../../models/auth.types";
import { Shield } from "lucide-react";
import { RolePermissionsEditor } from "./roles/RolePermissionsEditor";

const ROLES: { id: UserRole; label: string; description: string }[] = [
  { id: "admin", label: "Administrator", description: "Full system access" },
  { id: "principal", label: "Principal", description: "School management access" },
  { id: "teacher", label: "Teacher", description: "Class and student management" },
  { id: "gatekeeper", label: "Gatekeeper", description: "Attendance scanning only" },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">
          Manage system roles and their access levels.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <nav className="flex flex-col space-y-1">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${selectedRole === role.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
              `}
            >
              <Shield className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span>{role.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="rounded-lg border bg-card p-6">
          <RolePermissionsEditor key={selectedRole} role={selectedRole} />
        </div>
      </div>
    </div>
  );
}
