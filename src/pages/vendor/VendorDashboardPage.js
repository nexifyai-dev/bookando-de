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

function KpiCard({ icon: Icon, value, label, trend, trendUp = true }) {
  return (
    <div data-testid="vendor-dashboard-page" className="rounded-xl p-5 transition-shadow hover:shadow-[var(--shadow-e2)]"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-accent-muted)' }}>
          <Icon size={18} style={{ color: 'var(--color-accent)' }} />
        </div>
        <div>
          <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
          <p className="text-[22px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{value}</p>
        </div>
      </div>
      {trend && (
        <p className="text-[11px]" style={{ color: trendUp ? 'var(--color-success)' : 'var(--color-danger)' }}>{trend}</p>
      )}
    </div>
  );
}

const statusColors = {
  confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
  pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
  completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
  cancelled: { bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)' },
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

  const kpis = [
    { icon: DollarSign, value: stats ? formatAmount(stats.revenue_today || 0) : '0 €', label: t('vendor.dashboard.revenue_today', 'Umsatz (heute)'), trend: t('vendor.dashboard.revenue_today_trend', '+0 % zum Vortag') },
    { icon: TrendingUp, value: stats ? formatAmount(stats.revenue_week || 0) : '0 €', label: t('vendor.dashboard.revenue_week', 'Umsatz (diese Woche)'), trend: t('vendor.dashboard.revenue_week_trend', 'Wochenziel: 5.000 €') },
    { icon: CalendarCheck, value: stats ? `${stats.bookings_today || 0}` : '0', label: t('vendor.dashboard.bookings_today', 'Buchungen (heute)'), trend: `${stats?.bookings_pending || 0} ${t('vendor.dashboard.pending', 'ausstehend')}` },
    { icon: Users, value: stats ? `${stats.customers_new || 0}` : '0', label: t('vendor.dashboard.new_customers', 'Neue Kunden'), trend: t('vendor.dashboard.total_customers', 'Gesamt: {{count}}', { count: stats?.customers_total || 0 }) },
    { icon: Percent, value: stats ? `${Math.round(stats.occupancy_rate || 0)}%` : '0%', label: t('vendor.dashboard.occupancy', 'Auslastung'), trend: stats?.occupancy_rate > 80 ? t('vendor.dashboard.occupancy_good', 'Gut ausgelastet') : t('vendor.dashboard.occupancy_low', 'Steigerungspotenzial') },
    { icon: Wallet, value: stats ? formatAmount(stats.revenue_month || 0) : '0 €', label: t('vendor.dashboard.revenue_month', 'Umsatz (Monat)'), trend: `${stats?.bookings_total || 0} ${t('vendor.dashboard.total_bookings', 'Buchungen gesamt')}` },
  ];

  const chartData = report?.daily_bookings?.length
    ? report.daily_bookings.map(d => ({ name: d.date?.slice(5, 10) || d.day, buchungen: d.count || d.bookings || 0 }))
    : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          name: d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' }),
          buchungen: 0,
        };
      });

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.dashboard.title', 'Vendor Dashboard')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.dashboard.subtitle', 'Alle Kennzahlen auf einen Blick.')}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-divider)', backgroundColor: 'var(--color-surface)',
              color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Letzte Buchungen Tabelle */}
            <div className="lg:col-span-2 rounded-xl"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.dashboard.recent_bookings', 'Letzte Buchungen')}
                </h2>
                <Link to="/vendor/bookings" className="text-[11px] font-medium flex items-center gap-2"
                  style={{ color: 'var(--color-accent)' }}>
                  {t('vendor.dashboard.view_all', 'Alle anzeigen')} <ArrowRight size={12} />
                </Link>
              </div>
              <div className="px-1">
                {bookings.length === 0 ? (
                  <p className="text-[13px] text-center py-8" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('vendor.dashboard.no_bookings', 'Noch keine Buchungen vorhanden.')}
                  </p>
                ) : (
                  bookings.slice(0, 6).map((b, i) => {
                    const sc = statusColors[b.status] || statusColors.pending;
                    return (
                      <div key={b.id || i} className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                        style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
                        <p className="text-[13px] w-[90px] shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(b.date || b.start_at || b.created_at)}
                        </p>
                        <p className="text-[13px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {b.customer_name || b.customer?.name || b.customer?.first_name || t('common.anonymous', 'Unbekannt')}
                        </p>
                        <p className="text-[12px] w-[120px] shrink-0 hidden sm:block" style={{ color: 'var(--color-text-tertiary)' }}>
                          {b.service_name || b.service?.name || b.description || '–'}
                        </p>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                          style={{ background: sc.bg, color: sc.text }}>
                          {b.status || 'pending'}
                        </span>
                        <p className="text-[13px] font-semibold w-[70px] text-right shrink-0" style={{ color: 'var(--color-text-primary)' }}>
                          {formatAmount(b.amount)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Chart */}
              <div className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <h2 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.dashboard.chart_title', 'Buchungen letzte 7 Tage')}
                </h2>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider-subtle)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--color-surface)', border: '1px solid var(--color-divider)',
                          borderRadius: 'var(--radius-md)', fontSize: '12px',
                        }}
                        labelStyle={{ fontWeight: 700, color: 'var(--color-primary)' }}
                      />
                      <Bar dataKey="buchungen" fill="var(--color-accent)" radius={[3, 3, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <h2 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.dashboard.quick_actions', 'Quick Actions')}
                </h2>
                <div className="space-y-2">
                  {[
                    { icon: CalendarCheck, label: t('vendor.dashboard.action_booking', 'Buchung anlegen'), to: '/vendor/bookings' },
                    { icon: UserPlus, label: t('vendor.dashboard.action_invite', 'Mitarbeiter einladen'), to: '/vendor/employees' },
                    { icon: Download, label: t('vendor.dashboard.action_report', 'Bericht runterladen'), to: '/vendor/reports' },
                    { icon: BarChart3, label: t('vendor.dashboard.action_analytics', 'Analytics'), to: '/vendor/reports' },
                  ].map((action, i) => (
                    <Link key={i} to={action.to}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer hover:bg-[var(--color-surface-elevated)]"
                      style={{ color: 'var(--color-text-secondary)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                        <action.icon size={15} style={{ color: 'var(--color-accent)' }} />
                      </div>
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
