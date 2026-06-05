# 🎨 Design Template – Landingpage mit Portal

**Ein wiederverwendbares Design-Template, extrahiert aus dem Studienkolleg Aachen Projekt.**
Premium Landingpage + Portal-Shell mit vollständigem Design-System – bereit für dein nächstes Projekt!

---

## 📦 Inhalt

```
design-template-landing-mit-portal/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PublicNav.js        ← Öffentliche Navigation (generalisiert)
│   │   │   ├── PublicFooter.js     ← Footer (generalisiert, 5 Spalten)
│   │   │   ├── PortalShell.js      ← Portal-Hülle (Sidebar + Topbar + Mobile)
│   │   │   └── PageScaffold.js     ← Einheitlicher Seitenrahmen
│   │   ├── ui/
│   │   │   ├── card.jsx            ← Card, CardHeader, CardTitle, etc.
│   │   │   ├── badge.jsx           ← Badge mit 8 Varianten + 3 Größen
│   │   │   ├── avatar.jsx          ← Avatar + Fallback
│   │   │   ├── separator.jsx       ← Separator (horizontal/vertikal)
│   │   │   └── progress.jsx        ← Progress-Bar (4 Größen)
│   │   └── shared/
│   │       ├── CookieBanner.js     ← DSGVO-konformer Cookie-Banner
│   │       ├── ErrorBoundary.js    ← Globaler Fehler-Handler
│   │       └── ScrollToTop.js      ← Scrollt bei Route-Change nach oben
│   ├── pages/
│   │   ├── public/
│   │   │   └── HomePage.js         ← Landingpage (Hero + Features + Stats + CTA)
│   │   ├── auth/
│   │   │   ├── LoginPage.js        ← Login-Formular (Platzhalter)
│   │   │   └── RegisterPage.js     ← Registrierung (Platzhalter)
│   │   ├── portal/
│   │   │   └── DashboardPage.js    ← Dashboard (Beispiel)
│   │   └── PortalApp.js           ← Portal mit PortalShell (Beispiel)
│   ├── lib/
│   │   └── utils-cn.js             ← Tailwind-Klassen-Merge (cn())
│   ├── locales/
│   │   ├── de/translation.json     ← Deutsche Übersetzungen
│   │   └── en/translation.json     ← Englische Übersetzungen
│   ├── index.css                   ← ★ VOLLSTÄNDIGES DESIGN-SYSTEM ★
│   ├── i18n.js                     ← i18n Setup (DE/EN)
│   ├── index.js                    ← React Entry Point
│   └── App.js                      ← Router-Struktur
├── tailwind.config.js              ← Tailwind-Konfiguration
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Schnellstart

### 1. Kopieren & Installieren

```bash
# In dein Projekt kopieren (oder fork/clone)
cp -r design-template-landing-mit-portal mein-neues-projekt
cd mein-neues-projekt
npm install
npm start
```

### 2. Design anpassen

**Farben & Design-Tokens** → `src/index.css` Zeile ~6-80:

```css
:root {
  --color-primary: #0A192F;       /* ← Primärfarbe */
  --color-accent: #C49B3E;        /* ← Akzentfarbe (Gold) */
  --color-shell-bg: #F8FAFC;      /* ← Hintergrund */
  --font-heading: 'Cabinet Grotesk', ...;  /* ← Überschrift-Font */
  --font-body: 'IBM Plex Sans', ...;       /* ← Body-Font */
}
```

### 3. Landingpage anpassen

Öffne `src/pages/public/HomePage.js` und bearbeite das `CONFIG`-Objekt am Anfang:

```js
const CONFIG = {
  projectName: 'Dein Projekt',
  heroTitle: 'Willkommen bei',
  heroTitleAccent: 'deinem Projekt',
  // ...
};
```

### 4. Navigation anpassen

In `App.js` das `PUBLIC_ROUTES` Array bearbeiten.
In den Komponenten selbst (`PublicNav`, `PublicFooter`, `PortalShell`) werden Nav-Items als Props übergeben.

### 5. Eigene Seiten hinzufügen

```js
// In App.js:
const PUBLIC_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/meine-seite', element: <MeineSeite /> },  // ← Neu
  // ...
];
```

---

## 🧩 Komponenten-API

### PublicNav

```jsx
<PublicNav
  navItems={[
    { href: '/', labelKey: 'nav.home' },
    { href: '/features', label: 'Features' },   // label oder labelKey
  ]}
  logoUrl="/images/logo.png"
  logoText="Mein Projekt"        // Fallback wenn kein logoUrl
  logoHref="/"
  primaryCta={{ labelKey: 'nav.register', href: '/auth/register' }}
  secondaryCta={{ labelKey: 'nav.login', href: '/auth/login' }}
  hideLanguageSwitch={false}
/>
```

### PublicFooter

```jsx
<PublicFooter
  brandName="Mein Projekt"
  brandIcon={GraduationCap}           // lucide-react Icon
  description="Beschreibung..."
  columns={[
    {
      titleKey: 'footer.col_product',
      links: [
        { labelKey: 'footer.link_features', href: '/features' },
        { labelKey: 'footer.link_privacy', href: '/privacy' },
        { label: 'Cookies', onClick: 'openCookieSettings', icon: Shield },
      ],
    },
  ]}
  contactInfo={{
    address: 'Musterstr. 1, 12345 Stadt',
    phone: '+49 123 456 789',
    email: 'hallo@example.de',
  }}
  socialLinks={[
    { icon: InstagramIcon, href: 'https://instagram.com/...', label: 'Instagram' },
  ]}
  cta={{ labelKey: 'hero.cta_primary', href: '/auth/register' }}
/>
```

### PortalShell

```jsx
<PortalShell
  portalName="Dashboard"
  navItems={[
    { path: '/portal', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/portal/settings', label: 'Einstellungen', icon: Settings },
  ]}
  mobileBottomNav={[
    { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/portal/settings', label: 'Einstellungen', icon: Settings },
  ]}
  user={{ full_name: 'Max', email: 'max@example.de', role: 'user' }}
  onLogout={handleLogout}
  headerContent={<NotificationBell />}
  hideLanguageSwitch={false}
>
  <Routes>
    <Route index element={<DashboardPage />} />
  </Routes>
</PortalShell>
```

### PageScaffold

```jsx
<PageScaffold
  title="Dashboard"
  subtitle="Willkommen zurück!"
  actions={<Button>Neu</Button>}
>
  <p>Seiteninhalt...</p>
</PageScaffold>
```

---

## 🎨 Design-System Features

| Feature | Beschreibung |
|---|---|
| **CSS-Variablen** | ~80 Custom Properties für Farben, Abstände, Schatten, Radii, Fonts |
| **Utility-Klassen** | `.w2g-card`, `.w2g-panel`, `.w2g-topbar-frame`, `.w2g-page-header` uvm. |
| **Shadows** | 5 Stufen (e0–e4), Card-Hover, Glassmorphism |
| **Status-Farben** | Success, Warning, Danger, Info – mit BG, Text und Border |
| **Radii** | Sharp Technical: 3px–8px, keine Bubble-Radii |
| **Typografie** | Heading-Font (tight tracking), Body-Font (hohe Lesbarkeit) |
| **i18n** | DE/EN mit Language-Detector, localStorage-Cache |
| **Responsive** | Mobile-First, Breakpoints: sm(640), md(768), lg(1024) |
| **Scrollbar** | Systemweit unsichtbar (Webkit + Firefox) |
| **Animationen** | fade-in, slide-up, stagger-Effekte mit IntersectionObserver |

### Design-Prinzipien

- **Institutional Trust** – dunkles Blau (#0A192F) + Akzent-Gold (#C49B3E)
- **Swiss & High-Contrast** – klare Trennungen, reichlich Weißraum
- **Glassmorphism** – für sticky Header (backdrop-filter + rgba)
- **Keine Bubble-Radii** – max 8px für Cards
- **Status-Farben** – grün/gelb/rot/blau für semantisches Feedback

---

## 📁 Integration in bestehende Projekte

### In ein React-Projekt einbinden:

1. **CSS importieren** – `import './design-system/index.css'`
2. **Tailwind Config kopieren** – oder manuell erweitern
3. **Komponenten importieren** – `import { PortalShell } from './design-system/components/layout/PortalShell'`
4. **Tokens überschreiben** – in deinem eigenen CSS: `:root { --color-primary: #deineFarbe; }`

### Als Submodule / Copy:

```bash
cp -r src/design-template/* src/design-system/
```

---

## 🛠 Technologie-Stack

| Technologie | Version |
|---|---|
| React | 19 |
| TailwindCSS | 3.4 |
| react-router-dom | 7 |
| i18next | 26 |
| lucide-react | 1.7 |
| react-helmet-async | 3 |
| sonner | 2 |
| class-variance-authority | 0.7 |
| tailwind-merge | 3.5 |

---

## 📝 Lizenz

MIT – frei verwendbar, anpassbar und erweiterbar.

---

## 🧠 Entstanden aus

Extrahiert aus dem **Studienkolleg Aachen** Projekt – einem umfangreichen Education-CRM/ERP mit öffentlicher Landingpage und geschütztem Portal-Bereich.
