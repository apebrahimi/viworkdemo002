'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, MoreHorizontal, Mail, Shield, Users } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

export default function UsersPage() {
  const { isLoading } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Mock users data
  const users = [
    {
      id: '1',
      name: 'احمد محمدی',
      email: 'ahmad.mohammadi@company.com',
      role: 'Org Admin',
      status: 'فعال',
      authType: 'SSO',
      lastLogin: '1403/08/15 14:30',
      ssoSubject: 'ahmad.mohammadi@company.com'
    },
    {
      id: '2',
      name: 'فاطمه احمدی',
      email: 'fateme.ahmadi@company.com',
      role: 'Support Contact',
      status: 'فعال',
      authType: 'SSO',
      lastLogin: '1403/08/14 09:15',
      ssoSubject: 'fateme.ahmadi@company.com'
    },
    {
      id: '3',
      name: 'علی رضایی',
      email: 'ali.rezaei@company.com',
      role: 'Billing',
      status: 'فعال',
      authType: 'Local',
      lastLogin: '1403/08/13 16:45',
      ssoSubject: null
    },
    {
      id: '4',
      name: 'مریم کریمی',
      email: 'maryam.karimi@company.com',
      role: 'Security/Compliance',
      status: 'غیرفعال',
      authType: 'SSO',
      lastLogin: '1403/07/20 11:20',
      ssoSubject: 'maryam.karimi@company.com'
    },
    {
      id: '5',
      name: 'حسن نوری',
      email: 'hasan.nouri@company.com',
      role: 'Viewer',
      status: 'فعال',
      authType: 'Local',
      lastLogin: '1403/08/12 13:10',
      ssoSubject: null
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) || 
    user.email.includes(searchTerm) || 
    user.role.includes(searchTerm)
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Org Admin':
        return 'destructive';
      case 'Support Contact':
        return 'secondary';
      case 'Billing':
        return 'outline';
      case 'Security/Compliance':
        return 'outline';
      case 'Viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'فعال' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">کاربران و نقش‌ها</h1>
          <p className="text-slate-600 mt-1">
            مدیریت کاربران پورتال و دسترسی‌ها
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 ml-2" />
          دعوت کاربر جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">کل کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{users.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">کاربران فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.status === 'فعال').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">SSO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.authType === 'SSO').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Local Auth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.authType === 'Local').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست کاربران</CardTitle>
          <CardDescription>
            مدیریت کاربران پورتال و نقش‌های دسترسی
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
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
                  <th className="text-right p-3 font-medium text-slate-700">کاربر</th>
                  <th className="text-right p-3 font-medium text-slate-700">نقش</th>
                  <th className="text-right p-3 font-medium text-slate-700">وضعیت</th>
                  <th className="text-right p-3 font-medium text-slate-700">نوع احراز هویت</th>
                  <th className="text-right p-3 font-medium text-slate-700">آخرین ورود</th>
                  <th className="text-right p-3 font-medium text-slate-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {user.authType === 'SSO' ? (
                          <Shield className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Mail className="w-4 h-4 text-orange-600" />
                        )}
                        <span className="text-sm">{user.authType}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-slate-600">
                      {user.lastLogin}
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">هیچ کاربری یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Definitions */}
      <Card>
        <CardHeader>
          <CardTitle>تعریف نقش‌ها</CardTitle>
          <CardDescription>
            شرح مجوزهای هر نقش در پورتال
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Org Admin</h3>
                <p className="text-sm text-slate-600">
                  مالک حساب سازمان - دسترسی کامل به همه بخش‌ها و مدیریت کاربران
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Support Contact</h3>
                <p className="text-sm text-slate-600">
                  نقطه تماس پشتیبانی - ایجاد و پیگیری تیکت‌ها، مشاهده گزارش‌ها
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Billing</h3>
                <p className="text-sm text-slate-600">
                  نقش مالی - مشاهده صورتحساب‌ها و اطلاعات تمدید
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Security/Compliance</h3>
                <p className="text-sm text-slate-600">
                  ممیزی - مشاهده گزارش‌های SLA و تاریخچه پشتیبانی
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Viewer</h3>
                <p className="text-sm text-slate-600">
                  مشاهده‌گر - دسترسی فقط خواندنی به داشبورد و گزارش‌ها
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
