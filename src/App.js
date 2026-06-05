import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import CookieBanner from './components/shared/CookieBanner';
import ProtectedRoute from './components/shared/ProtectedRoute';

/* ════════════════════════════════════════════════════════════════
   LAZY-LOADED SEITEN
   ════════════════════════════════════════════════════════════════ */
const HomePage = React.lazy(() => import('./pages/public/HomePage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/auth/VerifyEmailPage'));
const MarketplacePage = React.lazy(() => import('./pages/public/MarketplacePage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const LegalPage = React.lazy(() => import('./pages/legal/LegalPage'));
const DashboardPage = React.lazy(() => import('./pages/portal/DashboardPage'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/* ════════════════════════════════════════════════════════════════
   LOADING FALLBACK
   ════════════════════════════════════════════════════════════════ */
function LoadingFallback() {
  return <div className="flex items-center justify-center min-h-screen"><div className="spinner" /></div>;
}

/* ════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ════════════════════════════════════════════════════════════════ */
function PublicRoute({ children }) {
  return children;
}

function PortalLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-shell-bg)] pt-[var(--topbar-height)]">
      <div className="max-w-[var(--shell-max-width)] mx-auto px-4 sm:px-5 lg:px-6 py-6">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/portal" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
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
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal/imprint" element={<LegalPage type="imprint" />} />
            <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/legal/terms" element={<LegalPage type="terms" />} />

            {/* Auth */}
            <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/auth/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

            {/* Portal (geschützt) */}
            <Route path="/portal/*" element={
              <ProtectedRoute>
                <PortalLayout />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="/404" element={
              <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)]">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
                  <p className="text-[var(--color-text-secondary)] mb-6">Seite nicht gefunden</p>
                  <a href="/" className="btn-3d-primary px-6 py-3 rounded-[var(--radius-sm)]">Zur Startseite</a>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
