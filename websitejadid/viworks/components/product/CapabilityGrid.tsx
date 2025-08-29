'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Shield, Lock, Smartphone, Monitor, Activity, 
  Database, Settings, Globe, Zap, Users, FileText 
} from 'lucide-react';

const capabilities = [
  {
    icon: Eye,
    title: 'دسترسی پنهان در اینترنت',
    description: 'سطح حمله نزدیک به صفر در فاز کشف/اسکن'
  },
  {
    icon: Lock,
    title: 'کلید/اعتبار اختصاصی برای هر کاربر',
    description: 'امکان ابطال/چرخش به‌صورت مجزا و بدون اختلال برای دیگران'
  },
  {
    icon: Shield,
    title: 'ایزوله‌سازی واقعی نشست‌ها',
    description: 'کاهش Lateral Movement با اجرای کاربر در محیط‌های جداگانه'
  },
  {
    icon: Monitor,
    title: 'کلاینت اختصاصی دسکتاپ',
    description: 'امن، سبک و قابل‌مدیریت (Windows/macOS/Linux)'
  },
  {
    icon: Smartphone,
    title: 'سخت‌افزار/توکن اختیاری',
    description: 'ارتقای سطح اطمینان احراز هویت (در صورت سیاست سازمان)'
  },
  {
    icon: Settings,
    title: 'محدودسازی درخواست‌های وب',
    description: 'فقط مسیرها/متدهای مجاز پردازش می‌شوند'
  },
  {
    icon: Users,
    title: 'احراز هویت چندلایه + Device Binding موبایل',
    description: 'OTP کوتاه‌عمر و سیاست‌های پویا'
  },
  {
    icon: Globe,
    title: 'جلوگیری از شنود در لایه شبکه',
    description: 'کانال امن و سیاست‌های ضدنشت DNS'
  },
  {
    icon: Activity,
    title: 'یکپارچگی با SIEM',
    description: 'رویدادهای استانداردسازی‌شده و آماده تحلیل'
  },
  {
    icon: Database,
    title: 'یکپارچگی با مانیتورینگ شبکه و SSO',
    description: 'سلامت/متریک‌های عملیاتی + اتصال به IdP سازمانی'
  },
  {
    icon: FileText,
    title: 'ثبت‌لاگ چندلایه',
    description: 'وب/نشست/کانتینر—با نگهداری و نگاشت کاربر/نشست'
  },
  {
    icon: Zap,
    title: 'هسته لینوکس سخت‌سازی‌شده',
    description: 'سطح حمله پایین؛ سرویس‌های غیرضروری غیرفعال'
  }
];

export function CapabilityGrid() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            قابلیت‌های کلیدی
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            قابلیت‌های ViWorkS
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            مجموعه‌ای از قابلیت‌های امنیتی پیشرفته که دسترسی از راه دور را برای سازمان‌های حساس قابل اتکا می‌کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-lg mr-3 flex-shrink-0">
                  <capability.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{capability.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">دو نسخه Cloud و On-Prem</h3>
            <p className="text-muted-foreground">
              با سیاست‌های امنیتی هم‌ارزش و تیونینگ برای مقیاس. 
              پایداری و کارایی در بارهای بالا.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>توجه:</strong> اعداد ظرفیت/بنچمارک دقیق فقط در اسناد تحت NDA ارائه می‌شود.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
