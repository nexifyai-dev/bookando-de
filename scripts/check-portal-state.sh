#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# check-portal-state.sh — Statische Prüfung der reaktiven Portal-State-Architektur
# ════════════════════════════════════════════════════════════════
# Prüft:
#  - Kein window.location.reload in Portal-Kontextwechseln
#  - activeRole/activeTenant via useAuth()/usePortal() (nicht direkt localStorage)
#  - Query-Invalidation bei Kontextwechsel vorhanden
#  - Reaktive Switcher-Komponenten existieren
#  - Reaktive Route-Korrektur in PortalContext
#
# Nutzung:
#   ./scripts/check-portal-state.sh
#
# Exit-Code:
#   0 — alle Checks bestanden
#   1 — eine oder mehrere Prüfungen fehlgeschlagen
# ════════════════════════════════════════════════════════════════
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src"
SCRIPTS="$ROOT/scripts"
PASS=0
FAIL=0

ok()   { PASS=$((PASS+1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ❌ $1"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Bookando Portal-State Static Check                   ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# ─── 1. window.location.reload in Portal-Kontext ──────────────
echo "── 1. Verbotene window.location.reload in Portal-Kontext ──"
# Filtere ALLE Kommentare (// und /* */) und ErrorBoundary heraus
# Wir suchen Zeilen, die NICHT in einem Kommentar sind und einen
# echten window.location.reload()-Call enthalten.
BAD_RELOADS=$(grep -rn "window\.location\.reload" "$SRC" 2>/dev/null \
  | grep -v "ErrorBoundary" \
  | awk -F: '
    {
      # Extrahiere den Code-Teil der Zeile (alles nach PFAD:ZEILE:)
      code = ""
      for (i = 3; i <= NF; i++) code = code (i == 3 ? "" : ":") $i;
      # Entferne führende Whitespace
      sub(/^[[:space:]]+/, "", code);
      # Skip Kommentarzeilen
      if (code ~ /^\/\//) next;
      if (code ~ /^\*/) next;
      if (code ~ /^\/\*/) next;
      # Echte Calls: window.location.reload() mit Argument-Liste
      if (code ~ /window\.location\.reload[[:space:]]*\(/) {
        print $0;
      }
    }
  ' || true)
if [ -z "$BAD_RELOADS" ]; then
  ok "Kein window.location.reload außer ErrorBoundary (legitimer App-Reset)"
else
  fail "window.location.reload in Portal-Kontext gefunden:"
  echo "$BAD_RELOADS" | sed 's/^/      /'
fi

# ─── 2. useAuth() in PortalLayout vorhanden ───────────────────
echo ""
echo "── 2. PortalLayout nutzt useAuth() reaktiv ──"
if grep -q "useAuth" "$SRC/App.js" && grep -q "useLocation" "$SRC/App.js"; then
  ok "App.js nutzt useAuth() + useLocation() reaktiv"
else
  fail "App.js nutzt nicht useAuth()/useLocation()"
fi

# ─── 3. PortalContext mit reaktiver navItems ──────────────────
echo ""
echo "── 3. PortalContext mit reaktiver navItems ──"
if [ -f "$SRC/contexts/PortalContext.js" ]; then
  if grep -q "navItems" "$SRC/contexts/PortalContext.js" && \
     grep -q "useLocation" "$SRC/contexts/PortalContext.js"; then
    ok "PortalContext.js vorhanden mit navItems + useLocation"
  else
    fail "PortalContext.js unvollständig (navItems/useLocation fehlt)"
  fi
else
  fail "PortalContext.js fehlt"
fi

# ─── 4. AuthContext hat setActiveContext/Role/Tenant ─────────
echo ""
echo "── 4. AuthContext mit reaktivem Kontextwechsel ──"
if [ -f "$SRC/contexts/AuthContext.js" ]; then
  if grep -q "setActiveContext\|setActiveRole\|setActiveTenant" "$SRC/contexts/AuthContext.js"; then
    ok "AuthContext.js exportiert setActiveRole/Tenant/Context"
  else
    fail "AuthContext.js: keine setActive*-Funktionen"
  fi
  if grep -q "invalidateQueries" "$SRC/contexts/AuthContext.js"; then
    ok "AuthContext invalidiert Query-Cache bei Switch"
  else
    fail "AuthContext: keine queryClient.invalidateQueries()-Calls"
  fi
else
  fail "AuthContext.js fehlt"
fi

# ─── 5. Switcher-Komponenten existieren ───────────────────────
echo ""
echo "── 5. Switcher-Komponenten (Role/Tenant/Language) ──"
SWITCHERS="$SRC/components/portal/PortalSwitchers.js"
if [ -f "$SWITCHERS" ]; then
  for name in RoleSwitcher TenantSwitcher LanguageSwitcher; do
    if grep -q "export function $name" "$SWITCHERS"; then
      ok "$name exportiert"
    else
      fail "$name fehlt in $SWITCHERS"
    fi
  done
else
  fail "PortalSwitchers.js fehlt ($SWITCHERS)"
fi

# ─── 6. Switcher im PortalShell eingebunden ───────────────────
echo ""
echo "── 6. Switcher in PortalShell eingebunden ──"
if grep -q "RoleSwitcher\|TenantSwitcher\|LanguageSwitcher" "$SRC/components/layout/PortalShell.js"; then
  ok "PortalShell referenziert Switcher-Komponenten"
else
  fail "PortalShell bindet keine Switcher ein"
fi

# ─── 7. Backend: POST /api/auth/context Endpoint ──────────────
echo ""
echo "── 7. Backend POST /api/auth/context ──"
AUTH_ROUTES="$ROOT/../bookando-backend/api/auth_routes.py"
if [ -f "$AUTH_ROUTES" ]; then
  if grep -q "/context" "$AUTH_ROUTES" && grep -q "SwitchContextRequest" "$AUTH_ROUTES"; then
    ok "Backend hat /auth/context mit SwitchContextRequest"
  else
    fail "Backend: /auth/context oder SwitchContextRequest fehlt"
  fi
else
  fail "Backend auth_routes.py nicht gefunden ($AUTH_ROUTES)"
fi

# ─── 8. Backend: _profile_from_db mit roles/active_role ───────
echo ""
echo "── 8. Backend _profile_from_db liefert roles/active_role ──"
if grep -q "active_role" "$AUTH_ROUTES" && grep -q "\"roles\"" "$AUTH_ROUTES"; then
  ok "_profile_from_db liefert roles + active_role"
else
  fail "_profile_from_db: roles/active_role fehlt"
fi

# ─── 9. Migration für users.roles existiert ───────────────────
echo ""
echo "── 9. SQL-Migration für users.roles/active_role ──"
MIG_DIR="$ROOT/../bookando-backend/supabase/migrations"
if [ -d "$MIG_DIR" ]; then
  MIG=$(grep -l "active_role\|users.roles" "$MIG_DIR"/*.sql 2>/dev/null | head -1 || true)
  if [ -n "$MIG" ]; then
    ok "Migration gefunden: $(basename "$MIG")"
  else
    fail "Keine SQL-Migration mit active_role/users.roles"
  fi
else
  fail "Migrations-Verzeichnis fehlt: $MIG_DIR"
fi

# ─── 10. Keine direkten localStorage-Role-Reads im PortalLayout ─
echo ""
echo "── 10. Kein direkter localStorage-Role-Read in Portal-Layout ──"
# Erlaubt: localStorage für UI-State (collapsed sidebar) o.ä.
# Verboten: direkter Role-Read
BAD_LS=$(grep -rn "localStorage\.getItem" "$SRC/components/layout" "$SRC/App.js" 2>/dev/null \
  | grep -i "role\|user\." | grep -v "sidebar_collapsed" || true)
if [ -z "$BAD_LS" ]; then
  ok "Kein direkter Role-Read aus localStorage in Portal-Layout"
else
  fail "Verdächtiger localStorage-Role-Read:"
  echo "$BAD_LS" | sed 's/^/      /'
fi

# ─── 11. useAuth() exportiert isReady (sonst: Ladeschleife!) ──
echo ""
echo "── 11. useAuth() exportiert isReady (verhindert Ladeschleife) ──"
# isReady MUSS in AuthContext.js in den destructure/return-Block
# aufgenommen werden, sonst rendert PortalLayout permanent LoadingFallback.
if grep -q "isReady" "$SRC/contexts/AuthContext.js" \
   && grep -q "isReady" "$SRC/App.js" \
   && grep -qE "isReady[[:space:]]*[:=]" "$SRC/contexts/AuthContext.js"; then
  ok "isReady ist im AuthContext definiert und in App.js konsumiert"
else
  fail "isReady fehlt in AuthContext.js oder App.js — Risiko: Ladeschleife"
fi

# ─── 12. PortalLayout rendert NICHT permanent LoadingFallback ──
echo ""
echo "── 12. PortalLayout-Loading-Guard kombiniert isReady+user ──"
# Der Guard muss isReady UND user prüfen, damit nicht permanent
# LoadingFallback angezeigt wird, wenn isReady undefined ist.
GUARD=$(sed -n '/PortalLayout/,/^function /p' "$SRC/App.js" \
  | grep -A3 "isReady\|loading" | head -20 || true)
if echo "$GUARD" | grep -q "isReady" && echo "$GUARD" | grep -q "user"; then
  ok "PortalLayout prüft isReady + user"
else
  fail "PortalLayout-Loading-Guard fehlt oder ist unvollständig"
fi

# ─── 13. PortalContext.isReady nutzt auth.isReady (zentral) ───
echo ""
echo "── 13. PortalContext.isReady delegiert an auth.isReady ──"
if grep -q "isReady: auth.isReady" "$SRC/contexts/PortalContext.js"; then
  ok "PortalContext.isReady delegiert an auth.isReady"
else
  fail "PortalContext.isReady sollte auth.isReady nutzen, nicht auth.loading"
fi

# ─── Zusammenfassung ───────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Result: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
