'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, 
  Users, 
  Activity, 
  Shield, 
  BarChart3, 
  AlertTriangle,
  Globe,
  Zap,
  TrendingUp,
  Cpu,
  HardDrive,
  Network,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Monitor,
  Server
} from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface DemoStats {
  activeClients: number;
  totalUsers: number;
  securityAlerts: number;
  vpnServers: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  recentActivity: Array<{
    id: string;
    type: 'login' | 'vpn_connect' | 'security_alert' | 'user_created' | 'container_spawned';
    message: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export function DemoDashboardSection() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DemoStats>({
    activeClients: 0,
    totalUsers: 0,
    securityAlerts: 0,
    vpnServers: 1,
    systemHealth: 'healthy',
    recentActivity: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        // Test backend health
        const healthResponse = await fetch('/health');
        const healthData = await healthResponse.json();
        
        // Generate demo activity with Persian messages
        const demoActivity = [
          {
            id: '1',
            type: 'login' as const,
            message: language === 'fa' ? 'کاربر "demo" با موفقیت وارد شد' : 'User "demo" logged in successfully',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            status: 'success' as const
          },
          {
            id: '2',
            type: 'vpn_connect' as const,
            message: language === 'fa' ? 'اتصال VPN از آدرس 192.168.1.100 برقرار شد' : 'VPN connection established from 192.168.1.100',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            status: 'success' as const
          },
          {
            id: '3',
            type: 'container_spawned' as const,
            message: language === 'fa' ? 'کانتینر Firefox برای کاربر demo_user ایجاد شد' : 'Firefox container spawned for user demo_user',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            status: 'success' as const
          },
          {
            id: '4',
            type: 'security_alert' as const,
            message: language === 'fa' ? 'تلاش مشکوک ورود از IP ناشناس' : 'Suspicious login attempt from unknown IP',
            timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            status: 'warning' as const
          }
        ];

        setStats({
          activeClients: healthData.status === 'healthy' ? 3 : 0,
          totalUsers: 12,
          securityAlerts: 1,
          vpnServers: 1,
          systemHealth: healthData.status === 'healthy' ? 'healthy' : 'error',
          recentActivity: demoActivity
        });
      } catch (error) {
        console.error('Failed to fetch demo data:', error);
        setStats({
          activeClients: 0,
          totalUsers: 0,
          securityAlerts: 1,
          vpnServers: 1,
          systemHealth: 'error',
          recentActivity: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoData();
    
    // Update data every 30 seconds
    const interval = setInterval(fetchDemoData, 30000);
    return () => clearInterval(interval);
  }, [language]);

  const statsCards = [
    {
      title: t('activeClients', language),
      value: stats.activeClients.toString(),
      icon: Wifi,
      change: '+2',
      changeType: stats.activeClients > 0 ? 'positive' as const : 'neutral' as const,
      gradient: 'success' as const,
      trend: 'up' as const
    },
    {
      title: t('vpnServers', language),
      value: stats.vpnServers.toString(),
      icon: Server,
      change: language === 'fa' ? 'آنلاین' : 'Online',
      changeType: 'positive' as const,
      gradient: 'primary' as const,
      trend: 'up' as const
    },
    {
      title: t('securityAlerts', language),
      value: stats.securityAlerts.toString(),
      icon: AlertTriangle,
      change: language === 'fa' ? '1 فعال' : '1 Active',
      changeType: stats.securityAlerts > 0 ? 'negative' as const : 'positive' as const,
      gradient: 'warning' as const,
      trend: stats.securityAlerts > 0 ? 'up' as const : 'down' as const
    },
    {
      title: t('totalUsers', language),
      value: stats.totalUsers.toString(),
      icon: Users,
      change: '+3',
      changeType: 'positive' as const,
      gradient: 'primary' as const,
      trend: 'up' as const
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <Shield className="w-4 h-4" />;
      case 'vpn_connect': return <Wifi className="w-4 h-4" />;
      case 'container_spawned': return <Monitor className="w-4 h-4" />;
      case 'security_alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'fa' ? 'در حال بارگذاری داشبورد...' : 'Loading demo dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="modern-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 animate-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {language === 'fa' ? 'داشبورد ViWorkS' : 'ViWorkS Demo Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'fa' ? 'رابط نظارت و مدیریت در زمان واقعی' : 'Real-time monitoring and management interface'}
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {stats.systemHealth === 'healthy' 
              ? (language === 'fa' 
                  ? '✅ سیستم به طور کامل در حال اجرا است! تمام سرویس‌ها فعال و امنیت در بالاترین سطح است.'
                  : '✅ System is running perfectly! All services are operational and security is at maximum level.')
              : (language === 'fa'
                  ? '⚠️ سیستم نیاز به توجه دارد. لطفاً وضعیت سرویس‌ها را بررسی کنید.'
                  : '⚠️ System needs attention. Please check service status.')
            }
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="lg:col-span-2">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {language === 'fa' ? 'وضعیت سیستم' : 'System Status'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fa' ? 'وضعیت عملیاتی فعلی' : 'Current operational status'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-muted-foreground">CPU</span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">45%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <HardDrive className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {language === 'fa' ? 'حافظه' : 'Memory'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">67%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '67%' }} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Network className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {language === 'fa' ? 'شبکه' : 'Network'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">23%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Server className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {language === 'fa' ? 'ذخیره‌سازی' : 'Storage'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">34%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('recentActivity', language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fa' ? 'آخرین رویدادهای سیستم' : 'Latest system events'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`p-1 rounded ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Actions */}
      <div className="modern-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'fa' ? 'عملیات آزمایشی' : 'Demo Actions'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'fa' ? 'تست عملکرد سیستم' : 'Test the system functionality'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/v1/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: 'demo', password: 'demo' })
                });
                const data = await response.json();
                // eslint-disable-next-line no-console
                console.log(`Login test: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(`Login test failed: ${error}`);
              }
            }}
            className="group p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {language === 'fa' ? 'تست ورود' : 'Test Login'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'تأیید احراز هویت' : 'Verify authentication'}
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/v1/agent/container/spawn', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: 'demo_user', session_id: 'demo_session' })
                });
                const data = await response.json();
                // eslint-disable-next-line no-console
                console.log(`Container spawn test: ${data.container_id ? 'SUCCESS' : 'FAILED'}\nContainer ID: ${data.container_id}`);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(`Container spawn test failed: ${error}`);
              }
            }}
            className="group p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <Monitor className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {language === 'fa' ? 'ایجاد کانتینر' : 'Spawn Container'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'تست ایجاد کانتینر' : 'Test container creation'}
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={async () => {
              try {
                const response = await fetch('/health');
                const data = await response.json();
                // eslint-disable-next-line no-console
                console.log(`Health check: ${data.status}\nMessage: ${data.message}`);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(`Health check failed: ${error}`);
              }
            }}
            className="group p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {language === 'fa' ? 'بررسی سلامت' : 'Health Check'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'تأیید وضعیت سیستم' : 'Verify system status'}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
