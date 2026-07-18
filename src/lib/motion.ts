/* ================================================================
   ASHIRWAD — Framer Motion conventions
   Subtle & slow: 400–700ms, gentle fades/lifts, no bounce.
   GSAP handles scroll-position work (see scrollfx.ts) — never
   animate the same element with both.
   ================================================================ */
import type { Variants, Transition } from 'framer-motion';

/** House easing — mirrors --ease-luxe token. */
export const EASE_LUXE = [0.25, 0.1, 0.25, 1] as const;

export const DUR = { fast: 0.2, normal: 0.4, slow: 0.7 } as const;

export const transitionLuxe: Transition = { duration: DUR.normal, ease: EASE_LUXE };
export const transitionSlow: Transition = { duration: DUR.slow, ease: EASE_LUXE };

/** Gentle rise — the default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitionSlow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionSlow },
};

/** Parent wrapper that staggers its children's `fadeUp`/`fadeIn`. */
export const staggerChildren = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Viewport defaults for whileInView reveals. */
export const viewportOnce = { once: true, margin: '-80px' } as const;

/** Drawer slide-in from the right (mini-cart, mobile filters). */
export const drawerRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
  exit: { x: '100%', transition: { duration: DUR.normal, ease: EASE_LUXE } },
};

/** Drawer slide-in from the left (mobile navigation). */
export const drawerLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
  exit: { x: '-100%', transition: { duration: DUR.normal, ease: EASE_LUXE } },
};

/** Backdrop fade for overlays. */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.normal } },
  exit: { opacity: 0, transition: { duration: DUR.fast } },
};

/** Soft dropdown/mega-menu panel. */
export const panelDrop: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transitionLuxe },
  exit: { opacity: 0, y: 8, transition: { duration: DUR.fast, ease: EASE_LUXE } },
};

/** Route/page transition. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: transitionSlow },
  exit: { opacity: 0, transition: { duration: DUR.fast } },
};
