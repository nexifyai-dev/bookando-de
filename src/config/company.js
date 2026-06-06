/**
 * Bookando – Zentrale Unternehmenskonfiguration
 * 
 * Diese Datei wird systemweit importiert, um konsistente
 * Firmendaten, Kontaktinformationen und Plattform-Einstellungen
 * zu gewährleisten.
 * 
 * Quelle: src/config/company.json
 */

const company = {
  name: 'FixDigital',
  legalForm: 'Einzelunternehmen',
  owner: 'Kevin Gaus',
  address: {
    street: 'Severinstr. 81',
    zip: '52080',
    city: 'Aachen',
    country: 'Deutschland',
  },
  contact: {
    phone: '+49 15679 175426',
    email: 'info@fixdigital.de',
    website: 'https://fixdigital.de',
  },
  tax: {
    vatId: 'DE349691679',
    note: 'Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz',
  },
  platform: {
    name: 'Bookando',
    domain: 'bookando.de',
    appDomain: 'app.bookando.de',
    emailDomain: 'nexifyai.cloud',
    supportEmail: 'hallo@bookando.de',
    noreplyEmail: 'noreply@nexifyai.cloud',
  },
  copyright: {
    year: 2026,
    holder: 'Kevin Gaus',
    text: 'Alle Rechte vorbehalten.',
  },
  imprint: {
    responsiblePerson: 'Kevin Gaus',
    addressLine: 'Severinstr. 81, 52080 Aachen',
    email: 'info@fixdigital.de',
    phone: '+49 15679 175426',
    vatId: 'DE349691679',
    ecPlatformUrl: 'https://ec.europa.eu/consumers/odr/',
    disputeStatement:
      'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  },
  /** Gibt die formatierte Anschrift als String zurück */
  getFullAddress() {
    return `${this.address.street}, ${this.address.zip} ${this.address.city}`;
  },
  /** Gibt den vollständigen Copyright-String zurück */
  getCopyright() {
    return `© ${this.copyright.year} ${this.copyright.holder}. ${this.copyright.text}`;
  },
};

export default company;
