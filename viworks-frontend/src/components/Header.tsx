'use client';

import { useState } from 'react';
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
  Globe
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

  const notifications = [
    { id: 1, title: t('newClientConnected', language), time: '2 دقیقه پیش', type: 'info' },
    { id: 2, title: t('securityAlert', language), time: '5 دقیقه پیش', type: 'warning' },
    { id: 3, title: t('serverMaintenance', language), time: '10 دقیقه پیش', type: 'info' },
  ];

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
            <h2 className="text-lg font-semibold gradient-text">داشبورد مدیریت</h2>
            <p className="text-xs text-muted-foreground">مدیریت سیستم VPN سازمانی</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchEverything', language)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user?.username || 'مدیر سیستم'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'admin@viworks.com'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 glass-dark rounded-lg border border-white/10 dark:border-white/10 light:border-black/10 shadow-xl animate-fade-in">
                <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.username || 'مدیر سیستم'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'admin@viworks.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors text-sm">
                    <User className="w-4 h-4" />
                    <span>{t('profile', language)}</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors text-sm">
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
