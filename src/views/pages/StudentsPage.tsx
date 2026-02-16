import { useState } from "react";
import StudentTable from "../components/students/StudentTable";
import StudentForm from "../components/students/StudentForm";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle } from "../components/ui/Dialog";
import { Can } from "../components/auth/Can";

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Can permission="manage_students">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Can>
      </div>

      <StudentTable />

      <Dialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      >
        <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
            <StudentForm onSuccess={() => setIsModalOpen(false)} />
        </div>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
