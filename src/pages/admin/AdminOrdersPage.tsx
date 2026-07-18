import { useState } from 'react';
import { Link } from 'react-router';
import { useGetAdminOrdersQuery } from '@/services/ordersApi';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { formatCurrency } from '@/utils/formatCurrency';
import { timeAgo } from '@/utils/formatDate';
import { PAGINATION } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types';
import { ShoppingBag } from 'lucide-react';

const statusFilters: Array<{ value: '' | OrderStatus; label: string }> = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'design_review', label: 'Design Review' },
  { value: 'printing', label: 'Printing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<'' | OrderStatus>('');
  const [page, setPage] = useState(1);
  const limit = PAGINATION.DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const { data: orders, isLoading, isError, refetch } = useGetAdminOrdersQuery({
    status: statusFilter || undefined,
    limit,
    offset,
  });

  // Reset page when filter changes
  const handleFilterChange = (filter: '' | OrderStatus) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-100">Orders</h1>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
              statusFilter === filter.value
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Card padding="none">
        {isError ? (
          <div className="p-6">
            <ErrorState onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="p-6">
            <SkeletonTable rows={8} />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left dark:border-surface-700">
                  <th className="px-6 py-3 font-medium text-surface-500">Order</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Customer</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Phone</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Amount</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Status</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={cn(
                      'hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors',
                      !order.is_read && 'bg-primary-50/30 dark:bg-primary-950/10'
                    )}
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-mono font-medium text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {order.order_number}
                      </Link>
                      {!order.is_read && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-700 dark:text-surface-300">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400">
                      {order.customer_phone}
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-surface-100">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-surface-500">
                      {timeAgo(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No orders found"
              description={statusFilter ? 'No orders match this filter.' : 'No orders have been placed yet.'}
              icon={<ShoppingBag className="h-8 w-8" />}
            />
          </div>
        )}
      </Card>

      {/* Pagination */}
      {orders && orders.length >= limit && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(100 / limit)} // Approximation — backend doesn't return total
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
