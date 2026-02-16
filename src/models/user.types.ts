export type UserRole = "admin" | "principal" | "teacher" | "gatekeeper";
export type UserStatus = "active" | "disabled";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  password_hash: string;
  role: UserRole;
}
