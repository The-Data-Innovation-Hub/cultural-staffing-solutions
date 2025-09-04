import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl?: string;
  role: 'employee' | 'manager' | 'admin';
  department: string;
  location: string;
}

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: Record<string, User> = {
  'employee@culturalstaffing.com': {
    id: '1',
    email: 'employee@culturalstaffing.com',
    firstName: 'Emily',
    lastName: 'Johnston',
    fullName: 'Emily Johnston',
    role: 'employee',
    department: 'Healthcare',
    location: 'Belfast, Northern Ireland'
  },
  'manager@culturalstaffing.com': {
    id: '2',
    email: 'manager@culturalstaffing.com',
    firstName: 'Michael',
    lastName: 'Campbell',
    fullName: 'Michael Campbell',
    role: 'manager',
    department: 'Healthcare Management',
    location: 'Derry, Northern Ireland'
  },
  'admin@culturalstaffing.com': {
    id: '3',
    email: 'admin@culturalstaffing.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    fullName: 'Sarah Wilson',
    role: 'admin',
    department: 'Administration',
    location: 'Lisburn, Northern Ireland'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
    }
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - accept any password for demo users
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
      setIsSignedIn(true);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('mockUser');
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