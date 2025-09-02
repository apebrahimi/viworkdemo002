'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AdminUser, AdminLoginCredentials, AdminLoginResponse } from '@/lib/types';
import { adminApi } from '@/lib/admin-api-services';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from '@/lib/cookie-utils';

// Idle timeout duration in milliseconds (15 minutes)
const IDLE_TIMEOUT = 15 * 60 * 1000;

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  idleTimeRemaining: number | null;
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  resetIdleTimer: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idleTimeRemaining, setIdleTimeRemaining] = useState<number | null>(null);
  const [idleTimerHandle, setIdleTimerHandle] = useState<NodeJS.Timeout | null>(null);
  const [activityTimestamp, setActivityTimestamp] = useState<number>(Date.now());
  
  const router = useRouter();

  const isAuthenticated = !!admin;

  // Reset idle timer when user is active
  const resetIdleTimer = useCallback(() => {
    setActivityTimestamp(Date.now());
  }, []);

  // Check for admin token in cookies (not localStorage for security)
  const getAdminToken = useCallback(() => {
    return getCookie('viw_admin_sess');
  }, []);

  // Update idle time remaining
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Clear any existing timer
    if (idleTimerHandle) {
      clearInterval(idleTimerHandle);
    }

    // Set up timer to check idle time
    const handle = setInterval(() => {
      const now = Date.now();
      const elapsed = now - activityTimestamp;
      const remaining = Math.max(0, IDLE_TIMEOUT - elapsed);
      
      setIdleTimeRemaining(remaining);
      
      // Auto logout when idle timeout is reached
      if (remaining <= 0) {
        logout();
        router.push('/admin/login?reason=idle_timeout');
      }
    }, 1000);
    
    setIdleTimerHandle(handle);
    
    return () => {
      if (handle) clearInterval(handle);
    };
  }, [isAuthenticated, activityTimestamp]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Reset timer on user activity
    const handleActivity = () => resetIdleTimer();
    
    // Add event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    return () => {
      // Remove event listeners on cleanup
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isAuthenticated, resetIdleTimer]);

  // Initialize admin auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const token = getAdminToken();
        
        // If no token, immediately set loading to false
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Only try to get current admin if we have a token
        try {
          const currentAdmin = await adminApi.getCurrentAdmin();
          setAdmin(currentAdmin);
          resetIdleTimer();
        } catch (error) {
          console.error('Failed to get current admin:', error);
          // Clear invalid token
          deleteCookie('viw_admin_sess');
          deleteCookie('viw_admin_refresh');
        }
      } catch (error) {
        console.error('Failed to initialize admin auth:', error);
        // Clear invalid tokens
        deleteCookie('viw_admin_sess');
        deleteCookie('viw_admin_refresh');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AdminLoginCredentials) => {
    try {
      setIsLoading(true);
      const response: AdminLoginResponse = await adminApi.login(credentials);
      
      if (!response.success || !response.session) {
        throw new Error(response.message || 'Login failed');
      }
      
      // If MFA is required, redirect to MFA page
      if (response.requires_mfa) {
        router.push(`/admin/mfa?session=${response.session.token}`);
        return;
      }
      
      // Store tokens in HttpOnly cookies (handled by backend)
      // These are just for frontend state management
      setCookie('viw_admin_sess', response.session.token, {
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 900 // 15 minutes
      });
      
      setCookie('viw_admin_refresh', response.session.refresh_token, {
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 86400 // 24 hours
      });
      
      setAdmin(response.admin!);
      resetIdleTimer();
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated) {
        // Call logout endpoint
        await adminApi.logout();
      }
    } catch (error) {
      console.error('Admin logout API call failed:', error);
    } finally {
      // Clear cookies regardless of API call success
      deleteCookie('viw_admin_sess');
      deleteCookie('viw_admin_refresh');
      setAdmin(null);
      
      // Clear idle timer
      if (idleTimerHandle) {
        clearInterval(idleTimerHandle);
        setIdleTimerHandle(null);
      }
      setIdleTimeRemaining(null);
      
      // Redirect to login page
      router.push('/admin/login');
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = getCookie('viw_admin_refresh');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await adminApi.refreshToken(refreshToken);
      
      if (!response.success || !response.token) {
        throw new Error('Token refresh failed');
      }
      
      // Update tokens
      setCookie('viw_admin_sess', response.token, {
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 900 // 15 minutes
      });
      
      if (response.refresh_token) {
        setCookie('viw_admin_refresh', response.refresh_token, {
          path: '/',
          secure: true,
          sameSite: 'strict',
          maxAge: 86400 // 24 hours
        });
      }
      
      // Refresh admin data
      const currentAdmin = await adminApi.getCurrentAdmin();
      setAdmin(currentAdmin);
      resetIdleTimer();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      deleteCookie('viw_admin_sess');
      deleteCookie('viw_admin_refresh');
      setAdmin(null);
      router.push('/admin/login?reason=session_expired');
      throw error;
    }
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    idleTimeRemaining,
    login,
    logout,
    refreshAuth,
    resetIdleTimer,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
