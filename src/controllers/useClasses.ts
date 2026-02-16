import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/class.service";
import type { CreateClassDTO } from "../models/class.types";
import { QUERY_KEYS } from "../config/constants";

export const useClasses = () => {
  const queryClient = useQueryClient();

  const classesQuery = useQuery({
    queryKey: [QUERY_KEYS.CLASSES],
    queryFn: classService.getAll,
  });

  const createClassMutation = useMutation({
    mutationFn: (data: CreateClassDTO) => classService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
    },
  });

  return {
    classes: classesQuery.data,
    isLoading: classesQuery.isLoading,
    error: classesQuery.error,
    createClass: createClassMutation.mutate,
    isCreating: createClassMutation.isPending,
  };
};
