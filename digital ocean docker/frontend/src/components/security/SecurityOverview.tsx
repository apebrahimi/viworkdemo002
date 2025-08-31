'use client';

import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  CheckCircle, 
  Clock,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { SecurityAlert } from '@/lib/types/security';
import { getAlertIcon, getAlertColor } from './SecurityUtils';

interface SecurityOverviewProps {
  securityAlerts: SecurityAlert[];
  securityIncidents: any[];
  firewallRules: any[];
}

export function SecurityOverview({ 
  securityAlerts, 
  securityIncidents, 
  firewallRules 
}: SecurityOverviewProps) {
  const { language, isRTL } = useLanguage();

  return (
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
  );
}
