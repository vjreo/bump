import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isConfigured,
  readJSON,
  writeJSON,
  grantedScopes,
  hasGranted,
  validToken,
  clearToken,
  forgetScope,
  loadGis,
  revokeAll,
} from './google.js';

describe('google module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('isConfigured', () => {
    it('returns false when no client ID is set', () => {
      expect(isConfigured()).toBe(false);
    });
  });

  describe('readJSON', () => {
    it('returns null for missing key', () => {
      expect(readJSON('nonexistent')).toBe(null);
    });

    it('returns parsed JSON for valid key', () => {
      localStorage.setItem('test-key', JSON.stringify({ foo: 'bar' }));
      expect(readJSON('test-key')).toEqual({ foo: 'bar' });
    });

    it('returns null for invalid JSON', () => {
      localStorage.setItem('test-key', 'not-json');
      expect(readJSON('test-key')).toBe(null);
    });

    it('returns parsed array', () => {
      localStorage.setItem('test-key', JSON.stringify([1, 2, 3]));
      expect(readJSON('test-key')).toEqual([1, 2, 3]);
    });

    it('returns parsed primitive', () => {
      localStorage.setItem('test-key', JSON.stringify(42));
      expect(readJSON('test-key')).toBe(42);
    });
  });

  describe('writeJSON', () => {
    it('writes JSON to localStorage', () => {
      writeJSON('test-key', { foo: 'bar' });
      expect(JSON.parse(localStorage.getItem('test-key'))).toEqual({ foo: 'bar' });
    });

    it('handles null value', () => {
      writeJSON('test-key', null);
      expect(localStorage.getItem('test-key')).toBe('null');
    });

    it('handles arrays', () => {
      writeJSON('test-key', [1, 2, 3]);
      expect(JSON.parse(localStorage.getItem('test-key'))).toEqual([1, 2, 3]);
    });

    it('handles nested objects', () => {
      const nested = { a: { b: { c: 1 } } };
      writeJSON('test-key', nested);
      expect(readJSON('test-key')).toEqual(nested);
    });

    it('logs warning when localStorage throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      writeJSON('test-key', { foo: 'bar' });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('grantedScopes', () => {
    it('returns empty array when no scopes granted', () => {
      expect(grantedScopes()).toEqual([]);
    });

    it('returns stored scopes', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['scope1', 'scope2']));
      expect(grantedScopes()).toEqual(['scope1', 'scope2']);
    });

    it('returns calendar scope when legacy cache exists', () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      expect(grantedScopes()).toContain('https://www.googleapis.com/auth/calendar.events.readonly');
    });

    it('handles invalid stored data', () => {
      localStorage.setItem('bump.google.scopes.v1', 'not-an-array');
      expect(grantedScopes()).toEqual([]);
    });
  });

  describe('hasGranted', () => {
    it('returns false when scope not granted', () => {
      expect(hasGranted('some-scope')).toBe(false);
    });

    it('returns true when scope is granted', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['some-scope']));
      expect(hasGranted('some-scope')).toBe(true);
    });

    it('returns true for legacy calendar scope', () => {
      localStorage.setItem('bump.gcal.cache.v1', JSON.stringify({ events: [] }));
      expect(hasGranted('https://www.googleapis.com/auth/calendar.events.readonly')).toBe(true);
    });
  });

  describe('validToken', () => {
    it('returns null when no token stored', () => {
      expect(validToken('some-scope')).toBe(null);
    });

    it('returns null when token is expired', () => {
      const expiredToken = {
        accessToken: 'test-token',
        expiresAt: Date.now() - 1000,
        scopes: ['some-scope'],
      };
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify(expiredToken));
      expect(validToken('some-scope')).toBe(null);
    });

    it('returns null when token does not have required scope', () => {
      const token = {
        accessToken: 'test-token',
        expiresAt: Date.now() + 3600000,
        scopes: ['other-scope'],
      };
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify(token));
      expect(validToken('required-scope')).toBe(null);
    });

    it('returns token when valid and has scope', () => {
      const token = {
        accessToken: 'test-token',
        expiresAt: Date.now() + 3600000,
        scopes: ['required-scope'],
      };
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify(token));
      expect(validToken('required-scope')).toBe('test-token');
    });

    it('returns null when token expires within 60 seconds', () => {
      const token = {
        accessToken: 'test-token',
        expiresAt: Date.now() + 30000, // 30 seconds
        scopes: ['required-scope'],
      };
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify(token));
      expect(validToken('required-scope')).toBe(null);
    });

    it('handles legacy tokens without scopes array', () => {
      const legacyToken = {
        accessToken: 'test-token',
        expiresAt: Date.now() + 3600000,
      };
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify(legacyToken));
      // Legacy tokens are assumed to have calendar scope
      expect(validToken('https://www.googleapis.com/auth/calendar.events.readonly')).toBe('test-token');
    });
  });

  describe('clearToken', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify({ accessToken: 'test' }));
      clearToken();
      expect(localStorage.getItem('bump.gcal.token.v1')).toBe(null);
    });
  });

  describe('forgetScope', () => {
    it('removes scope from granted list', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['scope1', 'scope2']));
      forgetScope('scope1');
      expect(grantedScopes()).toEqual(['scope2']);
    });

    it('handles scope not in list', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['scope1']));
      forgetScope('nonexistent');
      expect(grantedScopes()).toEqual(['scope1']);
    });

    it('handles empty scope list', () => {
      forgetScope('any-scope');
      expect(grantedScopes()).toEqual([]);
    });
  });

  describe('loadGis', () => {
    it('rejects when not configured', async () => {
      await expect(loadGis()).rejects.toThrow('not set up');
    });
  });

  describe('revokeAll', () => {
    it('clears token and scopes', async () => {
      localStorage.setItem('bump.gcal.token.v1', JSON.stringify({ accessToken: 'test' }));
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['scope1']));
      await revokeAll();
      expect(localStorage.getItem('bump.gcal.token.v1')).toBe(null);
      expect(localStorage.getItem('bump.google.scopes.v1')).toBe(null);
    });
  });

});
