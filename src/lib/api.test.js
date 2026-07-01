import { InvoiceApi } from './api';

jest.mock('./apiClient', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: new Blob() }) },
}));

describe('InvoiceApi', () => {
  test('download uses correct backend path /api/invoices/{id}', async () => {
    const { default: apiClient } = require('./apiClient');
    // Don't actually create the blob/download — just verify the request path
    const origCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn().mockReturnValue('blob:fake');
    const origAppendChild = document.body.appendChild;
    document.body.appendChild = jest.fn();
    const origRevoke = URL.revokeObjectURL;
    URL.revokeObjectURL = jest.fn();

    try {
      await InvoiceApi.download('booking-123');
    } catch (e) {
      // DOM manipulation in test env may throw — path check is the goal
    }

    expect(apiClient.get).toHaveBeenCalledWith('/api/invoices/booking-123', { responseType: 'blob' });

    URL.createObjectURL = origCreateObjectURL;
    document.body.appendChild = origAppendChild;
    URL.revokeObjectURL = origRevoke;
  });
});
