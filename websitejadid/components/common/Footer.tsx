import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'محصول', href: '/product' },
    { name: 'ویژگی‌ها', href: '/product/features' },
    { name: 'معماری امنیتی', href: '/product/architecture' },
    { name: 'مقایسه', href: '/product/comparison' },
    { name: 'قیمت‌گذاری', href: '/pricing' },
  ],
  solutions: [
    { name: 'راهکارها', href: '/solutions' },
    { name: 'سازمان‌های مالی', href: '/solutions/financial' },
    { name: 'دولت و حاکمیت', href: '/solutions/government' },
    { name: 'انرژی و زیرساخت', href: '/solutions/energy' },
    { name: 'سلامت', href: '/solutions/healthcare' },
  ],
  support: [
    { name: 'پشتیبانی', href: '/support' },
    { name: 'پشتیبانی فنی', href: '/support/technical' },
    { name: 'مرکز دانش', href: '/support/kb' },
    { name: 'مستندات', href: '/support/docs' },
    { name: 'آموزش', href: '/support/training' },
    { name: 'وضعیت سرویس', href: '/status' },
  ],
  company: [
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس', href: '/contact' },
    { name: 'فرصت‌های شغلی', href: '/careers' },
    { name: 'اخبار', href: '/news' },
    { name: 'وبلاگ', href: '/blog' },
  ],
};

const contactInfo = [
  { icon: Mail, text: 'info@viworks.com', href: 'mailto:info@viworks.com' },
  { icon: Phone, text: '(+98) 933 001 2727', href: 'tel:+989330012727' },
  { icon: MapPin, text: 'تهران، ایران', href: '#' },
];

const complianceBadges = [
  { name: 'ISO 27001', status: 'تأیید شده', color: 'bg-green-100 text-green-800' },
  { name: 'SOC 2 Type II', status: 'تأیید شده', color: 'bg-blue-100 text-blue-800' },
  { name: 'GDPR', status: 'سازگار', color: 'bg-purple-100 text-purple-800' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          {/* Bottom Section - Brand & Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Brand & Description */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img 
                    src="/images/viworks-logo.png" 
                    alt="ViWorks Logo" 
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">ViWorks</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-400">امنیت در دورکاری</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed max-w-md">
                زیرساخت امن دسترسی از راه دور برای سازمان‌های حساس. 
                امنیت، عملکرد و سهولت استفاده در یک پلتفرم واحد.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div key={contact.text} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      <contact.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <Link 
                      href={contact.href}
                      className="text-slate-300 hover:text-white transition-colors text-sm"
                      dir="ltr"
                    >
                      {contact.text}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                درخواست اطلاعات بیشتر
              </h3>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                با توجه به ماهیت امنیت محور این راهکار اطلاعات در وبسایت به صورت حداقلی ارایه شده است. لذا جهت دریافت اطلاعات دقیق تر درباره امکانات و قابلیت های راهکار برای هماهنگی جلسه حضوری با ما در ارتباط باشید.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="tel"
                  placeholder="شماره تماس (اختیاری)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
                  ارسال درخواست
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-400">
                <p>© {currentYear} ViWorks. تمامی حقوق محفوظ است.</p>
                <div className="flex items-center space-x-4">
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    حریم خصوصی
                  </Link>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    شرایط استفاده
                  </Link>
                  <Link href="/compliance" className="hover:text-white transition-colors">
                    انطباق
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>زبان:</span>
                <Link href="/" className="text-white font-medium">
                  فارسی
                </Link>
                <span>|</span>
                <Link href="/en" className="hover:text-white transition-colors">
                  English
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
