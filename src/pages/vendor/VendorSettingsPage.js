import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings, User, Lock, Smartphone, Bell, Globe, Loader2, AlertCircle, Check, Eye, EyeOff, ShieldCheck, AlertTriangle
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { TwoFactorApi } from '../../lib/api';
import { toast } from 'sonner';

export default function VendorSettingsPage() {
  const { t, i18n } = useTranslation();

  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Password
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  // 2FA
  const [twoFactor, setTwoFactor] = useState({ enabled: false, setupData: null });
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Notifications
  const [notifSettings, setNotifSettings] = useState({
    email_bookings: true,
    email_reminders: true,
    email_marketing: false,
    push_bookings: true,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [meRes, twoFaRes] = await Promise.allSettled([
          apiClient.get('/api/auth/me').then(r => r.data),
          TwoFactorApi.status(),
        ]);
        if (!cancelled) {
          if (meRes.status === 'fulfilled' && meRes.value) {
            setProfile({
              first_name: meRes.value.first_name || '',
              last_name: meRes.value.last_name || '',
              email: meRes.value.email || '',
              phone: meRes.value.phone || '',
            });
            if (meRes.value.notification_settings) {
              setNotifSettings(prev => ({ ...prev, ...meRes.value.notification_settings }));
            }
          }
          if (twoFaRes.status === 'fulfilled') {
            setTwoFactor(prev => ({ ...prev, enabled: twoFaRes.value.enabled || false }));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.settings.load_error', 'Fehler beim Laden der Einstellungen.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/api/auth/me', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
      });
      toast.success(t('vendor.settings.profile_saved', 'Profil aktualisiert.'));
    } catch (err) {
      toast.error(err.message || t('vendor.settings.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) {
      toast.error(t('vendor.settings.pw_mismatch', 'Passwörter stimmen nicht überein.'));
      return;
    }
    if (pwForm.new.length < 8) {
      toast.error(t('vendor.settings.pw_length', 'Mindestens 8 Zeichen.'));
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/api/auth/change-password', {
        current_password: pwForm.current,
        new_password: pwForm.new,
      });
      toast.success(t('vendor.settings.pw_changed', 'Passwort geändert.'));
      setPwForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || t('vendor.settings.pw_error', 'Fehler beim Ändern des Passworts.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const data = await TwoFactorApi.setup();
      setTwoFactor(prev => ({ ...prev, setupData: data }));
    } catch (err) {
      toast.error(err.message || t('vendor.settings.2fa_setup_error', 'Fehler beim Einrichten.'));
    }
  };

  const handleEnable2FA = async () => {
    if (!twoFactorCode) return;
    try {
      await TwoFactorApi.enable(twoFactorCode);
      toast.success(t('vendor.settings.2fa_enabled', '2FA aktiviert.'));
      setTwoFactor({ enabled: true, setupData: null });
      setTwoFactorCode('');
    } catch (err) {
      toast.error(err.message || t('vendor.settings.2fa_error', 'Fehler bei 2FA.'));
    }
  };

  const handleDisable2FA = async () => {
    try {
      await TwoFactorApi.disable(pwForm.current || 'dummy', twoFactorCode);
      toast.success(t('vendor.settings.2fa_disabled', '2FA deaktiviert.'));
      setTwoFactor({ enabled: false, setupData: null });
    } catch (err) {
      toast.error(err.message || t('vendor.settings.2fa_error', 'Fehler bei 2FA.'));
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/api/auth/me', { notification_settings: notifSettings });
      toast.success(t('vendor.settings.notif_saved', 'Benachrichtigungseinstellungen gespeichert.'));
    } catch (err) {
      toast.error(err.message || t('vendor.settings.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const NotifToggle = ({ label, value, onChange }) => (
    <label className="flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer"
      style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
      <span className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{label}</span>
      <div className="relative">
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)}
          className="sr-only peer" />
        <div className="w-10 h-5 rounded-full peer-checked:bg-[var(--color-primary)] transition-colors"
          style={{ background: value ? 'var(--color-primary)' : 'var(--color-divider)' }}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
        </div>
      </div>
    </label>
  );

  return (
    <div data-testid="vendor-settings-page" style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.settings.title', 'Einstellungen')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.settings.subtitle', 'Verwalte deine Kontoeinstellungen und Präferenzen.')}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Profile */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <User size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.settings.profile', 'Profil')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.first_name', 'Vorname')}
                </label>
                <input type="text" value={profile.first_name}
                  onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.last_name', 'Nachname')}
                </label>
                <input type="text" value={profile.last_name}
                  onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.email', 'E-Mail')}
                </label>
                <input type="email" value={profile.email} disabled
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none opacity-60 cursor-not-allowed"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.phone', 'Telefon')}
                </label>
                <input type="tel" value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
            <button onClick={handleSaveProfile} disabled={saving}
              className="px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : t('vendor.settings.save_profile', 'Profil speichern')}
            </button>
          </div>

          {/* Password */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Lock size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.settings.change_password', 'Passwort ändern')}
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.current_password', 'Aktuelles Passwort')}
                </label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required
                    className="w-full px-3 py-2.5 pr-10 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.new_password', 'Neues Passwort')}
                </label>
                <input type={showPw ? 'text' : 'password'} value={pwForm.new}
                  onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))} required minLength={8}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.settings.confirm_password', 'Passwort bestätigen')}
                </label>
                <input type={showPw ? 'text' : 'password'} value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : t('vendor.settings.change_password_btn', 'Passwort ändern')}
              </button>
            </form>
          </div>

          {/* 2FA */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Smartphone size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.settings.two_factor', 'Zwei-Faktor-Authentifizierung')}
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {twoFactor.enabled
                    ? t('vendor.settings.two_factor_active', '2FA ist aktiv.')
                    : t('vendor.settings.two_factor_inactive', '2FA ist deaktiviert.')}
                </p>
              </div>
            </div>

            {!twoFactor.enabled && !twoFactor.setupData && (
              <button onClick={handleSetup2FA}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
                <ShieldCheck size={16} /> {t('vendor.settings.setup_2fa', '2FA einrichten')}
              </button>
            )}

            {twoFactor.setupData && (
              <div className="space-y-4 p-4 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {t('vendor.settings.scan_qr', 'Scanne den QR-Code mit deiner Authenticator-App:')}
                </p>
                {twoFactor.setupData.qr_code && (
                  <div className="flex justify-center">
                    <img src={twoFactor.setupData.qr_code} alt="QR Code"
                      className="w-40 h-40 rounded-lg" style={{ background: '#fff' }} />
                  </div>
                )}
                {twoFactor.setupData.secret && (
                  <div className="text-center">
                    <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      {t('vendor.settings.or_secret', 'Oder verwende diesen Schlüssel:')}
                    </p>
                    <p className="text-[13px] font-mono font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
                      {twoFactor.setupData.secret}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('vendor.settings.enter_code', 'Bestätigungscode')}
                  </label>
                  <input type="text" value={twoFactorCode} onChange={e => setTwoFactorCode(e.target.value)}
                    placeholder="000000"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none text-center tracking-widest"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
                </div>
                <button onClick={handleEnable2FA} disabled={!twoFactorCode}
                  className="px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
                  style={{ background: 'var(--color-primary)' }}>
                  {t('vendor.settings.enable_2fa', 'Aktivieren')}
                </button>
              </div>
            )}

            {twoFactor.enabled && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--color-success)' }}>
                  <Check size={14} /> {t('vendor.settings.two_factor_active', '2FA ist aktiv.')}
                </span>
                <button onClick={handleDisable2FA}
                  className="px-4 py-2 text-[12px] font-semibold rounded-lg cursor-pointer"
                  style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                  {t('vendor.settings.disable_2fa', 'Deaktivieren')}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Bell size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.settings.notifications', 'Benachrichtigungen')}
              </h2>
            </div>

            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-divider-subtle)' }}>
              <NotifToggle label={t('vendor.settings.notif_bookings', 'Neue Buchungen (E-Mail)')}
                value={notifSettings.email_bookings}
                onChange={v => setNotifSettings(p => ({ ...p, email_bookings: v }))} />
              <NotifToggle label={t('vendor.settings.notif_reminders', 'Erinnerungen (E-Mail)')}
                value={notifSettings.email_reminders}
                onChange={v => setNotifSettings(p => ({ ...p, email_reminders: v }))} />
              <NotifToggle label={t('vendor.settings.notif_marketing', 'Marketing (E-Mail)')}
                value={notifSettings.email_marketing}
                onChange={v => setNotifSettings(p => ({ ...p, email_marketing: v }))} />
              <NotifToggle label={t('vendor.settings.notif_push', 'Push-Benachrichtigungen')}
                value={notifSettings.push_bookings}
                onChange={v => setNotifSettings(p => ({ ...p, push_bookings: v }))} />
            </div>

            <button onClick={handleSaveNotifications} disabled={saving}
              className="mt-4 px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : t('vendor.settings.save_notifications', 'Einstellungen speichern')}
            </button>
          </div>

          {/* Language */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Globe size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.settings.language', 'Sprache')}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {['de', 'en'].map(code => (
                <button key={code} onClick={() => i18n.changeLanguage(code)}
                  className="px-5 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: i18n.language === code ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: i18n.language === code ? '#fff' : 'var(--color-text-secondary)',
                    border: i18n.language === code ? 'none' : '1px solid var(--color-divider)',
                  }}>
                  {code === 'de' ? 'Deutsch' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
