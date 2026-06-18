import React from 'react';

export default function PageLoadingState({ text = 'Wird geladen…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="status" aria-label="Ladezustand">
      <div className="h-10 w-10 border-4 border-[var(--color-primary)] border-t-transparent animate-spin mb-4" style={{ borderRadius: 'var(--radius-full)' }} />
      <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>
    </div>
  );
}
