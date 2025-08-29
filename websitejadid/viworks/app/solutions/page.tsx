import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SolutionsIntro } from '@/components/solutions/SolutionsIntro';
import { WorkspacesAfterConnect } from '@/components/solutions/WorkspacesAfterConnect';
import { IndustryGrid } from '@/components/solutions/IndustryGrid';
import { Playbooks } from '@/components/solutions/Playbooks';
import { ReferenceBlueprints } from '@/components/solutions/ReferenceBlueprints';
import { ComplianceGov } from '@/components/solutions/ComplianceGov';
import { OperationsOnboarding } from '@/components/solutions/OperationsOnboarding';
import { IntegrationsStrip } from '@/components/solutions/IntegrationsStrip';
import { KpiOutcomes } from '@/components/solutions/KpiOutcomes';
import { FAQ } from '@/components/solutions/FAQ';
import { NdaCta } from '@/components/common/NdaCta';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'راهکارهای ViWorkS | دسترسی امن از راه دور برای صنایع حساس',
  description: 'ViWorkS برای بانک/پرداخت، دولت، انرژی، سلامت، فناوری و MSPها راهکارهای دسترسی امن، ایزوله و قابل‌ممیزی ارائه می‌دهد—با SIEM/Monitoring/SSO و ورک‌اسپیس‌های امن (Chrome/Firefox/لینوکس دسکتاپ).',
  ogImage: '/og/viworks-solutions.png',
});

export default function SolutionsPage() {
  return (
    <>
      <Header />
      <main>
        <SolutionsIntro />
        <WorkspacesAfterConnect />
        <IndustryGrid />
        <Playbooks />
        <ReferenceBlueprints />
        <ComplianceGov />
        <OperationsOnboarding />
        <IntegrationsStrip />
        <KpiOutcomes />
        <FAQ />
        <NdaCta />
      </main>
      <Footer />
    </>
  );
}
