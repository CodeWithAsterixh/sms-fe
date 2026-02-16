import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useStudent } from "../../controllers/useStudents";
import { useAuthStore } from "../../store/auth.store";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import { ArrowLeft, User, Calendar, BookOpen, DollarSign } from "lucide-react";
import { clsx } from "clsx";

import { ProfileTab } from "./student-profile/ProfileTab";
import { AttendanceTab } from "./student-profile/AttendanceTab";
import { ConductTab } from "./student-profile/ConductTab";
import { FinancialTab } from "./student-profile/FinancialTab";

const StudentProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { student, isLoading, update } = useStudent(uid!);
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;
  if (!student) return <div className="p-8 text-center">Student not found</div>;

  const allTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "conduct", label: "Conduct", icon: BookOpen },
    { id: "financial", label: "Financial", icon: DollarSign },
  ];

  const tabs = allTabs.filter(tab => {
    if (tab.id === 'conduct') return user?.role !== 'gatekeeper';
    if (tab.id === 'financial') return ['admin', 'principal'].includes(user?.role || '');
    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{student.first_name} {student.last_name}</h1>
          <p className="text-muted-foreground">{student.student_uid} • {student.class_name}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <div className="flex h-10 items-center gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && (
          <ProfileTab student={student} updateStudent={update} />
        )}
        {activeTab === "attendance" && (
          <AttendanceTab studentId={student.id} />
        )}
        {activeTab === "conduct" && (
          <ConductTab studentId={student.id} />
        )}
        {activeTab === "financial" && (
          <FinancialTab studentId={student.id} />
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
