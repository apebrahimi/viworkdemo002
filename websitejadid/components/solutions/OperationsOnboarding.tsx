'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Users, Clock, Shield } from 'lucide-react';

const phases = [
  {
    icon: Rocket,
    title: 'Pilot/PoC',
    description: 'سناریوهای تست مدیریت‌شده، گزارش‌های KPI'
  },
  {
    icon: Users,
    title: 'Onboarding',
    description: 'آموزش پنل، تعریف نقش‌ها/سیاست‌ها، تعریف Workspaces'
  },
  {
    icon: Clock,
    title: 'Support',
    description: 'SLAهای ۸×۵/۱۲×۵/۲۴×۷، مسیر Escalation، پورتال مشتری'
  }
];

export function OperationsOnboarding() {
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
            عملیاتی‌سازی و استقرار
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            عملیاتی‌سازی و استقرار
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            فرآیند کامل از ارزیابی اولیه تا استقرار و پشتیبانی مداوم
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <phase.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{phase.title}</h3>
              <p className="text-muted-foreground">
                {phase.description}
              </p>
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
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold">برنامه پایلوت برای سازمان شما</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              تیم متخصص ما به شما کمک می‌کند تا بهترین برنامه استقرار را انتخاب کنید 
              و فرآیند پیاده‌سازی را به‌صورت بهینه انجام دهید.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              برنامه پایلوت برای سازمان شما
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
