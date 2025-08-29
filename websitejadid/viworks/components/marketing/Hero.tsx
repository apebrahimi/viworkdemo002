'use client';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap, Play, Star, Users, Globe, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { analytics } from '@/lib/analytics';

const features = [
  { icon: Shield, text: 'دسترسی پنهان (SPA)', color: 'from-blue-500 to-blue-600' },
  { icon: Lock, text: 'احراز هویت چندلایه (MFA)', color: 'from-green-500 to-green-600' },
  { icon: Eye, text: 'ایزوله‌سازی نشست', color: 'from-purple-500 to-purple-600' },
  { icon: Zap, text: 'نظارت و ثبت‌لاگ', color: 'from-orange-500 to-orange-600' },
];

export function Hero() {
  const handleCtaClick = (type: 'demo' | 'sales') => {
    if (type === 'demo') {
      analytics.heroCtaDemoClick();
    } else {
      analytics.heroCtaSalesClick();
    }
  };

  return (
    <section className="relative py-16 lg:py-20 flex items-center overflow-hidden bg-slate-900 min-h-screen">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="absolute inset-0 bg-purple-600/5" />
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* Enterprise Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm text-right flex items-center justify-end w-fit mx-auto lg:mx-0">
                <Award className="w-4 h-4 ml-2" />
                راهکار امنیت دسترسی از راه دور
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight text-right"
            >
              ViWorkS
              <span className="block text-lg lg:text-xl xl:text-2xl font-normal text-blue-300 mt-3 text-right">
                امنیت دسترسی از راه دور
              </span>
              <span className="block text-base lg:text-lg font-light text-slate-300 mt-2 text-right">
                بر پایه Zero Trust Architecture
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base lg:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-right"
            >
              کاهش اکسپوژر سرویس‌ها و کنترل دسترسی بر اساس اصل کمترین دسترسی. دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی سراسری و ثبت‌لاگ سازمانی در یک پلتفرم واحد.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border-white/20 text-white backdrop-blur-sm hover:bg-white/10 transition-all text-sm"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                    <feature.icon className="h-3 w-3" />
                    {feature.text}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <ModernButton
                href="/contact?type=demo"
                variant="primary"
                size="lg"
                onClick={() => handleCtaClick('demo')}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                درخواست دمو
              </ModernButton>
              <ModernButton
                href="/contact?type=sales"
                variant="outline"
                size="lg"
                onClick={() => handleCtaClick('sales')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                مشاوره تخصصی
              </ModernButton>
            </motion.div>
          </motion.div>

          {/* Right Content - Enterprise Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Enterprise Dashboard Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white font-semibold text-sm">وضعیت سیستم</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      فعال
                    </Badge>
                  </div>

                  {/* Security Layers */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-white font-medium text-sm">احراز هویت چندلایه</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        فعال
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-white font-medium text-sm">دسترسی پنهان</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        فعال
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-white font-medium text-sm">ایزوله‌سازی نشست</span>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        فعال
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-white font-medium text-sm">ثبت‌لاگ سازمانی</span>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                        فعال
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">99.9%</div>
                      <div className="text-xs text-slate-300">در دسترس بودن</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">50ms</div>
                      <div className="text-xs text-slate-300">تأخیر</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">256-bit</div>
                      <div className="text-xs text-slate-300">رمزنگاری</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Security Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-blue-600 rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Zero Trust</span>
                </div>
              </motion.div>

              {/* Floating Compliance Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-4 -left-4 bg-green-600 rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">ISO 27001</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

