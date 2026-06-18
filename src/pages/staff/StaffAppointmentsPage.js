import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import PageLoadingState from '../../components/shared/PageLoadingState';
import PageEmptyState from '../../components/shared/PageEmptyState';
import PageErrorState from '../../components/shared/PageErrorState';

export default function StaffAppointmentsPage() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming');

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const { data } = await apiClient.get('/api/vendor/bookings');
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = appointments.filter(a => {
    if (filter === 'today') return a.start_time?.startsWith(new Date().toISOString().split('T')[0]);
    if (filter === 'upcoming') return a.status === 'confirmed' || a.status === 'pending';
    return true;
  });

  if (loading) return <PageLoadingState text={t('staff.loading', 'Termine werden geladen…')} />;
  if (error) return <PageErrorState title={t('staff.appointments.error', 'Fehler beim Laden')} message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{t('staff.appointments.title', 'Termine')}</h1>
        <div className="flex gap-1">
          {['upcoming','today','all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]'}`}
              style={{ borderRadius: 'var(--radius-sm)' }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <PageEmptyState icon={Calendar} title={t('staff.appointments.empty', 'Keine Termine gefunden')}
          description={t('staff.appointments.emptyHint', 'Es sind keine Termine mit diesem Filter vorhanden.')} />
      ) : (
        <div className="space-y-3">
          {filtered.map(apt => (
            <div key={apt.id || apt.booking_id} className="bg-white border border-[var(--color-divider-subtle)] p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{apt.customer_name || 'Kunde'}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{apt.service_name || 'Service'}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--color-text-tertiary)]">
                    <span className="flex items-center gap-1"><Clock size={12} />{apt.start_time ? new Date(apt.start_time).toLocaleString('de-DE') : '—'}</span>
                    {apt.location_name && <span className="flex items-center gap-1"><MapPin size={12} />{apt.location_name}</span>}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700' : apt.status === 'completed' ? 'bg-blue-50 text-blue-700' : apt.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
