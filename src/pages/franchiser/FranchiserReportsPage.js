import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3, Download, FileDown, Loader2, AlertCircle, RefreshCw,
  Calendar, TrendingUp, DollarSign, ShoppingCart, ArrowUpRight
} from 'lucide-react';
import { FranchiseApi, ReportsApi } from '../../lib/api';
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

/* ── Main ── */
export default function FranchiserReportsPage() {
  const { t } = useTranslation();

  const [franchise, setFranchise] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({ csv: false, full: false });
  const [days, setDays] = useState(30);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [me, rep] = await Promise.all([
        FranchiseApi.me(),
        FranchiseApi.meReports(days),
      ]);
      if (!mountedRef.current) return;
      setFranchise(me);
      setReports(rep);
    } catch (err) {
      if (mountedRef.current) setError(err?.message || t('common.error_load', 'Fehler beim Laden.'));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [t, days]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  const handleDownloadCsv = async () => {
    setDownloading((prev) => ({ ...prev, csv: true }));
    try {
      await ReportsApi.downloadFranchiseCsv(days);
    } catch {
      // silent
    } finally {
      setDownloading((prev) => ({ ...prev, csv: false }));
    }
  };

  const handleDownloadFull = async () => {
    setDownloading((prev) => ({ ...prev, full: true }));
    try {
      await ReportsApi.downloadFranchiseCsv(365);
    } catch {
      // silent
    } finally {
      setDownloading((prev) => ({ ...prev, full: false }));
    }
  };

  /* ── Daten ── */
  const totalRevenue = reports?.total_revenue ?? reports?.revenue ?? 0;
  const totalBookings = reports?.total_bookings ?? reports?.bookings ?? 0;
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const topVendor = reports?.top_vendor ?? null;
  const dailyStats = reports?.daily_stats ?? reports?.daily ?? [];

  /* ── Loading ── */
  if (loading) {
    return (
      <div data-testid="franchiser-reports-page" className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('common.loading', 'Lade Berichte…')}
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
          <h1 className="w2g-page-title">{t('franchiser.reports.title', 'Umsatzberichte')}</h1>
          <p className="w2g-page-subtitle">
            {t('franchiser.reports.subtitle', 'Einblicke in Umsatz, Buchungen und Performance deines Franchises.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zeitraum-Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)' }}>
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all"
                style={{
                  background: days === d ? 'var(--color-surface)' : 'transparent',
                  color: days === d ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  boxShadow: days === d ? 'var(--shadow-e1)' : 'none',
                }}
              >
                {d} {t('common.days', 'Tage')}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={downloading.csv}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}
          >
            {downloading.csv ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            {t('franchiser.reports.download_csv', 'CSV exportieren')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.reports.kpi_revenue', 'Gesamtumsatz')}
              </p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <DollarSign size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {formatAmount(totalRevenue)}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('franchiser.reports.last_days', 'Letzte {{days}} Tage', { days })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.reports.kpi_bookings', 'Buchungen')}
              </p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
                <ShoppingCart size={16} style={{ color: '#2563EB' }} />
              </div>
            </div>
            <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {formatNumber(totalBookings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.reports.kpi_avg', 'Ø Buchungswert')}
              </p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.1)' }}>
                <TrendingUp size={16} style={{ color: '#059669' }} />
              </div>
            </div>
            <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {formatAmount(avgBookingValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.reports.kpi_top', 'Top Vendor')}
              </p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.1)' }}>
                <BarChart3 size={16} style={{ color: '#D97706' }} />
              </div>
            </div>
            <p className="text-[15px] font-extrabold truncate" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {topVendor?.name || '–'}
            </p>
            {topVendor?.revenue && (
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                {formatAmount(topVendor.revenue)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Stats */}
      <Card>
        <CardHeader>
          <CardTitle>{t('franchiser.reports.daily_title', 'Tägliche Buchungsstatistik')}</CardTitle>
          <CardDescription>
            {t('franchiser.reports.daily_desc', 'Umsatz und Buchungen pro Tag')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-1 pb-1">
          {dailyStats.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <Calendar size={28} style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.reports.no_data', 'Keine Daten für diesen Zeitraum.')}
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div
                className="hidden sm:flex items-center gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider)' }}
              >
                <span className="w-[100px] shrink-0">{t('franchiser.reports.col_date', 'Datum')}</span>
                <span className="flex-1">{t('franchiser.reports.col_bookings', 'Buchungen')}</span>
                <span className="w-[140px] shrink-0 text-right">{t('franchiser.reports.col_revenue', 'Umsatz')}</span>
              </div>

              {dailyStats.slice(0, 31).map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-2.5 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                  style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
                >
                  <p className="text-[12px] w-[100px] shrink-0 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {d.date ? new Date(d.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '–'}
                  </p>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((d.bookings || 0) / Math.max(...dailyStats.map((x) => x.bookings || 0), 1) * 100, 100)}%`,
                        background: 'var(--color-accent)',
                        maxWidth: '200px',
                      }}
                    />
                    <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatNumber(d.bookings)}
                    </span>
                  </div>
                  <p className="text-[12px] w-[140px] shrink-0 text-right font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {formatAmount(d.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('franchiser.reports.export_title', 'Export & Downloads')}</CardTitle>
          <CardDescription>
            {t('franchiser.reports.export_desc', 'Lade deine Berichte als CSV herunter.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadCsv}
              disabled={downloading.csv}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              {downloading.csv ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {t('franchiser.reports.export_30d', 'CSV (30 Tage)')}
            </button>
            <button
              onClick={handleDownloadFull}
              disabled={downloading.full}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}
            >
              {downloading.full ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {t('franchiser.reports.export_full', 'CSV (komplett)')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
