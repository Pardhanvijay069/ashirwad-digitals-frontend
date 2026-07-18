import { Link, useLocation } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { CtaLink } from '@/components/shop/LuxeCta';
import { OmSymbol } from '@/components/shop/Logo';
import { EASE_LUXE } from '@/lib/motion';

interface OrderSuccessState {
  orderNumber: string;
  trackingToken: string;
  orderId: number;
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;
  const reduced = useReducedMotion();

  const copyToken = () => {
    if (!state?.trackingToken) return;
    navigator.clipboard
      .writeText(state.trackingToken)
      .then(() => toast.success('Tracking token copied'))
      .catch(() => toast.error('Could not copy — please select it manually.'));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
      >
        <motion.span
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: reduced ? 0 : 0.15 }}
          className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-accent-400 bg-accent-50 text-accent-700 shadow-glow"
        >
          <Check className="h-9 w-9" aria-hidden="true" />
        </motion.span>

        <p className="eyebrow mb-4">Shubh — It Is Done</p>
        <h1 className="font-display text-4xl font-medium leading-tight text-primary-700 sm:text-5xl">
          Your order is placed
        </h1>
        <div className="hairline-gold mx-auto mt-8 w-24" />
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-surface-500">
          Thank you for inviting the divine into your home. Our artisans will now review your order with care —
          you can follow every step of its journey.
        </p>

        {state ? (
          <div className="mx-auto mt-12 max-w-md border border-surface-200 bg-cream p-8 text-left shadow-card">
            <dl className="space-y-6">
              <div>
                <dt className="font-accent mb-1 text-2xs font-medium uppercase tracking-luxe text-surface-400">
                  Order Number
                </dt>
                <dd className="font-display text-2xl font-medium text-primary-700">{state.orderNumber}</dd>
              </div>
              <div>
                <dt className="font-accent mb-1 text-2xs font-medium uppercase tracking-luxe text-surface-400">
                  Tracking Token
                </dt>
                <dd className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate border border-surface-200 bg-surface-50 px-3 py-2 text-xs text-surface-600">
                    {state.trackingToken}
                  </code>
                  <button
                    onClick={copyToken}
                    className="focus-ring shrink-0 border border-surface-300 p-2.5 text-surface-500 transition-colors duration-400 hover:border-accent-500 hover:text-accent-700"
                    aria-label="Copy tracking token"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-surface-400">
              Keep this token safe — it lets you track your order without an account. We will also confirm payment
              details with you shortly.
            </p>
          </div>
        ) : (
          <p className="mt-10 text-sm text-surface-400">
            Looking for an order?{' '}
            <Link to="/track" className="focus-ring text-accent-700 underline-offset-4 hover:underline">
              Track it here.
            </Link>
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {state && (
            <CtaLink to={`/track?token=${state.trackingToken}`} variant="gold" size="lg">
              Track Your Order
            </CtaLink>
          )}
          <CtaLink to="/products" variant="outline" size="lg">
            Continue Exploring
          </CtaLink>
        </div>

        <OmSymbol className="mx-auto mt-16 h-8 w-8 text-accent-400/60" />
      </motion.div>
    </div>
  );
}
