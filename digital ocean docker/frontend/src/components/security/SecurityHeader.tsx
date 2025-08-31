'use client';

import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface SecurityHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function SecurityHeader({ onRefresh, isLoading }: SecurityHeaderProps) {
  const { language, isRTL } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h1 className="text-2xl font-bold text-foreground">{t('security', language)}</h1>
        <p className="text-muted-foreground">{t('securityDesc', language)}</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh', language)}
        </button>
      </div>
    </div>
  );
}
