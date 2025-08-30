'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Activity,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Users,
  Globe,
  Database,
  Server,
  Key,
  Fingerprint,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/lib/translations';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  affected_users?: number;
}

interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'unauthorized_access' | 'data_breach' | 'malware' | 'ddos';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source_ip: string;
  target_user?: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  port?: string;
  enabled: boolean;
  priority: number;
}

export function SecuritySection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'incidents' | 'firewall' | 'logs'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30';
      case 'investigating':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30';
      case 'resolved':
        return 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30';
    }
  };

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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">{t('security', language)}</h1>
          <p className="text-muted-foreground">{t('securityDesc', language)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('refresh', language)}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('overview', language)}
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('alerts', language)}
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'incidents'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('incidents', language)}
        </button>
        <button
          onClick={() => setActiveTab('firewall')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'firewall'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('firewall', language)}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('logs', language)}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('criticalAlerts', language)}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {securityAlerts.filter(a => a.type === 'critical').length}
                  </p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('activeIncidents', language)}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {securityIncidents.filter(i => i.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('firewallRules', language)}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {firewallRules.filter(r => r.enabled).length}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('securityStatus', language)}</p>
                  <p className="text-2xl font-bold text-green-600">{t('excellent', language)}</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Bell className="w-5 h-5 text-red-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">{t('recentAlerts', language)}</h3>
                    <p className="text-sm text-muted-foreground">{t('recentSecurityAlerts', language)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {securityAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getAlertColor(alert.type)}`}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Status */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">{t('securityStatus', language)}</h3>
                    <p className="text-sm text-muted-foreground">{t('securityComponentsCheck', language)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{t('twoFactorAuth', language)}</span>
                  </div>
                  <span className="text-sm text-green-600">{t('active', language)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{t('firewall', language)}</span>
                  </div>
                  <span className="text-sm text-green-600">{t('active', language)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{t('sslEncryption', language)}</span>
                  </div>
                  <span className="text-sm text-green-600">{t('active', language)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">{t('securityScans', language)}</span>
                  </div>
                  <span className="text-sm text-yellow-600">{t('running', language)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Bell className="w-5 h-5 text-red-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">{t('securityAlerts', language)}</h3>
                  <p className="text-sm text-muted-foreground">{t('systemAlertsManagement', language)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getAlertColor(alert.type)}`}>
                            {alert.type}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{t('source', language)}: {alert.source}</span>
                        <span>{t('time', language)}: {new Date(alert.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}</span>
                        {alert.affected_users && (
                          <span>{t('affectedUsers', language)}: {alert.affected_users}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-accent rounded transition-colors" title={t('viewDetails', language)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-accent rounded transition-colors" title={t('resolve', language)}>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">{t('securityIncidents', language)}</h3>
                  <p className="text-sm text-muted-foreground">{t('securityIncidentsManagement', language)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getAlertColor(incident.severity)}`}>
                      {getAlertIcon(incident.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{incident.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getAlertColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{t('sourceIP', language)}: {incident.source_ip}</span>
                        {incident.target_user && (
                          <span>{t('targetUser', language)}: {incident.target_user}</span>
                        )}
                        <span>{t('time', language)}: {new Date(incident.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-accent rounded transition-colors" title={t('viewDetails', language)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-accent rounded transition-colors" title={t('investigate', language)}>
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Firewall Tab */}
      {activeTab === 'firewall' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">{t('firewallRules', language)}</h3>
                  <p className="text-sm text-muted-foreground">{t('firewallRulesManagement', language)}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                {t('addRule', language)}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('ruleName', language)}
                    </th>
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('action', language)}
                    </th>
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('protocol', language)}
                    </th>
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('source', language)}
                    </th>
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('destination', language)}
                    </th>
                    <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('status', language)}
                    </th>
                    <th className="text-center p-4 font-medium text-muted-foreground">
                      {t('actions', language)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {firewallRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="p-4">
                        <span className="font-medium">{rule.name}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                          rule.action === 'allow' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30' 
                            : 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30'
                        }`}>
                          {rule.action === 'allow' ? t('allow', language) : t('block', language)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm uppercase">{rule.protocol}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{rule.source}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{rule.destination}</span>
                        {rule.port && (
                          <span className="text-xs text-muted-foreground block">{t('port', language)}: {rule.port}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                          rule.enabled 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30' 
                            : 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30'
                        }`}>
                          {rule.enabled ? t('active', language) : t('inactive', language)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-accent rounded transition-colors" title={t('edit', language)}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-accent rounded transition-colors" title={rule.enabled ? t('disable', language) : t('enable', language)}>
                            {rule.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button className="p-1 hover:bg-accent rounded transition-colors text-red-500" title={t('delete', language)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">{t('securityLogs', language)}</h3>
                  <p className="text-sm text-muted-foreground">{t('viewSecuritySystemLogs', language)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <Download className="w-4 h-4" />
                  {t('download', language)}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  {t('refresh', language)}
                </button>
              </div>
            </div>
            
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              <div className="space-y-1">
                <div>[2025-08-23 10:30:15] INFO: User admin logged in successfully from 192.168.1.100</div>
                <div>[2025-08-23 10:30:12] WARNING: Multiple failed login attempts from 203.0.113.45</div>
                <div>[2025-08-23 10:29:58] INFO: VPN connection established for user user1 from 192.168.1.101</div>
                <div>[2025-08-23 10:29:45] ERROR: Unauthorized access attempt to admin panel from 198.51.100.67</div>
                <div>[2025-08-23 10:29:30] INFO: Firewall rule "Block Suspicious IPs" triggered for 203.0.113.45</div>
                <div>[2025-08-23 10:29:15] INFO: 2FA code generated for user manager1</div>
                <div>[2025-08-23 10:29:00] INFO: System backup completed successfully</div>
                <div>[2025-08-23 10:28:45] WARNING: High CPU usage detected on VPN server</div>
                <div>[2025-08-23 10:28:30] INFO: User session terminated for user user2</div>
                <div>[2025-08-23 10:28:15] INFO: SSL certificate renewed successfully</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
