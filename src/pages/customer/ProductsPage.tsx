import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, X, ImageOff } from 'lucide-react';
import { useGetProductsQuery } from '@/services/productsApi';
import { ProductCard } from '@/components/shop/ProductCard';
import {
  applyFilters,
  activeFilterCount,
  frameOptions,
  FilterDropdown,
  FilterDrawer,
  PRICE_BUCKETS,
  SIZE_BUCKETS,
  SORT_OPTIONS,
  type FilterState,
} from '@/components/shop/Filters';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { DEITIES, PRODUCT_CATEGORIES } from '@/utils/constants';
import { deityBySlug } from '@/utils/deity';
import { EASE_LUXE } from '@/lib/motion';
import { cn } from '@/utils/cn';

/**
 * Collection / gallery listing — hero banner, persistent filter bar
 * (deity · collection · size · frame · price), sorted modular grid.
 * The backend exposes only a category param, so all refinement is
 * client-side over the active catalogue (no API changes).
 */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduced = useReducedMotion();

  const filters: FilterState = useMemo(
    () => ({
      deity: searchParams.get('deity'),
      category: searchParams.get('category'),
      price: searchParams.get('price'),
      size: searchParams.get('size'),
      frame: searchParams.get('frame'),
      q: searchParams.get('q'),
      sort: searchParams.get('sort') ?? 'featured',
    }),
    [searchParams]
  );

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === '' || (key === 'sort' && value === 'featured')) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { preventScrollReset: true }
      );
    },
    [setSearchParams]
  );

  const clearAll = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      ['deity', 'category', 'price', 'size', 'frame', 'q'].forEach((k) => next.delete(k));
      return next;
    });
  }, [setSearchParams]);

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery({ active_only: true });

  const catalogue = useMemo(() => products ?? [], [products]);
  const categories = useMemo(() => {
    const fromData = Array.from(new Set(catalogue.map((p) => p.category)));
    return fromData.length > 0 ? fromData.sort() : PRODUCT_CATEGORIES.filter((c) => c !== 'All');
  }, [catalogue]);
  const frames = useMemo(() => frameOptions(catalogue), [catalogue]);
  const filtered = useMemo(() => applyFilters(catalogue, filters), [catalogue, filters]);

  const deity = deityBySlug(filters.deity);
  const activeCount = activeFilterCount(filters);

  /* Hero copy adapts to the selected collection. */
  const heroTitle = deity ? `${deity.name} Collection` : filters.category ?? 'The Gallery';
  const heroSub = deity
    ? deity.quote
    : filters.category
      ? 'Museum-grade devotional art, crafted to order and blessed with care.'
      : 'Every deity. Every medium. One standard of reverence.';

  const chips = [
    deity && { key: 'deity' as const, label: deity.name },
    filters.category && { key: 'category' as const, label: filters.category },
    filters.size && { key: 'size' as const, label: SIZE_BUCKETS.find((s) => s.id === filters.size)?.label ?? filters.size },
    filters.frame && { key: 'frame' as const, label: filters.frame },
    filters.price && { key: 'price' as const, label: PRICE_BUCKETS.find((p) => p.id === filters.price)?.label ?? filters.price },
    filters.q && { key: 'q' as const, label: `“${filters.q}”` },
  ].filter(Boolean) as { key: keyof FilterState; label: string }[];

  return (
    <div>
      {/* ——— Collection hero banner ——— */}
      <section className="gradient-hero relative overflow-hidden" aria-labelledby="collection-heading">
        <div className="gradient-mesh absolute inset-0 opacity-60" aria-hidden="true" />
        <span
          className="font-display pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[11rem] leading-none text-accent-500/10 sm:text-[15rem]"
          aria-hidden="true"
        >
          {deity?.salutation && deity.salutation.length <= 2 ? deity.salutation : 'ॐ'}
        </span>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            key={heroTitle}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LUXE }}
            className="max-w-2xl"
          >
            {deity && (
              <p className="font-accent mb-4 text-2xs uppercase tracking-luxe text-accent-400">{deity.salutation}</p>
            )}
            {!deity && <p className="eyebrow mb-4 !text-accent-400">Devotional Artworks</p>}
            <h1 id="collection-heading" className="font-display text-4xl font-medium leading-tight text-surface-50 sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <div className="hairline-gold mt-6 w-24" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-surface-300">{heroSub}</p>
          </motion.div>
        </div>
      </section>

      {/* ——— Persistent filter bar ——— */}
      <div className="glass sticky top-16 z-30 border-b border-surface-200 sm:top-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Desktop dropdowns */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Filter artworks">
            <FilterDropdown
              label="Deity"
              value={filters.deity}
              options={DEITIES.map((d) => ({ id: d.slug, label: d.name }))}
              onChange={(v) => setFilter('deity', v)}
            />
            <FilterDropdown
              label="Collection"
              value={filters.category}
              options={categories.map((c) => ({ id: c, label: c }))}
              onChange={(v) => setFilter('category', v)}
            />
            <FilterDropdown
              label="Size"
              value={filters.size}
              options={[...SIZE_BUCKETS]}
              onChange={(v) => setFilter('size', v)}
            />
            {frames.length > 0 && (
              <FilterDropdown
                label="Frame"
                value={filters.frame}
                options={frames.map((f) => ({ id: f, label: f }))}
                onChange={(v) => setFilter('frame', v)}
              />
            )}
            <FilterDropdown
              label="Price"
              value={filters.price}
              options={[...PRICE_BUCKETS]}
              onChange={(v) => setFilter('price', v)}
            />
          </nav>

          {/* Mobile refine trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="font-accent focus-ring inline-flex items-center gap-2 border border-surface-300 px-4 py-2.5 text-2xs font-medium uppercase tracking-luxe text-primary-700 transition-colors duration-400 hover:border-accent-500 hover:text-accent-700 lg:hidden"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Refine
            {activeCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-600 text-[9px] text-cream">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-5">
            <p className="font-accent hidden text-2xs uppercase tracking-wider text-surface-400 sm:block" aria-live="polite">
              {isLoading ? '—' : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
            </p>
            <FilterDropdown
              label="Sort"
              value={filters.sort === 'featured' ? null : filters.sort}
              options={[...SORT_OPTIONS]}
              onChange={(v) => setFilter('sort', v ?? 'featured')}
              align="right"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* ——— Active filter chips ——— */}
        <AnimatePresence>
          {chips.length > 0 && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_LUXE }}
              className="mb-8 flex flex-wrap items-center gap-2"
            >
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key, null)}
                  className="focus-ring group inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-50 px-4 py-1.5 text-xs text-accent-800 transition-colors duration-400 hover:border-accent-600"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label}
                  <X className="h-3 w-3 text-accent-600 transition-transform duration-400 group-hover:rotate-90" aria-hidden="true" />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="font-accent focus-ring ml-1 text-2xs uppercase tracking-wider text-surface-400 underline-offset-4 transition-colors duration-400 hover:text-danger-600 hover:underline"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ——— Grid ——— */}
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.ul layout={!reduced} className={cn('grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4')}>
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.li
                  key={product.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                >
                  <ProductCard product={product} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <ImageOff className="mb-6 h-10 w-10 text-surface-300" aria-hidden="true" />
            <h2 className="font-display mb-2 text-2xl font-medium text-primary-700">No artworks found</h2>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-surface-500">
              The divine takes many forms — but none match this combination. Soften a filter or explore the full gallery.
            </p>
            <button
              onClick={clearAll}
              className="font-accent focus-ring border border-primary-700 px-8 py-3.5 text-2xs font-medium uppercase tracking-luxe text-primary-700 transition-colors duration-400 hover:bg-primary-700 hover:text-surface-50"
            >
              View All Artworks
            </button>
          </div>
        )}
      </div>

      {/* ——— Mobile filter drawer ——— */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        frames={frames}
        categories={categories}
        resultCount={filtered.length}
        onClearAll={clearAll}
      />
    </div>
  );
}
