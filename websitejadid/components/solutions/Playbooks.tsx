'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Building, Globe } from 'lucide-react';

const playbooks = [
  {
    icon: Users,
    title: 'Remote Workforce (کار از راه دور)',
    features: [
      { title: 'هویت و امنیت', items: ['MFA + Device Binding', 'سیاست‌های Geo/ASN/زمان'] },
      { title: 'Workspaces', items: ['Chrome/Firefox برای اپ‌های داخلی/SaaS', 'لاگ استاندارد'] },
      { title: 'شاخص‌ها', items: ['افزایش نرخ اتصال موفق امن', 'کاهش رخدادهای نقض سیاست'] }
    ]
  },
  {
    icon: Shield,
    title: 'Privileged Access (دسترسی سطح‌بالا)',
    features: [
      { title: 'سیاست‌ها', items: ['دو‌نفره برای تغییرات پرریسک', 'محدودیت زمان/تعداد نشست'] },
      { title: 'Workspaces', items: ['لینوکس دسکتاپ محدود', 'Egress Allow-List'] },
      { title: 'شاخص‌ها', items: ['کاهش تلاش‌های خارج‌ازسیاست', 'زمان واکنش پایین‌تر در IR'] }
    ]
  },
  {
    icon: Building,
    title: 'Third-Party Access (اشخاص ثالث)',
    features: [
      { title: 'توکن‌های موقت', items: ['دسترسی محدود زمانی', 'مسیرهای مشخص', 'لاگ دقیق'] },
      { title: 'Workspaces', items: ['مرورگر امن برای پرتال‌های مشتری/پیمانکار'] },
      { title: 'شاخص‌ها', items: ['کاهش ریسک نشتی', 'شفافیت ممیزی'] }
    ]
  },
  {
    icon: Globe,
    title: 'High-Assurance Projects (پروژه‌های حساس)',
    features: [
      { title: 'کنترل‌ها', items: ['سیاست‌های سختگیرانه', 'BLE Co-Presence (اختیاری)', 'Device Binding'] },
      { title: 'Workspaces', items: ['محیط‌های جداگانه', 'DNS مدیریت‌شده'] },
      { title: 'شاخص‌ها', items: ['کاهش سطح حمله', 'ممیزی کامل و قابل‌ارائه'] }
    ]
  }
];

export function Playbooks() {
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
            پلی‌بوک‌های راهکار
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            راهکارهای عملیاتی
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پلی‌بوک‌های آماده برای پیاده‌سازی سریع و مؤثر ViWorkS در سازمان شما
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {playbooks.map((playbook, index) => (
            <motion.div
              key={playbook.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <playbook.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">{playbook.title}</h3>
              </div>

              <div className="space-y-4">
                {playbook.features.map((feature, featureIndex) => (
                  <div key={feature.title}>
                    <h4 className="font-semibold mb-2 text-sm">{feature.title}</h4>
                    <ul className="space-y-1">
                      {feature.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
