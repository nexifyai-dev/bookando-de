import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, Users, Bell, MapPin, ArrowRight, Briefcase, CalendarDays } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function StaffDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/vendor/bookings?limit=10&status=confirmed');
        if (!res.ok) throw new Error('Fehler beim Laden');
        const data = await res.json();
        if (!cancelled) setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-8 w-48 bg-[var(--color-surface-sunken)] animate-pulse rounded" style={{ borderRadius: 'var(--radius-sm)' }} />
          <div className="h-4 w-32 bg-[var(--color-surface-sunken)] animate-pulse rounded mt-2" style={{ borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-[var(--color-surface-sunken)] animate-pulse rounded" style={{ borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-danger-bg)] rounded-full mb-4">
          <Briefcase size={24} className="text-[var(--color-danger)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{t('staff.error', 'Fehler beim Laden')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">{error}</p>
        <button onClick={() => window.location.reload()}
          className="inline-flex items-center h-11 px-6 bg-[var(--color-primary)] text-white font-semibold text-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
          {t('staff.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  const todayAppts = appointments.filter(a => {
    if (!a.start_time) return false;
    const today = new Date().toISOString().split('T')[0];
    return a.start_time.startsWith(today);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
          {t('staff.dashboard.title', 'Mitarbeiter-Dashboard')}
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
          {user?.full_name || user?.email} · {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center bg-[var(--color-primary-bg)]" style={{ borderRadius: 'var(--radius-md)' }}>
              <CalendarCheck size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{todayAppts.length}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{t('staff.dashboard.today', 'Heutige Termine')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center bg-[var(--color-primary-bg)]" style={{ borderRadius: 'var(--radius-md)' }}>
              <Clock size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{appointments.length}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{t('staff.dashboard.upcoming', 'Bevorstehende Termine')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center bg-[var(--color-primary-bg)]" style={{ borderRadius: 'var(--radius-md)' }}>
              <Users size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{new Set(appointments.map(a => a.customer_id)).size}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{t('staff.dashboard.customers', 'Kunden heute')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center bg-[var(--color-primary-bg)]" style={{ borderRadius: 'var(--radius-md)' }}>
              <MapPin size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{user?.location_name || '—'}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{t('staff.dashboard.location', 'Standort')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="px-5 py-4 border-b border-[var(--color-divider-subtle)] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{t('staff.dashboard.appointments', 'Nächste Termine')}</h2>
          <button onClick={() => navigate('/portal/staff/appointments')}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1">
            {t('staff.dashboard.viewAll', 'Alle anzeigen')} <ArrowRight size={12} />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center px-5">
            <CalendarDays size={40} className="text-[var(--color-text-tertiary)] mb-3 opacity-40" />
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('staff.dashboard.noAppointments', 'Keine bevorstehenden Termine')}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{t('staff.dashboard.noAppointmentsHint', 'Neue Buchungen erscheinen hier automatisch.')}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-divider-subtle)]">
            {appointments.slice(0, 5).map((apt) => (
              <div key={apt.id || apt.booking_id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[var(--color-surface-sunken)] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{apt.customer_name || apt.customer_id?.slice(0,8) || 'Kunde'}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{apt.service_name || 'Service'} · {apt.start_time ? new Date(apt.start_time).toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}) : '—'}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700' : apt.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                  {apt.status || 'pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
