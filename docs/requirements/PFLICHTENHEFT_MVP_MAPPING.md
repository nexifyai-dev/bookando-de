# Bookando.de – MVP-Anforderungsmapping

> **Datum:** 17.06.2026
> **Zweck:** Eindeutige, überschneidungsfreie Zuordnung jeder ID zu genau einem MVP-System

## MVP-Systeme (exklusive Partition)

1. **Terminbuchung** — Termin- und Buchungslogik (Teilmenge Kap 8)
2. **Kalender** — Slot-Anzeige, Verfügbarkeit, Blockierlogik (Teilmenge Kap 8)
3. **Vendor-System** — Kapitel 9.1 Vendor-Grundprinzip
4. **Vendor-Unterseiten** — Kapitel 9.2 (eigene Landingpages, Buchungsprofil)
5. **Zahlungen** — Kapitel 17 Payment-Integration, Provider-Abstraktion
6. **Marketplace** — Kapitel 10
7. **Affiliate-Tracking** — Kapitel 11
8. **Wallet-System** — Kapitel 12
9. **CRM** — Kapitel 14
10. **Architektur-Enabler** — Kapitel 16, 18, 19

## Eindeutige ID-Zuordnung

Jede ID aus Traceability wird genau einem MVP-System zugeordnet — keine Doppelzählung.

| ID | Kapitel | Primäres System | Status | Gewicht |
|---|---|:---:|:---:|:---:|
| PF-08-001 | 8.1.1 Echte Terminlogik (kein Produkt) | Terminbuchung | PARTIAL | 0,35 |
| PF-08-002 | 8.1.2 Datum | Terminbuchung | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-003 | 8.1.3 Uhrzeit | Terminbuchung | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-004 | 8.1.4 Dauer | Terminbuchung | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-005 | 8.1.5 Mitarbeiter-Zuordnung | Terminbuchung | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-006 | 8.1.6 Standort-Zuordnung | Terminbuchung | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-007 | 8.1.7 Ressourcen | Terminbuchung | MISSING | 0,00 |
| PF-08-008 | 8.1.8 Vorlaufzeiten | Terminbuchung | MISSING | 0,00 |
| PF-08-009 | 8.1.9 Pufferzeiten | Terminbuchung | MISSING | 0,00 |
| PF-08-010 | 8.1.10 Gruppenlogik | Terminbuchung | MISSING | 0,00 |
| PF-08-011 | 8.1.11 Online-/Offline-Termine | Terminbuchung | PARTIAL | 0,35 |
| PF-08-014 | 8.2.3 Beratungsgespräche | Terminbuchung | MISSING | 0,00 |
| PF-08-015 | 8.2.4 Gruppenbuchungen | Terminbuchung | MISSING | 0,00 |
| PF-08-018 | 8.2.7 Paketbuchungen | Terminbuchung | PARTIAL | 0,35 |
| PF-08-024 | 8.3.5 Affiliate-fähige Slots | Terminbuchung | PARTIAL | 0,35 |
| PF-08-025 | 8.3.6 Teilbar via Direktlinks | Terminbuchung | MISSING | 0,00 |
| PF-08-026 | 8.3.7 Teilbar via Social Media | Terminbuchung | MISSING | 0,00 |
| PF-08-027 | 8.3.8 Teilbar via QR-Codes | Terminbuchung | MISSING | 0,00 |
| PF-08-028 | 8.3.9 Teilbar via Werbekampagnen | Terminbuchung | MISSING | 0,00 |
| PF-08-029 | 8.3.10 Teilbar via Affiliate-Links | Terminbuchung | PARTIAL | 0,35 |
| PF-08-012 | 8.2.1 Einzeltermine | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-013 | 8.2.2 Mehrfachsitzungen | Kalender | MISSING | 0,00 |
| PF-08-016 | 8.2.5 Online-Termine | Kalender | PARTIAL | 0,35 |
| PF-08-017 | 8.2.6 Vor-Ort-Termine | Kalender | PARTIAL | 0,35 |
| PF-08-019 | 8.2.8 Wiederkehrende Termine | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-020 | 8.3.1 Zeitslots blockierbar | Kalender | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-08-021 | 8.3.2 Zeitslots reservierbar | Kalender | MISSING | 0,00 |
| PF-08-022 | 8.3.3 Zeitslots synchronisierbar | Kalender | MISSING | 0,00 |
| PF-08-023 | 8.3.4 Zeitslots direkt teilbar | Kalender | MISSING | 0,00 |
| PF-09-001 | 9.1.1 Vendor als Organisationseinheit | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-002 | 9.1.2 Dienstleistungen anbieten | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-003 | 9.1.3 Produkte verkaufen | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-004 | 9.1.4 Mitarbeiter verwalten | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-005 | 9.1.5 Kalender verwalten | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-006 | 9.1.6 Standorte besitzen | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-007 | 9.1.7 Affiliates anbinden | Vendor-System | PARTIAL | 0,35 |
| PF-09-008 | 9.1.8 Eigene Landingpages | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-009 | 9.1.9 Marketplace-Sichtbarkeit | Vendor-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-010 | 9.2.1 Eigene Landingpages pro Vendor | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-011 | 9.2.2 Eigenes Buchungsprofil | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-012 | 9.2.3 Serviceübersichten | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-013 | 9.2.4 Kalender (öffentlich) | Vendor-Unterseiten | PARTIAL | 0,35 |
| PF-09-014 | 9.2.5 Branding | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-015 | 9.2.6 Bilder | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-016 | 9.2.7 Bewertungen | Vendor-Unterseiten | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-09-017 | 9.2.8 Zahlungsoptionen pro Vendor | Vendor-Unterseiten | PARTIAL | 0,35 |
| PF-10-001 | 10.1.1 Öffentliches Verzeichnis | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-002 | 10.1.2 Suche nach Standort | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-003 | 10.1.3 Suche nach Kategorie | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-004 | 10.1.4 Suche nach Bewertung | Marketplace | PARTIAL | 0,35 |
| PF-10-005 | 10.1.5 Suche nach Preis | Marketplace | PARTIAL | 0,35 |
| PF-10-006 | 10.1.6 Suche nach Dienstleistung | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-007 | 10.1.7 Online-/Offline-Filter | Marketplace | MISSING | 0,00 |
| PF-10-008 | 10.1.8 Reichweite erzeugen | Marketplace | DOCUMENTED_ONLY | 0,05 |
| PF-10-009 | 10.1.9 Buchungen vermitteln | Marketplace | PARTIAL | 0,35 |
| PF-10-010 | 10.1.10 Kleinere Dienstleister sichtbar | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-011 | 10.1.11 Affiliate-Traffic bündeln | Marketplace | PARTIAL | 0,35 |
| PF-10-012 | 10.1.12 Landingpages bereitstellen | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-013 | 10.3.1 Öffentlich sichtbar | Marketplace | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-10-014 | 10.3.2 Verborgen | Marketplace | MISSING | 0,00 |
| PF-10-015 | 10.3.3 Nur per Direktlink | Marketplace | MISSING | 0,00 |
| PF-11-001 | 11.1 Affiliate-System als Kern-USP | Affiliate-Tracking | DOCUMENTED_ONLY | 0,05 |
| PF-11-002 | 11.2.1 Vendor bewerben | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-003 | 11.2.2 Dienstleistung bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-004 | 11.2.3 Paket bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-005 | 11.2.4 Gutschein bewerben | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-006 | 11.2.5 Festen Termin bewerben | Affiliate-Tracking | MISSING | 0,00 |
| PF-11-007 | 11.3.1 Individueller Trackinglink | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-008 | 11.3.2 Kunde klickt → Landing | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-009 | 11.3.3 Kunde bucht Termin | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-010 | 11.3.4 Zahlung verarbeitet | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-011 | 11.3.5 Umsatz gespeichert | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-012 | 11.3.6 Provision automatisch berechnet | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-013 | 11.3.7 Provision im Wallet | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-014 | 11.5 Auszahlung beantragbar (Kernarchitektur) | Affiliate-Tracking | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-11-015 | 11.6 Faire Zusammenarbeit | Affiliate-Tracking | DOCUMENTED_ONLY | 0,05 |
| PF-11-016 | 11.7 Transparente Umsatzzuordnung | Affiliate-Tracking | MISSING | 0,00 |
| PF-11-017 | 11.8 Nachvollziehbare Performance | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-018 | 11.9 Automatisierte Provisionierung | Affiliate-Tracking | PARTIAL | 0,35 |
| PF-11-019 | 11.10 Skalierbares Empfehlungsmarketing | Affiliate-Tracking | DOCUMENTED_ONLY | 0,05 |
| PF-11-020 | 11.11 Affiliate = Kernarchitektur | Affiliate-Tracking | MISSING | 0,00 |
| PF-12-001 | 12.1.1 Jeder Nutzer erhält Wallet | Wallet-System | PARTIAL | 0,35 |
| PF-12-002 | 12.1.2 Affiliate-Provisionen | Wallet-System | PARTIAL | 0,35 |
| PF-12-003 | 12.1.3 Partnerprovisionen | Wallet-System | PARTIAL | 0,35 |
| PF-12-004 | 12.1.4 Rückerstattungen | Wallet-System | MISSING | 0,00 |
| PF-12-005 | 12.1.5 Gutscheinreste | Wallet-System | MISSING | 0,00 |
| PF-12-006 | 12.1.6 Manuelle Gutschriften | Wallet-System | PARTIAL | 0,35 |
| PF-12-007 | 12.1.7 Eigene Einzahlungen | Wallet-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-12-008 | 12.2.1 Unveränderbare Ledger | Wallet-System | MISSING | 0,00 |
| PF-12-009 | 12.2.2-5 Status-Typen (commission pending/approved) | Wallet-System | PARTIAL | 0,35 |
| PF-12-010 | 12.2.8 Vollständig auditierbar | Wallet-System | PARTIAL | 0,35 |
| PF-12-011 | 12.2.5.a payout requested | Wallet-System | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-12-012 | 12.2.5.b payout paid | Wallet-System | PARTIAL | 0,35 |
| PF-12-013 | 12.2.5.c refund credit | Wallet-System | MISSING | 0,00 |
| PF-12-014 | 12.2.6 wallet spent | Wallet-System | PARTIAL | 0,35 |
| PF-12-015 | 12.2.8 Vollständig auditierbar (breiter) | Wallet-System | PARTIAL | 0,35 |
| PF-17-001 | 17.1 Monatliches SaaS-Modell | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-002 | 17.2 30-Tage-Testphase | Zahlungen | PARTIAL | 0,35 |
| PF-17-003 | 17.3 Standardpaket 49 € | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-004 | 17.4 Affiliate-Booking 189 € | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-005 | 17.5 Eigene Zahlungsanbieter | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-006 | 17.6 2,5 % Auszahlungsgebühr | Zahlungen | MISSING | 0,00 |
| PF-17-007 | 17.7 5 % + 1 € Plattformgebühr | Zahlungen | MISSING | 0,00 |
| PF-17-008 | 17.8 Provider-unabhängig | Zahlungen | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-17-009 | 17.9 Automatische Umstellung | Zahlungen | MISSING | 0,00 |
| PF-17-010 | 17.10 Direkte Auszahlung Vendor | Zahlungen | PARTIAL | 0,35 |
| PF-17-011 | 17.11 Plattform-Split-Payment | Zahlungen | MISSING | 0,00 |
| PF-17-012 | 17.12 Affiliate-Split | Zahlungen | PARTIAL | 0,35 |
| PF-14-001 | 14.1.1 Kundenprofile | CRM | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-14-002 | 14.1.2 Leads | CRM | PARTIAL | 0,35 |
| PF-14-003 | 14.1.3 Buchungshistorien | CRM | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-14-004 | 14.1.4 Kaufhistorien | CRM | PARTIAL | 0,35 |
| PF-14-005 | 14.1.5 Tags | CRM | PARTIAL | 0,35 |
| PF-14-006 | 14.1.6 Notizen | CRM | PARTIAL | 0,35 |
| PF-14-007 | 14.1.7 Präferenzen | CRM | MISSING | 0,00 |
| PF-14-008 | 14.1.8 Marketingsegmente | CRM | MISSING | 0,00 |
| PF-14-009 | 14.1.9 Wiederkehrer-Erkennung | CRM | MISSING | 0,00 |
| PF-14-010 | 14.2.1 Kundenbindung verbessern | CRM | DOCUMENTED_ONLY | 0,05 |
| PF-14-011 | 14.2.2 Reaktivierungen ermöglichen | CRM | MISSING | 0,00 |
| PF-14-012 | 14.2.3 Marketing automatisieren | CRM | MISSING | 0,00 |
| PF-14-013 | 14.2.4 Auslastung unterstützen | CRM | MISSING | 0,00 |
| PF-16-001 | 16.1 Mobile First | Architektur-Enabler | PARTIAL | 0,35 |
| PF-18-001 | 18.1.1 Modular | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-002 | 18.1.2 Skalierbar | Architektur-Enabler | DOCUMENTED_ONLY | 0,05 |
| PF-18-003 | 18.1.3 API-First | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-004 | 18.1.4 Multi-Tenant | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-005 | 18.1.5 WhiteLabel-fähig | Architektur-Enabler | PARTIAL | 0,35 |
| PF-18-006 | 18.1.6 Internationalisierbar | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-18-007 | 18.1.7 Payment-unabhängig | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-19-001 | 19.1 Nicht als kleines Tool entwickeln | Architektur-Enabler | DOCUMENTED_ONLY | 0,05 |
| PF-19-002 | 19.2 Kalender- & Ressourcenlogik | Architektur-Enabler | PARTIAL | 0,35 |
| PF-19-003 | 19.3 Wallet- & Ledger-System | Architektur-Enabler | PARTIAL | 0,35 |
| PF-19-004 | 19.4 Affiliate-Tracking | Architektur-Enabler | PARTIAL | 0,35 |
| PF-19-005 | 19.5 Rollen- & Rechteverwaltung | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |
| PF-19-007 | 19.7 API-Architektur | Architektur-Enabler | IMPLEMENTED_UNVERIFIED | 0,60 |

## Berechnung

| Metrik | Wert |
|--------|:----:|
| UNIQUE_MVP_REQUIREMENTS | 135 |
| COUNTED_IDS | 135 |
| DUPLICATE_IDS | 0 |
| MISSING_IDS | 0 |
| EXTRA_IDS | 0 |
| WEIGHTED_POINTS | 45,50 |
| MVP_PERCENT | 33.7 % |
| CHECKSUM | 135 |

## Detailberechnung

| System | IDs | ∑Gewicht | Max | % |
|--------|:---:|:--------:|:---:|:-:|
| Terminbuchung | 20 | 4,75 | 20 | 23.8% |
| Kalender | 9 | 2,50 | 9 | 27.8% |
| Vendor-System | 9 | 5,15 | 9 | 57.2% |
| Vendor-Unterseiten | 8 | 4,30 | 8 | 53.8% |
| Marketplace | 15 | 5,65 | 15 | 37.7% |
| Affiliate-Tracking | 20 | 6,05 | 20 | 30.2% |
| Wallet-System | 15 | 4,35 | 15 | 29.0% |
| Zahlungen | 12 | 4,05 | 12 | 33.8% |
| CRM | 13 | 2,65 | 13 | 20.4% |
| Architektur-Enabler | 14 | 6,05 | 14 | 43.2% |
| **MVP Gesamt** | **135** | **45,50** | **135** | **33.7%** |

*Mapping generiert 17.06.2026. Aus YAML-Source-of-Truth.*
