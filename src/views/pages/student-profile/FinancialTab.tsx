import { useState } from "react";
import { useStudentFinancials } from "../../../controllers/useFinancial";
import { useAuthStore } from "../../../store/auth.store";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Dialog, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { DollarSign, Plus, Pencil } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

export const FinancialTab = ({ studentId }: { studentId: number }) => {
  const { records, isLoading, create: addRecord, update: updateRecord } = useStudentFinancials(studentId);
  const { user } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [newRecord, setNewRecord] = useState({ 
    student_id: studentId,
    academic_session: '2024/2025', 
    term: 'First Term', 
    amount_paid: '', 
    amount_due: '0',
    payment_status: 'paid' as 'paid' | 'unpaid' | 'partial'
  });

  const canView = user?.permissions?.includes('view_financials') || user?.role === 'admin';
  const canAdd = user?.permissions?.includes('manage_financials') || user?.role === 'admin';
  const canEdit = user?.permissions?.includes('manage_financials') || user?.role === 'admin';

  if (!canView) return <div className="p-8 text-center text-muted-foreground">You do not have permission to view financial records.</div>;
  if (isLoading) return <Loader />;

  const handleAdd = async () => {
    try {
      await addRecord({ 
        ...newRecord, 
        student_id: studentId,
        amount_paid: Number(newRecord.amount_paid),
        amount_due: Number(newRecord.amount_due)
      });
      setIsAddModalOpen(false);
      setNewRecord({ student_id: studentId, academic_session: '2024/2025', term: 'First Term', amount_paid: '', amount_due: '0', payment_status: 'paid' });
      toast.success("Payment recorded successfully");
    } catch (error) {
      toast.error("Failed to record payment");
    }
  };

  const openEditModal = (record: any) => {
    setEditingRecord({
      ...record,
      amount_paid: String(record.amount_paid),
      amount_due: String(record.amount_due)
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingRecord) return;
    try {
      await updateRecord({
        id: editingRecord.id,
        data: {
          payment_status: editingRecord.payment_status,
          amount_paid: Number(editingRecord.amount_paid),
          amount_due: Number(editingRecord.amount_due)
        }
      });
      setIsEditModalOpen(false);
      setEditingRecord(null);
      toast.success("Record updated successfully");
    } catch (error) {
      toast.error("Failed to update record");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" /> Financial Status
        </h3>
        {canAdd && (
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Record Payment
          </Button>
        )}
      </div>

      <Card>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Session</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Term</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount Paid</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount Due</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recorded By</th>
                {canEdit && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {records?.length === 0 ? (
                <tr><td colSpan={canEdit ? 7 : 6} className="p-4 text-center text-muted-foreground">No financial records found</td></tr>
              ) : (
                records?.map((record: any) => (
                  <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{record.academic_session}</td>
                    <td className="p-4 align-middle">{record.term}</td>
                    <td className="p-4 align-middle font-mono">₦{Number(record.amount_paid).toLocaleString()}</td>
                    <td className="p-4 align-middle font-mono">₦{Number(record.amount_due).toLocaleString()}</td>
                    <td className="p-4 align-middle">
                      <span className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        record.payment_status === 'paid' ? "bg-green-100 text-green-800" : 
                        record.payment_status === 'partial' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      )}>
                        {record.payment_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{record.recorder_name}</td>
                    {canEdit && (
                      <td className="p-4 align-middle">
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => openEditModal(record)}>
                          <Pencil className="h-4 w-4 text-blue-500" />
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

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session</label>
              <Input 
                value={newRecord.academic_session}
                onChange={(e) => setNewRecord({...newRecord, academic_session: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Term</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newRecord.term}
                onChange={(e) => setNewRecord({...newRecord, term: e.target.value})}
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid</label>
              <Input 
                type="number"
                value={newRecord.amount_paid}
                onChange={(e) => setNewRecord({...newRecord, amount_paid: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Due</label>
              <Input 
                type="number"
                value={newRecord.amount_due}
                onChange={(e) => setNewRecord({...newRecord, amount_due: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={newRecord.payment_status}
              onChange={(e) => setNewRecord({...newRecord, payment_status: e.target.value as any})}
            >
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Payment</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogHeader><DialogTitle>Edit Payment Record</DialogTitle></DialogHeader>
        {editingRecord && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session</label>
                <div className="p-2 bg-muted/50 rounded-md text-sm">{editingRecord.academic_session}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Term</label>
                <div className="p-2 bg-muted/50 rounded-md text-sm">{editingRecord.term}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Paid</label>
                <Input 
                  type="number"
                  value={editingRecord.amount_paid}
                  onChange={(e) => setEditingRecord({...editingRecord, amount_paid: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Due</label>
                <Input 
                  type="number"
                  value={editingRecord.amount_due}
                  onChange={(e) => setEditingRecord({...editingRecord, amount_due: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editingRecord.payment_status}
                onChange={(e) => setEditingRecord({...editingRecord, payment_status: e.target.value})}
              >
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate}>Update Record</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
