'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { ContractSummary } from '@/components/portal/ContractSummary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Download,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function ContractsPage() {
  const { isLoading, contract } = usePortal();

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
          <h1 className="text-2xl font-bold text-slate-900">قراردادها</h1>
          <p className="text-slate-600 mt-1">
            مدیریت قراردادها و اطلاعات تجاری
          </p>
        </div>
      </div>

      {/* Contract Summary */}
      <ContractSummary contract={contract} />

      {/* Additional Contract Information */}
      {contract && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>اسناد قرارداد</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">قرارداد اصلی</p>
                      <p className="text-sm text-slate-600">PDF • 2.3 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 ml-2" />
                    دانلود
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">DPA (حفاظت از داده)</p>
                      <p className="text-sm text-slate-600">PDF • 1.1 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 ml-2" />
                    دانلود
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Order Form</p>
                      <p className="text-sm text-slate-600">PDF • 0.8 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 ml-2" />
                    دانلود
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>اطلاعات تمدید</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract.days_until_expiry <= 30 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">قرارداد در حال انقضا</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mb-4">
                    قرارداد شما در {contract.days_until_expiry} روز آینده منقضی می‌شود.
                    برای ادامه خدمات، لطفاً درخواست تمدید دهید.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 ml-2" />
                      درخواست تمدید
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      تماس با فروش
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {contract.days_until_expiry}
                    </div>
                    <p className="text-sm text-green-700">روز تا انقضا</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">تمدید خودکار:</span>
                      <Badge className={contract.auto_renew ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                        {contract.auto_renew ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">وضعیت:</span>
                      <Badge className="bg-green-100 text-green-800">
                        فعال
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      مشاهده جزئیات کامل
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Contract State */}
      {!contract && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">هیچ قراردادی یافت نشد</h3>
            <p className="text-slate-600 mb-6">
              برای مشاهده اطلاعات قرارداد، لطفاً با تیم فروش تماس بگیرید.
            </p>
            <Button>
              <ExternalLink className="w-4 h-4 ml-2" />
              تماس با فروش
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
