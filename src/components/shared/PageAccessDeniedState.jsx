import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function PageAccessDeniedState({ message = 'Sie haben keine Berechtigung für diese Seite.' }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-5" role="alert">
      <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-danger-bg)] rounded-full mb-4">
        <ShieldOff size={24} className="text-[var(--color-danger)]" />
      </div>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">Zugriff verweigert</h2>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">{message}</p>
      <button type="button" onClick={() => navigate('/portal')}
        className="inline-flex items-center h-11 px-6 bg-[var(--color-primary)] text-white font-semibold text-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
        Zum Dashboard
      </button>
    </div>
  );
}
