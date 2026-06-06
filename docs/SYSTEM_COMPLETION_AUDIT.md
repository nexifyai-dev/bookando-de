# Bookando — System Completion Audit

> **Stand:** 06.06.2026, 10:43 UTC
> **Frontend:** `nexifyai-dev/bookando-de` (Commit `81b8217`)
> **Backend:** `nexifyai-dev/bookando-api` (Commit `eb99e31`)
> **Live:** `app.bookando.de` ✅ HTTP 200
> **DNS:** `bookando.de` ❌ (NS bei 1blu.de, Apex ohne Records)

---

## 1. Frontend-Routen

| Route | Seite | Status | Mock/API | Mobile | Anmerkung |
|-------|-------|--------|----------|--------|-----------|
| `/` | HomePage | ✅ | — | ✅ | Landingpage mit Hero + CTA |
| `/marketplace` | MarketplacePage | ✅ | API | ✅ | 3 Vendors, Suche, Filter |
| `/marketplace/:slug` | VendorDetailPage | ✅ | API | ✅ | BookingWidget integriert |
| `/contact` | ContactPage | ✅ | — | ✅ | |
| `/features` | FeaturesPage | ✅ | — | ✅ | |
| `/about` | AboutPage | ✅ | — | ✅ | |
| `/pricing` | PricingPage | ✅ | — | ✅ | |
| `/legal/privacy` | LegalPage | ✅ | — | ✅ | i18n DE/EN |
| `/legal/imprint` | LegalPage | ✅ | — | ✅ | i18n DE/EN |
| `/legal/terms` | LegalPage | ✅ | — | ✅ | i18n DE/EN |
| `/legal/cookies` | LegalPage | ✅ | — | ✅ | i18n DE/EN |
| `/auth/login` | LoginPage | ✅ | API | ✅ | |
| `/auth/register` | RegisterPage | ✅ | API | ✅ | |
| `/auth/forgot-password` | ForgotPasswordPage | ✅ | API | ✅ | |
| `/auth/reset-password` | ResetPasswordPage | ✅ | API | ✅ | |
| `/auth/verify-email` | VerifyEmailPage | ✅ | API | ✅ | |
| `/portal/*` | PortalShell | ✅ | — | ✅ | Protected Layout |
| `/404` | NotFoundPage | ✅ | — | ✅ | |
| — | VendorDashboard | ✅ | API | ✅ | KPI-Cards + Charts |
| — | VendorBookings | ✅ | API | ✅ | |
| — | VendorServices | ✅ | API | ⚠️ | Teilw. Mock |
| — | VendorEmployees | ✅ | API | ⚠️ | |
| — | VendorLocations | ✅ | API | ⚠️ | |
| — | VendorHours | ✅ | API | ⚠️ | |
| — | VendorCustomers | ✅ | API | ⚠️ | |
| — | VendorWallet | ✅ | API | ⚠️ | |
| — | VendorAffiliates | ⚠️ | API | ⚠️ | Teilfunktionen |
| — | VendorBranding | ⚠️ | API | ⚠️ | |
| — | VendorReports | ✅ | API | ⚠️ | |
| — | VendorSettings | ✅ | — | ⚠️ | |
| — | AdminDashboard | ✅ | API | ⚠️ | |
| — | AdminVendors | ✅ | API | ⚠️ | |
| — | AdminUsers | ✅ | API | ⚠️ | |
| — | AdminPlans | ✅ | — | ⚠️ | |
| — | AdminReviews | ✅ | API | ⚠️ | |
| — | AdminAudit | ⚠️ | API | ❌ | Basic |
| — | CustomerBookings | ✅ | API | ⚠️ | |
| — | CustomerProfile | ⚠️ | — | ❌ | Basic |
| — | FranchiserDashboard | ⚠️ | API | ❌ | Basic |

---

## 2. Backend-Router

| Router | Endpoints | Status | Anmerkung |
|--------|-----------|--------|-----------|
| `public_routes` | 3 (health, stats, languages) | ✅ | |
| `auth_routes` | 10 (register, login, refresh, logout, me, profile, forgot, reset, delete) | ✅ | |
| `users_routes` | ~5 (CRUD + admin) | ✅ | |
| `totp_routes` | 3 (setup, verify, disable) | ✅ | |
| `vendor_routes` | ~6 (CRUD + stats) | ✅ | |
| `services_routes` | ~6 (CRUD) | ✅ | |
| `employees_routes` | ~5 (CRUD + schedule) | ✅ | |
| `locations_routes` | ~4 (CRUD) | ✅ | |
| `hours_routes` | ~5 (working hours + exceptions) | ✅ | |
| `bookings_routes` | 7 (slots, create, list, get, update, cancel, calendar) | ✅ | Commission-Trigger ✅ |
| `checkout_routes` | 6 (create-session, webhook, session-status, pay-booking, vendor-payout) | ✅ | Stripe |
| `wallet_routes` | 5 (balance, transactions, deposit, withdraw, history) | ✅ | |
| `plans_routes` | 6 (list, detail, subscribe, subscription, cancel, change) | ✅ | |
| `marketplace_routes` | 5 (list, categories, vendor-profile, vendor-services, vendor-reviews) | ✅ | |
| `reviews_routes` | 5 (list, create, update, delete, approve) | ✅ | |
| `affiliate_routes` | 6 (create-link, list-links, link-info, list-commissions, stats, dashboard-stats) | ✅ | |
| **`commission_routes`** | **3 (list, approve, cancel)** | **🆕** | **P0-C — NEU** |
| `crm_routes` | 5 (contacts CRUD + stats) | ✅ | |
| `admin_routes` | 6 (stats, users, vendors, reports, etc.) | ✅ | |
| `notifications_routes` | 5 (list, unread, mark-read, delete, read-all) | ✅ | |
| `franchise_routes` | ~5 (CRUD + vendors) | ⚠️ | Basic |
| `branding_routes` | 3 (get, update, logo-upload) | ✅ | |
| `reports_routes` | 6 (revenue, bookings, customers, affiliate, export, dashboard) | ✅ | |
| `help_routes` | 4 (articles, article-detail, ticket CRUD) | ⚠️ | Basic |
| `audit_routes` | 3 (list-all, list-user, list-resource) | ⚠️ | Basic |
| `uploads_routes` | 4 (avatar, vendor-logo, service-image, delete) | ✅ | |
| `customer_routes` | 5 (bookings, favorites, history, upcoming, profile) | ✅ | |
| `compat_routes` | ~10 (Frontend-Kompatibilität) | ✅ | Legacy-Brücken |

---

## 3. Mock-Daten-Bestand

| Bereich | Mock vorh. | API vorh. | Fix-Priorität |
|---------|-----------|-----------|---------------|
| MarketplacePage | ❌ | ✅ API | ✅ Bereits behoben |
| VendorDetailPage | ❌ | ✅ API | ✅ Bereits behoben |
| VendorDashboard | ⚠️ | ✅ | P1 — chart-Daten |
| VendorServices | ⚠️ | ✅ | P1 |
| VendorEmployees | ⚠️ | ✅ | P1 |
| VendorWallet | ⚠️ | ✅ | P1 |
| VendorCustomers | ⚠️ | ✅ | P1 |
| AdminDashboard | ⚠️ | ✅ | P1 |
| BookingWidget | ❌ | ✅ API | ✅ NEU, API-basiert |

---

## 4. Design-/Brand-Lücken

| Bereich | Status | Anmerkung |
|---------|--------|-----------|
| Logo hell/dunkel | ✅ | Korrigiert |
| Orange Hexagon | ✅ | Zentriert, path-basiert |
| Purple-Reste im Code | ❌ | `#6366f1` in alter LegalPage (behoben) |
| Purple in Inline-Styles | ⚠️ | Noch prüfen |
| Einheitliches Radius-System | ⚠️ | Nicht überall konsistent |
| Button-Varianten einheitlich | ⚠️ | Unterschiedliche Größen |
| CTA/Hero-Grafik positioniert | ✅ | Glow-Fix |
| Loading States | ⚠️ | Teilweise |
| Empty States | ⚠️ | Teilweise |
| Error States | ⚠️ | Teilweise |
| Mobile Touch Targets | ⚠️ | Nicht auditiert |

---

## 5. Testlücken

| Bereich | Tests | Priorität |
|---------|-------|-----------|
| Backend Unit-Tests | ❌ Keine | P0 |
| Backend Integration-Tests | ❌ Keine | P0 |
| Frontend Unit-Tests | ❌ Keine | P1 |
| E2E-Tests | ❌ Keine | P1 |
| API Smoke-Tests | 🔧 Manuell | P0 |
| Booking-Flow-Tests | ❌ Fehlen | P0 |
| Ledger/Commission-Tests | ❌ Fehlen | P0 |
| RBAC-Tests | ❌ Fehlen | P0 |
| Accessibility | ❌ Nicht auditiert | P1 |
| Lighthouse | ❌ Nicht auditiert | P1 |

---

## 6. Security-Debt

| Issue | Status | Fälligkeit |
|-------|--------|------------|
| `.env.vercel` in Git-History (`7f63aea`) | 🔴 Leak | **Vor Launch rotieren** |
| `.env.example` mit Secrets | 🔴 Fixed (`eb99e31`) | ✅ Bereinigt |
| `.gitignore` aktualisiert | ✅ Fixed | ✅ |
| Keys zur Rotation: SUPABASE_SERVICE_KEY, SUPABASE_JWT_SECRET, SUPABASE_ANON_KEY, RESEND_API_KEY | 🔴 Offen | Vor Launch |
| Keine Secrets in Reports | ✅ | Laufend |

---

## 7. Bewertung

| Kriterium | Erfüllung |
|-----------|-----------|
| MVP-Frontend-Routen | ✅ 19/19 öffentliche Routen |
| Backend-Endpunkte | ✅ ~90 Endpoints, 27 Router |
| Commission-Engine | ✅ Neu (P0-C) |
| Ledger Append-Only | ⚠️ Code-basiert, DB-Policy fehlt |
| Payment-Integration in Booking | ❌ P1 |
| E2E-Tests | ❌ Fehlen |
| bookando.de DNS | ❌ 1blu.de, NS nicht auf Vercel |
| app.bookando.de | ✅ Stabil |
