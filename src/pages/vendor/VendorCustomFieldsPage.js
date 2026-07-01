import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Loader2, AlertCircle, GripVertical, Trash2, X, Save, Edit3,
  ToggleLeft, ToggleRight, Type, Hash, List, CheckSquare, Calendar
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { DashboardSection } from '../../components/dashboard/DashboardGrid';
import { toast } from 'sonner';

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Zahl', icon: Hash },
  { value: 'select', label: 'Auswahl', icon: List },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'date', label: 'Datum', icon: Calendar },
];

/* ── Field Editor Row ── */
function FieldRow({ field, index, onUpdate, onDelete, onDragStart, onDragOver, onDrop, total }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...field });

  const TypeIcon = FIELD_TYPES.find(ft => ft.value === field.type)?.icon || Type;

  const save = () => {
    onUpdate(index, form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-white border border-brand/30 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{t('fields.label', 'Bezeichnung')}</label>
            <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{t('fields.key', 'Schlüssel')}</label>
            <input value={form.key} onChange={e => setForm(p => ({ ...p, key: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand font-mono" />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{t('fields.type', 'Typ')}</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand">
              {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
            </select>
          </div>
        </div>
        {form.type === 'select' && (
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{t('fields.options', 'Optionen (kommagetrennt)')}</label>
            <input value={form.options?.join(', ') || ''} onChange={e => setForm(p => ({ ...p, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <button type="button" onClick={() => setForm(p => ({ ...p, required: !p.required }))}
            className={`relative w-9 h-5 rounded-full transition-colors ${form.required ? 'bg-brand' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.required ? 'translate-x-4' : ''}`} />
          </button>
          <span className="text-xs text-gray-600">{t('fields.required', 'Pflichtfeld')}</span>
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(false)} className="h-8 px-3 text-[11px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">{t('common.cancel', 'Abbrechen')}</button>
          <button onClick={save} className="h-8 px-3 text-[11px] rounded-lg bg-brand text-white hover:opacity-90 flex items-center gap-1"><Save size={12} /> {t('common.save', 'Speichern')}</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-grab"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index); }}
      onDrop={() => onDrop(index)}
    >
      <GripVertical size={16} className="text-gray-300 shrink-0" />
      <TypeIcon size={14} className="text-gray-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 truncate">{field.label}</p>
        <p className="text-[11px] text-gray-400">{field.key} · {field.type}{field.required ? ' · Pflicht' : ''}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand"><Edit3 size={14} /></button>
        <button onClick={() => onDelete(index)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-danger"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function VendorCustomFieldsPage() {
  const { t } = useTranslation();
  const [dragIdx, setDragIdx] = useState(null);

  const { data: fields = [], isLoading, isError, refetch } = useAutoRefresh(
    ['vendor', 'custom-fields'],
    () => apiClient.get('/api/vendor/custom-fields').then(r => Array.isArray(r.data) ? r.data : []),
  );

  const saveMut = usePortalMutation({
    mutationFn: (data) => apiClient.put('/api/vendor/custom-fields', { fields: data }),
    invalidateKeys: [['vendor', 'custom-fields']],
    onSuccess: () => toast.success(t('fields.saved', 'Felder gespeichert')),
    onError: () => toast.error(t('fields.save_error', 'Fehler beim Speichern')),
  });

  const [localFields, setLocalFields] = useState(null);
  const currentFields = localFields ?? fields;

  const sync = useCallback((updated) => {
    setLocalFields(updated);
  }, []);

  const addField = () => {
    const newField = {
      key: `field_${Date.now()}`,
      label: t('fields.new', 'Neues Feld'),
      type: 'text',
      required: false,
      options: [],
    };
    sync([...currentFields, newField]);
  };

  const updateField = (idx, data) => {
    const updated = [...currentFields];
    updated[idx] = { ...updated[idx], ...data };
    sync(updated);
  };

  const deleteField = (idx) => {
    sync(currentFields.filter((_, i) => i !== idx));
  };

  const onDragStart = (idx) => setDragIdx(idx);
  const onDragOver = () => {};
  const onDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...currentFields];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    sync(updated);
    setDragIdx(null);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (isError) return <div className="flex items-center justify-center min-h-[60vh] text-danger"><AlertCircle size={20} className="mr-2" />{t('common.error', 'Fehler')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">{t('fields.title_page', 'Benutzerdefinierte Felder')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('fields.desc', 'Definiere zusätzliche Felder für Buchungen')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addField}
            className="h-9 px-4 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <Plus size={14} /> {t('fields.add', 'Feld hinzufügen')}
          </button>
          <button onClick={() => saveMut.mutate(currentFields)} disabled={saveMut.isPending || localFields === null}
            className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
            {saveMut.isPending && <Loader2 size={14} className="animate-spin" />}
            <Save size={14} /> {t('common.save', 'Speichern')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {currentFields.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-sm text-gray-400">{t('fields.empty', 'Noch keine Felder definiert')}</p>
            <button onClick={addField} className="mt-4 h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 inline-flex items-center gap-1.5">
              <Plus size={14} /> {t('fields.add', 'Feld hinzufügen')}
            </button>
          </div>
        ) : currentFields.map((f, i) => (
          <FieldRow
            key={f.key || i}
            field={f}
            index={i}
            total={currentFields.length}
            onUpdate={updateField}
            onDelete={deleteField}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
}
