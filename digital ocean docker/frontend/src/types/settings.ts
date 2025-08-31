export interface TimeInterval {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
}

export interface LocationRestriction {
  id: string;
  name: string;
  type: 'country' | 'region' | 'city' | 'ip_range' | 'coordinates';
  value: string;
  isAllowed: boolean; // true = whitelist, false = blacklist
  isActive: boolean;
}

export interface ResourceAccess {
  id: string;
  name: string;
  type: 'server' | 'database' | 'api' | 'file' | 'network';
  resourceId: string;
  permissions: string[]; // ['read', 'write', 'delete', 'execute']
  isActive: boolean;
}

export interface UserType {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  requiresMobileVerification: boolean;
  maxConcurrentSessions: number;
  sessionTimeout: number; // in minutes
  timeIntervals: TimeInterval[];
  locationRestrictions: LocationRestriction[];
  resourceAccess: ResourceAccess[];
  createdAt: string;
  updatedAt: string;
}

export interface SettingsFormData {
  userTypes: UserType[];
  globalSettings: {
    defaultSessionTimeout: number;
    requireMobileVerification: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number; // in minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
}

export interface UserTypeFormData {
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  requiresMobileVerification: boolean;
  maxConcurrentSessions: number;
  sessionTimeout: number;
  timeIntervals: TimeInterval[];
  locationRestrictions: LocationRestriction[];
  resourceAccess: ResourceAccess[];
}
