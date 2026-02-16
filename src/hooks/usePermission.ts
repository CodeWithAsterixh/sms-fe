import { useAuthStore } from "../store/auth.store";

export const usePermission = (permission: string) => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  return user.permissions?.includes(permission) || false;
};

export const usePermissions = (permissions: string[]) => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  return permissions.every(p => user.permissions?.includes(p));
};
