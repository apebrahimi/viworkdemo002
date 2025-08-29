'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowRight, Upload, MessageSquare, AlertTriangle, Info, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTicketPage() {
  const { isLoading, createTicket } = usePortal();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: '',
    category: '',
    severity: '',
    description: '',
    attachments: [] as File[]
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create ticket using context
      await createTicket({
        title: ticketData.title,
        category: ticketData.category,
        severity: ticketData.severity.replace('-', '_') as 'sev_1' | 'sev_2' | 'sev_3' | 'sev_4',
        status: 'open'
      });
      
      // Redirect to tickets list
      router.push('/portal/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTicketData(prev => ({
        ...prev,
        attachments: [...Array.from(e.target.files || [])]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setTicketData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تیکت جدید</h1>
          <p className="text-slate-600 mt-1">
            ایجاد تیکت پشتیبانی جدید
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowRight className="w-4 h-4 ml-2 transform scale-x-[-1]" />
          بازگشت
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              اطلاعات تیکت
            </CardTitle>
            <CardDescription>
              جزئیات اصلی تیکت پشتیبانی
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                عنوان تیکت *
              </label>
              <Input
                value={ticketData.title}
                onChange={(e) => setTicketData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان کوتاه و واضح برای تیکت"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  دسته‌بندی *
                </label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  <option value="technical">مشکل فنی</option>
                  <option value="billing">صورتحساب و پرداخت</option>
                  <option value="contract">قرارداد و تمدید</option>
                  <option value="feature">درخواست قابلیت جدید</option>
                  <option value="general">سوال عمومی</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  سطح شدت *
                </label>
                <select
                  value={ticketData.severity}
                  onChange={(e) => setTicketData(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب سطح شدت</option>
                  <option value="sev-1">Sev-1: اختلال بحرانی</option>
                  <option value="sev-2">Sev-2: اختلال شدید</option>
                  <option value="sev-3">Sev-3: مشکل عادی</option>
                  <option value="sev-4">Sev-4: راهنمایی/Feature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                توضیحات *
              </label>
              <textarea
                value={ticketData.description}
                onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 resize-vertical"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              ضمیمه‌ها
            </CardTitle>
            <CardDescription>
              فایل‌های مرتبط با تیکت (حداکثر 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-2">
                فایل‌ها را اینجا بکشید یا کلیک کنید
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" type="button">
                  انتخاب فایل
                </Button>
              </label>
            </div>

            {ticketData.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">فایل‌های انتخاب شده:</h4>
                {ticketData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-900">{file.name}</span>
                      <span className="text-xs text-slate-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      حذف
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SLA Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              اطلاعات SLA
            </CardTitle>
            <CardDescription>
              اهداف پاسخ‌گویی بر اساس سطح شدت
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-slate-900">Sev-1: اختلال بحرانی</span>
                </div>
                <p className="text-sm text-slate-600">پاسخ: ≤ 15 دقیقه | حل: ≤ 1 ساعت</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-slate-900">Sev-2: اختلال شدید</span>
                </div>
                <p className="text-sm text-slate-600">پاسخ: ≤ 30 دقیقه | حل: ≤ 4 ساعت</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-900">Sev-3: مشکل عادی</span>
                </div>
                <p className="text-sm text-slate-600">پاسخ: ≤ 4 ساعت | حل: روز کاری بعد</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-slate-900">Sev-4: راهنمایی/Feature</span>
                </div>
                <p className="text-sm text-slate-600">پاسخ: ≤ 1 روز | حل: Backlog</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            انصراف
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال ایجاد...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                ایجاد تیکت
                <ArrowRight className="w-4 h-4 transform scale-x-[-1]" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
