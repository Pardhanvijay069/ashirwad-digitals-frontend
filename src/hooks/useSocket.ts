import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { connectSocket, disconnectSocket, onNewOrderAlert } from '@/services/socket';
import { useAppDispatch } from '@/store';
import { incrementUnreadCount } from '@/store/slices/notificationSlice';
import { api } from '@/services/api';

/**
 * Admin socket hook — connects to Socket.io and listens for new-order-alert.
 * Invalidates UnreadCount and OrderList cache tags on new orders.
 */
export function useSocket(enabled: boolean) {
  const dispatch = useAppDispatch();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    connectSocket();

    cleanupRef.current = onNewOrderAlert(() => {
      // Show toast notification
      toast.success('New Order Received!', {
        description: 'A new order has been placed.',
        duration: 5000,
      });

      // Update unread count optimistically
      dispatch(incrementUnreadCount());

      // Invalidate cache to refetch orders and unread count
      dispatch(api.util.invalidateTags(['UnreadCount', 'OrderList']));
    });

    return () => {
      cleanupRef.current?.();
      disconnectSocket();
    };
  }, [enabled, dispatch]);
}
