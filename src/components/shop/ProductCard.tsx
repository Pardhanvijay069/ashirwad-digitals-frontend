import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store';
import { openMiniCart } from '@/store/slices/uiSlice';
import { inferDeity, productRating } from '@/utils/deity';
import { formatCurrency } from '@/utils/formatCurrency';
import { RatingStars } from './RatingStars';
import { cn } from '@/utils/cn';

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * Modular product card — artwork, deity eyebrow, serif title,
 * rating, price, quiet quick-add. Subtle zoom on hover.
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const { add } = useCart();
  const dispatch = useAppDispatch();
  const reduced = useReducedMotion();
  const deity = inferDeity(product);
  const rating = productRating(product);
  const image = product.images?.[0];
  const altText =
    image?.alt_text ||
    `${deity ? `${deity.name} — ` : ''}${product.name}, premium ${product.category.toLowerCase()}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, 1);
    toast.success(`${product.name} added to your cart`);
    dispatch(openMiniCart());
  };

  return (
    <motion.article
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('group relative flex h-full flex-col bg-cream shadow-soft', className)}
    >
      <Link
        to={`/products/${product.id}`}
        className="focus-ring flex h-full flex-col"
        aria-label={`View ${product.name}`}
      >
        {/* Artwork */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-100">
          {image ? (
            <img
              src={image.image_url}
              alt={altText}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-surface-300">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
              <span className="font-accent text-2xs uppercase tracking-luxe">Artwork coming soon</span>
            </div>
          )}

          {/* Stock veil */}
          {!product.is_in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-900/40">
              <span className="font-accent bg-cream px-4 py-2 text-2xs uppercase tracking-luxe text-primary-700">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick add — rises in on hover (desktop), always tappable on touch */}
          {product.is_in_stock && (
            <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 transition-all duration-400 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <button
                onClick={handleQuickAdd}
                className="font-accent focus-ring glass flex w-full items-center justify-center gap-2 rounded-sm py-3 text-2xs font-medium uppercase tracking-luxe text-primary-700 transition-colors duration-400 hover:bg-accent-600 hover:text-cream"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-1.5 px-4 py-5 text-center">
          <p className="eyebrow">{deity?.name ?? product.category}</p>
          <h3 className="font-display text-lg font-medium leading-snug text-primary-700 transition-colors duration-400 group-hover:text-accent-700">
            {product.name}
          </h3>
          {rating !== null && <RatingStars rating={rating} className="justify-center" />}
          <p className="font-accent mt-auto pt-2 text-sm tracking-wider text-primary-600">
            {formatCurrency(product.base_price)}
            <span className="ml-1 text-2xs text-surface-400">/ {product.unit}</span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
