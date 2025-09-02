'use client';

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import IdleTimeoutIndicator from '@/components/IdleTimeoutIndicator';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminProtectedRoute>
          <div className="flex flex-col min-h-screen">
            {/* Admin Header will go here */}
            <div className="flex-grow">
              {children}
            </div>
            {/* Admin Footer will go here */}
            <IdleTimeoutIndicator />
          </div>
        </AdminProtectedRoute>
      </div>
    </AdminAuthProvider>
  );
}
