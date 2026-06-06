import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Edit3, Trash2, GripVertical, Loader2, AlertCircle, X, Package, DollarSign, Clock, ToggleLeft, ToggleRight, MapPin, User, Wifi
} from 'lucide-react';
import { ServicesApi, LocationsApi, EmployeesApi } from '../../lib/api';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { toast } from 'sonner';

/* ─── Service Create/Edit Modal ─── */
function ServiceModal({ service, locations, employees, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: service?.name || '',
    description: service?.description || '',
    duration_minutes: service?.duration_minutes || 45,
    price: String(service?.price || '0'),
    category: service?.category || '',
    location_id: service?.location_id || '',
    employee_id: service?.employee_id || '',
    buffer_before: service?.buffer_before || 0,
    buffer_after: service?.buffer_after || 0,
    lead_days: service?.lead_days || 0,
    is_online: service?.is_online || false,
    is_active: service?.is_active !== false,
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(service?.id, {
      ...form,
      price: parseFloat(form.price) || 0,
      duration_minutes: parseInt(form.duration_minutes, 10) || 45,
      buffer_before: parseInt(form.buffer_before, 10) || 0,
      buffer_after: parseInt(form.buffer_after, 10) || 0,
      lead_days: parseInt(form.lead_days, 10) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {service ? t('vendor.services.edit_title', 'Dienstleistung bearbeiten') : t('vendor.services.create_title', 'Dienstleistung anlegen')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.name', 'Name')} *</label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          {/* Description */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.description', 'Beschreibung')}</label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={2}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none resize-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.duration', 'Dauer (Min.)')} *</label>
              <input type="number" value={form.duration_minutes} onChange={e => handleChange('duration_minutes', e.target.value)} min={5} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.price', 'Preis (€)')} *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} min={0} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          {/* Buffer (vor/nach) + Lead */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.buffer_before', 'Puffer vor (Min.)')}</label>
              <input type="number" value={form.buffer_before} onChange={e => handleChange('buffer_before', e.target.value)} min={0}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.buffer_after', 'Puffer nach (Min.)')}</label>
              <input type="number" value={form.buffer_after} onChange={e => handleChange('buffer_after', e.target.value)} min={0}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.lead_days', 'Vorlauf (Tage)')}</label>
              <input type="number" value={form.lead_days} onChange={e => handleChange('lead_days', e.target.value)} min={0}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          {/* Kategorie */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.services.category', 'Kategorie')}</label>
            <input type="text" value={form.category} onChange={e => handleChange('category', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          {/* Location */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              <MapPin size={12} className="inline mr-1" />{t('vendor.services.location', 'Standort')}
            </label>
            <select value={form.location_id} onChange={e => handleChange('location_id', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}>
              <option value="">—</option>
              {Array.isArray(locations) && locations.map(l => (
                <option key={l.id} value={l.id}>{l.name || l.city || l.address || l.id?.slice(0, 8)}</option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              <User size={12} className="inline mr-1" />{t('vendor.services.employee', 'Mitarbeiter')}
            </label>
            <select value={form.employee_id} onChange={e => handleChange('employee_id', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}>
              <option value="">—</option>
              {Array.isArray(employees) && employees.map(e => (
                <option key={e.id} value={e.id}>{e.name || e.first_name || e.email || e.id?.slice(0, 8)}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => handleChange('is_active', !form.is_active)}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg cursor-pointer"
              style={{ background: form.is_active ? 'rgba(74,222,128,0.12)' : 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: form.is_active ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
              {form.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {form.is_active ? t('vendor.services.active', 'Aktiv') : t('vendor.services.inactive', 'Inaktiv')}
            </button>
            <button type="button" onClick={() => handleChange('is_online', !form.is_online)}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg cursor-pointer"
              style={{ background: form.is_online ? 'rgba(99,179,237,0.12)' : 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: form.is_online ? '#3182CE' : 'var(--color-text-tertiary)' }}>
              <Wifi size={16} />
              {form.is_online ? t('vendor.services.online', 'Online') : t('vendor.services.offline', 'Vor Ort')}
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : (service ? t('vendor.services.save', 'Speichern') : t('vendor.services.create', 'Anlegen'))}
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

/* ─── Delete Confirm Modal ─── */
function DeleteConfirmModal({ service, onClose, onConfirm, loading }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <Trash2 size={36} style={{ color: 'var(--color-danger)', margin: '0 auto 12px' }} />
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.services.delete_title', 'Dienstleistung löschen')}
          </h3>
          <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.services.delete_confirm', 'Bist du sicher, dass du "{{name}}" löschen möchtest?', { name: service?.name || '' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onConfirm(service.id)} disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-danger)' }}>
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.services.delete', 'Löschen')}
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

/* ─── Main Component ─── */
export default function VendorServicesPage() {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  // ─── useAutoRefresh for services, locations, employees ───
  const { data: services = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'services'],
    () => ServicesApi.list().then(d => Array.isArray(d) ? d : d?.services || d?.data || []),
  );
  const { data: locations = [] } = useAutoRefresh(['vendor', 'locations'], () =>
    LocationsApi.list().then(d => Array.isArray(d) ? d : []), { enabled: modalOpen });
  const { data: employees = [] } = useAutoRefresh(['vendor', 'employees'], () =>
    EmployeesApi.list().then(d => Array.isArray(d) ? d : []), { enabled: modalOpen });

  // ─── Mutations ───
  const saveMutation = usePortalMutation({
    mutationFn: ({ id, payload }) => id ? ServicesApi.update(id, payload) : ServicesApi.create(payload),
    invalidateKeys: [['vendor', 'services'], ['vendor', 'dashboard']],
    onSuccess: (_, vars) => {
      toast.success(vars.id
        ? t('vendor.services.update_success', 'Dienstleistung aktualisiert.')
        : t('vendor.services.create_success', 'Dienstleistung angelegt.'));
      setModalOpen(false);
      setEditingService(null);
    },
    onError: (err) => toast.error(err.message || t('vendor.services.save_error', 'Fehler beim Speichern.')),
  });

  const deleteMutation = usePortalMutation({
    mutationFn: (id) => ServicesApi.remove(id),
    invalidateKeys: [['vendor', 'services'], ['vendor', 'dashboard']],
    onSuccess: () => {
      toast.success(t('vendor.services.delete_success', 'Dienstleistung gelöscht.'));
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || t('vendor.services.delete_error', 'Fehler beim Löschen.')),
  });

  // ─── Handler ───
  const handleSave = (id, payload) => saveMutation.mutate({ id, payload });
  const handleDelete = (id) => deleteMutation.mutate(id);

  const openCreate = () => { setEditingService(null); setModalOpen(true); };
  const openEdit = (svc) => { setEditingService(svc); setModalOpen(true); };

  const saving = saveMutation.isPending || deleteMutation.isPending;

  // ─── Drag & Drop ───
  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    // lokal sortieren
  };
  const handleDragEnd = () => setDraggedIdx(null);

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.services.title', 'Dienstleistungen')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.services.subtitle', 'Verwalte deine angebotenen Dienstleistungen.')}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.services.add', 'Neue Dienstleistung')}
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
          <button onClick={refetch}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem', marginBottom: '12px' }}>
            {t('vendor.services.empty', 'Noch keine Dienstleistungen angelegt.')}
          </p>
          <button onClick={openCreate}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('vendor.services.add_first', 'Erste Dienstleistung anlegen')}
          </button>
        </div>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="grid gap-3">
          {services.map((svc, idx) => (
            <div key={svc.id || idx}
              className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-divider)',
              }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: svc.is_active !== false ? 'var(--color-accent-muted)' : 'var(--color-surface-sunken)' }}>
                <Package size={16} style={{ color: svc.is_active !== false ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{svc.name}</p>
                  {svc.is_active === false && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-text-tertiary)' }}>{t('vendor.services.inactive', 'Inaktiv')}</span>
                  )}
                  {svc.is_online && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(99,179,237,0.12)', color: '#3182CE' }}>{t('vendor.services.online', 'Online')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  <span><Clock size={11} className="inline mr-0.5" />{svc.duration_minutes || 45} min</span>
                  {svc.buffer_before > 0 && <span>+{svc.buffer_before}′ vor</span>}
                  {svc.buffer_after > 0 && <span>+{svc.buffer_after}′ nach</span>}
                  {svc.lead_days > 0 && <span>{svc.lead_days}d Vorlauf</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(svc.price || 0)}
                </span>
                {svc.category && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full hidden lg:inline"
                    style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{svc.category}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(svc)}
                  className="p-2 rounded-lg cursor-pointer"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => setDeleteTarget(svc)}
                  className="p-2 rounded-lg cursor-pointer"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ServiceModal
          service={editingService}
          locations={locations}
          employees={employees}
          onClose={() => { setModalOpen(false); setEditingService(null); }}
          onSave={handleSave}
          saving={saveMutation.isPending}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          service={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
