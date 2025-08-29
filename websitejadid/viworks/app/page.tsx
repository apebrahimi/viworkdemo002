import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Hero } from '@/components/marketing/Hero';
import { ViWorkSOverview } from '@/components/marketing/ViWorkSOverview';
import { PainPoints } from '@/components/marketing/PainPoints';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { UseCases } from '@/components/marketing/UseCases';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { PlatformCompatibility } from '@/components/marketing/PlatformCompatibility';
import { DeploymentOptions } from '@/components/marketing/DeploymentOptions';
import { Integrations } from '@/components/marketing/Integrations';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';
import { TrustBar } from '@/components/marketing/TrustBar';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { ClosingCta } from '@/components/marketing/ClosingCta';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'ViWorks | امنیت در دورکاری برای سازمان‌های حساس',
  description: 'ViWorks با دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی کاربران و ثبت‌لاگ سازمانی، امنیت کار از راه دور را تضمین می‌کند. برای دمو و مشاوره استقرار (On-Prem/Cloud) تماس بگیرید.',
  ogImage: '/og/viworks-hero.png',
});

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ViWorkSOverview />
        <HowItWorks />
        <UseCases />
        <FeatureGrid />
        <PlatformCompatibility />
        <DeploymentOptions />
        <Integrations />
        <ComparisonTable />
        <TrustBar />
        <FAQAccordion />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
