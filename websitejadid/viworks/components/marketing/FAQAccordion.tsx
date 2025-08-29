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
    category: 'امنیت',
    icon: Shield,
  },
  {
    id: 'key-compromise',
    question: 'اگر کلید لو برود چه می‌شود؟',
    answer: 'امکان ابطال فوری، چرخش امن و ثبت رویداد در ممیزی سازمانی. هر کلید/اعتبار اختصاصی برای هر کاربر است و امکان ابطال/چرخش به‌صورت مجزا وجود دارد.',
    category: 'مدیریت',
    icon: Lock,
  },
  {
    id: '2fa-support',
    question: 'آیا 2FA/TOTP پشتیبانی می‌شود؟',
    answer: 'بله؛ همراه با اتصال دستگاه در موبایل. احراز هویت چندلایه با ورود کاربر + اعتبارسنجی موبایل + کد یک‌بارمصرف با زمان محدود.',
    category: 'احراز هویت',
    icon: Eye,
  },
  {
    id: 'on-prem-support',
    question: 'آیا On-Prem دارید؟',
    answer: 'بله؛ با سخت‌سازی معادل Cloud. هر دو گزینه On-Prem و Cloud با پروفایل سخت‌سازی هم‌ارزش ارائه می‌شود.',
    category: 'استقرار',
    icon: Shield,
  },
  {
    id: 'logging-details',
    question: 'چه چیزهایی ثبت‌لاگ می‌شود؟',
    answer: 'رویدادهای احراز هویت/نشست/سیاست—به‌صورت استاندارد برای SIEM. ثبت‌لاگ چندلایه شامل وب/نشست/کانتینر با نگهداری و نگاشت کاربر/نشست.',
    category: 'نظارت',
    icon: Eye,
  },
  {
    id: 'technical-docs',
    question: 'مستندات فنی عمیق؟',
    answer: 'تحت NDA ارائه می‌شود. برای جزئیات فنی کامل، جلسه فنی تحت توافق محرمانگی پیشنهاد می‌شود.',
    category: 'مستندات',
    icon: HelpCircle,
  },
];

const categories = [
  { name: 'امنیت', count: 2, color: 'bg-blue-500/10 text-blue-600' },
  { name: 'احراز هویت', count: 1, color: 'bg-green-500/10 text-green-600' },
  { name: 'نظارت', count: 1, color: 'bg-purple-500/10 text-purple-600' },
  { name: 'استقرار', count: 1, color: 'bg-orange-500/10 text-orange-600' },
  { name: 'مستندات', count: 1, color: 'bg-red-500/10 text-red-600' },
];

export function FAQAccordion() {
  const handleItemOpen = (questionId: string) => {
    analytics.faqItemOpen(questionId);
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              <HelpCircle className="w-3 h-3 mr-2" />
              سؤالات متداول
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              سؤالات متداول
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              پاسخ‌های رایج به سؤالات امنیتی و عملیاتی درباره ViWorkS
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category, index) => (
              <div key={category.name}>
                <Badge className={`${category.color} border-0 px-3 py-1 text-xs`}>
                  {category.name} ({category.count})
                </Badge>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
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
                        <Badge className={`${categories.find(c => c.name === faq.category)?.color} border-0 text-xs ml-2`}>
                          {faq.category}
                        </Badge>
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

          {/* CTA */}
          <div className="text-center">
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                سؤال دیگری دارید؟
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                تیم فنی ما آماده پاسخگویی به سؤالات تخصصی شما در زمینه امنیت دسترسی از راه دور است
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  تماس با تیم فنی
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3">
                  درخواست جلسه فنی
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
