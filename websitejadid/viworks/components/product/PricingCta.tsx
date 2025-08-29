'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Clock, Shield } from 'lucide-react';

const pricingFeatures = [
  {
    icon: Users,
    title: 'مدل سازمانی',
    description: 'براساس تعداد کاربران/محیط‌ها و دامنه خدمات'
  },
  {
    icon: Clock,
    title: 'گزینه‌های پشتیبانی',
    description: '۸×۵ · ۱۲×۵ · ۲۴×۷'
  },
  {
    icon: Shield,
    title: 'انطباق کامل',
    description: 'مطابق با استانداردهای صنعتی و انطباق'
  }
];

export function PricingCta() {
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
            قیمت‌گذاری و لایسنس
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            قیمت‌گذاری سازمانی
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            مدل قیمت‌گذاری شفاف و انعطاف‌پذیر که با نیازهای سازمانی شما تطبیق دارد
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border border-primary/20 mb-12"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-full mb-6">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">درخواست پیشنهاد قیمت</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              برای دریافت پیشنهاد قیمت دقیق و سفارشی‌سازی شده برای سازمان شما، 
              با تیم فروش ما تماس بگیرید. ما نیازهای شما را بررسی کرده و 
              بهترین راهکار را پیشنهاد می‌دهیم.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                درخواست پیشنهاد قیمت
              </Button>
              <Button size="lg" variant="outline">
                صحبت با تیم فروش
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">اطلاعات بیشتر</h3>
            <p className="text-muted-foreground text-sm">
              برای اطلاعات بیشتر درباره قیمت‌گذاری، لایسنس‌ها و گزینه‌های پشتیبانی، 
              به صفحه پلان‌های پشتیبانی مراجعه کنید یا با ما تماس بگیرید.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
