/**
 * Cultural Journey Map Service
 * 
 * Handles API calls for the Cultural Journey Map feature
 * Implements: GM-015, GM-016, GM-017, GM-018, GM-019
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ModuleProgress {
  milestone_id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  stamp_earned: boolean;
}

interface MilestoneProgress {
  milestone_id: string;
  badge_earned: boolean;
  badge_earned_at: string | null;
  track_reflection: string | null;
}

interface Certificate {
  certificate_number: string;
  total_stamps: number;
  total_milestones: number;
  total_reflections: number;
  issued_at: string;
  cpd_points: number;
  pdf_url: string | null;
}

interface JourneySummary {
  stamps_collected: number;
  badges_earned: number;
  reflections_written: number;
  certificate_earned: boolean;
}

interface JourneyProgress {
  progress: ModuleProgress[];
  milestones: MilestoneProgress[];
  certificate: Certificate | null;
  summary: JourneySummary;
}

interface Reflection {
  milestone_id: string;
  module_id: string;
  reflection_prompt: string;
  reflection_response: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's complete journey progress (GM-017)
 */
export async function getJourneyProgress(): Promise<JourneyProgress> {
  const response = await fetch(`${API_URL}/cultural-journey/progress`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch journey progress');
  }

  return response.json();
}

/**
 * Complete a module and earn a stamp (GM-015)
 */
export async function completeModule(
  milestoneId: string,
  moduleId: string
): Promise<{ success: boolean; progress: ModuleProgress; milestoneModulesCompleted: number }> {
  const response = await fetch(`${API_URL}/cultural-journey/complete-module`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ milestoneId, moduleId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete module');
  }

  return response.json();
}

/**
 * Save a micro-journaling reflection (GM-019)
 */
export async function saveReflection(
  milestoneId: string,
  moduleId: string,
  reflectionPrompt: string,
  reflectionResponse: string
): Promise<{ success: boolean; reflection: Reflection }> {
  const response = await fetch(`${API_URL}/cultural-journey/save-reflection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      milestoneId,
      moduleId,
      reflectionPrompt,
      reflectionResponse,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save reflection');
  }

  return response.json();
}

/**
 * Get all user's reflections (GM-019)
 */
export async function getReflections(): Promise<{ reflections: Reflection[]; count: number }> {
  const response = await fetch(`${API_URL}/cultural-journey/reflections`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reflections');
  }

  return response.json();
}

/**
 * Complete a milestone and earn a badge
 */
export async function completeMilestone(
  milestoneId: string,
  trackReflection?: string
): Promise<{ success: boolean; milestone: MilestoneProgress; totalBadgesEarned: number }> {
  const response = await fetch(`${API_URL}/cultural-journey/complete-milestone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ milestoneId, trackReflection }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete milestone');
  }

  return response.json();
}

/**
 * Generate certificate when full journey is complete (GM-018)
 */
export async function generateCertificate(): Promise<{ success: boolean; certificate: Certificate }> {
  const response = await fetch(`${API_URL}/cultural-journey/generate-certificate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate certificate');
  }

  return response.json();
}

/**
 * Get user's certificate if earned
 */
export async function getCertificate(): Promise<{ certificate: Certificate }> {
  const response = await fetch(`${API_URL}/cultural-journey/certificate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Certificate not found');
  }

  return response.json();
}

// =====================================================
// Local Storage Fallback (for offline support)
// =====================================================

const STORAGE_KEY = 'cultural_journey_progress';

/**
 * Save progress to local storage (fallback/offline)
 */
export function saveProgressToLocal(
  milestoneId: string,
  moduleId: string,
  completed: boolean
): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const progress = stored ? JSON.parse(stored) : { modules: {}, milestones: {} };
  
  const key = `${milestoneId}:${moduleId}`;
  progress.modules[key] = {
    completed,
    completedAt: completed ? new Date().toISOString() : null,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Get progress from local storage
 */
export function getProgressFromLocal(): {
  modules: Record<string, { completed: boolean; completedAt: string | null }>;
  milestones: Record<string, { badgeEarned: boolean; badgeEarnedAt: string | null }>;
} {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { modules: {}, milestones: {} };
}

/**
 * Save reflection to local storage
 */
export function saveReflectionToLocal(
  milestoneId: string,
  moduleId: string,
  prompt: string,
  response: string
): void {
  const storageKey = `${STORAGE_KEY}_reflections`;
  const stored = localStorage.getItem(storageKey);
  const reflections = stored ? JSON.parse(stored) : {};
  
  const key = `${milestoneId}:${moduleId}`;
  reflections[key] = {
    prompt,
    response,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(storageKey, JSON.stringify(reflections));
}

/**
 * Get reflections from local storage
 */
export function getReflectionsFromLocal(): Record<
  string,
  { prompt: string; response: string; updatedAt: string }
> {
  const storageKey = `${STORAGE_KEY}_reflections`;
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Sync local progress to cloud when online
 */
export async function syncLocalProgressToCloud(): Promise<void> {
  const localProgress = getProgressFromLocal();
  const localReflections = getReflectionsFromLocal();
  
  // Sync modules
  for (const [key, value] of Object.entries(localProgress.modules)) {
    if (value.completed) {
      const [milestoneId, moduleId] = key.split(':');
      try {
        await completeModule(milestoneId, moduleId);
      } catch (error) {
        console.error(`Failed to sync module ${key}:`, error);
      }
    }
  }
  
  // Sync reflections
  for (const [key, value] of Object.entries(localReflections)) {
    if (value.response) {
      const [milestoneId, moduleId] = key.split(':');
      try {
        await saveReflection(milestoneId, moduleId, value.prompt, value.response);
      } catch (error) {
        console.error(`Failed to sync reflection ${key}:`, error);
      }
    }
  }
}

// Export types
export type {
  ModuleProgress,
  MilestoneProgress,
  Certificate,
  JourneySummary,
  JourneyProgress,
  Reflection,
};

