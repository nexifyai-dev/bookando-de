import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Trash2, Loader2, AlertCircle, CalendarDays, ChevronLeft, ChevronRight, Save, Repeat, Clock, X,
} from 'lucide-react';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { EmployeesApi } from '../../lib/api';
import { toast } from 'sonner';
import apiClient from '../../lib/apiClient';

const SpecialDaysApi = {
  list: () => apiClient.get('/api/vendor/special-days').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/special-days', p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/special-days/${id}`).then(r => r.data),
};

const MODAL_BG = 'rgba(12,29,46,0.5)';
const INPUT = { background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' };

/* ─── Helpers ─── */
function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfWeek(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; } // Mon=0

/* ─── Add Modal ─── */
function AddSpecialDayModal({ employees, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    date: '',
    type: 'custom_hours',
    label: '',
    employee_id: '',
    recurring: false,
    start_time: '09:00',
    end_time: '17:00',
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: MODAL_BG, backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.specialDays.add', 'Sondertag hinzufügen')}
          </h3>
          <button onClick={onClose} className="p-1 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.specialDays.date', 'Datum')} *
              </label>
              <input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.specialDays.type', 'Typ')}
              </label>
              <select value={form.type} onChange={e => handleChange('type', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT}>
                <option value="holiday">{t('vendor.specialDays.holiday', 'Feiertag')}</option>
                <option value="custom_hours">{t('vendor.specialDays.customHours', 'Geänderte Zeiten')}</option>
                <option value="closed">{t('vendor.specialDays.closed', 'Geschlossen')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.specialDays.label', 'Bezeichnung')}
            </label>
            <input type="text" value={form.label} onChange={e => handleChange('label', e.target.value)}
              placeholder="z.B. Weihnachten" className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.specialDays.employee', 'Mitarbeiter (optional)')}
            </label>
            <select value={form.employee_id} onChange={e => handleChange('employee_id', e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT}>
              <option value="">{t('vendor.specialDays.allEmployees', 'Alle Mitarbeiter')}</option>
              {Array.isArray(employees) && employees.map(e => (
                <option key={e.id} value={e.id}>{e.name || e.first_name || e.email || e.id?.slice(0, 8)}</option>
              ))}
            </select>
          </div>

          {form.type === 'custom_hours' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock size={12} className="inline mr-1" />{t('vendor.specialDays.start', 'Start')}
                </label>
                <input type="time" value={form.start_time} onChange={e => handleChange('start_time', e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
              </div>
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock size={12} className="inline mr-1" />{t('vendor.specialDays.end', 'Ende')}
                </label>
                <input type="time" value={form.end_time} onChange={e => handleChange('end_time', e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none" style={INPUT} />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.recurring} onChange={e => handleChange('recurring', e.target.checked)} />
            <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <Repeat size={12} className="inline mr-1" />
              {t('vendor.specialDays.recurring', 'Jährlich wiederkehrend')}
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.specialDays.save', 'Speichern')}
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

/* ─── Calendar ─── */
function MiniCalendar({ year, month, specialDays, onPrevMonth, onNextMonth, onDayClick }) {
  const { t } = useTranslation();
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const dim = daysInMonth(year, month);
  const fow = firstDayOfWeek(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const specialMap = {};
  (Array.isArray(specialDays) ? specialDays : []).forEach(d => {
    const key = d.date;
    if (!specialMap[key]) specialMap[key] = [];
    specialMap[key].push(d);
  });

  const cells = [];
  for (let i = 0; i < fow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
          <ChevronLeft size={18} />
        </button>
        <p className="text-[14px] font-bold" style={{ color: 'var(--color-text-primary)' }}>{monthNames[month]} {year}</p>
        <button onClick={onNextMonth} className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const specials = specialMap[dateStr] || [];
          const isToday = dateStr === todayStr;
          const hasSpecial = specials.length > 0;
          const isClosed = specials.some(s => s.type === 'closed');
          return (
            <button key={dateStr} onClick={() => onDayClick(dateStr)}
              className="w-full aspect-square flex flex-col items-center justify-center rounded-lg text-[12px] font-medium cursor-pointer transition-colors relative"
              style={{
                background: hasSpecial ? (isClosed ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)') : undefined,
                color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)',
                border: isToday ? '2px solid var(--color-primary)' : '1px solid transparent',
                fontWeight: isToday ? 700 : 500,
              }}>
              {day}
              {hasSpecial && <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: isClosed ? '#EF4444' : '#4ADE80' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function VendorSpecialDaysPage() {
  const { t } = useTranslation();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: specialDays = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'special-days'],
    () => SpecialDaysApi.list().then(d => Array.isArray(d) ? d : d?.data || []),
  );

  const { data: employees = [] } = useAutoRefresh(
    ['vendor', 'employees'],
    () => EmployeesApi.list().then(d => Array.isArray(d) ? d : []),
    { enabled: modalOpen },
  );

  const addMutation = usePortalMutation({
    mutationFn: (payload) => SpecialDaysApi.create(payload),
    invalidateKeys: [['vendor', 'special-days']],
    onSuccess: () => { toast.success(t('vendor.specialDays.added', 'Sondertag gespeichert.')); setModalOpen(false); },
    onError: (err) => toast.error(err.message || t('vendor.specialDays.saveError', 'Fehler.')),
  });

  const deleteMutation = usePortalMutation({
    mutationFn: (id) => SpecialDaysApi.remove(id),
    invalidateKeys: [['vendor', 'special-days']],
    onSuccess: () => toast.success(t('vendor.specialDays.deleted', 'Sondertag gelöscht.')),
    onError: (err) => toast.error(err.message || t('vendor.specialDays.deleteError', 'Fehler.')),
  });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const handleDayClick = (dateStr) => { setSelectedDate(dateStr); setModalOpen(true); };

  const upcoming = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (Array.isArray(specialDays) ? specialDays : [])
      .filter(d => new Date(d.date) >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10);
  }, [specialDays]);

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.specialDays.title', 'Sondertage')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.specialDays.subtitle', 'Feiertage, Sonderöffnungszeiten und Schließtage verwalten.')}</p>
        </div>
        <button onClick={() => { setSelectedDate(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.specialDays.add', 'Sondertag hinzufügen')}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <MiniCalendar year={year} month={month} specialDays={specialDays}
              onPrevMonth={prevMonth} onNextMonth={nextMonth} onDayClick={handleDayClick} />
          </div>
          <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <p className="text-[13px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {t('vendor.specialDays.upcoming', 'Nächste Sondertage')}
            </p>
            {upcoming.length === 0 ? (
              <p className="text-[13px] py-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.specialDays.empty', 'Keine Sondertage')}
              </p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(d => (
                  <div key={d.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'var(--color-surface-sunken)' }}>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {d.label || d.type}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {d.date}{d.recurring ? ` · ${t('vendor.specialDays.recurring', 'Jährlich')}` : ''}
                      </p>
                    </div>
                    <button onClick={() => deleteMutation.mutate(d.id)}
                      className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <AddSpecialDayModal
          employees={employees}
          initialDate={selectedDate}
          onClose={() => setModalOpen(false)}
          onSave={(payload) => addMutation.mutate(payload)}
          saving={addMutation.isPending}
        />
      )}
    </div>
  );
}
