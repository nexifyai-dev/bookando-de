import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowLeft, Shield, FileText, Cookie, Scale } from 'lucide-react';

const TABS = [
  { key: 'privacy', icon: Shield },
  { key: 'imprint', icon: FileText },
  { key: 'terms', icon: Scale },
  { key: 'cookies', icon: Cookie },
];

/* ─── Deutsche Inhalte ─── */
const DE = {
  privacy: { title: 'Datenschutzerklärung', content: `
    <p><strong>Stand: Juni 2026</strong></p>
    <h2>1. Datenschutz auf einen Blick</h2>
    <h3>Allgemeine Hinweise</h3>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
    <h3>Wer ist verantwortlich?</h3>
    <p><strong>Kevin Gaus</strong> (FixDigital)<br/>E-Mail: info@fixdigital.de</p>
    <h3>Welche Rechte haben Sie?</h3>
    <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten sowie ein Beschwerderecht bei der Aufsichtsbeh&ouml;rde (Landesbeauftragte f&uuml;r Datenschutz NRW).</p>
    <h2>2. Datenerfassung</h2>
    <h3>Cookies</h3>
    <p>Diese Website verwendet technisch notwendige Cookies f&uuml;r den Betrieb. Optional nutzen wir Cookies zur Analyse, die nur mit Ihrer Einwilligung gesetzt werden.</p>
    <h3>Server-Log-Dateien</h3>
    <p>Vercel Inc. erfasst automatisch Browserdaten, IP (anonymisiert) und Zugriffszeiten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
    <h3>Registrierung</h3>
    <p>Bei Registrierung speichern wir Name und E-Mail zur Vertragserf&uuml;llung (Art. 6 Abs. 1 lit. b DSGVO).</p>
    <h2>3. Hosting</h2>
    <p>Gehostet bei <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Daten&uuml;bermittlung in die USA via EU-Standardvertragsklauseln.</p>
    <h2>4. Kontakt</h2>
    <p>Kevin Gaus (FixDigital)<br/>E-Mail: info@fixdigital.de</p>
  `},
  imprint: { title: 'Impressum', content: `
    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
    <p><strong>Kevin Gaus</strong><br/>FixDigital<br/>Severinstr. 81<br/>52080 Aachen</p>
    <p><strong>Kontakt:</strong><br/>E-Mail: info@fixdigital.de<br/>Telefon: +49 15679 175426</p>
    <p><strong>Umsatzsteuer-ID:</strong><br/>DE349691679</p>
    <p><strong>Verantwortlich f&uuml;r redaktionelle Inhalte:</strong><br/>Kevin Gaus, Severinstr. 81, 52080 Aachen</p>
    <h2>Streitschlichtung</h2>
    <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    <p>Plattform der EU zur Online-Streitbeilegung: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a></p>
  `},
  terms: { title: 'AGB', content: `
    <h2>1. Geltungsbereich</h2>
    <p>Diese Allgemeinen Gesch&auml;ftsbedingungen gelten f&uuml;r die Nutzung der Plattform Bookando.de (betrieben von Kevin Gaus, FixDigital).</p>
    <h2>2. Leistungsbeschreibung</h2>
    <p>Bookando.de ist eine SaaS-Plattform f&uuml;r Dienstleister. Die Plattform erm&ouml;glicht Terminbuchung, Kalenderverwaltung, Marketplace-Funktionen und optionale Affiliate-Dienste.</p>
    <h2>3. Zahlungsbedingungen</h2>
    <p>Die Nutzung erfolgt im Rahmen eines monatlichen Abonnements (Standard 49 &euro;, Affiliate-Booking 189 &euro;). Zus&auml;tzlich k&ouml;nnen Transaktionsgeb&uuml;hren anfallen.</p>
    <h2>4. K&uuml;ndigung</h2>
    <p>Die K&uuml;ndigung kann jederzeit zum Ende des laufenden Abrechnungszeitraums erfolgen.</p>
    <h2>5. Haftung</h2>
    <p>Die Haftung f&uuml;r Sch&auml;den ist ausgeschlossen, soweit diese nicht auf Vorsatz oder grober Fahrl&auml;ssigkeit beruhen.</p>
    <h2>6. Datenschutz</h2>
    <p>Es gilt die Datenschutzerkl&auml;rung von Bookando.de.</p>
  `},
  cookies: { title: 'Cookie-Richtlinie', content: `
    <h2>1. Was sind Cookies?</h2>
    <p>Cookies sind kleine Textdateien, die auf Ihrem Ger&auml;t gespeichert werden und Funktionen dieser Website erm&ouml;glichen.</p>
    <h2>2. Arten von Cookies</h2>
    <p><strong>Notwendig:</strong> F&uuml;r den Betrieb der Website erforderlich (Login, Sicherheit). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
    <p><strong>Optional:</strong> Zur Analyse des Nutzungsverhaltens, nur mit Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p>
    <h2>3. Verwaltung</h2>
    <p>Sie k&ouml;nnen Cookies in Ihren Browsereinstellungen verwalten und l&ouml;schen.</p>
  `},
};

/* ─── Englische Inhalte ─── */
const EN = {
  privacy: { title: 'Privacy Policy', content: `
    <p><strong>Last updated: June 2026</strong></p>
    <h2>1. Privacy at a Glance</h2>
    <h3>General Information</h3>
    <p>The following information provides a simple overview of what happens to your personal data when you visit this website.</p>
    <h3>Who is responsible?</h3>
    <p><strong>Kevin Gaus</strong> (FixDigital)<br/>Email: info@fixdigital.de</p>
    <h3>Your Rights</h3>
    <p>You have the right to access, rectify, delete, and restrict processing of your data, as well as the right to lodge a complaint with the supervisory authority.</p>
    <h2>2. Data Collection</h2>
    <h3>Cookies</h3>
    <p>This website uses technically necessary cookies for operation. Optional analytics cookies are only set with your consent.</p>
    <h3>Server Log Files</h3>
    <p>Vercel Inc. automatically collects browser data, IP (anonymized), and access times. Legal basis: Art. 6 (1) lit. f GDPR.</p>
    <h3>Registration</h3>
    <p>When registering, we store your name and email for contract fulfillment (Art. 6 (1) lit. b GDPR).</p>
    <h2>3. Hosting</h2>
    <p>Hosted by <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Data transfer to the USA is governed by EU Standard Contractual Clauses.</p>
    <h2>4. Contact</h2>
    <p>Kevin Gaus (FixDigital)<br/>Email: info@fixdigital.de</p>
  `},
  imprint: { title: 'Imprint', content: `
    <h2>Information according to &sect; 5 TMG (Germany)</h2>
    <p><strong>Kevin Gaus</strong><br/>FixDigital<br/>Severinstr. 81<br/>52080 Aachen, Germany</p>
    <p><strong>Contact:</strong><br/>Email: info@fixdigital.de<br/>Phone: +49 15679 175426</p>
    <p><strong>VAT ID:</strong><br/>DE349691679</p>
    <p><strong>Responsible for editorial content:</strong><br/>Kevin Gaus, Severinstr. 81, 52080 Aachen, Germany</p>
    <h2>Dispute Resolution</h2>
    <p>EU Online Dispute Resolution Platform: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a></p>
  `},
  terms: { title: 'Terms of Service', content: `
    <h2>1. Scope</h2>
    <p>These Terms of Service govern the use of Bookando.de, operated by Kevin Gaus (FixDigital).</p>
    <h2>2. Services</h2>
    <p>Bookando.de is a SaaS platform for service providers, offering booking, calendar, marketplace, and optional affiliate services.</p>
    <h2>3. Payment</h2>
    <p>Usage is based on monthly subscriptions (Standard &euro;49, Affiliate-Booking &euro;189). Additional transaction fees may apply.</p>
    <h2>4. Cancellation</h2>
    <p>You may cancel at any time effective at the end of the current billing period.</p>
    <h2>5. Liability</h2>
    <p>Liability for damages is excluded unless caused by intent or gross negligence.</p>
  `},
  cookies: { title: 'Cookie Policy', content: `
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device that enable functions of this website.</p>
    <h2>2. Types of Cookies</h2>
    <p><strong>Necessary:</strong> Required for website operation (login, security). Legal basis: Art. 6 (1) lit. f GDPR.</p>
    <p><strong>Optional:</strong> For usage analysis, only with your consent (Art. 6 (1) lit. a GDPR).</p>
    <h2>3. Management</h2>
    <p>You can manage and delete cookies in your browser settings.</p>
  `},
};

/* ─── Inline Styles für legal content ─── */
const LEGAL_STYLES = `
  .legal-content h2 {
    font-size: 20px;
    font-weight: 700;
    margin-top: 2em;
    margin-bottom: 0.75em;
    padding-bottom: 0.4em;
    border-bottom: 2px solid var(--color-accent, #F59E0B);
    color: var(--color-text-primary, #1A202C);
    font-family: var(--font-heading);
  }
  .legal-content h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: var(--color-text-primary, #1A202C);
  }
  .legal-content p {
    margin-bottom: 1em;
    color: var(--color-text-secondary, #4A5568);
    line-height: 1.75;
  }
  .legal-content a {
    color: var(--color-accent, #F59E0B);
    text-decoration: underline;
  }
  .legal-content ul {
    margin: 1em 0;
    padding-left: 1.5em;
    color: var(--color-text-secondary, #4A5568);
    line-height: 1.75;
  }
  .legal-content li {
    margin-bottom: 0.5em;
  }
  .legal-content strong {
    color: var(--color-text-primary, #1A202C);
    font-weight: 600;
  }
`;

export default function LegalPage({ type: propType }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [activeTab, setActiveTab] = useState(propType || 'privacy');
  const currentTab = propType || activeTab;

  const content = isEn ? EN : DE;
  const page = content[currentTab] || content.privacy;

  return (
    <>
      <SEOHead
        title={`${page.title} — Bookando`}
        description={`${page.title} von Bookando.de – Buchungs- & Sales-Plattform für Dienstleister`}
      />
      <PublicNav />

      <main className="pt-[100px] pb-20 min-h-screen" style={{ backgroundColor: 'var(--color-shell-bg)' }}>
        <div className="max-w-[780px] mx-auto px-6 lg:px-8">
          {/* Zurück zum Dashboard/Marketplace */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors duration-150 hover:opacity-80"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <ArrowLeft size={16} />
            {t('legal.back', 'Zurück')}
          </Link>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-8 pb-1" style={{ borderBottom: '1px solid var(--color-divider)' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const label = isEn
                ? { privacy: 'Privacy', imprint: 'Imprint', terms: 'Terms', cookies: 'Cookies' }[tab.key]
                : { privacy: 'Datenschutz', imprint: 'Impressum', terms: 'AGB', cookies: 'Cookies' }[tab.key];
              const isActive = currentTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  to={`/legal/${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-t-lg transition-all duration-150 no-underline"
                  style={{
                    backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                    border: isActive ? '1px solid var(--color-divider)' : '1px solid transparent',
                    borderBottom: isActive ? '1px solid var(--color-surface)' : '1px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Content */}
          <h1
            className="text-[28px] sm:text-[36px] font-extrabold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            {page.title}
          </h1>

          <div
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>

      <style>{LEGAL_STYLES}</style>
      <PublicFooter />
    </>
  );
}
