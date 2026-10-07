/** America/New_York date helpers */

const TZ = 'America/New_York';

export function todayNY() {
  return formatNYDate(new Date());
}

export function formatNYDate(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year').value;
  const m = parts.find((p) => p.type === 'month').value;
  const d = parts.find((p) => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(dt);
}

export function formatDisplayDateTime(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const aMs = Date.UTC(ay, am - 1, ad);
  const bMs = Date.UTC(by, bm - 1, bd);
  return Math.round((aMs - bMs) / 86400000);
}

/**
 * Pregnancy week from due date (LMP model: ~280 days).
 * Week = floor((280 - daysUntilDue) / 7) + 1, clamped 1–42.
 */
export function pregnancyWeek(dueDate, onDate = todayNY()) {
  if (!dueDate) return null;
  const daysUntil = daysBetween(dueDate, onDate);
  const daysPregnant = 280 - daysUntil;
  if (daysPregnant < 0) return 1;
  const week = Math.floor(daysPregnant / 7) + 1;
  return Math.min(42, Math.max(1, week));
}

/**
 * Trimester from pregnancy week (standard boundaries):
 * 1st = weeks 1–13, 2nd = weeks 14–27, 3rd = week 28+.
 */
export function trimesterForWeek(week) {
  if (week == null || Number.isNaN(Number(week))) return null;
  const w = Number(week);
  if (w <= 13) return { number: 1, label: '1st' };
  if (w <= 27) return { number: 2, label: '2nd' };
  return { number: 3, label: '3rd' };
}

export function daysUntilDue(dueDate, onDate = todayNY()) {
  if (!dueDate) return null;
  return daysBetween(dueDate, onDate);
}

export function addDays(isoDate, n) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

export { TZ };
