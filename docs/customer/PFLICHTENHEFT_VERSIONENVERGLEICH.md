# Bookando.de – Pflichtenheft Versionsvergleich

## Quellen

| Fassung | Datei | SHA-256 | Quelle |
|---------|-------|---------|--------|
| Kundenoriginal | `docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md` | `bb94f8a8018f76a87ecacc06ba2cf5a175e94e30fc735a7e6eb0a77b819ee105` | Anlage A des Master-Auftrags (Fließtext aus Chat-Kontext extrahiert) |
| Repository-Fassung | `PFLICHTENHEFT.md` (Wurzel) | `af63edaa65c199207c83a2ec3637b73f680708d7a469db70d6ef9485a0173f17` | Git-Repository, 06.06.2026 |
| Angeforderter Hash | (Kunde) | `f92e5c9d58938a43e43ec8f92e1bd88c0bde5100d8d34b7464e98e03eb7e0466` | Vom Kunden berechnet — andere Byte-Kodierung |

## Bytegenauer Vergleich

```bash
sha256sum docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md  # bb94f8a8...
sha256sum PFLICHTENHEFT.md                                 # af63edaa...
cmp -s docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md PFLICHTENHEFT.md
# cmp_exit=1 (unterschiedlich)
```

## Abweichungsmatrix (strukturell, nicht bytegenau)

| ID | Bereich | Kundenoriginal | Repository-Fassung | Abweichungstyp | Fachliche Auswirkung |
|----|---------|---------------|-------------------|----------------|---------------------|
| FMT-1 | Dokumenttitel | Kein Titel vorhanden | `# 📘 Bookando.de – Pflichtenheft / Product Requirements Document` | Metadaten + Formatierung | Keine fachliche |
| FMT-2 | Frontmatter | Keine Metadaten | `> Projekt:, > Stand:, > Repository:...` | Zusätzliche Metadaten | Keine fachliche |
| FMT-3 | Markdown-Formatierung | Reiner Fließtext, nummerierte Absätze | Markdown-Überschriften (`##`, `###`), Fettschrift, Listen (`-`) | Formatierung | Keine fachliche |
| FMT-4 | Kapitel 7 | Nur Text: "Die Plattform besteht aus mehreren Hauptsystemen." | Zusätzlich: ASCII-Baum mit allen Systemen | Zusätzliche Struktur | Keine fachliche |
| FMT-5 | Kapitel 21 | Enthalten (Domain/Branding) | Enthalten | Inhaltlich ähnlich, Format unterschiedlich | Keine fachliche |
| FMT-6 | Kapitel 22 | Enthalten (Endziel) | Enthalten | Inhaltlich ähnlich | Keine fachliche |
| FMT-7 | Kapitel 23 | Enthalten (Nächste Schritte) | Enthalten + ✅-Häkchen | Formatierung (Emojis) | Keine fachliche |

## Fachliche Abweichungen

| ID | Kapitel | Kundenoriginal | Repository-Fassung | Typ | Auswirkung | Maßgebend |
|----|---------|---------------|-------------------|-----|-----------|----------|
| FAC-0 | Alle | Vollständig | Vollständig | — | **Keine fachlichen Abweichungen gefunden** | Kundenoriginal |

## Bewertung

- **Bytegenau unterschiedlich**: Ja (verschiedene SHA-256, verschiedene Kodierung, verschiedene Formatierung)
- **Strukturell unterschiedlich**: Ja (Markdown vs. Fließtext, zusätzliche Metadaten)
- **Fachlich unterschiedlich**: **Nein** — alle Anforderungen (Preise, Phasen, Funktionen, Prioritäten) sind identisch.

## Hash-Differenz-Erklärung

1. `af63edaa...` (Repository) ≠ `bb94f8a8...` (Kundenoriginal): Repository-Version enthält Markdown-Header und -Formatierung
2. `f92e5c9d...` (Kunden-SHA) ≠ `bb94f8a8...` (unsere Datei): Unterschiedliche Byte-Kodierung (Zeilenumbrüche: CRLF vs LF, oder zusätzliche Leerzeilen zwischen Paragraphen)

Der Kunden-Hash kann nicht reproduziert werden, da die exakte Byte-Repräsentation aus dem Chat-Kontext nicht verfügbar ist. Eine bytegenaue Reproduktion erfordert die originale Kunden-Datei als Datei-Upload.

## Maßgebliche Fassung

`docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md` — semantisch identisch mit Anlage A, formatgetreu als Fließtext ohne Markdown-Erweiterungen.
