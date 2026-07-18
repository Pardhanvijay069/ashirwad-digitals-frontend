import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Tag, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { TrustSignals } from '@/components/shop/TrustSignals';
import { CtaLink, CtaButton } from '@/components/shop/LuxeCta';
import { inferDeity } from '@/utils/deity';
import { formatCurrency } from '@/utils/formatCurrency';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { EASE_LUXE } from '@/lib/motion';

/**
 * Full cart page — gallery-style line items, order summary with promo
 * note and trust badges. Promo codes are saved locally and attached to
 * the order notes at checkout; discounts are confirmed by the studio
 * (no pricing logic is invented on the frontend).
 */
export default function CartPage() {
  const { items, count, total, update, remove, clear } = useCart();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [promo, setPromo] = useState(storage.get<string>(STORAGE_KEYS.PROMO, ''));
  const [promoApplied, setPromoApplied] = useState(Boolean(storage.get<string>(STORAGE_KEYS.PROMO, '')));

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    storage.set(STORAGE_KEYS.PROMO, code);
    setPromo(code);
    setPromoApplied(true);
    toast.success(`Code ${code} saved — it will accompany your order for confirmation.`);
  };

  const removePromo = () => {
    storage.remove(STORAGE_KEYS.PROMO);
    setPromo('');
    setPromoApplied(false);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent-300 text-accent-600">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="font-display mb-3 text-3xl font-medium text-primary-700">Your cart awaits its first blessing</h1>
        <p className="mb-10 max-w-sm text-sm leading-relaxed text-surface-500">
          Explore the gallery and bring home a piece of the divine.
        </p>
        <CtaLink to="/products" variant="gold" size="lg">
          Explore the Gallery
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </CtaLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Your Selection</p>
            <h1 className="font-display text-3xl font-medium text-primary-700 sm:text-4xl">
              Shopping Cart
              <span className="ml-3 font-accent text-sm tracking-wider text-surface-400">
                {count} {count === 1 ? 'piece' : 'pieces'}
              </span>
            </h1>
          </div>
          <button
            onClick={clear}
            className="font-accent focus-ring text-2xs uppercase tracking-wider text-surface-400 underline-offset-4 transition-colors duration-400 hover:text-danger-600 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          {/* ——— Line items ——— */}
          <ul className="lg:col-span-2">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const deity = inferDeity(item.product);
                const image = item.product.images?.[0];
                const spec = item.specification as { size?: string; frame?: string } | undefined;
                return (
                  <motion.li
                    key={item.product.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: EASE_LUXE }}
                    className="flex gap-5 border-b border-surface-200 py-7 first:border-t sm:gap-7"
                  >
                    {/* Artwork */}
                    <Link
                      to={`/products/${item.product.id}`}
                      className="focus-ring block h-32 w-24 shrink-0 overflow-hidden border border-surface-200 bg-surface-100 sm:h-36 sm:w-28"
                      aria-label={`View ${item.product.name}`}
                    >
                      {image ? (
                        <img
                          src={image.image_url}
                          alt={image.alt_text || `${deity ? `${deity.name} — ` : ''}${item.product.name}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-surface-300">
                          <ImageOff className="h-6 w-6" aria-hidden="true" />
                        </span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {deity && <p className="eyebrow mb-1 !text-2xs">{deity.name}</p>}
                          <Link
                            to={`/products/${item.product.id}`}
                            className="focus-ring font-display text-lg font-medium leading-snug text-primary-700 transition-colors duration-400 hover:text-accent-700"
                          >
                            {item.product.name}
                          </Link>
                          {(spec?.size || spec?.frame) && (
                            <p className="mt-1.5 text-xs text-surface-400">
                              {[spec.size, spec.frame].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="focus-ring shrink-0 p-1.5 text-surface-300 transition-colors duration-400 hover:text-danger-600"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(q) => update(item.product.id, q)}
                          max={item.product.stock_quantity}
                        />
                        <p className="font-accent text-base tracking-wider text-primary-700">
                          {formatCurrency(item.product.base_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* ——— Order summary ——— */}
          <aside className="lg:col-span-1" aria-label="Order summary">
            <div className="sticky top-28 border border-surface-200 bg-cream p-7 shadow-card sm:p-8">
              <h2 className="font-display mb-6 text-2xl font-medium text-primary-700">Order Summary</h2>

              <dl className="space-y-3.5 border-b border-surface-200 pb-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-surface-500">Subtotal · {count} {count === 1 ? 'piece' : 'pieces'}</dt>
                  <dd className="font-medium text-primary-700">{formatCurrency(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-surface-500">Delivery</dt>
                  <dd className="text-xs text-surface-400">Confirmed with your order</dd>
                </div>
              </dl>

              {/* Promo code */}
              <div className="border-b border-surface-200 py-6">
                {promoApplied ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 text-sm text-accent-700">
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      Code <span className="font-accent tracking-wider">{promo}</span> saved
                    </p>
                    <button
                      onClick={removePromo}
                      className="focus-ring text-2xs uppercase tracking-wider text-surface-400 hover:text-danger-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      applyPromo();
                    }}
                    className="flex gap-2"
                  >
                    <label htmlFor="promo" className="sr-only">
                      Promo code
                    </label>
                    <input
                      id="promo"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Promo code"
                      autoComplete="off"
                      className="focus-ring w-full border border-surface-300 bg-surface-50 px-3.5 py-2.5 text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-surface-400"
                    />
                    <button
                      type="submit"
                      className="font-accent focus-ring shrink-0 border border-primary-700 px-4 text-2xs font-medium uppercase tracking-wider text-primary-700 transition-colors duration-400 hover:bg-primary-700 hover:text-surface-50"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-baseline justify-between py-6">
                <p className="font-display text-lg font-medium text-primary-700">Total</p>
                <p className="font-accent text-xl tracking-wider text-primary-700">{formatCurrency(total)}</p>
              </div>

              <CtaButton variant="gold" size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CtaButton>
              <Link
                to="/products"
                className="focus-ring mt-4 block text-center text-xs text-surface-400 underline-offset-4 transition-colors duration-400 hover:text-accent-700 hover:underline"
              >
                Continue exploring the gallery
              </Link>

              <div className="hairline-gold my-6" />
              <TrustSignals compact />
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
