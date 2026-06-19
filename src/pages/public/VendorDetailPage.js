import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, Clock, ArrowLeft, Loader2, AlertCircle, ChevronRight, ChevronLeft, Calendar, User, Phone, Mail, CheckCircle2, RotateCcw } from 'lucide-react';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { VendorDetailApi, BookingSlotsApi, CustomerBookingsApi } from '../../lib/api';
import { cn } from '../../lib/utils-cn';
import { addDaysISO, buildDateWindow, clampToToday } from '../../lib/bookingDateWindow';

/* ════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════ */
function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toISODate(date) {
  return date.toISOString().split('T')[0];
}

function getInitials(name) {
  if (!name) return '--';
  return name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  const colors = ['#F59E0B', '#1A202C', '#D97706', '#2D3748'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const renderStars = (rating) => {
  const r = rating || 0;
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={14}
          fill={i <= Math.round(r) ? 'var(--color-warning)' : 'transparent'}
          style={{ color: i <= Math.round(r) ? 'var(--color-warning)' : 'var(--color-divider)' }}
        />
      ))}
    </span>
  );
};

/* ════════════════════════════════════════════════════════════════
   BOOKING WIDGET — Service → Datum → Slot → Daten → Bestätigung
   ════════════════════════════════════════════════════════════════ */
const STEPS = ['service', 'slot', 'details', 'confirm'];

function BookingWidget({ vendorId, services: allServices }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsReloadKey, setSlotsReloadKey] = useState(0);
  const [dateWindowStart, setDateWindowStart] = useState(toISODate(new Date()));
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', notes: '' });
  const [booking, setBooking] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Verfügbare Slots laden
  useEffect(() => {
    if (!selectedService || step < 1) return;
    setSlotsLoading(true);
    setSlotsError(null);
    BookingSlotsApi.available({
      vendor_id: vendorId,
      service_id: selectedService.id,
      date: selectedDate,
    })
      .then(data => {
        setSlots(Array.isArray(data) ? data : []);
        setSelectedSlot(null);
      })
      .catch(err => {
        const status = err?.response?.status;
        const fallback = status >= 500
          ? 'Der Terminservice ist vorübergehend nicht erreichbar.'
          : 'Fehler beim Laden der Termine';
        setSlotsError(err?.response?.data?.detail || fallback);
        setSlots([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedService, selectedDate, vendorId, step, slotsReloadKey]);

  const handleBook = useCallback(async () => {
    if (!selectedService || !selectedSlot || !customer.name || !customer.email) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      const startAt = selectedSlot.start || selectedSlot.start_at;
      const endAt = selectedSlot.end || selectedSlot.end_at;
      const result = await CustomerBookingsApi.create({
        vendor_id: vendorId,
        service_id: selectedService.id,
        service_name: selectedService.name,
        start_at: startAt,
        end_at: endAt,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || undefined,
        notes: customer.notes || undefined,
        price: selectedService.price || 0,
      });
      setBooking(result?.data || result);
      setStep(3);
    } catch (err) {
      setBookingError(err?.response?.data?.detail || 'Buchung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedService, selectedSlot, customer, vendorId]);

  // Service-Auswahl
  if (step === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {t('booking.select_service', 'Wähle eine Dienstleistung')}
        </h3>
        {(allServices || []).length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {t('booking.no_services', 'Noch keine Dienstleistungen verfügbar.')}
          </p>
        ) : (
          <div className="grid gap-3">
            {allServices.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  const today = toISODate(new Date());
                  setSelectedService(s);
                  setSelectedDate(today);
                  setDateWindowStart(today);
                  setSlotsError(null);
                  setStep(1);
                }}
                className="w-full text-left p-4 rounded-[var(--radius-md)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
                style={{
                  border: '1px solid var(--color-divider)',
                  backgroundColor: 'var(--color-surface)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-divider)'}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.name}</span>
                  <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>
                    {s.price ? `${s.price.toFixed(2)} €` : '—'}
                  </span>
                </div>
                {s.description && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <Clock size={12} />
                  <span>{s.duration_minutes || 30} min</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Slot-Auswahl
  if (step === 1) {
    const today = toISODate(new Date());
    const visibleDates = buildDateWindow(dateWindowStart, 14);
    const shiftWindow = (days) => {
      const nextStart = clampToToday(addDaysISO(dateWindowStart, days), today);
      setDateWindowStart(nextStart);
      setSelectedDate(nextStart);
    };
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="p-1 rounded transition-all duration-150 active:scale-[0.95]"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Zurück"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {selectedService?.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {t('booking.select_datetime', 'Wähle Datum & Uhrzeit')}
            </p>
          </div>
        </div>

        {/* Datum-Auswahl */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shiftWindow(-7)}
            disabled={dateWindowStart <= today}
            aria-label="Vorherige sieben Tage"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] disabled:opacity-40"
            style={{ border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => { setDateWindowStart(today); setSelectedDate(today); }}
            className="min-h-11 rounded-[var(--radius-md)] px-4 text-sm font-medium"
            style={{ border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
          >
            Heute
          </button>
          <button
            type="button"
            onClick={() => shiftWindow(7)}
            aria-label="Nächste sieben Tage"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)]"
            style={{ border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Verfügbare Buchungstage">
          {visibleDates.map((dateStr) => {
            const d = new Date(`${dateStr}T12:00:00`);
            const dayName = d.toLocaleDateString('de-DE', { weekday: 'short' });
            const dayNum = d.getDate();
            const month = d.toLocaleDateString('de-DE', { month: 'short' });
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                aria-pressed={isSelected}
                className={cn(
                  'flex flex-col items-center px-3 py-2 rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.95] min-w-[56px]',
                  isSelected ? 'font-semibold' : ''
                )}
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: isSelected ? '#fff' : 'var(--color-text-primary)',
                  border: isSelected ? 'none' : '1px solid var(--color-divider)',
                }}
              >
                <span className="text-[10px] uppercase tracking-wider">{dayName}</span>
                <span className="text-base font-semibold">{dayNum}</span>
                <span className="text-[10px]">{month}</span>
              </button>
            );
          })}
        </div>

        {/* Slot-Liste */}
        {slotsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : slotsError ? (
          <div className="flex flex-col items-center py-8 text-center" role="alert" aria-live="polite" style={{ color: 'var(--color-danger)' }}>
            <AlertCircle size={24} />
            <p className="mt-2 text-sm">{slotsError}</p>
            <button
              type="button"
              onClick={() => setSlotsReloadKey((value) => value + 1)}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold"
              style={{ border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
            >
              <RotateCcw size={16} />
              Erneut versuchen
            </button>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            <Calendar size={32} />
            <p className="mt-2 text-sm">{t('booking.no_slots', 'Keine freien Termine an diesem Tag.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot, idx) => {
              const start = slot.start || slot.start_at;
              const end = slot.end || slot.end_at;
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot.id || idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    'py-3 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 active:scale-[0.97]',
                    isSelected ? 'text-white' : ''
                  )}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: isSelected ? '#fff' : 'var(--color-text-primary)',
                    border: isSelected ? 'none' : '1px solid var(--color-divider)',
                  }}
                >
                  {formatTime(start)} – {formatTime(end)}
                </button>
              );
            })}
          </div>
        )}

        {selectedSlot && (
          <button
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-[var(--radius-md)] font-semibold transition-all duration-150 active:scale-[0.97] text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {t('booking.continue', 'Weiter zu deinen Daten')}
            <ChevronRight size={16} className="inline ml-1" />
          </button>
        )}
      </div>
    );
  }

  // Kundendaten
  if (step === 2) {
    const isValid = customer.name.trim() && customer.email.trim();
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(1)}
            className="p-1 rounded transition-all duration-150 active:scale-[0.95]"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Zurück"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {t('booking.your_details', 'Deine Angaben')}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedService?.name} · {formatDate(selectedDate)} · {selectedSlot ? formatTime(selectedSlot.start || selectedSlot.start_at) : ''}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {t('booking.name', 'Name')} *
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm"
              style={{
                border: '1px solid var(--color-divider)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={t('booking.name_placeholder', 'Max Mustermann')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {t('booking.email', 'E-Mail')} *
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm"
              style={{
                border: '1px solid var(--color-divider)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={t('booking.email_placeholder', 'max@example.de')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {t('booking.phone', 'Telefon (optional)')}
            </label>
            <input
              type="tel"
              value={customer.phone}
              onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm"
              style={{
                border: '1px solid var(--color-divider)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={t('booking.phone_placeholder', '+49 123 456789')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {t('booking.notes', 'Anmerkungen (optional)')}
            </label>
            <textarea
              value={customer.notes}
              onChange={e => setCustomer(p => ({ ...p, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm resize-none"
              rows={3}
              style={{
                border: '1px solid var(--color-divider)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={t('booking.notes_placeholder', 'Besondere Wünsche?')}
            />
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={!isValid || submitting}
          className="w-full py-3 rounded-[var(--radius-md)] font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-white"
          style={{ backgroundColor: isValid ? 'var(--color-accent)' : 'var(--color-divider)' }}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {t('booking.submitting', 'Wird gebucht...')}</span>
          ) : (
            t('booking.book_now', 'Kostenpflichtig buchen')
          )}
        </button>
        {bookingError && (
          <p role="alert" aria-live="polite" className="text-sm" style={{ color: 'var(--color-danger)' }}>
            {bookingError}
          </p>
        )}
      </div>
    );
  }

  // Bestätigung
  return (
    <div className="text-center py-8 space-y-4">
      <CheckCircle2 size={48} className="mx-auto" style={{ color: 'var(--color-success)' }} />
      <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {t('booking.confirmed', 'Buchung bestätigt!')}
      </h3>
      {booking && (
        <div className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
          <p>{selectedService?.name}</p>
          <p>{formatDate(selectedDate)} · {selectedSlot ? formatTime(selectedSlot.start || selectedSlot.start_at) : ''} Uhr</p>
          <p>{customer.name} · {customer.email}</p>
        </div>
      )}
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {t('booking.confirmation_email', 'Du erhältst in Kürze eine Bestätigungs-E-Mail.')}
      </p>
      <button
        onClick={() => { setStep(0); setSelectedService(null); setSelectedSlot(null); setBooking(null); setCustomer({ name: '', email: '', phone: '', notes: '' }); }}
        className="px-6 py-2 rounded-[var(--radius-md)] font-medium transition-all duration-150 active:scale-[0.97]"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
        }}
      >
        {t('booking.book_another', 'Weitere Buchung')}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VENDOR DETAIL PAGE
   ════════════════════════════════════════════════════════════════ */
export default function VendorDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    // Der slug ist hier die vendor_id (UUID)
    Promise.all([
      VendorDetailApi.get(slug),
      VendorDetailApi.services(slug),
    ])
      .then(([v, s]) => {
        setVendor(v);
        setServices(Array.isArray(s) ? s : []);
      })
      .catch(err => {
        setError(err?.response?.data?.detail || `Vendor "${slug}" nicht gefunden.`);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <SEOHead title="Bookando — Laden..." />
        <PublicNav />
        <main className="min-h-[100dvh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        </main>
        <PublicFooter />
      </>
    );
  }

  if (error || !vendor) {
    return (
      <>
        <SEOHead title="Bookando — Nicht gefunden" />
        <PublicNav />
        <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6">
          <AlertCircle size={48} style={{ color: 'var(--color-danger)' }} />
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {t('vendor.not_found', 'Dienstleister nicht gefunden')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {error || t('vendor.not_found_desc', 'Der angefragte Dienstleister existiert nicht oder ist nicht mehr verfügbar.')}
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-[var(--radius-md)] font-medium transition-all duration-150 active:scale-[0.97] text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <ArrowLeft size={16} />
            {t('vendor.back_to_marketplace', 'Zum Marketplace')}
          </Link>
        </main>
        <PublicFooter />
      </>
    );
  }

  const name = vendor.company_name || vendor.name || `${vendor.first_name || ''} ${vendor.last_name || ''}`.trim();
  const hasLogo = vendor.logo_url;

  return (
    <>
      <SEOHead
        title={`${name} — Bookando`}
        description={vendor.description?.slice(0, 160) || `${name} auf Bookando – Termin buchen`}
        ogImage={vendor.logo_url}
      />

      <PublicNav />

      <main className="min-h-[100dvh] pt-16">
        {/* ─── Vendor Hero ─── */}
        <section
          className="py-12 md:py-16"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-all duration-150 hover:opacity-80"
              style={{ color: '#fff' }}
            >
              <ArrowLeft size={16} />
              {t('vendor.back', 'Zurück zum Marketplace')}
            </Link>

            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              {/* Logo/Avatar */}
              <div className="flex-shrink-0">
                {hasLogo ? (
                  <img
                    src={vendor.logo_url}
                    alt={name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-lg)] object-cover"
                    style={{ border: '2px solid rgba(255,255,255,0.15)' }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-lg)] flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: getAvatarColor(name), color: '#fff' }}
                  >
                    {getInitials(name)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{name}</h1>
                {vendor.category && (
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {vendor.category}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {vendor.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {vendor.city}{vendor.country ? `, ${vendor.country}` : ''}
                    </span>
                  )}
                  {vendor.rating_average > 0 && (
                    <span className="inline-flex items-center gap-1">
                      {renderStars(vendor.rating_average)}
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                        ({vendor.rating_count || 0})
                      </span>
                    </span>
                  )}
                </div>
                {vendor.description && (
                  <p className="mt-4 text-sm leading-relaxed max-w-[65ch]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {vendor.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Services + Booking ─── */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Services-Liste */}
              <div className="md:col-span-3 space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {t('vendor.services', 'Dienstleistungen')}
                </h2>
                {services.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('vendor.no_services', 'Noch keine Dienstleistungen verfügbar.')}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {services.map(s => (
                      <div
                        key={s.id}
                        className="p-4 rounded-[var(--radius-md)] transition-all duration-200"
                        style={{
                          border: '1px solid var(--color-divider)',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.name}</h3>
                            {s.description && (
                              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.description}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="font-semibold" style={{ color: 'var(--color-accent)' }}>
                              {s.price ? `${s.price.toFixed(2)} €` : '—'}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                              {s.duration_minutes || 30} min
                            </p>
                          </div>
                        </div>
                        {s.is_online && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--color-accent)' }}>
                            Online
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BookingWidget */}
              <div className="md:col-span-2">
                <div
                  className="sticky top-20 p-6 rounded-[var(--radius-lg)]"
                  style={{
                    border: '1px solid var(--color-divider)',
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-e2)',
                  }}
                >
                  {services.length > 0 ? (
                    <BookingWidget vendorId={slug} services={services} />
                  ) : (
                    <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {t('vendor.no_services_booking', 'Buchung noch nicht verfügbar.')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
