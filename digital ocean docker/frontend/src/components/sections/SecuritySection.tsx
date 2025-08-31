'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  SecurityOverview,
  SecurityAlerts,
  SecurityIncidents,
  FirewallManagement,
  SecurityLogs,
  SecurityTabNavigation,
  SecurityHeader
} from '@/components/security';
import { 
  SecurityAlert, 
  SecurityIncident, 
  FirewallRule 
} from '@/lib/types/security';

export function SecuritySection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'incidents' | 'firewall' | 'logs'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - will be replaced with API calls
  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'critical',
      title: language === 'fa' ? 'تلاش‌های متعدد ورود ناموفق' : 'Multiple Failed Login Attempts',
      description: language === 'fa' ? 'تشخیص 15 تلاش ورود ناموفق از IP 192.168.1.100 در 5 دقیقه گذشته' : 'Detected 15 failed login attempts from IP 192.168.1.100 in the last 5 minutes',
      source: '192.168.1.100',
      timestamp: '2025-08-23T10:30:00Z',
      status: 'new',
      affected_users: 3
    },
    {
      id: '2',
      type: 'high',
      title: language === 'fa' ? 'فعالیت مشکوک شبکه' : 'Suspicious Network Activity',
      description: language === 'fa' ? 'الگوی انتقال داده غیرعادی از حساب کاربری manager1 تشخیص داده شد' : 'Unusual data transfer pattern detected from user account manager1',
      source: 'manager1@company.com',
      timestamp: '2025-08-23T10:15:00Z',
      status: 'investigating',
      affected_users: 1
    },
    {
      id: '3',
      type: 'medium',
      title: language === 'fa' ? 'اتصال VPN از موقعیت غیرعادی' : 'VPN Connection from Unusual Location',
      description: language === 'fa' ? 'اتصال VPN از موقعیت جدید (تهران، ایران) برقرار شد' : 'VPN connection established from new location (Tehran, Iran)',
      source: 'user1@company.com',
      timestamp: '2025-08-23T10:00:00Z',
      status: 'new',
      affected_users: 1
    }
  ];

  const securityIncidents: SecurityIncident[] = [
    {
      id: '1',
      type: 'brute_force',
      severity: 'high',
      title: language === 'fa' ? 'حمله Brute Force تشخیص داده شد' : 'Brute Force Attack Detected',
      description: language === 'fa' ? 'تلاش‌های متعدد احراز هویت ناموفق از IP 203.0.113.45 تشخیص داده شد' : 'Multiple failed authentication attempts detected from IP 203.0.113.45',
      source_ip: '203.0.113.45',
      target_user: 'admin',
      timestamp: '2025-08-23T10:25:00Z',
      status: 'active'
    },
    {
      id: '2',
      type: 'unauthorized_access',
      severity: 'critical',
      title: language === 'fa' ? 'تلاش دسترسی غیرمجاز' : 'Unauthorized Access Attempt',
      description: language === 'fa' ? 'تلاش دسترسی به پنل مدیریت محدود از IP غیرمجاز' : 'Access attempt to restricted admin panel from unauthorized IP',
      source_ip: '198.51.100.67',
      timestamp: '2025-08-23T09:45:00Z',
      status: 'investigating'
    }
  ];

  const firewallRules: FirewallRule[] = [
    {
      id: '1',
      name: language === 'fa' ? 'اجازه ترافیک VPN' : 'Allow VPN Traffic',
      action: 'allow',
      protocol: 'tcp',
      source: 'any',
      destination: 'vpn-server',
      port: '1194,443',
      enabled: true,
      priority: 1
    },
    {
      id: '2',
      name: language === 'fa' ? 'مسدود کردن IP های مشکوک' : 'Block Suspicious IPs',
      action: 'deny',
      protocol: 'tcp',
      source: 'blacklist',
      destination: 'any',
      enabled: true,
      priority: 2
    },
    {
      id: '3',
      name: language === 'fa' ? 'اجازه دسترسی ادمین' : 'Allow Admin Access',
      action: 'allow',
      protocol: 'tcp',
      source: 'admin-networks',
      destination: 'admin-panel',
      port: '8080',
      enabled: true,
      priority: 3
    }
  ];

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <SecurityOverview 
            securityAlerts={securityAlerts}
            securityIncidents={securityIncidents}
            firewallRules={firewallRules}
          />
        );
      case 'alerts':
        return <SecurityAlerts securityAlerts={securityAlerts} />;
      case 'incidents':
        return <SecurityIncidents securityIncidents={securityIncidents} />;
      case 'firewall':
        return <FirewallManagement firewallRules={firewallRules} />;
      case 'logs':
        return <SecurityLogs />;
      default:
        return null;
    }
  };

  return (
    <>
      <SecurityHeader onRefresh={handleRefresh} isLoading={isLoading} />
      
      <SecurityTabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {renderActiveTab()}
    </>
  );
}
