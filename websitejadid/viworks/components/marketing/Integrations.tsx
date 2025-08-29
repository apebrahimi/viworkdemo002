'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Users,
  Globe,
  Building,
  Activity,
  Settings
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



export function Integrations() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"></div>
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
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              یکپارچگی‌ها
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              یکپارچگی آسان با اکوسیستم شما
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              ViWorkS با سیستم‌های موجود شما یکپارچه می‌شود - بدون نیاز به تغییرات عمده در زیرساخت
            </p>
          </motion.div>

          {/* Integration Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
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




        </div>
      </div>
    </section>
  );
}
