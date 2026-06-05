import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, formatApiError } from '../../contexts/AuthContext';
import { Loader2, AlertCircle, User, Building2, Check, Briefcase } from 'lucide-react';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'customer',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError(t('auth.password_min'));
      return;
    }
    if (form.password !== form.password2) {
      setError(t('auth.password_mismatch'));
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        email: form.email,
        password: form.password,
        role: form.role,
        first_name: form.first_name,
        last_name: form.last_name,
        company_name: form.role === 'vendor' ? form.company_name : undefined,
        language: (i18n.language || 'de').split('-')[0],
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || t('auth.register_failed'));
    } finally {
      setLoading(false);
    }
  };
  const updateField = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="min-h-screen flex" data-testid="register-page">
      {/* Left Panel — Form */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Top bar with language switcher */}
        <div className="flex items-center justify-between px-6 py-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group" data-testid="register-brand">
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
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary)] tracking-tight" data-testid="register-title">
                {t('auth.register_title')}
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                {t('auth.register_sub')}
              </p>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-card p-6">
              {error && (
                <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-md p-3 flex items-center gap-2 text-red-700 text-sm mb-4" data-testid="register-error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
                {/* Role Picker */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">{t('auth.role')}</label>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup">
                    <RoleCard
                      active={form.role === 'customer'}
                      icon={User}
                      title={t('auth.role_customer')}
                      desc={t('auth.role_customer_desc')}
                      onClick={() => setForm(p => ({ ...p, role: 'customer' }))}
                      testid="role-customer"
                    />
                    <RoleCard
                      active={form.role === 'vendor'}
                      icon={Building2}
                      title={t('auth.role_vendor')}
                      desc={t('auth.role_vendor_desc')}
                      onClick={() => setForm(p => ({ ...p, role: 'vendor' }))}
                      testid="role-vendor"
                    />
                  </div>
                </div>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.first_name')}</label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={updateField('first_name')}
                      required
                      data-testid="register-firstname-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.last_name')}</label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={updateField('last_name')}
                      required
                      data-testid="register-lastname-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                </div>
                {/* Company Name (only for vendors) */}
                {form.role === 'vendor' && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.company_name')}</label>
                    <input
                      type="text"
                      value={form.company_name}
                      onChange={updateField('company_name')}
                      required
                      data-testid="register-company-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                )}
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    required
                    autoComplete="email"
                    data-testid="register-email-input"
                    className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                  />
                </div>
                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.password')}</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={updateField('password')}
                      required
                      autoComplete="new-password"
                      placeholder="min. 8"
                      data-testid="register-password-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">{t('auth.confirm_password')}</label>
                    <input
                      type="password"
                      value={form.password2}
                      onChange={updateField('password2')}
                      required
                      autoComplete="new-password"
                      data-testid="register-password2-input"
                      className="w-full border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="register-submit-btn"
                  className="w-full bg-[var(--color-primary)] text-white font-semibold py-2.5 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {t('auth.register_btn')}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
                {t('auth.have_account')}{' '}
                <Link to="/auth/login" className="text-[var(--color-primary)] font-medium hover:underline" data-testid="register-login-link">
                  {t('auth.login_link')}
                </Link>
              </p>
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
            Treten Sie bei und werden Sie Teil des Bookando. Wählen Sie Ihre Rolle — als Kunde oder Anbieter — und starten Sie noch heute.
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
function RoleCard({ active, icon: Icon, title, desc, onClick, testid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={active}
      data-testid={testid}
      className={`relative text-left p-3 rounded-md border-2 transition-all ${
        active
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40'
      }`}
    >
      {active && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </span>
      )}
      <Icon size={18} className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]'} />
      <p className={`font-medium text-sm mt-2 ${active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
        {title}
      </p>
      <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 leading-snug">{desc}</p>
    </button>
  );
}
