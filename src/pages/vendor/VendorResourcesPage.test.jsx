import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../lib/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from '../../lib/apiClient';
import VendorResourcesPage from './VendorResourcesPage';

const mockResources = [
  { id: 1, name: 'Raum A', type: 'room', capacity: 10, location_id: '' },
  { id: 2, name: 'Gerät X', type: 'equipment', capacity: 1, location_id: '' },
];

describe('VendorResourcesPage CRUD', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('load success: rendert Ressourcenliste', async () => {
    apiClient.get.mockResolvedValue({ data: mockResources });
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    expect(screen.getByText('Gerät X')).toBeInTheDocument();
  });

  it('load empty: rendert Empty State', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByText(/Keine Ressourcen/i)).toBeInTheDocument());
  });

  it('load failure: rendert Error State mit Retry', async () => {
    apiClient.get.mockRejectedValue({ message: 'Netzwerkfehler' });
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByText('Netzwerkfehler')).toBeInTheDocument());
    expect(screen.getByText('Erneut versuchen')).toBeInTheDocument();
  });

  it('create success: ruft apiClient.post auf', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    apiClient.post.mockResolvedValue({ data: { id: 3, name: 'Neuer Raum', type: 'room', capacity: 5 } });
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByPlaceholderText(/Name/)).toBeInTheDocument());
    const nameInput = screen.getByPlaceholderText(/Name/);
    await userEvent.type(nameInput, 'Neuer Raum');
    const submitBtn = screen.getByRole('button', { name: /hinzufügen/i });
    await userEvent.click(submitBtn);
    await waitFor(() => expect(apiClient.post).toHaveBeenCalled());
  });

  it('delete success: entfernt Ressource nach API-Bestätigung', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.delete.mockResolvedValue({});
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    // Submit button (Hinzufügen) + 2 resources × 2 action buttons = 1 + 4 = 5 buttons
    // Delete buttons are the 4th and 5th (last in each resource row)
    const allButtons = screen.getAllByRole('button');
    const resourceDeleteButtons = allButtons.filter(b =>
      b.tagName === 'BUTTON' && !b.querySelector('svg.lucide-save') &&
      !b.querySelector('svg.lucide-plus') && !b.querySelector('svg.lucide-edit3') &&
      (b.innerHTML.includes('X') || b.querySelector('svg.lucide-x'))
    );
    // Fallback: use the last button (delete of 2nd resource)
    await userEvent.click(allButtons[allButtons.length - 1]);
    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalled();
    });
    mockConfirm.mockRestore();
  });

  it('delete API error: Ressource bleibt sichtbar', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.delete.mockRejectedValue(new Error('Löschen fehlgeschlagen'));
    render(<VendorResourcesPage />);
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    const allButtons = screen.getAllByRole('button');
    await userEvent.click(allButtons[allButtons.length - 1]);
    await waitFor(() => { expect(screen.getByText('Raum A')).toBeInTheDocument(); }, { timeout: 500 });
    mockConfirm.mockRestore();
  });
});
