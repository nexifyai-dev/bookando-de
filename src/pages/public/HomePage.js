import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowRight, Star, TrendingUp, Shield, Zap, Globe, Users, CheckCircle } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   KONFIGURATION — Bookando-spezifisch
   ════════════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    tag: 'Buchungs-System',
    icon: 'CalendarCheck',
    title: 'Smart Booking',
    desc: 'Professionelle Terminbuchung mit Echtzeit-Kalender, Mitarbeiter- und Ressourcenverwaltung, Wiederholungsterminen und Online-Meetings.',
  },
  {
    tag: 'Marketplace',
    icon: 'Globe',
    title: 'Öffentliches Verzeichnis',
    desc: 'Dienstleister-Suche mit Filter nach Kategorie, Standort und Bewertung – optimiert für lokale Sichtbarkeit und Neukundengewinnung.',
  },
  {
    tag: 'Affiliate',
    icon: 'TrendingUp',
    title: 'Affiliate-Tracking',
    desc: 'Vollständiges Affiliate-System mit Trackinglinks, Provisionszuordnung und automatischer Auszahlung – fair, transparent und skalierbar.',
  },
  {
    tag: 'Wallet',
    icon: 'Zap',
    title: 'Wallet & Ledger',
    desc: 'Sicheres Wallet-System mit unveränderbaren Ledger-Einträgen, automatischen Gutschriften und transparenter Auszahlungslogik.',
  },
  {
    tag: 'Branding',
    icon: 'Star',
    title: 'WhiteLabel & Branding',
    desc: 'Eigene Domain, eigenes Branding, eigene Farben und Logos. Agenturen betreiben ihre eigene Plattform auf Bookando-Infrastruktur.',
  },
  {
    tag: 'Franchise',
    icon: 'Users',
    title: 'Franchise & Multi-Location',
    desc: 'Hierarchische Strukturen für Franchise-Systeme. Zentrale Verwaltung mit dezentralen Standorten und konsolidierten Reports.',
  },
];

const STATS = [
  { value: 500, suffix: '+', label: 'Aktive Vendors' },
  { value: 50, suffix: '.000+', label: 'Buchungen' },
  { value: 98, suffix: '%', label: 'Zufriedenheit' },
  { value: 24, suffix: '/7', label: 'Support' },
];

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

function FeatureIcon({ name }) {
  const icons = { CalendarCheck: CalendarCheckIcon, Globe: GlobeIcon, TrendingUp: TrendingUpIcon, Zap: ZapIcon, Star: StarIcon, Users: UsersIcon };
  const Icon = icons[name] || Star;
  return <Icon size={22} style={{ color: 'var(--color-accent)' }} />;
}
function CalendarCheckIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14l.5.5L16 11"/></svg>; }
function GlobeIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function TrendingUpIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function ZapIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function StarIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function UsersIcon(props) { return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }

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
      <SEOHead title="Bookando – Deine Buchungs- & Vertriebsplattform" description="Bookando.de vereint Terminbuchung, Affiliate-Marketing, Wallet und Marketplace in einer Plattform für Dienstleister." />
      <PublicNav />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-primary-light) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, white, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 ${stagger(heroVis, 0)}`} style={staggerDelay(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                style={{ borderColor: 'rgba(196,155,62,0.2)', background: 'rgba(196,155,62,0.08)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
                <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                  {t('hero.badge_made_in')}
                </span>
              </div>
              <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold text-white leading-[0.95] tracking-[-0.035em] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {t('hero.title_line1')}<br />
                <span style={{ color: 'var(--color-accent)' }}>{t('hero.title_line2')}</span>
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/50 leading-[1.7] max-w-[520px] mb-10">{t('hero.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register"
                  className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(212,175,55,0.3)' }}>
                  {t('hero.cta_primary')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features"
                  className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white">
                  {t('hero.cta_secondary')}
                </Link>
              </div>
            </div>
            <div className={`hidden lg:flex lg:col-span-5 items-center justify-center ${stagger(heroVis, 1)}`} style={staggerDelay(1)}>
              <div className="w-[320px] h-[320px] rounded-[24px] flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-[16px] flex items-center justify-center"
                    style={{ background: 'rgba(196,155,62,0.15)' }}>
                    <Star size={32} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <p className="text-white/30 text-sm">Deine Grafik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-[80px] md:py-[100px] lg:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('home.section_platform')}
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('home.section_feature_title')}
            </h2>
            <p className="text-base text-[var(--color-text-secondary)] mt-4 leading-relaxed">
              {t('home.section_feature_sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map((section, idx) => (
              <div key={idx}
                className={`p-8 border rounded-[12px] transition-all duration-300 hover:translate-y-[-2px] ${stagger(featuresVis, idx)}`}
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)', ...staggerDelay(idx) }}>
                <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-5"
                  style={{ background: 'var(--color-accent-muted)' }}>
                  <FeatureIcon name={section.icon} />
                </div>
                <h3 className="text-[18px] font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {section.title}
                </h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-[64px] md:py-[80px] lg:py-[96px]"
        style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, idx) => (
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

      {/* CTA */}
      <section ref={ctaRef} className="py-[64px] md:py-[80px] lg:py-[96px]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[12px]"
            style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className={`lg:col-span-7 p-8 sm:p-12 lg:p-16 xl:p-20 ${stagger(ctaVis, 0)}`}>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('home.section_cta_title')}<br />
                  <span style={{ color: 'var(--color-accent)' }}>{t('home.cta_title_accent')}</span>
                </h2>
                <p className="text-[15px] text-white/40 leading-[1.7] max-w-[440px] mb-10">{t('home.cta_text')}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth/register"
                    className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[var(--color-primary-dark)] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(212,175,55,0.3)' }}>
                    {t('hero.cta_primary')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact"
                    className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/80 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white">
                    {t('home.cta_btn2')}
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
