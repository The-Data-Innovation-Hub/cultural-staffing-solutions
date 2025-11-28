/**
 * Hook for managing user profiles
 * 
 * This hook provides access to the current user's profile data
 * from the JWT auth context.
 */

import { useAuth } from '@/contexts/AuthContext';

interface UseUserProfileResult {
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'employee' | 'manager' | 'admin';
    profileImage?: string;
    department?: string;
    location?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileResult {
  const { user, isLoaded, refreshUser } = useAuth();

  return {
    profile: user ? {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImage: user.profileImage,
      department: user.department,
      location: user.location,
    } : null,
    isLoading: !isLoaded,
    error: null,
    refetch: refreshUser,
  };
}

/**
 * Hook to get just the user's role
 */
export function useUserRole(): 'employee' | 'manager' | 'admin' {
  const { user } = useAuth();
  return user?.role || 'employee';
}

export default useUserProfile;
