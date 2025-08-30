'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  Server,
  Chrome,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { analytics } from '@/lib/analytics';

const platforms = [
  {
    title: 'کلاینت دسکتاپ',
    description: 'Windows · macOS · Linux',
    icon: Monitor,
    features: ['کلاینت اختصاصی امن', 'سبک و قابل‌مدیریت', 'پشتیبانی از سه‌سیستم‌عامل'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    platformIcons: [
      { src: '/images/windows 11 .png', alt: 'Windows' },
      { src: '/images/macOS .png', alt: 'macOS' },
      { src: '/images/linux.png', alt: 'Linux' }
    ]
  },
  {
    title: 'اپ موبایل',
    description: 'Android / iOS',
    icon: Smartphone,
    features: ['اتصال دستگاه', 'OTP کوتاه‌عمر', 'بدون تونل'],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    platformIcons: [
      { src: '/images/android.svg.png', alt: 'Android' },
      { src: '/images/IOS.svg.png', alt: 'iOS' }
    ]
  },
  {
    title: 'پنل ادمین',
    description: 'وب با RBAC و MFA',
    icon: Globe,
    features: ['مدیریت کاربران/دستگاه‌ها', 'تأیید دو نفره', 'WebSocket برای وضعیت لحظه‌ای'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    title: 'استقرار',
    description: 'On-Prem و Cloud',
    icon: Server,
    features: ['سیاست‌های سخت‌سازی یکسان', 'انعطاف‌پذیری کامل', 'همسویی با انطباق'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
];

const workspaceCatalog = [
  {
    name: 'Chrome ایزوله',
    description: 'مرورگر امن برای دسترسی به وب‌اپ‌های داخلی و سرویس‌های SaaS مجاز',
    logo: '/images/Google_Chrome-Logo.wine.png',
    features: ['ایزوله‌سازی کامل نشست', 'مدیریت امن کوکی‌ها', 'فیلترینگ هوشمند محتوا', 'جلوگیری از نشت داده'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Firefox ایزوله',
    description: 'مرورگر امن برای توسعه‌دهندگان و دسترسی به منابع حساس',
    logo: '/images/Mozilla_Firefox_3.5_logo.png',
    features: ['محیط توسعه امن', 'ابزارهای توسعه‌دهنده', 'مدیریت افزونه‌ها', 'ایزوله‌سازی کامل'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Windows Desktop',
    description: 'محیط کاری کامل ویندوز برای ابزارهای اداری و تحلیلی',
    logo: '/images/windows 11 .png',
    features: ['دسترسی کامل به دسکتاپ', 'ابزارهای Office', 'نرم‌افزارهای تخصصی', 'محیط کاری مجزا'],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Linux Desktop',
    description: 'محیط لینوکس برای ابزارهای مهندسی و تحلیلی پیشرفته',
    logo: '/images/linux.png',
    features: ['دسترسی کامل به ترمینال', 'ابزارهای توسعه', 'محیط‌های مجازی', 'نرم‌افزارهای مهندسی'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
];

export function PlatformCompatibility() {
  const handleWorkspaceClick = () => {
    analytics.compatSectionView();
    
    // Custom smooth scroll function with better timing and easing
    const platformsSection = document.getElementById('platforms');
    if (platformsSection) {
      const headerHeight = 80;
      const targetPosition = platformsSection.offsetTop - headerHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // Increased duration for smoother feel
      let start: number | null = null;
      
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };
      
      requestAnimationFrame(animation);
    }
  };

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
              سازگاری کامل
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              سازگاری پلتفرم
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              اعلام شفاف «کلاینت‌ها چه هستند» و نقش هرکدام در اکوسیستم امن ViWorkS
            </p>
          </motion.div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${platform.bgColor} border ${platform.borderColor}`}>
                        <platform.icon className={`w-6 h-6 ${platform.color}`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-900">{platform.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-slate-600">
                      {platform.description}
                    </CardDescription>
                    
                    {/* Platform Icons Row */}
                    {platform.platformIcons && (
                      <div className="flex items-center gap-2 mt-3">
                        {platform.platformIcons.map((icon, iconIndex) => (
                          <div key={iconIndex} className="w-6 h-6 relative">
                            <Image
                              src={icon.src}
                              alt={icon.alt}
                              fill
                              className="object-contain"
                              sizes="24px"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {platform.features.map((feature, featureIndex) => (
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

          {/* Workspace Catalog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 p-8 lg:p-12 mb-12"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
            </div>

            <div className="relative">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  کاتالوگ محیط‌های کاری
                </Badge>
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                  محیط‌های کاری ایزوله
                </h3>
                <p className="text-slate-700 max-w-3xl mx-auto text-lg leading-relaxed">
                  پس از برقراری اتصال امن، کاربران تنها به محیط‌های کاری ایزوله و منابع تعریف‌شده توسط ادمین دسترسی دارند. هر محیط کاملاً مجزا و تحت کنترل کامل امنیتی است.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {workspaceCatalog.map((workspace, index) => (
                  <motion.div
                    key={workspace.name}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card 
                      className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                      onClick={handleWorkspaceClick}
                    >
                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <CardContent className="p-6 relative">
                        <div className="flex justify-center mb-4">
                          <div className={`p-4 rounded-2xl ${workspace.bgColor} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                            <div className="w-10 h-10 relative">
                              <Image
                                src={workspace.logo}
                                alt={workspace.name}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                sizes="40px"
                              />
                            </div>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-700 transition-colors duration-300">
                          {workspace.name}
                        </h4>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                          {workspace.description}
                        </p>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {workspace.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center justify-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {/* Interactive Arrow */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <ArrowRight className="w-4 h-4 text-blue-600 mx-auto transform scale-x-[-1]" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Security Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-blue-200">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">
                    مسیرها و آدرس‌های واقعی برای کاربر نامرئی است
                  </span>
                </div>
              </div>
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
