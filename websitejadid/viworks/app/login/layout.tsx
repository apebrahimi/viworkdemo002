import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ورود به پورتال | ViWorkS',
  description: 'ورود به پورتال مدیریتی ViWorkS برای دسترسی به امکانات پیشرفته امنیتی',
  openGraph: {
    title: 'ورود به پورتال | ViWorkS',
    description: 'ورود به پورتال مدیریتی ViWorkS برای دسترسی به امکانات پیشرفته امنیتی',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
