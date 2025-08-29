'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Shield, 
  Lock, 
  Activity, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    id: 'stealth-access',
    title: 'دسترسی پنهان (SPA)',
    description: 'کاهش سطح حمله با تکنولوژی Single Packet Authorization',
    icon: Eye,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    details: [
      'پنهان‌سازی کامل سرویس در اینترنت',
      'کاهش سطح حمله به حداقل ممکن',
      'عدم شناسایی توسط ابزارهای معمول',
      'حفاظت در برابر حملات هدفمند'
    ]
  },
  {
    id: 'session-isolation',
    title: 'ایزوله‌سازی نشست کاربر',
    description: 'کاهش حرکت جانبی و جداسازی کامل نشست‌ها',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    details: [
      'جداسازی کامل نشست‌های کاربری',
      'کاهش حرکت جانبی در شبکه',
      'محیط‌های کاری ایزوله',
      'کنترل دقیق دسترسی‌ها'
    ]
  },
  {
    id: 'siem-integration',
    title: 'ثبت‌لاگ چندلایه و یکپارچگی SIEM',
    description: 'رویدادهای استانداردسازی‌شده برای انطباق و ممیزی',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    details: [
      'ثبت‌لاگ چندلایه و جامع',
      'یکپارچگی کامل با SIEM',
      'رویدادهای استانداردسازی‌شده',
      'گزارش‌های انطباق و ممیزی'
    ]
  },
  {
    id: 'web-control',
    title: 'محدودسازی درخواست‌های وب',
    description: 'فهرست مجاز مفهومی و کنترل دقیق ترافیک',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    details: [
      'فهرست مجاز مفهومی',
      'کنترل دقیق ترافیک وب',
      'مسدودسازی درخواست‌های مشکوک',
      'حفاظت در برابر تهدیدات وب'
    ]
  },
  {
    id: 'device-binding',
    title: 'احراز هویت چندلایه و اتصال دستگاه',
    description: 'احراز هویت قوی با اتصال دستگاه و MFA',
    icon: Lock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    details: [
      'احراز هویت چندلایه (MFA)',
      'اتصال دستگاه با TPM/Secure Enclave',
      'احراز هویت موبایل با Attestation',
      'مدیریت متمرکز هویت'
    ]
  },
  {
    id: 'performance-optimization',
    title: 'بهینه‌سازی عملکرد و مقیاس‌پذیری',
    description: 'عملکرد بهینه با قابلیت مقیاس‌پذیری بالا',
    icon: Zap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    details: [
      'بهینه‌سازی عملکرد شبکه',
      'مقیاس‌پذیری بالا',
      'کاهش تأخیر اتصال',
      'مدیریت منابع بهینه'
    ]
  }
];

export function FeatureGrid() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              قابلیت‌های منحصر به فرد
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              قابلیت‌های پیشرفته امنیتی
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              طراحی بر پایه Zero Trust Architecture با قابلیت‌های منحصر به فرد برای امنیت دسترسی از راه دور
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {feature.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-slate-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                قابلیت‌های پیشرفته برای نیازهای شما
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                با تیم متخصص ما مشورت کنید تا بهترین راه‌حل امنیتی را برای سازمان شما پیدا کنیم
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  درخواست دمو
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3">
                  مشاوره رایگان
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
