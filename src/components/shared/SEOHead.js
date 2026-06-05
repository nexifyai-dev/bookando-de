import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * SEOHead — Einheitliche Meta-Tags für alle Seiten
 * Sprache folgt DYNNAMISCH der i18n-Einstellung (kein hardcoded "de"!)
 *
 * Props:
 *   title       – Seitentitel (wird an "Bookando – " rangehängt)
 *   description – Meta-Beschreibung
 *   canonical   – Kanonische URL (optional)
 *   noindex     – Seite von Indexierung ausschließen (optional)
 */
export default function SEOHead({ title, description, canonical, noindex }) {
  const { i18n } = useTranslation();
  const siteName = 'Bookando';
  const fullTitle = title ? `${title} – ${siteName}` : siteName;
  const defaultDesc = 'Bookando.de – Die modulare SaaS-, Marketplace- & WhiteLabel-Plattform für Dienstleister. Terminbuchung, Affiliate-Marketing, Wallet & mehr.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1A4570" />
      <html lang={i18n.language || 'de'} />
    </Helmet>
  );
}
