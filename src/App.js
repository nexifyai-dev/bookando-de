import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import CookieBanner from './components/shared/CookieBanner';

/* ════════════════════════════════════════════════════════════════
   SEITEN IMPORTIEREN — Hier eigene Seiten ergänzen!
   ════════════════════════════════════════════════════════════════ */
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// const queryClient = new QueryClient();

/* ════════════════════════════════════════════════════════════════
   ROUTEN-KONFIGURATION — Einfach erweiterbar
   ════════════════════════════════════════════════════════════════ */
const PUBLIC_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/features', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">Features Seite</div> },
  { path: '/about', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">Über uns Seite</div> },
  { path: '/contact', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">Kontakt Seite</div> },
  { path: '/privacy', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">Datenschutz</div> },
  { path: '/legal', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">Impressum</div> },
  { path: '/terms', element: <div className="p-12 text-center text-[var(--color-text-secondary)]">AGB</div> },
];

const AUTH_ROUTES = [
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/register', element: <RegisterPage /> },
];

export default function App() {
  return (
    <ErrorBoundary>
    <HelmetProvider>
    {/* <QueryClientProvider client={queryClient}> */}
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <Toaster position="top-right" richColors closeButton duration={3000} />
        <Routes>
          {/* Öffentliche Seiten */}
          {PUBLIC_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Auth-Seiten */}
          {AUTH_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Catch-all → Startseite */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    {/* </QueryClientProvider> */}
    </HelmetProvider>
    </ErrorBoundary>
  );
}
