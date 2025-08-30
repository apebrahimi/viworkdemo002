'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search, Receipt, CreditCard } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

export default function InvoicesPage() {
  const { isLoading } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Mock invoices data
  const invoices = [
    {
      id: 'INV-2024-001',
      number: 'INV-2024-001',
      amount: 25000000,
      currency: 'IRR',
      dueDate: '1403/09/15',
      status: 'پرداخت شده',
      issueDate: '1403/08/15',
      description: 'اشتراک ماهانه ViWorkS - پلن Enterprise',
      poNumber: 'PO-2024-001'
    },
    {
      id: 'INV-2024-002',
      number: 'INV-2024-002',
      amount: 15000000,
      currency: 'IRR',
      dueDate: '1403/10/15',
      status: 'در انتظار پرداخت',
      issueDate: '1403/09/15',
      description: 'اشتراک ماهانه ViWorkS - پلن Professional',
      poNumber: 'PO-2024-002'
    },
    {
      id: 'INV-2024-003',
      number: 'INV-2024-003',
      amount: 50000000,
      currency: 'IRR',
      dueDate: '1403/08/15',
      status: 'پرداخت شده',
      issueDate: '1403/07/15',
      description: 'اشتراک سالانه ViWorkS - پلن Enterprise',
      poNumber: 'PO-2024-003'
    }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.includes(searchTerm) || 
    invoice.description.includes(searchTerm) ||
    invoice.status.includes(searchTerm)
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'پرداخت شده':
        return 'default';
      case 'در انتظار پرداخت':
        return 'secondary';
      case 'معوق':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + currency;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">صورتحساب‌ها</h1>
          <p className="text-slate-600 mt-1">
            مدیریت صورتحساب‌ها و پرداخت‌ها
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            دانلود همه
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">کل صورتحساب‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{invoices.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">پرداخت شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-2xl font-bold text-slate-900">
                {invoices.filter(inv => inv.status === 'پرداخت شده').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">در انتظار پرداخت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-2xl font-bold text-slate-900">
                {invoices.filter(inv => inv.status === 'در انتظار پرداخت').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">مجموع مبلغ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0), 'IRR')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست صورتحساب‌ها</CardTitle>
          <CardDescription>
            مشاهده و مدیریت صورتحساب‌های صادر شده
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس شماره، توضیحات یا وضعیت..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-right p-3 font-medium text-slate-700">شماره صورتحساب</th>
                  <th className="text-right p-3 font-medium text-slate-700">توضیحات</th>
                  <th className="text-right p-3 font-medium text-slate-700">مبلغ</th>
                  <th className="text-right p-3 font-medium text-slate-700">تاریخ صدور</th>
                  <th className="text-right p-3 font-medium text-slate-700">تاریخ سررسید</th>
                  <th className="text-right p-3 font-medium text-slate-700">وضعیت</th>
                  <th className="text-right p-3 font-medium text-slate-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-slate-900">{invoice.number}</div>
                        <div className="text-sm text-slate-500">PO: {invoice.poNumber}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-slate-900 max-w-xs truncate">
                        {invoice.description}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-slate-600">
                      {invoice.issueDate}
                    </td>
                    <td className="p-3 text-sm text-slate-600">
                      {invoice.dueDate}
                    </td>
                    <td className="p-3">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 ml-1" />
                          دانلود
                        </Button>
                        {invoice.status === 'در انتظار پرداخت' && (
                          <Button size="sm">
                            <CreditCard className="w-3 h-3 ml-1" />
                            پرداخت
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">هیچ صورتحسابی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پرداخت</CardTitle>
          <CardDescription>
            جزئیات روش‌های پرداخت و اطلاعات بانکی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">روش‌های پرداخت</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">کارت به کارت</p>
                      <p className="text-sm text-slate-600">پرداخت آنلاین</p>
                    </div>
                  </div>
                  <Badge variant="outline">فعال</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">فاکتور</p>
                      <p className="text-sm text-slate-600">پرداخت 30 روزه</p>
                    </div>
                  </div>
                  <Badge variant="outline">فعال</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">اطلاعات تماس مالی</h3>
              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600">ایمیل</p>
                  <p className="font-medium text-slate-900">billing@viworks.com</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600">تلفن</p>
                  <p className="font-medium text-slate-900">021-12345678</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600">ساعات کاری</p>
                  <p className="font-medium text-slate-900">شنبه تا چهارشنبه 9-17</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
