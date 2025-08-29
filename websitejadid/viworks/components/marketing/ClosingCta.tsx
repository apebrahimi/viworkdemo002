'use client';

import { ModernButton } from '@/components/ui/modern-button';
import { analytics } from '@/lib/analytics';

export function ClosingCta() {
  const handleCtaClick = (type: 'demo' | 'sales') => {
    if (type === 'demo') {
      analytics.heroCtaDemoClick();
    } else {
      analytics.heroCtaSalesClick();
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            آماده ارتقای امنیت دسترسی از راه دور هستید؟
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            با ViWorkS، امنیت کار از راه دور را به سطح جدیدی ارتقا دهید
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton
              href="/contact?type=demo"
              variant="primary"
              size="lg"
              onClick={() => handleCtaClick('demo')}
            >
              درخواست دمو
            </ModernButton>
            <ModernButton
              href="/contact?type=sales"
              variant="outline"
              size="lg"
              onClick={() => handleCtaClick('sales')}
            >
              مشاوره محصول
            </ModernButton>
          </div>
        </div>
      </div>
    </section>
  );
}
