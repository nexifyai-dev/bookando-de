import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, formatApiError } from '../../contexts/AuthContext';
import { Loader2, AlertCircle, ShieldCheck, ArrowLeft, Briefcase, Building2 } from 'lucide-react';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [step, setStep] = useState('credentials');
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const tryLogin = async (totpCode = null) => {
    const user = await login(form.email, form.password, totpCode);
    const target = location.state?.from || '/dashboard';
    navigate(target, { replace: true });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await tryLogin();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === 'totp_required') {
        setStep('totp');
        setError('');
      } else if (detail === 'invalid_totp') {
        setError(t('auth.invalid_totp'));
      } else {
        setError(formatApiError(detail) || t('auth.login_failed'));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleTotpSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await tryLogin(totp.trim());
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === 'invalid_totp') setError(t('auth.invalid_totp'));
      else setError(formatApiError(detail) || t('auth.login_failed'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left Panel — Form */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Top bar with language switcher */}
        <div className="flex items-center justify-between px-6 py-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group" data-testid="login-brand">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white group-hover:scale-105 transition-transform">
              <span className="font-bold text-xs tracking-wider">AP</span>
            </div>
            <span className="font-heading font-bold text-[var(--color-primary)] text-base tracking-tight">
              Bookando
            </span>
          </Link>
          <LanguageSwitcher tone="light" />
        </div>
        {/* Form center */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary)] tracking-tight" data-testid="login-title">
                {step === 'totp' ? t('auth.totp_title') : t('auth.login_title')}
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-2">
                {step === 'totp' ? t('auth.totp_sub') : t('auth.login_sub')}
              </p>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-card p-6 md:p-7">
              {error && (
                <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-md p-3 flex items-center gap-2 text-red-700 text-sm mb-4" data-testid="login-error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {step === 'credentials' ? (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('auth.email')}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      autoComplete="email"
                      placeholder="deine@email.de"
                      data-testid="login-email-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">{t('auth.password')}</label>
                      <Link to="/auth/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline font-medium transition-colors duration-150" data-testid="login-forgot-link">
                        {t('auth.forgot_pw')}
                      </Link>
                    </div>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      data-testid="login-password-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="login-submit-btn"
                    className="w-full bg-[var(--color-primary)] text-white font-semibold py-2.5 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {t('auth.login_btn')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTotpSubmit} className="space-y-4" data-testid="login-totp-form">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-md p-3">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('auth.totp_hint')}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('auth.totp_label')}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9A-Z\-]*"
                      value={totp}
                      onChange={(e) => setTotp(e.target.value.toUpperCase())}
                      required
                      autoFocus
                      data-testid="login-totp-input"
                      placeholder="000000 oder XXXX-XXXX"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-center text-lg font-mono tracking-widest bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                    <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">{t('auth.totp_or_backup')}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !totp.trim()}
                    data-testid="login-totp-submit"
                    className="w-full bg-[var(--color-primary)] text-white font-semibold py-2.5 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {t('auth.totp_verify_btn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setTotp(''); setError(''); }}
                    data-testid="login-totp-back"
                    className="w-full text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={12} /> {t('common.back')}
                  </button>
                </form>
              )}
              {step === 'credentials' && (
                <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
                  {t('auth.no_account')}{' '}
                  <Link to="/auth/register" className="text-[var(--color-primary)] font-semibold hover:underline" data-testid="login-register-link">
                    {t('auth.register_link')}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel — Brand Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-dark)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-8 shadow-xl border border-white/10">
            <Briefcase size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-heading">Bookando</h2>
          <p className="text-white/70 text-base max-w-md leading-relaxed">
            Willkommen beim Bookando — Ihrer Plattform für digitale Vernetzung, Marktplatzlösungen und lokale Geschäftsbeziehungen in der Region Aachen.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Building2 size={16} />
              <span>Aachen | Digital | Vernetzt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
