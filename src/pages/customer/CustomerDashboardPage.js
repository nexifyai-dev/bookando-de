import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Ticket,
  User,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  PartyPopper,
  ChevronRight,
  Calendar,
  Star,
} from 'lucide-react';
import { CustomerBookingsApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

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

function getStatusStyle(status) {
  const map = {
    confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)', label: 'Bestätigt' },
    pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)', label: 'Ausstehend' },
    completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)', label: 'Abgeschlossen' },
    cancelled: { bg: 'rgba(239,68,68,0.12)', text: 'var(--color-danger)', label: 'Storniert' },
  };
  return map[status] || map.pending;
}

/* ─── Quick-Action Card ─── */
function QuickAction({ icon: Icon, label, to, accent }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all cursor-pointer hover:translate-y-[-1px]"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        color: 'var(--color-text-secondary)',
        boxShadow: 'var(--shadow-e1)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: accent || 'var(--color-accent-muted)' }}
      >
        <Icon size={18} style={{ color: accent ? 'var(--color-primary)' : 'var(--color-accent)' }} />
      </div>
      <span className="flex-1 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </span>
      <ChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
    </Link>
  );
}

/* ─── Small Booking Card ─── */
function BookingMiniCard({ booking, index }) {
  const sc = getStatusStyle(booking.status);
  return (
    <div data-testid="customer-dashboard-page"
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
      style={{ borderBottom: index < 4 ? '1px solid var(--color-divider-subtle)' : 'none' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-accent-muted)' }}
      >
        <CalendarCheck size={15} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {booking.service_name || booking.service?.name || 'Dienstleistung'}
        </p>
        <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
          {formatDateTime(booking.start_at || booking.date)}
        </p>
      </div>
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: sc.bg, color: sc.text }}
      >
        {sc.label}
      </span>
    </div>
  );
}

/* ─── Next Appointment Highlight Card ─── */
function NextAppointmentCard({ booking }) {
  const sc = getStatusStyle(booking.status);
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        color: 'white',
      }}
    >
      <div className="absolute top-3 right-3 opacity-[0.08]">
        <PartyPopper size={64} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-[var(--color-accent)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Nächster Termin
        </span>
      </div>
      <h3 className="text-[18px] font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {booking.service_name || booking.service?.name || 'Dienstleistung'}
      </h3>
      <p className="text-[13px] mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {formatDate(booking.start_at || booking.date)} um {formatTime(booking.start_at)}
      </p>
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: sc.bg, color: sc.text }}
        >
          {sc.label}
        </span>
        {booking.vendor_name && (
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {booking.vendor_name}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function CustomerDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerBookingsApi.list();
      const list = Array.isArray(data) ? data : data?.bookings || data?.data || [];
      setBookings(list);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Fehler beim Laden der Daten.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const upcoming = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => new Date(a.start_at || a.date) - new Date(b.start_at || b.date));

  const nextAppointment = upcoming[0];

  return (
    <div className="animate-fade-in">
      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('customer.loading', 'Daten werden geladen…')}
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)' }} />
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

      {/* Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {/* ═══ Welcome Banner ═══ */}
          <div
            className="rounded-xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            }}
          >
            <h1
              className="text-[22px] md:text-[28px] font-extrabold tracking-[-0.02em] text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('customer.welcome', 'Willkommen')}
              {user?.first_name ? `, ${user.first_name}!` : '!'}
            </h1>
            <p className="text-[14px] mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {t('customer.welcome_sub', 'Hier siehst du deine nächsten Termine und Buchungen auf einen Blick.')}
            </p>
          </div>

          {/* ═══ Grid Layout ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─── Left Column: Next Appointment ─── */}
            <div className="lg:col-span-2 space-y-6">
              {nextAppointment && (
                <NextAppointmentCard booking={nextAppointment} />
              )}

              {/* ─── Meine Buchungen (nächste 5) ─── */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-divider)',
                  boxShadow: 'var(--shadow-e1)',
                }}
              >
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h2
                    className="text-[14px] font-bold flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
                  >
                    <CalendarCheck size={16} style={{ color: 'var(--color-accent)' }} />
                    {t('customer.my_bookings', 'Meine Buchungen')}
                  </h2>
                  <Link
                    to="/portal/bookings"
                    className="text-[11px] font-semibold flex items-center gap-1.5 transition-colors hover:underline"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {t('customer.view_all', 'Alle anzeigen')}
                    <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="px-1 pb-1">
                  {bookings.length === 0 ? (
                    <div className="text-center py-10">
                      <CalendarCheck
                        size={32}
                        className="mx-auto mb-2"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                      <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {t('customer.no_bookings_yet', 'Du hast noch keine Buchungen.')}
                      </p>
                    </div>
                  ) : (
                    bookings
                      .slice(0, 5)
                      .map((b, i) => <BookingMiniCard key={b.id || i} booking={b} index={i} />)
                  )}
                </div>
              </div>
            </div>

            {/* ─── Right Column: Quick Access ─── */}
            <div className="space-y-4">
              <h2
                className="text-[14px] font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {t('customer.quick_access', 'Schnellzugriff')}
              </h2>
              <div className="space-y-3">
                <QuickAction
                  icon={Calendar}
                  label={t('customer.book_appointment', 'Termin buchen')}
                  to="/portal/bookings?action=create"
                  accent="var(--color-accent-muted)"
                />
                <QuickAction
                  icon={Ticket}
                  label={t('customer.redeem_voucher', 'Gutschein einlösen')}
                  to="/portal/vouchers"
                  accent="var(--color-accent-muted)"
                />
                <QuickAction
                  icon={CalendarCheck}
                  label={t('customer.my_bookings_link', 'Meine Buchungen')}
                  to="/portal/bookings"
                />
                <QuickAction
                  icon={Star}
                  label={t('customer.recurring', 'Wiederholungstermine')}
                  to="/portal/recurring"
                />
                <QuickAction
                  icon={User}
                  label={t('customer.profile', 'Profil bearbeiten')}
                  to="/portal/profile"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
