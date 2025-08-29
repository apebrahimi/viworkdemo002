'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Workspaces چگونه امن می‌مانند؟',
    answer: 'ایزوله و قابل‌کنترل هستند؛ مسیرهای داخلی برای کاربر نامرئی است. هر ورک‌اسپیس در محیط جداگانه اجرا می‌شود.'
  },
  {
    question: 'SSO دارید؟',
    answer: 'بله، OIDC/SAML (با IdP سازمان). پشتیبانی از Azure AD، ADFS، Keycloak و سایر استانداردهای صنعتی.'
  },
  {
    question: 'Logs به SIEM ما می‌رود؟',
    answer: 'بله، خروجی استانداردسازی‌شده. رویدادهای احراز هویت، نشست‌ها، سیاست‌ها و سلامت سیستم به SIEM ارسال می‌شود.'
  },
  {
    question: 'On-Prem یا Cloud؟',
    answer: 'هر دو با سیاست‌های سخت‌سازی هم‌ارزش. انتخاب بر اساس نیازهای سازمانی، انطباق و ترجیحات امنیتی.'
  },
  {
    question: 'آیا برای پیمانکاران/شرکای ما مناسب است؟',
    answer: 'بله، سیاست‌های موقت/مشروط و ممیزی کامل. دسترسی محدود زمانی با قابلیت خاتمه فوری.'
  },
  {
    question: 'چگونه با سیستم‌های موجود یکپارچه می‌شود؟',
    answer: 'از طریق APIهای استاندارد، وب‌هوک‌ها و پروتکل‌های صنعتی. تیم ما در یکپارچگی کمک می‌کند.'
  }
];

export function FAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            سؤالات متداول
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            سؤالات متداول
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پاسخ‌های سؤالات رایج درباره راهکارهای ViWorkS
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right text-lg font-medium hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
