import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, X } from 'lucide-react';
import PageEmptyState from '../../../src/components/shared/PageEmptyState';

export default function StaffAvailabilityPage() {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([
    { day: 'monday', label: 'Montag', from: '09:00', to: '18:00', enabled: true },
    { day: 'tuesday', label: 'Dienstag', from: '09:00', to: '18:00', enabled: true },
    { day: 'wednesday', label: 'Mittwoch', from: '09:00', to: '18:00', enabled: true },
    { day: 'thursday', label: 'Donnerstag', from: '09:00', to: '18:00', enabled: true },
    { day: 'friday', label: 'Freitag', from: '09:00', to: '16:00', enabled: true },
    { day: 'saturday', label: 'Samstag', from: '', to: '', enabled: false },
    { day: 'sunday', label: 'Sonntag', from: '', to: '', enabled: false },
  ]);

  const [exceptions, setExceptions] = useState([]);

  const handleToggle = (day) => {
    setSchedules(s => s.map(e => e.day === day ? {...e, enabled: !e.enabled} : e));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedules(s => s.map(e => e.day === day ? {...e, [field]: value} : e));
  };

  const addException = () => {
    setExceptions(e => [...e, { id: Date.now(), date: '', from: '', to: '' }]);
  };

  const removeException = (id) => {
    setExceptions(e => e.filter(x => x.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] mb-6">{t('staff.availability.title', 'Verfügbarkeit')}</h1>

      <div className="bg-white border border-[var(--color-divider-subtle)] p-5 mb-6" style={{ borderRadius: 'var(--radius-lg)' }}>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Clock size={16} className="text-[var(--color-primary)]" />{t('staff.availability.schedule', 'Reguläre Arbeitszeiten')}
        </h2>
        {schedules.map(s => (
          <div key={s.day} className="flex items-center gap-3 py-2 border-b border-[var(--color-divider-subtle)] last:border-none">
            <div className="w-24 shrink-0 text-sm font-medium text-[var(--color-text-primary)]">{s.label}</div>
            <label className="flex items-center gap-2 shrink-0" style={{minWidth: '50px'}}>
              <input type="checkbox" checked={s.enabled} onChange={() => handleToggle(s.day)}
                className="h-4 w-4 accent-[var(--color-primary)]" />
            </label>
            {s.enabled ? (
              <div className="flex items-center gap-2">
                <input type="time" value={s.from} onChange={e => handleTimeChange(s.day, 'from', e.target.value)}
                  className="border border-[var(--color-divider)] px-2 py-1 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
                <span className="text-xs text-[var(--color-text-tertiary)]">–</span>
                <input type="time" value={s.to} onChange={e => handleTimeChange(s.day, 'to', e.target.value)}
                  className="border border-[var(--color-divider)] px-2 py-1 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
              </div>
            ) : (
              <span className="text-xs text-[var(--color-text-tertiary)] italic">{t('staff.availability.closed', 'Geschlossen')}</span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-divider-subtle)] p-5" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('staff.availability.exceptions', 'Abweichende Zeiten')}</h2>
          <button onClick={addException}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)]">
            <Plus size={14}/> {t('staff.availability.addException', 'Hinzufügen')}
          </button>
        </div>
        {exceptions.length === 0 ? (
          <PageEmptyState icon={Clock} title="Keine Ausnahmen" description="Fügen Sie abweichende Arbeitszeiten, Urlaub oder Sperrzeiten hinzu." />
        ) : (
          <div className="space-y-2">
            {exceptions.map(e => (
              <div key={e.id} className="flex items-center gap-2 p-2 bg-[var(--color-surface-sunken)]" style={{borderRadius:'var(--radius-sm)'}}>
                <input type="date" className="border border-[var(--color-divider)] px-2 py-1 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
                <input type="time" className="border border-[var(--color-divider)] px-2 py-1 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
                <span className="text-xs">–</span>
                <input type="time" className="border border-[var(--color-divider)] px-2 py-1 text-xs" style={{borderRadius:'var(--radius-sm)'}} />
                <button onClick={() => removeException(e.id)} className="ml-auto text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]"><X size={14}/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
