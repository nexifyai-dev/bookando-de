import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Plus, Edit3, Trash2, X, Loader2, AlertCircle, Star, Phone, Globe
} from 'lucide-react';
import { LocationsApi } from '../../lib/api';
import { toast } from 'sonner';

function LocationModal({ location, onClose, onSave, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Deutschland',
    phone: '',
    is_primary: false,
  });

  useEffect(() => {
    if (location) {
      setForm({
        name: location.name || '',
        address: location.address || '',
        city: location.city || '',
        postal_code: location.postal_code || '',
        country: location.country || 'Deutschland',
        phone: location.phone || '',
        is_primary: location.is_primary || false,
      });
    }
  }, [location]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(location?.id, form);
  };

  return (
    <div data-testid="vendor-locations-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {location ? t('vendor.locations.edit_title', 'Standort bearbeiten') : t('vendor.locations.create_title', 'Standort anlegen')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.locations.name', 'Name')} *
            </label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.locations.address', 'Adresse')} *
            </label>
            <input type="text" value={form.address} onChange={e => handleChange('address', e.target.value)} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.locations.postal_code', 'PLZ')} *
              </label>
              <input type="text" value={form.postal_code} onChange={e => handleChange('postal_code', e.target.value)} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div className="col-span-2">
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.locations.city', 'Stadt')} *
              </label>
              <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.locations.country', 'Land')}
              </label>
              <input type="text" value={form.country} onChange={e => handleChange('country', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.locations.phone', 'Telefon')}
              </label>
              <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleChange('is_primary', !form.is_primary)}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg cursor-pointer"
              style={{
                background: form.is_primary ? 'var(--color-accent-muted)' : 'var(--color-surface-sunken)',
                border: '1px solid var(--color-divider)',
                color: form.is_primary ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              }}>
              <Star size={14} />
              {form.is_primary ? t('vendor.locations.primary', 'Hauptstandort') : t('vendor.locations.set_primary', 'Als Hauptstandort')}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : (location ? t('vendor.locations.save', 'Speichern') : t('vendor.locations.create', 'Anlegen'))}
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

function DeleteConfirmModal({ location, onClose, onConfirm, loading }) {
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
            {t('vendor.locations.delete_title', 'Standort löschen')}
          </h3>
          <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.locations.delete_confirm', 'Bist du sicher, dass du "{{name}}" löschen möchtest?', { name: location?.name || '' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onConfirm(location.id)} disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-danger)' }}>
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.locations.delete', 'Löschen')}
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

export default function VendorLocationsPage() {
  const { t } = useTranslation();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LocationsApi.list();
      setLocations(Array.isArray(data) ? data : (data.locations || data.data || []));
    } catch (err) {
      setError(err.message || t('vendor.locations.load_error', 'Fehler beim Laden der Standorte.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, [t]);

  const openCreate = () => { setEditingLocation(null); setModalOpen(true); };
  const openEdit = (loc) => { setEditingLocation(loc); setModalOpen(true); };

  const handleSave = async (id, payload) => {
    setSaving(true);
    try {
      if (id) {
        await LocationsApi.update(id, payload);
        toast.success(t('vendor.locations.update_success', 'Standort aktualisiert.'));
      } else {
        await LocationsApi.create(payload);
        toast.success(t('vendor.locations.create_success', 'Standort angelegt.'));
      }
      setModalOpen(false);
      setEditingLocation(null);
      fetchLocations();
    } catch (err) {
      toast.error(err.message || t('vendor.locations.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try {
      await LocationsApi.remove(id);
      toast.success(t('vendor.locations.delete_success', 'Standort gelöscht.'));
      setDeleteTarget(null);
      fetchLocations();
    } catch (err) {
      toast.error(err.message || t('vendor.locations.delete_error', 'Fehler beim Löschen.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.locations.title', 'Standorte')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.locations.subtitle', 'Verwalte deine Geschäftsstandorte.')}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.locations.add', 'Neuer Standort')}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchLocations}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && locations.length === 0 && (
        <div className="text-center py-20">
          <MapPin size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem', marginBottom: '12px' }}>
            {t('vendor.locations.empty', 'Noch keine Standorte angelegt.')}
          </p>
          <button onClick={openCreate}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('vendor.locations.add_first', 'Ersten Standort anlegen')}
          </button>
        </div>
      )}

      {!loading && !error && locations.length > 0 && (
        <div className="grid gap-3">
          {locations.map((loc, i) => (
            <div key={loc.id || i}
              className="flex items-center gap-4 px-5 py-4 rounded-xl"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-accent-muted)' }}>
                <MapPin size={18} style={{ color: 'var(--color-accent)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {loc.name}
                  </p>
                  {loc.is_primary && (
                    <Star size={12} style={{ color: 'var(--color-accent)' }} />
                  )}
                </div>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  {loc.address}, {loc.postal_code} {loc.city}
                  {loc.country && `, ${loc.country}`}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                {loc.phone && (
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <Phone size={12} /> {loc.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(loc)}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-surface-sunken)]"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => setDeleteTarget(loc)}
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-danger-bg)]"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <LocationModal location={editingLocation} onClose={() => { setModalOpen(false); setEditingLocation(null); }}
          onSave={handleSave} loading={saving} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal location={deleteTarget} onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete} loading={saving} />
      )}
    </div>
  );
}
