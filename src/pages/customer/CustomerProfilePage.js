import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth, formatApiError } from '../../contexts/AuthContext';
import { PrivacyApi } from '../../lib/api';
import apiClient from '../../lib/apiClient';

/* ─── Section Wrapper ─── */
function Section({ title, icon: Icon, children }) {
  return (
    <div data-testid="customer-profile-page"
      className="rounded-xl p-5"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-e1)',
      }}
    >
      <h2
        className="text-[14px] font-bold mb-5 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        {Icon && <Icon size={16} style={{ color: 'var(--color-accent)' }} />}
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ─── Input Field ─── */
function FormField({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-[12px] font-semibold"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {Icon && <Icon size={12} className="inline mr-1.5" style={{ color: 'var(--color-text-tertiary)' }} />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-medium" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function CustomerProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  // ─── Profile Form ───
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.profile?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // ─── Password Form ───
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  // ─── Language ───
  const [langSaving, setLangSaving] = useState(false);

  // ─── Delete Account ───
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteProcessing, setDeleteProcessing] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ─── Handle Profile Save ───
  const handleProfileSave = useCallback(
    async (e) => {
      e.preventDefault();
      setProfileError(null);
      setProfileSuccess(null);
      setProfileSaving(true);
      try {
        await updateProfile({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
        });
        setProfileSuccess(t('customer.profile_updated', 'Profil erfolgreich aktualisiert.'));
        setTimeout(() => setProfileSuccess(null), 4000);
      } catch (err) {
        setProfileError(formatApiError(err?.response?.data?.detail, t('customer.profile_update_error', 'Fehler beim Aktualisieren des Profils.')));
      } finally {
        setProfileSaving(false);
      }
    },
    [firstName, lastName, email, phone, updateProfile, t]
  );

  // ─── Handle Password Change ───
  const handlePasswordChange = useCallback(
    async (e) => {
      e.preventDefault();
      setPwError(null);
      setPwSuccess(null);

      if (newPassword !== confirmPassword) {
        setPwError(t('customer.password_mismatch', 'Die Passwörter stimmen nicht überein.'));
        return;
      }
      if (newPassword.length < 8) {
        setPwError(t('customer.password_min', 'Das Passwort muss mindestens 8 Zeichen lang sein.'));
        return;
      }

      setPwSaving(true);
      try {
        await apiClient.post('/api/auth/change-password', {
          current_password: currentPassword,
          new_password: newPassword,
        });
        setPwSuccess(t('customer.password_updated', 'Passwort erfolgreich geändert.'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwSuccess(null), 4000);
      } catch (err) {
        setPwError(formatApiError(err?.response?.data?.detail, t('customer.password_change_error', 'Fehler beim Ändern des Passworts.')));
      } finally {
        setPwSaving(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, t]
  );

  // ─── Handle Language Change ───
  const handleLanguageChange = useCallback(
    async (lang) => {
      setLangSaving(true);
      try {
        await i18n.changeLanguage(lang);
        await updateProfile({ language: lang });
      } catch {
        // Fallback: zumindest lokal ändern
      } finally {
        setLangSaving(false);
      }
    },
    [i18n, updateProfile]
  );

  // ─── Handle Account Deletion ───
  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirm !== t('customer.delete_confirm_text', 'LÖSCHEN')) return;
    setDeleteError(null);
    setDeleteProcessing(true);
    try {
      await PrivacyApi.requestDeletion();
      await logout();
      navigate('/');
    } catch (err) {
      setDeleteError(formatApiError(err?.response?.data?.detail, t('customer.delete_error', 'Fehler beim Löschen des Kontos.')));
    } finally {
      setDeleteProcessing(false);
    }
  }, [deleteConfirm, t, logout, navigate]);

  const LANGUAGES = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* ═══ Header ═══ */}
      <div
        className="rounded-xl p-5 md:p-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-extrabold text-white"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h1
              className="text-[20px] md:text-[24px] font-extrabold tracking-[-0.02em] text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('customer.profile_title', 'Mein Profil')}
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ═══ LEFT COLUMN ═══ */}

        {/* ─── Profile Edit ─── */}
        <Section title={t('customer.personal_info', 'Persönliche Informationen')} icon={User}>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={t('customer.first_name', 'Vorname')} icon={User}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px]"
                  style={{
                    border: '1px solid var(--color-divider)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface-sunken)',
                  }}
                />
              </FormField>
              <FormField label={t('customer.last_name', 'Nachname')}>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px]"
                  style={{
                    border: '1px solid var(--color-divider)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface-sunken)',
                  }}
                />
              </FormField>
            </div>

            <FormField label={t('customer.email', 'E-Mail')} icon={Mail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px]"
                style={{
                  border: '1px solid var(--color-divider)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-surface-sunken)',
                }}
              />
            </FormField>

            <FormField label={t('customer.phone', 'Telefon')} icon={Phone}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 151 12345678"
                className="w-full px-3 py-2.5 text-[13px]"
                style={{
                  border: '1px solid var(--color-divider)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-surface-sunken)',
                }}
              />
            </FormField>

            {profileError && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium"
                style={{
                  background: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)',
                  color: 'var(--color-danger)',
                }}
              >
                <AlertTriangle size={13} />
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium animate-slide-up"
                style={{
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  color: 'var(--color-success)',
                }}
              >
                <CheckCircle2 size={13} />
                {profileSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                border: 'none',
              }}
            >
              {profileSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {t('customer.save', 'Speichern')}
            </button>
          </form>
        </Section>

        {/* ─── Password Change ─── */}
        <Section title={t('customer.change_password', 'Passwort ändern')} icon={Lock}>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <FormField label={t('customer.current_password', 'Aktuelles Passwort')} icon={Lock}>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] pr-9"
                  style={{
                    border: '1px solid var(--color-divider)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface-sunken)',
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </FormField>

            <FormField label={t('customer.new_password', 'Neues Passwort')}>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('customer.password_min_hint', 'Mindestens 8 Zeichen')}
                className="w-full px-3 py-2.5 text-[13px]"
                style={{
                  border: '1px solid var(--color-divider)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-surface-sunken)',
                }}
                autoComplete="new-password"
              />
            </FormField>

            <FormField label={t('customer.confirm_password', 'Passwort bestätigen')}>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px]"
                style={{
                  border: '1px solid var(--color-divider)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-surface-sunken)',
                }}
                autoComplete="new-password"
              />
            </FormField>

            {pwError && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium"
                style={{
                  background: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)',
                  color: 'var(--color-danger)',
                }}
              >
                <AlertTriangle size={13} />
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium animate-slide-up"
                style={{
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  color: 'var(--color-success)',
                }}
              >
                <CheckCircle2 size={13} />
                {pwSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
              className="w-full px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                border: 'none',
              }}
            >
              {pwSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Lock size={15} />
              )}
              {t('customer.change_password_btn', 'Passwort ändern')}
            </button>
          </form>
        </Section>

        {/* ═══ RIGHT COLUMN (Bottom in mobile) ═══ */}

        {/* ─── Language ─── */}
        <Section title={t('customer.language', 'Sprache')} icon={Globe}>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={langSaving}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all disabled:opacity-50"
                style={{
                  border:
                    i18n.language === lang.code
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-divider)',
                  background:
                    i18n.language === lang.code
                      ? 'var(--color-primary-muted)'
                      : 'var(--color-surface)',
                  color:
                    i18n.language === lang.code
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                }}
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold uppercase"
                  style={{
                    background:
                      i18n.language === lang.code
                        ? 'var(--color-primary)'
                        : 'var(--color-surface-sunken)',
                    color: i18n.language === lang.code ? 'white' : 'var(--color-text-tertiary)',
                  }}
                >
                  {lang.code}
                </div>
                <span className="flex-1 text-left">{lang.label}</span>
                {i18n.language === lang.code && (
                  <CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} />
                )}
              </button>
            ))}
            {langSaving && (
              <div className="flex items-center justify-center py-2">
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
            )}
          </div>
        </Section>

        {/* ─── Delete Account (DSGVO) ─── */}
        <Section title={t('customer.delete_account', 'Konto löschen')} icon={Trash2}>
          <div className="space-y-4">
            <div
              className="rounded-lg p-4"
              style={{
                background: 'var(--color-danger-bg)',
                border: '1px solid var(--color-danger-border)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-danger)' }} />
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: 'var(--color-danger)' }}>
                    {t('customer.delete_warning_title', 'DSGVO: Löschung deines Kontos')}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--color-danger)' }}>
                    {t('customer.delete_warning', 'Diese Aktion ist endgültig. Alle deine Daten, Buchungen und Gutscheine werden unwiderruflich gelöscht.')}
                  </p>
                </div>
              </div>
            </div>

            {deleteError && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium"
                style={{
                  background: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)',
                  color: 'var(--color-danger)',
                }}
              >
                <AlertTriangle size={13} />
                {deleteError}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('customer.delete_instruction', 'Gib "LÖSCHEN" ein, um zu bestätigen:')}
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={t('customer.delete_confirm_text', 'LÖSCHEN')}
                className="w-full px-3 py-2.5 text-[13px] font-mono uppercase tracking-wider text-center"
                style={{
                  border: '1px solid var(--color-danger-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-danger)',
                  background: 'var(--color-danger-bg)',
                }}
              />
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={deleteProcessing || deleteConfirm !== t('customer.delete_confirm_text', 'LÖSCHEN')}
              className="w-full px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                border: 'none',
              }}
            >
              {deleteProcessing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              {t('customer.delete_account_btn', 'Konto unwiderruflich löschen')}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
