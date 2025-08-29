'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const comparisonData = [
  {
    feature: 'امنیت',
    vpn: 'امنیت پایین - آسیب‌پذیر در برابر حملات',
    vdi: 'امنیت متوسط - ایزوله‌سازی خوب',
    ztna: 'امنیت خوب - کنترل دسترسی پیشرفته',
    viworks: 'امنیت عالی - Zero Trust کامل'
  },
  {
    feature: 'سهولت استفاده',
    vpn: 'آسان - آشنایی بالا',
    vdi: 'پیچیده - نیاز به آموزش',
    ztna: 'متوسط - پیچیدگی بالا',
    viworks: 'بسیار آسان - رابط کاربری ساده'
  },
  {
    feature: 'هزینه',
    vpn: 'کم - هزینه اولیه پایین',
    vdi: 'بسیار بالا - نیاز به زیرساخت گران',
    ztna: 'متوسط - هزینه متوسط',
    viworks: 'مقرون به صرفه - ROI بالا'
  },
  {
    feature: 'مدیریت',
    vpn: 'دشوار - مدیریت پیچیده',
    vdi: 'پیچیده - نیاز به تخصص بالا',
    ztna: 'خوب - مدیریت مرکزی',
    viworks: 'بسیار آسان - مدیریت خودکار'
  },
  {
    feature: 'انطباق',
    vpn: 'ضعیف - عدم انطباق کامل',
    vdi: 'متوسط - انطباق نسبی',
    ztna: 'خوب - انطباق بالا',
    viworks: 'کامل - انطباق 100%'
  },
  {
    feature: 'عملکرد',
    vpn: 'متوسط - کند در برخی موارد',
    vdi: 'کند - تأخیر بالا',
    ztna: 'خوب - عملکرد قابل قبول',
    viworks: 'عالی - عملکرد بهینه'
  }
];

export function ComparisonTable() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-400 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='comparison-pattern' x='0' y='0' width='35' height='35' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 17.5h35M17.5 0v35' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2'/%3E%3Ccircle cx='17.5' cy='17.5' r='4' fill='%23ffffff' fill-opacity='0.25'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='70' height='70' fill='url(%23comparison-pattern)'/%3E%3C/svg%3E")`
        }} />
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
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              مقایسه راه‌حل‌ها
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              مقایسه با راه‌حل‌های موجود
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              مقایسه عینی و شفاف برای درک بهتر تفاوت‌ها و انتخاب راه‌حل مناسب
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 bg-white shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-900 text-center">
                  مقایسه ویژگی‌ها
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-6 text-right text-sm font-semibold text-slate-900 border-b">
                          ویژگی
                        </th>
                        <th className="px-6 py-6 text-center text-sm font-semibold text-slate-900 border-b">
                          VPN سنتی
                        </th>
                        <th className="px-6 py-6 text-center text-sm font-semibold text-slate-900 border-b">
                          VDI
                        </th>
                        <th className="px-6 py-6 text-center text-sm font-semibold text-slate-900 border-b">
                          ZTNA
                        </th>
                        <th className="px-6 py-6 text-center text-sm font-semibold text-slate-900 border-b bg-purple-50">
                          ViWorkS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-8 py-6 text-lg font-semibold text-slate-900 border-b">
                            {row.feature}
                          </td>
                          <td className="px-6 py-6 text-center border-b">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {row.vpn}
                            </p>
                          </td>
                          <td className="px-6 py-6 text-center border-b">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {row.vdi}
                            </p>
                          </td>
                          <td className="px-6 py-6 text-center border-b">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {row.ztna}
                            </p>
                          </td>
                          <td className="px-6 py-6 text-center border-b bg-purple-50">
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {row.viworks}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
