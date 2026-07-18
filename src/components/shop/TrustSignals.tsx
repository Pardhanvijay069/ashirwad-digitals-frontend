import { ShieldCheck, Hand, Truck, RefreshCcw } from 'lucide-react';
import { RevealGroup, RevealItem } from './Reveal';
import { cn } from '@/utils/cn';

const SIGNALS = [
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Your details are protected end to end.' },
  { icon: Hand, title: 'Handcrafted Framing', desc: 'Each frame is finished by artisan hands.' },
  { icon: Truck, title: 'Insured Delivery', desc: 'Carefully packed, delivered across India.' },
  { icon: RefreshCcw, title: 'Blessed Guarantee', desc: 'Damaged in transit? We replace it, free.' },
] as const;

/** Quiet row of trust signals with gold iconography. */
export function TrustSignals({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <ul className={cn('grid grid-cols-2 gap-4', className)}>
        {SIGNALS.map(({ icon: Icon, title }) => (
          <li key={title} className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
            <span className="text-xs text-surface-500">{title}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <RevealGroup className={cn('grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4', className)} stagger={0.08}>
      {SIGNALS.map(({ icon: Icon, title, desc }) => (
        <RevealItem key={title} className="text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-accent-300 text-accent-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="font-accent mb-2 text-2xs font-medium uppercase tracking-luxe text-primary-700">
            {title}
          </h3>
          <p className="mx-auto max-w-[22ch] text-xs leading-relaxed text-surface-500">{desc}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
