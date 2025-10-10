/**
 * useAssessmentPersistence Hook
 *
 * Handles saving and loading assessment progress from localStorage
 * Allows users to pause and resume their assessment at any time
 */

import { useEffect, useCallback } from 'react';
import type { AssessmentState, UserRole, CulturalBackground, LearningPreferences, SkillLevel } from '@/types/assessment';

const STORAGE_KEY = 'css_assessment_state';
const STORAGE_VERSION = '1.0';

interface StoredAssessmentData {
  version: string;
  userId?: string;
  state: AssessmentState;
  roleSelection?: UserRole;
  culturalBackground?: Partial<CulturalBackground>;
  skillRatings?: Record<string, SkillLevel>;
  learningPreferences?: Partial<LearningPreferences>;
  lastSaved: string;
}

export const useAssessmentPersistence = () => {
  /**
   * Save assessment state to localStorage
   */
  const saveAssessmentState = useCallback((
    state: AssessmentState,
    roleSelection?: UserRole,
    culturalBackground?: Partial<CulturalBackground>,
    skillRatings?: Map<string, SkillLevel>,
    learningPreferences?: Partial<LearningPreferences>
  ) => {
    try {
      const dataToStore: StoredAssessmentData = {
        version: STORAGE_VERSION,
        state,
        roleSelection,
        culturalBackground,
        skillRatings: skillRatings ? Object.fromEntries(skillRatings) : undefined,
        learningPreferences,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      console.log('Assessment state saved to localStorage');
    } catch (error) {
      console.error('Failed to save assessment state:', error);
      // Silently fail - localStorage might be full or disabled
    }
  }, []);

  /**
   * Load assessment state from localStorage
   */
  const loadAssessmentState = useCallback((): {
    state: AssessmentState | null;
    roleSelection?: UserRole;
    culturalBackground?: Partial<CulturalBackground>;
    skillRatings?: Map<string, SkillLevel>;
    learningPreferences?: Partial<LearningPreferences>;
    lastSaved?: string;
  } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { state: null };
      }

      const data: StoredAssessmentData = JSON.parse(stored);

      // Version check
      if (data.version !== STORAGE_VERSION) {
        console.warn('Assessment state version mismatch, clearing old data');
        clearAssessmentState();
        return { state: null };
      }

      // Convert stored skill ratings back to Map
      const skillRatings = data.skillRatings
        ? new Map(Object.entries(data.skillRatings))
        : undefined;

      console.log('Assessment state loaded from localStorage');
      return {
        state: data.state,
        roleSelection: data.roleSelection,
        culturalBackground: data.culturalBackground,
        skillRatings,
        learningPreferences: data.learningPreferences,
        lastSaved: data.lastSaved,
      };
    } catch (error) {
      console.error('Failed to load assessment state:', error);
      return { state: null };
    }
  }, []);

  /**
   * Clear saved assessment state
   */
  const clearAssessmentState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Assessment state cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear assessment state:', error);
    }
  }, []);

  /**
   * Check if there's a saved assessment in progress
   */
  const hasSavedAssessment = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null;
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Get last saved timestamp
   */
  const getLastSavedTime = useCallback((): Date | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: StoredAssessmentData = JSON.parse(stored);
      return new Date(data.lastSaved);
    } catch (error) {
      return null;
    }
  }, []);

  return {
    saveAssessmentState,
    loadAssessmentState,
    clearAssessmentState,
    hasSavedAssessment,
    getLastSavedTime,
  };
};

/**
 * Hook to auto-save assessment state periodically
 */
export const useAutoSaveAssessment = (
  state: AssessmentState,
  roleSelection?: UserRole,
  culturalBackground?: Partial<CulturalBackground>,
  skillRatings?: Map<string, SkillLevel>,
  learningPreferences?: Partial<LearningPreferences>,
  enabled: boolean = true,
  intervalMs: number = 30000 // Auto-save every 30 seconds
) => {
  const { saveAssessmentState } = useAssessmentPersistence();

  useEffect(() => {
    if (!enabled) return;

    // Initial save
    saveAssessmentState(state, roleSelection, culturalBackground, skillRatings, learningPreferences);

    // Set up auto-save interval
    const interval = setInterval(() => {
      saveAssessmentState(state, roleSelection, culturalBackground, skillRatings, learningPreferences);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [state, roleSelection, culturalBackground, skillRatings, learningPreferences, enabled, intervalMs, saveAssessmentState]);
};
