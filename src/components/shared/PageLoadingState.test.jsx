import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLoadingState from './PageLoadingState';

describe('PageLoadingState', () => {
  it('rendert mit Standardtext und role="status"', () => {
    render(<PageLoadingState />);
    expect(screen.getByRole('status')).toHaveTextContent('Wird geladen…');
  });

  it('rendert mit benutzerdefiniertem Text', () => {
    render(<PageLoadingState text="Daten werden geladen…" />);
    expect(screen.getByText('Daten werden geladen…')).toBeInTheDocument();
  });
});
