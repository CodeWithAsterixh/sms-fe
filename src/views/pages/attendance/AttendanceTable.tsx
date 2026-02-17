import { clsx } from "clsx";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { AttendanceActions } from "../../components/attendance/AttendanceActions";
import type { Student } from "../../../models/student.types";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { ENV } from "../../../config/env";

interface AttendanceTableProps {
  students: Student[];
  isLoading: boolean;
  isError: boolean;
  onViewDetails: (student: Student) => void;
}

export const AttendanceTable = ({
  students,
  isLoading,
  isError,
  onViewDetails,
}: AttendanceTableProps) => {
  const getProfileImageUrl = (student: Student) => {
    return student.photo_url 
      ? (student.photo_url.startsWith('http') ? student.photo_url : `${ENV.API_URL}${student.photo_url}`)
      : undefined;
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (status === 'IN') {
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Signed In</span>;
    } else if (status === 'OUT') {
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Signed Out</span>;
    } else {
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Not Signed In</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load students. Please try again.
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
        <p>No students found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {students.map((student) => (
          <Card key={student.id} className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar 
                src={getProfileImageUrl(student)} 
                fallback={`${student.first_name[0]}${student.last_name[0]}`} 
                size="md" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{student.student_uid}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs text-gray-500">Class: {student.class_name || "-"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 {getStatusBadge(student.today_status)}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4 mt-2">
                <div className="flex items-center gap-2">
                    <AttendanceActions student={student} />
                </div>
                <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onViewDetails(student)}
                >
                    Details
                </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-card relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {students.map((student) => (
                <tr key={student.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            src={getProfileImageUrl(student)} 
                            fallback={`${student.first_name[0]}${student.last_name[0]}`} 
                            size="sm" 
                        />
                        <span>{student.first_name} {student.last_name}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">{student.student_uid}</td>
                  <td className="p-4 align-middle">{student.class_name || "-"}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(student.today_status)}
                      
                      <div className="h-4 w-px bg-border mx-2" />
                      
                      <AttendanceActions student={student} />
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => onViewDetails(student)}
                      >
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};
