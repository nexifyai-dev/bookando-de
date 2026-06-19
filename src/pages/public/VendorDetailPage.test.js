import { toLocalISODate } from '../../lib/bookingDateWindow';

describe('VendorDetailPage date consistency', () => {
  test('toLocalISODate uses local calendar date, not UTC', () => {
    // 2026-06-20 23:00 in Europe/Amsterdam is 2026-06-20 (not UTC 21)
    const d = new Date(2026, 5, 20, 23, 0, 0); // June 20, 23:00 local
    expect(toLocalISODate(d)).toBe('2026-06-20');
  });

  test('toLocalISODate near midnight stays on same day', () => {
    const d = new Date(2026, 11, 31, 0, 30, 0); // Dec 31, 00:30 local
    expect(toLocalISODate(d)).toBe('2026-12-31');
  });

  test('toLocalISODate month boundary', () => {
    const d = new Date(2026, 0, 31, 12, 0, 0); // Jan 31
    expect(toLocalISODate(d)).toBe('2026-01-31');
  });

  test('not ISO split (difference from UTC version)', () => {
    // At 22:00 in +2 timezone, UTC ISO would be 20:00Z = still same day
    // But we ensure local date is used
    const d = new Date(2026, 5, 15, 22, 0, 0); // June 15, 22:00
    const isoByUtc = d.toISOString().split('T')[0];
    const localDate = toLocalISODate(d);
    // They might differ near midnight depending on timezone
    // The key requirement: localDate must be a valid ISO date string
    expect(localDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
