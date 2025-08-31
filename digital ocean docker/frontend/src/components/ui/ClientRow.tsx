import { Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientActions } from './ClientActions';
import { Client } from '@/lib/types';

interface ClientRowProps {
  client: Client;
  index: number;
  onViewDetails: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
  onDisconnect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  isDisconnectLoading?: boolean;
  isDeleteLoading?: boolean;
}

export function ClientRow({ 
  client, 
  index, 
  onViewDetails, 
  onEdit, 
  onDisconnect, 
  onDelete,
  isDisconnectLoading = false,
  isDeleteLoading = false
}: ClientRowProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === 'fa' ? 'نامشخص' : 'Unknown';
    
    return new Date(dateString).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', {
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
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground truncate">{client.name}</div>
            <div className="text-xs text-muted-foreground font-mono truncate">{client.mac_address}</div>
          </div>
        </div>
      </td>
      
      <td className="p-2.5 text-foreground">
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {client.ip_address || 'N/A'}
        </span>
      </td>
      
      <td className="p-2.5">
        <div className="flex items-center gap-1">
          <span className="text-xs truncate">{client.platform}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded flex-shrink-0">
            v{client.version}
          </span>
        </div>
      </td>
      
      <td className="p-2.5">
        <ClientStatusBadge status={client.status} />
      </td>
      
      <td className="p-2.5 text-muted-foreground text-xs">
        {formatDate(client.last_seen)}
      </td>
      
      <td className="p-2.5">
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {client.connection_count} {language === 'fa' ? 'اتصال' : 'conn'}
        </span>
      </td>
      
      <td className="p-2.5">
        <ClientActions
          clientId={client.id}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDisconnect={onDisconnect}
          onDelete={onDelete}
          isDisconnectLoading={isDisconnectLoading}
          isDeleteLoading={isDeleteLoading}
        />
      </td>
    </tr>
  );
}
