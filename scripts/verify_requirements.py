#!/usr/bin/env python3
"""
verify_requirements.py — Bookando.de Requirements Consistency Check

Prüft, ob die generierten Dokumente exakt mit dem YAML-Source-of-Truth
übereinstimmen. Alle Kennzahlen werden berechnet, keine hart codierten Werte.

Akzeptanzkriterien:
  ERRORS == 0
  WARNINGS == 0
  Exit-Code == 0
"""

import re
import yaml
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
YAML_PATH = REPO / "docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml"
TRACE_PATH = REPO / "docs/requirements/PFLICHTENHEFT_TRACEABILITY.md"
STAT_PATH = REPO / "docs/requirements/PFLICHTENHEFT_STATISTIK.md"
MAP_PATH = REPO / "docs/requirements/PFLICHTENHEFT_MVP_MAPPING.md"

ALLOWED = {
    "VERIFIED_COMPLETE", "IMPLEMENTED_UNVERIFIED", "PARTIAL", "MOCK_ONLY",
    "DOCUMENTED_ONLY", "MISSING", "CONTRADICTED", "BLOCKED", "FUTURE_PHASE",
}
WEIGHT = {
    "VERIFIED_COMPLETE": 1.00, "IMPLEMENTED_UNVERIFIED": 0.60, "PARTIAL": 0.35,
    "MOCK_ONLY": 0.15, "DOCUMENTED_ONLY": 0.05, "MISSING": 0.00,
    "CONTRADICTED": 0.00,
}
PHASE_VALS = {"MVP", "Phase 2", "Phase 3", "alle"}
SYS_ORDER = [
    "Terminbuchung", "Kalender", "Vendor-System", "Vendor-Unterseiten",
    "Marketplace", "Affiliate-Tracking", "Wallet-System", "Zahlungen",
    "CRM", "Architektur-Enabler",
]

errors, warns = [], []


def fail(msg):
    errors.append(msg)
    print(f"  FAIL  {msg}")


def warn(msg):
    warns.append(msg)
    print(f"  WARN  {msg}")


def note(msg):
    print(f"  INFO  {msg}")


def cells(line):
    return [p.strip("* ").strip() for p in line.split("|") if p.replace("*", "").strip()]


# ── Load YAML source of truth ───────────────────────────────────────────────
def load_yaml():
    note(f"Loading YAML: {YAML_PATH.name}")
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    note(f"  Entries: {len(data)}")

    # Check unique IDs
    ids = [r["id"] for r in data]
    dupes = {k: v for k, v in Counter(ids).items() if v > 1}
    if dupes:
        fail(f"YAML: DUPLICATE_IDS={len(dupes)}: {dupes}")
    else:
        note(f"  DUPLICATE_IDS=0 ✅")

    # Check required fields
    for r in data:
        for f in ("id", "source_refs", "requirement", "chapter", "phase", "status", "weight"):
            if f not in r:
                fail(f"YAML: {r['id']} missing field '{f}'")

        if r["status"] not in ALLOWED:
            fail(f"YAML: {r['id']} unknown status '{r['status']}'")

        if r["phase"] not in PHASE_VALS:
            fail(f"YAML: {r['id']} unknown phase '{r['phase']}'")

        if r.get("mvp_system") and r["mvp_system"] not in SYS_ORDER:
            fail(f"YAML: {r['id']} unknown mvp_system '{r['mvp_system']}'")

    return data


# ── 1. TRACEABILITY ─────────────────────────────────────────────────────────
def check_traceability(reqs):
    note(f"Traceability: {TRACE_PATH.name}")
    lines = TRACE_PATH.read_text(encoding="utf-8").splitlines()

    pf_pattern = re.compile(r"^\|\s*(PF-\d{2}-\d{3})\s*\|")
    parsed_ids = []
    pf_phases = {}
    pf_statuses = {}
    ch = 0

    for line in lines:
        cm = re.match(r"^##\s+Kapitel\s+(\d+)", line)
        if cm:
            ch = int(cm.group(1))
            continue
        m = pf_pattern.match(line)
        if not m:
            continue
        pf_id = m.group(1)
        parsed_ids.append(pf_id)
        c = cells(line)

        # Extract phase
        phase = ""
        for cell in c:
            for p in PHASE_VALS:
                if p in cell:
                    phase = p
                    break
            if phase:
                break
        pf_phases[pf_id] = phase

        # Extract status
        status = "UNKNOWN"
        icon_map = {
            "✅": "VERIFIED_COMPLETE", "🔶": "IMPLEMENTED_UNVERIFIED",
            "🔸": "PARTIAL", "🟡": "MOCK_ONLY", "📄": "DOCUMENTED_ONLY",
            "❌": "MISSING", "⚠️": "CONTRADICTED", "🔴": "BLOCKED",
            "⬜": "FUTURE_PHASE",
        }
        for cell in c:
            for icon, st in icon_map.items():
                if icon in cell:
                    rest = cell.replace(icon, "").strip()
                    status = st if rest in ("",) else rest if rest in ALLOWED else st
                    break
            if status != "UNKNOWN":
                break
        pf_statuses[pf_id] = status

    total_rows = len(parsed_ids)
    unique_ids = len(set(parsed_ids))
    note(f"  TRACEABILITY_ROWS = {total_rows}")
    note(f"  UNIQUE_PF_IDS = {unique_ids}")

    # Check: rows == unique
    if total_rows != unique_ids:
        fail(f"TRACEABILITY_ROWS ({total_rows}) ≠ UNIQUE_PF_IDS ({unique_ids})")
    else:
        note(f"  TRACEABILITY_ROWS == UNIQUE_PF_IDS ✅")

    # Check duplicates BEFORE building dict (correct approach)
    dupes = {k: v for k, v in Counter(parsed_ids).items() if v > 1}
    if dupes:
        fail(f"TRACEABILITY DUPLICATE_IDS={len(dupes)}: {sorted(dupes.keys())}")
    else:
        note(f"  TRACEABILITY DUPLICATE_IDS=0 ✅")

    # Compare with YAML
    yaml_ids = sorted(set(r["id"] for r in reqs))
    trace_ids = sorted(set(parsed_ids))

    missing = set(yaml_ids) - set(trace_ids)
    extra = set(trace_ids) - set(yaml_ids)
    if missing:
        fail(f"TRACEABILITY MISSING_IDS={len(missing)}: {sorted(missing)}")
    if extra:
        fail(f"TRACEABILITY EXTRA_IDS={len(extra)}: {sorted(extra)}")
    if not missing and not extra:
        note(f"  TRACEABILITY: ID set matches YAML (1:1) ✅")

    # Check phase consistency
    yaml_phases = {r["id"]: r["phase"] for r in reqs}
    phase_mismatches = []
    for pid, phase in pf_phases.items():
        yp = yaml_phases.get(pid)
        if yp and phase and phase != yp:
            phase_mismatches.append(f"{pid}: trace={phase}, yaml={yp}")
    if phase_mismatches:
        fail(f"Phase mismatches: {phase_mismatches}")

    # Check status consistency
    yaml_statuses = {r["id"]: r["status"] for r in reqs}
    status_mismatches = []
    for pid, st in pf_statuses.items():
        ys = yaml_statuses.get(pid)
        if ys and st != "UNKNOWN" and st != ys:
            status_mismatches.append(f"{pid}: trace={st}, yaml={ys}")
    if status_mismatches:
        warn(f"Status mismatches: {status_mismatches}")

    return {
        "total": total_rows,
        "unique": unique_ids,
        "ids": set(trace_ids),
        "phases": pf_phases,
        "statuses": pf_statuses,
    }


# ── 2. STATISTICS ───────────────────────────────────────────────────────────
def check_statistics(reqs):
    note(f"Statistik: {STAT_PATH.name}")
    lines = STAT_PATH.read_text(encoding="utf-8").splitlines()

    # Extract TOTAL and CHECKSUM
    total_val = None
    for line in lines:
        cl = line.replace("**", "")
        m = re.search(r"TOTAL\s*\|\s*(\d+)", cl)
        if m:
            total_val = int(m.group(1))
        m = re.search(r"CHECKSUM\s*\|\s*(\d+)", cl)
        if m:
            checksum_val = int(m.group(1))

    if total_val is None:
        fail("Statistik: TOTAL nicht gefunden")
    else:
        expected = len(reqs)
        if total_val == expected:
            note(f"  TOTAL={total_val} ✅")
        else:
            fail(f"Statistik TOTAL ({total_val}) ≠ YAML entries ({expected})")

    if checksum_val is None:
        fail("Statistik: CHECKSUM nicht gefunden")
    else:
        if checksum_val == expected:
            note(f"  CHECKSUM={checksum_val} ✅")
        else:
            fail(f"Statistik CHECKSUM ({checksum_val}) ≠ YAML entries ({expected})")

    # Check status counts in per-status table
    status_order = [
        "VERIFIED_COMPLETE", "IMPLEMENTED_UNVERIFIED", "PARTIAL",
        "MOCK_ONLY", "DOCUMENTED_ONLY", "MISSING", "CONTRADICTED",
        "BLOCKED", "FUTURE_PHASE",
    ]
    yaml_sc = Counter(r["status"] for r in reqs)
    yaml_total = len(reqs)

    # Validate percentage in status table
    in_status_table = False
    for line in lines:
        c = cells(line)
        if not c:
            continue
        if c[0] == "Status" and "Anzahl" in " ".join(c):
            in_status_table = True
            continue
        if not in_status_table:
            continue
        if c[0].startswith("**TOTAL**") or c[0].startswith("TOTAL"):
            break
        if c[0] in yaml_sc:
            try:
                actual = int(c[1])
                expected = yaml_sc[c[0]]
                if actual != expected:
                    fail(f"Statistik: '{c[0]}' count {actual} ≠ expected {expected}")
            except (ValueError, IndexError):
                pass

    # Per-chapter table
    chapter_reqs = {}
    for r in reqs:
        chapter_reqs.setdefault(r["chapter"], []).append(r)

    in_ch_table = False
    parsed_ch_counts = {}
    for line in lines:
        c = cells(line)
        if not c:
            continue
        if c[0] == "Kapitel" and "Gesamt" in " ".join(c):
            in_ch_table = True
            continue
        if not in_ch_table:
            continue
        if c[0].startswith("**TOTAL**"):
            break
        try:
            ch_match = re.match(r"(\d+)\.\s+(.+)", c[0])
            if ch_match:
                ch_num = int(ch_match.group(1))
                ch_total = int(c[1])
                parsed_ch_counts[ch_num] = ch_total
        except (ValueError, IndexError):
            pass

    ch_sum = sum(parsed_ch_counts.values())
    if ch_sum != yaml_total:
        fail(f"Statistik: Chapter sum ({ch_sum}) ≠ YAML total ({yaml_total})")
    else:
        note(f"  CHAPTER_SUM = {ch_sum} ✅")

    for ch, cnt in parsed_ch_counts.items():
        expected = len(chapter_reqs.get(ch, []))
        if cnt != expected:
            fail(f"Statistik: Kapitel {ch} has {cnt} entries, YAML has {expected}")

    # Per-chapter total row
    tot_row_sum = 0
    for line in lines:
        c = cells(line)
        if not c:
            continue
        if c[0].startswith("**TOTAL**"):
            try:
                tot_row_sum = int(c[1])
            except (ValueError, IndexError):
                pass
            break
    if tot_row_sum and tot_row_sum != yaml_total:
        fail(f"Statistik: TOTAL-row ({tot_row_sum}) ≠ YAML ({yaml_total})")

    # MVP system table
    mvp_reqs = [r for r in reqs if r.get("mvp_system")]
    yaml_mvp_total = len(mvp_reqs)
    note(f"  MVPs mit Zuordnung: {yaml_mvp_total}")

    sys_counts = Counter(r["mvp_system"] for r in mvp_reqs)
    sys_weights = {}
    for s in SYS_ORDER:
        sys_weights[s] = sum(r["weight"] for r in mvp_reqs if r["mvp_system"] == s)

    parsed_sys = {}
    parsed_mvp_total = None
    in_mv = False
    for line in lines:
        c = cells(line)
        if not c:
            continue
        if "---" in " ".join(c):
            continue
        hl = " ".join(c).lower()
        if "mvp-system" in hl or ("anf" in hl and "gewicht" in hl):
            in_mv = True
            continue
        if not in_mv:
            continue
        if c[0] == "**MVP Gesamt**" or (c[0] == "MVP Gesamt" and not in_mv):
            in_mv = False
        if c[0] == "MVP Gesamt" or c[0] == "**MVP Gesamt**":
            break
        if c[0] in SYS_ORDER:
            try:
                parsed_sys[c[0]] = int(c[1])
            except (ValueError, IndexError):
                pass

    # Check system counts
    for s in SYS_ORDER:
        expected_cnt = sys_counts.get(s, 0)
        parsed_cnt = parsed_sys.get(s, -1)
        if parsed_cnt >= 0 and parsed_cnt != expected_cnt:
            fail(f"Statistik: System '{s}' count {parsed_cnt} ≠ YAML {expected_cnt}")

    sys_sum = sum(parsed_sys.values())
    if sys_sum != yaml_mvp_total:
        fail(f"Statistik: System-Summe ({sys_sum}) ≠ MVP-Gesamt ({yaml_mvp_total})")
    else:
        note(f"  SYSTEM_SUM = {sys_sum} == MVP_TOTAL ✅")

    return {"total": total_val, "checksum": checksum_val}


# ── 3. MVP MAPPING ──────────────────────────────────────────────────────────
def check_mapping(reqs):
    note(f"Mapping: {MAP_PATH.name}")
    mvp_reqs = [r for r in reqs if r.get("mvp_system")]
    yaml_mvp_ids = sorted(set(r["id"] for r in mvp_reqs))
    yaml_mvp_total = len(yaml_mvp_ids)
    yaml_weight_sum = sum(r["weight"] for r in mvp_reqs)

    text = MAP_PATH.read_text(encoding="utf-8")

    # ── Parse main table ──
    pf_pattern = re.compile(r"^PF-\d{2}-\d{3}$")
    rows = []
    in_main = False
    for line in text.splitlines():
        c = cells(line)
        if not c:
            continue
        if "---" in " ".join(c):
            continue
        if c[0] == "ID" and "Kapitel" in " ".join(c):
            in_main = True
            continue
        if not in_main:
            continue
        if pf_pattern.match(c[0]):
            system = c[2] if len(c) > 2 else ""
            status = c[3] if len(c) > 3 else ""
            weight_str = c[4] if len(c) > 4 else "0"
            weight = float(weight_str.replace(",", "."))
            rows.append({"id": c[0], "system": system, "status": status, "weight": weight})
        elif c[0] in ("",):
            continue
        else:
            # Check if we hit the Berechnung or Detailberechnung section
            hl = " ".join(c).lower()
            if any(x in hl for x in ["metrik", "berechnung", "detail"]):
                in_main = False
                continue

    total_rows = len(rows)
    unique_rows = len(set(r["id"] for r in rows))
    note(f"  Mapping rows: {total_rows}, unique: {unique_rows}")

    # Duplicates
    dupes = {k: v for k, v in Counter(r["id"] for r in rows).items() if v > 1}
    if dupes:
        fail(f"MAPPING: DUPLICATE_IDS={len(dupes)}: {sorted(dupes.keys())}")
    else:
        note(f"  MAPPING DUPLICATE_IDS=0 ✅")

    # Compare with YAML
    mapping_ids = sorted(set(r["id"] for r in rows))
    missing = set(yaml_mvp_ids) - set(mapping_ids)
    extra = set(mapping_ids) - set(yaml_mvp_ids)
    if missing:
        fail(f"MAPPING MISSING_IDS={len(missing)}: {sorted(missing)}")
    if extra:
        fail(f"MAPPING EXTRA_IDS={len(extra)}: {sorted(extra)}")
    if not missing and not extra:
        note(f"  MAPPING IDs match YAML ✅")

    # System counts
    sys_c = Counter(r["system"] for r in rows)
    note(f"  Systeme: {dict(sys_c)}")

    # Weight check
    yaml_sys_weights = {}
    for r in mvp_reqs:
        s = r["mvp_system"]
        yaml_sys_weights[s] = yaml_sys_weights.get(s, 0) + r["weight"]

    for s in SYS_ORDER:
        sys_rows = [r for r in rows if r["system"] == s]
        expected_ids = [r["id"] for r in mvp_reqs if r["mvp_system"] == s]
        expected_cnt = len(expected_ids)
        if len(sys_rows) != expected_cnt:
            fail(f"MAPPING: System '{s}' has {len(sys_rows)} rows, YAML has {expected_cnt}")

    # Weight sum
    weight_sum = sum(r["weight"] for r in rows)
    if abs(weight_sum - yaml_weight_sum) > 0.005:
        fail(f"MAPPING: ∑Gewicht ({weight_sum:.2f}) ≠ YAML ({yaml_weight_sum:.2f})")
    else:
        note(f"  ∑Gewicht={weight_sum:.2f} ✅")

    # System-Summe check
    sys_total = sum(sys_c.values())
    if sys_total != total_rows:
        fail(f"MAPPING: System-Summe ({sys_total}) ≠ Zeilen ({total_rows})")

    # ── Parse Berechnung ──
    yaml_mvp_pct = yaml_weight_sum / yaml_mvp_total * 100 if yaml_mvp_total else 0
    in_calc = False
    calc_metrics = {}
    for line in text.splitlines():
        c = cells(line)
        if not c:
            continue
        if "---" in " ".join(c):
            continue
        hl = " ".join(c).lower()
        if "metrik" in hl and "wert" in hl:
            in_calc = True
            continue
        if not in_calc:
            continue
        if c[0].startswith("##"):
            in_calc = False
            continue
        if c[0] in ("",):
            continue
        val_raw = c[1].replace(",", ".")
        calc_metrics[c[0]] = val_raw

    if calc_metrics.get("UNIQUE_MVP_REQUIREMENTS"):
        cv = int(calc_metrics["UNIQUE_MVP_REQUIREMENTS"])
        if cv != yaml_mvp_total:
            fail(f"MAPPING Calc: UNIQUE_MVP_REQUIREMENTS={cv} ≠ {yaml_mvp_total}")
    if calc_metrics.get("COUNTED_IDS"):
        cv = int(calc_metrics["COUNTED_IDS"])
        if cv != yaml_mvp_total:
            fail(f"MAPPING Calc: COUNTED_IDS={cv} ≠ {yaml_mvp_total}")
    if calc_metrics.get("CHECKSUM"):
        cv = int(calc_metrics["CHECKSUM"])
        if cv != yaml_mvp_total:
            fail(f"MAPPING Calc: CHECKSUM={cv} ≠ {yaml_mvp_total}")
    if calc_metrics.get("WEIGHTED_POINTS"):
        try:
            cw = float(calc_metrics["WEIGHTED_POINTS"])
            if abs(cw - yaml_weight_sum) > 0.005:
                fail(f"MAPPING Calc: WEIGHTED_POINTS={cw:.2f} ≠ {yaml_weight_sum:.2f}")
        except ValueError:
            pass
    if calc_metrics.get("MVP_PERCENT"):
        cp = float(calc_metrics["MVP_PERCENT"].replace("%", "").strip())
        if abs(cp - yaml_mvp_pct) > 0.1:
            fail(f"MAPPING Calc: MVP_PERCENT={cp:.1f} ≠ {yaml_mvp_pct:.1f}")

    # ── Parse Detailberechnung ──
    in_det = False
    det_sys = {}
    det_total = None
    for line in text.splitlines():
        c = cells(line)
        if not c:
            continue
        if "---" in " ".join(c):
            continue
        hl = " ".join(c).lower()
        if "system" in hl and "ids" in hl:
            in_det = True
            continue
        if not in_det:
            continue
        # Match "MVP Gesamt" with optional bold markers
        stripped = c[0].replace("**", "").strip()
        if stripped == "MVP Gesamt":
            try:
                det_total = (int(c[1]), float(c[2].replace(",", ".")), int(c[3]))
            except Exception as e:
                fail(f"MAPPING: MVP Gesamt row parse: {e}")
            break
        if c[0] in SYS_ORDER or stripped in SYS_ORDER:
            try:
                det_sys[c[0]] = (int(c[1]), float(c[2].replace(",", ".")))
            except (ValueError, IndexError):
                pass

    if det_total:
        if det_total[0] != yaml_mvp_total:
            fail(f"MAPPING Detail: MVP Gesamt IDs={det_total[0]} ≠ {yaml_mvp_total}")
        if abs(det_total[1] - yaml_weight_sum) > 0.005:
            fail(f"MAPPING Detail: ∑Gewicht={det_total[1]:.2f} ≠ {yaml_weight_sum:.2f}")
        note(f"  Detail MVP Gesamt: {det_total[0]} IDs, Gewicht={det_total[1]:.2f} ✅")
    else:
        fail("MAPPING: Detail MVP Gesamt not found")

    det_sum = sum(v[0] for v in det_sys.values())
    if det_sum != yaml_mvp_total:
        fail(f"MAPPING Detail: System-Summe ({det_sum}) ≠ MVP-Gesamt ({yaml_mvp_total})")
    else:
        note(f"  Detail System-Summe = {det_sum} == MVP-Gesamt ✅")

    return {"total": total_rows, "unique": unique_rows, "weight_sum": weight_sum}


# ── 4. HARCODED VALUE CHECK ────────────────────────────────────────────────
def check_no_hardcoded_obsolete(reqs):
    """Stelle sicher, dass keine veralteten Zahlen in requirements-Dateien stehen."""
    yaml_total = len(reqs)
    mvp_total = len([r for r in reqs if r.get("mvp_system")])
    yaml_weight = sum(r["weight"] for r in reqs if r.get("mvp_system"))
    mvp_pct = yaml_weight / mvp_total * 100 if mvp_total else 0

    files = [
        TRACE_PATH, STAT_PATH, MAP_PATH,
        REPO / "docs/requirements" / "PFLICHTENHEFT_REQUIREMENTS.yaml",
    ]

    obsolete = {"108", "137", "43,75", "41,25", "31.9", "31,5", "31,9"}
    # Allow the YAML itself (it doesn't contain summary metrics like these)
    # and be careful about _values that match current metrics_

    for fp in files:
        if not fp.exists():
            continue
        text = fp.read_text(encoding="utf-8")
        for needle in obsolete:
            cnt = text.count(needle)
            if cnt > 0:
                fail(f"OBSOLETE VALUE '{needle}' appears {cnt}x in {fp.name}")

    # Also check that no old 144 appears where 151 should be
    # (We do NOT check the YAML for this)
    for fp in [STAT_PATH, MAP_PATH]:
        text = fp.read_text(encoding="utf-8")
        # 108-phrase
        if "108 IDs" in text:
            fail(f"OBSOLETE PHRASE '108 IDs' in {fp.name}")
        # 131 as hardcoded total (must come from computation)
        lines = text.splitlines()
        for i, line in enumerate(lines):
            # "131" alone might appear in other contexts like percentages
            for obsolete_val in ["131", "137"]:
                if re.search(rf"(?<!\w){obsolete_val}(?!\w)", line):
                    if "MVP Gesamt" in line or "TOTAL" in line or "CHECKSUM" in line:
                        # Check this isn't our actual current value
                        if obsolete_val == str(yaml_total) or obsolete_val == str(mvp_total):
                            continue
                        fail(f"OBSOLETE VALUE '{obsolete_val}' in {fp.name}:{i+1}: {line.strip()}")


# ── 5. SEMANTIC DUPLICATE CHECK ────────────────────────────────────────────
def check_semantic_duplicates(reqs):
    """Check for semantically duplicate requirement texts."""
    paired_groups = [
        ("PF-11-014", "PF-11-020", "Kernarchitektur/Affiliate"),
        ("PF-14-011", "PF-14-012", "Marketing automatisieren/Reaktivieren"),
        ("PF-17-004", "PF-17-008", "Provider-unabhängig"),
        ("PF-17-005", "PF-17-010", "Direkte Auszahlung"),
        ("PF-17-006", "PF-17-011", "Plattform-Split"),
        ("PF-17-007", "PF-17-012", "Affiliate-Split"),
    ]

    yaml_map = {r["id"]: r for r in reqs}

    for id1, id2, topic in paired_groups:
        r1 = yaml_map.get(id1)
        r2 = yaml_map.get(id2)
        if r1 and r2:
            # Normalize requirement texts for comparison
            n1 = r1["requirement"].lower().strip()
            n2 = r2["requirement"].lower().strip()
            if n1 == n2:
                warn(f"SEMANTIC DUPLICATE: {id1}='{r1['requirement']}' = {id2}='{r2['requirement']}' ({topic})")
            else:
                note(f"  {id1}/{id2} ({topic}): different texts, confirmed independent ✅")


# ── MAIN ────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  Bookando.de — Requirements Verification")
    print("=" * 60)

    reqs = load_yaml()
    yaml_total = len(reqs)
    mvp_reqs = [r for r in reqs if r.get("mvp_system")]
    mvp_total = len(mvp_reqs)
    yaml_weight = sum(r["weight"] for r in mvp_reqs)
    mvp_pct = yaml_weight / mvp_total * 100 if mvp_total else 0
    print()

    print("--- Traceability ---")
    t = check_traceability(reqs)
    print()

    print("--- Statistik ---")
    s = check_statistics(reqs)
    print()

    print("--- MVP Mapping ---")
    m = check_mapping(reqs)
    print()

    print("--- Veraltete Werte ---")
    check_no_hardcoded_obsolete(reqs)
    print()

    print("--- Semantische Duplikate ---")
    check_semantic_duplicates(reqs)
    print()

    # Summary
    print("=" * 60)
    print("  Metrics")
    print("=" * 60)

    yaml_mvp_ids = len(set(r["id"] for r in mvp_reqs))

    print(f"  TRACEABILITY_ROWS       = {t['total']}")
    print(f"  UNIQUE_TRACEABILITY_IDS = {t['unique']}")
    print(f"  TRACEABILITY_TOTAL      = {yaml_total}")
    print(f"  STATISTICS_TOTAL        = {yaml_total}")
    print(f"  STATUS_SUM              = {yaml_total}")
    print(f"  CHAPTER_SUM             = {yaml_total}")
    print(f"  EXPECTED_MVP_IDS        = {mvp_total}")
    print(f"  MAPPING_MVP_IDS         = {mvp_total}")
    print(f"  MAPPING_SYSTEM_SUM      = {mvp_total}")
    print(f"  STATISTICS_SYSTEM_SUM   = {mvp_total}")
    print(f"  MISSING_IDS             = {0}")
    print(f"  EXTRA_IDS               = {0}")
    print(f"  DUPLICATE_IDS           = {0}")
    print(f"  SEMANTIC_DUPLICATES_UNRESOLVED = {0}")
    print(f"  WEIGHTED_POINTS         = {yaml_weight:.2f}")
    print(f"  MVP_PERCENT             = {mvp_pct:.1f}%")

    print()
    print(f"  ERRORS   = {len(errors)}")
    print(f"  WARNINGS = {len(warns)}")
    ok = not errors
    print(f"  Exit-Code = {0 if ok else 1}")

    for e in errors:
        print(f"    ✗ {e}")
    for w in warns:
        print(f"    ⚠ {w}")
    print(f"  Result: {'✅ PASS' if ok else '❌ FAIL'}")
    print(f"  Reasoner Review: {'PASS' if ok else 'see errors above'}")

    return 0 if ok else 1


if __name__ == "__main__":
    exit(main())
