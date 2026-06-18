# Bookando.de – Vercel Infrastructure Inventory

## Environment-Variablen (Name-only, keine Werte)

| Variable | FE benötigt | BE benötigt | Neu setzen | Rotation nötig |
|----------|:-----------:|:-----------:|:----------:|:--------------:|
| REACT_APP_BACKEND_URL | ✅ | — | ✅ | — |
| SUPABASE_URL | — | ✅ | ✅ | — |
| SUPABASE_SERVICE_KEY | — | ✅ | ✅ | 🔴 Ja (committed) |
| SUPABASE_ANON_KEY | — | ✅ | ✅ | 🔴 Ja (committed) |
| SUPABASE_JWT_SECRET | — | ✅ | ✅ | 🔴 Ja (committed) |
| CORS_ORIGINS | — | ✅ | ✅ | — |
| STRIPE_SECRET_KEY | — | optional | ✅ | — |
| STRIPE_WEBHOOK_SECRET | — | optional | ✅ | — |
| RESEND_API_KEY | — | optional | ✅ | — |
| RESEND_DOMAIN | — | optional | ✅ | — |
| S3_BUCKET | — | optional | ✅ | — |
| S3_REGION | — | optional | ✅ | — |
| S3_ACCESS_KEY | — | optional | ✅ | — |
| S3_SECRET_KEY | — | optional | ✅ | — |

## Projekt Mapping

| Service | Alt (Legacy) | Neu (agentur-projekte) | Soll-Name |
|---------|-------------|----------------------|-----------|
| Frontend | bookando-de (Alt) | bookando-de (Neu) | bookando-de |
| Backend | bookando-de-riw8.vercel.app | bookando-de-riw8.vercel.app | bookando-de-riw8 |
| Build (rätselhaft) | existiert | ❌ nicht übernommen | – |
| Domains | bookando.de | bookando-de-one.vercel.app (vorläufig) | – |

> **Backend-Projekt:** `bookando-de-riw8` ist bereits mit `nexifyai-dev/bookando-api` verknüpft.
> Das GitHub-Repository heißt bookando-api.
> Das bestehende Vercel-Projekt heißt bookando-de-riw8.
> Eine Umbenennung ist aktuell weder erforderlich noch Bestandteil dieses Vorgangs.
> Git-Verknüpfung und Deployment-Historie bleiben erhalten.

## Security Incident (P0)

**Gefundene Secrets im Code (als Default-Parameter):**
1. `SUPABASE_SERVICE_KEY` in `api/config.py:11`, `api/db.py:15`
2. `SUPABASE_ANON_KEY` in `api/config.py:12`, `api/db.py:16`, `api/security.py:17`
3. `SUPABASE_JWT_SECRET` in `api/db.py:17`, `api/security.py:46,51`

**Maßnahmen:**
1. Neue Keys im Supabase-Dashboard generieren
2. Neue Keys im neuen Vercel-Account als Environment-Variablen setzen
3. Code-Defaults durch leere Strings ersetzen
4. Legacy-Keys widerrufen
5. Preview testen
6. Production freigeben (nach Freigabe)
