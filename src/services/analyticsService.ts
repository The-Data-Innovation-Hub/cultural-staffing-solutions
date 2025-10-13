/**
 * Analytics Service
 *
 * Handles fetching and processing healthcare workforce analytics data
 * including performance metrics, training effectiveness, sentiment analysis,
 * and retention prediction.
 */

import type {
  AnalyticsDashboard,
  PerformanceMetrics,
  SkillGapAnalysis,
  TrainingEffectivenessMetrics,
  SentimentAnalysis,
  RetentionPrediction,
  AnalyticsAlert,
  AIInsight,
  LearnerEngagement,
} from '@/types/analytics';

// VITE_API_URL should include /api, e.g., https://css-clinify.onrender.com/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ============================================================================
// Dashboard Overview
// ============================================================================

export async function getAnalyticsDashboard(
  organizationId?: string,
  period?: string
): Promise<AnalyticsDashboard> {
  const params = new URLSearchParams();
  if (organizationId) params.append('organizationId', organizationId);
  if (period) params.append('period', period);

  const response = await fetch(`${API_URL}/analytics/dashboard?${params}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics dashboard');
  }

  return response.json();
}

// ============================================================================
// Performance Analytics
// ============================================================================

export async function getPerformanceMetrics(userId?: string): Promise<PerformanceMetrics> {
  const endpoint = userId
    ? `${API_URL}/analytics/performance/${userId}`
    : `${API_URL}/analytics/performance/me`;

  const response = await fetch(endpoint, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch performance metrics');
  }

  return response.json();
}

export async function getTeamPerformanceMetrics(): Promise<PerformanceMetrics[]> {
  const response = await fetch(`${API_URL}/analytics/performance/team`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team performance metrics');
  }

  return response.json();
}

// ============================================================================
// Skill Gap Analysis
// ============================================================================

export async function getSkillGapAnalysis(userId?: string): Promise<SkillGapAnalysis> {
  const endpoint = userId
    ? `${API_URL}/analytics/skills/gaps/${userId}`
    : `${API_URL}/analytics/skills/gaps/me`;

  const response = await fetch(endpoint, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch skill gap analysis');
  }

  return response.json();
}

export async function getOrganizationSkillGaps(): Promise<SkillGapAnalysis[]> {
  const response = await fetch(`${API_URL}/analytics/skills/gaps`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization skill gaps');
  }

  return response.json();
}

// ============================================================================
// Training Effectiveness
// ============================================================================

export async function getTrainingEffectiveness(
  courseId?: string
): Promise<TrainingEffectivenessMetrics | TrainingEffectivenessMetrics[]> {
  const endpoint = courseId
    ? `${API_URL}/analytics/training/effectiveness/${courseId}`
    : `${API_URL}/analytics/training/effectiveness`;

  const response = await fetch(endpoint, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch training effectiveness metrics');
  }

  return response.json();
}

export async function getLearnerEngagement(
  userId?: string,
  courseId?: string
): Promise<LearnerEngagement[]> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (courseId) params.append('courseId', courseId);

  const response = await fetch(`${API_URL}/analytics/training/engagement?${params}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch learner engagement data');
  }

  return response.json();
}

// ============================================================================
// Sentiment Analysis
// ============================================================================

export async function getSentimentAnalysis(userId?: string): Promise<SentimentAnalysis> {
  const endpoint = userId
    ? `${API_URL}/analytics/sentiment/${userId}`
    : `${API_URL}/analytics/sentiment/me`;

  const response = await fetch(endpoint, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sentiment analysis');
  }

  return response.json();
}

export async function submitFeedback(feedbackData: {
  feedbackType: string;
  responses: Record<string, any>;
  rawText?: string;
}): Promise<void> {
  const response = await fetch(`${API_URL}/analytics/sentiment/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
}

// ============================================================================
// Retention Prediction
// ============================================================================

export async function getRetentionPrediction(userId?: string): Promise<RetentionPrediction> {
  const endpoint = userId
    ? `${API_URL}/analytics/retention/prediction/${userId}`
    : `${API_URL}/analytics/retention/prediction/me`;

  const response = await fetch(endpoint, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch retention prediction');
  }

  return response.json();
}

export async function getHighRiskEmployees(): Promise<RetentionPrediction[]> {
  const response = await fetch(`${API_URL}/analytics/retention/high-risk`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch high-risk employees');
  }

  return response.json();
}

// ============================================================================
// Alerts & Insights
// ============================================================================

export async function getAnalyticsAlerts(
  category?: string,
  severity?: string
): Promise<AnalyticsAlert[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (severity) params.append('severity', severity);

  const response = await fetch(`${API_URL}/analytics/alerts?${params}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics alerts');
  }

  return response.json();
}

export async function getAIInsights(category?: string): Promise<AIInsight[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);

  const response = await fetch(`${API_URL}/analytics/insights?${params}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI insights');
  }

  return response.json();
}

export async function resolveAlert(alertId: string): Promise<void> {
  const response = await fetch(`${API_URL}/analytics/alerts/${alertId}/resolve`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to resolve alert');
  }
}

// ============================================================================
// Data Collection (for ML models)
// ============================================================================

export async function trackInteraction(interactionData: {
  eventType: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const response = await fetch(`${API_URL}/analytics/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(interactionData),
  });

  if (!response.ok) {
    console.error('Failed to track interaction');
    // Don't throw - tracking failures shouldn't break UX
  }
}
