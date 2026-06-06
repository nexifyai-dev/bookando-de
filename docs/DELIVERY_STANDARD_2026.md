# Bookando — Delivery Standard 2026

> **Stand:** 06.06.2026 | **Ziel:** Weniger Fehler, schnellere Umsetzung

---

## 1. Vor jeder Änderung

### 1.1 Kontext prüfen
- Brain/Memory nach relevantem Kontext abfragen
- Aktuelle Projektmatrix prüfen
- API-Contract prüfen (OpenAPI)
- Bestehende Patterns im Code prüfen

### 1.2 Preflight
```bash
./scripts/preflight-bookando.sh --quick
```
- Git-Status sauber?
- keine `.env`/`.env.vercel`/`.env.deploy` staged?
- Build läuft?

## 2. Während der Umsetzung

### 2.1 Technik-Standard

| Bereich | Standard | Begründung |
|---------|----------|------------|
| Datenabruf | `useAutoRefresh` (TanStack Query) | Kein manuelles `useState`+`useEffect`+`fetch` |
| Mutationen | `usePortalMutation` | Auto-invalidation, kein manuelles Refetch |
| Query Keys | `[bereich, subjekt]` z.B. `['vendor', 'services']` | Konsistente Invalidierung |
| API-Client | `apiClient` aus `lib/apiClient.js` | Axios-Instanz mit Token-Refresh |
| OpenAPI | Backend liefert `/openapi.json` | Source of Truth für Contracts |
| Formulare | Bestehende Modals/Drawers | Kein neues Modal-System |

### 2.2 Änderungs-Disziplin

```
KEINE Regex-Massenänderungen ohne Pilot.
Stattdessen:
1. Eine Datei als Pilot umstellen
2. Build
3. Muster extrahieren
4. Nächste Datei gezielt umsetzen
5. Nach jeder Datei Build
```

### 2.4 Reactive Portal State (PFLICHT)

**Regel:** Kontextwechsel — Rollen, Tenants, Sprache, User, Login, Logout, Token-Refresh — müssen **sofort reaktiv** greifen, ohne Browser-Refresh.

| Kontextwechsel | Quelle der Wahrheit | Reaktiver Pfad |
|----------------|--------------------|-----------------|
| Role Switch | `useAuth().activeRole` | `setActiveRole()` → `POST /api/auth/context` → AuthContext-State → re-render |
| Tenant Switch | `useAuth().activeTenant` | `setActiveTenant()` → Server-Validierung → Cache-Invalidation |
| Sprache DE/EN | `i18n.changeLanguage()` | Komponenten greifen via `useTranslation()` zu |
| Login/Logout | AuthContext | `login()`/`logout()` invalidieren Query-Cache komplett |
| User-Update | AuthContext | `refreshUser()` neu, `updateProfile()` patcht State |

**Verboten:**

| Pattern | Warum verboten |
|---------|----------------|
| `window.location.reload()` als Lösung | Erzwingt Full-Page-Reload, verliert App-State, keine Snappy UX |
| `useState(user)` mit nur `[]`-Deps | Liest nur initialen Wert, re-rendert nicht bei User-Änderung |
| `useMemo(navItems, [])` mit hartkodierten Strings | Sprachwechsel zeigt stale deutsche Labels |
| Direkter `localStorage.getItem('user')` in Komponenten | Nicht reaktiv, kein Re-Render bei Storage-Änderung |
| Routen-Dispatch per `window.location.pathname` | Nicht reaktiv, kein Re-Render bei Navigation |

**Erlaubt:**

| Pattern | Zweck |
|---------|-------|
| `useLocation()` | Reaktive Navigation |
| `useAuth().activeRole` | Reaktive Rolle |
| `usePortal().navItems` | Rollenbasierte Nav-Items (re-rendert bei Switch) |
| `queryClient.invalidateQueries()` bei Switch | Frische Daten nach Kontextwechsel |
| `localStorage` für UI-State (z.B. `sidebar_collapsed`) | Persistenz, nicht Auth-State |
| `window.location.reload()` in `ErrorBoundary` | Legitimer App-Reset bei unhandled error |

**Pflicht-Prüfung pro Paket:**

```bash
./scripts/check-portal-state.sh   # 13 statische Checks
```

**Akzeptanzkriterien:**

- Rollenwechsel Vendor→Staff→Customer ohne Browser-Refresh
- Sidebar/Header/Dashboard aktualisieren sofort
- Query-Cache wird invalidiert
- Keine stale Vendor-Daten im Staff-Kontext
- Build erfolgreich
- Vercel Production READY
- Live-Smoke durchgeführt

**Verantwortlich:** Bei jedem Paket, das Auth/Portal/Routing betrifft, ist `check-portal-state.sh` Teil des Pre-Flight.

### 2.5 Lade-Loop-Defense (PFLICHT) — f141e1b

**Lehre aus Bug f141e1b (Ladeschleife `/portal/*`):** Wenn ein `useFoo().bar`-Feld in einer
Komponente destrukturiert und in einem Loading-Guard (`!bar || !user`) verwendet wird, **muss**
`bar` zwingend im Provider-Value exportiert sein. `!undefined === true` ist eine stille Falle
und führt zu permanenten `<LoadingFallback />`-Rendern, ohne sichtbaren Fehler.

**Regel:** Jeder Loading-Guard der Form

```js
const { a, b, isReady, … } = useContext();
if (!isReady || !user) return <LoadingFallback />;
```

muss statisch beweisbar erfüllt sein:

| Prüfpunkt | Werkzeug |
|-----------|----------|
| `isReady` (oder Äquivalent) ist im Provider exportiert | `grep -q "isReady" Provider.js` |
| Provider ist zentrale Quelle, nicht doppelt definiert | `grep -q "isReady: provider.isReady"` |
| Dep-Listen in `useMemo` enthalten `loading`/`user`/`isReady` | manueller Review + ESLint |

**Verboten:**

| Anti-Pattern | Risiko |
|--------------|--------|
| Destrukturieren eines Felds, das im Provider nicht existiert | `!undefined === true` → permanenter Spinner |
| Zwei parallele `isReady`-Definitionen (Provider vs. Context) | Inkonsistenter State, schwer debugbar |
| `isReady: !auth.loading` als Kurzform in einem Sub-Context | Bricht bei abweichender `loading`-Semantik (z.B. `idle | loading | ready`) |

**Pflicht-Prüfung pro Paket:** Die Guards `#11/#12/#13` in `scripts/check-portal-state.sh`
sind Teil des Pre-Flight und blockieren Deploys, wenn `isReady` aus `useAuth()` fehlt.

**Lessons Learned:**

- Bei jedem neuen Feld in einem Context-Value: zentrales `grep` nach allen Konsumenten verpflichtend.
- Statische Regressions-Guards in CI/Skripten: jeder `useFoo().bar`-Aufruf sollte ein
  `check-foo-exports-bar.sh`-Pendant haben, sonst sind stille Defaults (`!undefined === true`)
  die häufigste Fehlerklasse.
- Jeder Bug, der durch fehlende Property-Definition in einem Provider entsteht, ist
  ein Kandidat für einen statischen Guard. Wenn ein Check fehlt: ergänzen.

### 2.3 API-Contract First

Bevor eine Frontend-Änderung deployed wird:
```bash
./scripts/check-api-contract.sh
```
Bestätigen:
- Frontend-sendete Felder sind im Backend vorhanden
- Backend-erwartete Felder werden vom Frontend gesendet
- Keine Mismatches

## 3. Vor dem Commit

### 3.1 Qualitäts-Gates

```bash
# 1. Build
CI=true npm run build

# 2. Keine Secrets staged
git diff --cached --name-only | grep -qiE '\.env|secret|key|token|credential' && echo "SECRET LEAK!"

# 3. Git diff prüfen
git diff --cached --stat
```

## 4. Nach dem Push

### 4.1 Deployment-Gates

```bash
./scripts/preflight-bookando.sh --smoke
```

Prüft:
- Vercel Production READY
- `app.bookando.de` HTTP 200
- Backend Health
- Assets (hero, cta, logos)
- Kritische Routen (/, /marketplace, /auth/login)

### 4.2 API-Contract

```bash
./scripts/check-api-contract.sh
```

Prüft:
- OpenAPI erreichbar
- Wichtige Endpoints vorhanden
- Service/Booking/Commission Payload Felder

## 5. Nach jedem Paket

### 5.1 Dokumentation
- `docs/SYSTEM_TEST_REPORT.md` aktualisieren (Commit, Deploy, Smoke)
- `docs/MASTER_FUNCTIONAL_COMPLETION_PLAN.md` Status updaten
- `docs/PORTAL_ACTION_MATRIX.md` aktualisieren
- `docs/API_COMPLETION_MATRIX.md` aktualisieren

### 5.2 Brain
- Geänderte Dateien
- Commits (Frontend + Backend)
- Deployment-Status
- Offene Lücken
- Nächstes Paket

## 6. Verboten

| Aktion | Grund |
|--------|-------|
| Regex-Massenänderungen ohne Build-Zwischentest | Zerstört Code |
| `useState` + `useEffect` + manuelles `fetch` in neuen Portal-Seiten | useAutoRefresh existiert |
| Secrets in Commits/Logs/Berichten | Security-Leak |
| API-Payload ohne OpenAPI-Check | Contract-Break |
| "Build CLEAN" ohne Live-Smoke | Deployment kann trotzdem fehlschlagen |
| "Deployed" ohne Vercel READY | Deployment nicht abgeschlossen |
| package.json-Änderung ohne npm install | Broken Build |
