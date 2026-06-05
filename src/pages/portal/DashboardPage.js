import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import { CalendarCheck, TrendingUp, Users, DollarSign, ArrowRight, BarChart3, Wallet, Link2 } from 'lucide-react';

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
      <p className="text-[11px]" style={{ color: '#4ADE80' }}>{trend}</p>
    </div>
  );
}

function BookingRow({ date, customer, service, status, amount }) {
  const statusColors = {
    confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
    pending: { bg: 'rgba(74,144,201,0.12)', text: '#4A90C9' },
    completed: { bg: 'rgba(74,222,128,0.12)', text: '#4ADE80' },
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

export default function DashboardPage() {
  const { t } = useTranslation();

  const kpis = [
    { icon: Users, value: '24', label: t('dashboard.vendors'), trend: t('dashboard.vendors_trend') },
    { icon: TrendingUp, value: '128', label: t('dashboard.affiliates'), trend: t('dashboard.affiliates_trend') },
    { icon: DollarSign, value: '4.820\u20ac', label: t('dashboard.commissions'), trend: t('dashboard.commissions_trend') },
    { icon: CalendarCheck, value: '312', label: t('dashboard.bookings'), trend: t('dashboard.bookings_trend') },
  ];

  const bookings = [
    { date: '01.06.', customer: 'Sarah K.', service: 'Tattoo-Session', status: 'confirmed', amount: '350\u20ac' },
    { date: '01.06.', customer: 'Max M.', service: 'Kosmetik', status: 'completed', amount: '89\u20ac' },
    { date: '31.05.', customer: 'Julia B.', service: 'Friseur', status: 'confirmed', amount: '65\u20ac' },
    { date: '30.05.', customer: 'Tom L.', service: 'Barbershop', status: 'pending', amount: '35\u20ac' },
    { date: '29.05.', customer: 'Anna S.', service: 'Nageldesign', status: 'cancelled', amount: '55\u20ac' },
  ];

  return (
    <div style={{ background: 'var(--color-shell-bg)' }}>
      <SEOHead title={t('dashboard.title')} />

      <main className="p-6 lg:p-8 max-w-[1280px] mx-auto">
        {/* Welcome */}
        <div className="rounded-xl p-6 mb-6" 
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
          <h1 className="text-[22px] lg:text-[26px] font-extrabold tracking-[-0.02em] text-white"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {t('dashboard.welcome')}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{t('dashboard.welcome_sub')}</p>
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
              {bookings.map((b, i) => <BookingRow key={i} {...b} />)}
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
      </main>
    </div>
  );
}
