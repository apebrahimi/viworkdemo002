'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  Eye,
  Plus,
  Calendar,
  User
} from 'lucide-react';

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

interface TicketListProps {
  tickets: Ticket[];
  showPagination?: boolean;
}

export function TicketList({ tickets, showPagination = true }: TicketListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'sev_1':
        return 'status-error';
      case 'sev_2':
        return 'status-warning';
      case 'sev_3':
        return 'status-info';
      case 'sev_4':
        return 'status-success';
      default:
        return 'status-info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'status-info';
      case 'in_progress':
        return 'status-warning';
      case 'waiting_customer':
        return 'status-warning';
      case 'resolved':
        return 'status-success';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'status-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'باز';
      case 'in_progress':
        return 'در حال بررسی';
      case 'waiting_customer':
        return 'در انتظار مشتری';
      case 'resolved':
        return 'حل شده';
      case 'closed':
        return 'بسته';
      default:
        return status;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'sev_1':
        return 'بحرانی';
      case 'sev_2':
        return 'شدید';
      case 'sev_3':
        return 'عادی';
      case 'sev_4':
        return 'کم';
      default:
        return severity;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const isSlaBreached = (ticket: Ticket) => {
    if (!ticket.sla_response_due_at) return false;
    return new Date() > new Date(ticket.sla_response_due_at);
  };

  const isSlaAtRisk = (ticket: Ticket) => {
    if (!ticket.sla_response_due_at) return false;
    const dueDate = new Date(ticket.sla_response_due_at);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 2 && hoursDiff > 0;
  };

  // Pagination
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">هیچ تیکتی یافت نشد</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          هنوز هیچ تیکتی ایجاد نشده است. برای دریافت پشتیبانی، تیکت جدیدی ایجاد کنید.
        </p>
        <Link href="/portal/tickets/new">
          <Button variant="elegant" size="lg">
            <Plus className="w-5 h-5 ml-2" />
            ایجاد تیکت جدید
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="text-right py-4 px-6 font-semibold text-foreground">شماره</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">عنوان</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">دسته‌بندی</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">شدت</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">وضعیت</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">تاریخ ایجاد</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">SLA</th>
              <th className="text-right py-4 px-6 font-semibold text-foreground">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-border/30 hover:bg-accent/30 smooth-transition">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                    {ticket.number}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-foreground leading-tight">{ticket.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(ticket.updated_at)}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    {ticket.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={getSeverityColor(ticket.severity) as "default" | "secondary" | "destructive" | "outline"}>
                    {getSeverityLabel(ticket.severity)}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={getStatusColor(ticket.status) as "default" | "secondary" | "destructive" | "outline"}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(ticket.created_at)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {isSlaBreached(ticket) ? (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">تخطی</span>
                    </div>
                  ) : isSlaAtRisk(ticket) ? (
                    <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">در خطر</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">عادی</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <Link href={`/portal/tickets/${ticket.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            نمایش {startIndex + 1} تا {Math.min(endIndex, tickets.length)} از {tickets.length} تیکت
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              قبلی
            </Button>
            <span className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-lg border">
              صفحه {currentPage} از {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              بعدی
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
