import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { defaultLocale, getDirection } from '@/lib/i18n';
import { defaultMetadata } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = defaultLocale;
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* Plausible Analytics */}
        {process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
