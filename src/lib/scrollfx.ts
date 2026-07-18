/* ================================================================
   ASHIRWAD — GSAP + ScrollTrigger conventions
   Scroll-position-driven storytelling only (hero parallax, section
   reveals). Framer Motion owns state/gesture animation. Never both
   on one element. All hooks respect prefers-reduced-motion.
   ================================================================ */
import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Gentle vertical parallax, scrubbed to scroll position.
 * Apply to a hero artwork layer; keeps 400–700ms feel via scrub easing.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  options: { yPercent?: number; scrub?: number } = {}
) {
  const { yPercent = 12, scrub = 1 } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub },
      });
    }, el);
    return () => ctx.revert();
  }, [ref, yPercent, scrub]);
}

/**
 * Scroll-triggered section reveal: children marked with
 * `data-reveal` rise softly as the section enters the viewport.
 */
export function useSectionReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = el.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}

/**
 * Hero intro timeline: eyebrow → title lines → actions, on load.
 * Elements marked with `data-hero-seq` animate in document order.
 */
export function useHeroIntro(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = el.querySelectorAll('[data-hero-seq]');
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.14,
        delay: 0.15,
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}
