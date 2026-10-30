/**
 * Pure utility functions used across the app.
 * Extracted here for testability.
 */

/**
 * Escape HTML special characters to prevent XSS.
 * @param {*} s - Value to escape (coerced to string)
 * @returns {string} - HTML-safe string
 */
export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Format an ISO date (YYYY-MM-DD) to "May 7, 2027" style.
 * @param {string} iso - ISO date string
 * @returns {string} - Formatted date or empty string
 */
export function formatLongDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))));
}

/**
 * Calculate the countdown display for days until due.
 * @param {number|null} daysLeft - Days until due date
 * @returns {{ n: string|number, l: string }} - Number and label for display
 */
export function dueCountdown(daysLeft) {
  if (daysLeft == null) return { n: '—', l: 'Days to due' };
  if (daysLeft > 0) return { n: daysLeft, l: 'Days to due' };
  if (daysLeft === 0) return { n: 0, l: 'Due today' };
  return { n: Math.abs(daysLeft), l: 'Days past due' };
}
