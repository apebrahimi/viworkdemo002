import { CheckCircle, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserActionsProps {
  userId: string;
  status: string;
  onActivate: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserActions({ 
  userId, 
  status, 
  onActivate, 
  onEdit, 
  onViewDetails, 
  onDelete 
}: UserActionsProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onActivate(userId)}
        disabled={status === 'active'}
        className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded transition-colors disabled:opacity-50"
        title={language === 'fa' ? 'فعال‌سازی' : 'Activate'}
      >
        <CheckCircle className="w-4 h-4" />
      </button>
      
      {onEdit && (
        <button
          onClick={() => onEdit(userId)}
          className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
          title={language === 'fa' ? 'ویرایش' : 'Edit'}
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(userId)}
          className="p-1.5 hover:bg-yellow-500/10 hover:text-yellow-500 rounded transition-colors"
          title={language === 'fa' ? 'جزئیات بیشتر' : 'More details'}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={() => onDelete(userId)}
          className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
          title={language === 'fa' ? 'حذف' : 'Delete'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
