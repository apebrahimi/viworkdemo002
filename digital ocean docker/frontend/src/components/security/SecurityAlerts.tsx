'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SecurityAlertsTable } from '@/components/ui/DataTableNew';
import { SecurityAlert } from '@/lib/types/security';
import { type SortField, type SortConfig } from '@/lib/utils';

interface SecurityAlertsProps {
  securityAlerts: SecurityAlert[];
}

export function SecurityAlerts({ securityAlerts }: SecurityAlertsProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'timestamp', direction: 'desc' });
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetails = (alertId: string) => {
    console.log('View details for alert:', alertId);
    // TODO: Implement view details functionality
  };

  const handleResolve = (alertId: string) => {
    console.log('Resolve alert:', alertId);
    // TODO: Implement resolve functionality
  };

  const handleDelete = (alertId: string) => {
    console.log('Delete alert:', alertId);
    // TODO: Implement delete functionality
  };

  const handleTypeFilterChange = (values: string[]) => {
    setTypeFilter(values);
  };

  const handleStatusFilterChange = (values: string[]) => {
    setStatusFilter(values);
  };

  // Filter data based on selected filters
  const filteredAlerts = securityAlerts.filter(alert => {
    const typeMatch = typeFilter.length === 0 || typeFilter.includes(alert.type);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(alert.status);
    return typeMatch && statusMatch;
  });

  // Sort data based on sortConfig
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof SecurityAlert];
    const bValue = b[sortConfig.field as keyof SecurityAlert];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <SecurityAlertsTable
      alerts={sortedAlerts}
      loading={loading}
      sortConfig={sortConfig}
      onSort={handleSort}
      onViewDetails={handleViewDetails}
      onResolve={handleResolve}
      onDelete={handleDelete}
      typeFilter={typeFilter}
      statusFilter={statusFilter}
      onTypeFilterChange={handleTypeFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
    />
  );
}
