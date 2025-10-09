import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  MessageCircle, 
  Play,
  Calendar,
  Target
} from "lucide-react";
import { useUserStats, useUserCertificates, useUpcomingSessions } from "@/hooks/useDatabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  // For demo purposes, using a mock user ID. In production, this would come from auth context
  const userId = "demo-user-id";
  
  const { data: userStats, isLoading: statsLoading } = useUserStats(userId);
  const { data: certificates, isLoading: certsLoading } = useUserCertificates(userId);
  const { data: sessions, isLoading: sessionsLoading } = useUpcomingSessions();

  const upcomingTrainings = sessions?.slice(0, 3).map(session => ({
    title: session.title,
    date: new Date(session.scheduledAt).toLocaleString(),
    type: "Live Session"
  })) || [
    { title: "Cultural Sensitivity in Healthcare", date: "Today 2:00 PM", type: "Live Session" },
    { title: "Irish Healthcare Regulations", date: "Tomorrow 10:00 AM", type: "Module" },
    { title: "Communication Skills Assessment", date: "Dec 15", type: "Assessment" },
  ];

  const recentAchievements = certificates?.slice(0, 3).map(cert => ({
    title: cert.title,
    date: new Date(cert.issuedAt).toLocaleDateString(),
    type: "Certificate"
  })) || [
    { title: "Cultural Awareness Certificate", date: "Dec 10", type: "Certificate" },
    { title: "Healthcare Ethics Module", date: "Dec 8", type: "Completed" },
    { title: "Language Skills Level 3", date: "Dec 5", type: "Achievement" },
  ];

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">
            Welcome back, Sarah!
          </h1>
          <p className="text-muted-foreground mt-1">
            Continue your learning journey in Irish healthcare
          </p>
        </div>
        <Button
          onClick={() => navigate('/employee/ai-guru')}
          className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Ask Clinify AI
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-css-gold-light rounded-lg">
                <BookOpen className="h-6 w-6 text-css-gold" />
              </div>
              <div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {userStats?.coursesCompleted || 12}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {userStats?.certificatesEarned || 8}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {userStats?.learningTime || 24}h
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Learning Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {userStats?.overallProgress || 89}%
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Learning Progress */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-css-gold" />
              Current Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-montserrat font-semibold">Irish Healthcare Integration</h3>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              <Progress value={75} className="h-3" />
              <p className="text-sm text-muted-foreground">
                3 of 4 modules completed • 2 hours remaining
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-montserrat font-semibold">Cultural Competency</h3>
                <Badge className="bg-green-100 text-green-700">Completed</Badge>
              </div>
              <Progress value={100} className="h-3" />
              <p className="text-sm text-muted-foreground">
                All modules completed • Certificate earned
              </p>
            </div>

            <Button className="w-full mt-4 bg-gradient-gold text-css-black hover:bg-css-gold">
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Training */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-css-gold" />
              Upcoming Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrainings.map((training, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-css-grey-light rounded-lg">
                  <div>
                    <h4 className="font-montserrat font-medium text-sm">{training.title}</h4>
                    <p className="text-xs text-muted-foreground">{training.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {training.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-css-gold" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-css-grey-light rounded-lg">
                <div className="p-2 bg-gradient-gold rounded-lg">
                  <Award className="h-4 w-4 text-css-black" />
                </div>
                <div>
                  <h4 className="font-montserrat font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;