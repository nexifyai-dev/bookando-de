# Bookando.de — Claude Code Projektregeln

## Projektidentität

- **Kunde**: FixDigital / Kevin Gaus
- **Kundenprojekt**: Bookando.de — SaaS-, Marketplace- & WhiteLabel-Plattform für Dienstleister
- **Repo Frontend**: `nexifyai-dev/bookando-de` → `/workspace/customers/fixdigital/bookando/bookando-de/`
- **Repo Backend**: `nexifyai-dev/bookando-api` → `/workspace/customers/fixdigital/bookando/bookando-api/`
- **Domain**: https://bookando.de
- **Backend-API**: https://bookando-de-riw8.vercel.app

## Verbindliche Grundlagen

1. **Kunden-Pflichtenheft** (`docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md`) ist die verbindliche Soll-, Planungs- und Abnahmegrundlage.
2. Das Pflichtenheft ist vor jeder Planung und Umsetzung zu laden.
3. Vor jeder Änderung ist zu prüfen, welche Anforderungen betroffen sind.
4. Nach jeder Änderung sind die betroffenen Anforderungen und Nachweise zu aktualisieren.
5. Keine Fertigmeldung ohne Tests und Anforderungsnachweis.
6. Keine Aussage wie "alle API-Routen vorhanden, daher vollständig" — jede Anforderung muss fachlich, technisch, datenbankseitig, sicherheitsseitig, testseitig und im Live-Stand nachgewiesen werden.

## Architekturprinzipien

- **Bookando ist KEIN kleines Terminbuchungstool**, sondern ein vollständiges Dienstleister-Ökosystem
- **Affiliate**, **Wallet**, **Ledger**, **Marketplace**, **Multi-Tenancy** und **WhiteLabel** sind Kernarchitektur — nicht optionale Zusatzfunktionen
- Die Zahlungsarchitektur muss **providerunabhängig** bleiben (Stripe, PayPal, Mollie, Klarna)
- Provider-Abstraktion ist zwingend — Stripe darf nicht untrennbar mit der Kerndomäne gekoppelt sein
- API-First-Design für spätere Apps und externe Integrationen
- Multi-Tenant-Isolation von Beginn an

## Tenant-Trennung

Dieses Kundenprojekt ist strikt von allen NeXify-internen Projekten und anderen Kundenprojekten zu trennen:
- Keine Vermischung mit NeXify-Branding
- Keine Übernahme von NeXify-internen Komponenten
- Keine Secrets oder Tokens anderer Projekte
- Shared Infrastruktur (9Router, Resend, Vercel) nur sauber projektbezogen und mandantensicher

## Quellenhierarchie (bei Widersprüchen)

1. Kunden-Pflichtenheft
2. Spätere ausdrückliche Kundenentscheidungen
3. Sicherheits-, Datenschutz- und gesetzliche Anforderungen
4. Nachgewiesener Live- und Code-Stand
5. Repository-Dokumentationen
6. Technische Empfehlungen und Optimierungen

## Traceability

Die Anforderungs-Traceability-Matrix ist unter `docs/requirements/PFLICHTENHEFT_TRACEABILITY.md` zu pflegen.
Jede Anforderung mit Status, Nachweis und Lücke dokumentieren.

Erlaubte Statuswerte:
- `VERIFIED_COMPLETE` — nur mit Tests + fachlichem Nachweis + Live-Verifikation
- `IMPLEMENTED_UNVERIFIED` — Code vorhanden, aber nicht ausreichend getestet/nachgewiesen
- `PARTIAL` — teilweise umgesetzt
- `MOCK_ONLY` — nur Mock/Prototyp
- `DOCUMENTED_ONLY` — nur in Doku erwähnt
- `MISSING` — fehlt vollständig
- `CONTRADICTED` — widerspricht Anforderung
- `BLOCKED` — durch externe Abhängigkeit blockiert
- `FUTURE_PHASE` — laut Kunden-Pflichtenheft explizit spätere Phase

## Einfachheit, Komfort und Qualitätsüberschuss

- Verwende stets die einfachste robuste und wartbare Lösung.
- Vermeide unnötige Abstraktionen, Dienste, Frameworks, Schichten, Konfigurationen und Anbieterabhängigkeiten.
- Nutze vorhandene Infrastruktur und bestehende Projektmuster, bevor neue Komponenten eingeführt werden.
- Zusätzliche Komplexität ist nur zulässig, wenn ein konkreter, messbarer Nutzen nachgewiesen wird.
- Jede Änderung muss nach Abschluss erneut auf Vereinfachungsmöglichkeiten geprüft werden.
- Das Kunden-Pflichtenheft definiert die Mindestanforderungen, nicht die angestrebte Qualität.
- Anforderungen sind sinnvoll zu übertreffen bei:
  - Leistung und Reaktionszeit
  - Bedienkomfort
  - Barrierefreiheit
  - Zuverlässigkeit und Fehlertoleranz
  - verständlicher Fehlerführung
  - Automatisierung wiederkehrender Abläufe
  - Wartbarkeit
  - Datenschutz und Sicherheit
  - Dokumentation und Betrieb
- Der Bedienkomfort ist für alle Rollen zu optimieren:
  - Kunden
  - Vendors
  - Mitarbeiter
  - Affiliates
  - Administratoren
  - Support
  - Entwickler und Betreiber
- Qualitätsüberschuss darf nicht durch Feature-Bloat entstehen, sondern durch bessere, schnellere, verständlichere und zuverlässigere Umsetzung.

## Deployment

- Frontend: Vercel (Projekt `bookando-de`)
- Backend: Vercel (Projekt `bookando-api`)
- Keine Production-Deployments ohne explizite Freigabe
- Vor Deployment: Tests + Build + Security-Scan

## Skills (projektrelevant)

Vor relevanter Arbeit sind passende Skills aus dem installierten Bestand zu laden:
- `architecture` — Architektur-Reviews
- `supabase-postgres-best-practices` — DB-Migrationen, Queries
- `find-bugs` — Bug-Analyse
- `code-review` — PR-Reviews
- `web-performance-optimization` — Frontend-Optimierung
- `ux-researcher-designer` — UI/UX-Audit
- `web-design-guidelines` — Design-Consistency

## Vercel-Projekte
Frontend-Vercel-Projekt: bookando-de (prj_zeVjo026RtGWcQy58uTYwrEHJLQE)
Backend-Vercel-Projekt: bookando-de-riw8 (prj_zROZadgDMYRP6gxFODIj6q83qgeD)
Backend-API: https://bookando-de-riw8.vercel.app
GitHub-Repository (Backend): bookando-api (Vercel-Projektname abweichend)
