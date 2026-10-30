import { describe, it, expect } from 'vitest';
import { getPrepForWeek } from './prep.js';

describe('prep data', () => {
  describe('getPrepForWeek', () => {
    it('returns null for null/NaN input', () => {
      expect(getPrepForWeek(null)).toBe(null);
      expect(getPrepForWeek(undefined)).toBe(null);
      expect(getPrepForWeek(NaN)).toBe(null);
    });

    it('returns prep with expected shape', () => {
      const prep = getPrepForWeek(20);
      expect(prep).toHaveProperty('week', 20);
      expect(prep).toHaveProperty('bandTitle');
      expect(prep).toHaveProperty('thisWeek');
      expect(prep).toHaveProperty('lookingAhead');
      expect(Array.isArray(prep.thisWeek)).toBe(true);
      expect(Array.isArray(prep.lookingAhead)).toBe(true);
    });

    it('clamps week 0 to week 1', () => {
      const prep = getPrepForWeek(0);
      expect(prep.week).toBe(1);
    });

    it('clamps negative weeks to week 1', () => {
      const prep = getPrepForWeek(-5);
      expect(prep.week).toBe(1);
    });

    it('clamps week > 42 to week 42', () => {
      const prep = getPrepForWeek(50);
      expect(prep.week).toBe(42);
    });

    it('rounds floating point weeks', () => {
      expect(getPrepForWeek(20.4).week).toBe(20);
      expect(getPrepForWeek(20.6).week).toBe(21);
    });

    it('has prep content for all valid weeks', () => {
      for (let w = 1; w <= 42; w++) {
        const prep = getPrepForWeek(w);
        expect(prep).not.toBe(null);
        expect(prep.bandTitle).toBeTruthy();
        expect(prep.thisWeek.length).toBeGreaterThan(0);
        expect(prep.lookingAhead.length).toBeGreaterThan(0);
      }
    });

    it('returns "Early days" band for weeks 1-7', () => {
      for (let w = 1; w <= 7; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('Early days');
      }
    });

    it('returns "First trimester wrap" band for weeks 8-13', () => {
      for (let w = 8; w <= 13; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('First trimester wrap');
      }
    });

    it('returns "Second trimester settle-in" band for weeks 14-17', () => {
      for (let w = 14; w <= 17; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('Second trimester settle-in');
      }
    });

    it('returns "Third trimester gear-up" band for weeks 28-32', () => {
      for (let w = 28; w <= 32; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('Third trimester gear-up');
      }
    });

    it('returns "Ready when it is time" band for weeks 37-42', () => {
      for (let w = 37; w <= 42; w++) {
        const prep = getPrepForWeek(w);
        // The source data uses a curly apostrophe
        expect(prep.bandTitle).toBe('Ready when it\u2019s time');
      }
    });

    it('returns "Anatomy scan window" band for weeks 18-22', () => {
      for (let w = 18; w <= 22; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('Anatomy scan window');
      }
    });

    it('returns "Mid-late second trimester" band for weeks 23-27', () => {
      for (let w = 23; w <= 27; w++) {
        const prep = getPrepForWeek(w);
        // Uses en-dash
        expect(prep.bandTitle).toBe('Mid\u2013late second trimester');
      }
    });

    it('returns "Bag & paperwork" band for weeks 33-36', () => {
      for (let w = 33; w <= 36; w++) {
        const prep = getPrepForWeek(w);
        expect(prep.bandTitle).toBe('Bag & paperwork');
      }
    });
  });
});
