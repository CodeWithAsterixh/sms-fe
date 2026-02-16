import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useClasses } from "../../../controllers/useClasses";
import { toast } from "sonner";

export const ProfileTab = ({ student, updateStudent, isUpdating }: any) => {
  const { user } = useAuthStore();
  const { classes } = useClasses();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: student.first_name,
    last_name: student.last_name,
    class_id: student.class_id,
    status: student.status
  });

  const canEdit = user?.role === "admin" || user?.role === "principal";

  const handleSave = async () => {
    try {
      await updateStudent(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Student Information</h3>
          {canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">Edit Profile</Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isUpdating}>Save Changes</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Student UID</label>
            <div className="p-2 bg-muted/50 rounded-md font-mono">{student.student_uid}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">First Name</label>
            {isEditing ? (
              <Input 
                value={formData.first_name} 
                onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
              />
            ) : (
              <div className="p-2">{student.first_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
            {isEditing ? (
              <Input 
                value={formData.last_name} 
                onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
              />
            ) : (
              <div className="p-2">{student.last_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Class</label>
            {isEditing ? (
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.class_id}
                onChange={(e) => setFormData({...formData, class_id: Number(e.target.value)})}
              >
                {classes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="p-2">{student.class_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            {isEditing ? (
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="suspended">Suspended</option>
                <option value="expelled">Expelled</option>
              </select>
            ) : (
              <div className="p-2 capitalize">{student.status}</div>
            )}
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-muted-foreground">Created At</label>
             <div className="p-2">{new Date(student.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
