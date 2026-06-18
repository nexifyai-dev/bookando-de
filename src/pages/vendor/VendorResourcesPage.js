import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, Plus, X, Edit3, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../../../src/lib/apiClient';
import PageLoadingState from '../../../src/components/shared/PageLoadingState';
import PageEmptyState from '../../../src/components/shared/PageEmptyState';
import PageErrorState from '../../../src/components/shared/PageErrorState';

export default function VendorResourcesPage() {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'room', capacity: 1 });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const { data } = await apiClient.get('/api/vendor/resources');
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Fehler beim Laden';
      setError(msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, capacity: parseInt(form.capacity, 10) || 1 };
      if (editing) {
        await apiClient.patch(`/api/vendor/resources/${editing.id}`, payload);
        toast.success(t('vendor.resources.updated', 'Ressource aktualisiert'));
      } else {
        await apiClient.post('/api/vendor/resources', payload);
        toast.success(t('vendor.resources.created', 'Ressource erstellt'));
      }
      setForm({ name: '', type: 'room', capacity: 1 });
      setEditing(null);
      await load();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Fehler beim Speichern';
      toast.error(msg);
    } finally { setSaving(false); }
  };

  const handleRemove = async (id) => {
    if (!window.confirm(t('vendor.resources.confirmDelete', 'Ressource wirklich löschen?'))) return;
    try {
      await apiClient.delete(`/api/vendor/resources/${id}`);
      setResources(r => r.filter(x => x.id !== id));
      toast.success(t('vendor.resources.deleted', 'Ressource gelöscht'));
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Fehler beim Löschen';
      toast.error(msg);
    }
  };

  const startEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name, type: r.type || 'room', capacity: r.capacity || 1 });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', type: 'room', capacity: 1 });
  };

  if (loading) return <PageLoadingState text={t('vendor.resources.loading', 'Ressourcen werden geladen…')} />;
  if (error) return <PageErrorState title={t('vendor.resources.error', 'Fehler')} message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{t('vendor.resources.title', 'Ressourcen')}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-divider-subtle)] p-5 mb-6" style={{ borderRadius: 'var(--radius-lg)' }}>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Wrench size={16} className="text-[var(--color-primary)]" />
          {editing ? t('vendor.resources.edit', 'Ressource bearbeiten') : t('vendor.resources.create', 'Neue Ressource')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            placeholder={t('vendor.resources.name', 'Name (z.B. Raum 1, Gerät A)')} required
            className="border border-[var(--color-divider)] px-3 py-2 text-sm" style={{borderRadius:'var(--radius-sm)'}} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="border border-[var(--color-divider)] px-3 py-2 text-sm" style={{borderRadius:'var(--radius-sm)'}}>
            <option value="room">Raum</option>
            <option value="equipment">Gerät</option>
            <option value="other">Sonstiges</option>
          </select>
          <input type="number" min={1} value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)||1})}
            placeholder={t('vendor.resources.capacity', 'Kapazität')}
            className="border border-[var(--color-divider)] px-3 py-2 text-sm" style={{borderRadius:'var(--radius-sm)'}} />
          <div className="flex gap-2">
            <button type="submit" disabled={saving || !form.name.trim()}
              className="inline-flex items-center gap-1.5 px-4 bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-40" style={{borderRadius:'var(--radius-sm)'}}>
              {saving ? <Loader2 size={14} className="animate-spin"/> : editing ? <Save size={14}/> : <Plus size={14}/>}
              {editing ? t('vendor.resources.save', 'Speichern') : t('vendor.resources.add', 'Hinzufügen')}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-4 border border-[var(--color-divider)] text-sm font-medium" style={{borderRadius:'var(--radius-sm)'}}>
                <X size={14}/> {t('vendor.resources.cancel', 'Abbrechen')}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* List */}
      {resources.length === 0 ? (
        <PageEmptyState icon={Wrench} title={t('vendor.resources.empty', 'Keine Ressourcen')}
          description={t('vendor.resources.emptyHint', 'Ressourcen wie Räume oder Geräte können bei Buchungen zugewiesen werden.')} />
      ) : (
        <div className="bg-white border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="divide-y divide-[var(--color-divider-subtle)]">
            {resources.map(r => (
              <div key={r.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[var(--color-surface-sunken)] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{r.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {r.type === 'room' ? 'Raum' : r.type === 'equipment' ? 'Gerät' : 'Sonstiges'}
                    {r.capacity > 1 ? ` · Kapazität: ${r.capacity}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(r)} aria-label={`${t('vendor.resources.editLabel', 'Ressource bearbeiten')} ${r.name}`}
                    className="h-8 w-8 flex items-center justify-center border border-[var(--color-divider)] text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)]" style={{borderRadius:'var(--radius-sm)'}}>
                    <Edit3 size={13}/>
                  </button>
                  <button onClick={() => handleRemove(r.id)} aria-label={`${t('vendor.resources.deleteLabel', 'Ressource löschen')} ${r.name}`}
                    className="h-8 w-8 flex items-center justify-center border border-[var(--color-divider)] text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]" style={{borderRadius:'var(--radius-sm)'}}>
                    <X size={13}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
