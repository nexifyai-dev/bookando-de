import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, Users, MapPin, ArrowRight, Briefcase, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../lib/apiClient';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';

export default function StaffDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get('/api/vendor/bookings', { params: { limit: 10, status: 'confirmed' } });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t('staff.error', 'Fehler beim Laden')}</h2>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button type="button" onClick={load} className="px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors">
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
        <h1 className="text-title-lg text-gray-900">
          {t('staff.dashboard.title', 'Mitarbeiter-Dashboard')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {user?.full_name || user?.email} · {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <DashboardGrid cols={4} className="mb-6">
        <StatCard
          icon={CalendarCheck}
          label={t('staff.dashboard.today', 'Heutige Termine')}
          value={todayAppts.length}
          color="brand"
        />
        <StatCard
          icon={Clock}
          label={t('staff.dashboard.upcoming', 'Bevorstehende Termine')}
          value={appointments.length}
          color="success"
        />
        <StatCard
          icon={Users}
          label={t('staff.dashboard.customers', 'Kunden heute')}
          value={new Set(appointments.map(a => a.customer_id)).size}
          color="info"
        />
        <StatCard
          icon={MapPin}
          label={t('staff.dashboard.location', 'Standort')}
          value={user?.location_name || '—'}
          color="warning"
        />
      </DashboardGrid>

      {/* Appointments List */}
      <DashboardSection
        title={t('staff.dashboard.appointments', 'Nächste Termine')}
        action={
          <button onClick={() => navigate('/portal/staff/appointments')}
            className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors">
            {t('staff.dashboard.viewAll', 'Alle anzeigen')} <ArrowRight size={12} />
          </button>
        }
      >
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center px-5">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <CalendarDays size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('staff.dashboard.noAppointments', 'Keine bevorstehenden Termine')}</p>
              <p className="text-xs text-gray-400">{t('staff.dashboard.noAppointmentsHint', 'Neue Buchungen erscheinen hier automatisch.')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {appointments.slice(0, 5).map((apt) => (
                <div key={apt.id || apt.booking_id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/80 transition-colors">
                  <div className="w-10 h-10 bg-brand/[0.08] rounded-lg flex items-center justify-center shrink-0">
                    <CalendarCheck size={18} className="text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{apt.customer_name || apt.customer_id?.slice(0,8) || 'Kunde'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {apt.service_name || 'Service'} · {apt.start_time ? new Date(apt.start_time).toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}) : '—'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${apt.status === 'confirmed' ? 'bg-success-light text-success-dark' : apt.status === 'completed' ? 'bg-info-light text-info-dark' : 'bg-gray-100 text-gray-600'}`}>
                    {apt.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  );
}
