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
  Users,
  Globe,
  Server,
  Building,
  Activity,
  Settings,
  Database,
  Network
} from 'lucide-react';
import Link from 'next/link';

const integrationCategories = [
  {
    title: 'SIEM & Monitoring',
    description: 'یکپارچگی کامل با سیستم‌های نظارت و تحلیل امنیتی',
    icon: Activity,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-500/10 to-blue-600/10',
    borderColor: 'border-blue-500/20',
    integrations: [
      {
        name: 'Splunk',
        description: 'ارسال لاگ‌های استاندارد',
        status: 'تأیید شده',
        type: 'SIEM'
      },
      {
        name: 'QRadar',
        description: 'یکپارچگی کامل',
        status: 'تأیید شده',
        type: 'SIEM'
      },
      {
        name: 'ELK Stack',
        description: 'پشتیبانی از Elasticsearch',
        status: 'تأیید شده',
        type: 'SIEM'
      },
      {
        name: 'Grafana',
        description: 'داشبوردهای نظارت',
        status: 'تأیید شده',
        type: 'Monitoring'
      }
    ]
  },
  {
    title: 'SSO & Identity',
    description: 'اتصال آسان با سیستم‌های احراز هویت سازمانی',
    icon: Users,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-500/10 to-green-600/10',
    borderColor: 'border-green-500/20',
    integrations: [
      {
        name: 'Azure AD',
        description: 'OIDC/SAML کامل',
        status: 'تأیید شده',
        type: 'SSO'
      },
      {
        name: 'Active Directory',
        description: 'اتصال مستقیم',
        status: 'تأیید شده',
        type: 'SSO'
      },
      {
        name: 'Okta',
        description: 'OIDC/SAML کامل',
        status: 'تأیید شده',
        type: 'SSO'
      },
      {
        name: 'Keycloak',
        description: 'پشتیبانی کامل',
        status: 'تأیید شده',
        type: 'SSO'
      }
    ]
  },
  {
    title: 'ITSM & Automation',
    description: 'اتوماسیون فرآیندها و مدیریت خدمات IT',
    icon: Settings,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-500/10 to-purple-600/10',
    borderColor: 'border-purple-500/20',
    integrations: [
      {
        name: 'ServiceNow',
        description: 'اتوماسیون تیکت',
        status: 'تأیید شده',
        type: 'ITSM'
      },
      {
        name: 'Jira Service Desk',
        description: 'مدیریت حوادث',
        status: 'تأیید شده',
        type: 'ITSM'
      },
      {
        name: 'Ansible',
        description: 'اتوماسیون استقرار',
        status: 'تأیید شده',
        type: 'Automation'
      },
      {
        name: 'Terraform',
        description: 'Infrastructure as Code',
        status: 'تأیید شده',
        type: 'Automation'
      }
    ]
  }
];

const integrationFeatures = [
  {
    icon: Shield,
    title: 'API های استاندارد',
    description: 'RESTful APIs با مستندات کامل برای یکپارچگی آسان',
    color: 'text-blue-600'
  },
  {
    icon: Lock,
    title: 'امنیت بالا',
    description: 'احراز هویت API و رمزنگاری end-to-end برای تمام اتصالات',
    color: 'text-green-600'
  },
  {
    icon: Eye,
    title: 'نظارت کامل',
    description: 'لاگ‌گیری و نظارت بر تمام فعالیت‌های یکپارچگی',
    color: 'text-purple-600'
  },
  {
    icon: Zap,
    title: 'عملکرد بهینه',
    description: 'بهینه‌سازی شده برای عملکرد بالا در محیط‌های Enterprise',
    color: 'text-orange-600'
  }
];

const integrationBenefits = [
  {
    title: 'کاهش پیچیدگی',
    description: 'یکپارچگی آسان با سیستم‌های موجود بدون نیاز به تغییرات عمده',
    icon: Settings,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'افزایش کارایی',
    description: 'اتوماسیون فرآیندها و کاهش کارهای دستی تکراری',
    icon: Zap,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'انطباق بهتر',
    description: 'گزارش‌دهی خودکار و ممیزی کامل برای انطباق با استانداردها',
    icon: Shield,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'مدیریت متمرکز',
    description: 'نظارت و کنترل متمرکز بر تمام سیستم‌های امنیتی',
    icon: Globe,
    color: 'from-orange-500 to-red-500'
  }
];

export function Integrations() {
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
              یکپارچگی‌ها
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              یکپارچگی آسان با اکوسیستم شما
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              ViWorkS با سیستم‌های موجود شما یکپارچه می‌شود - بدون نیاز به تغییرات عمده در زیرساخت
            </p>
          </motion.div>

          {/* Integration Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
          >
            {integrationCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.bgColor} border ${category.borderColor}`}>
                        <category.icon className={`h-6 w-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-900">{category.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-slate-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.integrations.map((integration, integrationIndex) => (
                        <div key={integration.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium text-slate-900">{integration.name}</div>
                            <div className="text-sm text-slate-600">{integration.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {integration.type}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Integration Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 shadow-2xl mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                ویژگی‌های یکپارچگی
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                قابلیت‌های پیشرفته برای یکپارچگی آسان و امن
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {integrationFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Integration Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                مزایای یکپارچگی
              </h3>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                چگونه یکپارچگی ViWorkS به سازمان شما کمک می‌کند
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {integrationBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <benefit.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-3">
                        {benefit.title}
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-200 mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">
                  جزئیات فنی یکپارچگی
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">API های RESTful</h4>
                      <p className="text-slate-600 text-sm">
                        API های استاندارد با مستندات کامل، پشتیبانی از JSON و XML
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Network className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Webhook Support</h4>
                      <p className="text-slate-600 text-sm">
                        ارسال رویدادها به سیستم‌های خارجی با Webhook های امن
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">امنیت API</h4>
                      <p className="text-slate-600 text-sm">
                        احراز هویت OAuth 2.0، API Keys، و رمزنگاری TLS 1.3
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8">
                <h4 className="text-xl font-semibold text-slate-900 mb-4">پروتکل‌های پشتیبانی شده</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">OIDC/SAML</span>
                    <Badge className="bg-green-100 text-green-800">تأیید شده</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Syslog</span>
                    <Badge className="bg-green-100 text-green-800">تأیید شده</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">SNMP</span>
                    <Badge className="bg-green-100 text-green-800">تأیید شده</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">LDAP/Active Directory</span>
                    <Badge className="bg-green-100 text-green-800">تأیید شده</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">RADIUS</span>
                    <Badge className="bg-green-100 text-green-800">تأیید شده</Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold shadow-lg"
              asChild
            >
              <Link href="/resources/integrations" className="flex items-center gap-2">
                مشاهده مستندات یکپارچگی
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
