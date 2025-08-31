import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApiWrapper';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface Device {
  id: string;
  device_id: string;
  model: string;
  os: string;
  app_version: string;
  manufacturer?: string;
  device_name?: string;
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
}

interface DeviceListResponse {
  success: boolean;
  devices: Device[];
}

export const DeviceManagementSection: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const { language } = useLanguage();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall<DeviceListResponse>(() => 
        api.get('/api/v1/auth/devices')
      );
      
      if (response.success) {
        setDevices(response.devices);
      } else {
        setError('Failed to fetch devices');
      }
    } catch (err) {
      setError('Error fetching devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDeactivateDevice = async (deviceId: string) => {
    try {
      await apiCall(() => 
        api.post(`/api/v1/auth/devices/${deviceId}/deactivate`)
      );
      fetchDevices(); // Refresh the list
    } catch (err) {
      console.error('Error deactivating device:', err);
    }
  };

  const handleActivateDevice = async (deviceId: string) => {
    try {
      await apiCall(() => 
        api.post(`/api/v1/auth/devices/${deviceId}/activate`)
      );
      fetchDevices(); // Refresh the list
    } catch (err) {
      console.error('Error activating device:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">فعال</Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700">غیرفعال</Badge>
    );
  };

  const getOSIcon = (os: string) => {
    const osLower = os.toLowerCase();
    if (osLower.includes('android')) return '📱';
    if (osLower.includes('ios')) return '📱';
    if (osLower.includes('macos') || osLower.includes('mac')) return '💻';
    if (osLower.includes('windows')) return '🖥️';
    if (osLower.includes('linux')) return '🐧';
    return '🖥️';
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{t('deviceManagement', language)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-muted-foreground">Loading devices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">{t('deviceManagement', language)}</CardTitle>
          <Button onClick={fetchDevices} variant="outline" size="sm">
            🔄 {t('refresh', language)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {devices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('noDevicesRegistered', language)}</p>
            <p className="text-sm">{t('devicesWillAppear', language)}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <Card key={device.id} className="hover:shadow-md transition-shadow bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getOSIcon(device.os)}</span>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">
                            {device.device_name || device.model}
                          </h3>
                          <p className="text-xs text-muted-foreground">{device.manufacturer}</p>
                        </div>
                      </div>
                      {getStatusBadge(device.is_active)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('deviceId', language)}:</span>
                        <span className="font-mono text-xs text-foreground">{device.device_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('os', language)}:</span>
                        <span className="text-foreground">{device.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('appVersion', language)}:</span>
                        <span className="text-foreground">{device.app_version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('created', language)}:</span>
                        <span className="text-xs text-foreground">{formatDate(device.created_at)}</span>
                      </div>
                      {device.last_used_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('lastUsed', language)}:</span>
                          <span className="text-xs text-foreground">{formatDate(device.last_used_at)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      {device.is_active ? (
                        <Button
                          onClick={() => handleDeactivateDevice(device.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {t('deactivate', language)}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivateDevice(device.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {t('activate', language)}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // TODO: Implement device details view
                          console.log('View device details:', device);
                        }}
                      >
                        {t('details', language)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 text-foreground">📊 {t('deviceStatistics', language)}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('totalDevices', language)}</p>
                  <p className="font-semibold text-lg text-foreground">{devices.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('activeDevices', language)}</p>
                  <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                    {devices.filter(d => d.is_active).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('inactiveDevices', language)}</p>
                  <p className="font-semibold text-lg text-red-600 dark:text-red-400">
                    {devices.filter(d => !d.is_active).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('platforms', language)}</p>
                  <p className="font-semibold text-lg text-foreground">
                    {new Set(devices.map(d => d.os)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
