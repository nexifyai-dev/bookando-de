import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Edit3, Trash2, Loader2, AlertCircle, X, Sparkles, DollarSign, Clock, ToggleLeft, ToggleRight, Package,
} from 'lucide-react';
import { ServicesApi } from '../../lib/api';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import DataTable from '../../components/dashboard/DataTable';
import { toast } from 'sonner';
import apiClient from '../../lib/apiClient';

const ExtrasApi = {
  list: () => apiClient.get('/api/vendor/extras').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/extras', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/extras/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/extras/${id}`).then(r => r.data),
};

const INPUT = { background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' };

/* ─── Modal ─── */
function ExtraModal({ extra, services, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: extra?.name || '',
    price: String(extra?.price || '0'),
    duration_minutes: extra?.duration_minutes || 0,
    description: extra?.description || '',
    is_active: extra?.is_active !== false,
    service_ids: extra?.service_ids || [],
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleService = (id) => {
    setForm(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(id)
        ? prev.service_ids.filter(s => s !== id)
        : [...prev.service_ids, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(extra?.id, { ...form, price: parseFloat(form.price) || 0, duration_minutes: parseInt(form.duration_minutes, 10) || 0 });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {extra ? t('vendor.extras.edit', 'Zusatz bearbeiten') : t('vendor.extras.add', 'Neuer Zusatz')}
          </h3>
          <button onClick={onClose} className="p-1 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.extras.name', 'Bezeichnung')} *
            </label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required
              placeholder="z.B. Kopfhörer-Verleih" className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                <DollarSign size={12} className="inline mr-1" />{t('vendor.extras.price', 'Preis (€)')}
              </label>
              <input type="number" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} min={0}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                <Clock size={12} className="inline mr-1" />{t('vendor.extras.duration', 'Dauer-Änderung (Min.)')}
              </label>
              <input type="number" value={form.duration_minutes} onChange={e => handleChange('duration_minutes', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.extras.description', 'Beschreibung')}
            </label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={2}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.extras.linkServices', 'Verknüpfte Dienstleistungen')}
            </label>
            {Array.isArray(services) && services.length > 0 ? (
              <div className="max-h-32 overflow-y-auto rounded-lg p-2 space-y-1" style={{ background: 'var(--color-surface-sunken)' }}>
                {services.map(svc => (
                  <label key={svc.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/50">
                    <input type="checkbox" checked={form.service_ids.includes(svc.id)} onChange={() => toggleService(svc.id)} />
                    <span className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{svc.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.extras.noServices', 'Keine Dienstleistungen vorhanden')}
              </p>
            )}
          </div>

          {/* Toggle */}
          <button type="button" onClick={() => handleChange('is_active', !form.is_active)}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg cursor-pointer"
            style={{
              background: form.is_active ? 'rgba(74,222,128,0.12)' : 'var(--color-surface-sunken)',
              border: '1px solid var(--color-divider)',
              color: form.is_active ? 'var(--color-success)' : 'var(--color-text-tertiary)',
            }}>
            {form.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {form.is_active ? t('vendor.extras.active', 'Aktiv') : t('vendor.extras.inactive', 'Inaktiv')}
          </button>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : (extra ? t('vendor.extras.save', 'Speichern') : t('vendor.extras.create', 'Anlegen'))}
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

/* ─── Delete Confirm ─── */
function DeleteConfirmModal({ extra, onClose, onConfirm, loading }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <Trash2 size={36} style={{ color: 'var(--color-danger)', margin: '0 auto 12px' }} />
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.extras.deleteTitle', 'Zusatz löschen')}
          </h3>
          <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.extras.deleteConfirm', '"{{name}}" wirklich löschen?', { name: extra?.name || '' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onConfirm(extra.id)} disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-danger)' }}>
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.extras.delete', 'Löschen')}
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

/* ─── Main ─── */
export default function VendorExtrasPage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: extras = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'extras'],
    () => ExtrasApi.list().then(d => Array.isArray(d) ? d : d?.data || []),
  );

  const { data: services = [] } = useAutoRefresh(
    ['vendor', 'services'],
    () => ServicesApi.list().then(d => Array.isArray(d) ? d : d?.services || []),
    { enabled: modalOpen },
  );

  const saveMutation = usePortalMutation({
    mutationFn: ({ id, payload }) => id ? ExtrasApi.update(id, payload) : ExtrasApi.create(payload),
    invalidateKeys: [['vendor', 'extras'], ['vendor', 'dashboard']],
    onSuccess: (_, vars) => {
      toast.success(vars.id ? t('vendor.extras.updated', 'Zusatz aktualisiert.') : t('vendor.extras.created', 'Zusatz angelegt.'));
      setModalOpen(false); setEditing(null);
    },
    onError: (err) => toast.error(err.message || t('vendor.extras.saveError', 'Fehler.')),
  });

  const deleteMutation = usePortalMutation({
    mutationFn: (id) => ExtrasApi.remove(id),
    invalidateKeys: [['vendor', 'extras'], ['vendor', 'dashboard']],
    onSuccess: () => { toast.success(t('vendor.extras.deleted', 'Zusatz gelöscht.')); setDeleteTarget(null); },
    onError: (err) => toast.error(err.message || t('vendor.extras.deleteError', 'Fehler.')),
  });

  const handleSave = (id, payload) => saveMutation.mutate({ id, payload });
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };

  const activeCount = extras.filter(e => e.is_active !== false).length;
  const totalRevenue = extras.reduce((s, e) => s + (e.price || 0), 0);

  const columns = [
    {
      header: t('vendor.extras.nameCol', 'Zusatz'), key: 'name', render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: row.is_active !== false ? 'rgba(168,85,247,0.1)' : 'var(--color-surface-sunken)' }}>
            <Sparkles size={14} style={{ color: row.is_active !== false ? '#A855F7' : 'var(--color-text-tertiary)' }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{v}</p>
            {row.description && <p className="text-[11px] truncate max-w-[200px]" style={{ color: 'var(--color-text-tertiary)' }}>{row.description}</p>}
          </div>
        </div>
      ),
    },
    {
      header: t('vendor.extras.priceCol', 'Preis'), key: 'price', render: (v) => (
        <span className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>
          {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v || 0)}
        </span>
      ),
    },
    {
      header: t('vendor.extras.durationCol', 'Dauer±'), key: 'duration_minutes', render: (v) => (
        <span className="text-[13px]" style={{ color: v > 0 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
          {v > 0 ? `+${v}` : v || 0} min
        </span>
      ),
    },
    {
      header: t('vendor.extras.servicesCol', 'Dienste'), key: 'service_ids', render: (v) => (
        <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
          {Array.isArray(v) ? v.length : 0}
        </span>
      ),
    },
    {
      header: '', key: 'id', render: (v, row) => (
        <div className="flex items-center gap-1 justify-end">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mr-1"
            style={{
              background: row.is_active !== false ? 'rgba(74,222,128,0.12)' : 'var(--color-surface-sunken)',
              color: row.is_active !== false ? 'var(--color-success)' : 'var(--color-text-tertiary)',
            }}>
            {row.is_active !== false ? 'Aktiv' : 'Inaktiv'}
          </span>
          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }}
            className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
            <Edit3 size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
            className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.extras.title', 'Zusatzleistungen')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.extras.subtitle', 'Verwalte Zusätze und Add-Ons für deine Dienstleistungen.')}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.extras.add', 'Neuer Zusatz')}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error?.message || 'Fehler'}</p>
          <button onClick={refetch} className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-5">
          <DashboardGrid cols={3}>
            <StatCard icon={Sparkles} label={t('vendor.extras.total', 'Gesamt')} value={extras.length} color="brand" />
            <StatCard icon={Package} label={t('vendor.extras.activeCount', 'Aktiv')} value={activeCount} color="success" />
            <StatCard icon={DollarSign} label={t('vendor.extras.totalValue', 'Gesamtwert')} value={`${totalRevenue.toFixed(2)} €`} color="warning" />
          </DashboardGrid>

          {extras.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                {t('vendor.extras.empty', 'Noch keine Zusatzleistungen angelegt.')}
              </p>
              <button onClick={openCreate}
                className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
                {t('vendor.extras.addFirst', 'Ersten Zusatz anlegen')}
              </button>
            </div>
          ) : (
            <DataTable columns={columns} data={extras} pageSize={10}
              emptyText={t('vendor.extras.empty', 'Keine Zusätze')} />
          )}
        </div>
      )}

      {modalOpen && (
        <ExtraModal extra={editing} services={services}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave} saving={saveMutation.isPending} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal extra={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={(id) => deleteMutation.mutate(id)}
          loading={deleteMutation.isPending} />
      )}
    </div>
  );
}
