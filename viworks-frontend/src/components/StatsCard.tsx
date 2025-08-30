'use client';

import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  gradient?: 'primary' | 'success' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  gradient = 'primary',
  trend = 'stable'
}: StatsCardProps) {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();

  const gradients = {
    primary: 'from-blue-500 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    danger: 'from-red-500 to-pink-600'
  };

  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-muted-foreground'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→'
  };

  return (
    <div className="modern-card p-6 group hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        {isRTL ? (
          <>
            {/* Badge/Change - Left side in RTL */}
            {change && (
              <div className="text-left">
                <div className="flex flex-row-reverse items-center space-x-reverse space-x-1">
                  <span className="text-lg">{trendIcons[trend]}</span>
                  <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                    {change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">از ماه گذشته</p>
              </div>
            )}
            {/* Icon + Name - Right side in RTL */}
            <div className="flex items-center">
              <div className={`
                p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} 
                shadow-lg group-hover:shadow-xl transition-all duration-300
                group-hover:scale-110 ml-3
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Icon + Name - Left side in LTR */}
            <div className="flex items-center">
              <div className={`
                p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} 
                shadow-lg group-hover:shadow-xl transition-all duration-300
                group-hover:scale-110 mr-3
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
            </div>
            {/* Badge/Change - Right side in LTR */}
            {change && (
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                    {change}
                  </span>
                  <span className="text-lg">{trendIcons[trend]}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-left">از ماه گذشته</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 dark:from-white/5 light:from-black/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />
    </div>
  );
}
