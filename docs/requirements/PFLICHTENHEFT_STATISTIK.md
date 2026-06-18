# Bookando.de – Pflichtenheft Statistik

> **Quelle:** docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml
> **Stand:** 18.06.2026

## Gesamtstatistik

| Status | Anzahl | Anteil |
|--------|-------:|------:|
| VERIFIED_COMPLETE | 0 | 0.0 % |
| IMPLEMENTED_UNVERIFIED | 51 | 33.8 % |
| PARTIAL | 48 | 31.8 % |
| MOCK_ONLY | 0 | 0.0 % |
| DOCUMENTED_ONLY | 7 | 4.6 % |
| MISSING | 40 | 26.5 % |
| CONTRADICTED | 0 | 0.0 % |
| BLOCKED | 0 | 0.0 % |
| FUTURE_PHASE | 5 | 3.3 % |
| **TOTAL** | **151** | **100,0 %** |
| **CHECKSUM** | **151** | ✅ |

## Pro Kapitel

| Kapitel | Gesamt | VI | IU | PA | MO | DO | MI | CO | BL | FP |
|---------------------------------------------------------------|
| 8. Terminbuchungssystem | 29 | 0 | 8 | 7 | 0 | 0 | 14 | 0 | 0 | 0 |
| 9. Vendor-System | 17 | 0 | 14 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| 10. Marketplace-System | 15 | 0 | 7 | 4 | 0 | 1 | 3 | 0 | 0 | 0 |
| 11. Affiliate-Booking-System (★ KERN-USP) | 20 | 0 | 4 | 10 | 0 | 3 | 3 | 0 | 0 | 0 |
| 12. Wallet- und Ledger-System | 15 | 0 | 2 | 9 | 0 | 0 | 4 | 0 | 0 | 0 |
| 13. WhiteLabel-System | 9 | 0 | 2 | 2 | 0 | 0 | 4 | 0 | 0 | 1 |
| 14. CRM-System | 13 | 0 | 2 | 4 | 0 | 1 | 6 | 0 | 0 | 0 |
| 15. KI-Strategie | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| 16. Mobile- und App-Strategie | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 17. Geschäftsmodell | 14 | 0 | 5 | 3 | 0 | 0 | 6 | 0 | 0 | 0 |
| 18. Technisches Zielbild | 8 | 0 | 5 | 1 | 0 | 1 | 0 | 0 | 0 | 1 |
| 19. Entwicklerprioritäten | 7 | 0 | 2 | 4 | 0 | 1 | 0 | 0 | 0 | 0 |
| **TOTAL** | **151** | **0** | **51** | **48** | **0** | **7** | **40** | **0** | **0** | **5** |

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

Die MVP-Gesamtmenge (135 IDs) ist partitioniert: Jede PF-ID ist genau einem System zugeordnet.
Keine ID wird doppelt gezählt. Die Summe der System-Anzahlen entspricht der Gesamtanzahl.

| MVP-System | Anz. | ∑Gewicht | Max | Erfüllung |
|------------|:----:|:--------:|:---:|:---------:|
| Terminbuchung | 20 | 4,75 | 20 | 23.7 % |
| Kalender | 9 | 2,50 | 9 | 27.8 % |
| Vendor-System | 9 | 5,15 | 9 | 57.2 % |
| Vendor-Unterseiten | 8 | 4,30 | 8 | 53.8 % |
| Marketplace | 15 | 5,65 | 15 | 37.7 % |
| Affiliate-Tracking | 20 | 6,05 | 20 | 30.2 % |
| Wallet-System | 15 | 4,35 | 15 | 29.0 % |
| CRM | 13 | 2,65 | 13 | 20.4 % |
| Architektur-Enabler | 14 | 6,05 | 14 | 43.2 % |
| Zahlungen | 12 | 4,05 | 12 | 33.8 % |
| **MVP Gesamt** | **135** | **45,50** | **135** | **33.7 %** |

> Gewichtung: VERIFIED_COMPLETE=1,00, IMPLEMENTED_UNVERIFIED=0,60, PARTIAL=0,35, DOCUMENTED_ONLY=0,05, MISSING=0,00.
> FUTURE_PHASE und BLOCKED sind in dieser MVP-Berechnung nicht enthalten.

*Statistik generiert 18.06.2026. Aus YAML-Source-of-Truth.*
