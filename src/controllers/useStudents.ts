import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService, type StudentFilters } from "../services/student.service";
import type { CreateStudentDTO } from "../models/student.types";
import { QUERY_KEYS } from "../config/constants";

export const useStudents = (filters: StudentFilters = {}) => {
  const queryClient = useQueryClient();

  const studentsQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, filters],
    queryFn: () => studentService.getAll(filters),
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
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS, id] });
    },
  });

  return {
    student: studentQuery.data,
    isLoading: studentQuery.isLoading,
    isError: studentQuery.isError,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

export const useStudentFinancials = (id: number | string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id, 'financials'],
    queryFn: () => studentService.getFinancials(id),
    enabled: !!id,
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => studentService.addFinancial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS, id, 'financials'] });
    },
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    add: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
};

export const useStudentDisciplinary = (id: number | string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id, 'disciplinary'],
    queryFn: () => studentService.getDisciplinary(id),
    enabled: !!id,
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => studentService.addDisciplinary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS, id, 'disciplinary'] });
    },
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    add: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
};

export const useStudentClassHistory = (id: number | string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id, 'class-history'],
    queryFn: () => studentService.getClassHistory(id),
    enabled: !!id,
  });
};
