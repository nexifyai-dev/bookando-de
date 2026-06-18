# Bookando.de — UI/UX Skill Review & Design-Qualitätssicherung

> **Skills:** `design-taste-frontend` (Anti-Slop Frontend) + `emil-design-eng` (UI Polish & Animation)
> **Stand:** 06.06.2026, 10:02 UTC
> **Basis:** `docs/PRODUKTSTRUKTUR.md` (1.041 Zeilen), `PFLICHTENHEFT.md` (852 Zeilen)
> **Live:** https://bookando.de | https://bookando-de-riw8.vercel.app

---

## 1. Design Read (Taste Skill §0.B)

> **Reading this as:** B2B SaaS marketplace platform for vendors and customers, with a premium-consumer booking aesthetic, leaning toward Tailwind utilities + custom brand tokens + restrained motion on functional UI + editorial-grade landing pages.

**Dials (Taste Skill §1):**

| Dial | Wert | Begründung |
|------|------|------------|
| `DESIGN_VARIANCE` | 6 | Offset layout (asymmetrisch wo nötig, symmetrisch wo funktional) |
| `MOTION_INTENSITY` | 5 | Subtile UI-Animationen (Button-Feedback, Stagger, Modal-Entrance) |
| `VISUAL_DENSITY` | 4 | Tägliche App (Standard-Abstände für SaaS-Platform) |

---

## 2. Geprüfte UI/UX-Bereiche (Mapping: Kritische MVP-Flows → Skill-Regeln)

### 2.1 BookingFlow / BookingWidget (P0 — 🔴 Kritisch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| BookingWidget existiert | Taste §0.A | ❌ Fehlt | Keine dedizierte Buchungs-Komponente |
| Service → Slot → Buchung | Taste §4.3 (Anti-Center-Bias) | ❌ Fehlt | Flow nicht als Komponente modelliert |
| Mobile-First | Taste §4.7 (Viewport) | ❌ Nicht geprüft | BookingWidget noch nicht existent |
| Button-Feedback | Emil §Komponenten (scale 0.97) | ❌ Fehlt | Wird im neuen Widget eingebaut |
| Transform-Origin Popover | Emil §Origin-Aware | ❌ Fehlt | Slots/Popover müssen trigger-origin-aware sein |
| Stagger Slot-Animation | Emil §Stagger | ❌ Fehlt | Slot-Liste braucht Cascade |
| Loading/Empty/Error | Taste §4.5 | ❌ Fehlt | Skeleton Loader für Slots |
| CTA-Intent Konsistenz | Taste §4.5 (No Duplicate CTA) | ❌ Nicht prüfbar | Wird im Design definiert |

**Skill-Empfehlung (Taste):** Der BookingFlow muss als eigenständige, mobile-first React-Komponente konzipiert werden. `DESIGN_VARIANCE 6` erlaubt asymmetrisches Layout: links Service/Mitarbeiter-Auswahl, rechts Zeitslot-Grid. `MOTION_INTENSITY 5`: Slots erscheinen mit Stagger (50ms Delay), Button hat `scale(0.97)` on:active.

**Skill-Empfehlung (Emil):** 
- Kein `scale(0)` für Slot-Entrance — starte bei `scale(0.95) + opacity(0)`
- Transform-Origin für Datum-Popover auf Trigger setzen
- Slot-Hover: `@media (hover: hover) and (pointer: fine)` gaten
- Enter/Exit asymmetrisch (Enter: 200ms ease-out, Exit: 150ms ease-out)

### 2.2 Vendor-Detailseite (P0 — 🟠 Hoch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Vendor-Detail existiert | Taste §0.A | ❌ Fehlt | Keine öffentliche Vendor-Seite |
| Hero/Header mit Branding | Taste §4.7 (Hero-Regeln) | ❌ Fehlt | Muss Hero-Regeln einhalten |
| Service-Liste mit Preisen | Taste §4.9 (Content Density) | ❌ Fehlt | Max 5-Service-Vorschau + "Alle" |
| Bewertungen | Taste §4.10 (Quotes) | ❌ Fehlt | Max 3 Zeilen Quote |
| Direktbuchung | - | ❌ Fehlt | "Jetzt buchen" CTA |
| Mobile Collapse | Taste §4.7 | ❌ Nicht geprüft | Noch nicht existent |
| Bookando Branding (Footer) | Taste §4.11 (Theme Lock) | ❌ Fehlt | Einheitliches Theme |

**Skill-Empfehlung (Taste):**
- Hero: max 2 Zeilen Headline, max 20 Wörter Subtext, CTA sichtbar ohne Scroll
- Section-Layout-Repetition: Image+Text-Split max 2x hintereinander
- Kein Eyebrow über jeder Section (max 1 per 3 Sections, Taste §4.7)
- Premium-Consumer-Palette: KEIN beige+brass Standard (Taste §4.2) — Bookando verwendet Orange (#F59E0B) + Deep Navy (#1A202C)

### 2.3 Marketplace-Suche (P0 — ✅ Teilweise vorhanden)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Suche/Filter funktional | - | ✅ Vorhanden | Kategorie, Standort |
| Filter-Labels | Taste §9.F (No Em-Dash) | ⚠️ Prüfen | Em-Dash in Labels? |
| Vendor-Karten | Taste §4.4 (Shadows, Cards) | ⚠️ Prüfen | Shadow an BG-Hue angepasst? |
| Empty State | Taste §4.5 | ❌ Fehlt | Kein Empty State bei 0 Ergebnissen |
| Mobile Filter | Taste §4.7 (Mobile Collapse) | ⚠️ Prüfen | Filter-UI auf Mobile? |
| CTA-Intent | Taste §4.5 | 🟡 Prüfen | "Zum Vendor" / "Jetzt buchen" konsistent? |

**Skill-Empfehlung (Emil):**
- Karten-Hover: `transform: scale(1.02)` mit 200ms ease-out, gated hinter `@media (hover: hover)`
- Karten-:active: `scale(0.98)` für taktiles Feedback
- Shape Consistency Lock (Taste §4.4): Ein Radius-System für alle Karten

### 2.4 Vendor-Onboarding (P1 — 🟠 Hoch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Schritt-für-Schritt-Flow | - | ❌ Fehlt | Kein strukturiertes Onboarding |
| Progress-Indikator | - | ❌ Fehlt | User muss wissen wo er steht |
| Trial-Status sichtbar | - | ❌ Fehlt | "Noch 24 Tage Testphase" |
| CTA-Eindeutigkeit | Taste §4.5 (No Duplicate CTA) | ❌ Fehlt | Ein "Weiter"-Button |

**Skill-Empfehlung:**
- Onboarding als Stepper-Komponente mit 5 Schritten (Vendor → Standort → Services → Öffnungszeiten → Zahlung)
- Jeder Schritt: Skeleton Loading → Formular → Validierung → Animation zum nächsten Schritt
- Progress-Bar mit Transition (Emil: CSS transition, kein keyframe)
- Abschluss: Konfetti-Animation (falls angemessen) + "Dein Vendor ist live!"-Screen

### 2.5 Affiliate-Dashboard (P1 — 🟠 Hoch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Dashboard existiert | - | ❌ Fehlt | Kein separates Affiliate-Dashboard |
| KPI-Übersicht | - | ❌ Fehlt | Klicks, Conversions, Provisionen |
| Wallet-Stand | - | ❌ Fehlt | Aktuelles Guthaben |
| Trackinglinks verwalten | - | ❌ Fehlt | CRUD für Links |
| Data-Table | Taste §OOS (Data Tables) | ❌ Fehlt | TanStack Table für Link-Tabelle |
| Mobile Nutzung | Taste §4.7 | ❌ Nicht geprüft | Noch nicht existent |

**Skill-Empfehlung (Taste §OOS):** Für das Affiliate-Dashboard sind Tabellen (TanStack Table) und KPIs (4 Metric Cards oben) angemessen. Taste-Skill ist nicht primär für Dashboards ausgelegt — hier Fluent UI oder Carbon-Muster verwenden.

**Skill-Empfehlung (Emil):**
- KPI-Cards: `scale(0.97)` on:active
- Data-Table: Kein `ease-in` für Sort/Filter — UI-Dauer <200ms
- Wallet-Balance: Kein Animation bei häufigem Check (100+/Tag → 0 Animation)

### 2.6 Wallet/Payout-Ansichten (P1 — 🟠 Hoch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Wallet-Seite existiert | - | ✅ Vorhanden | VendorWalletPage |
| Ledger sichtbar | - | ✅ Vorhanden | Transaktionsliste |
| Payout-Status | - | ✅ Teilweise | Grundlegende Funktion |
| Ledger unveränderbar | ADR-002 | ❌ Fehlt | Noch nicht append-only |
| Empty State | Taste §4.5 | ❌ Fehlt | "Noch keine Transaktionen" |
| Mobile | Taste §4.7 | ⚠️ Prüfen | Responsive Layout |

**Skill-Empfehlung (Taste):**
- Ledger-Tabelle: Kein `border-t`+`border-b` auf jeder Row — Taste §4.9 (Spec-Sheet-Pattern)
- Grouped Chunks: Transaktionen nach Status gruppieren (pending, approved, paid)
- Wallet-Balance prominent als Hero-KPI, Ledger darunter

### 2.7 CRM-Basis (P1 — 🟡 Mittel)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| CRM-Seite existiert | - | ✅ Vorhanden | VendorCustomersPage |
| Kundenprofil | - | ✅ Teilweise | Grundlegende Daten |
| Tags/Notizen | - | ❌ Fehlt | Noch nicht implementiert |
| Buchungshistorie | - | ✅ Teilweise | API vorhanden |
| Mobile | Taste §4.7 | ⚠️ Prüfen | Responsive |

### 2.8 Admin-Backoffice (P0 — ✅ Vorhanden)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Admin-Seiten existieren | - | ✅ Vorhanden | 5 Admin-Seiten |
| Dashboard KPI | - | ✅ Vorhanden | Statistiken |
| Vendor-Verwaltung | - | ✅ Vorhanden | CRUD |
| User-Verwaltung | - | ✅ Vorhanden | CRUD |
| Empty/Loading States | Taste §4.5 | ❌ Fehlt | Prüfen |
| CTA-Konsistenz | Taste §4.5 | ⚠️ Prüfen | Einheitliche Buttons |

### 2.9 Tarif-/Trial-Flow (P0 — 🟡 Mittel)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Trial-Start | - | ✅ Vorhanden | Register → Vendor anlegen |
| Trial-Status | - | ❌ Fehlt | Keine sichtbare Trial-Anzeige |
| Plan-Wechsel | - | ✅ Teilweise | API vorhanden, Frontend rudimentär |
| Pricing-Seite | Taste §4.9 (Content Density) | ⚠️ Prüfen | Keine überladene Pricing-Tabelle |
| CTA-Eindeutigkeit | Taste §4.5 | ❌ Fehlt | "30 Tage testen" vs "Jetzt starten" |

### 2.10 Mobile Nutzung (P0 — 🟠 Hoch)

| Kriterium | Skill-Regel | Prüfung | Befund |
|-----------|-------------|---------|--------|
| Viewport | Taste §4.7 (100dvh) | ✅ Nutzt 100dvh? | Prüfen |
| Touch Targets | Emil §Accessibility (44x44) | ❌ Nicht geprüft | Prüfen |
| Hover auf Mobile | Emil §Touch (media query) | ⚠️ Prüfen | Hover-States gaten? |
| Navbar Mobile | Taste §4.7 (Hamburger) | ✅ Vorhanden | Mobile Nav |
| Bottom Nav Mobile | - | ❌ Fehlt? | Prüfen |

---

## 3. Design-/Usability-Lücken (Priorisiert)

| # | Lücke | Bereich | Skill-Quelle | Priorität |
|---|-------|---------|-------------|-----------|
| 1 | **BookingWidget fehlt** — gesamter Kunden-Buchungsflow | Booking | Taste, Emil | P0 🔴 |
| 2 | **Vendor-Detailseite fehlt** — öffentliche Vendor-Präsenz | Marketplace | Taste | P0 🔴 |
| 3 | **Em-Dash in Labels?** — Taste §9.G: NULL Em-Dashes erlaubt | Alle | Taste | P0 🔴 |
| 4 | **Empty States fehlen** — 0 Ergebnisse, keine Buchungen | Alle | Taste §4.5 | P0 🔴 |
| 5 | **Loading States fehlen** — Skeleton Loader | Alle | Taste §4.5 | P0 🟠 |
| 6 | **Error States fehlen** — API-Fehler, Formular-Fehler | Alle | Taste §4.5 | P0 🟠 |
| 7 | **Shadow-Tint prüfen** — Shadows an BG-Hue anpassen | UI | Taste §4.4 | P0 🟠 |
| 8 | **Shape Consistency — Ein Radius-System** | UI | Taste §4.4 | P0 🟠 |
| 9 | **Button :active States — scale(0.97)** | UI | Emil | P0 🟠 |
| 10 | **Hover auf Touch Devices gaten** | UI | Emil §Accessibility | P0 🟠 |
| 11 | **CTA-Intent Konsistenz prüfen** | Content | Taste §4.5 | P0 🟠 |
| 12 | **Section-Layout-Repetition prüfen** — Max 2 gleiche Layouts | Layout | Taste §4.7 | P1 🟡 |
| 13 | **Eyebrow-Count prüfen** — Max 1 per 3 Sections | Content | Taste §4.7 | P1 🟡 |
| 14 | **Eye-Catching-Animationen für Premium-Feeling** | Motion | Emil | P1 🟡 |
| 15 | **Mobile Touch Targets (44x44px)** | UI | Emil | P1 🟡 |
| 16 | **Premium-Consumer-Palette: KEIN Beige/Brass** | Brand | Taste §4.2 | P1 🟡 |
| 17 | **Color Consistency Lock prüfen** — Ein Accent pro Seite | Brand | Taste §4.2 | P1 🟡 |
| 18 | **Keyframes vs transitions prüfen** — Für schnelle UI: transitions | Code | Emil | P1 🟡 |
| 19 | **Button-Varianten auditieren** — Einheitliche Größen/Stile | UI | Taste §4.5 | P1 🟡 |
| 20 | **Onboarding-Flow fehlt** — Schritt-für-Schritt für neue Vendors | Vendor | Taste, Emil | P1 🟠 |

---

## 4. Konkrete Verbesserungen (je Komponente/Seite)

### 4.1 BookingWidget (NEU ZU ERSTELLEN)

**Design-Read:** Mobile-first Buchungs-Komponente für Kunden. Service-Auswahl → Mitarbeiter (optional) → Datum/Zeit → Kundendaten → Bestätigung.

**Taste-Dials:** VARIANCE 6, MOTION 5, DENSITY 4

**Akzeptanzkriterien:**
- [ ] Mobile: Vertikaler Stack (Service → Slot → Daten)
- [ ] Desktop: Links/Rechts-Split (Service + Slot links, Buchungsübersicht rechts)
- [ ] Slots laden mit Skeleton (Emil: `clip-path: inset(0 0 100% 0)` Reveal)
- [ ] Slot-Hover: `scale(1.02)`, gated hinter `@media (hover: hover)` (Emil)
- [ ] Button:active: `scale(0.97)`, 160ms ease-out (Emil)
- [ ] CTA: Ein "Jetzt buchen"-Button pro Flow (Taste §4.5 no-duplicate-CTA)
- [ ] Shape: Ein Radius-System (4px oder 8px, konsequent)
- [ ] Empty State: "Keine freien Termine am gewählten Tag"
- [ ] Error State: "Buchung fehlgeschlagen — bitte erneut versuchen"
- [ ] Booking-Widget in Vendor-Detailseite und Booking-Endpoint integriert

**Emil-Spezifisch:**
- Popover für Datepicker: `transform-origin` auf Trigger setzen
- Slot-Liste: Stagger 50ms zwischen Slots
- Kein `scale(0)` — Slots starten bei `scale(0.95) + opacity(0)`

### 4.2 Vendor-Detailseite (NEU ZU ERSTELLEN)

**Design-Read:** Öffentliche Vendor-Seite mit Branding, Services, Kalender, Bewertungen.

**Taste-Kritisch (§4.7):**
- Hero: max 2 Zeilen Headline (Vendor-Name), max 20 Wörter Subtext, CTAs sichtbar
- Hero Top-Padding: max `pt-24` (nicht pt-32+!)
- Kein Eyebrow (oder max 1 auf gesamter Seite)
- Section-Layout-Repetition: Max 2 Image+Text-Split hintereinander
- Premium-Consumer-Palette: Bookando-Orange #F59E0B + Deep-Navy #1A202C (KEIN Beige/Brass!)

### 4.3 Marketplace-Suche (BESTEHEND, Verbesserungen)

| Bereich | Aktuell | Verbesserung | Skill |
|---------|---------|-------------|-------|
| Empty State | ❌ Fehlt | "Keine Vendors gefunden" + Filter zurücksetzen Button | Taste §4.5 |
| Vendor-Karten | ⚠️ Vorhanden | Radius-System vereinheitlichen, Shadow-Tint an BG | Taste §4.4 |
| Hover-Effekte | ⚠️ Vorhanden | `scale(1.02)` on hover, gated | Emil §Touch |
| Mobile Filter | ⚠️ Prüfen | Bottom Sheet statt Sidebar auf Mobile | Taste §4.7 |

### 4.4 Affiliate-Dashboard (NEU)

**Design-Read:** Dashboard für Affiliates. Keine Landing-Page — sondern datengetriebenes UI (Taste §OOS: hier Fluent/Material/Carbon-Muster angemessener als Taste-Defaults).

**Empfehlung:** 4 KPI-Cards oben (Klicks, Conversions, Provision, Wallet), darunter Data-Table (TanStack Table) mit Trackinglinks. 

**Emil-Spezifisch:**
- KPI-Cards: `scale(0.97)` on:active
- Wallet-Balance: Keine Animation (häufig aufgerufen — Emil §Decision Framework)
- Data-Table: Schnelle Transitions (<200ms) für Sort/Filter

### 4.5 Vendor-Onboarding (NEU)

**Design-Read:** 5-Schritt-Stepper (Vendor → Standort → Services → Öffnungszeiten → Zahlung).

**Taste-Dials:** VARIANCE 4, MOTION 5, DENSITY 5 (predictable, funktional)

**Emil-Spezifisch:**
- Progress-Bar: CSS transition (kein keyframe) — unterbrechbar
- Schritt-Übergang: Kein `scale(0)` — `slideOutLeft` / `slideInRight` via translateX
- Button Next: `scale(0.97)` on:active, 160ms ease-out

### 4.6 Tarif-/Trial-Flow (BESTEHEND, Verbesserungen)

| Bereich | Aktuell | Verbesserung |
|---------|---------|-------------|
| Trial-Status | ❌ Fehlt | "Noch 24 Tage kostenlos testen" Banner |
| Plan-Wechsel | ⚠️ Teilweise | Pricing-Tabelle mit Hervorhebung des aktiven Plans |
| CTA | ⚠️ Vorhanden | "30 Tage kostenlos testen" — einheitlich auf Landingpage + Pricing + Dashboard |

---

## 5. Akzeptanzkriterien je Kernflow

### 5.1 BookingFlow
- [ ] Kunde kann in ≤5 Schritten buchen (Service → Slot → Daten → Bestätigung)
- [ ] Mobile: 5 Schritte, vertikaler Stack
- [ ] Desktop: 3 Schritte, Side-by-Side (links Auswahl, rechts Bestätigung)
- [ ] CTA: Ein "Jetzt buchen" — kein "Jetzt kostenpflichtig buchen" + "Termin reservieren"
- [ ] Button :active: `scale(0.97)` spürbar
- [ ] Loading: Skeleton in Slot-Form, kein Spinner
- [ ] Empty: "Keine Termine verfügbar" + Vorschlag nächstmöglicher Tag
- [ ] Error: Fehlermeldung unter betroffenem Feld, nicht als Toast
- [ ] Bestätigung: Checkmark-Animation + E-Mail-Hinweis
- [ ] Kein Em-Dash im gesamten Flow
- [ ] Eine Akzentfarbe (#F59E0B) durchgängig
- [ ] Ein Radius-System (z.B. 8px für Buttons, 4px für Inputs)

### 5.2 MarketplaceFlow
- [ ] Suche: Ergebnisse erscheinen mit Stagger (50ms)
- [ ] Filter: "Alle Kategorien" / "Alle Standorte" als Default
- [ ] Empty: "Keine Ergebnisse" + Filter zurücksetzen
- [ ] Vendor-Karte: hover scale(1.02) (nur Desktop)
- [ ] CTA: "Zum Vendor" — gleicher Label auf jeder Karte

### 5.3 AffiliateFlow
- [ ] KPI-Cards: scale(0.97) on:active
- [ ] Trackinglink: Copy-to-Clipboard mit visuellem Feedback
- [ ] Data-Table: Sortierbar nach Datum, Klicks, Conversions
- [ ] Wallet: Guthaben prominent, Transaktionen darunter

### 5.4 VendorOnboarding
- [ ] 5 Schritte, sichtbare Progress-Bar
- [ ] Jeder Schritt validiert vor Weiter
- [ ] Abschluss: "Dein Vendor ist live!" + Dashboard-Link
- [ ] 30-Tage-Trial: Start-Datum + Restlaufzeit sichtbar

---

## 6. Test-Ergänzung (UI/UX & Flow-Tests)

### 6.1 Manuelle Flow-Tests

| Flow | Test | Viewport | Kriterium |
|------|------|----------|-----------|
| Mobile Booking | iPhone SE (375px) → ganzer Flow | 375×667 | Kein horizontaler Scroll, CTA sichtbar |
| Desktop Booking | 1440px → ganzer Flow | 1440×900 | Side-by-Side, CTA ohne Scroll |
| Vendor-Detail | 375px Vendor-Seite | 375×667 | Vendor-Name + CTA sichtbar |
| Marketplace | Suche + Filter + Ergebnis | 375×667 | Filter als Bottom Sheet |
| Affiliate | Dashboard + Link erstellen | 768×1024 | Data-Table responsiv |

### 6.2 Accessibility Checks

| Check | Tool | Kriterium |
|-------|------|-----------|
| Contrast Ratio | Lighthouse | WCAG AA (4.5:1 Body, 3:1 Large Text) |
| Focus States | Manuell | Sichtbare Focus-Ringe auf Allen interaktiven Elementen |
| Keyboard Nav | Manuell | Tab-Reihenfolge = visuelle Reihenfolge |
| Touch Targets | Manuell | Min 44×44px auf Mobile |
| prefers-reduced-motion | CSS-Check | Transform-Animationen deaktiviert |

### 6.3 Performance Checks

| Check | Tool | Kriterium |
|-------|------|-----------|
| LCP | Lighthouse | < 2.5s (Hero-Bild priority geladen) |
| CLS | Lighthouse | < 0.1 (Platzhalter für async Content) |
| INP | Lighthouse | < 200ms (Keine langen Main-Thread-Aufgaben) |
| Bundle | `du -sh build/` | < 3 MB total |

---

## 7. Priorisierte Umsetzungspakete (aus Produktstruktur + Skill-Review)

### P0 — BookingWidget + Vendor-Detailseite (Woche 1-2)

| Package | Enthalten | Skill-Bezug |
|---------|-----------|-------------|
| **BookingWidget** | Service-Auswahl → Mitarbeiter → Slots → Kundendaten → Bestätigung | Taste §0.A, §4.7; Emil §Komponenten, §Stagger |
| **Vendor-Detailseite** | Branding → Services → Slots → Bewertungen → CTA | Taste §4.7 (Hero), §4.10 (Quotes) |
| **Mock-Daten ersetzen** | Marketplace, Vendor-Detail, Booking | - |
| **UI-Fundament** | Radius-System, Shadow-Tint, Button-States | Taste §4.4; Emil §Buttons |

### P1 — Affiliate + Wallet + Onboarding (Woche 3-5)

| Package | Enthalten | Skill-Bezug |
|---------|-----------|-------------|
| **Affiliate-Dashboard** | KPI-Cards, Trackinglinks, Data-Table, Wallet | Taste §OOS (Data Tables); Emil §KPI-Cards |
| **Wallet/Ledger** | Append-Only, Ledger-Tabelle, Payout-Formular | Taste §4.9 (Spec-Sheet) |
| **Vendor-Onboarding** | 5-Schritt-Stepper, Trial-Banner, Progress-Bar | Emil §Progress, §Stagger |
| **CRM-Ausbau** | Tags, Notizen, Buchungshistorie | - |

### P2 — WhiteLabel + Automation (Woche 6-8)

| Package | Enthalten |
|---------|-----------|
| **WhiteLabel-Core** | Eigene Domains, Branding-Konfiguration |
| **E-Mail-Templates** | Bestätigung, Erinnerung, Follow-up |
| **Wiederkehrende Termine** | Recurring Booking UI |

---

## 8. Angewandte Skill-Regeln (Übersicht)

### Taste-Skill (design-taste-frontend)

| Regel | Anwendung |
|-------|-----------|
| §0.B Design Read | §1 — B2B SaaS + Premium-Consumer Booking |
| §1 Dials | VARIANCE 6, MOTION 5, DENSITY 4 |
| §4.1 Typografie | Sans-Serif (Cabinet Grotesk + IBM Plex Sans), kein Inter-Default |
| §4.2 Color Calibration | Bookando Orange (#F59E0B) + Deep Navy (#1A202C) |
| §4.2 LILA Rule | Bookando Orange ist erlaubt (Markenfarbe) |
| §4.2 Premium Palette BAN | Kein Beige/Brass — Bookando ist Orange+Navy |
| §4.3 Layout Diversification | BookingWidget: Asymmetrischer Split Desktop |
| §4.4 Shadows | Shadow-Tint an BG-Hue |
| §4.4 Shape Consistency | Ein Radius-System |
| §4.5 Button Contrast | WCAG AA auf allen CTAs |
| §4.5 Empty/Loading/Error | Für alle Komponenten |
| §4.5 CTA-Intent | Max 1 CTA pro Intent |
| §4.7 Hero-Regeln | Vendor-Detailseite |
| §4.7 Eyebrow Count | Max 1 per 3 Sections |
| §4.7 Section-Layout-Repetition | Max 2 gleiche Layouts |
| §4.7 Viewport | 100dvh, min-h |
| §4.9 Content Density | Spec-Sheets gruppieren |
| §4.10 Quotes | Max 3 Zeilen |
| §4.11 Theme Lock | Ein Theme pro Seite |
| §9.F Anti-Tells | Kein Em-Dash, keine Jane-Doe, kein Acme |
| §14 Pre-Flight | Vollständige Check-Liste |

### Emil-Design-Eng Skill

| Regel | Anwendung |
|-------|-----------|
| §Animation Decision | Nur animieren wenn selten/nützlich |
| §Easing | Custom ease-out (0.23, 1, 0.32, 1) |
| §Duration | UI < 300ms, Button 160ms |
| §Komponenten (Buttons) | scale(0.97) on:active |
| §Origin-Aware | Popover: transform-origin auf Trigger |
| §Stagger | Slot-Liste 50ms Delay |
| §CSS transform | Nur transform + opacity animieren |
| §Performance | CSS transitions > keyframes für UI |
| §Accessibility | prefers-reduced-motion, hover media query |
| §Review Format | Before/After-Tabelle |
| §Sonner Principles | Gute Defaults, unsichtbare Edge Cases |
