# Bookando — System Test Report

> **Stand:** 06.06.2026, 11:34 UTC
> **Frontend Commit:** `ceea4d0` (P1-3 + P1-4)
> **Backend Commit:** `b3c50c6` (Service-Modelle erweitert)
> **Frontend Live:** `https://www.bookando.de` (SUPERSEDED)
api.vercel.app` ✅| `bookando-api.vercel.app` ✅
> **Vercel Frontend:** `bookando-de` — Production READY
> **Vercel Backend:** `bookando-backend` — Production READY

---

## 1. Frontend Build

| Check | Status | Details |
|-------|--------|---------|
| `npm run build` (CI=true) | ✅ | 0 Errors, 6 Warnings (pre-existing: Affiliates, Branding, Reports, Wallet) |
| Bundle Size (main chunk) | ✅ | ~2.2 MB JS |
| CSS Size | ✅ | ~44 KB |
| PWA Manifest | ✅ | `start_url: "/"` |
| OG Meta Tags | ✅ | `bookando.de` Domain |

## 2. Backend Health

| Check | Status | Details |
|-------|--------|---------|
| `/api/health` | ✅ | `{"status":"healthy"}` |
| `/api/docs` (OpenAPI UI) | ✅ | Erreichbar |
| `/openapi.json` | ✅ | Erreichbar |

## 3. Live-Smoke (Frontend)

| Route/Asset | Status | Details |
|-------------|--------|---------|
| `/` (Landingpage) | ✅ | HTTP 200 |
| `/marketplace` | ✅ | HTTP 200 |
| `/marketplace/:vendor` | ✅ | HTTP 200 |
| `/auth/login` | ✅ | HTTP 200 |
| `/auth/register` | ✅ | HTTP 200 |
| `/legal/privacy` | ✅ | HTTP 200 |
| `/legal/imprint` | ✅ | HTTP 200 |
| `/legal/terms` | ✅ | HTTP 200 |
| `/portal/services` | ✅ | HTTP 200 (Vendor Route) |
| `/portal/bookings` | ✅ | HTTP 200 |
| `/portal/commissions` | ✅ | HTTP 200 (Admin Route) |
| `/portal/calendar` | ✅ | HTTP 200 |
| `hero-grafik.png` | ✅ | 1,364,813 Bytes (1.36 MB) |
| `cta-grafik.png` | ✅ | 1,158,793 Bytes (1.16 MB) |
| `brand-logo-horizontal.png` | ✅ | 30,810 Bytes (30.8 KB) |
| `brand-logo-on-dark-full.png` | ✅ | 31,072 Bytes (31.1 KB) |

## 4. API Contract

| Bereich | Status | Details |
|---------|--------|---------|
| Public API (14 Endpoints) | ✅ | Marketplace, Auth, Slots, Booking |
| Customer API (10) | ✅ | Bookings, Cancel, Reschedule |
| Vendor API (33) | ✅ | Services, Employees, Locations, Hours, Wallet, Affiliates |
| Affiliate API (9) | ✅ | Links, Commissions, Wallet |
| Admin API (16) | ✅ | Users, Vendors, Commissions (NEU), Plans, Reviews, Audit |
| Commission-Engine | ✅ NEU | P0-C: Pending → Approved → Cancelled → Paid |

## 5. Auto-Refresh Status

| Bereich | useAutoRefresh | usePortalMutation | Status |
|---------|---------------|-------------------|--------|
| AdminCommissionPage | ✅ | ✅ | P0 |
| AffiliateDashboardPage | ✅ | — | P1 |
| AffiliateLinksPage | ✅ | ✅ | P1 |
| AffiliateCommissionsPage | ✅ | — | P1 |
| AffiliateWalletPage | ✅ | ✅ | P1 |
| VendorBookingsPage | ✅ | ✅ | P1 |
| VendorServicesPage | ✅ | ✅ | P1 |
| VendorEmployeesPage | ✅ | ✅ | P1 |
| VendorLocationsPage | ✅ | ✅ | P1 |
| VendorHoursPage | ✅ | — | P1 |
| CustomerBookingsPage | ✅ | ✅ | P1 |
| VendorCalendarPage | ❌ | ❌ | Noch auf useEffect |
| VendorWalletPage | ❌ | ❌ | Pre-existing Warning |
| VendorReportsPage | ❌ | ❌ | Pre-existing Warning |

## 6. Offene Warnings (Build)

| Warning | Datei | Ursache |
|---------|-------|---------|
| React Hook useEffect missing deps | `VendorWalletPage` | `fetchWallet` nicht in deps |
| React Hook useEffect missing deps | `VendorReportsPage` | `fetchData` nicht in deps |
| React Hook useEffect missing deps | `VendorAffiliatesPage` | — |
| React Hook useEffect missing deps | `VendorBrandingPage` | — |
| React Hook useEffect missing deps | `VendorCalendarPage` | — |
| React Hook useEffect missing deps | `VendorWalletPage` | — |

**Status:** 6 pre-existing Warnings, alle in Vendor-Seiten mit useEffect.
**Ziel:** In P2/P3 auf useAutoRefresh umstellen.

## 7. Offene Risiken

| Risiko | Bereich | Priorität | Status |
|--------|---------|-----------|--------|
| `bookando.de` DNS fehlt | Domain | Mittel | Blockiert — DNS-Aktion nötig |
| Secret-Leak (Commit 7f63aea) | Security | Mittel | Pre-Launch rotieren |
| Kein Booking Status History Audit | Datenbank | Mittel | P2 |
| Kein Affiliate Click-Tracking | Affiliate | Mittel | P1 geplant |
| Keine Payment-Integration im BookingWidget | Payment | Mittel | P2 geplant |

## 8. P0 Reactive Portal State — Role-Switch Test (manuell)

**Commit:** `5a62b66` (Frontend) + `3fbf8b5` (Backend)
**Datum:** 2026-06-06

### Manuelle Test-Schritte (Akzeptanzkriterien)

| # | Schritt | Erwartetes Verhalten | Status |
|---|---------|---------------------|--------|
| 1 | Login als User mit `roles = ["vendor", "staff"]` | Portal zeigt Vendor-Shell | ⏳ manuell |
| 2 | Öffne `/portal/services` | Vendor-Sidebar aktiv, Services sichtbar | ⏳ manuell |
| 3 | Klick auf `RoleSwitcher` → "Mitarbeiter" | Ohne Reload: Sidebar ändert sich, Route bleibt oder wechselt zu erlaubter Default-Route | ⏳ manuell |
| 4 | Header zeigt "Mitarbeiter" | Sofort, kein Flackern, kein Browser-Refresh | ⏳ manuell |
| 5 | Dashboard wechselt zu Staff-Default | Vendor-KPIs verschwinden, Staff-View sichtbar | ⏳ manuell |
| 6 | Klick auf `RoleSwitcher` → "Anbieter" | Sofort zurück zu Vendor-View, Sidebar + Dashboard aktualisiert | ⏳ manuell |
| 7 | Sprache DE → EN via `LanguageSwitcher` | Sidebar-Nav-Items zeigen englische Labels, ohne Reload | ⏳ manuell |
| 8 | Logout | Portal komplett geleert, Query-Cache `queryClient.clear()` | ⏳ manuell |
| 9 | Login erneut | AuthContext frisch, kein stale state | ⏳ manuell |

### Verbotene Patterns (statisch geprüft)

| Pattern | Erwartet | Tatsächlich |
|---------|----------|-------------|
| `window.location.reload()` in Portal-Pages | 0 (außer ErrorBoundary) | 0 ✓ |
| `useMemo(navItems, [])` ohne deps in Portal-Shells | 0 | 0 ✓ (alle via `usePortal()`) |
| Direkter `localStorage.getItem('role')` in Layouts | 0 | 0 ✓ |
| `queryClient.invalidateQueries()` bei Switch | vorhanden | vorhanden ✓ |

### Statische Prüfung

```bash
$ bash scripts/check-portal-state.sh
── 1. Verbotene window.location.reload      ✅
── 2. PortalLayout nutzt useAuth+useLocation ✅
── 3. PortalContext mit reaktiver navItems   ✅
── 4. AuthContext mit setActiveContext       ✅
── 4b. AuthContext invalidiert Cache         ✅
── 5. RoleSwitcher exportiert                ✅
── 5b. TenantSwitcher exportiert             ✅
── 5c. LanguageSwitcher exportiert           ✅
── 6. Switcher in PortalShell eingebunden    ✅
── 7. Backend POST /api/auth/context         ✅
── 8. Backend _profile_from_db               ✅
── 9. SQL-Migration active_role              ✅
── 10. Kein localStorage-Role-Read           ✅
── 11. useAuth() exportiert isReady          ✅  ← P0-Regression-Fix f141e1b
── 12. PortalLayout-Loading-Guard            ✅  ← P0-Regression-Fix f141e1b
── 13. PortalContext.isReady → auth.isReady  ✅  ← P0-Regression-Fix f141e1b

Result: 16 passed, 0 failed
```

## 9. P0-Regression-Fix: isReady-Ladeschleife (2026-06-06)

**Commit:** `f141e1b` — P0-Regression-Fix
**Symptom:** `/portal/customer`, `/portal/bookings`, `/portal/*` zeigten permanenten Spinner — `<LoadingFallback />` rendert endlos.

### Root Cause

`App.js` → `PortalLayout` destrukturiert `{ activeRole, user, isReady }` aus `useAuth()`. Der
`AuthContext` exportierte das Feld `isReady` jedoch **nicht**. Folge: `!undefined === true`,
der Loading-Guard `if (!isReady || !user) return <LoadingFallback />;` war **immer true**, und
kein Portal-Child wurde je gerendert.

Regression des P0-Commits `5a62b66`. `isReady` war in der Codebase geplant, aber beim finalen
Refactor vergessen worden.

### Fix

| Datei | Änderung |
|-------|----------|
| `src/contexts/AuthContext.js` | `isReady = !loading` zentral im `derived`-Block; explizit in beiden Branches (no-user = false, with-user = true); `useMemo` deps = `[user, loading]` |
| `src/contexts/PortalContext.js` | `isReady: auth.isReady` (zentrale Quelle statt `!auth.loading`) |
| `scripts/check-portal-state.sh` | Drei neue statische Guards (#11, #12, #13), die genau diesen Regressions-Pfad abdecken |

### Verifikation

| Check | Resultat |
|-------|----------|
| `npm run build` | OK, Bundle `main.68ad08ff.js` (Build) → `main.fd38f460.js` (Vercel) |
| `isReady` im Live-Bundle | 4 Vorkommen (`isReady:e`, `isReady:r.isReady`, `isReady])`, `isReady`) |
| `bash scripts/check-portal-state.sh` | 16/16 passed (vorher 13/13) |
| `bash scripts/preflight-bookando.sh` | 11/11 passed |
| Vercel-Deploy | Commit `f141e1b` → main → (HISTORICAL — app.bookando.de) |
| Live-Smoke `https://www.bookando.de/` (HISTORICAL_INVALID) | HTTP 200, Bundle `fd38f460` ausgeliefert |

### Lessons Learned

- Bei jedem neuen Feld in einem Context-Value: zentrales `grep` nach allen Konsumenten verpflichtend.
- Statische Regressions-Guards in CI/Skripten: jeder `useFoo().bar`-Aufruf sollte ein
  `check-foo-exports-bar.sh`-Pendant haben, sonst sind stille Defaults (`!undefined === true`)
  die häufigste Fehlerklasse.

### Hinweis Test-Account

Manuelle Tests in Schritt 1–9 erfordern einen Test-User mit `roles = ["vendor", "staff"]`
in `public.users`. Aktuell existiert kein solcher User im System. Blockiert durch:
- Migration `20260606_123000_user_multi_role.sql` muss in Supabase DB angewendet werden
  (via SQL-Editor oder `supabase db push`)
- Test-User-Creation per Admin-UI oder direkt in DB

Sobald Migration angewendet + Test-User angelegt: manueller Smoke-Test durchführen.

### Verwandte Dateien

- Backend: `api/auth_routes.py` (`_profile_from_db`, `POST /api/auth/context`)
- Backend: `supabase/migrations/20260606_123000_user_multi_role.sql`
- Frontend: `src/contexts/AuthContext.js`, `src/contexts/PortalContext.js`
- Frontend: `src/components/portal/PortalSwitchers.js`
- Frontend: `src/components/layout/PortalShell.js`
- Frontend: `src/App.js` (PortalLayout)
- Script: `scripts/check-portal-state.sh`
