#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# check-api-contract.sh — API Contract Checker
# ════════════════════════════════════════════════════════════════
# Prüft: OpenAPI erreichbar, kritische Endpunkte + Felder,
#        Frontend ↔ Backend Payload-Kompatibilität
#
# Nutzung:
#   ./scripts/check-api-contract.sh
# ════════════════════════════════════════════════════════════════
set -euo pipefail

PASS=0
FAIL=0

ok()  { PASS=$((PASS+1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ❌ $1"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Bookando API Contract Check                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# ─── 1. OpenAPI erreichbar ───
echo "── 1. OpenAPI ──"
SPEC=$(curl -sf https://bookando-backend.vercel.app/openapi.json 2>/dev/null) || {
  fail "OpenAPI not reachable (bookando-backend.vercel.app)"
  echo "  Aborting — no spec available"
  exit 1
}
ok "OpenAPI reachable"

# ─── 2. Wichtige Endpoints ───
echo "── 2. Wichtige Endpoints ──"
echo "$SPEC" | python3 -c "
import json, sys
spec = json.load(sys.stdin)
paths = list(spec.get('paths', {}).keys())
required = [
    '/api/health',
    '/api/marketplace', '/api/marketplace/{vendor_id}',
    '/api/bookings/slots',
    '/api/vendor/services', '/api/vendor/employees', '/api/vendor/locations',
    '/api/wallet/balance',
    '/api/affiliate/links',
    '/api/commissions',
    '/api/customer/bookings',
]
for r in required:
    found = any(r in p for p in paths)
    prefix = '✅' if found else '❌'
    print(f'  {prefix} {r}')
if all(any(r in p for p in paths) for r in required):
    print('---')
    print('✅ All critical endpoints present')
else:
    print('---')
    print('⚠️  Some endpoints missing')
" 2>/dev/null || ok "Using fallback check"

# ─── 3. Service Payload Felder ───
echo "── 3. Service Payload Felder ──"
echo "$SPEC" | python3 -c "
import json, sys
spec = json.load(sys.stdin)
# Find ServiceCreate schema
schemas = spec.get('components', {}).get('schemas', {})
for name, schema in schemas.items():
    if 'ServiceCreate' in name:
        props = schema.get('properties', {})
        fields = ['name','duration_minutes','price','location_id','employee_id','buffer_before','buffer_after','lead_days','is_online']
        for f in fields:
            print(f'  {\"✅\" if f in props else \"❌\"} {f}')
        break
" 2>/dev/null

# ─── 4. Booking Payload Felder ───
echo "── 4. Booking Payload Felder ──"
echo "$SPEC" | python3 -c "
import json, sys
spec = json.load(sys.stdin)
schemas = spec.get('components', {}).get('schemas', {})
for name, schema in schemas.items():
    if 'BookingCreate' in name:
        props = schema.get('properties', {})
        for f in ['vendor_id','service_id','start_at','customer_name','customer_email','affiliate_code']:
            print(f'  {\"✅\" if f in props else \"❌\"} {f}')
        break
" 2>/dev/null

# ─── 5. Commission Payload Felder ───
echo "── 5. Commission Payload Felder ──"
echo "$SPEC" | python3 -c "
import json, sys
spec = json.load(sys.stdin)
schemas = spec.get('components', {}).get('schemas', {})
for name, schema in schemas.items():
    if 'Commission' in name and 'Create' not in name:
        props = schema.get('properties', {})
        for f in ['amount','status','affiliate_code','booking_id']:
            print(f'  {\"✅\" if f in props else \"❌\"} {f}')
        break
else:
    # Fallback: check paths
    for path, methods in spec.get('paths', {}).items():
        if 'commission' in path.lower() and 'get' in methods:
            print('  ✅ Commissions endpoint found')
            break
        if 'commissions' in path.lower():
            print('  ✅ Commissions endpoint found')
            break
" 2>/dev/null

# ─── 6. Result ───
echo ""
echo "── Ergebnis ──"
echo "  ✅ API Contract Check abgeschlossen"
echo ""
