import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StickyNote, Plus } from 'lucide-react';
import PageEmptyState from '../../../src/components/shared/PageEmptyState';

export default function StaffNotesPage() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [customerId, setCustomerId] = useState('');

  const addNote = () => {
    if (!text.trim() || !customerId.trim()) return;
    setNotes(n => [{ id: Date.now(), text: text.trim(), customer_id: customerId, created_at: new Date().toISOString(), author: 'Staff' }, ...n]);
    setText('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] mb-6">{t('staff.notes.title', 'Notizen')}</h1>

      <div className="bg-white border border-[var(--color-divider-subtle)] p-5 mb-6" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="flex gap-2 mb-3">
          <input type="text" value={customerId} onChange={e => setCustomerId(e.target.value)} placeholder="Kunden-ID"
            className="flex-1 border border-[var(--color-divider)] px-3 py-2 text-xs" style={{borderRadius:'var(--radius-sm)', maxWidth: '200px'}} />
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={t('staff.notes.placeholder', 'Notiz eingeben…')}
            className="flex-1 border border-[var(--color-divider)] px-3 py-2 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
          <button onClick={addNote} disabled={!text.trim() || !customerId.trim()}
            className="inline-flex items-center gap-1 px-4 bg-[var(--color-primary)] text-white text-xs font-medium disabled:opacity-40" style={{borderRadius:'var(--radius-sm)'}}>
            <Plus size={14}/> {t('staff.notes.add', 'Hinzufügen')}
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <PageEmptyState icon={StickyNote} title={t('staff.notes.empty', 'Keine Notizen')} description={t('staff.notes.emptyHint', 'Notizen werden terminierten Kunden zugeordnet und sind für Mitarbeiter sichtbar.')} />
      ) : (
        <div className="space-y-3">
          {notes.map(n => (
            <div key={n.id} className="bg-white border border-[var(--color-divider-subtle)] p-4" style={{borderRadius:'var(--radius-lg)'}}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                    {t('staff.notes.for', 'Kunde')}: {n.customer_id}
                  </p>
                  <p className="text-sm text-[var(--color-text-primary)]">{n.text}</p>
                </div>
                <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                  {new Date(n.created_at).toLocaleString('de-DE', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
