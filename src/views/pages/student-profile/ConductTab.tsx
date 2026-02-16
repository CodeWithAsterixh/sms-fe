import { useState } from "react";
import { useStudentConduct } from "../../../controllers/useConduct";
import { useStudentClassHistory } from "../../../controllers/useStudents";
import { useAuthStore } from "../../../store/auth.store";
import { Loader } from "../../components/ui/Loader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dialog, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { BookOpen, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { toast } from "sonner";

export const ConductTab = ({ studentId }: { studentId: number }) => {
  const { records: disciplinary, isLoading: loadingDisciplinary, create: addDisciplinary, deleteRecord: deleteDisciplinary } = useStudentConduct(studentId);
  const { data: classHistory, isLoading: loadingHistory } = useStudentClassHistory(studentId);
  const { user } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState({ 
    student_id: studentId,
    title: '',
    description: '',
    severity: 'low' as 'low' | 'medium' | 'high'
  });

  const canView = user?.permissions?.includes('view_conduct') || user?.role === 'admin';
  const canAddDisciplinary = user?.permissions?.includes('create_conduct') || user?.role === 'admin';
  const canDeleteDisciplinary = user?.permissions?.includes('delete_conduct') || user?.role === 'admin';

  const handleAddDisciplinary = async () => {
    try {
      await addDisciplinary({
        ...newRecord,
        student_id: studentId
      });
      setIsAddModalOpen(false);
      setNewRecord({ student_id: studentId, title: '', description: '', severity: 'low' });
      toast.success("Record added successfully");
    } catch (error) {
      toast.error("Failed to add record");
    }
  };

  const handleDeleteDisciplinary = async () => {
    if (!recordToDelete) return;
    try {
      await deleteDisciplinary(recordToDelete);
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
      toast.success("Record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const confirmDelete = (id: number) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (!canView) return <div className="p-8 text-center text-muted-foreground">You do not have permission to view academic records.</div>;
  if (loadingDisciplinary || loadingHistory) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Class History Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Class History
        </h3>
        <Card>
           <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Session</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Promoted Date</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {classHistory?.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No class history found</td></tr>
                ) : (
                  classHistory?.map((record: any) => (
                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{record.class_name}</td>
                      <td className="p-4 align-middle">{record.academic_session}</td>
                      <td className="p-4 align-middle">{format(new Date(record.promoted_at), "MMM d, yyyy")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Disciplinary Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Conduct Records
          </h3>
          {canAddDisciplinary && (
            <Button onClick={() => setIsAddModalOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          )}
        </div>
        <Card>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Severity</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recorded By</th>
                  {canDeleteDisciplinary && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {disciplinary?.length === 0 ? (
                  <tr><td colSpan={canDeleteDisciplinary ? 6 : 5} className="p-4 text-center text-muted-foreground">No conduct records found</td></tr>
                ) : (
                  disciplinary?.map((record: any) => (
                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{record.title}</td>
                      <td className="p-4 align-middle">
                        <span className={clsx(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                          record.severity === 'low' ? "bg-blue-100 text-blue-800" :
                          record.severity === 'medium' ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {record.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{record.description}</td>
                      <td className="p-4 align-middle">{format(new Date(record.created_at), "MMM d, yyyy")}</td>
                      <td className="p-4 align-middle">{record.creator_name}</td>
                      {canDeleteDisciplinary && (
                        <td className="p-4 align-middle">
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => confirmDelete(record.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader><DialogTitle>Add Conduct Record</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={newRecord.title}
              onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
              placeholder="Record Title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Severity</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={newRecord.severity}
              onChange={(e) => setNewRecord({...newRecord, severity: e.target.value as any})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input 
              value={newRecord.description}
              onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
              placeholder="Enter details..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDisciplinary}>Save Record</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogHeader><DialogTitle>Delete Record</DialogTitle></DialogHeader>
        <div className="py-4 space-y-4">
          <p>Are you sure you want to delete this conduct record? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteDisciplinary}>Delete</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
