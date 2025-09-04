import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { clerkSyncService } from '@/services/clerkSync';

/**
 * Hook to sync Clerk user data with the database
 * This ensures the user exists in our database when they sign in
 */
export const useClerkSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return;

      try {
        const clerkUserData = {
          id: user.id,
          email_addresses: user.emailAddresses.map(email => ({
            email_address: email.emailAddress,
          })),
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          public_metadata: {
            role: (user.publicMetadata?.role as string) || 'employee',
            department: (user.publicMetadata?.department as string) || 'Healthcare',
            location: (user.publicMetadata?.location as string) || 'Dublin, Ireland',
          },
          image_url: user.imageUrl,
        };

        await clerkSyncService.ensureUser(clerkUserData);
      } catch (error) {
        console.error('Failed to sync user with database:', error);
        // In production, you might want to handle this error more gracefully
      }
    };

    syncUser();
  }, [user, isLoaded]);
};

/**
 * Hook to get the current user's database ID
 * Useful for components that need to interact with database records
 */
export const useUserDatabaseId = () => {
  const { user } = useUser();
  
  // In a production app, you might want to store the database user ID
  // in Clerk's public metadata or use a mapping table
  // For now, we'll use the email as the unique identifier
  return user?.primaryEmailAddress?.emailAddress || null;
};