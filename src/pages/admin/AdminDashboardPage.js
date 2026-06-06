import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Store, DollarSign, ShoppingCart, TrendingUp, Activity,
  Shield, Calendar, BarChart3, Loader2, AlertCircle, RefreshCw,
  ArrowUpRight, Eye
} from 'lucide-react';
import { ReportsApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── Helpers ── */
function formatAmount(amount, currency = 'EUR') {
  if (amount === undefined || amount === null) return '–';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount);
}

function formatNumber(num) {
  if (num === undefined || num === null) return '–';
  return new Intl.NumberFormat('de-DE').format(num);
}

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, sub, accent, iconColor }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <CardContent className="p-5">
        <div data-testid="admin-dashboard-page" className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
            {label}
          </p>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: accent || 'var(--color-accent-muted)' }}
          >
            <Icon size={16} style={{ color: iconColor || 'var(--color-accent)' }} />
          </div>
        </div>
        <p className="text-[22px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
          {value ?? '–'}
        </p>
        {sub && (
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main ── */
export default function AdminDashboardPage() {
  const { t } = useTranslation();

  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rep = await ReportsApi.admin();
      if (mountedRef.current) setReports(rep);
    } catch (err) {
      if (mountedRef.current) setError(err?.message || t('common.error_load', 'Fehler beim Laden.'));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  /* ── Daten ── */
  const totalUsers = reports?.total_users ?? reports?.users ?? 0;
  const totalVendors = reports?.total_vendors ?? reports?.vendors ?? 0;
  const totalBookings = reports?.total_bookings ?? reports?.bookings ?? 0;
  const totalRevenue = reports?.total_revenue ?? reports?.revenue ?? 0;
  const activeUsers = reports?.active_users ?? null;
  const newUsers = reports?.new_users ?? null;

  const kpis = [
    {
      icon: Users,
      label: t('admin.dashboard.kpi_users', 'Benutzer'),
      value: formatNumber(totalUsers),
      sub: activeUsers
        ? t('admin.dashboard.kpi_users_sub', '{{active}} aktiv', { active: formatNumber(activeUsers) })
        : null,
      accent: 'rgba(37,99,235,0.1)',
      iconColor: '#2563EB',
    },
    {
      icon: Store,
      label: t('admin.dashboard.kpi_vendors', 'Vendors'),
      value: formatNumber(totalVendors),
      sub: newUsers
        ? t('admin.dashboard.kpi_vendors_sub', '{{new}} neu diesen Monat', { new: formatNumber(newUsers) })
        : null,
      accent: 'rgba(5,150,105,0.1)',
      iconColor: '#059669',
    },
    {
      icon: ShoppingCart,
      label: t('admin.dashboard.kpi_bookings', 'Buchungen'),
      value: formatNumber(totalBookings),
      sub: t('admin.dashboard.kpi_bookings_sub', 'Gesamte Plattform'),
      accent: 'rgba(217,119,6,0.1)',
      iconColor: '#D97706',
    },
    {
      icon: DollarSign,
      label: t('admin.dashboard.kpi_revenue', 'Umsatz gesamt'),
      value: formatAmount(totalRevenue),
      sub: t('admin.dashboard.kpi_revenue_sub', 'Alle Transaktionen'),
      accent: 'var(--color-accent-muted)',
      iconColor: 'var(--color-accent)',
    },
  ];

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('common.loading', 'Lade Systemdaten…')}
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error && !reports) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--color-danger-bg)' }}>
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-primary)' }}
        >
          <RefreshCw size={14} />
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* Header */}
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('admin.dashboard.title', 'Admin-Dashboard')}</h1>
          <p className="w2g-page-subtitle">
            {t('admin.dashboard.subtitle', 'Systemweite Kennzahlen und Aktivitätsübersicht.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">
            <Shield size={12} />
            {t('admin.dashboard.admin_badge', 'Admin')}
          </Badge>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold rounded-lg transition-colors"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}
          >
            <RefreshCw size={13} />
            {t('common.refresh', 'Aktualisieren')}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitätsübersicht */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('admin.dashboard.activity_title', 'Aktivitätsübersicht')}</CardTitle>
              <Activity size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
            <CardDescription>
              {t('admin.dashboard.activity_desc', 'Letzte Aktivitäten auf der Plattform')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports?.recent_activity && reports.recent_activity.length > 0 ? (
              <div className="space-y-3">
                {reports.recent_activity.slice(0, 8).map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                    style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: a.type === 'booking' ? 'var(--color-accent)' : a.type === 'user' ? '#2563EB' : '#059669' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {a.description || a.action || '–'}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {a.user_name || a.email || ''}
                      </p>
                    </div>
                    <p className="text-[11px] shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                        : '–'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 gap-2">
                <Activity size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('admin.dashboard.no_activity', 'Keine aktuellen Aktivitäten.')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System-Statistiken */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('admin.dashboard.stats_title', 'System-Statistiken')}</CardTitle>
              <BarChart3 size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
            <CardDescription>
              {t('admin.dashboard.stats_desc', 'Verteilung und Trends')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Users vs Vendors */}
            <div>
              <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('admin.dashboard.user_vendor_ratio', 'Benutzer : Vendors')}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--color-surface-sunken)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: totalUsers > 0 ? `${(totalVendors / totalUsers) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatNumber(totalVendors)} / {formatNumber(totalUsers)}
                </span>
              </div>
            </div>

            {/* Conversion */}
            <div>
              <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('admin.dashboard.booking_conversion', 'Buchungs-Konversion')}
              </p>
              <div className="flex items-center gap-3">
                <ArrowUpRight size={14} style={{ color: 'var(--color-success)' }} />
                <span className="text-[15px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {reports?.conversion_rate ? `${reports.conversion_rate}%` : '–'}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('admin.dashboard.stat_new_users', 'Neue Benutzer')}
                </p>
                <p className="text-[16px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {formatNumber(reports?.new_users_this_month ?? reports?.new_users ?? 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('admin.dashboard.stat_new_vendors', 'Neue Vendors')}
                </p>
                <p className="text-[16px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {formatNumber(reports?.new_vendors_this_month ?? reports?.new_vendors ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
