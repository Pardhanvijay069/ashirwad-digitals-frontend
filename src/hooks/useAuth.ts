import { useAppSelector, useAppDispatch } from '@/store';
import {
  setAdminSession,
  setAdminToken,
  setCustomer,
  adminLogout,
  customerLogout,
} from '@/store/slices/authSlice';
import type { AdminUser, User } from '@/types';
import { useCallback, useMemo } from 'react';

/**
 * Centralized auth hook for accessing auth state and dispatching auth actions.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const adminToken = useAppSelector((s) => s.auth.adminToken);
  const adminUser = useAppSelector((s) => s.auth.adminUser);
  const customer = useAppSelector((s) => s.auth.customer);

  const isAdminAuthenticated = useMemo(() => {
    if (!adminToken) return false;
    // Decode JWT to check expiry
    try {
      const payload = JSON.parse(atob(adminToken.split('.')[1]!));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, [adminToken]);

  const isCustomerAuthenticated = useMemo(() => !!customer, [customer]);

  const loginAdmin = useCallback(
    (token: string, admin?: AdminUser | null) => {
      if (admin !== undefined) {
        dispatch(setAdminSession({ token, admin }));
        return;
      }
      dispatch(setAdminToken(token));
    },
    [dispatch]
  );

  const loginCustomer = useCallback(
    (user: User) => dispatch(setCustomer(user)),
    [dispatch]
  );

  const logoutAdmin = useCallback(() => dispatch(adminLogout()), [dispatch]);
  const logoutCustomer = useCallback(() => dispatch(customerLogout()), [dispatch]);

  return {
    adminToken,
    adminUser,
    customer,
    isAdminAuthenticated,
    isCustomerAuthenticated,
    loginAdmin,
    loginCustomer,
    logoutAdmin,
    logoutCustomer,
  };
}
