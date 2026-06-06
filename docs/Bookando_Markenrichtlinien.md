# Bookando – Markenrichtlinien & Logo-Assets
**Stand: 06.06.2026 | Version: 2.0**

## 1. Farbpalette (Brand Colors)
| Token | Farbe | Hex | Verwendung |
|-------|-------|-----|------------|
| **Primary Orange** (Akzent) | `🟠` | `#F59E0B` | Hexagon-Icon, Buttons, CTAs, Hover-States |
| **Deep Blue-Gray** (Primär) | `🔵` | `#2D3748` | Text auf hellen Hintergründen, Dark-Mode-BG |
| **White** (Light) | `⬜` | `#FFFFFF` | Text auf dunklen Hintergründen, Oberflächen |
| **Slate-400** (Subline) | `🔘` | `#94A3B8` | Subline "BOOK & SCALE" in Light-Mode |
| **Slate-500** (Subline Dark) | `🔘` | `#A0AEC0` | Subline "BOOK & SCALE" in Dark-Mode |

## 2. Logo-Assets

### Waben-Symbol (b-Hexagon)
- Oranges Hexagon (`#F59E0B`) mit feinen Waben-Linien
- Dunkles "b" (`#2D3748`) im Zentrum — **als SVG-Pfad (nicht als Text)**
- Verwendung: Favicon, Social-Media, App-Icons, mask-icon

### Voll-Logo (Horizontal)
```
[🟦 b 🟧]  Bookando
           BOOK & SCALE
```
- **Waben-Symbol links** + "Bookando" + "BOOK & SCALE"
- **Light Mode:** Text #2D3748, Subline #94A3B8
- **Dark Mode:** Text #FFFFFF, Subline #A0AEC0

### Verfügbare Dateien

| Variante | Format | Datei | Beschreibung |
|----------|--------|-------|-------------|
| **Light Logo** | PNG 1000×260 | `brand-logo-horizontal.png` | Orange Hex + dunkle Schrift |
| **Dark Logo** | PNG 1000×260 | `brand-logo-on-dark-full.png` | Orange Hex + weiße Schrift |
| **White Logo** | PNG 1000×260 | `brand-logo-white.png` | Alias für Dark |
| **Light SVG** | SVG 200×52 | `bookando-logo-light-corrected.svg` | Vektor-Light |
| **Dark SVG** | SVG 200×52 | `bookando-logo-dark-corrected.svg` | Vektor-Dark |
| **Icon SVG** | SVG 512×512 | `bookando-logo-icon.svg` | Standalone Hexagon (mask-icon) |
| **Mono Dark** | SVG 200×52 | `bookando-logo-mono-dark.svg` | Einfarbig dunkel (#2D3748) |
| **Mono Orange** | SVG 200×52 | `bookando-logo-mono-orange.svg` | Einfarbig orange (#F59E0B) |

> **Wichtig:** Das "b" im Hexagon ist als **präziser SVG-Pfad** ausgeführt (nicht als `<text>`-Element).
> Dies garantiert identische optische Zentrierung auf allen Betriebssystemen und Browsern,
> unabhängig von installierten System-Schriftarten.

## 3. Logo-Anwendung

### Hintergrund → Richtige Variante

| Hintergrund | Logo-Variante | Beispiel |
|-------------|---------------|----------|
| **Hell/Weiß** | `brand-logo-horizontal.png` | Navbar gescrollt, Auth-Formular, Footer-Bereiche |
| **Dunkel/Transparent** | `brand-logo-on-dark-full.png` | Navbar transparent (Hero), Footer, Dark-Section |

### CSS-Code-Snippet
```css
/* Hell */
.logo-light { content: url('/images/brand-logo-horizontal.png'); }
/* Dunkel */
.logo-dark { content: url('/images/brand-logo-on-dark-full.png'); }
```

### React Implementierung (korrekt)
```jsx
<img
  src={scrolled || !isHome
    ? '/images/brand-logo-horizontal.png'   /* Light */
    : '/images/brand-logo-on-dark-full.png' /* Dark */
  }
  alt="Bookando"
  className="h-8 sm:h-9 w-auto object-contain"
/>
```

> ❌ **Nicht verwenden:** `brightness(0) invert(1)` CSS-Filter — zerstört mehrfarbige Logos.

## 4. Favicon-Spezifikationen

| Datei | Größe | Verwendung |
|-------|-------|-----------|
| `favicon.ico` | 16×16 + 32×32 + 48×48 | Browser-Tab (Fallback) |
| `favicon-32x32.png` | 32×32 | Browser-Tab (PNG) |
| `favicon-64x64.png` | 64×64 | High-DPI Browser-Tab |
| `apple-touch-icon.png` | 180×180 | iOS/Apple Touch |
| `logo192.png` | 192×192 | PWA / Android |
| `logo512.png` | 512×512 | PWA / Android Adaptive |
| `bookando-logo-icon.svg` | SVG/512 | mask-icon (Safari) |

## 5. Social-Media / Open Graph

| Meta-Tag | Wert |
|----------|------|
| `og:image` | `https://bookando.de/images/og-image.png` |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:url` | `https://bookando.de` |
| `twitter:image` | `https://bookando.de/images/og-image.png` |

## 6. System-Prompt für KI-Agenten
> Nutze diese Markenrichtlinien für jede UI/UX-Generierung.
> Ersetze alte Logos durch die Waben-Struktur.
> Verwende immer die korrekte Logo-Variante abhängig vom Hintergrund (hell ↔ dunkel).
> Kein CSS-Filter `brightness(0) invert(1)` — stattdessen korrekte PNG-Variante einbinden.
> Das "b" im Hexagon muss als SVG-Pfad ausgeführt sein (nicht als `<text>`).
> Dark Mode (`#2D3748`) als Standard-Theme.
> SVG bevorzugen für Skalierbarkeit.
