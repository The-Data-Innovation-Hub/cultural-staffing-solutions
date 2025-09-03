import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Download
} from "lucide-react";

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);

  // Mock course data - would normally come from API
  const course = {
    title: "Cultural Sensitivity in Patient Care",
    description: "Understanding cultural differences and providing inclusive care to diverse patient populations",
    instructor: "Dr. Sarah Murphy",
    duration: "6 hours",
    modules: [
      {
        title: "Introduction to Cultural Competency",
        duration: "45 min",
        type: "video",
        completed: true,
        lessons: [
          { title: "What is Cultural Competency?", duration: "10 min", type: "video", completed: true },
          { title: "Why Cultural Sensitivity Matters", duration: "15 min", type: "video", completed: true },
          { title: "Cultural Competency Assessment", duration: "20 min", type: "quiz", completed: true }
        ]
      },
      {
        title: "Understanding Irish Healthcare Culture",
        duration: "1.2 hours",
        type: "video",
        completed: true,
        lessons: [
          { title: "Irish Healthcare System Overview", duration: "25 min", type: "video", completed: true },
          { title: "Patient Expectations in Ireland", duration: "20 min", type: "reading", completed: true },
          { title: "Communication Styles", duration: "15 min", type: "video", completed: true },
          { title: "Module 2 Assessment", duration: "20 min", type: "quiz", completed: true }
        ]
      },
      {
        title: "Working with Diverse Populations",
        duration: "1.5 hours",
        type: "video",
        completed: false,
        lessons: [
          { title: "Religious Considerations", duration: "30 min", type: "video", completed: false },
          { title: "Language Barriers", duration: "25 min", type: "video", completed: false },
          { title: "Family Dynamics", duration: "20 min", type: "reading", completed: false },
          { title: "Case Study Analysis", duration: "15 min", type: "assignment", completed: false }
        ]
      },
      {
        title: "Practical Applications",
        duration: "2 hours",
        type: "interactive",
        completed: false,
        lessons: [
          { title: "Scenario-Based Learning", duration: "45 min", type: "interactive", completed: false },
          { title: "Role-Playing Exercises", duration: "30 min", type: "interactive", completed: false },
          { title: "Reflection and Discussion", duration: "25 min", type: "discussion", completed: false },
          { title: "Final Assessment", duration: "20 min", type: "quiz", completed: false }
        ]
      }
    ]
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'interactive': return <Play className="h-4 w-4" />;
      case 'discussion': return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const overallProgress = Math.round(
    (course.modules.filter(m => m.completed).length / course.modules.length) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/employee/training')}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training Center
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-montserrat font-bold text-3xl text-foreground mb-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Instructor: {course.instructor}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
              <span>{course.modules.length} modules</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="mb-2">
              <span className="text-2xl font-montserrat font-bold text-foreground">
                {overallProgress}%
              </span>
              <span className="text-muted-foreground ml-1">complete</span>
            </div>
            <Progress value={overallProgress} className="w-32 h-3" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Module Sidebar */}
        <div className="w-80 bg-card border-r border-border h-screen overflow-y-auto">
          <div className="p-4">
            <h3 className="font-montserrat font-bold mb-4">Course Modules</h3>
            
            <div className="space-y-3">
              {course.modules.map((module, moduleIndex) => (
                <Card 
                  key={moduleIndex}
                  className={`cursor-pointer transition-colors ${
                    activeModule === moduleIndex 
                      ? 'ring-2 ring-css-gold bg-css-gold-light' 
                      : 'hover:bg-accent/5'
                  }`}
                  onClick={() => setActiveModule(moduleIndex)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-montserrat font-semibold text-sm leading-tight">
                        {module.title}
                      </h4>
                      {module.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 ml-2" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted-foreground rounded-full shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getTypeIcon(module.type)}
                      <span>{module.duration}</span>
                      <span>•</span>
                      <span>{module.lessons.length} lessons</span>
                    </div>
                    
                    {!module.completed && (
                      <div className="mt-2">
                        <Progress 
                          value={module.lessons.filter(l => l.completed).length / module.lessons.length * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-montserrat font-bold">
                  {course.modules[activeModule]?.title}
                </CardTitle>
                <Badge 
                  variant={course.modules[activeModule]?.completed ? 'default' : 'secondary'}
                  className="font-montserrat"
                >
                  {course.modules[activeModule]?.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Lesson List */}
              <div className="space-y-3">
                {course.modules[activeModule]?.lessons.map((lesson, lessonIndex) => (
                  <div 
                    key={lessonIndex}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                      lesson.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-css-grey-light border-border hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                      )}
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getTypeIcon(lesson.type)}
                      </div>
                      
                      <div>
                        <h4 className="font-montserrat font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={lesson.completed ? 'outline' : 'default'}
                      className={
                        !lesson.completed 
                          ? 'bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold' 
                          : ''
                      }
                    >
                      {lesson.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" className="font-montserrat">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resources
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    disabled={activeModule === 0}
                    onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                  >
                    Previous Module
                  </Button>
                  <Button 
                    className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                    disabled={activeModule === course.modules.length - 1}
                    onClick={() => setActiveModule(Math.min(course.modules.length - 1, activeModule + 1))}
                  >
                    Next Module
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseView;