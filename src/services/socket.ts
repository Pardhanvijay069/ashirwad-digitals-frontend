import { io, type Socket } from 'socket.io-client';
import { storage, STORAGE_KEYS } from '@/utils/storage';

let socket: Socket | null = null;

/**
 * Get or create the Socket.io client instance.
 * Connects to the admin namespace for real-time order alerts.
 */
export function getSocket(): Socket {
  if (!socket) {
    const wsUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:5000';
    socket = io(`${wsUrl}/admin`, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      auth: {
        token: storage.get<string | null>(STORAGE_KEYS.ADMIN_TOKEN, null)
      }
    });
  }
  return socket;
}

/**
 * Connect the socket (call from admin dashboard).
 */
export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

/**
 * Disconnect the socket (call on admin logout or unmount).
 */
export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

/**
 * Listen for new order alerts.
 */
export function onNewOrderAlert(callback: (data: unknown) => void): () => void {
  const s = getSocket();
  s.on('new-order-alert', callback);
  return () => {
    s.off('new-order-alert', callback);
  };
}
