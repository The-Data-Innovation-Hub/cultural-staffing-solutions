/**
 * Assessment Type Definitions
 *
 * Comprehensive type system for the user assessment flow including:
 * - Cultural competency assessment
 * - Skills gap analysis
 * - Learning style preferences
 * - Adaptive learning paths
 */

// ============================================================================
// Core Assessment Types
// ============================================================================

export type AssessmentStepId =
  | 'welcome'
  | 'role'
  | 'cultural'
  | 'skills'
  | 'learning-style'
  | 'results';

export type UserRole =
  | 'nurse'
  | 'physician'
  | 'allied-health'
  | 'administrative'
  | 'other';

export type DangerLevel = 'safe' | 'caution' | 'prohibited';

export type Region =
  | 'Global'
  | 'US'
  | 'UK'
  | 'Australia'
  | 'Canada'
  | 'Northern Ireland';

export type CountryOfOrigin =
  | 'philippines'
  | 'india'
  | 'nigeria'
  | 'pakistan'
  | 'other';

export type LearningStyle =
  | 'visual'
  | 'auditory'
  | 'reading-writing'
  | 'kinesthetic'
  | 'mixed';

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

// ============================================================================
// Cultural Competency Assessment
// ============================================================================

export interface CulturalCompetencyQuestion {
  id: string;
  question: string;
  category: 'awareness' | 'knowledge' | 'skills' | 'attitude';
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

export interface CulturalBackground {
  countryOfOrigin: CountryOfOrigin;
  yearsInTargetCountry?: number;
  primaryLanguage: string;
  englishProficiency: SkillLevel;
  previousInternationalExperience: boolean;
  culturalAdaptationConcerns: string[];
}

export interface CulturalCompetencyScore {
  overall: number; // 0-100
  awareness: number;
  knowledge: number;
  skills: number;
  attitude: number;
  recommendations: string[];
}

// ============================================================================
// Skills Assessment
// ============================================================================

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  priority: 'high' | 'medium' | 'low';
}

export interface SkillsAssessment {
  role: UserRole;
  categories: SkillCategory[];
  overallScore: number; // 0-100
  gapAnalysis: SkillGap[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  recommendedResources: string[];
}

// ============================================================================
// Learning Preferences
// ============================================================================

export interface LearningPreferences {
  primaryStyle: LearningStyle;
  secondaryStyle?: LearningStyle;
  preferredContentTypes: ContentType[];
  timeCommitment: 'light' | 'moderate' | 'intensive'; // hours per week
  schedulingPreference: 'flexible' | 'structured';
  notificationFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export type ContentType =
  | 'video'
  | 'reading'
  | 'interactive'
  | 'quiz'
  | 'simulation'
  | 'discussion';

// ============================================================================
// Assessment State Management
// ============================================================================

export interface AssessmentStep {
  id: AssessmentStepId;
  title: string;
  subtitle: string;
  order: number;
  completed: boolean;
  isValid: boolean;
}

export interface AssessmentAnswer {
  stepId: AssessmentStepId;
  questionId?: string;
  value: any;
  timestamp: string;
}

export interface AssessmentProgress {
  currentStep: AssessmentStepId;
  completedSteps: AssessmentStepId[];
  totalSteps: number;
  percentComplete: number;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
}

export interface AssessmentState {
  progress: AssessmentProgress;
  answers: Map<string, AssessmentAnswer>;

  // Step-specific data
  role?: UserRole;
  culturalBackground?: CulturalBackground;
  culturalCompetency?: CulturalCompetencyScore;
  skillsAssessment?: SkillsAssessment;
  learningPreferences?: LearningPreferences;

  // Results
  learningPath?: LearningPath;
}

// ============================================================================
// Learning Path & Recommendations
// ============================================================================

export interface LearningPath {
  id: string;
  userId: string;
  createdAt: string;

  // Assessment results summary
  overallScore: number; // 0-100
  culturalCompetencyScore: number;
  skillsScore: number;

  // Personalized recommendations
  priorityAreas: PriorityArea[];
  recommendedCourses: RecommendedCourse[];
  milestones: Milestone[];

  // Adaptive features
  estimatedCompletionTime: number; // in weeks
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  customizations: PathCustomization[];
}

export interface PriorityArea {
  id: string;
  category: 'cultural' | 'technical' | 'language' | 'compliance';
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  estimatedTimeToTarget: number; // in weeks
}

export interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentTypes: ContentType[];
  priorityOrder: number;
  isRequired: boolean;
  prerequisiteIds?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  associatedCourses: string[]; // course IDs
  rewards?: string[];
}

export interface PathCustomization {
  type: 'cultural' | 'role' | 'learning-style' | 'schedule';
  description: string;
  appliedRules: string[];
}

// ============================================================================
// Analytics & Tracking
// ============================================================================

export interface AssessmentAnalytics {
  userId: string;
  assessmentId: string;
  completionRate: number; // 0-100
  timeSpent: number; // in seconds
  retakeCount: number;

  // Demographic insights
  role: UserRole;
  countryOfOrigin: CountryOfOrigin;

  // Performance metrics
  culturalCompetencyScore: number;
  skillsScore: number;
  engagementScore: number; // Based on interaction patterns

  // Learning outcomes (tracked over time)
  progressOverTime: ProgressSnapshot[];
  courseCompletions: number;
  certificationsEarned: string[];
}

export interface ProgressSnapshot {
  date: string;
  culturalCompetencyScore: number;
  skillsScore: number;
  coursesCompleted: number;
  milestonesAchieved: number;
}

// ============================================================================
// Notification & Reminder System
// ============================================================================

export interface NotificationPreferences {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  channels: NotificationChannel[];
  quietHours?: {
    start: string; // HH:mm format
    end: string;
  };
  timezone: string;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app';

export interface AssessmentReminder {
  id: string;
  userId: string;
  type: 'review' | 'milestone' | 'course' | 'check-in';
  scheduledFor: string;
  message: string;
  actionUrl?: string;
  sent: boolean;
  sentAt?: string;
}

// ============================================================================
// 90-Day Review Cycle
// ============================================================================

export interface ReviewCycle {
  id: string;
  userId: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'overdue';

  // Initial assessment
  initialAssessment: AssessmentState;

  // Progress tracking
  checkIns: CheckIn[];

  // Final review
  finalReview?: ReviewSummary;
}

export interface CheckIn {
  id: string;
  date: string;
  daysSinceStart: number;

  // Quick assessment
  progressRating: SkillLevel; // Self-reported 1-5
  challengesFaced: string[];
  successesAchieved: string[];
  supportNeeded: string[];

  // Metrics
  coursesCompletedSinceLastCheckIn: number;
  hoursSpentLearning: number;
}

export interface ReviewSummary {
  id: string;
  completedAt: string;

  // Comparison metrics
  initialScores: {
    cultural: number;
    skills: number;
  };
  finalScores: {
    cultural: number;
    skills: number;
  };
  improvement: {
    cultural: number;
    skills: number;
  };

  // Achievements
  milestonesCompleted: number;
  coursesCompleted: number;
  certificationsEarned: string[];

  // Next steps
  nextCycleRecommendations: string[];
  updatedLearningPath?: LearningPath;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AssessmentResponse {
  success: boolean;
  data?: AssessmentState;
  error?: string;
}

export interface LearningPathResponse {
  success: boolean;
  data?: LearningPath;
  error?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data?: AssessmentAnalytics;
  error?: string;
}
