import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

let isSessionExpiredNotified = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failed request is the refresh token request itself, don't retry
      if (originalRequest.url?.includes("/auth/refresh")) {
         return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        // Try to refresh the token using a clean axios instance to avoid interceptor loops
        await axios.post(`${ENV.API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // If successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        
        // Prevent duplicate toasts
        if (!isSessionExpiredNotified) {
          // Don't show toast if it's the checkAuth call on startup
          if (!originalRequest.url?.includes("/auth/me")) {
            isSessionExpiredNotified = true;
            toast.error("Session expired. Please login again.");
            setTimeout(() => {
              isSessionExpiredNotified = false;
            }, 2000);
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || "An unexpected error occurred";
    // Avoid showing toast for 401 as it is handled above, and 404s might be intended
    if (error.response?.status !== 401 && error.response?.status !== 404) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
