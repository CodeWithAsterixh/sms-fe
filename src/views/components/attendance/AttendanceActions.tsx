import { useState } from "react";
import { Button } from "../ui/Button";
import { RotateCcw, LogIn, LogOut } from "lucide-react";
import { AttendanceConfirmationModal } from "./AttendanceConfirmationModal";
import { attendanceService } from "../../../services/attendance.service";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "sonner";
import type { Student } from "../../../models/student.types";
import { useQueryClient } from "@tanstack/react-query";

interface AttendanceActionsProps {
  student: Student;
  onSuccess?: () => void;
  size?: "sm" | "default" | "lg" | "icon";
  showLabel?: boolean;
}

export const AttendanceActions = ({ student, onSuccess, size = "sm", showLabel = true }: AttendanceActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    isDestructive?: boolean;
    actionLabel?: string;
  }>({
    open: false,
    title: "",
    description: "",
    action: async () => {},
  });

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const canUndo = user?.role === "admin" || user?.role === "principal" || user?.role === "gatekeeper";
  const status = student.today_status;

  // Helper to refresh data
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: ["attendance"] });
    if (onSuccess) onSuccess();
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) throw new Error("User not authenticated");
      
      await attendanceService.record({
        student_id: student.id,
        type: "IN",
        recorded_by: user.id
      });
      
      toast.success(`Signed in ${student.first_name}`);
      refreshData();
    } catch (error) {
      toast.error("Failed to sign in student");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) throw new Error("User not authenticated");

      await attendanceService.record({
        student_id: student.id,
        type: "OUT",
        recorded_by: user.id
      });

      toast.success(`Signed out ${student.first_name}`);
      refreshData();
    } catch (error) {
      toast.error("Failed to sign out student");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUndo = (type: 'IN' | 'OUT') => {
    setModalConfig({
      open: true,
      title: `Undo ${type === 'IN' ? 'Sign In' : 'Sign Out'}`,
      description: `Are you sure you want to revert the latest ${type === 'IN' ? 'sign in' : 'sign out'} record for ${student.first_name}? This action cannot be undone.`,
      action: async () => handleRevert(type),
      isDestructive: true,
      actionLabel: "Revert",
    });
  };

  const handleRevert = async (type: 'IN' | 'OUT') => {
    try {
      setIsLoading(true);
      await attendanceService.deleteLatest(student.id, type);
      toast.success(`${type === 'IN' ? 'Sign in' : 'Sign out'} reverted`);
      refreshData();
    } catch (error) {
      toast.error("Failed to revert attendance");
      console.error(error);
    } finally {
      setIsLoading(false);
      setModalConfig(prev => ({ ...prev, open: false }));
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Not Signed In: Show Sign In */}
        {!status && (
          <Button
            variant="default"
            size={size}
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <LogIn className="h-4 w-4" />
            {showLabel && "Sign In"}
          </Button>
        )}

        {/* Signed In: Show Sign Out + Undo In */}
        {status === 'IN' && (
          <>
            <Button
              variant="default"
              size={size}
              onClick={handleSignOut}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <LogOut className="h-4 w-4" />
              {showLabel && "Sign Out"}
            </Button>

            {canUndo && (
              <Button
                variant="ghost"
                size={size}
                onClick={() => confirmUndo('IN')}
                disabled={isLoading}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {showLabel && "Undo In"}
              </Button>
            )}
          </>
        )}

        {/* Signed Out: Show Sign In (Re-entry) + Undo Out */}
        {status === 'OUT' && (
          <>
            <Button
              variant="outline"
              size={size}
              onClick={handleSignIn}
              disabled={isLoading}
              className="border-green-600 text-green-600 hover:bg-green-50 gap-2"
            >
              <LogIn className="h-4 w-4" />
              {showLabel && "Sign In"}
            </Button>

            {canUndo && (
              <Button
                variant="ghost"
                size={size}
                onClick={() => confirmUndo('OUT')}
                disabled={isLoading}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {showLabel && "Undo Out"}
              </Button>
            )}
          </>
        )}
      </div>

      <AttendanceConfirmationModal
        open={modalConfig.open}
        onOpenChange={(open) => setModalConfig(prev => ({ ...prev, open }))}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.action}
        isDestructive={modalConfig.isDestructive}
        actionLabel={modalConfig.actionLabel}
      />
    </>
  );
};
