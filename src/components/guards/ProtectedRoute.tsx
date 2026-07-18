import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guard for admin routes.
 * Checks JWT token presence and expiry.
 * Redirects to /admin/login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdminAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
