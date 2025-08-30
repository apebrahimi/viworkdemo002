'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowRight, FileText, Calendar, TrendingUp, Info, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContractRenewalPage() {
  const { isLoading, contract } = usePortal();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    type: '',
    plan: '',
    duration: '',
    additionalUsers: '',
    additionalFeatures: '',
    comments: ''
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
      
      // Redirect to contracts page with success message
      router.push('/portal/contracts?renewal=success');
    } catch (error) {
      console.error('Error submitting renewal request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">درخواست تمدید قرارداد</h1>
          <p className="text-slate-600 mt-1">
            درخواست تمدید یا ارتقای قرارداد فعلی
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowRight className="w-4 h-4 ml-2 transform scale-x-[-1]" />
          بازگشت
        </Button>
      </div>

      {/* Current Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            قرارداد فعلی
          </CardTitle>
          <CardDescription>
            اطلاعات قرارداد موجود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-900">شماره قرارداد</span>
              </div>
              <p className="text-sm text-slate-600">{contract?.number || 'CON-2024-001'}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-slate-900">پلن فعلی</span>
              </div>
              <p className="text-sm text-slate-600">{contract?.plan || 'Enterprise'}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-slate-900">تاریخ انقضا</span>
              </div>
              <p className="text-sm text-slate-600">{contract?.end_date || '1403/12/29'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              نوع درخواست
            </CardTitle>
            <CardDescription>
              انتخاب نوع درخواست تمدید یا ارتقا
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  requestData.type === 'renewal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setRequestData(prev => ({ ...prev, type: 'renewal' }))}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`w-5 h-5 ${requestData.type === 'renewal' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-slate-900">تمدید قرارداد</span>
                </div>
                <p className="text-sm text-slate-600">
                  تمدید قرارداد فعلی با همان شرایط
                </p>
              </div>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  requestData.type === 'upgrade'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setRequestData(prev => ({ ...prev, type: 'upgrade' }))}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-5 h-5 ${requestData.type === 'upgrade' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-slate-900">ارتقای پلن</span>
                </div>
                <p className="text-sm text-slate-600">
                  ارتقا به پلن بالاتر با قابلیت‌های بیشتر
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        {requestData.type && (
          <Card>
            <CardHeader>
              <CardTitle>انتخاب پلن</CardTitle>
              <CardDescription>
                انتخاب پلن مورد نظر برای تمدید یا ارتقا
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Professional',
                    price: '15,000,000',
                    period: 'ماهانه',
                    features: ['تا 50 کاربر', 'پشتیبانی 8/5', 'گزارش‌های پایه']
                  },
                  {
                    name: 'Enterprise',
                    price: '25,000,000',
                    period: 'ماهانه',
                    features: ['نامحدود کاربر', 'پشتیبانی 24/7', 'گزارش‌های پیشرفته', 'SLA تضمین شده']
                  },
                  {
                    name: 'Enterprise Plus',
                    price: '40,000,000',
                    period: 'ماهانه',
                    features: ['همه قابلیت‌های Enterprise', 'پشتیبانی اختصاصی', 'مشاوره تخصصی', 'آموزش تیم']
                  }
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      requestData.plan === plan.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setRequestData(prev => ({ ...prev, plan: plan.name }))}
                  >
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-blue-600">{plan.price}</span>
                        <span className="text-sm text-slate-600"> {plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Duration */}
        {requestData.plan && (
          <Card>
            <CardHeader>
              <CardTitle>مدت قرارداد</CardTitle>
              <CardDescription>
                انتخاب مدت زمان قرارداد جدید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: '1-month', label: '1 ماه', discount: '0%' },
                  { value: '6-months', label: '6 ماه', discount: '5%' },
                  { value: '12-months', label: '12 ماه', discount: '15%' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      requestData.duration === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setRequestData(prev => ({ ...prev, duration: option.value }))}
                  >
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-slate-900">{option.label}</h3>
                      <p className="text-sm text-green-600 mt-1">تخفیف {option.discount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Requirements */}
        {requestData.duration && (
          <Card>
            <CardHeader>
              <CardTitle>نیازهای اضافی</CardTitle>
              <CardDescription>
                مشخص کردن نیازهای اضافی (اختیاری)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    تعداد کاربران اضافی
                  </label>
                  <Input
                    value={requestData.additionalUsers}
                    onChange={(e) => setRequestData(prev => ({ ...prev, additionalUsers: e.target.value }))}
                    placeholder="تعداد کاربران اضافی مورد نیاز"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    قابلیت‌های اضافی
                  </label>
                  <Input
                    value={requestData.additionalFeatures}
                    onChange={(e) => setRequestData(prev => ({ ...prev, additionalFeatures: e.target.value }))}
                    placeholder="قابلیت‌های خاص مورد نیاز"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  توضیحات اضافی
                </label>
                <textarea
                  value={requestData.comments}
                  onChange={(e) => setRequestData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="توضیحات یا درخواست‌های خاص..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-vertical"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              اطلاعات مهم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">فرآیند بررسی</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    درخواست شما طی 24 ساعت کاری بررسی و با شما تماس گرفته خواهد شد.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">تخفیف‌های ویژه</h4>
                  <p className="text-sm text-green-700 mt-1">
                    قراردادهای بلندمدت شامل تخفیف‌های ویژه می‌شوند.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            انصراف
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !requestData.type || !requestData.plan || !requestData.duration}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال ارسال...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                ارسال درخواست
                <ArrowRight className="w-4 h-4 transform scale-x-[-1]" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
