import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, ArrowRight, Shield, Briefcase } from 'lucide-react';

/**
 * PublicFooter — Generalisierter Footer für öffentliche Seiten
 *
 * Props:
 *   brandName      – Name des Projekts/Unternehmens
 *   brandIcon      – Icon-Komponente (optional, z.B. GraduationCap)
 *   description    – Beschreibungstext (String oder i18n Key)
 *   columns        – Array von Footer-Spalten:
 *                    [{ title, links: [{ label, href, onClick? }] }]
 *   contactInfo    – { address, phone, email } (optional)
 *   socialLinks    – [{ icon: Komponente, href, label }] (optional)
 *   cta            – { label, href } für den CTA-Banner (optional)
 *   legalLinks     – [{ label, href }] rechts unten (optional)
 *   copyright      – Copyright-Text (optional)
 *   dataTestId     – Test-ID Prefix
 */
export default function PublicFooter({
  brandName = 'Bookando',
  brandIcon: BrandIcon = Briefcase,
  description,
  copyrightText,
  columns = [
    {
      titleKey: 'footer.col_product',
      links: [
        { labelKey: 'footer.link_features', href: '/features' },
        { labelKey: 'footer.link_pricing', href: '/pricing' },
      ],
    },
    {
      titleKey: 'footer.col_company',
      links: [
        { labelKey: 'footer.link_about', href: '/about' },
        { labelKey: 'footer.link_contact', href: '/contact' },
      ],
    },
    {
      titleKey: 'footer.col_legal',
      links: [
        { labelKey: 'footer.link_privacy', href: '/privacy' },
        { labelKey: 'footer.link_imprint', href: '/legal' },
        { labelKey: 'footer.link_terms', href: '/terms' },
        { label: 'Cookie-Einstellungen', onClick: 'openCookieSettings', icon: Shield },
      ],
    },
  ],
  contactInfo = {
    address: 'Adalbertsteinweg 1, 52070 Aachen',
    phone: '+49 241 123 456 789',
    email: 'hallo@bookando.de',
  },
  socialLinks,
  cta = { labelKey: 'hero.cta_primary', href: '/auth/register' },
  legalLinks,
  dataTestId = 'public-footer',
}) {
  const { t } = useTranslation();

  const handleCookieSettings = () => {
    try {
      // Versucht das CookieBanner via globalem Event zu öffnen
      window.dispatchEvent(new CustomEvent('w2g-open-cookie-settings'));
    } catch {}
  };

  return (
    <footer className="w2g-footer" data-testid={dataTestId}>
      {/* Haupt-Grid */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">

          {/* Brand-Spalte */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              {BrandIcon && (
                <div className="w-9 h-9 rounded-[4px] flex items-center justify-center"
                  style={{ background: 'rgba(196,155,62,0.15)' }}>
                  <BrandIcon size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
              )}
              <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {brandName}
              </span>
            </div>
            <p className="text-[14px] text-white/40 leading-[1.7] max-w-[360px] mb-6">
              {description}
            </p>
            {/* Social Icons */}
            {socialLinks && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[4px] flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    data-testid={`${dataTestId}-social-${social.label?.toLowerCase?.() || idx}`}>
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamische Spalten */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="w2g-footer-heading">
                {col.title || (col.titleKey ? t(col.titleKey) : '')}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => {
                  if (link.onClick === 'openCookieSettings') {
                    return (
                      <li key={lIdx}>
                        <button onClick={handleCookieSettings}
                          className="text-[13px] text-white/50 hover:text-white transition-colors flex items-center gap-2.5"
                          data-testid={`${dataTestId}-cookie-settings`}>
                          {link.icon && <link.icon size={11} className="opacity-60" />}
                          {link.label || (link.labelKey ? t(link.labelKey) : '')}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={lIdx}>
                      <Link to={link.href}
                        className="text-[13px] text-white/50 hover:text-white transition-colors"
                        data-testid={`${dataTestId}-link-${(link.label || link.labelKey || '').toLowerCase?.().replace(/[^a-z0-9]/g, '-')}`}>
                        {link.label || (link.labelKey ? t(link.labelKey) : '')}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Kontakt-Spalte */}
          {contactInfo && (
            <div>
              <h3 className="w2g-footer-heading">Kontakt</h3>
              <div className="space-y-3 text-[13px] text-white/50">
                {contactInfo.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={13} className="mt-0.5 shrink-0 opacity-60" />
                    <div>
                      {typeof contactInfo.address === 'string'
                        ? contactInfo.address.split(',').map((line, i) => <p key={i}>{line.trim()}</p>)
                        : <p>{contactInfo.address}</p>
                      }
                    </div>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="shrink-0 opacity-60" />
                    <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors">{contactInfo.phone}</a>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="shrink-0 opacity-60" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA-Banner */}
      {cta && (
        <div className="border-t border-white/8">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[14px] text-white/50">
              {t('home.cta_desc', 'Starte jetzt und überzeuge dich selbst.')}
            </p>
            <Link to={cta.href}
              className="inline-flex items-center gap-2 h-[44px] px-7 text-[13px] font-bold rounded-full shrink-0 transition-all hover:scale-[1.02] group bg-[var(--color-accent)] text-[var(--color-primary-dark)]"
              data-testid={`${dataTestId}-cta`}>
              {cta.label || (cta.labelKey ? t(cta.labelKey) : 'Loslegen')} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Copyright-Bereich */}
      <div className="border-t border-white/6">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
          <span>{copyrightText || t('footer.copyright')}</span>
          <div className="flex items-center gap-4">
            {legalLinks && legalLinks.map((link, idx) => (
              <Link key={idx} to={link.href} className="hover:text-white/60 transition-colors">
                {link.label || (link.labelKey ? t(link.labelKey) : '')}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
