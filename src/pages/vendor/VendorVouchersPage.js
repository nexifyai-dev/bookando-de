import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Loader2, AlertCircle, Tag, Percent, Euro, Trash2, RefreshCw,
} from 'lucide-react';
import { VouchersApi } from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';

const voucherStatusConfig = {
  active: { className: 'bg-success-light text-success-dark', label: 'Aktiv' },
  redeemed: { className: 'bg-muted text-muted-dark', label: 'Eingelöst' },
  expired: { className: 'bg-danger-light text-danger-dark', label: 'Abgelaufen' },
};

const DEFAULT_FORM = { code: '', name: '', discount_percent: '', discount_amount: '', expires_at: '' };

export default function VendorVouchersPage() {
  const { t } = useTranslation();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await VouchersApi.list({ params: { select: '*' } });
      setVouchers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || t('vendor.vouchers.load_error', 'Fehler beim Laden der Gutscheine.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.code) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.discount_percent) payload.discount_percent = Number(payload.discount_percent);
      if (payload.discount_amount) payload.discount_amount = Number(payload.discount_amount);
      await VouchersApi.create(payload);
      setForm(DEFAULT_FORM);
      setShowForm(false);
      await load();
    } catch (err) {
      // ponytail: toast feedback — add sonner toast when toast hook available
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(voucher) {
    try {
      const newStatus = voucher.status === 'active' ? 'redeemed' : 'active';
      await VouchersApi.update(voucher.id, { status: newStatus });
      await load();
    } catch { /* ponytail: toast */ }
  }

  async function handleDelete(voucher) {
    if (!window.confirm(t('vendor.vouchers.delete_confirm', 'Gutschein wirklich löschen?'))) return;
    try {
      await VouchersApi.remove(voucher.id);
      await load();
    } catch { /* ponytail: toast */ }
  }

  const columns = [
    {
      header: t('vendor.vouchers.col_code', 'Code'),
      key: 'code',
      render: (val) => <span className="font-mono font-semibold text-gray-900">{val}</span>,
    },
    {
      header: t('vendor.vouchers.col_name', 'Name'),
      key: 'name',
      render: (val) => val || '--',
    },
    {
      header: t('vendor.vouchers.col_discount', 'Rabatt'),
      key: 'discount_percent',
      render: (val, row) => {
        if (row.discount_percent) return <span className="flex items-center gap-1"><Percent size={12} />{row.discount_percent}%</span>;
        if (row.discount_amount) return <span className="flex items-center gap-1"><Euro size={12} />{row.discount_amount}</span>;
        return '--';
      },
    },
    {
      header: t('vendor.vouchers.col_status', 'Status'),
      key: 'status',
      render: (val) => {
        const cfg = voucherStatusConfig[val] || voucherStatusConfig.active;
        return <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${cfg.className}`}>{cfg.label}</span>;
      },
    },
    {
      header: t('vendor.vouchers.col_expires', 'Gültig bis'),
      key: 'expires_at',
      render: (val) => val ? new Date(val).toLocaleDateString('de-DE') : '--',
    },
    {
      header: t('vendor.vouchers.col_actions', 'Aktionen'),
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleToggle(row)} className="p-1.5 rounded cursor-pointer transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
            title={row.status === 'active' ? 'Als eingelöst markieren' : 'Reaktivieren'}>
            <RefreshCw size={14} />
          </button>
          <button onClick={() => handleDelete(row)} className="p-1.5 rounded cursor-pointer transition-colors"
            style={{ color: 'var(--color-danger)' }}
            title={t('vendor.vouchers.delete', 'Löschen')}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && !vouchers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Gutscheine werden geladen…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertCircle size={36} style={{ color: 'var(--color-danger)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button onClick={load} className="px-5 py-2 text-sm font-semibold cursor-pointer"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardSection>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              <Tag size={18} className="inline mr-2" /> Gutscheine
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Gutscheincodes für deine Kunden verwalten.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2"
            style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', color: 'white', border: 'none' }}>
            <Plus size={14} /> Neuer Gutschein
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-lg p-4 mb-4"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              <input type="text" placeholder="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="px-3 py-2 text-[13px]" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }} required />
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-3 py-2 text-[13px]" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }} />
              <input type="number" placeholder="Rabatt %" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                className="px-3 py-2 text-[13px]" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }} min="0" max="100" />
              <input type="number" placeholder="Rabatt €" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                className="px-3 py-2 text-[13px]" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }} min="0" step="0.01" />
              <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="px-3 py-2 text-[13px]" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving || !form.code}
                className="px-4 py-2 text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-2"
                style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', color: 'white', border: 'none' }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Speichern
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(DEFAULT_FORM); }}
                className="px-4 py-2 text-sm font-semibold cursor-pointer"
                style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', background: 'var(--color-surface)' }}>
                Abbrechen
              </button>
            </div>
          </form>
        )}

        {!loading && !error && vouchers.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <Tag size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Noch keine Gutscheine vorhanden.</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-[12px] font-semibold cursor-pointer" style={{ color: 'var(--color-primary)' }}>
              Ersten Gutschein erstellen
            </button>
          </div>
        ) : (
          <DataTable columns={columns} data={vouchers} />
        )}
      </DashboardSection>
    </div>
  );
}
