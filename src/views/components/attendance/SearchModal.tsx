import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useClasses } from "../../../controllers/useClasses";
import { Loader2 } from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: { search: string; classId?: number }) => void;
  initialFilters?: { search: string; classId?: number };
}

export const SearchModal = ({ open, onOpenChange, onSearch, initialFilters }: SearchModalProps) => {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [classId, setClassId] = useState<number | undefined>(initialFilters?.classId);
  const { classes, isLoading: isLoadingClasses } = useClasses();

  // Reset local state when modal opens/closes or initialFilters change
  useEffect(() => {
    if (open) {
      setSearch(initialFilters?.search || "");
      setClassId(initialFilters?.classId);
    }
  }, [open, initialFilters]);

  const handleSearch = () => {
    onSearch({ search, classId });
    onOpenChange(false);
  };

  const handleClear = () => {
    setSearch("");
    setClassId(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Search Students</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Student Name or ID
          </label>
          <Input
            id="name"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="class" className="text-sm font-medium">
            Class
          </label>
          {isLoadingClasses ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading classes...
            </div>
          ) : (
            <select
              id="class"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={classId || ""}
              onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Classes</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClear} type="button">
          Clear Filters
        </Button>
        <Button onClick={handleSearch} type="button">
          Search
        </Button>
      </div>
    </Dialog>
  );
};
