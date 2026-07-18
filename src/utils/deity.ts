import type { Product } from '@/types';
import { DEITIES, type Deity } from './constants';

/**
 * Infer the deity/subject of a product from its metadata, name,
 * or description. Purely presentational — no backend involvement.
 */
export function inferDeity(product: Product): Deity | null {
  const metaDeity =
    typeof product.metadata?.deity === 'string' ? (product.metadata.deity as string).toLowerCase() : null;
  const haystack = `${metaDeity ?? ''} ${product.name} ${product.description ?? ''}`.toLowerCase();

  for (const deity of DEITIES) {
    if (metaDeity && (metaDeity === deity.slug || metaDeity === deity.name.toLowerCase())) return deity;
  }
  for (const deity of DEITIES) {
    if (deity.keywords.some((k) => haystack.includes(k))) return deity;
  }
  return null;
}

export function deityBySlug(slug: string | null): Deity | null {
  if (!slug) return null;
  return DEITIES.find((d) => d.slug === slug) ?? null;
}

/**
 * Optional presentational rating stored in product.metadata.rating (0–5).
 */
export function productRating(product: Product): number | null {
  const r = product.metadata?.rating;
  const n = typeof r === 'number' ? r : typeof r === 'string' ? parseFloat(r) : NaN;
  return Number.isFinite(n) && n > 0 && n <= 5 ? n : null;
}
