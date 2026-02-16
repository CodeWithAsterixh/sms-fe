import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "../services/permission.service";
import { toast } from "sonner";

export const usePermissions = () => {
  const queryClient = useQueryClient();

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: permissionService.getAllPermissions,
  });

  return { permissions, isLoadingPermissions };
};

export const useRolePermissions = (role: string) => {
  const queryClient = useQueryClient();

  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useQuery({
    queryKey: ["role-permissions", role],
    queryFn: () => permissionService.getRolePermissions(role),
    enabled: !!role,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: (newPermissions: string[]) => 
      permissionService.updateRolePermissions(role, newPermissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions", role] });
      toast.success("Permissions updated successfully");
    },
    onError: () => {
      toast.error("Failed to update permissions");
    },
  });

  return { 
    rolePermissions, 
    isLoadingRolePermissions, 
    updatePermissions: updatePermissionsMutation.mutate 
  };
};
