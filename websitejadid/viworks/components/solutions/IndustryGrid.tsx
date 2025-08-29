'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, Shield, Zap, Heart, Cpu, Users,
  TrendingDown, Eye, FileText, Lock, Activity, Globe
} from 'lucide-react';

const industries = [
  {
    icon: Building2,
    title: 'بانک و پرداخت',
    challenges: ['مقررات سخت‌گیرانه', 'دیتای حساس', 'ریسک Fraud'],
    solutions: [
      'Workspaces ایزوله برای بانک‌کور، گزارش‌گیری، و پرتال‌های تامینی',
      'RBAC + تأیید دو‌نفره برای تغییرات پرریسک، Device Binding موبایل',
      'یکپارچگی با SIEM و SSO (OIDC/SAML)'
    ],
    outcomes: ['کاهش سطح حمله', 'کاهشی در خطای انسانی', 'ممیزی کامل نشست‌ها']
  },
  {
    icon: Shield,
    title: 'دولت و حاکمیتی',
    challenges: ['طبقه‌بندی اطلاعات', 'دسترسی از شبکه‌های ناهمگون'],
    solutions: [
      'پنهان‌سازی سرویس در اینترنت، سیاست‌های زمان/مکان/ریسک',
      'Workspaces ایزوله (مرورگر/لینوکس دسکتاپ) با لاگ استاندارد'
    ],
    outcomes: ['کنترل دسترسی دقیق', 'ردیابی کامل', 'آمادگی انطباق']
  },
  {
    icon: Zap,
    title: 'انرژی و زیرساخت حیاتی',
    challenges: ['OT/ICS', 'نیاز به جداسازی دقیق'],
    solutions: [
      'دسترسی راه‌دور به HMI/پرتال‌های OT از طریق Workspaces با Egress Allow-List',
      'هشدارهای رفتاری و گزارش سلامت گیت‌وی‌ها'
    ],
    outcomes: ['کاهش ریسک Lateral Movement', 'ممیزی دقیق اپراتورها']
  },
  {
    icon: Heart,
    title: 'سلامت و بیمه',
    challenges: ['محرمانگی (PHI)', 'ردیابی دسترسی‌ها'],
    solutions: [
      'Workspace مرورگر امن برای HIS/LIS، محدودسازی مسیرها و DNS',
      'ثبت‌لاگ استاندارد و نگاشت کاربر/نشست برای ممیزی'
    ],
    outcomes: ['کاهش ریسک نشتی', 'انطباق بهتر با استانداردهای حریم خصوصی']
  },
  {
    icon: Cpu,
    title: 'فناوری، مراکز داده، DevOps',
    challenges: ['دسترسی ایمن به پرتال‌ها/گیت‌وی‌ها/DevOps Toolchain'],
    solutions: [
      'Workspaces لینوکس دسکتاپ برای عملیات، RBAC، زمان‌بندی دسترسی، Device Binding',
      'SIEM/Monitoring برای وضعیت و رخدادها، SSO یکپارچه'
    ],
    outcomes: ['کنترل دقیق دسترسی‌های حساس', 'Log استاندارد برای IR']
  },
  {
    icon: Users,
    title: 'MSP / BPO / پیمانکاران',
    challenges: ['دسترسی موقت و چندمشتری'],
    solutions: [
      'سیاست‌های موقت/مشروط، محدودیت نشست/مدت، خاتمه فوری'
    ],
    outcomes: ['کاهش ریسک دسترسی پیمانکار', 'تفکیک مشتریان']
  }
];

export function IndustryGrid() {
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
            صنایع هدف
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            راهکارهای صنعتی
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS برای صنایع مختلف راهکارهای تخصصی ارائه می‌دهد که با نیازهای خاص هر صنعت تطبیق دارد
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <industry.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">{industry.title}</h3>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                  چالش‌ها:
                </h4>
                <ul className="space-y-1">
                  {industry.challenges.map((challenge) => (
                    <li key={challenge} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  راهکار ViWorkS:
                </h4>
                <ul className="space-y-1">
                  {industry.solutions.map((solution) => (
                    <li key={solution} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Activity className="w-4 h-4 text-green-500 mr-2" />
                  خروجی‌ها:
                </h4>
                <ul className="space-y-1">
                  {industry.outcomes.map((outcome) => (
                    <li key={outcome} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">مطالعه موردی/دمو ویژه صنعت شما</h3>
            <p className="text-muted-foreground mb-6">
              برای دریافت اطلاعات بیشتر و دمو تخصصی برای صنعت شما، با تیم ما تماس بگیرید.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              مطالعه موردی/دمو ویژه صنعت شما
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
