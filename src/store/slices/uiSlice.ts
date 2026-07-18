import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  miniCartOpen: boolean;
}

function getInitialDarkMode(): boolean {
  const stored = storage.get<boolean | null>(STORAGE_KEYS.DARK_MODE, null);
  if (stored !== null) return stored;
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

const initialState: UIState = {
  darkMode: getInitialDarkMode(),
  sidebarOpen: true,
  mobileMenuOpen: false,
  miniCartOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      storage.set(STORAGE_KEYS.DARK_MODE, state.darkMode);
      applyDarkMode(state.darkMode);
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      storage.set(STORAGE_KEYS.DARK_MODE, action.payload);
      applyDarkMode(action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    openMiniCart(state) {
      state.miniCartOpen = true;
    },
    closeMiniCart(state) {
      state.miniCartOpen = false;
    },
    toggleMiniCart(state) {
      state.miniCartOpen = !state.miniCartOpen;
    },
  },
});

/**
 * Apply dark mode class to <html> element.
 */
function applyDarkMode(dark: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark);
  }
}

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  closeMobileMenu,
  openMiniCart,
  closeMiniCart,
  toggleMiniCart,
} = uiSlice.actions;

export default uiSlice.reducer;
