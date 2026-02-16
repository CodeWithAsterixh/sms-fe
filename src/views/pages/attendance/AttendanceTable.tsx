import { clsx } from "clsx";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { AttendanceActions } from "../../components/attendance/AttendanceActions";
import type { Student } from "../../../models/student.types";

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
  return (
    <div className="rounded-md border bg-card">
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500">
          Failed to load students. Please try again.
        </div>
      ) : students.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
          <p>No students found matching your criteria.</p>
        </div>
      ) : (
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {students.map((student) => (
                <tr key={student.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{student.student_uid}</td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col">
                      <span>{student.first_name} {student.last_name}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{student.class_name || "-"}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-fit",
                        student.today_status === 'IN' 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : student.today_status === 'OUT'
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      )}>
                        {student.today_status === 'IN' ? 'Signed In' : student.today_status === 'OUT' ? 'Signed Out' : 'Not Signed In'}
                      </span>
                      
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
      )}
    </div>
  );
};
