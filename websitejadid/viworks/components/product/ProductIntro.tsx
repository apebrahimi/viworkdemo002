'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Monitor, Smartphone, Laptop, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'دسترسی پنهان',
    description: 'سرویس در اینترنت پنهان است و فقط در بازه محدود و پس از درخواست معتبر قابل دسترسی می‌شود'
  },
  {
    icon: Lock,
    title: 'هویت قوی',
    description: 'احراز هویت چندلایه با Device Binding موبایل و سیاست‌های پویا (زمان/مکان/ریسک)'
  },
  {
    icon: Eye,
    title: 'ورک‌اسپیس‌های ایزوله',
    description: 'اجرای فعالیت کاربر در فضای ایزوله و قابل‌کنترل (مرورگر امن، لینوکس دسکتاپ، اپ‌های منتخب)'
  }
];

const platforms = [
  { icon: Laptop, name: 'Windows', description: 'کلاینت دسکتاپ' },
  { icon: Laptop, name: 'macOS', description: 'کلاینت دسکتاپ' },
  { icon: Laptop, name: 'Linux', description: 'کلاینت دسکتاپ' },
  { icon: Smartphone, name: 'Android', description: 'اپ موبایل' },
  { icon: Smartphone, name: 'iOS', description: 'اپ موبایل' }
];

export function ProductIntro() {
  const handleCtaClick = (type: 'demo' | 'consulting') => {
    if (type === 'demo') {
      // Implement demo request logic
      alert('Demo request clicked!');
    } else if (type === 'consulting') {
      // Implement consulting request logic
      alert('Consulting request clicked!');
    }
  };

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
            پلتفرم امن دسترسی از راه دور
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ViWorkS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            زیرساخت امن دسترسی از راه دور برای سازمان‌های حساس که سه محور را همزمان تضمین می‌کند
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6">پلتفرم‌های پشتیبانی شده</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center bg-card px-4 py-2 rounded-lg border"
              >
                <platform.icon className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium">{platform.name}</span>
                <span className="text-sm text-muted-foreground mr-2">({platform.description})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => handleCtaClick('demo')}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              مشاوره و دمو
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            استقرار: On-Prem و Cloud با پروفایل سخت‌سازی معادل
          </p>
        </motion.div>
      </div>
    </section>
  );
}
