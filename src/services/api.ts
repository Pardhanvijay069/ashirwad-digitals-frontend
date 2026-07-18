import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { adminLogout } from '@/store/slices/authSlice';

/**
 * Base query with automatic admin JWT injection and 401 handling.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.adminToken;
    // Attach JWT for admin endpoints
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Wrapper that handles 401 responses on admin endpoints.
 * Dispatches logout and forces redirect to /admin/login.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Determine if this was an admin endpoint
    const url = typeof args === 'string' ? args : args.url;
    if (url.includes('/admin')) {
      api.dispatch(adminLogout());
      // Redirect to admin login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  }

  return result;
};

/**
 * Central RTK Query API — all feature-specific endpoints are injected into this.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'ProductList', 'Order', 'OrderList', 'UnreadCount'],
  endpoints: () => ({}),
});
