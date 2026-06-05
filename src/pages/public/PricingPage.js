import React, { useRef, useState, useEffect } from 'react';
import { useInView, stagger, staggerDelay } from '../../components/shared/useInView';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowRight, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-divider)] py-4" style={{ borderColor: 'var(--color-divider)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left text-[15px] font-semibold gap-4 cursor-pointer"
        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
        {question}
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--color-accent)' }} />
      </button>
      {open && <p className="mt-3 text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{answer}</p>}
    </div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();
  const [heroRef, heroVis] = useInView(0.2);

  const plans = [
    {
      name: t('pricing.standard_name'),
      price: t('pricing.standard_price'),
      desc: t('pricing.standard_desc'),
      features: [
        t('pricing.standard_feat1'), t('pricing.standard_feat2'),
        t('pricing.standard_feat3'), t('pricing.standard_feat4'),
        t('pricing.standard_feat5'), t('pricing.standard_feat6'),
      ],
    },
    {
      name: t('pricing.affiliate_name'),
      price: t('pricing.affiliate_price'),
      desc: t('pricing.affiliate_desc'),
      popular: true,
      features: [
        t('pricing.affiliate_feat1'), t('pricing.affiliate_feat2'),
        t('pricing.affiliate_feat3'), t('pricing.affiliate_feat4'),
        t('pricing.affiliate_feat5'), t('pricing.affiliate_feat6'),
      ],
    },
  ];

  return (
    <div>
      <SEOHead title={t('pricing.page_title')} description={t('pricing.page_desc')} />
      <PublicNav />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-[120px] pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--color-primary-dark), var(--color-primary))' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--color-accent)' }}>Pricing</p>
          <h1 className="text-[32px] sm:text-[44px] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>{t('pricing.hero_headline')}</h1>
          <p className="text-[15px] text-white/50 max-w-[480px] mx-auto">{t('pricing.hero_sub')}</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-[60px] md:py-[80px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[720px] mx-auto">
            {plans.map((plan, idx) => (
              <div key={idx} className={`relative p-8 border rounded-[12px] transition-all duration-300 hover:translate-y-[-2px] ${plan.popular ? 'ring-2' : ''}`}
                style={{
                  borderColor: plan.popular ? 'var(--color-accent)' : 'var(--color-divider)',
                  background: plan.popular ? 'var(--color-surface)' : 'var(--color-surface)',
                  '--tw-ring-color': 'var(--color-accent)',
                }}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.14em] px-4 py-1 rounded-full text-white"
                    style={{ background: 'var(--color-accent)' }}>{t('pricing.popular_badge')}</span>
                )}
                <h3 className="text-[20px] font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{plan.name}</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">{plan.desc}</p>
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-[40px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{plan.price}€</span>
                  <span className="text-[14px] text-[var(--color-text-tertiary)] mb-1">{t('pricing.month')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-[14px] text-[var(--color-text-secondary)]">
                      <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/auth/register"
                  className="flex items-center justify-center gap-2 h-[48px] w-full text-[14px] font-bold tracking-wide rounded-full transition-all duration-300"
                  style={plan.popular
                    ? { background: 'var(--color-accent)', color: 'var(--color-primary-dark)', boxShadow: '0 4px 16px rgba(196,155,62,0.3)' }
                    : { border: '2px solid var(--color-divider)', color: 'var(--color-primary)' }}>
                  {t('pricing.cta_test')} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>

          {/* Free Trial Hinweis */}
          <div className="text-center mt-10 p-6 rounded-[10px] max-w-[480px] mx-auto"
            style={{ background: 'rgba(196,155,62,0.06)', border: '1px solid rgba(196,155,62,0.15)' }}>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--color-accent)' }}>{t('pricing.free_title')}</p>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">{t('pricing.free_desc')}</p>
          </div>

          {/* Fees */}
          <div className="mt-16 max-w-[600px] mx-auto">
            <h3 className="text-[18px] font-bold text-center mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{t('pricing.fee_title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: t('pricing.fee_own_title'), pct: t('pricing.fee_own_pct'), desc: t('pricing.fee_own_desc') },
                { title: t('pricing.fee_platform_title'), pct: t('pricing.fee_platform_pct'), desc: t('pricing.fee_platform_desc') },
              ].map((fee, fi) => (
                <div key={fi} className="p-5 border rounded-[10px] text-center" style={{ borderColor: 'var(--color-divider)' }}>
                  <p className="text-[24px] font-extrabold" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>{fee.pct}</p>
                  <p className="text-[12px] font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>{fee.title}</p>
                  <p className="text-[12px] text-[var(--color-text-tertiary)] mt-1">{fee.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-[560px] mx-auto">
            <h3 className="text-[18px] font-bold text-center mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{t('pricing.faq_title')}</h3>
            {[1, 2, 3].map(i => (
              <FaqItem key={i} question={t(`pricing.faq_q${i}`)} answer={t(`pricing.faq_a${i}`)} />
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
