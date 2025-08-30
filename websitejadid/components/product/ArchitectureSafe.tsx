'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Lock, Eye, Activity } from 'lucide-react';

const steps = [
  {
    icon: Shield,
    title: 'Gate',
    description: 'درگاه دسترسی تنها پس از درخواست معتبر در بازه محدود باز می‌شود',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: Lock,
    title: 'Secure Channel',
    description: 'کانال امن با سیاست‌های رمزنگاری سخت‌گیرانه برقرار می‌شود',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    icon: Eye,
    title: 'Authorize',
    description: 'هویت کاربر و دستگاه به‌صورت چندلایه بررسی می‌شود؛ سیاست‌های سازمان اجرا می‌گردد',
    color: 'bg-purple-500/10 text-purple-600'
  },
  {
    icon: Activity,
    title: 'Observe',
    description: 'رویدادها و لاگ‌ها به SIEM/Monitoring منتقل و قابل‌ممیزی‌اند',
    color: 'bg-orange-500/10 text-orange-600'
  }
];

export function ArchitectureSafe() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            معماری سطح بالا
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            چگونه ViWorkS کار می‌کند؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            بدون ذکر آدرس/پورت/توپولوژی، ViWorkS از چهار مرحله کلیدی برای تضمین امنیت استفاده می‌کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${step.color}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="bg-muted p-2 rounded-full">
                    <ArrowRight className="w-4 h-4 text-muted-foreground transform scale-x-[-1]" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">نکته مهم امنیتی</h3>
            <p className="text-muted-foreground">
              تمامی جزئیات فنی حساس، پیکربندی‌ها و توپولوژی‌های دقیق فقط در جلسات تحت NDA ارائه می‌شوند.
              این صفحه صرفاً مفاهیم کلی و مزایای امنیتی را نشان می‌دهد.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
