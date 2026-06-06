import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  XCircle,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
  Search,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ban,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { CustomerBookingsApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ─── Helpers ─── */
function formatDateTime(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

/* ─── Status Badge Config ─── */
const STATUS_CONFIG = {
  confirmed: {
    labelKey: 'confirmed',
    variant: 'gold',
    icon: CheckCircle2,
    label: 'Bestätigt',
  },
  pending: {
    labelKey: 'pending',
    variant: 'info',
    icon: Clock,
    label: 'Ausstehend',
  },
  completed: {
    labelKey: 'completed',
    variant: 'success',
    icon: CheckCircle2,
    label: 'Abgeschlossen',
  },
  cancelled: {
    labelKey: 'cancelled',
    variant: 'danger',
    icon: Ban,
    label: 'Storniert',
  },
};

/* ─── Cancel Confirmation Modal ─── */
function CancelModal({ open, booking, onConfirm, onClose, processing }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div data-testid="customer-bookings-page"
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
              {t('customer.cancel_title', 'Buchung stornieren')}
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('customer.cancel_subtitle', 'Diese Aktion kann nicht rückgängig gemacht werden.')}
            </p>
          </div>
        </div>

        {booking && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: 'var(--color-surface-sunken)' }}
          >
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {booking.service_name || booking.service?.name || 'Dienstleistung'}
            </p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {formatDateTime(booking.start_at || booking.date)}
            </p>
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
            {t('customer.cancel_keep', 'Doch behalten')}
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
            {t('customer.cancel_confirm', 'Stornieren')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reschedule Modal ─── */
function RescheduleModal({ open, booking, onConfirm, onClose, processing }) {
  const { t } = useTranslation();
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (booking?.start_at) {
      const d = new Date(booking.start_at);
      if (!isNaN(d.getTime())) {
        setNewDate(d.toISOString().slice(0, 10));
        setNewTime(d.toTimeString().slice(0, 5));
      }
    }
  }, [booking]);

  if (!open) return null;

  const handleConfirm = () => {
    if (!newDate || !newTime) return;
    const combined = new Date(`${newDate}T${newTime}`);
    onConfirm(combined.toISOString());
  };

  return (
    <div
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
            style={{ background: 'var(--color-accent-muted)' }}
          >
            <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {t('customer.reschedule_title', 'Termin umbuchen')}
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('customer.reschedule_subtitle', 'Wähle einen neuen Termin.')}
            </p>
          </div>
        </div>

        {booking && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: 'var(--color-surface-sunken)' }}
          >
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {booking.service_name || booking.service?.name || 'Dienstleistung'}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('customer.current_appointment', 'Aktueller Termin')}: {formatDateTime(booking.start_at || booking.date)}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-5">
          <div>
            <label
              className="block text-[12px] font-semibold mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('customer.date', 'Datum')}
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 py-2.5 text-[13px]"
              style={{
                border: '1px solid var(--color-divider)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-surface)',
              }}
            />
          </div>
          <div>
            <label
              className="block text-[12px] font-semibold mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('customer.time', 'Uhrzeit')}
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2.5 text-[13px]"
              style={{
                border: '1px solid var(--color-divider)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-surface)',
              }}
            />
          </div>
        </div>

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
            {t('customer.cancel', 'Abbrechen')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !newDate || !newTime}
            className="flex-1 px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              border: 'none',
            }}
          >
            {processing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Calendar size={14} />
            )}
            {t('customer.reschedule_confirm', 'Umbuchen')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function CustomerBookingsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel modal
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelProcessing, setCancelProcessing] = useState(false);

  // Reschedule modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleProcessing, setRescheduleProcessing] = useState(false);

  // Success feedback
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerBookingsApi.list();
      const list = Array.isArray(data) ? data : data?.bookings || data?.data || [];
      setBookings(list);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || t('customer.error_load', 'Fehler beim Laden der Buchungen.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show success message briefly
  const showSuccess = useCallback(
    (msg) => {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    []
  );

  // Cancel handler
  const handleCancel = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelProcessing(true);
    try {
      await CustomerBookingsApi.cancel(cancelTarget.id);
      showSuccess(t('customer.cancelled_success', 'Buchung erfolgreich storniert.'));
      setCancelTarget(null);
      fetchData();
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || t('customer.cancel_error', 'Fehler beim Stornieren.');
      setError(msg);
    } finally {
      setCancelProcessing(false);
    }
  }, [cancelTarget, fetchData, showSuccess, t]);

  // Reschedule handler
  const handleReschedule = useCallback(
    async (startAt) => {
      if (!rescheduleTarget) return;
      setRescheduleProcessing(true);
      try {
        await CustomerBookingsApi.reschedule(rescheduleTarget.id, startAt);
        showSuccess(t('customer.rescheduled_success', 'Termin erfolgreich umgebucht.'));
        setRescheduleTarget(null);
        fetchData();
      } catch (err) {
        const msg = err?.response?.data?.detail || err.message || t('customer.reschedule_error', 'Fehler beim Umbuchen.');
        setError(msg);
      } finally {
        setRescheduleProcessing(false);
      }
    },
    [rescheduleTarget, fetchData, showSuccess, t]
  );

  // Filter & Search
  const filtered = bookings.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const svc = (b.service_name || b.service?.name || '').toLowerCase();
      const vnd = (b.vendor_name || b.vendor?.name || '').toLowerCase();
      if (!svc.includes(q) && !vnd.includes(q)) return false;
    }
    return true;
  });

  const FILTERS = [
    { value: 'all', label: t('customer.filter_all', 'Alle') },
    { value: 'confirmed', label: t('customer.filter_confirmed', 'Bestätigt') },
    { value: 'pending', label: t('customer.filter_pending', 'Ausstehend') },
    { value: 'completed', label: t('customer.filter_completed', 'Abgeschlossen') },
    { value: 'cancelled', label: t('customer.filter_cancelled', 'Storniert') },
  ];

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
          {t('customer.my_bookings_page', 'Meine Buchungen')}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {t('customer.my_bookings_sub', 'Alle deine Termine und Buchungen auf einen Blick.')}
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

      {/* ═══ Search & Filter Bar ═══ */}
      <div
        className="rounded-xl p-4 flex flex-col sm:flex-row gap-3"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-divider)',
        }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('customer.search_placeholder', 'Suche nach Dienstleistung oder Anbieter…')}
            className="w-full pl-9 pr-3 py-2.5 text-[13px]"
            style={{
              border: '1px solid var(--color-divider)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-sunken)',
            }}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-3 py-2 text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
              style={{
                borderRadius: 'var(--radius-sm)',
                background:
                  filter === f.value ? 'var(--color-primary)' : 'var(--color-surface-sunken)',
                color:
                  filter === f.value ? 'white' : 'var(--color-text-secondary)',
                border:
                  filter === f.value
                    ? '1px solid var(--color-primary)'
                    : '1px solid var(--color-divider)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Loading ═══ */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('customer.loading_bookings', 'Buchungen werden geladen…')}
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
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <CalendarCheck size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {searchQuery || filter !== 'all'
              ? t('customer.no_bookings_filter', 'Keine Buchungen gefunden.')
              : t('customer.no_bookings_yet', 'Du hast noch keine Buchungen.')}
          </p>
          {(searchQuery || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="mt-3 text-[12px] font-semibold cursor-pointer hover:underline"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('customer.clear_filter', 'Filter zurücksetzen')}
            </button>
          )}
        </div>
      )}

      {/* ═══ Booking List ═══ */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;

            return (
              <Card key={booking.id} className="group">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--color-accent-muted)' }}
                    >
                      <CalendarCheck size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3
                          className="text-[14px] font-bold truncate"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {booking.service_name || booking.service?.name || 'Dienstleistung'}
                        </h3>
                        <Badge variant={statusCfg.variant} size="sm" className="shrink-0 w-fit">
                          <StatusIcon size={10} />
                          {statusCfg.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(booking.start_at || booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {formatTime(booking.start_at || booking.date)}
                        </span>
                        {booking.vendor_name && (
                          <span>{booking.vendor_name}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <>
                          <button
                            onClick={() => setRescheduleTarget(booking)}
                            className="px-3 py-2 text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                            style={{
                              border: '1px solid var(--color-divider)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--color-primary)',
                              background: 'var(--color-surface)',
                            }}
                            title={t('customer.reschedule', 'Umbuchen')}
                          >
                            <Calendar size={12} />
                            <span className="hidden sm:inline">{t('customer.reschedule', 'Umbuchen')}</span>
                          </button>
                          <button
                            onClick={() => setCancelTarget(booking)}
                            className="px-3 py-2 text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                            style={{
                              border: '1px solid var(--color-danger-border)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--color-danger)',
                              background: 'var(--color-danger-bg)',
                            }}
                            title={t('customer.cancel', 'Stornieren')}
                          >
                            <XCircle size={12} />
                            <span className="hidden sm:inline">{t('customer.cancel', 'Stornieren')}</span>
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <Link
                          to={`/portal/reviews/new?booking=${booking.id}`}
                          className="px-3 py-2 text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                          style={{
                            border: '1px solid var(--color-divider)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-accent)',
                            background: 'var(--color-accent-muted)',
                          }}
                        >
                          <Star size={12} />
                          <span className="hidden sm:inline">{t('customer.rate', 'Bewerten')}</span>
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ═══ Cancel Modal ═══ */}
      <CancelModal
        open={!!cancelTarget}
        booking={cancelTarget}
        onConfirm={handleCancel}
        onClose={() => setCancelTarget(null)}
        processing={cancelProcessing}
      />

      {/* ═══ Reschedule Modal ═══ */}
      <RescheduleModal
        open={!!rescheduleTarget}
        booking={rescheduleTarget}
        onConfirm={handleReschedule}
        onClose={() => setRescheduleTarget(null)}
        processing={rescheduleProcessing}
      />
    </div>
  );
}
