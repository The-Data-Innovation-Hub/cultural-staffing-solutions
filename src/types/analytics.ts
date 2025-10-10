/**
 * Healthcare Workforce Analytics Types
 *
 * Based on best practices for healthcare staff onboarding analytics:
 * - Performance monitoring & KPIs
 * - Skill gap analysis
 * - Training effectiveness metrics
 * - Sentiment analysis & retention prediction
 */

// ============================================================================
// Performance Analytics
// ============================================================================

export interface PerformanceMetrics {
  userId: string;
  period: string; // e.g., "2025-01", "Q1-2025"
  goalAchievementRate: number; // 0-100
  workQualityScore: number; // 0-100
  productivityEfficiency: number; // 0-100
  engagementScore: number; // 0-100
  overallPerformance: number; // weighted average
  lastUpdated: Date;
}

export interface PerformanceGoal {
  id: string;
  userId: string;
  goalType: 'clinical' | 'cultural' | 'technical' | 'compliance';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  completionRate: number;
}

// ============================================================================
// Skill Gap Analysis
// ============================================================================

export interface SkillGapAnalysis {
  userId: string;
  assessmentDate: Date;
  skillAreas: SkillArea[];
  overallGapScore: number; // 0-100, lower is better
  priorityAreas: string[];
  recommendedTraining: string[];
}

export interface SkillArea {
  category: string;
  skillName: string;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  gap: number; // requiredLevel - currentLevel
  priority: 'critical' | 'high' | 'medium' | 'low';
  trainingRecommendations: string[];
}

// ============================================================================
// Training Effectiveness
// ============================================================================

export interface TrainingEffectivenessMetrics {
  courseId: string;
  courseName: string;

  // Engagement Metrics
  completionRate: number; // percentage of enrolled who completed
  averageTimeToComplete: number; // hours
  engagementScore: number; // 0-100, based on interaction data

  // Knowledge Metrics
  preAssessmentAverage: number; // 0-100
  postAssessmentAverage: number; // 0-100
  knowledgeImprovement: number; // post - pre
  passRate: number; // percentage scoring above threshold

  // Application Metrics
  timeToCompetency: number; // days until proficient
  transferOfTraining: number; // 0-100, workplace application rate
  managerSatisfactionScore: number; // 0-100

  // Impact Metrics
  productivityIncrease: number; // percentage
  errorReduction: number; // percentage
  patientSatisfactionImpact: number; // correlation score

  // Meta
  totalEnrollments: number;
  sampleSize: number;
  lastCalculated: Date;
}

export interface LearnerEngagement {
  userId: string;
  courseId: string;
  timeSpent: number; // minutes
  videosWatched: number;
  interactionsCompleted: number;
  quizzesAttempted: number;
  resourcesDownloaded: number;
  forumParticipation: number;
  lastActivity: Date;
  engagementScore: number; // 0-100
}

// ============================================================================
// Sentiment Analysis
// ============================================================================

export interface SentimentAnalysis {
  userId: string;
  analysisDate: Date;
  overallSentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  sentimentScore: number; // -100 to +100

  // Dimension Scores
  jobSatisfaction: number; // 0-100
  workLifeBalance: number; // 0-100
  teamDynamics: number; // 0-100
  managementSupport: number; // 0-100
  careerGrowth: number; // 0-100
  workload: number; // 0-100

  // Warning Signs
  burnoutRisk: 'low' | 'moderate' | 'high' | 'critical';
  attritionRisk: 'low' | 'moderate' | 'high' | 'critical';

  // Data Sources
  feedbackAnalyzed: number; // count of feedback items
  keyThemes: string[];
  positiveIndicators: string[];
  concernIndicators: string[];
}

export interface EmployeeFeedback {
  id: string;
  userId: string;
  feedbackType: 'survey' | 'check_in' | 'open_ended' | 'pulse';
  timestamp: Date;
  responses: Record<string, any>;
  rawText?: string;
  sentimentScore?: number;
  analyzedThemes?: string[];
}

// ============================================================================
// Retention Prediction
// ============================================================================

export interface RetentionPrediction {
  userId: string;
  predictionDate: Date;
  attritionRisk: number; // 0-100, probability of leaving
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number; // 0-100, model confidence

  // Contributing Factors (feature importance)
  factors: RetentionFactor[];

  // Recommendations
  interventions: RetentionIntervention[];

  // Trend
  historicalRisk: number[]; // last 6 months
  trendDirection: 'improving' | 'stable' | 'declining';
}

export interface RetentionFactor {
  factor: string;
  importance: number; // 0-100
  currentValue: number;
  healthyRange: [number, number];
  status: 'healthy' | 'warning' | 'critical';
}

export interface RetentionIntervention {
  type: 'recognition' | 'development' | 'workload' | 'support' | 'compensation';
  priority: 'immediate' | 'short_term' | 'ongoing';
  recommendation: string;
  expectedImpact: number; // 0-100
}

export interface RetentionDataPoint {
  userId: string;
  recordDate: Date;

  // Work Pattern Data
  weeklyHours: number;
  overtimeHours: number;
  shiftVariability: number;
  consecutiveDays: number;

  // Patient Load
  patientsPerShift: number;
  acuityScore: number;

  // Engagement
  trainingCompletion: number;
  meetingAttendance: number;
  voluntaryActivities: number;

  // Performance
  performanceScore: number;
  errorRate: number;
  complianceScore: number;

  // Social
  teamCollaborationScore: number;
  managerInteractions: number;
  peerSupportScore: number;
}

// ============================================================================
// Dashboard Metrics
// ============================================================================

export interface AnalyticsDashboard {
  organizationId: string;
  period: string;
  generatedAt: Date;

  // Overview KPIs
  totalEmployees: number;
  activeInOnboarding: number;
  averageOnboardingProgress: number;

  // Performance Summary
  averagePerformanceScore: number;
  topPerformersCount: number;
  needingSupportCount: number;

  // Training Summary
  totalCoursesOffered: number;
  averageCompletionRate: number;
  averageKnowledgeGain: number;
  trainingROI: number;

  // Skills Summary
  criticalSkillGaps: number;
  averageSkillGap: number;
  employeesInSkillTraining: number;

  // Sentiment Summary
  averageSentiment: number;
  positiveEmployees: number;
  atRiskEmployees: number;

  // Retention Summary
  predictedAttrition: number;
  highRiskCount: number;
  retentionRate: number; // 0-100

  // Trends
  performanceTrend: TrendData[];
  engagementTrend: TrendData[];
  retentionTrend: TrendData[];
}

export interface TrendData {
  period: string;
  value: number;
  change?: number; // percentage change from previous
}

// ============================================================================
// Alerts & Insights
// ============================================================================

export interface AnalyticsAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'performance' | 'training' | 'sentiment' | 'retention';
  title: string;
  description: string;
  affectedUsers: string[];
  actionRequired: boolean;
  recommendations: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'prediction' | 'recommendation';
  category: 'performance' | 'training' | 'skills' | 'sentiment' | 'retention';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  suggestedActions: string[];
  dataPoints: any[];
  createdAt: Date;
}

// ============================================================================
// Export all types
// ============================================================================

export type {
  PerformanceMetrics,
  PerformanceGoal,
  SkillGapAnalysis,
  SkillArea,
  TrainingEffectivenessMetrics,
  LearnerEngagement,
  SentimentAnalysis,
  EmployeeFeedback,
  RetentionPrediction,
  RetentionFactor,
  RetentionIntervention,
  RetentionDataPoint,
  AnalyticsDashboard,
  TrendData,
  AnalyticsAlert,
  AIInsight,
};
