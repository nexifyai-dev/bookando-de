import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { ArrowLeft, Shield, FileText, Cookie, Scale } from 'lucide-react';

const TABS = [
  { key: 'privacy', label: 'Datenschutzerklärung', icon: Shield },
  { key: 'imprint', label: 'Impressum', icon: FileText },
  { key: 'terms', label: 'AGB', icon: Scale },
  { key: 'cookies', label: 'Cookie-Richtlinie', icon: Cookie },
];

const LEGAL_CONTENT = {
  privacy: {
    title: 'Datenschutzerklärung',
    content: `
      <p class="legal-stand"><strong>Stand: Juni 2026</strong></p>

      <h2>1. Datenschutz auf einen Blick</h2>

      <h3>Allgemeine Hinweise</h3>
      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>

      <h3>Datenerfassung auf dieser Website</h3>
      <p><strong>Wer ist verantwortlich für die Datenerfassung?</strong></p>
      <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Betreiber (Inhaber):<br/>
      <strong>nexifyai-dev</strong><br/>
      vertreten durch den Betreiber<br/>
      E-Mail: support@bookando.de</p>

      <p><strong>Wie erfassen wir Ihre Daten?</strong><br/>
      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in unser Kontaktformular oder bei der Registrierung eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>

      <p><strong>Wofür nutzen wir Ihre Daten?</strong><br/>
      Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens oder zur Verbesserung unseres Angebots verwendet werden.</p>

      <p><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br/>
      Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht auf Berichtigung, Löschung und Einschränkung der Verarbeitung dieser Daten sowie ein Recht auf Datenübertragbarkeit. Hierzu sowie zu weiteren Fragen zum Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>

      <h3>Analyse-Tools und Tools von Drittanbietern</h3>
      <p>Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten Analyseprogrammen. Nähere Informationen hierzu finden Sie in der nachfolgenden Datenschutzerklärung.</p>

      <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>

      <h3>Datenschutz</h3>
      <p>Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
      <p>Wenn Sie diese Website nutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.</p>
      <p>Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>

      <h3>Hinweis zur verantwortlichen Stelle</h3>
      <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
      <p>
      <strong>nexifyai-dev</strong><br/>
      Inhaber: Der Betreiber<br/>
      E-Mail: support@bookando.de</p>
      <p>Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.</p>

      <h3>SSL- bzw. TLS-Verschlüsselung</h3>
      <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p>
      <p>Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.</p>

      <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
      <p>Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.</p>
      <p>Die zuständige Aufsichtsbehörde für den Standort Aachen ist:</p>
      <p>
      <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen</strong><br/>
      Postfach 20 04 44<br/>
      40102 Düsseldorf<br/>
      E-Mail: poststelle@ldi.nrw.de<br/>
      Website: <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer">www.ldi.nrw.de</a>
      </p>

      <h3>Recht auf Datenübertragbarkeit</h3>
      <p>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.</p>

      <h3>Widerspruchsrecht gegen die Verarbeitung</h3>
      <p>Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen. Wir verarbeiten die personenbezogenen Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</p>

      <h2>3. Datenerfassung auf dieser Website</h2>

      <h3>Cookies</h3>
      <p>Unsere Internetseiten verwenden sogenannte Cookies. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Sie richten keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.</p>
      <p>Wir setzen folgende Arten von Cookies ein:</p>
      <ul>
        <li><strong>Technisch notwendige Cookies:</strong> Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Ohne sie können wir Ihnen bestimmte Funktionen (z. B. Anmeldung, Warenkorb) nicht anbieten. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</li>
        <li><strong>Optionale Cookies:</strong> Diese Cookies ermöglichen uns, das Nutzerverhalten zu analysieren und unser Angebot zu verbessern. Die Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung jederzeit über unseren Cookie-Consent-Manager widerrufen.</li>
      </ul>
      <p>Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.</p>

      <h3>Server-Log-Dateien</h3>
      <p>Der Provider der Seiten (Vercel Inc.) erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
      <ul>
        <li>Browsertyp und Browserversion</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Referrer URL</li>
        <li>Hostname des zugreifenden Rechners</li>
        <li>Uhrzeit der Serveranfrage</li>
        <li>IP-Adresse (anonymisiert)</li>
      </ul>
      <p>Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.</p>

      <h3>Kontaktformular</h3>
      <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
      <p>Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.</p>
      <p>Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.</p>

      <h3>Registrierung auf unserer Plattform</h3>
      <p>Bei der Registrierung auf unserer Plattform erheben wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Unternehmen). Diese Daten werden ausschließlich für die Nutzung der Plattform und die Abwicklung von Buchungen verwendet. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>

      <h2>4. Auftragsverarbeiter und Dienstanbieter</h2>

      <h3>Hosting – Vercel Inc.</h3>
      <p>Diese Website wird gehostet bei:<br/>
      <strong>Vercel Inc.</strong><br/>
      340 S Lemon Ave #4133<br/>
      Walnut, CA 91789, USA</p>
      <p>Vercel verarbeitet auf unserer Infrastruktur Daten wie IP-Adressen, Browserinformationen und Zugriffszeiten. Der Einsatz von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und effizienten Hosting) sowie Art. 28 DSGVO (Auftragsverarbeitungsvertrag).</p>
      <p>Da Vercel seinen Sitz in den USA hat, ist die Übermittlung personenbezogener Daten in die USA durch die Nutzung der EU-Standardvertragsklauseln (Standard Contractual Clauses – SCC) abgesichert.</p>

      <h3>Supabase (Datenbank und Authentifizierung)</h3>
      <p>Wir nutzen Supabase als Backend-Dienstleister für die Speicherung von Nutzerdaten und die Authentifizierung.<br/>
      <strong>Supabase Inc.</strong><br/>
      970 Toa Payoh North<br/>
      Singapore 318992</p>
      <p>Supabase verarbeitet personenbezogene Daten im Rahmen einer Auftragsverarbeitung gemäß Art. 28 DSGVO. Mit Supabase wurde ein Auftragsverarbeitungsvertrag (AVV) abgeschlossen. Die Datenverarbeitung umfasst insbesondere die Speicherung von Benutzerprofilen, Buchungsdaten und Authentifizierungsinformationen.</p>

      <h3>Stripe (Zahlungsabwicklung)</h3>
      <p>Sofern Sie die Zahlungsfunktion auf unserer Plattform nutzen, werden Zahlungsdaten an die Stripe Inc. weitergeleitet:<br/>
      <strong>Stripe Inc.</strong><br/>
      510 Townsend Street<br/>
      San Francisco, CA 94103, USA</p>
      <p>Stripe verarbeitet Ihre Zahlungsdaten (Kreditkartendaten, Bankverbindung, Rechnungsadresse) ausschließlich zum Zweck der Zahlungsabwicklung. Stripe ist nach PCI-DSS zertifiziert und gewährleistet ein hohes Sicherheitsniveau. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Mit Stripe wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen.</p>
      <p>Weitere Informationen zum Datenschutz bei Stripe finden Sie unter: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">https://stripe.com/de/privacy</a></p>

      <h2>5. Betroffenenrechte im Detail</h2>
      <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
      <ul>
        <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie haben das Recht, von uns eine Bestätigung darüber zu verlangen, ob Sie betreffende personenbezogene Daten verarbeitet werden. Ist dies der Fall, haben Sie ein Recht auf Auskunft über diese Daten und auf die in Art. 15 DSGVO genannten Informationen.</li>
        <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht, unverzüglich die Berichtigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen.</li>
        <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie haben das Recht, die unverzügliche Löschung der Sie betreffenden personenbezogenen Daten zu verlangen, sofern einer der in Art. 17 DSGVO genannten Gründe vorliegt.</li>
        <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen, wenn eine der in Art. 18 DSGVO genannten Voraussetzungen gegeben ist.</li>
        <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten und diese Daten einem anderen Verantwortlichen zu übermitteln.</li>
        <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.</li>
      </ul>

      <h2>6. Speicherdauer</h2>
      <p>Personenbezogene Daten werden nur so lange gespeichert, wie es für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Nach Wegfall des Zwecks oder Ablauf gesetzlicher Fristen werden die Daten routinemäßig gelöscht.</p>
      <p>Gesetzliche Aufbewahrungsfristen betragen insbesondere:</p>
      <ul>
        <li>6 Jahre gemäß § 257 HGB (Handelsbücher, Inventare, Eröffnungsbilanzen, Buchungsbelege)</li>
        <li>10 Jahre gemäß § 147 AO (Bücher, Aufzeichnungen, Lageberichte)</li>
      </ul>

      <h2>7. Änderungen dieser Datenschutzerklärung</h2>
      <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.</p>
    `,
  },
  imprint: {
    title: 'Impressum',
    content: `
      <h2>Angaben gemäß § 5 TMG</h2>
      <p><strong>nexifyai-dev</strong><br/>
      Inhaber: Der Betreiber<br/>
      c/o Bookando<br/>
      Adalbertsteinweg 1<br/>
      52070 Aachen</p>

      <p><strong>Kontakt</strong><br/>
      E-Mail: support@bookando.de</p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>Der Betreiber<br/>
      Adalbertsteinweg 1<br/>
      52070 Aachen<br/>
      E-Mail: support@bookando.de</p>

      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br/>
      DE Wird nachgereicht</p>

      <h2>Streitschlichtung</h2>
      <p><strong>Plattform der EU zur Online-Streitbeilegung:</strong><br/>
      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter folgendem Link finden: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
      <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
      <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
    `,
  },
  terms: {
    title: 'Allgemeine Geschäftsbedingungen',
    content: `
      <p class="legal-stand"><strong>Stand: Juni 2026</strong></p>

      <h2>§1 Geltungsbereich</h2>
      <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Bookando (bookando.de), betrieben durch nexifyai-dev, Inhaber: Der Betreiber, Adalbertsteinweg 1, 52070 Aachen (nachfolgend "Bookando" oder "Betreiber"). Die Plattform dient der Vermittlung von Terminbuchungen zwischen Dienstleistern (nachfolgend "Anbieter") und Kunden (nachfolgend "Nutzer").</p>

      <h2>§2 Vertragsgegenstand</h2>
      <p>(1) Bookando stellt eine technische Plattform zur Verfügung, die es Anbietern ermöglicht, ihre Dienstleistungen zu präsentieren und Kunden die Buchung von Terminen zu ermöglichen.</p>
      <p>(2) Bookando ist nicht selbst Vertragspartner der vermittelten Dienstleistungen. Der Vertrag über die Dienstleistung kommt direkt zwischen Anbieter und Kunde zustande. Bookando übernimmt keine Gewähr für die Qualität, Vollständigkeit oder Richtigkeit der angebotenen Dienstleistungen.</p>

      <h2>§3 Registrierung und Nutzerkonto</h2>
      <p>(1) Für die Nutzung der Plattform als Anbieter ist eine Registrierung erforderlich. Die Registrierung als Kunde kann auch ohne Konto erfolgen, sofern die Buchungsfunktion dies zulässt.</p>
      <p>(2) Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten und vor unbefugtem Zugriff zu schützen. Jeder Nutzer darf nur ein Konto erstellen.</p>
      <p>(3) Mit der Registrierung bestätigt der Nutzer, dass alle angegebenen Daten wahrheitsgemäß und vollständig sind.</p>

      <h2>§4 Pflichten der Anbieter</h2>
      <p>(1) Anbieter sind verpflichtet, ihre Dienstleistungen, Preise und Verfügbarkeiten korrekt und aktuell zu halten.</p>
      <p>(2) Stornierungen durch den Anbieter sind nur in begründeten Fällen zulässig. Der Anbieter ist verpflichtet, den Kunden über eine Stornierung unverzüglich zu informieren.</p>
      <p>(3) Anbieter haften für die von ihnen angebotenen Dienstleistungen im Rahmen der gesetzlichen Vorschriften.</p>

      <h2>§5 Buchung und Zahlungsabwicklung</h2>
      <p>(1) Mit der Buchung eines Termins kommt ein Vertrag zwischen dem Anbieter und dem Kunden zustande. Der Kunde erhält eine Bestätigung per E-Mail.</p>
      <p>(2) Die Zahlungsabwicklung erfolgt über die von Bookando integrierten Zahlungsdienstleister (insbesondere Stripe). Es gelten die jeweiligen AGB des gewählten Zahlungsanbieters.</p>
      <p>(3) Bookando erhebt eine Plattformgebühr gemäß dem gewählten Tarifmodell. Diese wird dem Anbieter in Rechnung gestellt oder von den Zahlungen des Kunden einbehalten.</p>

      <h2>§6 Stornierung und Rücktritt</h2>
      <p>(1) Kunden können gebuchte Termine gemäß der vom Anbieter festgelegten Stornierungsfrist kostenfrei stornieren.</p>
      <p>(2) Bei nicht rechtzeitiger Stornierung oder Nichterscheinen kann der Anbieter eine Ausfallgebühr verlangen.</p>
      <p>(3) Die gesetzlichen Widerrufsrechte für Verbraucher bleiben unberührt.</p>

      <h2>§7 Haftung</h2>
      <p>(1) Bookando haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für die Verletzung von Leben, Körper und Gesundheit.</p>
      <p>(2) Für leichte Fahrlässigkeit haftet Bookando nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht und auf deren Einhaltung der Vertragspartner regelmäßig vertrauen darf. In diesem Fall ist die Haftung auf den typischen, vorhersehbaren Schaden begrenzt.</p>
      <p>(3) Die Haftung für die Qualität der vermittelten Dienstleistungen liegt beim jeweiligen Anbieter.</p>

      <h2>§8 Kündigung</h2>
      <p>(1) Die Kündigung des Nutzerkontos kann jederzeit durch den Nutzer erfolgen. Eine Kündigung ist per E-Mail an support@bookando.de möglich.</p>
      <p>(2) Bookando kann das Nutzerkonto bei Verstoß gegen diese AGB mit einer Frist von 14 Tagen kündigen. Bei schwerwiegenden Verstößen ist eine fristlose Kündigung zulässig.</p>
      <p>(3) Nach Kündigung werden die personenbezogenen Daten des Nutzers gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>

      <h2>§9 Datenschutz</h2>
      <p>Einzelheiten zur Verarbeitung personenbezogener Daten sind der Datenschutzerklärung zu entnehmen, die auf der Website abrufbar ist.</p>

      <h2>§10 Schlussbestimmungen</h2>
      <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
      <p>(2) Erfüllungsort und Gerichtsstand ist Aachen, sofern der Vertragspartner Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.</p>
      <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>
    `,
  },
  cookies: {
    title: 'Cookie-Richtlinie',
    content: `
      <p class="legal-stand"><strong>Stand: Juni 2026</strong></p>

      <h2>1. Was sind Cookies?</h2>
      <p>Cookies sind kleine Textdateien, die auf Ihrem Computer, Smartphone oder anderen Endgeräten gespeichert werden, wenn Sie eine Website besuchen. Cookies enthalten Informationen über Ihren Besuch und ermöglichen es uns, Ihren Browser wiederzuerkennen und Ihre Nutzung unserer Website zu verbessern. Cookies richten keinen Schaden an und enthalten keine Viren, Trojaner oder sonstige Schadsoftware.</p>

      <h2>2. Rechtsgrundlage für den Einsatz von Cookies</h2>
      <p>Technisch notwendige Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) eingesetzt. Unser berechtigtes Interesse liegt in der Bereitstellung einer funktionsfähigen und nutzerfreundlichen Website.</p>
      <p>Alle anderen Cookies (Analyse-, Marketing- oder Personalisierungs-Cookies) werden nur auf Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO eingesetzt. Diese Einwilligung können Sie jederzeit über unseren Cookie-Consent-Manager mit Wirkung für die Zukunft widerrufen.</p>

      <h2>3. Arten von Cookies, die wir verwenden</h2>

      <h3>3.1 Technisch notwendige Cookies</h3>
      <p>Diese Cookies sind für den Betrieb unserer Website zwingend erforderlich. Sie ermöglichen grundlegende Funktionen wie die Seitennavigation, die Authentifizierung von Benutzern und den Zugriff auf sichere Bereiche der Website. Ohne diese Cookies kann die Website nicht richtig funktionieren.</p>
      <table class="cookie-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Zweck</th>
            <th>Speicherdauer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>sb-*-auth-token</td>
            <td>Authentifizierung (Supabase-Session)</td>
            <td>Sitzungsende / bis Logout</td>
          </tr>
          <tr>
            <td>csrf-token</td>
            <td>Sicherheit (Schutz vor CSRF-Angriffen)</td>
            <td>Sitzungsende</td>
          </tr>
        </tbody>
      </table>

      <h3>3.2 Optionale Cookies</h3>
      <p>Diese Cookies werden nur nach Ihrer Einwilligung gesetzt. Sie helfen uns, das Nutzerverhalten zu analysieren und unser Angebot zu verbessern.</p>
      <table class="cookie-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Zweck</th>
            <th>Speicherdauer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga, _gid</td>
            <td>Google Analytics – Nutzungsanalyse</td>
            <td>2 Jahre / 24 Stunden</td>
          </tr>
          <tr>
            <td>_gat</td>
            <td>Google Analytics – Drosselung der Anfragerate</td>
            <td>1 Minute</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Cookie-Consent-Manager</h2>
      <p>Beim ersten Besuch unserer Website wird Ihnen ein Cookie-Consent-Banner angezeigt. Über diesen Banner können Sie Ihre Einwilligung für die verschiedenen Kategorien von Cookies erteilen oder ablehnen. Ihre getroffene Auswahl wird in einem Cookie auf Ihrem Endgerät gespeichert, sodass Sie beim erneuten Besuch nicht erneut gefragt werden.</p>
      <p>Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie auf den Link "Cookie-Einstellungen" im Footer unserer Website klicken.</p>

      <h2>5. Widerspruch und Deaktivierung von Cookies</h2>
      <p>Sie haben jederzeit die Möglichkeit, Ihre Einwilligung zur Verwendung von Cookies zu widerrufen oder Cookies direkt in Ihrem Browser zu deaktivieren. Bitte beachten Sie, dass bei Deaktivierung von Cookies möglicherweise nicht mehr alle Funktionen unserer Website vollumfänglich genutzt werden können.</p>
      <p>Die Vorgehensweise zur Deaktivierung von Cookies variiert je nach Browser:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/de-de/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2>6. Datenschutz</h2>
      <p>Weitere Informationen zum Umgang mit Ihren personenbezogenen Daten finden Sie in unserer <a href="/legal/privacy">Datenschutzerklärung</a>.</p>

      <h2>7. Änderungen dieser Cookie-Richtlinie</h2>
      <p>Wir behalten uns vor, diese Cookie-Richtlinie anzupassen, um sie an geänderte rechtliche Rahmenbedingungen oder Änderungen unserer Funktionsweise anzupassen. Die jeweils aktuelle Fassung finden Sie stets auf dieser Seite.</p>
    `,
  },
};

export default function LegalPage({ type = 'imprint' }) {
  const [activeTab, setActiveTab] = useState(type);
  const data = LEGAL_CONTENT[activeTab] || LEGAL_CONTENT.imprint;

  return (
    <div>
      <SEOHead
        title={`${data.title} – Bookando`}
        description={`Die ${data.title.toLowerCase()} für die Nutzung der Bookando-Plattform mit Sitz in Aachen.`}
      />
      <PublicNav />
      <main className="pt-[100px] pb-20 min-h-screen bg-[var(--color-shell-bg)]">
        <div className="max-w-[780px] mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Zurück zur Startseite
          </Link>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-200 dark:border-gray-700 pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-t-lg transition-all ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 text-[var(--color-primary)] shadow-sm border border-b-0 border-gray-200 dark:border-gray-700'
                      : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <article>
            <h1
              className="text-[28px] sm:text-[36px] font-extrabold mb-8"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
            >
              {data.title}
            </h1>
            <div
              className="legal-content prose prose-sm max-w-none"
              style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '14px' }}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </article>
        </div>
      </main>
      <PublicFooter />

      {/* Inline styles for legal content */}
      <style>{`
        .legal-content h2 {
          font-size: 20px;
          font-weight: 700;
          margin-top: 40px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--color-primary, #6366f1);
          color: var(--color-primary, #6366f1);
          font-family: var(--font-heading, inherit);
        }
        .legal-content h3 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 28px;
          margin-bottom: 10px;
          color: var(--color-text-primary, inherit);
        }
        .legal-content p {
          margin-bottom: 14px;
        }
        .legal-content ul {
          margin-bottom: 14px;
          padding-left: 24px;
          list-style-type: disc;
        }
        .legal-content ul li {
          margin-bottom: 6px;
        }
        .legal-content strong {
          font-weight: 600;
          color: var(--color-text-primary, inherit);
        }
        .legal-content a {
          color: var(--color-primary, #6366f1);
          text-decoration: underline;
          transition: opacity 0.2s;
        }
        .legal-content a:hover {
          opacity: 0.8;
        }
        .legal-content .legal-stand {
          font-size: 13px;
          color: var(--color-text-tertiary, #999);
          margin-bottom: 20px;
          padding: 10px 14px;
          background: rgba(99, 102, 241, 0.06);
          border-radius: 8px;
          border-left: 3px solid var(--color-primary, #6366f1);
        }
        .cookie-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 13px;
        }
        .cookie-table th,
        .cookie-table td {
          padding: 10px 14px;
          text-align: left;
          border: 1px solid var(--color-border, #e5e7eb);
        }
        .cookie-table th {
          background: var(--color-primary, #6366f1);
          color: #fff;
          font-weight: 600;
        }
        .cookie-table td {
          background: rgba(255, 255, 255, 0.5);
        }
        @media (prefers-color-scheme: dark) {
          .cookie-table td {
            background: rgba(255, 255, 255, 0.05);
          }
          .cookie-table th,
          .cookie-table td {
            border-color: #374151;
          }
        }
      `}</style>
    </div>
  );
}
