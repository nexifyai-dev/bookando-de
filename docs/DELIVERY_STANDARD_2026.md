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
