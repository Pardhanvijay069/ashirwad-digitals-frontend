import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, Check, Ruler, Layers, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import { useGetProductByIdQuery } from '@/services/productsApi';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store';
import { openMiniCart } from '@/store/slices/uiSlice';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Accordion } from '@/components/shop/Accordion';
import { TrustSignals } from '@/components/shop/TrustSignals';
import { CtaButton } from '@/components/shop/LuxeCta';
import { inferDeity } from '@/utils/deity';
import { formatCurrency } from '@/utils/formatCurrency';
import { EASE_LUXE } from '@/lib/motion';
import { cn } from '@/utils/cn';

/* ————————————————————————————————————————————————
   Presentation-layer option swatches. Selections are stored in the
   cart item's `specification` (existing pass-through field) so they
   reach the order exactly as the backend already expects — pricing
   and stock logic remain untouched.
   ———————————————————————————————————————————————— */
const FRAME_STYLES = [
  { id: 'Unframed Print', label: 'Unframed', swatch: 'bg-surface-100 border-surface-300' },
  { id: 'Natural Oak', label: 'Natural Oak', swatch: 'bg-[#c8a878] border-[#a98d5f]' },
  { id: 'Charcoal Black', label: 'Charcoal', swatch: 'bg-primary-700 border-primary-900' },
  { id: 'Antique Gold', label: 'Antique Gold', swatch: 'bg-accent-500 border-accent-700' },
] as const;

function metadataOptions(meta: Record<string, unknown> | null | undefined, key: string): string[] | null {
  const v = meta?.[key];
  return Array.isArray(v) && v.every((x) => typeof x === 'string') && v.length > 0 ? (v as string[]) : null;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);
  const { data, isLoading, isError, refetch } = useGetProductByIdQuery(productId);
  const { add } = useCart();
  const dispatch = useAppDispatch();
  const reduced = useReducedMotion();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [frame, setFrame] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const product = data?.product;
  const deity = useMemo(() => (product ? inferDeity(product) : null), [product]);

  /* Optional admin-curated size list via metadata.sizes; falls back to
     the product's intrinsic dimensions as a single read-only format. */
  const sizeOptions = useMemo(() => {
    const metaSizes = metadataOptions(product?.metadata, 'sizes');
    if (metaSizes) return metaSizes;
    if (product?.width && product?.height) {
      return [`${product.width} × ${product.height} ${product.size_unit || 'in'}`];
    }
    return null;
  }, [product]);

  const frameChoices = useMemo(() => {
    const metaFrames = metadataOptions(product?.metadata, 'frames');
    if (metaFrames) {
      return metaFrames.map((f) => ({ id: f, label: f, swatch: 'bg-surface-100 border-surface-300' }));
    }
    return [...FRAME_STYLES];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const specification: Record<string, unknown> = {};
    if (size ?? sizeOptions?.[0]) specification.size = size ?? sizeOptions?.[0];
    if (frame) specification.frame = frame;
    add(product, quantity, Object.keys(specification).length ? specification : undefined);
    setAdded(true);
    toast.success(`${product.name} added to your cart`);
    dispatch(openMiniCart());
    setTimeout(() => setAdded(false), 2200);
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="Could not load this artwork." onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-busy="true">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const images = data?.images ?? [];
  const specs = [
    product.material && { icon: Layers, label: 'Material', value: product.material },
    product.finish && { icon: Paintbrush, label: 'Finish', value: product.finish },
    product.width &&
      product.height && {
        icon: Ruler,
        label: 'Dimensions',
        value: `${product.width} × ${product.height} ${product.size_unit || ''}`.trim(),
      },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  const accordionItems = [
    {
      title: 'About this Artwork',
      content: (
        <div className="space-y-4">
          <p>{product.description || 'A devotional artwork rendered with archival inks on museum-grade media, made to order in our studio.'}</p>
          {specs.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="border border-surface-200 bg-cream p-3.5">
                  <dt className="mb-1 flex items-center gap-1.5 text-2xs uppercase tracking-wider text-surface-400">
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-primary-700">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ),
    },
    {
      title: 'Craft & Materials',
      content: (
        <p>
          Printed with pigment inks rated for 100+ years of colour fidelity. Frames are hand-finished hardwood, fitted
          with art-grade acrylic glazing. Every piece passes a two-stage devotional quality check before it leaves the
          studio — SKU {product.sku}.
        </p>
      ),
    },
    {
      title: 'Shipping & Care',
      content: (
        <div className="space-y-3">
          <p>
            Dispatched in 2–4 working days in protective corner-guarded packaging, insured door-to-door across India.
            Track your order any time with the token you receive at checkout.
          </p>
          <p>Dust gently with a dry microfibre cloth. Keep away from direct sunlight and moisture to preserve the inks.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Gallery', path: '/products' },
            ...(deity ? [{ label: deity.name, path: `/products?deity=${deity.slug}` }] : []),
            { label: product.name },
          ]}
          className="mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ——— Gallery ——— */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LUXE }}
          >
            <ImageGallery images={images} productName={product.name} />
          </motion.div>

          {/* ——— Details ——— */}
          <motion.article
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LUXE, delay: reduced ? 0 : 0.1 }}
            className="flex flex-col"
          >
            {deity && (
              <p className="font-accent mb-3 text-2xs uppercase tracking-luxe text-accent-600">{deity.salutation}</p>
            )}
            <h1 className="font-display text-3xl font-medium leading-tight text-primary-700 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Spiritual quote */}
            {deity && (
              <blockquote className="mt-5 border-l-2 border-accent-400 pl-4 font-display text-lg italic leading-relaxed text-surface-500">
                “{deity.quote}”
              </blockquote>
            )}

            <div className="hairline-gold my-7 w-full" />

            <div className="flex items-baseline justify-between gap-4">
              <p className="font-accent text-2xl tracking-wider text-primary-700">
                {formatCurrency(product.base_price)}
                <span className="ml-2 text-xs text-surface-400">per {product.unit}</span>
              </p>
              {product.is_in_stock ? (
                <p className="font-accent inline-flex items-center gap-2 text-2xs uppercase tracking-wider text-success-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500" aria-hidden="true" />
                  In stock · {product.stock_quantity} available
                </p>
              ) : (
                <p className="font-accent inline-flex items-center gap-2 text-2xs uppercase tracking-wider text-danger-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger-500" aria-hidden="true" />
                  Out of stock
                </p>
              )}
            </div>

            {/* ——— Size selector ——— */}
            {sizeOptions && (
              <fieldset className="mt-8">
                <legend className="font-accent mb-3 text-2xs font-medium uppercase tracking-luxe text-primary-700">
                  Size
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {sizeOptions.map((opt, i) => {
                    const selected = (size ?? sizeOptions[0]) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSize(opt)}
                        aria-pressed={selected}
                        className={cn(
                          'focus-ring border px-5 py-3 text-sm transition-colors duration-400',
                          selected
                            ? 'border-primary-700 bg-primary-700 text-surface-50'
                            : 'border-surface-300 text-surface-600 hover:border-accent-500 hover:text-accent-700',
                          i === 0 && sizeOptions.length === 1 && 'cursor-default'
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* ——— Frame selector (visual swatches) ——— */}
            <fieldset className="mt-7">
              <legend className="font-accent mb-3 text-2xs font-medium uppercase tracking-luxe text-primary-700">
                Frame Preference
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {frameChoices.map((f) => {
                  const selected = frame === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrame(selected ? null : f.id)}
                      aria-pressed={selected}
                      className={cn(
                        'focus-ring group inline-flex items-center gap-2.5 border px-4 py-2.5 text-sm transition-colors duration-400',
                        selected
                          ? 'border-accent-600 bg-accent-50 text-accent-800'
                          : 'border-surface-300 text-surface-600 hover:border-accent-500'
                      )}
                    >
                      <span className={cn('h-4 w-4 rounded-full border', f.swatch)} aria-hidden="true" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-surface-400">
                Preferences travel with your order — our artisans confirm every detail during design review.
              </p>
            </fieldset>

            {/* ——— Add to cart ——— */}
            <div className="mt-9 hidden items-stretch gap-4 border-t border-surface-200 pt-8 lg:flex">
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock_quantity} />
              <CtaButton
                variant="gold"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.is_in_stock}
                aria-label={`Add ${product.name} to cart`}
              >
                {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
                {added ? 'Added to Cart' : product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
              </CtaButton>
            </div>

            <TrustSignals compact className="mt-8" />
          </motion.article>
        </div>

        {/* ——— Accordion ——— */}
        <div className="mx-auto mt-16 max-w-3xl lg:mt-24">
          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* ——— Floating add-to-cart bar (mobile) ——— */}
      <motion.div
        initial={reduced ? false : { y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: EASE_LUXE, delay: 0.3 }}
        className="glass fixed inset-x-0 bottom-0 z-40 border-t border-surface-200 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-medium text-primary-700">{product.name}</p>
            <p className="font-accent text-sm tracking-wider text-accent-700">{formatCurrency(product.base_price)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock_quantity} className="scale-90" />
            <CtaButton
              variant="gold"
              onClick={handleAddToCart}
              disabled={!product.is_in_stock}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
              {added ? 'Added' : 'Add'}
            </CtaButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
