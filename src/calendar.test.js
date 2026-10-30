import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hasTag, stripTag, toTaggedEvents, getCache, isConnected, clearCache, isConfigured } from './calendar.js';

describe('calendar module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('hasTag', () => {
    it('returns true when title contains [Bump]', () => {
      expect(hasTag('Doctor appointment [Bump]')).toBe(true);
      expect(hasTag('[Bump] Ultrasound')).toBe(true);
      expect(hasTag('Visit [Bump] checkup')).toBe(true);
    });

    it('is case-insensitive', () => {
      expect(hasTag('[bump]')).toBe(true);
      expect(hasTag('[BUMP]')).toBe(true);
      expect(hasTag('[BuMp]')).toBe(true);
    });

    it('returns false when title does not contain tag', () => {
      expect(hasTag('Regular meeting')).toBe(false);
      expect(hasTag('Bump in the road')).toBe(false);
      expect(hasTag('[Other] event')).toBe(false);
    });

    it('returns false for non-string input', () => {
      expect(hasTag(null)).toBe(false);
      expect(hasTag(undefined)).toBe(false);
      expect(hasTag(123)).toBe(false);
    });
  });

  describe('stripTag', () => {
    it('removes [Bump] from title', () => {
      expect(stripTag('Doctor appointment [Bump]')).toBe('Doctor appointment');
      expect(stripTag('[Bump] Ultrasound')).toBe('Ultrasound');
    });

    it('handles multiple spaces after stripping', () => {
      expect(stripTag('Doctor  [Bump]  appointment')).toBe('Doctor appointment');
    });

    it('is case-insensitive', () => {
      expect(stripTag('[bump] Test')).toBe('Test');
      expect(stripTag('[BUMP] Test')).toBe('Test');
    });

    it('returns "Untitled" for empty result', () => {
      expect(stripTag('[Bump]')).toBe('Untitled');
      expect(stripTag('  [Bump]  ')).toBe('Untitled');
    });

    it('handles non-string input', () => {
      // String(null) = "null", String(undefined) = "undefined"
      // stripTag coerces to string, so these become "null" and "undefined"
      expect(stripTag(null)).toBe('null');
      expect(stripTag(undefined)).toBe('undefined');
    });
  });

  describe('toTaggedEvents', () => {
    it('filters to only events with [Bump] tag', () => {
      const items = [
        { id: '1', summary: 'OB Visit [Bump]', start: { dateTime: '2026-05-15T10:00:00' }, end: { dateTime: '2026-05-15T11:00:00' } },
        { id: '2', summary: 'Regular meeting', start: { dateTime: '2026-05-15T14:00:00' }, end: { dateTime: '2026-05-15T15:00:00' } },
        { id: '3', summary: '[Bump] Ultrasound', start: { dateTime: '2026-05-16T09:00:00' }, end: { dateTime: '2026-05-16T10:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result.length).toBe(2);
      expect(result[0].title).toBe('OB Visit');
      expect(result[1].title).toBe('Ultrasound');
    });

    it('excludes cancelled events', () => {
      const items = [
        { id: '1', summary: '[Bump] Active', status: 'confirmed', start: { dateTime: '2026-05-15T10:00:00' } },
        { id: '2', summary: '[Bump] Cancelled', status: 'cancelled', start: { dateTime: '2026-05-15T14:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Active');
    });

    it('handles all-day events', () => {
      const items = [
        { id: '1', summary: '[Bump] All day event', start: { date: '2026-05-15' }, end: { date: '2026-05-16' } },
      ];
      const result = toTaggedEvents(items);
      expect(result.length).toBe(1);
      expect(result[0].allDay).toBe(true);
      expect(result[0].start).toBe('2026-05-15');
    });

    it('handles timed events', () => {
      const items = [
        { id: '1', summary: '[Bump] Appointment', start: { dateTime: '2026-05-15T10:00:00-04:00' }, end: { dateTime: '2026-05-15T11:00:00-04:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result.length).toBe(1);
      expect(result[0].allDay).toBe(false);
      expect(result[0].start).toBe('2026-05-15T10:00:00-04:00');
    });

    it('strips [Bump] tag from title', () => {
      const items = [
        { id: '1', summary: 'OB Visit [Bump]', start: { dateTime: '2026-05-15T10:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result[0].title).toBe('OB Visit');
    });

    it('includes location when present', () => {
      const items = [
        { id: '1', summary: '[Bump] Visit', start: { dateTime: '2026-05-15T10:00:00' }, location: 'Doctor Office' },
      ];
      const result = toTaggedEvents(items);
      expect(result[0].location).toBe('Doctor Office');
    });

    it('handles empty location', () => {
      const items = [
        { id: '1', summary: '[Bump] Visit', start: { dateTime: '2026-05-15T10:00:00' }, location: '' },
      ];
      const result = toTaggedEvents(items);
      expect(result[0].location).toBe('');
    });

    it('filters out events without start date', () => {
      const items = [
        { id: '1', summary: '[Bump] No start' },
        { id: '2', summary: '[Bump] Has start', start: { dateTime: '2026-05-15T10:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result.length).toBe(1);
    });

    it('handles null/undefined items array', () => {
      expect(toTaggedEvents(null)).toEqual([]);
      expect(toTaggedEvents(undefined)).toEqual([]);
    });

    it('handles empty items array', () => {
      expect(toTaggedEvents([])).toEqual([]);
    });
  });

  describe('getCache', () => {
    it('returns empty state when no cache exists', () => {
      const cache = getCache();
      expect(cache.events).toEqual([]);
      expect(cache.fetchedAt).toBe(null);
    });

    it('returns cached data when available', () => {
      const cachedData = {
        events: [{ id: '1', title: 'Test' }],
        fetchedAt: '2026-05-15T10:00:00Z',
      };
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify(cachedData));
      const cache = getCache();
      expect(cache.events.length).toBe(1);
      expect(cache.fetchedAt).toBe('2026-05-15T10:00:00Z');
    });
  });

  describe('clearCache', () => {
    it('removes cache from localStorage', () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      clearCache();
      expect(localStorage.getItem('bump.gcal.cache.v1')).toBe(null);
    });
  });

  describe('isConnected', () => {
    it('returns false when no cache and no scope granted', () => {
      expect(isConnected()).toBe(false);
    });

    it('returns true when cache exists', () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      expect(isConnected()).toBe(true);
    });
  });

  describe('isConfigured', () => {
    it('returns false when no Google client ID is set', () => {
      // In test environment, VITE_GOOGLE_CLIENT_ID is not set
      expect(isConfigured()).toBe(false);
    });
  });
});
