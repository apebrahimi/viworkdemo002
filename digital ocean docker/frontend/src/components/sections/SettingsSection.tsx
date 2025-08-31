'use client';

import React, { useState, useEffect } from 'react';
import { UserType, SettingsFormData } from '@/types/settings';
import { UserTypeList } from '@/components/settings/UserTypeList';
import { UserTypeForm } from '@/components/settings/UserTypeForm';
import { GlobalSettingsForm } from '@/components/settings/GlobalSettingsForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { 
  Settings, 
  Users, 
  Shield, 
  ArrowLeft, 
  Eye,
  Save,
  AlertCircle
} from 'lucide-react';

type SettingsView = 'main' | 'user-types' | 'user-type-form' | 'user-type-details' | 'global-settings';

interface SettingsSectionProps {
  // Add any props if needed
}

// Mock data for demonstration
const mockUserTypes: UserType[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions and capabilities',
    color: '#EF4444',
    isActive: true,
    requiresMobileVerification: true,
    maxConcurrentSessions: 5,
    sessionTimeout: 120,
    timeIntervals: [
      {
        id: 'admin_hours',
        name: 'Admin Hours',
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5],
        isActive: true,
      }
    ],
    locationRestrictions: [
      {
        id: 'admin_location',
        name: 'Office Only',
        type: 'country',
        value: 'US',
        isAllowed: true,
        isActive: true,
      }
    ],
    resourceAccess: [
      {
        id: 'admin_resources',
        name: 'All Resources',
        type: 'server',
        resourceId: 'all',
        permissions: ['read', 'write', 'delete', 'execute', 'admin'],
        isActive: true,
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'employee',
    name: 'Employee',
    description: 'Standard employee access with limited permissions',
    color: '#3B82F6',
    isActive: true,
    requiresMobileVerification: false,
    maxConcurrentSessions: 2,
    sessionTimeout: 60,
    timeIntervals: [
      {
        id: 'business_hours',
        name: 'Business Hours',
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5],
        isActive: true,
      }
    ],
    locationRestrictions: [],
    resourceAccess: [
      {
        id: 'employee_resources',
        name: 'Employee Resources',
        type: 'api',
        resourceId: 'employee-api',
        permissions: ['read', 'write'],
        isActive: true,
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'guest',
    name: 'Guest',
    description: 'Limited access for temporary users and visitors',
    color: '#10B981',
    isActive: true,
    requiresMobileVerification: false,
    maxConcurrentSessions: 1,
    sessionTimeout: 30,
    timeIntervals: [],
    locationRestrictions: [],
    resourceAccess: [
      {
        id: 'guest_resources',
        name: 'Public Resources',
        type: 'api',
        resourceId: 'public-api',
        permissions: ['read'],
        isActive: true,
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockGlobalSettings = {
  defaultSessionTimeout: 60,
  requireMobileVerification: false,
  maxLoginAttempts: 3,
  lockoutDuration: 15,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
};

export function SettingsSection({}: SettingsSectionProps) {
  const { language } = useLanguage();
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [userTypes, setUserTypes] = useState<UserType[]>(mockUserTypes);
  const [globalSettings, setGlobalSettings] = useState(mockGlobalSettings);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUserType = () => {
    setSelectedUserType(null);
    setCurrentView('user-type-form');
  };

  const handleEditUserType = (userType: UserType) => {
    setSelectedUserType(userType);
    setCurrentView('user-type-form');
  };

  const handleViewUserType = (userType: UserType) => {
    setSelectedUserType(userType);
    setCurrentView('user-type-details');
  };

  const handleDeleteUserType = async (userType: UserType) => {
    if (confirm(language === 'fa' ? `آیا مطمئن هستید که می‌خواهید نوع کاربر "${userType.name}" را حذف کنید؟` : `Are you sure you want to delete the user type "${userType.name}"?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUserTypes(prev => prev.filter(ut => ut.id !== userType.id));
      } catch (error) {
        console.error('Error deleting user type:', error);
        alert(language === 'fa' ? 'خطا در حذف نوع کاربر' : 'Failed to delete user type');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveUserType = async (userType: UserType) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedUserType) {
        // Update existing
        setUserTypes(prev => prev.map(ut => ut.id === userType.id ? userType : ut));
      } else {
        // Create new
        setUserTypes(prev => [...prev, userType]);
      }
      
      setCurrentView('user-types');
    } catch (error) {
      console.error('Error saving user type:', error);
      alert(language === 'fa' ? 'خطا در ذخیره نوع کاربر' : 'Failed to save user type');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGlobalSettings = async (settings: typeof globalSettings) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGlobalSettings(settings);
      alert(language === 'fa' ? 'تنظیمات با موفقیت ذخیره شد' : 'Global settings saved successfully!');
    } catch (error) {
      console.error('Error saving global settings:', error);
      alert(language === 'fa' ? 'خطا در ذخیره تنظیمات' : 'Failed to save global settings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMainView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8" />
          {t('systemSettings', language)}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200" 
          onClick={() => {
            console.log('User Types card clicked');
            setCurrentView('user-types');
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('userTypes', language)}</h3>
                <p className="text-sm text-gray-600">{userTypes.length} {t('typesConfigured', language)}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('userTypesDesc', language)}
            </p>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              {t('clickToView', language)} →
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-200" 
          onClick={() => {
            console.log('Global Settings card clicked');
            setCurrentView('global-settings');
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('globalSettings', language)}</h3>
                <p className="text-sm text-gray-600">{t('systemWideConfiguration', language)}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('globalSettingsFullDesc', language)}
            </p>
            <div className="mt-3 text-xs text-green-600 font-medium">
              {t('clickToView', language)} →
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-200"
          onClick={() => {
            console.log('Security Audit card clicked');
            alert(language === 'fa' ? 'ویژگی حسابرسی امنیتی به زودی در دسترس خواهد بود' : 'Security Audit feature coming soon!');
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('securityAudit', language)}</h3>
                <p className="text-sm text-gray-600">{t('securityAuditDesc', language)}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('securityAuditFullDesc', language)}
            </p>
            <div className="mt-3 text-xs text-purple-600 font-medium">
              {t('clickToView', language)} →
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200"
          onClick={() => {
            console.log('User Types stats clicked');
            setCurrentView('user-types');
          }}
        >
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{userTypes.length}</div>
            <div className="text-sm text-gray-600">{t('userTypes', language)}</div>
            <div className="text-xs text-blue-600 mt-1">{t('clickToManage', language)}</div>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-200"
          onClick={() => {
            console.log('Active Types stats clicked');
            setCurrentView('user-types');
          }}
        >
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {userTypes.filter(ut => ut.isActive).length}
            </div>
            <div className="text-sm text-gray-600">{t('activeTypes', language)}</div>
            <div className="text-xs text-green-600 mt-1">{t('clickToManage', language)}</div>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-orange-200"
          onClick={() => {
            console.log('Mobile Verification stats clicked');
            setCurrentView('user-types');
          }}
        >
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {userTypes.filter(ut => ut.requiresMobileVerification).length}
            </div>
            <div className="text-sm text-gray-600">{t('mobileVerificationRequired', language)}</div>
            <div className="text-xs text-orange-600 mt-1">{t('clickToManage', language)}</div>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-200"
          onClick={() => {
            console.log('Resource Access Rules stats clicked');
            setCurrentView('user-types');
          }}
        >
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {userTypes.reduce((acc, ut) => acc + ut.resourceAccess.length, 0)}
            </div>
            <div className="text-sm text-gray-600">{t('resourceAccessRules', language)}</div>
            <div className="text-xs text-purple-600 mt-1">{t('clickToManage', language)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUserTypesView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setCurrentView('main')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToSettings', language)}
        </Button>
        <h1 className="text-2xl font-bold">{t('userTypeManagement', language)}</h1>
      </div>

      <UserTypeList
        userTypes={userTypes}
        onEdit={handleEditUserType}
        onDelete={handleDeleteUserType}
        onView={handleViewUserType}
        onCreate={handleCreateUserType}
        disabled={isLoading}
      />
    </div>
  );

  const renderUserTypeForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setCurrentView('user-types')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToUserTypes', language)}
        </Button>
      </div>

      <UserTypeForm
        userType={selectedUserType || undefined}
        onSave={handleSaveUserType}
        onCancel={() => setCurrentView('user-types')}
        disabled={isLoading}
      />
    </div>
  );

  const renderUserTypeDetails = () => {
    if (!selectedUserType) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentView('user-types')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToUserTypes', language)}
          </Button>
          <h1 className="text-2xl font-bold">{t('userTypeDetails', language)}</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedUserType.color }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{selectedUserType.name}</CardTitle>
                <p className="text-gray-600">{selectedUserType.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                  <h4 className="font-semibold mb-2">{t('securitySettings', language)}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('requireMobileVerification', language)}:</span>
                      <span className={selectedUserType.requiresMobileVerification ? 'text-green-600' : 'text-gray-500'}>
                        {selectedUserType.requiresMobileVerification ? t('required', language) : t('optional', language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('maxConcurrentSessions', language)}:</span>
                      <span>{selectedUserType.maxConcurrentSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('sessionTimeout', language)}:</span>
                      <span>{selectedUserType.sessionTimeout} {language === 'fa' ? 'دقیقه' : 'minutes'}</span>
                    </div>
                  </div>
                </div>
              <div>
                <h4 className="font-semibold mb-2">{t('accessControls', language)}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('timeIntervals', language)}:</span>
                    <span>{selectedUserType.timeIntervals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('locationRestrictions', language)}:</span>
                    <span>{selectedUserType.locationRestrictions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('resourceAccess', language)}:</span>
                    <span>{selectedUserType.resourceAccess.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Intervals */}
            {selectedUserType.timeIntervals.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">{t('timeIntervals', language)}</h4>
                <div className="space-y-2">
                  {selectedUserType.timeIntervals.map(interval => (
                    <div key={interval.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{interval.name}</span>
                        <span className="text-sm text-gray-600">
                          {interval.startTime} - {interval.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resource Access */}
            {selectedUserType.resourceAccess.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">{t('resourceAccess', language)}</h4>
                <div className="space-y-2">
                  {selectedUserType.resourceAccess.map(access => (
                    <div key={access.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{access.name}</span>
                        <div className="flex gap-1">
                          {access.permissions.map(permission => (
                            <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGlobalSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setCurrentView('main')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToSettings', language)}
        </Button>
        <h1 className="text-2xl font-bold">{t('globalSettings', language)}</h1>
      </div>

      <GlobalSettingsForm
        settings={globalSettings}
        onSave={handleSaveGlobalSettings}
        disabled={isLoading}
      />
    </div>
  );

  const renderContent = () => {
    console.log('Current view:', currentView);
    switch (currentView) {
      case 'main':
        return renderMainView();
      case 'user-types':
        return renderUserTypesView();
      case 'user-type-form':
        return renderUserTypeForm();
      case 'user-type-details':
        return renderUserTypeDetails();
      case 'global-settings':
        return renderGlobalSettings();
      default:
        return renderMainView();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}
