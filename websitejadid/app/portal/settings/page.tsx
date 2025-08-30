'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { User, Shield, Globe, Key, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

export default function SettingsPage() {
  const { isLoading } = usePortal();
  const [settings, setSettings] = useState({
    profile: {
      name: 'احمد محمدی',
      email: 'ahmad.mohammadi@company.com',
      phone: '09123456789',
      language: 'فارسی',
      timezone: 'Asia/Tehran'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true
    },
    portal: {
      theme: 'light',
      compactMode: false,
      autoRefresh: true,
      defaultPage: 'dashboard'
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSettingChange = (category: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تنظیمات</h1>
          <p className="text-slate-600 mt-1">
            مدیریت تنظیمات پورتال و پروفایل کاربری
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 ml-2" />
          ذخیره تغییرات
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            اطلاعات پروفایل
          </CardTitle>
          <CardDescription>
            ویرایش اطلاعات شخصی و تماس
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                نام و نام خانوادگی
              </label>
              <Input
                value={settings.profile.name}
                onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                placeholder="نام و نام خانوادگی"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                آدرس ایمیل
              </label>
              <Input
                value={settings.profile.email}
                onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                placeholder="ایمیل"
                type="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                شماره تلفن
              </label>
              <Input
                value={settings.profile.phone}
                onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                placeholder="شماره تلفن"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                زبان
              </label>
              <select
                value={settings.profile.language}
                onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="فارسی">فارسی</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            تنظیمات امنیتی
          </CardTitle>
          <CardDescription>
            مدیریت امنیت حساب کاربری
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">احراز هویت دو مرحله‌ای</h3>
                <p className="text-sm text-slate-600">استفاده از TOTP برای امنیت بیشتر</p>
              </div>
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">اعلان ورود</h3>
                <p className="text-sm text-slate-600">دریافت ایمیل هنگام ورود جدید</p>
              </div>
              <Switch
                checked={settings.security.loginNotifications}
                onCheckedChange={(checked) => handleSettingChange('security', 'loginNotifications', checked)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                زمان انقضای نشست (دقیقه)
              </label>
              <Input
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                type="number"
                min="15"
                max="120"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                انقضای رمز عبور (روز)
              </label>
              <Input
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                type="number"
                min="30"
                max="365"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            تنظیمات پورتال
          </CardTitle>
          <CardDescription>
            شخصی‌سازی تجربه کاربری
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">حالت فشرده</h3>
                <p className="text-sm text-slate-600">نمایش فشرده‌تر محتوا</p>
              </div>
              <Switch
                checked={settings.portal.compactMode}
                onCheckedChange={(checked) => handleSettingChange('portal', 'compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">به‌روزرسانی خودکار</h3>
                <p className="text-sm text-slate-600">به‌روزرسانی خودکار داده‌ها</p>
              </div>
              <Switch
                checked={settings.portal.autoRefresh}
                onCheckedChange={(checked) => handleSettingChange('portal', 'autoRefresh', checked)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                تم
              </label>
              <select
                value={settings.portal.theme}
                onChange={(e) => handleSettingChange('portal', 'theme', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">روشن</option>
                <option value="dark">تیره</option>
                <option value="auto">خودکار</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                صفحه پیش‌فرض
              </label>
              <select
                value={settings.portal.defaultPage}
                onChange={(e) => handleSettingChange('portal', 'defaultPage', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dashboard">داشبورد</option>
                <option value="tickets">تیکت‌ها</option>
                <option value="contracts">قراردادها</option>
                <option value="reports">گزارش‌ها</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            کلیدهای API
          </CardTitle>
          <CardDescription>
            مدیریت کلیدهای API برای دسترسی برنامه‌ای
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">کلید API اصلی</h3>
                <p className="text-sm text-slate-600">برای دسترسی به API گزارش‌ها</p>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-2 block">
                  vw_sk_1234567890abcdef...
                </code>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">کپی</Button>
                <Button size="sm" variant="outline">تولید مجدد</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">کلید API خواندنی</h3>
                <p className="text-sm text-slate-600">فقط برای خواندن داده‌ها</p>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-2 block">
                  vw_rk_abcdef1234567890...
                </code>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">کپی</Button>
                <Button size="sm" variant="outline">تولید مجدد</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">منطقه خطر</CardTitle>
          <CardDescription>
            عملیات‌های غیرقابل بازگشت
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-700">خروج از همه دستگاه‌ها</h3>
                <p className="text-sm text-red-600">خروج از همه نشست‌های فعال</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                خروج از همه
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-700">حذف حساب کاربری</h3>
                <p className="text-sm text-red-600">این عمل غیرقابل بازگشت است</p>
              </div>
              <Button variant="destructive" size="sm">
                حذف حساب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
