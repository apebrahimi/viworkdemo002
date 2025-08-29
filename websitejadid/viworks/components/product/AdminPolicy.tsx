'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Clock, Eye, Settings, UserCheck } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'RBAC',
    description: 'نقش‌های Admin/Operator/Auditor/User با تفکیک وظایف'
  },
  {
    icon: Shield,
    title: 'سیاست‌های پویا',
    description: 'زمان/مکان/ASN/ریسک + Device Binding؛ تأیید دو نفره برای تغییرات پرریسک'
  },
  {
    icon: Clock,
    title: 'مدیریت نشست',
    description: 'مشاهده نشست‌های فعال/تاریخی، خاتمه فوری، محدودیت زمان و تعداد نشست'
  },
  {
    icon: Settings,
    title: 'پروفایل‌های منبع',
    description: 'تعریف ورک‌اسپیس‌ها، سیاست‌های خروجی/DNS و زمان‌بندی'
  }
];

const roles = [
  {
    title: 'Admin',
    description: 'دسترسی کامل به تمامی تنظیمات و مدیریت کاربران',
    permissions: ['مدیریت کاربران', 'تعریف سیاست‌ها', 'مشاهده لاگ‌ها', 'تنظیمات سیستم']
  },
  {
    title: 'Operator',
    description: 'مدیریت عملیاتی روزانه و نظارت بر نشست‌ها',
    permissions: ['مدیریت نشست‌ها', 'نظارت بر وضعیت', 'پاسخ به هشدارها', 'گزارش‌گیری']
  },
  {
    title: 'Auditor',
    description: 'دسترسی فقط خواندنی برای ممیزی و انطباق',
    permissions: ['مشاهده لاگ‌ها', 'گزارش‌های انطباق', 'تاریخچه تغییرات', 'ممیزی دسترسی']
  },
  {
    title: 'User',
    description: 'دسترسی محدود به ورک‌اسپیس‌های مجاز',
    permissions: ['اتصال به ورک‌اسپیس‌ها', 'استفاده از ابزارهای مجاز', 'مشاهده وضعیت خود']
  }
];

export function AdminPolicy() {
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
            مدیریت و سیاست
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            مدیریت و سیاست‌گذاری
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            سیستم مدیریتی قدرتمند با کنترل‌های دقیق و سیاست‌های پویا برای سازمان‌های حساس
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <feature.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">نقش‌های کاربری (RBAC)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <UserCheck className="w-6 h-6 text-primary mr-2" />
                  <h4 className="font-semibold text-lg">{role.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {role.description}
                </p>
                <ul className="space-y-1">
                  {role.permissions.map((permission) => (
                    <li key={permission} className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-muted/30 p-8 rounded-lg"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 text-primary mr-2" />
                سیاست‌های پویا
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• محدودیت بر اساس زمان (ساعت/روز/هفته)</li>
                <li>• محدودیت جغرافیایی (IP/ASN/کشور)</li>
                <li>• ارزیابی ریسک پویا</li>
                <li>• Device Binding موبایل</li>
                <li>• تأیید دو نفره برای تغییرات حساس</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 text-primary mr-2" />
                نظارت و ممیزی
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• مشاهده نشست‌های فعال در زمان واقعی</li>
                <li>• تاریخچه کامل فعالیت‌ها</li>
                <li>• خاتمه فوری نشست‌های مشکوک</li>
                <li>• گزارش‌های انطباق و ممیزی</li>
                <li>• هشدارهای رفتاری غیرعادی</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
