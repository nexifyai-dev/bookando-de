import React from 'react';

export default function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-shell-bg)]" role="status" aria-label="Seite lädt">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-divider)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-tertiary)]">Lade...</p>
      </div>
    </div>
  );
}
