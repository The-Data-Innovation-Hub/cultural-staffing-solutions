/**
 * Neon Data API Client
 * 
 * Provides direct REST access to your Neon database tables.
 * Uses JWT from Neon Auth for authentication.
 * 
 * API Endpoint: https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1
 */

// Your Neon Data API endpoint
const NEON_API_URL = import.meta.env.VITE_NEON_API_URL || 
  'https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1';

/**
 * Get authorization headers for Neon Data API requests
 * Uses JWT from cookies (set by Stack Auth)
 */
function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

/**
 * Generic fetch wrapper for Neon Data API
 * Uses credentials: 'include' to send JWT cookies
 */
async function neonFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${NEON_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
    credentials: 'include', // Include JWT cookies from Neon Auth
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    console.error('Neon Data API error:', error);
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  // Handle empty responses (e.g., DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ===========================================
// TABLE: neon_auth.users_sync (Neon Auth Users)
// ===========================================

export interface NeonAuthUser {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  raw_json: Record<string, unknown>;
}

/**
 * Get all Neon Auth users
 */
export async function getNeonAuthUsers(): Promise<NeonAuthUser[]> {
  return neonFetch<NeonAuthUser[]>('/neon_auth.users_sync');
}

/**
 * Get a single Neon Auth user by ID
 */
export async function getNeonAuthUser(id: string): Promise<NeonAuthUser | null> {
  const users = await neonFetch<NeonAuthUser[]>(`/neon_auth.users_sync?id=eq.${id}`);
  return users[0] || null;
}

/**
 * Get a Neon Auth user by email
 */
export async function getNeonAuthUserByEmail(email: string): Promise<NeonAuthUser | null> {
  const users = await neonFetch<NeonAuthUser[]>(`/neon_auth.users_sync?email=eq.${email}`);
  return users[0] || null;
}

// ===========================================
// TABLE: user_profiles (Custom User Data)
// ===========================================

export interface UserProfile {
  id: string;
  role: 'employee' | 'manager' | 'admin';
  department: string | null;
  location: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get user profile by ID (linked to Neon Auth user)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const profiles = await neonFetch<UserProfile[]>(`/user_profiles?id=eq.${userId}`);
  return profiles[0] || null;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  return neonFetch<UserProfile>('/user_profiles', {
    method: 'POST',
    headers: {
      'Prefer': 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      ...profile,
      updated_at: new Date().toISOString(),
    }),
  });
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string, 
  role: 'employee' | 'manager' | 'admin'
): Promise<UserProfile> {
  const profiles = await neonFetch<UserProfile[]>(`/user_profiles?id=eq.${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      role,
      updated_at: new Date().toISOString(),
    }),
  });
  return profiles[0];
}

// ===========================================
// TABLE: waitlist
// ===========================================

export interface WaitlistEntry {
  id: number;
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  created_at: string;
}

/**
 * Add email to waitlist
 */
export async function addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<WaitlistEntry> {
  const result = await neonFetch<WaitlistEntry[]>('/waitlist', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return result[0];
}

/**
 * Get all waitlist entries
 */
export async function getWaitlist(): Promise<WaitlistEntry[]> {
  return neonFetch<WaitlistEntry[]>('/waitlist?order=created_at.desc');
}

/**
 * Check if email is on waitlist
 */
export async function isOnWaitlist(email: string): Promise<boolean> {
  const entries = await neonFetch<WaitlistEntry[]>(`/waitlist?email=eq.${email}`);
  return entries.length > 0;
}

// ===========================================
// UTILITY: Combined User Data
// ===========================================

export interface FullUser {
  id: string;
  email: string;
  name: string | null;
  role: 'employee' | 'manager' | 'admin';
  department: string | null;
  location: string | null;
  profile_image: string | null;
  created_at: string;
}

/**
 * Get full user data (Neon Auth + Profile)
 */
export async function getFullUser(userId: string): Promise<FullUser | null> {
  const [authUser, profile] = await Promise.all([
    getNeonAuthUser(userId),
    getUserProfile(userId),
  ]);

  if (!authUser) return null;

  return {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
    role: profile?.role || 'employee',
    department: profile?.department || null,
    location: profile?.location || null,
    profile_image: profile?.profile_image || null,
    created_at: authUser.created_at,
  };
}

/**
 * Get full user data by email
 */
export async function getFullUserByEmail(email: string): Promise<FullUser | null> {
  const authUser = await getNeonAuthUserByEmail(email);
  if (!authUser) return null;
  return getFullUser(authUser.id);
}

// Export the raw fetch for custom queries
export { neonFetch, NEON_API_URL };

