'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Shield, Activity } from 'lucide-react';

const kpis = [
  {
    icon: TrendingUp,
    title: 'نرخ موفقیت اتصال امن',
    description: 'افزایش قابل توجه در نرخ اتصال موفق و امن'
  },
  {
    icon: Clock,
    title: 'زمان برقراری نشست',
    description: 'کاهش زمان برقراری نشست‌های امن'
  },
  {
    icon: Shield,
    title: 'نرخ خطای سیاست',
    description: 'کاهش رخدادهای خارج‌ازسیاست'
  },
  {
    icon: Activity,
    title: 'زمان واکنش به خاتمه نشست',
    description: 'بهبود زمان واکنش به رخدادهای امنیتی'
  }
];

const complianceMetrics = [
  'کامل بودن ممیزی تغییرات',
  'نسبت رخدادهای Sev-1/2',
  'زمان بستن رخداد',
  'پوشش لاگ/رویداد'
];

export function KpiOutcomes() {
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
            شاخص‌ها و خروجی‌ها
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            KPIs و خروجی‌های قابل‌سنجش
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            شاخص‌های کلیدی عملکرد و نتایج قابل اندازه‌گیری که ViWorkS برای سازمان شما فراهم می‌کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <kpi.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{kpi.title}</h3>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-muted/30 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">شاخص‌های انطباق</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceMetrics.map((metric, index) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.05 }}
                className="flex items-center"
              >
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-sm">{metric}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
