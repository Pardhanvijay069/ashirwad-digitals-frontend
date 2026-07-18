import { Link, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { useGetCustomerOrdersQuery } from '@/services/ordersApi';
import { useAuth } from '@/hooks/useAuth';
import { CustomerAuthGuard } from '@/components/guards/CustomerAuthGuard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { CtaLink } from '@/components/shop/LuxeCta';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { EASE_LUXE, staggerChildren, fadeUp } from '@/lib/motion';

export default function CustomerOrdersPage() {
  return (
    <CustomerAuthGuard>
      <OrdersList />
    </CustomerAuthGuard>
  );
}

function OrdersList() {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { data: orders, isLoading, isError, refetch } = useGetCustomerOrdersQuery(customer!.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
      >
        <div className="mb-12">
          <p className="eyebrow mb-3">Your Collection's History</p>
          <h1 className="font-display text-3xl font-medium text-primary-700 sm:text-4xl">My Orders</h1>
          <div className="hairline-gold mt-6 w-24" />
        </div>

        {isLoading && (
          <div className="space-y-4" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        )}

        {isError && <ErrorState onRetry={refetch} />}

        {orders && orders.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent-300 text-accent-600">
              <Package className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="font-display mb-3 text-2xl font-medium text-primary-700">No orders yet</h2>
            <p className="mb-10 max-w-sm text-sm leading-relaxed text-surface-500">
              Your first devotional artwork is waiting in the gallery.
            </p>
            <CtaLink to="/products" variant="gold" size="lg">
              Explore the Gallery
            </CtaLink>
          </div>
        )}

        {orders && orders.length > 0 && (
          <motion.ul
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={staggerChildren(0.07)}
            className="space-y-4"
          >
            {orders.map((order) => (
              <motion.li key={order.id} variants={reduced ? undefined : fadeUp}>
                <Link
                  to={`/track?token=${order.tracking_token}`}
                  className="focus-ring group flex flex-col gap-4 border border-surface-200 bg-cream p-6 shadow-soft transition-all duration-400 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7"
                  aria-label={`Track order ${order.order_number}`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-accent text-sm font-medium tracking-wider text-primary-700">
                        {order.order_number}
                      </p>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="mt-1.5 text-xs text-surface-400">Placed on {formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="font-accent text-lg tracking-wider text-primary-700">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <ArrowRight
                      className="h-4 w-4 text-surface-300 transition-all duration-400 group-hover:translate-x-1 group-hover:text-accent-600"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {orders && orders.length > 0 && (
          <p className="mt-10 text-center text-xs text-surface-400">
            Questions about an order?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="focus-ring text-accent-700 underline-offset-4 hover:underline"
            >
              Write to the studio.
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
