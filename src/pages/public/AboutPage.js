import React from 'react';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowRight, MapPin, Shield, Users, Target, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    { icon: Users, title: t('about.val_collab', 'Gemeinsam wachsen'), desc: t('about.val_collab_desc', 'Wir glauben an faire Partnerschaften zwischen Dienstleistern, Affiliates und Kunden – transparent, nachvollziehbar und gewinnbringend für alle.') },
    { icon: Shield, title: t('about.val_trust', 'Vertrauen als Basis'), desc: t('about.val_trust_desc', 'Sichere Buchungen, geschützte Daten und klare Provisionsstrukturen schaffen Vertrauen – die Grundlage jeder erfolgreichen Zusammenarbeit.') },
    { icon: Target, title: t('about.val_local', 'Lokal verwurzelt'), desc: t('about.val_local_desc', 'Gegründet in Aachen, denken wir lokal und handeln digital. Unsere Nähe zu Dienstleistern macht uns stark.') },
    { icon: Award, title: t('about.val_quality', 'Qualität vor Quantität'), desc: t('about.val_quality_desc', 'Lieber eine Plattform die perfekt funktioniert als tausend Funktionen die niemand braucht. Unser Fokus liegt auf dem, was Dienstleister wirklich voranbringt.') },
  ];

  return (
    <div>
      <SEOHead title="Bookando – Über uns" description="Bookando mit Sitz in Aachen – die Affiliate-Booking Plattform für Dienstleister aus der Beauty- und Ästhetikbranche." />
      <PublicNav logoUrl="/logo192.png" />

      <main className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--color-shell-bg)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

          {/* Mission Header */}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('about.tag', 'Über Bookando')}
            </p>
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('about.title', 'Terminbuchung trifft Affiliate-Marketing')}
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {t('about.mission', 'Bookando wurde entwickelt, um Dienstleistern ein echtes digitales Zuhause zu geben – mit smarter Terminbuchung, transparentem Affiliate-Marketing und allem, was für nachhaltiges Wachstum nötig ist.')}
            </p>
          </div>

          {/* Standort Aachen */}
          <div className="rounded-xl overflow-hidden mb-16"
            style={{ background: 'linear-gradient(160deg, var(--color-primary-dark), var(--color-primary) 50%, var(--color-primary-light))' }}>
            <div className="p-10 lg:p-14 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(196,155,62,0.2)' }}>
                <MapPin size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('about.aachen_title', 'Made in Aachen')}
              </h2>
              <p className="text-sm leading-relaxed max-w-[600px] mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {t('about.aachen_desc', 'Bookando hat seinen Sitz in Aachen – mitten in der Region, die für ihre Wirtschaftskraft und Innovationsfreude bekannt ist. Von hier aus entwickeln wir eine Plattform, die Dienstleister in ganz Deutschland digital skalierbar macht.')}
              </p>
            </div>
          </div>

          {/* Unsere Werte */}
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('about.values_tag', 'Unsere Werte')}
            </p>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('about.values_title', 'Was uns antreibt')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-accent-muted)' }}>
                    <Icon size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{v.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center rounded-xl p-10 lg:p-14"
            style={{ background: 'var(--color-accent-subtle)', border: '1px solid rgba(196,155,62,0.2)' }}>
            <Heart size={24} style={{ color: 'var(--color-accent)' }} className="mx-auto mb-3" />
            <h2 className="text-xl lg:text-2xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('about.cta_title', 'Bereit, gemeinsam zu wachsen?')}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {t('about.cta_desc', 'Erstelle dein Bookando-Konto und entdecke, wie Terminbuchung und Affiliate-Marketing zusammengehören.')}
            </p>
            <Link to="/auth/register"
              className="inline-flex items-center justify-center gap-2 h-[48px] px-8 text-sm font-bold rounded-full transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--color-accent)', color: 'var(--color-primary-dark)' }}>
              {t('about.cta_btn', 'Kostenlos registrieren')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
