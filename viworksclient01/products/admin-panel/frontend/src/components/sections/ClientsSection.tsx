'use client';

import { useState } from 'react';
import { 
  Wifi, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Power,
  PowerOff,
  Eye,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Globe,
  Monitor,
  Activity,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/lib/translations';
import { useClients, useDeleteClient, useDisconnectClient } from '@/hooks/useApi';
import { Client } from '@/lib/types';

export function ClientsSection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // API hooks
  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const deleteClientMutation = useDeleteClient();
  const disconnectClientMutation = useDisconnectClient();

  const clients = clientsData?.clients || [];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.ip_address?.includes(searchTerm) || false) ||
                         (client.mac_address?.includes(searchTerm) || false);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'connecting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'offline':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'connecting':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">مدیریت کلاینت‌ها</h1>
          <p className="text-muted-foreground">مدیریت و نظارت بر کلاینت‌های VPN</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن کلاینت
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="modern-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              placeholder="جستجو در کلاینت‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="online">آنلاین</option>
              <option value="offline">آفلاین</option>
              <option value="connecting">در حال اتصال</option>
              <option value="error">خطا</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {clientsLoading && (
        <div className="modern-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری کلاینت‌ها...</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="modern-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">کل کلاینت‌ها</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wifi className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="modern-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">آنلاین</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.status === 'online').length}
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="modern-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">آفلاین</p>
              <p className="text-2xl font-bold text-gray-600">
                {clients.filter(c => c.status === 'offline').length}
              </p>
            </div>
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="modern-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">خطا</p>
              <p className="text-2xl font-bold text-red-600">
                {clients.filter(c => c.status === 'error').length}
              </p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="modern-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  کلاینت
                </th>
                <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  آدرس IP
                </th>
                <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  پلتفرم
                </th>
                <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  وضعیت
                </th>
                <th className={`text-left p-4 font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  آخرین فعالیت
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Wifi className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.mac_address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{client.ip_address}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span>{client.platform}</span>
                      <span className="text-xs text-muted-foreground">v{client.version}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border ${getStatusColor(client.status)}`}>
                      {getStatusIcon(client.status)}
                      <span className="text-xs font-medium capitalize">{client.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {client.last_seen ? new Date(client.last_seen).toLocaleString('fa-IR') : 'نامشخص'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-accent rounded transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => disconnectClientMutation.mutate(client.id)}
                        disabled={disconnectClientMutation.isPending}
                        className="p-1 hover:bg-accent rounded transition-colors disabled:opacity-50"
                        title="قطع اتصال"
                      >
                        <PowerOff className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClientMutation.mutate(client.id)}
                        disabled={deleteClientMutation.isPending}
                        className="p-1 hover:bg-accent rounded transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modern-card w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">افزودن کلاینت جدید</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام کلاینت</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: Client-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">آدرس IP</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="192.168.1.100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">آدرس MAC</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="00:11:22:33:44:55"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  افزودن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
