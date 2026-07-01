// VendorVouchersPage status config + VouchersApi contract tests

const voucherStatusConfig = {
  active: { className: 'bg-success-light text-success-dark', label: 'Aktiv' },
  redeemed: { className: 'bg-muted text-muted-dark', label: 'Eingelöst' },
  expired: { className: 'bg-danger-light text-danger-dark', label: 'Abgelaufen' },
};

describe('VendorVouchersPage status config', () => {
  test('all three voucher statuses defined', () => {
    expect(voucherStatusConfig.active).toBeDefined();
    expect(voucherStatusConfig.active.label).toBe('Aktiv');
    expect(voucherStatusConfig.redeemed).toBeDefined();
    expect(voucherStatusConfig.redeemed.label).toBe('Eingelöst');
    expect(voucherStatusConfig.expired).toBeDefined();
    expect(voucherStatusConfig.expired.label).toBe('Abgelaufen');
  });

  test('active is green, expired is red', () => {
    expect(voucherStatusConfig.active.className).toContain('success');
    expect(voucherStatusConfig.expired.className).toContain('danger');
  });
});

describe('VouchersApi contract', () => {
  test('VouchersApi is importable from api module', () => {
    const { VouchersApi } = require('../../lib/api');
    expect(VouchersApi).toBeDefined();
    expect(typeof VouchersApi.list).toBe('function');
    expect(typeof VouchersApi.create).toBe('function');
    expect(typeof VouchersApi.update).toBe('function');
    expect(typeof VouchersApi.remove).toBe('function');
  });
});
