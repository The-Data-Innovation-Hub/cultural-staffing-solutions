/**
 * useCulturalJourney Hook
 * 
 * Custom hook for managing Cultural Journey Map state with cloud sync
 * Implements: GM-017 (Cloud sync), GM-019 (Reflection storage)
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getJourneyProgress,
  completeModule as apiCompleteModule,
  saveReflection as apiSaveReflection,
  completeMilestone as apiCompleteMilestone,
  generateCertificate as apiGenerateCertificate,
  saveProgressToLocal,
  saveReflectionToLocal,
  getProgressFromLocal,
  getReflectionsFromLocal,
  syncLocalProgressToCloud,
  JourneyProgress,
  Reflection,
} from '@/services/culturalJourneyService';

interface UseCulturalJourneyReturn {
  // State
  isLoading: boolean;
  error: string | null;
  progress: JourneyProgress | null;
  reflections: Reflection[];
  
  // Stats
  stampsCollected: number;
  badgesEarned: number;
  reflectionsWritten: number;
  certificateEarned: boolean;
  overallProgress: number;
  
  // Actions
  completeModule: (milestoneId: string, moduleId: string) => Promise<boolean>;
  saveReflection: (milestoneId: string, moduleId: string, prompt: string, response: string) => Promise<boolean>;
  completeMilestone: (milestoneId: string, trackReflection?: string) => Promise<boolean>;
  generateCertificate: () => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  
  // Helpers
  isModuleComplete: (milestoneId: string, moduleId: string) => boolean;
  isMilestoneBadgeEarned: (milestoneId: string) => boolean;
  getModuleReflection: (milestoneId: string, moduleId: string) => Reflection | undefined;
}

const TOTAL_MODULES = 17; // Total modules across all milestones

export function useCulturalJourney(): UseCulturalJourneyReturn {
  const { isSignedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  
  // Load progress on mount or when user changes
  useEffect(() => {
    if (isSignedIn && user) {
      loadProgress();
    } else {
      // Load from local storage for non-authenticated users
      loadLocalProgress();
    }
  }, [isSignedIn, user]);

  // Sync to cloud when coming online
  useEffect(() => {
    const handleOnline = () => {
      if (isSignedIn) {
        syncToCloud();
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isSignedIn]);

  const loadProgress = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getJourneyProgress();
      setProgress(data);
      
      // Also load reflections
      // Note: reflections are included in progress endpoint, but could be separate
    } catch (err: any) {
      console.error('Failed to load journey progress:', err);
      setError(err.message);
      
      // Fallback to local storage
      loadLocalProgress();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalProgress = () => {
    const localProgress = getProgressFromLocal();
    const localReflections = getReflectionsFromLocal();
    
    // Convert local storage format to JourneyProgress format
    const moduleProgress = Object.entries(localProgress.modules).map(([key, value]) => {
      const [milestone_id, module_id] = key.split(':');
      return {
        milestone_id,
        module_id,
        completed: value.completed,
        completed_at: value.completedAt,
        stamp_earned: value.completed,
      };
    });
    
    const milestoneProgress = Object.entries(localProgress.milestones).map(([key, value]) => ({
      milestone_id: key,
      badge_earned: value.badgeEarned,
      badge_earned_at: value.badgeEarnedAt,
      track_reflection: null,
    }));
    
    const stamps = moduleProgress.filter(m => m.completed).length;
    const badges = milestoneProgress.filter(m => m.badge_earned).length;
    
    setProgress({
      progress: moduleProgress,
      milestones: milestoneProgress,
      certificate: null,
      summary: {
        stamps_collected: stamps,
        badges_earned: badges,
        reflections_written: Object.values(localReflections).filter(r => r.response).length,
        certificate_earned: false,
      },
    });
    
    setReflections(
      Object.entries(localReflections).map(([key, value]) => {
        const [milestone_id, module_id] = key.split(':');
        return {
          milestone_id,
          module_id,
          reflection_prompt: value.prompt,
          reflection_response: value.response,
          created_at: value.updatedAt,
          updated_at: value.updatedAt,
        };
      })
    );
    
    setIsLoading(false);
  };

  const completeModule = useCallback(async (milestoneId: string, moduleId: string): Promise<boolean> => {
    try {
      // Save to local storage first (offline support)
      saveProgressToLocal(milestoneId, moduleId, true);
      
      if (isSignedIn) {
        // Sync to cloud
        await apiCompleteModule(milestoneId, moduleId);
      }
      
      // Update local state
      setProgress(prev => {
        if (!prev) return prev;
        
        const existingIndex = prev.progress.findIndex(
          p => p.milestone_id === milestoneId && p.module_id === moduleId
        );
        
        const newProgress = existingIndex >= 0
          ? prev.progress.map((p, i) => 
              i === existingIndex 
                ? { ...p, completed: true, completed_at: new Date().toISOString(), stamp_earned: true }
                : p
            )
          : [...prev.progress, {
              milestone_id: milestoneId,
              module_id: moduleId,
              completed: true,
              completed_at: new Date().toISOString(),
              stamp_earned: true,
            }];
        
        const newStamps = newProgress.filter(p => p.completed).length;
        
        return {
          ...prev,
          progress: newProgress,
          summary: {
            ...prev.summary,
            stamps_collected: newStamps,
          },
        };
      });
      
      return true;
    } catch (err: any) {
      console.error('Failed to complete module:', err);
      setError(err.message);
      return false;
    }
  }, [isSignedIn]);

  const saveReflection = useCallback(async (
    milestoneId: string,
    moduleId: string,
    prompt: string,
    response: string
  ): Promise<boolean> => {
    try {
      // Save to local storage first
      saveReflectionToLocal(milestoneId, moduleId, prompt, response);
      
      if (isSignedIn) {
        // Sync to cloud
        await apiSaveReflection(milestoneId, moduleId, prompt, response);
      }
      
      // Update local state
      setReflections(prev => {
        const existingIndex = prev.findIndex(
          r => r.milestone_id === milestoneId && r.module_id === moduleId
        );
        
        const newReflection: Reflection = {
          milestone_id: milestoneId,
          module_id: moduleId,
          reflection_prompt: prompt,
          reflection_response: response,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        if (existingIndex >= 0) {
          return prev.map((r, i) => i === existingIndex ? newReflection : r);
        }
        
        return [...prev, newReflection];
      });
      
      setProgress(prev => prev ? {
        ...prev,
        summary: {
          ...prev.summary,
          reflections_written: prev.summary.reflections_written + 1,
        },
      } : prev);
      
      return true;
    } catch (err: any) {
      console.error('Failed to save reflection:', err);
      setError(err.message);
      return false;
    }
  }, [isSignedIn]);

  const completeMilestone = useCallback(async (
    milestoneId: string,
    trackReflection?: string
  ): Promise<boolean> => {
    try {
      if (isSignedIn) {
        await apiCompleteMilestone(milestoneId, trackReflection);
      }
      
      setProgress(prev => {
        if (!prev) return prev;
        
        const existingIndex = prev.milestones.findIndex(m => m.milestone_id === milestoneId);
        
        const newMilestones = existingIndex >= 0
          ? prev.milestones.map((m, i) =>
              i === existingIndex
                ? { ...m, badge_earned: true, badge_earned_at: new Date().toISOString(), track_reflection: trackReflection || null }
                : m
            )
          : [...prev.milestones, {
              milestone_id: milestoneId,
              badge_earned: true,
              badge_earned_at: new Date().toISOString(),
              track_reflection: trackReflection || null,
            }];
        
        const newBadges = newMilestones.filter(m => m.badge_earned).length;
        
        return {
          ...prev,
          milestones: newMilestones,
          summary: {
            ...prev.summary,
            badges_earned: newBadges,
          },
        };
      });
      
      return true;
    } catch (err: any) {
      console.error('Failed to complete milestone:', err);
      setError(err.message);
      return false;
    }
  }, [isSignedIn]);

  const generateCertificate = useCallback(async (): Promise<boolean> => {
    try {
      if (!isSignedIn) {
        setError('Must be signed in to generate certificate');
        return false;
      }
      
      const result = await apiGenerateCertificate();
      
      setProgress(prev => prev ? {
        ...prev,
        certificate: result.certificate,
        summary: {
          ...prev.summary,
          certificate_earned: true,
        },
      } : prev);
      
      return true;
    } catch (err: any) {
      console.error('Failed to generate certificate:', err);
      setError(err.message);
      return false;
    }
  }, [isSignedIn]);

  const refreshProgress = useCallback(async () => {
    if (isSignedIn) {
      await loadProgress();
    } else {
      loadLocalProgress();
    }
  }, [isSignedIn]);

  const syncToCloud = useCallback(async () => {
    if (!isSignedIn) return;
    
    try {
      await syncLocalProgressToCloud();
      await loadProgress();
    } catch (err: any) {
      console.error('Failed to sync to cloud:', err);
      setError(err.message);
    }
  }, [isSignedIn]);

  // Helper functions
  const isModuleComplete = useCallback((milestoneId: string, moduleId: string): boolean => {
    return progress?.progress.some(
      p => p.milestone_id === milestoneId && p.module_id === moduleId && p.completed
    ) || false;
  }, [progress]);

  const isMilestoneBadgeEarned = useCallback((milestoneId: string): boolean => {
    return progress?.milestones.some(
      m => m.milestone_id === milestoneId && m.badge_earned
    ) || false;
  }, [progress]);

  const getModuleReflection = useCallback((milestoneId: string, moduleId: string): Reflection | undefined => {
    return reflections.find(
      r => r.milestone_id === milestoneId && r.module_id === moduleId
    );
  }, [reflections]);

  // Calculate derived stats
  const stampsCollected = progress?.summary.stamps_collected || 0;
  const badgesEarned = progress?.summary.badges_earned || 0;
  const reflectionsWritten = progress?.summary.reflections_written || 0;
  const certificateEarned = progress?.summary.certificate_earned || false;
  const overallProgress = Math.round((stampsCollected / TOTAL_MODULES) * 100);

  return {
    isLoading,
    error,
    progress,
    reflections,
    stampsCollected,
    badgesEarned,
    reflectionsWritten,
    certificateEarned,
    overallProgress,
    completeModule,
    saveReflection,
    completeMilestone,
    generateCertificate,
    refreshProgress,
    syncToCloud,
    isModuleComplete,
    isMilestoneBadgeEarned,
    getModuleReflection,
  };
}

export default useCulturalJourney;

