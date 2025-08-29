'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Minus, ArrowRight } from 'lucide-react';

const alternatives = [
  'VPN سنتی + Jump',
  'RBI ساده',
  'ZTNA معمول',
  'Horizon (VDI)',
  'Microsoft RDP/AVD',
  'ViWorkS'
];

const criteria = [
  {
    name: 'پنهان بودن سرویس در اینترنت',
    values: ['خیر', 'خیر', 'متغیر', 'معمولاً خیر', 'معمولاً خیر', 'بله (Stealth Gate)']
  },
  {
    name: 'احراز هویت چندلایه + Device Binding',
    values: ['محدود', 'محدود', 'متغیر', 'پیکربندی‌پذیر', 'پیکربندی‌پذیر', 'پیش‌فرض']
  },
  {
    name: 'ایزوله‌سازی نشست کاربر',
    values: ['کم', 'متوسط', 'متغیر', 'خوب (VDI)', 'خوب (RDS/AVD)', 'بالا (کانتینر/پروفایل)']
  },
  {
    name: 'عدم افشای جزییات حساس به کلاینت',
    values: ['ضعیف', 'متوسط', 'متغیر', 'متوسط', 'متوسط', 'قوی (In-Memory/Workspace)']
  },
  {
    name: 'ثبت‌لاگ سازمانی (SIEM-Ready)',
    values: ['متغیر', 'محدود', 'متغیر', 'خوب', 'خوب', 'یکپارچه و استاندارد']
  },
  {
    name: 'سیاست‌های پویا زمان/مکان/ریسک',
    values: ['محدود', 'محدود', 'متغیر', 'نیاز به افزونه/تنظیمات', 'نیاز به افزونه/تنظیمات', 'هستهٔ محصول']
  },
  {
    name: 'هزینه/پیچیدگی عملیاتی',
    values: ['پایین/متوسط', 'متوسط', 'متوسط', 'بالا', 'متوسط', 'متعادل']
  },
  {
    name: 'سازگاری کلاینت (Win/macOS/Linux)',
    values: ['متغیر', 'بسته به محصول', 'متغیر', 'خوب (با Agent)', 'خوب (با Client)', 'بله (سه‌گانه)']
  },
  {
    name: 'SSO/IdP',
    values: ['متغیر', 'محدود', 'متغیر', 'قابل‌اتصال', 'قابل‌اتصال', 'یکپارچه']
  },
  {
    name: 'سناریوهای High-Security',
    values: ['ضعیف', 'متوسط', 'متوسط', 'خوب', 'خوب', 'قوی (Stealth + Binding + Isolation)']
  }
];

const getValueIcon = (value: string, isViWorkS: boolean) => {
  if (isViWorkS) {
    return <Check className="w-4 h-4 text-green-600" />;
  }
  
  if (value.includes('خوب') || value.includes('بله') || value.includes('قوی') || value.includes('بالا')) {
    return <Check className="w-4 h-4 text-green-600" />;
  } else if (value.includes('متوسط') || value.includes('متغیر') || value.includes('متعادل')) {
    return <Minus className="w-4 h-4 text-yellow-600" />;
  } else {
    return <X className="w-4 h-4 text-red-600" />;
  }
};

export function ComparisonTable() {
  const handleCtaClick = (type: 'demo' | 'nda') => {
    if (type === 'demo') {
      // Redirect to demo page
      window.location.href = '/demo';
    } else if (type === 'nda') {
      // Redirect to NDA page
      window.location.href = '/nda';
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            مقایسه با گزینه‌های رایج
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            چرا ViWorkS؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            مقایسه عمومی برای درک تفاوت رویکرد؛ جزییات فنی عمیق فقط تحت NDA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-full bg-card rounded-lg border shadow-sm">
            <div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/50">
              <div className="font-semibold text-sm">معیار</div>
              {alternatives.map((alt, index) => (
                <div key={alt} className={`font-semibold text-sm text-center ${index === alternatives.length - 1 ? 'text-primary' : ''}`}>
                  {alt}
                </div>
              ))}
            </div>
            
            {criteria.map((criterion, index) => (
              <div key={criterion.name} className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-muted/30 transition-colors">
                <div className="text-sm font-medium">{criterion.name}</div>
                {criterion.values.map((value, valueIndex) => (
                  <div key={valueIndex} className={`text-xs text-center flex items-center justify-center ${valueIndex === criterion.values.length - 1 ? 'text-primary font-medium' : ''}`}>
                    <div className="flex items-center gap-2">
                      {getValueIcon(value, valueIndex === criterion.values.length - 1)}
                      <span className="hidden sm:inline">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">نتیجه‌گیری</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              اگر <strong>پنهان‌سازی سرویس، هویت قوی دستگاه/کاربر، ایزوله‌سازی نشست، و ممیزی سازمانی</strong> معیار اصلی شماست، 
              ViWorkS گزینۀ تمیز و متمرکزی ارائه می‌دهد—بدون پیچیدگی‌های سنگین VDI کامل یا ضعف‌های VPN سنتی/Proxy.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleCtaClick('demo')}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                مشاوره و دمو
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>توجه:</strong> این مقایسه عمومی است. برای جزئیات فنی عمیق و ارزیابی دقیق، 
              جلسه فنی تحت NDA پیشنهاد می‌شود.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
