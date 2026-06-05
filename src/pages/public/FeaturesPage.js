import React, { useRef, useState, useEffect } from 'react';
import { useInView, stagger, staggerDelay } from '../../components/shared/useInView';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import {
  ArrowRight, Store, CalendarCheck, BarChart3, Wallet,
  Palette, Globe, CheckCircle, Star, TrendingUp,
  Shield, Users, Layers, MapPin, Zap, Headphones,
  Smartphone, RefreshCw, Gift, Bell, Sliders,
  MousePointerClick, Link2, CreditCard, Lock, Share2
} from 'lucide-react';


const featureCategories = [
  {
    title: 'Buchungs-System',
    subtitle: 'Professionelle Terminlogik für jeden Dienstleister',
    features: [
      { icon: CalendarCheck, title: 'Echtzeit-Kalender', desc: 'Live-Verfügbarkeit mit automatischer Blockierung gebuchter Slots. Synchronisierbar mit Google Calendar, Outlook & mehr.' },
      { icon: Zap, title: 'Intelligente Zeitslots', desc: 'Dynamische Slot-Generierung basierend auf Mitarbeiter-Verfügbarkeit, Öffnungszeiten, Pufferzeiten und Vorlaufzeiten.' },
      { icon: RefreshCw, title: 'Wiederholungstermine', desc: 'Serienbuchungen für wöchentliche, monatliche oder individuelle Rhythmen – ideal für Abos und Pakete.' },
      { icon: Users, title: 'Mitarbeiter-Verwaltung', desc: 'Beliebig viele Mitarbeiter mit eigenen Kalendern, Diensten, Qualifikationen und individuellen Arbeitszeiten.' },
      { icon: MapPin, title: 'Multi-Location', desc: 'Mehrere Standorte mit separaten Kalendern, Mitarbeitern und Services – alles in einem Konto.' },
      { icon: Smartphone, title: 'Mobile Optimierung', desc: 'Vollständig responsive für Smartphone & Tablet. Buchungen in unter 30 Sekunden.' },
    ],
  },
  {
    title: 'Marketplace',
    subtitle: 'Sichtbarkeit & Reichweite für dein Business',
    features: [
      { icon: Store, title: 'Öffentliches Verzeichnis', desc: 'Dienstleister-Suche mit Filter nach Kategorie, Standort, Bewertung und Preis – optimiert für lokale Sichtbarkeit.' },
      { icon: Star, title: 'Bewertungen & Reviews', desc: 'Transparentes Bewertungssystem mit Sternen, Text-Reviews und automatisierte Bewertungserinnerungen nach Buchung.' },
      { icon: Share2, title: 'Vendor-Unterseiten', desc: 'Jeder Dienstleister erhält eine eigene professionelle Seite mit Branding, Services, Kalender und Bewertungen.' },
      { icon: Globe, title: 'SEO-optimiert', desc: 'Alle Vendor-Seiten und Services sind für Suchmaschinen optimiert. Mehr Reichweite durch Bookando-Marktplatz.' },
    ],
  },
  {
    title: 'Affiliate-Marketing',
    subtitle: 'Der Kern von Bookando – Provisionsbasiertes Wachstum',
    features: [
      { icon: Link2, title: 'Trackinglinks', desc: 'Individuelle Affiliate-Links für jeden Marketer, Influencer oder Partner. Automatische Erkennung und Zuordnung.' },
      { icon: BarChart3, title: 'Echtzeit-Statistiken', desc: 'Klicks, Buchungen, Umsatz und Provisionen in Echtzeit. Vollständig transparent für Vendor und Affiliate.' },
      { icon: Gift, title: 'Provisionen automatisieren', desc: 'Fixe oder prozentuale Provisionen pro Service, Kategorie oder Affiliate-Level. Automatische Berechnung bei jeder Buchung.' },
      { icon: Wallet, title: 'Wallet-Auszahlungen', desc: 'Automatische Gutschrift im Affiliate-Wallet. Auszahlungen per Banküberweisung oder auf Wunsch automatisiert.' },
      { icon: Shield, title: 'Betrugssicheres Tracking', desc: 'Mehrstufiges Tracking mit Cookie-Persistenz, IP-Logging und manipulationssicheren Buchungsreferenzen.' },
      { icon: TrendingUp, title: 'Affiliate-Levels', desc: 'Verschiedene Provisionstufen für Top-Affiliates. Steigende Provisionen bei steigendem Umsatzvolumen.' },
    ],
  },
  {
    title: 'Zahlungen & Wallet',
    subtitle: 'Sicher, flexibel und transparent',
    features: [
      { icon: CreditCard, title: 'Zahlungsanbieter', desc: 'Stripe, PayPal, Mollie & mehr – Dienstleister verbinden ihren eigenen Anbieter. Keine versteckten Kosten.' },
      { icon: Lock, title: 'Split-Payment', desc: 'Automatische Aufteilung der Zahlung zwischen Vendor, Plattform und Affiliate – in Echtzeit und nachvollziehbar.' },
      { icon: Layers, title: 'Unveränderbares Ledger', desc: 'Jede Transaktion wird mit Prüfsumme gespeichert. Vollständig auditierbar für Steuer und Buchhaltung.' },
      { icon: Bell, title: 'Benachrichtigungen', desc: 'Automatische E-Mail- und In-App-Benachrichtigungen bei Zahlungseingang, Auszahlungen und offenen Posten.' },
    ],
  },
  {
    title: 'WhiteLabel & Franchise',
    subtitle: 'Deine eigene Plattform auf Bookando-Infrastruktur',
    features: [
      { icon: Palette, title: 'Eigenes Branding', desc: 'Logo, Farben, Domain, E-Mails – alles auf deine Marke angepasst. Keine Bookando-Erwähnung nach außen.' },
      { icon: Globe, title: 'Eigene Domain', desc: 'SSL-verschlüsselt und mit eigenem DNS. Deine Kunden sehen nur deine Marke.' },
      { icon: Layers, title: 'Franchise-Strukturen', desc: 'Zentrale Verwaltung mit dezentralen Standorten. Eigene Preise, eigenes Branding für jeden Franchise-Partner.' },
      { icon: Shield, title: 'Multi-Tenant-Isolation', desc: 'Strikte Trennung aller Kunden- und Vendor-Daten pro WhiteLabel-Instanz. DSGVO-konform.' },
    ],
  },
  {
    title: 'CRM & Marketing',
    subtitle: 'Kunden binden und Auslastung optimieren',
    features: [
      { icon: Users, title: 'Kundenprofile', desc: 'Vollständige Kundenhistorie mit Buchungen, Zahlungen, Präferenzen und Notizen. Wiederkehrer erkennen.' },
      { icon: Bell, title: 'Automatische Erinnerungen', desc: 'E-Mail- & SMS-Reminder vor Terminen. Reduziert No-Shows um bis zu 80%.' },
      { icon: Gift, title: 'Coupons & Aktionen', desc: 'Rabattcodes, Prozent-Aktionen und Paket-Angebote ganz einfach erstellen und bewerben.' },
      { icon: TrendingUp, title: 'Auslastungs-Analyse', desc: 'Dashboard mit Kennzahlen zu Auslastung, Umsatz, Kundenentwicklung und beliebtesten Services.' },
    ],
  },
];

function FeatureCategory({ category, idx }) {
  const [ref, vis] = useInView(0.05);
  const Icon = category.icon;

  return (
    <section ref={ref} className={`py-[60px] md:py-[80px]`} style={idx % 2 === 1 ? { background: 'var(--color-primary-muted)' } : {}} data-testid={`features-category-${idx}`}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-[500px] mx-auto mb-12">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {category.title}
          </h2>
          <p className="text-[14px] text-[var(--color-text-secondary)]">{category.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.features.map((feature, ftIdx) => {
            const FeatIcon = feature.icon;
            return (
              <div key={ftIdx}
                className={`p-6 border rounded-[12px] transition-all duration-300 hover:translate-y-[-2px] ${stagger(vis, ftIdx)}`}
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)', ...staggerDelay(ftIdx) }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(196,155,62,0.12)' }}>
                    <FeatIcon size={18} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold tracking-tight mb-1.5"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.6]">{feature.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  const { t } = useTranslation();
  const [heroRef, heroVis] = useInView(0.2);

  return (
    <div>
      <SEOHead
        title="Features – Bookando"
        description="Entdecke alle Funktionen von Bookando: Terminbuchung, Marketplace, Affiliate-Marketing, Wallet, WhiteLabel, CRM und mehr."
      />
      <PublicNav logoUrl="/logo192.png" />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-[120px] pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-primary-light) 100%)' }}
        data-testid="features-hero">
        <div className={`relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center ${stagger(heroVis, 0)}`}>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--color-accent)' }}>Plattform-Features</p>
          <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Alles, was du brauchst
          </h1>
          <p className="text-[16px] sm:text-[18px] text-white/50 max-w-[560px] mx-auto leading-relaxed mb-10">
            Von der Terminbuchung bis zum Affiliate-Marketing – über 40 Funktionen machen Bookando zur umfassendsten Plattform für Dienstleister.
          </p>
          <Link to="/auth/register"
            className="inline-flex items-center gap-2.5 h-[52px] px-8 text-[14px] font-bold tracking-wide text-[#0A2036] rounded-full transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(196,155,62,0.3)' }}>
            Kostenlos testen <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((category, catIdx) => (
        <FeatureCategory key={catIdx} category={category} idx={catIdx} />
      ))}

      {/* CTA */}
      <section className="py-[64px]" data-testid="features-cta">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[12px] text-center p-10 sm:p-14 lg:p-16"
            style={{ background: 'linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Über 40 Features – und täglich mehr
            </h2>
            <p className="text-[15px] text-white/40 leading-relaxed mb-8 max-w-[440px] mx-auto">
              Starte jetzt und überzeuge dich selbst. 30 Tage kostenlos, kein Risiko.
            </p>
            <Link to="/auth/register"
              className="inline-flex items-center gap-2.5 h-[52px] px-8 text-[14px] font-bold tracking-wide text-[#0A2036] rounded-full transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--color-accent)', boxShadow: '0 4px 24px rgba(196,155,62,0.3)' }}>
              Kostenlos starten <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
