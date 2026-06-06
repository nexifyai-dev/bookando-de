# Bookando — Design System Audit

> **Stand:** 06.06.2026 | **Skills:** Taste (Anti-Slop) + Emil (UI Polish)

---

## 1. Logo & Brand

| Bereich | Status | Befund |
|---------|--------|--------|
| Logo hell (Light) | ✅ | Orange Hex #F59E0B + dunkle Schrift #2D3748 |
| Logo dunkel (Dark) | ✅ | Orange Hex #F59E0B + weiße Schrift |
| "b" im Hexagon zentriert | ✅ | Path-basiert, optisch korrigiert |
| CSS-Filter brightness(0) invert(1) | ✅ | Entfernt |
| Header: korrekte Variante | ✅ | Dynamischer Wechsel |
| Footer: korrekte Variante | ✅ | brand-logo-horizontal.png |
| Auth-Seiten: korrekte Variante | ✅ | |
| mobile Anpassung | ✅ | brand-logo-mobile.png |

## 2. Farbwelt

| Farbe | HEX | Status | Verwendung |
|-------|-----|--------|------------|
| Primary (Navy) | #1A202C | ✅ | Header, Hero-BG |
| Accent (Orange) | #F59E0B | ✅ | CTAs, Hexagon, Akzente |
| Surface | #FFFFFF / #F8FAFC | ✅ | Cards, Hintergründe |
| Text Primary | #1A202C | ✅ | Überschriften |
| Text Secondary | #4A5568 | ✅ | Fließtext |
| Text Muted | #A0AEC0 | ✅ | Sekundär-Infos |
| Divider | #E2E8F0 | ✅ | Linien, Borders |
| Danger | #E53E3E | ✅ | Fehler, Storno |
| Success | #38A169 | ✅ | Bestätigung |
| Warning | #F59E0B | ✅ | Bewertungen |
| Purple-Reste (#6366f1) | ❌ | **Bereinigt** | LegalPage-Fix |
| Beige/Brass-Reste | ✅ | Nie vorhanden | Brand-Konsistenz |

## 3. Komponenten-Systeme

| Komponente | Status | Anmerkung |
|-----------|--------|-----------|
| **Button-System** | ⚠️ | Uneinheitliche Größen: `h-[56px]` in CTA vs `px-6 py-2` + `px-4 py-2.5` in anderen. Nur ein Radius-Wert (`rounded-full` vs `rounded-[var(--radius-md)]`) |
| Button :active | ⚠️ | Nicht auf allen Buttons vorhanden (`scale-0.97`) |
| Button Hover media query | ⚠️ | Nicht überall `@media (hover)` |
| **Card-System** | ⚠️ | Cards haben `rounded-[var(--radius-md)]` + `border` + Shadow, aber Shadows nicht durchgängig an BG-Hue angepasst |
| **Form-System** | ⚠️ | Inputs haben `rounded-[var(--radius-md)]` + `border`, Labels oben. Aber keine konsistente Input-Größe |
| **Table-System** | ❌ | Kein einheitliches Table-Component (TanStack Table empfohlen) |
| **Modal/Drawer-System** | ❌ | Kein einheitliches Overlay-System |
| **Stepper** | ❌ | Für Vendor-Onboarding nötig |
| **KPI Cards** | ⚠️ | In Admin-Dashboard vorhanden, in Vendor-Dashboard anders |
| **Sidebar (PortalShell)** | ✅ | Kollabierbar, Mobile Bottom-Nav |
| **Topbar** | ✅ | Konsistent |
| **Breadcrumbs** | ❌ | Fehlen |
| **Tabs** | ✅ | LegalPage, Buchungs-Tabs |
| **Badge** | ✅ | UI-Komponente vorhanden |
| **Separator** | ✅ | UI-Komponente vorhanden |
| **Avatar** | ✅ | In Marketplace |

## 4. Radius-System

| Anwendung | Aktuell | Soll | Status |
|-----------|---------|------|--------|
| Buttons | `rounded-full` + `rounded-[var(--radius-md)]` | Ein System | ⚠️ |
| Cards | `rounded-[var(--radius-md)]` | = 8px | ✅ |
| Inputs | `rounded-[var(--radius-md)]` | = 8px | ✅ |
| Modals | ❌ | = 12px | ❌ |
| Badges | `rounded-full` | = Pill | ✅ |

**Empfehlung:** `--radius-sm: 4px` (Inputs), `--radius-md: 8px` (Cards), `--radius-lg: 12px` (Modals), `rounded-full` (Buttons/Badges)

## 5. Shadow-System

| Anwendung | Aktuell | Soll |
|-----------|---------|------|
| Cards | `shadow-[var(--shadow-e2)]` | Leicht, tinted |
| Modals | ❌ | `shadow-xl` |
| Buttons | `shadow-[0_4px_24px_rgba(212,175,55,0.3)]` (CTA) | CTA-only mit Akzentfarbe |
| KPI Cards | Ohne Shadow | OK |

## 6. Spacing-System

| Bereich | Aktuell | Bewertung |
|---------|---------|-----------|
| Section-Padding | `py-[64px] md:py-[80px] lg:py-[96px]` | ✅ Konsistent auf Landingpage |
| Card-Padding | `p-4`, `p-6` | ⚠️ Variiert |
| Gap zwischen Cards | `gap-3`, `gap-6` | ⚠️ Nicht einheitlich |

## 7. Motion & Interaktion

| Regel | Status | Befund |
|-------|--------|--------|
| Kein `transition: all` | ⚠️ | Einige Stellen noch `transition-all` |
| Button :active scale(0.97) | ⚠️ | Im BookingWidget, nicht überall |
| Hover via `@media (hover)` | ❌ | Nicht implementiert |
| reduced-motion | ❌ | Nicht auditiert |
| Stagger/Entrance | ⚠️ | Landingpage hat `useInView` + Stagger |
| Loading States | ⚠️ | Skeletons in BookingWidget, Spinner woanders |

## 8. Mobile-Status

| Bereich | Status | Befund |
|---------|--------|--------|
| PublicNav mobil | ✅ | Hamburger-Menü |
| Footer mobil | ✅ | Single-Column |
| Landingpage mobil | ✅ | Vertikaler Stack |
| Marketplace mobil | ✅ | Filter als Bottom Sheet vorbereitet |
| Vendor-Detail mobil | ✅ | BookingWidget collapsed |
| BookingWidget mobil | ✅ | Vertikaler Flow |
| PortalShell mobil | ✅ | Bottom-Nav |
| Admin mobil | ⚠️ | Data-Tabellen nicht optimiert |
| Touch Targets 44×44px | ❌ | Nicht auditiert |

## 9. CTA-/Hero-Grafiken

| Grafik | Status | Schutz |
|--------|--------|--------|
| `hero-grafik.png` (1.36 MB) | ✅ | Stabil auf app.bookando.de |
| `cta-grafik.png` (1.16 MB) | ✅ | Stabil, Glow-Fix |
| Gesperrt vor Änderung | ✅ | Grafikdateien niemals verändern |

## 10. Skills-Umsetzung

| Taste Skill (§) | Angewendet? | Nachweis |
|----------------|------------|----------|
| §0.B Design Read | ✅ | B2B SaaS + Premium Booking |
| §1 Dials (V6/M5/D4) | ✅ | |
| §4.2 Color (LILA Rule) | ✅ | Kein Purple |
| §4.4 Shape Consistency | ⚠️ | Radius-System vereinheitlichen |
| §4.5 Button Contrast | ⚠️ | Teilweise |
| §4.5 Empty/Loading/Error | ⚠️ | BookingWidget ✅, andere ⚠️ |
| §4.7 Hero-Regeln | ✅ | Vendor-Detail |
| §9.G Em-Dash Ban | ✅ | Keine Em-Dashes |
| §14 Pre-Flight | ⚠️ | 60 Checkpunkte — teilweise |

| Emil Skill | Angewendet? | Nachweis |
|-----------|------------|----------|
| Button :active scale(0.97) | ⚠️ | BookingWidget ✅, andere ❌ |
| Kein scale(0) | ✅ | scale(0.95) im BookingWidget |
| Spezifische Transitions | ✅ | transition: transform... |
| Hover media query | ❌ | Nicht umgesetzt |
| reduced-motion | ❌ | Nicht umgesetzt |
| Stagger | ✅ | Landingpage, BookingWidget |
