'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';
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
    <section className="py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='closing-pattern' x='0' y='0' width='45' height='45' patternUnits='userSpaceOnUse'%3E%3Cpolygon points='22.5,0 45,22.5 22.5,45 0,22.5' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-opacity='0.3'/%3E%3Ccircle cx='22.5' cy='22.5' r='5' fill='%23cbd5e1' fill-opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='90' height='90' fill='url(%23closing-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            آماده ارتقای امنیت دسترسی از راه دور هستید؟
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            با ViWorkS، امنیت کار از راه دور را به سطح جدیدی ارتقا دهید
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton
              href="/contact?type=demo"
              variant="primary"
              size="lg"
              onClick={() => handleCtaClick('demo')}
            >
              مشاوره و دمو
            </ModernButton>
          </div>
        </div>
      </div>
    </section>
  );
}
