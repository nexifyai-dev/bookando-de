# Bookando.de – API Contract Matrix

> **Datum:** 17.06.2026
> **Methode:** Code-Analyse (Frontend api.js + Backend Router)
> **Limits:** Kein Live-Test möglich (BE API 500)

| Frontend-Aufruf | Methode | Pfad | Backend-Registriert | Kompatibel | Tenantsicher | Auth | Status |
|---|---:|---|---:|---|---|---|---|
| api/auth/login | POST | /api/auth/login | ✅ auth_routes | ✅ | — | public | IMPLEMENTED |
| api/auth/register | POST | /api/auth/register | ✅ auth_routes | ✅ | — | public | IMPLEMENTED |
| api/auth/refresh | POST | /api/auth/refresh | ✅ auth_routes | ✅ | — | public | IMPLEMENTED |
| api/auth/me | GET | /api/auth/me | ✅ auth_routes | ✅ | ✅ (sub) | Bearer | IMPLEMENTED |
| api/auth/profile | GET | /api/auth/profile | ✅ auth_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/auth/profile | PUT | /api/auth/profile | ✅ auth_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/auth/logout | POST | /api/auth/logout | ✅ auth_routes | ⚠️ | ⚠️ | Bearer | PARTIAL (kein Token-Widerruf) |
| api/auth/context | POST | /api/auth/context | ✅ auth_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/auth/forgot-password | POST | /api/auth/forgot-password | ✅ auth_routes | ✅ | — | public | IMPLEMENTED |
| api/auth/reset-password | POST | /api/auth/reset-password | ✅ auth_routes | ✅ | — | public | IMPLEMENTED |
| api/auth/2fa/* | GET/POST | /api/auth/2fa/* | ✅ totp_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/checkout/session | POST | /api/checkout/session | ✅ checkout_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/checkout/status/{id} | GET | /api/checkout/status/{id} | ✅ checkout_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/checkout/webhook | POST | /api/checkout/webhook | ✅ checkout_routes | ✅ | — | Signature | IMPLEMENTED |
| api/orders/me | GET | /api/orders/me | ✅ orders_router | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/orders/{id} | GET | /api/orders/{id} | ✅ orders_router | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/bookings/slots | POST | /api/bookings/slots | ✅ bookings_routes | ⚠️ | ❓ | public | PARTIAL (Race-Condition?) |
| api/bookings | POST | /api/bookings | ✅ bookings_routes | ⚠️ | ❓ | public | PARTIAL (Affiliate?) |
| api/customer/bookings | GET/DELETE | /api/customer/bookings | ✅ customer_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/customer/recurring | GET/DELETE | /api/customer/recurring-bookings | ✅ customer_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/vendor/services | CRUD | /api/vendor/services | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL (Tenant?) |
| api/vendor/working-hours | GET/PUT | /api/vendor/working-hours | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/employee-accounts | CRUD | /api/vendor/employee-accounts | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/locations | CRUD | /api/vendor/locations | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/products | CRUD | /api/vendor/products | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/packages | CRUD | /api/vendor/packages | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/vouchers | CRUD | /api/vendor/vouchers | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/bookings | GET/PATCH | /api/vendor/bookings | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/stats | GET | /api/vendor/stats | ✅ compat_routes | ✅ | ❓ | Bearer | PARTIAL |
| api/vendor/branding | GET/PATCH | /api/vendor/branding | ✅ branding_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/public/vendors/{id} | GET | /api/public/vendors/{id} | ✅ compat_routes | ✅ | — | public | IMPLEMENTED |
| api/public/marketplace/vendors | GET | /api/public/marketplace/vendors | ✅ compat_routes | ✅ | — | public | IMPLEMENTED |
| api/public/marketplace/services | GET | /api/public/marketplace/services | ✅ compat_routes | ✅ | — | public | IMPLEMENTED |
| api/public/marketplace/countries | GET | /api/public/marketplace/countries | ✅ compat_routes | ⚠️ | — | public | MOCK (hardcoded) |
| api/public/plans | GET | /api/public/plans | ✅ compat_routes | ✅ | — | public | IMPLEMENTED |
| api/wallet/balance | GET | /api/wallet/balance | ✅ wallet_routes | ⚠️ | ✅ | Bearer | PARTIAL (append?) |
| api/wallet/transactions | GET | /api/wallet/transactions | ✅ wallet_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/wallet/deposit | POST | /api/wallet/deposit | ✅ wallet_routes | ⚠️ | ✅ | Bearer | PARTIAL (kein constraint) |
| api/wallet/withdraw | POST | /api/wallet/withdraw | ✅ wallet_routes | ⚠️ | ✅ | Bearer | PARTIAL (kein approval flow) |
| api/reviews | CRUD | /api/reviews | ✅ reviews_routes | ✅ | ✅ | Bearer | IMPLEMENTED |
| api/affiliate/* | CRUD | /api/affiliate/* | ✅ affiliate_routes | ⚠️ | ❓ | Bearer | PARTIAL |
| api/commission/* | GET | /api/commissions/* | ✅ commission_routes | ⚠️ | ❓ | Bearer | PARTIAL |
| api/admin/audit/logs | GET | /api/admin/audit/logs | ✅ audit_routes | ✅ | ✅ | Admin | IMPLEMENTED |
| api/customer/vouchers | GET/POST | /api/customer/vouchers | ❓ | ❓ | — | Bearer | ❓ Nicht geprüft |
| api/uploads/* | POST/DELETE | /api/uploads/* | ✅ uploads_routes | ⚠️ | ✅ | Bearer | PARTIAL (base64, kein S3) |
| api/me/subscription | GET | /api/me/subscription | ✅ compat_routes | ⚠️ | ✅ | Bearer | PARTIAL |
| api/reports/vendor | GET | /api/reports/vendor | ✅ reports_routes | ✅ | ✅ | Bearer | IMPLEMENTED |

## Legende

- ✅ = korrekt umgesetzt / vorhanden
- ⚠️ = vorhanden aber nicht ausreichend gegen Anforderung validiert
- ❓ = unklar / nicht geprüft
- ❌ = fehlt

## Fazit

- **44 von 46 Frontend-Endpunkten** haben passende Backend-Routen
- **2 ungeprüft** (customer/vouchers — Route nicht in main router? Muss verifiziert werden)
- **Race-Conditions** bei Booking/Slots/Wallet potenziell vorhanden (keine DB-Constraints, kein advisory lock)
- **Tenant-Isolation** bei Vendor-kompatiblen Endpunkten nicht verifiziert
