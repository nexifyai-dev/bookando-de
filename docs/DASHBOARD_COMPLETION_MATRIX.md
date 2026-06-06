# Bookando — Dashboard Completion Matrix

> **Stand:** 06.06.2026

---

## 1. Admin Dashboard

| Seite | Existiert | API | Mock | Mobile | Status | Nächster Schritt |
|-------|-----------|-----|------|--------|--------|------------------|
| Dashboard/KPIs | ✅ AdminDashboardPage | ✅ | ⚠️ | ⚠️ | P1 | Charts durch API ersetzen |
| Vendors | ✅ AdminVendorsPage | ✅ | ❌ | ⚠️ | P1 | |
| Users | ✅ AdminUsersPage | ✅ | ❌ | ⚠️ | P1 | |
| Plans | ✅ AdminPlansPage | ✅ | ❌ | ⚠️ | P1 | |
| Reviews | ✅ AdminReviewsPage | ✅ | ❌ | ⚠️ | P1 | |
| Audit Logs | ✅ AdminAuditPage | ⚠️ | ❌ | ❌ | P1 | Tabellen-UI verbessern |
| Commission Review | ❌ **Fehlt** | ✅ NEU | ❌ | ❌ | **P0** | **Neue Seite nötig** |
| Payout Review | ❌ **Fehlt** | ✅ | ❌ | ❌ | P1 | |
| Marketplace Freigaben | ❌ **Fehlt** | ✅ | ❌ | ❌ | P1 | |
| Reports | ✅ AdminReports | ✅ | ❌ | ❌ | P1 | |

## 2. Vendor/Inhaber Dashboard — **9 von 12 Seiten vorhanden**

| Seite | Existiert | API | Mock | Mobile | Status |
|-------|-----------|-----|------|--------|--------|
| Übersicht/KPIs | ✅ VendorDashboardPage | ✅ | ⚠️ | ⚠️ | P1 |
| Buchungen | ✅ VendorBookingsPage | ✅ | ❌ | ⚠️ | P1 |
| Kalender | ❌ **Fehlt** | ✅ | — | ❌ | **P1** |
| Services | ✅ VendorServicesPage | ✅ | ⚠️ | ⚠️ | P1 |
| Pakete/Gutscheine | ❌ **Fehlt** | ✅ | — | ❌ | P2 |
| Mitarbeiter | ✅ VendorEmployeesPage | ✅ | ⚠️ | ⚠️ | P1 |
| Standorte | ✅ VendorLocationsPage | ✅ | ⚠️ | ⚠️ | P1 |
| Kunden/CRM | ✅ VendorCustomersPage | ✅ | ⚠️ | ⚠️ | P1 |
| Marketplace-Profil | ✅ VendorBrandingPage | ✅ | ❌ | ⚠️ | P1 |
| Affiliate-Partner | ✅ VendorAffiliatesPage | ✅ | ❌ | ⚠️ | P1 |
| Wallet/Umsätze | ✅ VendorWalletPage | ✅ | ⚠️ | ⚠️ | P1 |
| Reports | ✅ VendorReportsPage | ✅ | ❌ | ⚠️ | P1 |

## 3. Customer Dashboard — **2 von 4 benötigt**

| Seite | Existiert | API | Mock | Mobile | Status |
|-------|-----------|-----|------|--------|--------|
| Meine Buchungen | ✅ CustomerBookingsPage | ✅ | ❌ | ⚠️ | P1 |
| Buchungshistorie | ✅ CustomerBookingsPage | ✅ | ❌ | ⚠️ | P1 (gleiche Seite) |
| Profil | ❌ | ✅ | — | ❌ | **P1** |
| Favoriten | ❌ | ✅ | — | ❌ | P2 |

## 4. Affiliate Dashboard — **❌ Fehlt komplett**

| Seite | Existiert | API | Status |
|-------|-----------|-----|--------|
| Übersicht/KPIs | ❌ **Fehlt** | ✅ affiliate_routes | **P1** |
| Trackinglinks | ❌ **Fehlt** | ✅ | P1 |
| Kampagnen | ❌ **Fehlt** | ❌ | P2 |
| Klicks/Conversions | ❌ **Fehlt** | ⚠️ Teilw. | P1 |
| Provisionen | ❌ **Fehlt** | ✅ NEU | P1 |
| Wallet/Payout | ❌ **Fehlt** | ✅ wallet_routes | P1 |

## 5. Mitarbeiter Dashboard — **❌ Fehlt (P2)**

| Seite | Existiert | API | Status |
|-------|-----------|-----|--------|
| Eigene Termine | ❌ | ✅ bookings_routes | P2 |
| Verfügbarkeit | ❌ | ✅ employees + hours | P2 |
| Tages-/Wochenansicht | ❌ | ✅ | P2 |

## 6. WhiteLabel/Agentur Dashboard — **❌ Rudimentär (P2)**

| Seite | Existiert | API | Status |
|-------|-----------|-----|--------|
| Eigene Vendors | ⚠️ | ✅ franchise_routes | P2 |
| Branding | ❌ | ✅ branding_routes | P2 |
| Domains | ❌ | ❌ | P2 |
| Provisionen | ❌ | ❌ | P2 |

---

## Nächste Umsetzungspakete

| Prio | Paket | Seiten | Geschätzter Aufwand |
|------|-------|--------|-------------------|
| **P0** | Admin Commission Review | admin_dashboard, commission_approve | ~2h |
| **P1** | Affiliate Dashboard | KPI-Cards, Links, Provisionen | ~6h |
| **P1** | Vendor Calendar | Kalender-Ansicht mit Terminen | ~4h |
| **P1** | Customer Profile | Profil-Seite | ~2h |
| **P1** | Mock-Daten Vendor | Services, Employees, Locations | ~4h |
| **P2** | Mitarbeiter Dashboard | Termin-Ansicht, Verfügbarkeit | ~6h |
| **P2** | WhiteLabel | Franchiser-Branding | ~8h |
