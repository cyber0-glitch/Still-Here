import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setTokens, clearTokens } from '../utils/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; displayName: string; locationCity?: string; locationCountry?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }
      const data = await api<User>('/users/me');
      setUser(data);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    await refreshUser();
  };

  const register = async (regData: { email: string; password: string; displayName: string; locationCity?: string; locationCountry?: string }) => {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(regData),
    });
    setTokens(data.accessToken, data.refreshToken);
    await refreshUser();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
