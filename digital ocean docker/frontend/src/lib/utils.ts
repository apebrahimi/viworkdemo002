import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SortField = 'username' | 'email' | 'role' | 'status' | 'lastLogin' | 'createdAt' | 'name' | 'platform' | 'ip_address' | 'last_seen' | 'connection_count' | 'version' | 'downloads' | 'lastUpdated' | 'userName' | 'deviceName' | 'lastActiveCity' | 'lastActivity' | 'bindingDate' | 'created_at' | 'expires_at' | 'is_revoked';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function formatDate(dateString: string, language: string) {
  return new Date(dateString).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Status utility functions
export const getStatusConfig = (status: string, language: 'fa' | 'en' = 'fa') => {
  const statusConfigs = {
    // User statuses
    active: {
      label: language === 'fa' ? 'فعال' : 'Active',
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700',
      icon: 'CheckCircle'
    },
    inactive: {
      label: language === 'fa' ? 'غیرفعال' : 'Inactive',
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-700',
      icon: 'XCircle'
    },
    pending: {
      label: language === 'fa' ? 'در انتظار' : 'Pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700',
      icon: 'Clock'
    },
    suspended: {
      label: language === 'fa' ? 'معلق' : 'Suspended',
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700',
      icon: 'AlertCircle'
    },
    // Client statuses
    online: {
      label: language === 'fa' ? 'آنلاین' : 'Online',
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700',
      icon: 'CheckCircle'
    },
    offline: {
      label: language === 'fa' ? 'آفلاین' : 'Offline',
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-700',
      icon: 'XCircle'
    },
    connecting: {
      label: language === 'fa' ? 'در حال اتصال' : 'Connecting',
      color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700',
      icon: 'Clock'
    },
    disconnected: {
      label: language === 'fa' ? 'قطع اتصال' : 'Disconnected',
      color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700',
      icon: 'AlertCircle'
    },
    error: {
      label: language === 'fa' ? 'خطا' : 'Error',
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700',
      icon: 'AlertCircle'
    },
    // Mobile app statuses
    maintenance: {
      label: language === 'fa' ? 'نگهداری' : 'Maintenance',
      color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700',
      icon: 'Settings'
    }
  };

  return statusConfigs[status as keyof typeof statusConfigs] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-700',
    icon: 'AlertCircle'
  };
};

export const renderStatusPill = (status: string, language: 'fa' | 'en' = 'fa') => {
  const config = getStatusConfig(status, language);
  
  return {
    className: `inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-xs font-medium text-center ${config.color}`,
    label: config.label,
    icon: config.icon
  };
};
