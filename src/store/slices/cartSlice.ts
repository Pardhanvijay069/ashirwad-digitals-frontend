import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: storage.get<CartItem[]>(STORAGE_KEYS.CART, []),
};

function persistCart(items: CartItem[]) {
  storage.set(STORAGE_KEYS.CART, items);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity: number; specification?: Record<string, unknown> }>) {
      const { product, quantity, specification } = action.payload;
      const existing = state.items.find((item) => item.product.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity, specification });
      }
      persistCart(state.items);
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      persistCart(state.items);
    },

    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      persistCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.base_price * item.quantity, 0);

export default cartSlice.reducer;
