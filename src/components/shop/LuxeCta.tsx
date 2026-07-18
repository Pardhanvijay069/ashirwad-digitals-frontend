import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';

type Variant = 'gold' | 'ink' | 'outline' | 'ghost' | 'outline-light';

interface BaseProps {
  variant?: Variant;
  size?: 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

type CtaLinkProps = BaseProps & { to: string; onClick?: () => void };
type CtaButtonProps = BaseProps & {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-label'?: string;
};

const variantClasses: Record<Variant, string> = {
  gold: 'bg-accent-600 text-cream hover:bg-accent-700 border border-transparent',
  ink: 'bg-primary-700 text-surface-50 hover:bg-primary-600 border border-transparent',
  outline: 'border border-primary-300 text-primary-700 hover:border-accent-500 hover:text-accent-700 bg-transparent',
  'outline-light': 'border border-surface-50/40 text-surface-50 hover:border-accent-400 hover:text-accent-300 bg-transparent',
  ghost: 'text-primary-700 hover:text-accent-700 border border-transparent bg-transparent',
};

const sizeClasses = {
  md: 'px-7 py-3 text-2xs',
  lg: 'px-9 py-4 text-xs',
};

const base =
  'font-accent inline-flex items-center justify-center gap-2.5 rounded-sm uppercase tracking-luxe font-medium transition-colors duration-400 focus-ring disabled:opacity-50 disabled:pointer-events-none';

/** Wide-tracked luxury CTA — link form. */
export function CtaLink({ to, variant = 'ink', size = 'md', className, children, onClick }: CtaLinkProps) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="inline-block"
    >
      <Link to={to} onClick={onClick} className={cn(base, variantClasses[variant], sizeClasses[size], className)}>
        {children}
      </Link>
    </motion.span>
  );
}

/** Wide-tracked luxury CTA — button form. */
export function CtaButton({ variant = 'ink', size = 'md', className, children, ...props }: CtaButtonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      whileHover={reduced || props.disabled ? undefined : { y: -2 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
