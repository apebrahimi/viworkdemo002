'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Award, 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  Globe, 
  Building,
  Lock,
  Zap,
  Cpu,
  Banknote,
  Heart,
  Gavel
} from 'lucide-react';

const trustIndicators = [
  {
    icon: Award,
    title: 'ISO 27001',
    description: 'گواهینامه امنیت اطلاعات',
    status: 'تأیید شده',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    icon: Shield,
    title: 'SOC 2 Type II',
    description: 'گواهینامه کنترل‌های امنیتی',
    status: 'تأیید شده',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    icon: Lock,
    title: 'Zero Trust',
    description: 'معماری امنیتی پیشرفته',
    status: 'پیاده‌سازی شده',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    icon: Cpu,
    title: 'GDPR',
    description: 'سازگار با حریم خصوصی',
    status: 'سازگار',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
];

const customerTestimonials = [
  {
    quote: "ViWorkS به ما امکان داد تا امنیت دسترسی از راه دور را بدون قربانی کردن تجربه کاربری ارتقا دهیم. کاهش 95% در حوادث امنیتی پس از پیاده‌سازی.",
    author: "احمد محمدی",
    role: "مدیر امنیت اطلاعات",
    company: "بانک ملی",
    rating: 5,
    industry: "بانکداری"
  },
  {
    quote: "یکپارچگی آسان با سیستم‌های موجود و پشتیبانی عالی تیم فنی. ViWorkS راه‌حل کاملی برای نیازهای امنیتی ما ارائه داد.",
    author: "فاطمه احمدی",
    role: "معمار امنیت",
    company: "شرکت فناوری پیشرو",
    rating: 5,
    industry: "فناوری"
  },
  {
    quote: "انطباق کامل با استانداردهای HIPAA و عملکرد عالی. تیم ما حالا می‌تواند با اطمینان از هر مکان به سیستم‌های حساس دسترسی داشته باشد.",
    author: "دکتر علی رضایی",
    role: "مدیر IT",
    company: "مرکز درمانی تخصصی",
    rating: 5,
    industry: "سلامت"
  }
];

const securityMetrics = [
  {
    icon: Shield,
    title: 'کاهش 95%',
    description: 'حوادث امنیتی',
    color: 'text-green-600'
  },
  {
    icon: Lock,
    title: '99.9%',
    description: 'در دسترس بودن',
    color: 'text-blue-600'
  },
  {
    icon: Zap,
    title: 'کاهش 80%',
    description: 'زمان پاسخ‌دهی',
    color: 'text-purple-600'
  },
  {
    icon: Users,
    title: '100%',
    description: 'رضایت مشتریان',
    color: 'text-orange-600'
  }
];

export function TrustBar() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-blue-500/5" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              اعتماد و اطمینان
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              چرا سازمان‌ها به ViWorkS اعتماد می‌کنند؟
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              با گواهینامه‌های بین‌المللی، معماری امنیتی پیشرفته و رضایت مشتریان، ViWorkS راه‌حل مطمئن برای سازمان‌های حساس است
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-lg ${indicator.bgColor} border ${indicator.borderColor}`}>
                        <indicator.icon className={`w-6 h-6 ${indicator.color}`} />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      {indicator.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {indicator.description}
                    </p>
                    <Badge className={`${indicator.color} ${indicator.bgColor} border ${indicator.borderColor} font-medium text-xs`}>
                      {indicator.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Security Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-lg bg-slate-100">
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900 mb-2">
                      {metric.title}
                    </div>
                    <p className="text-sm text-slate-600">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Customer Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
          >
            {customerTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-base text-slate-700 mb-4 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {testimonial.author}
                        </div>
                        <div className="text-xs text-slate-600">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-slate-500">
                          {testimonial.company}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {testimonial.industry}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                به خانواده موفق ViWorkS بپیوندید
              </h3>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                با بیش از 500 سازمان موفق، ViWorkS راه‌حل اثبات‌شده برای امنیت دسترسی از راه دور است
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                  درخواست دمو
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                  مشاوره تخصصی
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

