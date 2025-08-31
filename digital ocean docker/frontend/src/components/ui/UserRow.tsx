import { Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatusBadge } from './StatusBadge';
import { RoleBadge } from './RoleBadge';
import { UserActions } from './UserActions';

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

interface UserRowProps {
  user: User;
  index: number;
  onActivate: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserRow({ 
  user, 
  index, 
  onActivate, 
  onEdit, 
  onViewDetails, 
  onDelete 
}: UserRowProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr 
      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
      }`}
    >
      <td className="p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{user.username}</div>
          </div>
        </div>
      </td>
      
      <td className="p-2.5 text-foreground">{user.email}</td>
      
      <td className="p-2.5">
        <RoleBadge role={user.role} />
      </td>
      
      <td className="p-2.5">
        <StatusBadge status={user.status} />
      </td>
      
      <td className="p-2.5 text-muted-foreground text-xs">
        {formatDate(user.lastLogin)}
      </td>
      
      <td className="p-2.5">
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {user.deviceCount} {language === 'fa' ? 'دستگاه' : 'devices'}
        </span>
      </td>
      
      <td className="p-2.5">
        <UserActions
          userId={user.id}
          status={user.status}
          onActivate={onActivate}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
