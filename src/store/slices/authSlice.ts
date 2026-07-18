import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser, User } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface AuthState {
  adminToken: string | null;
  adminUser: AdminUser | null;
  customer: User | null;
}

const initialState: AuthState = {
  adminToken: storage.get<string | null>(STORAGE_KEYS.ADMIN_TOKEN, null),
  adminUser: storage.get<AdminUser | null>(STORAGE_KEYS.ADMIN_USER, null),
  customer: storage.get<User | null>(STORAGE_KEYS.CUSTOMER, null),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminSession(
      state,
      action: PayloadAction<{ token: string; admin: AdminUser | null }>
    ) {
      state.adminToken = action.payload.token;
      state.adminUser = action.payload.admin;
      storage.set(STORAGE_KEYS.ADMIN_TOKEN, action.payload.token);
      storage.set(STORAGE_KEYS.ADMIN_USER, action.payload.admin);
    },
    setAdminToken(state, action: PayloadAction<string>) {
      state.adminToken = action.payload;
      storage.set(STORAGE_KEYS.ADMIN_TOKEN, action.payload);
    },
    setCustomer(state, action: PayloadAction<User>) {
      state.customer = action.payload;
      storage.set(STORAGE_KEYS.CUSTOMER, action.payload);
    },
    adminLogout(state) {
      state.adminToken = null;
      state.adminUser = null;
      storage.remove(STORAGE_KEYS.ADMIN_TOKEN);
      storage.remove(STORAGE_KEYS.ADMIN_USER);
    },
    customerLogout(state) {
      state.customer = null;
      storage.remove(STORAGE_KEYS.CUSTOMER);
    },
    logout(state) {
      state.adminToken = null;
      state.adminUser = null;
      state.customer = null;
      storage.remove(STORAGE_KEYS.ADMIN_TOKEN);
      storage.remove(STORAGE_KEYS.ADMIN_USER);
      storage.remove(STORAGE_KEYS.CUSTOMER);
    },
  },
});

export const {
  setAdminSession,
  setAdminToken,
  setCustomer,
  adminLogout,
  customerLogout,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
