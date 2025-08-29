'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Shield, Network } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'طراحی برای ترافیک سازمانی',
    description: 'کنترل نشست‌های متعدد با بهینه‌سازی ویژه'
  },
  {
    icon: TrendingUp,
    title: 'تیونینگ شبکه/کرنل',
    description: 'بهینه‌سازی مسیر برای latency و throughput بهتر'
  },
  {
    icon: Shield,
    title: 'بدون فشرده‌سازی ناامن',
    description: 'سیاست‌های MTU/MSS و Keepalive مطابق بهترین‌عمل‌ها'
  },
  {
    icon: Network,
    title: 'افزایش افقی',
    description: 'قابلیت افزایش افقی گیت‌وی‌ها و توزیع بار (DNS/LB)'
  }
];

const optimizations = [
  'بهینه‌سازی مسیر شبکه',
  'مدیریت حافظه پیشرفته',
  'کش‌های چندلایه',
  'توزیع بار هوشمند',
  'مقیاس‌پذیری خودکار',
  'نظارت بر عملکرد'
];

export function PerfScale() {
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
            کارایی و مقیاس
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            کارایی و مقیاس‌پذیری
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS برای سازمان‌های بزرگ طراحی شده و قابلیت‌های مقیاس‌پذیری پیشرفته ارائه می‌دهد
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
          className="bg-card p-8 rounded-lg border mb-12"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">بهینه‌سازی‌های کلیدی</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimizations.map((optimization, index) => (
              <motion.div
                key={optimization}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                className="flex items-center"
              >
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-sm">{optimization}</span>
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
          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-200">
              اطلاعات دقیق عملکرد
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              اعداد ظرفیت/بنچمارک دقیق فقط در اسناد تحت NDA ارائه می‌شود. 
              برای اطلاعات دقیق عملکرد، با تیم فنی ما تماس بگیرید.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
