# Bookando.de – API Contract Matrix

> **Datum:** 17.06.2026
> **Methode:** Code-Analyse (Frontend `api.js` + Backend-module)
> **Limits:** Kein Live-Test (BE API 500), keine Request-/Response-Deep-Inspection

| Frontend-Aufruf | Methode | Pfad | Backend-Route | Request | Response | Auth | Rolle | Tenant | Test | Status |
|---|---|:---:|---|---|---|---|---|---|---|---|
| api/auth/login | POST | /api/auth/login | auth_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/auth/register | POST | /api/auth/register | auth_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/auth/refresh | POST | /api/auth/refresh | auth_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/auth/me | GET | /api/auth/me | auth_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/auth/profile | GET | /api/auth/profile | auth_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/auth/profile | PUT | /api/auth/profile | auth_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/auth/logout | POST | /api/auth/logout | auth_routes | ⚠️ | ⚠️ | Bearer | any | ⚠️ | ❌ | PARTIAL |
| api/auth/context | POST | /api/auth/context | auth_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/auth/forgot-password | POST | /api/auth/forgot-password | auth_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/auth/reset-password | POST | /api/auth/reset-password | auth_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/auth/2fa/* | GET/POST | /api/auth/2fa/* | totp_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/checkout/session | POST | /api/checkout/session | checkout_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/checkout/status/{id} | GET | /api/checkout/status/{id} | checkout_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/checkout/webhook | POST | /api/checkout/webhook | checkout_routes | ✅ | ⚠️ | Signature | – | – | ❌ | PARTIAL |
| api/orders/me | GET | /api/orders/me | orders_router | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/orders/{id} | GET | /api/orders/{id} | orders_router | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/bookings/slots | POST | /api/bookings/slots | bookings_routes | ⚠️ | ⚠️ | public | – | – | ❌ | PARTIAL |
| api/bookings | POST | /api/bookings | bookings_routes | ⚠️ | ⚠️ | public | – | – | ❌ | PARTIAL |
| api/customer/bookings | GET/DELETE | /api/customer/bookings | customer_routes | ✅ | ✅ | Bearer | customer | ✅ | ❌ | IMPLEMENTED |
| api/customer/recurring | GET/DELETE | /api/customer/recurring-bookings | customer_routes | ✅ | ✅ | Bearer | customer | ✅ | ❌ | IMPLEMENTED |
| api/vendor/services | CRUD | /api/vendor/services | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/working-hours | GET/PUT | /api/vendor/working-hours | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/employee-accounts | CRUD | /api/vendor/employee-accounts | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/locations | CRUD | /api/vendor/locations | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/products | CRUD | /api/vendor/products | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/packages | CRUD | /api/vendor/packages | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/vouchers | CRUD | /api/vendor/vouchers | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/bookings | GET/PATCH | /api/vendor/bookings | compat_routes | ✅ | ⚠️ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/stats | GET | /api/vendor/stats | compat_routes | ✅ | ✅ | Bearer | vendor | ❓ | ❌ | PARTIAL |
| api/vendor/branding | GET/PATCH | /api/vendor/branding | branding_routes | ✅ | ✅ | Bearer | vendor | ✅ | ❌ | IMPLEMENTED |
| api/public/vendors/{id} | GET | /api/public/vendors/{id} | compat_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/public/marketplace/vendors | GET | /api/public/marketplace/vendors | compat_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/public/marketplace/services | GET | /api/public/marketplace/services | compat_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/public/marketplace/countries | GET | /api/public/marketplace/countries | compat_routes | ⚠️ | ⚠️ | public | – | – | ❌ | MOCK_ONLY |
| api/public/plans | GET | /api/public/plans | compat_routes | ✅ | ✅ | public | – | – | ❌ | IMPLEMENTED |
| api/wallet/balance | GET | /api/wallet/balance | wallet_routes | ⚠️ | ⚠️ | Bearer | any | ✅ | ❌ | PARTIAL |
| api/wallet/transactions | GET | /api/wallet/transactions | wallet_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/wallet/deposit | POST | /api/wallet/deposit | wallet_routes | ⚠️ | ⚠️ | Bearer | any | ✅ | ❌ | PARTIAL |
| api/wallet/withdraw | POST | /api/wallet/withdraw | wallet_routes | ⚠️ | ⚠️ | Bearer | any | ✅ | ❌ | PARTIAL |
| api/reviews | CRUD | /api/reviews | reviews_routes | ✅ | ✅ | Bearer | any | ✅ | ❌ | IMPLEMENTED |
| api/affiliate/* | CRUD | /api/affiliate/* | affiliate_routes | ⚠️ | ⚠️ | Bearer | any | ❓ | ❌ | PARTIAL |
| api/commission/* | GET | /api/commissions/* | commission_routes | ⚠️ | ⚠️ | Bearer | any | ❓ | ❌ | PARTIAL |
| api/admin/audit/logs | GET | /api/admin/audit/logs | audit_routes | ✅ | ✅ | Bearer | admin | ✅ | ❌ | IMPLEMENTED |
| api/uploads/* | POST/DELETE | /api/uploads/* | uploads_routes | ⚠️ | ⚠️ | Bearer | any | ✅ | ❌ | PARTIAL |
| api/me/subscription | GET | /api/me/subscription | compat_routes | ⚠️ | ⚠️ | Bearer | any | ✅ | ❌ | PARTIAL |
| api/reports/vendor | GET | /api/reports/vendor | reports_routes | ✅ | ✅ | Bearer | vendor | ✅ | ❌ | IMPLEMENTED |

**Anzahl:** 47 Einträge — 30 IMPLEMENTED, 14 PARTIAL, 1 MOCK_ONLY, 2 ungeprüft.

## Backend-Domänen ohne vollständige Frontend-Anbindung

| Domäne | Backend-Modul | Routen (geschätzt) | Status | Notiz |
|--------|--------------|--------------------|--------|-------|
| **CRM** | crm_routes | ~8 | PARTIAL | FE: VendorCustomersPage, aber keine separate CRM-Sektion |
| **Notifications** | notifications_routes | ~6 | MISSING | Backend-Routen vorhanden, kein Frontend-Aufruf |
| **Franchise** | franchise_routes | ~4 | MISSING | Phase 2, kein Frontend |
| **Help** | help_routes | ~2 | DOCUMENTED_ONLY | Backend vorhanden, kein Frontend |
| **Admin general** | admin_routes | ~6 | PARTIAL | Nur audit/logs im Frontend |
| **Plans** | plans_routes | ~3 | PARTIAL | Nur /api/public/plans, keine Admin-Plan-Verwaltung |
| **Users** | users_routes | ~5 | PARTIAL | Kein separates Nutzerverwaltungs-Frontend |
| **Vendor** | vendor_routes | ~5 | PARTIAL | CRUD existiert, Frontend teilweise |

**Primär nicht vom Frontend genutzte Backend-Routen** (~70 von 195):
- `users_routes` (Nutzerverwaltung)
- `crm_routes` (CRM-interne Endpunkte)
- `notifications_routes` (Push, E-Mail — Frontend nutzt eigene API-js-Wrapper)
- `franchise_routes` (Phase 2)
- `help_routes` (Hilfe-Dokumente)
- `plans_routes` (Admin-Plan-Verwaltung, nicht öffentlich)
- `admin_routes` teilweise (Dashboard-Daten)
- `services_routes`, `employees_routes`, `locations_routes`, `hours_routes` (werden über compat_routes aggregiert)

## Legende

- ✅ = korrekt / kompatibel
- ⚠️ = vorhanden, aber nicht ausreichend validiert
- ❓ = unklar
- ❌ = fehlt / inkompatibel

## Fazit

- **47 Frontend-Endpunkte** mit Backend-Registrierung (30 IMPLEMENTED, 14 PARTIAL)
- **8 Backend-Domänen** ohne vollständige Frontend-Abdeckung
- **~70 Routen** nur backend-intern oder in Phase 2
- Keine Tests für API-Kompatibilität vorhanden
- Tenant-Isolation für vendor-kompatible Endpunkte nicht verifiziert
