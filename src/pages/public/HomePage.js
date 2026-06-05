import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import {
  ArrowRight, CheckCircle, Star, Users, TrendingUp, Shield,
  Zap, Globe, Clock, ChevronLeft, ChevronRight, Play
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   KONFIGURATION — Hier anpassen für dein Projekt!
   ════════════════════════════════════════════════════════════════ */
const CONFIG = {
  projectName: 'Dein Projekt',
  heroTitle: 'Willkommen bei',
  heroTitleAccent: 'deinem Projekt',
  heroSubtitle: 'Baue großartige Dinge. Modern, schnell und skalierbar.',
  heroCtaPrimary: 'Loslegen',
  heroCtaSecondary: 'Mehr erfahren',

  featuresTitle: 'Features',
  featuresSubtitle: 'Alles, was du brauchst, um durchzustarten.',
  features: [
    { icon: Zap, title: 'Schnell', desc: 'Optimiert für höchste Performance und schnelle Ladezeiten.' },
    { icon: Shield, title: 'Sicher', desc: 'Modernste Sicherheitsstandards für deine Daten.' },
    { icon: Globe, title: 'Global', desc: 'Mehrsprachig und international einsetzbar.' },
    { icon: Users, title: 'Skalierbar', desc: 'Wächst mit deinen Anforderungen mit.' },
    { icon: TrendingUp, title: 'Modern', desc: 'Aktuelle Technologien für zukunftssichere Lösungen.' },
    { icon: Star, title: 'Premium', desc: 'Höchste Qualität in Design und User Experience.' },
  ],

  stats: [
    { value: 99, suffix: '%', label: 'Zufriedenheit' },
    { value: 5000, suffix: '+', label: 'Nutzer' },
    { value: 50, suffix: '+', label: 'Features' },
    { value: 24, suffix: '/7', label: 'Support' },
  ],

  ctaTitle: 'Bereit für den',
  ctaTitleAccent: 'nächsten Schritt?',
  ctaDesc: 'Starte jetzt und überzeuge dich selbst von den Möglichkeiten.',
  ctaContactLabel: 'Beratungstermin',
};

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

const stagger = (visible, idx) =>
  visible
    ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
    : 'translate-y-6 opacity-0 transition-all duration-700 ease-out';

const staggerDelay = (idx) => ({ transitionDelay: `${idx * 120}ms` });

/* ════════════════════════════════════════════════════════════════
   HOMEPAGE
   ════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { t } = useTranslation();

  const [heroRef, heroVis] = useInView(0.1);
  const [featuresRef, featuresVis] = useInView(0.1);
  const [statsRef, statsVis] = useInView(0.2);
  const [ctaRef, ctaVis] = useInView(0.1);

  return (
    <div>
      <PublicNav />

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-primary-light) 100%)' }}
        data-testid="hero-section">

        {/* Hintergrundmuster */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Dekorative Akzente */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, white, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text */}
            <div className={`lg:col-span-7 ${stagger(heroVis, 0)}`} style={staggerDelay(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                style={{ borderColor: 'rgba(196,155,62,0.2)', background: 'rgba(196,155,62,0.08)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
                <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                  {t('home.hero_subtitle', CONFIG.heroSubtitle)}
                </span>
              </div>

              <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold text-white leading-[0.95] tracking-[-0.035em] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {t('home.hero_title', CONFIG.heroTitle)}<br />
                <span style={{ color: 'var(--color-accent)' }}>
                  {t('home.hero_title_accent', CONFIG.heroTitleAccent)}
                </span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-white/50 leading-[1.7] max-w-[520px] mb-10">
                {t('home.hero_subtitle', CONFIG.heroSubtitle)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register" data-testid="hero-primary-cta"
                  className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(212,175,55,0.3)' }}>
                  {t('home.hero_cta_primary', CONFIG.heroCtaPrimary)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" data-testid="hero-secondary-cta"
                  className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white">
                  <Play size={14} /> {t('home.hero_cta_secondary', CONFIG.heroCtaSecondary)}
                </Link>
              </div>
            </div>

            {/* Illustration / Platzhalter */}
            <div className={`hidden lg:flex lg:col-span-5 items-center justify-center ${stagger(heroVis, 1)}`} style={staggerDelay(1)}>
              <div className="w-[320px] h-[320px] rounded-[24px] flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-[16px] flex items-center justify-center"
                    style={{ background: 'rgba(196,155,62,0.15)' }}>
                    <Star size={32} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <p className="text-white/30 text-sm">Deine Illustration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════ */}
      <section ref={featuresRef} className="py-[80px] md:py-[100px] lg:py-[120px]" data-testid="features-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('home.features_title', CONFIG.featuresTitle)}
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.features_title', CONFIG.featuresTitle)}
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-4 leading-relaxed">
              {t('home.features_subtitle', CONFIG.featuresSubtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx}
                  className={`p-8 border rounded-[12px] transition-all duration-300 hover:translate-y-[-2px] ${stagger(featuresVis, idx)}`}
                  style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)', ...staggerDelay(idx) }}
                  data-testid={`feature-card-${idx}`}>
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-5"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <Icon size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <h3 className="text-[18px] font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS
          ═══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-[64px] md:py-[80px] lg:py-[96px]"
        style={{ background: 'var(--color-primary)' }} data-testid="stats-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {CONFIG.stats.map((stat, idx) => (
              <div key={idx} className={`text-center ${stagger(statsVis, idx)}`} style={staggerDelay(idx)}>
                <p className="text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[13px] font-medium text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-[64px] md:py-[80px] lg:py-[96px]" data-testid="cta-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[12px]"
            style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className={`lg:col-span-7 p-8 sm:p-12 lg:p-16 xl:p-20 ${stagger(ctaVis, 0)}`}>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('home.cta_title', CONFIG.ctaTitle)}<br />
                  <span style={{ color: 'var(--color-accent)' }}>{t('home.cta_title_accent', CONFIG.ctaTitleAccent)}</span>
                </h2>
                <p className="text-[15px] text-white/40 leading-[1.7] max-w-[440px] mb-10">
                  {t('home.cta_desc', CONFIG.ctaDesc)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth/register" data-testid="cta-primary"
                    className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(212,175,55,0.3)' }}>
                    {t('home.hero_cta_primary', CONFIG.heroCtaPrimary)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact" data-testid="cta-contact"
                    className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white">
                    {t('home.cta_consultation', CONFIG.ctaContactLabel)}
                  </Link>
                </div>
              </div>

              <div className={`hidden lg:flex lg:col-span-5 items-center justify-center lg:justify-end p-8 sm:p-10 lg:p-12 ${stagger(ctaVis, 1)}`} style={staggerDelay(1)}>
                <div className="w-[200px] sm:w-[240px] lg:w-[300px] h-auto aspect-square rounded-[16px] flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-center">
                    <CheckCircle size={48} style={{ color: 'var(--color-accent)' }} className="mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Deine Grafik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
