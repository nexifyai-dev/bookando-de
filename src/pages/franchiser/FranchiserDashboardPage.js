import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Users, DollarSign, CalendarCheck, Store, Download,
  Loader2, AlertCircle, RefreshCw, ChevronRight, FileDown, ArrowUpRight
} from 'lucide-react';
import { FranchiseApi, ReportsApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── Hilfsfunktionen ── */
function formatAmount(amount, currency = 'EUR') {
  if (amount === undefined || amount === null) return '–';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ── KPI-Card ── */
function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <CardContent className="p-5">
        <div data-testid="franchiser-dashboard-page" className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
            {label}
          </p>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: accent || 'var(--color-accent-muted)' }}
          >
            <Icon size={16} style={{ color: accent ? '#fff' : 'var(--color-accent)' }} />
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

/* ── Vendor Row ── */
function VendorRow({ vendor, index }) {
  const statusVar = vendor.is_active
    ? { bg: 'rgba(5,150,105,0.1)', text: 'var(--color-success)', label: 'active' }
    : { bg: 'var(--color-surface-sunken)', text: 'var(--color-text-tertiary)', label: 'inactive' };

  return (
    <div
      className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
      style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
    >
      <span className="text-[11px] font-medium w-6 shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {vendor.name || vendor.business_name || '–'}
        </p>
        <p className="text-[11px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>
          {vendor.email || vendor.contact_email || ''}
        </p>
      </div>
      <Badge variant={vendor.is_active ? 'success' : 'muted'} size="sm">
        {vendor.is_active ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    </div>
  );
}

/* ── Hauptkomponente ── */
export default function FranchiserDashboardPage() {
  const { t } = useTranslation();

  const [franchise, setFranchise] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meData, reportsData] = await Promise.all([
        FranchiseApi.me(),
        FranchiseApi.meReports(30),
      ]);

      if (!mountedRef.current) return;

      setFranchise(meData);
      setReports(reportsData);

      // Vendors laden
      if (meData?.id) {
        try {
          const vData = await FranchiseApi.vendors(meData.id);
          if (mountedRef.current) setVendors(Array.isArray(vData) ? vData : vData?.vendors || []);
        } catch {
          if (mountedRef.current) setVendors([]);
        }
      }
    } catch (err) {
      if (mountedRef.current) setError(err?.message || t('common.error_load', 'Fehler beim Laden der Daten.'));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  const handleDownloadCsv = async () => {
    setDownloading(true);
    try {
      await ReportsApi.downloadFranchiseCsv(30);
    } catch {
      // silent
    } finally {
      setDownloading(false);
    }
  };

  /* ── KPI-Berechnung ── */
  const totalRevenue = reports?.total_revenue ?? reports?.revenue ?? 0;
  const vendorCount = vendors.length;
  const bookingCount = reports?.total_bookings ?? reports?.bookings ?? 0;
  const reportGrowth = reports?.growth ?? null;

  const kpis = [
    {
      icon: DollarSign,
      label: t('franchiser.kpis.revenue', 'Umsatz'),
      value: formatAmount(totalRevenue),
      sub: reportGrowth ? `+${reportGrowth}% zum Vormonat` : null,
      accent: 'var(--color-accent-muted)',
    },
    {
      icon: Store,
      label: t('franchiser.kpis.vendors', 'Vendors'),
      value: vendorCount,
      sub: t('franchiser.kpis.vendors_sub', 'Angeschlossene Partner'),
      accent: 'rgba(37,99,235,0.1)',
    },
    {
      icon: CalendarCheck,
      label: t('franchiser.kpis.bookings', 'Buchungen'),
      value: bookingCount,
      sub: t('franchiser.kpis.bookings_sub', 'Letzte 30 Tage'),
      accent: 'rgba(5,150,105,0.1)',
    },
    {
      icon: TrendingUp,
      label: t('franchiser.kpis.growth', 'Wachstum'),
      value: reportGrowth ? `+${reportGrowth}%` : '–',
      sub: t('franchiser.kpis.growth_sub', 'Im Vergleich'),
      accent: 'rgba(217,119,6,0.1)',
    },
  ];

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('common.loading', 'Lade Daten…')}
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error && !franchise) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--color-danger-bg)' }}>
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
            color: 'var(--color-primary)',
          }}
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
          <h1 className="w2g-page-title">{t('franchiser.dashboard.title', 'Franchise-Übersicht')}</h1>
          <p className="w2g-page-subtitle">
            {franchise?.name
              ? t('franchiser.dashboard.subtitle_name', 'Willkommen bei {{name}}', { name: franchise.name })
              : t('franchiser.dashboard.subtitle', 'Verwalte dein Franchise-Netzwerk')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileDown size={14} />
            )}
            {t('franchiser.dashboard.download_csv', 'CSV-Export')}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendors Liste */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('franchiser.dashboard.vendor_list', 'Angeschlossene Vendors')}</CardTitle>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
                {vendorCount}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-1 pb-1">
            {vendors.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Store size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('franchiser.dashboard.no_vendors', 'Noch keine Vendors angeschlossen.')}
                </p>
              </div>
            ) : (
              <div>
                {vendors.slice(0, 5).map((v, i) => (
                  <VendorRow key={v.id || i} vendor={v} index={i} />
                ))}
                {vendors.length > 5 && (
                  <div className="flex justify-center py-3">
                    <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                      +{vendors.length - 5} {t('common.more', 'weitere')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t('franchiser.dashboard.reports_summary', 'Berichtsübersicht')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.dashboard.top_vendor', 'Stärkster Vendor')}
              </p>
              <p className="text-[15px] font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>
                {reports?.top_vendor?.name || '–'}
              </p>
            </div>

            <div className="flex items-center gap-4 py-3 px-4 rounded-lg" style={{ background: 'var(--color-accent-subtle)' }}>
              <ArrowUpRight size={16} style={{ color: 'var(--color-accent)' }} />
              <div>
                <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('franchiser.dashboard.period_revenue', 'Umsatz (30 Tage)')}
                </p>
                <p className="text-[16px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {formatAmount(totalRevenue)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadCsv}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {downloading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {t('franchiser.dashboard.download_report', 'Bericht herunterladen')}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
