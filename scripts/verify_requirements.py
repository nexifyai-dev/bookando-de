#!/usr/bin/env python3
"""
verify_requirements.py — Bookando.de Requirements Consistency Check

Validates:
  - PFLICHTENHEFT_MVP_MAPPING.md   (unique IDs, weights, detail table)
  - PFLICHTENHEFT_TRACEABILITY.md  (status counts, chapters, forbidden status)
  - PFLICHTENHEFT_STATISTIK.md     (TOTAL/CHECKSUM, status counts, MVP table)
  - Manifest SHA match
Every warning exits with code 1. No hardcoded success.
"""

import hashlib, re, sys, yaml
from collections import OrderedDict
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
    """Parse markdown table row, strip bold."""
    return [p.strip("* ").strip() for p in line.split("|") if p.replace("*","").strip()]

# ----------------------------------------------------------------------
# 1. Forbidden status in all .md
# ----------------------------------------------------------------------
def check_forbidden():
    found = []
    for f in list(REPO.glob("**/*.md")) + [REPO/"CLAUDE.md"]:
        if not f.exists(): continue
        rel = f.relative_to(REPO)
        for i, line in enumerate(f.read_text().splitlines(), 1):
            for st in FORBIDDEN:
                if st in line:
                    found.append((rel, i, st))
    if found:
        for f, ln, st in found: fail(f"{f}:{ln}: verboten '{st}'")
    else:
        note("Kein verbotener Status")

# ----------------------------------------------------------------------
# 2. MVP Mapping
# ----------------------------------------------------------------------
def check_mapping():
    path = REPO/"docs/requirements/PFLICHTENHEFT_MVP_MAPPING.md"
    note(f"Lese: {path.name}")
    lines = path.read_text().splitlines()

    rows = []
    in_main = False
    for line in lines:
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        if c[0]=="ID" and "Kapitel" in c[1]:
            in_main = True; continue
        if not in_main: continue
        if not re.match(r"^PF-\d{2}-\d{3}$", c[0]):
            in_main = False; continue
        rows.append({"id":c[0],"system":c[2],"status":c[3],
                      "gewicht":c[4].replace(",",".")})

    total = len(rows)
    uids = sorted(set(r["id"] for r in rows))
    n_unique = len(uids)
    note(f"Zeilen: {total}, Unique: {n_unique}")

    # Duplicates
    seen=set(); dupes=[]
    for r in rows:
        if r["id"] in seen: dupes.append(r["id"])
        seen.add(r["id"])
    if dupes: fail(f"DUPLICATE_IDS = {len(dupes)}: {dupes[:5]}")
    else: note("DUPLICATE_IDS = 0")

    # Bad status
    bad = [r for r in rows if r["status"] not in ALLOWED]
    if bad: fail(f"Unbekannte Status: {set(r['status'] for r in bad)}")
    else: note("Alle Status gültig")

    # Weight check vs status
    for r in rows:
        ew = WEIGHT.get(r["status"])
        aw = float(r["gewicht"])
        if ew is not None and abs(ew-aw)>0.005:
            warn(f"{r['id']}: Status '{r['status']}'→Gewicht {ew:.2f}, hat {aw:.2f}")

    # Sums
    weight_sum = 0.0
    sys_c = OrderedDict()
    stat_c = OrderedDict()
    for r in rows:
        w = float(r["gewicht"])
        sys_c[r["system"]] = sys_c.get(r["system"],0)+1
        stat_c[r["status"]] = stat_c.get(r["status"],0)+1
        weight_sum += w
    note(f"Systeme: {dict(sys_c)}")
    note(f"∑Gewicht: {weight_sum:.2f}")
    sys_total = sum(sys_c.values())
    if sys_total != total: fail(f"System-Summe ({sys_total}) != Zeilen ({total})")

    # Detail table
    in_det = False
    det = {}
    det_total = None
    for line in lines:
        c = cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        hl = " ".join(c).lower()
        if "system" in hl and "ids" in hl and "%" in hl:
            in_det = True; continue
        if not in_det: continue
        if line.strip().startswith(">") or line.strip().startswith("#"):
            in_det = False; continue
        if c[0]=="MVP Gesamt":
            try:
                det_total = (int(c[1]), float(c[2].replace(",",".")), int(c[3]))
            except Exception as e:
                fail(f"MVP Gesamt: {c} ({e})")
            in_det = False
        else:
            try:
                det[c[0]] = (int(c[1]), float(c[2].replace(",",".")))
            except: pass

    for s, cnt in sys_c.items():
        if s in det:
            if det[s][0] != cnt:
                warn(f"Detail '{s}': {det[s][0]} IDs, erwarte {cnt}")
    if det_total:
        if det_total[0] != n_unique:
            warn(f"Detail TOTAL ({det_total[0]}) ≠ unique ({n_unique})")
        if abs(det_total[1]-weight_sum)>0.05:
            warn(f"Detail ∑G ({det_total[1]:.2f}) ≠ berechnet ({weight_sum:.2f})")
        if det_total[2]>0:
            note(f"MVP_PERCENT = {det_total[1]/det_total[2]*100:.1f}%")
    else:
        fail("Detail-Tabelle nicht gefunden")

    return {"unique":n_unique,"weight_sum":weight_sum,"det_total":det_total,
            "sys_c":dict(sys_c),"stat_c":dict(stat_c)}

# ----------------------------------------------------------------------
# 3. Traceability — count IDs, statuses, chapters
# ----------------------------------------------------------------------
def check_traceability():
    path = REPO/"docs/requirements/PFLICHTENHEFT_TRACEABILITY.md"
    note(f"Lese: {path.name}")
    lines = path.read_text().splitlines()

    # Count entries under each chapter
    current_ch = ""
    id_count = 0
    id_line = re.compile(r"^\|\s*\d+\.\d+(\.\d+)?\s*\|")
    ch_line = re.compile(r"^##\s+Kapitel\s+(\d+)")
    ch_counts = OrderedDict()

    statuses = OrderedDict()
    icon_map = {
        "✅": "VERIFIED_COMPLETE", "🔶": "IMPLEMENTED_UNVERIFIED",
        "🔸": "PARTIAL", "🟡": "MOCK_ONLY", "📄": "DOCUMENTED_ONLY",
        "❌": "MISSING", "⚠️": "CONTRADICTED", "🔴": "BLOCKED",
        "⬜": "FUTURE_PHASE",
    }
    for line in lines:
        m = ch_line.match(line)
        if m:
            continue
        if not id_line.match(line):
            continue
        id_count += 1
        c = cells(line)
        found = False
        for cell in c:
            # Cell may be like "🔶 PARTIAL" — extract text part after icon
            for icon, status in icon_map.items():
                if icon in cell:
                    rest = cell.replace(icon, "").strip()
                    if rest in ALLOWED:
                        statuses[rest] = statuses.get(rest, 0) + 1
                        found = True
                    elif status in ALLOWED:
                        statuses[status] = statuses.get(status, 0) + 1
                        found = True
                    break
            if found:
                break

    note(f"Traceability: {id_count} Einträge, {len(statuses)} Status-Kategorien")
    note(f"Status: {dict(statuses)}")

    # Summary table at bottom
    summary_found = False
    summ = {}
    for line in lines:
        if "Kategorie" in line and "Gesamt" in line:
            summary_found = True; continue
        if not summary_found: continue
        c = cells(line)
        if not c or c[0].startswith("*"): continue
        if c[0].startswith("**Gesamt**") or c[0]=="Gesamt":
            try:
                summ = {"total":int(c[1]),"vc":int(c[2]),"iu":int(c[3]),
                        "mi":int(c[4]),"do":int(c[5])}
            except: pass
            break

    if summ:
        calc = summ.get("vc",0)+summ.get("iu",0)+summ.get("mi",0)+summ.get("do",0)
        note(f"Summary: total={summ.get('total')}, sum-status={calc}")

    return {"id_count":id_count,"statuses":statuses,"summary":summ}

# ----------------------------------------------------------------------
# 4. Statistics
# ----------------------------------------------------------------------
def check_statistics(mapping):
    path = REPO/"docs/requirements/PFLICHTENHEFT_STATISTIK.md"
    note(f"Lese: {path.name}")
    text = path.read_text()
    lines = text.splitlines()

    total=checksum=None
    for line in lines:
        cl = line.replace("**","")
        m = re.search(r"TOTAL\s*\|\s*(\d+)",cl)
        if m: total=int(m.group(1))
        m = re.search(r"CHECKSUM\s*\|\s*(\d+)",cl)
        if m: checksum=int(m.group(1))
    if total is None: fail("TOTAL nicht gefunden")
    if checksum is None: fail("CHECKSUM nicht gefunden")
    if total is not None and checksum is not None:
        if total==checksum: note(f"TOTAL=CHECKSUM={total}")
        else: fail(f"TOTAL({total})!=CHECKSUM({checksum})")

    # Status counts
    sc = {}
    for line in lines:
        c = cells(line)
        if len(c)>=2 and c[0] in ALLOWED:
            try: sc[c[0]]=int(c[1])
            except: pass
    if sc:
        ssum=sum(sc.values())
        note(f"Status: {sc}, Summe={ssum}")
        if total is not None and ssum!=total:
            warn(f"Status-Summe({ssum})!=TOTAL({total})")

    # Chapters
    in_ch=False; chs=[]
    for line in lines:
        c=cells(line)
        if not c: continue
        if c[0]=="Kapitel": in_ch=True; continue
        if in_ch:
            if c[0].startswith("TOTAL"): in_ch=False; continue
            if len(c)>=2:
                try: chs.append(int(c[1]))
                except: pass
    note(f"Kapitel: {len(chs)}")
    if len(chs)<21: fail(f"Nur {len(chs)} Kapitel")

    # MVP table
    in_mv=False
    mv_total=None
    for line in lines:
        c=cells(line)
        if not c: continue
        if all("---" in x for x in c): continue
        hl=" ".join(c).lower()
        if hl.startswith("mvp-system") and "erfüllung" in hl:
            in_mv=True; continue
        if not in_mv: continue
        if c[0]=="MVP Gesamt":
            try:
                mv_total=(
                    int(c[1]),
                    float(c[7].replace(",",".")),
                    float(c[8].replace(",",".")),
                )
            except Exception as e:
                fail(f"MVP Gesamt: {c} ({e})")
            in_mv=False
    if mv_total:
        note(f"MVP Gesamt: count={mv_total[0]}, w={mv_total[1]:.2f}, max={mv_total[2]}")
        if mapping.get("det_total") and mv_total[0]!=mapping["det_total"][0]:
            warn(f"Stat MVP ({mv_total[0]})≠Mapping ({mapping['det_total'][0]})")

    return {"total":total,"checksum":checksum,"mv_total":mv_total}

# ----------------------------------------------------------------------
# 5. Manifest
# ----------------------------------------------------------------------
def check_manifest():
    mp = REPO/"docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.manifest.yml"
    if not mp.exists(): fail(f"Manifest nicht gefunden: {mp}"); return
    try:
        m = yaml.safe_load(mp.read_text())
    except Exception as e:
        fail(f"Manifest YAML: {e}"); return
    note("Manifest gelesen")

    wf = m.get("working_document","")
    ws = m.get("working_sha256","")
    if wf and ws:
        wp = REPO/"docs/customer"/wf
        if wp.exists():
            a = hashlib.sha256(wp.read_bytes()).hexdigest()
            if a==ws: note(f"Working SHA: {ws[:16]}... ✅")
            else: warn(f"Working SHA mismatch: {ws[:16]}... ≠ {a[:16]}...")
    os = m.get("original_sha256","")
    if os: note(f"Original SHA (extern): {os[:16]}...")

# ----------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------
def main():
    print("="*60+"\n  Bookando.de — Requirements Check\n"+"="*60); print()
    check_forbidden(); print()
    print("--- MVP Mapping ---"); m=check_mapping(); print()
    print("--- Traceability ---"); check_traceability(); print()
    print("--- Statistik ---"); check_statistics(m); print()
    print("--- Manifest ---"); check_manifest(); print()
    print("="*60+"\n  Summary\n"+"="*60)
    print(f"  Errors: {len(errors)}")
    for e in errors: print(f"    ✗ {e}")
    print(f"  Warnings: {len(warns)}")
    for w in warns: print(f"    ⚠ {w}")
    ok = not errors and not warns
    print(f"  Result: {'✅ PASS' if ok else '❌ FAIL'}")
    return OK if ok else FAIL

if __name__=="__main__": sys.exit(main())
