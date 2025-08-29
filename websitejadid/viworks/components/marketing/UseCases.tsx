'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Building, 
  Shield, 
  Users, 
  Globe, 
  Lock, 
  Eye, 
  Zap,
  ArrowRight,
  CheckCircle,
  Banknote,
  Heart,
  Cpu,
  Gavel,
  Factory
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const useCases = [
  {
    title: 'دسترسی امن نیروی کار دور',
    description: 'کارمندان از هر مکان با امنیت کامل به منابع سازمانی دسترسی دارند',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      'دسترسی پنهان و غیرقابل شناسایی',
      'احراز هویت چندلایه با دستگاه موبایل',
      'ایزوله‌سازی نشست‌های کاربری',
      'نظارت کامل و ثبت‌لاگ سازمانی'
    ]
  },
  {
    title: 'دسترسی ممتاز امن',
    description: 'مدیریت امن دسترسی‌های ممتاز با کنترل دقیق و ممیزی کامل',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      'دسترسی موقت و زمان‌بندی‌شده',
      'تأیید دو نفره برای دسترسی‌های حساس',
      'ثبت‌لاگ کامل تمام فعالیت‌ها',
      'ابطال فوری دسترسی در صورت نیاز'
    ]
  },
  {
    title: 'دسترسی امن طرف سوم',
    description: 'دسترسی موقت و کنترل‌شده برای پیمانکاران و شرکای تجاری',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: [
      'دسترسی محدود و زمان‌بندی‌شده',
      'ایزوله‌سازی کامل از شبکه اصلی',
      'نظارت لحظه‌ای بر فعالیت‌ها',
      'خاتمه خودکار دسترسی پس از اتمام کار'
    ]
  }
];

const industries = [
  {
    name: 'بانکداری و مالی',
    icon: Banknote,
    image: '/images/banking.jpg.webp',
    description: 'امنیت بالا برای دسترسی به سیستم‌های مالی حساس',
    challenges: ['انطباق با PCI DSS', 'حفاظت از داده‌های مالی', 'نظارت بر دسترسی‌های ممتاز'],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'سلامت و درمان',
    icon: Heart,
    image: '/images/healthcare.png',
    description: 'حفاظت از اطلاعات پزشکی و انطباق با HIPAA',
    challenges: ['انطباق با HIPAA', 'حفاظت از PHI', 'دسترسی محدود به داده‌های حساس'],
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    name: 'فناوری اطلاعات',
    icon: Cpu,
    image: '/images/tech.jpg',
    description: 'امنیت برای شرکت‌های فناوری و استارتاپ‌ها',
    challenges: ['حفاظت از IP', 'دسترسی توسعه‌دهندگان', 'امنیت کد و داده‌ها'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'امنیت و دفاع',
    icon: Shield,
    image: '/images/security.jpeg',
    description: 'امنیت بالا برای سازمان‌های امنیتی و دفاعی',
    challenges: ['امنیت اطلاعات محرمانه', 'دسترسی‌های طبقه‌بندی‌شده', 'انطباق با استانداردهای امنیتی'],
    color: 'text-slate-600',
    bgColor: 'bg-slate-50'
  },
  {
    name: 'صنعت و تولید',
    icon: Factory,
    image: '/images/manufactoring.jpg',
    description: 'امنیت برای سیستم‌های صنعتی و تولیدی',
    challenges: ['حفاظت از سیستم‌های SCADA', 'دسترسی مهندسان', 'امنیت فرآیندهای تولید'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

export function UseCases() {
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
              موارد استفاده و صنایع
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              راه‌حل‌های امنیتی برای هر نیاز
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              ViWorkS برای طیف گسترده‌ای از موارد استفاده و صنایع طراحی شده است
            </p>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg ${useCase.bgColor} border ${useCase.borderColor}`}>
                          <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-900">{useCase.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm text-slate-600">
                        {useCase.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {useCase.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Industries */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                راه‌حل‌های تخصصی برای صنایع مختلف
              </h3>
              <p className="text-slate-600">
                ViWorkS برای نیازهای خاص هر صنعت طراحی شده است
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group cursor-pointer"
                >
                  {/* Industry Image - No Box, Rounded Corners */}
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.error(`Failed to load image: ${industry.image}`);
                      }}
                    />
                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Industry Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <industry.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h4 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                        {industry.name}
                      </h4>
                      <p className="text-sm text-white/90 mb-4 drop-shadow-md">
                        {industry.description}
                      </p>
                      
                      {/* Challenges as Modern Tags */}
                      <div className="flex flex-wrap gap-2">
                        {industry.challenges.map((challenge, challengeIndex) => (
                          <span 
                            key={challengeIndex} 
                            className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30"
                          >
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                راه‌حل مناسب برای نیازهای شما
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                با تیم متخصص ما مشورت کنید تا بهترین راه‌حل امنیتی را برای سازمان شما پیدا کنیم
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  مشاهده راهکارهای تخصصی
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
