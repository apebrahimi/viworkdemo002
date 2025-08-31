'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Settings, Shield, Lock, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface GlobalSettings {
  defaultSessionTimeout: number;
  requireMobileVerification: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

interface GlobalSettingsFormProps {
  settings: GlobalSettings;
  onSave: (settings: GlobalSettings) => void;
  disabled?: boolean;
}

export function GlobalSettingsForm({ settings, onSave, disabled = false }: GlobalSettingsFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<GlobalSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.defaultSessionTimeout < 1) {
      newErrors.defaultSessionTimeout = language === 'fa' ? 'زمان انقضای جلسه باید حداقل 1 دقیقه باشد' : 'Session timeout must be at least 1 minute';
    }

    if (formData.maxLoginAttempts < 1) {
      newErrors.maxLoginAttempts = language === 'fa' ? 'حداکثر تلاش‌های ورود باید حداقل 1 باشد' : 'Max login attempts must be at least 1';
    }

    if (formData.lockoutDuration < 1) {
      newErrors.lockoutDuration = language === 'fa' ? 'مدت زمان قفل باید حداقل 1 دقیقه باشد' : 'Lockout duration must be at least 1 minute';
    }

    if (formData.passwordPolicy.minLength < 6) {
      newErrors.passwordMinLength = language === 'fa' ? 'حداقل طول رمز عبور باید حداقل 6 کاراکتر باشد' : 'Minimum password length must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const updateFormData = (updates: Partial<GlobalSettings>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const updatePasswordPolicy = (updates: Partial<GlobalSettings['passwordPolicy']>) => {
    setFormData(prev => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, ...updates }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          {t('globalSettings', language)}
        </h2>
        <Button
          onClick={handleSave}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          {t('saveSettings', language)}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('sessionSettings', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label={t('defaultSessionTimeout', language)}
              type="number"
              min="1"
              max="1440"
              value={formData.defaultSessionTimeout}
              onChange={(e) => updateFormData({ defaultSessionTimeout: parseInt(e.target.value) || 30 })}
              error={errors.defaultSessionTimeout}
              disabled={disabled}
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.requireMobileVerification}
                onChange={(checked) => updateFormData({ requireMobileVerification: checked })}
                disabled={disabled}
              />
              <span className="text-sm">{t('requireMobileVerificationDefault', language)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {t('securitySettings', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label={t('maxLoginAttempts', language)}
              type="number"
              min="1"
              max="10"
              value={formData.maxLoginAttempts}
              onChange={(e) => updateFormData({ maxLoginAttempts: parseInt(e.target.value) || 3 })}
              error={errors.maxLoginAttempts}
              disabled={disabled}
            />

            <Input
              label={t('accountLockoutDuration', language)}
              type="number"
              min="1"
              max="1440"
              value={formData.lockoutDuration}
              onChange={(e) => updateFormData({ lockoutDuration: parseInt(e.target.value) || 15 })}
              error={errors.lockoutDuration}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        {/* Password Policy */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t('passwordPolicy', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('minimumPasswordLength', language)}
                type="number"
                min="6"
                max="128"
                value={formData.passwordPolicy.minLength}
                onChange={(e) => updatePasswordPolicy({ minLength: parseInt(e.target.value) || 8 })}
                error={errors.passwordMinLength}
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.passwordPolicy.requireUppercase}
                  onChange={(checked) => updatePasswordPolicy({ requireUppercase: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('requireUppercase', language)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.passwordPolicy.requireLowercase}
                  onChange={(checked) => updatePasswordPolicy({ requireLowercase: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('requireLowercase', language)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.passwordPolicy.requireNumbers}
                  onChange={(checked) => updatePasswordPolicy({ requireNumbers: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('requireNumbers', language)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.passwordPolicy.requireSpecialChars}
                  onChange={(checked) => updatePasswordPolicy({ requireSpecialChars: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('requireSpecialChars', language)}</span>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Password Requirements Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.passwordPolicy.minLength >= 8 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  Minimum {formData.passwordPolicy.minLength} characters
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.passwordPolicy.requireUppercase ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  Uppercase letters {formData.passwordPolicy.requireUppercase ? 'required' : 'optional'}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.passwordPolicy.requireLowercase ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  Lowercase letters {formData.passwordPolicy.requireLowercase ? 'required' : 'optional'}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.passwordPolicy.requireNumbers ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  Numbers {formData.passwordPolicy.requireNumbers ? 'required' : 'optional'}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.passwordPolicy.requireSpecialChars ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  Special characters {formData.passwordPolicy.requireSpecialChars ? 'required' : 'optional'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
