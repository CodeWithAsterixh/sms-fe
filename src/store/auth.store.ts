import { create } from "zustand";
import type { TokenPayload } from "../models/auth.types";

interface AuthState {
  user: TokenPayload | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setUser: (user: TokenPayload, accessToken?: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setCheckingAuth: (isChecking: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  setUser: (user, accessToken) => {
    set((state) => ({
      user,
      accessToken: accessToken || state.accessToken,
      isAuthenticated: true,
      isCheckingAuth: false,
    }));
  },
  setAccessToken: (token) => {
    set({ accessToken: token });
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },
  setCheckingAuth: (isChecking) => {
    set({ isCheckingAuth: isChecking });
  },
}));
