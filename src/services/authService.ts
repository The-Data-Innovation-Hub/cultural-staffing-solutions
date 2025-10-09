// Authentication API configuration
const API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001';

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
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    return { success: true, user: data.user };
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
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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
