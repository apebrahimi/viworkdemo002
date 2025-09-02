'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') {
      return;
    }
    
    // Redirect to login if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      router.push(`/admin/login?reason=unauthorized&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // If on login page or authenticated, render children
  if (pathname === '/admin/login' || isAuthenticated) {
    return <>{children}</>;
  }
  
  // Fallback empty div while redirecting
  return <div></div>;
};

export default AdminProtectedRoute;
