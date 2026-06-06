import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Filter, X, CheckCircle, XCircle, Loader2, AlertCircle, CalendarCheck,
  Clock, Download, ChevronDown, Eye
} from 'lucide-react';
import { VendorBookingsApi } from '../../lib/api';
import { formatAmount, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];

const statusConfig = {
  confirmed: { label: 'Bestätigt', bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)', icon: CheckCircle },
  pending: { label: 'Ausstehend', bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)', icon: Clock },
  completed: { label: 'Abgeschlossen', bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)', icon: CheckCircle },
  cancelled: { label: 'Storniert', bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)', icon: XCircle },
};

function BookingDetailModal({ booking, onClose, onAction }) {
  const { t } = useTranslation();
  if (!booking) return null;
  const sc = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = sc.icon;

  return (
    <div data-testid="vendor-bookings-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.bookings.detail_title', 'Buchungsdetails')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
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
              <p style={{ color: 'var(--color-text-primary)' }}>{booking.customer_name || booking.customer?.name || booking.customer?.first_name || '–'}</p>
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
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{formatAmount(booking.amount)}</p>
            </div>
            {booking.employee_name && (
              <div>
                <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.bookings.employee', 'Mitarbeiter')}</p>
                <p style={{ color: 'var(--color-text-primary)' }}>{booking.employee_name}</p>
              </div>
            )}
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
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
                style={{ background: 'var(--color-primary)' }}>
                {t('vendor.bookings.confirm', 'Bestätigen')}
              </button>
              <button onClick={() => onAction(booking.id, { status: 'cancelled' })}
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
                style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                {t('vendor.bookings.cancel', 'Stornieren')}
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button onClick={() => onAction(booking.id, { status: 'completed' })}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
              style={{ background: 'var(--color-success)' }}>
              {t('vendor.bookings.complete', 'Abschließen')}
            </button>
          )}
          {booking.status === 'completed' && (
            <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('vendor.bookings.completed_info', 'Diese Buchung ist abgeschlossen.')}
            </p>
          )}
          {booking.status === 'cancelled' && (
            <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('vendor.bookings.cancelled_info', 'Diese Buchung wurde storniert.')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorBookingsPage() {
  const { t } = useTranslation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchBookings = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await VendorBookingsApi.list(status !== 'all' ? status : undefined);
      const list = Array.isArray(data) ? data : (data.bookings || data.data || []);
      setBookings(list);
    } catch (err) {
      setError(err.message || t('vendor.bookings.load_error', 'Fehler beim Laden der Buchungen.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(statusFilter); }, [statusFilter, t]);

  const handleAction = async (id, payload) => {
    try {
      await VendorBookingsApi.update(id, payload);
      toast.success(t('vendor.bookings.update_success', 'Buchung aktualisiert.'));
      setSelectedBooking(null);
      fetchBookings(statusFilter);
    } catch (err) {
      toast.error(err.message || t('vendor.bookings.update_error', 'Fehler beim Aktualisieren.'));
    }
  };

  const filtered = bookings.filter(b => {
    if (search) {
      const q = search.toLowerCase();
      const customer = (b.customer_name || b.customer?.name || b.customer?.first_name || '').toLowerCase();
      const service = (b.service_name || b.service?.name || '').toLowerCase();
      if (!customer.includes(q) && !service.includes(q) && !(b.id || '').toLowerCase().includes(q)) return false;
    }
    if (dateFrom && b.date && b.date < dateFrom) return false;
    if (dateTo && b.date && b.date > dateTo) return false;
    return true;
  });

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.bookings.title', 'Buchungen')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.bookings.subtitle', 'Verwalte alle eingehenden Buchungen.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
            <Filter size={14} /> {t('vendor.bookings.filter', 'Filter')} <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === s ? 'text-white' : ''
            }`}
            style={{
              background: statusFilter === s ? 'var(--color-primary)' : 'var(--color-surface)',
              color: statusFilter === s ? '#fff' : 'var(--color-text-secondary)',
              border: statusFilter === s ? 'none' : '1px solid var(--color-divider)',
            }}>
            {s === 'all' ? t('vendor.bookings.all', 'Alle') : t(`vendor.bookings.status_${s}`, statusConfig[s]?.label || s)}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-5 p-4 rounded-xl animate-fade-in"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('vendor.bookings.search_placeholder', 'Suche nach Kunde oder Dienstleistung...')}
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>
          <div>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>
          <div>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>
        </div>
      )}

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
          <button onClick={() => fetchBookings(statusFilter)}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <CalendarCheck size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
            {t('vendor.bookings.empty', 'Keine Buchungen gefunden.')}
          </p>
        </div>
      )}

      {/* Bookings Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
          {/* Table Header */}
          <div className="hidden md:flex items-center gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider-subtle)', background: 'var(--color-surface-sunken)' }}>
            <div className="w-[100px]">{t('vendor.bookings.date', 'Datum')}</div>
            <div className="flex-1">{t('vendor.bookings.customer', 'Kunde')}</div>
            <div className="w-[140px] hidden lg:block">{t('vendor.bookings.service', 'Dienstleistung')}</div>
            <div className="w-[80px]">{t('vendor.bookings.amount', 'Betrag')}</div>
            <div className="w-[110px]">{t('vendor.bookings.status', 'Status')}</div>
            <div className="w-[50px]"></div>
          </div>

          {filtered.map((b, i) => {
            const sc = statusConfig[b.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={b.id || i}
                className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--color-surface-elevated)]"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-divider-subtle)' : 'none' }}
                onClick={() => setSelectedBooking(b)}>
                <div className="w-[100px] text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatDate(b.date || b.start_at || b.created_at)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {b.customer_name || b.customer?.name || b.customer?.first_name || '–'}
                  </p>
                  <p className="text-[11px] md:hidden" style={{ color: 'var(--color-text-tertiary)' }}>
                    {b.service_name || b.service?.name || '–'}
                  </p>
                </div>
                <div className="w-[140px] hidden lg:block text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {b.service_name || b.service?.name || '–'}
                </div>
                <div className="w-[80px] text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {formatAmount(b.amount)}
                </div>
                <div className="w-[110px]">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                    style={{ background: sc.bg, color: sc.text }}>
                    <StatusIcon size={10} />
                    {t(`vendor.bookings.status_${b.status}`, sc.label)}
                  </span>
                </div>
                <div className="w-[50px] flex justify-end" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Eye size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onAction={handleAction} />
      )}
    </div>
  );
}
