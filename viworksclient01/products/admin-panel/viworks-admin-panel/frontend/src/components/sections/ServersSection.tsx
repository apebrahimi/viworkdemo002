'use client';

import { useState } from 'react';
import { 
  Server, 
  Wifi, 
  Globe, 
  Settings, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Edit,
  Eye,
  Download,
  Upload,
  Plus,
  Trash2,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Shield,
  Key,
  Lock,
  Unlock,
  Zap,
  Database,
  FileText,
  Monitor,
  Terminal
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface VpnServer {
  id: string;
  name: string;
  type: 'openvpn' | 'stunnel' | 'psa';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  ip_address: string;
  port: number;
  location: string;
  region: string;
  load: number;
  connections: number;
  max_connections: number;
  uptime: string;
  last_restart: string;
  ssl_enabled: boolean;
  encryption: string;
  protocol: string;
}

interface ServerConfig {
  id: string;
  server_id: string;
  config_type: 'openvpn' | 'stunnel' | 'psa';
  config_data: string;
  version: string;
  last_updated: string;
  is_active: boolean;
}

interface ServerMetric {
  id: string;
  server_id: string;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_in: number;
  network_out: number;
  disk_usage: number;
  active_connections: number;
}

export function ServersSection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'configs' | 'monitoring' | 'logs'>('overview');
  const [selectedServer, setSelectedServer] = useState<VpnServer | null>(null);

  // Mock data - will be replaced with API calls
  const vpnServers: VpnServer[] = [
    {
      id: '1',
      name: 'VPN-Server-01',
      type: 'openvpn',
      status: 'online',
      ip_address: '203.0.113.10',
      port: 1194,
      location: 'Tehran',
      region: 'Iran',
      load: 45,
      connections: 127,
      max_connections: 500,
      uptime: '15 days, 8 hours',
      last_restart: '2025-08-08T10:00:00Z',
      ssl_enabled: true,
      encryption: 'AES-256-GCM',
      protocol: 'UDP'
    },
    {
      id: '2',
      name: 'STunnel-Server-01',
      type: 'stunnel',
      status: 'online',
      ip_address: '203.0.113.11',
      port: 443,
      location: 'Tehran',
      region: 'Iran',
      load: 32,
      connections: 89,
      max_connections: 300,
      uptime: '12 days, 15 hours',
      last_restart: '2025-08-11T14:30:00Z',
      ssl_enabled: true,
      encryption: 'TLS 1.3',
      protocol: 'TCP'
    },
    {
      id: '3',
      name: 'PSA-Server-01',
      type: 'psa',
      status: 'maintenance',
      ip_address: '203.0.113.12',
      port: 8080,
      location: 'Tehran',
      region: 'Iran',
      load: 0,
      connections: 0,
      max_connections: 200,
      uptime: '0 days, 0 hours',
      last_restart: '2025-08-23T09:00:00Z',
      ssl_enabled: true,
      encryption: 'AES-256',
      protocol: 'TCP'
    }
  ];

  const serverConfigs: ServerConfig[] = [
    {
      id: '1',
      server_id: '1',
      config_type: 'openvpn',
      config_data: 'port 1194\nproto udp\ndev tun\nca ca.crt\ncert server.crt\nkey server.key\n...',
      version: '2.6.1',
      last_updated: '2025-08-20T16:00:00Z',
      is_active: true
    },
    {
      id: '2',
      server_id: '2',
      config_type: 'stunnel',
      config_data: 'pid = /var/run/stunnel.pid\n[openvpn]\naccept = 443\nconnect = 127.0.0.1:1194\n...',
      version: '5.67',
      last_updated: '2025-08-18T12:30:00Z',
      is_active: true
    }
  ];

  const serverMetrics: ServerMetric[] = [
    {
      id: '1',
      server_id: '1',
      timestamp: '2025-08-23T10:30:00Z',
      cpu_usage: 45,
      memory_usage: 67,
      network_in: 1250,
      network_out: 890,
      disk_usage: 23,
      active_connections: 127
    },
    {
      id: '2',
      server_id: '2',
      timestamp: '2025-08-23T10:30:00Z',
      cpu_usage: 32,
      memory_usage: 45,
      network_in: 890,
      network_out: 650,
      disk_usage: 18,
      active_connections: 89
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getServerTypeIcon = (type: string) => {
    switch (type) {
      case 'openvpn':
        return <Wifi className="w-4 h-4 text-blue-500" />;
      case 'stunnel':
        return <Globe className="w-4 h-4 text-green-500" />;
      case 'psa':
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return 'text-green-600';
    if (load < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">مدیریت سرورها</h1>
          <p className="text-muted-foreground">مدیریت سرورهای VPN و نظارت بر عملکرد</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            افزودن سرور
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
          نمای کلی
        </button>
        <button
          onClick={() => setActiveTab('servers')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'servers'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          سرورها
        </button>
        <button
          onClick={() => setActiveTab('configs')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'configs'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          پیکربندی‌ها
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'monitoring'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          نظارت
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          لاگ‌ها
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Server Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">کل سرورها</p>
                  <p className="text-2xl font-bold">{vpnServers.length}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Server className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">آنلاین</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vpnServers.filter(s => s.status === 'online').length}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">اتصالات فعال</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {vpnServers.reduce((sum, server) => sum + server.connections, 0)}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">میانگین بار</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(vpnServers.reduce((sum, server) => sum + server.load, 0) / vpnServers.length)}%
                  </p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Server Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Server Status */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Server className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">وضعیت سرورها</h3>
                    <p className="text-sm text-muted-foreground">نمای کلی سرورهای VPN</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {vpnServers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getServerTypeIcon(server.type)}
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-sm text-muted-foreground">{server.ip_address}:{server.port}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(server.status)}`}>
                        {getStatusIcon(server.status)}
                        {server.status === 'online' ? 'آنلاین' : server.status === 'offline' ? 'آفلاین' : server.status === 'maintenance' ? 'تعمیر' : 'خطا'}
                      </span>
                      <span className={`text-sm font-medium ${getLoadColor(server.load)}`}>
                        {server.load}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">معیارهای عملکرد</h3>
                    <p className="text-sm text-muted-foreground">آمار عملکرد سرورها</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {serverMetrics.map((metric) => {
                  const server = vpnServers.find(s => s.id === metric.server_id);
                  return (
                    <div key={metric.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{server?.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(metric.timestamp).toLocaleString('fa-IR')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-500" />
                          <span>CPU: {metric.cpu_usage}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MemoryStick className="w-4 h-4 text-green-500" />
                          <span>RAM: {metric.memory_usage}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Network className="w-4 h-4 text-purple-500" />
                          <span>شبکه: {metric.network_in} MB/s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>اتصالات: {metric.active_connections}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Servers Tab */}
      {activeTab === 'servers' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">سرورهای VPN</h3>
                  <p className="text-sm text-muted-foreground">مدیریت سرورهای VPN</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vpnServers.map((server) => (
                <div key={server.id} className="p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getServerTypeIcon(server.type)}
                      <div>
                        <h4 className="font-medium">{server.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{server.type}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(server.status)}`}>
                      {getStatusIcon(server.status)}
                      {server.status === 'online' ? 'آنلاین' : server.status === 'offline' ? 'آفلاین' : server.status === 'maintenance' ? 'تعمیر' : 'خطا'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">آدرس IP:</span>
                      <span className="font-mono">{server.ip_address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">پورت:</span>
                      <span>{server.port}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">مکان:</span>
                      <span>{server.location}, {server.region}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">اتصالات:</span>
                      <span>{server.connections}/{server.max_connections}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">بار:</span>
                      <span className={`font-medium ${getLoadColor(server.load)}`}>{server.load}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">زمان کار:</span>
                      <span>{server.uptime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="مشاهده جزئیات">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="تنظیمات">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="راه‌اندازی مجدد">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="توقف">
                      <Pause className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configs Tab */}
      {activeTab === 'configs' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">پیکربندی‌ها</h3>
                  <p className="text-sm text-muted-foreground">مدیریت فایل‌های پیکربندی سرور</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                افزودن پیکربندی
              </button>
            </div>
            
            <div className="space-y-4">
              {serverConfigs.map((config) => {
                const server = vpnServers.find(s => s.id === config.server_id);
                return (
                  <div key={config.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{server?.name} - {config.config_type.toUpperCase()}</h4>
                        <p className="text-sm text-muted-foreground">نسخه {config.version}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                          config.is_active 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                        }`}>
                          {config.is_active ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black text-green-400 p-3 rounded font-mono text-xs mb-4 max-h-32 overflow-y-auto">
                      <pre>{config.config_data}</pre>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>آخرین به‌روزرسانی: {new Date(config.last_updated).toLocaleString('fa-IR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <Edit className="w-4 h-4" />
                        ویرایش
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <Download className="w-4 h-4" />
                        دانلود
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        آپلود
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Monitor className="w-5 h-5 text-green-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">نظارت بر سرورها</h3>
                  <p className="text-sm text-muted-foreground">نظارت بر عملکرد سرورها</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {serverMetrics.map((metric) => {
                const server = vpnServers.find(s => s.id === metric.server_id);
                return (
                  <div key={metric.id} className="p-6 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-medium">{server?.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">CPU</span>
                          <span className="text-sm font-medium">{metric.cpu_usage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${metric.cpu_usage > 70 ? 'bg-red-500' : metric.cpu_usage > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${metric.cpu_usage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">RAM</span>
                          <span className="text-sm font-medium">{metric.memory_usage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${metric.memory_usage > 80 ? 'bg-red-500' : metric.memory_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${metric.memory_usage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">شبکه (ورودی)</span>
                          <span className="text-sm font-medium">{metric.network_in} MB/s</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(metric.network_in / 10, 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">اتصالات فعال</span>
                          <span className="text-sm font-medium">{metric.active_connections}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-purple-500" style={{ width: `${(metric.active_connections / 500) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Terminal className="w-5 h-5 text-orange-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">لاگ‌های سرور</h3>
                  <p className="text-sm text-muted-foreground">مشاهده لاگ‌های سرورهای VPN</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <Download className="w-4 h-4" />
                  دانلود
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  به‌روزرسانی
                </button>
              </div>
            </div>
            
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              <div className="space-y-1">
                <div>[2025-08-23 10:30:15] INFO: VPN-Server-01: Client connected from 192.168.1.100</div>
                <div>[2025-08-23 10:30:12] INFO: STunnel-Server-01: SSL handshake completed</div>
                <div>[2025-08-23 10:29:58] WARNING: VPN-Server-01: High CPU usage detected (85%)</div>
                <div>[2025-08-23 10:29:45] INFO: PSA-Server-01: Authentication successful for user admin</div>
                <div>[2025-08-23 10:29:30] ERROR: VPN-Server-01: Connection timeout from 203.0.113.45</div>
                <div>[2025-08-23 10:29:15] INFO: STunnel-Server-01: Certificate renewed successfully</div>
                <div>[2025-08-23 10:29:00] INFO: VPN-Server-01: Server restart completed</div>
                <div>[2025-08-23 10:28:45] WARNING: PSA-Server-01: Memory usage at 75%</div>
                <div>[2025-08-23 10:28:30] INFO: VPN-Server-01: Client disconnected from 192.168.1.101</div>
                <div>[2025-08-23 10:28:15] INFO: STunnel-Server-01: New configuration loaded</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
