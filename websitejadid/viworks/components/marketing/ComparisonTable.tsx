'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Zap, 
  ArrowRight,
  CheckCircle,
  X,
  Minus,
  Users,
  Globe,
  Server,
  Building
} from 'lucide-react';
import Link from 'next/link';

const solutions = [
  {
    name: 'VPN سنتی',
    icon: Lock,
    color: 'from-red-500 to-red-600',
    description: 'راه‌حل سنتی با محدودیت‌های امنیتی',
    pros: ['آشنایی بالا', 'پیاده‌سازی آسان'],
    cons: ['امنیت پایین', 'مدیریت دشوار', 'عدم انطباق']
  },
  {
    name: 'VDI/Remote Desktop',
    icon: Server,
    color: 'from-blue-500 to-blue-600',
    description: 'محیط‌های مجازی با هزینه بالا',
    pros: ['ایزوله‌سازی خوب', 'کنترل مرکزی'],
    cons: ['هزینه بالا', 'پیچیدگی عملیاتی', 'تجربه کاربری ضعیف']
  },
  {
    name: 'ZTNA معمول',
    icon: Shield,
    color: 'from-green-500 to-green-600',
    description: 'معماری اعتماد صفر با محدودیت‌ها',
    pros: ['امنیت بهتر', 'کنترل دسترسی'],
    cons: ['پیچیدگی بالا', 'هزینه متوسط', 'محدودیت پلتفرم']
  },
  {
    name: 'ViWorkS',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    description: 'راه‌حل پیشرفته با بهترین تعادل',
    pros: ['امنیت بالا', 'سهولت استفاده', 'انطباق کامل'],
    cons: ['نیاز به آموزش اولیه']
  }
];

const keyTakeaways = [
  {
    icon: Shield,
    title: 'امنیت پیشرفته',
    description: 'طراحی بر پایه Zero Trust با کاهش سطح حمله',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Zap,
    title: 'عملکرد بهینه',
    description: 'تجربه کاربری عالی با امنیت بالا',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: CheckCircle,
    title: 'انطباق کامل',
    description: 'سازگار با تمام استانداردهای امنیتی',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export function ComparisonTable() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50">
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
              مقایسه راه‌حل‌ها
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              چرا ViWorkS بهتر است؟
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              مقایسه‌ای منصفانه بین ViWorkS و سایر راه‌حل‌های دسترسی از راه دور
            </p>
          </motion.div>

          {/* Solutions Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`h-full group hover:shadow-md transition-all duration-300 border-0 bg-white shadow-sm ${
                  solution.name === 'ViWorkS' ? 'ring-2 ring-purple-500 shadow-md' : ''
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${solution.color} shadow-sm`}>
                        <solution.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className={`bg-gradient-to-r ${solution.color} text-white border-0 text-xs`}>
                        {solution.name === 'ViWorkS' ? 'پیشنهاد' : 'راه‌حل'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {solution.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Pros */}
                      <div>
                        <h4 className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          مزایا
                        </h4>
                        <ul className="space-y-1">
                          {solution.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div>
                        <h4 className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          محدودیت‌ها
                        </h4>
                        <ul className="space-y-1">
                          {solution.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {keyTakeaways.map((takeaway, index) => (
              <motion.div
                key={takeaway.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-lg ${takeaway.bgColor}`}>
                        <takeaway.icon className={`w-6 h-6 ${takeaway.color}`} />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      {takeaway.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {takeaway.description}
                    </p>
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
            className="text-center"
          >
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                جلسه فنی تحت NDA
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                برای دریافت جزئیات فنی بیشتر و مقایسه دقیق‌تر، جلسه فنی تحت NDA برگزار می‌کنیم
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                  درخواست جلسه فنی
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3">
                  دانلود مستندات
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
