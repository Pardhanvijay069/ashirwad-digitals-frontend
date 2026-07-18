import { useCallback, useRef, useState } from 'react';
import type { ProductImage } from '@/types';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { EASE_LUXE } from '@/lib/motion';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

/**
 * Gallery with magnify-on-hover (desktop) and thumbnail rail.
 * The zoom follows the cursor; on touch/reduced-motion it stays still.
 */
export function ImageGallery({ images, productName, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  if (!images.length) {
    return (
      <div
        className={cn(
          'flex aspect-[4/5] flex-col items-center justify-center gap-3 border border-surface-200 bg-surface-100 text-surface-400',
          className
        )}
      >
        <span className="font-display text-5xl text-accent-500/30" aria-hidden="true">ॐ</span>
        <p className="font-accent text-2xs uppercase tracking-luxe">Artwork photography coming soon</p>
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const alt = activeImage?.alt_text || `${productName} — devotional artwork, view ${activeIndex + 1}`;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main frame */}
      <div
        ref={frameRef}
        onMouseEnter={() => !reduced && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={onMove}
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden border border-surface-200 bg-surface-100 shadow-card"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={activeImage?.image_url}
            alt={alt}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ transformOrigin: origin, transform: zoomed ? 'scale(1.7)' : 'scale(1)' }}
            loading="lazy"
            decoding="async"
          />
        </AnimatePresence>

        {/* Zoom hint */}
        <span
          className="font-accent pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 bg-cream/85 px-3 py-1.5 text-2xs uppercase tracking-wider text-surface-500 opacity-0 transition-opacity duration-400 group-hover:opacity-100 md:inline-flex"
          aria-hidden="true"
        >
          <ZoomIn className="h-3 w-3" />
          Hover to zoom
        </span>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 bg-cream/85 p-2.5 text-primary-700 shadow-soft backdrop-blur-sm transition-colors duration-400 hover:bg-accent-600 hover:text-cream"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 bg-cream/85 p-2.5 text-primary-700 shadow-soft backdrop-blur-sm transition-colors duration-400 hover:bg-accent-600 hover:text-cream"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail */}
      {images.length > 1 && (
        <div className="flex gap-3" role="tablist" aria-label={`${productName} images`}>
          {images.map((image, index) => (
            <button
              key={image.id}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'focus-ring h-20 w-16 overflow-hidden border transition-all duration-400',
                index === activeIndex
                  ? 'border-accent-600 shadow-glow'
                  : 'border-surface-200 opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={image.image_url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
