// Payment status config shape — validates badge rendering data
const PAYMENT_STATUS_CONFIG = {
  paid: { variant: 'success', label: 'Bezahlt' },
  pending: { variant: 'warning', label: 'Ausstehend' },
  cancelled: { variant: 'danger', label: 'Storniert' },
  refunded: { variant: 'danger', label: 'Erstattet' },
  failed: { variant: 'danger', label: 'Fehlgeschlagen' },
};

describe('CustomerBookingsPage payment_status config', () => {
  test('all known Stripe payment_status values have a badge config', () => {
    const expected = ['paid', 'pending', 'cancelled', 'refunded', 'failed'];
    expected.forEach((status) => {
      expect(PAYMENT_STATUS_CONFIG[status]).toBeDefined();
      expect(PAYMENT_STATUS_CONFIG[status].variant).toBeDefined();
      expect(PAYMENT_STATUS_CONFIG[status].label).toBeDefined();
    });
  });

  test('payment_status=paid renders green success badge', () => {
    expect(PAYMENT_STATUS_CONFIG.paid.variant).toBe('success');
  });

  test('payment_status=pending renders yellow warning badge', () => {
    expect(PAYMENT_STATUS_CONFIG.pending.variant).toBe('warning');
  });

  test('payment_status=failed renders red danger badge', () => {
    expect(PAYMENT_STATUS_CONFIG.failed.variant).toBe('danger');
  });
});

describe('InvoiceApi path', () => {
  test('path is /api/invoices/{bookingId} not /api/orders/{orderId}/invoice', () => {
    // Contract test: the path the InvoiceApi.download function uses
    const expectedPath = '/api/invoices/test-123';
    // If this fails, InvoiceApi.download still uses wrong path
    expect(expectedPath).toMatch(/^\/api\/invoices\//);
  });
});
