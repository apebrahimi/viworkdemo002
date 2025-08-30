'use client';

import React, { useState, useEffect } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useApi';
import { User, CreateUserRequest, UpdateUserRequest } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiServices } from '@/lib/api-services';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface DeviceRequest {
  username: string;
  fingerprint: string;
  status: string;
  created_at: string;
}

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deviceRequests, setDeviceRequests] = useState<DeviceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    mobile: '',
    policy_window: 'Mon-Fri 09:00-17:00',
    device_binding: true,
  });
  const { language } = useLanguage();

  // Load users and device requests
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, deviceRequestsResponse] = await Promise.all([
        apiServices.users.getUsers(),
        apiServices.users.getDeviceRequests(),
      ]);
      
      setUsers(usersResponse.users || []);
      setDeviceRequests(deviceRequestsResponse.requests || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't throw error to prevent logout
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Create new user
  const handleCreateUser = async () => {
    try {
      await apiServices.users.createUser({
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role: 'user',
        status: 'pending',
      });
      
      setShowCreateModal(false);
      setNewUser({
        username: '',
        email: '',
        mobile: '',
        policy_window: 'Mon-Fri 09:00-17:00',
        device_binding: true,
      });
      loadData();
    } catch (error) {
      console.error('Error creating user:', error);
      // Don't throw error to prevent logout
    }
  };

  // Activate user
  const handleActivateUser = async (username: string) => {
    try {
      await apiServices.users.activateUser(username);
      loadData();
    } catch (error) {
      console.error('Error activating user:', error);
      // Don't throw error to prevent logout
    }
  };

  // Approve device request
  const handleApproveDevice = async (requestId: string) => {
    try {
      await apiServices.users.approveDevice(requestId);
      loadData();
    } catch (error) {
      console.error('Error approving device:', error);
      // Don't throw error to prevent logout
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">فعال</Badge>;
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800 border-yellow-200">در انتظار</Badge>;
      case 'inactive':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">غیرفعال</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getDeviceStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">تأیید شده</Badge>;
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800 border-yellow-200">در انتظار</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">رد شده</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('userManagement', language)}</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">{t('loadingUsers', language)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('userManagement', language)}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('userManagementDesc', language)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowDeviceModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            {t('deviceRequests', language)} ({deviceRequests.filter(r => r.status === 'pending').length})
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            {t('createUser', language)}
          </Button>
        </div>
      </div>

      {/* Users List */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{t('users', language)}</h3>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-lg font-medium">{t('noUsersFound', language)}</p>
                <p className="text-sm">{t('createFirstUser', language)}</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-semibold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{user.username}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{user.email}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{t('mobile', language)}: {user.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(user.status)}
                    {user.device_bound && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                        {t('deviceBound', language)}
                      </Badge>
                    )}
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleActivateUser(user.username)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        {t('activate', language)}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t('createUser', language)}
      >
        <div className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('username', language)}</label>
            <Input
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              placeholder={t('enterUsername', language)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('mobile', language)}</label>
            <Input
              value={newUser.mobile}
              onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
              placeholder={t('enterMobile', language)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('policyWindow', language)}</label>
            <Input
              value={newUser.policy_window}
              onChange={(e) => setNewUser({ ...newUser, policy_window: e.target.value })}
              placeholder="e.g., Mon-Fri 09:00-17:00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="device_binding"
              checked={newUser.device_binding}
              onChange={(e) => setNewUser({ ...newUser, device_binding: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="device_binding" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('requireDeviceBinding', language)}
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('cancel', language)}
            </Button>
            <Button 
              onClick={handleCreateUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              {t('createUser', language)}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Device Requests Modal */}
      <Modal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        title={t('deviceBindingRequests', language)}
      >
        <div className="space-y-4 p-6">
          {deviceRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-lg font-medium">{t('noDeviceRequests', language)}</p>
              <p className="text-sm">{t('allRequestsProcessed', language)}</p>
            </div>
          ) : (
            deviceRequests.map((request) => (
              <div key={request.username} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{request.username}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fingerprint: {request.fingerprint.substring(0, 20)}...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Requested: {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getDeviceStatusBadge(request.status)}
                  {request.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleApproveDevice(request.username)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {t('approve', language)}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button 
              variant="outline" 
              onClick={() => setShowDeviceModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('close', language)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { UsersSection };
export default UsersSection;