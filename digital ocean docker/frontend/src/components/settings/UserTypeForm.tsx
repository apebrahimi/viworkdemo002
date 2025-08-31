'use client';

import React, { useState } from 'react';
import { UserType, UserTypeFormData } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TimeIntervalForm } from './TimeIntervalForm';
import { LocationRestrictionForm } from './LocationRestrictionForm';
import { ResourceAccessForm } from './ResourceAccessForm';
import { Users, Save, X, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface UserTypeFormProps {
  userType?: UserType;
  onSave: (userType: UserType) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'آبی' },
  { value: '#10B981', label: 'سبز' },
  { value: '#F59E0B', label: 'زرد' },
  { value: '#EF4444', label: 'قرمز' },
  { value: '#8B5CF6', label: 'بنفش' },
  { value: '#EC4899', label: 'صورتی' },
  { value: '#6B7280', label: 'خاکستری' },
  { value: '#059669', label: 'زمردی' },
];

export function UserTypeForm({ userType, onSave, onCancel, disabled = false }: UserTypeFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<UserTypeFormData>({
    name: userType?.name || '',
    description: userType?.description || '',
    color: userType?.color || '#3B82F6',
    isActive: userType?.isActive ?? true,
    requiresMobileVerification: userType?.requiresMobileVerification ?? false,
    maxConcurrentSessions: userType?.maxConcurrentSessions || 1,
    sessionTimeout: userType?.sessionTimeout || 30,
    timeIntervals: userType?.timeIntervals || [],
    locationRestrictions: userType?.locationRestrictions || [],
    resourceAccess: userType?.resourceAccess || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'fa' ? 'نام نوع کاربر الزامی است' : 'User type name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'fa' ? 'توضیحات الزامی است' : 'Description is required';
    }

    if (formData.maxConcurrentSessions < 1) {
      newErrors.maxConcurrentSessions = language === 'fa' ? 'حداقل باید 1 باشد' : 'Must be at least 1';
    }

    if (formData.sessionTimeout < 1) {
      newErrors.sessionTimeout = language === 'fa' ? 'حداقل باید 1 دقیقه باشد' : 'Must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const userTypeData: UserType = {
      id: userType?.id || `user_type_${Date.now()}`,
      ...formData,
      createdAt: userType?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(userTypeData);
  };

  const updateFormData = (updates: Partial<UserTypeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          {userType ? t('editUserType', language) : t('createUserType', language)}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-2" />
            {t('cancel', language)}
          </Button>
          <Button
            onClick={handleSave}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('saveUserType', language)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('basicInformation', language)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label={t('userTypeName', language)}
                placeholder={t('userTypeNamePlaceholder', language)}
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                error={errors.name}
                disabled={disabled}
              />

              <div>
                <label className="block text-sm font-medium mb-2">{t('description', language)}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder={t('descriptionPlaceholder', language)}
                  disabled={disabled}
                  rows={3}
                  className={`
                    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                  `}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('color', language)}</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => updateFormData({ color: color.value })}
                      disabled={disabled}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${formData.color === color.value ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-400'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onChange={(checked) => updateFormData({ isActive: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('active', language)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('securitySettings', language)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.requiresMobileVerification}
                  onChange={(checked) => updateFormData({ requiresMobileVerification: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('requireMobileVerification', language)}</span>
              </div>

              <Input
                label={t('maxConcurrentSessions', language)}
                type="number"
                min="1"
                max="10"
                value={formData.maxConcurrentSessions}
                onChange={(e) => updateFormData({ maxConcurrentSessions: parseInt(e.target.value) || 1 })}
                error={errors.maxConcurrentSessions}
                disabled={disabled}
              />

              <Input
                label={t('sessionTimeout', language)}
                type="number"
                min="1"
                max="1440"
                value={formData.sessionTimeout}
                onChange={(e) => updateFormData({ sessionTimeout: parseInt(e.target.value) || 30 })}
                error={errors.sessionTimeout}
                disabled={disabled}
              />
            </CardContent>
          </Card>
        </div>

        {/* Access Controls */}
        <div className="lg:col-span-2 space-y-6">
          <TimeIntervalForm
            timeIntervals={formData.timeIntervals}
            onChange={(intervals) => updateFormData({ timeIntervals: intervals })}
            disabled={disabled}
          />

          <LocationRestrictionForm
            locationRestrictions={formData.locationRestrictions}
            onChange={(restrictions) => updateFormData({ locationRestrictions: restrictions })}
            disabled={disabled}
          />

          <ResourceAccessForm
            resourceAccess={formData.resourceAccess}
            onChange={(access) => updateFormData({ resourceAccess: access })}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
