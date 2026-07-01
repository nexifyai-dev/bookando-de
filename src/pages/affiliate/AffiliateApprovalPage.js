import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Loader2, AlertCircle, CheckCircle, XCircle, UserCheck, UserX, Users, MousePointerClick,
  ShoppingCart, DollarSign, X, Save, ChevronDown, ChevronUp, Edit3
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';
import { toast } from 'sonner';

/* ── Reject/Approve Modal ── */
function ActionModal({ affiliate, action, onClose, onDone }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [commissionOverride, setCommissionOverride] = useState(affiliate?.commission_rate || '');

  const mut = usePortalMutation({
    mutationFn: () => {
      if (action === 'approve') {
        return apiClient.post(`/api/vendor/affiliates/${affiliate.id}/approve`, {
          commission_rate: commissionOverride ? parseFloat(commissionOverride) : undefined,
        });
      }
      return apiClient.post(`/api/vendor/affiliates/${affiliate.id}/reject`, { reason });
    },
    invalidateKeys: [['vendor', 'affiliates']],
    onSuccess: () => { toast.success(action === 'approve' ? t('affiliates.approved', 'Freigegeben') : t('affiliates.rejected', 'Abgelehnt')); onDone(); },
    onError: () => toast.error(t('affiliates.action_error', 'Fehler')),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-12 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mb-12">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            {action === 'approve' ? t('affiliates.approve', 'Affiliate freigeben') : t('affiliates.reject', 'Ablehnen')}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{affiliate?.user_name || affiliate?.email || '—'}</span>
          </p>
          {action === 'approve' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('affiliates.commission_override', 'Provision (%) — leer = Standard')}</label>
              <input type="number" value={commissionOverride} onChange={e => setCommissionOverride(e.target.value)} min="0" max="100" step="0.5"
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand"
                placeholder="z.B. 15" />
            </div>
          )}
          {action === 'reject' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('affiliates.reason', 'Grund')}</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand resize-none" />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="h-9 px-4 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              {t('common.cancel', 'Abbrechen')}
            </button>
            <button onClick={() => mut.mutate()} disabled={mut.isPending}
              className={`h-9 px-4 text-xs font-medium rounded-lg text-white disabled:opacity-50 flex items-center gap-1.5 ${action === 'approve' ? 'bg-success hover:opacity-90' : 'bg-danger hover:opacity-90'}`}>
              {mut.isPending && <Loader2 size={14} className="animate-spin" />}
              {action === 'approve' ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {action === 'approve' ? t('common.approve', 'Freigeben') : t('common.reject', 'Ablehnen')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Commission Override Inline Edit ── */
function CommissionEditor({ affiliate, onSaved }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(affiliate.commission_rate || '');

  const mut = usePortalMutation({
    mutationFn: () => apiClient.put(`/api/vendor/affiliates/${affiliate.id}`, { commission_rate: parseFloat(value) }),
    invalidateKeys: [['vendor', 'affiliates']],
    onSuccess: () => { toast.success(t('affiliates.rate_updated', 'Provision aktualisiert')); setEditing(false); onSaved?.(); },
  });

  if (!editing) return (
    <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand">
      {affiliate.commission_rate ? `${affiliate.commission_rate}%` : '—'}
      <Edit3 size={12} />
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <input type="number" value={value} onChange={e => setValue(e.target.value)} min="0" max="100" step="0.5"
        className="w-16 px-2 py-1 text-[12px] rounded border border-gray-200 outline-none focus:border-brand" />
      <button onClick={() => mut.mutate()} className="p-1 rounded hover:bg-gray-100 text-success"><Save size={12} /></button>
      <button onClick={() => setEditing(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X size={12} /></button>
    </div>
  );
}

/* ── Main Page ── */
export default function AffiliateApprovalPage() {
  const { t } = useTranslation();
  const [actionModal, setActionModal] = useState(null); // { affiliate, action }

  const { data: pending = [], isLoading: pendingLoading } = useAutoRefresh(
    ['vendor', 'affiliates', 'pending'],
    () => apiClient.get('/api/vendor/affiliates/pending').then(r => Array.isArray(r.data) ? r.data : []),
  );
  const { data: active = [], isLoading: activeLoading } = useAutoRefresh(
    ['vendor', 'affiliates', 'active'],
    () => apiClient.get('/api/vendor/affiliates').then(r => {
      const d = r.data;
      return Array.isArray(d) ? d.filter(a => a.status === 'active') : Array.isArray(d?.affiliates) ? d.affiliates.filter(a => a.status === 'active') : [];
    }),
  );

  const isLoading = pendingLoading || activeLoading;

  const pendingCols = [
    { key: 'user_name', header: t('affiliates.name', 'Name'), render: (v, row) => <span className="font-medium text-gray-900">{v || row.email || '—'}</span> },
    { key: 'email', header: 'Email', render: v => <span className="text-gray-500">{v || '—'}</span> },
    { key: 'created_at', header: t('affiliates.applied', 'Beworben am'), render: v => v ? new Date(v).toLocaleDateString('de-DE') : '—' },
    { key: 'actions', header: '', render: (_, row) => (
      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <button onClick={() => setActionModal({ affiliate: row, action: 'approve' })}
          className="h-7 px-3 text-[11px] font-semibold rounded-lg bg-success/10 text-success hover:bg-success/20 flex items-center gap-1">
          <CheckCircle size={12} /> {t('common.approve', 'Freigeben')}
        </button>
        <button onClick={() => setActionModal({ affiliate: row, action: 'reject' })}
          className="h-7 px-3 text-[11px] font-semibold rounded-lg bg-danger/10 text-danger hover:bg-danger/20 flex items-center gap-1">
          <XCircle size={12} /> {t('common.reject', 'Ablehnen')}
        </button>
      </div>
    )},
  ];

  const activeCols = [
    { key: 'user_name', header: t('affiliates.name', 'Name'), render: (v, row) => <span className="font-medium text-gray-900">{v || row.email || '—'}</span> },
    { key: 'commission_rate', header: t('affiliates.commission', 'Provision'), render: (_, row) => <CommissionEditor affiliate={row} /> },
    { key: 'clicks', header: t('affiliates.clicks', 'Klicks'), render: v => (v || 0).toLocaleString() },
    { key: 'conversions', header: t('affiliates.conversions', 'Konv.'), render: v => (v || 0).toLocaleString() },
    { key: 'revenue', header: t('affiliates.revenue', 'Umsatz'), render: v => `€${(v || 0).toLocaleString()}` },
  ];

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('affiliates.title_page', 'Affiliate-Verwaltung')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('affiliates.desc', 'Verwalte Affiliate-Anfragen und Partner')}</p>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={Users} label={t('affiliates.pending_count', 'Ausstehend')} value={pending.length} color="warning" />
        <StatCard icon={UserCheck} label={t('affiliates.active_count', 'Aktive Partner')} value={active.length} color="success" />
        <StatCard icon={DollarSign} label={t('affiliates.total_revenue', 'Partner-Umsatz')} value={`€${active.reduce((s, a) => s + (a.revenue || 0), 0).toLocaleString()}`} color="brand" />
      </DashboardGrid>

      <DashboardSection title={t('affiliates.pending', 'Ausstehende Anfragen')} className="mb-8">
        <DataTable
          columns={pendingCols}
          data={pending}
          emptyText={t('affiliates.no_pending', 'Keine ausstehenden Anfragen')}
        />
      </DashboardSection>

      <DashboardSection title={t('affiliates.active', 'Aktive Affiliate-Partner')}>
        <DataTable
          columns={activeCols}
          data={active}
          emptyText={t('affiliates.no_active', 'Keine aktiven Partner')}
        />
      </DashboardSection>

      {actionModal && (
        <ActionModal
          affiliate={actionModal.affiliate}
          action={actionModal.action}
          onClose={() => setActionModal(null)}
          onDone={() => setActionModal(null)}
        />
      )}
    </div>
  );
}
