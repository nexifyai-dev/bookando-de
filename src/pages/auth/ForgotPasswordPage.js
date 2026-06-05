import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Briefcase } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Left - Form */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-[var(--color-primary)] flex items-center justify-center rounded-[var(--radius-md)]">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold font-[var(--font-heading)] tracking-tight text-[var(--color-primary)]">
              Bookando
            </span>
          </Link>

          <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
              {t('auth.forgot_title', 'Passwort vergessen?')}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              {t('auth.forgot_sub', 'Wir senden dir einen Link, um dein Passwort zurückzusetzen.')}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">
                  {t('auth.email', 'E-Mail')}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input type="email" placeholder="deine@email.de"
                    className="w-full h-[42px] pl-10 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all"
                    data-testid="forgot-password-email-input" />
                </div>
              </div>
              <button type="button" data-testid="forgot-password-submit-button"
                className="w-full h-[44px] bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
                {t('common.submit', 'Absenden')}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/auth/login" className="text-[13px] text-[var(--color-primary)] font-medium hover:underline inline-flex items-center gap-2">
                <ArrowLeft size={14} /> {t('common.back', 'Zurück')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Brand Panel */}
      <div className="hidden lg:block relative overflow-hidden border-l border-[var(--color-divider)]"
        style={{ background: 'var(--color-primary-dark)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(1200px circle at 20% 10%, rgba(13,148,136,0.9), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(26,69,112,0.10), transparent 60%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center">
          <Briefcase size={48} className="text-white/20 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3 font-[var(--font-heading)]">
            {t('brand.name', 'Bookando')}
          </h2>
          <p className="text-white/50 text-sm max-w-xs">
            {t('brand.tagline', 'Buchungs- & Sales-Plattform')}
          </p>
          <div className="flex gap-2 mt-8">
            <span className="px-3 py-1 text-[11px] font-medium rounded-full border border-white/10 text-white/50">Sicher</span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full border border-white/10 text-white/50">Rollenbasiert</span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full border border-white/10 text-white/50">Schnell</span>
          </div>
        </div>
      </div>
    </div>
  );
}
