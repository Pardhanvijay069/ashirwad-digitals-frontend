import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { Moon, Sun, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { darkMode } = useDarkMode();
  const { adminUser } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-100">
          Settings
        </h1>

        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Admin Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-surface-900 dark:text-surface-100">
                {adminUser?.username || 'Admin'}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Authenticated administrator session
              </p>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-surface-500" /> : <Sun className="h-5 w-5 text-surface-500" />}
              <div>
                <p className="font-medium text-surface-900 dark:text-surface-100">Dark Mode</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {darkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
                </p>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </Card>

        {/* App Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Application Info
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Application</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">Ashirwad Digitals Admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Version</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Stack</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">React 19 + Vite + Tailwind 4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">API</span>
              <span className="font-mono text-xs text-surface-600 dark:text-surface-400">
                {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
