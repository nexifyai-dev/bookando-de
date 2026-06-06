# 🏗️ Bookando — Architektur-Dokumentation

> Stand: 06.06.2026 | Repository: `nexifyai-dev/affilinet-portal-aachen`

---

## 1. Systemübersicht

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
│  React SPA (bookando.de) ← Vercel (CDN + SSR)               │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (Python)                    │
│  API-Server · JWT-Auth · PostgreSQL · Redis                  │
└─────────────────────────────────────────────────────────────┘
```

### Komponenten

| Komponente | Technologie | Hosting | Status |
|------------|-------------|---------|--------|
| **Frontend** | React 19 + TailwindCSS 3.4 | Vercel | ✅ Live |
| **Backend API** | FastAPI (Python) | Eigenständig | 🔧 In Entwicklung |
| **Database** | PostgreSQL | Supabase/TBD | 🔧 In Entwicklung |
| **Auth** | JWT (FastAPI) | Backend | 🔧 In Entwicklung |

---

## 2. Frontend-Architektur

### 2.1 Routing-Struktur (`App.js`)

```
/                              → HomePage (Landingpage)
/marketplace                   → MarketplacePage
/features                      → FeaturesPage
/pricing                       → PricingPage
/about                         → AboutPage
/contact                       → ContactPage
/legal                         → LegalPage (Impressum/Datenschutz)

/auth/login                    → LoginPage
/auth/register                 → RegisterPage
/auth/forgot-password          → ForgotPasswordPage
/auth/reset-password           → ResetPasswordPage
/auth/verify-email             → VerifyEmailPage

/vendor/*                      → Vendor-Dashboard (geschützt)
/customer/*                    → Customer-Dashboard (geschützt)
/admin/*                       → Admin-Dashboard (geschützt)
/franchiser/*                  → Franchiser-Dashboard (geschützt)
/portal/*                      → Partner-Portal (geschützt)
```

### 2.2 Seitenstruktur

```
Jede öffentliche Seite:
  <SEOHead />          ← Meta-Tags (react-helmet-async)
  <PublicNav />        ← Sticky Nav (scroll-dependent logo swapping)
  <main>...</main>     ← Seiteninhalt
  <PublicFooter />     ← Footer (3 Link-Spalten + Brand)

Jede Auth-Seite:
  <SEOHead />
  <section>            ← Zweigeteilt: Light-Form + Dark-Branding
    <img logo />       ← brand-logo-horizontal.png (oben)
    <form />           ← react-hook-form + zod validation
    <img logo />       ← brand-logo-on-dark-full.png (unten)
  </section>
```

### 2.3 Komponenten-Hierarchie

```
App.js
├── PublicNav              ← Sticky, Logo-Wechsel via scroll state
├── PublicFooter           ← Footer, 3 Columns
├── PortalShell            ← Geschützter Bereich
│   ├── Sidebar + Topbar
│   └── <Outlet />
├── HomePage
│   ├── Hero-Section       ← Hero-Grafik + CTA
│   ├── Features-Grid      ← 6 Feature-Cards
│   ├── Stats-Bar          ← Animated Counters
│   └── CTA-Section        ← 30-Tage-Testen + CTA-Grafik
└── Auth-Seiten
    ├── LoginPage
    ├── RegisterPage
    └── ...
```

---

## 3. Abhängigkeiten & Datenfluss

### 3.1 PublicNav — Logo-Wechsel (wichtigster Fix)

```
State: scrolled (window.scrollY > 20)
       location.pathname (isHome)

Bedingung:                Verwendetes Logo:
──────────────────────────────────────────────────────
isHome && !scrolled       → brand-logo-on-dark-full.png
                             (orangenes Hex + weiße Schrift)
                             auf transparentem/dunklem Nav-Hintergrund
                             
scrolled || !isHome       → brand-logo-horizontal.png
                             (orangenes Hex + dunkle Schrift)
                             auf weißem Nav-Hintergrund
```

> **Kein CSS-Filter `brightness(0) invert(1)`** mehr — stattdessen 
> dynamischer Austausch der korrekten Logo-Variante.

### 3.2 Authentifizierungsfluss

```
1. User → LoginPage (/auth/login)
2. POST /api/auth/login (E-Mail + Passwort)
3. Backend → JWT Token (Access + Refresh)
4. AuthContext speichert Token in localStorage
5. ProtectedRoute prüft AuthContext → Weiterleitung
6. Token via Authorization-Header bei API-Requests
```

---

## 4. Design-Entscheidungen (ADRs)

### ADR-001: CSS-Variablen statt Tailwind-Theme für Brand-Farben

- **Status:** Implementiert
- **Begründung:** Tailwind-Theme ist statisch zur Build-Zeit, CSS-Variablen 
  erlauben dynamisches WhiteLabel-Branding (pro Tenant/Partner)
- **Kompromiss:** Tailwind nutzt CSS-Variablen via `var(--color-*)`
- **Beispiel:** `style={{ background: 'var(--color-accent)' }}`

### ADR-002: Path-basiertes "b" im Logo statt SVG-Text

- **Status:** Implementiert (06.06.2026)
- **Begründung:** `<text>`-Element wird vom Systemfont beeinflusst und 
  variiert zwischen Betriebssystemen. Das "b" war optisch dezentriert 
  (Stiel links, Bauch rechts). Ein präziser SVG-Pfad garantiert 
  identische Darstellung auf allen Systemen.
- **Details:** Pfad zentriert die optische Masse des Buchstabens im Hexagon.

### ADR-003: Logo-Wechsel statt CSS-Filter

- **Status:** Implementiert (06.06.2026)
- **Begründung:** `brightness(0) invert(1)` zerstört mehrfarbige Logos 
  (oranges Hexagon wurde weiß). Dynamischer Austausch der korrekten 
  Variante ist performanter und markengetreuer.
- **Trade-off:** Zwei PNG-Dateien statt einer + CSS-Filter.

### ADR-004: Kein React Server Components / SSR

- **Status:** Akzeptiert (aktuell SPA)
- **Begründung:** CSP-React-SPA (Create React App) für schnellen Start.
  SEO wird via react-helmet-async und OG-Meta-Tags abgedeckt.
- **Zukunft:** Migration auf Next.js oder Vite in Phase 2 denkbar.

---

## 5. Performance

| Metrik | Wert | Bewertung |
|--------|------|-----------|
| JS Bundle (Total) | ~2.2 MB | 🟡 Moderat |
| Main Chunk | 988 KB | 🟡 Enthält gesamte App |
| CSS | 44 KB | ✅ Schlank |
| Lazy Loading | Code-Splitting pro Route | ✅ |
| Images | PNG (optimiert via cairosvg) | ✅ |

### Optimierungspotenzial

- **Code-Splitting:** Haupt-Chunk (988 KB) könnte weiter aufgeteilt werden
- **Fonts:** Google Fonts werden extern geladen → Font-Display-Empfehlung prüfen
- **Image-Optimierung:** WebP-Format für hero/CTA-Grafiken möglich

---

## 6. Sicherheit

| Bereich | Status | Maßnahme |
|---------|--------|----------|
| JWT-Auth | 🔧 Backend | Access + Refresh Token |
| XSS | ✅ React | Automatisches Escaping |
| CSRF | ✅ SameSite | Cookies mit SameSite=Lax |
| CORS | 🔧 Backend | Konfigurierbar via Backend |
| Rate Limiting | 🔧 Backend | Backend-seitig |
| HTTPS | ✅ Vercel | Automatisch via Vercel |
| CSP | 🟡 | Aktuell keine CSP-Header |
| API Keys | ✅ | In .env ausgelagert |

---

## 7. Datenmodell (Frontend-Perspektive)

Vom Frontend verwendete Datenstrukturen (Backend-Modelle in separater Doku):

| Modell | Frontend-Nutzung | API-Endpoint |
|--------|-----------------|--------------|
| `User` | AuthContext | `/api/auth/*` |
| `Vendor` | Vendor-Dashboard | `/api/vendors/*` |
| `Booking` | Buchungsseiten | `/api/bookings/*` |
| `Service` | Dienstleistungen | `/api/services/*` |
| `Affiliate` | Affiliate-Tracking | `/api/affiliates/*` |
| `Wallet` | Wallet-System | `/api/wallet/*` |
| `Transaction` | Ledger-Einträge | `/api/transactions/*` |

---

## 8. Abhängigkeiten & Integrationen

### Externe Dienste

| Dienst | Zweck | Status |
|--------|-------|--------|
| **Supabase Storage** | Bild-Hosting (Hero, Logos, etc.) | ✅ Genutzt |
| **Vercel** | Frontend-Hosting | ✅ Live |
| **Google Fonts** | IBM Plex Sans, Plus Jakarta Sans | ✅ Genutzt |
| **FastAPI Backend** | API-Server | 🔧 Entwicklung |

### Interne Integrationen

| Integration | Beschreibung |
|-------------|-------------|
| API-Client (`src/lib/apiClient.js`) | Axios-Instance mit Auth-Interceptor |
| Error-Handling | ErrorBoundary + sonner Toasts |
| Auth-Sync | AuthContext ↔ localStorage ↔ API |
