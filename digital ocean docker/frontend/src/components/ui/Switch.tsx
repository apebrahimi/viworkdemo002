import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, disabled = false, className = '' }: SwitchProps) {
  const { language } = useLanguage();
  const isRTL = language === 'fa';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked 
            ? (isRTL ? '-translate-x-6' : 'translate-x-6') 
            : (isRTL ? '-translate-x-1' : 'translate-x-1')
          }
        `}
      />
    </button>
  );
}
