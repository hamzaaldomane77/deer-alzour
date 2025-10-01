'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحميل البيانات المحفوظة عند بدء التطبيق
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // حفظ الـ token في cookies أيضاً
      document.cookie = `auth_token=${savedToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 أيام
      
      // تحديث API client بالـ token المحفوظ
      apiClient.updateToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  // تحديث تلقائي للـ token كل 50 دقيقة (3000 ثانية)
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        console.log('فشل في تحديث الـ token، سيتم تسجيل الخروج');
      }
    }, 50 * 60 * 1000); // 50 دقيقة

    return () => clearInterval(refreshInterval);
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في تسجيل الدخول');
      }

      const data: AuthResponse = await response.json();
      
      // حفظ الـ token في cookies أولاً (فوري)
      document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 أيام
      
      // حفظ البيانات في localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // تحديث API client بالـ token الجديد
      apiClient.updateToken(data.token);
      
      // حفظ البيانات في الحالة المحلية (أخيراً)
      setUser(data.user);
      setToken(data.token);
      
      return true;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      if (!currentToken) {
        return false;
      }

      const response = await fetch('http://127.0.0.1:8000/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        // إذا فشل التحديث، قم بتسجيل الخروج
        logout();
        return false;
      }

      const data = await response.json();
      
      // تحديث الـ token الجديد
      const newToken = data.token || data.access_token;
      if (newToken) {
        // تحديث جميع الأماكن بالـ token الجديد
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
        document.cookie = `auth_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        // تحديث API client بالـ token الجديد
        apiClient.updateToken(newToken);
        
        console.log('تم تحديث الـ token بنجاح');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في تحديث الـ token:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // حذف الـ token من cookies أيضاً
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // مسح الـ token من API client
    apiClient.clearToken();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    refreshToken,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
