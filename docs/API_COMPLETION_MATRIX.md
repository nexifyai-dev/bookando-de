# Bookando — API Completion Matrix

> **Stand:** 06.06.2026 | **Backend:** `nexifyai-dev/bookando-api`

---

## A. Public API

| Endpoint | Methode | Auth | Payload | Response | Status | Frontend | Prio |
|----------|---------|------|---------|----------|--------|----------|------|
| `/api/health` | GET | — | — | `{"status":"healthy"}` | ✅ | Smoke-Test | P0 |
| `/api/stats` | GET | — | — | Plattform-Stats | ✅ | — | P0 |
| `/api/languages` | GET | — | — | Sprachen | ✅ | LanguageSwitcher | P0 |
| `/api/public/marketplace/vendors` | GET | — | `?category,country,search` | `[{id,company_name,category,city,rating}]` | ✅ | MarketplacePage | P0 |
| `/api/marketplace/{id}` | GET | — | — | Vendor-Profil | ✅ | VendorDetailPage | P0 |
| `/api/marketplace/{id}/services` | GET | — | — | `[{id,name,price,duration}]` | ✅ | VendorDetailPage | P0 |
| `/api/marketplace/{id}/reviews` | GET | — | — | `[{id,rating,text}]` | ✅ | VendorDetailPage | P1 |
| `/api/bookings/slots` | POST | — | `{vendor_id,service_id,date}` | `[{start,end}]` | ✅ | BookingWidget | P0 |
| `/api/bookings` | POST | opt | `{vendor_id,service_id,start_at,customer_name,email}` | `{id,status,pending}` | ✅ | BookingWidget | P0 |
| `/api/auth/register` | POST | — | `{email,password,name}` | `{access_token,user}` | ✅ | RegisterPage | P0 |
| `/api/auth/login` | POST | — | `{email,password}` | `{access_token,refresh_token}` | ✅ | LoginPage | P0 |
| `/api/auth/refresh` | POST | RT | `{refresh_token}` | `{access_token}` | ✅ | AuthContext | P0 |
| `/api/auth/forgot-password` | POST | — | `{email}` | `{message}` | ✅ | ForgotPassword | P0 |
| `/api/auth/reset-password` | POST | Token | `{token,password}` | `{message}` | ✅ | ResetPassword | P0 |

## B. Customer API

| Endpoint | Methode | Auth | Payload | Response | Status | Frontend | Prio |
|----------|---------|------|---------|----------|--------|----------|------|
| `GET /api/auth/me` | GET | JWT | — | User-Profil | ✅ | CustomerProfile, Auth | P0 |
| `PUT /api/auth/profile` | PUT | JWT | `{name,email,phone}` | User | ✅ | CustomerProfile | P1 |
| `DELETE /api/auth/account` | DELETE | JWT | — | — | ✅ | CustomerProfile | P2 |
| `GET /api/customer/bookings` | GET | JWT | `?status` | `[{id,service,start_at,status}]` | ✅ | CustomerBookings | P1 |
| `DELETE /api/customer/bookings/{id}` | DELETE | JWT | — | — | ✅ | CustomerBookings | P1 |
| `PATCH /api/customer/bookings/{id}/reschedule` | PATCH | JWT | `{start_at}` | Booking | ✅ | CustomerBookings | P1 |
| `POST /api/reviews` | POST | JWT | `{vendor_id,rating,text}` | Review | ✅ | VendorDetailPage | P2 |
| `GET /api/notifications` | GET | JWT | — | `[{id,title,body}]` | ✅ | — | P2 |
| `POST /api/help/tickets` | POST | JWT | `{subject,body}` | Ticket | ⚠️ Backend | ❌ Frontend | P3 |

## C. Vendor API

| Endpoint | Methode | Auth | Beschreibung | Status | Frontend | Prio |
|----------|---------|------|-------------|--------|----------|------|
| `GET /api/vendor/stats` | GET | JWT | Dashboard-KPIs | ✅ | VendorDashboard | P0 |
| `POST /api/vendors/register` | POST | JWT | Vendor anlegen | ✅ | Onboarding | P0 |
| `PUT /api/vendors/{id}` | PUT | JWT | Vendor bearbeiten | ✅ | VendorSettings | P1 |
| **`PATCH /api/vendor/bookings/{id}`** | PATCH | JWT | **Status ändern (confirm/cancel/complete)** | ⚠️ | **VendorBookings** | **P1** |
| `GET /api/vendor/bookings` | GET | JWT | Buchungen | ✅ | VendorBookings | P0 |
| `GET /api/vendor/services` | GET | JWT | Services | ✅ | VendorServices | P0 |
| `POST /api/vendor/services` | POST | JWT | Service anlegen | ✅ | VendorServices | P0 |
| `PATCH /api/vendor/services/{id}` | PATCH | JWT | Service bearbeiten | ✅ | VendorServices | P0 |
| `DELETE /api/vendor/services/{id}` | DELETE | JWT | Service löschen | ✅ | VendorServices | P1 |
| `GET /api/vendor/employees` | GET | JWT | Mitarbeiter | ✅ | VendorEmployees | P0 |
| `POST /api/vendor/employees` | POST | JWT | Mitarbeiter anlegen | ✅ | VendorEmployees | P0 |
| `PATCH /api/vendor/employees/{id}` | PATCH | JWT | Mitarbeiter bearbeiten | ✅ | VendorEmployees | P1 |
| `GET /api/vendor/locations` | GET | JWT | Standorte | ✅ | VendorLocations | P0 |
| `POST /api/locations` | POST | JWT | Standort anlegen | ✅ | VendorLocations | P0 |
| `PATCH /api/locations/{id}` | PATCH | JWT | Standort bearbeiten | ✅ | VendorLocations | P1 |
| `GET /api/vendor/working-hours` | GET | JWT | Öffnungszeiten | ✅ | VendorHours | P0 |
| `PUT /api/vendor/working-hours` | PUT | JWT | Öffnungszeiten setzen | ✅ | VendorHours | P0 |
| `GET /api/crm/contacts` | GET | JWT | Kunden | ✅ | VendorCustomers | P1 |
| `POST /api/crm/contacts` | POST | JWT | Kunde/Notiz anlegen | ✅ | VendorCustomers | P1 |
| `GET /api/wallet/balance` | GET | JWT | Wallet | ✅ | VendorWallet | P1 |
| `GET /api/wallet/transactions` | GET | JWT | Transaktionen | ✅ | VendorWallet | P1 |
| `POST /api/wallet/withdraw` | POST | JWT | Auszahlung | ✅ | VendorWallet | P1 |
| `GET /api/affiliate/links` | GET | JWT | Affiliate-Links | ✅ | VendorAffiliates | P1 |
| `POST /api/affiliate/link` | POST | JWT | Link erstellen | ✅ | VendorAffiliates | P1 |
| `GET /api/affiliate/commissions` | GET | JWT | Provisionen | ✅ | VendorAffiliates | P1 |
| `POST /api/reports/revenue` | POST | JWT | Umsatzbericht | ✅ | VendorReports | P1 |
| `GET /api/reports/export/csv` | GET | JWT | CSV-Export | ✅ | VendorReports | P1 |
| `PUT /api/branding/{id}` | PUT | JWT | Branding | ✅ | VendorBranding | P1 |
| **`POST /api/checkout/create-session`** | POST | JWT | **Checkout (Stripe)** | ✅ | **BookingWidget** | **P1** |
| **❌ PATCH /api/vendor/bookings/{id}/status** | PATCH | JWT | **Buchungsstatus ändern** | ❌ Fehlt | **P1 Blocker** | **P1** |
| **❌ POST /api/packages** | POST | JWT | **Paket anlegen** | ⚠️ | ❌ | P2 |
| **❌ POST /api/resources** | POST | JWT | **Ressource anlegen** | ⚠️ | ❌ | P2 |

## D. Affiliate API

| Endpoint | Methode | Auth | Beschreibung | Status | Frontend | Prio |
|----------|---------|------|-------------|--------|----------|------|
| `GET /api/affiliate/links` | GET | JWT | Eigene Links | ✅ | AffiliateLinks | P1 |
| `POST /api/affiliate/link` | POST | JWT | Link erstellen | ✅ | AffiliateLinks | P1 |
| `GET /api/affiliate/links/{code}` | GET | JWT | Link-Details | ✅ | — | P1 |
| `GET /api/affiliate/commissions` | GET | JWT | Provisionen | ✅ | AffiliateCommissions | P1 |
| `GET /api/affiliate/stats` | GET | JWT | Dashboard-KPIs | ✅ | AffiliateDashboard | P1 |
| **❌ GET /api/affiliate/clicks** | GET | JWT | **Klicks abrufen** | ❌ Fehlt | **P1 Blocker** | P1 |
| `GET /api/wallet/balance` | GET | JWT | Wallet | ✅ | AffiliateWallet | P1 |
| `GET /api/wallet/transactions` | GET | JWT | Transaktionen | ✅ | AffiliateWallet | P1 |
| `POST /api/wallet/withdraw` | POST | JWT | Auszahlung | ✅ | AffiliateWallet | P1 |
| `GET /api/commissions` | GET | JWT | Eigene Commissions | ✅ NEU | AdminCommission | P0 |

## E. Admin API

| Endpoint | Methode | Auth | Beschreibung | Status | Frontend | Prio |
|----------|---------|------|-------------|--------|----------|------|
| `GET /api/admin/stats` | GET | Admin | Dashboard-KPIs | ✅ | AdminDashboard | P0 |
| `GET /api/admin/users` | GET | Admin | User-Liste | ✅ | AdminUsers | P0 |
| `PUT /api/admin/users/{id}` | PUT | Admin | User bearbeiten | ✅ | AdminUsers | P1 |
| `GET /api/admin/vendors` | GET | Admin | Vendor-Liste | ✅ | AdminVendors | P0 |
| `PUT /api/admin/vendors/{id}` | PUT | Admin | Vendor bearbeiten | ✅ | AdminVendors | P1 |
| `GET /api/commissions` | GET | Admin | Commissions | ✅ NEU | AdminCommission | P0 |
| `PATCH /api/commissions/{id}/approve` | PATCH | Admin | Approve | ✅ NEU | AdminCommission | P0 |
| `PATCH /api/commissions/{id}/cancel` | PATCH | Admin | Cancel | ✅ NEU | AdminCommission | P0 |
| `GET /api/plans` | GET | Admin | Pläne | ✅ | AdminPlans | P1 |
| `GET /api/reviews` | GET | Admin | Reviews | ✅ | AdminReviews | P1 |
| `GET /api/audit/logs` | GET | Admin | Audit-Logs | ✅ | AdminAudit | P1 |
| `GET /api/help/tickets` | GET | Admin | Tickets | ⚠️ | ❌ | P3 |
| `GET /api/bookings` | GET | Admin | **Alle Buchungen** | ❌ Fehlt | **P1 Blocker** | P1 |
| **❌ GET /api/wallet/withdrawals** | GET | Admin | Payout-Liste | ❌ | **P1** | P1 |
| **❌ PATCH /api/payouts/{id}/approve** | PATCH | Admin | Payout freigeben | ❌ | **P1** | P1 |
| **❌ PATCH /api/payouts/{id}/reject** | PATCH | Admin | Payout ablehnen | ❌ | P2 | P2 |

## F. WhiteLabel/Franchise API

| Endpoint | Methode | Auth | Beschreibung | Status | Frontend | Prio |
|----------|---------|------|-------------|--------|----------|------|
| `GET /api/franchises` | GET | JWT | Franchise-Liste | ✅ | FranchiserDashboard | P3 |
| `GET /api/franchises/{id}/vendors` | GET | JWT | Franchise-Vendors | ✅ | FranchiserVendors | P3 |
| `PUT /api/branding/{id}` | PUT | JWT | Branding | ✅ | — | P3 |
| **❌ POST /api/whitelabel/domain/verify** | POST | JWT | Domain-Verifikation | ❌ | — | P3 |

## G. Fehlende Endpoints (Gesamt)

| Bereich | Vorhanden | ⚠️ Teilw. | ❌ Fehlt | Gesamt | Erfüllung |
|---------|-----------|-----------|---------|--------|-----------|
| Public | 12 | 0 | 0 | 12 | **100%** |
| Customer | 8 | 1 | 1 | 10 | **80%** |
| Vendor | 25 | 2 | 6 | 33 | **76%** |
| Affiliate | 8 | 0 | 1 | 9 | **89%** |
| Admin | 11 | 1 | 4 | 16 | **69%** |
| WhiteLabel | 3 | 0 | 1 | 4 | **75%** |
| **Gesamt** | **67** | **4** | **13** | **84** | **80%** |
