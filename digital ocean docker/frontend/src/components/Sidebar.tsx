'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Wifi, 
  Users, 
  Activity, 
  Shield, 
  Settings, 
  Menu,
  X,
  Zap,
  Globe,
  Database,
  Terminal,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/lib/translations';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ isOpen, onToggle, activeTab, onTabChange }: SidebarProps) {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: t('dashboard', language), icon: BarChart3, badge: null },
    { id: 'clients', name: t('clients', language), icon: Wifi, badge: '24' },
    { id: 'users', name: t('users', language), icon: Users, badge: '156' },
    { id: 'devices', name: t('devices', language), icon: Smartphone, badge: null },
    { id: 'monitoring', name: t('monitoring', language), icon: Activity, badge: null },
    { id: 'security', name: t('security', language), icon: Shield, badge: '3' },
    { id: 'servers', name: t('servers', language), icon: Globe, badge: '8' },
    { id: 'database', name: t('database', language), icon: Database, badge: null },
    { id: 'logs', name: t('logs', language), icon: Terminal, badge: null },
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNotificationsClick = () => {
    // TODO: Open notifications panel or navigate to notifications page
    console.log('Notifications clicked');
    // For now, just show an alert
    alert(language === 'fa' ? 'اعلان‌ها: این بخش در حال توسعه است' : 'Notifications: This section is under development');
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page or open settings modal
    console.log('Settings clicked');
    // For now, just show an alert
    alert(language === 'fa' ? 'تنظیمات: این بخش در حال توسعه است' : 'Settings: This section is under development');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-screen z-50
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:flex-shrink-0
        ${isExpanded ? 'lg:w-64' : 'lg:w-16'}
      `}>
        <div className={`
          h-screen ${isOpen ? 'w-64' : isExpanded ? 'w-64' : 'w-16'} lg:w-full
          bg-card/90 backdrop-blur-lg border-r border-border
          flex flex-col transition-all duration-300 ease-in-out
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isExpanded && (
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground">ViWorkS</h1>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fa' ? 'پنل مدیریت' : 'Admin Panel'}
                  </p>
                </div>
              </div>
            )}
            
            {!isExpanded && (
              <div className="flex justify-center w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleExpanded}
                className="hidden lg:flex p-1.5 rounded-md hover:bg-accent transition-colors"
                title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isExpanded ? (
                  isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                ) : (
                  isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              <button
                onClick={onToggle}
                className="lg:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search - Only show when expanded */}
          {isExpanded && (
            <div className="p-3">
              <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
                <input
                  type="text"
                  placeholder={t('search', language)}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-accent/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all`}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center justify-between
                    ${isExpanded ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'} 
                    rounded-lg text-sm font-medium transition-all duration-200 group
                    ${activeTab === item.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }
                  `}
                  title={!isExpanded ? item.name : undefined}
                >
                  {isExpanded ? (
                    <>
                      {isRTL ? (
                        <>
                          {/* Icon - Left side in RTL */}
                          <item.icon className="w-5 h-5 transition-transform group-hover:scale-105 ml-3" />
                          {/* Name - Center */}
                          <span className="flex-1 text-right">{item.name}</span>
                          {/* Badge - Right side in RTL */}
                          {item.badge && (
                            <span className={`
                              px-1.5 py-0.5 text-xs rounded-full font-medium
                              ${activeTab === item.id 
                                ? 'bg-primary-foreground/20 text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Icon - Left side in LTR */}
                          <item.icon className="w-5 h-5 transition-transform group-hover:scale-105 mr-3" />
                          {/* Name - Center */}
                          <span className="flex-1 text-left">
                            {item.name}
                          </span>
                          {/* Badge - Right side in LTR */}
                          {item.badge && (
                            <span className={`
                              px-1.5 py-0.5 text-xs rounded-full font-medium
                              ${activeTab === item.id 
                                ? 'bg-primary-foreground/20 text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Collapsed state - just icon */}
                      <item.icon className="w-5 h-5 transition-transform group-hover:scale-105" />
                      {item.badge && (
                        <div className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-2 h-2 bg-primary rounded-full`}></div>
                      )}
                    </>
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-border">
            <div className="space-y-1">
              {/* Notifications */}
              <button 
                onClick={handleNotificationsClick}
                className={`
                  w-full flex items-center justify-between
                  ${isExpanded ? 'px-3 py-2' : 'px-2 py-2 justify-center'} 
                  rounded-lg hover:bg-accent transition-colors group
                `}
                title={!isExpanded ? t('notifications', language) : undefined}
              >
                {isExpanded ? (
                  <>
                    {isRTL ? (
                      <>
                        {/* Icon with notification indicator - Left side in RTL */}
                        <div className="relative ml-3">
                          <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        {/* Name - Center */}
                        <span className="flex-1 text-right text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {t('notifications', language)}
                        </span>
                        {/* Badge - Right side in RTL */}
                        <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">3</span>
                      </>
                    ) : (
                      <>
                        {/* Icon with notification indicator - Left side in LTR */}
                        <div className="relative mr-3">
                          <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        {/* Name - Center */}
                        <span className="flex-1 text-left text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {t('notifications', language)}
                        </span>
                        {/* Badge - Right side in LTR */}
                        <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">3</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Collapsed state */}
                    <div className="relative">
                      <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <div className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-2 h-2 bg-red-500 rounded-full`}></div>
                    </div>
                  </>
                )}
              </button>

              {/* Settings */}
              <button 
                onClick={handleSettingsClick}
                className={`
                  w-full flex items-center justify-between
                  ${isExpanded ? 'px-3 py-2' : 'px-2 py-2 justify-center'} 
                  rounded-lg hover:bg-accent transition-colors group
                `}
                title={!isExpanded ? t('settings', language) : undefined}
              >
                {isExpanded ? (
                  <>
                    {isRTL ? (
                      <>
                        {/* Icon - Left side in RTL */}
                        <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-3" />
                        {/* Name - Center */}
                        <span className="flex-1 text-right text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {t('settings', language)}
                        </span>
                      </>
                    ) : (
                      <>
                        {/* Icon - Left side in LTR */}
                        <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
                        {/* Name - Center */}
                        <span className="flex-1 text-left text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {t('settings', language)}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
