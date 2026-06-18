import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../../src/lib/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const apiClient = require('../../../src/lib/apiClient');
import VendorResourcesPage from './VendorResourcesPage';

const mockResources = [
  { id: 1, name: 'Raum A', type: 'room', capacity: 10 },
  { id: 2, name: 'Gerät X', type: 'equipment', capacity: 1 },
];

const renderPage = () => render(<VendorResourcesPage />);

describe('VendorResourcesPage CRUD', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  // ─── Load ───
  it('load success: rendert alle Ressourcen', async () => {
    apiClient.get.mockResolvedValue({ data: mockResources });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Raum A')).toBeInTheDocument();
      expect(screen.getByText('Gerät X')).toBeInTheDocument();
    });
  });

  it('load empty: zeigt Empty-State', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    renderPage();
    await waitFor(() => expect(screen.getByText(/Keine Ressourcen/i)).toBeInTheDocument());
  });

  it('load failure: zeigt Fehler mit Retry-Button', async () => {
    apiClient.get.mockRejectedValue({ message: 'Netzwerkfehler' });
    renderPage();
    await waitFor(() => expect(screen.getByText('Netzwerkfehler')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /erneut versuchen/i })).toBeInTheDocument();
  });

  // ─── Create ───
  it('create success: sendet korrekten POST-Payload', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    apiClient.post.mockResolvedValue({});
    renderPage();
    await waitFor(() => expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Neuer Raum');
    await userEvent.click(screen.getByRole('button', { name: /hinzufügen/i }));
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/vendor/resources',
        expect.objectContaining({ name: 'Neuer Raum', type: 'room', capacity: 1 }));
    });
  });

  it('create API failure: Formular bleibt gefüllt', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    apiClient.post.mockRejectedValue(new Error('Serverfehler'));
    renderPage();
    await waitFor(() => expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test');
    await userEvent.click(screen.getByRole('button', { name: /hinzufügen/i }));
    await waitFor(() => {
      // Form data stays because we only reset on success
      expect(screen.getByPlaceholderText(/Name/i)).toHaveValue('Test');
    });
  });

  it('create double-submit blocked: Button disabled während Saving', async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    let resolvePost;
    apiClient.post.mockImplementation(() => new Promise(r => { resolvePost = r; }));
    renderPage();
    await waitFor(() => expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test');
    await userEvent.click(screen.getByRole('button', { name: /hinzufügen/i }));
    // Button should be disabled while saving
    expect(screen.getByRole('button', { name: /hinzufügen/i })).toBeDisabled();
    resolvePost({});
  });

  // ─── Update ───
  it('update success: sendet korrekten PATCH-Payload', async () => {
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.patch.mockResolvedValue({});
    renderPage();
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    // Klick auf Bearbeiten-Button von Raum A
    await userEvent.click(screen.getByRole('button', { name: /Ressource bearbeiten Raum A/i }));
    await userEvent.clear(screen.getByPlaceholderText(/Name/i));
    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Raum A+');
    await userEvent.click(screen.getByRole('button', { name: /Speichern/i }));
    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith('/api/vendor/resources/1',
        expect.objectContaining({ name: 'Raum A+', capacity: 10 }));
    });
  });

  it('update API failure: Resource bleibt unverändert sichtbar', async () => {
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.patch.mockRejectedValue(new Error('Update-Fehler'));
    renderPage();
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Ressource bearbeiten Raum A/i }));
    await userEvent.clear(screen.getByPlaceholderText(/Name/i));
    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test');
    await userEvent.click(screen.getByRole('button', { name: /Speichern/i }));
    await new Promise(r => setTimeout(r, 100));
    expect(screen.getByText('Raum A')).toBeInTheDocument();
  });

  // ─── Delete ───
  it('delete success: entfernt nur die gelöschte Resource, andere bleibt', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.delete.mockResolvedValue({});
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Raum A')).toBeInTheDocument();
      expect(screen.getByText('Gerät X')).toBeInTheDocument();
    });
    // Lösche Raum A
    await userEvent.click(screen.getByRole('button', { name: /Ressource löschen Raum A/i }));
    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/api/vendor/resources/1');
      expect(screen.queryByText('Raum A')).not.toBeInTheDocument();
      expect(screen.getByText('Gerät X')).toBeInTheDocument();
    });
    mockConfirm.mockRestore();
  });

  it('delete API failure: angeklickte Resource bleibt sichtbar', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    apiClient.get.mockResolvedValue({ data: mockResources });
    apiClient.delete.mockRejectedValue(new Error('Löschen fehlgeschlagen'));
    renderPage();
    await waitFor(() => expect(screen.getByText('Raum A')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Ressource löschen Raum A/i }));
    await waitFor(() => {
      expect(screen.getByText('Raum A')).toBeInTheDocument();
    }, { timeout: 500 });
    mockConfirm.mockRestore();
  });
});
