'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Server, Shield, Zap } from 'lucide-react';

const deploymentOptions = [
  {
    icon: Server,
    title: 'On-Prem',
    description: 'در دیتاسنتر شما، با مسیرهای انطباق سختگیرانه',
    features: ['کنترل کامل زیرساخت', 'انطباق با سیاست‌های داخلی', 'ایزوله‌سازی شبکه', 'مدیریت مستقیم']
  },
  {
    icon: Cloud,
    title: 'Cloud',
    description: 'استقرار سریع با سیاست‌های سخت‌سازی هم‌سطح',
    features: ['استقرار سریع', 'مقیاس‌پذیری خودکار', 'مدیریت زیرساخت', 'به‌روزرسانی‌های خودکار']
  }
];

const pilotFeatures = [
  {
    icon: Shield,
    title: 'سناریوهای پایلوت',
    description: 'با داده‌های تست و داشبورد ارزیابی'
  },
  {
    icon: Zap,
    title: 'ارزیابی عملکرد',
    description: 'تست‌های امنیتی و کارایی'
  }
];

export function DeploymentStrip() {
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
            گزینه‌های استقرار
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            استقرار انعطاف‌پذیر
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS را مطابق نیازهای سازمانی و سیاست‌های امنیتی خود مستقر کنید
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {deploymentOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <option.icon className="w-10 h-10 text-primary mr-4" />
                <h3 className="text-2xl font-semibold">{option.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {option.description}
              </p>
              <ul className="space-y-3">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-muted/30 p-8 rounded-lg mb-12"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Pilot/PoC</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {pilotFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-3">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">مشاوره استقرار</h3>
            <p className="text-muted-foreground mb-6">
              تیم متخصص ما به شما کمک می‌کند تا بهترین گزینه استقرار را انتخاب کنید 
              و فرآیند پیاده‌سازی را به‌صورت بهینه انجام دهید.
            </p>
            <Button size="lg">
              مشاوره استقرار
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
