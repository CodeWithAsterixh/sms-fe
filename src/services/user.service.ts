import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { User, CreateUserDTO } from "../models/user.types";
import type { ApiResponse } from "../models/api.types";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(ENDPOINTS.USERS.LIST);
    return response.data.data;
  },

  getById: async (id: number | string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.USERS.DETAIL(id));
    return response.data.data;
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(ENDPOINTS.USERS.CREATE, data);
    return response.data.data;
  }
};
