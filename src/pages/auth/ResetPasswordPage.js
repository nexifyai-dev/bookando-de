import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import { Lock, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import apiClient from '../../lib/apiClient';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Supabase schickt Token im URL-Hash: #access_token=xxx&type=recovery
  // Zusätzlich Query-Parameter unterstützen: ?token=xxx&access_token=xxx
  const hashToken = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.hash.replace('#', '')).get('access_token')
    : null;
  const token = searchParams.get('token') || searchParams.get('access_token') || hashToken || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(t('auth.password_min', 'Passwort muss mindestens 8 Zeichen lang sein'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.password_mismatch', 'Passwörter stimmen nicht überein'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/api/auth/reset-password', { token, new_password: password });
      setSuccess(true);
      setTimeout(() => navigate('/auth/login', { replace: true }), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.reset_failed', 'Token ungültig oder abgelaufen. Bitte fordere einen neuen Link an.'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold mb-4">{t('auth.reset_invalid', 'Ungültiger oder fehlender Reset-Token')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {t('auth.reset_request_new', 'Bitte fordere einen neuen Link zum Zurücksetzen deines Passworts an.')}
          </p>
          <Link to="/auth/forgot-password"
            className="inline-flex items-center gap-2 px-6 h-[44px] bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90">
            {t('auth.forgot_link', 'Passwort zurücksetzen anfordern')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
            <img src="/logo192.png" alt="Bookando" className="w-10 h-10 rounded-[var(--radius-md)] object-cover shadow-sm" />
            <span className="text-lg font-bold font-[var(--font-heading)] tracking-tight text-[var(--color-primary)]">Bookando</span>
          </Link>

          <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e2)]">
            {success ? (
              <div className="text-center py-6">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{t('auth.reset_success', 'Passwort geändert!')}</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {t('auth.reset_redirecting', 'Du wirst zum Login weitergeleitet...')}
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
                  {t('auth.reset_title', 'Neues Passwort setzen')}
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                  {t('auth.reset_sub', 'Wähle ein neues sicheres Passwort.')}
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">
                      {t('auth.new_password', 'Neues Passwort')}
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" required minLength={8}
                        className="w-full h-[42px] pl-10 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all"
                        data-testid="reset-password-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">
                      {t('auth.confirm_password', 'Passwort bestätigen')}
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="••••••••" required minLength={8}
                        className="w-full h-[42px] pl-10 pr-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all"
                        data-testid="reset-password-confirm-input" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-[44px] bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="reset-password-submit-button">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {loading ? t('common.saving', 'Wird gespeichert...') : t('common.submit', 'Absenden')}
                  </button>
                </form>
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
          <div className="w-16 h-16 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-6 shadow-lg border border-white/10 p-1.5 overflow-hidden">
            <img src="/logo192.png" alt="Bookando" className="w-full h-full object-contain opacity-80" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 font-[var(--font-heading)]">{t('brand.name', 'Bookando')}</h2>
          <p className="text-white/50 text-sm max-w-xs">{t('brand.tagline', 'Buchungs- & Sales-Plattform')}</p>
        </div>
      </div>
    </div>
  );
}
