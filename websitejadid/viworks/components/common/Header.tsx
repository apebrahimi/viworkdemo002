'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, Shield, Award, Users, Globe } from 'lucide-react';
import { defaultLocale, t } from '@/lib/i18n';
import { analytics } from '@/lib/analytics';

const navigation = [
  { name: 'nav.home', href: '/' },
  { 
    name: 'nav.product', 
    href: '/product',
    submenu: [
      { name: 'ویژگی‌ها', href: '/product/features' },
      { name: 'معماری امنیتی', href: '/product/architecture' },
      { name: 'مقایسه', href: '/product/comparison' },
    ]
  },
  { 
    name: 'nav.solutions', 
    href: '/solutions',
    submenu: [
      { name: 'سازمان‌های مالی', href: '/solutions/financial' },
      { name: 'دولت و حاکمیت', href: '/solutions/government' },
      { name: 'انرژی و زیرساخت', href: '/solutions/energy' },
      { name: 'سلامت', href: '/solutions/healthcare' },
    ]
  },
  { name: 'nav.security', href: '/security' },
  { 
    name: 'nav.support', 
    href: '/support',
    submenu: [
      { name: 'پشتیبانی فنی', href: '/support/technical' },
      { name: 'مستندات', href: '/support/docs' },
      { name: 'آموزش', href: '/support/training' },
    ]
  },
  { name: 'nav.contact', href: '/contact' },
];

const enterpriseFeatures = [
  { icon: Shield, text: 'ISO 27001', color: 'text-blue-400' },
  { icon: Award, text: 'SOC 2 Type II', color: 'text-green-400' },
  { icon: Users, text: 'Enterprise Support', color: 'text-purple-400' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const locale = defaultLocale;

  const handleCtaClick = (type: 'demo' | 'sales' | 'support') => {
    switch (type) {
      case 'demo':
        analytics.heroCtaDemoClick();
        break;
      case 'sales':
        analytics.heroCtaSalesClick();
        break;
      case 'support':
        analytics.supportPortalClick();
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Enterprise Banner */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">پلتفرم امنیتی سازمانی</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={feature.text} className="flex items-center gap-1">
                    <feature.icon className={`w-3 h-3 ${feature.color}`} />
                    <span className="text-xs">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">پشتیبانی 24/7</span>
              <Link href="/support" className="text-xs hover:underline">
                تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">ViWorks</span>
                <div className="text-xs text-slate-500 dark:text-slate-400">امنیت در دورکاری</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 py-2"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {t(locale, item.name)}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>
                
                {/* Dropdown Menu */}
                {item.submenu && activeDropdown === item.name && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCtaClick('support')}
              asChild
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Link href="/support">
                پشتیبانی
              </Link>
            </Button>
            <Button
              onClick={() => handleCtaClick('demo')}
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
            >
              <Link href="/contact?type=demo">
                درخواست دمو
              </Link>
            </Button>
            <Button
              onClick={() => handleCtaClick('sales')}
              asChild
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
            >
              <Link href="/contact?type=sales">
                {t(locale, 'cta.talkToSales')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors block py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(locale, item.name)}
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <Button
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                      onClick={() => {
                        handleCtaClick('demo');
                        setIsMobileMenuOpen(false);
                      }}
                      asChild
                    >
                      <Link href="/contact?type=demo">
                        درخواست دمو
                      </Link>
                    </Button>
                    <Button
                      className="w-full justify-start bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                      onClick={() => {
                        handleCtaClick('sales');
                        setIsMobileMenuOpen(false);
                      }}
                      asChild
                    >
                      <Link href="/contact?type=sales">
                        {t(locale, 'cta.talkToSales')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
