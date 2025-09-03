import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle,
  Play,
  BarChart3,
  Calendar,
  Target,
  AlertCircle
} from "lucide-react";

const AssessmentCenter = () => {
  const assessments = [
    {
      id: 1,
      title: "Cultural Competency Assessment",
      description: "Evaluate your understanding of cultural sensitivity in healthcare",
      type: "Quiz",
      duration: "30 minutes",
      questions: 25,
      passingScore: 80,
      attempts: 2,
      maxAttempts: 3,
      lastScore: 85,
      status: "passed",
      dueDate: "Completed",
      category: "Cultural Competency"
    },
    {
      id: 2,
      title: "Irish Healthcare Regulations Test",
      description: "Test your knowledge of legal requirements and professional standards",
      type: "Certification Exam",
      duration: "90 minutes", 
      questions: 60,
      passingScore: 75,
      attempts: 1,
      maxAttempts: 2,
      lastScore: 72,
      status: "failed",
      dueDate: "Dec 20, 2024",
      category: "Legal & Compliance"
    },
    {
      id: 3,
      title: "Medical Communication Skills",
      description: "Assess your ability to communicate effectively with patients and colleagues",
      type: "Practical Assessment",
      duration: "45 minutes",
      questions: 15,
      passingScore: 80,
      attempts: 0,
      maxAttempts: 2,
      lastScore: null,
      status: "pending",
      dueDate: "Dec 25, 2024",
      category: "Communication"
    },
    {
      id: 4,
      title: "Emergency Procedures Knowledge Check",
      description: "Demonstrate knowledge of critical emergency response procedures",
      type: "Quiz",
      duration: "20 minutes",
      questions: 20,
      passingScore: 85,
      attempts: 0,
      maxAttempts: 3,
      lastScore: null,
      status: "not_started",
      dueDate: "Jan 5, 2025",
      category: "Emergency Care"
    },
    {
      id: 5,
      title: "Comprehensive Healthcare Integration",
      description: "Final assessment covering all aspects of working in Irish healthcare",
      type: "Final Exam",
      duration: "2 hours",
      questions: 100,
      passingScore: 75,
      attempts: 0,
      maxAttempts: 1,
      lastScore: null,
      status: "locked",
      dueDate: "Jan 15, 2025",
      category: "Comprehensive"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-700">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Not Started</Badge>;
      case 'locked':
        return <Badge variant="outline">Locked</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'not_started':
        return <Play className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Target className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const overallProgress = Math.round(
    (assessments.filter(a => a.status === 'passed').length / assessments.length) * 100
  );

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">
            Assessment Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress through certifications and skill assessments
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-css-gold-light rounded-lg">
                <Award className="h-6 w-6 text-css-gold" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">
                  {assessments.filter(a => a.status === 'passed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">
                  {assessments.filter(a => a.status === 'pending' || a.status === 'not_started').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">
                  {assessments.filter(a => a.status === 'failed').length}
                </p>
                <p className="text-sm text-muted-foreground">Need Retry</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-foreground">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-css-gold" />
            Assessment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-montserrat font-medium">Overall Completion</span>
              <span className="text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {assessments.filter(a => a.status === 'passed').length} of {assessments.length} assessments completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assessment List */}
      <div className="space-y-4">
        <h2 className="font-montserrat font-bold text-xl">All Assessments</h2>
        
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-css-grey-light rounded-lg">
                    {getStatusIcon(assessment.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-montserrat font-bold text-lg">{assessment.title}</h3>
                      {getStatusBadge(assessment.status)}
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{assessment.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {assessment.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {assessment.duration}
                      </span>
                      <span>{assessment.questions} questions</span>
                      <span>Pass: {assessment.passingScore}%</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {assessment.dueDate}
                      </span>
                    </div>

                    {assessment.lastScore !== null && (
                      <div className="mt-3 p-3 bg-css-grey-light rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-montserrat font-medium">
                            Last Score: {assessment.lastScore}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Attempt {assessment.attempts}/{assessment.maxAttempts}
                          </span>
                        </div>
                        {assessment.lastScore < assessment.passingScore && (
                          <p className="text-sm text-red-600 mt-1">
                            Below passing score. {assessment.maxAttempts - assessment.attempts} attempts remaining.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {assessment.status === 'locked' ? (
                    <Button variant="outline" disabled className="font-montserrat">
                      Locked
                    </Button>
                  ) : assessment.status === 'passed' ? (
                    <Button variant="outline" className="font-montserrat">
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                      disabled={assessment.attempts >= assessment.maxAttempts}
                    >
                      {assessment.status === 'failed' ? 'Retry Assessment' : 
                       assessment.status === 'pending' ? 'Continue' : 'Start Assessment'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentCenter;