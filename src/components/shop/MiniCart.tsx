import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ImageOff } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeMiniCart } from '@/store/slices/uiSlice';
import { formatCurrency } from '@/utils/formatCurrency';
import { drawerRight, backdropFade } from '@/lib/motion';
import { TrustSignals } from './TrustSignals';
import { OmSymbol } from './Logo';

/**
 * Slide-out mini-cart drawer with item summary, quantity controls
 * and gold checkout CTA.
 */
export function MiniCart() {
  const open = useAppSelector((s) => s.ui.miniCartOpen);
  const dispatch = useAppDispatch();
  const { items, count, total, update, remove } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => dispatch(closeMiniCart());

  // Close on route change & lock body scroll while open
  useEffect(() => {
    dispatch(closeMiniCart());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeMiniCart());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface-50 shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-5">
              <h2 className="font-display text-xl font-medium text-primary-700">
                Your Cart{' '}
                <span className="font-accent align-middle text-2xs tracking-luxe text-surface-500">
                  ({count} {count === 1 ? 'item' : 'items'})
                </span>
              </h2>
              <button
                onClick={close}
                className="focus-ring rounded-full p-2 text-surface-500 transition-colors duration-400 hover:text-primary-700"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <OmSymbol className="text-5xl text-accent-300" />
                <p className="font-display text-2xl text-primary-700">Your cart awaits its first blessing</p>
                <p className="text-sm leading-relaxed text-surface-500">
                  Explore divine artworks crafted for your sacred space.
                </p>
                <button
                  onClick={() => {
                    close();
                    navigate('/products');
                  }}
                  className="font-accent focus-ring mt-2 rounded-sm bg-primary-700 px-8 py-3.5 text-2xs font-medium uppercase tracking-luxe text-surface-50 transition-colors duration-400 hover:bg-primary-600"
                >
                  Browse the Collection
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 divide-y divide-surface-200 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          to={`/products/${item.product.id}`}
                          className="focus-ring block h-24 w-20 shrink-0 overflow-hidden bg-surface-100"
                        >
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0].image_url}
                              alt={item.product.images[0].alt_text || item.product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center text-surface-300">
                              <ImageOff className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/products/${item.product.id}`}
                              className="focus-ring font-display text-base font-medium leading-snug text-primary-700 hover:text-accent-700"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => remove(item.product.id)}
                              className="focus-ring p-1 text-surface-400 transition-colors duration-400 hover:text-danger-600"
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {typeof item.specification?.size === 'string' && (
                            <p className="mt-0.5 text-2xs text-surface-500">
                              {String(item.specification.size)}
                              {typeof item.specification?.frame === 'string'
                                ? ` · ${item.specification.frame}`
                                : ''}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="inline-flex items-center border border-surface-300">
                              <button
                                onClick={() => update(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="focus-ring flex h-7 w-7 items-center justify-center text-surface-500 transition-colors hover:text-primary-700 disabled:opacity-40"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-medium text-primary-700">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => update(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                                className="focus-ring flex h-7 w-7 items-center justify-center text-surface-500 transition-colors hover:text-primary-700 disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </span>
                            <span className="font-accent text-sm tracking-wider text-primary-700">
                              {formatCurrency(item.product.base_price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="border-t border-surface-200 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-accent text-2xs uppercase tracking-luxe text-surface-500">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl font-medium text-primary-700">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      close();
                      navigate('/checkout');
                    }}
                    className="font-accent focus-ring w-full rounded-sm bg-accent-600 py-4 text-xs font-medium uppercase tracking-luxe text-cream transition-colors duration-400 hover:bg-accent-700"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    to="/cart"
                    className="focus-ring mt-3 block text-center text-xs text-surface-500 underline-offset-4 hover:text-accent-700 hover:underline"
                  >
                    View full cart
                  </Link>
                  <TrustSignals compact className="mt-5" />
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
