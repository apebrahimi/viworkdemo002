import { api } from './api';
import {
  LoginCredentials,
  LoginResponse,
  User,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  Client,
  ClientListResponse,
  CreateClientRequest,
  UpdateClientRequest,
  Session,
  SessionListResponse,
  SecurityAlert,
  SecurityAlertsResponse,
  SystemLog,
  SystemLogsResponse,
  HealthResponse,
  HealthFullResponse,
  FilterOptions,
} from './types';

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<any>('/api/v1/auth/login', credentials);
    
    // Transform enhanced backend response to match expected format
    return {
      success: response.success,
      message: response.message,
      token: response.data?.data?.session_id || 'demo_token',
      refresh_token: 'demo_refresh_token',
      user: {
        id: 'demo_user_id',
        username: credentials.username,
        email: `${credentials.username}@demo.com`,
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      }
    };
  },

  logout: async (): Promise<void> => {
    // Enhanced backend doesn't have logout endpoint, just return success
    return Promise.resolve();
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    // For demo, return a mock refresh response
    return {
      success: true,
      message: 'Token refreshed successfully',
      token: 'demo_refreshed_token',
      refresh_token: 'demo_new_refresh_token',
      user: {
        id: 'demo_user_id',
        username: 'demo',
        email: 'demo@demo.com',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      }
    };
  },

  getCurrentUser: async (): Promise<User> => {
    // For demo, return mock user data
    return {
      id: 'demo_user_id',
      username: 'demo',
      email: 'demo@demo.com',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
  },
};

// Health API
export const healthApi = {
  getHealth: async (): Promise<HealthResponse> => {
    return api.get<HealthResponse>('/health');
  },

  getHealthFull: async (): Promise<HealthFullResponse> => {
    return api.get<HealthFullResponse>('/health');
  },
};

// Users API - Enhanced to use new backend endpoints
export const usersApi = {
  getUsers: async (filters?: FilterOptions): Promise<UserListResponse> => {
    const response = await api.get<any>('/api/v1/admin/users');
    
    // Transform enhanced backend response
    return {
      users: response.users || [],
      total: response.users?.length || 0,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<any>('/api/v1/admin/users');
    const user = response.users?.find((u: any) => u.username === id);
    if (!user) throw new Error('User not found');
    
    return {
      id: user.username,
      username: user.username,
      email: user.email,
      role: 'user',
      status: user.status,
      created_at: user.created_at,
      last_login: new Date().toISOString(),
    };
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<any>('/api/v1/admin/users/create', {
      username: userData.username,
      email: userData.email,
      mobile: userData.mobile || '09123456789',
      policy_window: 'Mon-Fri 09:00-17:00',
      device_binding: true,
    });
    
    return {
      id: response.user.username,
      username: response.user.username,
      email: response.user.email,
      role: 'user',
      status: response.user.status,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
  },

  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    // Enhanced backend doesn't have update endpoint, return mock
    return {
      id,
      username: userData.username || id,
      email: userData.email || `${id}@demo.com`,
      role: userData.role || 'user',
      status: userData.status || 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    // Enhanced backend doesn't have delete endpoint, return success
    return Promise.resolve();
  },

  unlockUser: async (id: string): Promise<void> => {
    // Enhanced backend doesn't have unlock endpoint, return success
    return Promise.resolve();
  },

  resetUserPassword: async (id: string): Promise<{ new_password: string }> => {
    // Enhanced backend doesn't have password reset endpoint, return mock
    return { new_password: 'new_password_123' };
  },

  // New methods for enhanced backend
  activateUser: async (username: string): Promise<any> => {
    return api.post<any>('/api/v1/admin/users/activate', { username });
  },

  getDeviceRequests: async (): Promise<any> => {
    return api.get<any>('/api/v1/admin/device/requests');
  },

  approveDevice: async (requestId: string): Promise<any> => {
    return api.post<any>('/api/v1/admin/device/approve', { request_id: requestId });
  },
};

// Sessions API - Enhanced to use new backend endpoints
export const sessionsApi = {
  getSessions: async (filters?: FilterOptions): Promise<SessionListResponse> => {
    const response = await api.get<any>('/api/v1/admin/sessions');
    
    // Transform enhanced backend response
    const sessions = response.sessions?.map((s: any) => ({
      id: s.session_id,
      user_id: s.username,
      username: s.username,
      ip_address: '192.168.1.100',
      user_agent: 'ViWorkS Client/1.0',
      status: s.access_token ? 'active' : 'pending',
      created_at: s.created_at,
      last_activity: s.created_at,
      expires_at: s.otp_expires,
    })) || [];
    
    return {
      sessions,
      total: sessions.length,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };
  },

  getSession: async (id: string): Promise<Session> => {
    const response = await api.get<any>('/api/v1/admin/sessions');
    const session = response.sessions?.find((s: any) => s.session_id === id);
    if (!session) throw new Error('Session not found');
    
    return {
      id: session.session_id,
      user_id: session.username,
      username: session.username,
      ip_address: '192.168.1.100',
      user_agent: 'ViWorkS Client/1.0',
      status: session.access_token ? 'active' : 'pending',
      created_at: session.created_at,
      last_activity: session.created_at,
      expires_at: session.otp_expires,
    };
  },

  revokeSession: async (id: string): Promise<void> => {
    return api.post<any>('/api/v1/agent/session/terminate', { session_id: id });
  },

  revokeUserSessions: async (userId: string): Promise<void> => {
    // Enhanced backend doesn't have bulk revoke, return success
    return Promise.resolve();
  },

  cleanupExpiredSessions: async (): Promise<void> => {
    // Enhanced backend doesn't have cleanup endpoint, return success
    return Promise.resolve();
  },

  getUserSessions: async (userId: string, filters?: FilterOptions): Promise<SessionListResponse> => {
    const response = await api.get<any>('/api/v1/admin/sessions');
    const userSessions = response.sessions?.filter((s: any) => s.username === userId) || [];
    
    const sessions = userSessions.map((s: any) => ({
      id: s.session_id,
      user_id: s.username,
      username: s.username,
      ip_address: '192.168.1.100',
      user_agent: 'ViWorkS Client/1.0',
      status: s.access_token ? 'active' : 'pending',
      created_at: s.created_at,
      last_activity: s.created_at,
      expires_at: s.otp_expires,
    }));
    
    return {
      sessions,
      total: sessions.length,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };
  },
};

// Device Management API - New for enhanced backend
export const deviceApi = {
  bindDevice: async (username: string, fingerprint: string): Promise<any> => {
    return api.post<any>('/api/v1/device/bind-request', {
      username,
      fingerprint,
    });
  },

  getDeviceRequests: async (): Promise<any> => {
    return api.get<any>('/api/v1/admin/device/requests');
  },

  approveDevice: async (requestId: string): Promise<any> => {
    return api.post<any>('/api/v1/admin/device/approve', {
      request_id: requestId,
    });
  },
};

// Gateway Agent API - New for enhanced backend
export const gatewayApi = {
  createUser: async (username: string, password: string): Promise<any> => {
    return api.post<any>('/api/v1/agent/user/create', {
      username,
      password,
    });
  },

  spawnContainer: async (username: string, sessionId: string): Promise<any> => {
    return api.post<any>('/api/v1/agent/container/spawn', {
      username,
      session_id: sessionId,
    });
  },

  terminateSession: async (sessionId: string): Promise<any> => {
    return api.post<any>('/api/v1/agent/session/terminate', {
      session_id: sessionId,
    });
  },
};

// Audit Logs API - New for enhanced backend
export const auditApi = {
  getAuditLogs: async (): Promise<any> => {
    return api.get<any>('/api/v1/admin/audit-logs');
  },
};

// Clients API - Enhanced to use new backend endpoints
export const clientsApi = {
  getClients: async (filters?: FilterOptions): Promise<ClientListResponse> => {
    // Enhanced backend doesn't have clients endpoint, return mock data
    const mockClients = [
      {
        id: 'client_1',
        name: 'Mac Client - Keyvan',
        platform: 'macos',
        version: '1.0.0',
        status: 'connected',
        ip_address: '192.168.1.100',
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: 'client_2',
        name: 'Android App - Keyvan',
        platform: 'android',
        version: '1.0.0',
        status: 'connected',
        ip_address: '192.168.1.101',
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
    
    return {
      clients: mockClients,
      total: mockClients.length,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };
  },

  getClient: async (id: string): Promise<Client> => {
    const mockClient = {
      id,
      name: `Client ${id}`,
      platform: 'macos',
      version: '1.0.0',
      status: 'connected',
      ip_address: '192.168.1.100',
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    
    return mockClient;
  },

  createClient: async (clientData: CreateClientRequest): Promise<Client> => {
    // Enhanced backend doesn't have client creation, return mock
    return {
      id: `client_${Date.now()}`,
      name: clientData.name,
      platform: clientData.platform,
      version: '1.0.0',
      status: 'connected',
      ip_address: '192.168.1.100',
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  },

  updateClient: async (id: string, clientData: UpdateClientRequest): Promise<Client> => {
    // Enhanced backend doesn't have client update, return mock
    return {
      id,
      name: clientData.name || `Client ${id}`,
      platform: clientData.platform || 'macos',
      version: '1.0.0',
      status: 'connected',
      ip_address: '192.168.1.100',
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  },

  deleteClient: async (id: string): Promise<void> => {
    // Enhanced backend doesn't have client deletion, return success
    return Promise.resolve();
  },

  disconnectClient: async (id: string): Promise<void> => {
    // Enhanced backend doesn't have client disconnection, return success
    return Promise.resolve();
  },
};

// Monitoring API - Enhanced to use new backend endpoints
export const monitoringApi = {
  getSecurityAlerts: async (filters?: FilterOptions): Promise<SecurityAlert[]> => {
    // Enhanced backend doesn't have security alerts endpoint, return mock
    const mockAlerts = [
      {
        id: 'alert_1',
        title: 'Failed Login Attempt',
        description: 'Multiple failed login attempts detected',
        severity: 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
        resolved_at: null,
      },
      {
        id: 'alert_2',
        title: 'Suspicious Activity',
        description: 'Unusual network activity detected',
        severity: 'high',
        status: 'open',
        created_at: new Date().toISOString(),
        resolved_at: null,
      },
    ];
    
    return mockAlerts;
  },

  getSystemLogs: async (filters?: FilterOptions): Promise<SystemLog[]> => {
    const response = await api.get<any>('/api/v1/admin/audit-logs');
    
    // Transform enhanced backend audit logs to system logs
    const logs = response.logs?.map((log: any) => ({
      id: `log_${Date.now()}_${Math.random()}`,
      level: 'info',
      message: log.details,
      timestamp: log.timestamp,
      source: 'system',
      user: log.user,
    })) || [];
    
    return logs;
  },

  getSystemMetrics: async (): Promise<any> => {
    // Enhanced backend doesn't have metrics endpoint, return mock
    return {
      cpu_usage: 45,
      memory_usage: 60,
      disk_usage: 30,
      network_throughput: 100,
    };
  },

  getDashboardStats: async (): Promise<any> => {
    // Enhanced backend doesn't have dashboard stats endpoint, return mock
    return {
      total_users: 2,
      active_clients: 1,
      total_clients: 1,
      security_alerts: 0,
      system_health: 'healthy',
    };
  },

  resolveAlert: async (alertId: string): Promise<void> => {
    // Enhanced backend doesn't have alert resolution, return success
    return Promise.resolve();
  },
};

// Export all APIs
export const apiServices = {
  auth: authApi,
  health: healthApi,
  users: usersApi,
  clients: clientsApi,
  sessions: sessionsApi,
  monitoring: monitoringApi,
  device: deviceApi,
  gateway: gatewayApi,
  audit: auditApi,
};
