import { useState, useEffect } from "react";
import { usePermissions, useRolePermissions } from "../../../controllers/usePermissions";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import type { UserRole } from "../../../models/auth.types";
import { Check } from "lucide-react";

export const RolePermissionsEditor = ({ role }: { role: UserRole }) => {
  const { permissions, isLoadingPermissions } = usePermissions();
  const { rolePermissions, isLoadingRolePermissions, updatePermissions } = useRolePermissions(role);
  
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (rolePermissions) {
      setSelectedSlugs(rolePermissions);
      setIsDirty(false);
    }
  }, [rolePermissions]);

  const handleToggle = (slug: string) => {
    setSelectedSlugs(prev => {
      const newSlugs = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      setIsDirty(true);
      return newSlugs;
    });
  };

  const handleSave = () => {
    updatePermissions(selectedSlugs);
    setIsDirty(false);
  };

  if (isLoadingPermissions || isLoadingRolePermissions) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Permissions for {role}</h3>
          <p className="text-sm text-muted-foreground">
            Select what features this role can access.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {permissions?.map((permission) => {
          const isSelected = selectedSlugs.includes(permission.slug);
          return (
            <div 
              key={permission.id}
              className={`
                relative flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer
                ${isSelected ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-accent/50'}
              `}
              onClick={() => handleToggle(permission.slug)}
            >
              <div className={`
                mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border
                ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}
              `}>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </div>
              <div className="space-y-1">
                <p className="font-medium leading-none">{permission.slug}</p>
                <p className="text-xs text-muted-foreground">{permission.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
