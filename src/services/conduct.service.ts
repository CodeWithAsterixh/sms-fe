import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { ConductRecord, CreateConductRecordDTO, UpdateConductRecordDTO } from "../models/conduct.types";
import type { ApiResponse } from "../models/api.types";

export const conductService = {
  getByStudentId: async (studentId: number | string): Promise<ConductRecord[]> => {
    const response = await apiClient.get<ApiResponse<ConductRecord[]>>(ENDPOINTS.CONDUCT.BY_STUDENT(studentId));
    return response.data.data;
  },

  create: async (data: CreateConductRecordDTO): Promise<ConductRecord> => {
    const response = await apiClient.post<ApiResponse<ConductRecord>>(ENDPOINTS.CONDUCT.CREATE, data);
    return response.data.data;
  },

  update: async (id: number | string, data: UpdateConductRecordDTO): Promise<ConductRecord> => {
    const response = await apiClient.patch<ApiResponse<ConductRecord>>(ENDPOINTS.CONDUCT.UPDATE(id), data);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CONDUCT.DELETE(id));
  }
};
