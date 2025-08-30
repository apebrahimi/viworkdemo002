'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Server, 
  Cloud, 
  Shield, 
  Settings, 
  ArrowRight,
  CheckCircle,
  Clock,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

const deploymentOptions = [
  {
    title: 'استقرار On-Prem',
    subtitle: 'کنترل کامل در دیتاسنتر شما',
    description: 'نصب و راه‌اندازی در زیرساخت سازمانی با کنترل کامل بر امنیت و عملکرد',
    icon: Server,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    accentColor: 'text-blue-600',
    features: [
      'کنترل کامل بر زیرساخت و داده‌ها',
      'انطباق کامل با سیاست‌های امنیتی سازمان',
      'یکپارچگی عمیق با سیستم‌های موجود',
      'عدم وابستگی به اینترنت برای دسترسی داخلی'
    ],
    benefits: [
      'امنیت فیزیکی کامل',
      'انطباق با استانداردهای سخت‌گیرانه',
      'کنترل کامل بر به‌روزرسانی‌ها',
      'یکپارچگی عمیق با شبکه موجود'
    ],
    requirements: [
      'سرورهای اختصاصی',
      'تیم فنی برای مدیریت',
      'زیرساخت شبکه مناسب',
      'پشتیبانی فنی داخلی'
    ],
    timeline: '4-6 هفته',
    complexity: 'متوسط',
    bestFor: 'سازمان‌های حساس و دولتی'
  },
  {
    title: 'استقرار Cloud',
    subtitle: 'راه‌اندازی سریع در ابر',
    description: 'راه‌اندازی سریع و آسان در محیط ابری با مدیریت کامل و مقیاس‌پذیری خودکار',
    icon: Cloud,
    color: 'from-emerald-600 to-emerald-700',
    bgColor: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
    accentColor: 'text-emerald-600',
    features: [
      'راه‌اندازی سریع و آسان',
      'مدیریت کامل توسط تیم ViWorkS',
      'مقیاس‌پذیری خودکار',
      'به‌روزرسانی‌های خودکار و امن'
    ],
    benefits: [
      'زمان راه‌اندازی کوتاه',
      'هزینه‌های عملیاتی پایین',
      'دسترسی از هر مکان',
      'پشتیبانی 24/7'
    ],
    requirements: [
      'اتصال اینترنت پایدار',
      'سیاست‌های امنیتی سازمانی',
      'تأیید مدیریت',
      'آموزش کاربران'
    ],
    timeline: '1-2 هفته',
    complexity: 'کم',
    bestFor: 'استارت‌آپ‌ها و شرکت‌های متوسط'
  }
];

const implementationSteps = [
  {
    step: '01',
    title: 'ارزیابی و برنامه‌ریزی',
    description: 'بررسی نیازمندی‌ها و طراحی معماری مناسب برای سازمان شما',
    duration: '1-2 هفته',
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: '02',
    title: 'نصب و پیکربندی',
    description: 'استقرار زیرساخت و پیکربندی امنیتی پیشرفته',
    duration: '2-4 هفته',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    step: '03',
    title: 'یکپارچگی و تست',
    description: 'اتصال با سیستم‌های موجود و تست‌های امنیتی جامع',
    duration: '1-2 هفته',
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: '04',
    title: 'آموزش و راه‌اندازی',
    description: 'آموزش کاربران و راه‌اندازی نهایی سیستم',
    duration: '1 هفته',
    color: 'from-orange-500 to-orange-600'
  }
];

const supportTiers = [
  {
    name: 'پشتیبانی پایه',
    description: 'پشتیبانی در ساعات کاری با پاسخگویی سریع',
    features: ['پشتیبانی 8×5', 'تیم پشتیبانی فنی', 'مستندات کامل', 'به‌روزرسانی‌های امنیتی'],
    sla: '4 ساعت',
    color: 'from-slate-500 to-slate-600',
    price: 'شامل در خرید'
  },
  {
    name: 'پشتیبانی پیشرفته',
    description: 'پشتیبانی گسترده با SLA بهتر و خدمات اضافی',
    features: ['پشتیبانی 12×5', 'مدیر اختصاصی', 'آموزش تخصصی', 'بهینه‌سازی عملکرد'],
    sla: '2 ساعت',
    color: 'from-blue-500 to-blue-600',
    price: 'پیشنهاد ویژه'
  },
  {
    name: 'پشتیبانی Enterprise',
    description: 'پشتیبانی کامل 24/7 با بالاترین SLA و خدمات اختصاصی',
    features: ['پشتیبانی 24×7', 'تیم اختصاصی', 'مشاوره امنیتی', 'بازبینی دوره‌ای'],
    sla: '1 ساعت',
    color: 'from-emerald-500 to-emerald-600',
    price: 'سفارشی'
  }
];

export function DeploymentOptions() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='deployment-pattern' x='0' y='0' width='25' height='25' patternUnits='userSpaceOnUse'%3E%3Crect x='0' y='0' width='25' height='25' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2'/%3E%3Ccircle cx='12.5' cy='12.5' r='2.5' fill='%23ffffff' fill-opacity='0.25'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='50' height='50' fill='url(%23deployment-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              گزینه‌های استقرار
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              انعطاف‌پذیری کامل در استقرار
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              انتخاب کنید که چگونه ViWorkS را در محیط شما مستقر کنید - On-Prem یا Cloud با همان سطح امنیت
            </p>
          </motion.div>

          {/* Deployment Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                  {/* Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-[1px] bg-white rounded-xl" />
                  
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${option.bgColor} border ${option.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                          <option.icon className={`h-8 w-8 ${option.accentColor}`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">{option.title}</h3>
                          <p className="text-slate-500 font-medium">{option.subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Best For */}
                    <div className="mb-8">
                      <Badge className={`bg-gradient-to-r ${option.color} text-white border-0 px-3 py-1 text-sm font-medium`}>
                        مناسب برای: {option.bestFor}
                      </Badge>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          ویژگی‌های کلیدی
                        </h4>
                        <ul className="space-y-2">
                          {option.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm text-slate-600 leading-relaxed">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          مزایا
                        </h4>
                        <ul className="space-y-2">
                          {option.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="text-sm text-slate-600 leading-relaxed">
                              • {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-orange-600" />
                          نیازمندی‌ها
                        </h4>
                        <ul className="space-y-2">
                          {option.requirements.map((requirement, requirementIndex) => (
                            <li key={requirementIndex} className="text-sm text-slate-600 leading-relaxed">
                              • {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                                        {/* Footer */}
                    <div className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{option.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">پیچیدگی: {option.complexity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Implementation Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 shadow-2xl mb-16 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="relative">
                          <div className="text-center mb-8">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">
                فرآیند پیاده‌سازی
              </Badge>
              <h3 className="text-xl font-semibold text-white mb-2">
                راه‌اندازی سریع و حرفه‌ای
              </h3>
              <p className="text-slate-300 max-w-3xl mx-auto">
                فرآیند 4 مرحله‌ای برای پیاده‌سازی موفق ViWorkS با پشتیبانی کامل تیم متخصص
              </p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {implementationSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="text-center group">
                      {/* Step Number */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                          {step.step}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-white text-lg leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {step.description}
                        </p>
                        <div className="pt-2">
                          <span className={`inline-block bg-gradient-to-r ${step.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Support Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-16 bg-white rounded-3xl p-8 lg:p-12 shadow-lg"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                سطوح پشتیبانی
              </h3>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                انتخاب سطح پشتیبانی مناسب برای نیازهای سازمانی شما
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-sm hover:shadow-lg overflow-hidden relative">
                    <div className="relative p-6">
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${tier.color} shadow-md group-hover:scale-105 transition-transform duration-300`}>
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mb-2">{tier.name}</CardTitle>
                        <CardDescription className="text-slate-600 text-sm leading-relaxed">
                          {tier.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0 font-medium px-3 py-1 text-xs`}>
                              SLA: {tier.sla}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-2 font-medium">{tier.price}</p>
                          </div>
                          <ul className="space-y-3">
                            {tier.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-3 text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
