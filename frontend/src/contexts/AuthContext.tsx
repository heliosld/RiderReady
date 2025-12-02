'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  session_id: string;
  is_guest: boolean;
  username?: string;
  email?: string;
  full_name?: string;
  company?: string;
  role?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionToken: string | null;
  createGuestSession: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session token
    const token = localStorage.getItem('session_token');
    if (token) {
      setSessionToken(token);
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('session_token');
        setSessionToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGuestSession = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSessionToken(data.sessionToken);
        localStorage.setItem('session_token', data.sessionToken);
      }
    } catch (error) {
      console.error('Error creating guest session:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('session_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionToken, createGuestSession, logout }}>
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
