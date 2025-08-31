'use client';

import { useState, useMemo } from 'react';
import { 
  Wifi, 
  Plus, 
  Filter, 
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  PowerOff,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { useClients, useDeleteClient, useDisconnectClient } from '@/hooks/useApi';
import { Client } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ClientsTable } from '@/components/ui/DataTableNew';
import { AddClientModal } from '@/components/ui/AddClientModal';
import { formatDate, type SortField, type SortDirection, type SortConfig } from '@/lib/utils';



export function ClientsSection() {
  const { language, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['online', 'offline', 'connecting', 'disconnected', 'error']);
  const [platformFilter, setPlatformFilter] = useState<string[]>(['windows', 'macos', 'linux', 'android', 'ios']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });

  // API hooks
  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const deleteClientMutation = useDeleteClient();
  const disconnectClientMutation = useDisconnectClient();

  const clients = clientsData?.clients || [];

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           (client.mac_address?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           client.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.includes(client.status);
      const matchesPlatform = platformFilter.includes(client.platform);
      return matchesSearch && matchesStatus && matchesPlatform;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field as keyof Client];
      let bValue: any = b[sortConfig.field as keyof Client];

      // Handle special cases
      if (sortConfig.field === 'last_seen') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, statusFilter, platformFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };



  const handleDisconnect = (clientId: string) => {
    disconnectClientMutation.mutate(clientId, {
      onSuccess: () => {
        toast.success(language === 'fa' ? 'اتصال کلاینت قطع شد' : 'Client disconnected successfully');
      },
      onError: () => {
        toast.error(language === 'fa' ? 'خطا در قطع اتصال کلاینت' : 'Failed to disconnect client');
      }
    });
  };

  const handleDelete = (clientId: string) => {
    deleteClientMutation.mutate(clientId, {
      onSuccess: () => {
        toast.success(language === 'fa' ? 'کلاینت حذف شد' : 'Client deleted successfully');
      },
      onError: () => {
        toast.error(language === 'fa' ? 'خطا در حذف کلاینت' : 'Failed to delete client');
      }
    });
  };

  const handleAddClient = async (formData: { name: string; ipAddress: string; macAddress: string }) => {
    try {
      // TODO: Implement client creation API call
      console.log('Adding client:', formData);
      toast.success(language === 'fa' ? 'کلاینت با موفقیت اضافه شد' : 'Client added successfully');
      setShowAddModal(false);
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در افزودن کلاینت' : 'Failed to add client');
    }
  };

  const handleViewDetails = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
    }
  };

  const platforms = [...new Set(clients.map(c => c.platform))];

  // Default filter values
  const defaultStatusFilter = ['online', 'offline', 'connecting', 'disconnected', 'error'];
  const defaultPlatformFilter = ['windows', 'macos', 'linux', 'android', 'ios'];

  // Check if any filters are modified from default
  const hasActiveFilters = searchTerm || 
    statusFilter.length !== defaultStatusFilter.length || 
    platformFilter.length !== defaultPlatformFilter.length ||
    !statusFilter.every(s => defaultStatusFilter.includes(s)) ||
    !platformFilter.every(p => defaultPlatformFilter.includes(p));

  // Get active filter count (only count modified filters)
  const activeFilterCount = [
    searchTerm ? 1 : 0,
    statusFilter.length !== defaultStatusFilter.length || !statusFilter.every(s => defaultStatusFilter.includes(s)) ? 1 : 0,
    platformFilter.length !== defaultPlatformFilter.length || !platformFilter.every(p => defaultPlatformFilter.includes(p)) ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-screen" style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      <PageHeader
        title={t('clientsManagement', language)}
        description={t('clientsManagementDesc', language)}
        searchBar={
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={language === 'fa' ? 'جستجو در کلاینت‌ها...' : 'Search clients...'}
          />
        }
        stats={
          <>
            <button
              onClick={() => {
                setStatusFilter(defaultStatusFilter);
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === defaultStatusFilter.length && platformFilter.length === defaultPlatformFilter.length
                  ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span className="font-medium">{clients.length}</span>
              <span>{t('totalClients', language)}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('online')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['online']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('online')
                  ? 'bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-semibold'
                  : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span className="font-medium">{clients.filter(c => c.status === 'online').length}</span>
              <span>{t('online', language)}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('offline')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['offline']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('offline')
                  ? 'bg-gray-100 dark:bg-gray-950/50 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold'
                  : 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-950/50 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span className="font-medium">{clients.filter(c => c.status === 'offline').length}</span>
              <span>{t('offline', language)}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('error')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['error']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('error')
                  ? 'bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-semibold'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span className="font-medium">{clients.filter(c => c.status === 'error').length}</span>
              <span>{t('error', language)}</span>
            </button>
          </>
        }
        activeFilters={
          hasActiveFilters && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs border border-primary/20">
              <Filter className="w-3 h-3" />
              <span className="font-medium">{activeFilterCount}</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter(defaultStatusFilter);
                  setPlatformFilter(defaultPlatformFilter);
                }}
                className="ml-1 hover:bg-primary/20 rounded p-0.5 transition-colors"
                title={language === 'fa' ? 'بازنشانی فیلترها' : 'Reset filters'}
              >
                <X className="w-3 h-3" />
              </button>
        </div>
          )
        }
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="w-3 h-3" />
            {t('addClient', language)}
          </button>
        }
      />

      {/* Table */}
      <ClientsTable
        clients={filteredAndSortedClients}
        loading={clientsLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onDisconnect={handleDisconnect}
        onDelete={handleDelete}
        statusFilter={statusFilter}
        platformFilter={platformFilter}
        onStatusFilterChange={setStatusFilter}
        onPlatformFilterChange={setPlatformFilter}
      />

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClient}
      />
    </div>
  );
}
