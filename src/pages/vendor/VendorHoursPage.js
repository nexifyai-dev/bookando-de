import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Clock, Plus, X, Loader2, AlertCircle, Calendar, Umbrella, Sun
} from 'lucide-react';
import { WorkingHoursApi } from '../../lib/api';
import { toast } from 'sonner';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_LABELS = {
  monday: 'Montag', tuesday: 'Dienstag', wednesday: 'Mittwoch',
  thursday: 'Donnerstag', friday: 'Freitag', saturday: 'Samstag', sunday: 'Sonntag',
};

function DayRow({ day, label, hours, onChange }) {
  const { t } = useTranslation();
  const isOpen = hours?.is_open !== false;

  return (
    <div data-testid="vendor-hours-page" className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
      style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
      <div className="w-[100px] shrink-0">
        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer shrink-0">
        <input type="checkbox" checked={isOpen} onChange={e => onChange(day, 'is_open', e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
          style={{ accentColor: 'var(--color-primary)' }} />
        <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
          {isOpen ? t('vendor.hours.open', 'Geöffnet') : t('vendor.hours.closed', 'Geschlossen')}
        </span>
      </label>

      {isOpen && (
        <div className="flex items-center gap-2 ml-auto">
          <input type="time" value={hours?.start || '09:00'} onChange={e => onChange(day, 'start', e.target.value)}
            className="px-3 py-1.5 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          <span className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{t('vendor.hours.until', 'bis')}</span>
          <input type="time" value={hours?.end || '18:00'} onChange={e => onChange(day, 'end', e.target.value)}
            className="px-3 py-1.5 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
        </div>
      )}
    </div>
  );
}

function HolidayModal({ onClose, onSave, holidays, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ date: '', reason: '', is_closed: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date) return;
    onSave(form);
    setForm({ date: '', reason: '', is_closed: true });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.hours.add_holiday', 'Schließtag hinzufügen')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.hours.date', 'Datum')} *
            </label>
            <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.hours.reason', 'Grund / Anlass')}
            </label>
            <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder={t('vendor.hours.reason_placeholder', 'z.B. Betriebsfeier, Brückentag')}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading || !form.date}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.hours.add', 'Hinzufügen')}
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

export default function VendorHoursPage() {
  const { t } = useTranslation();

  const [weeklyHours, setWeeklyHours] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [holidayModal, setHolidayModal] = useState(false);

  const fetchHours = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WorkingHoursApi.get();
      const wh = data?.weekly || data?.hours || data?.weekly_hours || {};
      setWeeklyHours(wh);
      setHolidays(data?.holidays || data?.closures || []);
    } catch (err) {
      setError(err.message || t('vendor.hours.load_error', 'Fehler beim Laden der Öffnungszeiten.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHours(); }, [t]);

  const handleDayChange = (day, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: { ...(prev[day] || {}), [field]: value },
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await WorkingHoursApi.set({ weekly: weeklyHours, holidays });
      toast.success(t('vendor.hours.save_success', 'Öffnungszeiten gespeichert.'));
    } catch (err) {
      toast.error(err.message || t('vendor.hours.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async (holiday) => {
    const updated = [...holidays, { ...holiday, id: Date.now().toString() }];
    setHolidays(updated);
    setHolidayModal(false);
    // Auto-save
    try {
      await WorkingHoursApi.set({ weekly: weeklyHours, holidays: updated });
      toast.success(t('vendor.hours.holiday_added', 'Schließtag hinzugefügt.'));
    } catch (err) {
      toast.error(err.message || t('vendor.hours.save_error', 'Fehler beim Speichern.'));
    }
  };

  const handleRemoveHoliday = async (id) => {
    const updated = holidays.filter(h => h.id !== id);
    setHolidays(updated);
    try {
      await WorkingHoursApi.set({ weekly: weeklyHours, holidays: updated });
      toast.success(t('vendor.hours.holiday_removed', 'Schließtag entfernt.'));
    } catch (err) {
      toast.error(err.message || t('vendor.hours.save_error', 'Fehler beim Speichern.'));
    }
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.hours.title', 'Öffnungszeiten')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.hours.subtitle', 'Lege deine regelmäßigen Öffnungszeiten und Schließtage fest.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setHolidayModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
            <Umbrella size={16} /> {t('vendor.hours.add_holiday', 'Schließtag')}
          </button>
          <button onClick={handleSaveAll} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-primary)' }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {t('vendor.hours.save_all', 'Speichern')}
          </button>
        </div>
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
          <button onClick={fetchHours}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Weekly Hours */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.hours.weekly_title', 'Wöchentliche Öffnungszeiten')}
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.hours.weekly_sub', 'Gilt für alle Mitarbeiter (global)')}
                </p>
              </div>
            </div>

            <div>
              {DAYS.map(day => (
                <DayRow key={day} day={day} label={DAY_LABELS[day]}
                  hours={weeklyHours[day] || { is_open: day !== 'sunday', start: '09:00', end: '18:00' }}
                  onChange={handleDayChange} />
              ))}
            </div>
          </div>

          {/* Holidays / Closures */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Umbrella size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.hours.holidays_title', 'Schließtage & Urlaub')}
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.hours.holidays_sub', 'An diesen Tagen bleibt dein Geschäft geschlossen.')}
                </p>
              </div>
            </div>

            {holidays.length === 0 ? (
              <p className="text-[13px] text-center py-6" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.hours.no_holidays', 'Keine Schließtage eingetragen.')}
              </p>
            ) : (
              <div className="space-y-2">
                {holidays.map((h, i) => (
                  <div key={h.id || i}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                    style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider-subtle)' }}>
                    <div className="flex items-center gap-3">
                      <Sun size={14} style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {h.date ? new Date(h.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : h.date}
                        </p>
                        {h.reason && (
                          <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{h.reason}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleRemoveHoliday(h.id)}
                      className="p-1.5 rounded-lg cursor-pointer hover:bg-[var(--color-danger-bg)] transition-colors"
                      style={{ color: 'var(--color-text-tertiary)' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setHolidayModal(true)}
              className="flex items-center gap-2 mt-3 px-4 py-2.5 text-[12px] font-semibold rounded-lg cursor-pointer w-full justify-center"
              style={{ background: 'var(--color-surface-sunken)', border: '1px dashed var(--color-divider)', color: 'var(--color-text-secondary)' }}>
              <Plus size={14} /> {t('vendor.hours.add_holiday', 'Schließtag hinzufügen')}
            </button>
          </div>
        </div>
      )}

      {holidayModal && (
        <HolidayModal onClose={() => setHolidayModal(false)} onSave={handleAddHoliday} holidays={holidays} loading={false} />
      )}
    </div>
  );
}
