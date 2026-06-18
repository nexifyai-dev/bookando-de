import React from 'react';

export default function PageErrorState({ title = 'Fehler beim Laden', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-5" role="alert">
      <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-danger-bg)] rounded-full mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-danger)]">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">{title}</h2>
      {message && <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry}
          className="inline-flex items-center h-11 px-6 bg-[var(--color-primary)] text-white font-semibold text-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
          Erneut versuchen
        </button>
      )}
    </div>
  );
}
