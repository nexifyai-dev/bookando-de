import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw,
  Calendar,
  Clock,
  Ban,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  ChevronRight,
} from 'lucide-react';
import { CustomerBookingsApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ─── Helpers ─── */
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return formatDate(dateStr) + ' ' + formatTime(dateStr);
}

/* ─── Cancel Series Modal ─── */
function CancelSeriesModal({ open, series, onConfirm, onClose, processing }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div data-testid="customer-recurring-page"
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', zIndex: 100 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 animate-slide-up"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-e4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-danger-bg)' }}
          >
            <AlertTriangle size={18} style={{ color: 'var(--color-danger)' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {t('customer.cancel_series_title', 'Termin-Serie kündigen')}
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('customer.cancel_series_subtitle', 'Alle zukünftigen Termine dieser Serie werden storniert. Diese Aktion kann nicht rückgängig gemacht werden.')}
            </p>
          </div>
        </div>

        {series && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: 'var(--color-surface-sunken)' }}
          >
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {series.service_name || series.service?.name || 'Serie'}
            </p>
            <p className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Repeat size={12} />
              {series.frequency
                ? t(`customer.freq_${series.frequency}`, series.frequency)
                : t('customer.recurring', 'Wiederholend')}
            </p>
            {series.start_date && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('customer.started', 'Gestartet')}: {formatDate(series.start_date)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors"
            style={{
              border: '1px solid var(--color-divider)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-surface)',
            }}
          >
            {t('customer.keep_series', 'Serie behalten')}
          </button>
          <button
            onClick={onConfirm}
            disabled={processing}
            className="flex-1 px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2"
            style={{
              background: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              border: 'none',
            }}
          >
            {processing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Ban size={14} />
            )}
            {t('customer.cancel_series_confirm', 'Serie kündigen')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Series Card ─── */
function SeriesCard({ series, onCancel }) {
  const { t } = useTranslation();
  const nextBooking = series.next_booking || series.next_date;

  return (
    <Card className="group hover:shadow-[var(--shadow-card-hover)] transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'var(--color-accent-muted)' }}
            >
              <Repeat size={18} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-[14px] font-bold truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {series.service_name || series.service?.name || t('customer.service', 'Dienstleistung')}
              </h3>
              {series.vendor_name && (
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  {series.vendor_name}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                <Badge variant="info" size="xs" className="flex items-center gap-1">
                  <Repeat size={9} />
                  {series.frequency === 'weekly'
                    ? t('customer.weekly', 'Wöchentlich')
                    : series.frequency === 'biweekly'
                    ? t('customer.biweekly', 'Alle 2 Wochen')
                    : series.frequency === 'monthly'
                    ? t('customer.monthly', 'Monatlich')
                    : series.frequency || t('customer.recurring', 'Wiederholend')}
                </Badge>
                {nextBooking && (
                  <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar size={10} />
                    {t('customer.next', 'Nächster')}: {formatDateTime(nextBooking)}
                  </span>
                )}
              </div>
              {series.bookings_count > 0 && (
                <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('customer.total_bookings', 'Bisher')}: {series.bookings_count}{' '}
                  {t('customer.appointments', 'Termine')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onCancel(series)}
            className="px-3 py-2 text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
            style={{
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              background: 'var(--color-danger-bg)',
            }}
            title={t('customer.cancel_series', 'Serie kündigen')}
          >
            <Ban size={12} />
            {t('customer.cancel', 'Kündigen')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Add Recurring Info Card ─── */
function AddRecurringHint() {
  const { t } = useTranslation();
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{
        background: 'var(--color-surface-sunken)',
        border: '1px dashed var(--color-divider)',
      }}
    >
      <Repeat size={28} className="mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {t('customer.add_recurring_hint', 'Möchtest du einen regelmäßigen Termin erstellen?')}
      </p>
      <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
        {t('customer.add_recurring_hint_sub', 'Wöchentlich, alle 2 Wochen oder monatlich – beim Buchen eines Termins kannst du eine Serie anlegen.')}
      </p>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function CustomerRecurringPage() {
  const { t } = useTranslation();

  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Cancel modal
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelProcessing, setCancelProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerBookingsApi.listRecurring();
      const list = Array.isArray(data) ? data : data?.recurring_bookings || data?.data || [];
      setSeriesList(list);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || t('customer.error_load_series', 'Fehler beim Laden der Serien.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }, []);

  const handleCancelSeries = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelProcessing(true);
    try {
      await CustomerBookingsApi.cancelRecurring(cancelTarget.id);
      showSuccess(t('customer.series_cancelled', 'Termin-Serie erfolgreich gekündigt.'));
      setCancelTarget(null);
      fetchData();
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || t('customer.cancel_series_error', 'Fehler beim Kündigen der Serie.');
      setError(msg);
    } finally {
      setCancelProcessing(false);
    }
  }, [cancelTarget, fetchData, showSuccess, t]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* ═══ Header ═══ */}
      <div
        className="rounded-xl p-5 md:p-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        }}
      >
        <h1
          className="text-[20px] md:text-[24px] font-extrabold tracking-[-0.02em] text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('customer.recurring_title', 'Wiederholungstermine')}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {t('customer.recurring_sub', 'Verwalte deine regelmäßigen Termin-Serien.')}
        </p>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg animate-slide-up"
          style={{
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            color: 'var(--color-success)',
          }}
        >
          <CheckCircle2 size={16} />
          <span className="text-[13px] font-medium">{successMsg}</span>
        </div>
      )}

      {/* ═══ Loading ═══ */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('customer.loading_series', 'Serien werden geladen…')}
          </p>
        </div>
      )}

      {/* ═══ Error ═══ */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <AlertCircle size={36} style={{ color: 'var(--color-danger)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
          <button
            onClick={fetchData}
            className="px-5 py-2 text-sm font-semibold cursor-pointer transition-colors"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-divider)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)',
            }}
          >
            {t('customer.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {/* ═══ Empty State ═══ */}
      {!loading && !error && seriesList.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <Repeat size={44} className="mx-auto" style={{ color: 'var(--color-text-tertiary)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('customer.no_series', 'Du hast keine Wiederholungstermine.')}
            </p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('customer.no_series_hint', 'Lege beim Buchen eines Termins eine Serie an, um regelmäßig denselben Termin zu erhalten.')}
            </p>
          </div>
          <AddRecurringHint />
        </div>
      )}

      {/* ═══ Series List ═══ */}
      {!loading && !error && seriesList.length > 0 && (
        <div className="space-y-3">
          {seriesList.map((series) => (
            <SeriesCard
              key={series.id}
              series={series}
              onCancel={setCancelTarget}
            />
          ))}

          <div className="pt-2">
            <AddRecurringHint />
          </div>
        </div>
      )}

      {/* ═══ Cancel Series Modal ═══ */}
      <CancelSeriesModal
        open={!!cancelTarget}
        series={cancelTarget}
        onConfirm={handleCancelSeries}
        onClose={() => setCancelTarget(null)}
        processing={cancelProcessing}
      />
    </div>
  );
}
