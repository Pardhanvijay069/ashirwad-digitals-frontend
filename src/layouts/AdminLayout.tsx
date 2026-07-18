import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useAuth } from '@/hooks/useAuth';
import { useGetUnreadCountQuery } from '@/services/ordersApi';
import { useSocket } from '@/hooks/useSocket';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { adminUser, logoutAdmin } = useAuth();

  // Fetch unread count for notification bell
  const { data: unreadCount = 0 } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });

  // Socket.io for real-time alerts
  useSocket(true);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs: { label: string; path?: string }[] = [];

    if (path === '/admin') {
      crumbs.push({ label: 'Dashboard' });
    } else if (path.startsWith('/admin/orders')) {
      crumbs.push({ label: 'Orders', path: '/admin/orders' });
      if (path !== '/admin/orders') {
        const id = path.split('/').pop();
        crumbs.push({ label: `Order #${id}` });
      }
    } else if (path.startsWith('/admin/products')) {
      crumbs.push({ label: 'Products', path: '/admin/products' });
      if (path.includes('/new')) crumbs.push({ label: 'Add Product' });
      else if (path.includes('/edit')) crumbs.push({ label: 'Edit Product' });
    } else if (path === '/admin/settings') {
      crumbs.push({ label: 'Settings' });
    }

    return crumbs;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-surface-200 px-4 dark:border-surface-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-800">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        {(sidebarOpen || isMobile) && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-surface-900 dark:text-surface-100"
          >
            Admin Panel
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileDrawerOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {(sidebarOpen || isMobile) && <span>{item.label}</span>}
              {item.label === 'Orders' && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger-600 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-surface-200 p-3 dark:border-surface-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-danger-50 hover:text-danger-600 dark:text-surface-400 dark:hover:bg-danger-950/30 dark:hover:text-danger-400"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(sidebarOpen || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarOpen ? 256 : 72 }}
          transition={{ duration: 0.2 }}
          className="hidden flex-shrink-0 border-r border-surface-200 bg-white md:block dark:border-surface-700 dark:bg-surface-900"
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 h-full w-[280px] border-r border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-surface-200 bg-white px-4 dark:border-surface-700 dark:bg-surface-900 sm:px-6">
          <div className="flex items-center gap-4">
            {isMobile ? (
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <Menu className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Breadcrumb items={getBreadcrumbs()} />
          </div>

          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* Notification Bell */}
            <Link
              to="/admin/orders"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[9px] font-bold text-white"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{adminUser?.username || 'Admin'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 mt-1 w-44 rounded-xl border border-surface-200 bg-white p-1 shadow-elevated dark:border-surface-700 dark:bg-surface-900"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="border-b border-surface-200 px-3 py-2 text-xs text-surface-500 dark:border-surface-700 dark:text-surface-400">
                      Signed in as
                      <div className="mt-0.5 font-medium text-surface-900 dark:text-surface-100">
                        {adminUser?.username || 'Admin'}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
