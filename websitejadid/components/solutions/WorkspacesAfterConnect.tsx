'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Chrome, Monitor, AppWindow, Eye } from 'lucide-react';

const workspaces = [
  {
    icon: Chrome,
    title: 'Chrome/Firefox ایزوله',
    description: 'برای وب‌اپ‌های داخلی و SaaSهای مجاز',
    features: ['کانتینر ایزوله', 'DNS مدیریت‌شده', 'سیاست‌های خروجی', 'لاگ‌گیری کامل']
  },
  {
    icon: Monitor,
    title: 'لینوکس دسکتاپ ایزوله',
    description: 'برای ابزارهای مهندسی/DevOps/تحلیل',
    features: ['محیط دسکتاپ کامل', 'ابزارهای مهندسی', 'سیاست‌های خروجی', 'محدودیت نشست']
  },
  {
    icon: AppWindow,
    title: 'اپ‌های سازمانی منتخب',
    description: 'با مسیرهای محدود و DNS مدیریت‌شده',
    features: ['دسترسی محدود', 'مسیرهای مشخص', 'زمان‌بندی', 'ممیزی کامل']
  }
];

export function WorkspacesAfterConnect() {
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
            پس از اتصال امن
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            پس از اتصال چه می‌بینید؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پس از برقراری اتصال امن و اعمال سیاست‌ها، کاربر فقط به Workspaces تعریف‌شده توسط ادمین دسترسی دارد
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
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold">نکته مهم امنیتی</h3>
            </div>
            <p className="text-muted-foreground">
              مسیرها، آدرس‌ها و توپولوژی پشت‌صحنه برای کاربر <strong>نامرئی</strong> می‌ماند. 
              کاربر فقط به آنچه ادمین مجاز کرده است دسترسی دارد و هیچ اطلاعات حساسی از زیرساخت مشاهده نمی‌کند.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
