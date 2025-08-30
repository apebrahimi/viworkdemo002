'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import { useAuth } from './AuthContext';

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
  const { isAuthenticated } = useAuth();
  const [wsUrl, setWsUrl] = useState<string>('');
  
  // Create WebSocket URL based on environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'localhost:8081';
      setWsUrl(`${protocol}//${host}/ws`);
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

  // Auto-connect when authenticated and URL is ready
  useEffect(() => {
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

  // Auto-subscribe to channels when connected
  useEffect(() => {
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
