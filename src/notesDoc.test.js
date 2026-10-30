import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isConfigured,
  isConnected,
  getDocId,
  docUrl,
  parseDocId,
  getCache,
  clearCache,
  forgetDoc,
  formatHeader,
  HEADER_RE,
  parseDocument,
  newestFirst,
  appendRequests,
  deleteRequest,
  AUTHORS,
  classifyGoogleError,
  GoogleApiError,
  NeedsAuthError,
  ScopeMissingError,
  SCOPE_MISSING_MSG,
} from './notesDoc.js';

describe('notesDoc module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AUTHORS', () => {
    it('contains expected authors', () => {
      expect(AUTHORS).toContain('Vince');
      expect(AUTHORS).toContain('Chantal');
    });
  });

  describe('parseDocId', () => {
    it('extracts doc ID from Google Docs URL', () => {
      // Doc IDs must be at least 20 characters
      expect(parseDocId('https://docs.google.com/document/d/1abc123xyz_-ABCdef01234/edit')).toBe('1abc123xyz_-ABCdef01234');
      expect(parseDocId('https://docs.google.com/document/d/1abc123xyz_-ABCdef01234/')).toBe('1abc123xyz_-ABCdef01234');
    });

    it('extracts doc ID from URL with user segment', () => {
      expect(parseDocId('https://docs.google.com/document/u/0/d/1abc123xyz_-ABCdef01234/edit')).toBe('1abc123xyz_-ABCdef01234');
    });

    it('accepts bare document ID', () => {
      expect(parseDocId('1abc123xyz_-ABCdef012345')).toBe('1abc123xyz_-ABCdef012345');
    });

    it('returns empty string for invalid input', () => {
      expect(parseDocId('')).toBe('');
      expect(parseDocId(null)).toBe('');
      expect(parseDocId('too-short')).toBe('');
      expect(parseDocId('https://example.com')).toBe('');
    });
  });

  describe('docUrl', () => {
    it('returns empty string when no doc ID', () => {
      expect(docUrl('')).toBe('');
      expect(docUrl()).toBe('');
    });

    it('constructs Google Docs URL from ID', () => {
      expect(docUrl('abc123')).toBe('https://docs.google.com/document/d/abc123/edit');
    });
  });

  describe('getDocId', () => {
    it('returns empty string when not set', () => {
      expect(getDocId()).toBe('');
    });

    it('returns stored doc ID', () => {
      localStorage.setItem('bump.notesDoc.v1', JSON.stringify({ id: 'test-doc-id' }));
      expect(getDocId()).toBe('test-doc-id');
    });
  });

  describe('getCache', () => {
    it('returns empty state when no cache', () => {
      const cache = getCache();
      expect(cache.docId).toBe('');
      expect(cache.notes).toEqual([]);
      expect(cache.fetchedAt).toBe(null);
    });

    it('returns cached data', () => {
      const cached = { docId: 'doc1', notes: [{ text: 'note' }], fetchedAt: '2026-01-01T00:00:00Z' };
      localStorage.setItem('bump.notesDoc.cache.v1', JSON.stringify(cached));
      const cache = getCache();
      expect(cache.docId).toBe('doc1');
      expect(cache.notes.length).toBe(1);
    });
  });

  describe('clearCache', () => {
    it('removes cache from localStorage', () => {
      localStorage.setItem('bump.notesDoc.cache.v1', JSON.stringify({ notes: [] }));
      clearCache();
      expect(localStorage.getItem('bump.notesDoc.cache.v1')).toBe(null);
    });
  });

  describe('forgetDoc', () => {
    it('clears both doc ID and cache', () => {
      localStorage.setItem('bump.notesDoc.v1', JSON.stringify({ id: 'doc1' }));
      localStorage.setItem('bump.notesDoc.cache.v1', JSON.stringify({ notes: [] }));
      forgetDoc();
      expect(localStorage.getItem('bump.notesDoc.v1')).toBe(null);
      expect(localStorage.getItem('bump.notesDoc.cache.v1')).toBe(null);
    });
  });

  describe('formatHeader', () => {
    it('formats date with author', () => {
      const date = new Date('2026-10-07T18:30:00');
      const header = formatHeader(date, 'Chantal');
      expect(header).toMatch(/Wed, Oct 7, 2026/);
      expect(header).toContain('— Chantal');
    });

    it('formats date without author', () => {
      const date = new Date('2026-10-07T18:30:00');
      const header = formatHeader(date, '');
      expect(header).toMatch(/Wed, Oct 7, 2026/);
      expect(header).not.toContain('—');
    });

    it('only adds valid authors', () => {
      const date = new Date('2026-10-07T18:30:00');
      const header = formatHeader(date, 'Unknown');
      expect(header).not.toContain('—');
    });
  });

  describe('HEADER_RE', () => {
    it('matches valid header with author', () => {
      const match = 'Wed, Oct 7, 2026 at 6:30 PM — Chantal'.match(HEADER_RE);
      expect(match).not.toBe(null);
      expect(match[1]).toBe('Wed');
      expect(match[2]).toBe('Oct');
      expect(match[3]).toBe('7');
      expect(match[4]).toBe('2026');
      expect(match[5]).toBe('6');
      expect(match[6]).toBe('30');
      expect(match[7]).toBe('PM');
      expect(match[8]).toBe('Chantal');
    });

    it('matches valid header without author', () => {
      const match = 'Mon, Jan 15, 2027 at 10:00 AM'.match(HEADER_RE);
      expect(match).not.toBe(null);
      expect(match[8]).toBeUndefined();
    });

    it('rejects invalid headers', () => {
      expect('Random text'.match(HEADER_RE)).toBe(null);
      expect('2026-10-07'.match(HEADER_RE)).toBe(null);
    });
  });

  describe('parseDocument', () => {
    it('parses empty document', () => {
      const doc = { body: { content: [] } };
      const result = parseDocument(doc);
      expect(result.notes).toEqual([]);
    });

    it('parses document with single note', () => {
      const doc = {
        revisionId: 'rev1',
        body: {
          content: [
            { startIndex: 1, endIndex: 20, paragraph: { elements: [{ textRun: { content: 'Title\n' } }] } },
            { startIndex: 20, endIndex: 60, paragraph: { elements: [{ textRun: { content: 'Wed, Oct 7, 2026 at 6:30 PM — Vince\n' } }] } },
            { startIndex: 60, endIndex: 80, paragraph: { elements: [{ textRun: { content: 'Test note text\n' } }] } },
          ],
        },
      };
      const result = parseDocument(doc);
      expect(result.notes.length).toBe(1);
      expect(result.notes[0].text).toBe('Test note text');
      expect(result.notes[0].author).toBe('Vince');
    });

    it('ignores paragraphs before first header', () => {
      const doc = {
        body: {
          content: [
            { startIndex: 1, endIndex: 20, paragraph: { elements: [{ textRun: { content: 'Intro text\n' } }] } },
            { startIndex: 20, endIndex: 60, paragraph: { elements: [{ textRun: { content: 'Wed, Oct 7, 2026 at 6:30 PM\n' } }] } },
            { startIndex: 60, endIndex: 80, paragraph: { elements: [{ textRun: { content: 'Note text\n' } }] } },
          ],
        },
      };
      const result = parseDocument(doc);
      expect(result.notes.length).toBe(1);
      expect(result.notes[0].text).toBe('Note text');
    });

    it('handles multiple notes', () => {
      const doc = {
        body: {
          content: [
            { startIndex: 1, endIndex: 40, paragraph: { elements: [{ textRun: { content: 'Wed, Oct 7, 2026 at 6:30 PM — Vince\n' } }] } },
            { startIndex: 40, endIndex: 60, paragraph: { elements: [{ textRun: { content: 'First note\n' } }] } },
            { startIndex: 60, endIndex: 70, paragraph: { elements: [{ textRun: { content: '\n' } }] } },
            { startIndex: 70, endIndex: 110, paragraph: { elements: [{ textRun: { content: 'Thu, Oct 8, 2026 at 9:00 AM — Chantal\n' } }] } },
            { startIndex: 110, endIndex: 130, paragraph: { elements: [{ textRun: { content: 'Second note\n' } }] } },
          ],
        },
      };
      const result = parseDocument(doc);
      expect(result.notes.length).toBe(2);
    });

    it('returns revisionId', () => {
      const doc = { revisionId: 'test-revision', body: { content: [] } };
      const result = parseDocument(doc);
      expect(result.revisionId).toBe('test-revision');
    });
  });

  describe('newestFirst', () => {
    it('sorts notes by date descending', () => {
      const notes = [
        { when: '2026-10-05T10:00', text: 'Old' },
        { when: '2026-10-10T10:00', text: 'New' },
        { when: '2026-10-07T10:00', text: 'Middle' },
      ];
      const sorted = newestFirst(notes);
      expect(sorted[0].text).toBe('New');
      expect(sorted[1].text).toBe('Middle');
      expect(sorted[2].text).toBe('Old');
    });

    it('preserves position order for same timestamp', () => {
      const notes = [
        { when: '2026-10-07T10:00', text: 'First' },
        { when: '2026-10-07T10:00', text: 'Second' },
      ];
      const sorted = newestFirst(notes);
      expect(sorted[0].text).toBe('Second');
      expect(sorted[1].text).toBe('First');
    });
  });

  describe('appendRequests', () => {
    it('generates insert request', () => {
      const parsed = { docEnd: 100, lastEmpty: false };
      const entries = [{ date: new Date('2026-10-07T18:30:00'), author: 'Vince', text: 'Test note' }];
      const requests = appendRequests(parsed, entries);
      expect(requests.length).toBeGreaterThan(0);
      expect(requests[0]).toHaveProperty('insertText');
    });

    it('includes header styling', () => {
      const parsed = { docEnd: 100, lastEmpty: true };
      const entries = [{ date: new Date('2026-10-07T18:30:00'), author: '', text: 'Test' }];
      const requests = appendRequests(parsed, entries);
      const hasTextStyle = requests.some((r) => r.updateTextStyle?.textStyle?.bold);
      expect(hasTextStyle).toBe(true);
    });
  });

  describe('deleteRequest', () => {
    it('generates delete request for non-last note', () => {
      const note = { start: 50, end: 100, isLast: false };
      const request = deleteRequest(note);
      expect(request.deleteContentRange.range.startIndex).toBe(50);
      expect(request.deleteContentRange.range.endIndex).toBe(100);
    });

    it('preserves final newline for last note', () => {
      const note = { start: 50, end: 100, isLast: true };
      const request = deleteRequest(note);
      expect(request.deleteContentRange.range.endIndex).toBe(99);
    });
  });

  describe('classifyGoogleError', () => {
    it('classifies SERVICE_DISABLED as apiDisabled', () => {
      const json = {
        error: {
          details: [{ '@type': 'google.rpc.ErrorInfo', reason: 'SERVICE_DISABLED', metadata: { service: 'drive.googleapis.com' } }],
        },
      };
      const err = classifyGoogleError(403, json, 'https://drive.googleapis.com/test', 'test');
      expect(err.kind).toBe('apiDisabled');
    });

    it('classifies ACCESS_TOKEN_SCOPE_INSUFFICIENT as scope', () => {
      const json = {
        error: {
          details: [{ '@type': 'google.rpc.ErrorInfo', reason: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT' }],
        },
      };
      const err = classifyGoogleError(403, json, 'https://docs.googleapis.com/test', 'test');
      expect(err.kind).toBe('scope');
    });

    it('classifies 404 as docAccess', () => {
      const json = { error: { message: 'Not found' } };
      const err = classifyGoogleError(404, json, 'https://docs.googleapis.com/v1/documents/abc', 'test');
      expect(err.kind).toBe('docAccess');
    });

    it('classifies 429 as rateLimit', () => {
      const json = { error: { message: 'Too many requests' } };
      const err = classifyGoogleError(429, json, 'https://docs.googleapis.com/test', 'test');
      expect(err.kind).toBe('rateLimit');
    });

    it('classifies storageQuotaExceeded as storage', () => {
      const json = {
        error: {
          details: [{ '@type': 'google.rpc.ErrorInfo', reason: 'storageQuotaExceeded' }],
        },
      };
      const err = classifyGoogleError(403, json, 'https://drive.googleapis.com/test', 'test');
      expect(err.kind).toBe('storage');
    });

    it('classifies unknown errors as other', () => {
      const json = { error: { message: 'Unknown error' } };
      const err = classifyGoogleError(500, json, 'https://docs.googleapis.com/test', 'test');
      expect(err.kind).toBe('other');
    });
  });

  describe('GoogleApiError', () => {
    it('creates error with plain message for apiDisabled', () => {
      const err = new GoogleApiError({ status: 403, reason: 'SERVICE_DISABLED', service: 'drive.googleapis.com', kind: 'apiDisabled' });
      expect(err.message).toContain('Google Drive API');
      expect(err.message).toContain('turned on');
    });

    it('creates error with plain message for scope', () => {
      const err = new GoogleApiError({ status: 403, reason: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT', kind: 'scope' });
      expect(err.message).toBe(SCOPE_MISSING_MSG);
    });

    it('creates error with plain message for docAccess', () => {
      const err = new GoogleApiError({ status: 404, reason: 'notFound', kind: 'docAccess' });
      // Uses curly apostrophe
      expect(err.message).toContain('Bump can\u2019t open');
    });

    it('creates error with plain message for rateLimit', () => {
      const err = new GoogleApiError({ status: 429, reason: 'rateLimitExceeded', kind: 'rateLimit' });
      expect(err.message).toContain('busy');
    });

    it('creates error with plain message for storage', () => {
      const err = new GoogleApiError({ status: 403, reason: 'storageQuotaExceeded', kind: 'storage' });
      expect(err.message).toContain('storage is full');
    });
  });

  describe('NeedsAuthError', () => {
    it('creates error with message', () => {
      const err = new NeedsAuthError('Test message');
      expect(err.message).toBe('Test message');
    });
  });

  describe('ScopeMissingError', () => {
    it('creates error with message', () => {
      const err = new ScopeMissingError('Test scope message');
      expect(err.message).toBe('Test scope message');
    });
  });
});
