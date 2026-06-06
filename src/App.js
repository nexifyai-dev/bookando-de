import React, { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import CookieBanner from './components/shared/CookieBanner';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoadingFallback from './components/shared/LoadingFallback';
import { PortalShell } from './components/layout/PortalShell';
import {
  LayoutDashboard, CalendarCheck, Users, Store, Settings,
  Clock, CreditCard, BarChart3, Wallet, Link2, Palette,
  Briefcase, Repeat, Ticket, UserCircle, Shield, MessageSquare,
  DollarSign,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   LAZY-LOADED SEITEN
   ════════════════════════════════════════════════════════════════ */
const HomePage           = lazy(() => import('./pages/public/HomePage'));
const LoginPage           = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage        = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage  = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage     = lazy(() => import('./pages/auth/VerifyEmailPage'));
const MarketplacePage     = lazy(() => import('./pages/public/MarketplacePage'));
const VendorDetailPage    = lazy(() => import('./pages/public/VendorDetailPage'));
const AboutPage           = lazy(() => import('./pages/public/AboutPage'));
const ContactPage         = lazy(() => import('./pages/public/ContactPage'));
const PricingPage         = lazy(() => import('./pages/public/PricingPage'));
const LegalPage           = lazy(() => import('./pages/legal/LegalPage'));
const FeaturesPage        = lazy(() => import('./pages/public/FeaturesPage'));

const VendorDashboardPage   = lazy(() => import('./pages/vendor/VendorDashboardPage'));
const VendorBookingsPage    = lazy(() => import('./pages/vendor/VendorBookingsPage'));
const VendorServicesPage    = lazy(() => import('./pages/vendor/VendorServicesPage'));
const VendorEmployeesPage   = lazy(() => import('./pages/vendor/VendorEmployeesPage'));
const VendorLocationsPage   = lazy(() => import('./pages/vendor/VendorLocationsPage'));
const VendorHoursPage       = lazy(() => import('./pages/vendor/VendorHoursPage'));
const VendorCustomersPage   = lazy(() => import('./pages/vendor/VendorCustomersPage'));
const VendorReportsPage     = lazy(() => import('./pages/vendor/VendorReportsPage'));
const VendorWalletPage      = lazy(() => import('./pages/vendor/VendorWalletPage'));
const VendorAffiliatesPage  = lazy(() => import('./pages/vendor/VendorAffiliatesPage'));
const VendorBrandingPage    = lazy(() => import('./pages/vendor/VendorBrandingPage'));
const VendorSettingsPage    = lazy(() => import('./pages/vendor/VendorSettingsPage'));

const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerDashboardPage'));
const CustomerBookingsPage  = lazy(() => import('./pages/customer/CustomerBookingsPage'));
const CustomerRecurringPage = lazy(() => import('./pages/customer/CustomerRecurringPage'));
const CustomerVouchersPage  = lazy(() => import('./pages/customer/CustomerVouchersPage'));
const CustomerProfilePage   = lazy(() => import('./pages/customer/CustomerProfilePage'));

const FranchiserDashboardPage = lazy(() => import('./pages/franchiser/FranchiserDashboardPage'));
const FranchiserVendorsPage   = lazy(() => import('./pages/franchiser/FranchiserVendorsPage'));

/* Affiliate Portal */
const AffiliateDashboardPage   = lazy(() => import('./pages/affiliate/AffiliateDashboardPage'));
const AffiliateLinksPage       = lazy(() => import('./pages/affiliate/AffiliateLinksPage'));
const AffiliateCommissionsPage = lazy(() => import('./pages/affiliate/AffiliateCommissionsPage'));
const AffiliateWalletPage      = lazy(() => import('./pages/affiliate/AffiliateWalletPage'));
const FranchiserReportsPage   = lazy(() => import('./pages/franchiser/FranchiserReportsPage'));

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage     = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminVendorsPage   = lazy(() => import('./pages/admin/AdminVendorsPage'));
const AdminPlansPage     = lazy(() => import('./pages/admin/AdminPlansPage'));
const AdminAuditPage     = lazy(() => import('./pages/admin/AdminAuditPage'));
const AdminReviewsPage   = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminCommissionPage = lazy(() => import('./pages/admin/AdminCommissionPage'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)]">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-8xl font-extrabold text-[var(--color-primary)] mb-2 font-[var(--font-heading)]">404</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-2">Seite nicht gefunden</p>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
        <a href="/" className="inline-flex items-center h-[48px] px-8 bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">Zur Startseite</a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PUBLIC ONLY — redirect logged-in users to portal
   ════════════════════════════════════════════════════════════════ */
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w2g-spinner" /></div>;
  if (user) return <Navigate to="/portal" replace />;
  return children;
}

/* ════════════════════════════════════════════════════════════════
   PORTAL SHELLS — one per role
   ════════════════════════════════════════════════════════════════ */
function VendorPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { path: '/portal', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/portal/bookings', label: t('nav.bookings'), icon: CalendarCheck, matchPaths: ['/portal/bookings'] },
    { path: '/portal/services', label: t('nav.services'), icon: Store, matchPaths: ['/portal/services'] },
    { path: '/portal/employees', label: t('nav.employees'), icon: Users, matchPaths: ['/portal/employees'] },
    { path: '/portal/locations', label: t('nav.locations'), icon: Briefcase, matchPaths: ['/portal/locations'] },
    { path: '/portal/hours', label: t('nav.hours'), icon: Clock, matchPaths: ['/portal/hours'] },
    { path: '/portal/customers', label: t('nav.customers'), icon: UserCircle, matchPaths: ['/portal/customers'] },
    { path: '/portal/reports', label: t('nav.reports'), icon: BarChart3, matchPaths: ['/portal/reports'] },
    { path: '/portal/wallet', label: t('nav.wallet'), icon: Wallet, matchPaths: ['/portal/wallet'] },
    { path: '/portal/affiliates', label: t('nav.affiliates'), icon: Link2, matchPaths: ['/portal/affiliates'] },
    { path: '/portal/branding', label: t('nav.branding'), icon: Palette, matchPaths: ['/portal/branding'] },
    { path: '/portal/settings', label: t('nav.settings'), icon: Settings, matchPaths: ['/portal/settings'] },
  ], []);
  return (
    <PortalShell portalName={t('portal.name_vendor', 'Vendor')} navItems={navItems}
      mobileBottomNav={navItems.filter(i => ['/portal','/portal/bookings','/portal/services','/portal/settings'].includes(i.path))}
      user={user} onLogout={logout}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function CustomerPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { path: '/portal', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/portal/bookings', label: t('nav.bookings'), icon: CalendarCheck, matchPaths: ['/portal/bookings'] },
    { path: '/portal/recurring', label: t('nav.recurring'), icon: Repeat, matchPaths: ['/portal/recurring'] },
    { path: '/portal/vouchers', label: t('nav.vouchers'), icon: Ticket, matchPaths: ['/portal/vouchers'] },
    { path: '/portal/profile', label: t('nav.profile'), icon: UserCircle, matchPaths: ['/portal/profile'] },
  ], []);
  return (
    <PortalShell portalName={t('portal.name_vendor', 'Vendor')} navItems={navItems}
      mobileBottomNav={navItems.filter(i => ['/portal','/portal/bookings','/portal/vouchers','/portal/profile'].includes(i.path))}
      user={user} onLogout={logout}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function AffiliatePortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { path: '/portal', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/portal/links', label: t('nav.links', 'Trackinglinks'), icon: Link2, matchPaths: ['/portal/links'] },
    { path: '/portal/commissions', label: t('nav.commissions', 'Provisionen'), icon: Wallet, matchPaths: ['/portal/commissions'] },
    { path: '/portal/wallet', label: t('nav.wallet'), icon: Wallet, matchPaths: ['/portal/wallet'] },
  ], [t]);
  return (
    <PortalShell portalName="Affiliate" navItems={navItems}
      mobileBottomNav={navItems.filter(i => ['/portal','/portal/links','/portal/wallet'].includes(i.path))}
      user={user} onLogout={logout}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function FranchiserPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { path: '/portal', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/portal/vendors', label: t('nav.vendors'), icon: Store, matchPaths: ['/portal/vendors'] },
    { path: '/portal/reports', label: t('nav.reports'), icon: BarChart3, matchPaths: ['/portal/reports'] },
    { path: '/portal/settings', label: t('nav.settings'), icon: Settings, matchPaths: ['/portal/settings'] },
  ], []);
  return (
    <PortalShell portalName={t('portal.name_vendor', 'Vendor')} navItems={navItems}
      mobileBottomNav={navItems} user={user} onLogout={logout}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function AdminPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { path: '/portal', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/portal/users', label: t('nav.users'), icon: Users, matchPaths: ['/portal/users'] },
    { path: '/portal/vendors', label: t('nav.vendors'), icon: Store, matchPaths: ['/portal/vendors'] },
    { path: '/portal/plans', label: t('nav.plans'), icon: CreditCard, matchPaths: ['/portal/plans'] },
    { path: '/portal/audit', label: t('nav.audit'), icon: Shield, matchPaths: ['/portal/audit'] },
    { path: '/portal/reviews', label: t('nav.reviews'), icon: MessageSquare, matchPaths: ['/portal/reviews'] },
    { path: '/portal/commissions', label: t('nav.commissions', 'Provisionen'), icon: Wallet, matchPaths: ['/portal/commissions'] },
    { path: '/portal/settings', label: t('nav.settings'), icon: Settings, matchPaths: ['/portal/settings'] },
  ], []);
  return (
    <PortalShell portalName={t('portal.name_vendor', 'Vendor')} navItems={navItems}
      mobileBottomNav={navItems.filter(i => ['/portal','/portal/users','/portal/vendors','/portal/settings'].includes(i.path))}
      user={user} onLogout={logout}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

/* ════════════════════════════════════════════════════════════════
   PORTAL LAYOUT — role-based dispatcher
   ════════════════════════════════════════════════════════════════ */
function PortalLayout() {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  // Which shell + which child component to render
  let Shell, Child;
  const path = window.location.pathname;

  if (role === 'admin') {
    Shell = AdminPortal;
    if (path === '/portal' || path === '/portal/') Child = AdminDashboardPage;
    else if (path.startsWith('/portal/users')) Child = AdminUsersPage;
    else if (path.startsWith('/portal/vendors')) Child = AdminVendorsPage;
    else if (path.startsWith('/portal/plans')) Child = AdminPlansPage;
    else if (path.startsWith('/portal/audit')) Child = AdminAuditPage;
    else if (path.startsWith('/portal/reviews')) Child = AdminReviewsPage;
    else if (path.startsWith('/portal/commissions')) Child = AdminCommissionPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else Child = NotFoundPage;
  } else if (role === 'vendor' || role === 'staff') {
    Shell = VendorPortal;
    if (path === '/portal' || path === '/portal/') Child = VendorDashboardPage;
    else if (path.startsWith('/portal/bookings')) Child = VendorBookingsPage;
    else if (path.startsWith('/portal/services')) Child = VendorServicesPage;
    else if (path.startsWith('/portal/employees')) Child = VendorEmployeesPage;
    else if (path.startsWith('/portal/locations')) Child = VendorLocationsPage;
    else if (path.startsWith('/portal/hours')) Child = VendorHoursPage;
    else if (path.startsWith('/portal/customers')) Child = VendorCustomersPage;
    else if (path.startsWith('/portal/reports')) Child = VendorReportsPage;
    else if (path.startsWith('/portal/wallet')) Child = VendorWalletPage;
    else if (path.startsWith('/portal/affiliates')) Child = VendorAffiliatesPage;
    else if (path.startsWith('/portal/branding')) Child = VendorBrandingPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else Child = NotFoundPage;
  } else if (role === 'affiliate') {
    Shell = AffiliatePortal;
    if (path === '/portal' || path === '/portal/') Child = AffiliateDashboardPage;
    else if (path.startsWith('/portal/links')) Child = AffiliateLinksPage;
    else if (path.startsWith('/portal/commissions')) Child = AffiliateCommissionsPage;
    else if (path.startsWith('/portal/wallet')) Child = AffiliateWalletPage;
    else Child = NotFoundPage;
  } else if (role === 'franchiser') {
    Shell = FranchiserPortal;
    if (path === '/portal' || path === '/portal/') Child = FranchiserDashboardPage;
    else if (path.startsWith('/portal/vendors')) Child = FranchiserVendorsPage;
    else if (path.startsWith('/portal/reports')) Child = FranchiserReportsPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else Child = NotFoundPage;
  } else {
    // customer
    Shell = CustomerPortal;
    if (path === '/portal' || path === '/portal/') Child = CustomerDashboardPage;
    else if (path.startsWith('/portal/bookings')) Child = CustomerBookingsPage;
    else if (path.startsWith('/portal/recurring')) Child = CustomerRecurringPage;
    else if (path.startsWith('/portal/vouchers')) Child = CustomerVouchersPage;
    else if (path.startsWith('/portal/profile')) Child = CustomerProfilePage;
    else if (path.startsWith('/portal/settings')) Child = CustomerProfilePage;
    else Child = NotFoundPage;
  }

  return <Shell><Child /></Shell>;
}

/* ════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <ErrorBoundary>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <Toaster position="top-right" richColors closeButton duration={3500} />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:slug" element={<VendorDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* LEGAL */}
            <Route path="/legal/imprint" element={<LegalPage type="imprint" />} />
            <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/legal/terms" element={<LegalPage type="terms" />} />
            <Route path="/legal/cookies" element={<LegalPage type="cookies" />} />

            {/* REDIRECTS */}
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="/legal" element={<Navigate to="/legal/imprint" replace />} />
            <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
            <Route path="/cookies" element={<Navigate to="/legal/cookies" replace />} />
            <Route path="/dashboard" element={<Navigate to="/portal" replace />} />

            {/* AUTH (public only) */}
            <Route path="/auth/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/auth/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
            <Route path="/auth/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

            {/* PROTECTED PORTAL */}
            <Route path="/portal/*" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
