'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  AlertTriangle,
  Download,
  ExternalLink
} from 'lucide-react';

interface Contract {
  id: string;
  number: string;
  plan: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  status: 'active' | 'expired' | 'pending_renewal';
  days_until_expiry: number;
}

interface ContractSummaryProps {
  contract: Contract | null;
}

export function ContractSummary({ contract }: ContractSummaryProps) {
  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>قرارداد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">هیچ قراردادی یافت نشد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending_renewal':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'expired':
        return 'منقضی شده';
      case 'pending_renewal':
        return 'در انتظار تمدید';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const isExpiringSoon = contract.days_until_expiry <= 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>جزئیات قرارداد</span>
          </div>
          <Badge className={getStatusColor(contract.status)}>
            {getStatusLabel(contract.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Number */}
        <div>
          <label className="text-sm font-medium text-slate-700">شماره قرارداد</label>
          <p className="text-lg font-semibold text-slate-900">{contract.number}</p>
        </div>

        {/* Plan */}
        <div>
          <label className="text-sm font-medium text-slate-700">نوع پلن</label>
          <p className="text-lg font-semibold text-slate-900">{contract.plan}</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">تاریخ شروع</label>
            <p className="text-sm text-slate-900">{formatDate(contract.start_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">تاریخ پایان</label>
            <p className="text-sm text-slate-900">{formatDate(contract.end_date)}</p>
          </div>
        </div>

        {/* Auto Renew */}
        <div>
          <label className="text-sm font-medium text-slate-700">تمدید خودکار</label>
          <p className="text-sm text-slate-900">
            {contract.auto_renew ? 'فعال' : 'غیرفعال'}
          </p>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  قرارداد در حال انقضا
                </p>
                <p className="text-xs text-yellow-700">
                  {contract.days_until_expiry} روز تا انقضا باقی مانده است
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <Button className="w-full" variant="outline">
            <Download className="w-4 h-4 ml-2" />
            دانلود قرارداد
          </Button>
          
          {isExpiringSoon && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 ml-2" />
              درخواست تمدید
            </Button>
          )}
          
          <Button className="w-full" variant="ghost">
            <ExternalLink className="w-4 h-4 ml-2" />
            مشاهده جزئیات کامل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
