export interface Permission {
  id: number;
  slug: string;
  description: string;
}

export interface RolePermissionsResponse {
  success: boolean;
  data: string[]; // array of slugs
}

export interface PermissionsResponse {
  success: boolean;
  data: Permission[];
}
