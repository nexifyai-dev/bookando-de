import React from 'react';

export default function PageEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-5">
      {Icon ? <Icon size={44} className="text-[var(--color-text-tertiary)] mb-4 opacity-40" /> : (
        <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-surface-sunken)] rounded-full mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-tertiary)] opacity-40"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
      )}
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{title || 'Keine Einträge vorhanden'}</h3>
      {description && <p className="text-xs text-[var(--color-text-tertiary)] max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
