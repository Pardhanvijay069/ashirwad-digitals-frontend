import { api } from './api';
import type {
  APIResponse,
  Product,
  GetProductsParams,
  CreateProductRequest,
  UpdateProductRequest,
  ProductImage,
} from '@/types';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /products?category=&active_only=
     * Public product listing.
     */
    getProducts: builder.query<Product[], GetProductsParams | void>({
      query: (params) => ({
        url: '/products',
        params: params ? {
          category: params.category || undefined,
          active_only: params.active_only !== undefined ? params.active_only : undefined,
        } : undefined,
      }),
      transformResponse: (response: APIResponse<Product[]>) => response.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'ProductList' as const },
            ]
          : [{ type: 'ProductList' as const }],
    }),

    /**
     * GET /products/:id
     * Product detail with images.
     */
    getProductById: builder.query<{ product: Product; images: ProductImage[] }, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: APIResponse<{ product: Product; images: ProductImage[] }>) =>
        response.data!,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    /**
     * POST /admin/products
     * Create a new product (admin).
     */
    createProduct: builder.mutation<{ product_id: number }, CreateProductRequest>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
      }),
      transformResponse: (response: APIResponse<{ product_id: number }>) => response.data!,
      invalidatesTags: [{ type: 'ProductList' }],
    }),

    /**
     * PUT /admin/products/:id
     * Update an existing product (admin).
     */
    updateProduct: builder.mutation<void, UpdateProductRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ProductList' },
        { type: 'Product', id },
      ],
    }),

    /**
     * DELETE /admin/products/:id
     * Soft-delete (deactivate) a product (admin).
     */
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ProductList' }],
    }),

    /**
     * POST /admin/products/:id/images
     * Upload product images (multipart, key: 'images').
     */
    uploadProductImages: builder.mutation<void, { productId: number; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/admin/products/${productId}/images`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    /**
     * DELETE /admin/products/images/:image_id
     * Delete a product image (admin).
     */
    deleteProductImage: builder.mutation<void, { imageId: number; productId: number }>({
      query: ({ imageId }) => ({
        url: `/admin/products/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
} = productsApi;
