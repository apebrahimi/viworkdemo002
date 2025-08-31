'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SecurityIncidentsTable } from '@/components/ui/DataTableNew';
import { SecurityIncident } from '@/lib/types/security';
import { type SortField, type SortConfig } from '@/lib/utils';

interface SecurityIncidentsProps {
  securityIncidents: SecurityIncident[];
}

export function SecurityIncidents({ securityIncidents }: SecurityIncidentsProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'timestamp', direction: 'desc' });
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetails = (incidentId: string) => {
    console.log('View details for incident:', incidentId);
    // TODO: Implement view details functionality
  };

  const handleInvestigate = (incidentId: string) => {
    console.log('Investigate incident:', incidentId);
    // TODO: Implement investigate functionality
  };

  const handleResolve = (incidentId: string) => {
    console.log('Resolve incident:', incidentId);
    // TODO: Implement resolve functionality
  };

  const handleDelete = (incidentId: string) => {
    console.log('Delete incident:', incidentId);
    // TODO: Implement delete functionality
  };

  const handleSeverityFilterChange = (values: string[]) => {
    setSeverityFilter(values);
  };

  const handleStatusFilterChange = (values: string[]) => {
    setStatusFilter(values);
  };

  // Filter data based on selected filters
  const filteredIncidents = securityIncidents.filter(incident => {
    const severityMatch = severityFilter.length === 0 || severityFilter.includes(incident.severity);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(incident.status);
    return severityMatch && statusMatch;
  });

  // Sort data based on sortConfig
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof SecurityIncident];
    const bValue = b[sortConfig.field as keyof SecurityIncident];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <SecurityIncidentsTable
      incidents={sortedIncidents}
      loading={loading}
      sortConfig={sortConfig}
      onSort={handleSort}
      onViewDetails={handleViewDetails}
      onInvestigate={handleInvestigate}
      onResolve={handleResolve}
      onDelete={handleDelete}
      severityFilter={severityFilter}
      statusFilter={statusFilter}
      onSeverityFilterChange={handleSeverityFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
    />
  );
}
