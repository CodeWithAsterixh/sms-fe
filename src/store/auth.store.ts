import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TokenPayload } from "../models/auth.types";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: TokenPayload | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken, refreshToken) => {
        try {
          const user = jwtDecode<TokenPayload>(accessToken);
          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
