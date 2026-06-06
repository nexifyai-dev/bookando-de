# 🛠️ Bookando — Entwickler-Dokumentation

> Stand: 06.06.2026

---

## 1. Entwicklungsumgebung einrichten

### 1.1 Voraussetzungen

```bash
node --version   # ≥ 18 (20 LTS empfohlen)
npm --version    # ≥ 9
git --version    # aktuell
```

### 1.2 Repository clonen

```bash
git clone <repository-url> bookando-de
cd bookando-de
npm install
```

### 1.3 Umgebungsvariablen

Kopiere `.env.example` nach `.env` und passe an:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SENTRY_DSN=
```

### 1.4 Entwicklung starten

```bash
npm start
# → http://localhost:3000
```

---

## 2. Projekt-Scripte

| Befehl | Beschreibung |
|--------|-------------|
| `npm start` | Entwicklungsserver (Port 3000) |
| `npm run build` | Production-Build → `build/` |
| `npm test` | Test-Suite (Jest) |

---

## 3. Code-Struktur & Konventionen

### 3.1 Dateiorganisation

```
src/
├── components/
│   ├── layout/     # Seitenstruktur (Nav, Footer, Shell)
│   ├── shared/     # Wiederverwendbare Komponenten
│   └── ui/         # Design-System-Atome (badge, card, etc.)
├── config/         # Unternehmens-/Plattform-Konfiguration
├── contexts/       # React Contexts (Auth)
├── lib/            # Utilitäten, API-Client
├── locales/        # i18n Übersetzungen (de/en)
└── pages/          # Seiten-Komponenten (nach Rollen)
```

### 3.2 Namenskonventionen

| Element | Konvention | Beispiel |
|---------|-----------|---------|
| Dateien | PascalCase für Komponenten | `HomePage.js` |
| Komponenten | PascalCase | `export default function PublicNav()` |
| Props | camelCase | `logoUrl`, `primaryCta` |
| CSS-Klassen | kebab-case + `.w2g-` Prefix | `.w2g-topbar-frame` |
| CSS-Variablen | kebab-case + `--color-*` | `--color-accent` |
| i18n Keys | snake_case mit `.`-Namespace | `hero.cta_primary` |

### 3.3 Komponenten-Struktur

```jsx
// Standard-Komponente
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ExampleComponent({ prop1, prop2 = 'default' }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('namespace.key')}</h2>
    </div>
  );
}
```

---

## 4. Das Design-System

### 4.1 CSS-Variablen verwenden

Immer CSS-Variablen statt Hardcoded-Farben:

```jsx
// ✅ Richtig
<div style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>

// ❌ Falsch
<div style={{ background: '#FFFFFF', color: '#0F172A' }}>
```

### 4.2 Utility-Klassen

Das Design-System stellt `.w2g-*` Utility-Klassen bereit:

| Klasse | Verwendung |
|--------|-----------|
| `.w2g-card` | Standard-Card mit Hover-Effekt |
| `.w2g-card-interactive` | Interaktive Card (hover, cursor) |
| `.w2g-card-elevated` | Erhöhte Card (stärkerer Shadow) |
| `.w2g-panel` | Panel ohne Hover-Effekt |
| `.w2g-topbar-frame` | Sticky-Topbar mit Glassmorphism |
| `.w2g-page-header` | Seitenkopf mit Titel + Aktionen |
| `.w2g-status-badge` | Status-Badge (grün/gelb/rot/blau) |
| `.w2g-glass` | Glassmorphism-Container |
| `.w2g-btn-danger` | Danger-Button |

### 4.3 Typografie

```jsx
// Überschrift (Cabinet Grotesk / Plus Jakarta Sans)
<h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>

// Body (IBM Plex Sans)
<p style={{ fontFamily: 'var(--font-body)' }}>
```

### 4.4 Layout

```jsx
// Seitenbreite
<div className="max-w-[1280px] mx-auto px-6 lg:px-12">

// Padding-Standard
<div className="py-[80px] md:py-[100px]">

// Abstände
<style>--spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px;</style>
```

---

## 5. i18n — Übersetzungen

### 5.1 Neue Keys hinzufügen

1. Key in `src/locales/de/translation.json` einfügen
2. Key in `src/locales/en/translation.json` einfügen
3. Im Code verwenden:

```jsx
const { t } = useTranslation();
return <p>{t('bereich.neuer_key')}</p>;
```

### 5.2 Vollständigkeit prüfen

```bash
# Vergleiche beide Sprachdateien
diff <(jq 'keys' src/locales/de/translation.json) <(jq 'keys' src/locales/en/translation.json)
```

---

## 6. Logo-Assets

### 6.1 Verfügbare Varianten

| Datei | Typ | Beschreibung |
|-------|-----|-------------|
| `brand-logo-horizontal.png` | PNG 1000×260 | **Light** — orange Hex + dunkle Schrift (#2D3748) |
| `brand-logo-on-dark-full.png` | PNG 1000×260 | **On-Dark** — orange Hex + weiße Schrift |
| `brand-logo-white.png` | PNG 1000×260 | Alias für On-Dark |
| `bookando-logo-dark-corrected.svg` | SVG 200×52 | Dark-Vektor (Quelle für PNGs) |
| `bookando-logo-light-corrected.svg` | SVG 200×52 | Light-Vektor (Quelle für PNGs) |
| `bookando-logo-icon.svg` | SVG 512×512 | Standalone Icon (mask-icon, Favicon-Quelle) |

### 6.2 Neue PNGs rendern

```bash
# SVG → PNG via cairosvg
python3 -c "
import cairosvg
cairosvg.svg2png(
    url='public/images/bookando-logo-dark-corrected.svg',
    write_to='public/images/brand-logo-on-dark-full.png',
    scale=5  # 1000×260
)
"
```

### 6.3 Logo in neuen Komponenten einbinden

```jsx
// Light Background
<img src="/images/brand-logo-horizontal.png" alt="Bookando" className="h-8 sm:h-9" />

// Dark Background
<img src="/images/brand-logo-on-dark-full.png" alt="Bookando" className="h-8 sm:h-9" />
```

---

## 7. Deployment

### 7.1 Production Build

```bash
npm run build
```

### 7.2 Vercel Deployment

```bash
# Einmalig
vercel login

# Deployment
vercel --prod
```

### 7.3 Build-Prüfung

Vor jedem Deployment prüfen:

```bash
# 1. Build sauber?
npm run build  # → "Compiled successfully"

# 2. Assets vorhanden?
ls -la build/images/brand-logo-*.png
ls -la build/images/og-image.png

# 3. Meta-Tags korrekt?
grep -c "bookando.de" build/index.html  # sollte ≥3 sein
```

---

## 8. Code-Review Checklist

- [ ] Keine `console.log` in Production
- [ ] i18n-Keys in beiden Sprachen vorhanden
- [ ] CSS-Variablen statt Hardcoded-Farben
- [ ] Logos mit korrekter Variante (Light ↔ Dark Background)
- [ ] Keine `<text>`-Elemente für das "b" im Logo (Pfad verwenden)
- [ ] Komponenten-Props dokumentiert
- [ ] Build sauber (`npm run build`)
- [ ] Assets im `build/` Verzeichnis aktualisiert

---

## 9. Fehlerbehebung

### Build schlägt fehl
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Vercel-Deployment schlägt fehl
```bash
vercel logs --prod  # Runtime-Logs prüfen
```

### Logo wird falsch angezeigt
```bash
# 1. CSS-Filter prüfen — darf kein brightness(0) invert(1) enthalten
# 2. Logo-Variante prüfen — dark background → on-dark Variante
# 3. asset-manifest.json prüfen — Dateiname korrekt?
```

---

## 10. Nützliche Befehle

```bash
# Analyse: Komponenten-Struktur
grep -rn "export default function" src/ | sort

# Analyse: CSS-Variablen-Nutzung
grep -rn "var(--color" src/ | grep -v node_modules | wc -l

# Analyse: i18n-Keys in Komponenten
grep -rn "t('" src/ --include="*.js" | grep -v node_modules | head -20

# Prüfen: Alle OG-Meta-Tags
grep -A2 'og:' public/index.html

# Build-Größe
du -sh build/static/js/
du -sh build/static/css/
