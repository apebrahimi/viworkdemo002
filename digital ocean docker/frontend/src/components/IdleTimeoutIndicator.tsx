'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const IdleTimeoutIndicator: React.FC = () => {
  const { idleTimeRemaining, isAuthenticated, refreshAuth } = useAdminAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [warningThreshold] = useState(60000); // Show warning when 60 seconds remain
  
  useEffect(() => {
    // Only show warning when authenticated and time is below threshold
    if (isAuthenticated && idleTimeRemaining !== null && idleTimeRemaining <= warningThreshold) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [idleTimeRemaining, isAuthenticated, warningThreshold]);
  
  // Format time remaining as MM:SS
  const formatTimeRemaining = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await refreshAuth();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };
  
  if (!showWarning || !idleTimeRemaining) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Session timeout warning
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>Your session will expire in {formatTimeRemaining(idleTimeRemaining)} due to inactivity.</p>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutIndicator;
