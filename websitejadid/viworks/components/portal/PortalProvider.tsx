'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'org_admin' | 'support_contact' | 'billing' | 'security_compliance' | 'viewer';
  auth_type: 'sso' | 'local';
  last_login_at: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
}

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

interface PortalContextType {
  user: User | null;
  tenant: Tenant | null;
  contract: Contract | null;
  tickets: Ticket[];
  notifications: Notification[];
  isLoading: boolean;
  refreshData: () => void;
  markNotificationAsRead: (id: string) => void;
  createTicket: (ticketData: Partial<Ticket>) => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'احمد محمدی',
  email: 'ahmad@company.com',
  role: 'org_admin',
  auth_type: 'sso',
  last_login_at: new Date().toISOString(),
};

const mockTenant: Tenant = {
  id: '1',
  name: 'شرکت نمونه',
  domain: 'company.com',
};

const mockContract: Contract = {
  id: '1',
  number: 'CON-2024-001',
  plan: 'Enterprise',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  auto_renew: true,
  status: 'active',
  days_until_expiry: 45,
};

const mockTickets: Ticket[] = [
  {
    id: '1',
    number: 'TKT-2024-001',
    title: 'مشکل در اتصال کلاینت',
    category: 'Technical',
    severity: 'sev_2',
    status: 'open',
    created_at: '2024-11-15T10:30:00Z',
    updated_at: '2024-11-15T10:30:00Z',
    sla_response_due_at: '2024-11-15T11:00:00Z',
  },
  {
    id: '2',
    number: 'TKT-2024-002',
    title: 'درخواست راهنمایی نصب',
    category: 'Support',
    severity: 'sev_3',
    status: 'resolved',
    created_at: '2024-11-10T14:20:00Z',
    updated_at: '2024-11-12T09:15:00Z',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'contract_renewal',
    title: 'یادآوری تمدید قرارداد',
    message: 'قرارداد شما در 45 روز آینده منقضی می‌شود',
    read: false,
    created_at: '2024-11-15T08:00:00Z',
  },
  {
    id: '2',
    type: 'ticket_update',
    title: 'به‌روزرسانی تیکت TKT-2024-001',
    message: 'پاسخ جدیدی برای تیکت شما ارسال شده است',
    read: true,
    created_at: '2024-11-15T11:30:00Z',
  },
];

export function PortalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      setTenant(mockTenant);
      setContract(mockContract);
      setTickets(mockTickets);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading portal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const createTicket = async (ticketData: Partial<Ticket>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      number: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      title: ticketData.title || '',
      category: ticketData.category || 'General',
      severity: ticketData.severity || 'sev_3',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...ticketData,
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value: PortalContextType = {
    user,
    tenant,
    contract,
    tickets,
    notifications,
    isLoading,
    refreshData,
    markNotificationAsRead,
    createTicket,
  };

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
