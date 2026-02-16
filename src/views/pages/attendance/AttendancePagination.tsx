import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface AttendancePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  studentsCount: number;
  onPageChange: (page: number) => void;
}

export const AttendancePagination = ({
  page,
  totalPages,
  total,
  limit,
  studentsCount,
  onPageChange,
}: AttendancePaginationProps) => {
  return (
    <div className="flex items-center justify-between border-t px-4 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {studentsCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} entries
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
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
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
