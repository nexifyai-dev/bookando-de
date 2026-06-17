# Bookando.de – MVP-Anforderungsmapping

> **Datum:** 17.06.2026
> **Zweck:** Eindeutige, überschneidungsfreie Zuordnung jeder Requirement-ID zu genau einem MVP-System

## MVP-Systeme (exklusive Partition)

1. **Terminbuchung** — alle Anforderungen aus Kapitel 8 (8.1.1-8.3.10), **ohne** Kalender
2. **Kalender** — Slot-Anzeige, Verfügbarkeit, Blockierlogik (Teilmenge Kap 8)
3. **Vendor-System** — Kapitel 9.1 Vendor-Grundprinzip
4. **Vendor-Unterseiten** — Kapitel 9.2 (eigene Landingpages, Buchungsprofil, etc.)
5. **Zahlungen** — Kapitel 17 Payment-Integration, Provider-Abstraktion
6. **Marketplace** — Kapitel 10
7. **Affiliate-Tracking** — Kapitel 11
8. **Wallet-System** — Kapitel 12
9. **CRM** — Kapitel 14

## Eindeutige ID-Zuordnung

Jede ID aus Traceability wird genau einem MVP-System zugeordnet — keine Doppelzählung.

| ID | Kapitel | Primäres System | Status | Gewicht |
|---|---|:---:|:---:|:---:|
| PF-08-001 | 8.1.1 Echte Terminlogik | Terminbuchung | PARTIAL | 0,35 |
| PF-08-002 | 8.1.2 Datum | Terminbuchung | PARTIAL | 0,35 |
| PF-08-003 | 8.1.3 Uhrzeit | Terminbuchung | PARTIAL | 0,35 |
| PF-08-004 | 8.1.4 Dauer | Terminbuchung | PARTIAL | 0,35 |
| PF-08-005 | 8.1.5 Mitarbeiter | Terminbuchung | PARTIAL | 0,35 |
| PF-08-006 | 8.1.6 Standort | Terminbuchung | PARTIAL | 0,35 |
| PF-08-007 | 8.1.7 Ressourcen | Terminbuchung | MISSING | 0,00 |
| PF-08-008 | 8.1.8 Vorlaufzeiten | Terminbuchung | MISSING | 0,00 |
| PF-08-009 | 8.1.9 Pufferzeiten | Terminbuchung | MISSING | 0,00 |
| PF-08-010 | 8.1.10 Gruppenlogik | Terminbuchung | MISSING | 0,00 |
| PF-08-011 | 8.1.11 Online/Offline | Terminbuchung | PARTIAL | 0,35 |
| PF-08-012 | 8.2.1 Einzeltermine | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-013 | 8.2.2 Mehrfachsitzungen | Kalender | MISSING | 0,00 |
| PF-08-014 | 8.2.3 Beratungsgespräche | Terminbuchung | MISSING | 0,00 |
| PF-08-015 | 8.2.4 Gruppenbuchungen | Terminbuchung | MISSING | 0,00 |
| PF-08-016 | 8.2.5 Online-Termine | Kalender | PARTIAL | 0,35 |
| PF-08-017 | 8.2.6 Vor-Ort-Termine | Kalender | PARTIAL | 0,35 |
| PF-08-018 | 8.2.7 Paketbuchungen | Terminbuchung | PARTIAL | 0,35 |
| PF-08-019 | 8.2.8 Wiederkehrende Termine | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-020 | 8.3.1 Blockierbare Slots | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-021 | 8.3.2 Reservierbare Slots | Kalender | MISSING | 0,00 |
| PF-08-022 | 8.3.3 Synchronisierbar | Kalender | MISSING | 0,00 |
| PF-08-023 | 8.3.4 Direkt teilbar | Kalender | MISSING | 0,00 |
| PF-08-024 | 8.3.5 Affiliate-faehig | Terminbuchung | PARTIAL | 0,35 |
| PF-08-025 | 8.3.6 Teilbar via Direktlinks | Terminbuchung | MISSING | 0,00 |
| PF-08-026 | 8.3.7 via Social Media | Terminbuchung | MISSING | 0,00 |
| PF-08-027 | 8.3.8 via QR-Codes | Terminbuchung | MISSING | 0,00 |
| PF-08-028 | 8.3.9 via Werbung | Terminbuchung | MISSING | 0,00 |
| PF-08-029 | 8.3.10 via Affiliate-Links | Terminbuchung | PARTIAL | 0,35 |
| PF-09-001 | 9.1.1 Vendor-Entity | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-002 | 9.1.2 Dienstleistungen | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-003 | 9.1.3 Produkte | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-004 | 9.1.4 Mitarbeiter | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-005 | 9.1.5 Kalender | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-006 | 9.1.6 Standorte | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-007 | 9.1.7 Affiliates anbinden | Vendor-System | PARTIAL | 0,35 |
| PF-09-008 | 9.1.8 Landingpages | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-009 | 9.1.9 Marketplace-Sichtbarkeit | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-010 | 9.2.1 Landingpages pro Vendor | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-011 | 9.2.2 Buchungsprofil | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-012 | 9.2.3 Serviceuebersichten | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-013 | 9.2.4 Kalender (oeffentlich) | Vendor-Unterseiten | PARTIAL | 0,35 |
| PF-09-014 | 9.2.5 Branding | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-015 | 9.2.6 Bilder | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-016 | 9.2.7 Bewertungen | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-017 | 9.2.8 Zahlungsoptionen | Vendor-Unterseiten | PARTIAL | 0,35 |
| PF-10-001 | 10.1.1 Oeffentliches Verzeichnis | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-002 | 10.1.2 Standort-Suche | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-003 | 10.1.3 Kategorie-Suche | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-004 | 10.1.4 Bewertungs-Suche | Marketplace | PARTIAL | 0,35 |
| PF-10-005 | 10.1.5 Preis-Suche | Marketplace | PARTIAL | 0,35 |
| PF-10-006 | 10.1.6 Dienstleistungs-Suche | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-007 | 10.1.7 Online/Offline-Filter | Marketplace | MISSING | 0,00 |
| PF-10-008 | 10.3.1 Oeffentlich sichtbar | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-009 | 10.3.2 Verborgen | Marketplace | MISSING | 0,00 |
| PF-10-010 | 10.3.3 Nur Direktlink | Marketplace | MISSING | 0,00 |
| PF-11-001 | 11.2.1 Vendor bewerben | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-002 | 11.2.2 Dienstleistung bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-003 | 11.2.3 Paket bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-004 | 11.2.4 Gutschein bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-005 | 11.2.5 Festen Termin bewerben | Affiliate-Tracking | MISSING | 0,00 |
| PF-11-006 | 11.3.1 Trackinglink | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-007 | 11.3.2 Klick-Landing | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-008 | 11.3.3 Buchung nach Click | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-009 | 11.3.4 Zahlung verarbeitet | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-010 | 11.3.5 Umsatz gespeichert | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-011 | 11.3.6 Automatische Provision | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-012 | 11.3.7 Provision Wallet | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-013 | 11.3.8 Auszahlung beantragbar | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-014 | 11.5 Kernarchitektur | Affiliate-Tracking | MISSING | 0,00 |
| PF-12-001 | 12.1.1 Wallet pro Nutzer | Wallet-System | PARTIAL | 0,35 |
| PF-12-002 | 12.1.2 Affiliate-Provisionen | Wallet-System | PARTIAL | 0,35 |
| PF-12-003 | 12.1.3 Partnerprovisionen | Wallet-System | PARTIAL | 0,35 |
| PF-12-004 | 12.1.4 Rueckerstattungen | Wallet-System | MISSING | 0,00 |
| PF-12-005 | 12.1.5 Gutscheinreste | Wallet-System | MISSING | 0,00 |
| PF-12-006 | 12.1.6 Manuelle Gutschriften | Wallet-System | PARTIAL | 0,35 |
| PF-12-007 | 12.1.7 Eigene Einzahlungen | Wallet-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-12-008 | 12.2.1 Unveraenderbares Ledger | Wallet-System | MISSING | 0,00 |
| PF-12-009 | 12.2.2-5 Status-Typen | Wallet-System | PARTIAL | 0,35 |
| PF-12-010 | 12.2.8 Auditierbarkeit | Wallet-System | PARTIAL | 0,35 |
| PF-14-001 | 14.1.1 Kundenprofile | CRM | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-14-002 | 14.1.2 Leads | CRM | PARTIAL | 0,35 |
| PF-14-003 | 14.1.3 Buchungshistorien | CRM | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-14-004 | 14.1.4 Kaufhistorien | CRM | PARTIAL | 0,35 |
| PF-14-005 | 14.1.5 Tags | CRM | PARTIAL | 0,35 |
| PF-14-006 | 14.1.6 Notizen | CRM | PARTIAL | 0,35 |
| PF-14-007 | 14.1.7 Praeferenzen | CRM | MISSING | 0,00 |
| PF-14-008 | 14.1.8 Marketingsegmente | CRM | MISSING | 0,00 |
| PF-14-009 | 14.1.9 Wiederkehrer-Erkennung | CRM | MISSING | 0,00 |
| PF-14-010 | 14.2.2 Reaktivierungen | CRM | MISSING | 0,00 |
| PF-14-011 | 14.2.3 Marketing automatisieren | CRM | MISSING | 0,00 |
| PF-17-001 | 17.5 Eigene Zahlungsanbieter | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-002 | 17.6 2,5% Auszahlungsgebuehr | Zahlungen | MISSING | 0,00 |
| PF-17-003 | 17.7 5% + 1EUR Gebuehr | Zahlungen | MISSING | 0,00 |
| PF-17-004 | 17.8 Provider-unabhaengig | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-005 | 17.8 Direkte Auszahlung | Zahlungen | PARTIAL | 0,35 |
| PF-17-006 | 17.8 Plattform-Split | Zahlungen | MISSING | 0,00 |
| PF-17-007 | 17.8 Affiliate-Split | Zahlungen | PARTIAL | 0,35 |
| PF-18-001 | 18.1.1 Modular | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-002 | 18.1.2 Skalierbar | Architektur-Enabler | DOCUMENTED_ONLY | 0,05 |
| PF-18-003 | 18.1.3 API-First | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-004 | 18.1.4 Multi-Tenant | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-005 | 18.1.5 WhiteLabel-faehig | Architektur-Enabler | PARTIAL | 0,35 |
| PF-18-006 | 18.1.6 Internationalisierbar | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-007 | 18.1.7 Payment-unabhaengig | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-19-001 | 19.1 Nicht kleines Tool | Architektur-Enabler | DOCUMENTED_ONLY | 0,05 |
| PF-19-024 | 19.2.4 Rollen- & Rechteverwaltung | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-19-026 | 19.2.6 API-Architektur | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |

## Berechnung

| Metrik | Wert |
|--------|:----:|
| UNIQUE_MVP_REQUIREMENTS | 108 |
| COUNTED_IDS | 108 |
| DUPLICATE_IDS | 0 |
| MISSING_IDS | 0 |
| WEIGHTED_POINTS | 36,20 |
| MVP_PERCENT | 33.5 % |
| CHECKSUM | 108 |

## Detailberechnung

| System | IDs | ∑Gewicht | Max | % |
|--------|:---:|:--------:|:---:|:-:|
| Terminbuchung | 20 | 3,50 | 20 | 17,5% |
| Kalender | 9 | 2,50 | 9 | 27,8% |
| Vendor-System | 9 | 5,15 | 9 | 57,2% |
| Vendor-Unterseiten | 8 | 4,30 | 8 | 53,8% |
| Marketplace | 10 | 3,70 | 10 | 37,0% |
| Affiliate-Tracking | 14 | 5,20 | 14 | 37,1% |
| Wallet-System | 10 | 2,70 | 10 | 27,0% |
| Zahlungen | 7 | 1,90 | 7 | 27,1% |
| CRM | 11 | 2,60 | 11 | 23,6% |
| Architektur-Enabler | 10 | 4,65 | 10 | 46,5% |
| **MVP Gesamt** | **108** | **36,20** | **108** | **33,5%** |

## MVP-Abgrenzung: Kapitel 18 und 19

Die 9 MVP-Systeme aus Kapitel 20.1 (Terminbuchung, Kalender, Vendor-System, Vendor-Unterseiten, Marketplace, Affiliate-Tracking, Wallet, Zahlungen, grundlegendes CRM) werden durch **Architektur-Enabler** aus Kapitel 18 (Technisches Zielbild) und 19 (Entwicklerprioritäten) ergänzt. Diese sind notwendige Voraussetzungen für den Betrieb aller MVP-Systeme:

| ID | Anforderung | Status | Begründung MVP |
|----|------------|--------|-----------------|
| PF-18-001 | Modular | IMPLEMENTED_UNVERIFIED | Voraussetzung für Wartbarkeit aller Systeme |
| PF-18-002 | Skalierbar | DOCUMENTED_ONLY | Betriebsnotwendig, nicht durch eine Einzelfunktion prüfbar |
| PF-18-003 | API-First | IMPLEMENTED_UNVERIFIED | Fundament aller Frontend-Backend-Integrationen |
| PF-18-004 | Multi-Tenant | IMPLEMENTED_UNVERIFIED | Tenant-Isolation für Vendor-Trennung im MVP |
| PF-18-005 | WhiteLabel-fähig | PARTIAL | Vendor-Branding ist MVP-relevant (Kapitel 9.2) |
| PF-18-006 | Internationalisierbar | IMPLEMENTED_UNVERIFIED | i18n für mehrsprachige Nutzung |
| PF-18-007 | Payment-unabhängig | IMPLEMENTED_UNVERIFIED | Provider-Abstraktion als Geschäftsmodell-Anforderung |

**Nicht im MVP** (Kapitel 18.2.1–11): Langfrist-Anforderungen (alle Phasen, erst nach dem MVP relevant).

**Entwicklerprioritäten (Kapitel 19):**

| ID | Anforderung | Status | Begründung |
|----|------------|--------|------------|
| PF-19-001 | Nicht kleines Tool | DOCUMENTED_ONLY | Architektur-Prinzip, keine Einzelfunktion |
| PF-19-021 | Kalender- & Ressourcenlogik | PARTIAL | (Deckungsgleich mit Kap 8) |
| PF-19-022 | Wallet- & Ledger-System | PARTIAL | (Deckungsgleich mit Kap 12) |
| PF-19-023 | Affiliate-Tracking | PARTIAL | (Deckungsgleich mit Kap 11) |
| PF-19-024 | Rollen- & Rechteverwaltung | IMPLEMENTED_UNVERIFIED | Notwendig für Multi-Tenant im MVP |
| PF-19-026 | API-Architektur | IMPLEMENTED_UNVERIFIED | (Deckungsgleich mit Kap 18) |

**Nicht im MVP** (Kapitel 19.2.5): WhiteLabel-Struktur → Phase 2.

**Doppelzählung vermieden:** IDs, die bereits in Systemtabellen gezählt werden (Kap 8/11/12), werden in der Enabler-Tabelle nicht erneut gezählt. Nur ID PF-19-024 (Rollen- & Rechteverwaltung) und PF-18-001 bis PF-18-007 sowie PF-19-001 und PF-19-026 sind exklusive Enabler-IDs.
