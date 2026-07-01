import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, GripVertical, Trash2, Loader2, AlertCircle, Eye, EyeOff, Save,
  Type, Mail, Phone, AlignLeft, List, CheckSquare, Calendar, Upload, X,
} from 'lucide-react';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { toast } from 'sonner';
import apiClient from '../../lib/apiClient';

const BookingFormApi = {
  get: () => apiClient.get('/api/vendor/booking-form').then(r => r.data),
  save: (p) => apiClient.put('/api/vendor/booking-form', p).then(r => r.data),
};

const FIELD_TYPES = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'email', icon: Mail, label: 'E-Mail' },
  { type: 'phone', icon: Phone, label: 'Telefon' },
  { type: 'textarea', icon: AlignLeft, label: 'Textbereich' },
  { type: 'select', icon: List, label: 'Auswahl' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'date', icon: Calendar, label: 'Datum' },
  { type: 'file', icon: Upload, label: 'Datei' },
];

const defaultField = (type) => ({
  id: crypto.randomUUID(),
  type,
  label: FIELD_TYPES.find(f => f.type === type)?.label || type,
  placeholder: '',
  required: false,
  options: type === 'select' ? ['Option 1'] : undefined,
});

/* ─── Field Editor Row ─── */
function FieldRow({ field, index, onUpdate, onDelete, onDragStart, onDragOver, onDrop }) {
  const { t } = useTranslation();
  const typeInfo = FIELD_TYPES.find(f => f.type === field.type);
  const Icon = typeInfo?.icon || Type;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
      onDrop={() => onDrop(index)}
      className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}
    >
      <div className="pt-2 cursor-grab" style={{ color: 'var(--color-text-tertiary)' }}>
        <GripVertical size={16} />
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
            <Icon size={12} className="inline mr-1" />
            {t('vendor.bookingForm.fieldType', 'Feldtyp')}
          </label>
          <select value={field.type} onChange={e => onUpdate({ ...field, type: e.target.value, options: e.target.value === 'select' ? (field.options || ['Option 1']) : undefined })}
            className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}>
            {FIELD_TYPES.map(f => <option key={f.type} value={f.type}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.bookingForm.label', 'Bezeichnung')}
          </label>
          <input type="text" value={field.label} onChange={e => onUpdate({ ...field, label: e.target.value })}
            className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
        </div>
        <div>
          <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t('vendor.bookingForm.placeholder', 'Platzhalter')}
          </label>
          <input type="text" value={field.placeholder || ''} onChange={e => onUpdate({ ...field, placeholder: e.target.value })}
            className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
        </div>
        {field.type === 'select' && (
          <div className="sm:col-span-2">
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.bookingForm.options', 'Optionen (kommagetrennt)')}
            </label>
            <input type="text" value={(field.options || []).join(', ')}
              onChange={e => onUpdate({ ...field, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 pt-2 shrink-0">
        <button type="button" onClick={() => onUpdate({ ...field, required: !field.required })}
          className="text-[11px] font-semibold px-2 py-1 rounded-full cursor-pointer"
          style={{
            background: field.required ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-sunken)',
            color: field.required ? '#EF4444' : 'var(--color-text-tertiary)',
          }}>
          {field.required ? 'Pflicht' : 'Optional'}
        </button>
        <button type="button" onClick={() => onDelete(field.id)}
          className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Preview ─── */
function FormPreview({ fields }) {
  const { t } = useTranslation();
  if (!fields.length) return (
    <p className="text-[13px] py-8 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
      {t('vendor.bookingForm.noFields', 'Keine Felder definiert')}
    </p>
  );
  return (
    <div className="space-y-4">
      {fields.map(f => (
        <div key={f.id}>
          <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
            {f.label} {f.required && <span className="text-red-400">*</span>}
          </label>
          {f.type === 'textarea' ? (
            <textarea placeholder={f.placeholder} disabled rows={3}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none opacity-70"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          ) : f.type === 'select' ? (
            <select disabled className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none opacity-70"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}>
              <option>{f.placeholder || '—'}</option>
              {(f.options || []).map(o => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === 'checkbox' ? (
            <label className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-primary)' }}>
              <input type="checkbox" disabled /> {f.placeholder || f.label}
            </label>
          ) : f.type === 'file' ? (
            <input type="file" disabled className="w-full text-[13px]" />
          ) : (
            <input type={f.type === 'phone' ? 'tel' : f.type} placeholder={f.placeholder} disabled
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none opacity-70"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function VendorBookingFormBuilder() {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  const { data: formData, isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'booking-form'],
    () => BookingFormApi.get().catch(() => ({ fields: [] })),
  );

  const [fields, setFields] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // sync server → local once
  if (!loaded && formData && !isLoading) {
    setFields(Array.isArray(formData?.fields) ? formData.fields : []);
    setLoaded(true);
  }

  const saveMutation = usePortalMutation({
    mutationFn: () => BookingFormApi.save({ fields }),
    invalidateKeys: [['vendor', 'booking-form']],
    onSuccess: () => toast.success(t('vendor.bookingForm.saved', 'Formular gespeichert.')),
    onError: (err) => toast.error(err.message || t('vendor.bookingForm.saveError', 'Fehler beim Speichern.')),
  });

  const addField = (type) => setFields(prev => [...prev, defaultField(type)]);
  const updateField = (updated) => setFields(prev => prev.map(f => f.id === updated.id ? updated : f));
  const deleteField = (id) => setFields(prev => prev.filter(f => f.id !== id));

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = () => {}; // visual feedback only
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    setFields(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.bookingForm.title', 'Buchungsformular')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.bookingForm.subtitle', 'Gestalte das Kunden-Formular individuell.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
            {preview ? <EyeOff size={16} /> : <Eye size={16} />}
            {preview ? t('vendor.bookingForm.edit', 'Bearbeiten') : t('vendor.bookingForm.preview', 'Vorschau')}
          </button>
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-primary)' }}>
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t('common.save', 'Speichern')}
          </button>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Field palette */}
          {!preview && (
            <div className="rounded-xl p-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <p className="text-[12px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                {t('vendor.bookingForm.addField', 'Feld hinzufügen')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_TYPES.map(f => {
                  const Icon = f.icon;
                  return (
                    <button key={f.type} onClick={() => addField(f.type)}
                      className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-lg cursor-pointer transition-colors"
                      style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
                      <Icon size={14} /> {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form area */}
          <div className={preview ? 'lg:col-span-4' : 'lg:col-span-3'}>
            <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {preview ? t('vendor.bookingForm.previewTitle', 'Formular-Vorschau') : t('vendor.bookingForm.fields', 'Formularfelder')}
                  <span className="ml-2 text-[11px] font-normal" style={{ color: 'var(--color-text-tertiary)' }}>{fields.length}</span>
                </p>
              </div>
              {preview ? (
                <FormPreview fields={fields} />
              ) : fields.length === 0 ? (
                <div className="text-center py-12">
                  <Plus size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px', opacity: 0.4 }} />
                  <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('vendor.bookingForm.empty', 'Links Feldtypen auswählen, um Felder hinzuzufügen.')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((f, idx) => (
                    <FieldRow key={f.id} field={f} index={idx}
                      onUpdate={updateField} onDelete={deleteField}
                      onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
