'use client';

import { useState } from 'react';
import { DemoDashboardSection } from '@/components/sections/DemoDashboardSection';
import { UsersSection } from '@/components/sections/UsersSection';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { MonitoringSection } from '@/components/sections/MonitoringSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { ServersSection } from '@/components/sections/ServersSection';
import { DatabaseSection } from '@/components/sections/DatabaseSection';
import { LogsSection } from '@/components/sections/LogsSection';
import { DeviceManagementSection } from '@/components/sections/DeviceManagementSection';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ClientOnly } from '@/components/ClientOnly';
import { useAuth } from '@/contexts/AuthContext';

type Section = 
  | 'dashboard' 
  | 'users' 
  | 'clients' 
  | 'monitoring' 
  | 'security' 
  | 'servers' 
  | 'database' 
  | 'logs'
  | 'devices';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DemoDashboardSection />;
      case 'users':
        return <UsersSection />;
      case 'clients':
        return <ClientsSection />;
      case 'monitoring':
        return <MonitoringSection />;
      case 'security':
        return <SecuritySection />;
      case 'servers':
        return <ServersSection />;
      case 'database':
        return <DatabaseSection />;
      case 'logs':
        return <LogsSection />;
      case 'devices':
        return <DeviceManagementSection />;
      default:
        return <DemoDashboardSection />;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeSection}
        onTabChange={(tab) => setActiveSection(tab as Section)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-hidden">
        {/* Header */}
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <ClientOnly fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            }>
              {renderSection()}
            </ClientOnly>
          </div>
        </main>
      </div>
    </div>
  );
}
