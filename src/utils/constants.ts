import type { OrderStatus } from '@/types';

/**
 * Order status labels for display.
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  design_review: 'Design Review',
  printing: 'Printing',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

/**
 * Order status colors (Tailwind class tokens).
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500' },
  design_review: { bg: 'bg-info-50', text: 'text-info-600', dot: 'bg-info-500' },
  printing: { bg: 'bg-primary-50', text: 'text-primary-600', dot: 'bg-primary-500' },
  ready: { bg: 'bg-accent-50', text: 'text-accent-600', dot: 'bg-accent-500' },
  delivered: { bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-500' },
  cancelled: { bg: 'bg-danger-50', text: 'text-danger-600', dot: 'bg-danger-500' },
};

/**
 * Order status flow (for tracking timeline).
 * Cancelled is excluded from the normal flow.
 */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'design_review',
  'printing',
  'ready',
  'delivered',
];

/**
 * Product categories — devotional print catalogue.
 */
export const PRODUCT_CATEGORIES = [
  'All',
  'Hindu Gods Posters',
  'Photo Frames',
  'Canvas Prints',
  'Wall Frames',
  'Temple Wall Art',
  'Devotional Decor',
] as const;

/**
 * Deities & sacred subjects — powers the mega-menu, collection heroes,
 * client-side filtering, and PDP spiritual quotes.
 */
export interface Deity {
  name: string;
  slug: string;
  /** lowercase keywords matched against product name/description/metadata */
  keywords: string[];
  /** short devanagari or sanskrit salutation */
  salutation: string;
  /** spiritual line shown on collection hero & PDP */
  quote: string;
}

export const DEITIES: Deity[] = [
  { name: 'Shri Ram', slug: 'shri-ram', keywords: ['ram', 'rama', 'ayodhya', 'raghav'], salutation: 'जय श्री राम', quote: 'Dharma protects those who protect it.' },
  { name: 'Radha Krishna', slug: 'radha-krishna', keywords: ['krishna', 'radha', 'vrindavan', 'kanha', 'govinda'], salutation: 'राधे राधे', quote: 'Where there is love, there is Krishna.' },
  { name: 'Mahadev', slug: 'mahadev', keywords: ['shiva', 'shiv', 'mahadev', 'bholenath', 'kailash', 'rudra'], salutation: 'हर हर महादेव', quote: 'Stillness is the language of the infinite.' },
  { name: 'Shiv Parivar', slug: 'shiv-parivar', keywords: ['shiv parivar', 'parvati', 'kartikeya'], salutation: 'ॐ नमः शिवाय', quote: 'The family of the divine dwells in harmony.' },
  { name: 'Hanuman Ji', slug: 'hanuman-ji', keywords: ['hanuman', 'bajrang', 'anjaneya', 'maruti'], salutation: 'जय बजरंगबली', quote: 'Devotion makes the impossible effortless.' },
  { name: 'Ganesh Ji', slug: 'ganesh-ji', keywords: ['ganesh', 'ganesha', 'ganpati', 'vinayak'], salutation: 'ॐ गं गणपतये नमः', quote: 'Every auspicious beginning starts with Him.' },
  { name: 'Maa Durga', slug: 'maa-durga', keywords: ['durga', 'sherawali', 'ambe', 'bhavani'], salutation: 'जय माता दी', quote: 'Grace and strength are one and the same.' },
  { name: 'Maa Lakshmi', slug: 'maa-lakshmi', keywords: ['lakshmi', 'laxmi', 'shree'], salutation: 'ॐ श्रीं महालक्ष्म्यै नमः', quote: 'Abundance flows where gratitude lives.' },
  { name: 'Vishnu Bhagwan', slug: 'vishnu-bhagwan', keywords: ['vishnu', 'narayan', 'hari'], salutation: 'ॐ नमो नारायणाय', quote: 'The preserver watches over every breath.' },
  { name: 'Jagannath', slug: 'jagannath', keywords: ['jagannath', 'puri'], salutation: 'जय जगन्नाथ', quote: 'The Lord of the Universe belongs to all.' },
  { name: 'Balaji', slug: 'balaji', keywords: ['balaji', 'venkateswara', 'tirupati', 'srinivasa'], salutation: 'ॐ नमो वेंकटेशाय', quote: 'Surrender, and the seven hills carry you.' },
  { name: 'Saraswati Maa', slug: 'saraswati-maa', keywords: ['saraswati', 'sharda', 'veena'], salutation: 'ॐ ऐं सरस्वत्यै नमः', quote: 'Knowledge is the light that never dims.' },
  { name: 'Buddha Artwork', slug: 'buddha-artwork', keywords: ['buddha', 'buddhist', 'zen', 'bodhi'], salutation: 'बुद्धं शरणं गच्छामि', quote: 'Peace comes from within; do not seek it without.' },
  { name: 'Spiritual Quotes', slug: 'spiritual-quotes', keywords: ['quote', 'mantra', 'shloka', 'sanskrit', 'om'], salutation: 'ॐ', quote: 'Words of the sages, framed for your walls.' },
];

/**
 * Max file sizes and allowed types.
 */
export const FILE_UPLOAD = {
  DESIGN_MAX_SIZE: 20 * 1024 * 1024, // 20 MB
  DESIGN_ACCEPT: '.pdf,.png,.jpg,.jpeg',
  DESIGN_TYPES: ['application/pdf', 'image/png', 'image/jpeg'],
  PRODUCT_IMAGE_MAX: 4,
  PRODUCT_IMAGE_ACCEPT: '.png,.jpg,.jpeg,.webp',
} as const;

/**
 * Pagination defaults.
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  OPTIONS: [10, 20, 50] as const,
} as const;

/**
 * Navigation links.
 */
export const CUSTOMER_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/products' },
  { label: 'Track Order', path: '/track' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
] as const;

export const FOOTER_CARE_LINKS = [
  { label: 'Track Your Order', path: '/track' },
  { label: 'Shipping & Returns', path: '/shipping-returns' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'My Orders', path: '/my-orders' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Orders', path: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Products', path: '/admin/products', icon: 'Package' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
] as const;
