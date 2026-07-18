import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
  className?: string;
}

/**
 * House section header: gold eyebrow → serif title → stone description,
 * finished with a thin gold hairline.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  onDark = false,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-12 sm:mb-16', centered && 'text-center', className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2
        className={cn(
          'font-display text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl',
          onDark ? 'text-surface-50' : 'text-primary-700'
        )}
      >
        {title}
      </h2>
      <div className={cn('hairline-gold mt-6 w-24', centered && 'mx-auto')} />
      {description && (
        <p
          className={cn(
            'mt-6 max-w-2xl text-base leading-relaxed',
            onDark ? 'text-surface-300' : 'text-surface-500',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
