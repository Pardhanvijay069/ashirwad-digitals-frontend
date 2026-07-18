import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAdminLoginMutation } from '@/services/authApi';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminLoginSchema, type AdminLoginFormData } from '@/utils/validators';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, isAdminAuthenticated } = useAuth();
  const [adminLogin] = useAdminLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const result = await adminLogin(data).unwrap();
      loginAdmin(result.token, result.admin);
      toast.success('Welcome back!');
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Admin Login
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Sign in to the Ashirwad Digitals admin panel
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-card dark:border-surface-700 dark:bg-surface-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Username"
              placeholder="Enter your username"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.username?.message}
              autoFocus
              {...register('username')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-surface-400 hover:text-surface-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
