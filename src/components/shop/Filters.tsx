import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@/types';
import { DEITIES } from '@/utils/constants';
import { inferDeity } from '@/utils/deity';
import { cn } from '@/utils/cn';
import { backdropFade, drawerRight, panelDrop } from '@/lib/motion';

/* ================================================================
   Client-side filter model — the backend exposes only a category
   param, so deity / price / size / frame refinement happens here.
   ================================================================ */

export interface FilterState {
  deity: string | null; // deity slug
  category: string | null;
  price: string | null; // "min-max" | "min-"
  size: string | null; // small | medium | large
  frame: string | null; // material value
  q: string | null;
  sort: string; // featured | price-asc | price-desc | name
}

export const PRICE_BUCKETS = [
  { id: '0-499', label: 'Under ₹500' },
  { id: '500-1499', label: '₹500 – ₹1,499' },
  { id: '1500-4999', label: '₹1,500 – ₹4,999' },
  { id: '5000-', label: '₹5,000 & above' },
] as const;

export const SIZE_BUCKETS = [
  { id: 'small', label: 'Small · under 12″' },
  { id: 'medium', label: 'Medium · 12–24″' },
  { id: 'large', label: 'Large · over 24″' },
] as const;

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · Low to High' },
  { id: 'price-desc', label: 'Price · High to Low' },
  { id: 'name', label: 'Name · A to Z' },
] as const;

function sizeBucket(product: Product): string | null {
  if (!product.width || !product.height) return null;
  const longest = Math.max(product.width, product.height);
  // treat cm as inches/2.54 when specified
  const inches = product.size_unit?.toLowerCase().startsWith('cm') ? longest / 2.54 : longest;
  if (inches < 12) return 'small';
  if (inches <= 24) return 'medium';
  return 'large';
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  let list = [...products];

  if (f.category) list = list.filter((p) => p.category === f.category);

  if (f.deity) {
    list = list.filter((p) => inferDeity(p)?.slug === f.deity);
  }

  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((p) =>
      `${p.name} ${p.category} ${p.description ?? ''} ${inferDeity(p)?.name ?? ''}`.toLowerCase().includes(q)
    );
  }

  if (f.price) {
    const [minS, maxS] = f.price.split('-');
    const min = Number(minS) || 0;
    const max = maxS ? Number(maxS) : Infinity;
    list = list.filter((p) => p.base_price >= min && p.base_price <= max);
  }

  if (f.size) list = list.filter((p) => sizeBucket(p) === f.size);

  if (f.frame) list = list.filter((p) => (p.material ?? '').toLowerCase() === f.frame!.toLowerCase());

  switch (f.sort) {
    case 'price-asc':
      list.sort((a, b) => a.base_price - b.base_price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.base_price - a.base_price);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return list;
}

/** Frame/material options present in the loaded catalogue. */
export function frameOptions(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.material).filter((m): m is string => !!m))).sort();
}

export function activeFilterCount(f: FilterState): number {
  return [f.deity, f.category, f.price, f.size, f.frame].filter(Boolean).length;
}

/* ================================================================
   Elegant dropdown (single-select) used in the desktop filter bar
   ================================================================ */

interface DropdownProps {
  label: string;
  value: string | null;
  options: { id: string; label: string }[];
  onChange: (id: string | null) => void;
  align?: 'left' | 'right';
}

export function FilterDropdown({ label, value, options, onChange, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.id === value);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'font-accent focus-ring inline-flex items-center gap-2 border-b py-2 text-2xs font-medium uppercase tracking-luxe transition-colors duration-400',
          active
            ? 'border-accent-500 text-accent-700'
            : 'border-transparent text-primary-600 hover:text-accent-700'
        )}
      >
        {active ? active.label : label}
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-400', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={panelDrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-label={label}
            className={cn(
              'absolute z-30 mt-2 max-h-80 w-60 overflow-y-auto border border-surface-200 bg-cream py-2 shadow-elevated',
              align === 'right' && 'right-0'
            )}
          >
            {value && (
              <li>
                <button
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className="focus-ring font-accent block w-full px-4 py-2 text-left text-2xs uppercase tracking-wider text-surface-400 hover:text-danger-600"
                >
                  Clear — {label}
                </button>
              </li>
            )}
            {options.map((opt) => (
              <li key={opt.id}>
                <button
                  role="option"
                  aria-selected={opt.id === value}
                  onClick={() => {
                    onChange(opt.id === value ? null : opt.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'focus-ring block w-full px-4 py-2.5 text-left text-sm transition-colors duration-200',
                    opt.id === value
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-primary-700'
                  )}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   Mobile filter drawer
   ================================================================ */

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | null) => void;
  frames: string[];
  categories: string[];
  resultCount: number;
  onClearAll: () => void;
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  setFilter,
  frames,
  categories,
  resultCount,
  onClearAll,
}: FilterDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const groups: { key: keyof FilterState; title: string; options: { id: string; label: string }[] }[] = useMemo(
    () => [
      { key: 'deity', title: 'Deity', options: DEITIES.map((d) => ({ id: d.slug, label: d.name })) },
      { key: 'category', title: 'Collection', options: categories.map((c) => ({ id: c, label: c })) },
      { key: 'size', title: 'Size', options: [...SIZE_BUCKETS] },
      { key: 'frame', title: 'Frame / Material', options: frames.map((f) => ({ id: f, label: f })) },
      { key: 'price', title: 'Price', options: [...PRICE_BUCKETS] },
    ],
    [categories, frames]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Filter artworks"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-surface-50 shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-5">
              <h2 className="font-display inline-flex items-center gap-2.5 text-xl font-medium text-primary-700">
                <SlidersHorizontal className="h-4 w-4 text-accent-600" aria-hidden="true" />
                Refine
              </h2>
              <button onClick={onClose} className="focus-ring p-2 text-surface-500" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2">
              {groups
                .filter((g) => g.options.length > 0)
                .map((group) => (
                  <fieldset key={group.key} className="border-b border-surface-200 py-5">
                    <legend className="font-accent mb-3 text-2xs font-medium uppercase tracking-luxe text-primary-700">
                      {group.title}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const selected = filters[group.key] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setFilter(group.key, selected ? null : opt.id)}
                            aria-pressed={selected}
                            className={cn(
                              'focus-ring rounded-full border px-4 py-2 text-xs transition-colors duration-400',
                              selected
                                ? 'border-accent-600 bg-accent-600 text-cream'
                                : 'border-surface-300 text-surface-600 hover:border-accent-500 hover:text-accent-700'
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
            </div>

            <div className="flex items-center gap-3 border-t border-surface-200 px-6 py-5">
              <button
                onClick={onClearAll}
                className="font-accent focus-ring flex-1 rounded-sm border border-surface-300 py-3.5 text-2xs font-medium uppercase tracking-luxe text-surface-600 transition-colors duration-400 hover:border-danger-500 hover:text-danger-600"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="font-accent focus-ring flex-1 rounded-sm bg-primary-700 py-3.5 text-2xs font-medium uppercase tracking-luxe text-surface-50 transition-colors duration-400 hover:bg-primary-600"
              >
                Show {resultCount} {resultCount === 1 ? 'Piece' : 'Pieces'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
