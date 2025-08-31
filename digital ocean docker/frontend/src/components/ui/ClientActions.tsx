import { Eye, Edit, PowerOff, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientActionsProps {
  clientId: string;
  onViewDetails: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
  onDisconnect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  isDisconnectLoading?: boolean;
  isDeleteLoading?: boolean;
}

export function ClientActions({ 
  clientId, 
  onViewDetails, 
  onEdit, 
  onDisconnect, 
  onDelete,
  isDisconnectLoading = false,
  isDeleteLoading = false
}: ClientActionsProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onViewDetails(clientId)}
        className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors"
        title={language === 'fa' ? 'مشاهده جزئیات' : 'View details'}
      >
        <Eye className="w-4 h-4" />
      </button>
      
      {onEdit && (
        <button
          onClick={() => onEdit(clientId)}
          className="p-1.5 hover:bg-yellow-500/10 hover:text-yellow-500 rounded transition-colors"
          title={language === 'fa' ? 'ویرایش' : 'Edit'}
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      
      <button
        onClick={() => onDisconnect(clientId)}
        disabled={isDisconnectLoading}
        className="p-1.5 hover:bg-orange-500/10 hover:text-orange-500 rounded transition-colors disabled:opacity-50"
        title={language === 'fa' ? 'قطع اتصال' : 'Disconnect'}
      >
        <PowerOff className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => onDelete(clientId)}
        disabled={isDeleteLoading}
        className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors disabled:opacity-50"
        title={language === 'fa' ? 'حذف' : 'Delete'}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
