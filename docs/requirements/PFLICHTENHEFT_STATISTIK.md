# Bookando.de – Pflichtenheft Statistik

> **Quelle:** docs/requirements/PFLICHTENHEFT_TRACEABILITY.md
> **Stand:** 17.06.2026

## Gesamtstatistik

| Status | Anzahl | Anteil |
|--------|-------:|------:|
| VERIFIED_COMPLETE | 0 | 0,0 % |
| IMPLEMENTED_UNVERIFIED | 38 | 26,4 % |
| PARTIAL | 55 | 38,2 % |
| MOCK_ONLY | 0 | 0,0 % |
| DOCUMENTED_ONLY | 6 | 4,2 % |
| MISSING | 40 | 27,8 % |
| CONTRADICTED | 0 | 0,0 % |
| BLOCKED | 0 | 0,0 % |
| FUTURE_PHASE | 5 | 3,5 % |
| **TOTAL** | **144** | **100,0 %** |
| **CHECKSUM** | **144** | ✅ |

## Pro Kapitel

| Kapitel | Gesamt | VI | IU | PA | MO | DO | MI | CO | BL | FP |
|---------|-------:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Einleitung | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 2. Grundidee | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 |
| 3. Vision | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 4. Trafft-Orientierung | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 5. Zielgruppen | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 6. Kernziel | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 7. Plattformstruktur | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 8. Terminbuchung | 25 | 0 | 7 | 5 | 0 | 0 | 13 | 0 | 0 | 0 |
| 9. Vendor-System | 17 | 0 | 10 | 6 | 0 | 0 | 1 | 0 | 0 | 0 |
| 10. Marketplace | 15 | 0 | 6 | 4 | 0 | 0 | 5 | 0 | 0 | 0 |
| 11. Affiliate | 18 | 0 | 5 | 6 | 0 | 3 | 4 | 0 | 0 | 0 |
| 12. Wallet/Ledger | 16 | 0 | 4 | 8 | 0 | 0 | 4 | 0 | 0 | 0 |
| 13. WhiteLabel | 9 | 0 | 2 | 2 | 0 | 0 | 4 | 0 | 0 | 1 |
| 14. CRM | 13 | 0 | 2 | 5 | 0 | 1 | 5 | 0 | 0 | 0 |
| 15. KI-Strategie | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| 16. Mobile/App | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 17. Geschäftsmodell | 14 | 0 | 4 | 8 | 0 | 0 | 2 | 0 | 0 | 0 |
| 18. Technisches Zielbild | 7 | 0 | 4 | 2 | 0 | 1 | 0 | 0 | 0 | 0 |
| 19. Entwicklerprioritäten | 6 | 0 | 2 | 3 | 0 | 1 | 0 | 0 | 0 | 0 |
| 20. MVP-Strategie | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 21. Endziel | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| **TOTAL** | **144** | **0** | **38** | **55** | **0** | **6** | **40** | **0** | **0** | **5** |

## MVP-Erfüllungsgrad (gewichtet)

Gewichtung je Status:
- VERIFIED_COMPLETE = 1,00
- IMPLEMENTED_UNVERIFIED = 0,60
- PARTIAL = 0,35
- MOCK_ONLY = 0,15
- DOCUMENTED_ONLY = 0,05
- MISSING = 0,00
- CONTRADICTED = 0,00
- BLOCKED = separat
- FUTURE_PHASE = nicht gewertet

### Pro MVP-System (Quelle: PFLICHTENHEFT_MVP_MAPPING.md, kanonische Partition ohne Doppelzählung)

Die MVP-Gesamtanzahl dieser Tabelle ist identisch mit der Mengensumme aus der kanonischen Anforderungs-ID-Liste in `PFLICHTENHEFT_TRACEABILITY.md`. Jede PF-ID wird genau einem System zugeordnet; Teil Mengen wie Kalender und Vendor-Unterseiten sind im Gesamtwert nicht doppelt gezählt.

| MVP-System | Anz. | ∑Gewicht | Max | Erfüllung |
|------------|:----:|:--------:|:---:|:---------:|
| Terminbuchung | 20 | 3.50 | 20 | 17.5 % |
| Kalender | 9 | 2.50 | 9 | 27.8 % |
| Vendor-System | 9 | 5.15 | 9 | 57.2 % |
| Vendor-Unterseiten | 8 | 4.30 | 8 | 53.8 % |
| Marketplace | 15 | 5.25 | 15 | 35.0 % |
| Affiliate-Tracking | 20 | 6.00 | 20 | 30.0 % |
| Wallet-System | 15 | 4.35 | 15 | 29.0 % |
| Zahlungen | 12 | 3.20 | 12 | 26.7 % |
| CRM | 13 | 2.60 | 13 | 20.0 % |
| Architektur-Enabler | 16 | 6.90 | 16 | 43.1 % |
| **MVP Gesamt** | **131** | **41,25** | **131** | **31,5 %** |

> Die MVP-Gesamtmenge (108 IDs) ist partitioniert: Jede PF-ID ist genau einem System zugeordnet.
> Keine ID wird doppelt gezählt. Die Summe der System-Anzahlen entspricht der Gesamtanzahl.
> Gewichtung: VERIFIED_COMPLETE=1,00, IMPLEMENTED_UNVERIFIED=0,60, PARTIAL=0,35, DOCUMENTED_ONLY=0,05, MISSING=0,00.
> FUTURE_PHASE und BLOCKED sind in dieser MVP-Berechnung nicht enthalten.

## Blockierte Anforderungen

| ID | Anforderung | Blocker |
|----|------------|---------|
| — | Keine | API 402 verhindert Live-Verifikation, aber Code-Analyse möglich |

## Blocker für Phase 2/3

| ID | Anforderung | Phase | Voraussetzung |
|----|------------|-------|--------------|
| diverses | WhiteLabel | Phase 2 | Tenant-Isolation, Domain-Routing |
| diverses | Franchise | Phase 2 | WhiteLabel-Strukturen |
| diverses | KI | Phase 3 | Datenbasis, API-Ökosystem |
| diverses | Native Apps | Phase 3 | API-First, Auth-Stabilität |
