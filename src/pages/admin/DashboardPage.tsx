import { useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { useGetAdminOrdersQuery, useGetUnreadCountQuery } from '@/services/ordersApi';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonDashboardCard, SkeletonTable } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/formatCurrency';
import { timeAgo } from '@/utils/formatDate';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useGetAdminOrdersQuery({ limit: 50 });
  const { data: unreadCount = 0, isLoading: unreadLoading } = useGetUnreadCountQuery();

  const stats = useMemo(() => {
    if (!orders) return null;
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    return { total, pending, delivered };
  }, [orders]);

  const recentOrders = orders?.slice(0, 10);
  const isLoading = ordersLoading || unreadLoading;

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.total ?? 0,
      icon: ShoppingBag,
      color: 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400',
    },
    {
      label: 'Pending',
      value: stats?.pending ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    },
    {
      label: 'Unread',
      value: unreadCount,
      icon: Eye,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    },
    {
      label: 'Delivered',
      value: stats?.delivered ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-100">
        Dashboard
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonDashboardCard key={i} />)
          : statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{card.label}</p>
                        <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-surface-100">
                          {card.value}
                        </p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left text-surface-500 dark:border-surface-700">
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group">
                    <td className="py-3 pr-4">
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
                    <td className="py-3 pr-4 text-surface-700 dark:text-surface-300">
                      {order.customer_name}
                    </td>
                    <td className="py-3 pr-4 font-medium text-surface-900 dark:text-surface-100">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3 text-surface-500">{timeAgo(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-surface-500">No orders yet.</p>
        )}
      </Card>
    </div>
  );
}
