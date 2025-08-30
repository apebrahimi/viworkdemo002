'use client';

import React from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Wifi, WifiOff } from 'lucide-react';

export const RealtimeStatus: React.FC = () => {
  const { isConnected } = useRealtime();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
    </div>
  );
};
