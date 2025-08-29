'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  Eye, 
  Zap, 
  Users, 
  Globe,
  CheckCircle,
  X,
  ArrowRight,
  DollarSign,
  Building,
  FileText,
  Target
} from 'lucide-react';

const securityChallenges = [
  {
    icon: AlertTriangle,
    title: 'اکسپوژر سرویس‌ها',
    description: 'VPN‌های سنتی قابل شناسایی و نفوذ',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    icon: Shield,
    title: 'عدم کنترل دسترسی',
    description: 'دسترسی‌های غیرضروری و غیرقابل نظارت',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    icon: Lock,
    title: 'احراز هویت ضعیف',
    description: 'عدم استفاده از MFA و احراز هویت قوی',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    icon: Eye,
    title: 'عدم نظارت مناسب',
    description: 'نبود ثبت‌لاگ و ردیابی فعالیت‌ها',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    icon: DollarSign,
    title: 'هزینه‌های بالا',
    description: 'مدیریت پیچیده و هزینه‌بر',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    icon: FileText,
    title: 'عدم انطباق',
    description: 'سازگار نبودن با استانداردهای امنیتی',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

const businessImpact = [
  {
    icon: Target,
    value: '85%',
    description: 'سازمان‌ها در معرض نفوذ'
  },
  {
    icon: Building,
    value: '60%',
    description: 'مشکلات انطباق'
  },
  {
    icon: DollarSign,
    value: '$4.35M',
    description: 'متوسط هزینه نشت داده'
  },
  {
    icon: Users,
    value: '280 روز',
    description: 'زمان بازیابی'
  }
];

export function PainPoints() {
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
            <Badge variant="secondary" className="mb-4 bg-red-100 text-red-700 border-red-200">
              چالش‌های امنیتی
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              چالش‌های امنیتی دورکاری
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              آیا با این چالش‌های امنیتی مواجه هستید؟
            </p>
          </motion.div>

          {/* Business Impact Stats - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {businessImpact.map((impact, index) => (
                <motion.div
                  key={impact.description}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="border-0 bg-slate-50 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-2">
                        {impact.value}
                      </div>
                      <p className="text-sm text-slate-600">
                        {impact.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Challenges - Compact Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {securityChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        <div className={`p-2 rounded-lg ${challenge.bgColor} border ${challenge.borderColor}`}>
                          <challenge.icon className={`w-5 h-5 ${challenge.color}`} />
                        </div>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 mb-2">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {challenge.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                آیا این چالش‌ها برای شما آشنا هستند؟
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                ViWorkS با طراحی بر پایه Zero Trust و عدم افشای سرویس‌ها (ZTN)، این چالش‌ها را حل می‌کند
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                  مشاهده راه‌حل
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                  مشاوره رایگان
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
