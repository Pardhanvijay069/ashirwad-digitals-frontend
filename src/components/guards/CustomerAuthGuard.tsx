import { useAuth } from '@/hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/services/authApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Guard for customer-only pages (e.g., My Orders).
 * Shows Google login prompt if customer is not authenticated.
 */
export function CustomerAuthGuard({ children }: CustomerAuthGuardProps) {
  const { isCustomerAuthenticated, loginCustomer } = useAuth();
  const [googleLogin] = useGoogleLoginMutation();

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google login failed. Please try again.');
      return;
    }

    try {
      const result = await googleLogin({ google_token: credentialResponse.credential }).unwrap();
      loginCustomer(result.user);
      toast.success(`Welcome, ${result.user.name}!`);
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  if (!isCustomerAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
          <LogIn className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-surface-900 dark:text-surface-100">
          Sign in to continue
        </h2>
        <p className="mb-8 max-w-md text-surface-500 dark:text-surface-400">
          Please sign in with your Google account to view your orders and track your purchases.
        </p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google login failed.')}
          theme="outline"
          size="large"
          shape="pill"
          text="signin_with"
        />
      </motion.div>
    );
  }

  return <>{children}</>;
}
