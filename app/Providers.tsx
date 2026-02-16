import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/api/queryClient";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
