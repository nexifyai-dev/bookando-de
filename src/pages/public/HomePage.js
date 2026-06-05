import React, { useState, useEffect, useRef } from 'react';
import { useInView, stagger, staggerDelay } from '../../components/shared/useInView';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import {
  ArrowRight, Shield, Globe, Users, Store, CalendarCheck,
  TrendingUp, Wallet, Palette, Layers, Star, BarChart3
} from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FeatureCard({ icon: Icon, title, desc, vis, idx }) {
  return (
    <div className={`p-8 border rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${stagger(vis, idx)}`}
      style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)', ...staggerDelay(idx) }}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
        style={{ background: 'var(--color-accent-muted)' }}>
        <Icon size={22} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
    </div>
  );
}

function StatRow({ icon: Icon, label, sub, idx }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <Icon size={18} className="text-white/60" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/30">{sub}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [heroRef, heroVis] = useInView(0.1);
  const [featuresRef, featuresVis] = useInView(0.1);
  const [statsRef, statsVis] = useInView(0.2);
  const [ctaRef, ctaVis] = useInView(0.1);

  const features = [
    { icon: Store, title: t('features.f1_title'), desc: t('features.f1_desc') },
    { icon: CalendarCheck, title: t('features.f2_title'), desc: t('features.f2_desc') },
    { icon: TrendingUp, title: t('features.f3_title'), desc: t('features.f3_desc') },
    { icon: Wallet, title: t('features.f4_title'), desc: t('features.f4_desc') },
    { icon: Palette, title: t('features.f5_title'), desc: t('features.f5_desc') },
    { icon: Globe, title: t('features.f6_title'), desc: t('features.f6_desc') },
  ];

  return (
    <div>
      <SEOHead
        title="Bookando – Termine buchen & Affiliate skalieren"
        description="Bookando.de vereint Terminbuchung, Affiliate-Marketing, Wallet und Marketplace in einer Plattform für Dienstleister."
      />
      <PublicNav />

      {/* HERO – Stripesque Single Column */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-primary-light) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
            backgroundSize: '128px 128px' }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(196,155,62,0.4), transparent)', filter: 'blur(80px)' }} />

        <div className={`relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-24 md:py-32 ${stagger(heroVis, 0)}`} style={staggerDelay(0)}>
          <div className="max-w-[800px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs font-semibold tracking-wider uppercase text-white/60">{t('hero.badge_made_in')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="block">{t('hero.title_line1')}</span>
              <span style={{ color: 'var(--color-accent)' }}>{t('hero.title_line2')}</span>
            </h1>

            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-[560px] mx-auto mb-12">{t('hero.subtitle')}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth/register"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-bold rounded-full transition-all duration-300 hover:scale-[1.02] group"
                style={{ background: 'var(--color-accent)', color: 'var(--color-primary-dark)', boxShadow: '0 4px 32px rgba(196,155,62,0.25)' }}>
                {t('hero.cta_primary')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-semibold rounded-full border-2 transition-all duration-300 hover:border-white/30"
                style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.15)' }}>
                {t('hero.cta_secondary')}
              </Link>
            </div>

            {/* Trust + Mini-Stats Row */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2"><Shield size={14} className="text-white/30" /><span className="text-xs text-white/40">{t('hero.trust_dsgvo')}</span></div>
                <div className="flex items-center gap-2"><Globe size={14} className="text-white/30" /><span className="text-xs text-white/40">{t('hero.trust_lang')}</span></div>
                <div className="flex items-center gap-2"><Users size={14} className="text-white/30" /><span className="text-xs text-white/40">{t('hero.trust_multi')}</span></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[560px] mt-4">
                <StatRow icon={Store} label="500+" sub="Vendors" idx={0} />
                <StatRow icon={BarChart3} label="50.000+" sub="Buchungen" idx={1} />
                <StatRow icon={Star} label="98%" sub="Zufriedenheit" idx={2} />
                <StatRow icon={Users} label="128+" sub="Affiliates" idx={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>{t('home.section_platform')}</p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.section_feature_title')}
            </h2>
            <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.section_feature_sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} vis={featuresVis} idx={i} />)}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 lg:py-24" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: 500, suffix: '+', label: t('home.stats_vendors') },
              { value: 50, suffix: '.000+', label: t('home.stats_bookings') },
              { value: 98, suffix: '%', label: t('home.stats_satisfaction') },
              { value: 24, suffix: '/7', label: t('home.stats_support') },
            ].map((s, i) => (
              <div key={i} className={`text-center ${stagger(statsVis, i)}`} style={staggerDelay(i)}>
                <p className="text-4xl lg:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs font-medium text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>{t('home.section_how_tag')}</p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.section_how_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: Users, title: t('home.how_step1'), desc: t('home.how_step1_desc') },
              { step: '02', icon: Layers, title: t('home.how_step2'), desc: t('home.how_step2_desc') },
              { step: '03', icon: TrendingUp, title: t('home.how_step3'), desc: t('home.how_step3_desc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-8">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'var(--color-accent-subtle)', border: '1px solid rgba(196,155,62,0.2)' }}>
                    <span className="text-lg font-bold" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>{item.step}</span>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'var(--color-primary-muted)' }}>
                    <Icon size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed max-w-[260px] mx-auto" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-xl text-center p-12 lg:p-20 xl:p-24"
            style={{ background: 'linear-gradient(160deg, var(--color-primary-dark), var(--color-primary) 50%, var(--color-primary-light))' }}>
            <div className={`max-w-[600px] mx-auto ${stagger(ctaVis, 0)}`}>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {t('home.section_cta_title')}
              </h2>
              <p className="text-base text-white/40 leading-relaxed mb-10 max-w-[440px] mx-auto">{t('home.cta_text')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/register"
                  className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-bold rounded-full transition-all duration-300 hover:scale-[1.02] group"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-primary-dark)', boxShadow: '0 4px 32px rgba(196,155,62,0.25)' }}>
                  {t('hero.cta_primary')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-semibold rounded-full border-2 transition-all duration-300 hover:border-white/30"
                  style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
                  {t('home.cta_btn2')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
