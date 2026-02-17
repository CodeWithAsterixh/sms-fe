import { Link } from "react-router";
import { useStudents } from "../../../controllers/useStudents";
import type { Student } from "../../../models/student.types";
import { formatDate } from "../../../utils/formatDate";
import { Loader } from "../ui/Loader";
import { Eye } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { ENV } from "../../../config/env";
import { Card } from "../ui/Card";

const StudentTable = () => {
  const { students, isLoading, isError } = useStudents();

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-red-500">Error loading students</div>;
  if (!students || students.length === 0) return <div className="text-center py-8 text-gray-500">No students found</div>;

  const getProfileImageUrl = (student: Student) => {
    return student.photo_url 
      ? (student.photo_url.startsWith('http') ? student.photo_url : `${ENV.API_URL}${student.photo_url}`)
      : undefined;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {students.map((student: Student) => (
          <Card key={student.id} className="p-4 flex items-center gap-4">
             <Avatar 
                src={getProfileImageUrl(student)} 
                fallback={`${student.first_name[0]}${student.last_name[0]}`} 
                size="md" 
            />
            <div className="flex-1 min-w-0">
              <Link to={`/students/${student.student_uid}`} className="block">
                <h3 className="font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{student.student_uid}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs text-gray-500">Class: {student.class_name || student.class_id}</span>
                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                   </span>
                </div>
              </Link>
            </div>
            <Link to={`/students/${student.student_uid}`}>
               <Button variant="ghost" size="icon">
                 <Eye className="h-5 w-5 text-gray-400" />
               </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">UID</th>
              <th className="px-6 py-3">Class</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: Student) => (
              <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                        src={getProfileImageUrl(student)} 
                        fallback={`${student.first_name[0]}${student.last_name[0]}`} 
                        size="sm" 
                    />
                    <Link to={`/students/${student.student_uid}`} className="hover:underline text-primary font-medium">
                      {student.first_name} {student.last_name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-500">{student.student_uid}</td>
                <td className="px-6 py-4">{student.class_name || student.class_id}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(student.created_at)}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">
                    <Link to={`/students/${student.student_uid}`} className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentTable;
