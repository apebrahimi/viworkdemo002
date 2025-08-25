import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface WebSocketEvent {
  event_type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    // Don't connect if URL is empty or if already connecting
    if (!url || url.trim() === '' || isConnectingRef.current) {
      return;
    }

    // Don't connect if already connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      isConnectingRef.current = true;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        isConnectingRef.current = false;
        console.log('WebSocket connected to:', url);
        
        // Send initial connection message
        try {
          ws.send(JSON.stringify({
            type: 'connect',
            user_id: typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'anonymous' : 'anonymous'
          }));
        } catch (err) {
          console.warn('Failed to send initial WebSocket message:', err);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
          
          // Handle different message types
          switch (message.type) {
            case 'connected':
              console.log('WebSocket session established:', message.data?.session_id);
              break;
            case 'system_metrics':
              // Handle system metrics update
              break;
            case 'security_event':
              // Show security event notification
              if (typeof window !== 'undefined') {
                toast.error(`Security Alert: ${message.data?.details}`, {
                  duration: 5000,
                  position: 'top-right',
                });
              }
              break;
            case 'client_update':
              // Handle client status update
              break;
            case 'alert_update':
              // Handle alert update
              if (typeof window !== 'undefined') {
                toast.error(`Alert: ${message.data?.title}`, {
                  duration: 4000,
                  position: 'top-right',
                });
              }
              break;
            default:
              console.log('Received WebSocket message:', message);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        isConnectingRef.current = false;
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Only attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000) {
          // Attempt to reconnect after 5 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        isConnectingRef.current = false;
        setError('WebSocket connection error');
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      isConnectingRef.current = false;
      setError('Failed to create WebSocket connection');
      console.error('WebSocket connection error:', err);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    isConnectingRef.current = false;
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const subscribe = useCallback((channel: string) => {
    sendMessage({
      type: 'subscribe',
      channel
    });
  }, [sendMessage]);

  const unsubscribe = useCallback((channel: string) => {
    sendMessage({
      type: 'unsubscribe',
      channel
    });
  }, [sendMessage]);

  useEffect(() => {
    // Only connect if we have a valid URL
    if (url && url.trim() !== '') {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, url]);

  return {
    isConnected,
    messages,
    error,
    sendMessage,
    subscribe,
    unsubscribe,
    connect,
    disconnect
  };
};
