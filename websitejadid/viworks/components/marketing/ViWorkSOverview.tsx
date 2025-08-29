'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function ViWorkSOverview() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Main Content Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-slate-200"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  معرفی پلتفرم
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                  وی ورک:
                </h2>
              </div>

              {/* Content */}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
                <p className="text-lg">
                   پلتفرمی سازمانی برای «دسترسی امن از راه دور» است که ریسک‌های بیرونی و حتی داخلی را به حداقل می‌رساند. به‌جای گسترش سطح دسترسی شبکه یا اتکا به پایانه‌های ناهمگون، دسترسی‌ها بر مبنای اصل حداقل‌امتیاز تعریف می‌شوند، نشست‌ها قابل‌ممیزی‌اند و هیچ داده حساسی روی دستگاه کاربر باقی نمی‌ماند؛ حاصلِ این رویکرد، کاهش سطح حمله، پیشگیری از نشت داده و انطباق ساده‌تر با الزامات امنیتی و مقرراتی برای سازمان‌های حساس است.
                </p>
                <p className="text-lg">
                  کاربر با کلاینت اختصاصی ViWorkS درخواست اتصال را آغاز می‌کند؛ کلاینت پیش از هر چیز پیش‌نیازهای امنیتی را به‌صورت خودکار بررسی می‌کند. پس از احراز هویت دومرحله‌ای از طریق اپلیکیشن موبایل ViWorkS، اتصال برقرار می‌شود و نشست کاربر در محیطی کاملاً ایزوله داخل دیتاسنتر یا کلاود شما اجرا می‌گردد. در این محیط، تنها برنامه‌ها و منابع از پیش‌تعریف‌شده مانند مرورگرهای امن (Chrome/Firefox) یا دسکتاپ‌های لینوکسی/ویندوزی با دسترسی محدود به منابع مجاز—در اختیار کاربر قرار می‌گیرد؛ بی‌آن‌که جزئیات زیرساخت افشا شود یا داده‌ای روی دستگاه شخصی ماندگار بماند. تمامی رویدادها به‌صورت استاندارد ثبت و به SIEM سازمان شما ارسال می‌شود و سیاست‌های زمان/مکان/ریسک نیز به‌طور پیوسته اعمال می‌گردد تا امنیت حداکثری و سادگی بهره‌برداری، هم‌زمان تضمین شود.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 max-w-3xl mx-auto shadow-sm"
          >
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-blue-800 leading-relaxed">
                  با توجه به ماهیت امنیت محور این راهکار اطلاعات در وبسایت به صورت حداقلی ارایه شده است. لذا جهت دریافت اطلاعات دقیق تر درباره امکانات و قابلیت های راهکار برای هماهنگی جلسه حضوری با ما در ارتباط باشید.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
