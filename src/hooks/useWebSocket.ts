import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import socketService from '../services/socketService';
import {
  UserJoinedEvent,
  UserLeftEvent,
  UserStatusEvent,
  ConnectedEvent,
} from '../types/user.types';

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  socket: Socket | null;
  connectionError: string | null;
}

interface UseWebSocketCallbacks {
  onUserJoined?: (data: UserJoinedEvent) => void;
  onUserLeft?: (data: UserLeftEvent) => void;
  onUserStatusUpdate?: (data: UserStatusEvent) => void;
  onConnected?: (data: ConnectedEvent) => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = (callbacks: UseWebSocketCallbacks = {}): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const callbacksRef = useRef(callbacks);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  // Update callbacks ref when callbacks change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const setupEventListeners = useCallback((socket: Socket) => {
    // Remove any existing listeners first
    socket.removeAllListeners();

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log('Socket.IO connected');
    });

    socket.on('disconnect', (reason: string) => {
      setIsConnected(false);
      console.log('Socket.IO disconnected:', reason);
      callbacksRef.current.onDisconnect?.();
    });

    socket.on('connect_error', (error: Error) => {
      setConnectionError(error.message);
      setIsConnected(false);
      console.error('Socket.IO connection error:', error);
      callbacksRef.current.onError?.(error.message);
    });

    // Custom events
    socket.on('connected', (data: ConnectedEvent) => {
      callbacksRef.current.onConnected?.(data);
    });

    socket.on('userJoined', (data: UserJoinedEvent) => {
      console.log('User joined event received:', data);
      callbacksRef.current.onUserJoined?.(data);
    });

    socket.on('userLeft', (data: UserLeftEvent) => {
      callbacksRef.current.onUserLeft?.(data);
    });

    socket.on('userStatusUpdate', (data: UserStatusEvent) => {
      callbacksRef.current.onUserStatusUpdate?.(data);
    });
  }, []);

  const connect = useCallback(() => {
    // Prevent multiple connections
    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    try {
      const socket = socketService.connect();
      socketRef.current = socket;
      setupEventListeners(socket);
      isInitializedRef.current = true;
    } catch (error) {
      setConnectionError('Failed to initialize socket connection');
      console.error('Socket initialization error:', error);
    }
  }, [setupEventListeners]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setConnectionError(null);
    isInitializedRef.current = false;
  }, []);

  // Initialize connection on mount (only once)
  useEffect(() => {
    if (!isInitializedRef.current) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (isInitializedRef.current) {
        disconnect();
      }
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    socket: socketRef.current,
    connectionError,
  };
};
