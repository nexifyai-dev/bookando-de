import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Search, Mail, Calendar, Loader2, AlertCircle, Phone, MapPin
} from 'lucide-react';
import { formatAmount, formatDate } from '../../lib/utils';
import { VendorBookingsApi } from '../../lib/api';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

const statusColors = {
  confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
  pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
  completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
  cancelled: { bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)' },
};

function CustomerDetailModal({ customer, bookings, onClose }) {
  const { t } = useTranslation();
  if (!customer) return null;

  return (
    <div data-testid="vendor-customers-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl p-6 animate-fade-in max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.customers.detail_title', 'Kundendetails')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('vendor.customers.name', 'Name')}
            </p>
            <p className="text-[14px] font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
              {customer.name || customer.first_name || customer.email || '–'}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('vendor.customers.email', 'E-Mail')}
            </p>
            <p className="text-[13px] mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-primary)' }}>
              <Mail size={12} /> {customer.email || '–'}
            </p>
          </div>
          {customer.phone && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.customers.phone', 'Telefon')}
              </p>
              <p className="text-[13px] mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-primary)' }}>
                <Phone size={12} /> {customer.phone}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('vendor.customers.total_bookings', 'Buchungen')}
            </p>
            <p className="text-[13px] mt-1 font-semibold" style={{ color: 'var(--color-primary)' }}>
              {bookings.length} {t('vendor.customers.bookings_count', 'Buchungen')}
            </p>
          </div>
        </div>

        <h4 className="text-[13px] font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
          {t('vendor.customers.booking_history', 'Buchungshistorie')}
        </h4>

        {bookings.length === 0 ? (
          <p className="text-[13px] text-center py-6" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('vendor.customers.no_bookings', 'Keine Buchungen gefunden.')}
          </p>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, i) => {
              const sc = statusColors[b.status] || statusColors.pending;
              return (
                <div key={b.id || i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider-subtle)' }}>
                  <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
                  <span className="text-[12px] w-[90px]" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(b.date || b.start_at)}
                  </span>
                  <span className="text-[12px] flex-1" style={{ color: 'var(--color-text-primary)' }}>
                    {b.service_name || b.service?.name || '–'}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: sc.bg, color: sc.text }}>
                    {b.status}
                  </span>
                  <span className="text-[12px] font-semibold w-[70px] text-right" style={{ color: 'var(--color-text-primary)' }}>
                    {formatAmount(b.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VendorCustomersPage() {
  const { t } = useTranslation();

  const { data: bookings = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'customers'],
    () => VendorBookingsApi.list().then(d => Array.isArray(d) ? d : d?.bookings || d?.data || []),
  );

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Gruppiere Buchungen nach Kunde
  const customerMap = {};
  bookings.forEach(b => {
    const key = b.customer_email || b.customer?.email || b.customer_name || b.customer?.name || b.customer?.first_name || 'unknown';
    if (!customerMap[key]) {
      customerMap[key] = {
        key,
        name: b.customer_name || b.customer?.name || b.customer?.first_name || b.customer?.email || 'Unbekannt',
        email: b.customer_email || b.customer?.email || '',
        phone: b.customer_phone || b.customer?.phone || '',
        first_booking: b.date || b.start_at || b.created_at,
        bookingCount: 0,
        totalSpent: 0,
        bookings: [],
      };
    }
    customerMap[key].bookingCount += 1;
    customerMap[key].totalSpent += parseFloat(b.amount) || 0;
    customerMap[key].bookings.push(b);
    if (!customerMap[key].first_booking || (b.date && b.date < customerMap[key].first_booking)) {
      customerMap[key].first_booking = b.date || b.start_at || b.created_at;
    }
  });

  let customers = Object.values(customerMap);

  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }

  // Sortieren nach letzter Buchung
  customers.sort((a, b) => {
    const aDate = a.bookings[0]?.date || a.first_booking || '';
    const bDate = b.bookings[0]?.date || b.first_booking || '';
    return bDate.localeCompare(aDate);
  });

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.customers.title', 'Kunden')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.customers.subtitle', 'Alle Kunden mit Buchungshistorie.')}</p>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('vendor.customers.search', 'Kunde suchen...')}
            className="w-full pl-9 pr-3 py-2.5 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={() => window.location.reload()}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!isLoading && !error && customers.length === 0 && (
        <div className="text-center py-20">
          <Users size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
            {search ? t('vendor.customers.no_search_results', 'Keine Kunden gefunden.') : t('vendor.customers.empty', 'Noch keine Kunden.')}
          </p>
        </div>
      )}

      {!isLoading && !error && customers.length > 0 && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
          <div className="hidden md:flex items-center gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider-subtle)', background: 'var(--color-surface-sunken)' }}>
            <div className="flex-1">{t('vendor.customers.name', 'Name')}</div>
            <div className="w-[180px] hidden lg:block">{t('vendor.customers.email', 'E-Mail')}</div>
            <div className="w-[80px] text-right">{t('vendor.customers.bookings', 'Buchungen')}</div>
            <div className="w-[100px] text-right">{t('vendor.customers.total', 'Umsatz')}</div>
            <div className="w-[100px]">{t('vendor.customers.since', 'Kunde seit')}</div>
          </div>

          {customers.map((c, i) => (
            <div key={c.key}
              onClick={() => setSelectedCustomer(c)}
              className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--color-surface-elevated)]"
              style={{ borderBottom: i < customers.length - 1 ? '1px solid var(--color-divider-subtle)' : 'none' }}>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-accent-muted)' }}>
                  <Users size={15} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {c.name}
                  </p>
                  <p className="text-[11px] md:hidden" style={{ color: 'var(--color-text-tertiary)' }}>
                    {c.email || ''} · {c.bookingCount} {t('vendor.customers.booking', 'Buchung')}
                  </p>
                </div>
              </div>
              <div className="w-[180px] hidden lg:block text-[12px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                {c.email || '–'}
              </div>
              <div className="w-[80px] text-right text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {c.bookingCount}
              </div>
              <div className="w-[100px] text-right text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                {formatAmount(c.totalSpent)}
              </div>
              <div className="w-[100px] text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {formatDate(c.first_booking)}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          bookings={selectedCustomer.bookings}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
