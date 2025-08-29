import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ProductIntro } from '@/components/product/ProductIntro';
import { ArchitectureSafe } from '@/components/product/ArchitectureSafe';
import { SecureWorkspaces } from '@/components/product/SecureWorkspaces';
import { CapabilityGrid } from '@/components/product/CapabilityGrid';
import { AdminPolicy } from '@/components/product/AdminPolicy';
import { Integrations } from '@/components/product/Integrations';
import { DeploymentStrip } from '@/components/product/DeploymentStrip';
import { PerfScale } from '@/components/product/PerfScale';
import { PricingCta } from '@/components/product/PricingCta';
import { FAQ } from '@/components/product/FAQ';
import { ComparisonTable } from '@/components/product/ComparisonTable';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'محصول ViWorkS | دسترسی امن، پنهان و قابل‌ممیزی برای سازمان‌ها',
  description: 'ViWorkS یک پلتفرم امن برای دسترسی از راه دور است با دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی نشست، ورک‌اسپیس‌های امن (Chrome/Firefox/لینوکس دسکتاپ)، و یکپارچگی با SIEM/Monitoring/SSO.',
  ogImage: '/og/viworks-product.png',
});

export default function ProductPage() {
  return (
    <>
      <Header />
      <main>
        <ProductIntro />
        <ArchitectureSafe />
        <SecureWorkspaces />
        <CapabilityGrid />
        <AdminPolicy />
        <Integrations />
        <DeploymentStrip />
        <PerfScale />
        <PricingCta />
        <FAQ />
        <ComparisonTable />
      </main>
      <Footer />
    </>
  );
}
