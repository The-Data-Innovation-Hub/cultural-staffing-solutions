import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  BarChart3,
  UserCheck,
  Clock,
  Target
} from "lucide-react";

const ManagerDashboard = () => {
  const teamMembers = [
    { name: "Sarah O'Connor", role: "Nurse", progress: 85, status: "On Track", risk: "low" },
    { name: "Ahmed Hassan", role: "Physiotherapist", progress: 45, status: "Behind", risk: "high" },
    { name: "Maria Santos", role: "Radiographer", progress: 92, status: "Excellent", risk: "low" },
    { name: "James Murphy", role: "Lab Technician", progress: 67, status: "Average", risk: "medium" },
  ];

  const upcomingDeadlines = [
    { employee: "Ahmed Hassan", task: "Cultural Sensitivity Training", due: "2 days", priority: "high" },
    { employee: "James Murphy", task: "Safety Protocols Assessment", due: "5 days", priority: "medium" },
    { employee: "Sarah O'Connor", task: "Communication Skills Module", due: "1 week", priority: "low" },
  ];

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">
            Team Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and support your team's learning progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-montserrat font-medium">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
            Assign Training
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">18</p>
                <p className="text-sm text-muted-foreground">Compliant Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-css-gold-light rounded-lg">
                <TrendingUp className="h-6 w-6 text-css-gold" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">76%</p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Progress Overview */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-css-gold" />
              Team Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-css-grey-light rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                      <span className="text-css-black font-montserrat font-bold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-montserrat font-medium">{member.progress}%</p>
                      <Progress value={member.progress} className="w-20 h-2" />
                    </div>
                    <Badge 
                      variant={member.risk === 'high' ? 'destructive' : member.risk === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-css-gold" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-css-grey-light rounded-lg">
                  <div>
                    <h4 className="font-montserrat font-medium text-sm">{deadline.task}</h4>
                    <p className="text-xs text-muted-foreground">{deadline.employee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-montserrat font-medium">Due in {deadline.due}</p>
                    <Badge 
                      variant={deadline.priority === 'high' ? 'destructive' : deadline.priority === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {deadline.priority} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-montserrat">Bulk Assign</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-montserrat">Progress Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm font-montserrat">Risk Alerts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Award className="h-6 w-6" />
              <span className="text-sm font-montserrat">Certificates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;