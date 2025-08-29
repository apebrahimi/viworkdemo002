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
    description: 'برای وب‌اپ‌های داخلی و SaaS مجاز',
    icon: Chrome,
    features: ['ایزوله‌سازی کامل', 'مدیریت کوکی‌ها', 'فیلترینگ محتوا'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Firefox ایزوله',
    description: 'برای وب‌اپ‌های داخلی و SaaS مجاز',
    icon: Chrome,
    features: ['ایزوله‌سازی کامل', 'مدیریت کوکی‌ها', 'فیلترینگ محتوا'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Linux Desktop',
    description: 'برای ابزارهای تحلیلی/مهندسی',
    icon: Monitor,
    features: ['دسترسی کامل', 'ابزارهای توسعه', 'محیط‌های مجزا'],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
];

export function PlatformCompatibility() {
  const handleWorkspaceClick = () => {
    analytics.compatSectionView();
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
            className="bg-slate-50 rounded-2xl p-8 lg:p-12 mb-12"
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-slate-200 text-slate-700 border-slate-300">
                کاتالوگ محیط‌های کاری
              </Badge>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                محیط‌های کاری ایزوله
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                پس از برقراری اتصال امن، کاربران تنها به «پروفایل‌های منابع» تعریف‌شده توسط ادمین دسترسی دارند
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workspaceCatalog.map((workspace, index) => (
                <motion.div
                  key={workspace.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="text-center border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={handleWorkspaceClick}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-lg ${workspace.bgColor}`}>
                          <workspace.icon className={`w-6 h-6 ${workspace.color}`} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-2">
                        {workspace.name}
                      </h4>
                      <p className="text-slate-600 text-sm mb-4">
                        {workspace.description}
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {workspace.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center justify-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-slate-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-600">
                مسیرها و آدرس‌های واقعی برای کاربر نامرئی است
              </Badge>
            </div>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-700">معماری اعتماد صفر</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-700">نظارت لحظه‌ای</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-slate-700">آماده انطباق</span>
              </div>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              asChild
            >
              <Link href="/product" className="flex items-center gap-2">
                مشاهده جزئیات محصول
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Bottom Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">
              بدون ذخیره‌سازی دائم اسرار حساس سمت کلاینت؛ همه‌چیز تحت سیاست‌های سازمان شما کنترل می‌شود.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
