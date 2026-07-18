import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';

// —— Customer Pages (Lazy Loaded) ——
const HomePage = lazy(() => import('@/pages/customer/HomePage'));
const AboutPage = lazy(() => import('@/pages/customer/AboutPage'));
const ContactPage = lazy(() => import('@/pages/customer/ContactPage'));
const ProductsPage = lazy(() => import('@/pages/customer/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/customer/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/customer/OrderSuccessPage'));
const TrackOrderPage = lazy(() => import('@/pages/customer/TrackOrderPage'));
const CustomerOrdersPage = lazy(() => import('@/pages/customer/CustomerOrdersPage'));
const NotFoundPage = lazy(() => import('@/pages/customer/NotFoundPage'));
const ShippingReturnsPage = lazy(() => import('@/pages/customer/ShippingReturnsPage'));

// —— Admin Pages (Lazy Loaded) ——
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AddProductPage = lazy(() => import('@/pages/admin/AddProductPage'));
const EditProductPage = lazy(() => import('@/pages/admin/EditProductPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

// —— Error Pages ——
const Error401Page = lazy(() => import('@/pages/errors/Error401Page'));
const Error403Page = lazy(() => import('@/pages/errors/Error403Page'));
const Error500Page = lazy(() => import('@/pages/errors/Error500Page'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <Routes>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="my-orders" element={<CustomerOrdersPage />} />

          {/* Error Pages */}
          <Route path="401" element={<Error401Page />} />
          <Route path="403" element={<Error403Page />} />
          <Route path="500" element={<Error500Page />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login (outside admin layout) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes (Protected) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
