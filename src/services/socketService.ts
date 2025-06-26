import { io, Socket } from 'socket.io-client';

// Simple WebSocket service without socket.io for now
type EventCallback = (data?: unknown) => void;

class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private eventListeners: Map<string, EventCallback[]> = new Map();
  private isConnecting: boolean = false;

  constructor(serverUrl: string = 'http://localhost:4000') {
    this.serverUrl = serverUrl;
  }

  connect(): Socket {
    // Prevent multiple connection attempts
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.socket!;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = true;

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      forceNew: true, // Force a new connection
    });

    // Handle connection state
    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log('Socket connected successfully');
    });

    this.socket.on('disconnect', () => {
      this.isConnecting = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', error => {
      this.isConnecting = false;
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners(); // Clean up all listeners
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event emitters
  emitUserLeft(username: string): void {
    this.socket?.emit('userLeft', { username });
  }

  emitUserStatusUpdate(username: string, status: string): void {
    this.socket?.emit('userStatusUpdate', { username, status });
  }

  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  send(data: unknown): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', data);
    }
  }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
