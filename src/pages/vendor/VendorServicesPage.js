import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Edit3, Trash2, GripVertical, Loader2, AlertCircle, X, Package, DollarSign, Clock, ToggleLeft, ToggleRight
} from 'lucide-react';
import { ServicesApi } from '../../lib/api';
import { toast } from 'sonner';

function ServiceModal({ service, onClose, onSave, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration_minutes: 45,
    price: '0',
    category: '',
    is_active: true,
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        duration_minutes: service.duration_minutes || 45,
        price: String(service.price || '0'),
        category: service.category || '',
        is_active: service.is_active !== false,
      });
    }
  }, [service]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      duration_minutes: parseInt(form.duration_minutes, 10) || 45,
    };
    onSave(service?.id, payload);
  };

  return (
    <div data-testid="vendor-services-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {service ? t('vendor.services.edit_title', 'Dienstleistung bearbeiten') : t('vendor.services.create_title', 'Dienstleistung anlegen')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.services.name', 'Name')} *
            </label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.services.description', 'Beschreibung')}
            </label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none resize-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.services.duration', 'Dauer (Min.)')} *
              </label>
              <input type="number" value={form.duration_minutes} onChange={e => handleChange('duration_minutes', e.target.value)} min={5} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.services.price', 'Preis (€)')} *
              </label>
              <input type="number" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} min={0} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.services.category', 'Kategorie')}
            </label>
            <input type="text" value={form.category} onChange={e => handleChange('category', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleChange('is_active', !form.is_active)}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg cursor-pointer"
              style={{ background: form.is_active ? 'rgba(74,222,128,0.12)' : 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: form.is_active ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
              {form.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {form.is_active ? t('vendor.services.active', 'Aktiv') : t('vendor.services.inactive', 'Inaktiv')}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : (service ? t('vendor.services.save', 'Speichern') : t('vendor.services.create', 'Anlegen'))}
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

export default function VendorServicesPage() {
  const { t } = useTranslation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ServicesApi.list();
      setServices(Array.isArray(data) ? data : (data.services || data.data || []));
    } catch (err) {
      setError(err.message || t('vendor.services.load_error', 'Fehler beim Laden der Dienstleistungen.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [t]);

  const openCreate = () => { setEditingService(null); setModalOpen(true); };
  const openEdit = (svc) => { setEditingService(svc); setModalOpen(true); };

  const handleSave = async (id, payload) => {
    setSaving(true);
    try {
      if (id) {
        await ServicesApi.update(id, payload);
        toast.success(t('vendor.services.update_success', 'Dienstleistung aktualisiert.'));
      } else {
        await ServicesApi.create(payload);
        toast.success(t('vendor.services.create_success', 'Dienstleistung angelegt.'));
      }
      setModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      toast.error(err.message || t('vendor.services.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try {
      await ServicesApi.remove(id);
      toast.success(t('vendor.services.delete_success', 'Dienstleistung gelöscht.'));
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      toast.error(err.message || t('vendor.services.delete_error', 'Fehler beim Löschen.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newList = [...services];
    const [moved] = newList.splice(draggedIdx, 1);
    newList.splice(idx, 0, moved);
    setServices(newList);
    setDraggedIdx(idx);
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchServices}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && services.length === 0 && (
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

      {/* Service Cards */}
      {!loading && !error && services.length > 0 && (
        <div className="grid gap-3">
          {services.map((svc, idx) => (
            <div key={svc.id || idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${draggedIdx === idx ? 'opacity-50' : ''}`}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-divider)',
                cursor: 'grab',
              }}>
              <div className="shrink-0" style={{ color: 'var(--color-text-tertiary)', cursor: 'grab' }}>
                <GripVertical size={16} />
              </div>

              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: svc.is_active !== false ? 'var(--color-accent-muted)' : 'var(--color-surface-sunken)' }}>
                <Package size={16} style={{ color: svc.is_active !== false ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {svc.name}
                  </p>
                  {svc.is_active === false && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-text-tertiary)' }}>
                      {t('vendor.services.inactive', 'Inaktiv')}
                    </span>
                  )}
                </div>
                {svc.description && (
                  <p className="text-[12px] truncate mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{svc.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock size={13} /> {svc.duration_minutes || 45}{t('vendor.services.min', ' Min.')}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                  <DollarSign size={13} />
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(svc.price || 0)}
                </div>
                {svc.category && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full hidden lg:inline"
                    style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
                    {svc.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(svc)}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-surface-sunken)]"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => setDeleteTarget(svc)}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-danger-bg)]"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <ServiceModal service={editingService} onClose={() => { setModalOpen(false); setEditingService(null); }}
          onSave={handleSave} loading={saving} />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal service={deleteTarget} onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete} loading={saving} />
      )}
    </div>
  );
}
