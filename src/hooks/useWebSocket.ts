import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
    setConnectionStatus,
    updateTokenPrice,
    batchUpdatePrices,
    addToken
} from '@/store/slices/tokensSlice';
import type { PriceUpdate, Token, ConnectionStatus } from '@/types';

interface WebSocketMessage {
    type: 'price_update' | 'batch_update' | 'new_token' | 'connection_status';
    payload: PriceUpdate | PriceUpdate[] | Token | ConnectionStatus;
}

interface UseWebSocketOptions {
    url?: string;
    enabled?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

interface UseWebSocketResult {
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    sendMessage: (message: unknown) => void;
}

/**
 * Custom hook for WebSocket connection with auto-reconnect
 * In production, this would connect to a real WebSocket server
 * Currently configured for mock data
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketResult {
    const {
        enabled = true,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
    } = options;

    const dispatch = useAppDispatch();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isConnectedRef = useRef(false);

    /**
     * Handle incoming WebSocket messages
     */
    const handleMessage = useCallback(
        (event: MessageEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);

                switch (message.type) {
                    case 'price_update':
                        dispatch(updateTokenPrice(message.payload as PriceUpdate));
                        break;
                    case 'batch_update':
                        dispatch(batchUpdatePrices(message.payload as PriceUpdate[]));
                        break;
                    case 'new_token':
                        const token = message.payload as Token;
                        dispatch(addToken({ category: token.category, token }));
                        break;
                    case 'connection_status':
                        dispatch(setConnectionStatus(message.payload as ConnectionStatus));
                        break;
                }
            } catch (error) {
                console.error('WebSocket message parse error:', error);
            }
        },
        [dispatch]
    );

    /**
     * Connect to WebSocket server
     */
    const connect = useCallback(() => {
        // For now, we'll use the mock WebSocket service instead
        // In production, uncomment the WebSocket connection code below

        /*
        if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
        try {
          dispatch(setConnectionStatus('connecting'));
          wsRef.current = new WebSocket(url);
    
          wsRef.current.onopen = () => {
            isConnectedRef.current = true;
            reconnectAttempts.current = 0;
            dispatch(setConnectionStatus('connected'));
          };
    
          wsRef.current.onmessage = handleMessage;
    
          wsRef.current.onclose = () => {
            isConnectedRef.current = false;
            dispatch(setConnectionStatus('disconnected'));
    
            // Attempt reconnect if enabled
            if (enabled && reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
            }
          };
    
          wsRef.current.onerror = () => {
            dispatch(setConnectionStatus('error'));
          };
        } catch (error) {
          console.error('WebSocket connection error:', error);
          dispatch(setConnectionStatus('error'));
        }
        */

        // Mock connection for development
        dispatch(setConnectionStatus('connected'));
        isConnectedRef.current = true;
    }, [dispatch, enabled, maxReconnectAttempts, reconnectInterval]);

    /**
     * Disconnect from WebSocket server
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        isConnectedRef.current = false;
        dispatch(setConnectionStatus('disconnected'));
    }, [dispatch]);

    /**
     * Send a message through WebSocket
     */
    const sendMessage = useCallback((message: unknown) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [enabled, connect, disconnect]);

    return {
        isConnected: isConnectedRef.current,
        connect,
        disconnect,
        sendMessage,
    };
}
