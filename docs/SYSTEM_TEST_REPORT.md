# Bookando — System Test Report

> **Stand:** 06.06.2026, 11:34 UTC
> **Frontend Commit:** `ceea4d0` (P1-3 + P1-4)
> **Backend Commit:** `b3c50c6` (Service-Modelle erweitert)
> **Frontend Live:** `app.bookando.de` ✅
> **Backend Live:** `bookando-backend.vercel.app` ✅ | `bookando-api.vercel.app` ✅
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
