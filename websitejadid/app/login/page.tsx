'use client';

import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 flex items-center justify-center">
                  <img
                    src="/images/viworks-logo.png"
                    alt="ViWorks Logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                ورود به پورتال ViWorkS
              </h1>
              <p className="text-slate-600">
                برای دسترسی به امکانات مدیریتی وارد شوید
              </p>
            </div>

            {/* Login Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900">
                  احراز هویت
                </CardTitle>
                <CardDescription className="text-slate-600">
                  نام کاربری و رمز عبور خود را وارد کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <LoginForm />
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>اتصال امن با رمزگذاری SSL</span>
              </div>
              <p className="text-xs text-slate-500">
                تمام اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود
              </p>
            </div>

            {/* Help Links */}
            <div className="mt-8 text-center space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm" className="text-sm">
                  فراموشی رمز عبور
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  راهنمای ورود
                </Button>
              </div>
              <div className="text-sm text-slate-600">
                مشکل در ورود؟{' '}
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                  تماس با پشتیبانی
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Here you would implement actual login logic
      console.log('Login attempt');
      // Redirect to portal after successful login
      window.location.href = '/portal';
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-slate-700">
          نام کاربری
        </label>
        <Input
          id="username"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          رمز عبور
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="رمز عبور خود را وارد کنید"
            className="h-11 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember" className="text-sm text-slate-600">
            مرا به خاطر بسپار
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            در حال ورود...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            ورود به پورتال
            <ArrowRight className="w-4 h-4 transform scale-x-[-1]" />
          </div>
        )}
      </Button>
    </form>
  );
}
