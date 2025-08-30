'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, FileText, ArrowRight } from 'lucide-react';

export function NdaCta() {
  const handleCtaClick = (type: 'nda' | 'demo') => {
    if (type === 'nda') {
      // Logic for NDA request
      alert('NDA request clicked!');
    } else if (type === 'demo') {
      // Logic for demo request
      alert('Demo request clicked!');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-card p-8 rounded-lg border shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-full mr-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold">اطلاعات فنی کامل تحت NDA</h2>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              برای دریافت جزئیات فنی کامل، دیاگرام‌های معماری، نمونه‌های پیاده‌سازی و ارزیابی دقیق، 
              جلسه فنی تحت توافق محرمانگی (NDA) پیشنهاد می‌شود.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">دیاگرام‌های فنی کامل</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">نمونه‌های پیاده‌سازی</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">ارزیابی امنیتی دقیق</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleCtaClick('nda')}
              >
                <Shield className="w-5 h-5 mr-2" />
                درخواست جلسه فنی تحت NDA
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleCtaClick('demo')}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                مشاوره و دمو
              </Button>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>توجه:</strong> تمامی اطلاعات حساس فنی، پیکربندی‌ها و توپولوژی‌های دقیق 
                فقط در جلسات تحت NDA ارائه می‌شوند تا امنیت کامل تضمین شود.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
