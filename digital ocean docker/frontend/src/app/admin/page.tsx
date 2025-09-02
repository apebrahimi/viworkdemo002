'use client';

import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the ViWorkS Admin Panel</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
            <p className="text-xs text-gray-500">{admin?.role}</p>
          </div>
          
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Admin Authentication Realm</h2>
        <p className="text-gray-600 mb-4">
          You are now using the separated admin authentication system. This provides enhanced security with:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>IP address restrictions</li>
          <li>Separate authentication tokens</li>
          <li>Short session timeouts ({admin?.session_timeout_minutes} minutes)</li>
          <li>Comprehensive audit logging</li>
          <li>Role-based access control</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">User Management</h3>
          <p className="text-gray-600 mb-4">Manage platform users and their permissions</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white">
            Manage Users
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Session Management</h3>
          <p className="text-gray-600 mb-4">View and terminate active user sessions</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white">
            View Sessions
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Audit Logs</h3>
          <p className="text-gray-600 mb-4">Review admin activity and security events</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
}
