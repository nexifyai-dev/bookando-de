# Bookando Portal Design Audit

> **Datum:** 2026-06-18
> **Quellen:** App.js (367 Zeilen), 50+ Pages, 25+ Components, PORTAL_ACTION_MATRIX.md, UI_UX_SKILL_REVIEW.md, RESPONSIVE_AND_ACCESSIBILITY_MATRIX.md
> **Prüftiefe:** pro Portal: Routen, Komponenten, API, Mobile, A11y, States

---

## Executive Summary

Bookando hat eine solide Frontend-Basis mit 47+ implementierten Portal-Seiten über 5 Portal-Shells (Public, Customer, Vendor, Affiliate, Admin). Die Routing-Architektur ist rollenbasiert und sauber lazy-loaded (React.lazy + Suspense). Ein vollständiges Design-System mit CSS Custom Properties existiert in `index.css`.

**Kritische Befunde:**
1. Employee-Portal komplett fehlend (7 geplante Seiten, MVP-relevant)
2. WhiteLabel-Portal komplett fehlend (Phase 2)
3. Responsive = solide (Breakpoints 360-1440px), aber versteckter Overflow maskiert Layout-Bugs
4. Accessibility = ~45% WCAG 2.2 AA — Fokus-Indikatoren, Skip-Link, Kontrast-Probleme
5. Loading/Empty/Error States nicht systematisch — variiert stark pro Page
6. Mobile Bottom-Nav existiert, aber nicht für alle Rollen ausdifferenziert
7. Keine TypeScript-Unterstützung, keine Frontend-Tests

**Empfehlung:** Welle 1 priorisieren: Portal-Shells vervollständigen + A11y-Basis + State-Systematik. Dann Employee-Portal als MVP-Lücke schließen.

---

## Portal für Portal

### 1. Public Portal (12 Seiten)

| Seite | Route | FE | API | Loading | Empty | Error | Mobile |
|-------|-------|---|-----|---------|-------|-------|--------|
| HomePage | / | ✅ | — | Skeleton | ✅ | Global | ✅ |
| MarketplacePage | /marketplace | ✅ | ✅ | ✅ | ❌ | Global | ✅ |
| VendorDetailPage | /marketplace/:slug | ✅ | ✅ | ✅ | ❌ | Global | ⚠️ |
| AboutPage | /about | ✅ | — | — | — | Global | ✅ |
| ContactPage | /contact | ✅ | — | — | — | Global | ✅ |
| FeaturesPage | /features | ✅ | — | — | — | Global | ✅ |
| PricingPage | /pricing | ✅ | — | ✅ | — | Global | ✅ |
| LegalPage | /legal/:type | ✅ | — | — | — | Global | ✅ |
| LoginPage | /auth/login | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| RegisterPage | /auth/register | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| ForgotPasswordPage | /auth/forgot-password | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| ResetPasswordPage | /auth/reset-password | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| VerifyEmailPage | /auth/verify-email | ✅ | ✅ | ✅ | — | ✅ | ✅ |

**Public Portal — Gaps:**
- ❌ Marketplace Empty State bei 0 Ergebnissen
- ❌ VendorDetailPage auf Mobile: scrollt horizontal bei Service-Tabelle → nutze Card-Liste statt Table
- ⚠️ PricingPage: statische Karten, keine API-Anbindung → aber ok für MVP
- ⚠️ Keine Kategorie-/Filter-Persistenz in URL-Parametern
- ✅ 404-Seite mit klarer Handlung (Link zur Startseite)
- ✅ Cookie-Banner existiert

### 2. Customer Portal (5 Seiten + 4 fehlend)

| Seite | Route | FE | API | Loading | Empty | Error | A11y |
|-------|-------|---|-----|---------|-------|-------|------|
| CustomerDashboard | /portal | ✅ | ✅ | ✅ | ⚠️ | Global | ⚠️ |
| CustomerBookings | /portal/bookings | ✅ | ✅ | ✅ | ☑️ | Global | ⚠️ |
| CustomerRecurring | /portal/recurring | ✅ | ✅ | ✅ | ❌ | Global | ⚠️ |
| CustomerVouchers | /portal/vouchers | ✅ | ✅ | ✅ | ☑️ | Global | ⚠️ |
| CustomerProfile | /portal/profile | ✅ | ✅ | ✅ | — | Global | ⚠️ |
| **Fehlt:** Wallet | /portal/wallet | ❌ | ✅ | — | — | — | — |
| **Fehlt:** Payments | /portal/payments | ❌ | ❌ | — | — | — | — |
| **Fehlt:** Favoriten | /portal/favorites | ❌ | ✅ | — | — | — | — |
| **Fehlt:** Notifications | /portal/notifications | ❌ | ✅ | — | — | — | — |

**Customer — Gaps:**
- Wallet: API existiert (`GET /api/wallet/balance`, `GET /api/wallet/transactions`), keine UI
- Favoriten: API existiert (`POST/GET /api/customer/favorites`), keine UI
- Recurring: API teilweise, UI vorhanden aber ohne Fehler-Reset
- Vouchers: API existiert (`GET /api/vendor/vouchers`), UI basic

### 3. Vendor Portal (13 Seiten)

| Seite | Route | FE | API | Status |
|-------|-------|---|-----|--------|
| VendorDashboard | /portal | ✅ | ✅ | ✅ |
| VendorCalendar | /portal/calendar | ✅ | ✅ | ⚠️ |
| VendorBookings | /portal/bookings | ✅ | ✅ | ✅ |
| VendorServices | /portal/services | ✅ | ✅ | ✅ |
| VendorEmployees | /portal/employees | ✅ | ✅ | ✅ |
| VendorLocations | /portal/locations | ✅ | ✅ | ✅ |
| VendorHours | /portal/hours | ✅ | ✅ | ⚠️ |
| VendorCustomers | /portal/customers | ✅ | ✅ | ✅ |
| VendorReports | /portal/reports | ✅ | ✅ | ⚠️ |
| VendorWallet | /portal/wallet | ✅ | ✅ | ✅ |
| VendorAffiliates | /portal/affiliates | ✅ | ✅ | ✅ |
| VendorBranding | /portal/branding | ✅ | ✅ | ✅ |
| VendorSettings | /portal/settings | ✅ | ✅ | ✅ |
| **Fehlt:** Packages | /portal/packages | ❌ | ✅ | ❌ |
| **Fehlt:** Products | /portal/products | ❌ | ✅ | ❌ |

**Vendor — Gaps:**
- Calendar: Basic-Komponente, keine Ressourcen-/Equipment-Ansicht
- Reports: Charts basic (recharts), keine Export-Funktion
- Hours: UI vorhanden, Zeitauswahl basic (keine Timepicker-Komponente)
- Packages + Products: API vollständig. FE fehlt.

### 4. Employee Portal (0 von 7)

| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /employee | ❌ Keine Route, keine Shell |
| Kalender | /employee/calendar | ❌ |
| Verfügbarkeit | /employee/availability | ❌ |
| Termine | /employee/bookings | ❌ |
| Kunden | /employee/customers | ❌ |
| Profil | /employee/profile | ❌ |
| Notifications | /employee/notifications | ❌ |

**→ P1-Blocker: MVP-relevantes Portal komplett fehlend.**

### 5. Affiliate Portal (4 Seiten)

| Seite | Route | FE | API | Status |
|-------|-------|---|-----|--------|
| AffiliateDashboard | /portal | ✅ | ✅ | ✅ |
| AffiliateLinks | /portal/links | ✅ | ✅ | ✅ |
| AffiliateCommissions | /portal/commissions | ✅ | ✅ | ✅ |
| AffiliateWallet | /portal/wallet | ✅ | ✅ | ✅ |
| **Fehlt:** Campaigns | — | ❌ | ❌ | Fehlt |
| **Fehlt:** Stats/Analytics | — | ❌ | ✅ | API da, FE fehlt |

**Affiliate — Gaps:**
- Klick-Tracking nicht im FE sichtbar
- Campaigns weder API noch FE
- Stats-API existiert (`GET /api/affiliate/stats`), keine UI

### 6. Admin Portal (7 Seiten)

| Seite | Route | FE | API | Status |
|-------|-------|---|-----|--------|
| AdminDashboard | /portal | ✅ | ✅ | ✅ |
| AdminUsers | /portal/users | ✅ | ✅ | ✅ |
| AdminVendors | /portal/vendors | ✅ | ✅ | ✅ |
| AdminPlans | /portal/plans | ✅ | ✅ | ✅ |
| AdminAudit | /portal/audit | ✅ | ✅ | ✅ |
| AdminReviews | /portal/reviews | ✅ | ✅ | ✅ |
| AdminCommission | /portal/commissions | ✅ | ✅ | ✅ |
| **Fehlt:** Support-Tickets | — | ❌ | ✅ | FE fehlt |
| **Fehlt:** System-Status | — | ❌ | ❌ | Weder |

### 7. Franchise Portal (3 Seiten)

| Seite | Route | FE | API | Status |
|-------|-------|---|-----|--------|
| FranchiserDashboard | /portal | ✅ | ✅ | ✅ |
| FranchiserVendors | /portal/vendors | ✅ | ✅ | ✅ |
| FranchiserReports | /portal/reports | ✅ | ✅ | ✅ |

---

## Responsive-Analyse (Zusammenfassung)

Siehe RESPONSIVE_AND_ACCESSIBILITY_MATRIX.md für Details.

| Breakpoint | Status | Kritische Issues |
|-----------|--------|-----------------|
| 1440px | ✅ | — |
| 1280px | ✅ | — |
| 1024px | ✅ | — |
| 768px | ✅ | Vendor-Tabellen zu breit |
| 390px | ⚠️ | Kalender unbrauchbar, Formulare ok |
| 360px | ⚠️ | Kalender unbrauchbar, Bottom-Nav eng |

**Mobile-Navigation:**
- ✅ Public: Responsive Header
- ✅ Portal: Sidebar (Desktop) → Bottom-Nav (Mobile) → Hamburger + Overlay
- ⚠️ Bottom-Nav nur 4 Items (begrenzt pro Rolle)
- ❌ Employee-Portal: keine Navigation

---

## Loading/Empty/Error State Matrix

| Status | Verbreitung | Bewertung |
|--------|------------|-----------|
| **Loading** | ✅ In ~80% der Pages (Suspense + LoadingFallback) | Gut, aber uneinheitlich: manche mit Skeleton, manche mit Spinner |
| **Empty** | ⚠️ In ~30% der Pages | Große Lücke: Marketplace, Dashboard, Bookings oft ohne Empty State |
| **Error** | ⚠️ Global ErrorBoundary + vereinzelt per-Page | Gut: Global-Catch. Schlecht: keine per-Component Error States mit Retry |
| **Success** | ⚠️ Toast (sonner), aber keine Inline-Success-States | Fehlt bei Form-Submits außerhalb von Toast |

---

## A11y-Zusammenfassung

Siehe RESPONSIVE_AND_ACCESSIBILITY_MATRIX.md für komplette WCAG 2.2 AA Checkliste (424 Zeilen).

### Scorecard (~45% WCAG 2.2 AA)
| Kategorie | Score |
|-----------|-------|
| Wahrnehmbar | ~55% |
| Bedienbar | ~35% |
| Verständlich | ~60% |
| Robust | ~40% |

### Top-5 A11y-Issues
1. 🔴 **Kein Skip-Link** — Screenreader müssen durch gesamte Navigation tabben
2. 🔴 **Fokus-Indikatoren fehlen** — kein `:focus-visible` Styling, Keyboard-Nutzer sehen nicht wo sie sind
3. 🔴 **Tertiärtext (#94A3B8) auf Weiß** — Kontrast 2.98:1 (AA braucht 4.5:1)
4. 🟠 **5 Seiten ohne `<main>`-Landmark** — Screenreader-Navigation behindert
5. 🟠 **Keine `prefers-reduced-motion`** — keine Rücksicht auf Bewegungseinschränkungen

---

## Priorisierte Fix-Liste

### P0 — Jetzt
| # | Issue | Betrifft | Aufwand |
|---|-------|----------|---------|
| 1 | Fokus-Indikatoren CSS | Global | 4h |
| 2 | Skip-Link | Global | 1h |
| 3 | `<main>`-Landmark auf 5 Seiten | Customer, Admin, Franchiser | 2h |
| 4 | Tertiärtext-Kontrast fixen | Global | 1h |

### P1 — Welle 1
| # | Issue | Betrifft | Aufwand |
|---|-------|----------|---------|
| 5 | Employee-Portal Shell + Routes | Employee | 8h |
| 6 | Empty States systematisch | Alle Portale | 6h |
| 7 | Vendor Packages/Products FE | Vendor | 8h |
| 8 | Customer Wallet/Payments/Favoriten FE | Customer | 10h |
| 9 | `prefers-reduced-motion` | Global | 2h |
| 10 | Form Error States (inline) | Global | 4h |

### P2 — Welle 2
| # | Issue | Betrifft | Aufwand |
|---|-------|----------|---------|
| 11 | Affiliate Campaigns + Stats FE | Affiliate | 6h |
| 12 | Kalender Mobile-Usability | Vendor, Customer | 12h |
| 13 | TypeScript-Migration (beginnen) | Global | 40h+ |
| 14 | Admin Support/System-Status | Admin | 6h |

### P3 — Welle 3+
| # | Issue | Betrifft | Aufwand |
|---|-------|----------|---------|
| 15 | WhiteLabel-Portal | WhiteLabel | 24h |
| 16 | Frontend-Tests | Global | 20h |
| 17 | Performance-Optimierung (Bundle-Splitting) | Global | 8h |

---

## Design-Qualität (subjektiv)

Basierend auf UI_UX_SKILL_REVIEW.md und eigener Prüfung:

| Dimension | Score (1-10) | Anmerkung |
|-----------|-------------|-----------|
| Visuelle Konsistenz | 7 | Farben/Tokens konsistent via CSS Custom Properties |
| Informationshierarchie | 6 | Klare Headlines, aber inkonsistente Card-Dichte |
| Typografie | 8 | Cabinet Grotesk (Heading) + IBM Plex Sans (Body) — gut gewählt |
| Farbsystem | 8 | Orange (#F59E0B) + Navy (#1A202C) — markant, professionell |
| Interaktions-Feedback | 5 | Sonner-Toasts gut, Button-Hover/Active fehlen oft |
| Motion | 4 | Kaum Animation, keine Stagger, keine Transition |
| Mobile UX | 6 | Bottom-Nav gut, Kalender/ Tabellen problematisch |
| Leerraum-Nutzung | 7 | Großzügig, Card-Dichte ok |
| Icon-Nutzung | 7 | Lucide Icons konsistent, semantisch passend |
| Gesamteindruck | 6.5 | Solide Basis, polierbedürftig |

---

## Nächste Schritte

1. Welle 0 abschließen → dieses Dokument finalisieren
2. Welle 1 starten: Employee-Portal + State-Systematik + A11y-Basis
3. Wave 2: Packages, Wallet-UI, Calendar-Mobile
