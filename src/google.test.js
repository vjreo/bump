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
} from './google.js';

describe('google module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isConfigured', () => {
    it('returns false when no client ID is set', () => {
      // In test environment, VITE_GOOGLE_CLIENT_ID is not set
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
  });

  describe('hasGranted', () => {
    it('returns false when scope not granted', () => {
      expect(hasGranted('some-scope')).toBe(false);
    });

    it('returns true when scope is granted', () => {
      localStorage.setItem('bump.google.scopes.v1', JSON.stringify(['some-scope']));
      expect(hasGranted('some-scope')).toBe(true);
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
  });
});
