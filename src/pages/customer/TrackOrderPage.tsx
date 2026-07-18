import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Package, Clock, Printer, Truck, XCircle, Eye } from 'lucide-react';
import { useTrackOrderQuery } from '@/services/ordersApi';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { EASE_LUXE } from '@/lib/motion';
import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types';

const stepIcons: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  design_review: Eye,
  printing: Printer,
  ready: Package,
  delivered: Truck,
  cancelled: XCircle,
};

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [activeToken, setActiveToken] = useState(searchParams.get('token') || '');
  const reduced = useReducedMotion();

  const { data, isLoading, isError, refetch } = useTrackOrderQuery(activeToken, {
    skip: !activeToken,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setActiveToken(token.trim());
      setSearchParams({ token: token.trim() });
    }
  };

  const order = data?.order;
  const items = data?.items;

  const currentStepIndex = order
    ? order.status === 'cancelled'
      ? -1
      : ORDER_STATUS_FLOW.indexOf(order.status)
    : -1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
      >
        <div className="mb-10 text-center">
          <p className="eyebrow mb-4">The Journey Home</p>
          <h1 className="font-display text-4xl font-medium text-primary-700 sm:text-5xl">Track Your Order</h1>
          <div className="hairline-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-surface-500">
            Enter the tracking token from your order confirmation to follow your artwork's journey.
          </p>
        </div>

        {/* ——— Token form ——— */}
        <form onSubmit={handleSearch} className="mx-auto mb-14 flex max-w-xl gap-3" role="search">
          <label htmlFor="tracking-token" className="sr-only">
            Tracking token
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" aria-hidden="true" />
            <input
              id="tracking-token"
              placeholder="Paste your tracking token…"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              className="focus-ring w-full border border-surface-300 bg-cream py-3.5 pl-11 pr-4 text-sm text-primary-700 placeholder:text-surface-400"
            />
          </div>
          <button
            type="submit"
            disabled={!token.trim()}
            className="font-accent focus-ring shrink-0 bg-primary-700 px-7 text-2xs font-medium uppercase tracking-luxe text-surface-50 transition-colors duration-400 hover:bg-primary-600 disabled:opacity-40"
          >
            Track
          </button>
        </form>

        {isLoading && activeToken && (
          <div className="space-y-5" aria-busy="true">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        )}

        {isError && activeToken && (
          <ErrorState
            title="Order not found"
            message="No order matches this tracking token. Please double-check and try again."
            onRetry={refetch}
          />
        )}

        {order && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LUXE }}
            className="space-y-8"
          >
            {/* ——— Order summary card ——— */}
            <section className="border border-surface-200 bg-cream p-7 shadow-card sm:p-8" aria-label="Order details">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-accent mb-1 text-2xs font-medium uppercase tracking-luxe text-surface-400">
                    Order Number
                  </p>
                  <p className="font-display text-2xl font-medium text-primary-700">{order.order_number}</p>
                </div>
                <StatusBadge status={order.status} size="md" />
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-surface-200 pt-6 text-sm sm:grid-cols-4">
                <div>
                  <dt className="mb-0.5 text-2xs uppercase tracking-wider text-surface-400">Customer</dt>
                  <dd className="font-medium text-primary-700">{order.customer_name}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-2xs uppercase tracking-wider text-surface-400">Phone</dt>
                  <dd className="font-medium text-primary-700">{order.customer_phone}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-2xs uppercase tracking-wider text-surface-400">Total</dt>
                  <dd className="font-accent tracking-wider text-primary-700">{formatCurrency(order.total_amount)}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-2xs uppercase tracking-wider text-surface-400">Placed</dt>
                  <dd className="font-medium text-primary-700">{formatDateTime(order.created_at)}</dd>
                </div>
              </dl>
            </section>

            {/* ——— Journey timeline ——— */}
            <section className="border border-surface-200 bg-cream p-7 shadow-card sm:p-8" aria-label="Order progress">
              <h2 className="font-display mb-8 text-xl font-medium text-primary-700">The Journey</h2>

              {order.status === 'cancelled' ? (
                <div className="flex items-start gap-4 border border-danger-500/20 bg-danger-50 p-5">
                  <XCircle className="h-5 w-5 shrink-0 text-danger-600" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-danger-700">This order was cancelled</p>
                    {order.cancel_reason && (
                      <p className="mt-1 text-sm leading-relaxed text-danger-600">{order.cancel_reason}</p>
                    )}
                  </div>
                </div>
              ) : (
                <ol className="relative">
                  {ORDER_STATUS_FLOW.map((status, i) => {
                    const Icon = stepIcons[status];
                    const done = i < currentStepIndex;
                    const current = i === currentStepIndex;
                    const last = i === ORDER_STATUS_FLOW.length - 1;
                    return (
                      <li key={status} className={cn('relative flex gap-5', !last && 'pb-10')}>
                        {!last && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-px transition-colors duration-700',
                              done ? 'bg-accent-500' : 'bg-surface-200'
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-700',
                            done && 'border-accent-500 bg-accent-500 text-cream',
                            current && 'border-accent-600 bg-accent-50 text-accent-700 shadow-glow',
                            !done && !current && 'border-surface-200 bg-surface-50 text-surface-300'
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="pt-2">
                          <p
                            className={cn(
                              'font-accent text-2xs font-medium uppercase tracking-luxe',
                              current ? 'text-accent-700' : done ? 'text-primary-700' : 'text-surface-400'
                            )}
                          >
                            {ORDER_STATUS_LABELS[status]}
                            {current && <span className="ml-2 normal-case tracking-normal text-surface-400">— current stage</span>}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* ——— Items ——— */}
            {items && items.length > 0 && (
              <section className="border border-surface-200 bg-cream p-7 shadow-card sm:p-8" aria-label="Order items">
                <h2 className="font-display mb-6 text-xl font-medium text-primary-700">In This Order</h2>
                <ul className="divide-y divide-surface-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-4 py-3.5 text-sm">
                      <p className="text-surface-600">
                        {item.product_name}
                        <span className="ml-2 text-xs text-surface-400">× {item.quantity}</span>
                      </p>
                      <p className="font-accent shrink-0 tracking-wider text-primary-700">
                        {formatCurrency(item.total_price)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
