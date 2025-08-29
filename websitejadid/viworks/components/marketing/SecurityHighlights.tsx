'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Activity, Settings } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { analytics } from '@/lib/analytics';

const securityFeatures = [
  {
    title: 'اصل حداقل دسترسی و جداسازی نقش‌ها',
    description: 'کاربران تنها به منابع مجاز دسترسی دارند',
    icon: Shield,
  },
  {
    title: 'رمزنگاری به‌روز و سیاست‌های ارتباطی سخت‌گیرانه',
    description: 'استفاده از پروتکل‌های امنیتی مدرن',
    icon: Lock,
  },
  {
    title: 'عدم ذخیره‌سازی دائم اسرار حساس در کلاینت',
    description: 'مدیریت in-memory برای امنیت بیشتر',
    icon: Eye,
  },
  {
    title: 'ثبت‌لاگ پیش‌فرض، ممیزی و ردیابی سازمانی',
    description: 'قابلیت ممیزی کامل تمام فعالیت‌ها',
    icon: Activity,
  },
  {
    title: 'امکان اعمال سیاست‌های پویا',
    description: 'زمان/مکان/ریسک با تأیید ادمین',
    icon: Settings,
  },
];



export function SecurityHighlights() {
  const handleReadMoreClick = () => {
    analytics.securityHighlightsReadMoreClick();
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Shield className="w-3 h-3 mr-2" />
              اصول امنیتی
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              نکات امنیتی کلیدی
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              اصول و کنترل‌های امنیتی که ViWorkS را برای سازمان‌های حساس قابل اعتماد می‌کند
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
              >
                <Card className="h-full border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors">
                  <CardHeader className="pb-4">
                                          <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-600">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-base font-semibold text-white">{feature.title}</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>



          {/* CTA */}
          <div className="text-center">
            <ModernButton 
              href="/security"
              variant="outline"
              size="lg"
              onClick={handleReadMoreClick}
            >
              رویکرد امنیتی وی وُرک
            </ModernButton>
          </div>
        </div>
      </div>
    </section>
  );
}
