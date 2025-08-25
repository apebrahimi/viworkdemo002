'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors`}
      title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'fa' ? 'EN' : 'فا'}</span>
    </button>
  );
}
