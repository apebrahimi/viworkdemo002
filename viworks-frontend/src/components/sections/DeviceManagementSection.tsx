import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApiWrapper';
import { apiServices } from '@/lib/api-services';

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

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall<DeviceListResponse>(() => 
        apiServices.get('/api/v1/auth/devices')
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
        apiServices.post(`/api/v1/auth/devices/${deviceId}/deactivate`)
      );
      fetchDevices(); // Refresh the list
    } catch (err) {
      console.error('Error deactivating device:', err);
    }
  };

  const handleActivateDevice = async (deviceId: string) => {
    try {
      await apiCall(() => 
        apiServices.post(`/api/v1/auth/devices/${deviceId}/activate`)
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
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="destructive">Inactive</Badge>
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
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading devices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Device Management</CardTitle>
          <Button onClick={fetchDevices} variant="outline" size="sm">
            🔄 Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {devices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No devices registered yet.</p>
            <p className="text-sm">Devices will appear here when users register them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <Card key={device.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getOSIcon(device.os)}</span>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {device.device_name || device.model}
                          </h3>
                          <p className="text-xs text-gray-500">{device.manufacturer}</p>
                        </div>
                      </div>
                      {getStatusBadge(device.is_active)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device ID:</span>
                        <span className="font-mono text-xs">{device.device_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">OS:</span>
                        <span>{device.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">App Version:</span>
                        <span>{device.app_version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-xs">{formatDate(device.created_at)}</span>
                      </div>
                      {device.last_used_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Used:</span>
                          <span className="text-xs">{formatDate(device.last_used_at)}</span>
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
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivateDevice(device.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Activate
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
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">📊 Device Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Devices</p>
                  <p className="font-semibold text-lg">{devices.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Active Devices</p>
                  <p className="font-semibold text-lg text-green-600">
                    {devices.filter(d => d.is_active).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Inactive Devices</p>
                  <p className="font-semibold text-lg text-red-600">
                    {devices.filter(d => !d.is_active).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Platforms</p>
                  <p className="font-semibold text-lg">
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
