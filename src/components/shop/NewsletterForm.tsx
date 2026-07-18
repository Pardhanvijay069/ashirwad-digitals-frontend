import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

/**
 * Newsletter signup — presentational (no backend endpoint exists).
 */
export function NewsletterForm({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Welcome to the circle. May your walls be blessed.');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex w-full max-w-md', className)}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          'focus-ring w-full rounded-l-sm border border-r-0 bg-transparent px-4 py-3 text-sm placeholder:text-surface-400',
          onDark
            ? 'border-surface-700 text-surface-100'
            : 'border-surface-300 text-primary-700'
        )}
      />
      <button
        type="submit"
        className="font-accent focus-ring shrink-0 rounded-r-sm bg-accent-600 px-6 py-3 text-2xs font-medium uppercase tracking-luxe text-cream transition-colors duration-400 hover:bg-accent-700"
      >
        Subscribe
      </button>
    </form>
  );
}
