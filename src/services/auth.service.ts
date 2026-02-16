import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { LoginDTO, TokenPayload } from "../models/auth.types";
import type { ApiResponse } from "../models/api.types";

export const authService = {
  login: async (credentials: LoginDTO) => {
    const response = await apiClient.post<ApiResponse<{ user: TokenPayload }>>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data.user;
  },
  
  refreshToken: async () => {
    // Backend reads refreshToken from cookie
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(ENDPOINTS.AUTH.REFRESH, {});
    return response.data.data;
  },

  checkAuth: async () => {
    try {
      const response = await apiClient.get<ApiResponse<{ user: TokenPayload }>>("/auth/me");
      return response.data.data.user;
    } catch {
      return null;
    }
  },
  
  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
  }
};
