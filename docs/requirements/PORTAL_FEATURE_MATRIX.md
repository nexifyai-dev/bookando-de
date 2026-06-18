# Bookando Portal Feature Matrix

> **Generiert aus:** App.js (Routes) + PORTAL_ACTION_MATRIX.md + PORTAL_INFORMATION_ARCHITECTURE.md
> **Stand:** 2026-06-18 | **Korrigiert:** Nach vollständiger Frontend-Inventur

## Portal-Übersicht

| Portal | Rollen | Implementierte Seiten | MVP-Relevant |
|--------|--------|---------------------|-------------|
| Public | Jeder | 12 ✅ | ✅ Ja |
| Customer | customer | 5 ✅ | ✅ Ja |
| Vendor | vendor, staff | 13 ✅ | ✅ Ja |
| Employee | employee | ❌ 0 (7 geplant) | ✅ Ja |
| Affiliate | affiliate | 4 ✅ | ✅ Ja |
| Admin | super_admin | 7 ✅ | ✅ Ja |
| WhiteLabel | whitelabel_admin | 0 (9 geplant) | ❌ Phase 2 |
| Franchise | franchiser | 3 ✅ | ❌ Phase 2 |

## Portal-Route-Coverage (korrigiert)

### Public Portal (12 Routen)
| Seite | Route | Status |
|-------|-------|--------|
| Startseite | / | ✅ IMPLEMENTED_UNVERIFIED |
| Marketplace | /marketplace | ✅ IMPLEMENTED_UNVERIFIED |
| Vendor-Detail | /marketplace/:slug | ✅ IMPLEMENTED_UNVERIFIED |
| About | /about | ✅ IMPLEMENTED_UNVERIFIED |
| Features | /features | ✅ IMPLEMENTED_UNVERIFIED |
| Kontakt | /contact | ✅ IMPLEMENTED_UNVERIFIED |
| Preise | /pricing | ✅ IMPLEMENTED_UNVERIFIED |
| Legal/Impressum | /legal/imprint | ✅ IMPLEMENTED_UNVERIFIED |
| Legal/Privacy | /legal/privacy | ✅ IMPLEMENTED_UNVERIFIED |
| Legal/Terms | /legal/terms | ✅ IMPLEMENTED_UNVERIFIED |
| Legal/Cookies | /legal/cookies | ✅ IMPLEMENTED_UNVERIFIED |
| 404 | /* | ✅ IMPLEMENTED_UNVERIFIED |
| **Auth (5)** | /auth/login,register,forgot-password,reset-password,verify-email | ✅ IMPLEMENTED_UNVERIFIED |

### Customer Portal (5 Seiten)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /portal | ✅ IMPLEMENTED_UNVERIFIED |
| Buchungen | /portal/bookings | ✅ IMPLEMENTED_UNVERIFIED |
| Wiederkehrend | /portal/recurring | ✅ IMPLEMENTED_UNVERIFIED |
| Gutscheine | /portal/vouchers | ✅ IMPLEMENTED_UNVERIFIED |
| Profil | /portal/profile | ✅ IMPLEMENTED_UNVERIFIED |
| **Fehlt:** Wallet | /portal/wallet | ❌ MISSING |
| **Fehlt:** Zahlungen | /portal/payments | ❌ MISSING |
| **Fehlt:** Favoriten | /portal/favorites | ❌ MISSING |
| **Fehlt:** Benachrichtigungen | /portal/notifications | ❌ MISSING |

### Vendor Portal (13 Seiten)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /portal | ✅ IMPLEMENTED_UNVERIFIED |
| Buchungen | /portal/bookings | ✅ IMPLEMENTED_UNVERIFIED |
| Kalender | /portal/calendar | ✅ IMPLEMENTED_UNVERIFIED |
| Services | /portal/services | ✅ IMPLEMENTED_UNVERIFIED |
| Mitarbeiter | /portal/employees | ✅ IMPLEMENTED_UNVERIFIED |
| Standorte | /portal/locations | ✅ IMPLEMENTED_UNVERIFIED |
| Öffnungszeiten | /portal/hours | ✅ IMPLEMENTED_UNVERIFIED |
| Kunden/CRM | /portal/customers | ✅ IMPLEMENTED_UNVERIFIED |
| Reports | /portal/reports | ✅ IMPLEMENTED_UNVERIFIED |
| Wallet | /portal/wallet | ✅ IMPLEMENTED_UNVERIFIED |
| Affiliates | /portal/affiliates | ✅ IMPLEMENTED_UNVERIFIED |
| Branding | /portal/branding | ✅ IMPLEMENTED_UNVERIFIED |
| Einstellungen | /portal/settings | ✅ IMPLEMENTED_UNVERIFIED |
| **Fehlt:** Pakete | /portal/packages | ❌ MISSING |
| **Fehlt:** Produkte | /portal/products | ❌ MISSING |

### Employee Portal (0 von 7)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /employee | ❌ MISSING |
| Kalender | /employee/calendar | ❌ MISSING |
| Verfügbarkeit | /employee/availability | ❌ MISSING |
| Termine | /employee/bookings | ❌ MISSING |
| Kunden | /employee/customers | ❌ MISSING |
| Profil | /employee/profile | ❌ MISSING |
| Benachrichtigungen | /employee/notifications | ❌ MISSING |

### Affiliate Portal (4 Seiten)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /portal | ✅ IMPLEMENTED_UNVERIFIED |
| Trackinglinks | /portal/links | ✅ IMPLEMENTED_UNVERIFIED |
| Provisionen | /portal/commissions | ✅ IMPLEMENTED_UNVERIFIED |
| Wallet | /portal/wallet | ✅ IMPLEMENTED_UNVERIFIED |
| **Fehlt:** Kampagnen | /portal/campaigns | ❌ MISSING |
| **Fehlt:** Statistiken | /portal/stats | ❌ MISSING |

### Admin Portal (7 Seiten)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /portal | ✅ IMPLEMENTED_UNVERIFIED |
| Benutzer | /portal/users | ✅ IMPLEMENTED_UNVERIFIED |
| Vendors | /portal/vendors | ✅ IMPLEMENTED_UNVERIFIED |
| Pläne | /portal/plans | ✅ IMPLEMENTED_UNVERIFIED |
| Audit-Log | /portal/audit | ✅ IMPLEMENTED_UNVERIFIED |
| Reviews | /portal/reviews | ✅ IMPLEMENTED_UNVERIFIED |
| Provisionen | /portal/commissions | ✅ IMPLEMENTED_UNVERIFIED |
| **Fehlt:** Support | /portal/support | ❌ MISSING |
| **Fehlt:** Systemstatus | /portal/status | ❌ MISSING |

### Franchise Portal (3 Seiten)
| Seite | Route | Status |
|-------|-------|--------|
| Dashboard | /portal | ✅ IMPLEMENTED_UNVERIFIED |
| Vendors | /portal/vendors | ✅ IMPLEMENTED_UNVERIFIED |
| Reports | /portal/reports | ✅ IMPLEMENTED_UNVERIFIED |

## Zusammenfassung (korrigiert)

| Metrik | Wert |
|--------|------|
| Implementierte Portal-Seiten | ~47 |
| Teilweise oder fehlende Pages | ~21 (Employee 7, Customer 4, Vendor 2, Affiliate 2, Admin 2, Whitelabel 9) |
| Frontend-Routing-Struktur | ✅ Sauber, rollenbasiert, lazy-loaded |
| Portal-Shells | ✅ Vendor, Customer, Affiliate, Franchiser, Admin |
| Portal-Shells fehlend | ❌ Employee, WhiteLabel |

## Kritische Lücken (nach Korrektur)

1. **Employee Portal komplett fehlend**: Keine Routen, keine Shell, keine Pages — aber im MVP enthalten
2. **Customer Wallet/Payments/Favoriten**: API existiert, FE-Seiten fehlen
3. **Vendor Packages/Products**: API existiert, FE-Seiten fehlen
4. **Affiliate Campaigns/Stats**: API existiert teilweise, FE-Seiten fehlen
5. **Admin Support/Systemstatus**: Weder FE noch API
6. **WhiteLabel Portal komplett**: Phase 2, aber keine Vorbereitung im FE
7. **Loading/Empty/Error States**: Nicht systematisch in allen Pages
