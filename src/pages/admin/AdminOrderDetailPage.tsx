import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useMarkOrderReadMutation,
} from '@/services/ordersApi';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import type { OrderStatus } from '@/types';

const statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0', 10);
  const { data, isLoading, isError, refetch } = useGetAdminOrderByIdQuery(orderId);
  const [updateStatus, { isLoading: statusUpdating }] = useUpdateOrderStatusMutation();
  const [markRead] = useMarkOrderReadMutation();

  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [cancelReason, setCancelReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const order = data?.order;
  const items = data?.items;

  // Auto-mark as read on visit
  useEffect(() => {
    if (order && !order.is_read) {
      markRead(orderId);
    }
  }, [order, orderId, markRead]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await updateStatus({
        id: orderId,
        status: newStatus,
        cancel_reason: newStatus === 'cancelled' ? cancelReason : undefined,
      }).unwrap();
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`);
      setShowConfirm(false);
      setNewStatus('');
      setCancelReason('');
    } catch {
      toast.error('Failed to update order status.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState message="Order not found." onRetry={refetch} />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/admin/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {order.order_number}
            </h1>
            <p className="text-sm text-surface-500">Placed {formatDateTime(order.created_at)}</p>
          </div>
          <StatusBadge status={order.status} size="md" />
        </div>

        {/* Customer Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Customer Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-surface-500">Name</p>
              <p className="font-medium text-surface-900 dark:text-surface-100">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Phone</p>
              <p className="font-medium text-surface-900 dark:text-surface-100">{order.customer_phone}</p>
            </div>
            {order.customer_email && (
              <div>
                <p className="text-sm text-surface-500">Email</p>
                <p className="font-medium text-surface-900 dark:text-surface-100">{order.customer_email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-surface-500">Address</p>
              <p className="font-medium text-surface-900 dark:text-surface-100">{order.address}</p>
            </div>
            {order.special_instructions && (
              <div className="sm:col-span-2">
                <p className="text-sm text-surface-500">Special Instructions</p>
                <p className="font-medium text-surface-900 dark:text-surface-100">{order.special_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Design File */}
        {order.design_file_url && (
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-surface-900 dark:text-surface-100">Design File</h2>
            <a
              href={order.design_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:border-surface-700 dark:text-primary-400 dark:hover:bg-primary-950/20"
            >
              <FileText className="h-4 w-4" />
              View Design File
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Card>
        )}

        {/* Order Items */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left dark:border-surface-700">
                  <th className="pb-3 pr-4 font-medium text-surface-500">Product</th>
                  <th className="pb-3 pr-4 font-medium text-surface-500">Qty</th>
                  <th className="pb-3 pr-4 font-medium text-surface-500">Unit Price</th>
                  <th className="pb-3 font-medium text-surface-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 font-medium text-surface-900 dark:text-surface-100">
                      {item.product_name}
                    </td>
                    <td className="py-3 pr-4 text-surface-600 dark:text-surface-400">{item.quantity}</td>
                    <td className="py-3 pr-4 text-surface-600 dark:text-surface-400">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 text-right font-medium text-surface-900 dark:text-surface-100">{formatCurrency(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-surface-200 dark:border-surface-700">
                  <td colSpan={3} className="pt-3 text-right font-semibold text-surface-900 dark:text-surface-100">
                    Total
                  </td>
                  <td className="pt-3 text-right text-lg font-bold text-primary-700 dark:text-primary-400">
                    {formatCurrency(order.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Status Update */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
              Update Status
            </h2>
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-full sm:w-56">
                <Select
                  label="New Status"
                  options={statusOptions}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  placeholder="Select status"
                />
              </div>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!newStatus || newStatus === order.status}
              >
                Update Status
              </Button>
            </div>

            {newStatus === 'cancelled' && (
              <div className="mt-4">
                <Textarea
                  label="Cancellation Reason"
                  placeholder="Reason for cancelling this order..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            )}
          </Card>
        )}

        {/* Cancel Info */}
        {order.status === 'cancelled' && order.cancel_reason && (
          <Card className="border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-950/20">
            <h3 className="mb-2 font-semibold text-danger-700 dark:text-danger-300">
              Cancellation Reason
            </h3>
            <p className="text-danger-600 dark:text-danger-400">{order.cancel_reason}</p>
            {order.cancelled_at && (
              <p className="mt-2 text-sm text-danger-500">Cancelled at: {formatDateTime(order.cancelled_at)}</p>
            )}
          </Card>
        )}
      </motion.div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleStatusUpdate}
        title={`Change status to ${newStatus ? ORDER_STATUS_LABELS[newStatus] : ''}?`}
        message={
          newStatus === 'cancelled'
            ? 'This will cancel the order and restore stock for items in pending/design_review status.'
            : `The order status will be updated to "${newStatus ? ORDER_STATUS_LABELS[newStatus] : ''}".`
        }
        confirmLabel="Confirm"
        variant={newStatus === 'cancelled' ? 'danger' : 'primary'}
        isLoading={statusUpdating}
      />
    </div>
  );
}
