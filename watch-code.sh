#!/bin/bash
# 🔴 Live Code Watcher - Prüft bei jeder Dateiänderung sofort auf Fehler
# Start: bash watch-code.sh

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
WATCH_DIR="$PROJECT_DIR/src"

echo "🔴 Live Code Watcher gestartet für $WATCH_DIR"
echo "Drücke Ctrl+C zum Beenden"
echo "────────────────────────────────────────"

# Initialer Check
echo "📊 Initialer Build-Check..."
cd "$PROJECT_DIR"
npx react-scripts build 2>&1 | tail -5

# Auf Änderungen wachen
if command -v inotifywait &>/dev/null; then
  inotifywait -m -r -e modify,create,delete --format '%w%f' "$WATCH_DIR" 2>/dev/null | while read FILE
  do
    case "$FILE" in
      *.js|*.jsx)
        # Syntax-Check bei JS Änderungen
        node -c "$FILE" 2>&1 | grep -v "^$" | while read line; do
          echo "⚠️  $FILE: $line"
        done
        ;;
      *.css)
        echo "📝 CSS geändert: $FILE"
        ;;
    esac
  done
else
  echo "⚠️  inotifywait nicht verfügbar - verwende Polling-Modus"
  echo "Installiere: apt-get install inotify-tools"
  
  # Fallback: Polling alle 3 Sekunden
  LAST=""
  while true; do
    HASH=$(find "$WATCH_DIR" -name "*.js" -o -name "*.jsx" 2>/dev/null | sort | xargs stat -c %Y 2>/dev/null | md5sum)
    if [ "$HASH" != "$LAST" ] && [ -n "$HASH" ]; then
      LAST="$HASH"
      echo "🔄 Änderung erkannt - Prüfe..."
    fi
    sleep 3
  done
fi
