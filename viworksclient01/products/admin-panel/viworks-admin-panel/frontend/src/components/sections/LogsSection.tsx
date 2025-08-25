'use client';

import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  Clock,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Activity,
  Users,
  Server,
  Database,
  Shield,
  Globe,
  Wifi,
  Settings,
  Calendar,
  Timer,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Archive,
  Terminal,
  Monitor,
  Zap,
  Key,
  Lock,
  Unlock,
  Bell,
  Database as DatabaseIcon,
  Network,
  HardDrive,
  Cpu,
  Memory
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug' | 'critical';
  source: 'system' | 'auth' | 'vpn' | 'database' | 'security' | 'network';
  message: string;
  user?: string;
  ip_address?: string;
  session_id?: string;
  details?: string;
}

interface LogFilter {
  level: string[];
  source: string[];
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
  user?: string;
  ip_address?: string;
}

export function LogsSection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'live' | 'search' | 'analysis' | 'archives'>('live');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filters, setFilters] = useState<LogFilter>({
    level: [],
    source: [],
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    user: '',
    ip_address: ''
  });

  // Mock data - will be replaced with API calls
  const logEntries: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-08-23T10:30:15Z',
      level: 'info',
      source: 'auth',
      message: 'User admin logged in successfully',
      user: 'admin',
      ip_address: '192.168.1.100',
      session_id: 'sess_123456',
      details: 'Login successful from IP 192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2025-08-23T10:30:12Z',
      level: 'warning',
      source: 'security',
      message: 'Multiple failed login attempts detected',
      user: 'unknown',
      ip_address: '203.0.113.45',
      details: '15 failed attempts from IP 203.0.113.45 in last 5 minutes'
    },
    {
      id: '3',
      timestamp: '2025-08-23T10:29:58Z',
      level: 'info',
      source: 'vpn',
      message: 'VPN connection established',
      user: 'user1',
      ip_address: '192.168.1.101',
      session_id: 'sess_123457',
      details: 'OpenVPN connection established for user user1'
    },
    {
      id: '4',
      timestamp: '2025-08-23T10:29:45Z',
      level: 'error',
      source: 'security',
      message: 'Unauthorized access attempt',
      user: 'unknown',
      ip_address: '198.51.100.67',
      details: 'Access attempt to admin panel from unauthorized IP'
    },
    {
      id: '5',
      timestamp: '2025-08-23T10:29:30Z',
      level: 'info',
      source: 'system',
      message: 'System backup completed',
      user: 'system',
      details: 'Daily backup completed successfully'
    },
    {
      id: '6',
      timestamp: '2025-08-23T10:29:15Z',
      level: 'warning',
      source: 'system',
      message: 'High CPU usage detected',
      user: 'system',
      details: 'CPU usage at 85% on VPN server'
    },
    {
      id: '7',
      timestamp: '2025-08-23T10:29:00Z',
      level: 'info',
      source: 'database',
      message: 'Database query executed',
      user: 'admin',
      details: 'SELECT * FROM users WHERE status = \'active\' executed in 45ms'
    },
    {
      id: '8',
      timestamp: '2025-08-23T10:28:45Z',
      level: 'info',
      source: 'network',
      message: 'Network traffic spike detected',
      user: 'system',
      details: 'Network traffic increased by 150% in last 10 minutes'
    }
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'debug':
        return <Activity className="w-4 h-4 text-gray-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'debug':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'critical':
        return 'bg-red-600/10 text-red-700 border-red-600/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'system':
        return <Server className="w-4 h-4 text-blue-500" />;
      case 'auth':
        return <Key className="w-4 h-4 text-green-500" />;
      case 'vpn':
        return <Wifi className="w-4 h-4 text-purple-500" />;
      case 'database':
        return <Database className="w-4 h-4 text-orange-500" />;
      case 'security':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'network':
        return <Network className="w-4 h-4 text-cyan-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredLogs = logEntries.filter(log => {
    if (filters.level.length > 0 && !filters.level.includes(log.level)) return false;
    if (filters.source.length > 0 && !filters.source.includes(log.source)) return false;
    if (filters.searchTerm && !log.message.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    if (filters.user && log.user !== filters.user) return false;
    if (filters.ip_address && log.ip_address !== filters.ip_address) return false;
    return true;
  });

  const logStats = {
    total: logEntries.length,
    info: logEntries.filter(l => l.level === 'info').length,
    warning: logEntries.filter(l => l.level === 'warning').length,
    error: logEntries.filter(l => l.level === 'error').length,
    critical: logEntries.filter(l => l.level === 'critical').length
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">لاگ‌ها و گزارش‌ها</h1>
          <p className="text-muted-foreground">مشاهده و تحلیل لاگ‌های سیستم</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            دانلود لاگ‌ها
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'live'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          لاگ‌های زنده
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          جستجو
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          تحلیل
        </button>
        <button
          onClick={() => setActiveTab('archives')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'archives'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          آرشیو
        </button>
      </div>

      {/* Live Logs Tab */}
      {activeTab === 'live' && (
        <>
          {/* Log Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">کل لاگ‌ها</p>
                  <p className="text-2xl font-bold">{logStats.total}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">اطلاعات</p>
                  <p className="text-2xl font-bold text-blue-600">{logStats.info}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">هشدارها</p>
                  <p className="text-2xl font-bold text-yellow-600">{logStats.warning}</p>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">خطاها</p>
                  <p className="text-2xl font-bold text-red-600">{logStats.error}</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">بحرانی</p>
                  <p className="text-2xl font-bold text-red-700">{logStats.critical}</p>
                </div>
                <div className="p-2 bg-red-600/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="modern-card">
            <div className="p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">لاگ‌های زنده</h3>
                    <p className="text-sm text-muted-foreground">لاگ‌های سیستم در زمان واقعی</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  به‌روزرسانی
                </button>
              </div>
              
              <div className="space-y-3">
                {logEntries.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    {getLevelIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('fa-IR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSourceIcon(log.source)}
                          <span className="text-sm text-muted-foreground capitalize">{log.source}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mb-2">{log.message}</p>
                      {log.user && (
                        <p className="text-xs text-muted-foreground">کاربر: {log.user}</p>
                      )}
                      {log.ip_address && (
                        <p className="text-xs text-muted-foreground">IP: {log.ip_address}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">جستجو در لاگ‌ها</h3>
                  <p className="text-sm text-muted-foreground">جستجو و فیلتر لاگ‌ها</p>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">سطح لاگ</label>
                <select
                  multiple
                  value={filters.level}
                  onChange={(e) => setFilters({...filters, level: Array.from(e.target.selectedOptions, option => option.value)})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="info">اطلاعات</option>
                  <option value="warning">هشدار</option>
                  <option value="error">خطا</option>
                  <option value="debug">دیباگ</option>
                  <option value="critical">بحرانی</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">منبع</label>
                <select
                  multiple
                  value={filters.source}
                  onChange={(e) => setFilters({...filters, source: Array.from(e.target.selectedOptions, option => option.value)})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="system">سیستم</option>
                  <option value="auth">احراز هویت</option>
                  <option value="vpn">VPN</option>
                  <option value="database">پایگاه داده</option>
                  <option value="security">امنیت</option>
                  <option value="network">شبکه</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">از تاریخ</label>
                <input
                  type="datetime-local"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">تا تاریخ</label>
                <input
                  type="datetime-local"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="جستجو در پیام‌ها..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                جستجو
              </button>
            </div>
            
            {/* Search Results */}
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  {getLevelIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('fa-IR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSourceIcon(log.source)}
                        <span className="text-sm text-muted-foreground capitalize">{log.source}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2">{log.message}</p>
                    {log.user && (
                      <p className="text-xs text-muted-foreground">کاربر: {log.user}</p>
                    )}
                    {log.ip_address && (
                      <p className="text-xs text-muted-foreground">IP: {log.ip_address}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1 hover:bg-accent rounded transition-colors"
                    title="مشاهده جزئیات"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">تحلیل لاگ‌ها</h3>
                  <p className="text-sm text-muted-foreground">تحلیل و آمار لاگ‌ها</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Log Level Distribution */}
              <div className="p-6 border border-border rounded-lg">
                <h4 className="font-medium mb-4">توزیع سطح لاگ‌ها</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">اطلاعات</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(logStats.info / logStats.total) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{logStats.info}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">هشدارها</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(logStats.warning / logStats.total) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{logStats.warning}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">خطاها</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(logStats.error / logStats.total) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{logStats.error}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Distribution */}
              <div className="p-6 border border-border rounded-lg">
                <h4 className="font-medium mb-4">توزیع منابع</h4>
                <div className="space-y-3">
                  {['system', 'auth', 'vpn', 'database', 'security', 'network'].map((source) => {
                    const count = logEntries.filter(l => l.source === source).length;
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{source}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(count / logStats.total) * 100}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archives Tab */}
      {activeTab === 'archives' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Archive className="w-5 h-5 text-orange-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">آرشیو لاگ‌ها</h3>
                  <p className="text-sm text-muted-foreground">مدیریت فایل‌های آرشیو شده</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'logs_2025-08-23.zip', size: '45.2 MB', date: '2025-08-23T06:00:00Z' },
                { name: 'logs_2025-08-22.zip', size: '42.1 MB', date: '2025-08-22T06:00:00Z' },
                { name: 'logs_2025-08-21.zip', size: '38.7 MB', date: '2025-08-21T06:00:00Z' },
                { name: 'logs_2025-08-20.zip', size: '41.3 MB', date: '2025-08-20T06:00:00Z' }
              ].map((archive, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Archive className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">{archive.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(archive.date).toLocaleDateString('fa-IR')} • {archive.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded transition-colors" title="دانلود">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded transition-colors" title="مشاهده">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded transition-colors text-red-500" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modern-card w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">جزئیات لاگ</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getLevelIcon(selectedLog.level)}
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getLevelColor(selectedLog.level)}`}>
                  {selectedLog.level.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedLog.timestamp).toLocaleString('fa-IR')}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">پیام</h3>
                <p className="text-sm bg-accent p-3 rounded">{selectedLog.message}</p>
              </div>
              
              {selectedLog.details && (
                <div>
                  <h3 className="font-medium mb-2">جزئیات</h3>
                  <p className="text-sm bg-accent p-3 rounded">{selectedLog.details}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">منبع:</span>
                  <span className="ml-2 capitalize">{selectedLog.source}</span>
                </div>
                {selectedLog.user && (
                  <div>
                    <span className="text-muted-foreground">کاربر:</span>
                    <span className="ml-2">{selectedLog.user}</span>
                  </div>
                )}
                {selectedLog.ip_address && (
                  <div>
                    <span className="text-muted-foreground">آدرس IP:</span>
                    <span className="ml-2 font-mono">{selectedLog.ip_address}</span>
                  </div>
                )}
                {selectedLog.session_id && (
                  <div>
                    <span className="text-muted-foreground">شناسه جلسه:</span>
                    <span className="ml-2 font-mono">{selectedLog.session_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
