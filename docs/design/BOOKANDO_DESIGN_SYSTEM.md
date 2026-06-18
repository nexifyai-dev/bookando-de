# Bookando Design System (BDS)

> **Version:** 1.0.0
> **Stand:** 2026-06-18
> **Scope:** bookando.de Frontend (React + Tailwind CSS)
> **Token-Quelle:** `src/index.css` `:root`-Block (kanonisch, alle Komponenten referenzieren CSS Custom Properties)
>
> **Achtung:** `tailwind.config.js` enthält abweichende Werte (`primary: #113655`, `accent: #C49B3E`) und ist nicht die Laufzeit-Wahrheit. Tokens in diesem Dokument stammen aus `src/index.css`, das von allen Komponenten via `var(--token)` genutzt wird.

---

## 1. Markenfundament

### 1.1 Markenidentität

| Attribut | Wert |
|----------|------|
| **Markenname** | Bookando |
| **Claim** | Buchungs- & Sales-Plattform für Dienstleister |
| **Domain** | bookando.de |
| **Zielgruppe** | B2B SaaS Marketplace: Dienstleister (Vendors) + Endkunden |
| **Design-Charakter** | Premium-Consumer Booking, technisch aber warm, restrained Animation |
| **Design Variance** | 6 (asymmetrisch wo angemessen, symmetrisch wo funktional) |
| **Motion Intensity** | 5 (subtile UI-Animationen, Button-Feedback, Stagger) |
| **Visual Density** | 4 (Standard-Dichte fur tagliche SaaS-Nutzung) |

### 1.2 Primarpalette

```css
/* Markenfarbe — Bookando Orange */
--color-accent:          #F59E0B;  /* Primarer Akzent, CTAs, aktive Elemente */
--color-accent-hover:    #D97706;  /* Hover-State */
--color-accent-light:    #FEF3C7;  /* Highlight-Hintergrunde */
--color-accent-muted:    rgba(245,158,11,0.10);  /* Badge-Backgrounds */
--color-accent-subtle:   rgba(245,158,11,0.05);  /* Leichte Hervorhebung */
--color-accent-teal:     #0D9488;  /* Sekundarer Akzent (sparsam einsetzen) */
--color-accent-pink:     #DB2777;  /* Tertiarer Akzent (selten) */
```

**Regel:** Eine Akzentfarbe pro Seite. Bookando Orange (#F59E0B) ist die dominante CTA-/Markenfarbe. Kein Beige/Brass — das ist explizit ausgeschlossen (UI_UX_SKILL_REVIEW §4.2).

### 1.3 Neutrale / Primare Palette (Deep Navy)

```css
--color-primary:         #1A202C;  /* Uberschriften, aktive Navigation, Icons */
--color-primary-light:   #2D3748;  /* Hover-Backgrounds, Footer */
--color-primary-dark:    #2D3748;  /* Dunklere Variante (Footer-Hintergrund) */
--color-primary-muted:   rgba(26,32,44,0.05);  /* Subtile Hervorhebung */
```

### 1.4 Oberflachen-Palette

```css
--color-shell-bg:        #F8FAFC;  /* Seitenhintergrund (slate-50) */
--color-surface:         #ffffff;  /* Karten, Panels, Modals */
--color-surface-elevated:#FAFBFC;  /* Erhohte Flachen (hoher als Surface) */
--color-surface-sunken:  #F1F5F9;  /* Vertiefte Flachen, Input-Backgrounds */
--color-divider:         #E2E8F0;  /* Trennlinien, Borders */
--color-divider-subtle:  #F1F5F9;  /* Leichte Trennlinien */
```

### 1.5 Textfarben

```css
--color-text-primary:    #0F172A;  /* Haupttext (slate-900) */
--color-text-secondary:  #475569;  /* Sekundartext, Beschreibungen */
--color-text-tertiary:   #94A3B8;  /* Platzhalter, deaktivierte Elemente */
```

**Kontrast-Check:**
- `--color-text-primary` auf `--color-surface`: 15.4:1 (AAA)
- `--color-text-secondary` auf `--color-surface`: 5.1:1 (AA)
- `--color-accent` auf Weiss: 2.1:1 (nur Large Text / dekorativ — CTA-Buttons verwenden `--color-primary-dark`-Text)

---

## 2. Statusfarben

### 2.1 Semantische Farben

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--color-success` | `#059669` | Erfolgsmeldungen, bestatigte Buchungen |
| `--color-success-bg` | `#ECFDF5` | Erfolgs-Hintergrunde |
| `--color-success-border` | `#A7F3D0` | Erfolgs-Borders |
| `--color-warning` | `#D97706` | Warnungen, ausstehende Zahlungen |
| `--color-warning-bg` | `#FFFBEB` | Warnungs-Hintergrunde |
| `--color-warning-border` | `#FDE68A` | Warnungs-Borders |
| `--color-danger` | `#DC2626` | Fehler, Ablehnungen |
| `--color-danger-bg` | `#FEF2F2` | Fehler-Hintergrunde |
| `--color-danger-border` | `#FECACA` | Fehler-Borders |
| `--color-info` | `#2563EB` | Informationen, neutrale Hinweise |
| `--color-info-bg` | `#EFF6FF` | Info-Hintergrunde |
| `--color-info-border` | `#BFDBFE` | Info-Borders |

### 2.2 Status-Badges (erweiterte Palette)

| Token | Textfarbe | Hintergrund | Border | Verwendung |
|-------|-----------|-------------|--------|-----------|
| `--status-new-*` | `#1E40AF` | `#EFF6FF` | `#BFDBFE` | Neu / Unbearbeitet |
| `--status-active-*` | `#15803D` | `#F0FDF4` | `#A7F3D0` | Aktiv / Bestatigt |
| `--status-warning-*` | `#B45309` | `#FFFBEB` | `#FDE68A` | Ausstehend / Pending |
| `--status-danger-*` | `#B91C1C` | `#FEF2F2` | `#FECACA` | Fehler / Abgelehnt |
| `--status-neutral-*` | `#475569` | `#F8FAFC` | `#E2E8F0` | Inaktiv / Archiviert |

---

## 3. Typografie

### 3.1 Font-Stack

```css
--font-heading: 'Cabinet Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body:    'IBM Plex Sans', 'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

**Google Fonts Import (in `index.css`):**
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
```

**Fallback-Strategie:** Cabinet Grotesk ist eine lizenzierte Schrift; Plus Jakarta Sans dient als nachster Fallback (Google Fonts). IBM Plex Sans ist die Body-Schrift.

### 3.2 Typografische Skala

| Stufe | Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|---------|-------------|------|--------|-------------|----------------|
| **H1** | Seitentitel | `--font-heading` | 1.75rem (28px) / 2rem (32px) ab 640px | 800 | 1.0 | -0.03em |
| **H2** | Sektionsuberschriften | `--font-heading` | 1.25rem (20px) | 700 | 1.15 | -0.03em |
| **H3** | Karten-Titel, Widget-Titel | `--font-heading` | 0.875rem (14px) | 700 | 1.25 | -0.02em |
| **H4** | Unteruberschriften | `--font-heading` | 0.75rem (12px) | 700 | 1.3 | 0.1em (uppercase) |
| **Body** | FlieSStext | `--font-body` | 0.875rem (14px) | 400 | 1.6 | -0.006em |
| **Body Small** | Beschreibungen, Metadaten | `--font-body` | 0.75rem (12px) | 400 | 1.5 | 0 |
| **Caption** | Labels, Badges, Hilfstext | `--font-body` | 0.6875rem (11px) | 600 | 1.4 | 0 |
| **Tiny** | Badge-Micro, KPI-Sublabel | `--font-body` | 0.625rem (10px) | 600 | 1.3 | 0.05em |
| **Overline** | Footer-Uberschriften, Sektion-Labels | `--font-heading` | 0.75rem (12px) | 700 | 1.3 | 0.1em (uppercase) |
| **Mono** | Code, IDs, Transaktionsnummern | `--font-mono` | 0.75rem (12px) | 500 | 1.5 | 0 |

### 3.3 Font-Weights (verfugbare Stufen)

| Weight | Name | Verwendung |
|--------|------|-----------|
| 400 | Regular | Body, Beschreibungen |
| 500 | Medium | Mono, Form-Labels |
| 600 | Semibold | Captions, Badges, Top-Navigation |
| 700 | Bold | Uberschriften (Default), Buttons |
| 800 | Extra Bold | H1-Seitentitel, Hero-Headlines |

### 3.4 Allgemeine Typografie-Regeln

- **Uberschriften:** `font-family: var(--font-heading); font-weight: 700; letter-spacing: -0.03em; line-height: 1.15; color: var(--color-primary);`
- **Body:** `font-family: var(--font-body); font-size: 14px; line-height: 1.6; letter-spacing: -0.006em; -webkit-font-smoothing: antialiased;`
- **Kein Em-Dash (—) im gesamten UI.** (UI_UX_SKILL_REVIEW §9.F)
- **Font-Feature-Settings:** `'kern' 1, 'liga' 1` (Kerning + Standard-Ligaturen)
- **Selection:** `background: var(--color-accent); color: var(--color-primary-dark);`

---

## 4. Abstands-Skala

Basiert auf einem 4px-Grundraster (Tailwind-kompatibel).

| Token | Wert | Tailwind-Entsprechung | Verwendung |
|-------|------|-----------------------|-----------|
| `--spacing-xs` | 4px | `p-1` / `gap-1` | Inline-Abstande, Icon-Text-Gap |
| `--spacing-sm` | 8px | `p-2` / `gap-2` | Button-Padding, Card-Gaps |
| `--spacing-md` | 16px | `p-4` / `gap-4` | Card-Padding, Sektions-Abstande |
| `--spacing-lg` | 24px | `p-6` / `gap-6` | Page-Sektion-Gap |
| `--spacing-xl` | 32px | `p-8` / `gap-8` | GroSSe Sektions-Abstande |
| `--spacing-2xl` | 48px | `p-12` | Hero-Sektion Padding |
| `--spacing-3xl` | 64px | `p-16` | Seitenweite Trennung |

### 4.1 Layout-Tokens

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--shell-max-width` | 1280px | Maximale Inhaltsbreite |
| `--page-gutter` | 24px | Seitenrand Desktop |
| `--page-gutter-tablet` | 20px | Seitenrand Tablet |
| `--page-gutter-mobile` | 16px | Seitenrand Mobile |
| `--topbar-height` | 64px | Topbar Desktop |
| `--topbar-height-mobile` | 56px | Topbar Mobile |
| `--toolbar-height` | 52px | Toolbar / Filterleiste |
| `--control-height` | 38px | Standard Input/Select Hohe |
| `--table-row-height` | 48px | Tabellenzeilenhohe |
| `--sidebar-width` | 260px | Sidebar (CSS-Token, Laufzeit 240px via JS) |

---

## 5. Border-Radii (Shape Consistency Lock)

**Ein Radius-System** fur die gesamte Plattform (UI_UX_SKILL_REVIEW §4.4 Shape Consistency).

| Token | Wert | Tailwind | Verwendung |
|-------|------|----------|-----------|
| `--radius-xs` | 3px | `rounded-[var(--radius-xs)]` | Kleine Badges, Tags, Inline-Elemente |
| `--radius-sm` | 4px | `rounded-[var(--radius-sm)]` | Buttons, Inputs, Selects, Avatare |
| `--radius-md` | 6px | `rounded-[var(--radius-md)]` | Cards, Panels, Sidebar-Items |
| `--radius-lg` | 8px | `rounded-[var(--radius-lg)]` | Modals, Dropdowns, groSSere Container |
| `--radius-xl` | 8px | `rounded-[var(--radius-xl)]` | (Alias fur lg, reserviert) |
| `--radius-full` | 9999px | `rounded-[var(--radius-full)]` | Badge-Pills, Progress-Bars, Avatare |

**Regel:** Karten-Komponenten benutzen einheitlich `--radius-md` (6px). Buttons + Formularelemente `--radius-sm` (4px). Keine gemischten Radien innerhalb einer Komponentengruppe.

---

## 6. Schatten und Elevation

### 6.1 Schatten-Palette (an Background-Hue angepasst)

Schwarz-basierte Schatten mit abgestufter Deckkraft — kein `box-shadow` mit neutralem Grau ohne Hue-Bezug.

| Token | Wert | Elevation | Verwendung |
|-------|------|-----------|-----------|
| `--shadow-e0` | `none` | 0 | Flache Elemente |
| `--shadow-e1` | `0 1px 2px rgba(0,0,0,0.04)` | 1 | Standard-Cards, Panels |
| `--shadow-e2` | `0 2px 8px rgba(0,0,0,0.06)` | 2 | Card-Hover, erhohte Cards |
| `--shadow-e3` | `0 8px 24px rgba(0,0,0,0.08)` | 3 | Dropdowns, Popover |
| `--shadow-e4` | `0 16px 48px rgba(0,0,0,0.10)` | 4 | Modals, Dialoge |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)` | Card | Standard-Karte (Border+Shadow) |
| `--shadow-card-hover` | `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` | Card Hover | Interaktive Karte im Hover |
| `--shadow-glass` | `0 4px 16px rgba(0,0,0,0.06)` | Glass | Glassmorphism-Panels |
| `--shadow-elevated` | `var(--shadow-e2)` | Alias | Semantisches Alias |
| `--shadow-modal` | `var(--shadow-e4)` | Alias | Modals |
| `--shadow-focus` | `0 0 0 2px var(--color-primary), 0 0 0 4px rgba(26,32,44,0.12)` | Focus | Focus-Ring (WCAG-konform) |
| `--shadow-inset` | `inset 0 1px 2px rgba(0,0,0,0.04)` | Inset | Inputs, versenkte Flachen |

### 6.2 Elevation-Mapping

| Z-Ebene | Shadow | Komponente |
|---------|--------|-----------|
| 0 (Base) | `--shadow-e0` | Text, Icons, Divider |
| 1 (Raised) | `--shadow-e1` / `--shadow-card` | Cards, Panels, Table-Rows |
| 2 (Overlay) | `--shadow-e2` | Hover-Cards, Tooltips, Sticky-Header |
| 3 (Popover) | `--shadow-e3` | Dropdowns, Popover, Select-Menus |
| 4 (Modal) | `--shadow-e4` | Modals, Drawers, Dialoge |

---

## 7. Z-Index-Skala

Systematisches Z-Index-System — keine Magic Numbers.

| Token | Wert | Komponente |
|-------|------|-----------|
| `--z-base` | 1 | Standard-Content |
| `--z-dropdown` | 40 | Dropdown-Menus |
| `--z-sticky` | 50 | Sticky-Header, Sidebar |
| `--z-overlay` | 60 | Mobile-Nav-Overlay, Bottom-Nav |
| `--z-modal` | 70 | Modals, Dialoge |
| `--z-topbar` | 80 | Fixierte Topbar |
| `--z-toast` | 90 | Toast-Notifications |
| `--z-tooltip` | 100 | Tooltips (hochste Prioritat) |

---

## 8. Animationen und Transitions

### 8.1 Transition-Tokens

```css
--transition-fast:  120ms ease-out;  /* Micro-Interactions, Hover */
--transition-base:  200ms ease-out;  /* Standard-Transitions */
--transition-slow:  320ms ease-out;  /* Entrances, Page-Transitions */
```

### 8.2 Animations-Prinzipien

- **UI-Animationen < 300ms.** Längere Dauer nur fur Page-Entrance/Exit.
- **Buttons:active:** `transform: scale(0.97)` mit 160ms ease-out (Emil §Komponenten).
- **Nur `transform` + `opacity` animieren** — kein `width`, `height`, `top`, `left` (Emil §Performance).
- **CSS `transition` bevorzugen, nicht `@keyframes`** fur schnelle UI (Emil §CSS transform).
- **Hover auf Touch-Geraten gaten:** `@media (hover: hover) and (pointer: fine)` (Emil §Accessibility).
- **`prefers-reduced-motion` respektieren:** Transform-Animationen deaktivieren.
- **Enter/Exit asymmetrisch:** Enter 200ms ease-out, Exit 150ms ease-out (Emil §Duration).
- **Stagger:** 50ms Verzogerung zwischen List-Items bei Entrance (Slots, Suchergebnisse).
- **Popover/Datepicker:** `transform-origin` auf Trigger-Element setzen (Emil §Origin-Aware).
- **Slot-Entrance:** Start bei `scale(0.95) + opacity(0)`, nicht `scale(0)`.

### 8.3 Eingebaute Keyframe-Animationen

```css
/* Content-Entrance (Cards, Sektionen) */
.animate-slide-up    /* 220ms: translateY(8px) → 0, opacity 0→1 */
.animate-fade-in     /* 300ms: translateY(4px) → 0, opacity 0→1 */

/* Spinner */
.w2g-spinner         /* 600ms linear infinite rotation */
```

---

## 9. Komponenten-Bibliothek

### 9.1 Buttons

#### Varianten (CSS-Klassen-basiert)

| Variante | CSS-Klasse | Hintergrund | Text | Border | Verwendung |
|----------|-----------|-------------|------|--------|-----------|
| **Primary** | (Inline-Style) | `var(--color-accent)` | `var(--color-primary-dark)` | none | Haupt-CTA, "Jetzt buchen", "Registrieren" |
| **Secondary** | (Inline-Style) | `var(--color-primary)` | `#fff` | none | Sekundare Aktionen, "Zum Dashboard" |
| **Ghost** | (Inline-Style) | transparent | `var(--color-text-secondary)` | `var(--color-divider)` | Tertiare Aktionen, "Abbrechen" |
| **Danger Outline** | `.w2g-btn-danger` | `var(--color-danger-bg)` | `var(--color-danger)` | `var(--color-danger-border)` | Loschaktionen, "Account loschen" |
| **Danger Hover** | `.w2g-btn-danger:hover` | `var(--color-danger)` | `#fff` | `var(--color-danger)` | Danger-Hover-Zustand |

#### GroSSen

| GroSSe | Height | Padding X | Font Size | Border Radius |
|--------|--------|-----------|-----------|---------------|
| **sm** | 32px | 12px | 12px | `--radius-sm` (4px) |
| **md** (Default) | 38px | 16px | 13px | `--radius-sm` (4px) |
| **lg** | 44px | 20px | 14px | `--radius-sm` (4px) |
| **xl** | 48px | 24px | 15px | `--radius-sm` (4px) |

#### States

| State | Visuell |
|-------|---------|
| **Default** | Volle Farbe, kein Shadow |
| **Hover** | 5-10% dunkler (nur Desktop: `@media (hover: hover)`) |
| **Active** | `transform: scale(0.97)`, 160ms ease-out |
| **Focus** | `box-shadow: var(--shadow-focus)`, outline: none |
| **Disabled** | `opacity: 0.5`, `cursor: not-allowed`, kein Hover/Active |
| **Loading** | Spinner (16px) + Text, Button behalt Breite |

#### CTA-Intent-Regel (UI_UX_SKILL_REVIEW §4.5)

- **Maximal 1 CTA-Button pro Intent / View.**
- Kein "Jetzt buchen" + "Termin reservieren" nebeneinander.
- Ein "Jetzt buchen" im gesamten BookingWidget-Flow.
- Primar-CTA verwenden fur den wichtigsten Action-Pfad.
- Secondary-CTA fur "Abbrechen" / "Zuruck".

### 9.2 Formularelemente

#### Input

```css
/* Standard Input */
height: var(--control-height);  /* 38px */
padding: 0 12px;
font-size: 13px;
font-family: var(--font-body);
color: var(--color-text-primary);
background: var(--color-surface);
border: 1px solid var(--color-divider);
border-radius: var(--radius-sm);  /* 4px */
transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
```

| State | Border | Shadow |
|-------|--------|--------|
| Default | `var(--color-divider)` | none |
| Hover | `var(--color-primary)` (20% opacity) | none |
| Focus | `var(--color-primary)` | `var(--shadow-focus)` |
| Error | `var(--color-danger)` | `0 0 0 2px var(--color-danger-bg)` |
| Disabled | `var(--color-divider-subtle)` | none, `opacity: 0.6` |

#### Select

Wie Input, mit Chevron-Icon rechts (16px, `var(--color-text-tertiary)`).

#### Checkbox / Radio

- GroSSe: 16px x 16px
- Border: 1.5px solid `var(--color-divider)`
- Checked: `var(--color-primary)` Fill, weiSSer Haken
- Focus: `var(--shadow-focus)`
- Label: 13px, `var(--color-text-primary)`, 8px Abstand

#### Toggle / Switch

- GroSSe: 36px x 20px (Bahn), 16px x 16px (Knopf)
- Off: `var(--color-surface-sunken)` Bahn, `var(--color-surface)` Knopf
- On: `var(--color-accent)` Bahn, `var(--color-surface)` Knopf
- Transition: `var(--transition-fast)`

#### Datepicker

- Input wie Standard-Input + Kalender-Icon rechts
- Popover: `transform-origin` vom Trigger, `--shadow-e3`
- Ausgewahltes Datum: `var(--color-primary)` Hintergrund, weiSSe Schrift
- Heute: `var(--color-accent-light)` Hintergrund
- Deaktiviert: `var(--color-text-tertiary)`, kein Hover

### 9.3 Cards

#### Card-Komponente (React — `src/components/ui/card.jsx`)

```jsx
<Card>                   /* bg-surface, border-divider, rounded-md, shadow-card */
  <CardHeader>           /* flex flex-col gap-2, px-5 pt-5 pb-3 */
    <CardTitle>          /* text-sm font-bold, font-heading */
    <CardDescription>    /* text-xs text-secondary */
  </CardHeader>
  <CardContent>          /* px-5 pb-5 */
  <CardFooter>           /* flex, px-5 py-3, border-t */
</Card>
```

#### Card-Varianten (CSS-Klassen)

| Variante | Klasse | Shadow | Border | Hover |
|----------|--------|--------|--------|-------|
| **Standard** | `.w2g-card` | `--shadow-e1` | `--color-divider` | Shadow `--shadow-e2` |
| **Interaktiv** | `.w2g-card-interactive` | `--shadow-e1` | `--color-divider` | Shadow `--shadow-card-hover`, Border `--color-primary`, `translateY(-2px)` |
| **Erhoht** | `.w2g-card-elevated` | `--shadow-e2` | `--color-divider` | — |
| **Versunken** | `.w2g-card-sunken` | none | `--color-divider-subtle` | — |
| **Panel** | `.w2g-panel` | `--shadow-e1` | `--color-divider` | — |

#### Karten-Typen

| Typ | Beschreibung | GroSSe |
|-----|-------------|-------|
| **Vendor Card** | Marketplace-Karte mit Bild, Name, Kategorie, Bewertung | min-height 280px, Bild 180px |
| **Service Card** | Service-Karte mit Preis, Dauer, Beschreibung | min-height 120px |
| **KPI Card** | Dashboard-Metrik mit Wert, Label, Trend-Pfeil | min-height 100px, `scale(0.97)` on:active |
| **Booking Card** | Buchungs-Karte mit Datum, Status, Service | min-height 80px |

### 9.4 Tabellen

#### Spezifikation

- **Bibliothek:** TanStack Table (empfohlen fur Affiliate-Dashboard, Vendor-CRM)
- **Zeilenhohe:** `--table-row-height` (48px)
- **Header:** `font-size: 11px`, `font-weight: 600`, `color: var(--color-text-tertiary)`, `text-transform: uppercase`, `letter-spacing: 0.05em`, Hintergrund `var(--color-surface-sunken)`
- **Zelle:** `font-size: 13px`, `color: var(--color-text-primary)`, Padding 12px
- **Border:** Kein `border-t` + `border-b` auf jeder Row (Taste §4.9 Spec-Sheet-Pattern). Stattdessen: `border-b border-[var(--color-divider-subtle)]` nur unten.
- **Hover:** `background: var(--color-primary-muted)`
- **Sort:** Sortier-Icon (12px) neben Header-Text, aktive Spalte `color: var(--color-primary)`
- **Pagination:** Unter der Tabelle, zentriert, Page-Buttons 32x32px, `border-radius: var(--radius-sm)`

#### Responsive-Tabelle

- **Desktop:** Alle Spalten sichtbar
- **Tablet:** Spalten mit Priority < 2 ausblenden
- **Mobile:** Card-Layout statt Tabelle (Label: Wert-Paare)

### 9.5 Navigation

#### Top-Navigation (PublicNav — `src/components/layout/PublicNav.js`)

- **Hohe:** Desktop 72px (lg: 80px), Tablet/Mobile 64px
- **Position:** `fixed`, `z-index: 50`
- **Hintergrund:**
  - Startseite oben: `transparent`
  - Gescrollt / andere Seiten: `bg-white/95 backdrop-blur-md`
- **Logo:** 32-36px Hohe, links
- **Links:** 13px, `font-weight: 500`, `color: var(--color-text-secondary)`, aktive Seite `font-weight: 600`, aktiver Indikator: 2px Strich in `var(--color-accent)`
- **CTA-Button (Primary):** `var(--color-accent)` Hintergrund, 40px hoch, 13px bold
- **CTA-Button (Secondary, Login):** Text-only, 13px semibold
- **Mobile:** Hamburger-Menu, Slide-Down-Panel mit Links + CTA, 44x44px Touch-Target
- **Language-Switcher:** Pill-Buttons (DE/EN), 11px semibold, 28px hoch

#### Sidebar (PortalShell — `src/components/layout/PortalShell.js`)

- **Breite expanded:** 240px
- **Breite collapsed:** 64px
- **Position:** `fixed`, links, unter Topbar, `z-index: 50`
- **Hintergrund:** `var(--color-surface)`, `border-right: 1px solid var(--color-divider)`
- **Item expanded:** 40px min-height, Padding 10px 12px, Icons 18px, Text 13px medium
- **Item collapsed:** 40px min-height, Padding 10px 0, zentriert, nur Icon
- **Item aktiv:** `var(--color-primary)` Hintergrund, weiSSe Schrift
- **Item inaktiv:** `var(--color-text-secondary)`, Hover: `var(--color-surface-sunken)`
- **Badge:** Pill, `--radius-full`, 10px bold, aktiv: `rgba(255,255,255,0.2)` bg, inaktiv: `var(--color-danger-bg)` bg, `var(--color-danger)` Text
- **Collapse-Button:** Unten, 38px min-height, 12px medium Text
- **Storage-Key:** `sidebar_collapsed` (localStorage, default collapsed)

#### Bottom-Navigation (Mobile)

- **Hohe:** 72px + `env(safe-area-inset-bottom, 8px)`
- **Position:** `fixed`, unten, `z-index: 60`
- **Hintergrund:** `rgba(255,255,255,0.95)`, `backdrop-filter: blur(20px)`
- **Items:** Spalten gleichmaSSig verteilt, Icon 16px, Text 10px semibold
- **Aktiv:** `var(--color-primary)`, Inaktiv: `var(--color-text-tertiary)`
- **Max 5 Items.**

### 9.6 Overlays (Modals, Drawers, Dropdowns)

#### Modal

- **Breite:** max 560px (small), 720px (medium), 960px (large)
- **Padding:** 24px
- **Border-Radius:** `var(--radius-lg)` (8px)
- **Shadow:** `var(--shadow-modal)` (`--shadow-e4`)
- **Hintergrund:** `var(--color-surface)`
- **Overlay:** `rgba(12,29,46,0.4)`, `backdrop-filter: blur(4px)`, `z-index: var(--z-modal)`
- **Header:** 18px bold, `font-family: var(--font-heading)`, mit Close-Button (32x32px)
- **Footer:** Buttons rechtsbundig, `gap: 8px`
- **Animation:** Overlay fadeIn 200ms, Modal slideUp 220ms ease-out
- **Enter/Exit asymmetrisch:** Enter 200ms, Exit 150ms

#### Drawer

- **Breite:** 380px (Standard), 560px (wide)
- **Position:** Rechts fixiert, volle Hohe
- **Shadow:** `var(--shadow-e4)`
- **Header + Content + Footer** wie Modal
- **Animation:** `translateX(100%)` → `translateX(0)`, 250ms ease-out

#### Dropdown-Menu

- **Min-Breite:** 200px, Max-Breite: 320px
- **Border-Radius:** `var(--radius-lg)` (8px)
- **Shadow:** `var(--shadow-e3)`
- **Border:** `1px solid var(--color-divider)`
- **Items:** 36px hoch, 14px Text, Padding 8px 12px
- **Hover:** `var(--color-surface-sunken)`
- **Divider:** `1px solid var(--color-divider-subtle)`

### 9.7 Tabs

- **Container:** `border-b border-[var(--color-divider)]`
- **Tab:** 13px medium, `color: var(--color-text-secondary)`, Padding 8px 16px
- **Tab aktiv:** `color: var(--color-primary)`, `border-bottom: 2px solid var(--color-primary)`
- **Tab Hover:** `color: var(--color-primary)`
- **Abstand zwischen Tabs:** 0 (bündig)

### 9.8 Breadcrumbs

- **Schrift:** 12px, `color: var(--color-text-tertiary)`
- **Trenner:** `/` oder Chevron (12px)
- **Letztes Element (aktuell):** `color: var(--color-text-primary)`, kein Link
- **Hover:** `color: var(--color-primary)`

### 9.9 Pagination

- **Container:** `flex items-center gap-1`
- **Page-Button:** 32x32px, 13px medium, `border-radius: var(--radius-sm)`
- **Default:** `color: var(--color-text-secondary)`, `border: 1px solid var(--color-divider)`
- **Aktiv:** `background: var(--color-primary)`, `color: white`, `border-color: var(--color-primary)`
- **Hover:** `background: var(--color-surface-sunken)`
- **Disabled:** `opacity: 0.4`
- **Prev/Next:** Chevron-Icons (14px) in 32x32px Buttons

### 9.10 Badges und Tags

#### Badge-Komponente (React — `src/components/ui/badge.jsx`)

```jsx
<Badge variant="gold" size="default">Gold</Badge>
```

**Varianten:**
| Variante | Hintergrund | Text | Border |
|----------|-------------|------|--------|
| `default` | `var(--color-primary)` | `#fff` | none |
| `gold` | `var(--color-accent-muted)` | `var(--color-accent)` | `var(--color-accent)/20` |
| `success` | `var(--color-success-bg)` | `var(--color-success)` | `var(--color-success-border)` |
| `warning` | `var(--color-warning-bg)` | `var(--color-warning)` | `var(--color-warning-border)` |
| `danger` | `var(--color-danger-bg)` | `var(--color-danger)` | `var(--color-danger-border)` |
| `info` | `var(--color-info-bg)` | `var(--color-info)` | `var(--color-info-border)` |
| `outline` | transparent | `var(--color-text-secondary)` | `var(--color-divider)` |
| `muted` | `var(--color-surface-sunken)` | `var(--color-text-tertiary)` | none |

**GroSSen:**
| Name | Font Size | Padding X | Padding Y | Border Radius |
|------|-----------|-----------|-----------|---------------|
| `xs` | 9px | 6px | 2px | `--radius-xs` (3px) |
| `sm` | 10px | 8px | 2px | `--radius-xs` (3px) |
| `default` | 11px | 10px | 4px | `--radius-sm` (4px) |

#### Status-Badge (CSS-Klasse — `.w2g-status-badge`)

```css
.w2g-status-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 10px;
  font-size: 11px; font-weight: 600;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
```

Farben werden uber `--status-*` Custom Properties gesteuert (siehe Abschnitt 2.2).

### 9.11 Avatare

#### Avatar-Komponente (React — `src/components/ui/avatar.jsx`)

```jsx
<Avatar className="h-8 w-8">          /* Container, rounded-sm */
  <AvatarFallback>KG</AvatarFallback>  /* Fallback-Initialen, bg-primary, text-white */
</Avatar>
```

- **GroSSe:** 24px (xs), 28px (sm), 36px (md), 44px (lg), 56px (xl)
- **Border-Radius:** `var(--radius-sm)` (4px) — nicht rund
- **Fallback:** `var(--color-primary)` Hintergrund, weiSSe Schrift, 11px bold, `font-family: var(--font-heading)`

### 9.12 Separator

```jsx
<Separator />                          /* Horizontal: h-px, full width */
<Separator orientation="vertical" />   /* Vertikal: w-px, full height */
```

- **Farbe:** `var(--color-divider)`

### 9.13 Progress-Bar

```jsx
<Progress value={65} max={100} size="md" />
```

**GroSSen:**
| Name | Hohe |
|------|------|
| `xs` | 4px |
| `sm` | 6px |
| `md` | 8px (Default) |
| `lg` | 10px |

- **Bahn:** `var(--color-surface-sunken)`, `border-radius: var(--radius-full)`
- **Balken:** `var(--color-primary)`, Transition 500ms ease-out
- **Accessibility:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

### 9.14 Loading States

#### Skeleton-Loader

- **Form:** Rechteckig, `var(--color-surface-sunken)` Hintergrund, `border-radius: var(--radius-sm)`
- **Animation:** Pulsierend (opacity 0.5 ↔ 1.0, 1.5s ease-in-out infinite)
- **Patterns:**
  - **Card-Skeleton:** Block (Titel) + Block (Text) + Block (Button)
  - **Table-Skeleton:** 5 Zeilen mit variablen Spaltenbreiten
  - **Form-Skeleton:** Input-Blocke + Button-Block
  - **Slot-Skeleton (BookingWidget):** Grid von 4x3 Rechtecken

#### Spinner

```css
.w2g-spinner {
  width: 24px; height: 24px;
  border: 2px solid var(--color-divider);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

- **GroSSe:** 16px (inline, Button), 24px (Standard), 36px (Page-Load)
- **Farbe:** `var(--color-primary)` (kann uberschrieben werden)

### 9.15 Empty States

- **Icon:** 48px, `var(--color-text-tertiary)`, zentriert
- **Titel:** 16px, `font-weight: 600`, `color: var(--color-text-primary)`
- **Beschreibung:** 13px, `color: var(--color-text-secondary)`, `max-width: 360px`
- **Aktion:** Secondary-Button (z.B. "Filter zurucksetzen", "Ersten Vendor anlegen")
- **Padding:** 48px vertikal
- **Beispiele:**
  - "Keine Ergebnisse gefunden" + "Filter zurucksetzen"-Button
  - "Noch keine Buchungen" + "Zum Marktplatz"-Link
  - "Keine Transaktionen" + Ledger-Link

### 9.16 Error States

- **Inline-Error (Formular):** Rote Fehlermeldung unter dem betroffenen Feld, 11px, `color: var(--color-danger)`, Icon (AlertCircle, 12px) links
- **Page-Error (API-Fehler):** Error-Card mit Titel + Beschreibung + "Erneut versuchen"-Button
- **Toast-Error:** Siehe Toast-Sektion
- **Boundary-Error (React Error Boundary):** "Etwas ist schiefgelaufen" + Reload-Button

### 9.17 Toast / Notification

- **Position:** Bottom-Right (Desktop), Bottom-Center (Mobile)
- **Max-Breite:** 380px
- **Shadow:** `var(--shadow-e3)`
- **Border-Radius:** `var(--radius-md)` (6px)
- **Padding:** 12px 16px
- **Animation:** Slide-Up + Fade-In 220ms, Exit: Slide-Down + Fade-Out 150ms

**Varianten:**
| Typ | Hintergrund | Border | Icon |
|-----|-------------|--------|------|
| **Success** | `var(--color-success-bg)` | `var(--color-success-border)` | CheckCircle (16px), `var(--color-success)` |
| **Error** | `var(--color-danger-bg)` | `var(--color-danger-border)` | AlertCircle (16px), `var(--color-danger)` |
| **Warning** | `var(--color-warning-bg)` | `var(--color-warning-border)` | AlertTriangle (16px), `var(--color-warning)` |
| **Info** | `var(--color-info-bg)` | `var(--color-info-border)` | Info (16px), `var(--color-info)` |

---

## 10. Layout-System

### 10.1 Page Shell

```
┌──────────────────────────────────────────────┐
│  Topbar (fixed, 64px, z-80)                  │
├────────┬─────────────────────────────────────┤
│        │                                     │
│ Sidebar│  Content Area                       │
│ 240px  │  max-width: 1280px                  │
│ (64px  │  padding: 24px                      │
│  coll) │                                     │
│        │                                     │
├────────┴─────────────────────────────────────┤
│  Bottom Nav (Mobile, fixed, 72px, z-60)      │
└──────────────────────────────────────────────┘
```

### 10.2 Grid-System

- **Basis:** 12-Spalten-Grid (Tailwind `grid-cols-12`)
- **Gap:** 16px (Default), 24px (Page-Sektionen)
- **Breakpoints:**
  - **Mobile:** < 640px (sm)
  - **Tablet:** 640px - 1023px (md)
  - **Desktop:** >= 1024px (lg)
  - **Wide:** >= 1280px (xl)

### 10.3 Inhaltsbreiten

| Bereich | Max-Breite | Padding |
|---------|-----------|---------|
| **Content gesamt** | 1280px (+ 48px Padding) | 24px Desktop, 20px Tablet, 16px Mobile |
| **Text-Content (Landing)** | 720px | zentriert |
| **Form-Container** | 480px | zentriert |
| **Card-Grid** | 1280px | 24px |

### 10.4 Page-Scaffold

```jsx
<PageScaffold
  title="Seitentitel"
  subtitle="Optionale Beschreibung"
  actions={<Button>Primare Aktion</Button>}
  toolbar={<ToolbarRow search={...} filters={...} />}
  contentClassName="space-y-4"
>
  {children}
</PageScaffold>
```

- **Header-Card:** Linker farbiger Rand (4px `var(--color-primary)`), Titel + Subtitle + Actions
- **Toolbar:** Optional, unter dem Header
- **Content:** `space-y-4` (16px) vertikale Abstande

### 10.5 Footer (Public)

```css
.w2g-footer {
  background: var(--color-primary-dark);  /* #2D3748 */
  color: rgba(255,255,255,0.7);
}
```

- **Uberschriften:** 12px, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.1em`, `color: white`
- **Links:** 13px, `rgba(255,255,255,0.6)`, Hover: `white`
- **Padding:** 48px vertikal
- **Grid:** 4 Spalten Desktop, 2 Spalten Tablet, 1 Spalte Mobile

### 10.6 Glassmorphism

```css
.w2g-glass {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.3);
}
```

Verwendung: Topbar-Hintergrund, Mobile-Nav-Overlay, Bottom-Nav.

---

## 11. Iconografie

- **Bibliothek:** Lucide React (`lucide-react`)
- **Standard-GroSSe:** 16px (inline, Buttons), 18px (Sidebar), 20px (KPI-Cards), 24px (Hero)
- **Stroke-Width:** 2px (Default bei Lucide)
- **Farbe:** `currentColor` (erbt vom Container)

---

## 12. Accessibility-Anforderungen

| Anforderung | Wert | Prufung |
|-------------|------|---------|
| **Kontrast Body-Text** | >= 4.5:1 (WCAG AA) | Lighthouse |
| **Kontrast Large Text** | >= 3:1 (WCAG AA) | Lighthouse |
| **Focus-Styles** | `var(--shadow-focus)` auf allen interaktiven Elementen | Manuell |
| **Keyboard-Navigation** | Tab-Reihenfolge = visuelle Reihenfolge | Manuell |
| **Touch-Targets Mobile** | Min 44x44px | Manuell |
| **prefers-reduced-motion** | Transform-Animationen deaktivieren | CSS-Check |
| **Hover auf Touch** | `@media (hover: hover) and (pointer: fine)` gaten | Code-Review |
| **Screen-Reader** | ARIA-Labels, Roles, States | axe DevTools |

---

## 13. Komponenten-Token-Tabelle (CSS Custom Properties)

### 13.1 Farben

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--color-primary` | `#1A202C` | Primarfarbe (Deep Navy) |
| `--color-primary-light` | `#2D3748` | Primarfarbe hell |
| `--color-primary-dark` | `#2D3748` | Primarfarbe dunkel |
| `--color-primary-muted` | `rgba(26,32,44,0.05)` | Primarfarbe gedampft |
| `--color-accent` | `#F59E0B` | Akzentfarbe (Bookando Orange) |
| `--color-accent-hover` | `#D97706` | Akzentfarbe Hover |
| `--color-accent-light` | `#FEF3C7` | Akzentfarbe hell |
| `--color-accent-muted` | `rgba(245,158,11,0.10)` | Akzentfarbe gedampft |
| `--color-accent-subtle` | `rgba(245,158,11,0.05)` | Akzentfarbe subtil |
| `--color-accent-teal` | `#0D9488` | Sekundarer Akzent (Teal) |
| `--color-accent-pink` | `#DB2777` | Tertiarer Akzent (Pink) |
| `--color-shell-bg` | `#F8FAFC` | Seitenhintergrund |
| `--color-surface` | `#ffffff` | Oberflache |
| `--color-surface-elevated` | `#FAFBFC` | Erhohte Oberflache |
| `--color-surface-sunken` | `#F1F5F9` | Versenkte Oberflache |
| `--color-divider` | `#E2E8F0` | Trennlinie |
| `--color-divider-subtle` | `#F1F5F9` | Leichte Trennlinie |
| `--color-text-primary` | `#0F172A` | Primartext |
| `--color-text-secondary` | `#475569` | Sekundartext |
| `--color-text-tertiary` | `#94A3B8` | Tertiartext |
| `--color-success` | `#059669` | Erfolg |
| `--color-success-bg` | `#ECFDF5` | Erfolg Hintergrund |
| `--color-success-border` | `#A7F3D0` | Erfolg Border |
| `--color-warning` | `#D97706` | Warnung |
| `--color-warning-bg` | `#FFFBEB` | Warnung Hintergrund |
| `--color-warning-border` | `#FDE68A` | Warnung Border |
| `--color-danger` | `#DC2626` | Fehler |
| `--color-danger-bg` | `#FEF2F2` | Fehler Hintergrund |
| `--color-danger-border` | `#FECACA` | Fehler Border |
| `--color-info` | `#2563EB` | Information |
| `--color-info-bg` | `#EFF6FF` | Information Hintergrund |
| `--color-info-border` | `#BFDBFE` | Information Border |

### 13.2 Layout

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--shell-max-width` | `1280px` | Maximale Content-Breite |
| `--page-gutter` | `24px` | Seitenrand Desktop |
| `--page-gutter-tablet` | `20px` | Seitenrand Tablet |
| `--page-gutter-mobile` | `16px` | Seitenrand Mobile |
| `--topbar-height` | `64px` | Topbar-Hohe Desktop |
| `--topbar-height-mobile` | `56px` | Topbar-Hohe Mobile |
| `--toolbar-height` | `52px` | Toolbar-Hohe |
| `--control-height` | `38px` | Input/Select-Hohe |
| `--table-row-height` | `48px` | Tabellenzeilen-Hohe |
| `--sidebar-width` | `260px` | Sidebar-Breite (Token) |
| `--spacing-xs` | `4px` | Abstand xs |
| `--spacing-sm` | `8px` | Abstand sm |
| `--spacing-md` | `16px` | Abstand md |
| `--spacing-lg` | `24px` | Abstand lg |
| `--spacing-xl` | `32px` | Abstand xl |
| `--spacing-2xl` | `48px` | Abstand 2xl |
| `--spacing-3xl` | `64px` | Abstand 3xl |

### 13.3 Schatten

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--shadow-e0` | `none` | Elevation 0 |
| `--shadow-e1` | `0 1px 2px rgba(0,0,0,0.04)` | Elevation 1 |
| `--shadow-e2` | `0 2px 8px rgba(0,0,0,0.06)` | Elevation 2 |
| `--shadow-e3` | `0 8px 24px rgba(0,0,0,0.08)` | Elevation 3 |
| `--shadow-e4` | `0 16px 48px rgba(0,0,0,0.10)` | Elevation 4 |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)` | Standard-Karte |
| `--shadow-card-hover` | `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` | Karte Hover |
| `--shadow-glass` | `0 4px 16px rgba(0,0,0,0.06)` | Glass-Panel |
| `--shadow-elevated` | `var(--shadow-e2)` | Alias: erhoht |
| `--shadow-modal` | `var(--shadow-e4)` | Alias: Modal |
| `--shadow-focus` | `0 0 0 2px var(--color-primary), 0 0 0 4px rgba(26,32,44,0.12)` | Focus-Ring |
| `--shadow-inset` | `inset 0 1px 2px rgba(0,0,0,0.04)` | Innen-Schatten |

### 13.4 Radii

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--radius-xs` | `3px` | Radius xs |
| `--radius-sm` | `4px` | Radius sm (Buttons, Inputs) |
| `--radius-md` | `6px` | Radius md (Cards) |
| `--radius-lg` | `8px` | Radius lg (Modals) |
| `--radius-xl` | `8px` | Radius xl (Alias) |
| `--radius-full` | `9999px` | Radius voll (Pills) |

### 13.5 Typografie

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--font-heading` | `'Cabinet Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif` | Uberschrift-Font |
| `--font-body` | `'IBM Plex Sans', 'Inter', system-ui, sans-serif` | Body-Font |
| `--font-mono` | `'JetBrains Mono', 'SF Mono', 'Fira Code', monospace` | Mono-Font |

### 13.6 Transition

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--transition-fast` | `120ms ease-out` | Micro-Interactions |
| `--transition-base` | `200ms ease-out` | Standard |
| `--transition-slow` | `320ms ease-out` | Page-Transitions |

### 13.7 Z-Index

| CSS Custom Property | Wert | Beschreibung |
|---------------------|------|-------------|
| `--z-base` | `1` | Content |
| `--z-dropdown` | `40` | Dropdowns |
| `--z-sticky` | `50` | Sticky/Sidebar |
| `--z-overlay` | `60` | Overlay |
| `--z-modal` | `70` | Modals |
| `--z-topbar` | `80` | Topbar |
| `--z-toast` | `90` | Toasts |
| `--z-tooltip` | `100` | Tooltips |

### 13.8 Status

| CSS Custom Property | Wert |
|---------------------|------|
| `--status-new-bg` | `#EFF6FF` |
| `--status-new-text` | `#1E40AF` |
| `--status-new-border` | `#BFDBFE` |
| `--status-active-bg` | `#F0FDF4` |
| `--status-active-text` | `#15803D` |
| `--status-active-border` | `#A7F3D0` |
| `--status-warning-bg` | `#FFFBEB` |
| `--status-warning-text` | `#B45309` |
| `--status-warning-border` | `#FDE68A` |
| `--status-danger-bg` | `#FEF2F2` |
| `--status-danger-text` | `#B91C1C` |
| `--status-danger-border` | `#FECACA` |
| `--status-neutral-bg` | `#F8FAFC` |
| `--status-neutral-text` | `#475569` |
| `--status-neutral-border` | `#E2E8F0` |

---

## 14. Bekannte Abweichungen / Korrekturbedarf

1. **tailwind.config.js ist veraltet.** Enthalt `primary: #113655` (sollte `#1A202C` sein) und `accent: #C49B3E` (sollte `#F59E0B` sein). CSS Custom Properties sind die kanonische Quelle. Tailwind-Config sollte mit den CSS-Tokens synchronisiert werden.
2. **Shadow-Farbton-Adaption:** Aktuell verwenden Schatten `rgba(0,0,0,x)` (neutralschwarz). Laut UI_UX_SKILL_REVIEW §4.4 sollten Schatten an den Background-Hue angepasst werden. Fur Deep-Navy (`#1A202C`) wurden die Schatten leicht blaustichig sein (z.B. `rgba(26,32,44,x)`). Dies ist ein geplanter Polish-Schritt.
3. **Button-Komponente fehlt.** Buttons werden derzeit mit Inline-Styles und Utility-Klassen gebaut. Eine zentrale `<Button>`-Komponente (analog zu Badge/Card) mit Varianten `primary`, `secondary`, `ghost`, `danger` und GroSSen `sm`, `md`, `lg` sollte erstellt werden.
4. **Formularelemente fehlen als Komponenten.** Input, Select, Checkbox, Toggle sollten als wiederverwendbare Komponenten mit Error-State und Label gebaut werden.
5. **Toast/Notification-System fehlt.** Es gibt keine zentrale Toast-Infrastruktur. Empfohlen: `sonner` (Emil §Sonner Principles).

---

## 15. Referenzen

- **CSS-Token-Quelle:** `/workspace/customers/fixdigital/bookando/bookando-de/src/index.css` (Zeilen 7-142)
- **Tailwind-Konfiguration:** `/workspace/customers/fixdigital/bookando/bookando-de/tailwind.config.js` (abw. Werte)
- **UI-Komponenten:** `/workspace/customers/fixdigital/bookando/bookando-de/src/components/ui/` (Badge, Card, Avatar, Separator, Progress)
- **Layout-Komponenten:** `/workspace/customers/fixdigital/bookando/bookando-de/src/components/layout/` (PortalShell, PublicNav, PageScaffold)
- **UI/UX-Review:** `/workspace/customers/fixdigital/bookando/bookando-de/docs/UI_UX_SKILL_REVIEW.md`
- **Unternehmensdaten:** `/workspace/customers/fixdigital/bookando/bookando-de/src/config/company.js`
- **Brand-Meta:** `/workspace/customers/fixdigital/bookando/bookando-de/public/index.html`
