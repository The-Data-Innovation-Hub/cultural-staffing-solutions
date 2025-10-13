// Authentication API configuration
// VITE_API_URL should include /api, e.g., https://css-clinify.onrender.com/api
// Updated: 2025-10-13 - Migrated to JWT authentication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'admin';
  profileImage?: string;
  department?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role?: 'employee' | 'manager' | 'admin';
}

/**
 * Authenticate user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: send/receive cookies
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || data.error || 'Login failed' };
    }

    // Store JWT tokens
    if (data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    // Extract user data (without tokens)
    const { accessToken, refreshToken, ...user } = data;

    return { success: true, user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'An error occurred during login' };
  }
}

/**
 * Create a new user account
 */
export async function signup(data: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Signup failed' };
    }

    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error.message || 'An error occurred during signup' };
  }
}

/**
 * Logout the current user and clear tokens
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: clear httpOnly cookies
    });

    const result = await response.json();

    // Clear tokens from localStorage regardless of API response
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    if (!response.ok) {
      return { success: false, error: result.message || 'Logout failed' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    // Still clear local tokens even if API call fails
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return { success: false, error: error.message || 'An error occurred during logout' };
  }
}

/**
 * Get the stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get the stored refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
