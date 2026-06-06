import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const isSuccess = status === 'success';

  return (
    <>
      <SEOHead
        title={t('auth.verify_title', 'Bookando – E-Mail verifizieren')}
        description={t('auth.verify_desc', 'Bestätige deine E-Mail-Adresse für dein Bookando-Konto.')}
      />
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)] px-6" data-testid="verify-email-page">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group" data-testid="verify-email-logo">
            <img src="/images/brand-logo-horizontal.png" alt="Bookando"
              className="h-8 sm:h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: isSuccess ? 'var(--color-accent-muted)' : 'var(--color-accent-subtle)' }}>
              <MailCheck size={32} style={{ color: isSuccess ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }} />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
              {isSuccess ? t('auth.verify_success', 'E-Mail bestätigt!') : t('auth.verify_title', 'E-Mail bestätigen')}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              {isSuccess
                ? t('auth.verify_success_text', 'Deine E-Mail-Adresse wurde erfolgreich bestätigt.')
                : t('auth.verify_prompt', 'Bitte überprüfe dein E-Mail-Postfach.')}
            </p>
            <Link to={isSuccess ? '/auth/login' : '/'}
              className="inline-flex items-center h-[44px] px-8 bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              data-testid={isSuccess ? 'verify-email-goto-login' : 'verify-email-goto-home'}>
              {isSuccess ? t('auth.verify_goto_login', 'Zum Login') : t('common.back_to_home', 'Zur Startseite')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
