import { api } from './api';
import type {
  APIResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  AdminLoginRequest,
  AdminLoginResponse,
} from '@/types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /auth/google
     * Google OAuth login for customers.
     */
    googleLogin: builder.mutation<GoogleLoginResponse, GoogleLoginRequest>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      transformResponse: (response: APIResponse<GoogleLoginResponse>) => response.data!,
    }),

    /**
     * POST /admin/login
     * JWT login for admin users.
     */
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (body) => ({
        url: '/admin/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: APIResponse<AdminLoginResponse>) => response.data!,
    }),
  }),
});

export const { useGoogleLoginMutation, useAdminLoginMutation } = authApi;
