'use client';

import { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Plus, 
  Filter, 
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { MobileAppsTable } from '@/components/ui/DataTableNew';
import { formatDate, type SortField, type SortDirection, type SortConfig } from '@/lib/utils';

interface MobileApp {
  id: string;
  userName: string;
  deviceName: string;
  deviceModel: string;
  platform: 'android' | 'ios';
  status: 'active' | 'inactive' | 'pending' | 'maintenance';
  lastActiveCity: string;
  lastActivity: string;
  bindingDate: string;
  osVersion: string;
  appVersion: string;
}

export function MobileApplicationsSection() {
  const { language, isRTL } = useLanguage();
  
  // Mock data - replace with actual API calls
  const [apps] = useState<MobileApp[]>([
    {
      id: '1',
      userName: 'احمد محمدی',
      deviceName: 'Samsung Galaxy S23',
      deviceModel: 'SM-S918B',
      platform: 'android',
      status: 'active',
      lastActiveCity: 'تهران',
      lastActivity: '2024-01-15T10:30:00Z',
      bindingDate: '2024-01-01T00:00:00Z',
      osVersion: 'Android 14',
      appVersion: '1.2.3'
    },
    {
      id: '2',
      userName: 'فاطمه احمدی',
      deviceName: 'iPhone 15 Pro',
      deviceModel: 'iPhone16,1',
      platform: 'ios',
      status: 'active',
      lastActiveCity: 'اصفهان',
      lastActivity: '2024-01-14T15:45:00Z',
      bindingDate: '2024-01-05T00:00:00Z',
      osVersion: 'iOS 17.2',
      appVersion: '1.1.8'
    },
    {
      id: '3',
      userName: 'علی رضایی',
      deviceName: 'Google Pixel 7',
      deviceModel: 'Pixel 7',
      platform: 'android',
      status: 'maintenance',
      lastActiveCity: 'مشهد',
      lastActivity: '2024-01-13T09:20:00Z',
      bindingDate: '2024-01-10T00:00:00Z',
      osVersion: 'Android 14',
      appVersion: '2.0.1'
    },
    {
      id: '4',
      userName: 'مریم کریمی',
      deviceName: 'OnePlus 11',
      deviceModel: 'CPH2447',
      platform: 'android',
      status: 'pending',
      lastActiveCity: 'شیراز',
      lastActivity: '2024-01-12T14:30:00Z',
      bindingDate: '2024-01-08T00:00:00Z',
      osVersion: 'Android 13',
      appVersion: '0.9.5'
    }
  ]);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string[]>(['android', 'ios', 'cross-platform']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['active', 'inactive', 'pending', 'maintenance']);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Computed values
  const platforms = ['android', 'ios'];
  const statuses = ['active', 'inactive', 'pending', 'maintenance'];

  // Default filter values
  const defaultPlatformFilter = ['android', 'ios'];
  const defaultStatusFilter = ['active', 'inactive', 'pending', 'maintenance'];

  // Check if any filters are modified from default
  const hasActiveFilters = searchTerm || 
    platformFilter.length !== defaultPlatformFilter.length || 
    statusFilter.length !== defaultStatusFilter.length ||
    !platformFilter.every(p => defaultPlatformFilter.includes(p)) ||
    !statusFilter.every(s => defaultStatusFilter.includes(s));

  // Get active filter count (only count modified filters)
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (platformFilter.length !== defaultPlatformFilter.length) count++;
    if (statusFilter.length !== defaultStatusFilter.length) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Filter and sort apps
  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter(app => {
      const matchesSearch = app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.lastActiveCity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter.includes(app.platform);
      const matchesStatus = statusFilter.includes(app.status);
      return matchesSearch && matchesPlatform && matchesStatus;
    });

    // Sort apps
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field as keyof MobileApp];
      let bValue: any = b[sortConfig.field as keyof MobileApp];

      // Handle special cases
      if (sortConfig.field === 'lastActivity' || sortConfig.field === 'bindingDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
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
  }, [apps, searchTerm, platformFilter, statusFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleActivate = (appId: string) => {
    // TODO: Implement API call
    toast.success(language === 'fa' ? 'اپلیکیشن فعال شد' : 'App activated successfully');
  };

  const handleDeactivate = (appId: string) => {
    // TODO: Implement API call
    toast.success(language === 'fa' ? 'اپلیکیشن غیرفعال شد' : 'App deactivated successfully');
  };

  const handleDelete = (appId: string) => {
    // TODO: Implement API call
    toast.success(language === 'fa' ? 'اپلیکیشن حذف شد' : 'App deleted successfully');
  };

  const handleEdit = (appId: string) => {
    // TODO: Implement API call
    toast.success(language === 'fa' ? 'اپلیکیشن ویرایش شد' : 'App edited successfully');
  };

  const handleViewDetails = (appId: string) => {
    // TODO: Implement API call
    toast.success(language === 'fa' ? 'جزئیات اپلیکیشن' : 'App details');
  };

  return (
    <div className="flex flex-col h-screen" style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      <PageHeader
        title={t('mobileApplications', language)}
        description={t('mobileApplicationsDesc', language)}
        searchBar={
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={language === 'fa' ? 'جستجو در اپلیکیشن‌ها...' : 'Search applications...'}
          />
        }
        stats={
          <>
            <button
              onClick={() => {
                setPlatformFilter(defaultPlatformFilter);
                setStatusFilter(defaultStatusFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                platformFilter.length === defaultPlatformFilter.length && statusFilter.length === defaultStatusFilter.length
                  ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span className="font-medium">{apps.length}</span>
              <span>{language === 'fa' ? 'کل' : 'Total Apps'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('active')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['active']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('active')
                  ? 'bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-semibold'
                  : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span className="font-medium">{apps.filter(app => app.status === 'active').length}</span>
              <span>{language === 'fa' ? 'فعال' : 'Active'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('pending')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['pending']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('pending')
                  ? 'bg-yellow-100 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 font-semibold'
                  : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 hover:border-yellow-300 dark:hover:border-yellow-700'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span className="font-medium">{apps.filter(app => app.status === 'pending').length}</span>
              <span>{language === 'fa' ? 'انتظار' : 'Pending'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('maintenance')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['maintenance']);
                }
                setPlatformFilter(defaultPlatformFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('maintenance')
                  ? 'bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <Settings className="w-3 h-3" />
              <span className="font-medium">{apps.filter(app => app.status === 'maintenance').length}</span>
              <span>{language === 'fa' ? 'نگهداری' : 'Maintenance'}</span>
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
                  setPlatformFilter(defaultPlatformFilter);
                  setStatusFilter(defaultStatusFilter);
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
            {language === 'fa' ? 'افزودن اپلیکیشن' : 'Add App'}
          </button>
        }
      />

      {/* Table */}
      <MobileAppsTable
        apps={filteredAndSortedApps}
        loading={false}
        sortConfig={sortConfig}
        onSort={handleSort}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        platformFilter={platformFilter}
        statusFilter={statusFilter}
        onPlatformFilterChange={setPlatformFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* TODO: Add App Modal */}
      {/* AddAppModal */}
    </div>
  );
}
