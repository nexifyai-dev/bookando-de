import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Trash2, Loader2, AlertCircle, CalendarOff, X, Repeat, CalendarRange,
} from 'lucide-react';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import { DataTable } from '../../components/dashboard/DataTable';
import { toast } from 'sonner';
import apiClient from '../../lib/apiClient';

const DaysOffApi = {
  list: () => apiClient.get('/api/vendor/days-off').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/days-off', p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/days-off/${id}`).then(r => r.data),
};

const INPUT = { background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' };

/* ─── Add Modal ─── */
function AddDayOffModal({ onClose, onSave, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    recurring: false,
  });
  const [useRange, setUseRange] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.start_date) return;
    onSave({ ...form, end_date: useRange ? form.end_date : undefined });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.daysOff.add', 'Betriebsruhe hinzufügen')}
          </h3>
          <button onClick={onClose} className="p-1 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.daysOff.reason', 'Grund')}
            </label>
            <select value={form.reason} onChange={e => handleChange('reason', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT}>
              <option value="">{t('vendor.daysOff.selectReason', 'Grund wählen...')}</option>
              <option value="holiday">{t('vendor.daysOff.holiday', 'Feiertag')}</option>
              <option value="renovation">{t('vendor.daysOff.renovation', 'Renovierung')}</option>
              <option value="company_event">{t('vendor.daysOff.companyEvent', 'Firmenveranstaltung')}</option>
              <option value="weather">{t('vendor.daysOff.weather', 'Wetter')}</option>
              <option value="other">{t('vendor.daysOff.other', 'Sonstiges')}</option>
            </select>
          </div>
          {form.reason === 'other' && (
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.daysOff.customReason', 'Eigener Grund')}
              </label>
              <input type="text" value={form._custom || ''} onChange={e => handleChange('_custom', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.daysOff.startDate', 'Startdatum')} *
              </label>
              <input type="date" value={form.start_date} onChange={e => handleChange('start_date', e.target.value)} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {useRange ? t('vendor.daysOff.endDate', 'Enddatum') : '—'}
              </label>
              <input type="date" value={form.end_date} onChange={e => handleChange('end_date', e.target.value)}
                disabled={!useRange} min={form.start_date || undefined}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none disabled:opacity-40" style={INPUT} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useRange} onChange={e => setUseRange(e.target.checked)} />
            <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <CalendarRange size={12} className="inline mr-1" />
              {t('vendor.daysOff.useRange', 'Zeitraum (Start- bis Enddatum)')}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.recurring} onChange={e => handleChange('recurring', e.target.checked)} />
            <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <Repeat size={12} className="inline mr-1" />
              {t('vendor.daysOff.recurring', 'Jährlich wiederkehrend')}
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.daysOff.save', 'Speichern')}
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

/* ─── Main ─── */
export default function VendorCompanyDaysOffPage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: daysOff = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'days-off'],
    () => DaysOffApi.list().then(d => Array.isArray(d) ? d : d?.data || []),
  );

  const addMutation = usePortalMutation({
    mutationFn: (payload) => DaysOffApi.create(payload),
    invalidateKeys: [['vendor', 'days-off']],
    onSuccess: () => { toast.success(t('vendor.daysOff.added', 'Betriebsruhe gespeichert.')); setModalOpen(false); },
    onError: (err) => toast.error(err.message || t('vendor.daysOff.saveError', 'Fehler.')),
  });

  const deleteMutation = usePortalMutation({
    mutationFn: (id) => DaysOffApi.remove(id),
    invalidateKeys: [['vendor', 'days-off']],
    onSuccess: () => toast.success(t('vendor.daysOff.deleted', 'Betriebsruhe gelöscht.')),
    onError: (err) => toast.error(err.message || t('vendor.daysOff.deleteError', 'Fehler.')),
  });

  const futureCount = useMemo(() => {
    const now = new Date();
    return daysOff.filter(d => new Date(d.end_date || d.start_date) >= now).length;
  }, [daysOff]);

  const reasonLabel = (r) => {
    const map = {
      holiday: 'Feiertag', renovation: 'Renovierung', company_event: 'Firmenevent',
      weather: 'Wetter', other: 'Sonstiges',
    };
    return map[r] || r || '—';
  };

  const columns = [
    { header: t('vendor.daysOff.reasonCol', 'Grund'), key: 'reason', render: (v) => reasonLabel(v) },
    { header: t('vendor.daysOff.dateCol', 'Datum / Zeitraum'), key: 'start_date', render: (v, row) => (
      <span>{v}{row.end_date && row.end_date !== v ? ` – ${row.end_date}` : ''}</span>
    )},
    { header: '', key: 'id', render: (v, row) => (
      <div className="flex items-center gap-1">
        {row.recurring && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(99,179,237,0.12)', color: '#3182CE' }}>
            <Repeat size={10} className="inline mr-0.5" />{t('vendor.daysOff.recurring', 'Jährlich')}
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(v); }}
          className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    )},
  ];

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.daysOff.title', 'Betriebsruhe')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.daysOff.subtitle', 'Verwende unternehmensweite freie Tage und Feiertage.')}</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.daysOff.add', 'Betriebsruhe hinzufügen')}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard icon={CalendarOff} label={t('vendor.daysOff.total', 'Gesamt')} value={daysOff.length} color="brand" />
            <StatCard icon={CalendarRange} label={t('vendor.daysOff.upcoming', 'Anstehend')} value={futureCount} color="warning" />
            <StatCard icon={Repeat} label={t('vendor.daysOff.recurringCount', 'Jährlich')} value={daysOff.filter(d => d.recurring).length} color="info" />
          </div>

          {daysOff.length === 0 ? (
            <div className="text-center py-20">
              <CalendarOff size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                {t('vendor.daysOff.empty', 'Noch keine Betriebsruhe angelegt.')}
              </p>
              <button onClick={() => setModalOpen(true)}
                className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
                {t('vendor.daysOff.addFirst', 'Erste Betriebsruhe anlegen')}
              </button>
            </div>
          ) : (
            <DataTable columns={columns} data={daysOff} pageSize={15}
              emptyText={t('vendor.daysOff.empty', 'Keine Betriebsruhe')} />
          )}
        </div>
      )}

      {modalOpen && (
        <AddDayOffModal
          onClose={() => setModalOpen(false)}
          onSave={(p) => addMutation.mutate(p)}
          saving={addMutation.isPending}
        />
      )}
    </div>
  );
}
