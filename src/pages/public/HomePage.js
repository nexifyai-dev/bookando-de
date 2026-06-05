import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import SEOHead from "../../components/shared/SEOHead";
import {
  ArrowRight, Store, CalendarCheck, BarChart3, Wallet,
  Palette, Globe, CheckCircle, Play, Star, TrendingUp,
  Shield, Users, Gift, Bell, RefreshCw, Layers,
  ChevronRight, MapPin, MousePointer2, DollarSign
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   HOOKS
   ════════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimatedCounter({ end, suffix = '', duration = 2000, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
}

const stagger = (visible, idx) =>
  visible
    ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
    : 'translate-y-6 opacity-0 transition-all duration-700 ease-out';

const staggerDelay = (idx) => ({ transitionDelay: `${idx * 120}ms` });

/* ════════════════════════════════════════════════════════════════
   FEATURE DATA
   ════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: Store, key: '1' },
  { icon: CalendarCheck, key: '2' },
  { icon: BarChart3, key: '3' },
  { icon: Wallet, key: '4' },
  { icon: Palette, key: '5' },
  { icon: Globe, key: '6' },
];

/* ════════════════════════════════════════════════════════════════
   HOMEPAGE
   ════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { t } = useTranslation();

  const [heroRef, heroVis] = useInView(0.1);
  const [featuresRef, featuresVis] = useInView(0.1);
  const [statsRef, statsVis] = useInView(0.2);
  const [howRef, howVis] = useInView(0.1);
  const [ctaRef, ctaVis] = useInView(0.1);
  const [cathedralLoaded, setCathedralLoaded] = useState(false);

  const cathedralImg = 'https://images.unsplash.com/photo-1544776193-352d25ca8280?w=800&q=80';
  const cathedralImgFallback = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80';

  useEffect(() => {
    const img = new Image();
    img.onload = () => setCathedralLoaded(true);
    img.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => setCathedralLoaded(true);
      fallback.src = cathedralImgFallback;
    };
    img.src = cathedralImg;
  }, []);

  return (
    <div className="overflow-hidden">
      <SEOHead
        title="Bookando – Deine Buchungs- & Vertriebsplattform für Dienstleister"
        description="Bookando.de ist die modulare SaaS- und Marketplace-Plattform aus Aachen. Terminbuchung, Affiliate-Marketing, Wallet und WhiteLabel in einem System."
      />
      <PublicNav
        logoText="Bookando"
        primaryCta={{ labelKey: 'home.hero_cta_primary', href: '/auth/register' }}
        secondaryCta={{ labelKey: 'nav.login', href: '/auth/login' }}
        navItems={[
          { href: '/', labelKey: 'nav.home' },
          { href: '/features', labelKey: 'nav.features' },
          { href: '/marketplace', labelKey: 'nav.marketplace' },
          { href: '/about', labelKey: 'nav.about' },
          { href: '/contact', labelKey: 'nav.contact' },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A2036 0%, #1A4570 40%, #1A4570 70%, #0A2036 100%)' }}
        data-testid="hero-section"
      >
        {/* Subtiles geometrisches Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Raster-Punkt-Muster */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Gradient-Orbs */}
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #B3CDE1, transparent)', filter: 'blur(80px)' }} />

        {/* Cathedral Image – decorative element right side */}
        <div className={`absolute right-0 top-0 bottom-0 w-[45%] lg:w-[42%] transition-all duration-1500 ease-out pointer-events-none ${cathedralLoaded ? 'opacity-15 scale-100' : 'opacity-0 scale-105'}`}>
          <img
            src={cathedralImg}
            alt="Aachener Dom – UNESCO Welterbe"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, #0A2036 0%, #1A4570 30%, transparent 50%, transparent 70%, #0A2036 100%)',
          }} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-28 md:py-40 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Linke Spalte – Text */}
            <div className={`lg:col-span-7 ${stagger(heroVis, 0)}`} style={staggerDelay(0)}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-sm"
                style={{ borderColor: 'rgba(13,148,136,0.25)', background: 'rgba(13,148,136,0.08)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }} />
                <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                  {t('home.hero_badge')}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[42px] sm:text-[60px] lg:text-[72px] font-extrabold text-white leading-[0.92] tracking-[-0.04em] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {t('home.hero_title')}<br />
                <span style={{ color: 'var(--color-accent)' }}>
                  {t('home.hero_title_accent')}
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-[17px] sm:text-[19px] text-white/50 leading-[1.7] max-w-[540px] mb-10 font-light">
                {t('home.hero_subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register" data-testid="hero-primary-cta"
                  className="inline-flex items-center justify-center gap-2.5 h-[58px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: 'var(--color-accent)',
                    boxShadow: '0 4px 28px rgba(13,148,136,0.35), 0 2px 8px rgba(13,148,136,0.15)',
                  }}
                >
                  {t('home.hero_cta_primary')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/demo" data-testid="hero-secondary-cta"
                  className="inline-flex items-center justify-center gap-2.5 h-[58px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/5 backdrop-blur-sm">
                  <Play size={14} /> {t('home.hero_cta_secondary')}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--color-primary-dark)] overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <img
                          src={`https://i.pravatar.cc/28?u=${i}`}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[12px] text-white/40 font-medium">
                    <span className="text-white/70 font-bold">500+</span> aktive Nutzer
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-[var(--color-accent)]" style={{ color: 'var(--color-accent)' }} />
                  <Star size={14} className="fill-[var(--color-accent)]" style={{ color: 'var(--color-accent)' }} />
                  <Star size={14} className="fill-[var(--color-accent)]" style={{ color: 'var(--color-accent)' }} />
                  <Star size={14} className="fill-[var(--color-accent)]" style={{ color: 'var(--color-accent)' }} />
                  <Star size={14} className="fill-[var(--color-accent)]" style={{ color: 'var(--color-accent)' }} />
                  <span className="text-[12px] text-white/40 ml-1 font-medium">4.9 <span className="text-white/30">(150+)</span></span>
                </div>
              </div>
            </div>

            {/* Rechte Spalte – Visual mit Aachen Cathedral Bezug */}
            <div className={`hidden lg:flex lg:col-span-5 items-center justify-center ${stagger(heroVis, 1)}`} style={staggerDelay(1)}>
              <div className="relative w-full max-w-[400px]">
                {/* Haupt-Karte – Dashboard Preview */}
                <div className="relative rounded-[20px] overflow-hidden shadow-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Cathedral Miniatur */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={cathedralImg}
                      alt="Aachener Dom"
                      className="w-full h-full object-cover opacity-70"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(0deg, rgba(26,69,112,0.4) 0%, transparent 50%)',
                    }} />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-md backdrop-blur-md" style={{ background: 'rgba(10,32,54,0.6)' }}>
                        <span className="text-[10px] font-semibold text-white/80">Aachener Dom · UNESCO</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
                      <span className="text-[12px] text-white/50 font-medium">Aachen, Deutschland</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-white/60">Aktive Vendoren</span>
                        <span className="text-[15px] font-bold text-white">128</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full w-3/4 rounded-full" style={{ background: 'var(--color-accent)' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-white/60">Heutige Buchungen</span>
                        <span className="text-[15px] font-bold text-white">47</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full w-1/2 rounded-full" style={{ background: 'linear-gradient(90deg, var(--color-accent), #14B8A6)' }} />
                      </div>
                    </div>
                  </div>
                  {/* Glanz-Linie */}
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                </div>

                {/* Kleine Floating-Karte */}
                <div className="absolute -bottom-4 -right-4 rounded-[12px] px-4 py-3 backdrop-blur-xl"
                  style={{
                    background: 'rgba(13,148,136,0.15)',
                    border: '1px solid rgba(13,148,136,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                      style={{ background: 'rgba(13,148,136,0.2)' }}>
                      <TrendingUp size={16} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white">+32% <span className="text-[11px] font-medium text-white/40">vs. Vormonat</span></p>
                    </div>
                  </div>
                </div>

                {/* Kleine Floating-Karte 2 */}
                <div className="absolute -top-4 -left-4 rounded-[12px] px-4 py-3 backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield size={16} style={{ color: 'var(--color-accent)' }} />
                    <span className="text-[12px] font-medium text-white/60">SSL-verschlüsselt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-Indikator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/20 font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PARTNER / TRUST BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 md:py-10" style={{ background: 'var(--color-surface-sunken)' }} data-testid="trust-bar">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-center mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
            Vertrauen von Unternehmen aus der Region
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40">
            {['Aachen Digital', 'RWTH Campus', 'City Aachen', 'Indeland', 'Euregio', 'TRIANGEL'].map((name, i) => (
              <span key={i} className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════ */}
      <section ref={featuresRef} className="py-[80px] md:py-[100px] lg:py-[120px]" data-testid="features-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-[680px] mx-auto mb-[60px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('home.features_title')}
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.features_title')}
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-[560px] mx-auto">
              {t('home.features_subtitle')}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`group relative p-8 rounded-[16px] transition-all duration-500 ${stagger(featuresVis, idx)}`}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-divider)',
                    boxShadow: 'var(--shadow-e1)',
                    ...staggerDelay(idx),
                  }}
                  data-testid={`feature-card-${idx}`}
                >
                  {/* Hover-Effekt */}
                  <div className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,148,136,0.03) 0%, transparent 60%)',
                    }}
                  />

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <Icon size={26} style={{ color: 'var(--color-accent)' }} />
                  </div>

                  {/* Nummer */}
                  <span className="absolute top-6 right-6 text-[40px] font-extrabold select-none"
                    style={{ color: 'var(--color-divider)', fontFamily: 'var(--font-heading)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Titel */}
                  <h3 className="text-[19px] font-bold tracking-tight mb-3 relative z-10"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                    {t(`home.feature_${feature.key}_title`)}
                  </h3>

                  {/* Beschreibung */}
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed relative z-10">
                    {t(`home.feature_${feature.key}_desc`)}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-5 relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: 'var(--color-accent)' }}>
                      Mehr erfahren <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section ref={howRef} className="py-[80px] md:py-[100px] lg:py-[120px] relative overflow-hidden"
        style={{ background: 'var(--color-surface-sunken)' }} data-testid="how-it-works-section">

        {/* Hintergrund-Akzente */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-[600px] mx-auto mb-[60px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('home.how_title')}
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.how_title')}
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-4 leading-relaxed">
              {t('home.how_subtitle')}
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Verbindungslinie (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[calc(16.66%+30px)] right-[calc(16.66%+30px)] h-[2px]"
              style={{ background: `linear-gradient(90deg, var(--color-accent), var(--color-accent), var(--color-divider))` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface-sunken)' }} />
            </div>

            {/* Step 1: Register */}
            <div className={`relative text-center ${stagger(howVis, 0)}`} style={staggerDelay(0)}>
              <div className="w-[100px] h-[100px] mx-auto mb-8 rounded-[24px] flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-muted), rgba(13,148,136,0.02))',
                  border: '1px solid rgba(13,148,136,0.12)',
                }}
              >
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                  style={{ background: 'var(--color-accent)' }}>
                  1
                </div>
                <MousePointer2 size={36} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('home.how_step1_title')}
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-[320px] mx-auto">
                {t('home.how_step1_desc')}
              </p>
            </div>

            {/* Step 2: Connect */}
            <div className={`relative text-center ${stagger(howVis, 1)}`} style={staggerDelay(1)}>
              <div className="w-[100px] h-[100px] mx-auto mb-8 rounded-[24px] flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(13,148,136,0.02))',
                  border: '1px solid rgba(13,148,136,0.12)',
                }}
              >
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                  style={{ background: 'var(--color-accent)' }}>
                  2
                </div>
                <Layers size={36} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('home.how_step2_title')}
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-[320px] mx-auto">
                {t('home.how_step2_desc')}
              </p>
            </div>

            {/* Step 3: Earn */}
            <div className={`relative text-center ${stagger(howVis, 2)}`} style={staggerDelay(2)}>
              <div className="w-[100px] h-[100px] mx-auto mb-8 rounded-[24px] flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(13,148,136,0.02))',
                  border: '1px solid rgba(13,148,136,0.12)',
                }}
              >
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                  style={{ background: 'var(--color-accent)' }}>
                  3
                </div>
                <DollarSign size={36} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('home.how_step3_title')}
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-[320px] mx-auto">
                {t('home.how_step3_desc')}
              </p>
            </div>
          </div>

          {/* CTA unter Steps */}
          <div className={`text-center mt-16 ${stagger(howVis, 3)}`} style={staggerDelay(3)}>
            <Link to="/auth/register" data-testid="how-cta"
              className="inline-flex items-center gap-2.5 h-[52px] px-8 text-[14px] font-bold text-white rounded-[10px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'var(--color-primary)', boxShadow: 'var(--shadow-e3)' }}>
              {t('home.hero_cta_primary')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS
          ═══════════════════════════════════════════════════════════ */}
      <section ref={statsRef}
        className="relative py-[80px] md:py-[100px] lg:py-[120px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0A2036 0%, #1A4570 40%, #1A4570 60%, #0A2036 100%)',
        }}
        data-testid="stats-section"
      >
        {/* Hintergrund-Elemente */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #B3CDE1, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Überschrift */}
          <div className="text-center mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              Plattform in Zahlen
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05] text-white"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Wachstum, das{' '}
              <span style={{ color: 'var(--color-accent)' }}>überzeugt</span>
            </h2>
          </div>

          {/* Statistik-Zahlen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
            {/* 500+ Vendoren */}
            <div className={`text-center ${stagger(statsVis, 0)}`} style={staggerDelay(0)}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-[14px] flex items-center justify-center"
                style={{ background: 'rgba(13,148,136,0.12)' }}>
                <Store size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <p className="text-[14px] font-medium text-white/50">{t('home.stats_vendors')}</p>
            </div>

            {/* 50.000+ Bookings */}
            <div className={`text-center ${stagger(statsVis, 1)}`} style={staggerDelay(1)}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-[14px] flex items-center justify-center"
                style={{ background: 'rgba(13,148,136,0.12)' }}>
                <CalendarCheck size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                <AnimatedCounter end={50000} suffix="+" />
              </p>
              <p className="text-[14px] font-medium text-white/50">{t('home.stats_bookings')}</p>
            </div>

            {/* 98% Satisfaction */}
            <div className={`text-center ${stagger(statsVis, 2)}`} style={staggerDelay(2)}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-[14px] flex items-center justify-center"
                style={{ background: 'rgba(13,148,136,0.12)' }}>
                <Star size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                <AnimatedCounter end={98} suffix="%" />
              </p>
              <p className="text-[14px] font-medium text-white/50">{t('home.stats_satisfaction')}</p>
            </div>

            {/* 24/7 Support */}
            <div className={`text-center ${stagger(statsVis, 3)}`} style={staggerDelay(3)}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-[14px] flex items-center justify-center"
                style={{ background: 'rgba(13,148,136,0.12)' }}>
                <Bell size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                24<span className="text-[28px] sm:text-[32px]">/</span>7
              </p>
              <p className="text-[14px] font-medium text-white/50">{t('home.stats_support')}</p>
            </div>
          </div>

          {/* Zusätzliche KPI-Zeile */}
          <div className={`mt-16 pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 ${stagger(statsVis, 4)}`} style={staggerDelay(4)}>
            {[
              { icon: TrendingUp, label: 'Monatliches Wachstum', value: '+18%' },
              { icon: Users, label: 'Aktive Affiliates', value: '1.200+' },
              { icon: RefreshCw, label: 'Conversion-Rate', value: '4,7%' },
              { icon: Gift, label: 'Ausgezahlte Provisionen', value: '€89K' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                    style={{ background: 'rgba(13,148,136,0.1)' }}>
                    <Icon size={18} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-white">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA – FINAL CONVERSION BANNER
          ═══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-[80px] md:py-[100px] lg:py-[120px]" data-testid="cta-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[24px]"
            style={{
              background: 'linear-gradient(160deg, #0A2036 0%, #1A4570 40%, #1A4570 70%, #0A2036 100%)',
              boxShadow: '0 20px 60px rgba(10,32,54,0.3), 0 8px 24px rgba(10,32,54,0.15)',
            }}
          >
            {/* Hintergrundmuster */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Akzente */}
            <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full opacity-[0.05]"
              style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-[0.03]"
              style={{ background: 'radial-gradient(circle, #B3CDE1, transparent)', filter: 'blur(60px)' }} />

            {/* Cathedral decorative element */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block overflow-hidden opacity-15">
              <img
                src={cathedralImg}
                alt="Aachener Dom"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 30%' }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, #1A4570 0%, transparent 30%, transparent 70%, #0A2036 100%)',
              }} />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text */}
              <div className={`lg:col-span-8 p-8 sm:p-12 lg:p-16 xl:p-20 ${stagger(ctaVis, 0)}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                  style={{ borderColor: 'rgba(13,148,136,0.2)', background: 'rgba(13,148,136,0.08)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
                  <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
                    Jetzt starten
                  </span>
                </div>

                <h2 className="text-[30px] sm:text-[38px] lg:text-[48px] font-extrabold text-white leading-[1.08] tracking-[-0.03em] mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('home.cta_title')}<br />
                  <span style={{ color: 'var(--color-accent)' }}>{t('home.cta_title_accent')}</span>
                </h2>

                <p className="text-[15px] text-white/40 leading-[1.7] max-w-[520px] mb-8">
                  {t('home.cta_desc')}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth/register" data-testid="cta-primary"
                    className="inline-flex items-center justify-center gap-2.5 h-[58px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                      background: 'var(--color-accent)',
                      boxShadow: '0 4px 28px rgba(13,148,136,0.35), 0 2px 8px rgba(13,148,136,0.15)',
                    }}
                  >
                    {t('home.cta_primary')}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/affiliate" data-testid="cta-secondary"
                    className="inline-flex items-center justify-center gap-2 h-[58px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/5 backdrop-blur-sm">
                    {t('home.cta_secondary')}
                  </Link>
                </div>

                {/* Garantie */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
                  <Shield size={16} className="text-white/30" />
                  <span className="text-[12px] text-white/30">Keine versteckten Kosten · Jederzeit kündbar · DSGVO-konform</span>
                </div>
              </div>

              {/* Rechte Spalte – Visual */}
              <div className={`hidden lg:flex lg:col-span-4 items-center justify-center p-8 lg:p-12 ${stagger(ctaVis, 1)}`} style={staggerDelay(1)}>
                <div className="relative">
                  <div className="w-[200px] h-[200px] rounded-[20px] flex items-center justify-center backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-[14px] flex items-center justify-center"
                        style={{ background: 'rgba(13,148,136,0.15)' }}>
                        <CheckCircle size={32} style={{ color: 'var(--color-accent)' }} />
                      </div>
                      <p className="text-white/30 text-[12px] font-medium">In 3 Minuten starten</p>
                    </div>
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-2 -right-2 px-4 py-2 rounded-[10px] backdrop-blur-xl"
                    style={{
                      background: 'rgba(13,148,136,0.12)',
                      border: '1px solid rgba(13,148,136,0.15)',
                    }}
                  >
                    <p className="text-[11px] font-bold text-white">100% kostenlos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter
        brandName="Bookando"
        description={t('home.footer_tagline')}
        cta={{ labelKey: 'home.hero_cta_primary', href: '/auth/register' }}
      />
    </div>
  );
}
