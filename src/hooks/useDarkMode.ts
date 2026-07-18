import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { toggleDarkMode, setDarkMode } from '@/store/slices/uiSlice';

/**
 * Dark mode management hook.
 * Syncs dark class on <html> and listens for prefers-color-scheme changes.
 */
export function useDarkMode() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  // Apply dark mode class on mount and when state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't explicitly set a preference
      const stored = localStorage.getItem('ashirwad_dark_mode');
      if (stored === null) {
        dispatch(setDarkMode(e.matches));
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [dispatch]);

  const toggle = () => dispatch(toggleDarkMode());

  return { darkMode, toggle };
}
