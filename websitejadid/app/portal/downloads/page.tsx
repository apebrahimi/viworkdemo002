'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Monitor,
  Smartphone,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function DownloadsPage() {
  const { isLoading } = usePortal();

  const downloads = [
    {
      id: '1',
      name: 'ViWorkS Client for Windows',
      version: '2.1.0',
      platform: 'Windows',
      size: '45.2 MB',
      type: 'client',
      description: 'کلاینت رسمی ViWorkS برای سیستم‌عامل Windows',
      icon: Monitor,
      downloadUrl: '#',
      checksum: 'sha256: a1b2c3d4e5f6...',
      releaseDate: '2024-11-15',
      isSigned: true
    },
    {
      id: '2',
      name: 'ViWorkS Client for macOS',
      version: '2.1.0',
      platform: 'macOS',
      size: '52.8 MB',
      type: 'client',
      description: 'کلاینت رسمی ViWorkS برای سیستم‌عامل macOS',
      icon: Monitor,
      downloadUrl: '#',
      checksum: 'sha256: f6e5d4c3b2a1...',
      releaseDate: '2024-11-15',
      isSigned: true
    },
    {
      id: '3',
      name: 'ViWorkS Client for Linux',
      version: '2.1.0',
      platform: 'Linux',
      size: '38.5 MB',
      type: 'client',
      description: 'کلاینت رسمی ViWorkS برای سیستم‌عامل Linux',
      icon: Monitor,
      downloadUrl: '#',
      checksum: 'sha256: 1a2b3c4d5e6f...',
      releaseDate: '2024-11-15',
      isSigned: true
    },
    {
      id: '4',
      name: 'ViWorkS Mobile App',
      version: '1.8.2',
      platform: 'Android/iOS',
      size: '28.3 MB',
      type: 'mobile',
      description: 'اپلیکیشن موبایل ViWorkS برای Android و iOS',
      icon: Smartphone,
      downloadUrl: '#',
      checksum: 'sha256: 6f5e4d3c2b1a...',
      releaseDate: '2024-11-10',
      isSigned: true
    }
  ];

  const documentation = [
    {
      id: '1',
      name: 'راهنمای نصب و راه‌اندازی',
      type: 'installation',
      size: '2.1 MB',
      description: 'راهنمای کامل نصب و پیکربندی کلاینت ViWorkS',
      icon: FileText,
      downloadUrl: '#',
      releaseDate: '2024-11-15'
    },
    {
      id: '2',
      name: 'راهنمای کاربری',
      type: 'user_guide',
      size: '5.8 MB',
      description: 'راهنمای استفاده از قابلیت‌های ViWorkS',
      icon: FileText,
      downloadUrl: '#',
      releaseDate: '2024-11-15'
    },
    {
      id: '3',
      name: 'Release Notes v2.1.0',
      type: 'release_notes',
      size: '0.3 MB',
      description: 'تغییرات و بهبودهای نسخه 2.1.0',
      icon: FileText,
      downloadUrl: '#',
      releaseDate: '2024-11-15'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">دانلودها</h1>
          <p className="text-slate-600 mt-1">
            کلاینت‌های رسمی و مستندات ViWorkS
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">امنیت دانلودها</h3>
              <p className="text-blue-800 text-sm">
                تمام فایل‌های ارائه شده در این صفحه دارای امضای دیجیتال معتبر هستند. 
                قبل از نصب، حتماً صحت فایل را با استفاده از Checksum ارائه شده بررسی کنید.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Downloads */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">کلاینت‌های رسمی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-slate-600">نسخه {item.version}</p>
                    </div>
                  </div>
                  {item.isSigned && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      امضا شده
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{item.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">سکو:</span>
                    <span className="font-medium">{item.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">حجم:</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">تاریخ انتشار:</span>
                    <span className="font-medium">
                      {new Date(item.releaseDate).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <Download className="w-4 h-4 ml-2" />
                    دانلود
                  </Button>
                  <Button variant="outline" className="w-full text-xs">
                    <ExternalLink className="w-3 h-3 ml-1" />
                    مشاهده Checksum
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">مستندات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentation.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <item.icon className="w-8 h-8 text-slate-600" />
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-slate-600">{item.size}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{item.description}</p>
                
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">تاریخ انتشار:</span>
                    <span className="font-medium">
                      {new Date(item.releaseDate).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 ml-2" />
                  دانلود
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>منابع اضافی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">مرکز پشتیبانی</h4>
              <p className="text-sm text-slate-600 mb-3">
                دسترسی به راهنماها، آموزش‌ها و FAQ
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 ml-2" />
                مشاهده
              </Button>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">API Documentation</h4>
              <p className="text-sm text-slate-600 mb-3">
                مستندات API برای توسعه‌دهندگان
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 ml-2" />
                مشاهده
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
