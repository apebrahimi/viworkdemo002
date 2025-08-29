'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, FileText, Calendar, AlertTriangle, Settings } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

export default function NotificationsPage() {
  const { isLoading } = usePortal();
  const [notifications, setNotifications] = useState({
    tickets: {
      email: true,
      inApp: true,
      newTicket: true,
      ticketUpdate: true,
      ticketResolved: true,
      slaBreach: true
    },
    contracts: {
      email: true,
      inApp: true,
      renewalReminder: true,
      contractExpiry: true,
      planUpgrade: true
    },
    reports: {
      email: false,
      inApp: true,
      monthlyReport: true,
      quarterlyReport: true,
      customReport: true
    },
    system: {
      email: true,
      inApp: true,
      maintenance: true,
      security: true,
      updates: false
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleToggle = (category: string, type: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !(prev[category as keyof typeof prev] as Record<string, boolean>)[type]
      }
    }));
  };

  const NotificationItem = ({ 
    icon: Icon, 
    title, 
    description, 
    enabled, 
    onToggle 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-600" />
        <div>
          <h3 className="font-medium text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تنظیمات اعلان‌ها</h1>
          <p className="text-slate-600 mt-1">
            مدیریت ترجیحات اعلان‌ها و کانال‌های ارتباطی
          </p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 ml-2" />
          تنظیمات پیشرفته
        </Button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">اعلان‌های فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">12</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">ایمیل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-slate-900">8</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">درون برنامه‌ای</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900">10</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">غیرفعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-300"></div>
              <span className="text-2xl font-bold text-slate-900">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            اعلان‌های تیکت
          </CardTitle>
          <CardDescription>
            تنظیمات اعلان‌ها برای تیکت‌های پشتیبانی
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            icon={MessageSquare}
            title="تیکت جدید"
            description="اعلان هنگام ایجاد تیکت جدید"
            enabled={notifications.tickets.newTicket}
            onToggle={() => handleToggle('tickets', 'newTicket')}
          />
          <NotificationItem
            icon={MessageSquare}
            title="به‌روزرسانی تیکت"
            description="اعلان هنگام به‌روزرسانی تیکت"
            enabled={notifications.tickets.ticketUpdate}
            onToggle={() => handleToggle('tickets', 'ticketUpdate')}
          />
          <NotificationItem
            icon={MessageSquare}
            title="حل تیکت"
            description="اعلان هنگام حل شدن تیکت"
            enabled={notifications.tickets.ticketResolved}
            onToggle={() => handleToggle('tickets', 'ticketResolved')}
          />
          <NotificationItem
            icon={AlertTriangle}
            title="نقض SLA"
            description="هشدار هنگام نقض SLA"
            enabled={notifications.tickets.slaBreach}
            onToggle={() => handleToggle('tickets', 'slaBreach')}
          />
        </CardContent>
      </Card>

      {/* Contract Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            اعلان‌های قرارداد
          </CardTitle>
          <CardDescription>
            تنظیمات اعلان‌ها برای قراردادها و تمدید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            icon={Calendar}
            title="یادآوری تمدید"
            description="یادآوری 60، 30 و 7 روز قبل از انقضا"
            enabled={notifications.contracts.renewalReminder}
            onToggle={() => handleToggle('contracts', 'renewalReminder')}
          />
          <NotificationItem
            icon={AlertTriangle}
            title="انقضای قرارداد"
            description="هشدار انقضای قرارداد"
            enabled={notifications.contracts.contractExpiry}
            onToggle={() => handleToggle('contracts', 'contractExpiry')}
          />
          <NotificationItem
            icon={FileText}
            title="ارتقای پلن"
            description="پیشنهادات ارتقای پلن"
            enabled={notifications.contracts.planUpgrade}
            onToggle={() => handleToggle('contracts', 'planUpgrade')}
          />
        </CardContent>
      </Card>

      {/* Report Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            اعلان‌های گزارش
          </CardTitle>
          <CardDescription>
            تنظیمات اعلان‌ها برای گزارش‌های SLA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            icon={FileText}
            title="گزارش ماهانه"
            description="اعلان آماده شدن گزارش ماهانه"
            enabled={notifications.reports.monthlyReport}
            onToggle={() => handleToggle('reports', 'monthlyReport')}
          />
          <NotificationItem
            icon={FileText}
            title="گزارش فصلی"
            description="اعلان آماده شدن گزارش فصلی"
            enabled={notifications.reports.quarterlyReport}
            onToggle={() => handleToggle('reports', 'quarterlyReport')}
          />
          <NotificationItem
            icon={FileText}
            title="گزارش سفارشی"
            description="اعلان آماده شدن گزارش سفارشی"
            enabled={notifications.reports.customReport}
            onToggle={() => handleToggle('reports', 'customReport')}
          />
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            اعلان‌های سیستم
          </CardTitle>
          <CardDescription>
            تنظیمات اعلان‌ها برای رویدادهای سیستمی
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            icon={Settings}
            title="تعمیر و نگهداری"
            description="اعلان تعمیر و نگهداری برنامه‌ریزی شده"
            enabled={notifications.system.maintenance}
            onToggle={() => handleToggle('system', 'maintenance')}
          />
          <NotificationItem
            icon={AlertTriangle}
            title="امنیت"
            description="هشدارهای امنیتی مهم"
            enabled={notifications.system.security}
            onToggle={() => handleToggle('system', 'security')}
          />
          <NotificationItem
            icon={Settings}
            title="به‌روزرسانی‌ها"
            description="اعلان به‌روزرسانی‌های جدید"
            enabled={notifications.system.updates}
            onToggle={() => handleToggle('system', 'updates')}
          />
        </CardContent>
      </Card>

      {/* Channel Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>ترجیحات کانال</CardTitle>
          <CardDescription>
            تنظیمات کانال‌های ارسال اعلان‌ها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">ایمیل</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">تیکت‌ها</span>
                  <Switch checked={notifications.tickets.email} onCheckedChange={() => handleToggle('tickets', 'email')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">قراردادها</span>
                  <Switch checked={notifications.contracts.email} onCheckedChange={() => handleToggle('contracts', 'email')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">گزارش‌ها</span>
                  <Switch checked={notifications.reports.email} onCheckedChange={() => handleToggle('reports', 'email')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">سیستم</span>
                  <Switch checked={notifications.system.email} onCheckedChange={() => handleToggle('system', 'email')} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">درون برنامه‌ای</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">تیکت‌ها</span>
                  <Switch checked={notifications.tickets.inApp} onCheckedChange={() => handleToggle('tickets', 'inApp')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">قراردادها</span>
                  <Switch checked={notifications.contracts.inApp} onCheckedChange={() => handleToggle('contracts', 'inApp')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">گزارش‌ها</span>
                  <Switch checked={notifications.reports.inApp} onCheckedChange={() => handleToggle('reports', 'inApp')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">سیستم</span>
                  <Switch checked={notifications.system.inApp} onCheckedChange={() => handleToggle('system', 'inApp')} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات Digest</CardTitle>
          <CardDescription>
            تنظیمات خلاصه‌های دوره‌ای اعلان‌ها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">خلاصه هفتگی</h3>
                <p className="text-sm text-slate-600">خلاصه تیکت‌ها و SLA در پایان هفته</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">خلاصه ماهانه</h3>
                <p className="text-sm text-slate-600">خلاصه کامل عملکرد ماهانه</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
