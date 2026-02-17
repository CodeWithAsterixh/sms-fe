import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useStudent } from "../../controllers/useStudents";
import { useAuthStore } from "../../store/auth.store";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ArrowLeft, User, Calendar, BookOpen, DollarSign, Camera } from "lucide-react";
import { clsx } from "clsx";
import { ENV } from "../../config/env";

import { ProfileTab } from "./student-profile/ProfileTab";
import { AttendanceTab } from "./student-profile/AttendanceTab";
import { ConductTab } from "./student-profile/ConductTab";
import { FinancialTab } from "./student-profile/FinancialTab";

const StudentProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { student, isLoading, update, uploadImage, isUploading } = useStudent(uid!);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;
  if (!student) return <div className="p-8 text-center">Student not found</div>;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

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
  
  const profileImageUrl = student.photo_url 
    ? `${ENV.API_URL}/students/${student.id}/profile-image?t=${new Date(student.updated_at).getTime()}`
    : undefined;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/students")} className="self-start md:self-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Profile Image Section */}
        <div className="relative group">
            <Avatar 
                src={profileImageUrl} 
                fallback={`${student.first_name[0]}${student.last_name[0]}`} 
                size="2xl" 
                className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg"
            />
            
            {/* Upload Button Overlay */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isUploading ? <Loader className="h-4 w-4 animate-spin" /> : <Camera className="h-5 w-5" />}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div>

        <div className="text-center md:text-left mt-2">
          <h1 className="text-3xl font-bold">{student.first_name} {student.last_name}</h1>
          <p className="text-muted-foreground text-lg">{student.student_uid}</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            {student.class_name}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b overflow-x-auto no-scrollbar">
        <div className="flex h-12 items-center gap-2 md:gap-4 min-w-max px-4 md:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
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
      <div className="mt-6 px-4 md:px-0">
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
