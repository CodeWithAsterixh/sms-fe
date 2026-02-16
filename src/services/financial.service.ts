import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { FinancialRecord, CreateFinancialRecordDTO, UpdateFinancialRecordDTO } from "../models/financial.types";
import type { ApiResponse } from "../models/api.types";

export const financialService = {
  getByStudentId: async (studentId: number | string): Promise<FinancialRecord[]> => {
    const response = await apiClient.get<ApiResponse<FinancialRecord[]>>(ENDPOINTS.FINANCIAL.BY_STUDENT(studentId));
    return response.data.data;
  },

  create: async (data: CreateFinancialRecordDTO): Promise<FinancialRecord> => {
    const response = await apiClient.post<ApiResponse<FinancialRecord>>(ENDPOINTS.FINANCIAL.CREATE, data);
    return response.data.data;
  },

  update: async (id: number | string, data: UpdateFinancialRecordDTO): Promise<FinancialRecord> => {
    const response = await apiClient.patch<ApiResponse<FinancialRecord>>(ENDPOINTS.FINANCIAL.UPDATE(id), data);
    return response.data.data;
  },
};
