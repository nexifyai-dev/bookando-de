import React, { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PortalProvider, usePortal } from './contexts/PortalContext';
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
const VendorCalendarPage    = lazy(() => import('./pages/vendor/VendorCalendarPage'));
const VendorResourcesPage   = lazy(() => import('./pages/vendor/VendorResourcesPage'));
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

/* Staff Portal */
const StaffDashboardPage    = lazy(() => import('./pages/staff/StaffDashboardPage'));
const StaffAppointmentsPage = lazy(() => import('./pages/staff/StaffAppointmentsPage'));
const StaffCalendarPage     = lazy(() => import('./pages/staff/StaffCalendarPage'));
const StaffAvailabilityPage = lazy(() => import('./pages/staff/StaffAvailabilityPage'));
const StaffCustomersPage    = lazy(() => import('./pages/staff/StaffCustomersPage'));
const StaffNotesPage        = lazy(() => import('./pages/staff/StaffNotesPage'));
const StaffProfilePage      = lazy(() => import('./pages/staff/StaffProfilePage'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true, refetchOnReconnect: true } },
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
  const { navItems } = usePortal();

  // Mobile-Bottom-Nav als gefilterte Teilmenge der rollenbasierten navItems
  const mobileBottomNav = useMemo(
    () => navItems.filter((i) => ['/portal', '/portal/bookings', '/portal/services', '/portal/settings'].includes(i.path)),
    [navItems],
  );

  return (
    <PortalShell
      portalName={t('portal.name_vendor', 'Vendor')}
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function CustomerPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { navItems } = usePortal();

  const mobileBottomNav = useMemo(
    () => navItems.filter((i) => ['/portal', '/portal/bookings', '/portal/vouchers', '/portal/profile'].includes(i.path)),
    [navItems],
  );

  return (
    <PortalShell
      portalName={t('portal.name_customer', 'Mein Bereich')}
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function AffiliatePortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { navItems } = usePortal();

  const mobileBottomNav = useMemo(
    () => navItems.filter((i) => ['/portal', '/portal/links', '/portal/wallet'].includes(i.path)),
    [navItems],
  );

  return (
    <PortalShell
      portalName={t('portal.name_affiliate', 'Affiliate')}
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function FranchiserPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { navItems } = usePortal();

  return (
    <PortalShell
      portalName={t('portal.name_franchiser', 'Franchise')}
      navItems={navItems}
      mobileBottomNav={navItems}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function StaffPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { navItems } = usePortal();

  const mobileBottomNav = useMemo(
    () => navItems.filter((i) => ['/portal/staff', '/portal/staff/appointments', '/portal/staff/calendar', '/portal/staff/profile'].includes(i.path)),
    [navItems],
  );

  return (
    <PortalShell
      portalName={t('portal.name_staff', 'Mitarbeiter')}
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

function AdminPortal({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { navItems } = usePortal();

  const mobileBottomNav = useMemo(
    () => navItems.filter((i) => ['/portal', '/portal/users', '/portal/vendors', '/portal/settings'].includes(i.path)),
    [navItems],
  );

  return (
    <PortalShell
      portalName={t('portal.name_admin', 'Admin')}
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={user}
      onLogout={logout}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </PortalShell>
  );
}

/* ════════════════════════════════════════════════════════════════
   PORTAL LAYOUT — reaktiver, rollenbasierter Dispatcher
   ════════════════════════════════════════════════════════════════
   Frühere Bug-Quelle: las `window.location.pathname` und `user.role`
   zum Mount-Zeitpunkt — bei Rollenwechsel sah man erst nach Browser-
   Refresh den neuen Kontext.

   Fix:
   - useLocation() → reagiert auf Navigation
   - useAuth().activeRole → reagiert auf Rollen-/Tenant-Wechsel
   - defaultRoute via usePortal() → bei verbotener Route automatischer
     Redirect ohne window.location.reload
   ════════════════════════════════════════════════════════════════ */
function PortalLayout() {
  const location = useLocation();
  const { activeRole, user, isReady } = useAuth();
  const { defaultRoute } = usePortal();
  const path = location.pathname;

  // Auth noch nicht bereit → Loading, kein Child-Render
  if (!isReady || !user) {
    return <LoadingFallback />;
  }

  // /portal ohne Subroute → defaultRoute redirecten (kein Hard-Reload!)
  if (path === '/portal' || path === '/portal/') {
    return <Navigate to={defaultRoute} replace />;
  }

  let Shell, Child;

  if (activeRole === 'admin' || activeRole === 'super_admin') {
    Shell = AdminPortal;
    if (path.startsWith('/portal/admin')) Child = AdminDashboardPage;
    else if (path.startsWith('/portal/users')) Child = AdminUsersPage;
    else if (path.startsWith('/portal/vendors')) Child = AdminVendorsPage;
    else if (path.startsWith('/portal/plans')) Child = AdminPlansPage;
    else if (path.startsWith('/portal/audit')) Child = AdminAuditPage;
    else if (path.startsWith('/portal/reviews')) Child = AdminReviewsPage;
    else if (path.startsWith('/portal/commissions')) Child = AdminCommissionPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else if (path.startsWith('/portal')) Child = AdminDashboardPage;
    else Child = NotFoundPage;
  } else if (activeRole === 'staff') {
    Shell = StaffPortal;
    if (path.startsWith('/portal/staff/appointments')) Child = StaffAppointmentsPage;
    else if (path.startsWith('/portal/staff/calendar')) Child = StaffCalendarPage;
    else if (path.startsWith('/portal/staff/availability')) Child = StaffAvailabilityPage;
    else if (path.startsWith('/portal/staff/customers')) Child = StaffCustomersPage;
    else if (path.startsWith('/portal/staff/notes')) Child = StaffNotesPage;
    else if (path.startsWith('/portal/staff/profile')) Child = StaffProfilePage;
    else if (path.startsWith('/portal/staff')) Child = StaffDashboardPage;
    else Child = NotFoundPage;
  } else if (activeRole === 'vendor') {
    if (path.startsWith('/portal/bookings')) Child = VendorBookingsPage;
    else if (path.startsWith('/portal/calendar')) Child = VendorCalendarPage;
    else if (path.startsWith('/portal/services')) Child = VendorServicesPage;
    else if (path.startsWith('/portal/employees')) Child = VendorEmployeesPage;
    else if (path.startsWith('/portal/locations')) Child = VendorLocationsPage;
    else if (path.startsWith('/portal/hours')) Child = VendorHoursPage;
    else if (path.startsWith('/portal/resources')) Child = VendorResourcesPage;
    else if (path.startsWith('/portal/customers')) Child = VendorCustomersPage;
    else if (path.startsWith('/portal/reports')) Child = VendorReportsPage;
    else if (path.startsWith('/portal/wallet')) Child = VendorWalletPage;
    else if (path.startsWith('/portal/affiliates')) Child = VendorAffiliatesPage;
    else if (path.startsWith('/portal/branding')) Child = VendorBrandingPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else if (path.startsWith('/portal')) Child = VendorDashboardPage;
    else Child = NotFoundPage;
  } else if (activeRole === 'affiliate') {
    Shell = AffiliatePortal;
    if (path.startsWith('/portal/links')) Child = AffiliateLinksPage;
    else if (path.startsWith('/portal/commissions')) Child = AffiliateCommissionsPage;
    else if (path.startsWith('/portal/wallet')) Child = AffiliateWalletPage;
    else if (path.startsWith('/portal')) Child = AffiliateDashboardPage;
    else Child = NotFoundPage;
  } else if (activeRole === 'franchiser') {
    Shell = FranchiserPortal;
    if (path.startsWith('/portal/vendors')) Child = FranchiserVendorsPage;
    else if (path.startsWith('/portal/reports')) Child = FranchiserReportsPage;
    else if (path.startsWith('/portal/settings')) Child = VendorSettingsPage;
    else if (path.startsWith('/portal')) Child = FranchiserDashboardPage;
    else Child = NotFoundPage;
  } else {
    // customer (default)
    Shell = CustomerPortal;
    if (path.startsWith('/portal/bookings')) Child = CustomerBookingsPage;
    else if (path.startsWith('/portal/recurring')) Child = CustomerRecurringPage;
    else if (path.startsWith('/portal/vouchers')) Child = CustomerVouchersPage;
    else if (path.startsWith('/portal/profile')) Child = CustomerProfilePage;
    else if (path.startsWith('/portal/settings')) Child = CustomerProfilePage;
    else if (path.startsWith('/portal')) Child = CustomerDashboardPage;
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
        <PortalProvider>
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
        </PortalProvider>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
