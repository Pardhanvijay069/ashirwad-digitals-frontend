import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingStarsProps {
  rating: number; // 0–5
  className?: string;
  showValue?: boolean;
}

export function RatingStars({ rating, className, showValue = false }: RatingStarsProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return <Star key={i} className="h-3.5 w-3.5 fill-accent-500 text-accent-500" aria-hidden="true" />;
        }
        if (i === full && half) {
          return (
            <span key={i} className="relative inline-flex" aria-hidden="true">
              <Star className="h-3.5 w-3.5 text-surface-300" />
              <StarHalf className="absolute inset-0 h-3.5 w-3.5 fill-accent-500 text-accent-500" />
            </span>
          );
        }
        return <Star key={i} className="h-3.5 w-3.5 text-surface-300" aria-hidden="true" />;
      })}
      {showValue && (
        <span className="font-accent ml-1.5 text-2xs tracking-wider text-surface-500">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
