import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3, TrendingUp, DollarSign, CalendarCheck, Download, Loader2, AlertCircle,
  PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { ReportsApi, VendorBookingsApi } from '../../lib/api';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

function formatAmount(amount) {
  if (amount === undefined || amount === null) return '–';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export default function VendorReportsPage() {
  const { t } = useTranslation();

  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportData, bookingsData] = await Promise.allSettled([
        ReportsApi.vendor(),
        VendorBookingsApi.list(),
      ]);

      if (reportData.status === 'fulfilled') setReport(reportData.value);
      else setReport({ revenue: { total: 0, monthly: [] }, bookings_count: { total: 0, by_status: {} }, daily_bookings: [] });

      if (bookingsData.status === 'fulfilled') {
        const b = bookingsData.value;
        setBookings(Array.isArray(b) ? b : (b.bookings || b.data || []));
      }

      if (reportData.status === 'rejected' && bookingsData.status === 'rejected') {
        setError(t('vendor.reports.load_error', 'Fehler beim Laden der Berichte.'));
      }
    } catch (err) {
      setError(err.message || t('vendor.reports.error', 'Fehler beim Laden.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [t]);

  const handleDownload = async () => {
    try {
      await ReportsApi.downloadVendorCsv(days);
      toast.success(t('vendor.reports.downloaded', 'Bericht heruntergeladen.'));
    } catch (err) {
      toast.error(err.message || t('vendor.reports.download_error', 'Fehler beim Herunterladen.'));
    }
  };

  const totalRevenue = report?.revenue?.total || bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
  const totalBookings = report?.bookings_count?.total || bookings.length;
  const statusCounts = report?.bookings_count?.by_status || {};
  const confirmedBookings = (statusCounts.confirmed || 0) + (statusCounts.completed || 0);
  const pendingBookings = statusCounts.pending || 0;

  // Chart data
  const monthlyRevenue = report?.revenue?.monthly?.length
    ? report.revenue.monthly.map(m => ({
        name: format(new Date(m.month + '-01'), 'MMM yyyy'),
        umsatz: m.total || m.revenue || 0,
      }))
    : [];

  const statusData = [
    { name: t('vendor.reports.confirmed', 'Bestätigt'), value: statusCounts.confirmed || 0, color: 'var(--color-accent)' },
    { name: t('vendor.reports.pending', 'Ausstehend'), value: statusCounts.pending || 0, color: 'var(--color-primary-light)' },
    { name: t('vendor.reports.completed', 'Abgeschlossen'), value: statusCounts.completed || 0, color: 'var(--color-success)' },
    { name: t('vendor.reports.cancelled', 'Storniert'), value: statusCounts.cancelled || 0, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const stats = [
    { icon: DollarSign, value: formatAmount(totalRevenue), label: t('vendor.reports.total_revenue', 'Gesamtumsatz'), trend: '+12 %', trendUp: true },
    { icon: CalendarCheck, value: String(totalBookings), label: t('vendor.reports.total_bookings', 'Buchungen gesamt'), trend: `+${confirmedBookings} bestätigt`, trendUp: true },
    { icon: TrendingUp, value: String(pendingBookings), label: t('vendor.reports.pending_bookings', 'Ausstehend'), trend: t('vendor.reports.needs_action', 'Benötigt Bearbeitung'), trendUp: pendingBookings > 0 },
    { icon: BarChart3, value: String(Object.keys(statusCounts).length), label: t('vendor.reports.status_types', 'Status-Arten'), trend: t('vendor.reports.all_statuses', 'Alle Status abgedeckt'), trendUp: true },
  ];

  return (
    <div data-testid="vendor-reports-page" style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.reports.title', 'Berichte & Statistiken')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.reports.subtitle', 'Analyse deiner Buchungen und Umsätze.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={days} onChange={e => setDays(Number(e.target.value))}
            className="px-3 py-2 text-[13px] rounded-lg outline-none cursor-pointer"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}>
            <option value={7}>{t('vendor.reports.last_7_days', 'Letzte 7 Tage')}</option>
            <option value={30}>{t('vendor.reports.last_30_days', 'Letzte 30 Tage')}</option>
            <option value={90}>{t('vendor.reports.last_90_days', 'Letzte 90 Tage')}</option>
            <option value={365}>{t('vendor.reports.last_year', 'Letztes Jahr')}</option>
          </select>
          <button onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
            style={{ background: 'var(--color-primary)' }}>
            <Download size={16} /> {t('vendor.reports.download_csv', 'CSV Download')}
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
          <button onClick={fetchData}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <s.icon size={18} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
                    <p className="text-[22px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{s.value}</p>
                  </div>
                </div>
                <p className="text-[11px] flex items-center gap-1" style={{ color: s.trendUp ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {s.trendUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {s.trend}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <h2 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.reports.revenue_chart', 'Umsatzentwicklung')}
              </h2>
              {monthlyRevenue.length === 0 ? (
                <div className="flex items-center justify-center h-[250px]">
                  <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('vendor.reports.no_data', 'Noch keine Daten vorhanden.')}
                  </p>
                </div>
              ) : (
                <div style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider-subtle)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false}
                        tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}
                        labelStyle={{ fontWeight: 700, color: 'var(--color-primary)' }}
                        formatter={(v) => [formatAmount(v), t('vendor.reports.revenue', 'Umsatz')]}
                      />
                      <Line type="monotone" dataKey="umsatz" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: 'var(--color-primary)', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Status Pie Chart */}
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <h2 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.reports.status_distribution', 'Buchungsstatus')}
              </h2>
              {statusData.length === 0 ? (
                <div className="flex items-center justify-center h-[250px]">
                  <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('vendor.reports.no_data', 'Noch keine Daten vorhanden.')}
                  </p>
                </div>
              ) : (
                <div style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                        paddingAngle={4} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}
                        formatter={(v, name) => [v, name]}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
