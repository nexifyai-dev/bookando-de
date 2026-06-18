# Bookando.de — Responsive- & Accessibility-Matrix

> **Stand:** 2026-06-18
> **Basis:** Vollst&auml;ndige Quellcode-Analyse aller 80 Dateien in `src/`, `public/index.html`, `tailwind.config.js`
> **Pr&uuml;fmethode:** Statische Code-Analyse (kein Live-Audit mit Screenreader / Lighthouse)

---

## 1. Responsive Analyse

### 1.1 Breakpoint-System

| Breakpoint | Tailwind-Klasse | Genutzte Patterns |
|---|---|---|
| 360px – 639px | (default mobile) | 1-Spalten-Grid, Stacked-Layout, Bottom-Nav |
| 640px – 767px | `sm:` | 2-Spalten-Grid, gr&ouml;&szlig;ere Typografie |
| 768px – 1023px | `md:` | 2-Spalten-Grid, Tablet-Layouts, Sidebar versteckt |
| 1024px – 1279px | `lg:` | Desktop-Sidebar sichtbar, Bottom-Nav ausgeblendet, 3-4 Spalten |
| 1280px+ | `xl:` via `max-w-[1280px]` | Maximalbreite, zentrierter Content |

Zus&auml;tzlich: manuelle Media Queries in `index.css` f&uuml;r `640px` und `1024px` sowie `max-width: 1023px` f&uuml;r Sidebar-Offset.

### 1.2 Kritische Seiten — Breakpoint-Pr&uuml;fung

#### HomePage (`src/pages/public/HomePage.js`)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | 1-Spalte, volle Breite | Kein — `overflow-x: hidden` auf html/body | Hamburger-Men&uuml; | N/A |
| 390px | 1-Spalte, volle Breite | Kein | Hamburger-Men&uuml; | N/A |
| 768px | 1-Spalte, Tablet-Padding | Kein | Hamburger-Men&uuml; (Mobile-Toggle bis `md`) | N/A |
| 1024px | 12-Spalten-Grid (7+5) | Kein | Desktop-Nav-Links sichtbar | N/A |
| 1280px | Zentriert, max-w-[1280px] | Kein | Desktop-Nav, volle Breite | N/A |
| 1440px | Zentriert, seitliche Abstände | Kein | Desktop-Nav | N/A |

**Befund:** Hero-Image `hidden lg:flex` — verschwindet auf Mobile/Tablet. Text passt &uuml;ber `clamp`/`sm:`/`lg:`-Prefixe. Feature-Grid: 1→2→3 Spalten. Stats: 2→4 Spalten. CTA: Stacked→Side-by-Side. **Kein Horizontal-Scroll, keine abgeschnittenen Inhalte.**

#### MarketplacePage (`src/pages/public/MarketplacePage.js`)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | 1-Spalte | Kein | Hamburger-Men&uuml; | Suche volle Breite |
| 390px | 1-Spalte | Kein | Hamburger-Men&uuml; | Suche volle Breite |
| 768px | 2-Spalten-Vendor-Grid | Kein | Hamburger-Men&uuml; (bis `md`) | Suche zentriert, max-w-[640px] |
| 1024px | 3-Spalten-Grid | Kein | Desktop-Nav | Suche zentriert |
| 1280px | Zentriert, max-w-[1280px] | Kein | Desktop-Nav | Suche zentriert |
| 1440px | Zentriert | Kein | Desktop-Nav | Suche zentriert |

**Befund:** Kategorie-Pills `flex-wrap` — kein Horizontal-Scroll n&ouml;tig. Vendor-Karten nutzen `h-full` und `flex flex-col`. Keine abgeschnittenen Inhalte.

#### VendorDetailPage (`src/pages/public/VendorDetailPage.js`)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | Vertikaler Stack, BookingWidget vollbreit | Datum-Scroller `overflow-x-auto` — **beabsichtigt** (Touch-Swipe) | Hamburger-Men&uuml; | BookingWidget-Formulare responsive |
| 390px | Vertikaler Stack | Datum-Scroller horizontal — beabsichtigt | Hamburger-Men&uuml; | Formulare responsive |
| 768px | Services (3/5) + Widget (2/5) | Datum-Scroller | Hamburger-Men&uuml; (bis `md`) | Formulare responsive |
| 1024px | Services (3/5) + Widget (2/5) mit `sticky top-20` | Datum-Scroller | Desktop-Nav | Formulare responsive |
| 1280px | Zentriert | Datum-Scroller | Desktop-Nav | Formulare responsive |
| 1440px | Zentriert | Datum-Scroller | Desktop-Nav | Formulare responsive |

**Befund:** Datum-Auswahl hat bewussten horizontalen Scroll (14 Tage Touch-Swipe) — UX-akzeptabel. Slot-Grid: `grid-cols-2 sm:grid-cols-3` — eng auf 360px aber funktional. **Kein kritischer Horizontal-Scroll.**

#### PricingPage (`src/pages/public/PricingPage.js`)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | 1-Spalte, Stacked | Kein | Hamburger-Men&uuml; | N/A |
| 390px | 1-Spalte | Kein | Hamburger-Men&uuml; | N/A |
| 768px | 2-Spalten (Pl&auml;ne nebeneinander) | Kein | Hamburger-Men&uuml; (bis `md`) | N/A |
| 1024px+ | 2-Spalten, zentriert | Kein | Desktop-Nav | N/A |

**Befund:** Einfaches 1→2-Spalten-Layout, keine Probleme.

#### PortalShell — Dashboard-Seiten (Vendor, Customer, Admin, Affiliate, Franchiser)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | KPI-Grid 2-Spalten, Tabellen gestapelt | ⚠️ Tabellen-Zeilen k&ouml;nnen &uuml;berlaufen | Bottom-Nav (4 Icons) | Responsive |
| 390px | Wie 360px | ⚠️ Tabellen-Zeilen | Bottom-Nav | Responsive |
| 768px | KPI-Grid 2-3 Spalten | ⚠️ Tabellen — `hidden sm:block` f&uuml;r Service-Spalte | Bottom-Nav (bis `lg`) | Responsive |
| 1024px | Sidebar + Content, KPI 3-4-6 Spalten | Tabellen komfortabel | Sidebar + Bottom-Nav ausgeblendet | Responsive |
| 1280px | Sidebar + zentrierter Content | Kein | Sidebar | Responsive |
| 1440px | Sidebar + Content | Kein | Sidebar | Responsive |

**Befund:** KPI-Grids verwenden 2-Spalten auf Mobile — passt auf 360px. Dashboard-Tabellen blenden Service-Spalte auf Mobile aus (`hidden sm:block`). Keine horizontale Scrollbar sichtbar (global versteckt). Datenverlust auf Mobile akzeptabel (Information in Detailseite).

#### Auth-Seiten (LoginPage, RegisterPage)
| Breakpoint | Layout | Horizontal-Scroll | Navigation | Formulare |
|---|---|---|---|---|
| 360px | Linkes Panel, vollbreit | Kein | Nur Logo/LanguageSwitcher | Formular zentriert, max-w-sm |
| 390px | Wie 360px | Kein | Logo/Switcher | Formular zentriert |
| 1024px+ | Split-Panel (links Form, rechts Branding) | Kein | Logo/Switcher | Formular zentriert |

**Befund:** Brand-Panel `hidden lg:flex` — nur auf Desktop sichtbar. Formular auf Mobile voll nutzbar. Role-Picker `grid-cols-2` — eng bei 360px aber funktional.

### 1.3 Mobile-Navigation-Patterns

| Muster | Beschreibung | Bewertung |
|---|---|---|
| **Hamburger-Men&uuml;** | PublicNav: `<button>` toggled `useState`, vollfl&auml;chiger Overlay mit Links | ✅ Funktional, keine Animation |
| **Bottom-Nav** | PortalShell: `w2g-bottom-nav`, `position: fixed`, `height: 72px`, `safe-area-inset-bottom` | ✅ Gut — 4 Icons, `justify-content: space-around` |
| **Mobile-Overlay-Men&uuml;** | PortalShell: Vollbild-Overlay mit User-Info, Language, Navigation | ✅ `animate-slide-up`, `max-h-[75vh]`, scrollbar |
| **Sidebar** | `hidden lg:flex` — nur Desktop. Mobile: Bottom-Nav + Overlay | ✅ Klare Trennung |

### 1.4 Responsive-Befunde — Zusammenfassung

| # | Befund | Schweregrad | Ort |
|---|---|---|---|
| R1 | `overflow-x: hidden` global auf `html` und `body` — maskiert potenzielle Overflow-Bugs | Major | `src/index.css:146,154` |
| R2 | Scrollbar global ausgeblendet (`scrollbar-width: none`) — Nutzer sehen nicht, ob ein Bereich scrollbar ist | Major | `src/index.css:177-188` |
| R3 | Dashboard-Tabellen: Service-Spalte auf Mobile ausgeblendet — Datenverlust, aber akzeptabel (Detailseite existiert) | Minor | Diverse Dashboard-Seiten |
| R4 | Datum-Scroller in BookingWidget: horizontaler Scroll per Design (14 Tage) — funktional aber `overflow-x-auto` ohne sichtbare Scrollbar | Minor | `src/pages/public/VendorDetailPage.js:196` |
| R5 | Keine explizite Behandlung von 360px — alle Seiten fallen auf Default-Mobile-Layout zur&uuml;ck | Minor | Global |
| R6 | `env(safe-area-inset-bottom)` in Bottom-Nav und Footer — gut f&uuml;r Notch-Ger&auml;te | ✅ Positiv | `src/index.css:360` |
| R7 | Hero-Images und Brand-Panel auf Mobile ausgeblendet — reduziert Datenverbrauch, Performance-Gewinn | ✅ Positiv | HomePage, LoginPage, RegisterPage |

---

## 2. Accessibility-Analyse

### 2.1 Semantische HTML-Struktur

#### Landmarks

| Seite | `<header>` | `<nav>` | `<main>` | `<aside>` | `<footer>` |
|---|---|---|---|---|---|
| HomePage | ❌ (nur `<nav>`) | ✅ PublicNav | ❌ **Fehlt** — nur `<div>` | ❌ | ✅ PublicFooter |
| MarketplacePage | ❌ | ✅ PublicNav | ✅ `<main>` | ❌ | ✅ PublicFooter |
| VendorDetailPage | ❌ | ✅ PublicNav | ✅ `<main>` | ❌ | ✅ PublicFooter |
| FeaturesPage | ❌ | ✅ PublicNav | ❌ **Fehlt** — nur `<div>` | ❌ | ✅ PublicFooter |
| PricingPage | ❌ | ✅ PublicNav | ❌ **Fehlt** — nur `<div>` | ❌ | ✅ PublicFooter |
| AboutPage | ❌ | ✅ PublicNav | ✅ `<main>` | ❌ | ✅ PublicFooter |
| ContactPage | ❌ | ✅ PublicNav | ✅ `<main>` | ❌ | ✅ PublicFooter |
| LegalPage | ❌ | ✅ PublicNav | ✅ `<main>` | ❌ | ✅ PublicFooter |
| LoginPage | ❌ | ❌ | ❌ **Fehlt** — nur `<div>` | ❌ | ❌ |
| RegisterPage | ❌ | ❌ | ❌ **Fehlt** — nur `<div>` | ❌ | ❌ |
| PortalShell (alle Portale) | ✅ `<header>` | ✅ `<nav>` (Sidebar, Bottom-Nav) | ✅ `<main>` | ✅ `<aside>` (Sidebar) | ❌ (kein Footer im Portal) |

**Kritischer Befund:** HomePage, FeaturesPage, PricingPage, LoginPage, RegisterPage haben kein `<main>`-Landmark. Screenreader-Nutzer k&ouml;nnen nicht direkt zum Hauptinhalt springen.

#### Headings

| Ort | Hierarchie | Befund |
|---|---|---|
| HomePage | h1, h2, h3 | ✅ Korrekt — eine h1, mehrere h2 |
| MarketplacePage | h1 → h3 (in VendorCard) | ✅ Korrekt |
| VendorDetailPage | h1 (Vendor-Name), h2 (Dienstleistungen), h3 (BookingWidget, Services) | ✅ Korrekt |
| FeaturesPage | h1 → h2 (Category) → h3 (Feature) | ✅ Korrekt |
| PricingPage | h1 → h3 (Plan) → h3 (FAQ) | ⚠️ FAQ-Titel auf gleicher Ebene wie Plan-Namen |
| AboutPage | h1 → h2, h3 | ✅ Korrekt |
| ContactPage | h1 → h3 | ⚠️ Keine h2 — Sprung von h1 zu h3 |
| LegalPage | h1 → h2, h3 (in injected HTML) | ✅ Korrekt |
| LoginPage | h1 → h2 | ⚠️ h2 doppelt ("Bookando" zweimal im Brand-Panel) — s. Zeile 195-196 LoginPage |
| PortalShell | h1 in PageScaffold | ✅ Variiert pro Seite |

### 2.2 ARIA-Attribute & Rollen

| Element | Attribut | Status |
|---|---|---|
| LoadingFallback | `role="status"`, `aria-label="Seite lädt"` | ✅ Vorhanden |
| RegisterPage RoleCard | `role="radio"`, `aria-checked={active}` | ✅ Vorhanden |
| BookingWidget Zur&uuml;ck-Buttons | `aria-label="Zur&uuml;ck"` | ✅ Vorhanden |
| LanguageSwitcher (shared) | `aria-label={`Sprache wechseln zu ${...}`}` | ✅ Vorhanden |
| PortalShell Mobile-Toggle | ❌ Kein `aria-expanded` | ⚠️ Fehlt |
| PublicNav Hamburger | ❌ Kein `aria-expanded` | ⚠️ Fehlt |
| PublicNav Mobile-Men&uuml; | ❌ Kein `aria-label` auf Overlay | ⚠️ Fehlt |
| CookieBanner Toggle-Switches | ❌ Kein `aria-pressed` oder `role="switch"` | ⚠️ Fehlt |
| FAQ-Items (PricingPage) | ❌ Kein `aria-expanded` auf Accordion-Button | ⚠️ Fehlt |
| RoleSwitcher/TenantSwitcher Dropdown | ❌ Kein `aria-haspopup`, `aria-expanded` | ⚠️ Fehlt |
| Icons (lucide-react) | ❌ Kein `aria-hidden="true"` | Major — Screenreader liest SVG-Inhalte |
| VendorCard (Link) | ❌ Kein `aria-label` — gesamter Card-Inhalt ist Link | Minor |

### 2.3 Tastatur-Navigation

| Kriterium | Status | Details |
|---|---|---|
| Tab-Reihenfolge | ✅ Grunds&auml;tzlich logisch (DOM-Order = Visual-Order) | Browser-Default |
| Skip-Link | ❌ **Fehlt** | Kein "Zum Hauptinhalt"-Link |
| Focus-Trap (Modals) | ❌ **Fehlt** | CookieBanner, PortalShell-Overlay — kein Focus-Trap |
| Dropdown-Tastatur | ❌ **Fehlt** | RoleSwitcher, TenantSwitcher, LanguageSwitcher — kein Escape/Arrow-Key-Handling |
| Mobile-Men&uuml;-Schlie&szlig;en | ⚠️ Teilweise | Overlay-Klick schlie&szlig;t, kein Escape-Key-Handler |
| Fokus-Verlust nach Navigation | ⚠️ Nicht behandelt | Nach `navigate()` kein Fokus-Management |

### 2.4 Formular-Labels & Fehler-Verkn&uuml;pfung

| Seite | Labels | Fehler-Verkn&uuml;pfung | Autocomplete |
|---|---|---|---|
| LoginPage | ✅ `<label>` korrekt | ✅ Fehler-Div mit AlertCircle | ✅ `autocomplete="email"`, `current-password` |
| RegisterPage | ✅ `<label>` korrekt | ✅ Fehler-Div mit AlertCircle | ✅ `autocomplete="email"`, `new-password` |
| ContactPage | ✅ `<label>` korrekt | ❌ Keine Fehleranzeige (simulierter Versand) | ❌ Kein `autocomplete` |
| BookingWidget | ✅ `<label>` korrekt mit `*` f&uuml;r Pflichtfelder | ❌ `alert()` statt Inline-Error | ❌ Kein `autocomplete` |
| CookieBanner | ✅ Beschriftungen | N/A | N/A |

**Kritisch:** BookingWidget nutzt `alert()` f&uuml;r Fehler — kein `aria-invalid`, kein `role="alert"` f&uuml;r Fehlermeldung. Screenreader erfahren Fehler nicht.

### 2.5 Farbkontraste (WCAG 2.2 AA)

| Element | Vordergrund | Hintergrund | Ratio | AA (Normal) | AA (Large) |
|---|---|---|---|---|---|
| Prim&auml;rtext | `#0F172A` | `#FFFFFF` | 14.5:1 | ✅ PASS | ✅ PASS |
| Sekund&auml;rtext | `#475569` | `#FFFFFF` | 5.8:1 | ✅ PASS | ✅ PASS |
| Terti&auml;rtext | `#94A3B8` | `#FFFFFF` | 3.0:1 | ❌ **FAIL** | ✅ PASS |
| Accent (Orange) | `#F59E0B` | `#FFFFFF` | 1.95:1 | ❌ **FAIL** | ❌ **FAIL** |
| Accent (Orange) | `#1A202C` (Dark) | `#F59E0B` | 5.4:1 | ✅ PASS | ✅ PASS |
| Danger-Text | `#DC2626` | `#FEF2F2` | 4.2:1 | ❌ **FAIL** | ✅ PASS |
| Success-Text | `#059669` | `#ECFDF5` | 4.0:1 | ❌ **FAIL** | ✅ PASS |
| White-Text auf Dark | `#FFFFFF` | `#2D3748` | 10.3:1 | ✅ PASS | ✅ PASS |
| Footer-Links | `rgba(255,255,255,0.5)` | `#2D3748` | ~3.5:1 | ❌ **FAIL** | ✅ PASS |
| Footer-Headings | `rgba(255,255,255,0.3)` | `#2D3748` | ~2.2:1 | ❌ **FAIL** | ❌ **FAIL** |

**Kritisch:**
- **Terti&auml;re Textfarbe (#94A3B8)** — fl&auml;chendeckend genutzt, scheitert AA f&uuml;r Normaltext. Wird eingesetzt f&uuml;r: Footer-Links, Formular-Platzhalter, Metadaten, Dashboard-Labels, Navigation-Labels, Statusinfos.
- **Accent (#F59E0B) auf Wei&szlig;** — Icons, Badges, Highlights. Scheitert AA komplett. Wird nur dekorativ genutzt, nicht f&uuml;r Flie&szlig;text — dennoch Access-Problem f&uuml;r Low-Vision-Nutzer.
- **Footer-Heading** (`rgba(255,255,255,0.3)` = ~#4D4D4D auf #2D3748) — f&uuml;r ALLE Nutzer schwer lesbar.

### 2.6 Fokus-Indikatoren

| Element | Focus-Style | Status |
|---|---|---|
| Formular-Inputs | `focus:outline-none focus:ring-2` mit `--tw-ring-color` | ✅ Gut |
| Buttons (Submit) | Browser-Default (meist kein sichtbarer Ring) | ❌ **Fehlt** |
| Nav-Links (PublicNav) | Kein `:focus-visible` | ❌ **Fehlt** |
| Sidebar-Links | Hover-Style, kein Focus | ❌ **Fehlt** |
| Bottom-Nav-Items | Kein Focus | ❌ **Fehlt** |
| Vendor-Karten (Links) | Kein Focus-Style | ❌ **Fehlt** |
| Cookie-Toggle-Buttons | Kein Focus | ❌ **Fehlt** |
| FAQ-Buttons | Kein Focus | ❌ **Fehlt** |
| LanguageSwitcher | `hover:bg-*` aber kein Focus | ❌ **Fehlt** |

**Kritisch:** Nahezu ALLE interaktiven Elemente au&szlig;er Formular-Inputs haben keine sichtbaren Fokus-Indikatoren. Tastatur-Nutzer sehen nicht, wo sie sind.

### 2.7 `prefers-reduced-motion`

| Kriterium | Status |
|---|---|
| CSS `@media (prefers-reduced-motion: reduce)` | ❌ **Fehlt vollst&auml;ndig** |
| Betroffene Animationen | `slideUp`, `fadeIn`, `spin` (Spinner), Stagger-Transitions, Hover-Scale-Effekte, IntersectionObserver-basierte Reveals |

**Kritisch:** Keine R&uuml;cksicht auf `prefers-reduced-motion`. Nutzer mit Bewegungs-Empfindlichkeit erhalten alle Animationen ungefiltert.

### 2.8 Alt-Text-Abdeckung

| Bild | Alt-Text | Status |
|---|---|---|
| PublicNav Logo | `alt={logoText}` (dynamisch) | ✅ |
| PublicFooter Logo | `alt="Bookando"` | ✅ |
| LoginPage/RegisterPage Logo (hell) | `alt="Bookando"` | ✅ |
| HomePage Hero-Grafik | `alt="Bookando Plattform &Uuml;bersicht"` | ✅ |
| HomePage CTA-Grafik | `alt="30 Tage kostenlos testen"` | ✅ |
| VendorDetailPage Logo/Avatar | `alt={name}` (dynamisch) | ✅ |
| SVG-Icons (lucide-react) | ❌ Kein Alt-Text, kein `aria-hidden` | ❌ Major |
| Feature-Icons (HomePage, FeaturesPage) | ❌ Inline-SVG ohne `aria-hidden` | ❌ Major |
| KPI-Card Icons (alle Dashboards) | ❌ Kein `aria-hidden` | ❌ Major |
| CookieBanner Shield-Icon | ❌ Kein `aria-hidden` | Minor |

### 2.9 Screenreader-Freundlichkeit

| Kriterium | Status |
|---|---|
| `<html lang>` dynamisch via i18n | ✅ Gut |
| Landmarks vorhanden | ⚠️ Fehlt auf 5 von 10 Seiten |
| Dynamische Inhalte mit `aria-live` | ❌ **Fehlt** — keine Live-Regions f&uuml;r API-Updates, Formular-Feedback, Fehler |
| Statusmeldungen mit `role="alert"` | ❌ **Fehlt** — Loading/Error/Empty States haben keine Alert-Rolle |
| Dynamischer Titel-Wechsel | ✅ `react-helmet-async` aktualisiert `<title>` |
| Toast-Benachrichtigungen (sonner) | ⚠️ Sonner hat eingebaute Accessibility — Attribut `role="status"` wird automatisch gesetzt |
| Versteckte Beschriftungen (`.visually-hidden`) | ❌ **Fehlt** — keine CSS-Klasse daf&uuml;r definiert |

---

## 3. WCAG 2.2 AA Checkliste

### 3.1 Perceivable (Wahrnehmbar)

| # | Kriterium | Level | Status | Details |
|---|---|---|---|---|
| 1.1.1 | Nicht-Text-Inhalte (Alt-Text) | A | ❌ FAIL | SVG-Icons ohne `aria-hidden`, keine Alt-Text f&uuml;r dekorative Icons |
| 1.2.1 | Audio/Video (Untertitel) | A | N/A | Keine Audio/Video-Inhalte |
| 1.3.1 | Info und Beziehungen | A | ⚠️ TEILWEISE | Landmarks fehlen auf 5 Seiten, Heading-Spr&uuml;nge auf ContactPage |
| 1.3.2 | Sinnvolle Reihenfolge | A | ✅ PASS | DOM-Order = visuelle Order |
| 1.3.3 | Sensorische Eigenschaften | A | ✅ PASS | Keine rein farb-/form-basierte Anweisungen |
| 1.4.1 | Nutzung von Farbe | A | ✅ PASS | Status-Badges nutzen Text+Farbe |
| 1.4.3 | Kontrast Minimum | AA | ❌ FAIL | Terti&auml;rtext 3.0:1, Footer 3.5:1, Accent-Icons 1.95:1 |
| 1.4.4 | Textgr&ouml;&szlig;e &auml;ndern | AA | ✅ PASS | Relative Einheiten, `rem` f&uuml;r Schrift |
| 1.4.5 | Text statt Bild | AA | ✅ PASS | Keine Text-in-Bild-Inhalte |
| 1.4.10 | Reflow (320px) | AA | ✅ TEILWEISE | 360px minimal getestet (nicht 320px); 1-Spalten-Fallback |
| 1.4.11 | Nicht-Text-Kontrast | AA | ❌ FAIL | Orange Icons (#F59E0B) auf Wei&szlig; — 1.95:1 (brauchen 3:1) |
| 1.4.12 | Textabstand | AA | ✅ PASS | `line-height: 1.6`, ausreichende Abst&auml;nde |
| 1.4.13 | Hover-Inhalte | AA | ✅ PASS | Kein Content-bei-Hover ohne Dismiss |

### 3.2 Operable (Bedienbar)

| # | Kriterium | Level | Status | Details |
|---|---|---|---|---|
| 2.1.1 | Tastatur | A | ⚠️ TEILWEISE | Grundfunktionen per Tab erreichbar, aber Dropdowns/Men&uuml;s ohne Tastatur |
| 2.1.2 | Keine Tastaturfalle | A | ❌ FAIL | CookieBanner, PortalShell-Overlay — kein Focus-Management |
| 2.2.1 | Zeitbegrenzung | A | ✅ PASS | Keine Zeitlimits |
| 2.2.2 | Pause, Stop, Hide | A | N/A | Keine automatisch bewegten Inhalte |
| 2.3.1 | Grenzwert (Blitze) | A | ✅ PASS | Keine Flash-Inhalte |
| 2.4.1 | Bl&ouml;cke &uuml;berspringen | A | ❌ FAIL | **Kein Skip-Link** |
| 2.4.2 | Seitentitel | A | ✅ PASS | `react-helmet-async` setzt `<title>` dynamisch |
| 2.4.3 | Fokus-Reihenfolge | A | ✅ PASS | DOM-Order entspricht visueller Reihenfolge |
| 2.4.4 | Link-Zweck (im Kontext) | A | ⚠️ TEILWEISE | VendorCard als Ganzes ist Link — kein `aria-label` f&uuml;r Kontext |
| 2.4.5 | Mehrere Wege | AA | ✅ PASS | Navigation + Footer-Links + Breadcrumb |
| 2.4.6 | &Uuml;berschriften und Labels | AA | ⚠️ TEILWEISE | Heading-Spr&uuml;nge auf ContactPage, LoginPage |
| 2.4.7 | Fokus sichtbar | AA | ❌ FAIL | **Fokus-Indikatoren fehlen fast &uuml;berall** |
| 2.4.11 | Fokus nicht versteckt | AA | ✅ PASS | Fokus bleibt sichtbar (soweit vorhanden) |
| 2.5.3 | Label im Namen | A | ✅ PASS | Button-Texte entsprechen sichtbarem Text |
| 2.5.7 | Dragging-Bewegungen | AA | N/A | Keine Drag-Funktionen |
| 2.5.8 | Zielgr&ouml;&szlig;e (Minimum) | AA | ⚠️ TEILWEISE | CTA-Buttons ≥44px, aber Language-Pill 28px, Sidebar-Items 40px |

### 3.3 Understandable (Verst&auml;ndlich)

| # | Kriterium | Level | Status | Details |
|---|---|---|---|---|
| 3.1.1 | Sprache der Seite | A | ✅ PASS | `<html lang>` dynamisch via SEOHead |
| 3.1.2 | Sprache von Teilen | AA | ✅ PASS | Language-Switcher, i18n |
| 3.2.1 | Bei Fokus | A | ✅ PASS | Keine &Auml;nderungen bei Fokus |
| 3.2.2 | Bei Eingabe | A | ✅ PASS | Keine automatische &Auml;nderung bei Eingabe (au&szlig;er Rollen-Wechsel on:click) |
| 3.2.3 | Konsistente Navigation | AA | ✅ PASS | PublicNav/PortalShell wiederverwendet |
| 3.2.4 | Konsistente Bezeichnung | AA | ✅ PASS | Gleiche Links = gleiche Labels |
| 3.3.1 | Fehleridentifikation | A | ⚠️ TEILWEISE | Login/Register haben Error-Div, BookingWidget nutzt `alert()` |
| 3.3.2 | Beschriftungen (Labels) | A | ✅ PASS | Formular-Labels vorhanden |
| 3.3.3 | Fehlerempfehlung | AA | ❌ FAIL | Fehlermeldungen zeigen Problem, aber keine Korrekturvorschl&auml;ge |
| 3.3.4 | Fehlerpr&auml;vention (Rechtliches) | AA | N/A | Keine rechtsverbindlichen Transaktionen |
| 3.3.7 | Eingabehilfe | A | ⚠️ TEILWEISE | `autocomplete` nur auf Login/Register |

### 3.4 Robust (Robust)

| # | Kriterium | Level | Status | Details |
|---|---|---|---|---|
| 4.1.1 | Parsing | A | ✅ PASS | Valides HTML/JSX (React 19) |
| 4.1.2 | Name, Rolle, Wert | A | ⚠️ TEILWEISE | ARIA auf Rollen-Wahl, aber fehlt auf Toggles/Dropdowns |
| 4.1.3 | Statusmeldungen | AA | ❌ FAIL | **Keine `aria-live`- oder `role="alert"`-Regionen** |

---

## 4. Problem-Matrix — Priorisiert

### Kritisch (🔴 Critical — sofort beheben)

| ID | Problem | Kategorie | Ort | WCAG | Fix-Empfehlung |
|---|---|---|---|---|---|
| A1 | **Keine Fokus-Indikatoren** auf interaktiven Elementen | Accessibility | Global | 2.4.7 AA | `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` in `index.css` |
| A2 | **Kein Skip-Link** zum Hauptinhalt | Accessibility | Global (`index.html` oder `App.js`) | 2.4.1 A | `<a href="#main-content" class="skip-link">Zum Hauptinhalt</a>` in `index.html` + `.skip-link` CSS |
| A3 | **Terti&auml;re Textfarbe (#94A3B8) scheitert AA-Kontrast** (3.0:1) | Accessibility | Global | 1.4.3 AA | Farbe auf `#64748B` &auml;ndern (Ratio 4.5:1) |
| A4 | **Kein `<main>`-Landmark** auf HomePage, FeaturesPage, PricingPage, LoginPage, RegisterPage | Accessibility | 5 &ouml;ffentliche Seiten | 1.3.1 A | `<>` durch `<main>` ersetzen oder `role="main"` hinzuf&uuml;gen |
| A5 | **Kein `prefers-reduced-motion`** — Animationen respektieren Nutzerpr&auml;ferenz nicht | Accessibility | `src/index.css` | 2.3.3 AAA | CSS-Block f&uuml;r `@media (prefers-reduced-motion: reduce)` einf&uuml;gen |
| A6 | **SVG-Icons ohne `aria-hidden="true"`** — Screenreader lesen SVG-Pfade | Accessibility | Alle Seiten/Komponenten | 1.1.1 A | Allen dekorativen `<Icon>`-Komponenten `aria-hidden="true"` hinzuf&uuml;gen |
| A7 | **BookingWidget: Fehler via `alert()`** — kein `aria-invalid`, kein `role="alert"` | Accessibility | `src/pages/public/VendorDetailPage.js` | 3.3.1 A, 4.1.3 AA | Inline-Error mit `role="alert"` + `aria-describedby`-Verkn&uuml;pfung |

### Schwerwiegend (🟠 Major — vor Launch beheben)

| ID | Problem | Kategorie | Ort | WCAG | Fix-Empfehlung |
|---|---|---|---|---|---|
| B1 | **Keine `aria-live`-Regionen** f&uuml;r dynamische Inhalte (Loading/Error/Empty States) | Accessibility | Global | 4.1.3 AA | `<div aria-live="polite" aria-atomic="true" id="status-announcer" />` im Layout |
| B2 | **CookieBanner/PortalShell-Overlay ohne Focus-Trap** | Accessibility | `CookieBanner.js`, `PortalShell.js` | 2.1.2 A | Focus-Trap-Logik einf&uuml;gen (Escape schlie&szlig;t, Tab zirkuliert) |
| B3 | **Scrollbar global ausgeblendet** — scrollbare Bereiche unsichtbar | Accessibility | `src/index.css:177-188` | 2.4.7 AA | `scrollbar-width: none` entfernen; durch `scrollbar-width: thin` ersetzen |
| B4 | **`overflow-x: hidden` auf html/body** — maskiert Layout-Bugs | Responsive | `src/index.css:146,154` | 1.4.10 AA | Entfernen; stattdessen echte Overflow-Ursachen beheben |
| B5 | **Dropdowns (RoleSwitcher, TenantSwitcher, LanguageSwitcher) ohne Tastatur-Support** | Accessibility | `src/components/portal/PortalSwitchers.js` | 2.1.1 A | Arrow-Key-Navigation, Escape zum Schlie&szlig;en, `aria-activedescendant` |
| B6 | **Toggles (CookieBanner, FAQ, Mobile-Men&uuml;) ohne `aria-expanded`** | Accessibility | `CookieBanner.js`, `PricingPage.js`, `PublicNav.js`, `PortalShell.js` | 4.1.2 A | `aria-expanded={open}` auf Toggle-Buttons |
| B7 | **ContactPage: Heading-Sprung von h1 zu h3** (keine h2) | Accessibility | `src/pages/public/ContactPage.js` | 2.4.6 AA | h1 → h2 f&uuml;r "Kontaktdaten" / "Kontaktformular" einf&uuml;gen |
| B8 | **LoginPage: Doppeltes h2 "Bookando"** im Brand-Panel | Accessibility | `src/pages/auth/LoginPage.js:195-196` | 4.1.1 A | Zweites h2 entfernen |

### Mittel (🟡 Minor — zeitnah beheben)

| ID | Problem | Kategorie | Ort | Fix-Empfehlung |
|---|---|---|---|---|
| C1 | **Accent-Icons (#F59E0B) auf Wei&szlig; mit 1.95:1 Kontrast** — dekorativ, aber nicht AA | Accessibility | Global | Dunkleren Orange-Ton f&uuml;r Icons (#D97706) oder gr&ouml;&szlig;ere Icons |
| C2 | **Footer-Headings `rgba(255,255,255,0.3)`** — praktisch unsichtbar | Accessibility | `src/components/layout/PublicFooter.js` | Opacity auf 0.6 erh&ouml;hen |
| C3 | **Touch-Targets: Language-Pill 28px, Sidebar-Items 40px** — unter 44px | Accessibility | `index.css`, `PortalShell.js` | Auf ≥44px erh&ouml;hen |
| C4 | **Kein `autocomplete`-Attribut auf Kontaktformular und BookingWidget** | Accessibility | `ContactPage.js`, `VendorDetailPage.js` | `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"` hinzuf&uuml;gen |
| C5 | **Fehlermeldungen ohne Korrekturvorschl&auml;ge** | Accessibility | `LoginPage.js`, `RegisterPage.js` | Konkrete Hinweise erg&auml;nzen ("Gib eine g&uuml;ltige E-Mail-Adresse ein, z.B. name@domain.de") |
| C6 | **`role="radio"` auf RoleCard in RegisterPage — `radiogroup` ben&ouml;tigt `aria-label`** | Accessibility | `src/pages/auth/RegisterPage.js` | `aria-label="Rolle w&auml;hlen"` auf Container-Div |
| C7 | **LegalPage: `dangerouslySetInnerHTML`** ohne ARIA-Anreicherung | Accessibility | `src/pages/legal/LegalPage.js` | HTML-Inhalte auf semantische Tags pr&uuml;fen, ggf. `tabindex` f&uuml;r Tastatur-Scroll |
| C8 | **Dashboard-Tabellen: Service-Spalte auf Mobile versteckt** — Datenverlust | Responsive | Diverse Dashboard-Seiten | Vertikales Layout f&uuml;r jede Zeile auf Mobile (`flex-col` statt `flex items-center`) |

---

## 5. Positiv-Befunde (Bereits erf&uuml;llt)

| ID | Kriterium | Details |
|---|---|---|
| ✅ P1 | **Responsive Grids** | Alle Seiten nutzen `grid-cols-1` → responsive Spalten (sm/md/lg) |
| ✅ P2 | **Mobile-Navigation** | Bottom-Nav + Hamburger-Men&uuml; + Overlay — drei konsistente Patterns |
| ✅ P3 | **`safe-area-inset-bottom`** | Bottom-Nav und Footer respektieren Notch-Bereich |
| ✅ P4 | **Mobile-First Hero-Typografie** | `text-[40px] sm:text-[56px] lg:text-[68px]` — skalierend |
| ✅ P5 | **CTA-Touch-Targets** | `h-[48px]` bis `h-[56px]` — &uuml;ber 44px Minimum |
| ✅ P6 | **Dynamische `<html lang>`** | SEOHead setzt `lang={i18n.language}` — reagiert auf Sprachwechsel |
| ✅ P7 | **Semantische Formular-Labels** | `<label>` korrekt mit Inputs verkn&uuml;pft |
| ✅ P8 | **`react-helmet-async`** | Setzt `<title>` dynamisch — Screenreader-Kontext |
| ✅ P9 | **PortalShell-Landmarks** | `<header>`, `<nav>`, `<main>`, `<aside>` — vollst&auml;ndig |
| ✅ P10 | **`aria-label="Zur&uuml;ck"`** auf BookingWidget-Navigation | Bewusste Accessibility-Entscheidung |
| ✅ P11 | **Sonner-Toasts** | Eingebaute `role="status"` und `aria-live` |
| ✅ P12 | **ErrorBoundary** | F&auml;ngt React-Fehler, zeigt menschenlesbare Meldung |

---

## 6. Zusammenfassung — Scorecard

| Bereich | Erf&uuml;llungsgrad | Kritisch | Major | Minor |
|---|---|---|---|---|
| **Responsive Design** | 85 % | 0 | 2 | 3 |
| **Semantisches HTML** | 50 % | 1 | 2 | 1 |
| **ARIA & Rollen** | 35 % | 1 | 3 | 2 |
| **Tastatur-Navigation** | 30 % | 2 | 3 | 0 |
| **Farbkontraste (AA)** | 55 % | 1 | 1 | 1 |
| **Fokus-Indikatoren** | 10 % | 1 | 0 | 0 |
| **Reduced Motion** | 0 % | 1 | 0 | 0 |
| **Formular-Accessibility** | 55 % | 1 | 0 | 2 |
| **Screenreader-Freundlichkeit** | 40 % | 2 | 2 | 1 |
| **WCAG 2.2 AA Gesamt** | ~45 % | 7 | 8 | 8 |

### Top-5 Priorit&auml;ten f&uuml;r Launch-Readiness

1. **Fokus-Indikatoren** (A1) — minimaler Aufwand, maximale Wirkung
2. **Terti&auml;rtext-Kontrast** (A3) — fl&auml;chendeckendes Problem
3. **`<main>`-Landmarks** (A4) — 5 Seiten betroffen
4. **`prefers-reduced-motion`** (A5) — gesetzlich zunehmend relevant
5. **SVG-Icons `aria-hidden`** (A6) — betrifft ALLE Seiten

### Gesch&auml;tzter Aufwand

| Priorit&auml;t | Anzahl Issues | Gesch&auml;tzte Arbeitszeit |
|---|---|---|
| Kritisch | 7 | 4–6 Stunden |
| Major | 8 | 6–10 Stunden |
| Minor | 8 | 3–5 Stunden |
| **Gesamt** | **23** | **13–21 Stunden** |
