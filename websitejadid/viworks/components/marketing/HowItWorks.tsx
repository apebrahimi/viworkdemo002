'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Shield, Lock, Server, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'شروع اتصال',
    description: 'کاربر روی کامپیوتر خود برنامه ViWorkS را باز می‌کند و درخواست اتصال می‌دهد. سیستم به طور خودکار بررسی می‌کند که آیا شرایط امنیتی لازم برقرار است یا نه.',
    icon: Smartphone,
    features: ['باز کردن برنامه ViWorkS', 'درخواست اتصال', 'بررسی خودکار شرایط امنیتی'],
  },
  {
    step: '02',
    title: 'احراز هویت',
    description: 'کاربر باید با اپلیکیشن موبایل ViWorkS خود را تأیید کند. این کار مثل ورود به بانک با رمز و پیامک تأیید است.',
    icon: Shield,
    features: ['تأیید با اپلیکیشن موبایل', 'احراز هویت دو مرحله‌ای', 'امنیت بالا'],
  },
  {
    step: '03',
    title: 'محیط کاری امن',
    description: 'پس از تأیید، کاربر وارد یک محیط کاری مجازی می‌شود که کاملاً جدا از کامپیوتر شخصی اوست. مثل این است که روی یک کامپیوتر جدید کار می‌کند.',
    icon: Server,
    features: ['محیط کاری مجازی', 'جدا از کامپیوتر شخصی', 'دسترسی به برنامه‌های مجاز'],
  },
  {
    step: '04',
    title: 'نظارت و کنترل',
    description: 'تمام کارهایی که کاربر انجام می‌دهد ثبت می‌شود و مدیران می‌توانند آن‌ها را ببینند. هیچ فایلی روی کامپیوتر شخصی کاربر باقی نمی‌ماند.',
    icon: Lock,
    features: ['ثبت تمام فعالیت‌ها', 'نظارت مدیران', 'عدم ذخیره فایل شخصی'],
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-slate-900">
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
                      <CardTitle className="text-lg font-bold text-white">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 mb-4">
                      {step.description}
                    </CardDescription>
                    
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-300">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
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
