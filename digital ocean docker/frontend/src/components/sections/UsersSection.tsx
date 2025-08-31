'use client';

import { useState, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Filter,
  Plus,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { usersApi } from '@/lib/api-services';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { UsersTable } from '@/components/ui/DataTableNew';
import { AddUserModal } from '@/components/ui/AddUserModal';
import { formatDate, type SortField, type SortDirection, type SortConfig } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
  deviceCount: number;
}



export function UsersSection() {
  const { language, isRTL } = useLanguage();
  
  // Mock data - replace with actual API calls
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@viworks.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      deviceCount: 3
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      deviceCount: 1
    },
    {
      id: '3',
      username: 'moderator1',
      email: 'mod@example.com',
      role: 'moderator',
      status: 'pending',
      lastLogin: '2024-01-13T09:20:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      deviceCount: 2
    }
  ]);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>(['admin', 'user', 'moderator']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['active', 'inactive', 'pending', 'suspended']);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'username',
    direction: 'asc'
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Computed values
  const roles = ['admin', 'user', 'moderator'];
  const statuses = ['active', 'inactive', 'pending', 'suspended'];

  // Default filter values
  const defaultRoleFilter = ['admin', 'user', 'moderator'];
  const defaultStatusFilter = ['active', 'inactive', 'pending', 'suspended'];

  // Check if any filters are modified from default
  const hasActiveFilters = searchTerm || 
    roleFilter.length !== defaultRoleFilter.length || 
    statusFilter.length !== defaultStatusFilter.length ||
    !roleFilter.every(r => defaultRoleFilter.includes(r)) ||
    !statusFilter.every(s => defaultStatusFilter.includes(s));

  // Get active filter count (only count modified filters)
  const activeFilterCount = [
    searchTerm ? 1 : 0,
    roleFilter.length !== defaultRoleFilter.length || !roleFilter.every(r => defaultRoleFilter.includes(r)) ? 1 : 0,
    statusFilter.length !== defaultStatusFilter.length || !statusFilter.every(s => defaultStatusFilter.includes(s)) ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter.includes(user.role);
      const matchesStatus = statusFilter.includes(user.status);
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // Handle role field for Persian sorting
      if (sortConfig.field === 'role') {
        const getRoleSortValue = (role: string) => {
          switch (role) {
            case 'admin': return language === 'fa' ? 'مدیر' : 'admin';
            case 'moderator': return language === 'fa' ? 'ناظر' : 'moderator';
            case 'user': return language === 'fa' ? 'کاربر' : 'user';
            default: return role;
          }
        };
        aValue = getRoleSortValue(aValue);
        bValue = getRoleSortValue(bValue);
      }
      
      // Convert to string and handle Persian text
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  // Sort handler
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Action handlers
  const handleActivateUser = async (userId: string) => {
    try {
      await usersApi.activateUser(userId);
      toast.success(language === 'fa' ? 'کاربر فعال شد' : 'User activated successfully');
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در فعال‌سازی کاربر' : 'Failed to activate user');
    }
  };

  const handleAddUser = async (formData: { username: string; email: string; role: string }) => {
    try {
      // TODO: Implement user creation API call
      console.log('Adding user:', formData);
      toast.success(language === 'fa' ? 'کاربر با موفقیت اضافه شد' : 'User added successfully');
      setShowAddModal(false);
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در افزودن کاربر' : 'Failed to add user');
    }
  };

  const handleEditUser = async (userId: string) => {
    try {
      // TODO: Implement user edit functionality
      console.log('Editing user:', userId);
      toast.success(language === 'fa' ? 'ویرایش کاربر' : 'Edit user');
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در ویرایش کاربر' : 'Failed to edit user');
    }
  };

  const handleViewDetails = async (userId: string) => {
    try {
      // TODO: Implement user details view
      console.log('Viewing user details:', userId);
      toast.success(language === 'fa' ? 'مشاهده جزئیات کاربر' : 'View user details');
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در مشاهده جزئیات' : 'Failed to view details');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Implement user deletion API call
      console.log('Deleting user:', userId);
      toast.success(language === 'fa' ? 'کاربر با موفقیت حذف شد' : 'User deleted successfully');
    } catch (error) {
      toast.error(language === 'fa' ? 'خطا در حذف کاربر' : 'Failed to delete user');
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      <PageHeader
        title={t('usersManagement', language)}
        description={t('usersManagementDesc', language)}
        searchBar={
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={language === 'fa' ? 'جستجو در کاربران...' : 'Search users...'}
          />
        }
        stats={
          <>
            <button
              onClick={() => {
                setStatusFilter(defaultStatusFilter);
                setRoleFilter(defaultRoleFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === defaultStatusFilter.length && roleFilter.length === defaultRoleFilter.length
                  ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <Users className="w-3 h-3" />
              <span className="font-medium">{users.length}</span>
              <span>{language === 'fa' ? 'کل' : 'Total Users'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('active')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['active']);
                }
                setRoleFilter(defaultRoleFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('active')
                  ? 'bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-semibold'
                  : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span className="font-medium">{users.filter(u => u.status === 'active').length}</span>
              <span>{language === 'fa' ? 'فعال' : 'Active'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('pending')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['pending']);
                }
                setRoleFilter(defaultRoleFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('pending')
                  ? 'bg-yellow-100 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 font-semibold'
                  : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 hover:border-yellow-300 dark:hover:border-yellow-700'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span className="font-medium">{users.filter(u => u.status === 'pending').length}</span>
              <span>{language === 'fa' ? 'انتظار' : 'Pending'}</span>
            </button>
            
            <button
              onClick={() => {
                if (statusFilter.length === 1 && statusFilter.includes('inactive')) {
                  setStatusFilter(defaultStatusFilter);
                } else {
                  setStatusFilter(['inactive']);
                }
                setRoleFilter(defaultRoleFilter);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                statusFilter.length === 1 && statusFilter.includes('inactive')
                  ? 'bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-semibold'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span className="font-medium">{users.filter(u => u.status === 'inactive').length}</span>
              <span>{language === 'fa' ? 'غیرفعال' : 'Inactive'}</span>
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
                  setRoleFilter(defaultRoleFilter);
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
            {language === 'fa' ? 'افزودن کاربر' : 'Add User'}
          </button>
        }
      />

      {/* Table */}
      <UsersTable
        users={filteredAndSortedUsers}
        loading={false}
        sortConfig={sortConfig}
        onSort={handleSort}
        onActivate={handleActivateUser}
        onEdit={handleEditUser}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteUser}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
      />



      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />


    </div>
  );
}