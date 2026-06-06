import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, Filter } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';

const STATUS_STYLES = {
  pending: { bg: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)' },
  approved: { bg: 'rgba(56,161,105,0.12)', color: 'var(--color-success)' },
  paid: { bg: 'rgba(49,130,206,0.12)', color: '#3182CE' },
  cancelled: { bg: 'rgba(229,62,62,0.12)', color: 'var(--color-danger)' },
};

function formatDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch { return str; }
}

function formatEuro(amount) {
  if (amount == null) return '—';
  return `${Number(amount).toFixed(2)} €`;
}

export default function AdminCommissionPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: commissions = [], isLoading, isError, error, refetch } = useAutoRefresh(
    ['admin', 'commissions', statusFilter],
    () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      return apiClient.get('/api/commissions', { params }).then(r => Array.isArray(r.data) ? r.data : []);
    },
    { refetchInterval: 30_000 } // Polling alle 30s für Admin
  );

  const actionMutation = usePortalMutation({
    mutationFn: ({ id, action }) => apiClient.patch(`/api/commissions/${id}/${action}`),
    invalidateKeys: [['admin', 'commissions']],
    onError: (err) => alert(err?.response?.data?.detail || 'Fehler'),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {t('admin.commissions', 'Provisionen')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {t('admin.commissions_desc', 'Affiliate-Provisionen prüfen und verwalten')}
          </p>
        </div>
        <div className="flex gap-2">
          {['all','pending','approved','paid','cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.97]"
              style={{
                backgroundColor: statusFilter === s ? 'var(--color-accent)' : 'var(--color-surface)',
                color: statusFilter === s ? '#fff' : 'var(--color-text-secondary)',
                border: statusFilter === s ? 'none' : '1px solid var(--color-divider)',
              }}>
              {s === 'all' ? 'Alle' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: 'var(--color-danger)' }}>
          <AlertCircle size={32} />
          <p className="mt-2 text-sm">{error?.response?.data?.detail || 'Fehler beim Laden'}</p>
          <button onClick={refetch} className="mt-4 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}>
            {t('admin.retry', 'Erneut versuchen')}
          </button>
        </div>
      ) : commissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <Filter size={40} />
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {t('admin.no_commissions', 'Keine Provisionen gefunden')}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)]" style={{ border: '1px solid var(--color-divider)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-shell-bg)' }}>
                {['ID', 'Affiliate', 'Vendor', 'Booking', 'Betrag', 'Rate', 'Status', 'Datum', 'Aktionen'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => {
                const st = STATUS_STYLES[c.status] || {};
                return (
                  <tr key={c.id} className="transition-colors duration-150 hover:opacity-90"
                    style={{ borderTop: '1px solid var(--color-divider)', backgroundColor: 'var(--color-surface)' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>{c.id?.slice(0, 8)}…</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{c.affiliate_code || '—'}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{c.vendor_id?.slice(0, 8) || '—'}…</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{c.booking_id?.slice(0, 8) || '—'}…</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formatEuro(c.amount)}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{c.rate ? `${c.rate}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {c.status === 'pending' && (
                          <>
                            <button onClick={() => actionMutation.mutate({ id: c.id, action: 'approve' })}
                              className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-all duration-150 active:scale-[0.95] disabled:opacity-50 text-white"
                              style={{ backgroundColor: 'var(--color-success)' }}>✓</button>
                            <button onClick={() => actionMutation.mutate({ id: c.id, action: 'cancel' })}
                              className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-all duration-150 active:scale-[0.95] disabled:opacity-50 text-white"
                              style={{ backgroundColor: 'var(--color-danger)' }}>✗</button>
                          </>
                        )}
                        {c.status !== 'pending' && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
