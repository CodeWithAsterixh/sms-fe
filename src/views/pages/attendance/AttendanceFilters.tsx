import { clsx } from "clsx";
import { UserCheck, Clock, UserX } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface AttendanceFiltersProps {
  searchFilters: { search: string; classId?: number };
  statusFilter: string;
  selectedClass?: { name: string };
  onClearAll: () => void;
  onStatusFilterChange: (status: string) => void;
}

export const AttendanceFilters = ({
  searchFilters,
  statusFilter,
  selectedClass,
  onClearAll,
  onStatusFilterChange,
}: AttendanceFiltersProps) => {
  return (
    <>
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
            onClick={onClearAll}
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
          onClick={() => onStatusFilterChange("")}
        >
          All Students
        </Button>
        <Button 
          variant={statusFilter === "IN" ? "default" : "outline"} 
          size="sm"
          className={statusFilter === "IN" ? "bg-green-600 hover:bg-green-700" : "text-green-600 hover:bg-green-50"}
          onClick={() => onStatusFilterChange("IN")}
        >
          <UserCheck className="mr-2 h-3.5 w-3.5" />
          Signed In
        </Button>
        <Button 
          variant={statusFilter === "OUT" ? "default" : "outline"} 
          size="sm"
          className={statusFilter === "OUT" ? "bg-orange-600 hover:bg-orange-700" : "text-orange-600 hover:bg-orange-50"}
          onClick={() => onStatusFilterChange("OUT")}
        >
          <Clock className="mr-2 h-3.5 w-3.5" />
          Signed Out
        </Button>
        <Button 
          variant={statusFilter === "ABSENT" ? "default" : "outline"} 
          size="sm"
          className={statusFilter === "ABSENT" ? "bg-red-600 hover:bg-red-700" : "text-red-600 hover:bg-red-50"}
          onClick={() => onStatusFilterChange("ABSENT")}
        >
          <UserX className="mr-2 h-3.5 w-3.5" />
          Not Signed In
        </Button>
      </div>
    </>
  );
};
