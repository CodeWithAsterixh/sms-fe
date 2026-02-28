import { useStudents } from "../../controllers/useStudents";
import { useClasses } from "../../controllers/useClasses";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Users, GraduationCap, School } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { students } = useStudents();
  const { classes } = useClasses();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={students?.length || 0} 
          icon={GraduationCap}
          color="bg-blue-500"
        />
        <StatCard 
          title="Active Classes" 
          value={classes?.length || 0} 
          icon={School}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Staff" 
          value="-" 
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        {/* Add quick actions here */}
      </div>
    </div>
  );
};

export default Dashboard;
