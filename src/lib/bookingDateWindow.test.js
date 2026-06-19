import { addDaysISO, buildDateWindow, clampToToday } from './bookingDateWindow';

describe('bookingDateWindow', () => {
  test('adds days across month boundaries', () => {
    expect(addDaysISO('2026-06-30', 1)).toBe('2026-07-01');
  });

  test('creates deterministic date windows', () => {
    expect(buildDateWindow('2026-06-19', 3)).toEqual([
      '2026-06-19',
      '2026-06-20',
      '2026-06-21',
    ]);
  });

  test('does not allow a window before today', () => {
    expect(clampToToday('2026-06-01', '2026-06-19')).toBe('2026-06-19');
    expect(clampToToday('2026-06-20', '2026-06-19')).toBe('2026-06-20');
  });

  test('rejects unreasonable window sizes', () => {
    expect(() => buildDateWindow('2026-06-19', 0)).toThrow('invalid_date_window_count');
    expect(() => buildDateWindow('2026-06-19', 32)).toThrow('invalid_date_window_count');
  });
});
