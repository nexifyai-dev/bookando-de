# Bookando.de – Anforderungs-Traceability-Matrix

> **Grundlage:** Kunden-Pflichtenheft (docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md)
> **Generiert aus:** docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml
> **Stand:** 18.06.2026

## Status-Legende

| Status | Bedeutung |
|--------|-----------|
| ✅ VERIFIED_COMPLETE | Fachlich umgesetzt, FE+BE kompatibel, DB-Modell vorhanden, Tests, Live bestätigt |
| 🔶 IMPLEMENTED_UNVERIFIED | Code vorhanden, aber nicht ausreichend getestet/nachgewiesen |
| 🔸 PARTIAL | Teilweise umgesetzt |
| 🟡 MOCK_ONLY | Nur Mock/Prototyp vorhanden |
| 📄 DOCUMENTED_ONLY | Nur in Doku erwähnt |
| ❌ MISSING | Fehlt vollständig |
| ⚠️ CONTRADICTED | Widerspricht Anforderung |
| 🔴 BLOCKED | Durch externe Abhängigkeit blockiert |
| ⬜ FUTURE_PHASE | Für aktuelle Phase nicht vorgesehen |

| ID | Anforderung | Phase | Status |
|-----------------------------------|

## Kapitel 8 – Terminbuchungssystem

| PF-08-001 | Echte Terminlogik (kein Produkt) | MVP | 🔸 PARTIAL |
| PF-08-002 | Datum | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-003 | Uhrzeit | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-004 | Dauer | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-005 | Mitarbeiter-Zuordnung | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-006 | Standort-Zuordnung | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-007 | Ressourcen | MVP | ❌ MISSING |
| PF-08-008 | Vorlaufzeiten | MVP | ❌ MISSING |
| PF-08-009 | Pufferzeiten | MVP | ❌ MISSING |
| PF-08-010 | Gruppenlogik | MVP | ❌ MISSING |
| PF-08-011 | Online-/Offline-Termine | MVP | 🔸 PARTIAL |
| PF-08-012 | Einzeltermine | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-013 | Mehrfachsitzungen | MVP | ❌ MISSING |
| PF-08-014 | Beratungsgespräche | MVP | ❌ MISSING |
| PF-08-015 | Gruppenbuchungen | MVP | ❌ MISSING |
| PF-08-016 | Online-Termine | MVP | 🔸 PARTIAL |
| PF-08-017 | Vor-Ort-Termine | MVP | 🔸 PARTIAL |
| PF-08-018 | Paketbuchungen | MVP | 🔸 PARTIAL |
| PF-08-019 | Wiederkehrende Termine | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-020 | Zeitslots blockierbar | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-08-021 | Zeitslots reservierbar | MVP | ❌ MISSING |
| PF-08-022 | Zeitslots synchronisierbar | MVP | ❌ MISSING |
| PF-08-023 | Zeitslots direkt teilbar | MVP | ❌ MISSING |
| PF-08-024 | Affiliate-fähige Slots | MVP | 🔸 PARTIAL |
| PF-08-025 | Teilbar via Direktlinks | MVP | ❌ MISSING |
| PF-08-026 | Teilbar via Social Media | MVP | ❌ MISSING |
| PF-08-027 | Teilbar via QR-Codes | MVP | ❌ MISSING |
| PF-08-028 | Teilbar via Werbekampagnen | MVP | ❌ MISSING |
| PF-08-029 | Teilbar via Affiliate-Links | MVP | 🔸 PARTIAL |

## Kapitel 9 – Vendor-System

| PF-09-001 | Vendor als Organisationseinheit | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-002 | Dienstleistungen anbieten | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-003 | Produkte verkaufen | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-004 | Mitarbeiter verwalten | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-005 | Kalender verwalten | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-006 | Standorte besitzen | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-007 | Affiliates anbinden | MVP | 🔸 PARTIAL |
| PF-09-008 | Eigene Landingpages | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-009 | Marketplace-Sichtbarkeit | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-010 | Eigene Landingpages pro Vendor | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-011 | Eigenes Buchungsprofil | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-012 | Serviceübersichten | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-013 | Kalender (öffentlich) | MVP | 🔸 PARTIAL |
| PF-09-014 | Branding | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-015 | Bilder | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-016 | Bewertungen | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-09-017 | Zahlungsoptionen pro Vendor | MVP | 🔸 PARTIAL |

## Kapitel 10 – Marketplace-System

| PF-10-001 | Öffentliches Verzeichnis | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-002 | Suche nach Standort | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-003 | Suche nach Kategorie | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-004 | Suche nach Bewertung | MVP | 🔸 PARTIAL |
| PF-10-005 | Suche nach Preis | MVP | 🔸 PARTIAL |
| PF-10-006 | Suche nach Dienstleistung | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-007 | Online-/Offline-Filter | MVP | ❌ MISSING |
| PF-10-008 | Reichweite erzeugen | MVP | 📄 DOCUMENTED_ONLY |
| PF-10-009 | Buchungen vermitteln | MVP | 🔸 PARTIAL |
| PF-10-010 | Kleinere Dienstleister sichtbar | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-011 | Affiliate-Traffic bündeln | MVP | 🔸 PARTIAL |
| PF-10-012 | Landingpages bereitstellen | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-013 | Öffentlich sichtbar | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-10-014 | Verborgen | MVP | ❌ MISSING |
| PF-10-015 | Nur per Direktlink | MVP | ❌ MISSING |

## Kapitel 11 – Affiliate-Booking-System (★ KERN-USP)

| PF-11-001 | Affiliate-System als Kern-USP | MVP | 📄 DOCUMENTED_ONLY |
| PF-11-002 | Vendor bewerben | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-11-003 | Dienstleistung bewerben | MVP | 🔸 PARTIAL |
| PF-11-004 | Paket bewerben | MVP | 🔸 PARTIAL |
| PF-11-005 | Gutschein bewerben | MVP | 🔸 PARTIAL |
| PF-11-006 | Festen Termin bewerben | MVP | ❌ MISSING |
| PF-11-007 | Individueller Trackinglink | MVP | 🔸 PARTIAL |
| PF-11-008 | Kunde klickt → Landing | MVP | 🔸 PARTIAL |
| PF-11-009 | Kunde bucht Termin | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-11-010 | Zahlung verarbeitet | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-11-011 | Umsatz gespeichert | MVP | 🔸 PARTIAL |
| PF-11-012 | Provision automatisch berechnet | MVP | 🔸 PARTIAL |
| PF-11-013 | Provision im Wallet | alle | 🔸 PARTIAL | *(Note: Phase 'alle' — zählt nicht im MVP-Nenner, aber als Architektur-Enabler im Mapping geführt)*
| PF-11-014 | Auszahlung beantragbar (Kernarchitektur) | MVP | 🔶 IMPLEMENTED_UNVERIFIED | *(Note: Siehe PF-17-005 für Auszahlungslogik)*
| PF-11-015 | Faire Zusammenarbeit | MVP | 📄 DOCUMENTED_ONLY |
| PF-11-016 | Transparente Umsatzzuordnung | MVP | ❌ MISSING |
| PF-11-017 | Nachvollziehbare Performance | MVP | 🔸 PARTIAL |
| PF-11-018 | Automatisierte Provisionierung | MVP | 🔸 PARTIAL |
| PF-11-019 | Skalierbares Empfehlungsmarketing | MVP | 📄 DOCUMENTED_ONLY |
| PF-11-020 | Affiliate = Kernarchitektur | MVP | ❌ MISSING | *(Note: Semantisch verwandt mit PF-11-014 (Kern-USP + Kernarchitektur), aber eigenständige fachliche Forderung (tiefe Integration vs Auszahlbarkeit))*

## Kapitel 12 – Wallet- und Ledger-System

| PF-12-001 | Jeder Nutzer erhält Wallet | alle | 🔸 PARTIAL | *(Note: Phase 'alle' — Grundvoraussetzung, im Mapping gezählt)*
| PF-12-002 | Affiliate-Provisionen | MVP | 🔸 PARTIAL |
| PF-12-003 | Partnerprovisionen | MVP | 🔸 PARTIAL |
| PF-12-004 | Rückerstattungen | MVP | ❌ MISSING |
| PF-12-005 | Gutscheinreste | MVP | ❌ MISSING |
| PF-12-006 | Manuelle Gutschriften | MVP | 🔸 PARTIAL |
| PF-12-007 | Eigene Einzahlungen | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-12-008 | Unveränderbare Ledger | MVP | ❌ MISSING |
| PF-12-009 | Status-Typen (commission pending/approved) | MVP | 🔸 PARTIAL |
| PF-12-010 | Vollständig auditierbar | MVP | 🔸 PARTIAL |
| PF-12-011 | payout requested | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-12-012 | payout paid | MVP | 🔸 PARTIAL |
| PF-12-013 | refund credit | MVP | ❌ MISSING |
| PF-12-014 | wallet spent | alle | 🔸 PARTIAL | *(Note: Phase 'alle' — Grundfunktion, im Mapping gezählt)*
| PF-12-015 | Vollständig auditierbar (breiter) | MVP | 🔸 PARTIAL |

## Kapitel 13 – WhiteLabel-System

| PF-13-001 | Eigene Versionen | Phase 2 | ❌ MISSING |
| PF-13-002 | Eigene Domains | Phase 2 | 🔸 PARTIAL |
| PF-13-003 | Eigenes Branding | Phase 2 | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-13-004 | Eigene Kunden | Phase 2 | ⬜ FUTURE_PHASE |
| PF-13-005 | Eigene Loginseiten | Phase 2 | ❌ MISSING |
| PF-13-006 | Eigene Domains (WL-Domain-Routing) | Phase 2 | 🔸 PARTIAL |
| PF-13-007 | Eigenes E-Mail-Branding | Phase 2 | ❌ MISSING |
| PF-13-008 | Eigene Farben | Phase 2 | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-13-009 | Eigene Marketplace-Strukturen | Phase 2 | ❌ MISSING |

## Kapitel 14 – CRM-System

| PF-14-001 | Kundenprofile | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-14-002 | Leads | MVP | 🔸 PARTIAL |
| PF-14-003 | Buchungshistorien | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-14-004 | Kaufhistorien | MVP | 🔸 PARTIAL |
| PF-14-005 | Tags | MVP | 🔸 PARTIAL |
| PF-14-006 | Notizen | MVP | 🔸 PARTIAL |
| PF-14-007 | Präferenzen | MVP | ❌ MISSING |
| PF-14-008 | Marketingsegmente | MVP | ❌ MISSING |
| PF-14-009 | Wiederkehrer-Erkennung | MVP | ❌ MISSING |
| PF-14-010 | Kundenbindung verbessern | MVP | 📄 DOCUMENTED_ONLY |
| PF-14-011 | Reaktivierungen ermöglichen | MVP | ❌ MISSING |
| PF-14-012 | Marketing automatisieren | MVP | ❌ MISSING |
| PF-14-013 | Auslastung unterstützen | MVP | ❌ MISSING |

## Kapitel 15 – KI-Strategie

| PF-15-001 | KI als Kernbereich | Phase 3 | ⬜ FUTURE_PHASE |
| PF-15-002 | KI-Funktionen gesamt | Phase 3 | ⬜ FUTURE_PHASE |

## Kapitel 16 – Mobile- und App-Strategie

| PF-16-001 | Mobile First | MVP | 🔸 PARTIAL |
| PF-16-002 | Native Apps | Phase 3 | ⬜ FUTURE_PHASE |

## Kapitel 17 – Geschäftsmodell

| PF-17-001 | Monatliches SaaS-Modell | MVP | 🔶 IMPLEMENTED_UNVERIFIED | *(Note: Semantisch getrennt von PF-17-008 (Provider-unabhängigkeit))*
| PF-17-002 | 30-Tage-Testphase | MVP | 🔸 PARTIAL |
| PF-17-003 | Standardpaket 49 € | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-17-004 | Affiliate-Booking 189 € | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-17-005 | Eigene Zahlungsanbieter | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-17-006 | 2,5 % Auszahlungsgebühr | MVP | ❌ MISSING |
| PF-17-007 | 5 % + 1 € Plattformgebühr | MVP | ❌ MISSING |
| PF-17-008 | Provider-unabhängig | MVP | 🔶 IMPLEMENTED_UNVERIFIED | *(Note: Semantisch verwandt mit PF-17-005 (eigene Zahlungsanbieter), aber eigenständige fachliche Forderung (Unabhängigkeit vs Anbieter-Auswahl))*
| PF-17-009 | Automatische Umstellung | MVP | ❌ MISSING |
| PF-17-010 | Direkte Auszahlung Vendor | MVP | 🔸 PARTIAL |
| PF-17-011 | Plattform-Split-Payment | MVP | ❌ MISSING |
| PF-17-012 | Affiliate-Split | MVP | 🔸 PARTIAL |
| PF-17-013 | Franchise-Split | Phase 2 | ❌ MISSING |
| PF-17-014 | WhiteLabel-Split | Phase 2 | ❌ MISSING |

## Kapitel 18 – Technisches Zielbild

| PF-18-001 | Modular | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-18-002 | Skalierbar | MVP | 📄 DOCUMENTED_ONLY |
| PF-18-003 | API-First | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-18-004 | Multi-Tenant | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-18-005 | WhiteLabel-fähig | MVP | 🔸 PARTIAL |
| PF-18-006 | Internationalisierbar | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-18-007 | Payment-unabhängig | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-18-008 | Langfrist-Anforderungen | alle | ⬜ FUTURE_PHASE |

## Kapitel 19 – Entwicklerprioritäten

| PF-19-001 | Nicht als kleines Tool entwickeln | MVP | 📄 DOCUMENTED_ONLY |
| PF-19-002 | Kalender- & Ressourcenlogik | MVP | 🔸 PARTIAL | *(Note: Querschnittsanforderung — im Mapping einmalig als Enabler gezählt)*
| PF-19-003 | Wallet- & Ledger-System | alle | 🔸 PARTIAL | *(Note: Querschnittsanforderung (siehe Kap 12), Phase 'alle' — einmalig als Enabler gezählt)*
| PF-19-004 | Affiliate-Tracking | MVP | 🔸 PARTIAL | *(Note: Querschnittsanforderung (siehe Kap 11) — einmalig als Enabler gezählt, nicht im Affiliate-System doppelt)*
| PF-19-005 | Rollen- & Rechteverwaltung | MVP | 🔶 IMPLEMENTED_UNVERIFIED |
| PF-19-006 | WhiteLabel-Struktur | Phase 2 | 🔸 PARTIAL |
| PF-19-007 | API-Architektur | MVP | 🔶 IMPLEMENTED_UNVERIFIED |

## Zusammenfassung der Lücken

| Kategorie | Gesamt | ✅ | 🔶 | ❌ | 📄 | ⬜ |
|----------------------------------------|
| Terminbuchung (Kap 8) | 29 | 0 | 15 | 14 | 0 | 0 |
| Vendor-System (Kap 9) | 17 | 0 | 17 | 0 | 0 | 0 |
| Marketplace (Kap 10) | 15 | 0 | 11 | 3 | 1 | 0 |
| Affiliate (Kap 11) | 20 | 0 | 14 | 3 | 3 | 0 |
| Wallet/Ledger (Kap 12) | 15 | 0 | 11 | 4 | 0 | 0 |
| WhiteLabel (Kap 13) | 9 | 0 | 4 | 4 | 0 | 1 |
| CRM (Kap 14) | 13 | 0 | 6 | 6 | 1 | 0 |
| KI (Kap 15) | 2 | 0 | 0 | 0 | 0 | 2 |
| Mobile (Kap 16) | 2 | 0 | 1 | 0 | 0 | 1 |
| Geschäftsmodell (Kap 17) | 14 | 0 | 8 | 6 | 0 | 0 |
| Technisches Zielbild (Kap 18) | 8 | 0 | 6 | 0 | 1 | 1 |
| Entwicklerprioritäten (Kap 19) | 7 | 0 | 6 | 0 | 1 | 0 |
| **Gesamt** | **151** | **0** | **99** | **40** | **7** | **5** |

*Traceability generiert 18.06.2026. Aus YAML-Source-of-Truth.*
