import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sha256Hex, isInviteOk, rememberInviteOk, normalizeInvite, tryInvite } from './invite.js';

describe('invite module', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = { ...localStorage };
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('sha256Hex', () => {
    it('returns a 64-character hex string', async () => {
      const hash = await sha256Hex('test');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces consistent hashes for same input', async () => {
      const hash1 = await sha256Hex('hello');
      const hash2 = await sha256Hex('hello');
      expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different inputs', async () => {
      const hash1 = await sha256Hex('hello');
      const hash2 = await sha256Hex('world');
      expect(hash1).not.toBe(hash2);
    });

    it('handles empty string', async () => {
      const hash = await sha256Hex('');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('handles unicode characters', async () => {
      const hash = await sha256Hex('привет');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('normalizeInvite', () => {
    it('trims whitespace', () => {
      expect(normalizeInvite('  TEST-CODE  ')).toBe('test-code');
    });

    it('converts to lowercase', () => {
      expect(normalizeInvite('TEST-CODE')).toBe('test-code');
      expect(normalizeInvite('TeSt-CoDe')).toBe('test-code');
    });

    it('handles null/undefined', () => {
      expect(normalizeInvite(null)).toBe('');
      expect(normalizeInvite(undefined)).toBe('');
    });

    it('handles numbers', () => {
      expect(normalizeInvite(12345)).toBe('12345');
    });
  });

  describe('isInviteOk', () => {
    it('returns false when flag not set', () => {
      expect(isInviteOk()).toBe(false);
    });

    it('returns true when flag is set to "1"', () => {
      localStorage.setItem('bump.inviteOk.v1', '1');
      expect(isInviteOk()).toBe(true);
    });

    it('returns false when flag is set to other value', () => {
      localStorage.setItem('bump.inviteOk.v1', '0');
      expect(isInviteOk()).toBe(false);

      localStorage.setItem('bump.inviteOk.v1', 'true');
      expect(isInviteOk()).toBe(false);
    });
  });

  describe('rememberInviteOk', () => {
    it('sets the flag in localStorage', () => {
      expect(localStorage.getItem('bump.inviteOk.v1')).toBe(null);
      rememberInviteOk();
      expect(localStorage.getItem('bump.inviteOk.v1')).toBe('1');
    });
  });

  describe('tryInvite', () => {
    it('returns false for empty code', async () => {
      expect(await tryInvite('')).toBe(false);
      expect(await tryInvite('   ')).toBe(false);
      expect(await tryInvite(null)).toBe(false);
    });

    it('returns false when VITE_INVITE_HASH is not set', async () => {
      // In test environment, VITE_INVITE_HASH is not set
      expect(await tryInvite('TEST-CODE')).toBe(false);
    });

    it('does not set invite flag on failure', async () => {
      await tryInvite('WRONG-CODE');
      expect(isInviteOk()).toBe(false);
    });
  });
});
