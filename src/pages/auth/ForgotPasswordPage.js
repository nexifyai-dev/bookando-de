import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import { ArrowLeft, Mail, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import apiClient, { logApiFailure } from '../../lib/apiClient';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      logApiFailure('ForgotPassword', err);
      setError(err.response?.data?.detail || t('common.error', 'Ein Fehler ist aufgetreten'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <img src="/images/brand-logo-horizontal.png" alt="Bookando"
              className="h-8 sm:h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
            {sent ? (
              <div className="text-center py-6">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{t('auth.forgot_sent_title', 'E-Mail gesendet')}</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  {t('auth.forgot_sent_text', 'Wenn diese E-Mail-Adresse registriert ist, erhältst du in Kürze einen Link zum Zurücksetzen deines Passworts.')}
                </p>
                <Link to="/auth/login"
                  className="text-[13px] text-[var(--color-primary)] font-medium hover:underline inline-flex items-center gap-2">
                  <ArrowLeft size={14} /> {t('common.back_to_login', 'Zurück zum Login')}
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
                  {t('auth.forgot_title', 'Passwort vergessen?')}
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                  {t('auth.forgot_sub', 'Wir senden dir einen Link, um dein Passwort zurückzusetzen.')}
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">
                      {t('auth.email', 'E-Mail')}
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="deine@email.de" required
                        className="w-full h-[42px] pl-10 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all"
                        data-testid="forgot-password-email-input" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-[44px] bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="forgot-password-submit-button">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {loading ? t('common.sending', 'Wird gesendet...') : t('common.submit', 'Absenden')}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/auth/login" className="text-[13px] text-[var(--color-primary)] font-medium hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={14} /> {t('common.back', 'Zurück')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden border-l border-[var(--color-divider)]"
        style={{ background: 'var(--color-primary-dark)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(1200px circle at 20% 10%, rgba(13,148,136,0.9), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(26,69,112,0.10), transparent 60%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center">
          <img src="/images/brand-logo-on-dark-full.png" alt="Bookando"
            className="h-10 w-auto object-contain mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3 font-[var(--font-heading)]">{t('brand.name', 'Bookando')}</h2>
          <p className="text-white/50 text-sm max-w-xs">{t('brand.tagline', 'Buchungs- & Sales-Plattform')}</p>
        </div>
      </div>
    </div>
  );
}
