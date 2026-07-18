import { useAppSelector, useAppDispatch } from '@/store';
import { addToCart, removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartCount, selectCartTotal } from '@/store/slices/cartSlice';
import type { Product } from '@/types';
import { useCallback } from 'react';

/**
 * Convenient cart operations hook.
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  const add = useCallback(
    (product: Product, quantity = 1, specification?: Record<string, unknown>) =>
      dispatch(addToCart({ product, quantity, specification })),
    [dispatch]
  );

  const remove = useCallback(
    (productId: number) => dispatch(removeFromCart(productId)),
    [dispatch]
  );

  const update = useCallback(
    (productId: number, quantity: number) => dispatch(updateQuantity({ productId, quantity })),
    [dispatch]
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  return { items, count, total, add, remove, update, clear };
}
