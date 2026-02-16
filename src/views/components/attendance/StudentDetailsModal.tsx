import { Dialog, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import type { Student } from "../../../models/student.types";
import { clsx } from "clsx";
import { User, Calendar, Hash, School, Activity } from "lucide-react";

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export const StudentDetailsModal = ({ open, onOpenChange, student }: StudentDetailsModalProps) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Student Details</DialogTitle>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {/* Header with Avatar and Name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {student.first_name[0]}{student.last_name[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {student.student_uid}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 rounded-lg border p-4 bg-card/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <School className="h-3 w-3" />
                Class
              </label>
              <p className="text-sm font-medium">{student.class_name || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Status
              </label>
              <span className={clsx(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                student.status === 'active' ? "bg-green-100 text-green-800" : 
                student.status === 'suspended' ? "bg-red-100 text-red-800" : 
                "bg-gray-100 text-gray-800"
              )}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Today's Attendance
              </label>
              <span className={clsx(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                student.today_status === 'IN' 
                  ? "bg-green-100 text-green-800"
                  : student.today_status === 'OUT'
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              )}>
                {student.today_status === 'IN' ? 'Signed In' : 
                 student.today_status === 'OUT' ? 'Signed Out' : 
                 'Not Signed In'}
              </span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Created At
              </label>
              <p className="text-sm font-medium">
                {new Date(student.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </div>
    </Dialog>
  );
};
