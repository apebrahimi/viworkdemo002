import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { type SortField, type SortConfig } from '@/lib/utils';

interface SortIconProps {
  field: SortField;
  sortConfig: SortConfig;
}

export function SortIcon({ field, sortConfig }: SortIconProps) {
  if (sortConfig.field !== field) {
    return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
  }
  return sortConfig.direction === 'asc' 
    ? <ArrowUp className="w-3 h-3 text-primary" />
    : <ArrowDown className="w-3 h-3 text-primary" />;
}
