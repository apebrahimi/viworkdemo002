'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// Generic Filter Options
export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

// Reusable Filter Configurations
export const createRoleFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: ['admin', 'user', 'moderator'].map(r => ({ 
      value: r, 
      label: language === 'fa' ? 
        (r === 'admin' ? 'مدیر' : r === 'moderator' ? 'ناظر' : 'کاربر') : 
        r.charAt(0).toUpperCase() + r.slice(1)
    })),
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'نقش' : 'Role',
    placeholder: language === 'fa' ? 'فیلتر نقش' : 'Filter Role'
  };
};

export const createUserStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'active', label: language === 'fa' ? 'فعال' : 'Active', color: 'text-green-600' },
      { value: 'inactive', label: language === 'fa' ? 'غیرفعال' : 'Inactive', color: 'text-gray-600' },
      { value: 'pending', label: language === 'fa' ? 'در انتظار' : 'Pending', color: 'text-yellow-600' },
      { value: 'suspended', label: language === 'fa' ? 'معلق' : 'Suspended', color: 'text-red-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createClientStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'online', label: language === 'fa' ? 'آنلاین' : 'Online', color: 'text-green-600' },
      { value: 'offline', label: language === 'fa' ? 'آفلاین' : 'Offline', color: 'text-gray-600' },
      { value: 'connecting', label: language === 'fa' ? 'متصل' : 'Connecting', color: 'text-yellow-600' },
      { value: 'disconnected', label: language === 'fa' ? 'قطع اتصال' : 'Disconnected', color: 'text-orange-600' },
      { value: 'error', label: language === 'fa' ? 'خطا' : 'Error', color: 'text-red-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createPlatformFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'windows', label: 'Windows' },
      { value: 'macos', label: 'macOS' },
      { value: 'linux', label: 'Linux' },
      { value: 'android', label: 'Android' },
      { value: 'ios', label: 'iOS' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'پلتفرم' : 'Platform',
    placeholder: language === 'fa' ? 'فیلتر پلتفرم' : 'Filter Platform'
  };
};

export const createMobileAppPlatformFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'android', label: 'Android' },
      { value: 'ios', label: 'iOS' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'پلتفرم' : 'Platform',
    placeholder: language === 'fa' ? 'فیلتر پلتفرم' : 'Filter Platform'
  };
};

export const createMobileAppStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'active', label: language === 'fa' ? 'فعال' : 'Active', color: 'text-green-600' },
      { value: 'inactive', label: language === 'fa' ? 'غیرفعال' : 'Inactive', color: 'text-gray-600' },
      { value: 'pending', label: language === 'fa' ? 'در انتظار' : 'Pending', color: 'text-yellow-600' },
      { value: 'maintenance', label: language === 'fa' ? 'نگهداری' : 'Maintenance', color: 'text-blue-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createServerStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'online', label: language === 'fa' ? 'آنلاین' : 'Online', color: 'text-green-600' },
      { value: 'offline', label: language === 'fa' ? 'آفلاین' : 'Offline', color: 'text-gray-600' },
      { value: 'maintenance', label: language === 'fa' ? 'تعمیر' : 'Maintenance', color: 'text-yellow-600' },
      { value: 'error', label: language === 'fa' ? 'خطا' : 'Error', color: 'text-red-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createServerTypeFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'openvpn', label: 'OpenVPN' },
      { value: 'stunnel', label: 'Stunnel' },
      { value: 'psa', label: 'PSA' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'نوع سرور' : 'Server Type',
    placeholder: language === 'fa' ? 'فیلتر نوع سرور' : 'Filter Server Type'
  };
};

export const createSecurityAlertTypeFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'critical', label: language === 'fa' ? 'بحرانی' : 'Critical', color: 'text-red-600' },
      { value: 'high', label: language === 'fa' ? 'بالا' : 'High', color: 'text-orange-600' },
      { value: 'medium', label: language === 'fa' ? 'متوسط' : 'Medium', color: 'text-yellow-600' },
      { value: 'low', label: language === 'fa' ? 'پایین' : 'Low', color: 'text-blue-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'نوع هشدار' : 'Alert Type',
    placeholder: language === 'fa' ? 'فیلتر نوع هشدار' : 'Filter Alert Type'
  };
};

export const createSecurityAlertStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'new', label: language === 'fa' ? 'جدید' : 'New', color: 'text-red-600' },
      { value: 'investigating', label: language === 'fa' ? 'در حال بررسی' : 'Investigating', color: 'text-yellow-600' },
      { value: 'resolved', label: language === 'fa' ? 'حل شده' : 'Resolved', color: 'text-green-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createSecurityIncidentSeverityFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'critical', label: language === 'fa' ? 'بحرانی' : 'Critical', color: 'text-red-600' },
      { value: 'high', label: language === 'fa' ? 'بالا' : 'High', color: 'text-orange-600' },
      { value: 'medium', label: language === 'fa' ? 'متوسط' : 'Medium', color: 'text-yellow-600' },
      { value: 'low', label: language === 'fa' ? 'پایین' : 'Low', color: 'text-blue-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'شدت' : 'Severity',
    placeholder: language === 'fa' ? 'فیلتر شدت' : 'Filter Severity'
  };
};

export const createSecurityIncidentStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'active', label: language === 'fa' ? 'فعال' : 'Active', color: 'text-red-600' },
      { value: 'investigating', label: language === 'fa' ? 'در حال بررسی' : 'Investigating', color: 'text-yellow-600' },
      { value: 'resolved', label: language === 'fa' ? 'حل شده' : 'Resolved', color: 'text-green-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createFirewallActionFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'allow', label: language === 'fa' ? 'اجازه' : 'Allow', color: 'text-green-600' },
      { value: 'deny', label: language === 'fa' ? 'مسدود' : 'Deny', color: 'text-red-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'عملیات' : 'Action',
    placeholder: language === 'fa' ? 'فیلتر عملیات' : 'Filter Action'
  };
};

export const createFirewallStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'true', label: language === 'fa' ? 'فعال' : 'Active', color: 'text-green-600' },
      { value: 'false', label: language === 'fa' ? 'غیرفعال' : 'Inactive', color: 'text-gray-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

export const createSessionStatusFilter = (selectedValues: string[], onSelectionChange: (values: string[]) => void) => {
  const { language } = useLanguage();
  
  return {
    options: [
      { value: 'active', label: language === 'fa' ? 'فعال' : 'Active', color: 'text-green-600' },
      { value: 'expired', label: language === 'fa' ? 'منقضی شده' : 'Expired', color: 'text-orange-600' },
      { value: 'terminated', label: language === 'fa' ? 'متوقف شده' : 'Terminated', color: 'text-red-600' }
    ],
    selectedValues,
    onSelectionChange,
    title: language === 'fa' ? 'وضعیت' : 'Status',
    placeholder: language === 'fa' ? 'فیلتر وضعیت' : 'Filter Status'
  };
};

// Generic Filter Creator
export const createCustomFilter = (
  options: FilterOption[],
  selectedValues: string[],
  onSelectionChange: (values: string[]) => void,
  title: string,
  placeholder: string
) => {
  return {
    options,
    selectedValues,
    onSelectionChange,
    title,
    placeholder
  };
};

// Filter Factory for different table types
export class TableFilterFactory {
  static forUsers(roleFilter: string[], statusFilter: string[], onRoleChange: (values: string[]) => void, onStatusChange: (values: string[]) => void) {
    return {
      role: createRoleFilter(roleFilter, onRoleChange),
      status: createUserStatusFilter(statusFilter, onStatusChange)
    };
  }

  static forClients(statusFilter: string[], platformFilter: string[], onStatusChange: (values: string[]) => void, onPlatformChange: (values: string[]) => void) {
    return {
      status: createClientStatusFilter(statusFilter, onStatusChange),
      platform: createPlatformFilter(platformFilter, onPlatformChange)
    };
  }

  static forServers(statusFilter: string[], typeFilter: string[], onStatusChange: (values: string[]) => void, onTypeChange: (values: string[]) => void) {
    return {
      status: createServerStatusFilter(statusFilter, onStatusChange),
      type: createServerTypeFilter(typeFilter, onTypeChange)
    };
  }

  static forMobileApps(platformFilter: string[], statusFilter: string[], onPlatformChange: (values: string[]) => void, onStatusChange: (values: string[]) => void) {
    return {
      platform: createMobileAppPlatformFilter(platformFilter, onPlatformChange),
      status: createMobileAppStatusFilter(statusFilter, onStatusChange)
    };
  }

  static forSecurityAlerts(typeFilter: string[], statusFilter: string[], onTypeChange: (values: string[]) => void, onStatusChange: (values: string[]) => void) {
    return {
      type: createSecurityAlertTypeFilter(typeFilter, onTypeChange),
      status: createSecurityAlertStatusFilter(statusFilter, onStatusChange)
    };
  }

  static forSecurityIncidents(severityFilter: string[], statusFilter: string[], onSeverityChange: (values: string[]) => void, onStatusChange: (values: string[]) => void) {
    return {
      severity: createSecurityIncidentSeverityFilter(severityFilter, onSeverityChange),
      status: createSecurityIncidentStatusFilter(statusFilter, onStatusChange)
    };
  }

  static forFirewallRules(actionFilter: string[], statusFilter: string[], onActionChange: (values: string[]) => void, onStatusChange: (values: string[]) => void) {
    return {
      action: createFirewallActionFilter(actionFilter, onActionChange),
      status: createFirewallStatusFilter(statusFilter, onStatusChange)
    };
  }

  static forSessions(statusFilter: string[], onStatusChange: (values: string[]) => void) {
    return {
      status: createSessionStatusFilter(statusFilter, onStatusChange)
    };
  }
}
