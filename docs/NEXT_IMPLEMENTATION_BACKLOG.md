# Bookando — Next Implementation Backlog

> **Stand:** 06.06.2026 | **Basis:** 4 Matrizen cross-gecheckt
> **System-Erfüllungsgrad:** Gesamt 44% (104 Funktionen, 120+ Aktionen, 84 API-Endpoints, 41 DB-Tabellen)

---

## P0 — Harte Blocker

| # | Paket | Status | Nachweis |
|---|-------|--------|----------|
| 1 | BookingWidget + VendorDetailPage | ✅ | Commit 0b8f406 |
| 2 | Commission-Engine (Pending → Approved → Paid) | ✅ | Commit 7f63aea |
| 3 | Admin Commission Review | ✅ | Commit c89474c (f556b20) |
| 4 | Auto-Refresh (useAutoRefresh + refetchOnWindowFocus) | ✅ | Commit f556b20 |
| 5 | Legal-Seiten DE/EN + Brand-Farben | ✅ | Commit 0b8f406 |
| 6 | Security: .env.vercel bereinigt, .gitignore fix | ✅ | Commit eb99e31 |
| 7 | **Reactive Portal State — Rollenwechsel ohne Browser-Refresh** | ✅ | Commit `5a62b66` (Frontend) + `3fbf8b5` (Backend). AuthContext/PortalContext/Switchers, `check-portal-state.sh 16/16` (Stand f141e1b), Vercel READY. **Regression-Fix f141e1b:** isReady in AuthContext exportiert — vorher Ladeschleife auf `/portal/*`. |

---

## P1 — Kunden-/Vendor-Kernfunktionen (NÄCHSTE UMSETZUNG)

| # | Paket | Enthaltene Aktionen | API-Status | DB-Status | Frontend | Backend | Aufwand |
|---|-------|--------------------|-----------|-----------|----------|---------|---------|
| **1** | **Vendor Booking Status** (bestätigen/ablehnen/completed) | #21,22,23 aus Vendor | ⚠️ PATCH existiert, UI fehlt | ✅ bookings | VendorBookingsPage | — | **~2h** |
| **2** | **Vendor Services fertigstellen** (Mitarbeiter zuordnen, Puffer, Kategorien) | #14-16 aus Vendor | ✅ | ✅ services | VendorServicesPage | — | **~2h** |
| **3** | **Vendor Calendar fertigstellen** (Mitarbeiter-, Status-, Service-Filter) | #19 aus Vendor | ✅ | ✅ bookings | VendorCalendarPage | — | **~2h** |
| **4** | **Customer Bookings vollständig** (Zahlungsstatus, Rechnungs-Link) | #9,10 aus Customer | ⚠️ | ✅ bookings, payments | CustomerBookingsPage | — | **~3h** |
| **5** | **Vendor Customers/CRM fertigstellen** (Tags, Notizen-UI) | #26,27 aus Vendor | ✅ | ⚠️ crm_notes | VendorCustomersPage | — | **~2h** |
| **6** | **Affiliate Click-Tracking** (Klicks erfassen + anzeigen) | #5 aus Affiliate | ❌ Fehlt | ❌ affiliate_clicks | ❌ | affiliate_routes | **~4h** |
| **7** | **Admin Payout Review** (Auszahlungen prüfen/freigeben) | #6 aus Admin | ❌ Fehlt | ✅ payout_requests | ❌ | wallet_routes | **~3h** |
| **8** | **Admin Marketplace-Freigabe** (Vendor-Sichtbarkeit) | #10 aus Admin | ✅ | ✅ vendors | ❌ | — | **~1h** |

**Nächstes Umsetzungspaket:**
```
Paket P1-1: Vendor Booking Status
Rolle: Vendor
Aktionen: Buchung bestätigen/ablehnen/abgeschlossen markieren
Frontend: VendorBookingsPage.js
Backend: PATCH /api/vendor/bookings/{id} existiert bereits
API-Status: ⚠️ UI fehlt für Status-Buttons
DB: ✅ bookings table hat status-Feld
Test: Manuell: Buchung erstellen → Status ändern → ohne Refresh sichtbar
Akzeptanz: ✓ Buchung kann bestätigt werden ✓ Buchung kann abgelehnt werden ✓ Status-Update ohne Refresh sichtbar
```

---

## P2 — Monetarisierung & Plattformbetrieb

| # | Paket | Aktionen | API | DB | Frontend | Aufwand |
|---|-------|----------|-----|-----|----------|---------|
| 1 | **Payment BookingWidget** (Stripe Checkout integrieren) | Bezahlen nach Buchung | ✅ | ✅ | BookingWidget + VendorDetail | ~6h |
| 2 | **Subscription/Plan-Wechsel** | Upgrade/Downgrade | ✅ | ⚠️ | VendorDashboard + Pricing | ~4h |
| 3 | **Pakete/Gutscheine** (Vendor) | Paket-CRUD | ⚠️ | ❌ | VendorPackages | ~4h |
| 4 | **Bewertungen vollständig** (schreiben + moderieren) | Review-Flow | ✅ | ✅ | VendorDetail + Admin | ~2h |
| 5 | **E-Mail-Templates** (Bestätigung, Storno, Erinnerung) | Automatischer Versand | ⚠️ | — | — | ~6h |
| 6 | **Calendar-Blockzeiten** (Drag/Drop vorbereiten) | Ausnahmen setzen | ✅ | ✅ | VendorCalendar | ~3h |
| 7 | **Zahlungsanbieter verbinden** (Stripe Connect) | Vendor-Konto | ❌ | ❌ | VendorSettings | ~8h |
| 8 | **No-Show markieren** | Status erweitern | ❌ | ✅ | VendorBookings | ~1h |
| 9 | **booking_status_history** (Audit Trail) | Status-Log | ❌ | ❌ | — | ~3h |

---

## P3 — Operations/Admin/Support

| # | Paket | Aktionen | API | DB | Frontend | Aufwand |
|---|-------|----------|-----|-----|----------|---------|
| 1 | **Mitarbeiterportal** | Termine, Verfügbarkeit, Kundendetails | ✅ | ✅ | Neu (StaffPortal) | ~8h |
| 2 | **Support-Ticket-System** | Tickets erstellen/bearbeiten | ⚠️ | ⚠️ | AdminSupportPage | ~8h |
| 3 | **Admin Buchungsübersicht** | Alle Buchungen | ❌ | ✅ | AdminBookings | ~3h |
| 4 | **WhiteLabel/Franchise** | Branding, Domains, Provisionen | ⚠️ | ❌ | Franchiser-Ausbau | ~12h |
| 5 | **Benachrichtigungen** (Push/E-Mail) | Einstellungen + Versand | ✅ | ✅ | NotificationPreferences | ~4h |
| 6 | **Ledger Gegenbuchungen** | Korrektur-Workflow | ❌ | ❌ | AdminLedger | ~4h |
| 7 | **Rollen/Rechte System** | Role-based access | ❌ | ❌ | AdminRoles | ~8h |
| 8 | **Reports ausbauen** | CSV + Diagramme | ✅ | ✅ | AdminReports | ~4h |

---

## P4 — Qualität, Design, Live-Betrieb

| # | Paket | Umfang | Aufwand |
|---|-------|--------|---------|
| 1 | Mobile Optimierung | Touch Targets (44×44), Kalender mobil, Tabellen responsiv | ~4h |
| 2 | Design Cleanup | Radius-System, Button-Varianten, Shadow-Tinting | ~4h |
| 3 | Accessibility | Focus States, ARIA, contrast, keyboard nav | ~4h |
| 4 | Performance | Bundle-Optimierung, Lazy Loading, Image-Optimierung | ~3h |
| 5 | E2E Tests | Playwright für kritische Flows | ~8h |
| 6 | API Contract Tests | OpenAPI-Check, Response-Validation | ~4h |
| 7 | Live-Smoke-Tests | Alle Rollen, alle Portale | ~2h |

---

## Umsetzungsempfehlung

```
Sofort (P1-1): Vendor Booking Status (bestätigen/ablehnen/completed)
→ Minimaler Aufwand, größter UX-Gewinn für Vendor

Danach (P1-2): Vendor Services fertigstellen (Mitarbeiterzuordnung, Puffer)
→ Basis für korrekte Terminlogik

Danach (P1-3): Vendor Calendar Filter (Mitarbeiter/Service/Status)
→ Kalender wird erst mit Filtern wirklich nutzbar

Danach (P1-6): Affiliate Click-Tracking
→ Ohne Klicks kein funktionierendes Affiliate-System

Danach (P1-7): Admin Payout Review
→ Ohne Freigabe keine Auszahlungen
```

---

## Cross-Check-Ergebnis

| Matrix | Vorhanden | Teilweise | Fehlt | Gesamt |
|--------|-----------|-----------|-------|--------|
| MASTER (Funktionen) | 46 (44%) | 26 (25%) | 32 (31%) | 104 |
| DATABASE (Tabellen) | 15 (37%) | 12 (29%) | 14 (34%) | 41 |
| PORTAL (Aktionen) | 58 (57%) | 15 (15%) | 29 (28%) | 102 |
| API (Endpoints) | 67 (80%) | 4 (5%) | 13 (15%) | 84 |
| **Systemdurchschnitt** | **52%** | **18%** | **27%** | — |

### Nächste 4 Aktionen (konkret)

1. **VendorBookingPage: Status-Buttons (bestätigen/ablehnen/abgeschlossen)**
2. **VendorServicesPage: Mitarbeiterzuordnung + Puffer/Preis-Felder**
3. **VendorCalendarPage: Mitarbeiter + Status + Service-Filter**
4. **Admin: Payout Review Page (Tabelle + approve/reject)**
