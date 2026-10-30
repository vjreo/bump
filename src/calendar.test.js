import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hasTag, stripTag, toTaggedEvents, getCache, isConnected, clearCache, isConfigured, refresh, disconnect } from './calendar.js';
import * as google from './google.js';

describe('calendar module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
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
      expect(stripTag(null)).toBe('null');
      expect(stripTag(undefined)).toBe('undefined');
    });

    it('removes multiple [Bump] tags', () => {
      expect(stripTag('[Bump] Visit [Bump]')).toBe('Visit');
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

    it('extracts event id', () => {
      const items = [
        { id: 'evt-123', summary: '[Bump] Test', start: { dateTime: '2026-05-15T10:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result[0].id).toBe('evt-123');
    });

    it('handles missing end time', () => {
      const items = [
        { id: '1', summary: '[Bump] No end', start: { dateTime: '2026-05-15T10:00:00' } },
      ];
      const result = toTaggedEvents(items);
      expect(result[0].end).toBe('2026-05-15T10:00:00');
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

    it('returns true when calendar scope is granted', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['https://www.googleapis.com/auth/calendar.events.readonly']));
      expect(isConnected()).toBe(true);
    });
  });

  describe('isConfigured', () => {
    it('returns false when no Google client ID is set', () => {
      expect(isConfigured()).toBe(false);
    });
  });

  describe('refresh', () => {
    it('returns error when not configured', async () => {
      const result = await refresh();
      expect(result.ok).toBe(false);
      expect(result.error).toContain('not set up');
    });

    it('returns needsReconnect when not connected and not interactive', async () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('clears cache on disconnect', async () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      await disconnect();
      expect(localStorage.getItem('bump.gcal.cache.v1')).toBe(null);
    });
  });
});

describe('calendar module with mocked fetch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('refresh with mocked authorize and fetch', () => {
    it('returns needsReconnect when not interactive and no valid token', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue(null);
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(false);
      expect(result.needsReconnect).toBe(true);
    });

    it('returns error when authorize throws', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue(null);
      vi.spyOn(google, 'grantedScopes').mockReturnValue(['some-scope']);
      vi.spyOn(google, 'authorize').mockRejectedValue(new Error('User cancelled'));
      
      const result = await refresh({ interactive: true });
      expect(result.ok).toBe(false);
      expect(result.needsReconnect).toBe(true);
      expect(result.error).toBe('User cancelled');
    });

    it('returns error when calendar scope not granted', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue(null);
      vi.spyOn(google, 'grantedScopes').mockReturnValue([]);
      vi.spyOn(google, 'authorize').mockResolvedValue({
        accessToken: 'test-token',
        scopes: ['other-scope'],
      });
      
      const result = await refresh({ interactive: true });
      expect(result.ok).toBe(false);
      expect(result.error).toBe('Calendar access was not granted');
    });

    it('fetches events successfully when authorized', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue('valid-token');
      
      const mockEvents = {
        items: [
          { id: '1', summary: '[Bump] Doctor visit', start: { dateTime: '2026-05-15T10:00:00' }, end: { dateTime: '2026-05-15T11:00:00' } },
        ],
      };
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockEvents),
      });
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalled();
      
      const cache = getCache();
      expect(cache.events.length).toBe(1);
      expect(cache.events[0].title).toBe('Doctor visit');
    });

    it('handles 401 response and clears token', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue('expired-token');
      vi.spyOn(google, 'clearToken').mockImplementation(() => {});
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(false);
      expect(result.needsReconnect).toBe(true);
      expect(google.clearToken).toHaveBeenCalled();
    });

    it('handles non-401 fetch error', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue('valid-token');
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('500');
    });

    it('handles network error', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue('valid-token');
      
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('handles paginated responses', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue('valid-token');
      
      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              items: [{ id: '1', summary: '[Bump] Event 1', start: { dateTime: '2026-05-15T10:00:00' } }],
              nextPageToken: 'page2',
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            items: [{ id: '2', summary: '[Bump] Event 2', start: { dateTime: '2026-05-16T10:00:00' } }],
          }),
        });
      });
      
      const result = await refresh({ interactive: false });
      expect(result.ok).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
      
      const cache = getCache();
      expect(cache.events.length).toBe(2);
    });

    it('retries with fresh token on 401 when interactive', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      let tokenCall = 0;
      vi.spyOn(google, 'validToken').mockImplementation(() => {
        tokenCall++;
        return tokenCall === 1 ? 'expired-token' : null;
      });
      vi.spyOn(google, 'clearToken').mockImplementation(() => {});
      vi.spyOn(google, 'grantedScopes').mockReturnValue(['calendar-scope']);
      vi.spyOn(google, 'authorize').mockResolvedValue({
        accessToken: 'fresh-token',
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
      });
      
      let fetchCall = 0;
      globalThis.fetch = vi.fn().mockImplementation(() => {
        fetchCall++;
        if (fetchCall === 1) {
          return Promise.resolve({ ok: false, status: 401 });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ items: [] }),
        });
      });
      
      const result = await refresh({ interactive: true });
      expect(result.ok).toBe(true);
      expect(google.clearToken).toHaveBeenCalled();
      expect(google.authorize).toHaveBeenCalled();
    });

    it('uses consent prompt when consent flag is true', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue(null);
      vi.spyOn(google, 'grantedScopes').mockReturnValue(['some-scope']);
      vi.spyOn(google, 'authorize').mockResolvedValue({
        accessToken: 'new-token',
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
      });
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ items: [] }),
      });
      
      await refresh({ interactive: true, consent: true });
      expect(google.authorize).toHaveBeenCalledWith(expect.any(Array), { prompt: 'consent' });
    });

    it('returns needsReconnect after exhausting retries (401 loop)', async () => {
      vi.spyOn(google, 'isConfigured').mockReturnValue(true);
      vi.spyOn(google, 'validToken').mockReturnValue(null);
      vi.spyOn(google, 'clearToken').mockImplementation(() => {});
      vi.spyOn(google, 'grantedScopes').mockReturnValue(['calendar-scope']);
      
      // Authorize always succeeds but fetch always returns 401
      vi.spyOn(google, 'authorize').mockResolvedValue({
        accessToken: 'token-that-still-fails',
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
      });
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });
      
      const result = await refresh({ interactive: true });
      // After 2 attempts both failing with 401, should return needsReconnect
      expect(result.ok).toBe(false);
      expect(result.needsReconnect).toBe(true);
    });
  });
});
