import { api } from './api';
import type {
  APIResponse,
  Order,
  GetOrdersParams,
  UpdateOrderStatusRequest,
  PlaceOrderResponse,
  UnreadCountResponse,
  TrackingResponse,
  OrderDetailResponse,
} from '@/types';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /orders
     * Place a new order (public, multipart/form-data).
     */
    placeOrder: builder.mutation<PlaceOrderResponse, FormData>({
      query: (formData) => ({
        url: '/orders',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: APIResponse<PlaceOrderResponse>) => response.data!,
      invalidatesTags: [{ type: 'OrderList' }, { type: 'UnreadCount' }],
    }),

    /**
     * GET /admin/orders?status=&limit=&offset=
     * All orders for admin.
     */
    getAdminOrders: builder.query<Order[], GetOrdersParams | void>({
      query: (params) => ({
        url: '/admin/orders',
        params: params ? {
          status: params.status || undefined,
          limit: params.limit,
          offset: params.offset,
        } : undefined,
      }),
      transformResponse: (response: APIResponse<Order[]>) => response.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'OrderList' as const },
            ]
          : [{ type: 'OrderList' as const }],
    }),

    /**
     * GET /admin/orders/unread-count
     */
    getUnreadCount: builder.query<number, void>({
      query: () => '/admin/orders/unread-count',
      transformResponse: (response: APIResponse<UnreadCountResponse>) =>
        response.data?.unread_count ?? 0,
      providesTags: [{ type: 'UnreadCount' }],
    }),

    /**
     * GET /admin/orders/:id
     * Order detail with items for admin.
     */
    getAdminOrderById: builder.query<OrderDetailResponse, number>({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: (response: APIResponse<any>) => {
        const data = response.data;
        if (!data) return data as unknown as OrderDetailResponse;

        // If the backend returned it nested correctly
        if (data.order && data.items) {
          return data as OrderDetailResponse;
        }

        // If the backend returned it flattened
        const { items, ...order } = data;
        return { order, items } as OrderDetailResponse;
      },
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    /**
     * PUT /admin/orders/:id/status
     * Update order status.
     */
    updateOrderStatus: builder.mutation<void, UpdateOrderStatusRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'OrderList' },
        { type: 'Order', id },
        { type: 'UnreadCount' },
      ],
    }),

    /**
     * PUT /admin/orders/:id/read
     * Mark order as read.
     */
    markOrderRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/orders/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'UnreadCount' },
        { type: 'Order', id },
      ],
    }),

    /**
     * GET /track/:token
     * Public order tracking by token.
     */
    trackOrder: builder.query<TrackingResponse, string>({
      query: (token) => `/track/${token}`,
      transformResponse: (response: APIResponse<TrackingResponse>) => response.data!,
    }),

    /**
     * GET /customer/orders?userId=
     * Customer's own orders.
     */
    getCustomerOrders: builder.query<Order[], number>({
      query: (userId) => ({
        url: '/customer/orders',
        params: { userId },
      }),
      transformResponse: (response: APIResponse<Order[]>) => response.data ?? [],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetAdminOrdersQuery,
  useGetUnreadCountQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useMarkOrderReadMutation,
  useTrackOrderQuery,
  useGetCustomerOrdersQuery,
} = ordersApi;
