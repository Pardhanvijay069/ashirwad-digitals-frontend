import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Check, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { usePlaceOrderMutation } from '@/services/ordersApi';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { CtaLink, CtaButton } from '@/components/shop/LuxeCta';
import { TrustSignals } from '@/components/shop/TrustSignals';
import { checkoutFormSchema, type CheckoutFormData } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatCurrency';
import { FILE_UPLOAD } from '@/utils/constants';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { EASE_LUXE } from '@/lib/motion';
import { cn } from '@/utils/cn';

/* ————————————————————————————————————————————————
   Multi-step checkout (presentation only — one final submission to
   the existing place-order endpoint, payload unchanged).
   Steps: Shipping → Design & Notes → Review.
   ———————————————————————————————————————————————— */
const STEPS = [
  { id: 0, label: 'Shipping' },
  { id: 1, label: 'Design & Notes' },
  { id: 2, label: 'Review' },
] as const;

const STEP_FIELDS: (keyof CheckoutFormData)[][] = [
  ['customer_name', 'customer_phone', 'customer_email', 'address'],
  ['special_instructions'],
  [],
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, count, total, clear } = useCart();
  const { customer } = useAuth();
  const [placeOrder] = usePlaceOrderMutation();
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const promo = storage.get<string>(STORAGE_KEYS.PROMO, '');

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: 'onTouched',
    defaultValues: {
      customer_name: customer?.name || '',
      customer_email: customer?.email || '',
      customer_phone: '',
      address: '',
      special_instructions: '',
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent-300 text-accent-600">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="font-display mb-3 text-3xl font-medium text-primary-700">Nothing to check out yet</h1>
        <p className="mb-10 max-w-sm text-sm leading-relaxed text-surface-500">
          Add artworks to your cart before completing your order.
        </p>
        <CtaLink to="/products" variant="gold" size="lg">
          Explore the Gallery
        </CtaLink>
      </div>
    );
  }

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (customer?.id) formData.append('user_id', String(customer.id));
      formData.append('customer_name', data.customer_name);
      formData.append('customer_phone', data.customer_phone);
      if (data.customer_email) formData.append('customer_email', data.customer_email);
      formData.append('address', data.address);

      /* Promo codes ride along as an order note — the studio confirms
         eligible discounts during order review (no invented pricing). */
      const notes = [data.special_instructions, promo ? `Promo code: ${promo}` : '']
        .filter(Boolean)
        .join('\n');
      if (notes) formData.append('special_instructions', notes);

      const itemsJson = items.map((item) => ({
        product_id: item.product.id,
        qty: item.quantity,
        specification: item.specification || null,
      }));
      formData.append('items', JSON.stringify(itemsJson));

      if (designFiles[0]) formData.append('design_file', designFiles[0]);

      const result = await placeOrder(formData).unwrap();

      clear();
      storage.remove(STORAGE_KEYS.PROMO);
      navigate('/order-success', {
        state: {
          orderNumber: result.order_number,
          trackingToken: result.tracking_token,
          orderId: result.order_id,
        },
      });
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = getValues();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <Link
        to="/cart"
        className="focus-ring mb-8 inline-flex items-center gap-2 text-xs text-surface-400 transition-colors duration-400 hover:text-accent-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to cart
      </Link>

      <div className="mb-12">
        <p className="eyebrow mb-3">Almost Home</p>
        <h1 className="font-display text-3xl font-medium text-primary-700 sm:text-4xl">Checkout</h1>
      </div>

      {/* ——— Progress indicator ——— */}
      <nav aria-label="Checkout progress" className="mb-12">
        <ol className="flex items-center">
          {STEPS.map((s, i) => {
            const done = step > i;
            const current = step === i;
            return (
              <li key={s.id} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  aria-current={current ? 'step' : undefined}
                  className={cn('focus-ring group flex items-center gap-3', i > step && 'cursor-not-allowed')}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border font-accent text-2xs transition-colors duration-400',
                      done && 'border-accent-600 bg-accent-600 text-cream',
                      current && 'border-primary-700 bg-primary-700 text-surface-50',
                      !done && !current && 'border-surface-300 text-surface-400'
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'font-accent hidden text-2xs uppercase tracking-luxe sm:block',
                      current ? 'text-primary-700' : done ? 'text-accent-700' : 'text-surface-400'
                    )}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mx-4 h-px flex-1 transition-colors duration-700',
                      step > i ? 'bg-accent-500' : 'bg-surface-200'
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ——— Step 1 · Shipping ——— */}
              {step === 0 && (
                <motion.section
                  key="shipping"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                  aria-labelledby="step-shipping"
                  className="border border-surface-200 bg-cream p-7 shadow-card sm:p-9"
                >
                  <h2 id="step-shipping" className="font-display mb-7 text-2xl font-medium text-primary-700">
                    Where should the blessings arrive?
                  </h2>
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Full Name *"
                        placeholder="Your full name"
                        autoComplete="name"
                        error={errors.customer_name?.message}
                        {...register('customer_name')}
                      />
                      <Input
                        label="Phone Number *"
                        type="tel"
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        error={errors.customer_phone?.message}
                        {...register('customer_phone')}
                      />
                    </div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      error={errors.customer_email?.message}
                      {...register('customer_email')}
                    />
                    <Textarea
                      label="Delivery Address *"
                      placeholder="House / street, city, state, pincode"
                      autoComplete="street-address"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                  </div>
                </motion.section>
              )}

              {/* ——— Step 2 · Design & Notes ——— */}
              {step === 1 && (
                <motion.section
                  key="design"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                  aria-labelledby="step-design"
                  className="space-y-8"
                >
                  <div className="border border-surface-200 bg-cream p-7 shadow-card sm:p-9">
                    <h2 id="step-design" className="font-display mb-2 text-2xl font-medium text-primary-700">
                      Personalise your order
                    </h2>
                    <p className="mb-7 text-sm leading-relaxed text-surface-500">
                      Optional — share your own artwork or reference image, and any wishes for the artisans.
                    </p>
                    <FileUpload
                      accept={FILE_UPLOAD.DESIGN_ACCEPT}
                      maxSize={FILE_UPLOAD.DESIGN_MAX_SIZE}
                      maxFiles={1}
                      onChange={setDesignFiles}
                      value={designFiles}
                      hint="Accepted: PDF, PNG, JPG, JPEG · Max 20 MB"
                    />
                    <div className="mt-7">
                      <Textarea
                        label="Special Instructions"
                        placeholder="Framing wishes, occasion, delivery notes…"
                        error={errors.special_instructions?.message}
                        {...register('special_instructions')}
                      />
                    </div>
                  </div>
                </motion.section>
              )}

              {/* ——— Step 3 · Review ——— */}
              {step === 2 && (
                <motion.section
                  key="review"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                  aria-labelledby="step-review"
                  className="space-y-6"
                >
                  <div className="border border-surface-200 bg-cream p-7 shadow-card sm:p-9">
                    <h2 id="step-review" className="font-display mb-7 text-2xl font-medium text-primary-700">
                      A final look
                    </h2>

                    <div className="mb-7 grid gap-6 border-b border-surface-200 pb-7 sm:grid-cols-2">
                      <div>
                        <h3 className="font-accent mb-2 text-2xs font-medium uppercase tracking-luxe text-accent-700">
                          Delivering to
                        </h3>
                        <p className="text-sm font-medium text-primary-700">{values.customer_name}</p>
                        <p className="text-sm text-surface-500">{values.customer_phone}</p>
                        {values.customer_email && <p className="text-sm text-surface-500">{values.customer_email}</p>}
                        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-surface-500">
                          {values.address}
                        </p>
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="focus-ring mt-2 text-2xs uppercase tracking-wider text-accent-700 underline-offset-4 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div>
                        <h3 className="font-accent mb-2 text-2xs font-medium uppercase tracking-luxe text-accent-700">
                          Design & notes
                        </h3>
                        <p className="text-sm text-surface-500">
                          {designFiles[0] ? designFiles[0].name : 'No design file attached'}
                        </p>
                        {values.special_instructions && (
                          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-surface-500">
                            {values.special_instructions}
                          </p>
                        )}
                        {promo && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent-700">
                            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                            {promo}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="focus-ring mt-2 block text-2xs uppercase tracking-wider text-accent-700 underline-offset-4 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      {items.map((item) => {
                        const spec = item.specification as { size?: string; frame?: string } | undefined;
                        return (
                          <li key={item.product.id} className="flex items-center gap-4">
                            <span className="h-14 w-11 shrink-0 overflow-hidden border border-surface-200 bg-surface-100">
                              {item.product.images?.[0] && (
                                <img
                                  src={item.product.images[0].image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-primary-700">{item.product.name}</p>
                              <p className="text-xs text-surface-400">
                                Qty {item.quantity}
                                {(spec?.size || spec?.frame) && ` · ${[spec.size, spec.frame].filter(Boolean).join(' · ')}`}
                              </p>
                            </div>
                            <p className="font-accent text-sm tracking-wider text-primary-700">
                              {formatCurrency(item.product.base_price * item.quantity)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <p className="text-xs leading-relaxed text-surface-400">
                    Payment is arranged with our studio after order confirmation — cash, UPI or bank transfer.
                    Your order enters design review the moment it is placed.
                  </p>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ——— Step controls ——— */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <CtaButton type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </CtaButton>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 ? (
                <CtaButton type="button" variant="ink" onClick={nextStep}>
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CtaButton>
              ) : (
                <CtaButton type="submit" variant="gold" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Placing Order…' : 'Place Order'}
                </CtaButton>
              )}
            </div>
          </div>

          {/* ——— Summary rail ——— */}
          <aside className="lg:col-span-1" aria-label="Order summary">
            <div className="sticky top-28 border border-surface-200 bg-cream p-7 shadow-card">
              <h2 className="font-display mb-5 text-xl font-medium text-primary-700">
                {count} {count === 1 ? 'Piece' : 'Pieces'}
              </h2>
              <dl className="space-y-3 border-b border-surface-200 pb-5 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-3">
                    <dt className="truncate text-surface-500">
                      {item.product.name} × {item.quantity}
                    </dt>
                    <dd className="shrink-0 font-medium text-primary-700">
                      {formatCurrency(item.product.base_price * item.quantity)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-baseline justify-between py-5">
                <p className="font-display text-lg font-medium text-primary-700">Total</p>
                <p className="font-accent text-xl tracking-wider text-primary-700">{formatCurrency(total)}</p>
              </div>
              <div className="hairline-gold mb-5" />
              <TrustSignals compact />
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
