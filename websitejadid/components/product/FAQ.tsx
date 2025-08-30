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
    question: 'آیا اطلاعات زیرساخت برای کاربر افشا می‌شود؟',
    answer: 'خیر؛ دسترسی‌ها از طریق ورک‌اسپیس‌های امن و سیاست‌گذاری‌شده انجام می‌گیرد. کاربر فقط به آنچه ادمین مجاز کرده است دسترسی دارد.'
  },
  {
    question: 'مهاجم با VPN شخصی می‌تواند سیاست مکان را دور بزند؟',
    answer: 'سیاست‌ها چندسیگناله است (Device Binding/زمان/مکان/ASN) و رخدادها قابل‌ممیزی است. تلاش برای دور زدن سیاست‌ها ثبت و هشدار داده می‌شود.'
  },
  {
    question: 'SSO پشتیبانی می‌کنید؟',
    answer: 'بله؛ OIDC/SAML (مطابق IdP سازمان شما). پشتیبانی از Azure AD، ADFS، Keycloak و سایر استانداردهای صنعتی.'
  },
  {
    question: 'On-Prem یا Cloud؟',
    answer: 'هر دو با پروفایل سخت‌سازی معادل. انتخاب بر اساس نیازهای سازمانی، انطباق و ترجیحات امنیتی.'
  },
  {
    question: 'گزارش‌ها به SIEM ما می‌آید؟',
    answer: 'بله؛ خروجی استاندارد و قابل‌نگاشت. رویدادهای احراز هویت، نشست‌ها، سیاست‌ها و سلامت سیستم به SIEM ارسال می‌شود.'
  },
  {
    question: 'آیا برای سازمان‌های بزرگ مناسب است؟',
    answer: 'بله؛ طراحی شده برای مقیاس سازمانی با قابلیت‌های RBAC، ممیزی کامل و یکپارچگی با سیستم‌های موجود.'
  },
  {
    question: 'چگونه امنیت ورک‌اسپیس‌ها تضمین می‌شود؟',
    answer: 'ایزوله‌سازی کامل، سیاست‌های خروجی، DNS مدیریت‌شده و لاگ‌گیری کامل. مسیرهای داخلی برای کاربر نامرئی است.'
  },
  {
    question: 'آیا پشتیبانی ۲۴×۷ دارید؟',
    answer: 'بله؛ گزینه‌های پشتیبانی ۸×۵، ۱۲×۵ و ۲۴×۷ با SLAهای تعهدی برای سازمان‌های مختلف.'
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
            پاسخ‌های سؤالات رایج درباره ViWorkS و قابلیت‌های آن
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-card p-6 rounded-lg border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">سؤال دیگری دارید؟</h3>
            <p className="text-muted-foreground">
              اگر سؤال شما در اینجا پاسخ داده نشده، با تیم فنی ما تماس بگیرید. 
              ما آماده پاسخگویی به سؤالات تخصصی شما هستیم.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
