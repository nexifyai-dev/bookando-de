import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-shell-bg)] px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-[16px] flex items-center justify-center bg-[var(--color-danger-bg)]">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Ein Fehler ist aufgetreten</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">Bitte lade die Seite neu oder versuche es später erneut.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
