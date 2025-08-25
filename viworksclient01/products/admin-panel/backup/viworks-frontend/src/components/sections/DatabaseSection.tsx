'use client';

import { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Trash2,
  Archive,
  RotateCcw,
  Settings,
  Search,
  Filter,
  FileText,
  Shield,
  Key,
  Lock,
  Unlock,
  Zap,
  Server,
  Monitor,
  Terminal,
  Calendar,
  Timer,
  Database as DatabaseIcon,
  Table,
  Index,
  Search as SearchIcon
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface DatabaseInfo {
  id: string;
  name: string;
  type: 'postgresql' | 'redis';
  status: 'online' | 'offline' | 'maintenance';
  version: string;
  size: string;
  connections: number;
  max_connections: number;
  uptime: string;
  last_backup: string;
  backup_size: string;
  tables_count: number;
  indexes_count: number;
}

interface DatabaseBackup {
  id: string;
  database_id: string;
  filename: string;
  size: string;
  created_at: string;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'full' | 'incremental';
  duration: string;
}

interface DatabaseQuery {
  id: string;
  database_id: string;
  query: string;
  execution_time: number;
  rows_affected: number;
  timestamp: string;
  user: string;
  status: 'success' | 'error' | 'running';
}

export function DatabaseSection() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'databases' | 'backups' | 'queries' | 'monitoring'>('overview');
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseInfo | null>(null);

  // Mock data - will be replaced with API calls
  const databases: DatabaseInfo[] = [
    {
      id: '1',
      name: 'viworks_main',
      type: 'postgresql',
      status: 'online',
      version: '15.4',
      size: '2.4 GB',
      connections: 45,
      max_connections: 100,
      uptime: '30 days, 12 hours',
      last_backup: '2025-08-23T06:00:00Z',
      backup_size: '1.8 GB',
      tables_count: 24,
      indexes_count: 67
    },
    {
      id: '2',
      name: 'viworks_cache',
      type: 'redis',
      status: 'online',
      version: '7.2',
      size: '512 MB',
      connections: 12,
      max_connections: 50,
      uptime: '15 days, 8 hours',
      last_backup: '2025-08-23T06:00:00Z',
      backup_size: '256 MB',
      tables_count: 0,
      indexes_count: 0
    }
  ];

  const databaseBackups: DatabaseBackup[] = [
    {
      id: '1',
      database_id: '1',
      filename: 'viworks_main_2025-08-23_06-00-00.sql',
      size: '1.8 GB',
      created_at: '2025-08-23T06:00:00Z',
      status: 'completed',
      type: 'full',
      duration: '15 minutes'
    },
    {
      id: '2',
      database_id: '1',
      filename: 'viworks_main_2025-08-22_06-00-00.sql',
      size: '1.7 GB',
      created_at: '2025-08-22T06:00:00Z',
      status: 'completed',
      type: 'full',
      duration: '14 minutes'
    },
    {
      id: '3',
      database_id: '2',
      filename: 'viworks_cache_2025-08-23_06-00-00.rdb',
      size: '256 MB',
      created_at: '2025-08-23T06:00:00Z',
      status: 'completed',
      type: 'full',
      duration: '2 minutes'
    }
  ];

  const databaseQueries: DatabaseQuery[] = [
    {
      id: '1',
      database_id: '1',
      query: 'SELECT * FROM users WHERE status = \'active\'',
      execution_time: 0.045,
      rows_affected: 127,
      timestamp: '2025-08-23T10:30:00Z',
      user: 'admin',
      status: 'success'
    },
    {
      id: '2',
      database_id: '1',
      query: 'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      execution_time: 0.012,
      rows_affected: 1,
      timestamp: '2025-08-23T10:29:45Z',
      user: 'system',
      status: 'success'
    },
    {
      id: '3',
      database_id: '1',
      query: 'UPDATE clients SET last_activity = NOW() WHERE id = $1',
      execution_time: 0.008,
      rows_affected: 1,
      timestamp: '2025-08-23T10:29:30Z',
      user: 'system',
      status: 'success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getDatabaseTypeIcon = (type: string) => {
    switch (type) {
      case 'postgresql':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'redis':
        return <Database className="w-4 h-4 text-red-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBackupStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">مدیریت پایگاه داده</h1>
          <p className="text-muted-foreground">مدیریت پایگاه‌های داده، پشتیبان‌گیری و نظارت</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            افزودن پایگاه داده
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          نمای کلی
        </button>
        <button
          onClick={() => setActiveTab('databases')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'databases'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          پایگاه‌های داده
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'backups'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          پشتیبان‌گیری
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'queries'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          کوئری‌ها
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'monitoring'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          نظارت
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Database Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">کل پایگاه‌ها</p>
                  <p className="text-2xl font-bold">{databases.length}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">آنلاین</p>
                  <p className="text-2xl font-bold text-green-600">
                    {databases.filter(d => d.status === 'online').length}
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
                  <p className="text-sm text-muted-foreground">اتصالات فعال</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {databases.reduce((sum, db) => sum + db.connections, 0)}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="modern-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">حجم کل</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {databases.reduce((sum, db) => {
                      const size = parseFloat(db.size.replace(' GB', '').replace(' MB', ''));
                      return sum + (db.size.includes('GB') ? size * 1024 : size);
                    }, 0).toFixed(1)} MB
                  </p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <HardDrive className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Database Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Status */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">وضعیت پایگاه‌های داده</h3>
                    <p className="text-sm text-muted-foreground">نمای کلی پایگاه‌های داده</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {databases.map((database) => (
                  <div key={database.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getDatabaseTypeIcon(database.type)}
                      <div>
                        <p className="font-medium">{database.name}</p>
                        <p className="text-sm text-muted-foreground">{database.type.toUpperCase()} {database.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(database.status)}`}>
                        {getStatusIcon(database.status)}
                        {database.status === 'online' ? 'آنلاین' : database.status === 'offline' ? 'آفلاین' : 'تعمیر'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {database.connections}/{database.max_connections}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Backups */}
            <div className="modern-card p-6">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Archive className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-lg font-semibold text-foreground">آخرین پشتیبان‌ها</h3>
                    <p className="text-sm text-muted-foreground">پشتیبان‌های اخیر</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {databaseBackups.slice(0, 3).map((backup) => {
                  const database = databases.find(d => d.id === backup.database_id);
                  return (
                    <div key={backup.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <Archive className="w-4 h-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{database?.name}</p>
                        <p className="text-xs text-muted-foreground">{backup.filename}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getBackupStatusColor(backup.status)}`}>
                            {backup.status === 'completed' ? 'تکمیل' : backup.status === 'failed' ? 'ناموفق' : 'در حال اجرا'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {backup.size} • {new Date(backup.created_at).toLocaleString('fa-IR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Databases Tab */}
      {activeTab === 'databases' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">پایگاه‌های داده</h3>
                  <p className="text-sm text-muted-foreground">مدیریت پایگاه‌های داده</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {databases.map((database) => (
                <div key={database.id} className="p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getDatabaseTypeIcon(database.type)}
                      <div>
                        <h4 className="font-medium">{database.name}</h4>
                        <p className="text-sm text-muted-foreground">{database.type.toUpperCase()} {database.version}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(database.status)}`}>
                      {getStatusIcon(database.status)}
                      {database.status === 'online' ? 'آنلاین' : database.status === 'offline' ? 'آفلاین' : 'تعمیر'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">حجم:</span>
                      <span>{database.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">اتصالات:</span>
                      <span>{database.connections}/{database.max_connections}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">زمان کار:</span>
                      <span>{database.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">جداول:</span>
                      <span>{database.tables_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ایندکس‌ها:</span>
                      <span>{database.indexes_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">آخرین پشتیبان:</span>
                      <span>{new Date(database.last_backup).toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="مشاهده جزئیات">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="تنظیمات">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="پشتیبان‌گیری">
                      <Backup className="w-4 h-4" />
                    </button>
                    <button className="flex-1 p-2 hover:bg-accent rounded transition-colors" title="بازگردانی">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Backup className="w-5 h-5 text-green-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">پشتیبان‌گیری</h3>
                  <p className="text-sm text-muted-foreground">مدیریت پشتیبان‌های پایگاه داده</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                ایجاد پشتیبان
              </button>
            </div>
            
            <div className="space-y-4">
              {databaseBackups.map((backup) => {
                const database = databases.find(d => d.id === backup.database_id);
                return (
                  <div key={backup.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{database?.name} - {backup.type === 'full' ? 'پشتیبان کامل' : 'پشتیبان افزایشی'}</h4>
                        <p className="text-sm text-muted-foreground">{backup.filename}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getBackupStatusColor(backup.status)}`}>
                          {backup.status === 'completed' ? 'تکمیل' : backup.status === 'failed' ? 'ناموفق' : 'در حال اجرا'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">حجم:</span>
                        <span className="block font-medium">{backup.size}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">مدت زمان:</span>
                        <span className="block font-medium">{backup.duration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">تاریخ ایجاد:</span>
                        <span className="block font-medium">{new Date(backup.created_at).toLocaleString('fa-IR')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">نوع:</span>
                        <span className="block font-medium capitalize">{backup.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <Download className="w-4 h-4" />
                        دانلود
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <RotateCcw className="w-4 h-4" />
                        بازگردانی
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded transition-colors text-sm text-red-500">
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Queries Tab */}
      {activeTab === 'queries' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
                                <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <SearchIcon className="w-5 h-5 text-purple-400" />
                    </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">کوئری‌های اخیر</h3>
                  <p className="text-sm text-muted-foreground">مشاهده کوئری‌های اجرا شده</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {databaseQueries.map((query) => {
                const database = databases.find(d => d.id === query.database_id);
                return (
                  <div key={query.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{database?.name}</h4>
                        <p className="text-sm text-muted-foreground">کاربر: {query.user}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                          query.status === 'success' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : query.status === 'error'
                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        }`}>
                          {query.status === 'success' ? 'موفق' : query.status === 'error' ? 'خطا' : 'در حال اجرا'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black text-green-400 p-3 rounded font-mono text-xs mb-3 overflow-x-auto">
                      <pre>{query.query}</pre>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>زمان اجرا: {query.execution_time}ms</span>
                      <span>ردیف‌های تأثیرگذار: {query.rows_affected}</span>
                      <span>زمان: {new Date(query.timestamp).toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="modern-card">
          <div className="p-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-6`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Monitor className="w-5 h-5 text-orange-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-foreground">نظارت بر پایگاه داده</h3>
                  <p className="text-sm text-muted-foreground">نظارت بر عملکرد پایگاه‌های داده</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {databases.map((database) => (
                <div key={database.id} className="p-6 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-medium">{database.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleString('fa-IR')}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">اتصالات فعال</span>
                        <span className="text-sm font-medium">{database.connections}/{database.max_connections}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${(database.connections / database.max_connections) > 0.8 ? 'bg-red-500' : (database.connections / database.max_connections) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${(database.connections / database.max_connections) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">حجم استفاده شده</span>
                        <span className="text-sm font-medium">{database.size}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">تعداد جداول</span>
                        <span className="text-sm font-medium">{database.tables_count}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">تعداد ایندکس‌ها</span>
                        <span className="text-sm font-medium">{database.indexes_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
