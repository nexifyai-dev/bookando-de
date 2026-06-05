import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import SEOHead from '../../components/shared/SEOHead';
import { MailCheck, Briefcase } from 'lucide-react';

export default function VerifyEmailPage() {
  const { t: _t } = useTranslation();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  return (
    <>
    <SEOHead title="Bookando – E-Mail verifizieren" description="Bestätige deine E-Mail-Adresse für dein Bookando-Konto." />
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)] px-6">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
          <img src="/images/brand-logo-horizontal.png" alt="Bookando"
            className="h-8 sm:h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
        </Link>

        <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
            {status === 'success' ? (
              <MailCheck size={32} style={{ color: 'var(--color-accent)' }} />
            ) : (
              <MailCheck size={32} className="text-[var(--color-text-tertiary)]" />
            )}
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
            {status === 'success' ? 'E-Mail bestätigt!' : 'E-Mail bestätigen'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            {status === 'success'
              ? 'Deine E-Mail-Adresse wurde erfolgreich bestätigt.'
              : 'Bitte überprüfe dein E-Mail-Postfach.'}
          </p>
          <Link to={status === 'success' ? '/auth/login' : '/'}
            className="inline-flex items-center h-[44px] px-8 bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
            {status === 'success' ? 'Zum Login' : 'Zur Startseite'}
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
