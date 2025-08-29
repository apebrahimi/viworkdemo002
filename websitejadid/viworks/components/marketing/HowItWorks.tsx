'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Shield, Lock, Server, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'شروع اتصال',
    description: 'کاربر با اجرای کلاینت اختصاصی ViWorkS درخواست اتصال را آغاز می‌کند. سیستم به صورت خودکار پیش‌نیازهای امنیتی را بررسی و تأیید می‌نماید.',
    icon: Smartphone,
  },
  {
    step: '02',
    title: 'احراز هویت',
    description: 'احراز هویت دو مرحله‌ای از طریق اپلیکیشن موبایل ViWorkS انجام می‌شود که امنیت بالایی را تضمین می‌کند.',
    icon: Shield,
  },
  {
    step: '03',
    title: 'محیط کاری امن',
    description: 'پس از احراز هویت، کاربر وارد محیط کاری مجازی می‌شود که کاملاً از سیستم شخصی وی جدا بوده و دسترسی محدود به منابع مجاز دارد.',
    icon: Server,
  },
  {
    step: '04',
    title: 'نظارت و کنترل',
    description: 'تمام فعالیت‌های کاربر ثبت و قابل نظارت است. هیچ داده‌ای روی دستگاه شخصی کاربر باقی نمی‌ماند و امنیت کامل تضمین می‌شود.',
    icon: Lock,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-35">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='howitworks-pattern' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.25'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23howitworks-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Shield className="w-3 h-3 mr-2" />
              فرآیند ساده و امن
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              نحوه عملکرد
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              چهار مرحله ساده برای دسترسی امن از راه دور
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, index) => (
              <div key={step.step}>
                <Card className="h-full border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors relative">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-600">
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-black">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-black">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">
                محیط کاری امن
              </h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto">
                در محیط ایزوله، تنها برنامه‌ها و منابع از پیش‌تعریف‌شده مانند مرورگرهای امن (Chrome/Firefox) 
                یا دسکتاپ‌های لینوکسی/ویندوزی با دسترسی محدود در اختیار کاربر قرار می‌گیرد. 
                هیچ داده‌ای روی دستگاه شخصی ماندگار نمی‌ماند و تمام فعالیت‌ها قابل ردیابی است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
