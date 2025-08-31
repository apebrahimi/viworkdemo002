import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { renderStatusPill } from '@/lib/utils';

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className = '' }: ClientStatusBadgeProps) {
  const { language } = useLanguage();

  const statusPill = renderStatusPill(status, language);
  const IconComponent = statusPill.icon === 'CheckCircle' ? CheckCircle : 
                       statusPill.icon === 'XCircle' ? XCircle : 
                       statusPill.icon === 'Clock' ? Clock : AlertCircle;

  return (
    <div className={`${statusPill.className} ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span>{statusPill.label}</span>
    </div>
  );
}
