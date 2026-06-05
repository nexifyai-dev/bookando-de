import React, { Suspense, lazy } from 'react';
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
import LoadingFallback from './components/shared/LoadingFallback';

/* ════════════════════════════════════════════════════════════════
   LAZY-LOADED SEITEN
   ════════════════════════════════════════════════════════════════ */
const HomePage = lazy(() => import('./pages/public/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const MarketplacePage = lazy(() => import('./pages/public/MarketplacePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const LegalPage = lazy(() => import('./pages/legal/LegalPage'));
const DashboardPage = lazy(() => import('./pages/portal/DashboardPage'));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

/* ════════════════════════════════════════════════════════════════
   NOTFOUND PAGE
   ════════════════════════════════════════════════════════════════ */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)]">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-8xl font-extrabold text-[var(--color-primary)] mb-2 font-[var(--font-heading)]">404</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-2">Seite nicht gefunden</p>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
        <a href="/" className="inline-flex items-center h-[48px] px-8 bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
          Zur Startseite
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PORTAL LAYOUT
   ════════════════════════════════════════════════════════════════ */
function PortalLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-shell-bg)] pt-[var(--topbar-height)]">
      <div className="max-w-[var(--shell-max-width)] mx-auto px-4 sm:px-5 lg:px-6 py-6">
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
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
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* LEGAL */}
            <Route path="/legal/imprint" element={<LegalPage type="imprint" />} />
            <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/legal/terms" element={<LegalPage type="terms" />} />

            {/* AUTH */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

            {/* PORTAL */}
            <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>} />


            {/* REDIRECTS */}
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="/legal" element={<Navigate to="/legal/imprint" replace />} />
            <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
            {/* NOTFOUND */}
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
