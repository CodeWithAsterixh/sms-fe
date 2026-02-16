import type { UserRole } from "./user.types";

export type { UserRole };

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
