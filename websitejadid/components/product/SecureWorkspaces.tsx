'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Chrome, Monitor, AppWindow, Clock, Shield, Eye } from 'lucide-react';

const workspaces = [
  {
    icon: Chrome,
    title: 'مرورگر امن ایزوله',
    description: 'اجرای Chrome یا Firefox در کانتینر ایزوله برای دسترسی به وب‌اپ‌های داخلی/سازمانی و SaaSهای مجاز',
    features: ['کانتینر ایزوله', 'DNS مدیریت‌شده', 'سیاست‌های خروجی', 'لاگ‌گیری کامل']
  },
  {
    icon: Monitor,
    title: 'لینوکس دسکتاپ امن',
    description: 'محیط دسکتاپ لینوکسی برای ابزارهای تحلیلی/مهندسی/DevOps با سیاست‌های خروجی و DNS کنترل‌شده',
    features: ['محیط دسکتاپ کامل', 'ابزارهای مهندسی', 'سیاست‌های خروجی', 'محدودیت نشست']
  },
  {
    icon: AppWindow,
    title: 'اپ‌های سازمانی منتخب',
    description: 'دسترسی محدود و مسیر‌بندی‌شده به پرتال‌ها و برنامه‌های داخلی',
    features: ['دسترسی محدود', 'مسیرهای مشخص', 'زمان‌بندی', 'ممیزی کامل']
  }
];

const controls = [
  {
    icon: Shield,
    title: 'سیاست‌های خروجی',
    description: 'Allow-list برای ترافیک خروجی'
  },
  {
    icon: Clock,
    title: 'زمان‌بندی دسترسی',
    description: 'محدودیت بر اساس زمان/روز'
  },
  {
    icon: Eye,
    title: 'لاگ‌گیری و ممیزی',
    description: 'ثبت کامل فعالیت‌ها با شناسه نشست'
  }
];

export function SecureWorkspaces() {
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
            پس از اتصال امن
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ورک‌اسپیس‌های امن پس از اتصال
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پس از اتصال امن، کاربر فقط به پروفایل‌های منبع تعریف‌شده توسط ادمین دسترسی دارد؛ 
            مسیرهای داخلی برای کاربر نامرئی می‌ماند.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <workspace.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">{workspace.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {workspace.description}
              </p>
              <ul className="space-y-2">
                {workspace.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-muted/30 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">
            ویژگی‌های کنترلی روی هر ورک‌اسپیس
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {controls.map((control, index) => (
              <motion.div
                key={control.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-3">
                  <control.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{control.title}</h4>
                <p className="text-sm text-muted-foreground">{control.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">دسترسی‌های موقت/مشروط</h3>
            <p className="text-muted-foreground">
              مطابق نقش/زمان/مکان/ریسک، با قابلیت خاتمه فوری توسط ادمین. 
              تمامی فعالیت‌ها قابل ممیزی و ردیابی هستند.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
