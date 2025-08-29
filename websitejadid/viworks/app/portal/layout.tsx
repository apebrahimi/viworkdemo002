import { Metadata } from 'next';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalProvider } from '@/components/portal/PortalProvider';

export const metadata: Metadata = {
  title: 'پورتال مشتریان | ViWorkS',
  description: 'پورتال مدیریتی ViWorkS برای دسترسی به امکانات پشتیبانی، قراردادها و گزارش‌ها',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProvider>
      <div className="min-h-screen portal-gradient">
        <PortalHeader />
        <div className="flex">
          <PortalSidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PortalProvider>
  );
}
