import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as dbLogin, logout as dbLogout, User } from '@/services/authService';

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
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
      // Call backend logout to destroy session
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

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, user, signIn, signOut }}>
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
