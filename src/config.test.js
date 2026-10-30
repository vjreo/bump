import { describe, it, expect } from 'vitest';
import {
  GOOGLE_CLIENT_ID,
  CALENDAR_ID,
  CALENDAR_TAG,
  CALENDAR_SCOPE,
  NOTES_SCOPE,
  NOTES_DOC_TITLE,
  ALL_SCOPES,
  CALENDAR_LOOKAHEAD_DAYS,
  CALENDAR_LOOKBACK_DAYS,
  CALENDAR_PAST_LIMIT,
  PREP_CHECKLIST_URL,
} from './config.js';

describe('config module', () => {
  describe('calendar config', () => {
    it('has default calendar ID', () => {
      expect(CALENDAR_ID).toBe('primary');
    });

    it('has calendar tag', () => {
      expect(CALENDAR_TAG).toBe('[Bump]');
    });

    it('has calendar scope', () => {
      expect(CALENDAR_SCOPE).toContain('calendar.events.readonly');
    });

    it('has reasonable lookahead/lookback days', () => {
      expect(CALENDAR_LOOKAHEAD_DAYS).toBeGreaterThan(30);
      expect(CALENDAR_LOOKBACK_DAYS).toBeGreaterThan(7);
    });

    it('has past event limit', () => {
      expect(CALENDAR_PAST_LIMIT).toBeGreaterThan(0);
    });
  });

  describe('notes config', () => {
    it('has notes scope', () => {
      expect(NOTES_SCOPE).toContain('drive.file');
    });

    it('has notes doc title', () => {
      expect(NOTES_DOC_TITLE).toBe('Bump Notes');
    });
  });

  describe('ALL_SCOPES', () => {
    it('includes calendar and notes scopes', () => {
      expect(ALL_SCOPES).toContain(CALENDAR_SCOPE);
      expect(ALL_SCOPES).toContain(NOTES_SCOPE);
    });
  });

  describe('prep checklist', () => {
    it('has prep checklist URL', () => {
      expect(PREP_CHECKLIST_URL).toMatch(/^https?:\/\//);
    });
  });

  describe('Google client ID', () => {
    it('is empty string when not configured', () => {
      // In test environment, VITE_GOOGLE_CLIENT_ID is not set
      expect(GOOGLE_CLIENT_ID).toBe('');
    });
  });
});
