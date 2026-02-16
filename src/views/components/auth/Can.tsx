import { useAuthStore } from "../../../store/auth.store";

interface CanProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can = ({ permission, children, fallback = null }: CanProps) => {
  const { user } = useAuthStore();
  
  // Admin has access to everything by default, but we should rely on permissions if available.
  // However, for safety, if user is admin, allow access.
  const hasPermission = user?.permissions?.includes(permission) || user?.role === 'admin';
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
