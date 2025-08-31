'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SessionsTable } from '@/components/ui/DataTableNew';
import { Session } from '@/lib/types';
import { type SortField, type SortConfig } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { sessionsApi } from '@/lib/api-services';

const MonitoringSection = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'created_at', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const { language } = useLanguage();

  // Load sessions
  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Don't throw error to prevent logout
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // Refresh data every 30 seconds
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetails = (sessionId: string) => {
    console.log('View details for session:', sessionId);
    // TODO: Implement view details functionality
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await sessionsApi.revokeSession(sessionId);
      toast.success(language === 'fa' ? 'جلسه با موفقیت متوقف شد' : 'Session terminated successfully');
      loadSessions(); // Refresh the list
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error(language === 'fa' ? 'خطا در متوقف کردن جلسه' : 'Failed to terminate session');
    }
  };

  const handleExtendSession = async (sessionId: string) => {
    try {
      // TODO: Implement extend session API call
      console.log('Extend session:', sessionId);
      toast.success(language === 'fa' ? 'جلسه با موفقیت تمدید شد' : 'Session extended successfully');
      loadSessions(); // Refresh the list
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error(language === 'fa' ? 'خطا در تمدید جلسه' : 'Failed to extend session');
    }
  };

  const handleStatusFilterChange = (values: string[]) => {
    setStatusFilter(values);
  };

  // Filter data based on selected filters
  const filteredSessions = sessions.filter(session => {
    if (statusFilter.length === 0) return true;
    
    const isActive = !session.is_revoked && new Date(session.expires_at) > new Date();
    const isExpired = new Date(session.expires_at) <= new Date();
    const isRevoked = session.is_revoked;
    
    if (statusFilter.includes('active') && isActive) return true;
    if (statusFilter.includes('expired') && isExpired && !isRevoked) return true;
    if (statusFilter.includes('terminated') && isRevoked) return true;
    
    return false;
  });

  // Sort data based on sortConfig
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof Session];
    const bValue = b[sortConfig.field as keyof Session];
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {language === 'fa' ? 'نظارت بر جلسات' : 'Session Monitoring'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === 'fa' 
              ? 'مشاهده و مدیریت جلسات فعال کاربران' 
              : 'Monitor and manage active user sessions'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {language === 'fa' ? 'جلسات فعال:' : 'Active Sessions:'} {sessions.filter(s => !s.is_revoked && new Date(s.expires_at) > new Date()).length}
          </div>
        </div>
      </div>

      <SessionsTable
        sessions={sortedSessions}
        loading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onTerminate={handleTerminateSession}
        onExtend={handleExtendSession}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
};

export { MonitoringSection };
export default MonitoringSection;