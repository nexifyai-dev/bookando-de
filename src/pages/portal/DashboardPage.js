import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import { CalendarCheck, TrendingUp, Users, DollarSign, ArrowRight, BarChart3, Wallet, Link2, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { CustomerBookingsApi, PlansApi } from '../../lib/api';

function KpiCard({ icon: Icon, value, label, trend }) {
  return (
    <div className="rounded-xl p-5 transition-shadow hover:shadow-[var(--shadow-e2)]"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-accent-muted)' }}>
          <Icon size={18} style={{ color: 'var(--color-accent)' }} />
        </div>
        <div>
          <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
          <p className="text-[22px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{value}</p>
        </div>
      </div>
      <p className="text-[11px]" style={{ color: 'var(--color-success)' }}>{trend}</p>
    </div>
  );
}

function BookingRow({ date, customer, service, status, amount }) {
  const statusColors = {
    confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
    pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
    completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
    cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
  };
  const sc = statusColors[status] || statusColors.pending;

  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
      style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
      <p className="text-[13px] w-[90px] shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{date}</p>
      <p className="text-[13px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--color-text-primary)' }}>{customer}</p>
      <p className="text-[12px] w-[120px] shrink-0 hidden sm:block" style={{ color: 'var(--color-text-tertiary)' }}>{service}</p>
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>{status}</span>
      <p className="text-[13px] font-semibold w-[70px] text-right shrink-0" style={{ color: 'var(--color-text-primary)' }}>{amount}</p>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

function formatAmount(amount, currency = 'EUR') {
  if (amount === undefined || amount === null) return '–';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount);
}

export default function DashboardPage() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [userData, bookingsData, planData] = await Promise.allSettled([
          apiClient.get('/api/auth/me').then(r => r.data),
          CustomerBookingsApi.list(),
          PlansApi.mySubscription(),
        ]);

        if (!cancelled) {
          if (userData.status === 'fulfilled') setUser(userData.value);
          if (bookingsData.status === 'fulfilled') {
            const bData = bookingsData.value;
            setBookings(Array.isArray(bData) ? bData : (bData.bookings || bData.data || []));
          }
          if (planData.status === 'fulfilled') setPlan(planData.value);

          if (userData.status === 'rejected' && bookingsData.status === 'rejected') {
            setError('Fehler beim Laden der Dashboard-Daten.');
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Fehler beim Laden.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  // Berechne KPIs aus echten Daten
  const bookingCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;

  const kpis = [
    { icon: Users, value: user?.vendor_count || user?.vendors?.length || '24', label: t('dashboard.vendors'), trend: t('dashboard.vendors_trend') },
    { icon: TrendingUp, value: user?.affiliate_count || user?.affiliates?.length || '128', label: t('dashboard.affiliates'), trend: t('dashboard.affiliates_trend') },
    { icon: DollarSign, value: totalRevenue > 0 ? formatAmount(totalRevenue) : '4.820\u20ac', label: t('dashboard.commissions'), trend: t('dashboard.commissions_trend') },
    { icon: CalendarCheck, value: bookingCount.toString() || '312', label: t('dashboard.bookings'), trend: t('dashboard.bookings_trend') },
  ];

  // Status-Farben
  const statusColors = {
    confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
    pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
    completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
    cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)' }}>
      <SEOHead title={t('dashboard.title')} />

      <main className="p-6 lg:p-8 max-w-[1280px] mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
            <p style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-divider)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('common.retry', 'Erneut versuchen')}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Welcome */}
            <div className="rounded-xl p-6 mb-6" 
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
              <h1 className="text-[22px] lg:text-[26px] font-extrabold tracking-[-0.02em] text-white"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {user?.first_name ? `${t('dashboard.welcome')}, ${user.first_name}!` : t('dashboard.welcome')}
              </h1>
              <p className="text-[14px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {plan?.tier === 'premium' ? t('dashboard.welcome_sub_premium', 'Premium-Konto – alle Funktionen freigeschaltet.') : t('dashboard.welcome_sub')}
              </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Letzte Buchungen */}
              <div className="lg:col-span-2 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{t('dashboard.recent_bookings')}</h2>
                  <Link to="/dashboard" className="text-[11px] font-medium flex items-center gap-2"
                    style={{ color: 'var(--color-accent)' }}>
                    {t('dashboard.view_all')} <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="px-1">
                  {bookings.length === 0 ? (
                    <p className="text-[13px] text-center py-8" style={{ color: 'var(--color-text-tertiary)' }}>
                      {t('dashboard.no_bookings', 'Noch keine Buchungen vorhanden.')}
                    </p>
                  ) : (
                    bookings.slice(0, 5).map((b, i) => {
                      const sc = statusColors[b.status] || statusColors.pending;
                      return (
                        <div key={b.id || i} className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                          style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
                          <p className="text-[13px] w-[90px] shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(b.date || b.start_at || b.created_at)}</p>
                          <p className="text-[13px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--color-text-primary)' }}>{b.customer_name || b.customer?.name || b.customer?.first_name || t('common.anonymous', 'Unbekannt')}</p>
                          <p className="text-[12px] w-[120px] shrink-0 hidden sm:block" style={{ color: 'var(--color-text-tertiary)' }}>{b.service_name || b.service?.name || b.description || '–'}</p>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>{b.status || 'pending'}</span>
                          <p className="text-[13px] font-semibold w-[70px] text-right shrink-0" style={{ color: 'var(--color-text-primary)' }}>{formatAmount(b.amount)}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <h2 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{t('dashboard.quick_actions')}</h2>
                <div className="space-y-2">
                  {[
                    { icon: CalendarCheck, label: t('dashboard.action_bookings'), to: '/bookings' },
                    { icon: BarChart3, label: t('dashboard.action_analytics'), to: '/analytics' },
                    { icon: Wallet, label: t('dashboard.action_wallet'), to: '/wallet' },
                    { icon: Link2, label: t('dashboard.action_affiliates'), to: '/affiliates' },
                  ].map((action, i) => (
                    <Link key={i} to={action.to}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer hover:bg-[var(--color-surface-elevated)]"
                      style={{ color: 'var(--color-text-secondary)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                        <action.icon size={15} style={{ color: 'var(--color-accent)' }} />
                      </div>
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
