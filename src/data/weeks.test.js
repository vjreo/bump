import { describe, it, expect } from 'vitest';
import { getWeekContent } from './weeks.js';

describe('weeks data', () => {
  describe('getWeekContent', () => {
    it('returns null for null/NaN input', () => {
      expect(getWeekContent(null)).toBe(null);
      expect(getWeekContent(undefined)).toBe(null);
      expect(getWeekContent(NaN)).toBe(null);
    });

    it('returns content with expected shape', () => {
      const content = getWeekContent(20);
      expect(content).toHaveProperty('week', 20);
      expect(content).toHaveProperty('title');
      expect(content).toHaveProperty('size');
      expect(content).toHaveProperty('baby');
      expect(content).toHaveProperty('feel');
      expect(content).toHaveProperty('tip');
      expect(content).toHaveProperty('nhsWeek');
      expect(content).toHaveProperty('nhsUrl');
    });

    it('clamps week 0 to week 1', () => {
      const content = getWeekContent(0);
      expect(content.week).toBe(1);
    });

    it('clamps negative weeks to week 1', () => {
      const content = getWeekContent(-5);
      expect(content.week).toBe(1);
    });

    it('clamps week > 42 to week 42', () => {
      const content = getWeekContent(50);
      expect(content.week).toBe(42);
    });

    it('rounds floating point weeks', () => {
      expect(getWeekContent(20.4).week).toBe(20);
      expect(getWeekContent(20.6).week).toBe(21);
    });

    it('returns different content for different weeks', () => {
      const week1 = getWeekContent(1);
      const week20 = getWeekContent(20);
      const week40 = getWeekContent(40);
      expect(week1.title).not.toBe(week20.title);
      expect(week20.title).not.toBe(week40.title);
    });

    it('returns valid NHS URL', () => {
      const content = getWeekContent(25);
      expect(content.nhsUrl).toMatch(/^https:\/\/www\.nhs\.uk\//);
      expect(content.nhsUrl).toContain('week-');
    });

    it('maps NHS week correctly (NHS covers 4-41)', () => {
      const week1 = getWeekContent(1);
      expect(week1.nhsWeek).toBe(4);

      const week4 = getWeekContent(4);
      expect(week4.nhsWeek).toBe(4);

      const week42 = getWeekContent(42);
      expect(week42.nhsWeek).toBe(41);
    });

    it('uses correct NHS trimester URL grouping', () => {
      const week10 = getWeekContent(10);
      expect(week10.nhsUrl).toContain('1st-trimester');

      const week20 = getWeekContent(20);
      expect(week20.nhsUrl).toContain('2nd-trimester');

      const week30 = getWeekContent(30);
      expect(week30.nhsUrl).toContain('3rd-trimester');
    });

    it('has content for all 42 weeks', () => {
      for (let w = 1; w <= 42; w++) {
        const content = getWeekContent(w);
        expect(content).not.toBe(null);
        expect(content.title).toBeTruthy();
        expect(content.baby).toBeTruthy();
        expect(content.feel).toBeTruthy();
        expect(content.tip).toBeTruthy();
      }
    });
  });
});
