import { create } from "zustand";
import type { TokenPayload } from "../models/auth.types";

interface AuthState {
  user: TokenPayload | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setUser: (user: TokenPayload) => void;
  logout: () => void;
  setCheckingAuth: (isChecking: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },
  setCheckingAuth: (isChecking) => {
    set({ isCheckingAuth: isChecking });
  },
}));
