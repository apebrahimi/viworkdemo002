'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DataTableProps {
  children: ReactNode;
  backgroundLogo?: string;
  backgroundLogoAlt?: string;
}

export function DataTable({ children, backgroundLogo, backgroundLogoAlt }: DataTableProps) {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden relative flex-1 min-h-0">
      {/* Background Logo */}
      {backgroundLogo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img 
            src={backgroundLogo} 
            alt={backgroundLogoAlt || "Background Logo"} 
            className="w-64 h-64 object-contain opacity-10"
          />
        </div>
      )}
      
      {/* Table Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="overflow-x-auto flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
