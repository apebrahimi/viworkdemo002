'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Sun,
  Moon,
  Globe,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const { language, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: t('newClientConnected', language), time: language === 'fa' ? '2 دقیقه پیش' : '2 minutes ago', type: 'info' },
    { id: 2, title: t('securityAlert', language), time: language === 'fa' ? '5 دقیقه پیش' : '5 minutes ago', type: 'warning' },
    { id: 3, title: t('serverMaintenance', language), time: language === 'fa' ? '10 دقیقه پیش' : '10 minutes ago', type: 'success' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page or open profile modal
    console.log('Profile clicked');
    setIsProfileOpen(false);
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page or open settings modal
    console.log('Settings clicked');
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10 dark:border-white/10 light:border-black/10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold gradient-text">
              {language === 'fa' ? 'داشبورد مدیریت' : 'Management Dashboard'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === 'fa' ? 'مدیریت سیستم VPN سازمانی' : 'Enterprise VPN System Management'}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              placeholder={t('searchEverything', language)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors"
            title={t('toggleTheme', language)}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 glass-dark rounded-lg border border-white/10 dark:border-white/10 light:border-black/10 shadow-xl animate-fade-in z-50`}>
                <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
                  <h3 className="font-medium">{t('notifications', language)}</h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-white/10 dark:border-white/10 light:border-black/10 hover:bg-white/5 transition-colors">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2">
                  <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                    {language === 'fa' ? 'مشاهده همه اعلان‌ها' : 'View all notifications'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user?.username || (language === 'fa' ? 'مدیر سیستم' : 'System Admin')}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'admin@viworks.com'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 glass-dark rounded-lg border border-white/10 dark:border-white/10 light:border-black/10 shadow-xl animate-fade-in z-50`}>
                <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.username || (language === 'fa' ? 'مدیر سیستم' : 'System Admin')}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'admin@viworks.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('profile', language)}</span>
                  </button>
                  <button 
                    onClick={handleSettingsClick}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t('settings', language)}</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout', language)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
