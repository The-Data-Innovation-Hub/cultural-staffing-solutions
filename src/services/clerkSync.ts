import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string;
  last_name: string;
  public_metadata?: {
    role?: string;
    department?: string;
    location?: string;
  };
  image_url?: string;
}

export const clerkSyncService = {
  /**
   * Sync a Clerk user to the database
   * This would typically be called from a webhook handler
   */
  async syncUser(clerkUser: ClerkUserData) {
    const email = clerkUser.email_addresses[0]?.email_address;
    if (!email) {
      throw new Error('User must have an email address');
    }

    const userData = {
      email,
      firstName: clerkUser.first_name || '',
      lastName: clerkUser.last_name || '',
      role: clerkUser.public_metadata?.role || 'employee',
      profileImage: clerkUser.image_url || null,
      // In production, you'd handle passwords differently since Clerk manages auth
      password: 'clerk_managed', // Placeholder since Clerk handles authentication
    };

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.email, email))
        .returning();
      return updated;
    } else {
      // Create new user
      const [created] = await db
        .insert(users)
        .values(userData)
        .returning();
      return created;
    }
  },

  /**
   * Delete a user from the database
   * Called when a user is deleted in Clerk
   */
  async deleteUser(email: string) {
    await db.delete(users).where(eq(users.email, email));
  },

  /**
   * Get or create a user based on Clerk data
   * Useful for ensuring a user exists when they sign in
   */
  async ensureUser(clerkUser: ClerkUserData) {
    try {
      return await this.syncUser(clerkUser);
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      throw error;
    }
  },
};