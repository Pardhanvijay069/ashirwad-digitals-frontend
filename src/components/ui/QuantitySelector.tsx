import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 999, className }: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border border-surface-300 bg-cream transition-colors duration-400 focus-within:border-accent-500',
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="focus-ring flex h-11 w-11 items-center justify-center text-surface-500 transition-colors duration-400 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          if (!isNaN(num) && num >= min && num <= max) onChange(num);
        }}
        className="font-accent h-11 w-12 border-x border-surface-200 bg-transparent text-center text-sm tracking-wider text-primary-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="focus-ring flex h-11 w-11 items-center justify-center text-surface-500 transition-colors duration-400 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
