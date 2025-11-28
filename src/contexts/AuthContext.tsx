import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as dbLogin, logout as dbLogout, User, isAuthenticated } from '@/services/authService';
import { getFullUser, getFullUserByEmail } from '@/lib/neonDataApi';
import { stackClientApp } from '@/lib/stack';

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for JWT token and stored user
    const storedUser = localStorage.getItem('authUser');
    const hasToken = isAuthenticated();

    if (hasToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    } else if (!hasToken && storedUser) {
      // Token expired but user data still exists - clear it
      localStorage.removeItem('authUser');
    }
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await dbLogin({ email, password });

    if (result.success && result.user) {
      setUser(result.user);
      setIsSignedIn(true);
      localStorage.setItem('authUser', JSON.stringify(result.user));
    } else {
      throw new Error(result.error || 'Invalid credentials');
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Neon Auth (Stack Auth)
      await stackClientApp.signOut();
      
      // Also call legacy backend logout to clear JWT cookies
      await dbLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local state regardless of API call result
      setUser(null);
      setIsSignedIn(false);
      localStorage.removeItem('authUser');
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User data refreshed:', userData);
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
      } else {
        console.error('❌ Failed to refresh user:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, user, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = () => {
  const { user } = useAuth();
  return { user };
};
