import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowLeft } from 'lucide-react';

const LEGAL_CONTENT = {
  imprint: {
    title: 'Impressum',
    content: `
      <h2>Angaben gemäß § 5 TMG</h2>
      <p><strong>Bookando GmbH</strong><br/>
      Adalbertsteinweg 1<br/>
      52070 Aachen</p>

      <p><strong>Vertreten durch:</strong><br/>
      Geschäftsführer: [Name des Geschäftsführers]</p>

      <h2>Kontakt</h2>
      <p>Telefon: +49 241 990 322 92<br/>
      E-Mail: info@bookando.de</p>

      <h2>Registereintrag</h2>
      <p>Eintragung im Handelsregister<br/>
      Registergericht: Amtsgericht Aachen<br/>
      Registernummer: HRB [XXXX]</p>

      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br/>
      DE [XXXXXXX]</p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>[Name des Verantwortlichen]<br/>
      Adalbertsteinweg 1, 52070 Aachen</p>

      <h2>Streitschlichtung</h2>
      <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a><br/>
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    `,
  },
  privacy: {
    title: 'Datenschutzerklärung',
    content: `
      <h2>1. Datenschutz auf einen Blick</h2>
      <h3>Allgemeine Hinweise</h3>
      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

      <h3>Datenerfassung auf unserer Website</h3>
      <p><strong>Wer ist verantwortlich für die Datenerfassung?</strong><br/>
      Die Datenverarbeitung auf dieser Website erfolgt durch die Bookando GmbH, Adalbertsteinweg 1, 52070 Aachen.</p>

      <p><strong>Wie erfassen wir Ihre Daten?</strong><br/>
      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. bei der Registrierung). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (z. B. Browsertyp, Betriebssystem, Uhrzeit).</p>

      <p><strong>Wofür nutzen wir Ihre Daten?</strong><br/>
      Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens oder zur Verbesserung unseres Angebots verwendet werden.</p>

      <h3>Ihre Rechte</h3>
      <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der angegebenen Adresse an uns wenden.</p>

      <h2>2. Datenerfassung auf unserer Website</h2>
      <h3>Cookies</h3>
      <p>Unsere Website verwendet Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Sie können die Speicherung von Cookies in Ihrem Browser einschränken oder ganz verhindern.</p>

      <h3>Server-Log-Dateien</h3>
      <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>

      <h3>Registrierung auf unserer Plattform</h3>
      <p>Bei der Registrierung auf unserer Plattform erheben wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Unternehmen). Diese Daten werden ausschließlich für die Nutzung der Plattform und die Abwicklung von Buchungen verwendet.</p>

      <h2>3. Betroffenenrechte</h2>
      <p>Sie haben gemäß DSGVO folgende Rechte:<br/>
      - Recht auf Auskunft (Art. 15 DSGVO)<br/>
      - Recht auf Berichtigung (Art. 16 DSGVO)<br/>
      - Recht auf Löschung (Art. 17 DSGVO)<br/>
      - Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)<br/>
      - Recht auf Datenübertragbarkeit (Art. 20 DSGVO)<br/>
      - Widerspruchsrecht (Art. 21 DSGVO)</p>

      <h2>4. Datenschutzbeauftragter</h2>
      <p>Wir haben einen Datenschutzbeauftragten bestellt. Bei Fragen zum Datenschutz erreichen Sie uns unter: datenschutz@bookando.de</p>
    `,
  },
  terms: {
    title: 'Allgemeine Geschäftsbedingungen',
    content: `
      <h2>§1 Geltungsbereich</h2>
      <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Bookando (bookando.de) der Bookando GmbH, Adalbertsteinweg 1, 52070 Aachen. Die Plattform dient der Vermittlung von Terminbuchungen zwischen Dienstleistern (nachfolgend "Anbieter") und Kunden.</p>

      <h2>§2 Vertragsgegenstand</h2>
      <p>Bookando stellt eine technische Plattform zur Verfügung, die es Anbietern ermöglicht, ihre Dienstleistungen zu präsentieren und Kunden die Buchung von Terminen zu ermöglichen. Bookando ist nicht selbst Vertragspartner der vermittelten Dienstleistungen. Der Vertrag über die Dienstleistung kommt direkt zwischen Anbieter und Kunde zustande.</p>

      <h2>§3 Registrierung und Nutzerkonto</h2>
      <p>Für die Nutzung der Plattform ist eine Registrierung erforderlich. Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten und vor unbefugtem Zugriff zu schützen. Jeder Nutzer darf nur ein Konto erstellen.</p>

      <h2>§4 Pflichten der Anbieter</h2>
      <p>Anbieter sind verpflichtet, ihre Dienstleistungen, Preise und Verfügbarkeiten korrekt und aktuell zu halten. Stornierungen durch den Anbieter sind nur in begründeten Fällen zulässig.</p>

      <h2>§5 Zahlungsabwicklung</h2>
      <p>Die Zahlungsabwicklung erfolgt über die von Bookando integrierten Zahlungsdienstleister. Es gelten die jeweiligen AGB des gewählten Zahlungsanbieters. Bookando erhebt eine Plattformgebühr gemäß dem gewählten Tarifmodell.</p>

      <h2>§6 Haftung</h2>
      <p>Bookando haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet Bookando nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung für die Qualität der vermittelten Dienstleistungen liegt beim jeweiligen Anbieter.</p>

      <h2>§7 Kündigung</h2>
      <p>Die Kündigung des Nutzerkontos kann jederzeit durch den Nutzer erfolgen. Bookando kann das Nutzerkonto bei Verstoß gegen diese AGB mit einer Frist von 14 Tagen kündigen.</p>

      <h2>§8 Schlussbestimmungen</h2>
      <p>Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und Gerichtsstand ist Aachen. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
    `,
  },
};

export default function LegalPage({ type = 'imprint' }) {
  const data = LEGAL_CONTENT[type] || LEGAL_CONTENT.imprint;
  const titles = { imprint: 'Impressum', privacy: 'Datenschutz', terms: 'AGB' };

  return (
    <div>
      <SEOHead title={`${titles[type]} – Bookando`} description={`Die ${titles[type].toLowerCase()} für die Nutzung der Bookando-Plattform mit Sitz in Aachen.`} />
      <PublicNav />
      <main className="pt-[100px] pb-20 min-h-screen bg-[var(--color-shell-bg)]">
        <div className="max-w-[720px] mx-auto px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] mb-8 transition-colors">
            <ArrowLeft size={14} /> Zurück zur Startseite
          </Link>
          <h1 className="text-[28px] sm:text-[36px] font-extrabold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{data.title}</h1>
          <div className="prose prose-sm max-w-none space-y-4"
            style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '14px' }}
            dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
