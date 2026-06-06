# Bookando — API-Frontend-Vertrag (Contract Matrix)

> **Stand:** 06.06.2026
> **Frontend Commit:** `81b8217` | **Backend Commit:** `eb99e31`

---

## A. Öffentliche Seiten (Public)

### A.1 MarketplacePage → `/marketplace`

| Endpoint | Method | Payload | Response | Status |
|----------|--------|---------|----------|--------|
| `/api/public/marketplace/vendors` | GET | `?category=&country=&search=` | `[{id, company_name, category, city, country, description, logo_url, rating_average, rating_count, services_count}]` | ✅ |
| `/api/public/marketplace/countries` | GET | — | `[{country}]` | ✅ |

### A.2 VendorDetailPage → `/marketplace/:slug`

| Endpoint | Method | Payload | Response | Status |
|----------|--------|---------|----------|--------|
| `/api/marketplace/{vendor_id}` | GET | — | `{id, company_name, category, city, country, description, logo_url, rating_average, rating_count}` | ✅ |
| `/api/marketplace/{vendor_id}/services` | GET | — | `[{id, name, description, price, duration_minutes, is_online}]` | ✅ |
| `/api/bookings/slots` | POST | `{vendor_id, service_id, date, employee_id?}` | `[{start, end}]` | ✅ |
| `/api/bookings` | POST | `{vendor_id, service_id, service_name, start_at, end_at, customer_name, customer_email, customer_phone?, notes?, price}` | `{id, status, ...}` | ✅ |

### A.3 LegalPage → `/legal/:type`

| Endpoint | Method | Status |
|----------|--------|--------|
| — | — | ✅ Statischer Content, kein API-Call |

### A.4 Auth-Pages

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/auth/register` | POST | ✅ |
| `/api/auth/login` | POST | ✅ |
| `/api/auth/refresh` | POST | ✅ |
| `/api/auth/logout` | POST | ✅ |
| `/api/auth/me` | GET | ✅ |
| `/api/auth/forgot-password` | POST | ✅ |
| `/api/auth/reset-password` | POST | ✅ |

---

## B. Vendor Dashboard (Portal)

| Seite | Endpoint | Method | Status |
|-------|----------|--------|--------|
| Dashboard KPI | `/api/vendor/stats` | GET | ✅ |
| Buchungen | `/api/vendor/bookings` | GET | ✅ |
| Services CRUD | `/api/vendor/services` | GET/POST/PATCH/DELETE | ✅ |
| Mitarbeiter CRUD | `/api/vendor/employees` | GET/POST/PATCH/DELETE | ✅ |
| Standorte CRUD | `/api/locations` | GET/POST/PATCH/DELETE | ✅ |
| Öffnungszeiten | `/api/vendor/working-hours` | GET/PUT | ✅ |
| Kunden/CRM | `/api/crm/contacts` | GET/POST/PUT | ✅ |
| Wallet | `/api/wallet/balance` | GET | ✅ |
| Wallet Transaktionen | `/api/wallet/transactions` | GET | ✅ |
| Wallet Auszahlung | `/api/wallet/withdraw` | POST | ✅ |
| Affiliate Links | `/api/affiliate/links` | GET/POST | ✅ |
| Affiliate Commissions | `/api/affiliate/commissions` | GET | ✅ |
| Reports | `/api/reports/revenue` | POST | ✅ |
| Branding | `/api/branding/{id}` | GET/PUT | ✅ |

---

## C. Admin Dashboard (Portal)

| Seite | Endpoint | Method | Status |
|-------|----------|--------|--------|
| Dashboard KPI | `/api/admin/stats` | GET | ✅ |
| Vendors verwalten | `/api/admin/vendors` | GET | ✅ |
| Users verwalten | `/api/admin/users` | GET/PUT | ✅ |
| Plans | `/api/plans` | GET | ✅ |
| Reviews | `/api/reviews` | GET/POST | ✅ |
| Audit Logs | `/api/audit/logs` | GET | ✅ |
| **Commission prüfen** | **`/api/commissions`** | **GET** | **🆕** |
| **Commission approve** | **`/api/commissions/{id}/approve`** | **PATCH** | **🆕** |

---

## D. Customer Dashboard (Portal)

| Seite | Endpoint | Method | Status |
|-------|----------|--------|--------|
| Buchungen | `/api/customer/bookings` | GET | ✅ |
| Buchung stornieren | `/api/customer/bookings/{id}` | DELETE | ✅ |
| Umbuchung | `/api/customer/bookings/{id}/reschedule` | PATCH | ✅ |
| Profil | `/api/auth/me` | GET | ✅ |

---

## E. Affiliate (Geplant P1)

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/affiliate/links` | POST | ✅ |
| `/api/affiliate/links` | GET | ✅ |
| `/api/affiliate/links/{code}` | GET | ✅ |
| `/api/affiliate/commissions` | GET | ✅ |
| `/api/commissions` | GET | 🆕 |
| `/api/wallet/balance` | GET | ✅ |
| `/api/wallet/withdraw` | POST | ✅ |

---

## F. Health

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/health` | GET | ✅ → `{"status":"healthy"}` |

---

## G. Mismatches & Lücken

| Frontend | Backend | Problem | Prio |
|----------|---------|---------|------|
| BookingWidget sendet kein `employee_id` | Backend akzeptiert optional | OK, kein Fix nötig | — |
| BookingWidget sendet kein `location_id` | Backend hat kein location_id im BookingCreate | **P1** — fehlt im Backend-Modell | 🟡 |
| VendorDetailPage zeigt duration_minutes nicht | Service-Response hat es nicht immer | **P0** — kosmetisch | 🟢 |
| Commission-Engine Frontend | Affiliate-Dashboard fehlt | **P1** | 🟡 |
| Admin Commission Review | Admin-Seite fehlt | **P0** | 🔴 |
