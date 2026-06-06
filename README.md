# 📘 Bookando.de — Buchungs- & Sales-Plattform für Dienstleister

**Bookando.de** ist eine modulare **SaaS-, Marketplace- und WhiteLabel-Plattform für Dienstleister**.
Sie kombiniert professionelle Terminbuchung, Kalenderverwaltung, Marketplace, Affiliate-Marketing,
Wallet-Systeme und CRM in einer skalierbaren Infrastruktur.

> **Bookando ist KEIN einfaches Terminbuchungstool, sondern ein vollständiges Betriebs-, Vertriebs- und Marketing-Ökosystem für Dienstleister.**

---

## 📦 Technologie-Stack

| Bereich | Technologie | Version |
|---------|-------------|---------|
| **Frontend** | React | 19.x |
| **Routing** | react-router-dom | 7.x |
| **Styling** | TailwindCSS | 3.4 |
| **Icons** | lucide-react | 1.7 |
| **i18n** | i18next | 26.x |
| **SEO** | react-helmet-async | 3.x |
| **Formulare** | react-hook-form + zod | aktuell |
| **HTTP** | axios | 1.8 |
| **Charts** | recharts | 3.6 |
| **Toasts** | sonner | 2.x |
| **Backend** | FastAPI (Python) | separater Service |
| **Hosting** | Vercel | aktuell |

---

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ (empfohlen: 20 LTS)
- npm 9+

### Installation

```bash
# Repository klonen
git clone <repository-url> bookando-de
cd bookando-de

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Port 3000)
npm start
```

### Build für Production

```bash
npm run build
# Output: build/
```

### Deployment

Das Projekt ist für **Vercel** konfiguriert (`vercel.json`).

```bash
# Vercel CLI (einmalig: vercel login)
vercel --prod
```

---

## 📁 Projektstruktur

```
bookando-de/
├── public/                     # Statische Assets
│   └── images/                 # Logos, Icons, Grafiken
│       ├── brand-logo-*.png    # Logo-Varianten (Produktion)
│       ├── bookando-logo-*.svg # SVG-Logo-Quellen
│       ├── hero-grafik.png     # Hero-Illustration
│       ├── cta-grafik.png      # CTA-Illustration (30 Tage)
│       ├── og-image.png        # Open Graph (1200×630)
│       ├── favicon.ico         # Favicon (16+32+48)
│       ├── logo{192,512}.png  # PWA-Icons
│       └── apple-touch-icon.png
├── src/
│   ├── components/
│   │   ├── layout/             # PublicNav, PublicFooter, PortalShell
│   │   ├── shared/             # CookieBanner, ErrorBoundary, SEOHead
│   │   └── ui/                 # card, badge, avatar, progress, separator
│   ├── config/                 # Unternehmenskonfiguration (company.js)
│   ├── contexts/               # AuthContext (Authentifizierung)
│   ├── lib/                    # Utils, API-Client
│   ├── locales/                # i18n (de/en)
│   ├── pages/
│   │   ├── public/             # HomePage, About, Contact, Features, Pricing, Marketplace
│   │   ├── auth/               # Login, Register, Forgot/Reset-Password, VerifyEmail
│   │   ├── vendor/             # Vendor-Dashboard (12 Seiten)
│   │   ├── customer/           # Customer-Dashboard (5 Seiten)
│   │   ├── admin/              # Admin-Dashboard (5 Seiten)
│   │   ├── franchiser/         # Franchiser-Dashboard (3 Seiten)
│   │   ├── portal/             # Portal-Dashboard
│   │   └── legal/              # Impressum, Datenschutz
│   ├── App.js                  # Router-Struktur
│   ├── index.css               # ★ Vollständiges Design-System ★
│   ├── i18n.js                 # i18n-Setup
│   └── index.js                # Entry Point
├── docs/
│   ├── ARCHITECTURE.md         # Architektur-Dokumentation
│   ├── DEVELOPMENT.md          # Entwickler-Dokumentation
│   ├── Bookando_Markenrichtlinien.md
│   └── Prozess_und_Architektur_Grafiken.md
├── public/index.html           # HTML-Template mit Meta-Tags
├── vercel.json                 # Vercel-Konfiguration
├── tailwind.config.js          # Tailwind-Theme
├── package.json
└── PFLICHTENHEFT.md            # Product Requirements Document
```

---

## 🎨 Design-System

Das vollständige Design-System ist in `src/index.css` als CSS-Custom-Properties definiert.

### Markenfarben

| Token | Wert | Verwendung |
|-------|------|------------|
| `--color-primary` | `#1A202C` | Primäre Text- und UI-Farbe |
| `--color-accent` | `#F59E0B` | Akzentfarbe (Hexagon, Buttons, CTAs) |
| `--color-shell-bg` | `#F8FAFC` | Seitenhintergrund |
| `--color-surface` | `#FFFFFF` | Karten/Container |

### Logo-Assets

| Variante | Datei | Beschreibung |
|----------|-------|-------------|
| **Light** | `brand-logo-horizontal.png` | Orange Hex + dunkle Schrift (#2D3748) |
| **On-Dark** | `brand-logo-on-dark-full.png` | Orange Hex + weiße Schrift |
| **White** | `brand-logo-white.png` | Orange Hex + weiße Schrift |
| **Icon/SVG** | `bookando-logo-icon.svg` | Standalone Hexagon (mask-icon, Favicon) |
| **Dark SVG** | `bookando-logo-dark-corrected.svg` | Vektor Dark-Variante |
| **Light SVG** | `bookando-logo-light-corrected.svg` | Vektor Light-Variante |

> **Hinweis:** Das "b" im Hexagon ist als SVG-Pfad ausgeführt (nicht als `<text>`), 
> um optisch korrekte Zentrierung unabhängig von Systemfonts zu gewährleisten.

---

## 🌐 Internationalisierung (i18n)

- Framework: **i18next** + **react-i18next**
- Sprachen: **Deutsch** (primär), **Englisch**
- Erkennung: Browser-Präferenz + localStorage-Cache
- Übersetzungsdateien: `src/locales/{de,en}/translation.json`
- 21 Keys pro Sprache (Nav, Hero, Features, Footer, Auth, Dashboard, etc.)

---

## 🔐 Authentifizierung

- Auth-Context (`src/contexts/AuthContext.js`)
- Geschützte Routen via `ProtectedRoute`-Komponente
- Rollen: Admin, Vendor, Customer, Franchiser
- JWT-basiert (Backend: FastAPI)

### Auth-Seiten
| Seite | Route | Beschreibung |
|-------|-------|-------------|
| Login | `/auth/login` | E-Mail + Passwort |
| Register | `/auth/register` | Registrierung |
| Forgot Password | `/auth/forgot-password` | Passwort-Reset anfordern |
| Reset Password | `/auth/reset-password` | Neues Passwort setzen |
| Verify Email | `/auth/verify-email` | E-Mail-Verifikation |

---

## 🧩 Komponenten-API

Detaillierte Props-Dokumentationen siehe `docs/DEVELOPMENT.md`.

### Hauptkomponenten

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `PublicNav` | `components/layout/PublicNav.js` | Öffentliche Navbar mit dynamischem Logo |
| `PublicFooter` | `components/layout/PublicFooter.js` | Footer mit 3 Link-Spalten |
| `PortalShell` | `components/layout/PortalShell.js` | Portal-Hülle mit Sidebar |
| `SEOHead` | `components/shared/SEOHead.js` | SEO-Meta-Tags pro Seite |
| `CookieBanner` | `components/shared/CookieBanner.js` | DSGVO-Cookie-Consent |
| `ErrorBoundary` | `components/shared/ErrorBoundary.js` | Globaler Fehlerhandler |

---

## 🚢 Deployment

### Vercel (aktuell)

```bash
vercel --prod
```

### Domains
- **Hauptdomain:** `bookando.de`
- **App-Domain:** `app.bookando.de`

### Umgebungsvariablen

| Variable | Beschreibung |
|----------|-------------|
| `REACT_APP_API_URL` | Backend-API-URL |
| `REACT_APP_SENTRY_DSN` | (optional) Error Tracking |

---

## 📄 Lizenz

Proprietär — FixDigital / Kevin Gaus. Alle Rechte vorbehalten.

---

## 🧠 Verwandte Projekte

- **Backend:** FastAPI-Backend (separates Repository)
- **Design-Template:** Ursprünglich extrahiert aus Studienkolleg Aachen Projekt
