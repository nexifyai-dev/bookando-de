import React from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowLeft } from 'lucide-react';

const LEGAL_CONTENT = {
  imprint: {
    title: 'Impressum',
    content: `
      <h2>Angaben gemäß § 5 TMG</h2>
      <p><strong>Bookando</strong><br/>
      c/o Bookando GmbH<br/>
      Theaterstraße 24<br/>
      52062 Aachen</p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: Max Mustermann</p>

      <h2>Kontakt</h2>
      <p>Telefon: +49 241 990 322 92<br/>
      E-Mail: info@bookando.de</p>

      <h2>Registereintrag</h2>
      <p>Amtsgericht Aachen, HRB 23610</p>

      <h2>Umsatzsteuer-ID</h2>
      <p>DE 123456789</p>
    `,
  },
  privacy: {
    title: 'Datenschutzerklärung',
    content: `
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Ihre personenbezogenen Daten werden vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften behandelt.</p>

      <h2>2. Datenerfassung</h2>
      <p>Die Nutzung unserer Plattform ist in der Regel ohne Angabe personenbezogener Daten möglich. Für die Nutzung unserer Services ist eine Registrierung erforderlich, bei der wir folgende Daten erheben: Name, E-Mail-Adresse, Kontaktdaten.</p>

      <h2>3. Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf Auskunft über Ihre gespeicherten Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung.</p>
    `,
  },
  terms: {
    title: 'Allgemeine Geschäftsbedingungen',
    content: `
      <h2>§1 Geltungsbereich</h2>
      <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der Bookando / Bookando GmbH und den Nutzern dieser Plattform.</p>

      <h2>§2 Leistungsbeschreibung</h2>
      <p>Die Plattform vermittelt Buchungen zwischen Kunden und Dienstleistern. Die Verträge kommen direkt zwischen Kunde und Dienstleister zustande.</p>

      <h2>§3 Haftung</h2>
      <p>Die Plattform übernimmt keine Haftung für die Qualität der vermittelten Dienstleistungen.</p>
    `,
  },
};

export default function LegalPage({ type = 'imprint' }) {
  const data = LEGAL_CONTENT[type] || LEGAL_CONTENT.imprint;

  return (
    <div>
      <PublicNav hideLanguageSwitch />
      <main className="pt-24 pb-16 min-h-screen bg-[var(--color-shell-bg)]">
        <div className="max-w-[720px] mx-auto px-6 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] mb-8 transition-colors">
            <ArrowLeft size={14} /> Zurück
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8 font-[var(--font-heading)]">{data.title}</h1>
          <div className="prose prose-sm max-w-none"
            style={{ color: 'var(--color-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
