import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Plus, Mail, X, Loader2, AlertCircle, Shield, UserMinus, UserCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { EmployeeAccountsApi } from '../../lib/api';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Mitarbeiter' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

function InviteModal({ onClose, onInvite, loading }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role });
  };

  return (
    <div data-testid="vendor-employees-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.employees.invite_title', 'Mitarbeiter einladen')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.employees.email', 'E-Mail-Adresse')} *
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="name@example.de"
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.employees.role', 'Rolle')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className="px-3 py-2.5 text-[12px] font-semibold rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: role === r.value ? 'var(--color-primary)' : 'var(--color-surface-sunken)',
                    color: role === r.value ? '#fff' : 'var(--color-text-secondary)',
                    border: role === r.value ? 'none' : '1px solid var(--color-divider)',
                  }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading || !email.trim()}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.employees.send_invite', 'Einladung senden')}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
              {t('common.cancel', 'Abbrechen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RevokeConfirmModal({ employee, onClose, onRevoke, loading }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <UserMinus size={36} style={{ color: 'var(--color-danger)', margin: '0 auto 12px' }} />
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.employees.revoke_title', 'Mitarbeiter entfernen')}
          </h3>
          <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.employees.revoke_confirm', 'Bist du sicher, dass du {{email}} entfernen möchtest?', { email: employee?.email || '' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onRevoke(employee.id)} disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-danger)' }}>
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.employees.revoke', 'Entfernen')}
          </button>
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
            {t('common.cancel', 'Abbrechen')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorEmployeesPage() {
  const { t } = useTranslation();

  const { data: employees = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'employees'],
    () => EmployeeAccountsApi.list().then(d => Array.isArray(d) ? d : d?.employees || d?.data || []),
  );

  const [inviteOpen, setInviteOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleInvite = async (payload) => {
    setSaving(true);
    try {
      await EmployeeAccountsApi.invite(payload);
      toast.success(t('vendor.employees.invite_success', 'Einladung gesendet.'));
      setInviteOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || t('vendor.employees.invite_error', 'Fehler beim Einladen.'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (emp) => {
    setSaving(true);
    try {
      await EmployeeAccountsApi.update(emp.id, { is_active: !emp.is_active });
      toast.success(emp.is_active
        ? t('vendor.employees.deactivated', 'Mitarbeiter deaktiviert.')
        : t('vendor.employees.activated', 'Mitarbeiter aktiviert.'));
      refetch();
    } catch (err) {
      toast.error(err.message || t('vendor.employees.update_error', 'Fehler beim Aktualisieren.'));
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id) => {
    setSaving(true);
    try {
      await EmployeeAccountsApi.revoke(id);
      toast.success(t('vendor.employees.revoke_success', 'Mitarbeiter entfernt.'));
      setRevokeTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || t('vendor.employees.revoke_error', 'Fehler beim Entfernen.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.employees.title', 'Mitarbeiter')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.employees.subtitle', 'Verwalte dein Team und lade neue Mitarbeiter ein.')}</p>
        </div>
        <button onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.employees.invite', 'Einladen')}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={refetch}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && employees.length === 0 && (
        <div className="text-center py-20">
          <Users size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem', marginBottom: '12px' }}>
            {t('vendor.employees.empty', 'Noch keine Mitarbeiter eingeladen.')}
          </p>
          <button onClick={() => setInviteOpen(true)}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('vendor.employees.invite_first', 'Ersten Mitarbeiter einladen')}
          </button>
        </div>
      )}

      {/* Employee List */}
      {!isLoading && !error && employees.length > 0 && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
          <div className="hidden md:flex items-center gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider-subtle)', background: 'var(--color-surface-sunken)' }}>
            <div className="flex-1">{t('vendor.employees.email', 'E-Mail')}</div>
            <div className="w-[100px]">{t('vendor.employees.role', 'Rolle')}</div>
            <div className="w-[100px]">{t('vendor.employees.status', 'Status')}</div>
            <div className="w-[120px]">{t('vendor.employees.joined', 'Beigetreten')}</div>
            <div className="w-[80px]"></div>
          </div>

          {employees.map((emp, i) => (
            <div key={emp.id || i}
              className="flex items-center gap-4 px-5 py-3.5"
              style={{ borderBottom: i < employees.length - 1 ? '1px solid var(--color-divider-subtle)' : 'none' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-primary-muted)' }}>
                    <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {emp.email}
                    </p>
                    {emp.full_name && (
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{emp.full_name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-[100px]">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{
                    background: emp.role === 'admin' ? 'var(--color-accent-muted)' : 'var(--color-surface-sunken)',
                    color: emp.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}>
                  <Shield size={10} />
                  {t(`vendor.employees.role_${emp.role}`, ROLE_OPTIONS.find(r => r.value === emp.role)?.label || emp.role)}
                </span>
              </div>

              <div className="w-[100px]">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: emp.is_active !== false ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                    color: emp.is_active !== false ? 'var(--color-success)' : 'var(--color-danger)',
                  }}>
                  {emp.is_active !== false
                    ? t('vendor.employees.active', 'Aktiv')
                    : t('vendor.employees.inactive', 'Inaktiv')}
                </span>
              </div>

              <div className="w-[120px] text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {emp.created_at ? new Date(emp.created_at).toLocaleDateString('de-DE') : '–'}
              </div>

              <div className="w-[80px] flex items-center gap-1">
                <button onClick={() => handleToggle(emp)} disabled={saving}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-surface-sunken)]"
                  style={{ color: emp.is_active !== false ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}
                  title={emp.is_active !== false ? t('vendor.employees.deactivate', 'Deaktivieren') : t('vendor.employees.activate', 'Aktivieren')}>
                  {emp.is_active !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => setRevokeTarget(emp)}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-danger-bg)]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                  title={t('vendor.employees.remove', 'Entfernen')}>
                  <UserMinus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {inviteOpen && (
        <InviteModal onClose={() => setInviteOpen(false)} onInvite={handleInvite} loading={saving} />
      )}

      {/* Revoke Modal */}
      {revokeTarget && (
        <RevokeConfirmModal employee={revokeTarget} onClose={() => setRevokeTarget(null)}
          onRevoke={handleRevoke} loading={saving} />
      )}
    </div>
  );
}
