import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  /** show the ASHIRWAD wordmark next to the mark */
  withWordmark?: boolean;
  /** invert for dark surfaces (footer) */
  onDark?: boolean;
}

/**
 * Primary brand mark — a diya flame sheltered by a temple arch,
 * ringed in gold. Source of truth: /public/logo.svg
 */
export function Logo({ className, withWordmark = true, onDark = false }: LogoProps) {
  const ink = onDark ? 'var(--color-surface-50)' : 'var(--color-primary-700)';
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
      >
        <circle cx="32" cy="32" r="27" stroke="var(--color-accent-500)" strokeWidth="1.1" />
        <path d="M21 43 V31 Q21 19.5 32 13.5 Q43 19.5 43 31 V43" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18.5 43 H45.5" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 26 C35 30 36.5 32 36.5 34.6 A4.5 4.5 0 0 1 27.5 34.6 C27.5 32 29 30 32 26 Z" fill="var(--color-accent-600)" />
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-xl font-medium tracking-[0.28em] sm:text-2xl',
              onDark ? 'text-surface-50' : 'text-primary-700'
            )}
          >
            ASHIRWAD
          </span>
          <span className="font-accent mt-1 text-[9px] font-medium tracking-[0.62em] text-accent-600">
            DIGITALS
          </span>
        </span>
      )}
    </span>
  );
}

/** Decorative ॐ glyph used as a quiet ornament. */
export function OmSymbol({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('font-display select-none', className)}>
      ॐ
    </span>
  );
}
