import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, TrendingUp, Users, DollarSign, ArrowRight, Wallet,
  BarChart3, Loader2, AlertCircle, Percent, UserPlus, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import { VendorBookingsApi, ReportsApi } from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { DashboardGrid, DashboardRow, DashboardSection } from '../../components/dashboard/DashboardGrid';

const statusStyles = {
  confirmed: 'bg-warning-light text-warning-dark',
  pending: 'bg-info-light text-info-dark',
  completed: 'bg-success-light text-success-dark',
  cancelled: 'bg-danger-light text-danger-dark',
};

export default function VendorDashboardPage() {
  const { t } = useTranslation();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, bookingsRes, reportRes] = await Promise.allSettled([
          apiClient.get('/api/vendor/stats').then(r => r.data),
          VendorBookingsApi.list(),
          ReportsApi.vendor(),
        ]);
        if (!cancelled) {
          if (statsRes.status === 'fulfilled') setStats(statsRes.value);
          else setStats({ revenue_today: 0, revenue_week: 0, revenue_month: 0, bookings_today: 0, bookings_pending: 0, bookings_total: 0, customers_new: 0, customers_total: 0, occupancy_rate: 0 });

          if (bookingsRes.status === 'fulfilled') {
            const b = bookingsRes.value;
            setBookings(Array.isArray(b) ? b : (b.bookings || b.data || []));
          }

          if (reportRes.status === 'fulfilled') setReport(reportRes.value);
          else setReport({ daily_bookings: [] });

          if (statsRes.status === 'rejected' && bookingsRes.status === 'rejected') {
            setError(t('vendor.dashboard.load_error', 'Fehler beim Laden der Dashboard-Daten.'));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.dashboard.error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [t, reloadKey]);

  const chartData = report?.daily_bookings?.length
    ? report.daily_bookings.map(d => ({ name: d.date?.slice(5, 10) || d.day, buchungen: d.count || d.bookings || 0 }))
    : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { name: d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' }), buchungen: 0 };
      });

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
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button onClick={() => setReloadKey((k) => k + 1)}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.dashboard.title', 'Vendor Dashboard')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.dashboard.subtitle', 'Alle Kennzahlen auf einen Blick.')}</p>
      </div>

      {/* Stat Cards */}
      <DashboardGrid cols={4} className="mb-6">
        <StatCard
          icon={DollarSign}
          label={t('vendor.dashboard.revenue_today', 'Umsatz (heute)')}
          value={stats ? formatAmount(stats.revenue_today || 0) : '0 €'}
          trend trendUp
          trendValue={t('vendor.dashboard.revenue_today_trend', '+0 %')}
          color="brand"
        />
        <StatCard
          icon={CalendarCheck}
          label={t('vendor.dashboard.bookings_today', 'Buchungen (heute)')}
          value={stats ? `${stats.bookings_today || 0}` : '0'}
          trend
          trendValue={`${stats?.bookings_pending || 0} ${t('vendor.dashboard.pending', 'offen')}`}
          trendUp={false}
          color="warning"
        />
        <StatCard
          icon={Users}
          label={t('vendor.dashboard.new_customers', 'Neue Kunden')}
          value={stats ? `${stats.customers_new || 0}` : '0'}
          trend
          trendValue={t('vendor.dashboard.total_customers', 'Gesamt: {{count}}', { count: stats?.customers_total || 0 })}
          trendUp
          color="success"
        />
        <StatCard
          icon={Percent}
          label={t('vendor.dashboard.occupancy', 'Auslastung')}
          value={stats ? `${Math.round(stats.occupancy_rate || 0)}%` : '0%'}
          trend trendUp={stats?.occupancy_rate > 80}
          trendValue={stats?.occupancy_rate > 80 ? 'Gut' : 'Steigerung'}
          color="info"
        />
      </DashboardGrid>

      {/* Content: Bookings + Chart/Actions */}
      <DashboardRow>
        {/* Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-bold text-gray-900">
              {t('vendor.dashboard.recent_bookings', 'Letzte Buchungen')}
            </h2>
            <Link to="/vendor/bookings" className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors">
              {t('vendor.dashboard.view_all', 'Alle anzeigen')} <ArrowRight size={12} />
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-center py-10 text-gray-400">
              {t('vendor.dashboard.no_bookings', 'Noch keine Buchungen vorhanden.')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</span></th>
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kunde</span></th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</span></th>
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span></th>
                    <th className="text-right px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Betrag</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.slice(0, 6).map((b, i) => (
                    <tr key={b.id || i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {formatDate(b.date || b.start_at || b.created_at)}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">
                        {b.customer_name || b.customer?.name || b.customer?.first_name || 'Unbekannt'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">
                        {b.service_name || b.service?.name || b.description || '–'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                          {b.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800 text-right">
                        {formatAmount(b.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Chart */}
          <ChartCard title={t('vendor.dashboard.chart_title', 'Buchungen letzte 7 Tage')}>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 700, color: '#1f2937' }}
                  />
                  <Bar dataKey="buchungen" fill="#3C50E0" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {t('vendor.dashboard.quick_actions', 'Quick Actions')}
            </h3>
            <div className="space-y-1">
              {[
                { icon: CalendarCheck, label: t('vendor.dashboard.action_booking', 'Buchung anlegen'), to: '/vendor/bookings', color: 'text-brand' },
                { icon: UserPlus, label: t('vendor.dashboard.action_invite', 'Mitarbeiter einladen'), to: '/vendor/employees', color: 'text-success' },
                { icon: Download, label: t('vendor.dashboard.action_report', 'Bericht runterladen'), to: '/vendor/reports', color: 'text-warning' },
                { icon: BarChart3, label: t('vendor.dashboard.action_analytics', 'Analytics'), to: '/vendor/reports', color: 'text-info' },
              ].map((action, i) => (
                <Link key={i} to={action.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <action.icon size={18} className={action.color} />
                  {action.label}
                  <ArrowRight size={12} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DashboardRow>
    </div>
  );
}
