import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { Attendance, CreateAttendanceDTO } from "../models/attendance.types";
import type { ApiResponse } from "../models/api.types";

export const attendanceService = {
  getByStudentId: async (studentId: number | string): Promise<Attendance[]> => {
    const response = await apiClient.get<ApiResponse<Attendance[]>>(ENDPOINTS.ATTENDANCE.BY_STUDENT(studentId));
    return response.data.data;
  },

  record: async (data: CreateAttendanceDTO): Promise<Attendance> => {
    const response = await apiClient.post<ApiResponse<Attendance>>(ENDPOINTS.ATTENDANCE.RECORD, data);
    return response.data.data;
  },

  deleteLatest: async (studentId: number | string, type?: 'IN' | 'OUT'): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ATTENDANCE.BY_STUDENT(studentId), {
      params: { type }
    });
  }
};
