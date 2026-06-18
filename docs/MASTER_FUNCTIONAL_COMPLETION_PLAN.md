# Bookando — Master Functional Completion Plan

> **Stand:** 06.06.2026 | **Priorität:** P0-P4
> **Frontend:** `nexifyai-dev/bookando-de` | **Backend:** `nexifyai-dev/bookando-api`
> **Live:** `https://www.bookando.de` (SUPERSEDED — alt: `app.bookando.de`)

---

## 1. Öffentliches System (Public)

| # | Funktion | Seite/Komponente | API | Status | Prio |
|---|----------|-----------------|-----|--------|------|
| 1 | Landingpage | HomePage | — | ✅ | P0 |
| 2 | Marketplace Suche | MarketplacePage | ✅ | ✅ | P0 |
| 3 | Marketplace Filter | MarketplacePage | ✅ | ✅ | P0 |
| 4 | Vendor-Detailseite | VendorDetailPage | ✅ | ✅ | P0 |
| 5 | Service-Liste öffentlich | VendorDetailPage | ✅ | ✅ | P0 |
| 6 | BookingWidget | VendorDetailPage | ✅ | ✅ | P0 |
| 7 | CTA-/Hero-Grafiken | HomePage | — | ✅ | P0 |
| 8 | Preise/Pläne | PricingPage | — | ✅ | P0 |
| 9 | Kontakt | ContactPage | — | ✅ | P0 |
| 10 | Features | FeaturesPage | — | ✅ | P0 |
| 11 | Legal DE/EN | LegalPage | — | ✅ | P0 |
| 12 | Mehrsprachigkeit DE/EN | i18n | — | ✅ | P0 |
| 13 | SEO/Meta/OG | SEOHead | — | ✅ | P0 |
| 14 | responsive Mobile | Alle | — | ⚠️ | P2 |
| 15 | Assets/Logos/Grafiken | images/ | — | ✅ | P0 |

## 2. Kundenportal (Customer)

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Registrierung | RegisterPage | ✅ | ✅ | P0 |
| 2 | Login | LoginPage | ✅ | ✅ | P0 |
| 3 | Passwort vergessen | ForgotPasswordPage | ✅ | ✅ | P0 |
| 4 | Passwort zurücksetzen | ResetPasswordPage | ✅ | ✅ | P0 |
| 5 | E-Mail verifizieren | VerifyEmailPage | ✅ | ✅ | P0 |
| 6 | TOTP 2FA | LoginPage | ✅ | ❌ UI fehlt | P2 |
| 7 | Profil anzeigen/bearbeiten | CustomerProfilePage | ✅ | ✅ | P1 |
| 8 | Eigene Buchungen | CustomerBookingsPage | ✅ | ✅ | P1 |
| 9 | Buchungshistorie | CustomerBookingsPage | ✅ | ✅ | P1 |
| 10 | Buchung stornieren | CustomerBookingsPage | ✅ | ✅ | P1 |
| 11 | Buchung umbuchen | CustomerBookingsPage | ✅ | ✅ | P1 |
| 12 | Zahlungsstatus | CustomerBookingsPage | ✅ | ⚠️ Teilw. | P1 |
| 13 | Rechnungen/Belege | ❌ Fehlt | ✅ | ❌ | P2 |
| 14 | Bewertungen | CustomerBookingsPage | ✅ | ⚠️ Teilw. | P2 |
| 15 | Favoriten/Merkliste | ❌ Fehlt | ✅ | ❌ | P2 |
| 16 | Benachrichtigungseinstellungen | ❌ Fehlt | ✅ | ❌ | P2 |
| 17 | Datenschutz-/Account-Optionen | CustomerProfilePage | ✅ | ⚠️ Teilw. | P2 |
| 18 | Support-Anfragen | ❌ Fehlt | ❌ | ❌ | P3 |
| 19 | Nachrichten/Kommunikation mit Anbieter | ❌ Fehlt | ❌ | ❌ | P3 |

## 3. Vendor-/Anbieterportal (Vendor) — **9 von 18 Funktionen vollständig**

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Onboarding/Ersteinrichtung | ❌ Fehlt | ✅ | ❌ | **P1** |
| 2 | Trial-/Plan-Status | VendorDashboard | ✅ | ⚠️ Teilw. | P1 |
| 3 | Unternehmensprofil | VendorSettings | ✅ | ⚠️ Teilw. | P1 |
| 4 | Marketplace-Profil | VendorBrandingPage | ✅ | ✅ | P1 |
| 5 | Branding/Logo/Bilder | VendorBrandingPage | ✅ | ✅ | P1 |
| 6 | Öffnungszeiten | VendorHoursPage | ✅ | ✅ | P1 |
| 7 | Standorte | VendorLocationsPage | ✅ | ⚠️ Teilw. | P1 |
| 8 | Mitarbeiter | VendorEmployeesPage | ✅ | ⚠️ Teilw. | P1 |
| 9 | Rollen/Rechte f. Mitarbeiter | ❌ Fehlt | ❌ | ❌ | **P1** |
| 10 | Services | VendorServicesPage | ✅ | ⚠️ Teilw. | P1 |
| 11 | Pakete/Gutscheine | ❌ Fehlt | ✅ | ❌ | P2 |
| 12 | Ressourcen | ❌ Fehlt | ✅ | ❌ | P2 |
| 13 | Kalender | VendorCalendarPage | ✅ | ✅ | P1 |
| 14 | Buchungen | VendorBookingsPage | ✅ | ✅ | P1 |
| 15 | Kunden/CRM | VendorCustomersPage | ✅ | ⚠️ Teilw. | P1 |
| 16 | Umsatzübersicht/Reports | VendorReportsPage | ✅ | ⚠️ Teilw. | P1 |
| 17 | Wallet | VendorWalletPage | ✅ | ⚠️ Teilw. | P1 |
| 18 | Zahlungsanbieter verbinden | ❌ Fehlt | ✅ | ❌ | P2 |
| 19 | Affiliate-Partner | VendorAffiliatesPage | ✅ | ✅ | P1 |
| 20 | Bewertungen verwalten | ❌ Fehlt | ✅ | ❌ | P2 |
| 21 | Support/Help | ❌ Fehlt | ⚠️ Teilw. | ❌ | P3 |

## 4. Mitarbeiterportal (Staff) — **❌ Vollständig fehlend**

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Eigenes Dashboard | ❌ Fehlt | ✅ | ❌ | P3 |
| 2 | Eigene Termine | ❌ Fehlt | ✅ | ❌ | P3 |
| 3 | Tages-/Wochenansicht | ❌ Fehlt | ✅ | ❌ | P3 |
| 4 | Verfügbarkeit bearbeiten | ❌ Fehlt | ✅ | ❌ | P3 |
| 5 | Buchungsstatus ändern | ❌ Fehlt | ✅ | ❌ | P3 |
| 6 | Kundendetails (eingeschränkt) | ❌ Fehlt | ✅ | ❌ | P3 |
| 7 | Interne Notizen | ❌ Fehlt | ✅ | ❌ | P3 |
| 8 | Eingeschränkte Navigation | ❌ Fehlt | — | ❌ | P3 |

## 5. Affiliate-Portal — **1 von 11 Funktionen vorhanden**

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Dashboard/KPIs | AffiliateDashboardPage | ✅ | ✅ | P1 |
| 2 | Trackinglink-Generator | AffiliateLinksPage | ✅ | ✅ | P1 |
| 3 | Kampagnen | ❌ Fehlt | ❌ | ❌ | P2 |
| 4 | Klicks anzeigen | ❌ Fehlt | ⚠️ Teilw. | ❌ | P1 |
| 5 | Conversions anzeigen | AffiliateDashboardPage | ⚠️ Teilw. | ⚠️ | P1 |
| 6 | Commission-Liste | AffiliateCommissionsPage | ✅ | ✅ | P1 |
| 7 | Wallet Balance | AffiliateWalletPage | ✅ | ✅ | P1 |
| 8 | Payout Requests | AffiliateWalletPage | ✅ | ✅ | P1 |
| 9 | Performance-Reports | ❌ Fehlt | ⚠️ Teilw. | ❌ | P2 |
| 10 | Statushistorie | AffiliateCommissionsPage | ✅ | ⚠️ Teilw. | P1 |
| 11 | Auszahlungshistorie | AffiliateWalletPage | ✅ | ⚠️ Teilw. | P1 |

## 6. Plattform-Admin — **6 von 20 Funktionen vorhanden**

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Systemübersicht/KPIs | AdminDashboardPage | ✅ | ✅ | P0 |
| 2 | Nutzerverwaltung | AdminUsersPage | ✅ | ✅ | P0 |
| 3 | Vendorverwaltung | AdminVendorsPage | ✅ | ✅ | P0 |
| 4 | Buchungen prüfen | AdminDashboardPage | ✅ | ⚠️ Teilw. | P1 |
| 5 | Commission Review | AdminCommissionPage | ✅ | ✅ | P0 |
| 6 | Wallet/Ledger prüfen | ❌ Fehlt | ✅ | ❌ | P1 |
| 7 | Payout Review | ❌ Fehlt | ✅ | ❌ | P1 |
| 8 | Support-Tickets | ❌ Fehlt | ❌ | ❌ | P3 |
| 9 | Audit Logs | AdminAuditPage | ✅ | ✅ | P1 |
| 10 | Systemlogs | AdminAuditPage | ⚠️ Teilw. | ⚠️ | P2 |
| 11 | Reports | AdminDashboardPage | ✅ | ⚠️ Teilw. | P1 |
| 12 | Pläne/Tarife | AdminPlansPage | ✅ | ✅ | P1 |
| 13 | Subscriptions verwalten | AdminPlansPage | ✅ | ⚠️ Teilw. | P1 |
| 14 | Marketplace-Freigaben | ❌ Fehlt | ✅ | ❌ | P1 |
| 15 | Reviews moderieren | AdminReviewsPage | ✅ | ✅ | P1 |
| 16 | Content/Legal/FAQ | ❌ Fehlt | ❌ | ❌ | P3 |
| 17 | Rollen/Rechte | ❌ Fehlt | ❌ | ❌ | P3 |
| 18 | WhiteLabel-/Agenturpartner | ❌ Fehlt | ⚠️ Teilw. | ❌ | P3 |
| 19 | Domains | ❌ Fehlt | ❌ | ❌ | P3 |
| 20 | Systemstatus | AdminDashboardPage | ✅ | ⚠️ Teilw. | P1 |

## 7. WhiteLabel-/Agentur-/Franchise — **❌ 0 von 8 vorhanden**

| # | Funktion | Seite | API | Status | Prio |
|---|----------|-------|-----|--------|------|
| 1 | Eigene Anbieter verwalten | FranchiserVendorsPage | ✅ | ⚠️ | P3 |
| 2 | Eigenes Branding | ❌ Fehlt | ✅ | ❌ | P3 |
| 3 | Eigene Domains | ❌ Fehlt | ❌ | ❌ | P3 |
| 4 | Eigene Marketplace-Struktur | ❌ Fehlt | ❌ | ❌ | P3 |
| 5 | Eigene Kunden/Vendors | ❌ Fehlt | ✅ | ❌ | P3 |
| 6 | Provisionen | ❌ Fehlt | ❌ | ❌ | P3 |
| 7 | Reports | ❌ Fehlt | ✅ | ❌ | P3 |
| 8 | Support-Sicht | ❌ Fehlt | ❌ | ❌ | P3 |

---

## 8. Bearbeitungsfunktionen (Horizontal)

| # | Funktion | Verfügbarkeit | API | Status | Prio |
|---|----------|--------------|-----|--------|------|
| A1 | Buchung erstellen | BookingWidget | ✅ | ✅ | P0 |
| A2 | Buchung bestätigen | VendorBookingsPage | ✅ | ⚠️ | P1 |
| A3 | Buchung ablehnen | VendorBookingsPage | ✅ | ❌ | P1 |
| A4 | Buchung stornieren | CustomerBookingsPage | ✅ | ✅ | P1 |
| A5 | Buchung umbuchen | CustomerBookingsPage | ✅ | ✅ | P1 |
| A6 | No-Show markieren | ❌ Fehlt | ❌ | ❌ | P2 |
| A7 | Abgeschlossen markieren | ❌ Fehlt | ✅ | ❌ | P2 |
| A8 | Refund vorbereiten | ❌ Fehlt | ❌ | ❌ | P2 |
| A9 | Interne Notiz | ❌ Fehlt | ✅ | ❌ | P2 |
| A10 | Kunde benachrichtigen | ❌ Fehlt | ❌ | ❌ | P2 |
| A11 | Statushistorie anzeigen | ❌ Fehlt | ✅ | ❌ | P2 |
| A12 | AuditLog schreiben | AdminAuditPage | ✅ | ✅ | P1 |
| A13 | Slot freigeben/blockieren | VendorCalendarPage | ✅ | ⚠️ | P2 |
| B1 | Tagesansicht Kalender | VendorCalendarPage | ✅ | ✅ | P1 |
| B2 | Wochenansicht Kalender | VendorCalendarPage | ✅ | ✅ | P1 |
| B3 | Mitarbeiterfilter | VendorCalendarPage | ✅ | ⚠️ | P1 |
| B4 | Standortfilter | VendorCalendarPage | ✅ | ❌ | P2 |
| B5 | Servicefilter | VendorCalendarPage | ✅ | ❌ | P2 |
| B6 | Statusfilter | VendorCalendarPage | ✅ | ❌ | P2 |
| B7 | Blockzeiten setzen | VendorHoursPage | ✅ | ⚠️ | P2 |
| C1 | Service erstellen | VendorServicesPage | ✅ | ✅ | P1 |
| C2 | Service bearbeiten | VendorServicesPage | ✅ | ✅ | P1 |
| C3 | Service deaktivieren | VendorServicesPage | ✅ | ✅ | P1 |
| C4 | Preis/Dauer/Puffer ändern | VendorServicesPage | ✅ | ✅ | P1 |
| C5 | Mitarbeiter zuordnen | VendorServicesPage | ✅ | ⚠️ | P1 |
| C6 | Standort zuordnen | VendorServicesPage | ✅ | ⚠️ | P2 |
| C7 | Bilder/Icons | ❌ Fehlt | ✅ | ❌ | P2 |
| D1 | Kunde anlegen | VendorCustomersPage | ✅ | ✅ | P1 |
| D2 | Kunde bearbeiten | VendorCustomersPage | ✅ | ✅ | P1 |
| D3 | Notizen | VendorCustomersPage | ✅ | ⚠️ | P1 |
| D4 | Tags | ❌ Fehlt | ✅ | ❌ | P2 |
| D5 | Segmente | ❌ Fehlt | ❌ | ❌ | P3 |
| E1 | Checkout-Session | BookingWidget | ✅ | ⚠️ | P1 |
| E2 | Payment-Status | CustomerBookingsPage | ✅ | ⚠️ | P1 |
| E3 | Rechnung/Beleg | ❌ Fehlt | ❌ | ❌ | P2 |
| E4 | Subscription-Wechsel | ❌ Fehlt | ✅ | ❌ | P1 |
| E5 | Plattformgebühren | ❌ Fehlt | ✅ | ❌ | P2 |
| F1 | Ledger append-only | ✅ Dokumentiert | ✅ | ⚠️ | P0 |
| F2 | Gegenbuchungen | ❌ Fehlt | ❌ | ❌ | P3 |
| F3 | Payout beantragen | VendorWalletPage | ✅ | ✅ | P1 |
| F4 | Payout freigeben | ❌ Fehlt Admin | ✅ | ❌ | P1 |
| G1 | Trackinglink erstellen | AffiliateLinksPage | ✅ | ✅ | P1 |
| G2 | Klick erfassen | ❌ Fehlt | ❌ | ❌ | P2 |
| G3 | Commission pending | ✅ Automatisch | ✅ | ✅ | P0 |
| G4 | Commission approved | AdminCommissionPage | ✅ | ✅ | P0 |
| G5 | Doppelprovision verhindern | ✅ commission_routes | ✅ | ✅ | P0 |
| H1 | Support-Ticket erstellen | ❌ Fehlt | ⚠️ | ❌ | P3 |
| H2 | Ticket bearbeiten (Admin) | ❌ Fehlt | ⚠️ | ❌ | P3 |
| I1 | Booking Confirmation Mail | ❌ Fehlt | ✅ | ❌ | P1 |
| I2 | Password Reset Mail | ✅ Vorhanden | ✅ | ✅ | P0 |
| I3 | Commission Status Mail | ❌ Fehlt | ❌ | ❌ | P2 |
| I4 | Trial Ending Mail | ❌ Fehlt | ❌ | ❌ | P2 |

---

## 9. Zusammenfassung nach Rolle

| Rolle | Vorhanden | Teilweise | Fehlt | Gesamt | Erfüllung |
|-------|-----------|-----------|-------|--------|-----------|
| Public | 14 | 1 | 0 | 15 | **93%** ✅ |
| Customer | 11 | 3 | 5 | 19 | **58%** ⚠️ |
| Vendor | 9 | 9 | 4 | 22 | **41%** ⚠️ |
| Mitarbeiter | 0 | 0 | 8 | 8 | **0%** ❌ |
| Affiliate | 5 | 4 | 2 | 11 | **45%** ⚠️ |
| Admin | 6 | 8 | 6 | 20 | **30%** ❌ |
| WhiteLabel | 1 | 1 | 7 | 9 | **11%** ❌ |
| **Gesamt System** | **46** | **26** | **32** | **104** | **44%** ⚠️ |

---

## 10. Priorisierte Umsetzungspakete

| Paket | Prio | Funktionen | Geschätzter Aufwand |
|-------|------|------------|-------------------|
| **Vendor-Onboarding** | P1 | Trial-Status, Profil, Services fertigstellen | ~4h |
| **Customer Bookings** | P1 | Status-Update, Rechnungen, Bewertungen | ~4h |
| **Affiliate Dashboard** | P1 | Klick-Tracking, Conversions, Reports | ~3h |
| **Admin Payout** | P1 | Payout Review, Wallet-Prüfung | ~3h |
| **Payment BookingWidget** | P1 | Checkout-Integration, Status | ~6h |
| **Mitarbeiter Portal** | P3 | Terminansicht, Verfügbarkeit | ~8h |
| **WhiteLabel/Franchise** | P3 | Branding, Domains, Provisionen | ~12h |
| **Support/Tickets** | P3 | Ticket-System, Admin Center | ~8h |
| **Notifications/E-Mail** | P2 | Templates, Events verschicken | ~6h |
| **Mobile Optimierung** | P4 | Touch Targets, Kalender mobil | ~4h |
