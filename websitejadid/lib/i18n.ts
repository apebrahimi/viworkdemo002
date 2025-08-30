// Internationalization helper for RTL support
// Default: fa-IR (RTL), optional: en (LTR)

export type Locale = 'fa-IR' | 'en';

export const defaultLocale: Locale = 'fa-IR';

export const locales: Locale[] = ['fa-IR', 'en'];

export const localeConfig = {
  'fa-IR': {
    name: 'فارسی',
    dir: 'rtl',
    flag: '🇮🇷',
  },
  'en': {
    name: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
  },
} as const;

export const isRTL = (locale: Locale): boolean => {
  return localeConfig[locale].dir === 'rtl';
};

export const getDirection = (locale: Locale): 'rtl' | 'ltr' => {
  return localeConfig[locale].dir;
};

// Utility function to get text direction class
export const getTextDirectionClass = (locale: Locale): string => {
  return isRTL(locale) ? 'text-right' : 'text-left';
};

// Utility function to get flex direction class
export const getFlexDirectionClass = (locale: Locale): string => {
  return isRTL(locale) ? 'flex-row-reverse' : 'flex-row';
};

// Utility function to get margin/padding direction classes
export const getSpacingDirectionClasses = (locale: Locale) => {
  return {
    marginStart: isRTL(locale) ? 'mr-auto' : 'ml-auto',
    marginEnd: isRTL(locale) ? 'ml-auto' : 'mr-auto',
    paddingStart: isRTL(locale) ? 'pr-4' : 'pl-4',
    paddingEnd: isRTL(locale) ? 'pl-4' : 'pr-4',
  };
};

// Content translations (minimal for now, can be expanded)
export const translations = {
  'fa-IR': {
    // Navigation
    nav: {
      home: 'خانه',
      product: 'محصول',
      solutions: 'راهکارها',
      security: 'امنیت',
      support: 'پشتیبانی',
      contact: 'تماس',
      company: 'شرکت',
    },
    // CTAs
    cta: {
      requestDemo: 'درخواست دمو',
      talkToSales: 'مشاوره محصول',
      contactSupport: 'تماس پشتیبانی',
      learnMore: 'بیشتر بدانید',
      getStarted: 'شروع کنید',
    },
    // Common
    common: {
      loading: 'در حال بارگذاری...',
      error: 'خطا',
      success: 'موفقیت',
      cancel: 'انصراف',
      save: 'ذخیره',
      delete: 'حذف',
      edit: 'ویرایش',
      view: 'مشاهده',
    },
  },
  'en': {
    // Navigation
    nav: {
      home: 'Home',
      product: 'Product',
      solutions: 'Solutions',
      security: 'Security',
      support: 'Support',
      contact: 'Contact',
      company: 'Company',
    },
    // CTAs
    cta: {
      requestDemo: 'Request Demo',
      talkToSales: 'Talk to Sales',
      contactSupport: 'Contact Support',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
    },
  },
} as const;

export const t = (locale: Locale, key: string, fallback?: string): string => {
  const keys = key.split('.');
  let value: unknown = translations[locale];
  
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
    if (value === undefined) break;
  }
  
  if (value === undefined && fallback) {
    return fallback;
  }
  
  return (value as string) || key;
};
