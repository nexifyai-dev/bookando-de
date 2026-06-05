import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import {
  ArrowRight, Store, CalendarCheck, BarChart3, Wallet,
  Palette, Globe, CheckCircle, Star, TrendingUp,
  Shield, Users, Layers, MapPin
} from 'lucide-react';

/* ───────────────────────────────────────────────
   HOOKS
   ─────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
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

const stagger = (visible, idx, delay = 120) =>
  visible
    ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
    : 'translate-y-6 opacity-0 transition-all duration-700 ease-out';

const staggerDelay = (idx, delay = 120) => ({ transitionDelay: `${idx * delay}ms` });

export default function HomePage() {
  const { t } = useTranslation();

  const [heroRef, heroVis] = useInView(0.1);
  const [featuresRef, featuresVis] = useInView(0.1);
  const [statsRef, statsVis] = useInView(0.2);
  const [ctaRef, ctaVis] = useInView(0.1);

  const features = [
    { icon: Store, title: 'Multi-Vendor Marketplace', desc: 'Öffentliches Dienstleister-Verzeichnis mit Suchfunktion, Kategorien und Bewertungen. Kunden finden genau den passenden Anbieter.' },
    { icon: CalendarCheck, title: 'Smart Booking', desc: 'Professionelle Terminbuchung mit Echtzeit-Kalender, Mitarbeiter- und Ressourcenverwaltung, Wiederholungsterminen und Online-Meetings.' },
    { icon: TrendingUp, title: 'Affiliate-Tracking', desc: 'Vollständiges Affiliate-System mit Trackinglinks, Provisionszuordnung und automatischer Auszahlung – fair und transparent.' },
    { icon: Wallet, title: 'Wallet & Ledger', desc: 'Sicheres Wallet-System mit unveränderbaren Ledger-Einträgen, automatischen Gutschriften und Auszahlungslogik.' },
    { icon: Palette, title: 'WhiteLabel & Branding', desc: 'Eigene Domain, eigenes Branding, eigene Farben und Logos. Agenturen betreiben ihre eigene Plattform auf Bookando.' },
    { icon: Globe, title: 'Franchise & Multi-Location', desc: 'Hierarchische Strukturen für Franchise-Systeme. Zentrale Verwaltung mit dezentralen Standorten und konsolidierten Reports.' },
  ];

  return (
    <div>
      <SEOHead
        title="Bookando – Deine Buchungs- & Vertriebsplattform"
        description="Bookando.de vereint Terminbuchung, Affiliate-Marketing, Wallet und WhiteLabel in einer Plattform. Die modulare SaaS-Lösung für Dienstleister aus Aachen."
      />
      <PublicNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A2036 0%, #1A4570 35%, #2A6A9E 100%)' }}
        data-testid="hero-section">

        {/* Dezenter Noise-Overlay (KEINE "+" Zeichen!) */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />

        {/* Akzent-Kreis (dezent) */}
        <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, rgba(196,155,62,0.6), transparent)', filter: 'blur(80px)' }} />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Linke Spalte – Text */}
            <div className={`lg:col-span-7 ${stagger(heroVis, 0)}`} style={staggerDelay(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#C49B3E' }} />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
                  Made in Aachen
                </span>
              </div>

              <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1] tracking-[-0.035em] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="block">Deine Buchungs- &</span>
                <span style={{ color: '#C49B3E' }}>Vertriebsplattform</span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-white/50 leading-relaxed max-w-[520px] mb-10">
                Bookando vereint Terminbuchung, Affiliate-Marketing, Wallet, Marketplace und WhiteLabel in einem System.
                Die Plattform für Dienstleister, die skalieren wollen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register"
                  className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[#0A2036] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: '#C49B3E', boxShadow: '0 4px 24px rgba(196,155,62,0.3)' }}
                  data-testid="hero-primary-cta">
                  Kostenlos starten <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/70 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white"
                  data-testid="hero-secondary-cta">
                  Beratungstermin
                </Link>
              </div>

              {/* Trust-Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-white/30" />
                  <span className="text-[12px] text-white/40">DSGVO-konform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-white/30" />
                  <span className="text-[12px] text-white/40">DE / EN</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-white/30" />
                  <span className="text-[12px] text-white/40">Multi-Vendor</span>
                </div>
              </div>
            </div>

            {/* Rechte Spalte – Aachener Dom Visual */}
            <div className={`hidden lg:flex lg:col-span-5 items-center justify-center ${stagger(heroVis, 1)}`} style={staggerDelay(1)}>
              <div className="relative w-full max-w-[400px]">
                {/* Cathedral Image Container */}
                <div className="relative rounded-[16px] overflow-hidden"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544776193-352d25ca8280?w=600&q=80&auto=format"
                    alt="Aachener Dom – UNESCO Welterbe, Wahrzeichen der Stadt Aachen"
                    className="w-full h-auto block"
                    style={{ aspectRatio: '4/5', objectFit: 'cover' }}
                    loading="eager"
                  />
                  {/* Overlay mit Stadtnamed */}
                  <div className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: 'linear-gradient(transparent, rgba(10,32,54,0.9))' }}>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Aachen</p>
                    <p className="text-white/50 text-[11px]">UNESCO Welterbe – Aachener Dom</p>
                  </div>
                </div>
                {/* Dekorativer Rahmen */}
                <div className="absolute -top-3 -right-3 w-full h-full rounded-[16px] -z-10"
                  style={{ border: '1px solid rgba(196,155,62,0.2)', transform: 'translate(8px, 8px)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════ */}
      <section ref={featuresRef} className="py-[80px] md:py-[100px] lg:py-[120px]" data-testid="features-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#C49B3E' }}>Plattform-Features</p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              Alles, was du brauchst
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-4 leading-relaxed">
              Von der Terminbuchung bis zum Affiliate-Marketing – Bookando bildet dein gesamtes Geschäft ab.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx}
                  className={`p-8 border rounded-[12px] transition-all duration-300 hover:translate-y-[-2px] ${stagger(featuresVis, idx)}`}
                  style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)', ...staggerDelay(idx) }}
                  data-testid={`feature-card-${idx}`}>
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-5"
                    style={{ background: 'rgba(196,155,62,0.12)' }}>
                    <Icon size={22} style={{ color: '#C49B3E' }} />
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

      {/* ═══════════════════════════════════════════
          STATS
          ═══════════════════════════════════════════ */}
      <section ref={statsRef} className="py-[64px] md:py-[80px] lg:py-[96px]"
        style={{ background: 'var(--color-primary)' }} data-testid="stats-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 500, suffix: '+', label: 'Aktive Vendors' },
              { value: 50, suffix: '.000+', label: 'Buchungen' },
              { value: 98, suffix: '%', label: 'Zufriedenheit' },
              { value: 24, suffix: '/7', label: 'Support' },
            ].map((stat, idx) => (
              <div key={idx} className={`text-center ${stagger(statsVis, idx)}`} style={staggerDelay(idx)}>
                <p className="text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-heading)', color: '#C49B3E' }}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[13px] font-medium text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-[80px] md:py-[100px]" data-testid="howitworks-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#C49B3E' }}>So einfach geht's</p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              In 3 Schritten starten
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: Users, title: 'Registrieren', desc: 'Erstelle dein Konto als Dienstleister oder Affiliate in weniger als 2 Minuten. Keine Kreditkarte nötig.' },
              { step: '02', icon: Layers, title: 'Anbinden', desc: 'Richte deine Dienstleistungen, Kalender, Mitarbeiter und Zahlungsanbieter ein. Alles an einem Ort.' },
              { step: '03', icon: TrendingUp, title: 'Wachsen', desc: 'Schalte Affiliate-Marketing frei, gewinne Kunden über den Marketplace und skaliere dein Geschäft.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center p-8">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(196,155,62,0.1)', border: '1px solid rgba(196,155,62,0.2)' }}>
                    <span className="text-[18px] font-bold" style={{ color: '#C49B3E', fontFamily: 'var(--font-heading)' }}>{item.step}</span>
                  </div>
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(26,69,112,0.06)' }}>
                    <Icon size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-[18px] font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-[260px] mx-auto">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-[64px] md:py-[80px] lg:py-[96px]" data-testid="cta-section">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[12px]"
            style={{ background: 'linear-gradient(160deg, #0A2036 0%, #1A4570 50%, #2A6A9E 100%)' }}>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px',
              }} />

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 xl:p-20 text-center">
              <div className={`max-w-[600px] mx-auto ${stagger(ctaVis, 0)}`}>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  Bereit für den nächsten Schritt?
                </h2>
                <p className="text-[15px] text-white/40 leading-relaxed mb-10 max-w-[440px] mx-auto">
                  Starte jetzt durch und überzeuge dich selbst von den Möglichkeiten der Plattform. 30 Tage kostenlos testen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth/register"
                    className="inline-flex items-center justify-center gap-2.5 h-[56px] px-10 text-[15px] font-bold tracking-wide text-[#0A2036] rounded-full group transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: '#C49B3E', boxShadow: '0 4px 24px rgba(196,155,62,0.3)' }}
                    data-testid="cta-primary">
                    Kostenlos starten <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact"
                    className="inline-flex items-center justify-center gap-2 h-[56px] px-8 text-[15px] font-semibold text-white/60 border-2 border-white/15 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white"
                    data-testid="cta-secondary">
                    Beratung vereinbaren
                  </Link>
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
