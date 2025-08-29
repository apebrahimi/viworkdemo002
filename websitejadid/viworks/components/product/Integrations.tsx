'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Activity, Database, Settings, 
  Users, BarChart3, Zap, Globe 
} from 'lucide-react';

const integrations = [
  {
    icon: Users,
    title: 'SSO/IdP',
    description: 'اتصال به OIDC/SAML (Azure AD/ADFS/Keycloak/…)',
    features: ['احراز هویت یکپارچه', 'مدیریت متمرکز کاربران', 'پشتیبانی از استانداردهای صنعتی']
  },
  {
    icon: Activity,
    title: 'SIEM',
    description: 'ارسال رویدادهای استاندارد (احراز هویت/نشست/سیاست/سلامت)',
    features: ['رویدادهای استانداردسازی‌شده', 'همبستگی با سیستم‌های موجود', 'تحلیل امنیتی پیشرفته']
  },
  {
    icon: Database,
    title: 'Monitoring/NOC',
    description: 'متریک‌ها/هشدارها برای سلامت گیت‌وی/نشست‌ها',
    features: ['نظارت بر سلامت سیستم', 'هشدارهای پیش‌بینی‌شده', 'گزارش‌های عملکرد']
  },
  {
    icon: Settings,
    title: 'ITSM (اختیاری)',
    description: 'تیکتینگ/اتومیشن (ServiceNow/JSM) از طریق وب‌هوک/API',
    features: ['اتومیشن فرآیندها', 'یکپارچگی با سیستم‌های موجود', 'مدیریت تغییرات']
  }
];

const benefits = [
  {
    icon: Shield,
    title: 'امنیت یکپارچه',
    description: 'ادغام کامل با اکوسیستم امنیتی موجود سازمان'
  },
  {
    icon: BarChart3,
    title: 'گزارش‌گیری پیشرفته',
    description: 'داشبوردهای جامع و گزارش‌های قابل تنظیم'
  },
  {
    icon: Zap,
    title: 'اتومیشن',
    description: 'کاهش کار دستی و افزایش کارایی عملیاتی'
  },
  {
    icon: Globe,
    title: 'استانداردهای صنعتی',
    description: 'پشتیبانی از پروتکل‌ها و استانداردهای رایج'
  }
];

export function Integrations() {
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
            یکپارچگی‌ها
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            یکپارچگی با سیستم‌های موجود
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS به‌راحتی با زیرساخت‌های موجود سازمان شما یکپارچه می‌شود و 
            ارزش سرمایه‌گذاری‌های قبلی شما را حفظ می‌کند
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <integration.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">{integration.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {integration.description}
              </p>
              <ul className="space-y-2">
                {integration.features.map((feature) => (
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
          className="mb-12"
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">مزایای یکپارچگی</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-3">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">مستندات و راهنماها</h3>
            <p className="text-muted-foreground mb-6">
              جزئیات فنی عمیق یکپارچگی‌ها در بخش منابع موجود است. 
              برای اطلاعات بیشتر و راهنمای پیاده‌سازی، با تیم فنی ما تماس بگیرید.
            </p>
            <div className="flex justify-center">
              <Button>
                گفت‌وگو درباره یکپارچگی‌ها
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
