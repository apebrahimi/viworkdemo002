'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, BarChart3, Eye } from 'lucide-react';

const complianceFeatures = [
  {
    icon: Shield,
    title: 'کنترل‌ها',
    items: ['اصل حداقل دسترسی', 'جداسازی نقش‌ها', 'ممیزی کامل', 'تاریخچه تغییرات']
  },
  {
    icon: FileText,
    title: 'انطباق',
    items: ['مسیر آماده برای ISO 27001 / SOC 2', 'حریم خصوصی داده‌ها', 'انطباق با استانداردهای صنعتی']
  },
  {
    icon: BarChart3,
    title: 'گزارش‌دهی',
    items: ['داشبوردهای احراز هویت/نشست/سیاست/سلامت', 'گزارش‌های انطباق', 'ممیزی خودکار']
  }
];

export function ComplianceGov() {
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
            انطباق و حاکمیت
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            انطباق و حاکمیت
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS با استانداردهای انطباق و حاکمیت سازمانی سازگار است و گزارش‌های مورد نیاز را ارائه می‌دهد
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {complianceFeatures.map((feature, index) => (
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
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    {item}
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
              <h3 className="text-xl font-semibold">گزارش‌های انطباق</h3>
            </div>
            <p className="text-muted-foreground">
              داشبوردهای جامع برای ممیزی و انطباق که تمامی فعالیت‌ها، تغییرات و دسترسی‌ها را ثبت و گزارش می‌دهد.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
