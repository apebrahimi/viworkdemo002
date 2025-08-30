import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export const createMetadata = (config: SEOConfig): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viworks.example';
  const ogImage = config.ogImage ? `${baseUrl}${config.ogImage}` : `${baseUrl}/og/default.png`;

  return {
    title: config.title,
    description: config.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.canonical ? `${baseUrl}${config.canonical}` : undefined,
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
      siteName: 'ViWorkS',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImage],
    },
    other: {
      'theme-color': '#000000',
    },
  };
};

// Default metadata for the site
export const defaultMetadata: Metadata = createMetadata({
  title: 'ViWorkS | زیرساخت امن دسترسی از راه دور برای سازمان‌های حساس',
  description: 'ViWorkS با دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی کاربران و ثبت‌لاگ سازمانی، امنیت کار از راه دور را تضمین می‌کند.',
  ogImage: '/og/viworks-hero.png',
});

// Common metadata configurations
export const seoConfigs = {
  home: {
    title: 'ViWorkS | زیرساخت امن دسترسی از راه دور برای سازمان‌های حساس',
    description: 'ViWorkS با دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی کاربران و ثبت‌لاگ سازمانی، امنیت کار از راه دور را تضمین می‌کند. برای دمو و مشاوره استقرار (On-Prem/Cloud) تماس بگیرید.',
    ogImage: '/og/viworks-hero.png',
  },
  product: {
    title: 'محصول ViWorkS | دسترسی امن، پنهان و قابل‌ممیزی برای سازمان‌ها',
    description: 'ViWorkS یک پلتفرم امن برای دسترسی از راه دور است با دسترسی پنهان، احراز هویت چندلایه، ایزوله‌سازی نشست، ورک‌اسپیس‌های امن (Chrome/Firefox/لینوکس دسکتاپ)، و یکپارچگی با SIEM/Monitoring/SSO.',
    ogImage: '/og/viworks-product.png',
  },
  solutions: {
    title: 'راهکارهای ViWorkS | دسترسی امن از راه دور برای صنایع حساس',
    description: 'ViWorkS برای بانک/پرداخت، دولت، انرژی، سلامت، فناوری و MSPها راهکارهای دسترسی امن، ایزوله و قابل‌ممیزی ارائه می‌دهد—با SIEM/Monitoring/SSO و ورک‌اسپیس‌های امن.',
    ogImage: '/og/viworks-solutions.png',
  },
  security: {
    title: 'امنیت در ViWorkS | رویکرد، کنترل‌ها، ممیزی، و انطباق',
    description: 'ViWorkS با فلسفهٔ Zero Trust، هویت چندلایه، ایزوله‌سازی نشست‌ها، ثبت‌لاگ سازمانی و حریم خصوصی پیش‌فرض، دسترسی از راه دور را برای سازمان‌های حساس قابل اتکا می‌کند.',
    ogImage: '/og/viworks-security.png',
  },
  support: {
    title: 'پشتیبانی و خدمات سازمانی ViWorkS | SLA، آن‌بوردینگ، پورتال مشتری',
    description: 'پشتیبانی سازمانی با SLA شفاف (۸×۵، ۱۲×۵، ۲۴×۷)، مسیر Escalation، پورتال SSO، آن‌بوردینگ هدایت‌شده، و گزارش‌دهی دوره‌ای.',
    ogImage: '/og/viworks-support.png',
  },
  contact: {
    title: 'تماس با ViWorkS | درخواست دمو، مشاوره فروش، پشتیبانی',
    description: 'برای درخواست دمو، مشاوره فروش، پشتیبانی فنی یا اطلاعات بیشتر درباره ViWorkS با ما تماس بگیرید.',
    ogImage: '/og/viworks-contact.png',
  },
};
