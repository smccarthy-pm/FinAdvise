import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from '../lib/auth';
import { auth } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const MOCK_USER = {
  id: '1',
  email: 'dev@example.com',
  name: 'Development User',
  role: 'admin'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(MOCK_USER); // Set mock user by default
  const [loading, setLoading] = useState(false);

  // Skip auth check in development
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In development, always succeed and set mock user
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true, // Always authenticated in development
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}