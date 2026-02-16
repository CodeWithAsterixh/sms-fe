import { Search } from "lucide-react";
import { useState } from "react";
import { useClasses } from "../../controllers/useClasses";
import { useStudents } from "../../controllers/useStudents";
import type { Student } from "../../models/student.types";
import { SearchModal } from "../components/attendance/SearchModal";
import { StudentDetailsModal } from "../components/attendance/StudentDetailsModal";
import { Button } from "../components/ui/Button";

import { AttendanceFilters } from "./attendance/AttendanceFilters";
import { AttendanceTable } from "./attendance/AttendanceTable";
import { AttendancePagination } from "./attendance/AttendancePagination";

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

        <AttendanceFilters 
          searchFilters={searchFilters}
          statusFilter={statusFilter}
          selectedClass={selectedClass}
          onClearAll={() => {
            setSearchFilters({ search: "", classId: undefined });
            setStatusFilter("");
            setPage(1);
          }}
          onStatusFilterChange={handleStatusFilterChange}
        />

        <div className="rounded-md border bg-card">
          <AttendanceTable 
            students={students}
            isLoading={isLoading}
            isError={isError}
            onViewDetails={(student) => {
              setSelectedStudent(student);
              setIsDetailsOpen(true);
            }}
          />

          {!isLoading && !isError && students.length > 0 && (
            <AttendancePagination 
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              studentsCount={students.length}
              onPageChange={handlePageChange}
            />
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
