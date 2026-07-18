import { motion, useReducedMotion } from 'framer-motion';
import { ShieldOff } from 'lucide-react';
import { CtaLink } from '@/components/shop/LuxeCta';
import { EASE_LUXE } from '@/lib/motion';

export default function Error403Page() {
  const reduced = useReducedMotion();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXE }}
        className="text-center"
      >
        <p className="font-display mb-6 text-7xl font-medium text-surface-200" aria-hidden="true">403</p>
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-accent-300 text-accent-600">
          <ShieldOff className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="font-display mb-3 text-3xl font-medium text-primary-700">This door is not yours to open</h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-surface-500">
          You do not have permission to view this page. If you believe this is a mistake, please contact the studio.
        </p>
        <CtaLink to="/" variant="ink">Return Home</CtaLink>
      </motion.div>
    </div>
  );
}
