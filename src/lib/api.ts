// API client for frontend to backend communication
// In a production app, you'd have a separate backend server
// For now, we'll use mock implementations that can be replaced with real API calls

import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';

// For demo purposes, we'll use localStorage to simulate authentication
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // In production, this would make an API call to your backend
      // For now, we'll simulate with a direct database call
      try {
        const user = await userService.getUserByEmail(email);
        if (user && user.password === password) {
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userRole', user.role);
          return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials' };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed' };
      }
    },

    logout: () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    },

    getCurrentUser: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return null;
      return await userService.getUserById(userId);
    },
  },

  users: {
    getStats: async (userId: string) => {
      return await userService.getUserStats(userId);
    },
    getCertificates: async (userId: string) => {
      return await userService.getUserCertificates(userId);
    },
    getAchievements: async (userId: string) => {
      return await userService.getUserAchievements(userId);
    },
  },

  courses: {
    getAll: async () => {
      return await courseService.getAllCourses();
    },
    getById: async (id: string) => {
      return await courseService.getCourseById(id);
    },
    getProgress: async (userId: string, courseId: string) => {
      return await courseService.getUserCourseProgress(userId, courseId);
    },
    updateProgress: async (userId: string, courseId: string, progress: number) => {
      return await courseService.updateUserProgress(userId, courseId, progress);
    },
    getUpcomingSessions: async () => {
      return await courseService.getUpcomingSessions();
    },
  },
};