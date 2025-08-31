'use client';

import React, { useState } from 'react';
import { ResourceAccess } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Plus, Database, Server, FileText, Network, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface ResourceAccessFormProps {
  resourceAccess: ResourceAccess[];
  onChange: (access: ResourceAccess[]) => void;
  disabled?: boolean;
}

const RESOURCE_TYPES = [
  { value: 'server', label: 'سرور', icon: Server },
  { value: 'database', label: 'پایگاه داده', icon: Database },
  { value: 'api', label: 'API', icon: Network },
  { value: 'file', label: 'فایل', icon: FileText },
  { value: 'network', label: 'شبکه', icon: Network },
];

const PERMISSIONS = [
  { value: 'read', label: 'خواندن' },
  { value: 'write', label: 'نوشتن' },
  { value: 'delete', label: 'حذف' },
  { value: 'execute', label: 'اجرا' },
  { value: 'admin', label: 'مدیر' },
];

const RESOURCE_OPTIONS = {
  server: [
    { value: 'web-server-01', label: 'Web Server 01' },
    { value: 'app-server-01', label: 'Application Server 01' },
    { value: 'db-server-01', label: 'Database Server 01' },
    { value: 'backup-server-01', label: 'Backup Server 01' },
  ],
  database: [
    { value: 'main-db', label: 'Main Database' },
    { value: 'analytics-db', label: 'Analytics Database' },
    { value: 'backup-db', label: 'Backup Database' },
    { value: 'test-db', label: 'Test Database' },
  ],
  api: [
    { value: 'user-api', label: 'User API' },
    { value: 'auth-api', label: 'Authentication API' },
    { value: 'data-api', label: 'Data API' },
    { value: 'admin-api', label: 'Admin API' },
  ],
  file: [
    { value: '/var/www/html', label: 'Web Root' },
    { value: '/var/log', label: 'Log Files' },
    { value: '/home/user', label: 'User Home' },
    { value: '/etc/config', label: 'Configuration Files' },
  ],
  network: [
    { value: 'internal-network', label: 'Internal Network' },
    { value: 'dmz-network', label: 'DMZ Network' },
    { value: 'vpn-network', label: 'VPN Network' },
    { value: 'backup-network', label: 'Backup Network' },
  ],
};

export function ResourceAccessForm({ resourceAccess, onChange, disabled = false }: ResourceAccessFormProps) {
  const { language } = useLanguage();
  const [newAccess, setNewAccess] = useState<Partial<ResourceAccess>>({
    name: '',
    type: 'server',
    resourceId: '',
    permissions: ['read'],
    isActive: true,
  });

  const addAccess = () => {
    if (!newAccess.name || !newAccess.resourceId) return;
    
    const access: ResourceAccess = {
      id: `resource_${Date.now()}`,
      name: newAccess.name,
      type: newAccess.type || 'server',
      resourceId: newAccess.resourceId,
      permissions: newAccess.permissions || ['read'],
      isActive: newAccess.isActive ?? true,
    };

    onChange([...resourceAccess, access]);
    setNewAccess({
      name: '',
      type: 'server',
      resourceId: '',
      permissions: ['read'],
      isActive: true,
    });
  };

  const updateAccess = (id: string, updates: Partial<ResourceAccess>) => {
    onChange(resourceAccess.map(access => 
      access.id === id ? { ...access, ...updates } : access
    ));
  };

  const removeAccess = (id: string) => {
    onChange(resourceAccess.filter(access => access.id !== id));
  };

  const togglePermission = (accessId: string, permission: string) => {
    const access = resourceAccess.find(a => a.id === accessId);
    if (!access) return;

    const newPermissions = access.permissions.includes(permission)
      ? access.permissions.filter(p => p !== permission)
      : [...access.permissions, permission];

    updateAccess(accessId, { permissions: newPermissions });
  };

  const getResourceOptions = (type: string) => {
    return RESOURCE_OPTIONS[type as keyof typeof RESOURCE_OPTIONS] || [];
  };

  const getResourceIcon = (type: string) => {
    const resourceType = RESOURCE_TYPES.find(t => t.value === type);
    return resourceType?.icon || Server;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {t('resourceAccess', language)}
        </h3>
        <Button
          onClick={addAccess}
          disabled={disabled || !newAccess.name || !newAccess.resourceId}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addResource', language)}
        </Button>
      </div>

      {/* Add new access form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{language === 'fa' ? 'افزودن دسترسی منبع جدید' : 'Add New Resource Access'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('resourceName', language)}
              placeholder={t('resourceNamePlaceholder', language)}
              value={newAccess.name}
              onChange={(e) => setNewAccess({ ...newAccess, name: e.target.value })}
              disabled={disabled}
            />
            <Select
              label={t('resourceType', language)}
              options={RESOURCE_TYPES.map(t => ({ value: t.value, label: t.label }))}
              value={newAccess.type}
              onChange={(value) => setNewAccess({ ...newAccess, type: value as any, resourceId: '' })}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{language === 'fa' ? 'منبع' : 'Resource'}</label>
              <Select
                options={getResourceOptions(newAccess.type || 'server')}
                value={newAccess.resourceId}
                onChange={(value) => setNewAccess({ ...newAccess, resourceId: value })}
                placeholder={language === 'fa' ? 'انتخاب منبع' : 'Select resource'}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newAccess.isActive ?? true}
                  onChange={(checked) => setNewAccess({ ...newAccess, isActive: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('active', language)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('permissions', language)}</label>
            <div className="flex flex-wrap gap-2">
              {PERMISSIONS.map((permission) => (
                <button
                  key={permission.value}
                  type="button"
                  onClick={() => {
                    const newPermissions = newAccess.permissions?.includes(permission.value)
                      ? newAccess.permissions.filter(p => p !== permission.value)
                      : [...(newAccess.permissions || []), permission.value];
                    setNewAccess({ ...newAccess, permissions: newPermissions });
                  }}
                  disabled={disabled}
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${newAccess.permissions?.includes(permission.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {permission.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing access */}
      <div className="space-y-3">
        {resourceAccess.map((access) => {
          const ResourceIcon = getResourceIcon(access.type);
          return (
            <Card key={access.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <ResourceIcon className="w-5 h-5 text-muted-foreground" />
                        <Input
                          value={access.name}
                          onChange={(e) => updateAccess(access.id, { name: e.target.value })}
                          disabled={disabled}
                          className="max-w-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={access.isActive}
                          onChange={(checked) => updateAccess(access.id, { isActive: checked })}
                          disabled={disabled}
                        />
                        <span className="text-sm text-muted-foreground">{t('active', language)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('resourceType', language)}</label>
                        <Select
                          options={RESOURCE_TYPES.map(t => ({ value: t.value, label: t.label }))}
                          value={access.type}
                          onChange={(value) => updateAccess(access.id, { type: value as any, resourceId: '' })}
                          disabled={disabled}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{language === 'fa' ? 'منبع' : 'Resource'}</label>
                        <Select
                          options={getResourceOptions(access.type)}
                          value={access.resourceId}
                          onChange={(value) => updateAccess(access.id, { resourceId: value })}
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    <div>
                                              <label className="block text-sm font-medium mb-1">{t('permissions', language)}</label>
                      <div className="flex flex-wrap gap-2">
                        {PERMISSIONS.map((permission) => (
                          <button
                            key={permission.value}
                            type="button"
                            onClick={() => togglePermission(access.id, permission.value)}
                            disabled={disabled}
                            className={`
                              px-2 py-1 rounded text-xs font-medium transition-colors
                              ${access.permissions.includes(permission.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                              }
                              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {permission.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => removeAccess(access.id)}
                    variant="destructive"
                    size="sm"
                    disabled={disabled}
                    className="ml-4"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {resourceAccess.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('noResourceAccess', language)}</p>
          <p className="text-sm">{t('noResourceAccessDesc', language)}</p>
        </div>
      )}
    </div>
  );
}
