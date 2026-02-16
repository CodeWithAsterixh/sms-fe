import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/api/queryClient";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/auth.store";
import { authService } from "../src/services/auth.service";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { setUser, logout } = useAuthStore();
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.checkAuth();
      if (user) {
        setUser(user);
      } else {
        logout();
      }
    };
    checkAuth();
  }, [setUser, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
