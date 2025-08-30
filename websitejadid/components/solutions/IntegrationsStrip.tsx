'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Database, Settings } from 'lucide-react';

const integrations = [
  {
    icon: Users,
    title: 'SSO (OIDC/SAML/ADFS)',
    description: 'احراز هویت یکپارچه با سیستم‌های موجود'
  },
  {
    icon: Activity,
    title: 'SIEM',
    description: 'ورود استاندارد رویدادها'
  },
  {
    icon: Database,
    title: 'Monitoring/NOC',
    description: 'متریک‌ها و هشدارها'
  },
  {
    icon: Settings,
    title: 'ITSM (اختیاری)',
    description: 'اتومیشن فرآیندها'
  }
];

export function IntegrationsStrip() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            یکپارچگی‌ها
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            یکپارچگی با سیستم‌های موجود
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ViWorkS به‌راحتی با زیرساخت‌های موجود سازمان شما یکپارچه می‌شود
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <integration.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{integration.title}</h3>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <p className="text-muted-foreground text-sm">
              <strong>مستندات/FAQs عمومی:</strong> در بخش منابع موجود است. 
              جزئیات فنی عمیق تحت NDA ارائه می‌شود.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
