/* ================================================================
   ASHIRWAD DIGITALS — TypeScript Types
   Mapped 1:1 from the MySQL database schema
   ================================================================ */

// ——————————————————————————————————————————————————
// API Envelope (standard backend response format)
// ——————————————————————————————————————————————————

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// ——————————————————————————————————————————————————
// Users (users table)
// ——————————————————————————————————————————————————

export interface User {
  id: number;
  google_id?: string | null;
  email?: string | null;
  name: string;
  phone?: string | null;
  auth_provider: 'google' | 'guest';
  last_login?: string | null;
  created_at?: string;
}

// ——————————————————————————————————————————————————
// Products (products table)
// ——————————————————————————————————————————————————

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  description?: string | null;
  base_price: number;
  unit: string;
  width?: number | null;
  height?: number | null;
  size_unit?: string | null;
  material?: string | null;
  finish?: string | null;
  stock_quantity: number;
  min_stock_warning: number;
  is_in_stock: boolean;
  is_active: boolean;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

// ——————————————————————————————————————————————————
// Product Images (product_images table)
// ——————————————————————————————————————————————————

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

// ——————————————————————————————————————————————————
// Orders (orders table)
// ——————————————————————————————————————————————————

export type OrderStatus =
  | 'pending'
  | 'design_review'
  | 'printing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Other';

export interface Order {
  id: number;
  order_number: string;
  user_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address: string;
  special_instructions?: string | null;
  design_file_url?: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod | null;
  is_read: boolean;
  tracking_token: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ——————————————————————————————————————————————————
// Order Items (order_items table)
// ——————————————————————————————————————————————————

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  specification_json?: Record<string, unknown> | null;
  created_at?: string;
}

// ——————————————————————————————————————————————————
// Admin Users (admin_users table)
// ——————————————————————————————————————————————————

export interface AdminUser {
  id: number;
  username: string;
  created_at: string;
}

// ——————————————————————————————————————————————————
// Cart
// ——————————————————————————————————————————————————

export interface CartItem {
  product: Product;
  quantity: number;
  specification?: Record<string, unknown>;
}

// ——————————————————————————————————————————————————
// API Request / Response Shapes
// ——————————————————————————————————————————————————

export interface GoogleLoginRequest {
  google_token: string;
}

export interface GoogleLoginResponse {
  user: User;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
}

export interface PlaceOrderRequest {
  user_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  special_instructions?: string;
  items: OrderItemInput[];
  design_file?: File;
}

export interface OrderItemInput {
  product_id: number;
  qty: number;
  specification?: Record<string, unknown>;
}

export interface PlaceOrderResponse {
  order_id: number;
  order_number: string;
  tracking_token: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  category: string;
  description?: string;
  base_price: number;
  unit?: string;
  width?: number;
  height?: number;
  size_unit?: string;
  material?: string;
  finish?: string;
  stock_quantity?: number;
  min_stock_warning?: number;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface UpdateOrderStatusRequest {
  id: number;
  status: OrderStatus;
  cancel_reason?: string;
}

export interface GetOrdersParams {
  status?: OrderStatus | '';
  limit?: number;
  offset?: number;
}

export interface GetProductsParams {
  category?: string;
  active_only?: boolean;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface TrackingResponse {
  order: Order;
  items: OrderItem[];
}

export interface OrderDetailResponse {
  order: Order;
  items: OrderItem[];
}
