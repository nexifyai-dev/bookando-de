# Bookando.de – Zielarchitektur

> **Quelle:** Kunden-Pflichtenheft (docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md)
> **Stand:** 17.06.2026

## 1. Architekturprinzipien

1. **Bookando ist kein kleines Terminbuchungstool**, sondern ein Dienstleister-Ökosystem
2. **Modular** – jedes System unabhängig entwickel- und testbar
3. **API-First** – alle Funktionen über REST-API, app-fähig
4. **Multi-Tenant** – von Beginn an mandantenfähig
5. **WhiteLabel-fähig** – eigene Domains, Branding, Login
6. **Internationalisierbar** – i18n, Länder, Währungen
7. **Payment-unabhängig** – Stripe, PayPal, Mollie, Klarna

## 2. Systemlandschaft (Soll)

```text
┌──────────────────────────────────────────────────────────────────┐
│                    BOOKANDO ÖKOSYSTEM                             │
│                                                                   │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│  │    BOOKINGS ENGINE   │  │        AFFILIATE ENGINE          │   │
│  │  ┌─────────────────┐ │  │  ┌────────────────────────────┐ │   │
│  │  │ Slot Calculator  │ │  │  │ Tracking Link Generator   │ │   │
│  │  │ Duration Logic   │ │  │  │ Attribution (last/first)  │ │   │
│  │  │ Employee Assign  │ │  │  │ Campaign Management      │ │   │
│  │  │ Resource Check   │ │  │  │ Commission Calculator    │ │   │
│  │  │ Buffer/Lead Time │ │  │  │ Fraud Detection          │ │   │
│  │  │ Double-Book Guard│ │  │  │ QR/Social/Direct Sharing │ │   │
│  │  │ Recurring Logic  │ │  │  └────────────────────────────┘ │   │
│  │  │ Group Booking    │ │  │                                  │   │
│  │  └─────────────────┘ │  └──────────────────────────────────┘   │
│  └─────────────────────┘                                           │
│                                                                   │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│  │    WALLET/LEDGER     │  │      PAYMENT ABSTRACTION        │   │
│  │  ┌─────────────────┐ │  │  ┌────────────────────────────┐ │   │
│  │  │ Append-Only Tx   │ │  │  │ Stripe Adapter            │ │   │
│  │  │ Balance Compute  │ │  │  │ PayPal Adapter (Phase 2)  │ │   │
│  │  │ Refund/Counter   │ │  │  │ Mollie Adapter (Phase 2)  │ │   │
│  │  │ Fee Engine       │ │  │  │ Klarna Adapter (Phase 2)  │ │   │
│  │  │ Split Calculator │ │  │  │ Fee Splitting Engine      │ │   │
│  │  │ Payout Workflow  │ │  │  │ Webhook Idempotency       │ │   │
│  │  │ Audit Trail      │ │  │  │ Vendor Account Connect    │ │   │
│  │  └─────────────────┘ │  │  └────────────────────────────┘ │   │
│  └─────────────────────┘  └──────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│  │    MARKETPLACE       │  │      TENANT ISOLATION           │   │
│  │  ┌─────────────────┐ │  │  ┌────────────────────────────┐ │   │
│  │  │ Search/Filter    │ │  │  │ Role/Context Switching    │ │   │
│  │  │ Vendor Listing   │ │  │  │ Data Isolation Layer     │ │   │
│  │  │ Visibility Ctrl  │ │  │  │ Permission Engine        │ │   │
│  │  │ SEO/Vendor Pages │ │  │  │ WhiteLabel Routing       │ │   │
│  │  └─────────────────┘ │  │  └────────────────────────────┘ │   │
│  └─────────────────────┘  └──────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│  │        CRM           │  │      NOTIFICATIONS              │   │
│  │  ┌─────────────────┐ │  │  ┌────────────────────────────┐ │   │
│  │  │ Customer Profile │ │  │  │ Email (Resend)            │ │   │
│  │  │ Lead Management  │ │  │  │ In-App (WebSocket/Poll)   │ │   │
│  │  │ Booking History  │ │  │  │ Push (phase 3)            │ │   │
│  │  │ Tags/Notes       │ │  │  │ Scheduling                │ │   │
│  │  │ Segments         │ │  └────────────────────────────┘ │   │
│  │  │ Automation       │ │                                  │   │
│  │  └─────────────────┘ │  └──────────────────────────────────┘   │
│  └─────────────────────┘                                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              SUPABASE (PostgreSQL + Auth)                     │ │
│  │  ┌───────┬────────┬──────┬───────┬────────┬────────┬─────┐  │ │
│  │  │users  │vendors │services│bookings│wallet_tx│affiliates│…│  │ │
│  │  └───────┴────────┴──────┴───────┴────────┴────────┴─────┘  │ │
│  │  RLS Policies │ Migrations │ Functions │ Triggers           │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 3. MVP-Scope (Kapitel 20.1)

| System | Status (Ist) | Ziel (Soll) |
|--------|-------------|-------------|
| Terminbuchung | Basis-CRUD, keine Ressourcen/Puffer/Gruppen | Vollständige Terminlogik |
| Vendor-System | CRUD + Branding + Subpages | Multi-Vendor + Isolation |
| Kalender | Slots + Working Hours | Kalender-Sync + Ressourcen |
| Zahlungen | Stripe + Mock Provider | Provider-unabhängig + Splits |
| Marketplace | Verzeichnis + Suche | Volle Sichtbarkeitslogik |
| Vendor-Unterseiten | Öffentliche Seiten vorhanden | Landingpages + SEO |
| Affiliate-Tracking | Grundlegend vorhanden | Tiefe Booking-Integration |
| Wallet-System | Balance + Withdraw | Append-only Ledger |
| Grundlegendes CRM | Profile + Notes/Tags | Automationen + Segmente |

## 4. Datenmodell-Kernentitäten (geplant)

```
users (public.users via Supabase Auth)
├── id, email, role, roles[], tenants[], active_role, active_tenant
├── first_name, last_name, language, phone, avatar_url
├── is_active, totp_enabled
├── created_at, updated_at, last_login_at

vendors
├── id, name, slug, category, description
├── location, image_url, logo_url, rating
├── email, phone, website
├── is_active, visibility (public/private/link_only)
├── branding (colors, fonts, logo)

services
├── id, vendor_id, name, description, duration
├── price, currency, category, is_active
├── online_booking, buffer_before, buffer_after
├── max_capacity (group booking)

employees
├── id, vendor_id, user_id, name, email, phone
├── services[], locations[], is_active

bookings
├── id, vendor_id, service_id, employee_id, location_id
├── customer_id, customer_name, customer_email, customer_phone
├── start_at, end_at, duration, status, notes
├── price, currency, payment_status
├── affiliate_code, voucher_code, commission_rate
├── created_at, updated_at

wallet_transactions (append-only)
├── id, user_id, type, amount, currency, status
├── reference_id (booking/commission/payout), idempotency_key
├── description, metadata
├── created_at (immutable after insert)

affiliate_links
├── id, vendor_id, affiliate_id, campaign_id
├── code, target_type (vendor/service/package/slot)
├── target_id, commission_rate, is_active
├── created_at, expires_at

commissions
├── id, booking_id, affiliate_link_id, affiliate_id
├── amount, currency, status, rate
├── wallet_transaction_id
├── created_at, updated_at
```

## 5. API-Design-Prinzipien

- RESTful, prefix `/api/`
- Rollenbasierte Authorization (JWT via Supabase)
- Tenant-Isolation via `active_tenant`-Kontext
- Provider-Abstraktion via Strategy-Pattern
- Webhooks mit Idempotenz-Key + Signatur
- Pagination, Filter, Sortierung standardisiert
- Rate Limiting (pro Auth-Endpunkt)

## 6. Deployment (neuer Vercel-Account)

| Komponente | Projekt | Team | Status |
|-----------|---------|------|--------|
| Frontend | `bookando-de` | `agentur-projekte` | ✅ Verknüpft |
| Backend | `bookando-de-riw8` | `agentur-projekte` | ✅ Verknüpft |
| Legacy Frontend | `bookando-de` (alt) | Legacy | ❗ Nicht löschen |
| Legacy `build` | unbekannt | Legacy | ❗ Nicht übernehmen |

**Production-Deployment erst nach Security-Baseline + Freigabe.**
