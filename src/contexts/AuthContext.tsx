import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/services/authService';

// ── DEMO MODE ────────────────────────────────────────────────────────────────
// No backend required: sign-in is validated locally against demo accounts.
const DEMO_PASSWORD = 'password123';

const DEMO_USERS: Record<string, User> = {
  'employee@culturalstaffing.com': {
    id: 'demo-employee',
    email: 'employee@culturalstaffing.com',
    firstName: 'Sarah',
    lastName: "O'Connor",
    role: 'employee',
    department: 'Nursing',
    location: 'Dublin, Ireland',
  },
  'manager@culturalstaffing.com': {
    id: 'demo-manager',
    email: 'manager@culturalstaffing.com',
    firstName: 'David',
    lastName: 'Byrne',
    role: 'manager',
    department: 'Workforce Development',
    location: 'Cork, Ireland',
  },
  'admin@culturalstaffing.com': {
    id: 'demo-admin',
    email: 'admin@culturalstaffing.com',
    firstName: 'Aoife',
    lastName: 'Murphy',
    role: 'admin',
    department: 'Platform Administration',
    location: 'Dublin, Ireland',
  },
};

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
    // DEMO MODE: session is a locally stored demo profile only.
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
    const demoUser = DEMO_USERS[email.trim().toLowerCase()];

    if (!demoUser || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password. Use a demo account with password: password123');
    }

    setUser(demoUser);
    setIsSignedIn(true);
    localStorage.setItem('authUser', JSON.stringify(demoUser));
  };

  const signOut = async () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('authUser');
  };

  const refreshUser = async () => {
    // DEMO MODE: nothing to refresh, profile is local.
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('authUser');
      }
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
