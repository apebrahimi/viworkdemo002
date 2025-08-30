'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export function SlaMetrics() {
  const slaData = {
    overall: {
      percentage: 98,
      status: 'on_target',
      trend: 'up'
    },
    response: {
      p50: '15m',
      p95: '30m',
      target: '30m',
      status: 'on_target'
    },
    resolve: {
      p50: '2h',
      p95: '4h',
      target: '4h',
      status: 'on_target'
    }
  };

  const severityMatrix = [
    {
      level: 'Sev-1',
      description: 'اختلال بحرانی',
      responseTarget: '≤ 15m',
      resolveTarget: '≤ 1h',
      color: 'bg-red-100 text-red-800'
    },
    {
      level: 'Sev-2',
      description: 'اختلال شدید',
      responseTarget: '≤ 30m',
      resolveTarget: '≤ 4h',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      level: 'Sev-3',
      description: 'مشکل عادی',
      responseTarget: '≤ 4h',
      resolveTarget: 'NBD',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      level: 'Sev-4',
      description: 'راهنمایی/Feature',
      responseTarget: '≤ 1d',
      resolveTarget: 'Backlog',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_target':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'at_risk':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'breached':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_target':
        return 'text-green-600';
      case 'at_risk':
        return 'text-yellow-600';
      case 'breached':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>عملکرد SLA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-3xl font-bold text-green-600">
              {slaData.overall.percentage}%
            </div>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-slate-600">عملکرد کلی ماه جاری</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {getStatusIcon(slaData.overall.status)}
            <span className={`text-sm font-medium ${getStatusColor(slaData.overall.status)}`}>
              در هدف
            </span>
          </div>
        </div>

        {/* Response and Resolve Times */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">زمان پاسخ‌گویی</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-900">{slaData.response.p50}</div>
                <div className="text-xs text-slate-600">میانگین (P50)</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-900">{slaData.response.p95}</div>
                <div className="text-xs text-slate-600">هدف (P95)</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">زمان حل مشکل</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-900">{slaData.resolve.p50}</div>
                <div className="text-xs text-slate-600">میانگین (P50)</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-900">{slaData.resolve.p95}</div>
                <div className="text-xs text-slate-600">هدف (P95)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Matrix */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">ماتریس شدت</h4>
          <div className="space-y-2">
            {severityMatrix.map((item) => (
              <div key={item.level} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className={item.color}>
                    {item.level}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-600">
                    پاسخ: {item.responseTarget}
                  </div>
                  <div className="text-xs text-slate-600">
                    حل: {item.resolveTarget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              برای مشاهده گزارش‌های تفصیلی
            </p>
            <a
              href="/portal/sla-reports"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              مشاهده گزارش‌های SLA →
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
