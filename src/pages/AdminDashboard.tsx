import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Upload,
  UserCog,
  Globe,
  Database,
  TrendingUp,
  Shield
} from "lucide-react";

const AdminDashboard = () => {
  const systemStats = [
    { label: "Total Users", value: "1,247", change: "+12%", icon: Users },
    { label: "Active Courses", value: "89", change: "+5%", icon: BookOpen },
    { label: "Completion Rate", value: "83%", change: "+8%", icon: TrendingUp },
    { label: "System Health", value: "99.9%", change: "stable", icon: Shield },
  ];

  const recentActivity = [
    { action: "New course uploaded", details: "Cultural Communication Basics", time: "2 hours ago", type: "content" },
    { action: "User role updated", details: "Manager permissions granted to John Smith", time: "4 hours ago", type: "user" },
    { action: "System backup completed", details: "All data successfully backed up", time: "6 hours ago", type: "system" },
    { action: "Translation added", details: "Spanish localization for Module 5", time: "1 day ago", type: "localization" },
  ];

  const platformHealth = [
    { metric: "Server Performance", value: 92, status: "excellent" },
    { metric: "Database Optimization", value: 88, status: "good" },
    { metric: "Content Delivery", value: 95, status: "excellent" },
    { metric: "User Satisfaction", value: 87, status: "good" },
  ];

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">
            System Administration
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage platform content, users, and system performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-montserrat font-medium">
            <Database className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
          <Button className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-css-gold" />
                </div>
                <div>
                  <p className="text-2xl font-montserrat font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <Badge variant={stat.change.includes('+') ? 'default' : 'secondary'} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Health */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-css-gold" />
              Platform Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformHealth.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat font-medium text-sm">{metric.metric}</span>
                    <span className="text-sm text-muted-foreground">{metric.value}%</span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-3 ${metric.status === 'excellent' ? 'bg-green-100' : 'bg-yellow-100'}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-css-gold" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-css-grey-light rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'content' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'content' ? <Upload className="h-4 w-4 text-blue-600" /> :
                     activity.type === 'user' ? <UserCog className="h-4 w-4 text-green-600" /> :
                     activity.type === 'system' ? <Database className="h-4 w-4 text-purple-600" /> :
                     <Globe className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div>
                    <h4 className="font-montserrat font-medium text-sm">{activity.action}</h4>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold">Administration Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Upload className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">Content Upload</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <UserCog className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">User Management</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Globe className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">Localization</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <BarChart3 className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Settings className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">System Config</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Database className="h-8 w-8" />
              <span className="text-xs font-montserrat text-center">Data Backup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;