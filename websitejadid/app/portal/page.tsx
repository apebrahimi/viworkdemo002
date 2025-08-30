'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { DashboardCards } from '@/components/portal/DashboardCards';
import { ContractSummary } from '@/components/portal/ContractSummary';
import { TicketList } from '@/components/portal/TicketList';
import { SlaMetrics } from '@/components/portal/SlaMetrics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function PortalDashboard() {
  const { isLoading, user, tenant, contract, tickets, notifications } = usePortal();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const openTickets = tickets.filter(ticket => 
    ['open', 'in_progress', 'waiting_customer'].includes(ticket.status)
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            خوش آمدید، <span className="font-medium text-foreground">{user?.name}</span> | {tenant?.name}
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards 
        contract={contract}
        openTickets={openTickets}
        unreadNotifications={unreadNotifications}
      />

      {/* Open Tickets */}
      <div className="portal-card">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                تیکت‌های باز
              </h3>
              <p className="text-muted-foreground mt-1">
                آخرین تیکت‌های پشتیبانی شما
              </p>
            </div>
            <a
              href="/portal/tickets"
              className="btn-elegant-outline px-4 py-2 rounded-lg text-sm font-medium"
            >
              مشاهده همه
            </a>
          </div>
        </div>
        <TicketList tickets={openTickets} showPagination={false} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contract Summary */}
        <div className="lg:col-span-1">
          <ContractSummary contract={contract} />
        </div>

        {/* SLA Metrics */}
        <div className="lg:col-span-1">
          <SlaMetrics />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="portal-card">
            <div className="p-6 border-b border-border/50">
              <h3 className="text-xl font-semibold text-foreground">
                فعالیت‌های اخیر
              </h3>
              <p className="text-muted-foreground mt-1">
                آخرین اعلان‌ها و رویدادها
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-4 rounded-xl smooth-transition ${
                      !notification.read ? 'bg-primary/5 border border-primary/10' : 'bg-muted/30'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.read ? 'bg-primary' : 'bg-muted-foreground/40'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {new Date(notification.created_at).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>هیچ فعالیتی وجود ندارد</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
