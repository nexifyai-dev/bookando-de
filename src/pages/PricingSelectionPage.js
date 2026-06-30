import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check, Star, Zap, Loader2, AlertCircle, ArrowRight,
  Calendar, Users, Globe, CreditCard, BarChart3, Link2,
  Wallet, Calculator, FileText, Target, PieChart,
  Building2, Layout, Shield, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import apiClient from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';

const STANDARD_FEATURES = [
  { icon: Calendar, key: 'booking', labelKey: 'pricing.feature.booking', fallback: 'Terminbuchung' },
  { icon: Calendar, key: 'calendar', labelKey: 'pricing.feature.calendar', fallback: 'Kalender-Verwaltung' },
  { icon: Users, key: 'employees', labelKey: 'pricing.feature.employees', fallback: 'Mitarbeiter' },
  { icon: Users, key: 'customers', labelKey: 'pricing.feature.customers', fallback: 'Kunden (CRM)' },
  { icon: Globe, key: 'marketplace', labelKey: 'pricing.feature.marketplace', fallback: 'Marketplace' },
  { icon: Layout, key: 'landingpages', labelKey: 'pricing.feature.landingpages', fallback: 'Landingpages' },
  { icon: CreditCard, key: 'payments', labelKey: 'pricing.feature.payments', fallback: 'Zahlungen' },
  { icon: Shield, key: 'crm', labelKey: 'pricing.feature.crm', fallback: 'CRM' },
];

const AFFILIATE_FEATURES = [
  ...STANDARD_FEATURES,
  { icon: Link2, key: 'affiliate', labelKey: 'pricing.feature.affiliate', fallback: 'Affiliate-Tracking', highlight: true },
  { icon: BarChart3, key: 'partner_dash', labelKey: 'pricing.feature.partner_dash', fallback: 'Partner-Dashboards', highlight: true },
  { icon: Wallet, key: 'wallet', labelKey: 'pricing.feature.wallet', fallback: 'Wallet', highlight: true },
  { icon: Calculator, key: 'commission', labelKey: 'pricing.feature.commission', fallback: 'Provisionsberechnung', highlight: true },
  { icon: FileText, key: 'payouts', labelKey: 'pricing.feature.payouts', fallback: 'Auszahlungsverwaltung', highlight: true },
  { icon: Target, key: 'campaigns', labelKey: 'pricing.feature.campaigns', fallback: 'Kampagnen-Tracking', highlight: true },
  { icon: PieChart, key: 'stats', labelKey: 'pricing.feature.stats', fallback: 'Erweiterte Statistiken', highlight: true },
];

const COMPARISON_ROWS = [
  { label: 'pricing.comp.booking', fallback: 'Online-Terminbuchung', standard: true, affiliate: true },
  { label: 'pricing.comp.calendar', fallback: 'Kalender & Synchronisation', standard: true, affiliate: true },
  { label: 'pricing.comp.employees', fallback: 'Mitarbeiter-Management', standard: true, affiliate: true },
  { label: 'pricing.comp.crm', fallback: 'Kundenverwaltung (CRM)', standard: true, affiliate: true },
  { label: 'pricing.comp.marketplace', fallback: 'Marketplace-Eintrag', standard: true, affiliate: true },
  { label: 'pricing.comp.landing', fallback: 'Eigene Landingpages', standard: true, affiliate: true },
  { label: 'pricing.comp.payments', fallback: 'Online-Zahlungen', standard: true, affiliate: true },
  { label: 'pricing.comp.support', fallback: 'E-Mail Support', standard: true, affiliate: true },
  { label: 'pricing.comp.affiliate_tracking', fallback: 'Affiliate-Tracking', standard: false, affiliate: true },
  { label: 'pricing.comp.partner_dash', fallback: 'Partner-Dashboards', standard: false, affiliate: true },
  { label: 'pricing.comp.wallet', fallback: 'Wallet & Guthaben', standard: false, affiliate: true },
  { label: 'pricing.comp.commission', fallback: 'Provisionsberechnung', standard: false, affiliate: true },
  { label: 'pricing.comp.payout_mgmt', fallback: 'Auszahlungsverwaltung', standard: false, affiliate: true },
  { label: 'pricing.comp.campaign', fallback: 'Kampagnen-Tracking', standard: false, affiliate: true },
  { label: 'pricing.comp.advanced_stats', fallback: 'Erweiterte Statistiken', standard: false, affiliate: true },
  { label: 'pricing.comp.priority_support', fallback: 'Priority Support', standard: false, affiliate: true },
];

function FeatureBadge({ icon: Icon, label, highlight }) {
  return (
    <div className={`flex items-center gap-2.5 py-1.5 ${highlight ? 'text-brand font-semibold' : 'text-gray-600'}`}>
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-brand/10' : 'bg-gray-100'}`}>
        <Icon size={13} className={highlight ? 'text-brand' : 'text-gray-400'} />
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function PlanCard({ name, price, priceAnnual, features, isRecommended, onSelect, loading: planLoading, t, billingPeriod, highlighted }) {
  const displayPrice = billingPeriod === 'annual' ? priceAnnual : price;
  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border-2 transition-all ${
      highlighted ? 'border-brand shadow-xl shadow-brand/10 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-brand text-white text-xs font-bold rounded-full shadow-lg shadow-brand/30">
            <Star size={12} /> {t('pricing.recommended', 'Empfohlen')}
          </span>
        </div>
      )}
      <div className="p-6 pb-4 text-center">
        <h3 className="text-lg font-extrabold text-gray-900 mb-1">{name}</h3>
        <div className="mb-1">
          <span className="text-4xl font-extrabold text-gray-900">€{displayPrice}</span>
          <span className="text-sm text-gray-400 font-medium">/{t('pricing.month', 'Monat')}</span>
        </div>
        {billingPeriod === 'annual' && (
          <p className="text-xs text-success font-semibold">{t('pricing.annual_save', '2 Monate gratis!')}</p>
        )}
        {billingPeriod === 'monthly' && (
          <p className="text-xs text-gray-400">{t('pricing.monthly_billed', 'Monatlich kündbar')}</p>
        )}
      </div>
      <div className="px-6 pb-4">
        <button onClick={onSelect} disabled={planLoading} className={`w-full h-12 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          highlighted
            ? 'bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } disabled:opacity-50`}>
          {planLoading ? <Loader2 size={16} className="animate-spin" /> : <>{t('pricing.cta', '30 Tage kostenlos testen')} <ArrowRight size={14} /></>}
        </button>
      </div>
      <div className="border-t border-gray-100 px-6 py-4 flex-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {t('pricing.included', 'Enthalten')}
        </p>
        <div className="space-y-0.5">
          {features.map(f => (
            <FeatureBadge key={f.key} icon={f.icon} label={t(f.labelKey, f.fallback)} highlight={f.highlight} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════ */
export default function PricingSelectionPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiClient.get('/api/plans').then(({ data }) => {
      if (!cancelled) { setPlans(data); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSelect = async (planKey) => {
    if (!user) {
      navigate('/auth/register');
      return;
    }
    setSelecting(planKey);
    setError(null);
    try {
      await apiClient.post('/api/subscriptions', {
        plan: planKey,
        billing: billingPeriod,
      });
      navigate('/portal/vendor');
    } catch (err) {
      setError(err.response?.data?.message || t('pricing.error', 'Fehler beim Abschluss. Bitte versuchen Sie es erneut.'));
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {t('pricing.title', 'Wählen Sie Ihren Plan')}
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            {t('pricing.subtitle', 'Starten Sie mit 30 Tagen kostenlos. Keine Kreditkarte erforderlich. Jederzeit kündbar.')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button onClick={() => setBillingPeriod('monthly')} className={`text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
            {t('pricing.monthly', 'Monatlich')}
          </button>
          <button onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')} className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors data-[active=true]:bg-brand" data-active={billingPeriod === 'annual'}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
          <button onClick={() => setBillingPeriod('annual')} className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
            {t('pricing.annual', 'Jährlich')}
            <span className="px-2 py-0.5 bg-success/10 text-success text-[11px] font-bold rounded-full">{t('pricing.save_badge', '-17%')}</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 max-w-lg mx-auto flex items-center gap-3 bg-danger/5 border border-danger/20 rounded-xl px-5 py-3">
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
          <PlanCard
            name={t('pricing.standard', 'Standard')}
            price="49"
            priceAnnual="40"
            features={STANDARD_FEATURES}
            isRecommended={false}
            onSelect={() => handleSelect('standard')}
            loading={selecting === 'standard'}
            t={t}
            billingPeriod={billingPeriod}
            highlighted={false}
          />
          <PlanCard
            name={t('pricing.affiliate_booking', 'Affiliate-Booking')}
            price="189"
            priceAnnual="157"
            features={AFFILIATE_FEATURES}
            isRecommended={true}
            onSelect={() => handleSelect('affiliate')}
            loading={selecting === 'affiliate'}
            t={t}
            billingPeriod={billingPeriod}
            highlighted={true}
          />
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setShowComparison(v => !v)} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
            {t('pricing.compare', 'Alle Funktionen vergleichen')}
            {showComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showComparison && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('pricing.feature_col', 'Funktion')}</span>
                    </th>
                    <th className="text-center px-5 py-3.5 w-28">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('pricing.standard', 'Standard')}</span>
                    </th>
                    <th className="text-center px-5 py-3.5 w-28">
                      <span className="text-xs font-semibold text-brand uppercase tracking-wider">{t('pricing.affiliate_booking_short', 'Affiliate')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-700">{t(row.label, row.fallback)}</td>
                      <td className="px-5 py-3 text-center">
                        {row.standard ? (
                          <Check size={16} className="text-success mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Check size={16} className="text-success mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Trust section */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Shield size={14} /> {t('pricing.trust.ssl', 'SSL-verschlüsselt')}</span>
            <span className="flex items-center gap-1.5"><CreditCard size={14} /> {t('pricing.trust.no_card', 'Keine Kreditkarte nötig')}</span>
            <span className="flex items-center gap-1.5"><Zap size={14} /> {t('pricing.trust.instant', 'Sofort startklar')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
