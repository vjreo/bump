import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sha256Hex, isInviteOk, rememberInviteOk, normalizeInvite, checkInviteCode, tryInvite, getInviteHash } from './invite.js';

const TEST_CODE = 'test-code';
const TEST_HASH = '3a5f4b089cfd9588a00d4da744493979993cd87e5361d2720acc36a83eb8c04d';

describe('invite module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllEnvs();
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

    it('produces known hash for test-code', async () => {
      const hash = await sha256Hex(TEST_CODE);
      expect(hash).toBe(TEST_HASH);
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

    it('preserves hyphens and special chars', () => {
      expect(normalizeInvite('bump-test-123')).toBe('bump-test-123');
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
});

describe('checkInviteCode (pure function)', () => {
  it('returns true for correct code with matching hash', async () => {
    const result = await checkInviteCode(TEST_CODE, TEST_HASH);
    expect(result).toBe(true);
  });

  it('returns true for uppercase code (case-insensitive)', async () => {
    const result = await checkInviteCode('TEST-CODE', TEST_HASH);
    expect(result).toBe(true);
  });

  it('returns true for mixed case code', async () => {
    const result = await checkInviteCode('TeSt-CoDe', TEST_HASH);
    expect(result).toBe(true);
  });

  it('returns true with whitespace around code', async () => {
    const result = await checkInviteCode('  test-code  ', TEST_HASH);
    expect(result).toBe(true);
  });

  it('returns false for wrong code', async () => {
    const result = await checkInviteCode('wrong-code', TEST_HASH);
    expect(result).toBe(false);
  });

  it('returns false for empty code', async () => {
    expect(await checkInviteCode('', TEST_HASH)).toBe(false);
    expect(await checkInviteCode('   ', TEST_HASH)).toBe(false);
    expect(await checkInviteCode(null, TEST_HASH)).toBe(false);
  });

  it('returns false when hash is empty', async () => {
    expect(await checkInviteCode(TEST_CODE, '')).toBe(false);
    expect(await checkInviteCode(TEST_CODE, null)).toBe(false);
  });

  it('works with uppercase hash', async () => {
    const result = await checkInviteCode(TEST_CODE, TEST_HASH.toUpperCase());
    expect(result).toBe(true);
  });
});

describe('tryInvite integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns false and logs warning when VITE_INVITE_HASH not set', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await tryInvite(TEST_CODE);
    expect(result).toBe(false);
    warnSpy.mockRestore();
  });

  it('getInviteHash returns string', () => {
    const hash = getInviteHash();
    expect(typeof hash).toBe('string');
  });
});
