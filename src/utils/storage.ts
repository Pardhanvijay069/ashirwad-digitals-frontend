/**
 * Type-safe localStorage wrapper with JSON serialization.
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

// Storage keys used across the app
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'ashirwad_admin_token',
  ADMIN_USER: 'ashirwad_admin_user',
  CUSTOMER: 'ashirwad_customer',
  CART: 'ashirwad_cart',
  DARK_MODE: 'ashirwad_dark_mode',
  PROMO: 'ashirwad_promo_code',
} as const;
