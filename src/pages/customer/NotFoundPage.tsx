import { motion, useReducedMotion } from 'framer-motion';
import { CtaLink } from '@/components/shop/LuxeCta';
import { OmSymbol } from '@/components/shop/Logo';
import { EASE_LUXE } from '@/lib/motion';

export default function NotFoundPage() {
  const reduced = useReducedMotion();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
        className="text-center"
      >
        <OmSymbol className="mx-auto mb-8 h-10 w-10 text-accent-400" />
        <p className="font-display mb-4 text-7xl font-medium text-surface-200 sm:text-8xl" aria-hidden="true">
          404
        </p>
        <h1 className="font-display mb-4 text-3xl font-medium text-primary-700">This path leads elsewhere</h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-surface-500">
          The page you seek has moved on, as all things do. Return to stillness, or wander the gallery instead.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CtaLink to="/" variant="ink">
            Return Home
          </CtaLink>
          <CtaLink to="/products" variant="outline">
            Explore the Gallery
          </CtaLink>
        </div>
      </motion.div>
    </div>
  );
}
