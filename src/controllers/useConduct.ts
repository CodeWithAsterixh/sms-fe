import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conductService } from "../services/conduct.service";
import type { CreateConductRecordDTO, UpdateConductRecordDTO } from "../models/conduct.types";
import { QUERY_KEYS } from "../config/constants";

export const useStudentConduct = (studentId: number | string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.CONDUCT, studentId],
    queryFn: () => conductService.getByStudentId(studentId),
    enabled: !!studentId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateConductRecordDTO) => conductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONDUCT, studentId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateConductRecordDTO }) => 
      conductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONDUCT, studentId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => conductService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONDUCT, studentId] });
    },
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRecord: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
