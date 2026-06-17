# Bookando.de – Vercel Neue Account Baseline

> **Stand:** 17.06.2026
> **Team:** agentur-projekte
> **Account:** nexifyai-by-nexify

## Team-Übersicht

| Team | Slug | Status |
|------|------|--------|
| agentur-projekte | `agentur-projekte` | ✅ Aktiv |
| Legacy Account | unbekannt | ❗ Nur Legacy |

## Projekte

### bookando-de (Frontend)

| Attribut | Wert |
|----------|------|
| **Name** | `bookando-de` |
| **Production URL** | `https://bookando-de-one.vercel.app` |
| **Git-Integration** | ✅ Verknüpft (bookando-de) |
| **Framework** | Create React App (zu verifizieren) |
| **Root Directory** | zu verifizieren |
| **Node Version** | 24.x |
| **Umgebungsvariablen** | 0 gesetzt (müssen angelegt werden) |
| **Preview Deployments** | noch keiner |

### bookando-de-riw8 (Backend)

| Attribut | Wert |
|----------|------|
| **Name** | `bookando-de-riw8` |
| **Production URL** | `https://bookando-de-riw8.vercel.app` |
| **Git-Integration** | ✅ Verknüpft (bookando-api) |
| **Framework** | FastAPI (zu verifizieren) |
| **Root Directory** | zu verifizieren |
| **Node Version** | 24.x |
| **Umgebungsvariablen** | 0 gesetzt (müssen angelegt werden) |
| **Preview Deployments** | noch keiner |

### nexifyai-platform-web

| Attribut | Wert |
|----------|------|
| **Name** | `nexifyai-platform-web` |
| **Zugehörigkeit** | NeXify-intern |
| **Status** | ❓ Nicht berühren (nicht Bookando) |

## Vergleich: Alter vs. Neuer Account

| Bereich | Alter Account | Neuer Account (agentur-projekte) | Soll |
|---------|-------------|----------------------------------|------|
| Frontend-Projekt | `bookando-de` | `bookando-de` | Neu |
| Backend-Projekt | `bookando-api` + `build` | `bookando-de-riw8` | Neu |
| Env Vars | vorhanden | 0 | Neu anlegen |
| Domains | bookando.de | bookando-de-one.vercel.app | Nach Cutover |
| Team | unbekannt | agentur-projekte | Neu |

## Ausstehend

1. [ ] Env-Variablen anlegen (Supabase, Stripe, Resend, CORS, API)
2. [ ] Preview Deployment testen
3. [ ] Build konfigurieren (Root Directory, Framework, Build Command)
4. [ ] Domain konfigurieren
5. [ ] Secret Rotation durchführen
6. [ ] Security Incident P0 beheben
7. [ ] Production Deployment freigeben

## Verbote

- ❌ Kein Production-Deployment ohne Freigabe
- ❌ Keine Domain-Änderungen
- ❌ Keine Legacy-Projekt-Löschung
- ❌ Keine kostenpflichtigen Vercel-Agent-Funktionen ohne Preisprüfung
