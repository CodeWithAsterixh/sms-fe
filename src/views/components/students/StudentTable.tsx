import { useStudents } from "../../../controllers/useStudents";
import type { Student } from "../../../models/student.types";
import { formatDate } from "../../../utils/formatDate";
import { Loader } from "../ui/Loader";

const StudentTable = () => {
  const { students, isLoading, isError } = useStudents();

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-red-500">Error loading students</div>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase">
          <tr>
            <th className="px-6 py-3">UID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Class ID</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student: Student) => (
            <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{student.student_uid}</td>
              <td className="px-6 py-4">{student.first_name} {student.last_name}</td>
              <td className="px-6 py-4">{student.class_id}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${student.status === 'active' ? 'bg-green-100 text-green-800' : 
                    student.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4">{formatDate(student.created_at)}</td>
            </tr>
          ))}
          {students?.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
