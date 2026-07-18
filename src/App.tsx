import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { AppRoutes } from '@/routes';
import { useDarkMode } from '@/hooks/useDarkMode';
import { AlertTriangle } from 'lucide-react';

/**
 * Environment variable validation.
 * Shows a developer-friendly error screen if critical env vars are missing.
 */
function EnvCheck({ children }: { children: React.ReactNode }) {
  const missing: string[] = [];
  if (!import.meta.env.VITE_API_BASE_URL) missing.push('VITE_API_BASE_URL');
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) missing.push('VITE_GOOGLE_CLIENT_ID');

  if (missing.length > 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 p-8 dark:bg-surface-950">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-8 shadow-card dark:border-amber-800 dark:bg-surface-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-surface-900 dark:text-surface-100">
            Configuration Error
          </h1>
          <p className="mb-4 text-surface-500 dark:text-surface-400">
            The following required environment variables are missing:
          </p>
          <ul className="mb-6 space-y-2">
            {missing.map((v) => (
              <li key={v} className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2 font-mono text-sm text-danger-600 dark:bg-surface-800 dark:text-danger-400">
                <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
                {v}
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-surface-50 p-4 text-sm text-surface-600 dark:bg-surface-800 dark:text-surface-400">
            <p className="mb-2 font-medium">To fix this:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Copy <code className="rounded bg-surface-200 px-1 dark:bg-surface-700">.env.example</code> to <code className="rounded bg-surface-200 px-1 dark:bg-surface-700">.env</code></li>
              <li>Fill in the required values</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Dark mode initializer — applies dark class on mount.
 */
function DarkModeInit({ children }: { children: React.ReactNode }) {
  useDarkMode();
  return <>{children}</>;
}

export default function App() {
  return (
    <Provider store={store}>
      <EnvCheck>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
          <BrowserRouter>
            <DarkModeInit>
              <AppRoutes />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  className: 'font-sans',
                }}
              />
            </DarkModeInit>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </EnvCheck>
    </Provider>
  );
}
