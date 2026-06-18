# Bookando Feature Catalog

> **Quelle:** PFLICHTENHEFT_REQUIREMENTS.yaml (151 Anforderungen, 12 Kapitel)
> **Zusätzlich:** Kap. 20 (MVP-Strategie) + Kap. 21 (Endziel) — siehe Backlog
> **Stand:** 2026-06-18 | **Version:** kapitel-20-21-nachtrag

## Kapitel-Übersicht

| Kapitel | Thema | Anz. Reqs | MVP | Phase 2 | Phase 3 |
|---------|-------|-----------|-----|---------|---------|
| 8 | Terminbuchung | 29 | 29 | — | — |
| 9 | Vendor-System | 17 | 17 | — | — |
| 10 | Marketplace | 15 | 15 | — | — |
| 11 | Affiliate | 20 | 19 | — | — |
| 12 | Wallet/Ledger | 15 | 12 | — | — |
| 13 | WhiteLabel | 9 | — | 9 | — |
| 14 | CRM | 13 | 13 | — | — |
| 15 | KI | 2 | — | — | 2 |
| 16 | Mobile | 2 | 1 | — | 1 |
| 17 | Geschäftsmodell | 14 | 12 | 2 | — |
| 18 | Technisches Zielbild | 8 | 7 | — | — |
| 19 | Entwickler-Prioritäten | 7 | 5 | 1 | — |
| 20 | MVP-Strategie | * | 3 Subkapitel | — | — |
| 21 | Endziel | * | Vision | — | — |
| **Total** | | **151** | **131** | **12** | **3** |

## Status-Verteilung

| Status | Count | % |
|--------|-------|---|
| IMPLEMENTED_UNVERIFIED | 51 | 34% |
| PARTIAL | 48 | 32% |
| MISSING | 40 | 26% |
| DOCUMENTED_ONLY | 7 | 5% |
| FUTURE_PHASE | 5 | 3% |
| **VERIFIED_COMPLETE** | **0** | **0%** |

## MVP-System-Verteilung (nur MVP-Reqs)

| System | Reqs |
|--------|------|
| Terminbuchung | 20 |
| Affiliate-Tracking | 19 |
| Marketplace | 15 |
| Wallet-System | 13 |
| CRM | 13 |
| Architektur-Enabler | 13 |
| Zahlungen | 12 |
| Kalender | 9 |
| Vendor-System | 9 |
| Vendor-Unterseiten | 8 |

## Status-Detail pro Kapitel

### Kap. 8 — Terminbuchung (29 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 15 (Datum, Uhrzeit, Dauer, Mitarbeiter, Standort, Einzeltermine, etc.)
- 🔸 PARTIAL: 0
- ❌ MISSING: 14 (Ressourcen, Vorlaufzeiten, Pufferzeiten, Gruppen-Logik, etc.)

### Kap. 9 — Vendor-System (17 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 17 — alle Grundfunktionen
- ❌ MISSING: 0

### Kap. 10 — Marketplace (15 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 11
- ❌ MISSING: 3 (Online-/Offline-Filter, Verborgen, Nur-Direktlink)
- 📄 DOCUMENTED_ONLY: 1

### Kap. 11 — Affiliate (20 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 14
- ❌ MISSING: 3 (Fester Termin bewerben, Transparente Umsatzzuordnung, Kernarchitektur)
- 📄 DOCUMENTED_ONLY: 3

### Kap. 12 — Wallet/Ledger (15 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 11
- ❌ MISSING: 4 (Rückerstattungen, Gutscheinreste, refund credit, Unveränderbare Ledger)

### Kap. 13 — WhiteLabel (9 Reqs) — Phase 2
- FUTURE_PHASE: 1, MISSING: 4, PARTIAL: 4

### Kap. 14 — CRM (13 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 6
- ❌ MISSING: 6 (Präferenzen, Marketingsegmente, Wiederkehrer, Reaktivierung, Marketing-Automation, Auslastung)
- 📄 DOCUMENTED_ONLY: 1

### Kap. 17 — Geschäftsmodell (14 Reqs)
- 🔶 IMPLEMENTED_UNVERIFIED: 8
- ❌ MISSING: 6 (2.5% Auszahlungsgebühr, 5%+1€ Plattformgebühr, etc.)

## Kritische Lücken (MISSING MVP)
40 MISSING-Anforderungen blockieren die MVP-Abnahme. Top-Kategorien:
1. Terminbuchung (14) — Vorlauf/Puffer/Reservierung/Gruppe
2. CRM (6) — Segmente/Wiederkehrer/Automation
3. Geschäftsmodell (6) — Gebühren/Split automatisiert
4. Wallet (4) — Rückerstattungen/Gutscheinreste
5. Affiliate (3) — Fixe Slots/Transparenz
6. Marketplace (3) — Filter/Sichtbarkeitsmodi
