'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, Building, Globe } from 'lucide-react';

const scenarios = [
  {
    icon: Users,
    title: 'Remote Workforce',
    description: 'دسترسی امن نیروهای توزیع‌شده به منابع سازمانی با نشست‌های ایزوله'
  },
  {
    icon: Shield,
    title: 'Privileged Access',
    description: 'دسترسی ادمین‌ها/اپراتورها با سیاست‌های سخت‌گیرانه، Device Binding و ثبت‌لاگ کامل'
  },
  {
    icon: Building,
    title: 'Third-Party & Vendor Access',
    description: 'دسترسی موقت/مشروط برای پیمانکاران با محدوده دقیق و ممیزی'
  },
  {
    icon: Globe,
    title: 'High-Assurance Workspaces',
    description: 'مرورگر امن، لینوکس دسکتاپ و اپ‌های منتخب در محیط‌های جداگانه و قابل‌کنترل'
  }
];

export function SolutionsIntro() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            راهکارهای کاربردی
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            راهکارهای ViWorkS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            ViWorkS برای چهار سناریوی اصلی طراحی شده است تا دسترسی امن از راه دور را برای سازمان‌های حساس فراهم کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <scenario.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-lg font-semibold">{scenario.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {scenario.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">راهکارهای صنعتی</h2>
            <p className="text-muted-foreground mb-6">
              ViWorkS برای صنایع مختلف از جمله بانک‌داری، دولت، انرژی، سلامت، فناوری و MSPها 
              راهکارهای تخصصی ارائه می‌دهد که با نیازهای خاص هر صنعت تطبیق دارد.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              درخواست جلسه راهکار بر اساس صنعت شما
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
