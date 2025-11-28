/**
 * Hook for managing user profiles via Neon Data API
 * 
 * This hook fetches and manages user profile data (role, department, etc.)
 * that extends the basic Neon Auth user data.
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser as useStackUser } from '@stackframe/react';
import { 
  getUserProfile, 
  upsertUserProfile, 
  getFullUser,
  UserProfile, 
  FullUser 
} from '@/lib/neonDataApi';

interface UseUserProfileResult {
  profile: UserProfile | null;
  fullUser: FullUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export function useUserProfile(): UseUserProfileResult {
  const stackUser = useStackUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullUser, setFullUser] = useState<FullUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!stackUser?.id) {
      setProfile(null);
      setFullUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both profile and full user data
      const [profileData, fullUserData] = await Promise.all([
        getUserProfile(stackUser.id),
        getFullUser(stackUser.id),
      ]);

      setProfile(profileData);
      setFullUser(fullUserData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, [stackUser?.id]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!stackUser?.id) {
      throw new Error('No user logged in');
    }

    setError(null);

    try {
      const updated = await upsertUserProfile({
        id: stackUser.id,
        ...data,
      });
      setProfile(updated);
      
      // Refetch full user to get updated combined data
      const fullUserData = await getFullUser(stackUser.id);
      setFullUser(fullUserData);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [stackUser?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    fullUser,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}

/**
 * Hook to get just the user's role
 */
export function useUserRole(): 'employee' | 'manager' | 'admin' {
  const { profile } = useUserProfile();
  return profile?.role || 'employee';
}

export default useUserProfile;

