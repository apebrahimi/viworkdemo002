'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SlaReportsPage() {
  const { isLoading } = usePortal();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">گزارش‌های SLA</h1>
          <p className="text-slate-600 mt-1">
            گزارش‌های عملکرد پشتیبانی و SLA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            دانلود همه گزارش‌ها
          </Button>
        </div>
      </div>

      {/* SLA Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            ماتریس SLA پشتیبانی
          </CardTitle>
          <CardDescription>
            اهداف پاسخ‌گویی و رفع مشکل بر اساس سطح شدت
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-right p-3 font-medium text-slate-700">سطح شدت</th>
                  <th className="text-right p-3 font-medium text-slate-700">تعریف</th>
                  <th className="text-right p-3 font-medium text-slate-700">هدف پاسخ‌گویی</th>
                  <th className="text-right p-3 font-medium text-slate-700">هدف رفع مشکل</th>
                  <th className="text-right p-3 font-medium text-slate-700">کانال</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-3">
                    <Badge variant="destructive">Sev-1</Badge>
                  </td>
                  <td className="p-3 text-sm">اختلال بحرانی</td>
                  <td className="p-3 text-sm">≤ 15 دقیقه</td>
                  <td className="p-3 text-sm">≤ 1 ساعت</td>
                  <td className="p-3 text-sm">ایمیل + تماس</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Sev-2</Badge>
                  </td>
                  <td className="p-3 text-sm">اختلال شدید</td>
                  <td className="p-3 text-sm">≤ 30 دقیقه</td>
                  <td className="p-3 text-sm">≤ 4 ساعت</td>
                  <td className="p-3 text-sm">ایمیل</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3">
                    <Badge variant="outline" className="border-blue-200 text-blue-700">Sev-3</Badge>
                  </td>
                  <td className="p-3 text-sm">مشکل عادی</td>
                  <td className="p-3 text-sm">≤ 4 ساعت</td>
                  <td className="p-3 text-sm">روز کاری بعد</td>
                  <td className="p-3 text-sm">پورتال</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <Badge variant="outline" className="border-green-200 text-green-700">Sev-4</Badge>
                  </td>
                  <td className="p-3 text-sm">راهنمایی/Feature</td>
                  <td className="p-3 text-sm">≤ 1 روز</td>
                  <td className="p-3 text-sm">Backlog</td>
                  <td className="p-3 text-sm">پورتال</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">میانگین زمان پاسخ‌گویی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">2.3 ساعت</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">هدف: 4 ساعت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">میانگین زمان رفع مشکل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-slate-900">8.7 ساعت</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">هدف: 24 ساعت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">درصد رعایت SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-2xl font-bold text-slate-900">94.2%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">هدف: 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش‌های موجود</CardTitle>
          <CardDescription>
            گزارش‌های ماهانه و فصلی عملکرد پشتیبانی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Monthly Reports */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">گزارش‌های ماهانه</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { month: 'آبان 1403', date: '1403/08/15', size: '2.3 MB', status: 'آماده' },
                  { month: 'مهر 1403', date: '1403/07/15', size: '2.1 MB', status: 'آماده' },
                  { month: 'شهریور 1403', date: '1403/06/15', size: '2.4 MB', status: 'آماده' },
                ].map((report, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{report.month}</span>
                      <Badge variant="outline" className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 mb-3">
                      <p>تاریخ تولید: {report.date}</p>
                      <p>حجم: {report.size}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 ml-1" />
                        مشاهده
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="w-3 h-3 ml-1" />
                        دانلود
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly Reports */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">گزارش‌های فصلی</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { quarter: 'فصل سوم 1403', date: '1403/09/30', size: '5.2 MB', status: 'آماده' },
                  { quarter: 'فصل دوم 1403', date: '1403/06/30', size: '4.8 MB', status: 'آماده' },
                ].map((report, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{report.quarter}</span>
                      <Badge variant="outline" className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 mb-3">
                      <p>تاریخ تولید: {report.date}</p>
                      <p>حجم: {report.size}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 ml-1" />
                        مشاهده
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="w-3 h-3 ml-1" />
                        دانلود
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>تولید گزارش سفارشی</CardTitle>
          <CardDescription>
            درخواست گزارش برای دوره زمانی مشخص
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">
              <FileText className="w-4 h-4 ml-2" />
              درخواست گزارش ماهانه
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 ml-2" />
              درخواست گزارش فصلی
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            گزارش‌های سفارشی طی 24 ساعت کاری آماده و ارسال می‌شوند.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
