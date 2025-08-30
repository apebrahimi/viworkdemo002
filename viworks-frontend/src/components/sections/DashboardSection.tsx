'use client';

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
  Network
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/lib/translations';
import { StatsCard } from '@/components/StatsCard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useHealth, useClients, useUsers, useSecurityAlerts, useSystemMetrics } from '@/hooks/useApi';

export function DashboardSection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  // API hooks
  const { data: healthData } = useHealth();
  const { data: clientsData } = useClients();
  const { data: usersData } = useUsers();
  const { data: alertsData } = useSecurityAlerts();
  const { data: metricsData } = useSystemMetrics();

  // Calculate real stats from API data
  const activeClients = clientsData?.clients?.filter(client => client.status === 'online').length || 0;
  const totalClients = clientsData?.clients?.length || 0;
  const totalUsers = usersData?.users?.length || 0;
  const unresolvedAlerts = alertsData?.alerts?.filter(alert => !alert.is_resolved).length || 0;
  const totalAlerts = alertsData?.alerts?.length || 0;

  const stats = [
    {
      title: t('activeClients', language),
      value: activeClients.toString(),
      icon: Wifi,
      change: `${totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%`,
      changeType: activeClients > 0 ? 'positive' as const : 'neutral' as const,
      gradient: 'success' as const,
      trend: 'up' as const
    },
    {
      title: t('vpnServers', language),
      value: '8', // TODO: Add VPN servers API
      icon: Globe,
      change: '+2',
      changeType: 'positive' as const,
      gradient: 'primary' as const,
      trend: 'up' as const
    },
    {
      title: t('securityAlerts', language),
      value: unresolvedAlerts.toString(),
      icon: AlertTriangle,
      change: totalAlerts > 0 ? `${Math.round((unresolvedAlerts / totalAlerts) * 100)}%` : '0%',
      changeType: unresolvedAlerts > 0 ? 'negative' as const : 'positive' as const,
      gradient: 'warning' as const,
      trend: unresolvedAlerts > 0 ? 'up' as const : 'down' as const
    },
    {
      title: t('totalUsers', language),
      value: totalUsers.toString(),
      icon: Users,
      change: '+8%', // TODO: Calculate real change
      changeType: 'positive' as const,
      gradient: 'primary' as const,
      trend: 'up' as const
    },
  ];

  const systemMetrics = [
    { name: 'CPU Usage', value: metricsData?.cpu_usage || '45%', icon: Cpu, color: 'text-blue-400' },
    { name: 'Memory', value: metricsData?.memory_usage || '67%', icon: HardDrive, color: 'text-green-400' },
    { name: 'Network', value: metricsData?.network_usage || '23%', icon: Network, color: 'text-purple-400' },
    { name: 'Storage', value: metricsData?.storage_usage || '34%', icon: HardDrive, color: 'text-orange-400' },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="modern-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent"></div>
        <div className="relative z-10">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''} mb-4`}>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 animate-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-bold gradient-text">خوش آمدید به ViWorkS</h1>
              <p className="text-muted-foreground">پنل مدیریت پیشرفته برای سیستم VPN سازمانی</p>
            </div>
          </div>
          <p className={`text-lg text-muted-foreground max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            {healthData?.status === 'healthy' 
              ? 'سیستم شما در حال حاضر در وضعیت عالی قرار دارد. تمام سرویس‌ها فعال و امنیت در بالاترین سطح است.'
              : 'سیستم شما نیاز به توجه دارد. لطفاً وضعیت سرویس‌ها را بررسی کنید.'
            }
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Metrics */}
        <div className="lg:col-span-2">
          <div className="modern-card p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">معیارهای سیستم</h3>
                  <p className="text-sm text-muted-foreground">وضعیت فعلی منابع</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {systemMetrics.map((metric, index) => (
                <div
                  key={metric.name}
                  className="p-4 rounded-lg bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} mb-3`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    <span className={`text-sm font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{metric.name}</span>
                  </div>
                  <div className={`text-2xl font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{metric.value}</div>
                  <div className="w-full bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 group-hover:shadow-lg"
                      style={{ width: metric.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-semibold text-foreground">{t('quickActions', language)}</h3>
              <p className="text-sm text-muted-foreground">دسترسی سریع به عملکردهای مهم</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Wifi className="w-5 h-5 text-blue-400" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-foreground">{t('viewAllClients', language)}</p>
                <p className="text-sm text-muted-foreground">مدیریت کلاینت‌ها</p>
              </div>
            </div>
          </button>

          <button className="group p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-200">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-foreground">{t('manageUsers', language)}</p>
                <p className="text-sm text-muted-foreground">مدیریت کاربران</p>
              </div>
            </div>
          </button>

          <button className="group p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-foreground">{t('viewLogs', language)}</p>
                <p className="text-sm text-muted-foreground">مشاهده لاگ‌ها</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
