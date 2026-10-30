import { describe, it, expect } from 'vitest';
import { escapeHtml, formatLongDate, dueCountdown } from './helpers.js';

describe('helper utilities', () => {
  describe('escapeHtml', () => {
    it('escapes ampersand', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('escapes less than', () => {
      expect(escapeHtml('A < B')).toBe('A &lt; B');
    });

    it('escapes greater than', () => {
      expect(escapeHtml('A > B')).toBe('A &gt; B');
    });

    it('escapes double quotes', () => {
      expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
    });

    it('handles multiple special characters', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('handles null', () => {
      expect(escapeHtml(null)).toBe('');
    });

    it('handles undefined', () => {
      expect(escapeHtml(undefined)).toBe('');
    });

    it('converts numbers to string', () => {
      expect(escapeHtml(123)).toBe('123');
    });

    it('handles empty string', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('handles string with no special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });

    it('handles object (via toString)', () => {
      expect(escapeHtml({ toString: () => '<obj>' })).toBe('&lt;obj&gt;');
    });
  });

  describe('formatLongDate', () => {
    it('formats valid ISO date', () => {
      expect(formatLongDate('2027-05-07')).toBe('May 7, 2027');
    });

    it('formats date at start of month', () => {
      expect(formatLongDate('2026-01-01')).toBe('January 1, 2026');
    });

    it('formats date at end of year', () => {
      expect(formatLongDate('2026-12-31')).toBe('December 31, 2026');
    });

    it('returns empty string for null', () => {
      expect(formatLongDate(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(formatLongDate(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(formatLongDate('')).toBe('');
    });

    it('returns empty string for invalid format', () => {
      expect(formatLongDate('2027-5-7')).toBe('');
      expect(formatLongDate('May 7, 2027')).toBe('');
      expect(formatLongDate('invalid')).toBe('');
    });
  });

  describe('dueCountdown', () => {
    it('returns placeholder for null', () => {
      expect(dueCountdown(null)).toEqual({ n: '—', l: 'Days to due' });
    });

    it('returns placeholder for undefined', () => {
      expect(dueCountdown(undefined)).toEqual({ n: '—', l: 'Days to due' });
    });

    it('returns "Due today" for 0 days', () => {
      expect(dueCountdown(0)).toEqual({ n: 0, l: 'Due today' });
    });

    it('returns days to due for positive days', () => {
      expect(dueCountdown(30)).toEqual({ n: 30, l: 'Days to due' });
      expect(dueCountdown(1)).toEqual({ n: 1, l: 'Days to due' });
    });

    it('returns days past due for negative days', () => {
      expect(dueCountdown(-5)).toEqual({ n: 5, l: 'Days past due' });
      expect(dueCountdown(-1)).toEqual({ n: 1, l: 'Days past due' });
    });
  });
});
