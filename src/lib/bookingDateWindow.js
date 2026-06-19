export function toLocalISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysISO(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error('invalid_iso_date');
  date.setDate(date.getDate() + days);
  return toLocalISODate(date);
}

export function buildDateWindow(startDate, count = 14) {
  if (!Number.isInteger(count) || count < 1 || count > 31) {
    throw new Error('invalid_date_window_count');
  }
  return Array.from({ length: count }, (_, index) => addDaysISO(startDate, index));
}

export function clampToToday(candidate, today) {
  return candidate < today ? today : candidate;
}
