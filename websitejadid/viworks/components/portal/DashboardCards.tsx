'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MessageSquare, 
  Bell, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Users,
  Activity
} from 'lucide-react';
import Link from 'next/link';

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

interface Ticket {
  id: string;
  number: string;
  title: string;
  category: string;
  severity: 'sev_1' | 'sev_2' | 'sev_3' | 'sev_4';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  sla_response_due_at?: string;
  sla_resolve_due_at?: string;
}

interface Notification {
  id: string;
  type: 'ticket_update' | 'contract_renewal' | 'sla_report' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface DashboardCardsProps {
  contract: Contract | null;
  openTickets: Ticket[];
  unreadNotifications: Notification[];
}

export function DashboardCards({ contract, openTickets, unreadNotifications }: DashboardCardsProps) {
  const getSeverityCount = (severity: string) => {
    return openTickets.filter(ticket => ticket.severity === severity).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-success';
      case 'expired':
        return 'status-error';
      case 'pending_renewal':
        return 'status-warning';
      default:
        return 'status-info';
    }
  };

  const getContractStatusLabel = (status: string) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Contract Status */}
      <div className="portal-card group">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {contract && (
              <Badge className={getStatusColor(contract.status)}>
                {getContractStatusLabel(contract.status)}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              {contract?.plan || 'N/A'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contract?.number || 'قرارداد یافت نشد'}
            </p>
            {contract && contract.days_until_expiry <= 30 && (
              <div className="flex items-center space-x-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                <AlertTriangle className="w-3 h-3" />
                <span>تمدید در {contract.days_until_expiry} روز</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Open Tickets */}
      <div className="portal-card group">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <Link href="/portal/tickets">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                مشاهده همه
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">{openTickets.length}</h3>
              <span className="text-sm text-muted-foreground">تیکت باز</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-600 font-medium">Sev-1:</span>
                <span className="font-bold">{getSeverityCount('sev_1')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-600 font-medium">Sev-2:</span>
                <span className="font-bold">{getSeverityCount('sev_2')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 font-medium">Sev-3:</span>
                <span className="font-bold">{getSeverityCount('sev_3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Performance */}
      <div className="portal-card group">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-xs text-emerald-600">
                <CheckCircle className="w-3 h-3" />
                <span>در هدف</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-emerald-600">98%</h3>
              <span className="text-sm text-muted-foreground">ماه جاری</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">پاسخ‌گویی:</span>
                <span className="font-bold text-foreground">15 دقیقه</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">حل مشکل:</span>
                <span className="font-bold text-foreground">2 ساعت</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="portal-card group">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <Link href="/portal/notifications">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                مشاهده همه
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">{unreadNotifications.length}</h3>
              <span className="text-sm text-muted-foreground">اعلان جدید</span>
            </div>
            <p className="text-xs text-muted-foreground">
              اعلان‌های خوانده نشده
            </p>
            {unreadNotifications.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>آخرین: {new Date(unreadNotifications[0].created_at).toLocaleDateString('fa-IR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
