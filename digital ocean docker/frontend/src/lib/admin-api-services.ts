import { api } from './api';
import {
  AdminLoginCredentials,
  AdminLoginResponse,
  AdminUser,
  AdminRefreshResponse,
  AdminUserListResponse,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AdminSessionListResponse,
  AdminAuditLogListResponse,
  AdminHealthResponse,
} from './types';

// Base URL for admin API
const ADMIN_API_BASE = '/admin/api';

// Admin Authentication API
export const adminApi = {
  login: async (credentials: AdminLoginCredentials): Promise<AdminLoginResponse> => {
    console.log('Admin API service: Making login request');
    
    try {
      const response = await api.post<AdminLoginResponse>(`${ADMIN_API_BASE}/auth/login`, credentials, {
        withCredentials: true // Important for cookie handling
      });
      
      console.log('Admin API service: Login response received');
      return response;
    } catch (error: any) {
      console.error('Admin login failed:', error.response?.data || error.message);
      
      // Return structured error response
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        admin: null,
        session: null,
        requires_mfa: false
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(`${ADMIN_API_BASE}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Admin logout failed:', error);
      // Even if API call fails, we'll clear cookies client-side
    }
  },

  refreshToken: async (refreshToken: string): Promise<AdminRefreshResponse> => {
    try {
      const response = await api.post<AdminRefreshResponse>(`${ADMIN_API_BASE}/auth/refresh`, {
        refresh_token: refreshToken
      }, {
        withCredentials: true
      });
      
      return response;
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Session expired. Please login again.',
        token: null,
        refresh_token: null,
        expires_at: null
      };
    }
  },

  getCurrentAdmin: async (): Promise<AdminUser> => {
    try {
      const response = await api.get<AdminUser>(`${ADMIN_API_BASE}/auth/me`, {
        withCredentials: true
      });
      
      return response;
    } catch (error) {
      console.error('Failed to get current admin:', error);
      throw error;
    }
  },
  
  // Admin User Management
  getAdminUsers: async (page: number = 1, limit: number = 10): Promise<AdminUserListResponse> => {
    return api.get<AdminUserListResponse>(`${ADMIN_API_BASE}/admins`, {
      params: { page, limit },
      withCredentials: true
    });
  },
  
  createAdminUser: async (userData: CreateAdminUserRequest): Promise<AdminUser> => {
    return api.post<AdminUser>(`${ADMIN_API_BASE}/admins`, userData, {
      withCredentials: true
    });
  },
  
  updateAdminUser: async (id: string, userData: UpdateAdminUserRequest): Promise<AdminUser> => {
    return api.put<AdminUser>(`${ADMIN_API_BASE}/admins/${id}`, userData, {
      withCredentials: true
    });
  },
  
  deleteAdminUser: async (id: string): Promise<void> => {
    return api.delete(`${ADMIN_API_BASE}/admins/${id}`, {
      withCredentials: true
    });
  },
  
  // Session Management
  getAdminSessions: async (page: number = 1, limit: number = 10): Promise<AdminSessionListResponse> => {
    return api.get<AdminSessionListResponse>(`${ADMIN_API_BASE}/sessions`, {
      params: { page, limit },
      withCredentials: true
    });
  },
  
  terminateSession: async (sessionId: string): Promise<void> => {
    return api.post(`${ADMIN_API_BASE}/sessions/${sessionId}/terminate`, {}, {
      withCredentials: true
    });
  },
  
  // Audit Logs
  getAuditLogs: async (
    page: number = 1, 
    limit: number = 10,
    filters: Record<string, any> = {}
  ): Promise<AdminAuditLogListResponse> => {
    return api.get<AdminAuditLogListResponse>(`${ADMIN_API_BASE}/audit`, {
      params: { page, limit, ...filters },
      withCredentials: true
    });
  },
  
  exportAuditLogs: async (filters: Record<string, any> = {}): Promise<Blob> => {
    return api.get(`${ADMIN_API_BASE}/audit/export`, {
      params: filters,
      responseType: 'blob',
      withCredentials: true
    });
  },
  
  // Health Check
  getAdminHealth: async (): Promise<AdminHealthResponse> => {
    return api.get<AdminHealthResponse>(`${ADMIN_API_BASE}/health`);
  }
};
