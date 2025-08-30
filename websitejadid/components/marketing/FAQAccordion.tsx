'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, HelpCircle, Shield, Lock, Eye } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import Link from 'next/link';

const faqs = [
  {
    id: 'stealth-detection',
    question: 'چگونه از شناسایی/شنود جلوگیری می‌کنید؟',
    answer: 'با معماری پنهان‌سازی سرویس و کانال امن مطابق بهترین‌عمل‌ها. سرویس به‌صورت پیش‌فرض در اینترنت نمایان نیست و تنها در بازهٔ محدود پس از درخواست معتبر قابل دسترسی است.',
    icon: Shield,
  },
  {
    id: 'key-compromise',
    question: 'اگر کلید لو برود چه می‌شود؟',
    answer: 'امکان ابطال فوری، چرخش امن و ثبت رویداد در ممیزی سازمانی. هر کلید/اعتبار اختصاصی برای هر کاربر است و امکان ابطال/چرخش به‌صورت مجزا وجود دارد.',
    icon: Lock,
  },
  {
    id: '2fa-support',
    question: 'آیا 2FA/TOTP پشتیبانی می‌شود؟',
    answer: 'بله؛ همراه با اتصال دستگاه در موبایل. احراز هویت چندلایه با ورود کاربر + اعتبارسنجی موبایل + کد یک‌بارمصرف با زمان محدود.',
    icon: Eye,
  },
  {
    id: 'on-prem-support',
    question: 'آیا On-Prem دارید؟',
    answer: 'بله؛ با سخت‌سازی معادل Cloud. هر دو گزینه On-Prem و Cloud با پروفایل سخت‌سازی هم‌ارزش ارائه می‌شود.',
    icon: Shield,
  },
  {
    id: 'logging-details',
    question: 'چه چیزهایی ثبت‌لاگ می‌شود؟',
    answer: 'رویدادهای احراز هویت/نشست/سیاست—به‌صورت استاندارد برای SIEM. ثبت‌لاگ چندلایه شامل وب/نشست/کانتینر با نگهداری و نگاشت کاربر/نشست.',
    icon: Eye,
  },
  {
    id: 'technical-docs',
    question: 'مستندات فنی عمیق؟',
    answer: 'مستندات فنی کامل در جلسات تخصصی ارائه می‌شود. برای جزئیات فنی کامل، جلسه فنی تخصصی پیشنهاد می‌شود.',
    icon: HelpCircle,
  },
];



export function FAQAccordion() {
  const handleItemOpen = (questionId: string) => {
    analytics.faqItemOpen(questionId);
  };

  return (
    <section className="py-16 lg:py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='faq-pattern' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%23ffffff' stroke-width='0.8' stroke-opacity='0.15'/%3E%3Ccircle cx='20' cy='20' r='3' fill='%23ffffff' fill-opacity='0.2'/%3E%3Cpath d='M10 10 L30 10 M10 30 L30 30' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23faq-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <HelpCircle className="w-3 h-3 mr-2" />
              سؤالات متداول
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              سؤالات متداول
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              پاسخ‌های رایج به سؤالات امنیتی و عملیاتی درباره ViWorkS
            </p>
          </div>



          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-slate-100 last:border-b-0">
                  <AccordionTrigger 
                    className="text-right hover:no-underline py-4"
                    onClick={() => handleItemOpen(faq.id)}
                  >
                    <div className="flex items-center gap-3 text-right">
                      <div className="p-2 rounded-lg bg-slate-100">
                        <faq.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 text-right">
                        <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right pb-4">
                    <div className="text-sm text-slate-600 leading-relaxed pr-12">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
