#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# preflight-bookando.sh — Pre-Flight Check vor Deployment
# ════════════════════════════════════════════════════════════════
# Prüft: Git-Status, Secrets, Build, Backend Health, OpenAPI,
#        Frontend Live-Smoke, kritische Assets
#
# Nutzung:
#   ./scripts/preflight-bookando.sh          # kompletter Check
#   ./scripts/preflight-bookando.sh --quick  # nur Git + Build
#   ./scripts/preflight-bookando.sh --smoke  # nur Live-Smoke
# ════════════════════════════════════════════════════════════════
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
QUICK=false
SMOKE=false
PASS=0
FAIL=0

for arg in "$@"; do
  case "$arg" in
    --quick) QUICK=true; SMOKE=false ;;
    --smoke) SMOKE=true; QUICK=true ;;
  esac
done

ok()   { PASS=$((PASS+1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ❌ $1"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Bookando Pre-Flight Check                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo "  Mode: $([ "$SMOKE" = true ] && echo 'Smoke' || ([ "$QUICK" = true ] && echo 'Quick' || echo 'Full'))"
echo ""

# ─── 1. Git Status ───
if [ "$QUICK" = false ]; then
  echo "── 1. Git Status ──"
  cd "$ROOT"
  if git diff --quiet && git diff --cached --quiet; then
    ok "Working tree clean"
  else
    unstaged=$(git status --short | wc -l)
    echo "  ⚠️  $unstaged uncommitted changes"
    if git diff --cached --quiet; then
      ok "No staged files"
    else
      git diff --cached --name-only | while read -r f; do
        if echo "$f" | grep -qiE '\.env|secret|key|token|credential'; then
          fail "SECRET LEAK: $f staged!"
        fi
      done
    fi
  fi
fi

# ─── 2. Build ───
echo "── 2. Build Check ──"
cd "$ROOT"
if [ -d build ]; then
  ok "Build directory exists"
else
  echo "  ⚠️  Build directory missing. Building..."
  if CI=true npm run build 2>/dev/null; then
    ok "Build successful"
  else
    fail "Build failed"
  fi
fi

# ─── 3. Backend Health ───
if [ "$QUICK" = false ] || [ "$SMOKE" = true ]; then
  echo "── 3. Backend Health ──"
  if health=$(curl -sf https://bookando-de-riw8.vercel.app/api/health 2>/dev/null); then
    ok "Backend healthy: $(echo "$health" | grep -o '"status":"[^"]*"' | head -1 | tr -d '"')"
  else
    fail "Backend not reachable"
  fi
fi

# ─── 4. OpenAPI ───
if [ "$QUICK" = false ]; then
  echo "── 4. OpenAPI ──"
  if curl -sf -o /dev/null https://bookando-de-riw8.vercel.app/openapi.json 2>/dev/null; then
    ok "OpenAPI schema reachable"
  else
    fail "OpenAPI schema not reachable"
  fi
fi

# ─── 5. Frontend Live-Smoke ───
if [ "$QUICK" = false ] || [ "$SMOKE" = true ]; then
  echo "── 5. Frontend Live-Smoke ──"
  for url in \
    "https://www.bookando.de/" \
    "https://www.bookando.de/marketplace" \
    "https://www.bookando.de/auth/login" \
    "https://www.bookando.de/legal/privacy"
  do
    if curl -sf -o /dev/null "$url" 2>/dev/null; then
      ok "$url"
    else
      fail "$url"
    fi
  done
fi

# ─── 6. Assets ───
if [ "$QUICK" = false ] || [ "$SMOKE" = true ]; then
  echo "── 6. Kritische Assets ──"
  for asset in \
    "https://www.bookando.de/images/hero-grafik.png" \
    "https://www.bookando.de/images/cta-grafik.png" \
    "https://www.bookando.de/images/brand-logo-horizontal.png"
  do
    size=$(curl -sI "$asset" 2>/dev/null | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
    if [ -n "$size" ] && [ "$size" -gt 10000 ]; then
      ok "$(basename $asset) ($(numfmt --to=iec $size 2>/dev/null || echo "$size bytes"))"
    else
      fail "$asset — size: $size"
    fi
  done
fi

# ─── Result ───
echo ""
echo "── Ergebnis ──"
if [ "$FAIL" -eq 0 ]; then
  echo "  ✅ $PASS checks passed, 0 failed"
else
  echo "  ⚠️  $PASS passed, $FAIL failed"
fi
echo ""
exit $FAIL
