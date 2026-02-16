import { useAttendance } from "../../../controllers/useAttendance";
import { Loader } from "../../components/ui/Loader";
import { Card } from "../../components/ui/Card";
import { format } from "date-fns";
import { clsx } from "clsx";

export const AttendanceTab = ({ studentId }: { studentId: number }) => {
  const { attendance, isLoading } = useAttendance(studentId);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attendance History</h3>
      </div>

      <Card>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recorded By</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {attendance?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">No attendance records found</td>
                </tr>
              ) : (
                attendance?.map((record: any) => (
                  <tr key={record.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">{format(new Date(record.recorded_at), "MMM d, yyyy")}</td>
                    <td className="p-4 align-middle">
                      <span className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        record.type === 'IN' ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      )}>
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{format(new Date(record.recorded_at), "h:mm a")}</td>
                    <td className="p-4 align-middle">{record.recorder_name || record.recorded_by || "System"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
