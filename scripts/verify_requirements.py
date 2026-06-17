#!/usr/bin/env python3
"""
verify_requirements.py — Bookando.de Requirements Consistency Check
"""

import hashlib
import re
import sys
from collections import OrderedDict
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EXIT_OK = 0
EXIT_FAIL = 1

ALLOWED_STATUS = {
    "VERIFIED_COMPLETE", "IMPLEMENTED_UNVERIFIED", "PARTIAL",
    "MOCK_ONLY", "DOCUMENTED_ONLY", "MISSING", "CONTRADICTED",
    "BLOCKED", "FUTURE_PHASE",
}
FORBIDDEN_STATUS = {"OUT_OF_SCOPE_FOR_CURRENT_PHASE"}
WEIGHT_MAP = {
    "VERIFIED_COMPLETE": 1.00, "IMPLEMENTED_UNVERIFIED": 0.60,
    "PARTIAL": 0.35, "MOCK_ONLY": 0.15, "DOCUMENTED_ONLY": 0.05,
    "MISSING": 0.00, "CONTRADICTED": 0.00, "BLOCKED": None, "FUTURE_PHASE": None,
}
ALL_CHAPTERS = [
    "Einleitung", "Grundidee", "Vision", "Trafft-Orientierung",
    "Zielgruppen", "Kernziel", "Plattformstruktur", "Terminbuchung",
    "Vendor-System", "Marketplace", "Affiliate", "Wallet/Ledger",
    "WhiteLabel", "CRM", "KI-Strategie", "Mobile/App",
    "Geschäftsmodell", "Technisches Zielbild", "Entwicklerprioritäten",
    "MVP-Strategie", "Endziel",
]

errors = []
warnings = []
info = []


def err(m):
    errors.append(m); print(f"  FAIL  {m}")
def warn(m):
    warnings.append(m); print(f"  WARN  {m}")
def note(m):
    info.append(m); print(f"  INFO  {m}")


def parse_md_table_row(line):
    """Parse markdown table row: | a | b | c | -> ['a','b','c']"""
    parts = [p.strip() for p in line.split("|")]
    # First and last are empty from leading/trailing |
    return [p.strip("*").strip() for p in parts if p != ""]


def check_forbidden_status():
    found = []
    for f in list(REPO.glob("**/*.md")) + [REPO / "CLAUDE.md"]:
        if not f.exists():
            continue
        rel = f.relative_to(REPO)
        text = f.read_text(encoding="utf-8")
        for i, line in enumerate(text.splitlines(), 1):
            for st in FORBIDDEN_STATUS:
                if st in line:
                    found.append((rel, i, st))
    if found:
        for f, ln, st in found:
            err(f"{f}:{ln}: verbotener Status '{st}'")
    else:
        note("Kein verbotener Status gefunden ✅")


def check_mvp_mapping():
    path = REPO / "docs" / "requirements" / "PFLICHTENHEFT_MVP_MAPPING.md"
    note(f"Lese MVP-Mapping: {path.name}")
    text = path.read_text(encoding="utf-8")

    rows = []
    in_main_table = False
    for line in text.splitlines():
        cells = parse_md_table_row(line)
        if not cells:
            continue
        # Skip separator rows
        if all("---" in c for c in cells):
            continue
        # Detect main table header
        if cells[0] == "ID" and "Kapitel" in cells[1]:
            in_main_table = True
            continue
        if not in_main_table:
            continue
        if not re.match(r"^PF-\d{2}-\d{3}$", cells[0]):
            in_main_table = False
            continue
        rows.append({
            "id": cells[0], "kapitel": cells[1],
            "system": cells[2], "status": cells[3],
            "gewicht": cells[4].replace(",", "."),
        })

    total = len(rows)
    unique_ids = sorted(set(r["id"] for r in rows))
    n_unique = len(unique_ids)

    note(f"Zeilen: {total}, Eindeutige IDs: {n_unique}")

    # Duplicate check
    seen = set()
    dupes = []
    for r in rows:
        if r["id"] in seen:
            dupes.append(r["id"])
        seen.add(r["id"])
    if dupes:
        err(f"DUPLICATE_IDS = {len(dupes)}: {dupes[:5]}")
    else:
        note(f"DUPLICATE_IDS = 0 ✅")

    # Status check
    bad_status = [r for r in rows if r["status"] not in ALLOWED_STATUS]
    if bad_status:
        err(f"Unbekannte Status: {set(r['status'] for r in bad_status)}")
    else:
        note("Alle Status gültig ✅")

    # Forbidden check
    for r in rows:
        if r["status"] in FORBIDDEN_STATUS:
            err(f"{r['id']}: verbotener Status '{r['status']}'")

    # Weight computation
    weight_sum = 0.0
    sys_counts = OrderedDict()
    sys_weights = OrderedDict()
    status_counts = OrderedDict()
    for r in rows:
        w = float(r["gewicht"])
        sys_counts[r["system"]] = sys_counts.get(r["system"], 0) + 1
        sys_weights[r["system"]] = sys_weights.get(r["system"], 0.0) + w
        status_counts[r["status"]] = status_counts.get(r["status"], 0) + 1
        weight_sum += w

    note(f"Systeme: {dict(sys_counts)}")
    note(f"Status: {dict(status_counts)}")
    note(f"∑Gewicht: {weight_sum:.2f}")

    sys_total = sum(sys_counts.values())
    if sys_total != total:
        err(f"System-Summe ({sys_total}) != Zeilen ({total})")

    # Parse detail table at bottom — header: | System | IDs | ∑Gewicht | Max | % |
    in_detail = False
    detail = {}
    detail_total = {}
    for line in text.splitlines():
        cells = parse_md_table_row(line)
        if not cells:
            continue
        # Skip separator rows
        if all("---" in c for c in cells):
            continue
        hl = " ".join(cells).lower()
        if hl.startswith("system") and hl.endswith("%"):
            in_detail = True
            continue
        if not in_detail:
            continue
        if line.strip().startswith(">") or line.strip().startswith("#"):
            in_detail = False
            continue
        if cells[0] == "MVP Gesamt" or cells[0] == "**MVP Gesamt**":
            try:
                detail_total = {
                    "ids": int(cells[1]), "gewicht": float(cells[2].replace(",", ".")),
                    "max": int(cells[3]),
                }
            except (ValueError, IndexError):
                err(f"Kann MVP Gesamt nicht parsen: {cells}")
            in_detail = False
        else:
            try:
                # Map: "Terminbuchung" matches "Terminbuchung (Kap 8)" etc
                detail[cells[0]] = {
                    "ids": int(cells[1]), "gewicht": float(cells[2].replace(",", ".")),
                }
            except (ValueError, IndexError):
                pass

    # Compare detail table vs parsed
    for sys_name, cnt in sys_counts.items():
        if sys_name in detail:
            tbl_cnt = detail[sys_name]["ids"]
            if tbl_cnt != cnt:
                warn(f"Detail-Tabelle sagt {sys_name} = {tbl_cnt}, gezählt = {cnt}")
        else:
            warn(f"System '{sys_name}' nicht in Detail-Tabelle")

    if detail_total:
        if detail_total["ids"] != n_unique:
            warn(f"Detail-Tabelle TOTAL IDs ({detail_total['ids']}) != eindeutige IDs ({n_unique})")
        calc_w = abs(detail_total["gewicht"] - weight_sum)
        if calc_w > 0.05:
            warn(f"Detail-Tabelle ∑Gewicht ({detail_total['gewicht']:.2f}) != berechnet ({weight_sum:.2f})")

    if detail_total and detail_total.get("max", 0) > 0:
        pct = (detail_total["gewicht"] / detail_total["max"]) * 100
        note(f"Berechneter MVP_PERCENT: {pct:.1f}%")

    return {
        "total": total, "unique": n_unique, "dup": len(dupes),
        "sys_counts": dict(sys_counts), "weight_sum": weight_sum,
        "status_counts": dict(status_counts),
    }


def check_statistics():
    path = REPO / "docs" / "requirements" / "PFLICHTENHEFT_STATISTIK.md"
    note(f"Lese Statistik: {path.name}")

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    # Parse TOTAL / CHECKSUM — bold markers confuse regex
    for line in lines:
        clean = line.replace("**", "").strip()
        m = re.search(r"TOTAL\s*\|\s*(\d+)", clean)
        if m:
            total = int(m.group(1))
        m = re.search(r"CHECKSUM\s*\|\s*(\d+)", clean)
        if m:
            checksum = int(m.group(1))

    if total is not None and checksum is not None:
        if total == checksum:
            note(f"TOTAL = CHECKSUM = {total} ✅")
        else:
            err(f"TOTAL ({total}) != CHECKSUM ({checksum})")
    else:
        if total is None:
            err("TOTAL nicht gefunden")
        if checksum is None:
            err("CHECKSUM nicht gefunden")

    # Parse status counts
    status_counts = {}
    for line in lines:
        cells = parse_md_table_row(line)
        if len(cells) >= 2 and cells[0] in ALLOWED_STATUS:
            try:
                status_counts[cells[0]] = int(cells[1])
            except ValueError:
                pass
    # Fallback: regex search for **TOTAL** | NNN
    if total is None:
        for line in lines:
            m = re.search(r"\*\*TOTAL\*\*\s*\|\s*(\d+)", line)
            if m:
                total = int(m.group(1))
    if checksum is None:
        for line in lines:
            m = re.search(r"\*\*CHECKSUM\*\*\s*\|\s*(\d+)", line)
            if m:
                checksum = int(m.group(1))

    if status_counts:
        sc_sum = sum(status_counts.values())
        note(f"Status in Statistik: {status_counts}, Summe = {sc_sum}")
        if total is not None and sc_sum != total:
            warn(f"Status-Summe ({sc_sum}) != TOTAL ({total})")

    # Parse chapter table
    in_ch = False
    chapters = OrderedDict()
    for line in lines:
        cells = parse_md_table_row(line)
        if not cells:
            continue
        if cells[0] == "Kapitel":
            in_ch = True
            continue
        if in_ch:
            if cells[0].startswith("**TOTAL**"):
                in_ch = False
                continue
            if len(cells) >= 2:
                try:
                    chapters[cells[0]] = int(cells[1])
                except ValueError:
                    pass

    note(f"Kapitel in Statistik: {len(chapters)}")
    if len(chapters) < 21:
        err(f"Nur {len(chapters)} Kapitel (erwartet >= 21)")
    else:
        note("Alle 21 Kapitel vorhanden ✅")

    # Check forbidden
    for st in FORBIDDEN_STATUS:
        if st in text:
            err(f"Verbotener Status in Statistik: {st}")

    # Parse MVP section — header: | MVP-System | Anz. | VI ... | IU ... | PA ... | DO ... | MI ... | Gewichtet | Max | Erfüllung |
    in_mvp = False
    mvp = {}
    mvp_total = {}
    for line in lines:
        cells = parse_md_table_row(line)
        if not cells:
            continue
        if all("---" in c for c in cells):
            continue
        hl = " ".join(cells).lower()
        if hl.startswith("mvp-system") and "erfüllung" in hl:
            in_mvp = True
            continue
        if not in_mvp:
            continue
        if "MVP Gesamt" in cells[0]:
            # Cells: [MVP Gesamt, 136, 0, 36,00, 17,50, 0,25, 0,00, 53,75, 136,00, 39,5%]
            try:
                mvp_total = {
                    "count": int(cells[1]),
                    "gewichtet": float(cells[7].replace(",", ".")),
                    "max": float(cells[8].replace(",", ".")),
                }
            except (ValueError, IndexError) as e:
                err(f"MVP Gesamt nicht parshar: {cells} ({e})")
            in_mvp = False
        elif cells[0] not in ("MVP-System", ""):
            try:
                mvp[cells[0]] = {
                    "count": int(cells[1]),
                    "gewichtet": float(cells[7].replace(",", ".")),
                    "max": float(cells[8].replace(",", ".")),
                }
            except (ValueError, IndexError):
                pass

    if mvp_total:
        note(f"MVP Gesamt (Stat): count={mvp_total['count']}, weighted={mvp_total['gewichtet']:.2f}, max={mvp_total['max']}")

    # Cross-check MVP count vs mapping unique count
    return {"total": total, "checksum": checksum, "status_counts": status_counts, "mvp_total": mvp_total}


def check_customer_spec_sha():
    path = REPO / "docs" / "customer" / "PFLICHTENHEFT_BOOKANDO_KUNDE.md"
    if not path.exists():
        err(f"Kunden-Pflichtenheft nicht gefunden: {path}")
        return
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    note(f"SHA-256(kunden-pfl) = {sha}")

    trace_path = REPO / "docs" / "requirements" / "PFLICHTENHEFT_TRACEABILITY.md"
    if trace_path.exists():
        for line in trace_path.read_text().splitlines():
            m = re.search(r"[0-9a-f]{64}", line)
            if m:
                rec = m.group(0)
                if sha == rec:
                    note("SHA-256 stimmt mit Traceability überein ✅")
                else:
                    warn(f"SHA-256 abweichend: aktuell={sha[:16]}..., recorded={rec[:16]}...")
                break


def main():
    print("=" * 60)
    print("  Bookando.de — Requirements Consistency Check")
    print(f"  Repo: {REPO}")
    print("=" * 60)
    print()

    check_forbidden_status()
    print()

    print("--- MVP Mapping ---")
    mvp = check_mvp_mapping()
    print()

    print("--- Statistik ---")
    stat = check_statistics()
    print()

    print("--- SHA-256 ---")
    check_customer_spec_sha()
    print()

    print("=" * 60)
    print("  Summary")
    print("=" * 60)
    print(f"  Errors:   {len(errors)}")
    for e in errors:
        print(f"    ✗ {e}")
    print(f"  Warnings: {len(warnings)}")
    for w in warnings:
        print(f"    ⚠ {w}")
    result = "✅ PASS" if not errors else "❌ FAIL"
    print(f"  Result:   {result}")

    return EXIT_FAIL if errors else EXIT_OK


if __name__ == "__main__":
    sys.exit(main())
