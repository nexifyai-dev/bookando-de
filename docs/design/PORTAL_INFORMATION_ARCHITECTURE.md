# Bookando — Portal-Informationsarchitektur

> **Stand:** 18.06.2026 | **Portale:** 7 | **Seiten:** 65+ | **API-Endpoints:** 186+
>
> **Quellen:**
> - `/docs/PORTAL_ACTION_MATRIX.md` (120+ Aktionen)
> - `/docs/PRODUKTSTRUKTUR.md` (17 Module, 10 Entitäten)
> - `/docs/requirements/PFLICHTENHEFT_TRACEABILITY.md` (151 Anforderungen)
> - `/src/App.js` (Frontend-Routing)
> - `/src/contexts/AuthContext.js` (Rollen/Permissions)
> - `bookando-api/api/index.py` + alle `*_routes.py` (Backend-Endpoints)

---

## Inhaltsverzeichnis

1. [Rollen-Hierarchie & Berechtigungen](#1-rollen-hierarchie--berechtigungen)
2. [Portal 1: Public Visitor](#2-portal-1-public-visitor)
3. [Portal 2: Customer](#3-portal-2-customer)
4. [Portal 3: Vendor](#4-portal-3-vendor)
5. [Portal 4: Employee (Staff)](#5-portal-4-employee-staff)
6. [Portal 5: Affiliate](#6-portal-5-affiliate)
7. [Portal 6: Admin](#7-portal-6-admin)
8. [Portal 7: WhiteLabel / Franchise](#7-portal-7-whitelabel--franchise)
9. [API-Endpoint-Verzeichnis (Global)](#8-api-endpoint-verzeichnis-global)
10. [Status-Matrix (Gesamt)](#9-status-matrix-gesamt)

---

## 1. Rollen-Hierarchie & Berechtigungen

```
Platform Admin / Super Admin
  ├── WhiteLabel Partner / Agentur
  │     └── Vendors (dieser Partner)
  ├── Franchise-Geber
  │     └── Vendors (dieses Franchise)
  ├── Vendor / Inhaber
  │     ├── Mitarbeiter (Staff)
  │     └── Affiliates (dieses Vendors)
  └── Kunde / Customer
```

### Permission-Matrix (Frontend)

| Bereich | Customer | Staff | Vendor | Affiliate | Franchiser | Admin |
|---------|----------|-------|--------|-----------|------------|-------|
| Marketplace durchsuchen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Termin buchen | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Eigene Buchungen sehen | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Alle Vendor-Buchungen | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Vendor verwalten | ❌ | ❌ | ✅ | ❌ | Eigene | ✅ |
| Services verwalten | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Mitarbeiter verwalten | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Affiliate-Links erstellen | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Wallet/Provision sehen | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Auszahlung beantragen | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| CRM nutzen | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Marketplace-Moderation | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Systemkonfiguration | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audit-Logs einsehen | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Permission-Scopes (AuthContext)

| Rolle | Scopes |
|-------|--------|
| `super_admin` | `*` |
| `admin` | `portal:*`, `admin:*`, `vendor:*`, `staff:*`, `customer:*`, `affiliate:*`, `reports:*` |
| `vendor` | `portal:*`, `vendor:*`, `staff:*`, `reports:vendor`, `services:*`, `bookings:*` |
| `staff` | `portal:read`, `staff:*`, `bookings:read`, `calendar:read` |
| `customer` | `customer:*`, `bookings:own` |
| `affiliate` | `affiliate:*`, `commission:own` |
| `franchiser` | `franchiser:*`, `reports:franchise` |

---

## 2. Portal 1: Public Visitor

**Rolle:** Keine (unauthentifiziert)  
**Layout:** Public (PublicNav, PublicFooter)  
**Ziel:** Plattform kennenlernen, Services durchsuchen, Termine buchen, registrieren

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen |
|---|-------|----------|-----------|---------------|---------------------|
| 1 | **Startseite** | `/` | `HomePage` | `GET /api/stats` | Loading: Hero-Skeleton. Leer: N/A. Error: Banner mit Reload. Success: Hero, Stats, Featured-Vendors |
| 2 | **Marketplace** | `/marketplace` | `MarketplacePage` | `GET /api/marketplace`, `GET /api/marketplace/categories` | Loading: Grid-Skeletons. Leer: "Keine Anbieter gefunden"-State. Error: Retry-Button. Success: Vendor-Karten |
| 3 | **Vendor-Detail** | `/marketplace/:slug` | `VendorDetailPage` | `GET /api/marketplace/{vendor_id}`, `GET /api/marketplace/{vendor_id}/services`, `GET /api/marketplace/{vendor_id}/reviews`, `POST /api/bookings/slots` | Loading: Profil-Skeleton. Leer: N/A (404). Error: 404/500-State. Success: Profil, Services, Bewertungen, Slot-Picker |
| 4 | **Funktionen** | `/features` | `FeaturesPage` | — (statisch) | Loading: N/A. Leer: N/A. Error: N/A. Success: Feature-Liste |
| 5 | **Preise** | `/pricing` | `PricingPage` | `GET /api/plans`, `GET /api/plans/{tier}` | Loading: Plan-Skeletons. Leer: N/A (Fallback-Default-Pläne). Error: Fallback-Pläne anzeigen. Success: Plan-Karten |
| 6 | **Über uns** | `/about` | `AboutPage` | — (statisch) | Loading: N/A. Leer: N/A. Error: N/A. Success: Über-uns-Text |
| 7 | **Kontakt** | `/contact` | `ContactPage` | `POST /api/help/tickets` (bei Formular) | Loading: Formular. Leer: N/A. Error: Server-Validierung anzeigen. Success: "Nachricht gesendet"-Toast |
| 8 | **Login** | `/auth/login` | `LoginPage` | `POST /api/auth/login`, `POST /api/totp/login` | Loading: Button-Spinner. Leer: Formular. Error: "E-Mail oder Passwort ungültig". Success: Redirect → `/portal` |
| 9 | **Registrierung** | `/auth/register` | `RegisterPage` | `POST /api/auth/register` | Loading: Button-Spinner. Leer: Formular. Error: "E-Mail bereits registriert". Success: Auto-Login → `/portal` |
| 10 | **Passwort vergessen** | `/auth/forgot-password` | `ForgotPasswordPage` | `POST /api/auth/forgot-password` | Loading: Button-Spinner. Leer: Formular. Error: Generischer "E-Mail gesendet falls registriert". Success: "E-Mail gesendet"-Hinweis |
| 11 | **Passwort zurücksetzen** | `/auth/reset-password` | `ResetPasswordPage` | `POST /api/auth/reset-password` | Loading: Button-Spinner. Leer: Formular mit Token. Error: "Token ungültig/abgelaufen". Success: "Passwort geändert" + Login-Link |
| 12 | **E-Mail bestätigen** | `/auth/verify-email` | `VerifyEmailPage` | — (Client-seitig) | Loading: "Wird verarbeitet...". Success: "E-Mail bestätigt". Error: "Link ungültig" |
| 13 | **Impressum** | `/legal/imprint` | `LegalPage type="imprint"` | — (statisch) | Loading: N/A. Success: Impressumsdaten |
| 14 | **Datenschutz** | `/legal/privacy` | `LegalPage type="privacy"` | — (statisch) | Loading: N/A. Success: Datenschutzerklärung |
| 15 | **AGB** | `/legal/terms` | `LegalPage type="terms"` | — (statisch) | Loading: N/A. Success: AGB-Text |
| 16 | **Cookie-Richtlinie** | `/legal/cookies` | `LegalPage type="cookies"` | — (statisch) | Loading: N/A. Success: Cookie-Text |
| 17 | **404** | `*` (Wildcard) | `NotFoundPage` | — | 404-Message |

### Redirects (Public)

| Von | Nach |
|-----|------|
| `/privacy` | `/legal/privacy` |
| `/legal` | `/legal/imprint` |
| `/terms` | `/legal/terms` |
| `/cookies` | `/legal/cookies` |
| `/dashboard` | `/portal` |

### Gemeinsame Komponenten

- `PublicNav` — Topbar mit Logo, Marketplace-Link, Login/Register, LanguageSwitcher
- `PublicFooter` — Footer mit Links (Features, Pricing, About, Contact, Legal)
- `LanguageSwitcher` — DE/EN-Umschalter (persistiert via i18n)
- `CookieBanner` — Cookie-Consent-Banner
- `SEOHead` — Meta-Tags pro Seite (Helmet)
- `BookingWidget` — Service→Slot→Buchung-Widget (auf VendorDetailPage, FEHLT als dedizierte Komponente)

### Suchflüsse

1. **Marketplace-Direktsuche:** `/marketplace` → Filter (Kategorie, Standort, Name) → Vendor-Karten → Vendor-Detail
2. **Direktlink:** `/marketplace/:slug` → Direktaufruf einer Vendor-Seite
3. **Bookando.de-Startseite:** Hero → "Jetzt Anbieter finden" → Marketplace

---

## 3. Portal 2: Customer

**Rolle:** `customer`  
**Layout:** `CustomerPortal` (PortalShell mit Customer-Nav)  
**Default-Route:** `/portal/customer` (tatsächlich: `/portal` mit Customer-Dashboard)  
**Permission-Scope:** `customer:*`, `bookings:own`

### Navigation (Sidebar)

| Pfad | Label | Icon |
|------|-------|------|
| `/portal` | Übersicht | CalendarClock |
| `/portal/bookings` | Meine Termine | CalendarCheck |
| `/portal/profile` (settings) | Profil | User |

### Mobile-Nav

| Pfad | Label | Icon |
|------|-------|------|
| `/portal` | Dashboard | LayoutDashboard |
| `/portal/bookings` | Buchungen | CalendarCheck |
| `/portal/vouchers` | Gutscheine | Ticket |
| `/portal/profile` | Profil | UserCircle |

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen |
|---|-------|----------|-----------|---------------|---------------------|
| 1 | **Dashboard** | `/portal` (→ `/portal` = Customer) | `CustomerDashboardPage` | `GET /api/customer/upcoming`, `GET /api/customer/history` (optional) | Loading: Stat-Cards-Skeleton. Leer: "Noch keine Buchungen"-CTA. Error: Retry-Button. Success: Bevorstehende Buchungen, Historie |
| 2 | **Buchungen** | `/portal/bookings` | `CustomerBookingsPage` | `GET /api/customer/bookings`, `PATCH /api/bookings/{id}` (umschichten), `DELETE /api/bookings/{id}` (stornieren) | Loading: Buchungslisten-Skeleton. Leer: "Keine Buchungen". Error: Retry. Success: Listen-Ansicht mit Status-Filter |
| 3 | **Wiederkehrende Termine** | `/portal/recurring` | `CustomerRecurringPage` | (Noch keine dedizierte API — P2) | Loading: Skeleton. Leer: "Keine Serientermine". Error: N/A. Success: Serien-Liste |
| 4 | **Gutscheine** | `/portal/vouchers` | `CustomerVouchersPage` | `GET /api/customer/vouchers` (geplant) | Loading: Skeleton. Leer: "Keine Gutscheine". Error: Retry. Success: Gutschein-Liste |
| 5 | **Profil** | `/portal/profile` | `CustomerProfilePage` | `GET /api/auth/me` (via AuthContext), `PUT /api/auth/profile`, `DELETE /api/auth/account`, `POST /api/uploads/avatar` | Loading: Form-Skeleton. Leer: N/A. Error: Validierungsfehler. Success: "Profil aktualisiert"-Toast |
| 6 | **Einstellungen** | `/portal/settings` | `CustomerProfilePage` (gleiche Komponente) | wie Profil | Wie Profil |

### API-Endpoints (Customer-spezifisch)

| Methode | Pfad | Beschreibung | Status |
|---------|------|-------------|--------|
| GET | `/api/customer/bookings` | Eigene Buchungen (mit Vendor-Namen angereichert) | ✅ |
| GET | `/api/customer/upcoming` | Bevorstehende Buchungen (pending, confirmed) | ✅ |
| GET | `/api/customer/history` | Vergangene Buchungen (completed, cancelled, no_show) | ✅ |
| GET | `/api/customer/favorites` | Favorisierte Vendoren | ✅ |
| POST | `/api/customer/favorites/{vendor_id}` | Favorit toggeln | ✅ |
| PUT | `/api/auth/profile` | Eigenes Profil aktualisieren | ✅ |
| DELETE | `/api/auth/account` | Account löschen (DSGVO) | ✅ |
| GET | `/api/notifications` | Benachrichtigungen | ✅ |
| PUT | `/api/notifications/read-all` | Alle als gelesen markieren | ✅ |
| POST | `/api/help/tickets` | Support-Ticket erstellen | ✅ |
| GET | `/api/help/tickets` | Eigene Tickets | ✅ |

### State-Matrix (Customer)

| State | Bedingung | UI-Verhalten |
|-------|-----------|-------------|
| **Loading** | API-Daten werden geladen | Skeleton-Karten/Listen anzeigen |
| **Empty** | Keine Buchungen/Favoriten vorhanden | Empty-State mit CTA: "Anbieter entdecken" (Link zu /marketplace) |
| **Error** | API-Fehler (401, 403, 500) | Error-Banner mit Retry-Button. 401: Auto-Redirect → /auth/login |
| **Success** | Daten vorhanden | Listen mit Status-Badges, Aktionen (Stornieren, Umbuchen, Bewerten) |
| **Optimistic** | Storno/Umbuchung wird gesendet | Sofortige UI-Aktualisierung, Rollback bei Fehler |

### Fehlende Features (IST-Lücken)

| Feature | Grund | Prio |
|---------|-------|------|
| Bewertung abgeben | Frontend-Komponente fehlt, API vorhanden | P2 |
| Favoriten verwalten | API vorhanden, Frontend-Seite fehlt | P2 |
| Benachrichtigungen | API vorhanden, UI fehlt im Portal | P2 |
| Rechnung/Beleg herunterladen | Kein API-Endpoint, kein Frontend | P2 |
| Support-Tickets einsehen | API vorhanden, Frontend fehlt | P3 |
| Umbuchungs-UI | API vorhanden, Frontend fehlt | P1 |
| Zahlungsstatus prüfen | API vorhanden, Darstellung inkonsistent | P1 |

---

## 4. Portal 3: Vendor

**Rolle:** `vendor` (auch: `staff`, `admin`, `super_admin` können Vendor-View nutzen)  
**Layout:** `VendorPortal` (PortalShell mit Vendor-Nav)  
**Default-Route:** `/portal/vendor` (tatsächlich: `/portal` → VendorDashboardPage)  
**Permission-Scope:** `portal:*`, `vendor:*`, `staff:*`, `reports:vendor`, `services:*`, `bookings:*`

### Navigation (Sidebar)

| Pfad | Label | Icon |
|------|-------|------|
| `/portal/vendor` | Vendor Dashboard | Store |
| `/portal/services` | Leistungen | Briefcase |
| `/portal/employees` | Mitarbeiter | Users |
| `/portal/calendar` | Kalender | CalendarDays |
| `/portal/bookings` | Buchungen | CalendarCheck |
| `/portal/customers` | Kunden (CRM) | Contact |
| `/portal/reports` | Berichte | BarChart3 |

### Mobile-Nav

| Pfad | Label | Icon |
|------|-------|------|
| `/portal` | Dashboard | LayoutDashboard |
| `/portal/bookings` | Buchungen | CalendarCheck |
| `/portal/services` | Leistungen | Briefcase |
| `/portal/settings` | Einstellungen | Settings |

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen |
|---|-------|----------|-----------|---------------|---------------------|
| 1 | **Dashboard** | `/portal` (Vendor) | `VendorDashboardPage` | `GET /api/vendor/stats`, `GET /api/vendors/stats` | Loading: Stat-Cards-Skeleton. Leer: Onboarding-Hinweis. Error: Retry. Success: Umsatz, Buchungen, Kunden, Auslastung |
| 2 | **Buchungen** | `/portal/bookings` | `VendorBookingsPage` | `GET /api/vendor/bookings`, `PATCH /api/bookings/{id}` (Status-Update), `DELETE /api/bookings/{id}` (Storno) | Loading: Listen-Skeleton. Leer: "Noch keine Buchungen". Error: Retry. Success: Liste mit Aktionen (Bestätigen, Ablehnen, Abschließen, No-Show) |
| 3 | **Kalender** | `/portal/calendar` | `VendorCalendarPage` | `GET /api/bookings/calendar` | Loading: Kalender-Skeleton. Leer: Leerer Kalender. Error: Retry. Success: Tages-/Wochenansicht mit Slots |
| 4 | **Leistungen** | `/portal/services` | `VendorServicesPage` | `GET /api/vendor/services`, `POST /api/vendor/services`, `PATCH /api/vendor/services/{id}`, `DELETE /api/vendor/services/{id}`, `POST /api/uploads/service-image` | Loading: List-Skeleton. Leer: "Erste Leistung anlegen"-CTA. Error: Validierung anzeigen. Success: CRUD-Tabelle/Karten |
| 5 | **Mitarbeiter** | `/portal/employees` | `VendorEmployeesPage` | `GET /api/vendor/employee-accounts`, `POST /api/vendor/employee-accounts`, `PATCH /api/vendor/employee-accounts/{id}`, `DELETE /api/vendor/employee-accounts/{id}`, `PUT /api/employees/{id}/schedule` | Loading: List-Skeleton. Leer: "Ersten Mitarbeiter anlegen"-CTA. Error: Validierung. Success: CRUD-Tabelle |
| 6 | **Standorte** | `/portal/locations` | `VendorLocationsPage` | `GET /api/vendor/locations`, `POST /api/vendor/locations`, `PATCH /api/vendor/locations/{id}`, `DELETE /api/vendor/locations/{id}` | Loading: List-Skeleton. Leer: "Ersten Standort anlegen". Error: Validierung. Success: CRUD-Karten |
| 7 | **Öffnungszeiten** | `/portal/hours` | `VendorHoursPage` | `GET /api/vendor/working-hours`, `PUT /api/vendor/working-hours`, `GET /api/hours/exceptions`, `POST /api/hours/exceptions`, `DELETE /api/hours/exceptions/{id}` | Loading: Stundenplan-Skeleton. Leer: Leere Wochentabelle. Error: Retry. Success: Wochenplan + Ausnahmen-Liste |
| 8 | **Kunden (CRM)** | `/portal/customers` | `VendorCustomersPage` | `GET /api/crm/contacts`, `POST /api/crm/contacts`, `PUT /api/crm/contacts/{id}`, `GET /api/crm/stats` | Loading: Tabelle-Skeleton. Leer: "Noch keine Kunden". Error: Retry. Success: Kundenliste mit Tags, Notizen, Historie |
| 9 | **Berichte** | `/portal/reports` | `VendorReportsPage` | `POST /api/reports/revenue`, `POST /api/reports/bookings`, `POST /api/reports/customers`, `POST /api/reports/affiliate`, `GET /api/reports/export/csv` | Loading: Chart-Skeletons. Leer: "Keine Daten im Zeitraum". Error: Retry. Success: Charts (Umsatz, Buchungen, Kunden, Affiliate) |
| 10 | **Wallet** | `/portal/wallet` | `VendorWalletPage` | `GET /api/wallet/balance`, `GET /api/wallet/transactions`, `POST /api/wallet/withdraw` | Loading: Balance-Skeleton. Leer: "Wallet noch nicht aktiviert". Error: "Guthaben unzureichend". Success: Balance, Transaktionen, Auszahlungs-Button |
| 11 | **Affiliates** | `/portal/affiliates` | `VendorAffiliatesPage` | `POST /api/affiliate/link`, `GET /api/affiliate/links`, `GET /api/affiliate/commissions`, `POST /api/reports/affiliate` | Loading: Link-Liste-Skeleton. Leer: "Ersten Affiliate-Link erstellen". Error: Retry. Success: Link-Verwaltung, Performance-Übersicht |
| 12 | **Branding** | `/portal/branding` | `VendorBrandingPage` | `GET /api/branding/{vendor_id}`, `PUT /api/branding/{vendor_id}`, `POST /api/branding/{vendor_id}/logo`, `POST /api/uploads/vendor-logo` | Loading: Form-Skeleton. Leer: Leeres Branding-Formular. Error: Validierung. Success: Branding-Vorschau, Logo-Upload |
| 13 | **Einstellungen** | `/portal/settings` | `VendorSettingsPage` | `PUT /api/auth/profile`, `GET /api/plans/subscription`, `PUT /api/plans/subscription/cancel`, `PUT /api/plans/subscription/change` | Loading: Form-Skeleton. Leer: N/A. Error: Validierung. Success: "Gespeichert"-Toast |

### API-Endpoints (Vendor-spezifisch, Hauptmodule)

| Modul | Methode | Pfad | Beschreibung | Status |
|-------|--------|------|-------------|--------|
| **Vendor** | POST | `/api/vendors/register` | Eigenen Vendor anlegen | ✅ |
| **Vendor** | PUT | `/api/vendors/{id}` | Vendor-Profil bearbeiten | ✅ |
| **Vendor** | DELETE | `/api/vendors/{id}` | Vendor deaktivieren | ✅ |
| **Vendor** | GET | `/api/vendor/stats` | Dashboard-Statistiken | ✅ |
| **Vendor** | GET | `/api/vendor/employee-accounts` | Mitarbeiter-Liste (Compat) | ✅ |
| **Services** | POST | `/api/services` | Service anlegen | ✅ |
| **Services** | PATCH/PUT | `/api/services/{id}` | Service bearbeiten | ✅ |
| **Services** | DELETE | `/api/services/{id}` | Service deaktivieren | ✅ |
| **Services** | GET | `/api/vendor/services` | Eigene Services | ✅ |
| **Employees** | POST | `/api/employees` | Mitarbeiter anlegen | ✅ |
| **Employees** | PATCH/PUT | `/api/employees/{id}` | Mitarbeiter bearbeiten | ✅ |
| **Employees** | DELETE | `/api/employees/{id}` | Mitarbeiter deaktivieren | ✅ |
| **Employees** | PUT | `/api/employees/{id}/schedule` | Arbeitszeiten setzen | ✅ |
| **Locations** | POST | `/api/locations` | Standort anlegen | ✅ |
| **Locations** | PATCH/PUT | `/api/locations/{id}` | Standort bearbeiten | ✅ |
| **Locations** | DELETE | `/api/locations/{id}` | Standort löschen | ✅ |
| **Hours** | POST | `/api/hours` | Öffnungszeiten setzen (Upsert) | ✅ |
| **Hours** | POST | `/api/hours/exceptions` | Blockzeit eintragen | ✅ |
| **Hours** | DELETE | `/api/hours/exceptions/{id}` | Blockzeit löschen | ✅ |
| **Bookings** | GET | `/api/vendor/bookings` | Alle Buchungen des Vendors | ✅ |
| **Bookings** | PATCH/PUT | `/api/bookings/{id}` | Status-Update (confirmed/completed/cancelled/no_show) | ✅ |
| **Bookings** | DELETE | `/api/bookings/{id}` | Buchung stornieren | ✅ |
| **Bookings** | GET | `/api/bookings/calendar` | Kalender-Ansicht | ✅ |
| **CRM** | GET | `/api/crm/contacts` | Kundenliste | ✅ |
| **CRM** | POST | `/api/crm/contacts` | Kunden hinzufügen | ✅ |
| **CRM** | PUT | `/api/crm/contacts/{id}` | Kunden bearbeiten | ✅ |
| **CRM** | GET | `/api/crm/stats` | CRM-Statistiken | ✅ |
| **Reports** | POST | `/api/reports/revenue` | Umsatzbericht | ✅ |
| **Reports** | POST | `/api/reports/bookings` | Buchungsbericht | ✅ |
| **Reports** | POST | `/api/reports/customers` | Kundenbericht | ✅ |
| **Reports** | POST | `/api/reports/affiliate` | Affiliate-Bericht | ✅ |
| **Reports** | GET | `/api/reports/export/csv` | CSV-Export | ✅ |
| **Wallet** | GET | `/api/wallet/balance` | Guthaben prüfen | ✅ |
| **Wallet** | GET | `/api/wallet/transactions` | Transaktionen anzeigen | ✅ |
| **Wallet** | POST | `/api/wallet/withdraw` | Auszahlung beantragen | ✅ |
| **Wallet** | POST | `/api/checkout/vendor-payout` | Vendor-Auszahlung (Wallet) | ✅ |
| **Affiliate** | POST | `/api/affiliate/link` | Affiliate-Link erstellen | ✅ |
| **Affiliate** | GET | `/api/affiliate/links` | Eigene Links | ✅ |
| **Affiliate** | GET | `/api/affiliate/commissions` | Eigene Provisionen | ✅ |
| **Branding** | GET | `/api/branding/{vendor_id}` | Branding abrufen | ✅ |
| **Branding** | PUT | `/api/branding/{vendor_id}` | Branding konfigurieren | ✅ |
| **Branding** | POST | `/api/branding/{vendor_id}/logo` | Logo setzen | ✅ |
| **Uploads** | POST | `/api/uploads/vendor-logo` | Logo-Upload (Base64) | ✅ |
| **Uploads** | POST | `/api/uploads/service-image` | Service-Bild-Upload | ✅ |
| **Plans** | GET | `/api/plans/subscription` | Eigenes Abo | ✅ |
| **Plans** | POST | `/api/plans/subscribe` | Tarif abonnieren | ✅ |
| **Plans** | PUT | `/api/plans/subscription/cancel` | Abo kündigen | ✅ |
| **Plans** | PUT | `/api/plans/subscription/change` | Tarif wechseln | ✅ |

### State-Matrix (Vendor)

| State | Bedingung | UI-Verhalten |
|-------|-----------|-------------|
| **Loading** | API-Daten werden geladen | Skeleton-Loader für Tabellen, Karten, Charts |
| **Empty** | Keine Daten (z.B. erstes Mal nach Onboarding) | Onboarding-CTA / "Erste X anlegen"-Button prominent |
| **Error** | API-Fehler | Error-Banner mit spezifischer Meldung. 403: "Keine Berechtigung". 409: "Überschneidung/Konflikt". 500: Retry |
| **Success** | Daten vorhanden | CRUD-Listen mit Aktionen, Charts, Bulk-Aktionen |
| **Optimistic** | CRUD-Operation läuft | Sofortige UI-Aktualisierung, Rollback bei Server-Fehler |
| **Stale** | Daten älter als 30s | Auto-Refresh via `useAutoRefresh` / React Query `staleTime` |

### Fehlende Features (IST-Lücken)

| Feature | Grund | Prio |
|---------|-------|------|
| Buchung bestätigen/ablehnen/completed/no-show | API vorhanden, Frontend-Status-Buttons fehlen | P1 - BLOCKER |
| Mitarbeiter-Rollen/Rechte | Kein API-Endpoint, kein Frontend | P1 |
| Zahlungsanbieter (Stripe Connect) verbinden | Stripe Connect Integration fehlt | P2 |
| Bewertungen anzeigen | API vorhanden (GET /api/reviews), Frontend-Seite fehlt | P2 |
| Pakete/Gutscheine anlegen | Compat-Routes vorhanden (GET /api/vendor/packages, /api/vendor/vouchers), Frontend fehlt | P2 |
| Ressourcen verwalten | Kein API-Endpoint, kein Frontend | P2 |
| Kunden-Tags setzen | CRM API vorhanden, UI-Tags fehlen | P2 |
| Support-Ticket erstellen | API vorhanden, Frontend fehlt | P3 |
| Ledger (unveränderbar) | Wallet-API vorhanden, kein Append-Only-Ledger | P1 - KRITISCH |

---

## 5. Portal 4: Employee (Staff)

**Rolle:** `staff`  
**Layout:** `VendorPortal` (gleiche Shell wie Vendor, mit eingeschränkter Nav)  
**Default-Route:** `/portal/staff` (FEHLT — aktuell in Vendor-Nav, nicht separat)  
**Permission-Scope:** `portal:read`, `staff:*`, `bookings:read`, `calendar:read`

### Status: 🔴 KOMPLETT FEHLEND (0% umgesetzt)

Das Employee-Portal ist als Rolle im Auth-System definiert, aber:
- Keine eigenen Seiten-Komponenten unter `/src/pages/staff/`
- Keine eigene Portal-Shell
- Keine API-Endpoints für Staff-spezifische Stats
- Im Frontend-Routing wird `staff` auf Vendor-Portal gemappt (Zeile 261 App.js)

### Geplante Seiten

| # | Seite | URL-Pfad | Komponente (geplant) | API-Endpoints (geplant) | Status |
|---|-------|----------|-----------------------|-------------------------|--------|
| 1 | **Dashboard** | `/portal/staff` | `StaffDashboardPage` | `GET /api/employees/{id}/stats` | ❌ |
| 2 | **Meine Termine** | `/portal/staff/bookings` | `StaffBookingsPage` | `GET /api/bookings?employee_id=` | ❌ |
| 3 | **Kalender** | `/portal/staff/calendar` | `StaffCalendarPage` | wie `/api/bookings/calendar` | ❌ |
| 4 | **Verfügbarkeit** | `/portal/staff/availability` | `StaffAvailabilityPage` | `PUT /api/employees/{id}/schedule` (vorhanden) | ❌ |
| 5 | **Aufgaben** | `/portal/staff/tasks` | `StaffTasksPage` | — | ❌ |
| 6 | **Kundendetails** | `/portal/staff/customers` | `StaffCustomersPage` | `GET /api/crm/contacts/{id}` (eingeschränkt) | ❌ |
| 7 | **Profil** | `/portal/staff/profile` | `StaffProfilePage` | `PUT /api/auth/profile` (vorhanden) | ❌ |

### API-Endpoints (Staff-spezifisch, vorhanden)

| Methode | Pfad | Beschreibung | Status |
|---------|------|-------------|--------|
| PATCH/PUT | `/api/employees/{id}/schedule` | Arbeitszeiten setzen | ✅ (wird als Vendor aufgerufen) |
| GET | `/api/hours?employee_id=` | Arbeitszeiten abrufen | ✅ (public) |

### Fehlende Features (Staff, P3)

| Feature | Grund |
|---------|-------|
| Eigenes Dashboard | Kein Endpoint für Staff-spez. Stats |
| Eigene Termine | `/api/bookings?employee_id=` fehlt als Filter |
| Buchungsstatus ändern | Staff darf aktuell nicht schreiben |
| Kundendetails (eingeschränkt) | Kein dedizierter Endpoint |
| Aufgaben-Liste | Kein Datenmodell |

---

## 6. Portal 5: Affiliate

**Rolle:** `affiliate`  
**Layout:** `AffiliatePortal` (PortalShell mit Affiliate-Nav)  
**Default-Route:** `/portal/affiliate`  
**Permission-Scope:** `affiliate:*`, `commission:own`

### Navigation (Sidebar)

| Pfad | Label | Icon |
|------|-------|------|
| `/portal/affiliate` | Affiliate-Dashboard | TrendingUp |
| `/portal/links` (affiliate) | Tracking-Links | — |
| `/portal/commissions` (affiliate) | Provisionen | — |
| `/portal/wallet` (affiliate) | Wallet | Wallet |

### Mobile-Nav

| Pfad | Label | Icon |
|------|-------|------|
| `/portal` | Dashboard | LayoutDashboard |
| `/portal/links` | Links | Link2 |
| `/portal/wallet` | Wallet | Wallet |

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen |
|---|-------|----------|-----------|---------------|---------------------|
| 1 | **Dashboard** | `/portal` (Affiliate) | `AffiliateDashboardPage` | `GET /api/affiliate/stats`, `GET /api/affiliate/links`, `GET /api/affiliate/commissions` | Loading: Stat-Skeleton. Leer: "Ersten Tracking-Link erstellen". Error: Retry. Success: KPIs (Links, Klicks, Provisionen) |
| 2 | **Tracking-Links** | `/portal/links` | `AffiliateLinksPage` | `POST /api/affiliate/link`, `GET /api/affiliate/links` | Loading: Link-Liste-Skeleton. Leer: "Ersten Link erstellen". Error: "Vendor nur eigene". Success: CRUD-Liste mit Copy-Button |
| 3 | **Provisionen** | `/portal/commissions` | `AffiliateCommissionsPage` | `GET /api/affiliate/commissions`, `GET /api/commissions` | Loading: Provisionen-Tabelle-Skeleton. Leer: "Noch keine Provisionen". Error: Retry. Success: Tabelle mit Status (pending/approved) |
| 4 | **Wallet** | `/portal/wallet` | `AffiliateWalletPage` | `GET /api/wallet/balance`, `GET /api/wallet/transactions`, `POST /api/wallet/withdraw` | Loading: Balance-Skeleton. Leer: "Wallet wird aktiviert...". Error: "Guthaben unzureichend". Success: Guthaben + Auszahlungs-Button |

### API-Endpoints (Affiliate-spezifisch)

| Methode | Pfad | Beschreibung | Status |
|---------|------|-------------|--------|
| POST | `/api/affiliate/link` | Affiliate-Link erstellen (vendor only) | ✅ |
| GET | `/api/affiliate/links` | Eigene Links auflisten | ✅ |
| GET | `/api/affiliate/links/{code}` | Link-Info öffentlich (erhöht Klick-Counter) | ✅ |
| GET | `/api/affiliate/commissions` | Provisionen abrufen (via Codes) | ✅ |
| GET | `/api/affiliate/stats` | Aggregierte Stats (Links, Klicks, Provisionen) | ✅ |
| GET | `/api/commissions` | Provisionen (als Affiliate, nach user_id) | ✅ |
| GET | `/api/wallet/balance` | Guthaben prüfen | ✅ |
| GET | `/api/wallet/transactions` | Transaktionen | ✅ |
| POST | `/api/wallet/withdraw` | Auszahlung beantragen | ✅ |

### Fehlende Features (Affiliate)

| Feature | Grund | Prio |
|---------|-------|------|
| Klick-Tracking (Pixel/Redirect) | API-Struktur vorhanden (Click-Counter in links/{code}), kein persistentes Click-Log | P1 - BLOCKER |
| Performance-Reports (Charts) | Kein API-Endpoint für zeitliche Auflösung | P2 |
| Kampagnen-Verwaltung | Kein API-Endpoint, kein Frontend | P2 |
| Conversion-Attribution | Commission-Erstellung über Booking-Hook (vorhanden), kein Tracking-Detail | P1 |

---

## 7. Portal 6: Admin

**Rolle:** `admin`, `super_admin`  
**Layout:** `AdminPortal` (PortalShell mit Admin-Nav)  
**Default-Route:** `/portal/admin`  
**Permission-Scope:** `portal:*`, `admin:*`, plus alle anderen Scopes

### Navigation (Sidebar)

| Pfad | Label | Icon |
|------|-------|------|
| `/portal/admin` | Admin-Dashboard | Shield |
| `/portal/admin/users` | Benutzer | UserCog |
| `/portal/admin/commission` | Provisionen | Coins |

### Mobile-Nav

| Pfad | Label | Icon |
|------|-------|------|
| `/portal` | Dashboard | LayoutDashboard |
| `/portal/users` | Benutzer | Users |
| `/portal/vendors` | Vendoren | Store |
| `/portal/settings` | Einstellungen | Settings |

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen |
|---|-------|----------|-----------|---------------|---------------------|
| 1 | **Dashboard** | `/portal/admin` | `AdminDashboardPage` | `GET /api/admin/stats`, `GET /api/admin/reports`, `GET /api/health` | Loading: Stat-Cards-Skeleton. Leer: System ohne Daten. Error: "Admin-API nicht erreichbar". Success: Plattform-KPIs |
| 2 | **Benutzer** | `/portal/users` | `AdminUsersPage` | `GET /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`, `PUT /api/admin/users/{id}` | Loading: Tabelle-Skeleton. Leer: "Keine Benutzer". Error: Retry. Success: Nutzer-Tabelle mit Rollen-Filter, Aktionen (Rolle ändern, Deaktivieren) |
| 3 | **Vendoren** | `/portal/vendors` | `AdminVendorsPage` | `GET /api/admin/vendors`, `PUT /api/admin/vendors/{id}` | Loading: Tabelle-Skeleton. Leer: "Keine Vendoren". Error: Retry. Success: Vendor-Tabelle mit Freigabe-Status-Toggle |
| 4 | **Tarife** | `/portal/plans` | `AdminPlansPage` | `GET /api/plans` | Loading: Plan-Karten-Skeleton. Leer: Default-Pläne anzeigen. Error: Fallback-Pläne. Success: Plan-Verwaltung |
| 5 | **Audit-Logs** | `/portal/audit` | `AdminAuditPage` | `GET /api/audit/logs`, `GET /api/audit/logs/user/{id}`, `GET /api/audit/logs/resource/{type}/{id}` | Loading: Log-Liste-Skeleton. Leer: "Keine Logs im Zeitraum". Error: Retry. Success: Filterbare Log-Tabelle |
| 6 | **Bewertungen** | `/portal/reviews` | `AdminReviewsPage` | `GET /api/reviews`, `POST /api/reviews/{id}/approve`, `PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}` | Loading: Review-Liste-Skeleton. Leer: "Keine Bewertungen". Error: Retry. Success: Moderations-Liste |
| 7 | **Provisionen** | `/portal/commissions` | `AdminCommissionPage` | `GET /api/commissions`, `PATCH /api/commissions/{id}/approve`, `PATCH /api/commissions/{id}/cancel` | Loading: Tabelle-Skeleton. Leer: "Keine Provisionen". Error: Retry. Success: Approve/Cancel-Aktionen |

### API-Endpoints (Admin-spezifisch)

| Methode | Pfad | Beschreibung | Status |
|---------|------|-------------|--------|
| GET | `/api/admin/stats` | Plattform-Statistiken (Nutzer, Vendoren, Buchungen, Umsatz) | ✅ |
| GET | `/api/admin/users` | Nutzer-Liste mit Rollen-Filter | ✅ |
| PUT | `/api/admin/users/{id}` | Nutzer-Status/Rolle bearbeiten | ✅ |
| GET | `/api/admin/vendors` | Vendor-Liste mit verified/active-Filter | ✅ |
| PUT | `/api/admin/vendors/{id}` | Vendor freigeben/verifyen | ✅ |
| GET | `/api/admin/reports` | Plattform-Reports (Buchungen, Revenue) | ✅ |
| GET | `/api/users` | Vollständige Nutzerverwaltung (Paginierung) | ✅ |
| PUT | `/api/users/{id}` | Nutzer-Admin-Update (Rolle, Status, Sync zu auth.users) | ✅ |
| DELETE | `/api/users/{id}` | Nutzer deaktivieren (Soft-Delete) | ✅ |
| GET | `/api/audit/logs` | Audit-Logs mit Filtern | ✅ |
| GET | `/api/audit/logs/user/{id}` | User-Audit-Trail | ✅ |
| GET | `/api/audit/logs/resource/{type}/{id}` | Ressourcen-Audit-Trail | ✅ |
| PATCH | `/api/commissions/{id}/approve` | Provision freigeben | ✅ |
| PATCH | `/api/commissions/{id}/cancel` | Provision stornieren | ✅ |
| PUT | `/api/help/tickets/{id}` | Ticket-Status aktualisieren | ✅ |
| GET | `/api/help/tickets` | Alle Tickets (Admin) | ✅ |

### Fehlende Features (Admin)

| Feature | Grund | Prio |
|---------|-------|------|
| Buchungen prüfen (Admin-View) | Kein Admin-Endpoint für globale Buchungs-Liste | P1 |
| Payout Review | Kein Endpoint für Auszahlungs-Prüfung (Liste aller Payout-Requests) | P1 - BLOCKER |
| Wallet-Prüfung (Admin-View) | Kein Admin-Endpoint für Wallet-Balance anderer Nutzer | P1 |
| Marketplace-Freigabe (Moderation) | API vorhanden (PUT admin/vendors/{id}), dedizierte Moderation-UI fehlt | P1 - BLOCKER |
| Ledger-Korrektur (Gegenbuchung) | Kein Endpoint für Admin-Wallet-Korrektur | P3 |
| Systemstatus (detailliert) | Health-Endpoint nur basic, kein DB-/Cache-/Queue-Health | P2 |
| Webhook-Verwaltung | Kein Admin-Endpoint für Webhook-Konfiguration | P2 |
| Support-Tickets bearbeiten | API vorhanden, Admin-UI fehlt | P3 |

---

## 8. Portal 7: WhiteLabel / Franchise

**Rolle:** `franchiser`  
**Layout:** `FranchiserPortal` (PortalShell mit Franchise-Nav)  
**Default-Route:** `/portal/franchise`  
**Permission-Scope:** `franchiser:*`, `reports:franchise`

### Status: 🟡 TEILWEISE VORHANDEN (33%)

### Navigation (Sidebar)

| Pfad | Label | Icon |
|------|-------|------|
| `/portal/franchise` | Franchise | Network |
| `/portal/franchise/reports` (→ `/portal/reports` für Franchiser) | Reports | — |

### Seiten

| # | Seite | URL-Pfad | Komponente | API-Endpoints | State-Anforderungen | Status |
|---|-------|----------|-----------|---------------|---------------------|--------|
| 1 | **Dashboard** | `/portal` (Franchiser) | `FranchiserDashboardPage` | `GET /api/franchises/{id}` | Loading: Stat-Cards-Skeleton. Leer: "Kein Franchise eingerichtet". Error: Retry. Success: Franchise-KPIs, Sub-Vendor-Liste | 🔶 |
| 2 | **Vendoren** | `/portal/vendors` | `FranchiserVendorsPage` | `GET /api/franchises/{id}/vendors` | Loading: Tabelle-Skeleton. Leer: "Keine Vendoren". Error: Retry. Success: Vendor-Tabelle mit Status | 🔶 |
| 3 | **Reports** | `/portal/reports` | `FranchiserReportsPage` | `GET /api/reports` (kein franchise-spez.) | Loading: Charts-Skeleton. Leer: "Keine Daten". Error: Retry. Success: Aggregierte Vendor-Reports | 🔶 |
| 4 | **Einstellungen** | `/portal/settings` | `VendorSettingsPage` (shared) | `PUT /api/auth/profile` | Loading: Form-Skeleton. Error: Validierung. Success: "Gespeichert" | 🔶 |

### API-Endpoints (Franchise/WhiteLabel)

| Methode | Pfad | Beschreibung | Status |
|---------|------|-------------|--------|
| POST | `/api/franchises` | Franchise erstellen (auth) | ✅ |
| GET | `/api/franchises` | Franchise-Liste (public) | ✅ |
| GET | `/api/franchises/{id}` | Franchise-Detail (public) | ✅ |
| PUT | `/api/franchises/{id}` | Franchise bearbeiten (owner) | ✅ |
| GET | `/api/franchises/{id}/vendors` | Franchise-Vendoren (public) | ✅ |
| GET | `/api/branding/{vendor_id}` | Branding abrufen | ✅ |
| PUT | `/api/branding/{vendor_id}` | Branding konfigurieren | ✅ |
| POST | `/api/branding/{vendor_id}/logo` | Logo setzen | ✅ |

### Geplante Seiten (P2 — Fehlen vollständig)

| # | Seite | URL-Pfad (geplant) | Komponente (geplant) | API-Endpoints (geplant) | Status |
|---|-------|-------------------|-----------------------|-------------------------|--------|
| 5 | **Brand Identity** | `/portal/franchise/branding` | `WhiteLabelBrandingPage` | `PUT /api/branding/{id}`, `POST /api/branding/{id}/logo` | ❌ |
| 6 | **Domain-Verwaltung** | `/portal/franchise/domains` | `WhiteLabelDomainsPage` | Domain-Verifikations-Endpoint fehlt | ❌ |
| 7 | **Kunden** | `/portal/franchise/customers` | `WhiteLabelCustomersPage` | Kunden-Liste über alle Sub-Vendoren | ❌ |
| 8 | **Sub-Vendor-Gebühren** | `/portal/franchise/fees` | `WhiteLabelFeesPage` | Kein Endpoint | ❌ |
| 9 | **Analytics** | `/portal/franchise/analytics` | `WhiteLabelAnalyticsPage` | Aggregierte Analytics fehlen | ❌ |

### Fehlende Features (WhiteLabel/Franchise)

| Feature | Grund | Prio |
|---------|-------|------|
| Eigene Domain pro Partner | Kein Domain-Routing, kein Verifikations-Endpoint | P2 |
| Eigenes E-Mail-Branding | Branding-Endpoint vorhanden, E-Mail-Template fehlt | P2 |
| Eigene Login-Seite | Kein Tenant-basiertes Login-Routing | P2 |
| Sub-Vendor-Verwaltung (UI) | Franchise API vorhanden, WhiteLabel-Dashboard fehlt | P2 |
| Provisions-Split Franchise | Kein Endpoint | P2 |
| Eigene Marketplace-Strukturen | Kein Endpoint, kein Frontend | P2 |

---

## 8. API-Endpoint-Verzeichnis (Global)

### Alle API-Module (27 Router, 186+ Endpoints)

| Router-Datei | Prefix | Endpoints | Auth-Level | Beschreibung |
|-------------|--------|-----------|------------|-------------|
| `public_routes.py` | `/api/` | 3 | Public | Health, Stats, Languages |
| `auth_routes.py` | `/api/auth/` | 11 | Mixed | Register, Login, Refresh, Profile, Logout, Reset-PW, Context-Switch |
| `users_routes.py` | `/api/users/` | 7 | Admin | Nutzer-CRUD |
| `totp_routes.py` | `/api/totp/` | 4 | Auth | TOTP 2FA Setup/Verify/Disable/Login |
| `vendor_routes.py` | `/api/vendors/` | 5 | Mixed (Public+Auth) | Vendor-CRUD, Register, Stats |
| `services_routes.py` | `/api/services/` | 5 | Mixed (Public+Auth) | Service-CRUD |
| `employees_routes.py` | `/api/employees/` | 6 | Mixed (Public+Auth) | Employee-CRUD, Schedule |
| `locations_routes.py` | `/api/locations/` | 4 | Mixed (Public+Auth) | Location-CRUD |
| `hours_routes.py` | `/api/hours/` | 5 | Mixed (Public+Auth) | Working-Hours, Exceptions |
| `bookings_routes.py` | `/api/bookings/` | 7 | Mixed | Slots, Create, List, Detail, Update, Cancel, Calendar |
| `checkout_routes.py` | `/api/checkout/` | 7 | Auth | Session, Status, Webhook, Dry-Run, Pay-Later, Booking-Payment, Vendor-Payout |
| `checkout_routes.py` (orders) | `/api/orders/` | 2 | Auth | Order-Liste (me), Order-Detail |
| `wallet_routes.py` | `/api/wallet/` | 4 | Auth | Balance, Transactions, Deposit, Withdraw |
| `plans_routes.py` | `/api/plans/` | 7 | Mixed | List, Detail, Subscribe, Subscription, Cancel, Change |
| `marketplace_routes.py` | `/api/marketplace/` | 5 | Public | Vendors, Categories, Vendor-Profile, Services, Reviews |
| `reviews_routes.py` | `/api/reviews/` | 5 | Mixed (Public+Auth) | List, Create, Update, Delete, Approve |
| `affiliate_routes.py` | `/api/affiliate/` | 5 | Mixed (Auth+Public) | Link-Create, Links-List, Link-Info, Commissions, Stats |
| `commission_routes.py` | `/api/commissions/` | 3 | Auth | List, Approve, Cancel (+ create via booking hook) |
| `crm_routes.py` | `/api/crm/` | 5 | Vendor | Contacts-CRUD, Stats |
| `admin_routes.py` | `/api/admin/` | 6 | Admin | Stats, Users-CRUD, Vendors-CRUD, Reports |
| `notifications_routes.py` | `/api/notifications/` | 5 | Auth | List, Unread-Count, Read, Read-All, Delete |
| `franchise_routes.py` | `/api/franchises/` | 5 | Mixed (Public+Auth) | Create, List, Detail, Update, Vendors |
| `branding_routes.py` | `/api/branding/` | 3 | Mixed (Public+Auth) | Get, Update, Logo-Upload |
| `reports_routes.py` | `/api/reports/` | 5 | Vendor | Revenue, Bookings, Customers, Affiliate, CSV-Export |
| `help_routes.py` | `/api/help/` | 5 | Mixed (Public+Auth) | Articles, Ticket-CRUD |
| `audit_routes.py` | `/api/audit/` | 3 | Admin | Logs, User-Trail, Resource-Trail |
| `uploads_routes.py` | `/api/uploads/` | 4 | Auth | Avatar, Vendor-Logo, Service-Image, Delete |
| `customer_routes.py` | `/api/customer/` | 5 | Customer | Bookings, Favorites, Toggle-Fav, History, Upcoming |
| `compat_routes.py` | `/api/` (diverse) | 25+ | Mixed | Frontend-Pfad-Kompatibilität: Vendor, Marketplace, Public |

### Authentifizierungs-Level

| Level | Beschreibung |
|-------|-------------|
| **Public** | Kein Token erforderlich |
| **Mixed** | Token optional (Public ohne Token, erweiterte Daten mit Token) |
| **Auth** | JWT-Token erforderlich |
| **Customer** | Nur mit `customer`-Rolle |
| **Vendor** | Nur mit `vendor`- (oder `admin`-) Rolle |
| **Admin** | Nur mit `admin`/`super_admin`-Rolle |

---

## 9. Status-Matrix (Gesamt)

### Verfügbarkeit nach Portal

| Portal | Geplante Seiten | ✅ Vorhanden | 🔶 Teilweise | ❌ Fehlt | Erfüllungsgrad |
|--------|----------------|-------------|-------------|---------|----------------|
| Public Visitor | 17 | 17 | 0 | 0 | **100%** |
| Customer | 6 | 4 | 1 | 1 (Recurring-UI) | **83%** |
| Vendor | 13 | 12 | 2 | 0 | **92%** (UI) / **54%** (Funktionen) |
| Employee (Staff) | 7 | 0 | 0 | 7 | **0%** |
| Affiliate | 4 | 4 | 0 | 0 (UI) / 3 (Funktionen) | **100%** (UI) / **67%** (Funktionen) |
| Admin | 7 | 7 | 0 | 5 (Funktionen) | **100%** (UI) / **50%** (Funktionen) |
| WhiteLabel/Franchise | 9 | 3 | 1 | 5 | **33%** |
| **Gesamt** | **63** | **47** | **4** | **21** | **---** |

### Kritische Blocker (P1 — MÜSSEN vor Launch)

| # | Portal | Feature | Problem |
|---|--------|---------|---------|
| 1 | Vendor | Buchung bestätigen/ablehnen/completed/no-show | API vorhanden (PATCH /bookings/{id}), Status-Buttons im Frontend fehlen |
| 2 | Affiliate | Klick-Tracking (persistentes Log) | Nur Click-Counter am Link, kein Tracking-Click-Datensatz |
| 3 | Admin | Payout Review | Kein Admin-Endpoint für Auszahlungs-Liste |
| 4 | Admin | Marketplace-Freigabe (Moderation-UI) | API vorhanden, dedizierte Moderation-Seite fehlt |
| 5 | Vendor | Mitarbeiter-Rollen/Rechte | Kein API-Endpoint, kein Frontend |
| 6 | Vendor | Ledger (Append-Only) | Wallet-API vorhanden, Ledger nicht unveränderbar |

### Nicht-funktionale Anforderungen (Portal-übergreifend)

| Anforderung | Status |
|-------------|--------|
| Loading-States (Skeletons) | 🔶 Teilweise (nur in PortalShell, nicht auf Seitenebene) |
| Empty-States (CTA) | ❌ Fehlt in den meisten Seiten |
| Error-States (Retry) | 🔶 Teilweise (ErrorBoundary vorhanden, keine kontextsensitiven Error-States) |
| Optimistic Updates | ❌ Fehlt flächendeckend |
| Stale-Data-Handling | 🔶 React Query staleTime=30s, aber kein visuelles Feedback |
| Mobile-Responsive | ✅ Vorhanden (Bottom-Nav, Collapsed-Sidebar) |
| i18n (DE/EN) | ✅ Framework vorhanden (react-i18next), Texte teils statisch |
| Accessibility (A11y) | 🔶 Teilweise (ARIA-Attribute, semantisches HTML) |
| Offline-Fähigkeit | ❌ Nicht implementiert |
| Page Transitions | ❌ Keine |

---

## Glossar

| Begriff | Definition |
|---------|-----------|
| **Portal** | Geschützter Bereich für eine spezifische Rolle (PortalShell + Nav + Seiten) |
| **PortalShell** | Layout-Wrapper: Topbar + Sidebar + Main + Bottom-Nav (Mobile) |
| **PortalContext** | Reaktiver Kontext für Navigation und Permissions |
| **AuthContext** | User-Session, Rollen-/Tenant-Wechsel, Permissions |
| **activeRole** | Die aktuell aktive Rolle eines Users (bei Multi-Rollen) |
| **activeTenant** | Der aktuell aktive Tenant/Vendor-Kontext |
| **Compat-Router** | Alias-Routen für Frontend-Backend-Pfad-Differenzen |
| **Skeleton** | Platzhalter-Komponente während des Ladens (Shimmer-Effekt) |
| **Empty-State** | Gezielte UI wenn keine Daten vorhanden sind (mit CTA) |
| **Optimistic Update** | UI zuerst aktualisieren, Server-Call im Hintergrund |
| **State-Matrix** | Dokumentierte UI-Zustände: Loading, Empty, Error, Success |
