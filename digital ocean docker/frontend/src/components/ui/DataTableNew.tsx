'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TableContainer, 
  Table, 
  TableHeader, 
  TableHeaderRow, 
  TableHeaderCell, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableEmptyState, 
  TableLoadingState, 
  TableResultsSummary 
} from './Table';
import { SortIcon } from './SortIcon';
import { type SortField, type SortDirection, type SortConfig } from '@/lib/utils';
import { User, Wifi, Eye, Edit, PowerOff, Trash2, CheckCircle, XCircle, AlertCircle, Clock, Smartphone, Settings, AlertTriangle, Search, Shield, Lock } from 'lucide-react';
import { renderStatusPill } from '@/lib/utils';
import { FilterDropdown } from './FilterDropdown';
import { TableFilterFactory } from './TableFilters';

// Generic Data Table Props
interface DataTableNewProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  backgroundLogo?: string;
  backgroundLogoAlt?: string;
  className?: string;
  rowKey?: keyof T | ((item: T) => string);
  onRowClick?: (item: T) => void;
  showResultsSummary?: boolean;
}

// Column Definition
interface DataTableColumn<T> {
  key: keyof T | string;
  header: string | ReactNode;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  sortField?: SortField;
  className?: string;
  width?: string;
  meta?: {
    align?: 'center' | 'start' | 'end';
    minWidth?: number;
  };
  filter?: {
    options: { value: string; label: string; color?: string }[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    title: string;
    placeholder: string;
  };
}

// Data Table Component
export function DataTableNew<T>({
  data,
  columns,
  loading = false,
  emptyState,
  sortConfig,
  onSort,
  backgroundLogo,
  backgroundLogoAlt,
  className = '',
  rowKey = 'id' as keyof T,
  onRowClick,
  showResultsSummary = true
}: DataTableNewProps<T>) {
  const { language } = useLanguage();

  const getRowKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(item);
    }
    return String(item[rowKey as keyof T]) || `row-${index}`;
  };

  const handleSort = (column: DataTableColumn<T>) => {
    if (column.sortable && column.sortField && onSort) {
      onSort(column.sortField);
    }
  };

  const renderCell = (item: T, column: DataTableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = item[column.key as keyof T];
    return value !== undefined && value !== null ? String(value) : '';
  };

  return (
    <TableContainer 
      backgroundLogo={backgroundLogo} 
      backgroundLogoAlt={backgroundLogoAlt}
      className={className}
    >
      <Table className="table-fixed">
        <TableHeader>
          <TableHeaderRow>
            {columns.map((column, index) => (
              <TableHeaderCell
                key={String(column.key)}
                column={column}
                className={column.className}
                style={{ 
                  width: column.width,
                  minWidth: column.meta?.minWidth ? `${column.meta.minWidth}px` : undefined
                }}
                onClick={column.sortable ? () => handleSort(column) : undefined}
                sortable={column.sortable}
              >
                <div className="flex items-center gap-2">
                  {typeof column.header === 'string' ? (
                    <span>{column.header}</span>
                  ) : (
                    column.header
                  )}
                  {column.sortable && column.sortField && sortConfig && (
                    <SortIcon field={column.sortField} sortConfig={sortConfig} />
                  )}
                  {column.filter && (
                    <FilterDropdown
                      options={column.filter.options}
                      selectedValues={column.filter.selectedValues}
                      onSelectionChange={column.filter.onSelectionChange}
                      title={column.filter.title}
                      placeholder={column.filter.placeholder}
                    />
                  )}
                </div>
              </TableHeaderCell>
            ))}
          </TableHeaderRow>
        </TableHeader>
        
        <TableBody>
          {loading ? (
            <TableLoadingState colSpan={columns.length} />
          ) : data.length === 0 ? (
            emptyState ? (
              <TableEmptyState
                icon={emptyState.icon}
                title={emptyState.title}
                description={emptyState.description}
                colSpan={columns.length}
              />
            ) : (
              <TableEmptyState
                icon={<div className="w-8 h-8 bg-muted rounded-full" />}
                title={language === 'fa' ? 'هیچ موردی یافت نشد' : 'No items found'}
                description={language === 'fa' ? 'هیچ داده‌ای برای نمایش وجود ندارد' : 'No data available to display'}
                colSpan={columns.length}
              />
            )
          ) : (
            data.map((item, index) => (
              <TableRow
                key={getRowKey(item, index)}
                index={index}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                hoverable={!!onRowClick}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.key)} 
                    column={column}
                    className={column.className}
                    style={{
                      minWidth: column.meta?.minWidth ? `${column.meta.minWidth}px` : undefined
                    }}
                  >
                    {renderCell(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {showResultsSummary && data.length > 0 && (
        <TableResultsSummary
          filteredCount={data.length}
          totalCount={data.length}
          sortField={sortConfig?.field}
          sortDirection={sortConfig?.direction}
          className="mt-4"
        />
      )}
    </TableContainer>
  );
}

// Specialized Table Components for Common Use Cases

// Users Table
interface UserTableProps {
  users: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onActivate?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  roleFilter?: string[];
  statusFilter?: string[];
  onRoleFilterChange?: (values: string[]) => void;
  onStatusFilterChange?: (values: string[]) => void;
}

export function UsersTable({
  users,
  loading,
  sortConfig,
  onSort,
  onActivate,
  onEdit,
  onViewDetails,
  onDelete,
  roleFilter = [],
  statusFilter = [],
  onRoleFilterChange,
  onStatusFilterChange
}: UserTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forUsers(roleFilter, statusFilter, onRoleFilterChange!, onStatusFilterChange!);
  
  const columns = [
    {
      key: 'username',
      header: language === 'fa' ? 'کاربر' : 'User',
      sortable: true,
      sortField: 'username' as SortField,
      meta: { align: 'center' as const, minWidth: 150 },
      render: (user: any) => (
        <div className="font-medium text-foreground">{user.username}</div>
      )
    },
    {
      key: 'email',
      header: language === 'fa' ? 'ایمیل' : 'Email',
      sortable: true,
      sortField: 'email' as SortField,
      meta: { align: 'center' as const, minWidth: 200 },
      render: (user: any) => (
        <span className="text-foreground">{user.email}</span>
      )
    },
    {
      key: 'role',
      header: language === 'fa' ? 'نقش' : 'Role',
      sortable: true,
      sortField: 'role' as SortField,
      meta: { align: 'center', minWidth: 100 },
      render: (user: any) => {
        const getRoleLabel = (role: string) => {
          if (language === 'fa') {
            switch (role) {
              case 'admin': return 'مدیر';
              case 'moderator': return 'ناظر';
              case 'user': return 'کاربر';
              default: return role;
            }
          }
          return role.charAt(0).toUpperCase() + role.slice(1);
        };
        
        return (
          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {getRoleLabel(user.role)}
          </div>
        );
      },
      filter: onRoleFilterChange ? filters.role : undefined
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'status' as SortField,
      meta: { align: 'center', minWidth: 120 },
      render: (user: any) => {
        const statusPill = renderStatusPill(user.status, language);
        const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                             statusPill.icon === 'XCircle' ? XCircle : 
                             statusPill.icon === 'Clock' ? Clock : AlertCircle;
        return (
          <div className={statusPill.className}>
            <IconComponent className="w-3 h-3" />
            <span>{statusPill.label}</span>
          </div>
        );
      },
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'lastLogin',
      header: language === 'fa' ? 'آخرین ورود' : 'Last Login',
      sortable: true,
      sortField: 'lastLogin' as SortField,
      meta: { align: 'center', minWidth: 120 },
      render: (user: any) => (
        <span className="text-muted-foreground text-xs">{new Date(user.lastLogin).toLocaleDateString()}</span>
      )
    },
    {
      key: 'deviceCount',
      header: language === 'fa' ? 'دستگاه‌ها' : 'Devices',
      sortable: true,
      sortField: 'deviceCount' as SortField,
      meta: { align: 'center', minWidth: 110 },
      render: (user: any) => (
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {user.deviceCount} {language === 'fa' ? 'دستگاه' : 'devices'}
        </span>
      )
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center', minWidth: 120 },
      render: (user: any) => (
        <div className="flex items-center gap-1.5">
          {onActivate && (
            <button
              onClick={(e) => { e.stopPropagation(); onActivate(user.id); }}
              className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors"
              title={language === 'fa' ? 'فعال‌سازی' : 'Activate'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(user.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'ویرایش' : 'Edit'}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={users}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <User className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ کاربری یافت نشد' : 'No users found',
        description: language === 'fa' ? 'کاربران هنگام ثبت‌نام در اینجا ظاهر می‌شوند' : 'Users will appear here when they register'
      }}
    />
  );
}

// Clients Table
interface ClientTableProps {
  clients: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onViewDetails?: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
  onDisconnect?: (clientId: string) => void;
  onDelete?: (clientId: string) => void;
  statusFilter?: string[];
  platformFilter?: string[];
  onStatusFilterChange?: (values: string[]) => void;
  onPlatformFilterChange?: (values: string[]) => void;
}

export function ClientsTable({
  clients,
  loading,
  sortConfig,
  onSort,
  onViewDetails,
  onEdit,
  onDisconnect,
  onDelete,
  statusFilter = [],
  platformFilter = [],
  onStatusFilterChange,
  onPlatformFilterChange
}: ClientTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forClients(statusFilter, platformFilter, onStatusFilterChange!, onPlatformFilterChange!);
  
  const columns = [
    {
      key: 'name',
      header: language === 'fa' ? 'کلاینت' : 'Client',
      sortable: true,
      sortField: 'name' as SortField,
      meta: { align: 'center', minWidth: 180 },
      render: (client: any) => (
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground truncate">{client.name}</div>
          <div className="text-xs text-muted-foreground font-mono truncate">{client.mac_address}</div>
        </div>
      )
    },
    {
      key: 'ip_address',
      header: 'IP',
      sortable: true,
      sortField: 'ip_address' as SortField,
      meta: { align: 'center', minWidth: 120 },
      render: (client: any) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {client.ip_address || 'N/A'}
        </span>
      )
    },
    {
      key: 'platform',
      header: language === 'fa' ? 'پلتفرم' : 'Platform',
      sortable: true,
      sortField: 'platform' as SortField,
      meta: { align: 'center', minWidth: 140 },
      render: (client: any) => (
        <div className="flex items-center gap-1">
          <span className="text-xs truncate">{client.platform}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded flex-shrink-0">
            v{client.version}
          </span>
        </div>
      ),
      filter: onPlatformFilterChange ? filters.platform : undefined
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'status' as SortField,
      meta: { align: 'center', minWidth: 120 },
      render: (client: any) => {
        const statusPill = renderStatusPill(client.status, language);
        const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                             statusPill.icon === 'XCircle' ? XCircle : 
                             statusPill.icon === 'Clock' ? Clock : AlertCircle;
        return (
          <div className={statusPill.className}>
            <IconComponent className="w-3 h-3" />
            <span>{statusPill.label}</span>
          </div>
        );
      },
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'last_seen',
      header: language === 'fa' ? 'آخرین فعالیت' : 'Last Activity',
      sortable: true,
      sortField: 'last_seen' as SortField,
      meta: { align: 'center', minWidth: 140 },
      render: (client: any) => (
        <span className="text-muted-foreground text-xs">
          {client.last_seen ? new Date(client.last_seen).toLocaleDateString() : language === 'fa' ? 'نامشخص' : 'Unknown'}
        </span>
      )
    },
    {
      key: 'connection_count',
      header: language === 'fa' ? 'اتصال' : 'Conn',
      sortable: true,
      sortField: 'connection_count' as SortField,
      meta: { align: 'center', minWidth: 100 },
      render: (client: any) => (
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {client.connection_count} {language === 'fa' ? 'اتصال' : 'conn'}
        </span>
      )
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center', minWidth: 140 },
      render: (client: any) => (
        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(client.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(client.id); }}
              className="p-1.5 hover:bg-yellow-500/10 hover:text-yellow-500 rounded transition-colors"
              title={language === 'fa' ? 'ویرایش' : 'Edit'}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDisconnect && (
            <button
              onClick={(e) => { e.stopPropagation(); onDisconnect(client.id); }}
              className="p-1.5 hover:bg-orange-500/10 hover:text-orange-500 rounded transition-colors"
              title={language === 'fa' ? 'قطع اتصال' : 'Disconnect'}
            >
              <PowerOff className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(client.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={clients}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <Wifi className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ کلاینتی یافت نشد' : 'No clients found',
        description: language === 'fa' ? 'کلاینت‌ها هنگام اتصال در اینجا ظاهر می‌شوند' : 'Clients will appear here when they connect'
      }}
    />
  );
}

// Mobile Apps Table
interface MobileAppTableProps {
  apps: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onViewDetails?: (appId: string) => void;
  onEdit?: (appId: string) => void;
  onActivate?: (appId: string) => void;
  onDeactivate?: (appId: string) => void;
  onDelete?: (appId: string) => void;
  platformFilter?: string[];
  statusFilter?: string[];
  onPlatformFilterChange?: (values: string[]) => void;
  onStatusFilterChange?: (values: string[]) => void;
}

export function MobileAppsTable({
  apps,
  loading,
  sortConfig,
  onSort,
  onViewDetails,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  platformFilter = [],
  statusFilter = [],
  onPlatformFilterChange,
  onStatusFilterChange
}: MobileAppTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forMobileApps(platformFilter, statusFilter, onPlatformFilterChange!, onStatusFilterChange!);
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'android': return '🤖';
      case 'ios': return '🍎';
      case 'cross-platform': return '🌐';
      default: return '📱';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusPill = renderStatusPill(status, language);
    const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                         statusPill.icon === 'XCircle' ? XCircle : 
                         statusPill.icon === 'Clock' ? Clock : 
                         statusPill.icon === 'Settings' ? Settings : AlertCircle;
    return (
      <div className={statusPill.className}>
        <IconComponent className="w-3 h-3" />
        <span>{statusPill.label}</span>
      </div>
    );
  };
  
  const columns = [
    {
      key: 'userName',
      header: language === 'fa' ? 'نام کاربر' : 'User Name',
      sortable: true,
      sortField: 'userName' as SortField,
      meta: { align: 'center' as const, minWidth: 150 },
      render: (app: any) => (
        <div className="font-medium text-foreground">{app.userName}</div>
      )
    },
    {
      key: 'deviceName',
      header: language === 'fa' ? 'نام دستگاه' : 'Device Name',
      sortable: true,
      sortField: 'deviceName' as SortField,
      meta: { align: 'center' as const, minWidth: 150 },
      render: (app: any) => (
        <div className="font-medium text-foreground">{app.deviceName}</div>
      )
    },
    {
      key: 'platform',
      header: language === 'fa' ? 'پلتفرم' : 'Platform',
      sortable: true,
      sortField: 'platform' as SortField,
      meta: { align: 'center' as const, minWidth: 120 },
      render: (app: any) => (
        <span className="capitalize text-foreground">{app.platform}</span>
      ),
      filter: onPlatformFilterChange ? filters.platform : undefined
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'status' as SortField,
      meta: { align: 'center' as const, minWidth: 120 },
      render: (app: any) => getStatusBadge(app.status),
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'lastActiveCity',
      header: language === 'fa' ? 'آخرین شهر فعال' : 'Last Active City',
      sortable: true,
      sortField: 'lastActiveCity' as SortField,
      meta: { align: 'center' as const, minWidth: 140 },
      render: (app: any) => (
        <span className="text-foreground">{app.lastActiveCity || '-'}</span>
      )
    },
    {
      key: 'lastActivity',
      header: language === 'fa' ? 'آخرین فعالیت' : 'Last Activity',
      sortable: true,
      sortField: 'lastActivity' as SortField,
      meta: { align: 'center' as const, minWidth: 140 },
      render: (app: any) => (
        <span className="text-sm text-muted-foreground">
          {app.lastActivity ? new Date(app.lastActivity).toLocaleDateString() : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center' as const, minWidth: 140 },
      render: (app: any) => (
        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(app.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(app.id); }}
              className="p-1.5 hover:bg-yellow-500/10 hover:text-yellow-500 rounded transition-colors"
              title={language === 'fa' ? 'ویرایش' : 'Edit'}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {app.status === 'active' ? (
            onDeactivate && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeactivate(app.id); }}
                className="p-1.5 hover:bg-orange-500/10 hover:text-orange-500 rounded transition-colors"
                title={language === 'fa' ? 'غیرفعال‌سازی' : 'Deactivate'}
              >
                <PowerOff className="w-4 h-4" />
              </button>
            )
          ) : (
            onActivate && (
              <button
                onClick={(e) => { e.stopPropagation(); onActivate(app.id); }}
                className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors"
                title={language === 'fa' ? 'فعال‌سازی' : 'Activate'}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={apps}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <Smartphone className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ اپلیکیشنی یافت نشد' : 'No applications found',
        description: language === 'fa' ? 'اپلیکیشن‌های موبایل در اینجا ظاهر می‌شوند' : 'Mobile applications will appear here'
      }}
    />
  );
}

// Sessions Table
interface SessionsTableProps {
  sessions: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onViewDetails?: (sessionId: string) => void;
  onTerminate?: (sessionId: string) => void;
  onExtend?: (sessionId: string) => void;
  statusFilter?: string[];
  onStatusFilterChange?: (values: string[]) => void;
}

export function SessionsTable({
  sessions,
  loading,
  sortConfig,
  onSort,
  onViewDetails,
  onTerminate,
  onExtend,
  statusFilter = [],
  onStatusFilterChange
}: SessionsTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forSessions(statusFilter, onStatusFilterChange!);
  
  const getStatusBadge = (session: any) => {
    const isActive = !session.is_revoked && new Date(session.expires_at) > new Date();
    const isExpired = new Date(session.expires_at) <= new Date();
    const isRevoked = session.is_revoked;
    
    if (isRevoked) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30">
          <XCircle className="w-3 h-3" />
          <span>{language === 'fa' ? 'متوقف شده' : 'Terminated'}</span>
        </div>
      );
    }
    
    if (isExpired) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/30">
          <Clock className="w-3 h-3" />
          <span>{language === 'fa' ? 'منقضی شده' : 'Expired'}</span>
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30">
        <CheckCircle className="w-3 h-3" />
        <span>{language === 'fa' ? 'فعال' : 'Active'}</span>
      </div>
    );
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) {
      return language === 'fa' ? 'منقضی شده' : 'Expired';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return language === 'fa' ? `${hours} ساعت ${minutes} دقیقه` : `${hours}h ${minutes}m`;
    }
    
    return language === 'fa' ? `${minutes} دقیقه` : `${minutes}m`;
  };

  const getDeviceInfo = (userAgent: string) => {
    if (!userAgent) return language === 'fa' ? 'نامشخص' : 'Unknown';
    
    // Simple device detection
    if (userAgent.includes('Mobile')) {
      return language === 'fa' ? 'موبایل' : 'Mobile';
    } else if (userAgent.includes('Tablet')) {
      return language === 'fa' ? 'تبلت' : 'Tablet';
    } else if (userAgent.includes('Windows')) {
      return 'Windows';
    } else if (userAgent.includes('Mac')) {
      return 'macOS';
    } else if (userAgent.includes('Linux')) {
      return 'Linux';
    }
    
    return language === 'fa' ? 'دسکتاپ' : 'Desktop';
  };
  
  const columns = [
    {
      key: 'username',
      header: language === 'fa' ? 'کاربر' : 'User',
      sortable: true,
      sortField: 'username' as SortField,
      meta: { align: 'center' as 'center', minWidth: 150 },
      render: (session: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
              {session.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="font-medium text-foreground">{session.username}</div>
        </div>
      )
    },
    {
      key: 'ip_address',
      header: language === 'fa' ? 'آدرس IP' : 'IP Address',
      sortable: true,
      sortField: 'ip_address' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (session: any) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {session.ip_address || language === 'fa' ? 'نامشخص' : 'Unknown'}
        </span>
      )
    },
    {
      key: 'device',
      header: language === 'fa' ? 'دستگاه' : 'Device',
      sortable: false,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (session: any) => (
        <span className="text-sm text-foreground">
          {getDeviceInfo(session.user_agent)}
        </span>
      )
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'is_revoked' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (session: any) => getStatusBadge(session),
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'created_at',
      header: language === 'fa' ? 'شروع جلسه' : 'Session Start',
      sortable: true,
      sortField: 'created_at' as SortField,
      meta: { align: 'center' as 'center', minWidth: 160 },
      render: (session: any) => (
        <div className="text-sm">
          <div className="text-foreground">
            {new Date(session.created_at).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(session.created_at).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US')}
          </div>
        </div>
      )
    },
    {
      key: 'expires_at',
      header: language === 'fa' ? 'زمان باقی‌مانده' : 'Time Remaining',
      sortable: true,
      sortField: 'expires_at' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (session: any) => (
        <div className="text-sm">
          <div className="text-foreground">
            {getTimeRemaining(session.expires_at)}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(session.expires_at).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US')}
          </div>
        </div>
      )
    },
    {
      key: 'duration',
      header: language === 'fa' ? 'مدت جلسه' : 'Duration',
      sortable: false,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (session: any) => {
        const start = new Date(session.created_at);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          return language === 'fa' ? `${hours} ساعت ${minutes} دقیقه` : `${hours}h ${minutes}m`;
        }
        return language === 'fa' ? `${minutes} دقیقه` : `${minutes}m`;
      }
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (session: any) => {
        const isActive = !session.is_revoked && new Date(session.expires_at) > new Date();
        
        return (
          <div className="flex items-center gap-1.5">
            {onViewDetails && (
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(session.id); }}
                className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
                title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {isActive && onExtend && (
              <button
                onClick={(e) => { e.stopPropagation(); onExtend(session.id); }}
                className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors"
                title={language === 'fa' ? 'تمدید جلسه' : 'Extend session'}
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
            {isActive && onTerminate && (
              <button
                onClick={(e) => { e.stopPropagation(); onTerminate(session.id); }}
                className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                title={language === 'fa' ? 'متوقف کردن جلسه' : 'Terminate session'}
              >
                <PowerOff className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <DataTableNew
      data={sessions}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <User className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ جلسه‌ای یافت نشد' : 'No sessions found',
        description: language === 'fa' ? 'جلسات فعال در اینجا ظاهر می‌شوند' : 'Active sessions will appear here'
      }}
    />
  );
}

// Security Alerts Table
interface SecurityAlertsTableProps {
  alerts: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onViewDetails?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  typeFilter?: string[];
  statusFilter?: string[];
  onTypeFilterChange?: (values: string[]) => void;
  onStatusFilterChange?: (values: string[]) => void;
}

export function SecurityAlertsTable({
  alerts,
  loading,
  sortConfig,
  onSort,
  onViewDetails,
  onResolve,
  onDelete,
  typeFilter = [],
  statusFilter = [],
  onTypeFilterChange,
  onStatusFilterChange
}: SecurityAlertsTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forSecurityAlerts(typeFilter, statusFilter, onTypeFilterChange!, onStatusFilterChange!);
  
  const getTypeBadge = (type: string) => {
    const typePill = renderStatusPill(type, language);
    const IconComponent = typePill.icon === 'CheckCircle' ? CheckCircle : 
                         typePill.icon === 'XCircle' ? XCircle : 
                         typePill.icon === 'Clock' ? Clock : AlertTriangle;
    return (
      <div className={typePill.className}>
        <IconComponent className="w-3 h-3" />
        <span>{typePill.label}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusPill = renderStatusPill(status, language);
    const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                         statusPill.icon === 'XCircle' ? XCircle : 
                         statusPill.icon === 'Clock' ? Clock : AlertTriangle;
    return (
      <div className={statusPill.className}>
        <IconComponent className="w-3 h-3" />
        <span>{statusPill.label}</span>
      </div>
    );
  };
  
  const columns = [
    {
      key: 'title',
      header: language === 'fa' ? 'عنوان' : 'Title',
      sortable: true,
      sortField: 'title' as SortField,
      meta: { align: 'center' as 'center', minWidth: 200 },
      render: (alert: any) => (
        <div className="font-medium text-foreground">{alert.title}</div>
      )
    },
    {
      key: 'type',
      header: language === 'fa' ? 'نوع' : 'Type',
      sortable: true,
      sortField: 'type' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (alert: any) => getTypeBadge(alert.type),
      filter: onTypeFilterChange ? filters.type : undefined
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'status' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (alert: any) => getStatusBadge(alert.status),
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'source',
      header: language === 'fa' ? 'منبع' : 'Source',
      sortable: true,
      sortField: 'source' as SortField,
      meta: { align: 'center' as 'center', minWidth: 150 },
      render: (alert: any) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {alert.source}
        </span>
      )
    },
    {
      key: 'timestamp',
      header: language === 'fa' ? 'زمان' : 'Time',
      sortable: true,
      sortField: 'timestamp' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (alert: any) => (
        <span className="text-sm text-muted-foreground">
          {new Date(alert.timestamp).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
        </span>
      )
    },
    {
      key: 'affected_users',
      header: language === 'fa' ? 'کاربران متأثر' : 'Affected Users',
      sortable: true,
      sortField: 'affected_users' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (alert: any) => (
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {alert.affected_users || 0} {language === 'fa' ? 'کاربر' : 'users'}
        </span>
      )
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (alert: any) => (
        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(alert.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onResolve && (
            <button
              onClick={(e) => { e.stopPropagation(); onResolve(alert.id); }}
              className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors"
              title={language === 'fa' ? 'حل مشکل' : 'Resolve'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(alert.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={alerts}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <AlertTriangle className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ هشداری یافت نشد' : 'No alerts found',
        description: language === 'fa' ? 'هشدارهای امنیتی در اینجا ظاهر می‌شوند' : 'Security alerts will appear here'
      }}
    />
  );
}

// Security Incidents Table
interface SecurityIncidentsTableProps {
  incidents: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onViewDetails?: (incidentId: string) => void;
  onInvestigate?: (incidentId: string) => void;
  onResolve?: (incidentId: string) => void;
  onDelete?: (incidentId: string) => void;
  severityFilter?: string[];
  statusFilter?: string[];
  onSeverityFilterChange?: (values: string[]) => void;
  onStatusFilterChange?: (values: string[]) => void;
}

export function SecurityIncidentsTable({
  incidents,
  loading,
  sortConfig,
  onSort,
  onViewDetails,
  onInvestigate,
  onResolve,
  onDelete,
  severityFilter = [],
  statusFilter = [],
  onSeverityFilterChange,
  onStatusFilterChange
}: SecurityIncidentsTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forSecurityIncidents(severityFilter, statusFilter, onSeverityFilterChange!, onStatusFilterChange!);
  
  const getSeverityBadge = (severity: string) => {
    const severityPill = renderStatusPill(severity, language);
    const IconComponent = severityPill.icon === 'CheckCircle' ? CheckCircle : 
                         severityPill.icon === 'XCircle' ? XCircle : 
                         severityPill.icon === 'Clock' ? Clock : AlertTriangle;
    return (
      <div className={severityPill.className}>
        <IconComponent className="w-3 h-3" />
        <span>{severityPill.label}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusPill = renderStatusPill(status, language);
    const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                         statusPill.icon === 'XCircle' ? XCircle : 
                         statusPill.icon === 'Clock' ? Clock : AlertTriangle;
    return (
      <div className={statusPill.className}>
        <IconComponent className="w-3 h-3" />
        <span>{statusPill.label}</span>
      </div>
    );
  };
  
  const columns = [
    {
      key: 'title',
      header: language === 'fa' ? 'عنوان' : 'Title',
      sortable: true,
      sortField: 'title' as SortField,
      meta: { align: 'center' as 'center', minWidth: 200 },
      render: (incident: any) => (
        <div className="font-medium text-foreground">{incident.title}</div>
      )
    },
    {
      key: 'type',
      header: language === 'fa' ? 'نوع' : 'Type',
      sortable: true,
      sortField: 'type' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (incident: any) => (
        <span className="capitalize text-foreground">{incident.type.replace('_', ' ')}</span>
      )
    },
    {
      key: 'severity',
      header: language === 'fa' ? 'شدت' : 'Severity',
      sortable: true,
      sortField: 'severity' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (incident: any) => getSeverityBadge(incident.severity),
      filter: onSeverityFilterChange ? filters.severity : undefined
    },
    {
      key: 'status',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'status' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (incident: any) => getStatusBadge(incident.status),
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'source_ip',
      header: language === 'fa' ? 'IP منبع' : 'Source IP',
      sortable: true,
      sortField: 'source_ip' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (incident: any) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {incident.source_ip}
        </span>
      )
    },
    {
      key: 'target_user',
      header: language === 'fa' ? 'کاربر هدف' : 'Target User',
      sortable: true,
      sortField: 'target_user' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (incident: any) => (
        <span className="text-foreground">{incident.target_user || '-'}</span>
      )
    },
    {
      key: 'timestamp',
      header: language === 'fa' ? 'زمان' : 'Time',
      sortable: true,
      sortField: 'timestamp' as SortField,
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (incident: any) => (
        <span className="text-sm text-muted-foreground">
          {new Date(incident.timestamp).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
        </span>
      )
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center' as 'center', minWidth: 140 },
      render: (incident: any) => (
        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(incident.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onInvestigate && (
            <button
              onClick={(e) => { e.stopPropagation(); onInvestigate(incident.id); }}
              className="p-1.5 hover:bg-yellow-500/10 hover:text-yellow-500 rounded transition-colors"
              title={language === 'fa' ? 'بررسی' : 'Investigate'}
            >
              <Search className="w-4 h-4" />
            </button>
          )}
          {onResolve && (
            <button
              onClick={(e) => { e.stopPropagation(); onResolve(incident.id); }}
              className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors"
              title={language === 'fa' ? 'حل مشکل' : 'Resolve'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(incident.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={incidents}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <Shield className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ حادثه‌ای یافت نشد' : 'No incidents found',
        description: language === 'fa' ? 'حوادث امنیتی در اینجا ظاهر می‌شوند' : 'Security incidents will appear here'
      }}
    />
  );
}

// Firewall Rules Table
interface FirewallRulesTableProps {
  rules: any[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
  onEdit?: (ruleId: string) => void;
  onToggle?: (ruleId: string) => void;
  onDelete?: (ruleId: string) => void;
  actionFilter?: string[];
  statusFilter?: string[];
  onActionFilterChange?: (values: string[]) => void;
  onStatusFilterChange?: (values: string[]) => void;
}

export function FirewallRulesTable({
  rules,
  loading,
  sortConfig,
  onSort,
  onEdit,
  onToggle,
  onDelete,
  actionFilter = [],
  statusFilter = [],
  onActionFilterChange,
  onStatusFilterChange
}: FirewallRulesTableProps) {
  const { language } = useLanguage();
  
  // Create reusable filters
  const filters = TableFilterFactory.forFirewallRules(actionFilter, statusFilter, onActionFilterChange!, onStatusFilterChange!);
  
  const getActionBadge = (action: string) => {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
        action === 'allow' 
          ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30' 
          : 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30'
      }`}>
        {action === 'allow' ? (language === 'fa' ? 'اجازه' : 'Allow') : (language === 'fa' ? 'مسدود' : 'Deny')}
      </div>
    );
  };

  const getStatusBadge = (enabled: boolean) => {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
        enabled 
          ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30' 
          : 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30'
      }`}>
        {enabled ? (language === 'fa' ? 'فعال' : 'Active') : (language === 'fa' ? 'غیرفعال' : 'Inactive')}
      </div>
    );
  };
  
  const columns = [
    {
      key: 'name',
      header: language === 'fa' ? 'نام قانون' : 'Rule Name',
      sortable: true,
      sortField: 'name' as SortField,
      meta: { align: 'center' as 'center', minWidth: 180 },
      render: (rule: any) => (
        <div className="font-medium text-foreground">{rule.name}</div>
      )
    },
    {
      key: 'action',
      header: language === 'fa' ? 'عملیات' : 'Action',
      sortable: true,
      sortField: 'action' as SortField,
      meta: { align: 'center' as 'center', minWidth: 100 },
      render: (rule: any) => getActionBadge(rule.action),
      filter: onActionFilterChange ? filters.action : undefined
    },
    {
      key: 'protocol',
      header: language === 'fa' ? 'پروتکل' : 'Protocol',
      sortable: true,
      sortField: 'protocol' as SortField,
      meta: { align: 'center' as 'center', minWidth: 100 },
      render: (rule: any) => (
        <span className="text-sm uppercase font-mono">{rule.protocol}</span>
      )
    },
    {
      key: 'source',
      header: language === 'fa' ? 'منبع' : 'Source',
      sortable: true,
      sortField: 'source' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (rule: any) => (
        <span className="text-sm font-mono">{rule.source}</span>
      )
    },
    {
      key: 'destination',
      header: language === 'fa' ? 'مقصد' : 'Destination',
      sortable: true,
      sortField: 'destination' as SortField,
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (rule: any) => (
        <div>
          <span className="text-sm font-mono">{rule.destination}</span>
          {rule.port && (
            <span className="text-xs text-muted-foreground block">
              {language === 'fa' ? 'پورت' : 'Port'}: {rule.port}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'priority',
      header: language === 'fa' ? 'اولویت' : 'Priority',
      sortable: true,
      sortField: 'priority' as SortField,
      meta: { align: 'center' as 'center', minWidth: 100 },
      render: (rule: any) => (
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {rule.priority}
        </span>
      )
    },
    {
      key: 'enabled',
      header: language === 'fa' ? 'وضعیت' : 'Status',
      sortable: true,
      sortField: 'enabled' as SortField,
      meta: { align: 'center' as 'center', minWidth: 100 },
      render: (rule: any) => getStatusBadge(rule.enabled),
      filter: onStatusFilterChange ? filters.status : undefined
    },
    {
      key: 'actions',
      header: language === 'fa' ? 'عملیات' : 'Actions',
      meta: { align: 'center' as 'center', minWidth: 120 },
      render: (rule: any) => (
        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(rule.id); }}
              className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
              title={language === 'fa' ? 'ویرایش' : 'Edit'}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onToggle && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(rule.id); }}
              className="p-1.5 hover:bg-orange-500/10 hover:text-orange-500 rounded transition-colors"
              title={rule.enabled ? (language === 'fa' ? 'غیرفعال‌سازی' : 'Disable') : (language === 'fa' ? 'فعال‌سازی' : 'Enable')}
            >
              {rule.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(rule.id); }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              title={language === 'fa' ? 'حذف' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTableNew
      data={rules}
      columns={columns}
      loading={loading}
      sortConfig={sortConfig}
      onSort={onSort}
      backgroundLogo="/viworks-logo.png"
      backgroundLogoAlt="ViWorkS"
      emptyState={{
        icon: <Lock className="w-8 h-8 text-muted-foreground" />,
        title: language === 'fa' ? 'هیچ قانون فایروالی یافت نشد' : 'No firewall rules found',
        description: language === 'fa' ? 'قوانین فایروال در اینجا ظاهر می‌شوند' : 'Firewall rules will appear here'
      }}
    />
  );
}
