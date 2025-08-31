'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface SecurityTabNavigationProps {
  activeTab: 'overview' | 'alerts' | 'incidents' | 'firewall' | 'logs';
  onTabChange: (tab: 'overview' | 'alerts' | 'incidents' | 'firewall' | 'logs') => void;
}

export function SecurityTabNavigation({ activeTab, onTabChange }: SecurityTabNavigationProps) {
  const { language } = useLanguage();

  const tabs = [
    { id: 'overview', label: t('overview', language) },
    { id: 'alerts', label: t('alerts', language) },
    { id: 'incidents', label: t('incidents', language) },
    { id: 'firewall', label: t('firewall', language) },
    { id: 'logs', label: t('logs', language) }
  ] as const;

  return (
    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
