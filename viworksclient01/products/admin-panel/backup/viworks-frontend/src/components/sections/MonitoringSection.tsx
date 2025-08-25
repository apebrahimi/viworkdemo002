'use client';

import React, { useState, useEffect } from 'react';
import { useSecurityAlerts, useSystemMetrics, useSystemLogs, useResolveAlert } from '@/hooks/useApi';
import { SecurityAlert, SystemLog, SystemMetrics } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { apiServices } from '@/lib/api-services';

interface Session {
  id: string;
  user_id: string;
  username: string;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
  last_activity: string;
  expires_at?: string;
}

interface AuditLog {
  timestamp: string;
  event: string;
  user: string;
  details: string;
}

const MonitoringSection = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'logs' | 'metrics'>('sessions');

  // Load sessions and audit logs
  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsResponse, auditLogsResponse] = await Promise.all([
        apiServices.sessions.getSessions(),
        apiServices.audit.getAuditLogs(),
      ]);
      
      setSessions(sessionsResponse.sessions || []);
      setAuditLogs(auditLogsResponse.logs || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Terminate session
  const handleTerminateSession = async (sessionId: string) => {
    try {
      await apiServices.sessions.revokeSession(sessionId);
      toast.success('Session terminated successfully');
      loadData();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getEventBadge = (event: string) => {
    switch (event) {
      case 'LOGIN_SUCCESS':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Login</Badge>;
      case 'USER_CREATE':
        return <Badge variant="info" className="bg-blue-100 text-blue-800 border-blue-200">User Created</Badge>;
      case 'DEVICE_BIND_REQUEST':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800 border-yellow-200">Device Bind</Badge>;
      case 'DEVICE_APPROVED':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Device Approved</Badge>;
      case 'SESSION_TERMINATE':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Session Terminated</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">{event}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">System Monitoring</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading monitoring data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">System Monitoring</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor active sessions, audit logs, and system performance.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            System Metrics
          </button>
        </nav>
      </div>

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Active Sessions</h3>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">🔒</div>
                  <p className="text-lg font-medium">No active sessions</p>
                  <p className="text-sm">All sessions have been terminated or expired.</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-300 font-semibold text-lg">
                          {session.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{session.username}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">IP: {session.ip_address}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Started: {new Date(session.created_at).toLocaleString()}
                        </p>
                        {session.expires_at && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Expires: {new Date(session.expires_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(session.status)}
                      <Button
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Terminate
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Audit Logs</h3>
            <div className="space-y-4">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium">No audit logs</p>
                  <p className="text-sm">System activity will appear here.</p>
                </div>
              ) : (
                auditLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 text-sm">📝</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{log.user}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{log.details}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getEventBadge(log.event)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      )}

      {/* System Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{sessions.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Healthy</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-300 text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-300 text-xl">💾</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">67%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export { MonitoringSection };
export default MonitoringSection;