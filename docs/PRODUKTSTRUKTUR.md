# Bookando.de — Vollständige Produkt-, Architektur- & Umsetzungsstruktur

> **Abgeleitet aus:** Pflichtenheft (852 Zeilen, 23 Kapitel)
> **Stand:** 06.06.2026, 09:54 UTC
> **Frontend:** https://bookando.de (React 19, Vercel)
> **Backend:** https://bookando-backend.vercel.app (FastAPI, Supabase)
> **Repository:** `nexifyai-dev/affilinet-portal-aachen` (Frontend), `nexifyai-dev/bookando-api` (Backend)

---

## Inhaltsverzeichnis

1. [Rollen & Rechtekonzept](#1-rollen--rechtekonzept)
2. [Nutzeraktionsmatrix](#2-nutzeraktionsmatrix)
3. [Hauptmodule](#3-hauptmodule)
4. [MVP-Scope (P0-P1)](#4-mvp-scope-p0-p1)
5. [Datenmodell](#5-datenmodell)
6. [API-Struktur](#6-api-struktur)
7. [Architekturvorgaben & ADRs](#7-architekturvorgaben--adrs)
8. [Roadmap P0-P3](#8-roadmap-p0-p3)
9. [Testplan](#9-testplan)
10. [IST/SOLL-Gap-Analyse](#10-istsoll-gap-analyse)
11. [Dokumentationsindex](#11-dokumentationsindex)

---

## 1. Rollen & Rechtekonzept

### 1.1 Rollen-Hierarchie

```
Platform Admin
  ├── WhiteLabel Partner / Agentur
  │     └── Vendors (dieser Partner)
  ├── Franchise-Geber
  │     └── Vendors (dieses Franchise)
  ├── Vendor / Inhaber
  │     ├── Mitarbeiter
  │     └── Affiliates (dieses Vendors)
  └── Kunde / Customer
```

### 1.2 Rollendefinitionen

| Rolle | Beschreibung | Kern-Aufgabe | Frontend-Bereich |
|-------|-------------|-------------|------------------|
| **Kunde** | Endkunde, sucht Dienstleister und bucht Termine | Buchen, Bezahlen, Bewerten | Public + Customer-Dashboard |
| **Vendor/Inhaber** | Dienstleister, betreibt Unternehmen auf Bookando | Unternehmen verwalten, Buchungen annehmen | Vendor-Dashboard |
| **Mitarbeiter** | Angestellter eines Vendors | Eigene Termine, Verfügbarkeit | Vendor-Dashboard (eingeschränkt) |
| **Affiliate/Marketer** | Partner, wirbt Vendor/Service | Links teilen, Provision verdienen | Affiliate-Dashboard |
| **WhiteLabel-Partner** | Betreibt eigene Plattform auf Bookando | Eigene Vendors, Branding, Domains | WhiteLabel-Dashboard |
| **Franchise-Geber** | Mehrere Standorte/Filialen | Zentrale Steuerung | Franchiser-Dashboard |
| **Plattform-Admin** | Betreiber Bookando.de | Systemverwaltung, Compliance | Admin-Dashboard |

### 1.3 Rechte-Matrix

| Bereich | Kunde | Mitarbeiter | Vendor | Affiliate | WL-Partner | Franchiser | Admin |
|---------|-------|-------------|--------|-----------|------------|------------|-------|
| Marketplace durchsuchen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Termin buchen | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eigene Termine sehen | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Alle Vendor-Termine | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Vendor verwalten | ❌ | ❌ | ✅ | ❌ | Eigene | ✅ | ✅ |
| Services verwalten | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Mitarbeiter verwalten | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Affiliate-Links erstellen | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Wallet/Provision sehen | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auszahlung beantragen | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CRM nutzen | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Marketplace-Moderation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Systemkonfiguration | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audit-Logs einsehen | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 2. Nutzeraktionsmatrix

### 2.1 Kunde

| # | Aktion | Frontend | API | Priorität |
|---|--------|----------|-----|-----------|
| 1 | Marketplace durchsuchen | MarketplacePage | GET /api/marketplace | P0 |
| 2 | Nach Kategorie/Standort/Service filtern | MarketplacePage | GET /api/marketplace | P0 |
| 3 | Vendor-Profil öffnen | VendorDetailPage | GET /api/marketplace/{id} | P0 |
| 4 | Services eines Vendors sehen | VendorDetailPage | GET /api/marketplace/{id}/services | P0 |
| 5 | Verfügbare Zeitslots prüfen | BookingWidget | POST /api/bookings/slots | P0 |
| 6 | Termin buchen | BookingWidget | POST /api/bookings | P0 |
| 7 | Bezahlen (Stripe/PayPal) | BookingWidget | POST /api/checkout/create-session | P0 |
| 8 | Buchungsbestätigung erhalten | - | E-Mail via Resend | P0 |
| 9 | Termin stornieren | CustomerDashboard | PATCH /api/bookings/{id} | P0 |
| 10 | Termin umbuchen | CustomerDashboard | PATCH /api/bookings/{id} | P1 |
| 11 | Bewertung abgeben | VendorDetailPage | POST /api/reviews | P1 |
| 12 | Konto verwalten | CustomerProfile | PUT /api/auth/profile | P0 |
| 13 | Favoriten verwalten | CustomerDashboard | POST /api/customer/favorites/{id} | P1 |
| 14 | Buchungshistorie einsehen | CustomerBookings | GET /api/customer/bookings | P0 |
| 15 | Wiederkehrende Termine einrichten | CustomerRecurring | POST /api/bookings/recurring | P2 |

### 2.2 Vendor/Inhaber

| # | Aktion | Frontend | API | Priorität |
|---|--------|----------|-----|-----------|
| 1 | 30-Tage-Test starten | RegisterPage | POST /api/auth/register | P0 |
| 2 | Unternehmen/Vendor anlegen | OnboardingFlow | POST /api/vendors/register | P0 |
| 3 | Standorte verwalten | VendorLocations | POST/GET /api/locations | P0 |
| 4 | Mitarbeiter anlegen | VendorEmployees | POST /api/employees | P0 |
| 5 | Services/Pakete anlegen | VendorServices | POST/GET /api/services | P0 |
| 6 | Preise, Dauer, Puffer konfigurieren | VendorServices | PATCH /api/services/{id} | P0 |
| 7 | Öffnungszeiten setzen | VendorHours | POST /api/hours | P0 |
| 8 | Kalender/Verfügbarkeiten verwalten | VendorHours | POST /api/hours/exceptions | P0 |
| 9 | Payment-Provider verbinden | VendorSettings | POST /api/checkout/... | P0 |
| 10 | Marketplace-Sichtbarkeit einstellen | VendorBranding | PUT /api/branding/{id} | P0 |
| 11 | Affiliates einladen | VendorAffiliates | POST /api/affiliate/link | P1 |
| 12 | Provisionsregeln festlegen | VendorAffiliates | POST /api/affiliate/rules | P1 |
| 13 | Buchungen einsehen | VendorBookings | GET /api/bookings | P0 |
| 14 | Kunden verwalten | VendorCustomers | GET /api/crm/contacts | P0 |
| 15 | Umsätze auswerten | VendorReports | POST /api/reports/revenue | P1 |
| 16 | Wallet prüfen | VendorWallet | GET /api/wallet/balance | P1 |
| 17 | Auszahlung beantragen | VendorWallet | POST /api/wallet/withdraw | P1 |
| 18 | Branding konfigurieren | VendorBranding | PUT /api/branding/{id} | P1 |

### 2.3 Mitarbeiter

| # | Aktion | API | Priorität |
|---|--------|-----|-----------|
| 1 | Eigene Termine sehen | GET /api/employees/{id}/bookings | P0 |
| 2 | Verfügbarkeit pflegen | PATCH /api/employees/{id}/schedule | P0 |
| 3 | Termin bestätigen/ablehnen | PATCH /api/bookings/{id}/status | P0 |
| 4 | Termin verschieben (mit Vendor-Recht) | PATCH /api/bookings/{id} | P1 |
| 5 | Kundeninfos sehen (eingeschränkt) | GET /api/crm/contacts/{id} | P1 |

### 2.4 Affiliate/Marketer

| # | Aktion | Frontend/API | Priorität |
|---|--------|--------------|-----------|
| 1 | Konto erstellen | POST /api/auth/register?role=affiliate | P1 |
| 2 | Vendor/Service zur Bewerbung auswählen | GET /api/marketplace | P1 |
| 3 | Trackinglink erstellen | POST /api/affiliate/link | P1 |
| 4 | Link teilen (Copy-to-Clipboard) | Frontend | P1 |
| 5 | Klicks prüfen | GET /api/affiliate/links/{code}/stats | P1 |
| 6 | Conversions/Buchungen prüfen | GET /api/affiliate/commissions | P1 |
| 7 | Provisionen im Wallet sehen | GET /api/wallet/transactions | P1 |
| 8 | Auszahlung beantragen | POST /api/wallet/withdraw | P1 |
| 9 | Kampagnen verwalten | POST /api/affiliate/campaign | P2 |

### 2.5 Plattform-Admin

| # | Aktion | Frontend/API | Priorität |
|---|--------|--------------|-----------|
| 1 | Vendoren prüfen und freigeben | AdminVendors | P0 |
| 2 | Nutzer verwalten | AdminUsers | P1 |
| 3 | Tarife/Pläne verwalten | AdminPlans | P1 |
| 4 | Provisions- und Payment-Flows prüfen | AdminDashboard | P1 |
| 5 | Wallet-Korrekturen (auditierbar) | API direkt | P1 |
| 6 | Plattformgebühren überwachen | AdminDashboard | P1 |
| 7 | Marketplace-Inhalte moderieren | AdminReviews | P1 |
| 8 | Systemstatus prüfen | AdminDashboard | P0 |
| 9 | Audit-Logs einsehen | AdminAudit | P1 |
| 10 | Reports exportieren | AdminReports | P1 |

---

## 3. Hauptmodule

### 3.1 Modul-Übersicht

| # | Modul | Status | MVP | Phase | Frontend | Backend |
|---|-------|--------|-----|-------|----------|---------|
| M1 | **SaaS-Core** | 🔧 Teilweise | ✅ | P0 | AuthContext, company.js | config.py, db.py |
| M2 | **Vendor-System** | 🔧 Teilweise | ✅ | P0 | 8 Vendor-Seiten | vendor_routes.py |
| M3 | **Booking-Engine** | 🔧 Teilweise | ✅ | P0 | BookingWidget (fehlt) | bookings_routes.py |
| M4 | **Calendar-Engine** | 🔧 Teilweise | ✅ | P0 | VendorHours | hours_routes.py |
| M5 | **Resource-Engine** | ❌ Fehlt | ❌ | P2 | - | - |
| M6 | **Marketplace** | ✅ Vorhanden | ✅ | P0 | MarketplacePage | marketplace_routes.py |
| M7 | **Affiliate-Tracking** | 🔧 Teilweise | ✅ | P1 | VendorAffiliates | affiliate_routes.py |
| M8 | **Commission-Engine** | ❌ Fehlt | ❌ | P1 | - | - |
| M9 | **Wallet/Ledger** | 🔧 Teilweise | ✅ | P1 | VendorWallet | wallet_routes.py |
| M10 | **Payment-Abstraktion** | 🔧 Teilweise | ✅ | P0 | - | checkout_routes.py |
| M11 | **CRM** | 🔧 Teilweise | ✅ | P0 | VendorCustomers | crm_routes.py |
| M12 | **Communication** | ❌ Fehlt | ❌ | P2 | - | - |
| M13 | **WhiteLabel-Core** | 🔧 Teilweise | ❌ | P2 | - | franchise_routes.py |
| M14 | **Admin-Backoffice** | ✅ Vorhanden | ✅ | P0 | 5 Admin-Seiten | admin_routes.py |
| M15 | **API/Webhook-Layer** | 🔧 Teilweise | ✅ | P0 | apiClient.js | index.py |
| M16 | **Analytics** | ❌ Fehlt | ❌ | P3 | - | reports_routes.py |
| M17 | **KI-Funktionen** | ❌ Fehlt | ❌ | P3 | - | - |

### 3.2 M1 — SaaS-Core

**Zweck:** Mandantenfähigkeit, Rollen/Rechte, Tenant-Isolation, WhiteLabel-Vorbereitung.

**Ist-Zustand:** 🔧 Teilweise
- Auth-System vorhanden (JWT, Login/Register/Refresh, TOTP 2FA)
- Rollen: customer, vendor, admin, franchiser (in DB, aber Frontend-Prüfung unvollständig)
- Kein echtes Multi-Tenant-Modell (Vendor-Isolation über RLS)
- Kein separates Tenant-/Organisations-Modell
- Kein Subscription/Trial-Handling im Frontend (Backend: plans_routes.py)

**SOLL:**
- Tenant-Entity mit Isolation (jeder Vendor = Tenant)
- Subscription-/Trial-Status pro Tenant
- Feature-Flags pro Tarif
- WhiteLabel-Konfiguration pro Tenant
- Tenant-Konfiguration (Sprache, Währung, Branding)

**Kritisch:** Rollen-/Rechteprüfung MUSS auf API-Ebene konsistent sein. Frontend-Routing allein reicht nicht.

### 3.3 M2 — Vendor-System

**Zweck:** Vendor-Profil, Standorte, Mitarbeiter, Services, Preise, Bilder, Öffnungszeiten, Ressourcen.

**Ist-Zustand:** 🔧 Teilweise
- 8 Vendor-Frontend-Seiten vorhanden
- Backend-Endpoints für Vendors, Services, Employees, Locations, Hours
- Teilweise Mock-Daten in Frontends
- Keine Vendor-Onboarding-Struktur (nacheinander führen)

**MVP-Lücken:**
- Kein strukturiertes Onboarding (Schritt für Schritt)
- Keine Upload-Funktion für Bilder (Backend vorhanden, Frontend fehlt)
- Preise/Dauer/Puffer im Frontend konfigurierbar (Backend API vorhanden)
- Keine Mitarbeiter-Kalender-Synchronisation

### 3.4 M3 — Booking-Engine

**Zweck:** Zeitslots, Verfügbarkeiten, Buchungserstellung, Statusmodell, Kollisionsprüfung.

**Ist-Zustand:** 🔧 Teilweise
- Backend: 8 Endpoints, 504 Zeilen (Buchung, Slots, Kalender, Storno)
- Frontend: Buchungsflow fehlt als eigenständige Komponente
- Kein dediziertes BookingWidget

**Kritische Anforderung:**
- Kollisionsprüfung MUSS serverseitig erfolgen (Race-Conditions verhindern)
- Zeitslots müssen blockierbar, reservierbar, affiliate-fähig sein
- Statusmodell: pending → confirmed → completed | cancelled | no-show
- Buchungsbestätigung via E-Mail (Resend)

### 3.5 M4 — Calendar-Engine

**Zweck:** Verfügbarkeiten, Blockzeiten, Öffnungszeiten, Mitarbeiter-/Standortkalender.

**Ist-Zustand:** 🔧 Teilweise
- Backend: hours_routes.py (Öffnungszeiten + Ausnahmen)
- Frontend: VendorHoursPage vorhanden
- Keine Kalender-UI-Komponente (für Kunde)
- Keine Zeitzonen-Unterstützung

### 3.6 M5 — Resource-Engine

**Zweck:** Räume, Geräte, Materialien, die für Termine benötigt werden.

**Ist-Zustand:** ❌ Fehlt
- Nicht im Backend oder Frontend vorhanden
- Für MVP nicht erforderlich (Phase 2)

### 3.7 M6 — Marketplace

**Zweck:** Öffentliches Verzeichnis, Suche/Filter, Vendor-Unterseiten, Direktbuchung.

**Ist-Zustand:** ✅ Vorhanden
- MarketplacePage: Suche, Filter (Kategorie, Standort), Vendor-Karten
- MarketplaceApi ruft `/api/public/marketplace/vendors` auf
- Backend: 5 Endpoints, 200 Zeilen

**MVP-Lücken:**
- Keine Detailseite pro Vendor (nur Karten-Übersicht)
- Kein Direktbuchungslink auf Vendor-Seite
- Bewertungen/Ratings nicht sichtbar im Marketplace

### 3.8 M7 — Affiliate-Tracking

**Zweck:** Trackinglinks, Klick-Erfassung, Conversion-Zuordnung, Provisionen, Kampagnen.

**Ist-Zustand:** 🔧 Teilweise
- Backend: 5 Endpoints, 308 Zeilen (Link erstellen, Commissions, Stats)
- Frontend: VendorAffiliatesPage vorhanden
- Kein separates Affiliate-Dashboard
- Keine Klick-Tracking-Infrastruktur (Pixel/Redirect)
- Keine Kampagnen-Verwaltung

**Kritisch:** Das Affiliate-System muss als Kernbestandteil der Booking-Engine geplant werden, nicht als nachträglicher Anbau.

### 3.9 M8 — Commission-Engine

**Zweck:** Provisionsregeln, Berechnung, Split-Logik, Auszahlungsplan.

**Ist-Zustand:** ❌ Fehlt
- Keine eigenen Endpoints
- Provisionen sind rudimentär in affiliate_routes.py
- Kein Provisionsregel-System (fixe Beträge, Prozente, Staffeln, Caps)
- Kein Split zwischen Vendor/Plattform/Affiliate/Franchise

### 3.10 M9 — Wallet/Ledger

**Zweck:** Wallet pro Nutzer, unveränderbare Ledger-Einträge, Payout Requests.

**Ist-Zustand:** 🔧 Teilweise
- Backend: 4 Endpoints, 284 Zeilen (Balance, Transactions, Deposit, Withdraw)
- Frontend: VendorWalletPage vorhanden
- Ledger-Einträge NICHT unveränderbar (fehlende Audit-Logik)
- Keine Status-Modell-Durchsetzung (pending → approved → paid)

**Kritisch:** Ledger-Einträge MÜSSEN unveränderbar sein. Korrekturen nur via Storno-Buchung, nicht via UPDATE.

### 3.11 M10 — Payment-Abstraktion

**Zweck:** Provider-unabhängige Zahlungsabwicklung, Stripe/PayPal/Mollie/Klarna.

**Ist-Zustand:** 🔧 Teilweise
- Backend: checkout_routes.py (Stripe Checkout Sessions, Webhooks)
- Stripe als einziger Provider implementiert
- Keine Provider-Abstraktion (hart auf Stripe gekoppelt)
- Kein Split-Payment (Vendor/Plattform/Affiliate)
- Kein eigenes Vendor-Zahlungskonto

### 3.12 M11 — CRM

**Zweck:** Kundenprofile, Buchungshistorie, Tags, Segmente, Wiederkehrer-Erkennung.

**Ist-Zustand:** 🔧 Teilweise
- Backend: 5 Endpoints, 249 Zeilen (Contacts, Stats)
- Frontend: VendorCustomersPage vorhanden
- Keine Segment-Logik
- Keine Wiederkehrer-Erkennung
- Keine Tags/Notizen im Frontend implementiert

### 3.13 M12 — Communication

**Zweck:** Buchungsbestätigungen, Erinnerungen, Follow-ups, Reaktivierungen, Kampagnen.

**Ist-Zustand:** ❌ Fehlt
- Resend API ist in config.py konfiguriert
- Aber keine strukturierten E-Mail-Templates
- Kein automatischer E-Mail-Versand bei Buchungsereignissen
- Keine Erinnerungen, Follow-ups oder Kampagnen

### 3.14 M13 — WhiteLabel-Core

**Zweck:** Eigene Domains, Branding, Loginseiten, Franchise-Strukturen.

**Ist-Zustand:** 🔧 Teilweise
- Backend: franchise_routes.py, branding_routes.py
- Frontend: FranchiserDashboardPage vorhanden
- Kein echtes WhiteLabel (eigene Domains, Branding pro Partner)
- Branding-Endpoints rudimentär (Logo-Upload + Farben)
- Keine Domain-Zuordnung pro Partner

### 3.15 M14 — Admin-Backoffice

**Zweck:** Plattformadmin, Vendor-/Nutzerverwaltung, Compliance, Systemstatus.

**Ist-Zustand:** ✅ Vorhanden
- Backend: 6 Endpoints, 349 Zeilen
- Frontend: AdminDashboard, AdminVendors, AdminUsers, AdminPlans, AdminReviews, AdminAudit
- Grundlegende Admin-Funktionen vorhanden

### 3.16 M15 — API/Webhook-Layer

**Zweck:** REST/JSON API, Auth, Rate Limits, Audit-Logs, externe Integrationen.

**Ist-Zustand:** 🔧 Teilweise
- REST-API vorhanden (FastAPI, ~186 Endpoints, OpenAPI/Swagger)
- JWT-Auth mit 4-Stufen-Fallback
- Keine Rate Limits
- Keine strukturierten Audit-Logs (audit_routes.py basic)
- Keine Webhook-Unterstützung für externe Integrationen
- Swagger-UI live unter /api/docs

---

## 4. MVP-Scope (P0-P1)

### 4.1 P0 — Fundament (MUSS für Launch)

| Bereich | Funktion | Status |
|---------|----------|--------|
| **Auth** | Register, Login, Logout, Refresh, Profile | ✅ Backend + Frontend |
| **Auth** | Forgot/Reset Password | ✅ Backend + Frontend |
| **Auth** | TOTP 2FA | ✅ Backend, ❌ Frontend |
| **Auth** | Rollen (customer, vendor, admin) | 🔧 Backend, ❌ Frontend |
| **Vendor** | Vendor anlegen | ✅ Backend, 🔧 Frontend |
| **Vendor** | Standorte verwalten | ✅ Backend, 🔧 Frontend |
| **Vendor** | Mitarbeiter verwalten | ✅ Backend, 🔧 Frontend |
| **Vendor** | Services anlegen (Name, Dauer, Preis) | ✅ Backend, 🔧 Frontend |
| **Booking** | Verfügbare Slots berechnen | ✅ Backend, ❌ BookingWidget |
| **Booking** | Buchung erstellen | ✅ Backend, ❌ BookingWidget |
| **Booking** | Buchung stornieren | ✅ Backend, ❌ Frontend |
| **Calendar** | Öffnungszeiten setzen | ✅ Backend, 🔧 Frontend |
| **Calendar** | Blockzeiten eintragen | ✅ Backend, 🔧 Frontend |
| **Marketplace** | Vendor-Liste öffentlich | ✅ Backend + Frontend |
| **Marketplace** | Nach Kategorie/Standort filtern | ✅ Backend, 🔧 Frontend |
| **Payment** | Stripe Checkout | ✅ Backend, ❌ Frontend-Integration |
| **Payment** | Webhook-Verarbeitung | ✅ Backend |
| **Admin** | Vendoren prüfen | ✅ Backend + Frontend |
| **Admin** | Systemstatus | ✅ Backend + Frontend |

### 4.2 P1 — Erweiterung (bald nach MVP)

| Bereich | Funktion | Status |
|---------|----------|--------|
| **Affiliate** | Trackinglink erstellen | ✅ Backend, 🔧 Frontend |
| **Affiliate** | Klick-Tracking | ❌ Fehlt |
| **Affiliate** | Provision berechnen | 🔧 Backend (rudimentär) |
| **Affiliate** | Affiliate-Dashboard | ❌ Fehlt |
| **Wallet** | Wallet anzeigen | ✅ Backend + Frontend |
| **Wallet** | Ledger-Einträge (unveränderbar) | ❌ Fehlt |
| **Wallet** | Auszahlung beantragen | ✅ Backend, 🔧 Frontend |
| **Booking** | Umbuchung | ✅ Backend |
| **Booking** | Buchungsbestätigung (E-Mail) | ❌ Fehlt |
| **Booking** | Gruppenbuchungen | ❌ Fehlt |
| **CRM** | Kundenprofil mit Historie | ✅ Backend, 🔧 Frontend |
| **CRM** | Tags/Notizen | ❌ Fehlt |
| **Reports** | Umsatzbericht | ✅ Backend + Frontend |
| **Reports** | Buchungsbericht | ✅ Backend + Frontend |
| **Admin** | Wallet-Prüfung | ❌ Fehlt |
| **Admin** | Provisionsstatus ändern | ❌ Fehlt |

### 4.3 P2 — Erweiterung

| Bereich | Funktion |
|---------|----------|
| **WhiteLabel** | Eigene Domains pro Partner |
| **WhiteLabel** | Branding-Konfiguration |
| **Franchise** | Franchise-Strukturen |
| **CRM** | Erweiterte Automationen |
| **CRM** | Marketing-Segmente |
| **Resource** | Ressourcenverwaltung (Räume, Geräte) |
| **Communication** | E-Mail-Templates |
| **Communication** | Erinnerungen & Follow-ups |
| **Booking** | Wiederkehrende Termine |
| **Booking** | Paketbuchungen |
| **Affiliate** | Kampagnenverwaltung |
| **Analytics** | Erweiterte Auswertungen |

### 4.4 P3 — Zukunft

| Bereich | Funktion |
|---------|----------|
| **KI** | AI-CRM (Reaktivierung, Follow-ups) |
| **KI** | No-Show-Erkennung |
| **KI** | Marketingtext-Generator |
| **KI** | Auslastungsoptimierung |
| **Apps** | Native iOS/Android Apps |
| **International** | Multi-Country, Multi-Currency |
| **International** | Globaler Marketplace |
| **Payment** | PayPal, Mollie, Klarna |

---

## 5. Datenmodell

### 5.1 Entitäten und Beziehungen

```
Tenant (1) ──< Vendor (1) ──< VendorLocation
                              < StaffMember
                              < Service
                              < ServicePackage
                              < Resource
                              < AvailabilityRule
                              < Calendar
                              < CalendarBlock
                              < MarketplaceListing
                              < AffiliateCampaign
                              < WhiteLabelConfig

User (1) ──< CustomerProfile
           < StaffMember (via Vendor)
           < Affiliate (via Vendor)
           < Wallet
           < Booking (als Kunde)
           < CRMNote
           < AuditLog

Booking (1) ──< BookingParticipant
              < BookingStatusHistory
              < PaymentTransaction
              < Commission
              < LedgerEntry (if refund)

Affiliate (1) ──< TrackingLink
                 < TrackingClick
                 < Commission

Wallet (1) ──< LedgerEntry
              < PayoutRequest

SubscriptionPlan (1) ──< TenantSubscription
```

### 5.2 Entity-Definitionen

#### Tenant
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | Auto |
| name | TEXT | Firmenname |
| slug | TEXT | URL-Slug |
| status | ENUM | active, trial, suspended, cancelled |
| trial_ends_at | TIMESTAMPTZ | Ende der Testphase |
| plan_id | UUID FK | Aktueller Tarif |
| locale | TEXT | Standard-Sprache (de, en) |
| currency | TEXT | Standard-Währung (EUR) |
| timezone | TEXT | Zeitzone |
| created_at | TIMESTAMPTZ | |

#### Vendor
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| tenant_id | UUID FK | Tenant-Zuordnung |
| name | TEXT | Firmenname |
| description | TEXT | Beschreibung |
| category | TEXT | Kategorie |
| email | TEXT | Kontakt-E-Mail |
| phone | TEXT | Telefon |
| status | ENUM | pending, active, suspended |
| visibility | ENUM | public, hidden, link_only |
| rating | REAL | 0.0-5.0 |
| image_url | TEXT | Logo-URL |
| stripe_account_id | TEXT | Stripe Connect ID |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### VendorLocation
| Feld | Typ |
|------|-----|
| id | UUID PK |
| vendor_id | UUID FK |
| name | TEXT |
| address | TEXT |
| city | TEXT |
| postal_code | TEXT |
| country | TEXT |
| lat | REAL |
| lng | REAL |
| is_primary | BOOLEAN |

#### Service
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| vendor_id | UUID FK | |
| name | TEXT | Dienstleistungsname |
| description | TEXT | |
| duration_minutes | INT | Dauer in Minuten |
| price | DECIMAL(10,2) | |
| buffer_before | INT | Puffer vor Termin (Min) |
| buffer_after | INT | Puffer nach Termin (Min) |
| max_participants | INT | 1 = Einzeltermin, >1 = Gruppe |
| is_online | BOOLEAN | Online-Termin |
| is_active | BOOLEAN | |
| category_id | UUID FK | |
| image_url | TEXT | |

#### StaffMember
| Feld | Typ |
|------|-----|
| id | UUID PK |
| vendor_id | UUID FK |
| user_id | UUID FK |
| role | ENUM | employee, manager |
| title | TEXT |
| is_active | BOOLEAN |
| services | UUID[] | Welche Services dieser MA anbietet |
| locations | UUID[] | An welchen Standorten |

#### Booking
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| vendor_id | UUID FK | |
| customer_id | UUID FK | |
| service_id | UUID FK | |
| staff_id | UUID FK | Mitarbeiter (optional) |
| location_id | UUID FK | Standort |
| start_time | TIMESTAMPTZ | Terminbeginn |
| end_time | TIMESTAMPTZ | Terminende |
| status | ENUM | pending, confirmed, completed, cancelled, no_show, rescheduled |
| total_price | DECIMAL(10,2) | |
| platform_fee | DECIMAL(10,2) | |
| affiliate_id | UUID FK | Vermittelnder Affiliate |
| source | TEXT | direct, marketplace, affiliate, qr_code |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### BookingStatusHistory (Audit)
| Feld | Typ |
|------|-----|
| id | UUID PK |
| booking_id | UUID FK |
| from_status | ENUM |
| to_status | ENUM |
| changed_by | UUID FK |
| reason | TEXT |
| created_at | TIMESTAMPTZ |

#### Affiliate
| Feld | Typ |
|------|-----|
| id | UUID PK |
| user_id | UUID FK |
| vendor_id | UUID FK | Auf welchen Vendor bezogen |
| status | ENUM | active, suspended |
| commission_rate | DECIMAL(5,2) | Prozent |
| referral_code | TEXT | Eindeutiger Code |
| created_at | TIMESTAMPTZ |

#### TrackingLink
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| affiliate_id | UUID FK | |
| vendor_id | UUID FK | |
| service_id | UUID FK | Optional: Nur für diesen Service |
| type | ENUM | vendor, service, package, voucher, timeslot |
| code | TEXT | Eindeutiger Short-Code |
| target_url | TEXT | Ziel-URL nach Klick |
| utm_params | JSONB | UTM-Parameter |
| clicks | INT | Counter |
| conversions | INT | Counter |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

#### TrackingClick
| Feld | Typ |
|------|-----|
| id | UUID PK |
| tracking_link_id | UUID FK |
| ip_address | TEXT |
| user_agent | TEXT |
| referer | TEXT |
| converted | BOOLEAN |
| booking_id | UUID FK |
| created_at | TIMESTAMPTZ |

#### Commission
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| booking_id | UUID FK | |
| affiliate_id | UUID FK | |
| vendor_id | UUID FK | |
| amount | DECIMAL(10,2) | |
| rate | DECIMAL(5,2) | Angewandter Prozentsatz |
| type | ENUM | affiliate, franchise, referral |
| status | ENUM | pending, approved, paid, cancelled |
| payout_id | UUID FK | Verweis auf Auszahlung |
| created_at | TIMESTAMPTZ | |
| approved_at | TIMESTAMPTZ | |

#### Wallet
| Feld | Typ |
|------|-----|
| id | UUID PK |
| user_id | UUID FK |
| balance | DECIMAL(12,2) |
| pending_balance | DECIMAL(12,2) |
| currency | TEXT |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

#### LedgerEntry
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| wallet_id | UUID FK | |
| type | ENUM | commission, payout, refund, credit, debit, fee, correction |
| amount | DECIMAL(12,2) | Positiv = Gutschrift, Negativ = Belastung |
| balance_before | DECIMAL(12,2) | |
| balance_after | DECIMAL(12,2) | |
| reference_type | TEXT | booking, payout, correction |
| reference_id | UUID | |
| description | TEXT | |
| is_correction | BOOLEAN | True wenn Korrektur-Gegenbuchung |
| corrected_entry_id | UUID FK | Wenn Korrektur, Verweis auf korrigierten Eintrag |
| created_at | TIMESTAMPTZ | UNVERÄNDERBAR |

> **⚠️ Wichtig:** LedgerEntry ist APPEND-ONLY. Niemals UPDATE oder DELETE.
> Korrekturen erfolgen via Gegenbuchung (is_correction=true, corrected_entry_id)

#### PayoutRequest
| Feld | Typ |
|------|-----|
| id | UUID PK |
| wallet_id | UUID FK |
| user_id | UUID FK |
| amount | DECIMAL(12,2) |
| status | ENUM | requested, approved, processing, completed, rejected |
| payment_method | TEXT | Banküberweisung, Stripe, PayPal |
| payment_details | JSONB | Bankdaten etc. |
| approved_by | UUID FK | Admin |
| processed_at | TIMESTAMPTZ |
| notes | TEXT |

#### SubscriptionPlan
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID PK | |
| name | TEXT | Standard, Affiliate-Booking |
| tier | ENUM | standard, affiliate_business |
| price_monthly | DECIMAL(10,2) | 49.00, 189.00 |
| features | JSONB | Feature-Flags |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

#### Trial
| Feld | Typ |
|------|-----|
| id | UUID PK |
| tenant_id | UUID FK |
| vendor_id | UUID FK |
| started_at | TIMESTAMPTZ |
| ends_at | TIMESTAMPTZ |
| status | ENUM | active, converted, expired, cancelled |

#### Notification
| Feld | Typ |
|------|-----|
| id | UUID PK |
| user_id | UUID FK |
| type | ENUM | booking_confirmed, booking_reminder, commission_earned, payout_processed |
| title | TEXT |
| body | TEXT |
| is_read | BOOLEAN |
| data | JSONB |
| created_at | TIMESTAMPTZ |

#### AuditLog
| Feld | Typ |
|------|-----|
| id | UUID PK |
| actor_id | UUID FK |
| action | TEXT | create, update, delete, approve, payout, correction |
| resource_type | TEXT | booking, wallet, vendor, user, commission |
| resource_id | UUID |
| old_values | JSONB |
| new_values | JSONB |
| ip_address | TEXT |
| created_at | TIMESTAMPTZ | UNVERÄNDERBAR |

#### WhiteLabelConfig
| Feld | Typ |
|------|-----|
| id | UUID PK |
| partner_id | UUID FK |
| domain | TEXT | Eigene Domain |
| brand_name | TEXT |
| logo_url | TEXT |
| primary_color | TEXT |
| secondary_color | TEXT |
| custom_css | TEXT |
| is_active | BOOLEAN |
| created_at | TIMESTAMPTZ |

---

## 6. API-Struktur

### 6.1 Aktuelle API (186 Endpoints)

Siehe Backend-README für vollständige Liste: `/root/bookando-backend/README.md`

### 6.2 Fehlende/zu ergänzende Endpoints

| Endpoint | Zweck | Priorität |
|----------|-------|-----------|
| POST /api/bookings/available-slots | Verbesserte Slot-Suche (mit Affiliate-Param) | P0 |
| POST /api/bookings/{id}/reschedule | Umbuchung mit Verfügbarkeitsprüfung | P1 |
| POST /api/bookings/{id}/cancel | Storno mit Grund | P0 |
| GET /api/bookings/calendar | Kalenderansicht für Vendor | P0 |
| POST /api/affiliate/track-click | Klick-Tracking (Pixel/Redirect) | P1 |
| GET /api/affiliate/dashboard/stats | Affiliate-KPI-Übersicht | P1 |
| POST /api/commissions/calculate | Provisionsberechnung auslösen | P1 |
| POST /api/commissions/approve/{id} | Provision freigeben (Admin) | P1 |
| POST /api/wallet/correction | Wallet-Korrektur (Admin, auditierbar) | P1 |
| PUT /api/tenant/settings | Tenant-Konfiguration | P2 |
| POST /api/whitelabel/domain/verify | Domain-Verifikation | P2 |
| POST /api/webhooks/{provider} | Webhook-Empfang (Stripe existiert) | P0 |
| POST /api/notifications/send | Manuellen Testversand | P2 |
| GET /api/reports/affiliate/csv | CSV-Export Affiliate | P1 |

---

## 7. Architekturvorgaben & ADRs

### ADR-001: Domain-Logik vom API-Layer trennen

**Status:** Vorgeschlagen
**Kontext:** Aktuell ist die gesamte Geschäftslogik in den Route-Dateien (api/*routes.py).
**Entscheidung:** Domain-Service-Layer in `api/services/` einführen. Routes rufen Services auf.
**Konsequenz:** Testbarer, wiederverwendbarer Code. Mehr Dateien, aber sauberere Trennung.

### ADR-002: Wallet/Ledger als Append-Only-System

**Status:** Vorgeschlagen
**Kontext:** Ledger-Einträge sind aktuell mutierbar (UPDATE möglich).
**Entscheidung:** Ledger-Einträge werden NUR via INSERT erstellt. Korrekturen via Gegenbuchung (is_correction=true, corrected_entry_id).
**Konsequenz:** Vollständige Audit-Trail. Komplexere Korrektur-Logik, aber manipulationssicher.

### ADR-003: Payment-Provider-Abstraktion

**Status:** Vorgeschlagen
**Kontext:** Stripe ist aktuell hart im Code (checkout_routes.py).
**Entscheidung:** PaymentService-Interface mit StripePaymentProvider als erste Implementierung. PayPal, Mollie, Klarna als weitere Provider vorbereitet.
**Konsequenz:** Kein Vendor-Lock-in. Neue Provider ohne Änderung an Booking/Wallet-Logik.

### ADR-004: Affiliate-Tracking als Kern der Booking-Engine

**Status:** Vorgeschlagen
**Kontext:** Affiliate ist aktuell ein separates Modul (angelagert).
**Entscheidung:** Jede Booking-Erstellung akzeptiert optionalen `affiliate_code`. Die Attribution erfolgt beim CREATE, nicht nachträglich. Commissions werden asynchron/delayed berechnet.
**Konsequenz:** Affiliate-System ist von Anfang an in die Booking-Engine integriert. Kein nachträgliches Anbauen.

### ADR-005: Multi-Tenant via Supabase RLS (Row Level Security)

**Status:** Vorgeschlagen
**Kontext:** Aktuell haben wir nur Vendor-Ebene, keine Tenant-Isolation.
**Entscheidung:** Supabase RLS für Tenant-Isolation nutzen. Jeder Vendor bekommt tenant_id. Jede Query filtert nach tenant_id via RLS-Policy.
**Konsequenz:** Sicherheits-Isolation auf Datenbank-Ebene. Weniger Application-Code für Auth-Checks.

---

## 8. Roadmap P0-P3

### 8.1 P0 — Fundament (vor Launch)

```
Woche 1-2: Booking-Engine + Calendar-Core
  - Verfügbare-Slots-API verbessern
  - BookingWidget (React-Komponente für Kunden)
  - Buchungsbestätigung per E-Mail (Resend)
  - Statusmodell (pending→confirmed→completed|cancelled)

Woche 2-3: Marketplace
  - Vendor-Detailseite (öffentlich)
  - Direktbuchung vom Marketplace
  - Bewertungen sichtbar machen

Woche 3-4: Zahlungsintegration
  - Stripe Checkout in Buchungsflow integrieren
  - Gebührenmodell (2,5% / 5% + 1€)
  - Split-Payment: Vendor + Plattform

Woche 4: Admin & Feinschliff
  - Admin-Prüfungs-Workflow
  - Vendor-Freigabe
  - Launch-Tests
```

### 8.2 P1 — Erweiterung (Woche 5-8)

```
Woche 5-6: Affiliate-System
  - Klick-Tracking (Redirect)
  - Commission-Engine
  - Affiliate-Dashboard
  - Auszahlungs-Workflow

Woche 6-7: Wallet/Ledger
  - Append-Only Ledger
  - Korrektur-Workflow
  - Auszahlungs-Admin

Woche 7-8: CRM-Ausbau
  - Tags, Notizen
  - Buchungshistorie
  - Reporting (CSV-Export)
```

### 8.3 P2 — WhiteLabel (Woche 9-12)

```
Woche 9-10: WhiteLabel-Core
  - Eigene Domains
  - Branding-Konfiguration
  - Partner-Dashboard

Woche 10-12: Franchise + Automation
  - Franchise-Strukturen
  - E-Mail-Templates
  - Erinnerungen
  - Wiederkehrende Termine
```

### 8.4 P3 — Zukunft (Woche 13+)

```
- KI-Funktionen (No-Show, Follow-ups, Marketingtexte)
- Native Apps (iOS/Android)
- Multi-Currency, Multi-Country
- PayPal, Mollie, Klarna
- Globaler Marketplace
```

---

## 9. Testplan

### 9.1 Unit-Tests

| Bereich | Tests | Priorität |
|---------|-------|-----------|
| Booking Logic | Zeitslot-Kalkulation, Kollisionsprüfung, Status-Übergänge | P0 |
| Wallet/Ledger | Append-Only, Saldo-Berechnung, Korrektur-Gegenbuchung | P0 |
| Commission | Berechnung (Prozent, Fix, Staffel, Cap), Split-Logik | P1 |
| Affiliate | Tracking-Code-Generierung, Duplikats-Prüfung | P1 |
| Calendar | Verfügbarkeit, Blockzeiten, Puffer, Überschneidungen | P0 |
| Payment | Gebührenberechnung, Status-Übergänge, Split | P0 |

### 9.2 Integration-Tests

| Bereich | Tests | Priorität |
|---------|-------|-----------|
| Auth | Register → Login → Token-Refresh → Logout | P0 |
| Booking | Service wählen → Slots holen → Buchen → Bestätigung | P0 |
| Booking | Doppelbuchung verhindern (Race Condition) | P0 |
| Affiliate | Link erstellen → Klick → Booking → Commission | P1 |
| Wallet | Commission → Ledger → Payout Request → Approve → Paid | P1 |
| Payment | Checkout → Stripe Webhook → Booking confirmed | P0 |

### 9.3 E2E-Tests

| Test | Szenario | Priorität |
|------|----------|-----------|
| Kunde bucht | Marketplace → Vendor → Service → Slot → Bezahlen → Bestätigung | P0 |
| Vendor-Onboarding | Register → Vendor anlegen → Services → Öffnungszeiten | P0 |
| Affiliate-Buchung | Link klicken → Buchen → Provision im Wallet | P1 |
| Admin-Prüfung | Vendoren prüfen, freigeben, Wallet prüfen | P1 |

### 9.4 Sicherheits-Tests

| Test | Beschreibung | Priorität |
|------|-------------|-----------|
| RBAC | Vendor kann nicht andere Vendor-Buchungen sehen | P0 |
| RBAC | Kunde kann nicht auf Admin-Funktionen zugreifen | P0 |
| IDOR | Fremde booking_id, wallet_id, vendor_id testen | P0 |
| Rate-Limiting | Login-Brute-Force, API-DoS-Schutz | P1 |
| Audit | Alle Status-Änderungen geloggt? | P0 |

---

## 10. IST/SOLL-Gap-Analyse

### 10.1 Frontend

| Bereich | IST | SOLL (MVP) | Lücke |
|---------|-----|------------|-------|
| BookingWidget | ❌ Fehlt | Komponente für Service→Slot→Buchung | 🔴 Kritisch |
| Vendor-Detailseite | ❌ Fehlt | Öffentliche Vendor-Seite | 🟠 Hoch |
| Booking-Flow im Dashboard | ❌ Fehlt | Customer kann buchen/stornieren | 🟠 Hoch |
| TOTP 2FA UI | ❌ Fehlt | QR-Code-Scan + Verify | 🟢 Mittel |
| Onboarding-Flow | ❌ Fehlt | Schritt-für-Schritt für Vendor | 🟠 Hoch |
| Affiliate-Dashboard | ❌ Fehlt | Links, Klicks, Provisionen | 🟠 Hoch |
| Mock-Daten ersetzen | 🔧 Teilweise | Echte API-Daten in allen Pages | 🟠 Hoch |
| Echtzeit-Kalender | ❌ Fehlt | FullCalendar-ähnliche Ansicht | 🟢 Mittel |

### 10.2 Backend

| Bereich | IST | SOLL (MVP) | Lücke |
|---------|-----|------------|-------|
| Ledger unveränderbar | ❌ Fehlt | Append-Only LedgerEntry | 🔴 Kritisch |
| Commission-Engine | ❌ Fehlt | Berechnung + Split + Status | 🔴 Kritisch |
| Klick-Tracking | ❌ Fehlt | Pixel/Redirect-Infrastruktur | 🟠 Hoch |
| Provider-Abstraktion | ❌ Fehlt | PaymentService-Interface | 🟠 Hoch |
| Rate Limits | ❌ Fehlt | Pro-Endpoint-Rate-Limits | 🟠 Hoch |
| E-Mail-Templates | ❌ Fehlt | Bestätigung, Erinnerung | 🟠 Hoch |
| Tests (gesamte API) | ❌ Fehlt | Unit + Integration + E2E | 🔴 Kritisch |
| CI/CD Pipeline | ❌ Fehlt | Automatisierte Tests vor Deploy | 🟠 Hoch |

### 10.3 Dokumentation

| Bereich | IST | SOLL | Lücke |
|---------|-----|------|-------|
| Pflichtenheft | ✅ 852 Zeilen | Vollständig | ✅ |
| README (Frontend) | ✅ 223 Zeilen | Vollständig | ✅ |
| README (Backend) | ✅ 575 Zeilen | Neu erstellt | ✅ |
| ARCHITECTURE.md | ✅ 236 Zeilen | Vollständig | ✅ |
| DEVELOPMENT.md | ✅ 306 Zeilen | Vollständig | ✅ |
| Markenrichtlinien | ✅ 106 Zeilen | Vollständig | ✅ |
| OpenAPI/Swagger | 🔧 Vorhanden | Automatisch (FastAPI) | ✅ |
| ADR-Dokumentation | ❌ Fehlt | In diesem Dokument | 🔧 Neu |
| Test-Dokumentation | ❌ Fehlt | In diesem Dokument | 🔧 Neu |
| Deployment-Doku | 🔧 Teilweise | In READMEs | 🟢 |

---

## 11. Dokumentationsindex

### 11.1 Alle Projektdokumente

| Datei | Zeilen | Beschreibung | Status |
|-------|--------|-------------|--------|
| `PFLICHTENHEFT.md` | 852 | Produkt-Anforderungsdokument | ✅ Aktuell |
| `README.md` | 223 | Frontend-Projektdokumentation | ✅ Aktuell |
| `docs/ARCHITECTURE.md` | 236 | Architektur-Dokumentation | ✅ Aktuell |
| `docs/DEVELOPMENT.md` | 306 | Entwickler-Dokumentation | ✅ Aktuell |
| `docs/Bookando_Markenrichtlinien.md` | 106 | Markenrichtlinien v2 | ✅ Aktuell |
| `docs/PRODUKTSTRUKTUR.md` | - | Diese Datei | 🔧 Neu |
| `/root/bookando-backend/README.md` | 575 | Backend-Dokumentation | ✅ Neu |
| `/root/.config/goose/MODEL_ROUTING.md` | 55 | Goose-Modell-Routing | ✅ Aktuell |

### 11.2 API-Dokumentation

| Quelle | Format | Pfad | Status |
|--------|--------|------|--------|
| FastAPI Swagger UI | OpenAPI | `https://bookando-backend.vercel.app/api/docs` | ✅ Live |
| Backend-README (Endpoint-Tabellen) | Markdown | `bookando-backend/README.md §5` | ✅ Aktuell |
| PRODUKTSTRUKTUR.md (§6) | Markdown | Diese Datei | 🔧 Neu |

### 11.3 Fehlende/geplante Dokumente

| Dokument | Geplant für | Priorität |
|----------|-------------|-----------|
| ADR-Archiv (`docs/adr/ADR-*.md`) | P0 | Hoch |
| Datenbank-Schema (`docs/SCHEMA.md`) | P0 | Hoch |
| Payment-Flow-Doku (`docs/PAYMENT_FLOW.md`) | P0 | Hoch |
| Affiliate-Attribution (`docs/AFFILIATE_ATTRIBUTION.md`) | P1 | Mittel |
| Wallet/Ledger-Architektur (`docs/WALLET_LEDGER.md`) | P1 | Mittel |
| Deployment-Runbook (`docs/DEPLOYMENT.md`) | P1 | Mittel |
| Test-Spezifikation (`docs/TEST_SPEC.md`) | P0 | Hoch |
| Betriebshandbuch (`docs/OPS.md`) | P1 | Mittel |

---

## Anhang: Glossar

| Begriff | Definition |
|---------|-----------|
| **Vendor** | Dienstleister (Friseur, Tattoo-Studio, etc.) |
| **Tenant** | Abrechnungseinheit (kann mehrere Vendors enthalten) |
| **Affiliate** | Partner, der Vendors bewirbt und Provision erhält |
| **Wallet** | Guthaben-Konto für Provisionen/Auszahlungen |
| **Ledger** | Unveränderbares Buchungsjournal |
| **Commission** | Provision für vermittelte Buchung |
| **Booking** | Ein gebuchter Termin |
| **Slot** | Verfügbarer Zeitslot |
| **RLS** | Row Level Security (Supabase) |
| **Split** | Aufteilung einer Zahlung (Vendor/Plattform/Affiliate) |
| **WhiteLabel** | Partner mit eigenem Branding/Domain |
| **Franchise** | Mehrere Standorte unter einer Marke |
