import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { LoginDTO, AuthResponse } from "../models/auth.types";
import type { ApiResponse } from "../models/api.types";

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data;
  },
  
  refreshToken: async (token: string) => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(ENDPOINTS.AUTH.REFRESH, { token });
    return response.data.data;
  },
  
  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
  }
};
