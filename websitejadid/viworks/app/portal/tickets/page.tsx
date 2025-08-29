'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { TicketList } from '@/components/portal/TicketList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Plus, 
  Search, 
  Filter,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
  const { isLoading, tickets } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || ticket.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusCount = (status: string) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  const getSeverityCount = (severity: string) => {
    return tickets.filter(ticket => ticket.severity === severity).length;
  };

  const openTickets = tickets.filter(ticket => 
    ['open', 'in_progress', 'waiting_customer'].includes(ticket.status)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تیکت‌ها</h1>
          <p className="text-slate-600 mt-1">
            مدیریت و پیگیری درخواست‌های پشتیبانی
          </p>
        </div>
        <Link href="/portal/tickets/new">
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            تیکت جدید
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">کل تیکت‌ها</p>
              <p className="text-2xl font-bold text-slate-900">{tickets.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">تیکت‌های باز</p>
              <p className="text-2xl font-bold text-blue-600">{openTickets.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">حل شده</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('resolved')}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">بسته شده</p>
              <p className="text-2xl font-bold text-slate-600">{getStatusCount('closed')}</p>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="جستجو در تیکت‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">باز ({getStatusCount('open')})</option>
              <option value="in_progress">در حال بررسی ({getStatusCount('in_progress')})</option>
              <option value="waiting_customer">در انتظار مشتری ({getStatusCount('waiting_customer')})</option>
              <option value="resolved">حل شده ({getStatusCount('resolved')})</option>
              <option value="closed">بسته ({getStatusCount('closed')})</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه شدت‌ها</option>
              <option value="sev_1">بحرانی ({getSeverityCount('sev_1')})</option>
              <option value="sev_2">شدید ({getSeverityCount('sev_2')})</option>
              <option value="sev_3">عادی ({getSeverityCount('sev_3')})</option>
              <option value="sev_4">کم ({getSeverityCount('sev_4')})</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(statusFilter !== 'all' || severityFilter !== 'all' || searchTerm) && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-600">فیلترهای فعال:</span>
            {statusFilter !== 'all' && (
              <Badge variant="outline" className="text-xs">
                وضعیت: {statusFilter}
              </Badge>
            )}
            {severityFilter !== 'all' && (
              <Badge variant="outline" className="text-xs">
                شدت: {severityFilter}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                جستجو: {searchTerm}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSeverityFilter('all');
              }}
              className="text-xs text-red-600 hover:text-red-700"
            >
              پاک کردن همه
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              نتایج ({filteredTickets.length} تیکت)
            </h3>
          </div>
        </div>
        <TicketList tickets={filteredTickets} />
      </div>
    </div>
  );
}
