import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, ArrowRight, Shield } from 'lucide-react';
import { cn } from '../../lib/utils-cn';

const LINK_COLS = [
  {
    titleKey: 'footer.col_product',
    links: [
      { labelKey: 'footer.link_features', href: '/features' },
      { labelKey: 'footer.link_pricing', href: '/pricing' },
      { labelKey: 'footer.link_marketplace', href: '/marketplace' },
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
      { key: 'cookies', labelKey: 'footer.link_cookies', icon: Shield, onClick: 'openCookieSettings' },
    ],
  },
];

export default function PublicFooter() {
  const { t } = useTranslation();

  const handleCookieSettings = () => {
    try { window.dispatchEvent(new CustomEvent('w2g-open-cookie-settings')); } catch {}
  };

  return (
    <footer className="relative" style={{ backgroundColor: "#2D3748" }} data-testid="public-footer">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] opacity-[0.04] rounded-full"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ── Brand column (span 4) ── */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group" data-testid="footer-brand-link">
              <img src="/images/brand-logo-on-dark-full.png" alt="Bookando"
                className="h-8 sm:h-9 w-auto object-contain"
                data-testid="footer-logo" />
            </Link>
            <p className="text-sm leading-[1.7] max-w-[340px] mb-6"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t('footer.description', 'Bookando – die Buchungs- & Sales-Plattform für Dienstleister. Terminbuchung, Marketplace und Affiliate-Marketing in einer Lösung.')}
            </p>
          </div>

          {/* ── Link columns (span 2 each = 6 total) ── */}
          {LINK_COLS.map((col) => (
            <div key={col.titleKey} className="lg:col-span-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-5"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                {t(col.titleKey)}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => {
                  if (link.onClick === 'openCookieSettings') {
                    return (
                      <li key={link.key || link.labelKey}>
                        <button onClick={handleCookieSettings}
                          className="text-[13px] flex items-center gap-2 transition-all duration-200 hover:translate-x-0.5"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                          data-testid="footer-cookie-settings">
                          {link.icon && <link.icon size={12} style={{ opacity: 0.5 }} />}
                          {t(link.labelKey)}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={link.href}>
                      <Link to={link.href}
                        className="text-[13px] transition-all duration-200 hover:translate-x-0.5 inline-block"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* ── Contact column (span 2) ── */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {t('footer.contact')}
            </h3>
            <div className="space-y-3.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 shrink-0" style={{ opacity: 0.5 }} />
                <span>Severinstr. 81<br />52080 Aachen</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="shrink-0" style={{ opacity: 0.5 }} />
                <a href="mailto:info@fixdigital.de"
                  className="hover:text-white transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  info@fixdigital.de
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t('footer.cta_text', 'Starte jetzt und bringe dein Business auf die nächste Stufe.')}
          </p>
          <Link to="/auth/register"
            className="inline-flex items-center gap-2 h-[44px] px-8 text-[13px] font-bold rounded-full shrink-0 transition-all duration-300 group"
            style={{
              backgroundColor: "#F59E0B",
              color: "#1A202C",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,166,4,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            data-testid="footer-cta">
            {t('footer.cta_label', 'Jetzt starten')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]"
          style={{ color: 'rgba(255,255,255,0.25)' }}>
          <span>{t('footer.copyright', '© 2026 Bookando. Alle Rechte vorbehalten.')}</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">{t('footer.link_privacy')}</Link>
            <Link to="/legal" className="hover:text-white/60 transition-colors">{t('footer.link_imprint')}</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">{t('footer.link_terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
