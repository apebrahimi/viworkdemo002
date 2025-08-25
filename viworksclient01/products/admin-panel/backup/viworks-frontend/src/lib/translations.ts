export const translations = {
  fa: {
    // Header
    adminPanel: 'پنل مدیریت ViWorkS',
    settings: 'تنظیمات',
    search: 'جستجو...',
    searchEverything: 'جستجو در همه چیز...',
    toggleTheme: 'تغییر تم',
    profile: 'پروفایل',
    logout: 'خروج',
    notifications: 'اعلان‌ها',
    
    // Navigation
    dashboard: 'داشبورد',
    clients: 'کلاینت‌ها',
    users: 'کاربران',
    devices: 'دستگاه‌ها',
    monitoring: 'نظارت',
    security: 'امنیت',
    servers: 'سرورها',
    database: 'پایگاه داده',
    logs: 'لاگ‌ها',
    
    // Dashboard Stats
    activeClients: 'کلاینت‌های فعال',
    vpnServers: 'سرورهای VPN',
    securityAlerts: 'هشدارهای امنیتی',
    totalUsers: 'کل کاربران',
    fromLastMonth: 'از ماه گذشته',
    
    // Recent Activity
    recentActivity: 'فعالیت‌های اخیر',
    connected: 'متصل شد',
    disconnected: 'قطع اتصال شد',
    securityAlert: 'هشدار امنیتی: فعالیت مشکوک شناسایی شد',
    minutesAgo: 'دقیقه پیش',
    viewAllActivity: 'مشاهده همه فعالیت‌ها',
    newClientConnected: 'کلاینت جدید متصل شد',
    serverMaintenance: 'نگهداری سرور تکمیل شد',
    
    // Quick Actions
    quickActions: 'عملیات سریع',
    viewAllClients: 'مشاهده همه کلاینت‌ها',
    manageUsers: 'مدیریت کاربران',
    viewLogs: 'مشاهده لاگ‌ها',
    
    // Management Pages
    management: 'مدیریت',
    underDevelopment: 'این بخش در حال توسعه است. رابط مدیریت {section} در فاز بعدی پیاده‌سازی خواهد شد.',
    
    // Status
    system: 'سیستم',
  },
  en: {
    // Header
    adminPanel: 'ViWorkS Admin Panel',
    settings: 'Settings',
    search: 'Search...',
    searchEverything: 'Search everything...',
    toggleTheme: 'Toggle theme',
    profile: 'Profile',
    logout: 'Logout',
    notifications: 'Notifications',
    
    // Navigation
    dashboard: 'Dashboard',
    clients: 'Clients',
    users: 'Users',
    devices: 'Devices',
    monitoring: 'Monitoring',
    security: 'Security',
    servers: 'Servers',
    database: 'Database',
    logs: 'Logs',
    
    // Dashboard Stats
    activeClients: 'Active Clients',
    vpnServers: 'VPN Servers',
    securityAlerts: 'Security Alerts',
    totalUsers: 'Total Users',
    fromLastMonth: 'from last month',
    
    // Recent Activity
    recentActivity: 'Recent Activity',
    connected: 'Connected to VPN',
    disconnected: 'Disconnected from VPN',
    securityAlert: 'Security alert: Suspicious activity detected',
    minutesAgo: 'minutes ago',
    viewAllActivity: 'View All Activity',
    newClientConnected: 'New client connected',
    serverMaintenance: 'Server maintenance completed',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    viewAllClients: 'View All Clients',
    manageUsers: 'Manage Users',
    viewLogs: 'View Logs',
    
    // Management Pages
    management: 'Management',
    underDevelopment: 'This section is under development. The {section} management interface will be implemented in the next phase.',
    
    // Status
    system: 'System',
  }
};

export type Language = 'fa' | 'en';
export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language = 'fa'): string {
  return translations[lang][key] || translations.en[key] || key;
}
