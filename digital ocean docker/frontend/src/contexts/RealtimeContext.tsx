'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import { useAdminAuth } from './AdminAuthContext';

interface RealtimeContextType {
  isConnected: boolean;
  messages: WebSocketMessage[];
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  sendMessage: (message: WebSocketMessage) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  const [wsUrl, setWsUrl] = useState<string>('');
  
  // Create WebSocket URL based on environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // Use the same host as the current page for WebSocket
      const host = window.location.hostname;
      const port = process.env.NODE_ENV === 'production' ? '' : ':8081';
      setWsUrl(`${protocol}//${host}${port}/ws`);
    }
  }, []);

  const {
    isConnected,
    messages,
    sendMessage,
    subscribe,
    unsubscribe,
    connect,
    disconnect
  } = useWebSocket(wsUrl);

  // TEMPORARILY DISABLED: Auto-connect when authenticated and URL is ready
  // This is causing the admin panel to fail loading
  useEffect(() => {
    // Disable WebSocket for now to fix admin panel loading
    console.log('WebSocket temporarily disabled to fix admin panel loading');
    return;
    
    if (isAuthenticated && wsUrl && wsUrl.trim() !== '') {
      console.log('Attempting to connect to WebSocket:', wsUrl);
      connect();
    } else {
      if (isConnected) {
        console.log('Disconnecting WebSocket - not authenticated or URL not ready');
        disconnect();
      }
    }
  }, [isAuthenticated, wsUrl, connect, disconnect, isConnected]);

  // TEMPORARILY DISABLED: Auto-subscribe to channels when connected
  useEffect(() => {
    // Disable WebSocket subscriptions for now
    console.log('WebSocket subscriptions temporarily disabled');
    return;
    
    if (isConnected && isAuthenticated) {
      console.log('Subscribing to default channels');
      // Subscribe to default channels
      subscribe('system_metrics');
      subscribe('security_alerts');
      subscribe('client_updates');
    }
  }, [isConnected, subscribe, isAuthenticated]);

  const value: RealtimeContextType = {
    isConnected,
    messages,
    subscribe,
    unsubscribe,
    sendMessage,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
