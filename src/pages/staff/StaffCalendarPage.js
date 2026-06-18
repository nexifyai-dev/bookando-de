import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StaffCalendarPage() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // day | week

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  const days = view === 'day' ? [currentDate] : Array.from({length: 7}, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const hours = Array.from({length: 14}, (_, i) => i + 7); // 7:00 - 20:00

  const next = () => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + (view === 'day' ? 1 : 7));
    setCurrentDate(d);
  };
  const prev = () => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() - (view === 'day' ? 1 : 7));
    setCurrentDate(d);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{t('staff.calendar.title', 'Kalender')}</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            {['day','week'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium ${view === v ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)]'}`}
                style={{ borderRadius: 'var(--radius-sm)' }}>{t(`staff.calendar.${v}`, v)}</button>
            ))}
          </div>
          <button onClick={prev} className="h-8 w-8 flex items-center justify-center border border-[var(--color-divider)]" style={{borderRadius:'var(--radius-sm)'}}><ChevronLeft size={14}/></button>
          <span className="text-sm font-medium text-[var(--color-text-primary)] min-w-[140px] text-center">
            {view === 'day'
              ? currentDate.toLocaleDateString('de-DE', {day:'numeric', month:'long', year:'numeric'})
              : `${startOfWeek.toLocaleDateString('de-DE', {day:'numeric', month:'numeric'})} – ${days[days.length-1].toLocaleDateString('de-DE', {day:'numeric', month:'numeric', year:'numeric'})}`}
          </span>
          <button onClick={next} className="h-8 w-8 flex items-center justify-center border border-[var(--color-divider)]" style={{borderRadius:'var(--radius-sm)'}}><ChevronRight size={14}/></button>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-divider-subtle)] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--color-divider)]">
          <div className="h-10" />
          {days.map((d, i) => (
            <div key={i} className="h-10 flex items-center justify-center text-xs font-semibold text-[var(--color-text-secondary)] border-l border-[var(--color-divider)]">
              {d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
        {/* Time grid */}
        <div className="overflow-auto" style={{maxHeight: 'calc(100vh - 320px)'}}>
          {hours.map(h => (
            <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--color-divider-subtle)]" style={{minHeight: '48px'}}>
              <div className="flex items-start justify-center pt-1 text-[10px] text-[var(--color-text-tertiary)] border-r border-[var(--color-divider-subtle)]">
                {`${h.toString().padStart(2,'0')}:00`}
              </div>
              {days.map((_, i) => (
                <div key={i} className="border-l border-[var(--color-divider-subtle)] min-h-[48px] hover:bg-[var(--color-surface-sunken)] transition-colors" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
