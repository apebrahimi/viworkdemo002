'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  description: string;
  searchBar?: ReactNode;
  stats?: ReactNode;
  actions?: ReactNode;
  activeFilters?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  searchBar, 
  stats, 
  actions, 
  activeFilters 
}: PageHeaderProps) {
  const { isRTL } = useLanguage();

  return (
    <div className="flex items-center justify-between flex-shrink-0 mb-4">
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          
          {/* Search Bar */}
          {searchBar && (
            <div className="relative max-w-md">
              {searchBar}
            </div>
          )}
          
          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-3 text-xs">
              {stats}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Active Filters */}
        {activeFilters}
        
        {/* Actions */}
        {actions}
      </div>
    </div>
  );
}
