import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  todayNY,
  formatNYDate,
  formatDisplayDate,
  formatMonthDay,
  formatDisplayDateTime,
  daysBetween,
  pregnancyWeek,
  trimesterForWeek,
  daysUntilDue,
  addDays,
} from './dates.js';

describe('dates utilities', () => {
  describe('formatNYDate', () => {
    it('formats a Date object to YYYY-MM-DD in America/New_York', () => {
      const date = new Date('2026-05-15T12:00:00Z');
      const result = formatNYDate(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('todayNY', () => {
    it('returns current date in YYYY-MM-DD format', () => {
      const result = todayNY();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDisplayDate', () => {
    it('returns empty string for empty input', () => {
      expect(formatDisplayDate('')).toBe('');
      expect(formatDisplayDate(null)).toBe('');
      expect(formatDisplayDate(undefined)).toBe('');
    });

    it('formats YYYY-MM-DD to human-readable date', () => {
      const result = formatDisplayDate('2026-05-15');
      expect(result).toContain('May');
      expect(result).toContain('15');
    });
  });

  describe('formatMonthDay', () => {
    it('returns empty string for empty input', () => {
      expect(formatMonthDay('')).toBe('');
      expect(formatMonthDay(null)).toBe('');
    });

    it('formats YYYY-MM-DD to "Month Day" format', () => {
      const result = formatMonthDay('2026-12-25');
      expect(result).toBe('Dec 25');
    });
  });

  describe('formatDisplayDateTime', () => {
    it('returns empty string for empty input', () => {
      expect(formatDisplayDateTime('')).toBe('');
      expect(formatDisplayDateTime(null)).toBe('');
    });

    it('formats ISO datetime to human-readable format', () => {
      const result = formatDisplayDateTime('2026-05-15T14:30:00');
      expect(result).toContain('May');
      expect(result).toContain('15');
    });
  });

  describe('daysBetween', () => {
    it('returns 0 for same date', () => {
      expect(daysBetween('2026-05-15', '2026-05-15')).toBe(0);
    });

    it('returns positive number when first date is later', () => {
      expect(daysBetween('2026-05-20', '2026-05-15')).toBe(5);
    });

    it('returns negative number when first date is earlier', () => {
      expect(daysBetween('2026-05-10', '2026-05-15')).toBe(-5);
    });

    it('handles month boundaries', () => {
      expect(daysBetween('2026-06-01', '2026-05-31')).toBe(1);
    });

    it('handles year boundaries', () => {
      expect(daysBetween('2027-01-01', '2026-12-31')).toBe(1);
    });
  });

  describe('pregnancyWeek', () => {
    it('returns null for null due date', () => {
      expect(pregnancyWeek(null)).toBe(null);
      expect(pregnancyWeek(undefined)).toBe(null);
    });

    it('returns week 1 for date far before pregnancy (280+ days to due)', () => {
      expect(pregnancyWeek('2027-05-15', '2026-05-15')).toBe(1);
    });

    it('returns week 41 on due date (280 days pregnant)', () => {
      // Due date = 280 days pregnant = week 41 (floor(280/7)+1 = 41)
      expect(pregnancyWeek('2026-05-15', '2026-05-15')).toBe(41);
    });

    it('returns week 40 the day before due date', () => {
      // Day before due = 279 days pregnant = week 40
      expect(pregnancyWeek('2026-05-15', '2026-05-14')).toBe(40);
    });

    it('returns week 1 at the start of pregnancy (0-6 days pregnant)', () => {
      // 280 days before due = day 0 = week 1
      expect(pregnancyWeek('2027-01-09', '2026-04-04')).toBe(1);
    });

    it('clamps to week 42 maximum', () => {
      expect(pregnancyWeek('2026-05-15', '2026-06-15')).toBe(42);
    });

    it('clamps to week 1 minimum', () => {
      expect(pregnancyWeek('2027-05-15', '2026-01-01')).toBe(1);
    });

    it('calculates trimester boundaries correctly', () => {
      const dueDate = '2026-10-01';
      // Week 13: days 84-90 pregnant (days until due: 190-196)
      // Week 14: days 91-97 pregnant (days until due: 183-189)
      // Week 27: days 182-188 pregnant (days until due: 92-98)
      // Week 28: days 189-195 pregnant (days until due: 85-91)
      
      // Let's verify by testing specific dates
      // Due date 2026-10-01, we need to find when week 14 starts
      // Week 14 starts at day 91 pregnant (days until = 280-91 = 189)
      // So date = 2026-10-01 - 189 days = 2026-03-26
      expect(pregnancyWeek(dueDate, '2026-03-26')).toBe(14);
      
      // Week 28 starts at day 189 pregnant (days until = 280-189 = 91)
      // So date = 2026-10-01 - 91 days = 2026-07-02
      expect(pregnancyWeek(dueDate, '2026-07-02')).toBe(28);
    });

    it('handles day-by-day boundaries at trimester edges', () => {
      const dueDate = '2026-10-01';
      // Week 13 is days 84-90, week 14 is days 91-97
      // Day 90: daysUntil = 190, date = 2026-10-01 - 190 = 2026-03-25
      const week13LastDay = pregnancyWeek(dueDate, '2026-03-25');
      const week14FirstDay = pregnancyWeek(dueDate, '2026-03-26');
      expect(week13LastDay).toBe(13);
      expect(week14FirstDay).toBe(14);
    });
  });

  describe('trimesterForWeek', () => {
    it('returns null for null/NaN input', () => {
      expect(trimesterForWeek(null)).toBe(null);
      expect(trimesterForWeek(undefined)).toBe(null);
      expect(trimesterForWeek(NaN)).toBe(null);
    });

    it('returns 1st trimester for weeks 1-13', () => {
      expect(trimesterForWeek(1)).toEqual({ number: 1, label: '1st' });
      expect(trimesterForWeek(7)).toEqual({ number: 1, label: '1st' });
      expect(trimesterForWeek(13)).toEqual({ number: 1, label: '1st' });
    });

    it('returns 2nd trimester for weeks 14-27 (US standard)', () => {
      expect(trimesterForWeek(14)).toEqual({ number: 2, label: '2nd' });
      expect(trimesterForWeek(20)).toEqual({ number: 2, label: '2nd' });
      expect(trimesterForWeek(27)).toEqual({ number: 2, label: '2nd' });
    });

    it('returns 3rd trimester for week 28+', () => {
      expect(trimesterForWeek(28)).toEqual({ number: 3, label: '3rd' });
      expect(trimesterForWeek(35)).toEqual({ number: 3, label: '3rd' });
      expect(trimesterForWeek(40)).toEqual({ number: 3, label: '3rd' });
      expect(trimesterForWeek(42)).toEqual({ number: 3, label: '3rd' });
    });

    it('handles boundary between 1st and 2nd trimester (week 13 vs 14)', () => {
      expect(trimesterForWeek(13).number).toBe(1);
      expect(trimesterForWeek(14).number).toBe(2);
    });

    it('handles boundary between 2nd and 3rd trimester (week 27 vs 28)', () => {
      expect(trimesterForWeek(27).number).toBe(2);
      expect(trimesterForWeek(28).number).toBe(3);
    });

    it('converts string numbers correctly', () => {
      expect(trimesterForWeek('14')).toEqual({ number: 2, label: '2nd' });
      expect(trimesterForWeek('28')).toEqual({ number: 3, label: '3rd' });
    });
  });

  describe('daysUntilDue', () => {
    it('returns null for null due date', () => {
      expect(daysUntilDue(null)).toBe(null);
      expect(daysUntilDue(undefined)).toBe(null);
    });

    it('returns 0 on due date', () => {
      expect(daysUntilDue('2026-05-15', '2026-05-15')).toBe(0);
    });

    it('returns positive number before due date', () => {
      expect(daysUntilDue('2026-05-20', '2026-05-15')).toBe(5);
    });

    it('returns negative number after due date', () => {
      expect(daysUntilDue('2026-05-10', '2026-05-15')).toBe(-5);
    });
  });

  describe('addDays', () => {
    it('adds positive days correctly', () => {
      expect(addDays('2026-05-15', 5)).toBe('2026-05-20');
    });

    it('subtracts days with negative number', () => {
      expect(addDays('2026-05-15', -5)).toBe('2026-05-10');
    });

    it('handles month rollover', () => {
      expect(addDays('2026-05-30', 5)).toBe('2026-06-04');
    });

    it('handles year rollover', () => {
      expect(addDays('2026-12-30', 5)).toBe('2027-01-04');
    });

    it('returns same date for adding 0', () => {
      expect(addDays('2026-05-15', 0)).toBe('2026-05-15');
    });
  });
});
