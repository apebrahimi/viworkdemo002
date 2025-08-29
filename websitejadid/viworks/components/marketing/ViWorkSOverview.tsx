'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function ViWorkSOverview() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Main Content Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12 shadow-lg border border-slate-200"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  معرفی پلتفرم
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
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
        </div>
      </div>
    </section>
  );
}
