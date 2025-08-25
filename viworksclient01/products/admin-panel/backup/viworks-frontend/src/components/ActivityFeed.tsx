'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Shield, 
  AlertTriangle, 
  User, 
  Server,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/lib/translations';

interface Activity {
  id: number;
  type: 'connection' | 'disconnection' | 'security' | 'system' | 'user' | 'server';
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
  details?: string;
}

export function ActivityFeed() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: 'connection',
      user: 'john.doe@company.com',
      action: t('connected', language),
      time: '2 دقیقه پیش',
      status: 'success',
      details: 'IP: 192.168.1.100 | Location: تهران'
    },
    {
      id: 2,
      type: 'security',
      user: t('system', language),
      action: t('securityAlert', language),
      time: '5 دقیقه پیش',
      status: 'warning',
      details: 'فعالیت مشکوک شناسایی شد'
    },
    {
      id: 3,
      type: 'disconnection',
      user: 'jane.smith@company.com',
      action: t('disconnected', language),
      time: '12 دقیقه پیش',
      status: 'info',
      details: 'قطع اتصال عادی'
    },
    {
      id: 4,
      type: 'server',
      user: 'server-01',
      action: 'Server maintenance completed',
      time: '15 دقیقه پیش',
      status: 'success',
      details: 'به‌روزرسانی امنیتی نصب شد'
    },
    {
      id: 5,
      type: 'user',
      user: 'admin@company.com',
      action: 'User permissions updated',
      time: '20 دقیقه پیش',
      status: 'info',
      details: 'دسترسی‌های کاربر تغییر یافت'
    }
  ]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'connection':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'disconnection':
        return <WifiOff className="w-4 h-4 text-yellow-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'server':
        return <Server className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="modern-card">
      <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-foreground">{t('recentActivity', language)}</h3>
            <p className="text-sm text-muted-foreground">فعالیت‌های اخیر سیستم</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`
                relative p-4 rounded-lg border ${getStatusColor(activity.status)}
                hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-all duration-200 group
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connection line */}
              {index < activities.length - 1 && (
                <div className="absolute top-12 left-6 w-0.5 h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
              )}

              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    {isRTL ? (
                      <>
                        {/* Time stamp - Left side in RTL */}
                        <div className="text-left text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                        {/* Content - Right side in RTL */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {activity.user}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.action}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-muted-foreground bg-white/5 dark:bg-white/5 light:bg-black/5 px-2 py-1 rounded">
                              {activity.details}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content - Left side in LTR */}
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {activity.user}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.action}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-muted-foreground bg-white/5 dark:bg-white/5 light:bg-black/5 px-2 py-1 rounded">
                              {activity.details}
                            </p>
                          )}
                        </div>
                        {/* Time stamp - Right side in LTR */}
                        <div className="text-right text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
          <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200 font-medium">
            {t('viewAllActivity', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
