'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FirewallRulesTable } from '@/components/ui/DataTableNew';
import { FirewallRule } from '@/lib/types/security';
import { type SortField, type SortConfig } from '@/lib/utils';

interface FirewallManagementProps {
  firewallRules: FirewallRule[];
}

export function FirewallManagement({ firewallRules }: FirewallManagementProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'priority', direction: 'asc' });
  const [actionFilter, setActionFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEdit = (ruleId: string) => {
    console.log('Edit rule:', ruleId);
    // TODO: Implement edit functionality
  };

  const handleToggle = (ruleId: string) => {
    console.log('Toggle rule:', ruleId);
    // TODO: Implement toggle functionality
  };

  const handleDelete = (ruleId: string) => {
    console.log('Delete rule:', ruleId);
    // TODO: Implement delete functionality
  };

  const handleActionFilterChange = (values: string[]) => {
    setActionFilter(values);
  };

  const handleStatusFilterChange = (values: string[]) => {
    setStatusFilter(values);
  };

  // Filter data based on selected filters
  const filteredRules = firewallRules.filter(rule => {
    const actionMatch = actionFilter.length === 0 || actionFilter.includes(rule.action);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(rule.enabled.toString());
    return actionMatch && statusMatch;
  });

  // Sort data based on sortConfig
  const sortedRules = [...filteredRules].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof FirewallRule];
    const bValue = b[sortConfig.field as keyof FirewallRule];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FirewallRulesTable
      rules={sortedRules}
      loading={loading}
      sortConfig={sortConfig}
      onSort={handleSort}
      onEdit={handleEdit}
      onToggle={handleToggle}
      onDelete={handleDelete}
      actionFilter={actionFilter}
      statusFilter={statusFilter}
      onActionFilterChange={handleActionFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
    />
  );
}
