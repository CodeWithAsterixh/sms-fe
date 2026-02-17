import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { Student, CreateStudentDTO, FinancialRecord, DisciplinaryRecord, ClassHistory } from "../models/student.types";
import type { ApiResponse } from "../models/api.types";

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  classId?: number;
  status?: string;
}

export interface PaginatedStudents {
  students: Student[];
  total: number;
  totalPages: number;
}

export const studentService = {
  getAll: async (filters: StudentFilters = {}): Promise<PaginatedStudents> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.classId) params.append("classId", filters.classId.toString());
    if (filters.status) params.append("status", filters.status);

    const response = await apiClient.get<ApiResponse<PaginatedStudents>>(`${ENDPOINTS.STUDENTS.LIST}?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id: number | string): Promise<Student> => {
    const response = await apiClient.get<ApiResponse<Student>>(ENDPOINTS.STUDENTS.DETAIL(id));
    return response.data.data;
  },

  create: async (data: CreateStudentDTO): Promise<Student> => {
    if (data.image) {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("class_id", data.class_id.toString());
      formData.append("image", data.image);
      
      const response = await apiClient.post<ApiResponse<Student>>(ENDPOINTS.STUDENTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data.data;
    } else {
      const response = await apiClient.post<ApiResponse<Student>>(ENDPOINTS.STUDENTS.CREATE, data);
      return response.data.data;
    }
  },

  update: async (id: number | string, data: Partial<Student>): Promise<Student> => {
    const response = await apiClient.put<ApiResponse<Student>>(`${ENDPOINTS.STUDENTS.DETAIL(id)}`, data);
    return response.data.data;
  },

  getClassHistory: async (id: number | string): Promise<ClassHistory[]> => {
    const response = await apiClient.get<ApiResponse<ClassHistory[]>>(ENDPOINTS.STUDENTS.CLASS_HISTORY(id));
    return response.data.data;
  },

  uploadProfileImage: async (id: number | string, file: File): Promise<Student> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<ApiResponse<Student>>(
      ENDPOINTS.STUDENTS.PROFILE_IMAGE(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  }
};
