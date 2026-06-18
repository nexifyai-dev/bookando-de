# Bookando Implementation Backlog

> **Quelle:** PFLICHTENHEFT_REQUIREMENTS.yaml + FEATURE_CATALOG.md
> **Stand:** 2026-06-18 | **Orchestrator-Modus:** COMPATIBILITY_ORCHESTRATION

## Wellen-Übersicht

| Welle | Name | Reqs | Status |
|-------|------|------|--------|
| 0 | Wahrheit & Designbasis | n/a | 🔄 IN_PROGRESS |
| 1 | Gemeinsame Plattformbasis | ~25 | ⏳ PENDING |
| 2 | MVP-Buchungskern | ~55 | ⏳ PENDING |
| 3 | MVP-Umsatzkern | ~30 | ⏳ PENDING |
| 4 | CRM & Betrieb | ~20 | ⏳ PENDING |
| 5 | Phase 2: WhiteLabel/Franchise | ~12 | ⏳ PENDING |
| 6 | Phase 3: KI/Apps | ~8 | ⏳ PENDING |

## Welle 0 — Wahrheit & Designbasis (JETZT)

- [ ] Pflichtenheft-Atomisierung abschließen (Kap 20+21 fehlen)
- [ ] PORTAL_DESIGN_AUDIT.md
- [ ] BOOKANDO_DESIGN_SYSTEM.md
- [ ] PORTAL_INFORMATION_ARCHITECTURE.md
- [ ] RESPONSIVE_AND_ACCESSIBILITY_MATRIX.md
- [ ] FEATURE_CATALOG.md ✅
- [ ] PORTAL_FEATURE_MATRIX.md
- [ ] IMPLEMENTATION_BACKLOG.md (dieses Dokument)
- [ ] IMPLEMENTATION_BACKLOG.json
- [ ] Teststrategie

## Welle 1 — Gemeinsame Plattformbasis

**Ziel:** Auth, Rollen, Navigation, Shell für alle Portale

| ID | Anforderung | Status | Aufwand |
|----|-------------|--------|---------|
| PF-18-004 | Multi-Tenant | IMPLEMENTED_UNVERIFIED | Review |
| PF-19-005 | Rollen- & Rechteverwaltung | IMPLEMENTED_UNVERIFIED | Review |
| — | Responsive Portal Shell | MISSING | NEU |
| — | Mobile Navigation | MISSING | NEU |
| — | Tenant-Wechsel UI | MISSING | NEU |
| — | Benachrichtigungs-Grundlage | PARTIAL | NEU |
| — | Loading/Empty/Error States | MISSING | NEU |
| — | Onboarding Flow | PARTIAL | NEU |
| — | Sidebar-Navigation (alle Rollen) | PARTIAL | NEU |
| — | Global Search | MISSING | NEU |

## Welle 2 — MVP-Buchungskern

**Ziel:** Vollständige Terminbuchung, Vendor, Marketplace

### Terminbuchung (PF-08-xxx)
| ID | Anforderung | Status |
|----|-------------|--------|
| PF-08-001 | Echte Terminlogik | PARTIAL |
| PF-08-007 | Ressourcen | MISSING |
| PF-08-008 | Vorlaufzeiten | MISSING |
| PF-08-009 | Pufferzeiten | MISSING |
| PF-08-010 | Gruppenlogik | MISSING |
| PF-08-021 | Zeitslots reservierbar | MISSING |
| PF-08-022 | Zeitslots synchronisierbar | MISSING |
| PF-08-023 | Zeitslots direkt teilbar | MISSING |
| PF-08-025 | Teilbar via Direktlinks | MISSING |
| PF-08-026 | Teilbar via Social Media | MISSING |
| PF-08-027 | Teilbar via QR-Codes | MISSING |
| PF-08-028 | Teilbar via Werbekampagnen | MISSING |

### Marketplace (PF-10-xxx)
| ID | Anforderung | Status |
|----|-------------|--------|
| PF-10-007 | Online-/Offline-Filter | MISSING |
| PF-10-014 | Verborgen | MISSING |
| PF-10-015 | Nur per Direktlink | MISSING |

## Welle 3 — MVP-Umsatzkern

**Ziel:** Payments, Gebühren, Affiliate, Wallet, Ledger

| ID | Anforderung | Status |
|----|-------------|--------|
| PF-11-006 | Fester Termin bewerben | MISSING |
| PF-11-016 | Transparente Umsatzzuordnung | MISSING |
| PF-12-004 | Rückerstattungen (Wallet) | MISSING |
| PF-12-005 | Gutscheinreste | MISSING |
| PF-12-008 | Unveränderbare Ledger | MISSING |
| PF-12-013 | refund credit | MISSING |
| PF-17-006 | 2.5% Auszahlungsgebühr | MISSING |
| PF-17-007 | 5%+1€ Plattformgebühr | MISSING |
| PF-17-009 | Automatische Umstellung | MISSING |
| PF-17-011 | Plattform-Split-Payment | MISSING |

## Welle 4 — CRM & Betrieb

| ID | Anforderung | Status |
|----|-------------|--------|
| PF-14-007 | Präferenzen | MISSING |
| PF-14-008 | Marketingsegmente | MISSING |
| PF-14-009 | Wiederkehrer-Erkennung | MISSING |
| PF-14-011 | Reaktivierungen | MISSING |
| PF-14-012 | Marketing automatisieren | MISSING |
| PF-14-013 | Auslastung unterstützen | MISSING |

## Welle 5 — Phase 2

| ID | Anforderung | Status |
|----|-------------|--------|
| PF-13-001 | Eigene Versionen (WL) | MISSING |
| PF-13-005 | Eigene Loginseiten | MISSING |
| PF-13-007 | E-Mail-Branding | MISSING |
| PF-13-009 | Eigene Marketplace-Strukturen | MISSING |
| PF-17-013 | Franchise-Split | MISSING |
| PF-17-014 | WhiteLabel-Split | MISSING |

## Welle 6 — Phase 3

| ID | Anforderung | Status |
|----|-------------|--------|
| PF-15-001 | KI als Kernbereich | FUTURE_PHASE |
| PF-15-002 | KI-Funktionen gesamt | FUTURE_PHASE |
| PF-16-002 | Native Apps | FUTURE_PHASE |

## Prioritization-Regeln

1. MISSING > PARTIAL > IMPLEMENTED_UNVERIFIED (innerhalb gleicher Priorität)
2. Buchungs-Kern vor Umsatz-Kern vor CRM
3. P0-Security immer vor Features
4. Blockierende Abhängigkeiten zuerst
5. Einfach + hohe Wirkung vor komplex + marginal

## Nächste Aktion

Nach Abschluss Wave 0: Welle 1 Task erstellen (Portal Shell + Auth + Rollen-Navigation).
