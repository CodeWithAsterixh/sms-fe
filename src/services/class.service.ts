import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { Class, CreateClassDTO } from "../models/class.types";
import type { ApiResponse } from "../models/api.types";

export const classService = {
  getAll: async (): Promise<Class[]> => {
    const response = await apiClient.get<ApiResponse<Class[]>>(ENDPOINTS.CLASSES.LIST);
    return response.data.data;
  },

  create: async (data: CreateClassDTO): Promise<Class> => {
    const response = await apiClient.post<ApiResponse<Class>>(ENDPOINTS.CLASSES.CREATE, data);
    return response.data.data;
  }
};
