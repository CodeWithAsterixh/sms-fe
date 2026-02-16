import apiClient from "../api/client";
import type { Permission, PermissionsResponse, RolePermissionsResponse } from "../models/permission.types";

export const permissionService = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await apiClient.get<PermissionsResponse>("/permissions");
    return response.data.data;
  },

  getRolePermissions: async (role: string): Promise<string[]> => {
    const response = await apiClient.get<RolePermissionsResponse>(`/permissions/${role}`);
    return response.data.data;
  },

  updateRolePermissions: async (role: string, permissions: string[]): Promise<void> => {
    await apiClient.put(`/permissions/${role}`, { permissions });
  },
};
