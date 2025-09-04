import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Search, 
  Filter,
  Users,
  Star
} from "lucide-react";

const TrainingCenter = () => {
  const courses = [
    {
      id: 1,
      title: "Northern Ireland Healthcare System Overview",
      description: "Comprehensive introduction to healthcare delivery in Northern Ireland",
      modules: 6,
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 100,
      enrolled: 1247,
      rating: 4.8,
      category: "Healthcare Systems"
    },
    {
      id: 2,
      title: "Cultural Sensitivity in Patient Care", 
      description: "Understanding cultural differences and providing inclusive care",
      modules: 8,
      duration: "6 hours",
      difficulty: "Intermediate",
      progress: 75,
      enrolled: 892,
      rating: 4.9,
      category: "Cultural Competency"
    },
    {
      id: 3,
      title: "Medical Terminology in English",
      description: "Essential medical vocabulary for international healthcare workers",
      modules: 12,
      duration: "8 hours", 
      difficulty: "Beginner",
      progress: 0,
      enrolled: 1456,
      rating: 4.7,
      category: "Language Skills"
    },
    {
      id: 4,
      title: "Northern Ireland Healthcare Regulations & Compliance",
      description: "Legal requirements and professional standards in Northern Ireland healthcare",
      modules: 10,
      duration: "7 hours",
      difficulty: "Advanced",
      progress: 45,
      enrolled: 678,
      rating: 4.6,
      category: "Legal & Compliance"
    },
    {
      id: 5,
      title: "Effective Communication with Patients",
      description: "Building rapport and communication skills for better patient outcomes",
      modules: 5,
      duration: "3 hours",
      difficulty: "Intermediate", 
      progress: 0,
      enrolled: 923,
      rating: 4.8,
      category: "Communication"
    },
    {
      id: 6,
      title: "Emergency Procedures & Protocols",
      description: "Critical emergency response procedures in Northern Ireland healthcare settings",
      modules: 9,
      duration: "5 hours",
      difficulty: "Advanced",
      progress: 0,
      enrolled: 534,
      rating: 4.9,
      category: "Emergency Care"
    }
  ];

  const categories = [
    "All Courses",
    "Healthcare Systems", 
    "Cultural Competency",
    "Language Skills",
    "Legal & Compliance",
    "Communication",
    "Emergency Care"
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return { label: 'Not Started', variant: 'secondary' as const };
    if (progress === 100) return { label: 'Completed', variant: 'default' as const };
    return { label: 'In Progress', variant: 'outline' as const };
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">
            Training Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore courses designed for international healthcare professionals
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={`whitespace-nowrap ${
                    index === 0 
                      ? 'bg-gradient-gold text-css-black hover:bg-css-gold' 
                      : 'hover:bg-accent/10'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const status = getProgressStatus(course.progress);
          
          return (
            <Card key={course.id} className="shadow-card border-0 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="font-montserrat font-bold text-lg leading-tight">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Modules</p>
                    <p className="font-montserrat font-bold">{course.modules}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-montserrat font-bold">{course.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                    <p className="font-montserrat font-bold">{course.enrolled.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-montserrat font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {/* Status and Action */}
                <div className="flex items-center justify-between">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  <Button 
                    size="sm" 
                    className={`font-montserrat font-medium ${
                      course.progress > 0 && course.progress < 100
                        ? 'bg-gradient-gold text-css-black hover:bg-css-gold'
                        : ''
                    }`}
                    variant={course.progress > 0 && course.progress < 100 ? 'default' : 'outline'}
                  >
                    {course.progress === 0 ? (
                      <>
                        <Play className="mr-1 h-3 w-3" />
                        Start Course
                      </>
                    ) : course.progress === 100 ? (
                      <>
                        <Award className="mr-1 h-3 w-3" />
                        Review
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-1 h-3 w-3" />
                        Continue
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Path Suggestion */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-css-gold-light to-css-grey-light">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-lg">Recommended Learning Path</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your role and progress, we suggest starting with Cultural Sensitivity training
              </p>
            </div>
            <Button className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
              View Path
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingCenter;