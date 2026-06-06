import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Filter, X, CheckCircle, XCircle, Loader2, AlertCircle,
  Clock, ChevronDown, UserX, Ban
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { formatAmount, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

const statusConfig = {
  confirmed: { label: 'Bestätigt', bg: 'rgba(56,161,105,0.12)', text: 'var(--color-success)', icon: CheckCircle },
  pending: { label: 'Ausstehend', bg: 'rgba(245,158,11,0.12)', text: 'var(--color-warning)', icon: Clock },
  completed: { label: 'Abgeschlossen', bg: 'rgba(49,130,206,0.12)', text: '#3182CE', icon: CheckCircle },
  cancelled: { label: 'Storniert', bg: 'rgba(229,62,62,0.12)', text: 'var(--color-danger)', icon: XCircle },
  no_show: { label: 'Nicht erschienen', bg: 'rgba(159,122,234,0.12)', text: '#9F7AEA', icon: UserX },
};

function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onCancel}>
      <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}
        onClick={e => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
            style={{ background: 'var(--color-danger)' }}>
            {loading ? '...' : 'Bestätigen'}
          </button>
          <button onClick={onCancel} disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 active:scale-[0.97]"
            style={{ background: 'var(--color-shell-bg)', color: 'var(--color-text-secondary)' }}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose, onAction }) {
  const { t } = useTranslation();
  if (!booking) return null;
  const sc = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = sc.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.bookings.detail_title', 'Buchungsdetails')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]" style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusIcon size={20} style={{ color: sc.text }} />
            <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
              {t(`vendor.bookings.status_${booking.status}`, sc.label)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.customer', 'Kunde')}</p>
              <p style={{ color: 'var(--color-text-primary)' }}>{booking.customer_name || booking.customer?.name || '–'}</p>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.service', 'Dienstleistung')}</p>
              <p style={{ color: 'var(--color-text-primary)' }}>{booking.service_name || booking.service?.name || '–'}</p>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.date', 'Datum')}</p>
              <p style={{ color: 'var(--color-text-primary)' }}>{formatDate(booking.date || booking.start_at)}</p>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.amount', 'Betrag')}</p>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{formatAmount(booking.amount || booking.price)}</p>
            </div>
            {booking.employee_name && (
              <div>
                <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.employee', 'Mitarbeiter')}</p>
                <p style={{ color: 'var(--color-text-primary)' }}>{booking.employee_name}</p>
              </div>
            )}
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.email', 'E-Mail')}</p>
              <p style={{ color: 'var(--color-text-primary)' }}>{booking.customer_email || '–'}</p>
            </div>
            {booking.notes && (
              <div className="col-span-2">
                <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.notes', 'Notizen')}</p>
                <p style={{ color: 'var(--color-text-primary)' }}>{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-divider-subtle)' }}>
          {booking.status === 'pending' && (
            <>
              <button onClick={() => onAction(booking.id, { status: 'confirmed' })}
                className="flex-[2] px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer transition-all duration-150 active:scale-[0.97]"
                style={{ background: 'var(--color-success)' }}>
                {t('vendor.bookings.confirm', 'Bestätigen')}
              </button>
              <button onClick={() => onAction(booking.id, { status: 'cancelled' })}
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97]"
                style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(229,62,62,0.2)' }}>
                {t('vendor.bookings.cancel', 'Ablehnen')}
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <button onClick={() => onAction(booking.id, { status: 'completed' })}
                className="flex-[2] px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer transition-all duration-150 active:scale-[0.97]"
                style={{ background: '#3182CE' }}>
                {t('vendor.bookings.complete', 'Abgeschlossen')}
              </button>
              <button onClick={() => onAction(booking.id, { status: 'no_show' })}
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97]"
                style={{ background: 'rgba(159,122,234,0.1)', color: '#9F7AEA', border: '1px solid rgba(159,122,234,0.2)' }}>
                {t('vendor.bookings.no_show', 'No-Show')}
              </button>
              <button onClick={() => onAction(booking.id, { status: 'cancelled' })}
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97]"
                style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(229,62,62,0.2)' }}>
                {t('vendor.bookings.cancel', 'Stornieren')}
              </button>
            </>
          )}
          {(booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no_show') && (
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {t('vendor.bookings.no_actions', 'Keine weiteren Aktionen')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorBookingsPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: bookings = [], isLoading, isError, error, refetch } = useAutoRefresh(
    ['vendor', 'bookings', statusFilter],
    () => apiClient.get('/api/vendor/bookings', { params: statusFilter !== 'all' ? { status_filter: statusFilter } : {} })
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : (r.data?.bookings || []);
        return list;
      }),
    { refetchInterval: 15_000 }
  );

  const statusMutation = usePortalMutation({
    mutationFn: ({ id, payload }) => apiClient.patch(`/api/vendor/bookings/${id}`, payload),
    invalidateKeys: [['vendor', 'bookings'], ['vendor', 'dashboard']],
    onSuccess: () => {
      toast.success('Status aktualisiert');
      setConfirmAction(null);
      setSelectedBooking(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Fehler beim Aktualisieren');
      setConfirmAction(null);
    },
  });

  const handleAction = (id, payload) => {
    if (payload.status === 'cancelled' || payload.status === 'no_show') {
      const msg = payload.status === 'cancelled'
        ? 'Diese Buchung wirklich stornieren?'
        : 'Diesen Kunden als nicht erschienen markieren?';
      setConfirmAction({ id, payload, message: msg });
    } else {
      statusMutation.mutate({ id, payload });
    }
  };

  // Status-Chip für Listeneinträge
  const StatusChip = ({ status }) => {
    const sc = statusConfig[status] || statusConfig.pending;
    const Icon = sc.icon;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
        style={{ background: sc.bg, color: sc.text }}>
        <Icon size={11} />
        {t(`vendor.bookings.status_${status}`, sc.label)}
      </span>
    );
  };

  const filtered = searchQuery
    ? bookings.filter(b =>
        (b.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.service_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookings;

  return (
    <div className="p-6 space-y-5">
      {confirmAction && (
        <ConfirmModal
          title="Aktion bestätigen"
          message={confirmAction.message}
          onConfirm={() => statusMutation.mutate({ id: confirmAction.id, payload: confirmAction.payload })}
          onCancel={() => setConfirmAction(null)}
          loading={statusMutation.isPending}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {t('vendor.bookings.title', 'Buchungen')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {filtered.length} {t('vendor.bookings.count', 'Buchungen')}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.97]"
            style={{
              backgroundColor: statusFilter === s ? 'var(--color-accent)' : 'var(--color-surface)',
              color: statusFilter === s ? '#fff' : 'var(--color-text-secondary)',
              border: statusFilter === s ? 'none' : '1px solid var(--color-divider)',
            }}>
            {s === 'all' ? 'Alle' : (statusConfig[s]?.label || s)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: 'var(--color-danger)' }}>
          <AlertCircle size={32} />
          <p className="mt-2 text-sm">{error?.response?.data?.detail || 'Fehler beim Laden'}</p>
          <button onClick={refetch} className="mt-4 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}>
            Erneut versuchen
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <CalendarCheck size={40} />
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {searchQuery ? 'Keine Buchungen gefunden' : (statusFilter !== 'all' ? 'Keine Buchungen in diesem Status' : 'Noch keine Buchungen')}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)]" style={{ border: '1px solid var(--color-divider)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-shell-bg)' }}>
                {['Kunde', 'Service', 'Datum', 'Betrag', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="cursor-pointer transition-colors duration-150 hover:opacity-85"
                  style={{ borderTop: '1px solid var(--color-divider)', backgroundColor: 'var(--color-surface)' }}
                  onClick={() => setSelectedBooking(b)}>
                  <td className="px-4 py-3">
                    <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {b.customer_name || b.customer?.name || '–'}
                    </span>
                    <span className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {b.customer_email || '–'}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                    {b.service_name || b.service?.name || '–'}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(b.date || b.start_at)}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {formatAmount(b.amount || b.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Details →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
