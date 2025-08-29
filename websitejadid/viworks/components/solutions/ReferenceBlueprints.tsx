'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Cloud, Shield, Eye } from 'lucide-react';

const blueprints = [
  {
    icon: Server,
    title: 'On-Prem Blueprint',
    description: 'معماری برای استقرار در دیتاسنتر سازمانی',
    components: [
      'DMZ گیت‌وی‌ها',
      'شبکه اپ Backend',
      'شبکه مدیریت/مشاهده‌پذیری',
      'Workspaces ایزوله',
      'یکپارچگی SIEM/SSO'
    ]
  },
  {
    icon: Cloud,
    title: 'Cloud Blueprint',
    description: 'معماری برای استقرار در محیط ابری',
    components: [
      'گیت‌وی‌های مقیاس‌پذیر',
      'Backend HA',
      'Workspaces ایزوله',
      'پیوستگی لاگ به SIEM سازمانی',
      'اتصال امن به منابع'
    ]
  }
];

export function ReferenceBlueprints() {
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
            معماری‌های مرجع
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            معماری‌های مرجع سطح‌بالا
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            مفهومی، بدون جزییات حساس. دیاگرام‌های کامل در NDA
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {blueprints.map((blueprint, index) => (
            <motion.div
              key={blueprint.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <blueprint.icon className="w-10 h-10 text-primary mr-4" />
                <h3 className="text-2xl font-semibold">{blueprint.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {blueprint.description}
              </p>
              <ul className="space-y-3">
                {blueprint.components.map((component) => (
                  <li key={component} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {component}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold">جزئیات فنی کامل</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              برای مشاهده دیاگرام‌های فنی کامل، جریان‌های پروتکل و جزئیات پیاده‌سازی، 
              جلسه معماری تحت NDA پیشنهاد می‌شود.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              جلسه معماری تحت NDA
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
