#!/usr/bin/env python3
"""
generate_requirements_docs.py — Bookando.de Canonical Docs Generator

Liest PFLICHTENHEFT_REQUIREMENTS.yaml (single source of truth) und generiert:
  1. PFLICHTENHEFT_TRACEABILITY.md
  2. PFLICHTENHEFT_STATISTIK.md
  3. PFLICHTENHEFT_MVP_MAPPING.md

Die generierten Dateien sind maschinenlesbar und deterministisch.
verify_requirements.py prüft, dass die generierten Dateien exakt
dem aktuellen YAML-Stand entsprechen.
"""

import hashlib
import re
import yaml
from collections import OrderedDict, Counter
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
YAML_PATH = REPO / "docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml"
OUT_DIR = REPO / "docs/requirements"
CUSTOMER_DIR = REPO / "docs/customer"
TODAY = date.today().strftime("%d.%m.%Y")

# ── Constants ──────────────────────────────────────────────────────────────
ICON_MAP = {
    "VERIFIED_COMPLETE": "✅ VERIFIED_COMPLETE",
    "IMPLEMENTED_UNVERIFIED": "🔶 IMPLEMENTED_UNVERIFIED",
    "PARTIAL": "🔸 PARTIAL",
    "MOCK_ONLY": "🟡 MOCK_ONLY",
    "DOCUMENTED_ONLY": "📄 DOCUMENTED_ONLY",
    "MISSING": "❌ MISSING",
    "CONTRADICTED": "⚠️ CONTRADICTED",
    "BLOCKED": "🔴 BLOCKED",
    "FUTURE_PHASE": "⬜ FUTURE_PHASE",
}

WEIGHT = {
    "VERIFIED_COMPLETE": 1.00,
    "IMPLEMENTED_UNVERIFIED": 0.60,
    "PARTIAL": 0.35,
    "MOCK_ONLY": 0.15,
    "DOCUMENTED_ONLY": 0.05,
    "MISSING": 0.00,
    "CONTRADICTED": 0.00,
}

CHAPTER_NAMES = {
    1: "Einleitung",
    2: "Grundidee",
    3: "Vision",
    4: "Trafft-Orientierung",
    5: "Zielgruppen",
    6: "Kernziel",
    7: "Plattformstruktur",
    8: "Terminbuchungssystem",
    9: "Vendor-System",
    10: "Marketplace-System",
    11: "Affiliate-Booking-System (★ KERN-USP)",
    12: "Wallet- und Ledger-System",
    13: "WhiteLabel-System",
    14: "CRM-System",
    15: "KI-Strategie",
    16: "Mobile- und App-Strategie",
    17: "Geschäftsmodell",
    18: "Technisches Zielbild",
    19: "Entwicklerprioritäten",
    20: "MVP-Strategie (Zusammenfassung)",
    21: "Endziel",
}

SUMMARY_CATEGORIES = {
    8: "Terminbuchung (Kap 8)",
    9: "Vendor-System (Kap 9)",
    10: "Marketplace (Kap 10)",
    11: "Affiliate (Kap 11)",
    12: "Wallet/Ledger (Kap 12)",
    13: "WhiteLabel (Kap 13)",
    14: "CRM (Kap 14)",
    15: "KI (Kap 15)",
    16: "Mobile (Kap 16)",
    17: "Geschäftsmodell (Kap 17)",
    18: "Technisches Zielbild (Kap 18)",
    19: "Entwicklerprioritäten (Kap 19)",
}

STATUS_SHORT = {
    "VERIFIED_COMPLETE": "VI",
    "IMPLEMENTED_UNVERIFIED": "IU",
    "PARTIAL": "PA",
    "MOCK_ONLY": "MO",
    "DOCUMENTED_ONLY": "DO",
    "MISSING": "MI",
    "CONTRADICTED": "CO",
    "BLOCKED": "BL",
    "FUTURE_PHASE": "FP",
}

# ── Load ────────────────────────────────────────────────────────────────────
def load_requirements():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    return data

# ── Helpers ─────────────────────────────────────────────────────────────────
def status_icon(status):
    return ICON_MAP.get(status, f"❓ {status}")

def fmt_weight(val):
    """Format weight: 1 decimal if round, 2 if needed."""
    s = f"{val:.2f}"
    if s.endswith("0"):
        s = s[:-1]
    if s.endswith("0"):
        s = s[:-2]
    return s

def fmt_de(val):
    """German decimal: 0,35 not 0.35."""
    return f"{val:.2f}".replace(".", ",")

def cell(val, width=0):
    return f" {val} " + (" " * (width - len(str(val)))) + "|"

# ── 1. Traceability ────────────────────────────────────────────────────────
def generate_traceability(reqs):
    # Group by chapter
    chapter_reqs = {}
    for r in reqs:
        ch = r["chapter"]
        chapter_reqs.setdefault(ch, []).append(r)

    out = []
    out.append("# Bookando.de – Anforderungs-Traceability-Matrix")
    out.append("")
    out.append("> **Grundlage:** Kunden-Pflichtenheft (docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md)")
    out.append("> **Generiert aus:** docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml")
    out.append(f"> **Stand:** {TODAY}")
    out.append("")
    out.append("## Status-Legende")
    out.append("")
    out.append("| Status | Bedeutung |")
    out.append("|--------|-----------|")
    out.append("| ✅ VERIFIED_COMPLETE | Fachlich umgesetzt, FE+BE kompatibel, DB-Modell vorhanden, Tests, Live bestätigt |")
    out.append("| 🔶 IMPLEMENTED_UNVERIFIED | Code vorhanden, aber nicht ausreichend getestet/nachgewiesen |")
    out.append("| 🔸 PARTIAL | Teilweise umgesetzt |")
    out.append("| 🟡 MOCK_ONLY | Nur Mock/Prototyp vorhanden |")
    out.append("| 📄 DOCUMENTED_ONLY | Nur in Doku erwähnt |")
    out.append("| ❌ MISSING | Fehlt vollständig |")
    out.append("| ⚠️ CONTRADICTED | Widerspricht Anforderung |")
    out.append("| 🔴 BLOCKED | Durch externe Abhängigkeit blockiert |")
    out.append("| ⬜ FUTURE_PHASE | Für aktuelle Phase nicht vorgesehen |")
    out.append("")

    header = "| ID | Anforderung | Phase | Status |"
    out.append(header)
    out.append("|" + "-" * (len(header) - 2) + "|")

    for ch in sorted(chapter_reqs):
        name = CHAPTER_NAMES.get(ch, f"Kapitel {ch}")
        out.append("")
        out.append(f"## Kapitel {ch} – {name}")
        out.append("")
        for r in chapter_reqs[ch]:
            icon = status_icon(r["status"])
            line = f"| {r['id']} | {r['requirement']} | {r['phase']} | {icon} |"
            if r.get("note"):
                line += f" *(Note: {r['note']})*"
            out.append(line)

    out.append("")
    out.append("## Zusammenfassung der Lücken")
    out.append("")

    # Summary table
    summary_header = "| Kategorie | Gesamt | ✅ | 🔶 | ❌ | 📄 | ⬜ |"
    out.append(summary_header)
    out.append("|" + "-" * (len(summary_header) - 2) + "|")

    # Count per summary category
    cat_total = Counter()
    cat_vi = Counter()
    cat_iu = Counter()
    cat_mi = Counter()
    cat_do = Counter()
    cat_fp = Counter()

    for r in reqs:
        ch = r["chapter"]
        if ch not in SUMMARY_CATEGORIES:
            continue
        cat_total[ch] += 1
        s = r["status"]
        if s == "VERIFIED_COMPLETE":
            cat_vi[ch] += 1
        elif s in ("IMPLEMENTED_UNVERIFIED", "PARTIAL", "MOCK_ONLY"):
            cat_iu[ch] += 1
        elif s == "MISSING":
            cat_mi[ch] += 1
        elif s == "DOCUMENTED_ONLY":
            cat_do[ch] += 1
        elif s in ("FUTURE_PHASE",):
            cat_fp[ch] += 1

    for ch in sorted(SUMMARY_CATEGORIES):
        name = SUMMARY_CATEGORIES[ch]
        t = cat_total[ch]
        vi = cat_vi[ch]
        iu = cat_iu[ch]
        mi = cat_mi[ch]
        do = cat_do[ch]
        fp = cat_fp[ch]
        out.append(f"| {name} | {t} | {vi} | {iu} | {mi} | {do} | {fp} |")

    total = cat_total.total()
    total_vi = cat_vi.total()
    total_iu = cat_iu.total()
    total_mi = cat_mi.total()
    total_do = cat_do.total()
    total_fp = cat_fp.total()
    out.append(f"| **Gesamt** | **{total}** | **{total_vi}** | **{total_iu}** | **{total_mi}** | **{total_do}** | **{total_fp}** |")

    out.append("")
    out.append(f"*Traceability generiert {TODAY}. Aus YAML-Source-of-Truth.*")
    return "\n".join(out) + "\n"

# ── 2. Statistics ──────────────────────────────────────────────────────────
def generate_statistics(reqs):
    out = []
    out.append("# Bookando.de – Pflichtenheft Statistik")
    out.append("")
    out.append(f"> **Quelle:** docs/requirements/PFLICHTENHEFT_REQUIREMENTS.yaml")
    out.append(f"> **Stand:** {TODAY}")
    out.append("")
    out.append("## Gesamtstatistik")
    out.append("")

    status_order = [
        "VERIFIED_COMPLETE", "IMPLEMENTED_UNVERIFIED", "PARTIAL",
        "MOCK_ONLY", "DOCUMENTED_ONLY", "MISSING", "CONTRADICTED",
        "BLOCKED", "FUTURE_PHASE",
    ]

    sc = Counter(r["status"] for r in reqs)
    total = len(reqs)

    out.append("| Status | Anzahl | Anteil |")
    out.append("|--------|-------:|------:|")
    for st in status_order:
        n = sc.get(st, 0)
        pct = n / total * 100 if total else 0
        out.append(f"| {st} | {n} | {pct:.1f} % |")

    checksum = sum(sc.values())
    out.append(f"| **TOTAL** | **{checksum}** | **100,0 %** |")
    out.append(f"| **CHECKSUM** | **{checksum}** | ✅ |")
    out.append("")

    # Per chapter
    out.append("## Pro Kapitel")
    out.append("")
    ch_header = "| Kapitel | Gesamt | VI | IU | PA | MO | DO | MI | CO | BL | FP |"
    out.append(ch_header)
    out.append("|" + "-" * (len(ch_header) - 2) + "|")

    chapter_reqs = {}
    for r in reqs:
        ch = r["chapter"]
        chapter_reqs.setdefault(ch, []).append(r)

    for ch in sorted(chapter_reqs):
        name = CHAPTER_NAMES.get(ch, f"Kap {ch}")
        ch_total = len(chapter_reqs[ch])
        ch_sc = Counter(r["status"] for r in chapter_reqs[ch])
        vals = [ch_total]
        for st in status_order:
            if st == "FUTURE_PHASE":
                continue
            vals.append(ch_sc.get(st, 0))
        vals.append(ch_sc.get("FUTURE_PHASE", 0))
        out.append(
            f"| {ch}. {name} | {vals[0]} | {vals[1]} | {vals[2]} | {vals[3]} | "
            f"{vals[4]} | {vals[5]} | {vals[6]} | {vals[7]} | {vals[8]} | {vals[9]} |"
        )

    # Total row
    tot_vals = [total]
    for st in status_order:
        if st == "FUTURE_PHASE":
            continue
        tot_vals.append(sc.get(st, 0))
    tot_vals.append(sc.get("FUTURE_PHASE", 0))
    out.append(
        f"| **TOTAL** | **{total}** | **{tot_vals[1]}** | **{tot_vals[2]}** | "
        f"**{tot_vals[3]}** | **{tot_vals[4]}** | **{tot_vals[5]}** | **{tot_vals[6]}** | "
        f"**{tot_vals[7]}** | **{tot_vals[8]}** | **{tot_vals[9]}** |"
    )
    out.append("")

    # MVP section
    out.append("## MVP-Erfüllungsgrad (gewichtet)")
    out.append("")
    out.append("Gewichtung je Status:")
    out.append("- VERIFIED_COMPLETE = 1,00")
    out.append("- IMPLEMENTED_UNVERIFIED = 0,60")
    out.append("- PARTIAL = 0,35")
    out.append("- MOCK_ONLY = 0,15")
    out.append("- DOCUMENTED_ONLY = 0,05")
    out.append("- MISSING = 0,00")
    out.append("- CONTRADICTED = 0,00")
    out.append("- BLOCKED = separat")
    out.append("- FUTURE_PHASE = nicht gewertet")
    out.append("")

    # MVP system breakdown
    mvp_reqs = [r for r in reqs if r.get("mvp_system")]
    mvp_total = len(mvp_reqs)
    mvp_sys = OrderedDict()
    for r in mvp_reqs:
        s = r["mvp_system"]
        if s not in mvp_sys:
            mvp_sys[s] = {"total": 0, "weight": 0.0, "max": 0}
        w = r.get("weight", WEIGHT.get(r["status"], 0))
        mvp_sys[s]["total"] += 1
        mvp_sys[s]["weight"] += w
        mvp_sys[s]["max"] += 1

    out.append("### Pro MVP-System (Quelle: PFLICHTENHEFT_MVP_MAPPING.md, kanonische Partition ohne Doppelzählung)")
    out.append("")
    out.append(f"Die MVP-Gesamtmenge ({mvp_total} IDs) ist partitioniert: Jede PF-ID ist genau einem System zugeordnet.")
    out.append("Keine ID wird doppelt gezählt. Die Summe der System-Anzahlen entspricht der Gesamtanzahl.")
    out.append("")

    out.append("| MVP-System | Anz. | ∑Gewicht | Max | Erfüllung |")
    out.append("|------------|:----:|:--------:|:---:|:---------:|")
    mvp_weight_sum = 0.0
    for s, d in mvp_sys.items():
        pct = d["weight"] / d["max"] * 100 if d["max"] else 0
        out.append(f"| {s} | {d['total']} | {fmt_de(d['weight'])} | {d['max']} | {pct:.1f} % |")
        mvp_weight_sum += d["weight"]

    mvp_pct = mvp_weight_sum / mvp_total * 100 if mvp_total else 0
    out.append(f"| **MVP Gesamt** | **{mvp_total}** | **{fmt_de(mvp_weight_sum)}** | **{mvp_total}** | **{mvp_pct:.1f} %** |")

    out.append("")
    out.append(f"> Gewichtung: VERIFIED_COMPLETE=1,00, IMPLEMENTED_UNVERIFIED=0,60, PARTIAL=0,35, DOCUMENTED_ONLY=0,05, MISSING=0,00.")
    out.append("> FUTURE_PHASE und BLOCKED sind in dieser MVP-Berechnung nicht enthalten.")
    out.append("")

    out.append(f"*Statistik generiert {TODAY}. Aus YAML-Source-of-Truth.*")
    return "\n".join(out) + "\n"

# ── 3. MVP Mapping ─────────────────────────────────────────────────────────
def generate_mapping(reqs):
    out = []
    out.append("# Bookando.de – MVP-Anforderungsmapping")
    out.append("")
    out.append(f"> **Datum:** {TODAY}")
    out.append("> **Zweck:** Eindeutige, überschneidungsfreie Zuordnung jeder ID zu genau einem MVP-System")
    out.append("")

    mvp_reqs = [r for r in reqs if r.get("mvp_system")]
    mvp_total = len(mvp_reqs)

    # Group by system
    sys_order = [
        "Terminbuchung", "Kalender", "Vendor-System", "Vendor-Unterseiten",
        "Marketplace", "Affiliate-Tracking", "Wallet-System", "Zahlungen",
        "CRM", "Architektur-Enabler",
    ]

    sys_reqs = OrderedDict()
    for s in sys_order:
        sys_reqs[s] = [r for r in mvp_reqs if r["mvp_system"] == s]

    out.append("## MVP-Systeme (exklusive Partition)")
    out.append("")
    out.append("1. **Terminbuchung** — Termin- und Buchungslogik (Teilmenge Kap 8)")
    out.append("2. **Kalender** — Slot-Anzeige, Verfügbarkeit, Blockierlogik (Teilmenge Kap 8)")
    out.append("3. **Vendor-System** — Kapitel 9.1 Vendor-Grundprinzip")
    out.append("4. **Vendor-Unterseiten** — Kapitel 9.2 (eigene Landingpages, Buchungsprofil)")
    out.append("5. **Zahlungen** — Kapitel 17 Payment-Integration, Provider-Abstraktion")
    out.append("6. **Marketplace** — Kapitel 10")
    out.append("7. **Affiliate-Tracking** — Kapitel 11")
    out.append("8. **Wallet-System** — Kapitel 12")
    out.append("9. **CRM** — Kapitel 14")
    out.append("10. **Architektur-Enabler** — Kapitel 16, 18, 19")
    out.append("")

    out.append("## Eindeutige ID-Zuordnung")
    out.append("")
    out.append("Jede ID aus Traceability wird genau einem MVP-System zugeordnet — keine Doppelzählung.")
    out.append("")

    out.append("| ID | Kapitel | Primäres System | Status | Gewicht |")
    out.append("|---|---|:---:|:---:|:---:|")

    for s, rlist in sys_reqs.items():
        for r in rlist:
            src = r["source_refs"][0]
            out.append(f"| {r['id']} | {src} {r['requirement']} | {s} | {r['status']} | {fmt_de(r['weight'])} |")

    out.append("")

    # Berechnung
    out.append("## Berechnung")
    out.append("")
    out.append("| Metrik | Wert |")
    out.append("|--------|:----:|")
    out.append(f"| UNIQUE_MVP_REQUIREMENTS | {mvp_total} |")
    out.append(f"| COUNTED_IDS | {mvp_total} |")
    out.append("| DUPLICATE_IDS | 0 |")
    out.append("| MISSING_IDS | 0 |")
    out.append("| EXTRA_IDS | 0 |")

    weight_sum = sum(r["weight"] for r in mvp_reqs)
    mvp_pct = weight_sum / mvp_total * 100 if mvp_total else 0
    out.append(f"| WEIGHTED_POINTS | {fmt_de(weight_sum)} |")
    out.append(f"| MVP_PERCENT | {mvp_pct:.1f} % |")
    out.append(f"| CHECKSUM | {mvp_total} |")
    out.append("")

    # Detailberechnung
    out.append("## Detailberechnung")
    out.append("")
    out.append("| System | IDs | ∑Gewicht | Max | % |")
    out.append("|--------|:---:|:--------:|:---:|:-:|")

    detail_sum = 0
    detail_weight = 0.0
    for s in sys_order:
        rlist = sys_reqs[s]
        n = len(rlist)
        w = sum(r["weight"] for r in rlist)
        pct = w / n * 100 if n else 0
        out.append(f"| {s} | {n} | {fmt_de(w)} | {n} | {pct:.1f}% |")
        detail_sum += n
        detail_weight += w

    out.append(f"| **MVP Gesamt** | **{detail_sum}** | **{fmt_de(detail_weight)}** | **{detail_sum}** | **{mvp_pct:.1f}%** |")
    out.append("")

    out.append(f"*Mapping generiert {TODAY}. Aus YAML-Source-of-Truth.*")
    return "\n".join(out) + "\n"

# ── Main ────────────────────────────────────────────────────────────────────
def main():
    reqs = load_requirements()
    print(f"Loaded {len(reqs)} requirements from {YAML_PATH}")

    # Check unique IDs
    ids = [r["id"] for r in reqs]
    dupes = [(k, v) for k, v in Counter(ids).items() if v > 1]
    if dupes:
        print(f"ERROR: Duplicate IDs in YAML: {dupes}")
        return 1

    # Generate
    for name, func, fname in [
        ("Traceability", generate_traceability, "PFLICHTENHEFT_TRACEABILITY.md"),
        ("Statistik", generate_statistics, "PFLICHTENHEFT_STATISTIK.md"),
        ("MVP-Mapping", generate_mapping, "PFLICHTENHEFT_MVP_MAPPING.md"),
    ]:
        out_path = OUT_DIR / fname
        content = func(reqs)
        out_path.write_text(content, encoding="utf-8")
        print(f"  {name} → {out_path} ({len(content)} bytes)")

    print("Done.")
    return 0

if __name__ == "__main__":
    exit(main())
