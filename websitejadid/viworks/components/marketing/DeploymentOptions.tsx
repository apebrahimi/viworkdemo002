'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Server, 
  Cloud, 
  Shield, 
  Zap, 
  Settings, 
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Building,
  Globe,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const deploymentOptions = [
  {
    title: 'استقرار On-Prem',
    description: 'نصب و راه‌اندازی در دیتاسنتر شما با کنترل کامل',
    icon: Server,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-500/10 to-blue-600/10',
    borderColor: 'border-blue-500/20',
    features: [
      'کنترل کامل بر زیرساخت و داده‌ها',
      'انطباق کامل با سیاست‌های امنیتی سازمان',
      'یکپارچگی با سیستم‌های موجود',
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
    complexity: 'متوسط'
  },
  {
    title: 'استقرار Cloud',
    description: 'راه‌اندازی سریع در محیط ابری با مدیریت کامل',
    icon: Cloud,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-500/10 to-green-600/10',
    borderColor: 'border-green-500/20',
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
    complexity: 'کم'
  }
];

const implementationSteps = [
  {
    step: '01',
    title: 'ارزیابی و برنامه‌ریزی',
    description: 'بررسی نیازمندی‌ها و طراحی معماری مناسب',
    icon: Settings,
    duration: '1-2 هفته'
  },
  {
    step: '02',
    title: 'نصب و پیکربندی',
    description: 'استقرار زیرساخت و پیکربندی امنیتی',
    icon: Shield,
    duration: '2-4 هفته'
  },
  {
    step: '03',
    title: 'یکپارچگی و تست',
    description: 'اتصال با سیستم‌های موجود و تست‌های امنیتی',
    icon: Zap,
    duration: '1-2 هفته'
  },
  {
    step: '04',
    title: 'آموزش و راه‌اندازی',
    description: 'آموزش کاربران و راه‌اندازی نهایی',
    icon: Users,
    duration: '1 هفته'
  }
];

const supportTiers = [
  {
    name: 'پشتیبانی پایه',
    description: 'پشتیبانی در ساعات کاری',
    features: ['پشتیبانی 8×5', 'تیم پشتیبانی فنی', 'مستندات کامل', 'به‌روزرسانی‌های امنیتی'],
    sla: '4 ساعت',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'پشتیبانی پیشرفته',
    description: 'پشتیبانی گسترده با SLA بهتر',
    features: ['پشتیبانی 12×5', 'مدیر اختصاصی', 'آموزش تخصصی', 'بهینه‌سازی عملکرد'],
    sla: '2 ساعت',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'پشتیبانی Enterprise',
    description: 'پشتیبانی کامل 24/7 با بالاترین SLA',
    features: ['پشتیبانی 24×7', 'تیم اختصاصی', 'مشاوره امنیتی', 'بازبینی دوره‌ای'],
    sla: '1 ساعت',
    color: 'from-green-500 to-green-600'
  }
];

export function DeploymentOptions() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              گزینه‌های استقرار
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              انعطاف‌پذیری کامل در استقرار
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              ViWorkS را مطابق نیازهای سازمانی خود مستقر کنید - On-Prem یا Cloud
            </p>
          </motion.div>

          {/* Deployment Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
          >
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${option.bgColor} border ${option.borderColor}`}>
                        <option.icon className={`h-6 w-6 bg-gradient-to-r ${option.color} bg-clip-text text-transparent`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-900">{option.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-slate-600">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">ویژگی‌های کلیدی:</h4>
                        <ul className="space-y-2">
                          {option.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">مزایا:</h4>
                        <ul className="space-y-2">
                          {option.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">نیازمندی‌ها:</h4>
                        <ul className="space-y-2">
                          {option.requirements.map((requirement, requirementIndex) => (
                            <li key={requirementIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>زمان راه‌اندازی: {option.timeline}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Settings className="w-4 h-4" />
                            <span>پیچیدگی: {option.complexity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Implementation Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 shadow-2xl mb-20"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">
                فرآیند پیاده‌سازی
              </Badge>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                راه‌اندازی سریع و حرفه‌ای
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                فرآیند 4 مرحله‌ای برای پیاده‌سازی موفق ViWorkS
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {implementationSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-all duration-300 border-white/10 bg-white/5 backdrop-blur-sm group">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-lg mb-3">
                        {step.title}
                      </h4>
                      <p className="text-slate-300 text-sm mb-4">
                        {step.description}
                      </p>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs">
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
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
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${tier.color} shadow-lg`}>
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-900">{tier.name}</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0 font-medium`}>
                            SLA: {tier.sla}
                          </Badge>
                        </div>
                        <ul className="space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold shadow-lg"
              asChild
            >
              <Link href="/deployment" className="flex items-center gap-2">
                مشاوره استقرار
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
