'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Download,
  Receipt,
  Users,
  Bell,
  Settings,
  ChevronRight,
  Plus,
  RefreshCw
} from 'lucide-react';

const navigation = [
  {
    name: 'داشبورد',
    href: '/portal',
    icon: LayoutDashboard,
    description: 'نمای کلی سیستم'
  },
  {
    name: 'قراردادها',
    href: '/portal/contracts',
    icon: FileText,
    description: 'مدیریت قراردادها'
  },
  {
    name: 'تیکت‌ها',
    href: '/portal/tickets',
    icon: MessageSquare,
    description: 'پشتیبانی و تیکت‌ها'
  },
  {
    name: 'گزارش‌های SLA',
    href: '/portal/sla-reports',
    icon: BarChart3,
    description: 'گزارش‌های عملکرد'
  },
  {
    name: 'دانلودها',
    href: '/portal/downloads',
    icon: Download,
    description: 'فایل‌های قابل دانلود'
  },
  {
    name: 'صورتحساب‌ها',
    href: '/portal/invoices',
    icon: Receipt,
    description: 'مدیریت مالی'
  },
  {
    name: 'کاربران و نقش‌ها',
    href: '/portal/users',
    icon: Users,
    description: 'مدیریت کاربران'
  },
  {
    name: 'اعلان‌ها',
    href: '/portal/notifications',
    icon: Bell,
    description: 'تنظیمات اعلان‌ها'
  },
  {
    name: 'تنظیمات',
    href: '/portal/settings',
    icon: Settings,
    description: 'تنظیمات سیستم'
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-white/80 backdrop-blur-sm border-r border-border/50 transition-all duration-300 sticky top-0 h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border/50">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
        >
          <ChevronRight className={cn(
            "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-200",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight">{item.name}</div>
                    <div className={cn(
                      "text-xs mt-0.5 leading-tight transition-all duration-200",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground/60 group-hover:text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-4 pb-6">
          <div className="border-t border-border/50 pt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
              اقدامات سریع
            </h3>
            <div className="space-y-2">
              <Link
                href="/portal/tickets/new"
                className="group flex items-center space-x-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium">تیکت جدید</div>
                  <div className="text-xs text-muted-foreground/60">ایجاد درخواست پشتیبانی</div>
                </div>
              </Link>
              <Link
                href="/portal/contracts/renewal"
                className="group flex items-center space-x-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium">درخواست تمدید</div>
                  <div className="text-xs text-muted-foreground/60">تمدید قرارداد</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Quick Actions */}
      {isCollapsed && (
        <div className="px-2 pb-6">
          <div className="border-t border-border/50 pt-6">
            <div className="space-y-2">
              <Link
                href="/portal/tickets/new"
                className="group flex items-center justify-center p-2 rounded-xl hover:bg-accent/50 transition-all duration-200"
                title="تیکت جدید"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </Link>
              <Link
                href="/portal/contracts/renewal"
                className="group flex items-center justify-center p-2 rounded-xl hover:bg-accent/50 transition-all duration-200"
                title="درخواست تمدید"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
