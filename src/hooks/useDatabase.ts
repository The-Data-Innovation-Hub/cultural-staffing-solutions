import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';

// User hooks
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => userService.getUserStats(userId),
    enabled: !!userId,
  });
};

export const useUserCertificates = (userId: string) => {
  return useQuery({
    queryKey: ['userCertificates', userId],
    queryFn: () => userService.getUserCertificates(userId),
    enabled: !!userId,
  });
};

// Course hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses,
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useCourseProgress = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: ['courseProgress', userId, courseId],
    queryFn: () => courseService.getUserCourseProgress(userId, courseId),
    enabled: !!userId && !!courseId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, courseId, progress }: { 
      userId: string; 
      courseId: string; 
      progress: number;
    }) => courseService.updateUserProgress(userId, courseId, progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['courseProgress', variables.userId, variables.courseId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userStats', variables.userId] 
      });
    },
  });
};

export const useUpcomingSessions = () => {
  return useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: courseService.getUpcomingSessions,
  });
};