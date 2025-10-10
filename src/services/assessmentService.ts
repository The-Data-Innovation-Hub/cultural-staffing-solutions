/**
 * Assessment Service
 *
 * Handles all API calls related to assessments, learning paths, and progress tracking
 */

import type {
  AssessmentState,
  LearningPath,
  PriorityArea,
  RecommendedCourse,
  Milestone,
  UserRole,
  CulturalBackground,
  SkillsAssessment,
  LearningPreferences,
  AssessmentAnalytics,
  ReviewCycle,
  CheckIn,
} from '@/types/assessment';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ============================================================================
// Assessment Submission
// ============================================================================

export interface SubmitAssessmentRequest {
  role: UserRole;
  culturalBackground: CulturalBackground;
  skillRatings: Record<string, number>;
  learningPreferences: LearningPreferences;
  assessmentState: AssessmentState;
}

export interface SubmitAssessmentResponse {
  assessmentId: string;
  learningPathId: string;
  message: string;
}

export const submitAssessment = async (
  data: SubmitAssessmentRequest
): Promise<SubmitAssessmentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit assessment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

// ============================================================================
// Learning Path
// ============================================================================

export const getLearningPath = async (userId?: string): Promise<LearningPath | null> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/learning-paths/${userId}`
      : `${API_BASE_URL}/learning-paths/me`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No learning path found
      }
      throw new Error('Failed to fetch learning path');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning path:', error);
    throw error;
  }
};

export const updateLearningPathProgress = async (
  learningPathId: string,
  progress: Partial<LearningPath>
): Promise<LearningPath> => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${learningPathId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(progress),
    });

    if (!response.ok) {
      throw new Error('Failed to update learning path');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating learning path:', error);
    throw error;
  }
};

// ============================================================================
// Priority Areas
// ============================================================================

export const getPriorityAreas = async (learningPathId: string): Promise<PriorityArea[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${learningPathId}/priority-areas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch priority areas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching priority areas:', error);
    throw error;
  }
};

export const updatePriorityArea = async (
  areaId: string,
  updates: Partial<PriorityArea>
): Promise<PriorityArea> => {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-areas/${areaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update priority area');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating priority area:', error);
    throw error;
  }
};

// ============================================================================
// Recommended Courses
// ============================================================================

export const getRecommendedCourses = async (learningPathId: string): Promise<RecommendedCourse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${learningPathId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommended courses');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    throw error;
  }
};

export const enrollInCourse = async (courseId: string): Promise<RecommendedCourse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to enroll in course');
    }

    return await response.json();
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const updateCourseProgress = async (
  courseId: string,
  progressPercentage: number
): Promise<RecommendedCourse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ progressPercentage }),
    });

    if (!response.ok) {
      throw new Error('Failed to update course progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

// ============================================================================
// Milestones
// ============================================================================

export const getMilestones = async (learningPathId: string): Promise<Milestone[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${learningPathId}/milestones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch milestones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

export const completeMilestone = async (milestoneId: string): Promise<Milestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones/${milestoneId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to complete milestone');
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing milestone:', error);
    throw error;
  }
};

// ============================================================================
// Review Cycles & Check-ins
// ============================================================================

export const getCurrentReviewCycle = async (): Promise<ReviewCycle | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/review-cycles/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch review cycle');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching review cycle:', error);
    throw error;
  }
};

export const submitCheckIn = async (data: Omit<CheckIn, 'id' | 'createdAt' | 'updatedAt'>): Promise<CheckIn> => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-ins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit check-in');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting check-in:', error);
    throw error;
  }
};

// ============================================================================
// Analytics
// ============================================================================

export const getAssessmentAnalytics = async (userId?: string): Promise<AssessmentAnalytics | null> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/analytics/assessments/${userId}`
      : `${API_BASE_URL}/analytics/assessments/me`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// ============================================================================
// Assessment History
// ============================================================================

export const getAssessmentHistory = async (): Promise<AssessmentState[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assessments/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assessment history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    throw error;
  }
};

export const retakeAssessment = async (): Promise<{ assessmentId: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assessments/retake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to start assessment retake');
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting assessment retake:', error);
    throw error;
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};
