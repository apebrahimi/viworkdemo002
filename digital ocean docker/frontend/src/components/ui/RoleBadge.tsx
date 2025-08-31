import { useLanguage } from '@/contexts/LanguageContext';

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const { language } = useLanguage();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600';
      case 'moderator': return 'text-blue-600';
      case 'user': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

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
    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(role)} bg-opacity-10 ${className}`}>
      {getRoleLabel(role)}
    </span>
  );
}
