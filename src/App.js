import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import CookieBanner from './components/shared/CookieBanner';

/* ════════════════════════════════════════════════════════════════
   SEITEN IMPORTIEREN
   ════════════════════════════════════════════════════════════════ */
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import MarketplacePage from './pages/public/MarketplacePage';
import ContactPage from './pages/public/ContactPage';
import LegalPage from './pages/legal/LegalPage';
import DashboardPage from './pages/portal/DashboardPage';
import ProtectedRoute from './components/shared/ProtectedRoute';

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
   PUBLIC ROUTES
   ════════════════════════════════════════════════════════════════ */
function PublicRoute({ children }) {
  return children;
}

function PortalLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-shell-bg)] pt-[var(--topbar-height)]">
      <div className="max-w-[var(--shell-max-width)] mx-auto px-4 sm:px-5 lg:px-6 py-6">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
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
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
