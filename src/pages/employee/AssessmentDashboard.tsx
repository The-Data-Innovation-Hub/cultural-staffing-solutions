/**
 * Assessment Results Dashboard
 *
 * Displays personalized learning path based on assessment results:
 * - Overall progress and scores
 * - Recommended courses with priorities
 * - Skills gap visualization
 * - Cultural competency tracking
 * - 30/60/90-day milestones
 * - Recent activity and achievements
 */

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Users,
  Brain,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  Trophy,
  Zap,
  Play,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useAssessmentData';
import { generateMockLearningPath, getAssessmentFromLocalStorage } from '@/utils/generateMockLearningPath';
import type { LearningPath, PriorityArea, RecommendedCourse, Milestone } from '@/types/assessment';

// ============================================================================
// Mock Data (Fallback for development)
// ============================================================================

const mockLearningPath: LearningPath = {
  id: 'path-001',
  userId: 'user-001',
  assessmentId: 'assessment-001',
  pathName: 'Healthcare Cultural Integration & Skills Development',
  pathDescription: 'Personalized 90-day learning journey focused on cultural competency and technical skills',
  overallScore: 72,
  culturalCompetencyScore: 68,
  skillsScore: 76,
  estimatedCompletionWeeks: 12,
  difficultyLevel: 'intermediate',
  isActive: true,
  status: 'in_progress',
  createdAt: '2025-01-15T00:00:00Z',
  startedAt: '2025-01-15T00:00:00Z',
};

const mockPriorityAreas: PriorityArea[] = [
  {
    id: 'priority-001',
    learningPathId: 'path-001',
    category: 'cultural',
    title: 'Cultural Competency in US Healthcare',
    description: 'Understanding American healthcare culture, patient expectations, and communication styles',
    importance: 'critical',
    currentLevel: 45,
    targetLevel: 85,
    estimatedTimeWeeks: 4,
    isCompleted: false,
    priorityOrder: 1,
  },
  {
    id: 'priority-002',
    learningPathId: 'path-001',
    category: 'compliance',
    title: 'HIPAA Compliance & Patient Privacy',
    description: 'Understanding US privacy laws, documentation requirements, and confidentiality standards',
    importance: 'critical',
    currentLevel: 60,
    targetLevel: 95,
    estimatedTimeWeeks: 3,
    isCompleted: false,
    priorityOrder: 2,
  },
  {
    id: 'priority-003',
    learningPathId: 'path-001',
    category: 'technical',
    title: 'Electronic Health Records (EHR) Mastery',
    description: 'Proficiency in US EHR systems, documentation standards, and digital workflows',
    importance: 'high',
    currentLevel: 55,
    targetLevel: 80,
    estimatedTimeWeeks: 4,
    isCompleted: false,
    priorityOrder: 3,
  },
  {
    id: 'priority-004',
    learningPathId: 'path-001',
    category: 'technical',
    title: 'Patient Communication Excellence',
    description: 'Effective patient communication, active listening, and cultural sensitivity',
    importance: 'high',
    currentLevel: 70,
    targetLevel: 90,
    estimatedTimeWeeks: 3,
    isCompleted: false,
    priorityOrder: 4,
  },
  {
    id: 'priority-005',
    learningPathId: 'path-001',
    category: 'language',
    title: 'Medical Terminology & Documentation',
    description: 'Advanced medical English, abbreviations, and professional documentation skills',
    importance: 'medium',
    currentLevel: 65,
    targetLevel: 85,
    estimatedTimeWeeks: 3,
    isCompleted: false,
    priorityOrder: 5,
  },
];

const mockRecommendedCourses: RecommendedCourse[] = [
  {
    id: 'course-001',
    title: 'Cultural Competency Foundations',
    description: 'Understanding cultural differences in healthcare settings and building cross-cultural communication skills',
    category: 'Cultural Competency',
    duration: 120,
    difficulty: 'beginner',
    courseTitle: 'Cultural Competency Foundations',
    courseDescription: 'Understanding cultural differences in healthcare settings and building cross-cultural communication skills',
    durationMinutes: 120,
    difficultyLevel: 'beginner',
    contentTypes: ['video', 'interactive', 'quiz'],
    priorityOrder: 1,
    isRequired: true,
    isEnrolled: true,
    isCompleted: false,
    progressPercentage: 35,
    enrolledAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'course-002',
    title: 'HIPAA Fundamentals for Healthcare Workers',
    description: 'Essential privacy and security training for US healthcare professionals',
    category: 'Compliance',
    duration: 90,
    difficulty: 'beginner',
    courseTitle: 'HIPAA Fundamentals for Healthcare Workers',
    courseDescription: 'Essential privacy and security training for US healthcare professionals',
    durationMinutes: 90,
    difficultyLevel: 'beginner',
    contentTypes: ['video', 'reading', 'quiz'],
    priorityOrder: 2,
    isRequired: true,
    isEnrolled: true,
    isCompleted: false,
    progressPercentage: 0,
  },
  {
    id: 'course-003',
    title: 'American Patient Expectations',
    description: 'Understanding US patient rights, expectations, and healthcare consumerism',
    category: 'Cultural Competency',
    duration: 60,
    difficulty: 'intermediate',
    courseTitle: 'American Patient Expectations',
    courseDescription: 'Understanding US patient rights, expectations, and healthcare consumerism',
    durationMinutes: 60,
    difficultyLevel: 'intermediate',
    contentTypes: ['video', 'reading'],
    priorityOrder: 3,
    isRequired: true,
    isEnrolled: false,
    isCompleted: false,
    progressPercentage: 0,
  },
  {
    id: 'course-004',
    title: 'EHR Systems: Introduction',
    description: 'Getting started with electronic health record systems in US healthcare',
    category: 'Technical Skills',
    duration: 150,
    difficulty: 'beginner',
    courseTitle: 'EHR Systems: Introduction',
    courseDescription: 'Getting started with electronic health record systems in US healthcare',
    durationMinutes: 150,
    difficultyLevel: 'beginner',
    contentTypes: ['video', 'interactive', 'simulation'],
    priorityOrder: 4,
    isRequired: true,
    isEnrolled: false,
    isCompleted: false,
    progressPercentage: 0,
  },
  {
    id: 'course-005',
    title: 'Effective Patient Communication',
    description: 'Building rapport, active listening, and clear communication with diverse patients',
    category: 'Communication',
    duration: 75,
    difficulty: 'intermediate',
    courseTitle: 'Effective Patient Communication',
    courseDescription: 'Building rapport, active listening, and clear communication with diverse patients',
    durationMinutes: 75,
    difficultyLevel: 'intermediate',
    contentTypes: ['video', 'interactive'],
    priorityOrder: 5,
    isRequired: false,
    isEnrolled: false,
    isCompleted: false,
    progressPercentage: 0,
  },
  {
    id: 'course-006',
    title: 'Medical Abbreviations Mastery',
    description: 'Critical medical abbreviations, safe usage, and documentation standards',
    category: 'Clinical Skills',
    duration: 45,
    difficulty: 'beginner',
    courseTitle: 'Medical Abbreviations Mastery',
    courseDescription: 'Critical medical abbreviations, safe usage, and documentation standards',
    durationMinutes: 45,
    difficultyLevel: 'beginner',
    contentTypes: ['reading', 'quiz'],
    priorityOrder: 6,
    isRequired: false,
    isEnrolled: false,
    isCompleted: false,
    progressPercentage: 0,
  },
];

const mockMilestones: Milestone[] = [
  {
    id: 'milestone-001',
    learningPathId: 'path-001',
    title: '30-Day Cultural Foundations',
    description: 'Complete core cultural competency and compliance training',
    milestoneType: 'cultural',
    targetDate: '2025-02-14',
    scheduledWeek: 4,
    associatedCourseIds: ['course-001', 'course-002', 'course-003'],
    requiredActivities: ['Complete Cultural Competency Foundations', 'Pass HIPAA Certification', 'Attend Live Q&A Session'],
    isCompleted: false,
    rewards: ['Cultural Foundations Badge', '10 Learning Points'],
    milestoneOrder: 1,
  },
  {
    id: 'milestone-002',
    learningPathId: 'path-001',
    title: '60-Day Technical Proficiency',
    description: 'Demonstrate proficiency in EHR systems and documentation',
    milestoneType: 'skills',
    targetDate: '2025-03-16',
    scheduledWeek: 8,
    associatedCourseIds: ['course-004', 'course-006'],
    requiredActivities: ['Complete EHR Training', 'Document 5 Practice Cases', 'Pass Technical Assessment'],
    isCompleted: false,
    rewards: ['Technical Pro Badge', '25 Learning Points', 'EHR Certification'],
    milestoneOrder: 2,
  },
  {
    id: 'milestone-003',
    learningPathId: 'path-001',
    title: '90-Day Integration Success',
    description: 'Full integration with demonstrated cultural and technical competency',
    milestoneType: 'general',
    targetDate: '2025-04-15',
    scheduledWeek: 12,
    associatedCourseIds: ['course-005'],
    requiredActivities: ['Complete All Required Courses', 'Pass Final Assessment', 'Receive Manager Evaluation'],
    isCompleted: false,
    rewards: ['Integration Champion Badge', '50 Learning Points', 'Certificate of Completion'],
    badgeAwarded: 'Integration Champion',
    milestoneOrder: 3,
  },
];

// ============================================================================
// Main Component
// ============================================================================

const AssessmentDashboard: React.FC = () => {
  // Try to load assessment from localStorage
  const [localAssessmentData, setLocalAssessmentData] = useState(() => getAssessmentFromLocalStorage());

  // Fetch all dashboard data
  const {
    learningPath: apiLearningPath,
    priorityAreas: apiPriorityAreas,
    courses: apiCourses,
    milestones: apiMilestones,
    isLoading,
    hasError,
    totalProgress: apiTotalProgress,
    enrolledCourses: apiEnrolledCourses,
    completedCourses: apiCompletedCourses,
    daysElapsed: apiDaysElapsed,
    daysRemaining: apiDaysRemaining,
    enrollInCourse,
  } = useDashboardData();

  // Generate learning path from localStorage if available and API failed
  const generatedData = localAssessmentData && hasError && !apiLearningPath
    ? generateMockLearningPath(localAssessmentData)
    : null;

  // Use real data if available, then generated data, then fallback to mock data
  const learningPath = apiLearningPath || generatedData?.learningPath || mockLearningPath;
  const priorityAreas = apiPriorityAreas.length > 0
    ? apiPriorityAreas
    : generatedData?.priorityAreas || mockPriorityAreas;
  const courses = apiCourses.length > 0
    ? apiCourses
    : generatedData?.courses || mockRecommendedCourses;
  const milestones = apiMilestones.length > 0
    ? apiMilestones
    : generatedData?.milestones || mockMilestones;

  // Use real calculated values or calculate from fallback data
  // Only use API enrolled/completed courses if we have a valid learning path
  // Otherwise, always filter from the courses array (which includes mock data)
  const enrolledCourses = apiLearningPath
    ? apiEnrolledCourses
    : courses.filter(c => c.isEnrolled);
  const completedCourses = apiLearningPath
    ? apiCompletedCourses
    : courses.filter(c => c.isCompleted);

  // Debug logging - v1.1
  console.log('Dashboard Debug:', {
    apiLearningPath: apiLearningPath?.id,
    apiCoursesCount: apiCourses.length,
    apiEnrolledCount: apiEnrolledCourses.length,
    enrolledCoursesCount: enrolledCourses.length,
    coursesUsed: courses.length,
    isLoading,
    hasError,
    timestamp: new Date().toISOString()
  });

  // Debug enrolled courses
  console.log('Courses array:', courses.map(c => ({
    id: c.id,
    isEnrolled: c.isEnrolled,
    title: c.title || c.courseTitle
  })));

  console.log('Filtering details:', {
    coursesLength: courses.length,
    coursesSource: apiCourses.length > 0 ? 'API' : 'Mock',
    apiCoursesLength: apiCourses.length,
    mockCoursesLength: mockRecommendedCourses.length,
    apiLearningPath: !!apiLearningPath,
    hasError,
    mockCourse1IsEnrolled: mockRecommendedCourses[0]?.isEnrolled,
    mockCourse2IsEnrolled: mockRecommendedCourses[1]?.isEnrolled,
    course1IsEnrolled: courses[0]?.isEnrolled,
    course2IsEnrolled: courses[1]?.isEnrolled,
  });

  if (enrolledCourses.length > 0) {
    console.log('Enrolled Courses:', enrolledCourses.map(c => ({
      id: c.id,
      title: c.title || c.courseTitle,
      courseTitle: c.courseTitle,
      hasTitle: !!(c.title || c.courseTitle),
      progressPercentage: c.progressPercentage,
      isEnrolled: c.isEnrolled
    })));
  } else {
    console.log('No enrolled courses - filtering from:', courses.length, 'courses');
  }
  const totalProgress = apiLearningPath ? apiTotalProgress : (
    enrolledCourses.length > 0
      ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) / enrolledCourses.length)
      : 0
  );
  const daysElapsed = apiLearningPath ? apiDaysElapsed : Math.floor((Date.now() - new Date((learningPath as any).startedAt || learningPath.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = apiLearningPath ? apiDaysRemaining : (((learningPath as any).estimatedCompletionWeeks || learningPath.estimatedCompletionTime || 12) * 7 - daysElapsed);

  useEffect(() => {
    document.title = 'My Learning Dashboard | Cultural Staffing Solutions';
  }, []);

  // ========================================================================
  // Helper Functions
  // ========================================================================

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-css-grey-dark';
    }
  };

  const getImportanceBadgeClass = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-css-grey-light text-css-grey-dark border-css-grey';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cultural': return <Globe className="w-5 h-5" />;
      case 'technical': return <Target className="w-5 h-5" />;
      case 'compliance': return <CheckCircle2 className="w-5 h-5" />;
      case 'language': return <BookOpen className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  // ========================================================================
  // Render
  // ========================================================================

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-css-grey-light flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-css-gold animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-css-charcoal">Loading Your Learning Path...</h2>
          <p className="text-css-grey-dark">Please wait while we fetch your personalized dashboard</p>
        </div>
      </div>
    );
  }

  // Error State - only show if truly no data available
  if (hasError && !apiLearningPath && !localAssessmentData) {
    return (
      <div className="min-h-screen bg-css-grey-light flex items-center justify-center p-6">
        <NeumorphicCard className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-100">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-css-charcoal">No Assessment Found</h2>
            <p className="text-css-grey-dark">
              You haven't completed the onboarding assessment yet. Complete it to get your personalized learning path!
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              to="/employee/onboarding"
              className="w-full px-6 py-3 rounded-lg font-semibold bg-gradient-gold text-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all text-center"
            >
              Take Onboarding Assessment
            </Link>
            <Link
              to="/employee"
              className="w-full px-6 py-3 rounded-lg font-semibold bg-white text-css-charcoal shadow-neumorphic hover:shadow-neumorphic-hover transition-all text-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-css-grey-light p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-css-grey-dark text-sm">
          <Link to="/employee" className="hover:text-css-gold transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-css-charcoal font-medium">My Learning Path</span>
        </div>
        <h1 className="text-3xl font-bold text-css-charcoal">My Learning Dashboard</h1>
        <p className="text-css-grey-dark">Track your progress and continue your personalized learning journey</p>
        {!apiLearningPath && (
          <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-100 px-3 py-2 rounded">
            <AlertCircle className="w-4 h-4" />
            <span>Using sample data (Backend not connected)</span>
          </div>
        )}
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <NeumorphicCard className="p-6 space-y-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-lg bg-gradient-gold bg-opacity-10">
              <TrendingUp className="w-8 h-8 text-css-gold" />
            </div>
            <span className="text-4xl font-bold text-css-gold">{totalProgress}%</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-css-charcoal">Overall Progress</p>
            <p className="text-xs text-css-grey-dark">Keep up the great work!</p>
          </div>
          <div className="h-2 bg-white rounded-full shadow-neumorphic-inset overflow-hidden">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
        </NeumorphicCard>

        {/* Courses Enrolled */}
        <NeumorphicCard className="p-6 space-y-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-4xl font-bold text-blue-600">{enrolledCourses.length}/{courses.length}</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-css-charcoal">Active Courses</p>
            <p className="text-xs text-css-grey-dark">{completedCourses.length} completed</p>
          </div>
        </NeumorphicCard>

        {/* Cultural Score */}
        <NeumorphicCard className="p-6 space-y-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-lg bg-purple-100">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-4xl font-bold text-purple-600">{learningPath.culturalCompetencyScore}</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-css-charcoal">Cultural Score</p>
            <p className="text-xs text-css-grey-dark">Target: 85+</p>
          </div>
        </NeumorphicCard>

        {/* Days Remaining */}
        <NeumorphicCard className="p-6 space-y-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-4xl font-bold text-green-600">{daysRemaining}</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-css-charcoal">Days Remaining</p>
            <p className="text-xs text-css-grey-dark">90-day cycle ({daysElapsed} days in)</p>
          </div>
        </NeumorphicCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses & Priority Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* In Progress Courses */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-css-gold" />
                <h2 className="text-xl font-bold text-css-charcoal">Continue Learning</h2>
              </div>
              <Link
                to="/employee/training"
                className="text-sm text-css-gold hover:text-css-gold-dark transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-white rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all cursor-pointer group"
                >
                  <div className="flex gap-4 mb-3">
                    {/* Video Thumbnail */}
                    <div className="relative flex-shrink-0 w-32 h-20 bg-css-grey-light rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-br from-css-gold/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-css-gold ml-1" />
                        </div>
                      </div>
                      {(course.progressPercentage || 0) > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <div
                            className="h-full bg-css-gold"
                            style={{ width: `${course.progressPercentage || 0}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-css-charcoal group-hover:text-css-gold transition-colors truncate">
                          {course.courseTitle || course.title}
                        </h3>
                        {course.isRequired && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded border border-red-300 flex-shrink-0">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-css-grey-dark mb-2 line-clamp-2">{course.courseDescription || course.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-css-grey">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.durationMinutes || course.duration} min</span>
                        </span>
                        <span className="capitalize">{course.difficultyLevel || course.difficulty}</span>
                        <span className="px-2 py-0.5 bg-css-grey-light rounded">{course.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-css-grey-dark">Progress</span>
                      <span className="font-semibold text-css-charcoal">{course.progressPercentage || 0}%</span>
                    </div>
                    <div className="h-2 bg-css-grey-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-gold transition-all"
                        style={{ width: `${course.progressPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {enrolledCourses.length === 0 && (
              <div className="text-center py-8 text-css-grey-dark">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No courses enrolled yet. Explore recommended courses below!</p>
              </div>
            )}
          </NeumorphicCard>

          {/* Priority Areas */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-css-gold" />
              <h2 className="text-xl font-bold text-css-charcoal">Priority Focus Areas</h2>
            </div>

            <div className="space-y-3">
              {priorityAreas.map((area) => {
                const gapPercentage = area.targetLevel - area.currentLevel;
                return (
                  <div key={area.id} className="p-4 bg-white rounded-lg shadow-neumorphic space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 rounded-lg bg-css-gold bg-opacity-10">
                          {getCategoryIcon(area.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-css-charcoal">{area.title}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getImportanceBadgeClass(area.importance)}`}>
                              {area.importance.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-css-grey-dark mb-2">{area.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-css-grey">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{area.estimatedTimeWeeks} weeks</span>
                            </span>
                            <span className="capitalize">{area.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Progress Bars */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-css-grey-dark">Current Level</span>
                        <span className="font-semibold text-css-charcoal">{area.currentLevel}%</span>
                      </div>
                      <div className="h-2 bg-css-grey-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 transition-all"
                          style={{ width: `${area.currentLevel}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-css-grey-dark">Target Level</span>
                        <span className="font-semibold text-css-gold">{area.targetLevel}%</span>
                      </div>
                      <div className="h-2 bg-css-grey-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-gold transition-all"
                          style={{ width: `${area.targetLevel}%` }}
                        />
                      </div>

                      <div className="pt-2 px-3 py-2 bg-css-grey-light rounded flex items-center justify-between">
                        <span className="text-xs text-css-grey-dark">Gap to close:</span>
                        <span className="text-sm font-bold text-css-charcoal">{gapPercentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </NeumorphicCard>

          {/* Recommended Courses */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-css-gold" />
              <h2 className="text-xl font-bold text-css-charcoal">Recommended for You</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {courses.filter(c => !c.isEnrolled).slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all cursor-pointer group overflow-hidden"
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-full h-32 bg-css-grey-light overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-css-gold/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-css-gold ml-1" />
                      </div>
                    </div>
                    {course.isRequired && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded shadow-lg">
                          Required
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-css-charcoal group-hover:text-css-gold transition-colors mb-2 line-clamp-1">
                      {course.courseTitle || course.title}
                    </h3>
                    <p className="text-sm text-css-grey-dark mb-3 line-clamp-2">{course.courseDescription || course.description}</p>
                    <div className="flex items-center justify-between text-xs text-css-grey mb-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.durationMinutes || course.duration} min</span>
                      </span>
                      <span className="capitalize">{course.difficultyLevel || course.difficulty}</span>
                    </div>
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-gold text-white font-semibold text-sm shadow-neumorphic hover:shadow-neumorphic-hover transition-all">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>

        {/* Right Column - Milestones & Quick Stats */}
        <div className="space-y-6">
          {/* Next Milestone */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-css-gold" />
              <h2 className="text-lg font-bold text-css-charcoal">Next Milestone</h2>
            </div>

            {milestones.filter(m => !m.isCompleted)[0] && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-gold bg-opacity-10 rounded-lg border-2 border-css-gold border-dashed">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 rounded-full bg-gradient-gold">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-css-charcoal mb-1">
                        {milestones.filter(m => !m.isCompleted)[0].title}
                      </h3>
                      <p className="text-sm text-css-grey-dark">
                        {milestones.filter(m => !m.isCompleted)[0].description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-css-grey-dark mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Target: {new Date(milestones.filter(m => !m.isCompleted)[0].targetDate!).toLocaleDateString()}</span>
                  </div>

                  {milestones.filter(m => !m.isCompleted)[0].requiredActivities && milestones.filter(m => !m.isCompleted)[0].requiredActivities.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-css-charcoal">Required Activities:</p>
                      {milestones.filter(m => !m.isCompleted)[0].requiredActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <Circle className="w-4 h-4 text-css-grey flex-shrink-0 mt-0.5" />
                          <span className="text-css-grey-dark">{activity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {milestones.filter(m => !m.isCompleted)[0].rewards && milestones.filter(m => !m.isCompleted)[0].rewards.length > 0 && (
                    <div className="pt-3 border-t border-css-gold">
                      <p className="text-xs font-semibold text-css-charcoal mb-2">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestones.filter(m => !m.isCompleted)[0].rewards.map((reward, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-white rounded-full shadow-sm flex items-center space-x-1">
                            <Star className="w-3 h-3 text-css-gold" />
                            <span>{reward}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </NeumorphicCard>

          {/* All Milestones */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-css-gold" />
              <h2 className="text-lg font-bold text-css-charcoal">90-Day Journey</h2>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {/* Connector Line */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-css-grey-light" />
                  )}

                  <div className="flex items-start space-x-3">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                        ${milestone.isCompleted
                          ? 'bg-gradient-gold shadow-neumorphic'
                          : 'bg-white shadow-neumorphic'
                        }
                      `}
                    >
                      {milestone.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm font-bold text-css-charcoal">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <h3 className={`font-semibold text-sm mb-1 ${milestone.isCompleted ? 'text-css-gold' : 'text-css-charcoal'}`}>
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-css-grey-dark mb-2">{milestone.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-css-grey">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(milestone.targetDate!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          {/* Quick Actions */}
          <NeumorphicCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-css-charcoal">Quick Actions</h2>

            <div className="space-y-2">
              <Link
                to="/employee/onboarding"
                className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-css-gold" />
                  <span className="font-medium text-css-charcoal group-hover:text-css-gold transition-colors">
                    Retake Assessment
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-css-grey" />
              </Link>

              <Link
                to="/employee/training"
                className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-css-charcoal group-hover:text-css-gold transition-colors">
                    Browse All Courses
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-css-grey" />
              </Link>

              <Link
                to="/employee/certificates"
                className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-css-charcoal group-hover:text-css-gold transition-colors">
                    View Certificates
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-css-grey" />
              </Link>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Reusable Components
// ============================================================================

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ children, className = '' }) => (
  <div className={`bg-css-grey-light rounded-xl shadow-neumorphic ${className}`}>
    {children}
  </div>
);

export default AssessmentDashboard;
