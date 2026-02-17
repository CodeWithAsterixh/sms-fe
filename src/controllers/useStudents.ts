import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService, type StudentFilters } from "../services/student.service";
import type { CreateStudentDTO } from "../models/student.types";
import { QUERY_KEYS } from "../config/constants";

export const useStudents = (filters: StudentFilters = {}) => {
  const queryClient = useQueryClient();

  const studentsQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, filters],
    queryFn: () => studentService.getAll(filters),
    placeholderData: (previousData) => previousData,
  });

  const createStudentMutation = useMutation({
    mutationFn: (data: CreateStudentDTO) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
  });

  return {
    students: studentsQuery.data?.students || [],
    total: studentsQuery.data?.total || 0,
    totalPages: studentsQuery.data?.totalPages || 0,
    isLoading: studentsQuery.isLoading,
    isError: studentsQuery.isError,
    createStudent: createStudentMutation.mutate,
    isCreating: createStudentMutation.isPending,
  };
};

export const useStudent = (id: number | string) => {
  const queryClient = useQueryClient();

  const studentQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
    initialData: () => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEYS.STUDENTS] });
      for (const [key, data] of queries) {
        if (data && (data as any).students) {
          const student = (data as any).students.find((s: any) => 
            s.id === Number(id) || s.student_uid === id
          );
          if (student) return student;
        }
      }
      return undefined;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => studentService.uploadProfileImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS, id] });
      // Also invalidate list to update thumbnails
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS], exact: false });
    },
  });

  return {
    student: studentQuery.data,
    isLoading: studentQuery.isLoading,
    isError: studentQuery.isError,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    uploadImage: uploadImageMutation.mutateAsync,
    isUploading: uploadImageMutation.isPending,
  };
};

export const useStudentClassHistory = (id: number | string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id, 'class-history'],
    queryFn: () => studentService.getClassHistory(id),
    enabled: !!id,
  });
};
