import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { Announcement, CreateAnnouncementDTO } from "../models/announcement.types";
import type { ApiResponse } from "../models/api.types";

export const announcementService = {
  getByStudentId: async (studentId: number | string): Promise<Announcement[]> => {
    const response = await apiClient.get<ApiResponse<Announcement[]>>(ENDPOINTS.ANNOUNCEMENTS.BY_STUDENT(studentId));
    return response.data.data;
  },

  create: async (data: CreateAnnouncementDTO): Promise<Announcement> => {
    const response = await apiClient.post<ApiResponse<Announcement>>(ENDPOINTS.ANNOUNCEMENTS.CREATE, data);
    return response.data.data;
  }
};
