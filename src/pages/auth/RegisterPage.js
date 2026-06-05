import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)] px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[var(--color-primary)] flex items-center justify-center rounded-[var(--radius-md)]">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold font-[var(--font-heading)] tracking-tight text-[var(--color-primary)]">
              Design Template
            </span>
          </Link>
        </div>

        {/* Formular-Platzhalter */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
            {t('nav.register', 'Registrieren')}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Erstelle ein neues Konto.
          </p>

          {/* Platzhalter für Register-Formular */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">Name</label>
              <div className="h-[42px] rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-[var(--color-surface-sunken)] flex items-center px-3">
                <span className="text-sm text-[var(--color-text-tertiary)]">Dein Name</span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">E-Mail</label>
              <div className="h-[42px] rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-[var(--color-surface-sunken)] flex items-center px-3">
                <span className="text-sm text-[var(--color-text-tertiary)]">deine@email.de</span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">Passwort</label>
              <div className="h-[42px] rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-[var(--color-surface-sunken)] flex items-center px-3">
                <span className="text-sm text-[var(--color-text-tertiary)]">••••••••</span>
              </div>
            </div>
            <button type="button"
              className="w-full h-[44px] bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity mt-2">
              {t('nav.register', 'Registrieren')}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              Bereits registriert?{' '}
              <Link to="/auth/login" className="text-[var(--color-primary)] font-medium hover:underline">
                {t('nav.login', 'Anmelden')}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors">
            <ArrowLeft size={14} /> Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
