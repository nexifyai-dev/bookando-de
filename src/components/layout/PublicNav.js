import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Menu, X } from 'lucide-react';

/**
 * PublicNav — Generalisierte öffentliche Navigationsleiste
 *
 * Props:
 *   navItems        – Array von { href, label } für die Hauptnavigation
 *   logoUrl         – URL zum Logo-Bild (optional)
 *   logoText        – Text als Fallback (wenn kein logoUrl)
 *   logoHref        – Link-Ziel fürs Logo (default '/')
 *   primaryCta      – { label, href } für den primären CTA-Button (optional)
 *   secondaryCta    – { label, href } für den sekundären CTA (optional, z.B. Login)
 *   hideLanguageSwitch – Booleon, ob Language-Switch ausgeblendet wird
 *   brandColor      – CSS-Farbe für Akzente (optional, überschreibt --color-primary)
 *   dataTestId      – Test-ID Prefix
 */
export default function PublicNav({
  navItems = [
    { href: '/', label: 'Startseite', labelKey: 'nav.home' },
    { href: '/marketplace', label: 'Marktplatz', labelKey: 'nav.marketplace' },
    { href: '/features', label: 'Features', labelKey: 'nav.features' },
    { href: '/contact', label: 'Kontakt', labelKey: 'nav.contact' },
  ],
  logoUrl,
  logoText = 'Bookando',
  logoHref = '/',
  primaryCta = { label: 'Registrieren', labelKey: 'nav.register', href: '/auth/register' },
  secondaryCta = { label: 'Anmelden', labelKey: 'nav.login', href: '/auth/login' },
  hideLanguageSwitch = false,
  dataTestId = 'public-nav',
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auflösen von labelKey oder label
  const resolvedLinks = navItems.map(item => ({
    href: item.href,
    label: item.label || (item.labelKey ? t(item.labelKey) : ''),
  }));

  const isHome = location.pathname === '/';
  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-md border-b border-[var(--color-primary)]/8'
    : isHome ? 'bg-transparent' : 'bg-white border-b border-[var(--color-primary)]/8';
  const textColor = scrolled || !isHome ? 'text-[var(--color-primary-dark)]' : 'text-white';
  const textMuted = scrolled || !isHome ? 'text-[var(--color-text-secondary)]' : 'text-white/60';

  const LANGUAGES = [
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`} data-testid={dataTestId}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 md:h-[72px] lg:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to={logoHref} className="flex items-center gap-4 shrink-0" data-testid={`${dataTestId}-logo`}>
          {logoUrl ? (
            <img src={logoUrl} alt={logoText}
              className="h-9 sm:h-10 w-auto object-contain"
              style={{ filter: scrolled || !isHome ? 'none' : 'brightness(0) invert(1)' }} />
          ) : (
            <span className={`text-lg md:text-xl font-bold font-[var(--font-heading)] tracking-tight ${textColor}`}>
              {logoText}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-center" data-testid={`${dataTestId}-desktop-nav`}>
          {resolvedLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}
                className={`px-3.5 py-2 text-[13px] font-medium rounded-[3px] transition-colors ${
                  isActive
                    ? `${textColor} font-semibold`
                    : `${textMuted} hover:${textColor}`
                }`}
                data-testid={`${dataTestId}-link-${link.href.replace(/\//g, '') || 'home'}`}>
                {link.label}
                {isActive && <div className="h-[2px] mt-0.5 rounded-full" style={{ background: 'var(--color-accent)' }} />}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Language Switch */}
          {!hideLanguageSwitch && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-[3px]" style={{ border: scrolled || !isHome ? '1px solid rgba(17,54,85,0.1)' : '1px solid rgba(255,255,255,0.15)' }} data-testid={`${dataTestId}-language-switch`}>
              {LANGUAGES.map((lang) => (
                <button key={lang.code} type="button" onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-all ${
                    i18n.language === lang.code
                      ? 'bg-[var(--color-primary)] text-white'
                      : `${textMuted} hover:${textColor}`
                  }`}
                  data-testid={`${dataTestId}-lang-${lang.code}`}>
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          {!hideLanguageSwitch && (
            <div className="w-[1px] h-5" style={{ background: scrolled || !isHome ? 'rgba(17,54,85,0.1)' : 'rgba(255,255,255,0.15)' }} />
          )}

          {/* Secondary CTA (login) */}
          {secondaryCta && (
            <Link to={secondaryCta.href} data-testid={`${dataTestId}-secondary-cta`}
              className={`text-[13px] font-semibold px-4 py-2 rounded-[3px] transition-colors ${textMuted} hover:${textColor}`}>
              {secondaryCta.label || (secondaryCta.labelKey ? t(secondaryCta.labelKey) : 'Anmelden')}
            </Link>
          )}

          {/* Primary CTA (register/apply) */}
          {primaryCta && (
            <Link to={primaryCta.href} data-testid={`${dataTestId}-primary-cta`}
              className="inline-flex items-center h-10 px-5 text-[13px] font-bold text-[var(--color-primary-dark)] rounded-[3px] transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--color-accent)', boxShadow: '0 2px 12px rgba(212,175,55,0.2)' }}>
              {primaryCta.label || (primaryCta.labelKey ? t(primaryCta.labelKey) : 'Loslegen')}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!hideLanguageSwitch && (
            <button type="button" onClick={() => i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-[3px] border ${
                scrolled || !isHome ? 'border-[var(--color-primary)]/10 text-[var(--color-primary-dark)]' : 'border-white/15 text-white'
              }`}
              data-testid={`${dataTestId}-mobile-language-toggle`}>
              {i18n.language === 'de' ? 'EN' : 'DE'}
            </button>
          )}
          <button onClick={() => setOpen(!open)}
            className={`w-9 h-9 flex items-center justify-center rounded-[3px] border ${
              scrolled || !isHome ? 'border-[var(--color-primary)]/10' : 'border-white/15'
            }`}
            data-testid={`${dataTestId}-mobile-toggle`}>
            {open ? <X size={18} className={textColor} /> : <Menu size={18} className={textColor} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="bg-white border-t border-[var(--color-primary)]/8 px-6 py-4 md:hidden" data-testid={`${dataTestId}-mobile-nav`}>
          <div className="space-y-1">
            {resolvedLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-[14px] font-medium rounded-[3px] transition-colors ${
                  location.pathname === link.href
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)]'
                }`}
                data-testid={`${dataTestId}-mobile-link-${link.href.replace(/\//g, '') || 'home'}`}>
                <span>{link.label}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
            {secondaryCta && (
              <Link to={secondaryCta.href} onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] rounded-[3px]"
                data-testid={`${dataTestId}-mobile-secondary`}>
                <span>{secondaryCta.label || (secondaryCta.labelKey ? t(secondaryCta.labelKey) : 'Anmelden')}</span>
                <ChevronRight size={14} />
              </Link>
            )}
            {primaryCta && (
              <Link to={primaryCta.href} onClick={() => setOpen(false)}
                className="mt-3 flex w-full items-center justify-center h-12 text-[14px] font-bold text-[var(--color-primary-dark)] rounded-[3px]"
                style={{ background: 'var(--color-accent)' }}
                data-testid={`${dataTestId}-mobile-primary`}>
                {primaryCta.label || (primaryCta.labelKey ? t(primaryCta.labelKey) : 'Loslegen')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
