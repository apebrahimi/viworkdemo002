import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { username: string; email: string; role: string }) => void;
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {language === 'fa' ? 'افزودن کاربر' : 'Add User'}
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
              {language === 'fa' ? 'نام کاربری' : 'Username'}
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              placeholder="username"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">
              {language === 'fa' ? 'ایمیل' : 'Email'}
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              placeholder="user@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">
              {language === 'fa' ? 'نقش' : 'Role'}
            </label>
            <select 
              name="role"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            >
              <option value="user">{language === 'fa' ? 'کاربر' : 'User'}</option>
              <option value="moderator">{language === 'fa' ? 'ناظر' : 'Moderator'}</option>
              <option value="admin">{language === 'fa' ? 'مدیر' : 'Admin'}</option>
            </select>
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
