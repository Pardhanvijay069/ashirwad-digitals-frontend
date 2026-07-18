import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Package,
  ChevronDown,
  Search,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/services/authApi';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store';
import { openMiniCart } from '@/store/slices/uiSlice';
import { CUSTOMER_NAV_LINKS, FOOTER_CARE_LINKS, DEITIES, PRODUCT_CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { Logo, OmSymbol } from '@/components/shop/Logo';
import { MiniCart } from '@/components/shop/MiniCart';
import { NewsletterForm } from '@/components/shop/NewsletterForm';
import { backdropFade, drawerLeft, panelDrop, pageTransition } from '@/lib/motion';

export function CustomerLayout() {
  const location = useLocation();
  const reduced = useReducedMotion();

  // The storefront is a single, warm-light theme — always.
  // (Admin keeps its own preference; its layout re-applies it on mount.)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <a
        href="#main-content"
        className="focus-ring sr-only z-[100] rounded-sm bg-accent-600 px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={reduced ? undefined : pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MiniCart />
    </div>
  );
}

/* ================================================================
   HEADER
   ================================================================ */

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { customer, isCustomerAuthenticated, loginCustomer, logoutCustomer } = useAuth();
  const { count } = useCart();
  const dispatch = useAppDispatch();
  const [googleLogin] = useGoogleLoginMutation();

  // Close overlays on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      const result = await googleLogin({ google_token: credentialResponse.credential }).unwrap();
      loginCustomer(result.user);
      toast.success(`Welcome, ${result.user.name}!`);
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement ribbon */}
      <div className="bg-primary-700 py-2 text-center">
        <p className="font-accent text-2xs uppercase tracking-luxe text-accent-300">
          Complimentary insured delivery on prepaid orders
        </p>
      </div>

      <div className="glass border-b border-surface-200/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring -ml-2 p-2 text-primary-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="focus-ring shrink-0" aria-label="Ashirwad Digitals — Home">
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <ul className="flex items-center gap-9">
              {CUSTOMER_NAV_LINKS.map((link) =>
                link.label === 'Shop' ? (
                  <li
                    key={link.path}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={scheduleCloseMega}
                  >
                    <NavLink
                      to={link.path}
                      aria-expanded={megaOpen}
                      onFocus={openMega}
                      className={({ isActive }) =>
                        cn(
                          'font-accent focus-ring inline-flex items-center gap-1.5 py-2 text-2xs font-medium uppercase tracking-luxe transition-colors duration-400',
                          isActive ? 'text-accent-700' : 'text-primary-600 hover:text-accent-700'
                        )
                      }
                    >
                      {link.label}
                      <ChevronDown
                        className={cn('h-3 w-3 transition-transform duration-400', megaOpen && 'rotate-180')}
                        aria-hidden="true"
                      />
                    </NavLink>
                  </li>
                ) : (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          'font-accent focus-ring py-2 text-2xs font-medium uppercase tracking-luxe transition-colors duration-400',
                          isActive ? 'text-accent-700' : 'text-primary-600 hover:text-accent-700'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="focus-ring p-2 text-primary-600 transition-colors duration-400 hover:text-accent-700"
              aria-label="Search artworks"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            {isCustomerAuthenticated ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  className="focus-ring font-accent flex items-center gap-2 p-2 text-2xs uppercase tracking-wider text-primary-600 transition-colors duration-400 hover:text-accent-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent-400 text-xs text-accent-700">
                    {customer?.name.charAt(0).toUpperCase()}
                  </span>
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={panelDrop}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onMouseLeave={() => setUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-52 border border-surface-200 bg-cream p-2 shadow-elevated"
                    >
                      <p className="font-display truncate border-b border-surface-200 px-3 pb-2 pt-1 text-sm text-primary-700">
                        {customer?.name}
                      </p>
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="focus-ring mt-1 flex items-center gap-2.5 px-3 py-2.5 text-xs text-surface-600 transition-colors hover:text-accent-700"
                      >
                        <Package className="h-4 w-4" aria-hidden="true" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logoutCustomer();
                          setUserMenuOpen(false);
                          toast.info('Signed out successfully');
                        }}
                        className="focus-ring flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-surface-600 transition-colors hover:text-danger-600"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:block">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google login failed.')}
                  theme="outline"
                  size="medium"
                  shape="circle"
                  type="icon"
                />
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(openMiniCart())}
              className="focus-ring relative p-2 text-primary-600 transition-colors duration-400 hover:text-accent-700"
              aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="font-accent absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[9px] font-semibold text-cream"
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu — Shop by Deity */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              variants={panelDrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
              className="absolute inset-x-0 top-full hidden border-b border-surface-200 bg-cream shadow-elevated lg:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-10">
                <div className="col-span-7">
                  <p className="eyebrow mb-5">Shop by Deity</p>
                  <ul className="grid grid-cols-3 gap-x-8 gap-y-3">
                    {DEITIES.map((deity) => (
                      <li key={deity.slug}>
                        <Link
                          to={`/products?deity=${deity.slug}`}
                          className="focus-ring font-display group inline-flex items-baseline gap-2 text-base text-primary-600 transition-colors duration-400 hover:text-accent-700"
                        >
                          {deity.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-3 border-l border-surface-200 pl-10">
                  <p className="eyebrow mb-5">By Collection</p>
                  <ul className="space-y-3">
                    {PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <li key={cat}>
                        <Link
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          className="focus-ring text-sm text-surface-600 transition-colors duration-400 hover:text-accent-700"
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2 flex flex-col items-center justify-center border-l border-surface-200 pl-8 text-center">
                  <OmSymbol className="mb-3 text-4xl text-accent-400" />
                  <p className="font-display text-sm italic leading-relaxed text-surface-500">
                    “Art is prayer made visible.”
                  </p>
                  <Link
                    to="/products"
                    className="font-accent focus-ring mt-4 text-2xs uppercase tracking-luxe text-accent-700 underline-offset-4 hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={isCustomerAuthenticated}
        onLogout={() => {
          logoutCustomer();
          setMobileOpen(false);
          toast.info('Signed out successfully');
        }}
        onGoogleSuccess={handleGoogleSuccess}
      />
    </header>
  );
}

/* ================================================================
   SEARCH OVERLAY
   ================================================================ */

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.2 } }}
            role="dialog"
            aria-modal="true"
            aria-label="Search artworks"
            className="fixed inset-x-0 top-0 z-50 bg-surface-50 shadow-elevated"
          >
            <form onSubmit={submit} className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-8">
              <Search className="h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search deities, artworks, collections…"
                className="font-display w-full bg-transparent text-2xl text-primary-700 outline-none placeholder:text-surface-400"
                aria-label="Search artworks"
              />
              <button
                type="button"
                onClick={onClose}
                className="focus-ring p-2 text-surface-500 hover:text-primary-700"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="hairline-gold" />
            <div className="mx-auto flex max-w-3xl flex-wrap gap-2 px-6 py-4">
              {['Radha Krishna', 'Mahadev', 'Ganesh Ji', 'Temple Wall Art'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/products?q=${encodeURIComponent(term)}`);
                    onClose();
                  }}
                  className="font-accent focus-ring rounded-full border border-surface-300 px-4 py-1.5 text-2xs uppercase tracking-wider text-surface-500 transition-colors duration-400 hover:border-accent-500 hover:text-accent-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   MOBILE DRAWER — nested lists
   ================================================================ */

function MobileDrawer({
  open,
  onClose,
  isAuthenticated,
  onLogout,
  onGoogleSuccess,
}: {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onGoogleSuccess: (r: { credential?: string }) => void;
}) {
  const [deitiesOpen, setDeitiesOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-[2px] lg:hidden"
            aria-hidden="true"
          />
          <motion.nav
            variants={drawerLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-surface-50 shadow-elevated lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-5">
              <Logo withWordmark />
              <button onClick={onClose} className="focus-ring p-2 text-surface-500" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex-1 px-6 py-4">
              <li>
                <Link
                  to="/"
                  onClick={onClose}
                  className="font-accent focus-ring block py-4 text-xs uppercase tracking-luxe text-primary-700"
                >
                  Home
                </Link>
              </li>

              {/* Shop — nested deities */}
              <li className="border-t border-surface-200">
                <button
                  onClick={() => setDeitiesOpen((v) => !v)}
                  aria-expanded={deitiesOpen}
                  className="font-accent focus-ring flex w-full items-center justify-between py-4 text-xs uppercase tracking-luxe text-primary-700"
                >
                  Shop by Deity
                  <ChevronDown
                    className={cn('h-4 w-4 text-accent-600 transition-transform duration-400', deitiesOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {deitiesOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      {DEITIES.map((deity) => (
                        <li key={deity.slug}>
                          <Link
                            to={`/products?deity=${deity.slug}`}
                            onClick={onClose}
                            className="font-display focus-ring block py-2.5 pl-4 text-base text-surface-600 hover:text-accent-700"
                          >
                            {deity.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {/* Collections — nested categories */}
              <li className="border-t border-surface-200">
                <button
                  onClick={() => setCollectionsOpen((v) => !v)}
                  aria-expanded={collectionsOpen}
                  className="font-accent focus-ring flex w-full items-center justify-between py-4 text-xs uppercase tracking-luxe text-primary-700"
                >
                  Collections
                  <ChevronDown
                    className={cn('h-4 w-4 text-accent-600 transition-transform duration-400', collectionsOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {collectionsOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      {PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <li key={cat}>
                          <Link
                            to={`/products?category=${encodeURIComponent(cat)}`}
                            onClick={onClose}
                            className="focus-ring block py-2.5 pl-4 text-sm text-surface-600 hover:text-accent-700"
                          >
                            {cat}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {(['Track Order', 'About', 'Contact'] as const).map((label) => {
                const link = CUSTOMER_NAV_LINKS.find((l) => l.label === label)!;
                return (
                  <li key={link.path} className="border-t border-surface-200">
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className="font-accent focus-ring block py-4 text-xs uppercase tracking-luxe text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {isAuthenticated ? (
                <>
                  <li className="border-t border-surface-200">
                    <Link
                      to="/my-orders"
                      onClick={onClose}
                      className="font-accent focus-ring block py-4 text-xs uppercase tracking-luxe text-primary-700"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li className="border-t border-surface-200">
                    <button
                      onClick={onLogout}
                      className="font-accent focus-ring block w-full py-4 text-left text-xs uppercase tracking-luxe text-danger-600"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li className="border-t border-surface-200 py-5">
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => toast.error('Google login failed.')}
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </li>
              )}
            </ul>

            <div className="border-t border-surface-200 px-6 py-5 text-center">
              <OmSymbol className="text-2xl text-accent-400" />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */

function Footer() {
  return (
    <footer className="bg-primary-900 text-surface-300">
      <div className="hairline-gold" />

      {/* Newsletter band */}
      <div className="border-b border-surface-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
          <div>
            <p className="eyebrow mb-3">Stay in Grace</p>
            <h2 className="font-display text-2xl font-medium text-surface-50 sm:text-3xl">
              New artworks & festival collections, first to your inbox
            </h2>
          </div>
          <NewsletterForm onDark />
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-surface-400">
            Museum-grade devotional art — posters, canvas and hand-finished
            frames of the divine, crafted to bring stillness to your home.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="focus-ring text-surface-400 transition-colors duration-400 hover:text-accent-400">
              <Instagram className="h-[18px] w-[18px]" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
              className="focus-ring text-surface-400 transition-colors duration-400 hover:text-accent-400">
              <Facebook className="h-[18px] w-[18px]" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
              className="focus-ring text-surface-400 transition-colors duration-400 hover:text-accent-400">
              <Youtube className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <nav aria-label="Shop by deity">
          <h3 className="font-accent mb-5 text-2xs font-medium uppercase tracking-luxe text-accent-500">
            Shop by Deity
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {DEITIES.slice(0, 10).map((deity) => (
              <li key={deity.slug}>
                <Link
                  to={`/products?deity=${deity.slug}`}
                  className="focus-ring text-sm text-surface-400 transition-colors duration-400 hover:text-accent-400"
                >
                  {deity.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Collections">
          <h3 className="font-accent mb-5 text-2xs font-medium uppercase tracking-luxe text-accent-500">
            Collections
          </h3>
          <ul className="space-y-2.5">
            {PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <li key={cat}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="focus-ring text-sm text-surface-400 transition-colors duration-400 hover:text-accent-400"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Customer care">
          <h3 className="font-accent mb-5 text-2xs font-medium uppercase tracking-luxe text-accent-500">
            Customer Care
          </h3>
          <ul className="space-y-2.5">
            {FOOTER_CARE_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="focus-ring text-sm text-surface-400 transition-colors duration-400 hover:text-accent-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 text-sm text-surface-500">info@ashirwaddigitals.com</li>
            <li className="text-sm text-surface-500">+91 98765 43210</li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-7 text-center sm:px-6 lg:px-8">
          <OmSymbol className="text-3xl text-accent-500" />
          <p className="font-display text-sm italic text-surface-500">
            सर्वे भवन्तु सुखिनः — May all beings be happy
          </p>
          <p className="font-accent text-2xs uppercase tracking-luxe text-surface-600">
            © {new Date().getFullYear()} Ashirwad Digitals · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
