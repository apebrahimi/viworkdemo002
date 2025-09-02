'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get reason from URL if present
  const reason = searchParams.get('reason');
  
  // Setup form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Handle login form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await login({
        username: data.username,
        password: data.password,
      });
      
      // Successful login will redirect via the useEffect above
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get message based on reason
  const getReasonMessage = () => {
    switch (reason) {
      case 'session_expired':
        return 'Your session has expired. Please log in again.';
      case 'idle_timeout':
        return 'Your session timed out due to inactivity. Please log in again.';
      case 'unauthorized':
        return 'Please log in to access the admin panel.';
      default:
        return null;
    }
  };
  
  const reasonMessage = getReasonMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">ViWorkS Admin</h1>
          <p className="text-gray-600 mt-2">Please log in to continue</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Reason message */}
        {reasonMessage && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            {reasonMessage}
          </div>
        )}
        
        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter your username"
              {...register('username')}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter your password"
              {...register('password')}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Admin access is restricted to authorized personnel only
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This panel is IP restricted. Unauthorized access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
