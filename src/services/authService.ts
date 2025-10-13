// Authentication API configuration
// VITE_API_URL should include /api, e.g., https://css-clinify.onrender.com/api
// Updated: 2025-10-13 - Fixed environment variable injection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'admin';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
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

    // Backend returns user directly, not wrapped in a user property
    return { success: true, user: data };
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
