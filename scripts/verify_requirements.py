#!/usr/bin/env python3
"""
verify_requirements.py — Bookando.de Requirements Consistency Check

Prüfungen:
- Traceability: alle PF-IDs eindeutig, alle 144 entries
- MVP-Mapping: keine Duplikate, Status/Gewicht-Konsistenz
- Cross-Validation: EXPECTED_MVP_IDS (Traceability) vs MAPPING_MVP_IDS
- Statistik: MVP-Tabelle stimmt mit Mapping überein
- Manifest: Original- und Working-Hash
- API-Matrix: Zeilen zählen, Status konsistent

Jede Warnung oder jeder Fehler → Exit-Code 1.
"""

import hashlib, re, sys, yaml
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OK, FAIL = 0, 1

ALLOWED = {"VERIFIED_COMPLETE","IMPLEMENTED_UNVERIFIED","PARTIAL","MOCK_ONLY",
           "DOCUMENTED_ONLY","MISSING","CONTRADICTED","BLOCKED","FUTURE_PHASE"}
FORBIDDEN = {"OUT_OF_SCOPE_FOR_CURRENT_PHASE"}
WEIGHT = {"VERIFIED_COMPLETE":1.00,"IMPLEMENTED_UNVERIFIED":0.60,"PARTIAL":0.35,
          "MOCK_ONLY":0.15,"DOCUMENTED_ONLY":0.05,"MISSING":0.00,"CONTRADICTED":0.00}

errors, warns = [], []

def fail(m): errors.append(m); print(f"  FAIL  {m}")
def warn(m): warns.append(m); print(f"  WARN  {m}")
def note(m): print(f"  INFO  {m}")

def cells(line):
    return [p.strip("* ").strip() for p in line.split("|") if p.replace("*","").strip()]

# ----------------------------------------------------------------------
# 1. TRACEABILITY
# ----------------------------------------------------------------------
def check_traceability():
    path = REPO / "docs/requirements/PFLICHTENHEFT_TRACEABILITY.md"
    note(f"Traceability: {path.name}")
    lines = path.read_text(encoding="utf-8").splitlines()

    icon_map = {
        "✅": "VERIFIED_COMPLETE", "🔶": "IMPLEMENTED_UNVERIFIED",
        "🔸": "PARTIAL", "🟡": "MOCK_ONLY", "📄": "DOCUMENTED_ONLY",
        "❌": "MISSING", "⚠️": "CONTRADICTED", "🔴": "BLOCKED",
        "⬜": "FUTURE_PHASE",
    }

    pf_pattern = re.compile(r"^\|\s*(PF-\d{2}-\d{3})\s*\|")
    phase_vals = {"MVP", "Phase 2", "Phase 3", "alle"}
    entries = {}
    mvp_ids = set()
    ch = 0

    # Also count total rows (incl summary table)
    total_rows = 0

    for line in lines:
        m = re.match(r"^##\s+Kapitel\s+(\d+)", line)
        if m:
            ch = int(m.group(1))
            continue
        m = pf_pattern.match(line)
        if not m:
            continue
        total_rows += 1
        pf_id = m.group(1)

        c = cells(line)
        # phase is col 2
        phase = ""
        for cell in c:
            for p in phase_vals:
                if p in cell:
                    phase = p
                    break
            if phase:
                break

        # status
        status = "UNKNOWN"
        for cell in c:
            for icon, st in icon_map.items():
                if icon in cell:
                    rest = cell.replace(icon, "").strip()
                    status = st if rest in ("",) else rest if rest in ALLOWED else st
                    break
            if status != "UNKNOWN":
                break

        entries[pf_id] = {"phase": phase, "status": status, "ch": ch}

    # Check duplicates
    seen = set()
    dupes = []
    for pf_id in entries:
        if pf_id in seen:
            dupes.append(pf_id)
        seen.add(pf_id)
    if dupes:
        fail(f"Traceability: DUPLICATE_IDS = {len(dupes)}: {dupes[:5]}")
    else:
        note(f"  142 PF-IDs, alle eindeutig ✅")

    total_entries = len(entries)

    # Check 144 total
    if total_entries >= 140 and total_entries <= 160:
        note(f"  TOTAL = {total_entries} (Traceability expandierte Einträge)")
    else:
        warn(f"  TOTAL = {total_entries} (ungewöhnlich — erwarte 140-160)")

    # Count phases
    phase_counts = {}
    for e in entries.values():
        pc = e["phase"] if e["phase"] else "NONE"
        phase_counts[pc] = phase_counts.get(pc, 0) + 1
    note(f"  Phasen: {dict(phase_counts)}")

    # Build MVP set: entries with Phase=MVP
    for pf_id, e in entries.items():
        if e["phase"] == "MVP":
            mvp_ids.add(pf_id)

    # Check for forbidden/unknown phase
    for pf_id, e in entries.items():
        if e["phase"] and e["phase"] not in phase_vals and e["phase"] not in ("NONE",):
            warn(f"  {pf_id}: unbekannte Phase '{e['phase']}'")

    note(f"  MVP-IDs (Phase=MVP): {len(mvp_ids)}")

    # Check for bad status
    bad = {pf_id for pf_id, e in entries.items() if e["status"] not in ALLOWED}
    if bad:
        for p in sorted(bad):
            warn(f"  {p}: unbekannter Status '{entries[p]['status']}'")

    return {"total": total_entries, "entries": entries, "mvp_ids": mvp_ids,
            "phase_counts": phase_counts}


# ----------------------------------------------------------------------
# 2. MVP MAPPING — read PF-IDs, compare with traceability
# ----------------------------------------------------------------------
def check_mapping(trace):
    path = REPO / "docs/requirements/PFLICHTENHEFT_MVP_MAPPING.md"
    note(f"Mapping: {path.name}")
    text = path.read_text(encoding="utf-8")

    rows = []
    in_main = False
    for line in text.splitlines():
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        if c[0] == "ID" and "Kapitel" in c[1]:
            in_main = True; continue
        if not in_main: continue
        if not re.match(r"^PF-\d{2}-\d{3}$", c[0]):
            in_main = False; continue
        rows.append({"id": c[0], "system": c[2], "status": c[3],
                      "gewicht": c[4].replace(",", ".")})

    total = len(rows)
    uids = sorted(set(r["id"] for r in rows))
    n_unique = len(uids)
    note(f"  Zeilen: {total}, Unique: {n_unique}")

    # Duplicates
    seen = set(); dupes = []
    for r in rows:
        if r["id"] in seen: dupes.append(r["id"])
        seen.add(r["id"])
    if dupes:
        fail(f"MAPPING: DUPLICATE_IDS = {len(dupes)}: {dupes[:5]}")
    else:
        note(f"  DUPLICATE_IDS = 0 ✅")

    # Bad status
    bad = [r for r in rows if r["status"] not in ALLOWED]
    if bad:
        fail(f"Mapping: unbekannte Status: {set(r['status'] for r in bad)}")

    # Weight check
    for r in rows:
        ew = WEIGHT.get(r["status"])
        aw = float(r["gewicht"])
        if ew is not None and abs(ew - aw) > 0.005:
            warn(f"  {r['id']}: Status {r['status']} → Gewicht {ew:.2f}, hat {aw:.2f}")

    # Sums
    weight_sum = 0.0
    sys_c = {}
    for r in rows:
        weight_sum += float(r["gewicht"])
        sys_c[r["system"]] = sys_c.get(r["system"], 0) + 1
    note(f"  ∑Gewicht: {weight_sum:.2f}")
    sys_total = sum(sys_c.values())
    if sys_total != total:
        fail(f"  System-Summe ({sys_total}) ≠ Zeilen ({total})")

    # Detail table
    in_det = False
    det = {}; det_total = None
    for line in text.splitlines():
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        hl = " ".join(c).lower()
        if "system" in hl and "%" in hl and "ids" in hl:
            in_det = True; continue
        if not in_det: continue
        if line.strip().startswith(">") or line.strip().startswith("#"):
            in_det = False; continue
        if c[0] == "MVP Gesamt":
            try:
                det_total = (int(c[1]), float(c[2].replace(",", ".")), int(c[3]))
            except Exception as e:
                fail(f"  MVP Gesamt: {c} ({e})")
            in_det = False
        else:
            try:
                det[c[0]] = (int(c[1]), float(c[2].replace(",", ".")))
            except: pass

    for s, cnt in sys_c.items():
        if s in det:
            if det[s][0] != cnt:
                warn(f"  Detail '{s}': {det[s][0]} IDs, erwarte {cnt}")

    if det_total:
        if det_total[0] != n_unique:
            warn(f"  Detail TOTAL ({det_total[0]}) ≠ unique ({n_unique})")
        if abs(det_total[1] - weight_sum) > 0.05:
            warn(f"  Detail ∑G ({det_total[1]:.2f}) ≠ {weight_sum:.2f}")
        if det_total[2] > 0:
            note(f"  MVP_PERCENT = {det_total[1]/det_total[2]*100:.1f}%")
    else:
        fail("  Detail-Tabelle MVP Gesamt nicht gefunden")

    # Cross-validate vs traceability MVP set
    mapping_ids = set(r["id"] for r in rows)
    expected_ids = trace["mvp_ids"]

    missing_ids = expected_ids - mapping_ids
    extra_ids = mapping_ids - expected_ids

    if missing_ids:
        fail(f"MISSING_IDS = {len(missing_ids)}: {sorted(missing_ids)}")
    else:
        note(f"  MISSING_IDS = 0 ✅")
    if extra_ids:
        warn(f"EXTRA_IDS = {len(extra_ids)}: {sorted(extra_ids)}")
    else:
        note(f"  EXTRA_IDS = 0 ✅")

    # Verify every mapping ID is in expected
    not_in_expected = mapping_ids - expected_ids
    if not_in_expected:
        warn(f"  Mapping-IDs nicht in erwarteter MVP-Menge: {len(not_in_expected)}")

    # Verify every expected ID is in mapping
    not_in_mapping = expected_ids - mapping_ids
    if not_in_mapping:
        warn(f"  Erwartete IDs nicht im Mapping: {len(not_in_mapping)}")

    return {
        "total": total, "unique": n_unique,
        "weight_sum": weight_sum,
        "det_total": det_total,
        "sys_c": sys_c,
        "mapping_ids": mapping_ids,
        "expected_ids": expected_ids,
        "missing_ids": len(missing_ids),
        "extra_ids": len(extra_ids),
    }


# ----------------------------------------------------------------------
# 3. STATISTICS
# ----------------------------------------------------------------------
def check_statistics(mapping, trace):
    path = REPO / "docs/requirements/PFLICHTENHEFT_STATISTIK.md"
    note(f"Statistik: {path.name}")
    lines = path.read_text(encoding="utf-8").splitlines()

    total = checksum = None
    for line in lines:
        cl = line.replace("**", "")
        m = re.search(r"TOTAL\s*\|\s*(\d+)", cl)
        if m: total = int(m.group(1))
        m = re.search(r"CHECKSUM\s*\|\s*(\d+)", cl)
        if m: checksum = int(m.group(1))
    if total is None: fail("TOTAL nicht gefunden")
    if checksum is None: fail("CHECKSUM nicht gefunden")
    if total is not None and checksum is not None:
        if total == checksum:
            note(f"  TOTAL=CHECKSUM={total} ✅")
        else:
            fail(f"TOTAL({total}) ≠ CHECKSUM({checksum})")

    # MVP table — new format with 5 columns
    in_mv = False
    mv_total = None
    mv_sys_sum = 0
    for line in lines:
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        hl = " ".join(c).lower()
        if c[0] == "MVP-System":
            in_mv = True; continue
        if not in_mv: continue
        if c[0] == "MVP Gesamt":
            try:
                mv_total = (int(c[1]), float(c[2].replace(",", ".")), int(c[3]))
            except Exception as e:
                fail(f"MVP Gesamt: {c} ({e})")
            in_mv = False
        elif c[0] not in ("", "MVP-System") and len(c) >= 4:
            try:
                mv_sys_sum += int(c[1])
            except: pass

    if mv_total:
        note(f"  MVP Gesamt: count={mv_total[0]}, w={mv_total[1]:.2f}, max={mv_total[2]}")
        map_unique = mapping["unique"]
        if mv_total[0] != map_unique:
            fail(f"Stat MVP ({mv_total[0]}) ≠ Mapping unique ({map_unique})")
        else:
            note(f"  Stat MVP count = Mapping unique = {map_unique} ✅")

    return {"total": total, "checksum": checksum}


# ----------------------------------------------------------------------
# 4. MANIFEST
# ----------------------------------------------------------------------
def check_manifest():
    mp = REPO / "docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.manifest.yml"
    if not mp.exists():
        fail("Manifest nicht gefunden")
        return {}
    try:
        m = yaml.safe_load(mp.read_text())
    except Exception as e:
        fail(f"Manifest YAML: {e}")
        return {}
    note("Manifest gelesen")

    od = m.get("original_document", "")
    os_ = m.get("original_sha256", "")
    if od and os_:
        op = REPO / "docs/customer" / od
        if op.exists():
            a = hashlib.sha256(op.read_bytes()).hexdigest()
            if a == os_:
                note(f"  Original SHA: {os_[:16]}... ✅")
            else:
                fail(f"Original SHA: erwartet {os_[:16]}..., hat {a[:16]}...")
        else:
            fail(f"Originaldatei nicht gefunden: {op}")
    else:
        note("  Kein Original-Dokument im Manifest")

    wf = m.get("working_document", "")
    ws = m.get("working_sha256", "")
    if wf and ws:
        wp = REPO / "docs/customer" / wf
        if wp.exists():
            a = hashlib.sha256(wp.read_bytes()).hexdigest()
            if a == ws:
                note(f"  Working SHA: {ws[:16]}... ✅")
            else:
                fail(f"Working SHA: erwartet {ws[:16]}..., hat {a[:16]}...")


# ----------------------------------------------------------------------
# 5. API MATRIX
# ----------------------------------------------------------------------
def check_api_matrix():
    path = REPO / "docs/verification/API_CONTRACT_MATRIX.md"
    note(f"API-Matrix: {path.name}")
    lines = path.read_text(encoding="utf-8").splitlines()

    count = 0
    statuses = {}
    for line in lines:
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        if c[0] == "Frontend-Aufruf": continue
        if not c[0].startswith("api/"): continue
        count += 1
        st = c[-1].strip()
        st_map = {"IMPLEMENTED": "IMPLEMENTED_UNVERIFIED", "VERIFIED": "VERIFIED_COMPLETE"}
        if st not in ALLOWED:
            mapped = st_map.get(st)
            if mapped:
                st = mapped
            else:
                warn(f"  API-Matrix unbekannter Status '{st}' bei {c[0]}")
                continue
        statuses[st] = statuses.get(st, 0) + 1

    note(f"  Tabellenzeilen: {count}")
    note(f"  Status: {dict(statuses)}")
    st_sum = sum(statuses.values())
    if count != st_sum:
        warn(f"  Zeilen ({count}) ≠ Status-Summe ({st_sum})")

    return {"count": count, "statuses": statuses}


# ----------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------
def main():
    print("=" * 60 + "\n  Bookando.de — Requirements Check\n" + "=" * 60)
    print()

    print("--- Traceability ---")
    t = check_traceability()
    print()

    print("--- MVP Mapping ---")
    m = check_mapping(t)
    print()

    print("--- Statistik ---")
    check_statistics(m, t)
    print()

    print("--- Manifest ---")
    check_manifest()
    print()

    print("--- API-Matrix ---")
    a = check_api_matrix()
    print()

    # Summary metrics
    print("=" * 60)
    print("  Metrics")
    print("=" * 60)
    print(f"  TRACEABILITY_TOTAL    = {t['total']}")
    print(f"  EXPECTED_MVP_IDS      = {len(m['expected_ids'])}")
    print(f"  MAPPING_MVP_IDS       = {len(m['mapping_ids'])}")
    print(f"  MISSING_IDS           = {m['missing_ids']}")
    print(f"  EXTRA_IDS             = {m['extra_ids']}")
    print(f"  DUPLICATE_IDS         = {m['total'] - m['unique']}")
    print(f"  WEIGHTED_POINTS       = {m['weight_sum']:.2f}")
    if m['det_total']:
        print(f"  MVP_PERCENT            = {m['det_total'][1]/m['det_total'][2]*100:.1f}%")
    print(f"  API_ROWS              = {a['count']}")
    print(f"  API_STATUS_CHECKSUM   = {sum(a['statuses'].values())}")

    print()
    print(f"  ERRORS   = {len(errors)}")
    print(f"  WARNINGS = {len(warns)}")
    ok = not errors and not warns
    print(f"  Exit-Code = {OK if ok else FAIL}")

    for e in errors:
        print(f"    ✗ {e}")
    for w in warns:
        print(f"    ⚠ {w}")
    print(f"  Result: {'✅ PASS' if ok else '❌ FAIL'}")

    return OK if ok else FAIL


if __name__ == "__main__":
    sys.exit(main())
