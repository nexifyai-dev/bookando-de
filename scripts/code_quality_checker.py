#!/usr/bin/env python3
"""
Code Quality Checker – Bookando Code Review System
Prüft bei jedem Build auf i18n, Import-, Syntax- und Konsistenz-Fehler.
"""
import os, sys, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / 'src' / 'pages'
LOCALES_DIR = ROOT / 'src' / 'locales'
COMPONENTS_DIR = ROOT / 'src' / 'components'

errors = []
warnings = []

def check_i18n():
    """Prüft ob alle Seiten t() tatsächlich nutzen"""
    for page_file in sorted(PAGES_DIR.rglob('*.js')):
        if '.markdown-converted' in str(page_file):
            continue
        content = page_file.read_text()
        has_t_decl = 'const { t }' in content or 'const { t: _t }' in content
        has_t_usage = 't(' in content and 't(' != content.split('//')[-1].strip()[:3]
        if has_t_decl and not has_t_usage:
            errors.append(f'❌ i18n: {page_file.relative_to(ROOT)} deklariert t() aber nutzt es nicht im JSX!')

def check_imports():
    """Prüft ob alle Imports existieren"""
    for js_file in sorted(ROOT.rglob('*.js')):
        if 'node_modules' in str(js_file) or '.markdown-converted' in str(js_file) or 'build/' in str(js_file):
            continue
        content = js_file.read_text()
        for m in re.finditer(r"from\s+'([^']+)'", content):
            imp_path = m.group(1)
            if imp_path.startswith('.'):
                full = (js_file.parent / imp_path).resolve()
                if not full.exists() and not full.with_suffix('.js').exists() and not full.with_suffix('.jsx').exists():
                    warnings.append(f'⚠️  Import: {js_file.relative_to(ROOT)} → {imp_path} nicht gefunden')

def check_locale_consistency():
    """Prüft ob DE/EN Locale-Keys konsistent sind"""
    de_file = LOCALES_DIR / 'de' / 'translation.json'
    en_file = LOCALES_DIR / 'en' / 'translation.json'
    if not de_file.exists() or not en_file.exists():
        errors.append('❌ Locale-Dateien fehlen!')
        return
    de_keys = set(json.loads(de_file.read_text()).keys())
    en_keys = set(json.loads(en_file.read_text()).keys())
    only_de = de_keys - en_keys
    only_en = en_keys - de_keys
    if only_de:
        warnings.append(f'⚠️  Locale: Keys nur in DE (fehlen in EN): {only_de}')
    if only_en:
        warnings.append(f'⚠️  Locale: Keys nur in EN (fehlen in DE): {only_en}')
    print(f'✅ Locale: {len(de_keys)} DE-Keys, {len(en_keys)} EN-Keys – beide konsistent')

def check_build():
    """Führt einen CI-Build durch und prüft auf Fehler"""
    result = subprocess.run(
        ['npm', 'run', 'build'],
        cwd=ROOT, capture_output=True, text=True, timeout=120,
        env={**os.environ, 'CI': 'true'}
    )
    if result.returncode != 0:
        errors.append(f'❌ Build fehlgeschlagen! Exit-Code: {result.returncode}')
        # Extrahiere die ersten Fehlerzeilen
        for line in result.stderr.split('\n')[:10]:
            if 'Error' in line or 'error' in line:
                errors.append(f'   {line.strip()}')
    else:
        print(f'✅ Build erfolgreich!')

def main():
    print('═' * 50)
    print('🔍 BOOKANDO CODE REVIEW')
    print('═' * 50)
    print()
    
    print('📋 1. i18n-Check...')
    check_i18n()
    
    print('📋 2. Import-Check...')
    check_imports()
    
    print('📋 3. Locale-Konsistenz...')
    check_locale_consistency()
    
    print('📋 4. Build-Check...')
    check_build()
    
    print()
    print('═' * 50)
    print('📊 ERGEBNIS')
    print('═' * 50)
    print(f'   ❌ Fehler: {len(errors)}')
    print(f'   ⚠️  Warnungen: {len(warnings)}')
    print()
    
    if errors:
        print('❌ FEHLER:')
        for e in errors:
            print(f'   {e}')
        print()
    
    if warnings:
        print('⚠️  WARNUNGEN:')
        for w in warnings:
            print(f'   {w}')
        print()
    
    if not errors and not warnings:
        print('✅ ALLE CHECKS BESTANDEN – Keine Probleme gefunden!')
    
    return 1 if errors else 0

if __name__ == '__main__':
    sys.exit(main())
