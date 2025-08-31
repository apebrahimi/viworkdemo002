import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'
import { QueryProvider } from '@/lib/query-client'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ViWorkS Admin Panel - پنل مدیریت',
  description: 'پنل مدیریت پیشرفته ViWorkS برای مدیریت سیستم VPN سازمانی - Advanced administrative interface for ViWorkS enterprise VPN platform',
  keywords: ['VPN', 'Admin', 'ViWorkS', 'Security', 'Management', 'پنل مدیریت', 'امنیت', 'شبکه خصوصی'],
  authors: [{ name: 'ViWorkS Team' }],
  creator: 'ViWorkS Development Team',
  publisher: 'ViWorkS',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'ViWorkS Admin Panel',
    description: 'Advanced administrative interface for ViWorkS enterprise VPN platform',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViWorkS Admin Panel',
    description: 'Advanced administrative interface for ViWorkS enterprise VPN platform',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <RealtimeProvider>
                  <div className="h-screen bg-background text-foreground overflow-hidden">
                    {children}
                  </div>
                  <Toaster />
                </RealtimeProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
