import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import type { CreateUserDTO } from "../models/user.types";
import { QUERY_KEYS } from "../config/constants";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userService.getAll,
  });

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,
  };
};
