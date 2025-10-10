/**
 * Assessment Data Hooks
 *
 * Custom React hooks for fetching and managing assessment-related data
 * with loading states, error handling, and automatic refetching
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  LearningPath,
  PriorityArea,
  RecommendedCourse,
  Milestone,
  ReviewCycle,
  AssessmentAnalytics,
} from '@/types/assessment';
import * as assessmentService from '@/services/assessmentService';

// ============================================================================
// Generic Data Fetching Hook
// ============================================================================

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================================================
// Learning Path Hook
// ============================================================================

export const useLearningPath = (userId?: string) => {
  const result = useData<LearningPath | null>(
    () => assessmentService.getLearningPath(userId),
    [userId]
  );

  const updateProgress = useCallback(
    async (progress: Partial<LearningPath>) => {
      if (!result.data?.id) {
        throw new Error('No learning path loaded');
      }

      try {
        const updated = await assessmentService.updateLearningPathProgress(
          result.data.id,
          progress
        );
        result.refetch();
        return updated;
      } catch (error) {
        toast.error('Failed to update learning path');
        throw error;
      }
    },
    [result.data?.id, result.refetch]
  );

  return {
    ...result,
    updateProgress,
  };
};

// ============================================================================
// Priority Areas Hook
// ============================================================================

export const usePriorityAreas = (learningPathId?: string) => {
  const result = useData<PriorityArea[]>(
    () => {
      if (!learningPathId) {
        return Promise.resolve([]);
      }
      return assessmentService.getPriorityAreas(learningPathId);
    },
    [learningPathId]
  );

  // Transform snake_case API response to camelCase for consistency
  const transformedData = result.data?.map(area => ({
    ...area,
    learningPathId: (area as any).learning_path_id ?? area.learningPathId,
    currentLevel: (area as any).current_level ?? area.currentLevel,
    targetLevel: (area as any).target_level ?? area.targetLevel,
    estimatedTimeWeeks: (area as any).estimated_time_weeks ?? area.estimatedTimeWeeks,
    isCompleted: (area as any).is_completed ?? area.isCompleted,
    priorityOrder: (area as any).priority_order ?? area.priorityOrder,
  }));

  const updateArea = useCallback(
    async (areaId: string, updates: Partial<PriorityArea>) => {
      try {
        const updated = await assessmentService.updatePriorityArea(areaId, updates);
        result.refetch();
        toast.success('Priority area updated');
        return updated;
      } catch (error) {
        toast.error('Failed to update priority area');
        throw error;
      }
    },
    [result.refetch]
  );

  return {
    ...result,
    data: transformedData,
    updateArea,
  };
};

// ============================================================================
// Recommended Courses Hook
// ============================================================================

export const useRecommendedCourses = (learningPathId?: string) => {
  const result = useData<RecommendedCourse[]>(
    () => {
      if (!learningPathId) {
        return Promise.resolve([]);
      }
      return assessmentService.getRecommendedCourses(learningPathId);
    },
    [learningPathId]
  );

  // Transform snake_case API response to camelCase for consistency
  const transformedData = result.data?.map(course => ({
    ...course,
    courseTitle: (course as any).course_title ?? course.courseTitle,
    courseDescription: (course as any).course_description ?? course.courseDescription,
    courseId: (course as any).course_id ?? course.courseId,
    durationMinutes: (course as any).duration_minutes ?? course.durationMinutes,
    difficultyLevel: (course as any).difficulty_level ?? course.difficultyLevel,
    contentTypes: (course as any).content_types ?? course.contentTypes,
    priorityOrder: (course as any).priority_order ?? course.priorityOrder,
    isEnrolled: (course as any).is_enrolled ?? course.isEnrolled,
    isCompleted: (course as any).is_completed ?? course.isCompleted,
    isRequired: (course as any).is_required ?? course.isRequired,
    progressPercentage: (course as any).progress_percentage ?? course.progressPercentage,
  }));

  const enrollInCourse = useCallback(
    async (courseId: string) => {
      try {
        const enrolled = await assessmentService.enrollInCourse(courseId);
        result.refetch();
        toast.success('Successfully enrolled in course!');
        return enrolled;
      } catch (error) {
        toast.error('Failed to enroll in course');
        throw error;
      }
    },
    [result.refetch]
  );

  const updateProgress = useCallback(
    async (courseId: string, progressPercentage: number) => {
      try {
        const updated = await assessmentService.updateCourseProgress(
          courseId,
          progressPercentage
        );
        result.refetch();
        return updated;
      } catch (error) {
        toast.error('Failed to update course progress');
        throw error;
      }
    },
    [result.refetch]
  );

  return {
    ...result,
    data: transformedData,
    enrollInCourse,
    updateProgress,
    enrolledCourses: transformedData?.filter(c => c.isEnrolled) || [],
    completedCourses: transformedData?.filter(c => c.isCompleted) || [],
  };
};

// ============================================================================
// Milestones Hook
// ============================================================================

export const useMilestones = (learningPathId?: string) => {
  const result = useData<Milestone[]>(
    () => {
      if (!learningPathId) {
        return Promise.resolve([]);
      }
      return assessmentService.getMilestones(learningPathId);
    },
    [learningPathId]
  );

  // Transform snake_case API response to camelCase for consistency
  const transformedData = result.data?.map(milestone => ({
    ...milestone,
    learningPathId: (milestone as any).learning_path_id ?? milestone.learningPathId,
    milestoneType: (milestone as any).milestone_type ?? milestone.milestoneType,
    targetDate: (milestone as any).target_date ?? milestone.targetDate,
    scheduledWeek: (milestone as any).scheduled_week ?? milestone.scheduledWeek,
    isCompleted: (milestone as any).is_completed ?? milestone.isCompleted,
    completedAt: (milestone as any).completed_at ?? milestone.completedAt,
    milestoneOrder: (milestone as any).milestone_order ?? milestone.milestoneOrder,
    associatedCourseIds: (milestone as any).associated_course_ids ?? milestone.associatedCourseIds,
    requiredActivities: (milestone as any).required_activities ?? milestone.requiredActivities,
    badgeAwarded: (milestone as any).badge_awarded ?? milestone.badgeAwarded,
  }));

  const completeMilestone = useCallback(
    async (milestoneId: string) => {
      try {
        const completed = await assessmentService.completeMilestone(milestoneId);
        result.refetch();
        toast.success('🎉 Milestone completed!');
        return completed;
      } catch (error) {
        toast.error('Failed to complete milestone');
        throw error;
      }
    },
    [result.refetch]
  );

  return {
    ...result,
    data: transformedData,
    completeMilestone,
    nextMilestone: transformedData?.find(m => !m.isCompleted),
    completedCount: transformedData?.filter(m => m.isCompleted).length || 0,
  };
};

// ============================================================================
// Review Cycle Hook
// ============================================================================

export const useReviewCycle = () => {
  const result = useData<ReviewCycle | null>(
    () => assessmentService.getCurrentReviewCycle(),
    []
  );

  const submitCheckIn = useCallback(
    async (checkInData: any) => {
      try {
        const checkIn = await assessmentService.submitCheckIn(checkInData);
        result.refetch();
        toast.success('Check-in submitted successfully');
        return checkIn;
      } catch (error) {
        toast.error('Failed to submit check-in');
        throw error;
      }
    },
    [result.refetch]
  );

  return {
    ...result,
    submitCheckIn,
    daysElapsed: result.data
      ? Math.floor(
          (Date.now() - new Date(result.data.startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0,
    daysRemaining: result.data
      ? Math.floor(
          (new Date(result.data.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      : 0,
  };
};

// ============================================================================
// Analytics Hook
// ============================================================================

export const useAssessmentAnalytics = (userId?: string) => {
  return useData<AssessmentAnalytics | null>(
    () => assessmentService.getAssessmentAnalytics(userId),
    [userId]
  );
};

// ============================================================================
// Combined Dashboard Data Hook
// ============================================================================

export const useDashboardData = () => {
  const learningPath = useLearningPath();
  const priorityAreas = usePriorityAreas(learningPath.data?.id);
  const courses = useRecommendedCourses(learningPath.data?.id);
  const milestones = useMilestones(learningPath.data?.id);
  const reviewCycle = useReviewCycle();

  const isLoading =
    learningPath.loading ||
    priorityAreas.loading ||
    courses.loading ||
    milestones.loading ||
    reviewCycle.loading;

  const hasError =
    learningPath.error ||
    priorityAreas.error ||
    courses.error ||
    milestones.error ||
    reviewCycle.error;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      learningPath.refetch(),
      priorityAreas.refetch(),
      courses.refetch(),
      milestones.refetch(),
      reviewCycle.refetch(),
    ]);
  }, [
    learningPath.refetch,
    priorityAreas.refetch,
    courses.refetch,
    milestones.refetch,
    reviewCycle.refetch,
  ]);

  // Calculate statistics
  const totalProgress = courses.enrolledCourses.length > 0
    ? Math.round(
        courses.enrolledCourses.reduce((sum, c) => sum + c.progressPercentage, 0) /
          courses.enrolledCourses.length
      )
    : 0;

  return {
    learningPath: learningPath.data,
    priorityAreas: priorityAreas.data || [],
    courses: courses.data || [],
    milestones: milestones.data || [],
    reviewCycle: reviewCycle.data,

    // Loading and error states
    isLoading,
    hasError,

    // Actions
    refetchAll,
    enrollInCourse: courses.enrollInCourse,
    updateCourseProgress: courses.updateProgress,
    completeMilestone: milestones.completeMilestone,

    // Computed values
    totalProgress,
    enrolledCourses: courses.enrolledCourses,
    completedCourses: courses.completedCourses,
    nextMilestone: milestones.nextMilestone,
    daysElapsed: reviewCycle.daysElapsed,
    daysRemaining: reviewCycle.daysRemaining,
  };
};

// ============================================================================
// Assessment Submission Hook
// ============================================================================

export const useAssessmentSubmission = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (data: assessmentService.SubmitAssessmentRequest) => {
      try {
        setSubmitting(true);
        setError(null);
        const result = await assessmentService.submitAssessment(data);
        toast.success('Assessment submitted successfully!');
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        toast.error('Failed to submit assessment');
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return {
    submit,
    submitting,
    error,
  };
};
