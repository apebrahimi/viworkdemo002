import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">صفحه مورد نظر یافت نشد</h1>
            <p className="text-lg text-slate-600 mb-8">
              صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
