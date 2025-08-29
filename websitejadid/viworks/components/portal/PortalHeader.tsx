'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Search,
  Menu,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { usePortal } from './PortalProvider';

export function PortalHeader() {
  const { user, tenant, notifications } = usePortal();
  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'user' | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read);

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      org_admin: 'مدیر سازمان',
      support_contact: 'تماس پشتیبانی',
      billing: 'مالی',
      security_compliance: 'امنیت و انطباق',
      viewer: 'مشاهده‌گر'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node) &&
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    // Prevent horizontal scrolling when dropdowns are open
    if (activeDropdown) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = '';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflowX = '';
    };
  }, [activeDropdown]);

  const toggleNotifications = () => {
    if (activeDropdown === 'notifications') {
      setActiveDropdown(null);
    } else {
      const rect = notificationsRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
      setActiveDropdown('notifications');
    }
  };

  const toggleUserMenu = () => {
    if (activeDropdown === 'user') {
      setActiveDropdown(null);
    } else {
      const rect = userMenuRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
      setActiveDropdown('user');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 px-6 py-4 relative overflow-visible sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/portal" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
              <img
                src="/images/viworks-logo.png"
                alt="ViWorks Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200">ViWorkS</span>
              <div className="text-xs text-muted-foreground">پورتال مشتریان</div>
            </div>
          </Link>
          
          {tenant && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
              <span className="font-medium text-foreground">{tenant.name}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="جستجو در تیکت‌ها، قراردادها..."
              className="modern-input w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="relative h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground border-2 border-white">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {activeDropdown === 'notifications' && typeof window !== 'undefined' && createPortal(
              <div className="fixed modern-dropdown z-50 max-h-96 overflow-hidden" style={{ 
                width: '380px',
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                maxWidth: 'calc(100vw - 2rem)',
                minWidth: '320px'
              }}>
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">اعلان‌ها</h3>
                    {unreadNotifications.length > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {unreadNotifications.length} جدید
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                      <p>هیچ اعلانی وجود ندارد</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border/30 hover:bg-accent/30 cursor-pointer smooth-transition ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          // Handle notification click
                          console.log('Notification clicked:', notification.id);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type || 'info')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm leading-tight">
                              {notification.title}
                            </h4>
                            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-muted-foreground/70 text-xs mt-2">
                              {new Date(notification.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-border/50">
                  <Link
                    href="/portal/notifications"
                    className="text-primary hover:text-primary/80 text-sm font-medium smooth-transition"
                    onClick={() => setActiveDropdown(null)}
                  >
                    مشاهده همه اعلان‌ها
                  </Link>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 h-10 px-3 rounded-xl hover:bg-accent/50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-foreground">
                  {user?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRoleLabel(user?.role || '')}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>

            {/* User Dropdown */}
            {activeDropdown === 'user' && typeof window !== 'undefined' && createPortal(
              <div className="fixed modern-dropdown z-50" style={{ 
                width: '280px',
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                maxWidth: 'calc(100vw - 2rem)',
                minWidth: '260px'
              }}>
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {user?.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        {getRoleLabel(user?.role || '')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/portal/profile"
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 rounded-lg smooth-transition"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <User className="w-4 h-4" />
                    <span>پروفایل</span>
                  </Link>
                  <Link
                    href="/portal/settings"
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 rounded-lg smooth-transition"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>تنظیمات</span>
                  </Link>
                  <hr className="my-2 border-border/50" />
                  <button
                    onClick={() => {
                      // Handle logout
                      console.log('Logout clicked');
                      setActiveDropdown(null);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg smooth-transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
