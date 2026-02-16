import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement refresh token logic here if needed
        // For now, we just logout
        useAuthStore.getState().logout();
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      } catch (refreshError) {
        useAuthStore.getState().logout();
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
