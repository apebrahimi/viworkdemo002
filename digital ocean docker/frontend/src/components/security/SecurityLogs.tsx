'use client';

import { 
  Activity, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

export function SecurityLogs() {
  const { language, isRTL } = useLanguage();

  return (
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
            <div>[2025-08-23 10:29:30] INFO: Firewall rule &quot;Block Suspicious IPs&quot; triggered for 203.0.113.45</div>
            <div>[2025-08-23 10:29:15] INFO: 2FA code generated for user manager1</div>
            <div>[2025-08-23 10:29:00] INFO: System backup completed successfully</div>
            <div>[2025-08-23 10:28:45] WARNING: High CPU usage detected on VPN server</div>
            <div>[2025-08-23 10:28:30] INFO: User session terminated for user user2</div>
            <div>[2025-08-23 10:28:15] INFO: SSL certificate renewed successfully</div>
          </div>
        </div>
      </div>
    </div>
  );
}
