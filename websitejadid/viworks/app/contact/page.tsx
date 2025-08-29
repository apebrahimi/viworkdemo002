import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContactForm } from '@/components/marketing/ContactForm';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'تماس با ViWorkS | درخواست دمو، مشاوره فروش، پشتیبانی',
  description: 'برای درخواست دمو، مشاوره فروش، پشتیبانی فنی یا اطلاعات بیشتر درباره ViWorkS با ما تماس بگیرید.',
  ogImage: '/og/viworks-contact.png',
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const contactType = params.type || 'general';

  return (
    <>
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              تماس با ViWorkS
            </h1>
            <p className="text-lg text-muted-foreground">
              برای درخواست دمو، مشاوره فروش یا پشتیبانی فنی با ما تماس بگیرید
            </p>
          </div>
          <ContactForm type={contactType} />
        </div>
      </main>
      <Footer />
    </>
  );
}
