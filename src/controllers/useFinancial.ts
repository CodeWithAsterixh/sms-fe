import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financialService } from "../services/financial.service";
import type { CreateFinancialRecordDTO, UpdateFinancialRecordDTO } from "../models/financial.types";
import { QUERY_KEYS } from "../config/constants";

export const useStudentFinancials = (studentId: number | string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.FINANCIAL, studentId],
    queryFn: () => financialService.getByStudentId(studentId),
    enabled: !!studentId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFinancialRecordDTO) => financialService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINANCIAL, studentId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateFinancialRecordDTO }) => 
      financialService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINANCIAL, studentId] });
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
  };
};
