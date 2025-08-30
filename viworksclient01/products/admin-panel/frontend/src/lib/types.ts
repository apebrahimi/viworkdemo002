// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  platform: string;
  version: string;
  status: 'online' | 'offline' | 'connecting' | 'disconnected' | 'error';
  ip_address?: string;
  mac_address?: string;
  last_seen?: string;
  connection_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateClientRequest {
  name: string;
  platform: string;
  version: string;
  ip_address?: string;
  mac_address?: string;
}

export interface UpdateClientRequest {
  name?: string;
  platform?: string;
  version?: string;
  status?: string;
  ip_address?: string;
  mac_address?: string;
}

// Session Types
export interface Session {
  id: string;
  user_id: string;
  username: string;
  expires_at: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  is_revoked: boolean;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  page: number;
  per_page: number;
}

// Monitoring Types
export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SecurityAlertsResponse {
  alerts: SecurityAlert[];
  total: number;
  page: number;
  per_page: number;
}

export interface SystemLog {
  id: string;
  level: string;
  message: string;
  source: string;
  created_at: string;
}

export interface SystemLogsResponse {
  logs: SystemLog[];
  total: number;
  page: number;
  per_page: number;
}

// Health Types
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface ServiceStatus {
  status: string;
  response_time?: number;
  error?: string;
}

export interface ServiceHealth {
  database: ServiceStatus;
  redis: ServiceStatus;
  overall: ServiceStatus;
}

export interface HealthFullResponse {
  status: string;
  timestamp: string;
  uptime: string;
  version: string;
  services: ServiceHealth;
}

// Dashboard Types
export interface DashboardStats {
  total_users: number;
  total_clients: number;
  active_clients: number;
  total_alerts: number;
  unresolved_alerts: number;
  system_status: 'healthy' | 'degraded' | 'unhealthy';
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: any;
}

// Filter Types
export interface FilterOptions {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  platform?: string;
  severity?: string;
  date_from?: string;
  date_to?: string;
}

// Real-time Types
export interface WebSocketMessage {
  type: 'alert' | 'client_status' | 'user_activity' | 'system_status';
  data: any;
  timestamp: string;
}
