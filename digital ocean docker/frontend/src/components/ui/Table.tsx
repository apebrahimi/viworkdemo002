'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Table Container
interface TableContainerProps {
  children: ReactNode;
  backgroundLogo?: string;
  backgroundLogoAlt?: string;
  className?: string;
}

export function TableContainer({ children, backgroundLogo, backgroundLogoAlt, className = '' }: TableContainerProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden relative flex-1 min-h-0 ${className}`}>
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

// Table Component
interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`w-full text-sm ${className}`}>
      {children}
    </table>
  );
}

// Table Header
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-muted/30 border-b border-border ${className}`}>
      {children}
    </thead>
  );
}

// Table Header Row
interface TableHeaderRowProps {
  children: ReactNode;
  className?: string;
}

export function TableHeaderRow({ children, className = '' }: TableHeaderRowProps) {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
}

// Table Header Cell
interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
}

type Align = 'center' | 'start' | 'end';

function alignClasses(a: Align | undefined) {
  switch (a) {
    case 'center': return 'th-center';
    case 'end':    return 'th-end';
    default:       return 'th-start';
  }
}

export function TableHeaderCell({ 
  children, 
  className = '', 
  onClick, 
  sortable = false,
  sortDirection = null,
  column
}: TableHeaderCellProps & { column?: any }) {
  const { language } = useLanguage();
  
  const a = column?.meta?.align as Align | undefined;
  const baseClasses = "p-2.5 font-medium text-foreground whitespace-nowrap";
  const sortableClasses = sortable ? "cursor-pointer hover:text-primary transition-colors" : "";
  const combinedClasses = `${baseClasses} ${alignClasses(a)} ${sortableClasses} ${className}`;

  if (onClick) {
    return (
      <th className={combinedClasses} onClick={onClick}>
        <div className="th-inner flex items-center gap-2">
          {children}
        </div>
      </th>
    );
  }

  return (
    <th className={combinedClasses}>
      <div className="th-inner">
        {children}
      </div>
    </th>
  );
}

// Table Body
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`overflow-y-auto ${className}`}>
      {children}
    </tbody>
  );
}

// Table Row
interface TableRowProps {
  children: ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function TableRow({ 
  children, 
  index = 0, 
  className = '', 
  onClick,
  hoverable = true 
}: TableRowProps) {
  const baseClasses = "border-b border-border/50 transition-colors";
  const hoverClasses = hoverable ? "hover:bg-muted/30" : "";
  const alternatingClasses = index % 2 === 0 ? 'bg-background' : 'bg-muted/20';
  const clickableClasses = onClick ? "cursor-pointer" : "";
  const combinedClasses = `${baseClasses} ${hoverClasses} ${alternatingClasses} ${clickableClasses} ${className}`;

  return (
    <tr className={combinedClasses} onClick={onClick}>
      {children}
    </tr>
  );
}

// Table Cell
interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = '', column }: TableCellProps & { column?: any }) {
  const a = column?.meta?.align as Align | undefined;
  const baseClasses = "p-2.5 text-sm text-foreground";
  const combinedClasses = `${baseClasses} ${a === 'center' ? 'td-center' : a === 'end' ? 'td-end' : 'td-start'} ${className}`;
  
  return (
    <td className={combinedClasses}>
      <div className="td-inner">
        {children}
      </div>
    </td>
  );
}

// Empty State
interface TableEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  colSpan: number;
}

export function TableEmptyState({ icon, title, description, colSpan }: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 text-muted-foreground">
            {icon}
          </div>
          <p className="text-sm font-medium text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </td>
    </tr>
  );
}

// Loading State
interface TableLoadingStateProps {
  colSpan: number;
  message?: string;
}

export function TableLoadingState({ colSpan, message = 'Loading...' }: TableLoadingStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
      </td>
    </tr>
  );
}

// Results Summary
interface TableResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

export function TableResultsSummary({ 
  filteredCount, 
  totalCount, 
  sortField, 
  sortDirection, 
  className = '' 
}: TableResultsSummaryProps) {
  const { language } = useLanguage();

  return (
    <div className={`flex items-center justify-between text-xs text-muted-foreground ${className}`}>
      <span>
        {language === 'fa' 
          ? `${filteredCount} از ${totalCount} مورد`
          : `${filteredCount} of ${totalCount} items`
        }
      </span>
      {sortField && (
        <span>
          {language === 'fa'
            ? `مرتب‌سازی: ${sortField} (${sortDirection === 'asc' ? 'صعودی' : 'نزولی'})`
            : `Sorted: ${sortField} (${sortDirection})`
          }
        </span>
      )}
    </div>
  );
}
