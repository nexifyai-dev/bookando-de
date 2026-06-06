# Bookando — Database Completion Matrix

> **Stand:** 06.06.2026 | **Plattform:** Supabase (PostgreSQL)

---

## Tabellen-Matrix

| # | Tabelle | Existiert | Felder | API-Endpoints | Frontend | Status | Prio |
|---|---------|-----------|--------|--------------|----------|--------|------|
| 1 | **users** | ✅ auth.users (Supabase) | id, email, role, metadata | auth_routes | Auth-Seiten | ✅ | P0 |
| 2 | **roles** | ❌ Fehlt | name, permissions | ❌ Fehlt | ❌ Fehlt | ❌ | P2 |
| 3 | **permissions** | ❌ Fehlt | role_id, resource, action | ❌ Fehlt | ❌ Fehlt | ❌ | P2 |
| 4 | **tenants** | ❌ Fehlt | name, slug, plan_id, trial_ends | ❌ | ❌ | ❌ | P1 |
| 5 | **vendor_profiles** | ✅ (in public.users) | id, email, name, category | vendor_routes | VendorDashboard | ✅ | P0 |
| 6 | **vendor_branding** | ⚠️ Teilw. | logo_url, colors, description | branding_routes | VendorBranding | ⚠️ | P1 |
| 7 | **vendor_locations** | ✅ | id, vendor_id, name, city, address | locations_routes | VendorLocations | ✅ | P0 |
| 8 | **staff_members** | ✅ (employees) | id, vendor_id, user_id, services | employees_routes | VendorEmployees | ✅ | P0 |
| 9 | **services** | ✅ | id, vendor_id, name, duration, price, description | services_routes | VendorServices | ✅ | P0 |
| 10 | **service_categories** | ❌ Fehlt | id, name, icon | ❌ | Marketplace | ❌ | P2 |
| 11 | **service_packages** | ⚠️ (in api.js) | id, vendor_id, services, price | packages_routes | ❌ Fehlt | ⚠️ | P2 |
| 12 | **resources** | ⚠️ (in api.js) | id, vendor_id, name, type | resources_routes | ❌ Fehlt | ⚠️ | P2 |
| 13 | **availability_rules** | ❌ Fehlt | vendor_id, day, start, end, employee_id | ❌ | ❌ | ❌ | P2 |
| 14 | **calendar_blocks** | ⚠️ (hours exceptions) | id, vendor_id, date, start, end | hours_routes | VendorHours | ⚠️ | P1 |
| 15 | **bookings** | ✅ | id, vendor_id, service_id, customer_id, start_at, end_at, status, price, affiliate_code | bookings_routes | VendorBookings, CustomerBookings | ✅ | P0 |
| 16 | **booking_status_history** | ❌ Fehlt | booking_id, from_status, to_status, changed_by, reason | ❌ | ❌ | ❌ | **P1** |
| 17 | **customers** | ✅ (booking customer fields) | email, name, phone | crm_routes | VendorCustomers | ✅ | P0 |
| 18 | **crm_notes** | ⚠️ (in contacts) | contact_id, text, created_by | crm_routes | VendorCustomers | ⚠️ | P1 |
| 19 | **crm_tags** | ❌ Fehlt | contact_id, tag | ❌ | ❌ | ❌ | P2 |
| 20 | **crm_segments** | ❌ Fehlt | name, rules, contact_ids | ❌ | ❌ | ❌ | P3 |
| 21 | **marketplace_listings** | ✅ (vendors table) | vendor_id, visibility, category | marketplace_routes | MarketplacePage | ✅ | P0 |
| 22 | **reviews** | ✅ | id, vendor_id, customer_id, rating, text, is_published | reviews_routes | VendorDetail | ✅ | P1 |
| 23 | **affiliate_links** | ✅ | id, user_id, vendor_id, code, commission_percent | affiliate_routes | AffiliateLinks | ✅ | P1 |
| 24 | **affiliate_clicks** | ❌ Fehlt | link_id, ip, user_agent, converted, booking_id | ❌ | ❌ | ❌ | **P1** |
| 25 | **attribution** | ❌ Fehlt | click_id, booking_id, commission_id | ❌ | ❌ | ❌ | **P1** |
| 26 | **commission_rules** | ❌ Fehlt | vendor_id, service_id, rate_type, value | ❌ | ❌ | ❌ | P2 |
| 27 | **commissions** | ✅ | id, booking_id, affiliate_code, amount, rate, status | commission_routes | AdminCommission, AffiliateCommissions | ✅ | P0 |
| 28 | **wallets** | ✅ | id, user_id, balance, pending_balance | wallet_routes | VendorWallet, AffiliateWallet | ✅ | P0 |
| 29 | **ledger_entries** | ✅ | id, wallet_id, type, amount, balance_before, after, reference_id | wallet_routes | VendorWallet | ⚠️ | P0 |
| 30 | **payout_requests** | ✅ | id, wallet_id, user_id, amount, status | wallet_routes | VendorWallet, AffiliateWallet | ✅ | P1 |
| 31 | **payment_provider_connections** | ❌ Fehlt | vendor_id, provider, account_id, active | ❌ | ❌ | ❌ | P2 |
| 32 | **payment_transactions** | ⚠️ (in checkout/db) | booking_id, amount, status, provider | checkout_routes | BookingWidget | ⚠️ | P1 |
| 33 | **subscriptions** | ⚠️ (in plans) | vendor_id, plan_id, status, trial_ends | plans_routes | VendorDashboard | ⚠️ | P1 |
| 34 | **plans** | ⚠️ (hardcoded) | name, tier, price, features | plans_routes | PricingPage, AdminPlans | ⚠️ | P1 |
| 35 | **invoices** | ❌ Fehlt | subscription_id, amount, paid_at, pdf_url | ❌ | ❌ | ❌ | P2 |
| 36 | **notifications** | ✅ | id, user_id, type, title, body, is_read | notifications_routes | — | ✅ | P1 |
| 37 | **support_tickets** | ⚠️ (help tickets) | id, user_id, subject, status, priority | help_routes | ❌ Fehlt | ⚠️ | P3 |
| 38 | **audit_logs** | ⚠️ (basic) | id, actor, action, resource_type, resource_id, old/new | audit_routes | AdminAudit | ⚠️ | P1 |
| 39 | **whitelabel_configs** | ❌ Fehlt | partner_id, domain, brand_name, logo, colors | ❌ | ❌ | ❌ | P3 |
| 40 | **domain_mappings** | ❌ Fehlt | domain, partner_id, verified | ❌ | ❌ | ❌ | P3 |
| 41 | **system_settings** | ❌ Fehlt | key, value, updated_at | ❌ | ❌ | ❌ | P3 |

---

## Summary

| Status | Anzahl | Prozent |
|--------|--------|---------|
| ✅ Vollständig | 15 | 37% |
| ⚠️ Teilweise | 12 | 29% |
| ❌ Fehlt | 14 | 34% |
| **Gesamt** | **41** | **100%** |

### Kritische fehlende Tabellen (P0/P1)

| Tabelle | Warum kritisch | Betroffene Funktion |
|---------|---------------|-------------------|
| **booking_status_history** | Audit-Trail für jeden Statuswechsel | P1 |
| **affiliate_clicks** | Ohne Klick-Tracking kein Attritutionsmodell | P1 |
| **attribution** | Ohne Attribution keine nachvollziehbare Commission | P1 |
| **tenants** | Ohne Tenant-Modell kein Multi-Tenant | P1 |
| **commission_rules** | Individuelle Provisionsregeln pro Vendor/Service | P2 |
