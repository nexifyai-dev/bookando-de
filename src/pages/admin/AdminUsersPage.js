import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Search, Filter, Shield, ShieldOff, RotateCcw,
  Loader2, AlertCircle, RefreshCw, ChevronDown, Check, X,
  UserCheck, UserX, Mail
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── Helpers ── */
function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ── RoleBadge ── */
function RoleBadge({ role }) {
  const variants = {
    admin: { variant: 'default', label: 'Admin' },
    franchiser: { variant: 'gold', label: 'Franchiser' },
    vendor: { variant: 'info', label: 'Vendor' },
    customer: { variant: 'muted', label: 'Customer' },
  };
  const r = variants[role] || { variant: 'outline', label: role || 'Unknown' };
  return <Badge variant={r.variant} size="sm">{r.label}</Badge>;
}

/* ── Main ── */
export default function AdminUsersPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/api/admin/users').then(r => r.data);
      if (mountedRef.current) setUsers(Array.isArray(data) ? data : data?.users || data?.data || []);
    } catch (err) {
      if (mountedRef.current) setError(err?.message || t('common.error_load', 'Fehler beim Laden.'));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  /* ── Actions ── */
  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await apiClient.patch(`/api/admin/users/${userId}/${endpoint}`);
      await fetchData();
    } catch (err) {
      alert(err?.message || t('common.error_generic', 'Fehler bei der Aktion.'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(
      t('admin.users.confirm_role', 'Rolle zu {{role}} ändern?', { role: newRole })
    )) return;
    setActionLoading(userId);
    try {
      await apiClient.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      await fetchData();
    } catch (err) {
      alert(err?.message || t('common.error_generic', 'Fehler beim Rollenwechsel.'));
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Filter ── */
  const filtered = users.filter((u) => {
    const searchMatch = !searchTerm ||
      (u.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'active' && u.is_active !== false) ||
      (statusFilter === 'inactive' && u.is_active === false);
    return searchMatch && roleMatch && statusMatch;
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div data-testid="admin-users-page" className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('common.loading', 'Lade Benutzer…')}
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--color-danger-bg)' }}>
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-primary)' }}
        >
          <RefreshCw size={14} />
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  const roles = ['all', 'admin', 'franchiser', 'vendor', 'customer'];

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* Header */}
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('admin.users.title', 'Benutzerverwaltung')}</h1>
          <p className="w2g-page-subtitle">
            {t('admin.users.subtitle', 'Verwalte alle Benutzer der Plattform.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">
            <Users size={12} />
            {filtered.length} / {users.length}
          </Badge>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                placeholder={t('admin.users.search', 'Benutzer suchen…')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg outline-none transition-all"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)' }}>
              <Filter size={13} style={{ color: 'var(--color-text-tertiary)', marginLeft: 4 }} />
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize"
                  style={{
                    background: roleFilter === r ? 'var(--color-surface)' : 'transparent',
                    color: roleFilter === r ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                    boxShadow: roleFilter === r ? 'var(--shadow-e1)' : 'none',
                  }}
                >
                  {r === 'all' ? t('common.all', 'Alle') : r}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-[12px] font-medium rounded-lg outline-none transition-all"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
            >
              <option value="all">{t('admin.users.all_status', 'Alle Status')}</option>
              <option value="active">{t('common.active', 'Aktiv')}</option>
              <option value="inactive">{t('common.inactive', 'Inaktiv')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardContent className="px-1 pb-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <Users size={36} style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? t('admin.users.no_search_results', 'Keine Benutzer gefunden.')
                  : t('admin.users.empty', 'Keine Benutzer vorhanden.')}
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div
                className="hidden md:flex items-center gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider)' }}
              >
                <span className="flex-[2] min-w-0">{t('admin.users.col_user', 'Benutzer')}</span>
                <span className="w-[120px] shrink-0">{t('admin.users.col_email', 'E-Mail')}</span>
                <span className="w-[100px] shrink-0">{t('admin.users.col_role', 'Rolle')}</span>
                <span className="w-[80px] shrink-0 text-center">{t('admin.users.col_status', 'Status')}</span>
                <span className="w-[100px] shrink-0 text-center">{t('admin.users.col_joined', 'Beigetreten')}</span>
                <span className="w-[100px] shrink-0 text-right">{t('admin.users.col_actions', 'Aktionen')}</span>
              </div>

              {filtered.map((u, i) => {
                const isActive = u.is_active !== false;
                return (
                  <div
                    key={u.id || i}
                    className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                    style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
                  >
                    {/* User */}
                    <div className="flex-[2] min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {u.first_name || u.last_name
                          ? `${u.first_name || ''} ${u.last_name || ''}`
                          : t('common.unnamed', 'Unbenannt')}
                      </p>
                      <p className="text-[11px] md:hidden truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                        {u.email || ''}
                      </p>
                    </div>

                    {/* Email */}
                    <p className="text-[12px] w-[120px] shrink-0 hidden md:block truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      {u.email || '–'}
                    </p>

                    {/* Role */}
                    <div className="w-[100px] shrink-0">
                      {actionLoading === u.id ? (
                        <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-tertiary)' }} />
                      ) : (
                        <select
                          value={u.role || 'customer'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-[11px] font-semibold px-2 py-1 rounded-lg outline-none transition-all w-full"
                          style={{
                            background: 'var(--color-surface-sunken)',
                            border: '1px solid var(--color-divider)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="franchiser">Franchiser</option>
                          <option value="vendor">Vendor</option>
                          <option value="customer">Customer</option>
                        </select>
                      )}
                    </div>

                    {/* Status */}
                    <div className="w-[80px] shrink-0 flex justify-center">
                      <Badge variant={isActive ? 'success' : 'muted'} size="sm">
                        {isActive ? t('common.active', 'Aktiv') : t('common.inactive', 'Inaktiv')}
                      </Badge>
                    </div>

                    {/* Joined */}
                    <p className="text-[11px] w-[100px] shrink-0 text-center hidden md:block" style={{ color: 'var(--color-text-tertiary)' }}>
                      {formatDate(u.created_at)}
                    </p>

                    {/* Actions */}
                    <div className="w-[100px] shrink-0 flex justify-end gap-1">
                      <button
                        onClick={() => handleToggleStatus(u.id, isActive)}
                        disabled={actionLoading === u.id}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{
                          color: isActive ? 'var(--color-danger)' : 'var(--color-success)',
                          background: isActive ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                        }}
                        title={isActive ? t('admin.users.deactivate', 'Deaktivieren') : t('admin.users.activate', 'Aktivieren')}
                      >
                        {isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
