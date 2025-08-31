import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; ipAddress: string; macAddress: string }) => void;
}

export function AddClientModal({ isOpen, onClose, onSubmit }: AddClientModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name') as string,
      ipAddress: formData.get('ipAddress') as string,
      macAddress: formData.get('macAddress') as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {language === 'fa' ? 'افزودن کلاینت' : 'Add Client'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              {language === 'fa' ? 'نام کلاینت' : 'Client Name'}
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              placeholder={language === 'fa' ? 'Client-001' : 'Client-001'}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">
              {language === 'fa' ? 'آدرس IP' : 'IP Address'}
            </label>
            <input
              name="ipAddress"
              type="text"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              placeholder="192.168.1.100"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">
              {language === 'fa' ? 'آدرس MAC' : 'MAC Address'}
            </label>
            <input
              name="macAddress"
              type="text"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              placeholder="00:11:22:33:44:55"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
            >
              {language === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              {language === 'fa' ? 'افزودن' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
