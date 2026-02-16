import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  UserCheck,
  UserX
} from "lucide-react";
import { useState } from "react";
import { useClasses } from "../../controllers/useClasses";
import { useStudents } from "../../controllers/useStudents";
import type { Student } from "../../models/student.types";
import { SearchModal } from "../components/attendance/SearchModal";
import { StudentDetailsModal } from "../components/attendance/StudentDetailsModal";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>(""); // 'IN', 'OUT', 'ABSENT', ''
  const [searchFilters, setSearchFilters] = useState<{ search: string; classId?: number }>({
    search: "",
    classId: undefined
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { students, total, totalPages, isLoading, isError } = useStudents({
    page,
    limit,
    status: statusFilter || undefined,
    search: searchFilters.search,
    classId: searchFilters.classId
  });
  
  // To show class name in filter summary
  const { classes } = useClasses();
  const selectedClass = classes?.find(c => c.id === searchFilters.classId);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (filters: { search: string; classId?: number }) => {
    setSearchFilters(filters);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">
              Manage and view student attendance records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsSearchOpen(true)} className="gap-2">
              <Search className="h-4 w-4" />
              Search & Filter
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchFilters.search || searchFilters.classId || statusFilter) && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm shadow-sm">
            <span className="font-medium text-muted-foreground">Active Filters:</span>
            
            {searchFilters.search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Search: "{searchFilters.search}"
              </span>
            )}
            
            {selectedClass && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Class: {selectedClass.name}
              </span>
            )}
            
            {statusFilter && (
              <span className={clsx(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                statusFilter === 'IN' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                statusFilter === 'OUT' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                statusFilter === 'ABSENT' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                Status: {statusFilter === 'IN' ? 'Signed In' : statusFilter === 'OUT' ? 'Signed Out' : 'Not Signed In'}
              </span>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-auto p-0 px-2 text-xs"
              onClick={() => {
                setSearchFilters({ search: "", classId: undefined });
                setStatusFilter("");
                setPage(1);
              }}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Quick Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant={statusFilter === "" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleStatusFilterChange("")}
          >
            All Students
          </Button>
          <Button 
            variant={statusFilter === "IN" ? "default" : "outline"} 
            size="sm"
            className={statusFilter === "IN" ? "bg-green-600 hover:bg-green-700" : "text-green-600 hover:bg-green-50"}
            onClick={() => handleStatusFilterChange("IN")}
          >
            <UserCheck className="mr-2 h-3.5 w-3.5" />
            Signed In
          </Button>
          <Button 
            variant={statusFilter === "OUT" ? "default" : "outline"} 
            size="sm"
            className={statusFilter === "OUT" ? "bg-orange-600 hover:bg-orange-700" : "text-orange-600 hover:bg-orange-50"}
            onClick={() => handleStatusFilterChange("OUT")}
          >
            <Clock className="mr-2 h-3.5 w-3.5" />
            Signed Out
          </Button>
          <Button 
            variant={statusFilter === "ABSENT" ? "default" : "outline"} 
            size="sm"
            className={statusFilter === "ABSENT" ? "bg-red-600 hover:bg-red-700" : "text-red-600 hover:bg-red-50"}
            onClick={() => handleStatusFilterChange("ABSENT")}
          >
            <UserX className="mr-2 h-3.5 w-3.5" />
            Not Signed In
          </Button>
        </div>

        {/* Content */}
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
            <>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Today's Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
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
                          <span className={clsx(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            student.today_status === 'IN' 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : student.today_status === 'OUT'
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          )}>
                            {student.today_status === 'IN' ? 'Signed In' : student.today_status === 'OUT' ? 'Signed Out' : 'Not Signed In'}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {/* Action buttons can go here, e.g., Mark Attendance */}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {students.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    Page {page} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SearchModal 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        onSearch={handleSearch}
        initialFilters={searchFilters}
      />

      <StudentDetailsModal 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen}
        student={selectedStudent}
      />
    </>
  );
}
