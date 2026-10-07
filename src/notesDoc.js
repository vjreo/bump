/**
 * Shared notes stored in a Google Doc ("Bump Notes") so both phones see the same list.
 * Scope: drive.file (Bump can only touch docs it created). APIs: Drive (find the doc) + Docs.
 *
 * Doc format (readable, also typeable by hand in Google Docs):
 *
 *   Wed, Oct 7, 2026 at 6:30 PM — Chantal      ← bold date line (author optional)
 *   Ask about vitamin D                        ← note text (one or more lines)
 *                                              ← blank line between notes
 * New notes are appended at the bottom; the app lists them newest first.
 */
import { NOTES_SCOPE, NOTES_DOC_TITLE, ALL_SCOPES } from './config.js';
import { isConfigured, readJSON, writeJSON, validToken, clearToken, authorize, hasGranted, grantedScopes } from './google.js';

const DOC_KEY = 'bump.notesDoc.v1'; // { id }
const CACHE_KEY = 'bump.notesDoc.cache.v1'; // { docId, notes, fetchedAt } — last notes read, for offline viewing

const DOCS = 'https://docs.googleapis.com/v1/documents';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';
const TZ = 'America/New_York';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const AUTHORS = ['Vince', 'Chantal'];

export const HEADER_RE = new RegExp(
  `^(${DAYS.join('|')}), (${MONTHS.join('|')}) (\\d{1,2}), (\\d{4}) at (\\d{1,2}):(\\d{2}) (AM|PM)(?: — (.+))?$`
);

export { isConfigured };

/** Notes are "connected" once the user granted the Drive file scope on this phone. */
export function isConnected() {
  return isConfigured() && hasGranted(NOTES_SCOPE);
}

export function getDocId() {
  return readJSON(DOC_KEY)?.id || '';
}

function setDocId(id) {
  writeJSON(DOC_KEY, { id });
}

export function docUrl(id = getDocId()) {
  return id ? `https://docs.google.com/document/d/${encodeURIComponent(id)}/edit` : '';
}

/** Accepts a Google Docs link or a bare document ID. */
export function parseDocId(input) {
  const s = String(input || '').trim();
  const m = s.match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/) || s.match(/^([A-Za-z0-9_-]{20,})$/);
  return m ? m[1] : '';
}

export function getCache() {
  return readJSON(CACHE_KEY) || { docId: '', notes: [], fetchedAt: null };
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

/** Forget the doc and cache entirely (reset). */
export function forgetDoc() {
  clearCache();
  localStorage.removeItem(DOC_KEY);
}

// ---------- Format / parse ----------

/** "Wed, Oct 7, 2026 at 6:30 PM — Chantal" in New York time. */
export function formatHeader(date, author = '') {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    }).formatToParts(date).map((p) => [p.type, p.value])
  );
  const who = AUTHORS.includes(author) ? ` — ${author}` : '';
  return `${parts.weekday}, ${parts.month} ${parts.day}, ${parts.year} at ${parts.hour}:${parts.minute} ${parts.dayPeriod.toUpperCase()}${who}`;
}

/** Sortable "YYYY-MM-DDTHH:MM" (New York wall time) from a header match. */
function sortKey(m) {
  let h = Number(m[5]) % 12;
  if (m[7] === 'PM') h += 12;
  const pad = (n) => String(n).padStart(2, '0');
  return `${m[4]}-${pad(MONTHS.indexOf(m[2]) + 1)}-${pad(m[3])}T${pad(h)}:${m[6]}`;
}

function cleanText(text) {
  return String(text || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

/**
 * Turn a Docs API document into notes (doc order) with index ranges for deleting.
 * Paragraphs before the first date line (title, intro) are ignored.
 */
export function parseDocument(doc) {
  const content = doc?.body?.content || [];
  const docEnd = content.length ? content[content.length - 1].endIndex : 1;
  const paras = content
    .filter((el) => el.paragraph)
    .map((el) => ({
      start: el.startIndex,
      end: el.endIndex,
      text: (el.paragraph.elements || []).map((e) => e.textRun?.content || '').join('').replace(/\n$/, ''),
    }));
  const notes = [];
  let cur = null;
  let claimedUntil = 0;
  const finish = () => {
    if (!cur) return;
    while (cur.lines.length && !cur.lines[cur.lines.length - 1].text.trim()) cur.lines.pop();
    const text = cur.lines.map((l) => l.text).join('\n').trim();
    const end = cur.lines.length ? cur.lines[cur.lines.length - 1].end : cur.headerEnd;
    if (text) {
      notes.push({
        key: `${cur.header}\n${text}`,
        header: cur.header,
        when: sortKey(cur.m),
        dateLabel: cur.header.replace(/ — .+$/, ''),
        author: cur.m[8] ? cur.m[8].trim() : '',
        text,
        start: cur.start,
        end,
        isLast: end >= docEnd,
      });
    }
    claimedUntil = end;
    cur = null;
  };
  paras.forEach((p, i) => {
    const m = p.text.trim().match(HEADER_RE);
    if (m) {
      finish();
      const prev = paras[i - 1];
      const start = prev && !prev.text.trim() && prev.start >= claimedUntil ? prev.start : p.start;
      cur = { m, header: p.text.trim(), start, headerEnd: p.end, lines: [] };
    } else if (cur) {
      cur.lines.push(p);
    }
  });
  finish();
  const last = paras[paras.length - 1];
  return { notes, docEnd, lastEmpty: !last || !last.text.trim(), revisionId: doc?.revisionId || '' };
}

/** Newest first (ties: later in the doc first). */
export function newestFirst(notes) {
  return notes.map((n, i) => ({ ...n, pos: i })).sort((a, b) => (a.when === b.when ? b.pos - a.pos : a.when < b.when ? 1 : -1));
}

/** Docs batchUpdate requests that append entries [{ date, author, text }] at the end of the doc. */
export function appendRequests(parsed, entries) {
  const at = parsed.docEnd - 1; // just before the doc's final newline
  let text = '';
  const bold = [];
  entries.forEach((e, i) => {
    text += i === 0 && parsed.lastEmpty ? '\n' : '\n\n';
    const header = formatHeader(e.date, e.author);
    bold.push([at + text.length, at + text.length + header.length]);
    text += `${header}\n${cleanText(e.text)}`;
  });
  const range = { startIndex: at + 1, endIndex: at + text.length };
  return [
    { insertText: { location: { index: at }, text } },
    { updateParagraphStyle: { range, paragraphStyle: { namedStyleType: 'NORMAL_TEXT' }, fields: 'namedStyleType' } },
    { updateTextStyle: { range, textStyle: { bold: false }, fields: 'bold' } },
    ...bold.map(([s, e]) => ({ updateTextStyle: { range: { startIndex: s, endIndex: e }, textStyle: { bold: true }, fields: 'bold' } })),
  ];
}

/** Docs batchUpdate request that removes one note (and its blank separator line). */
export function deleteRequest(note) {
  const endIndex = note.isLast ? note.end - 1 : note.end; // the doc's final newline can't be deleted
  return { deleteContentRange: { range: { startIndex: note.start, endIndex } } };
}

// ---------- Google API ----------

class AuthError extends Error {}
export class AccessError extends Error {}
class ConflictError extends Error {}
export class NeedsAuthError extends Error {}

async function api(token, url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) throw new AuthError('Google sign-in expired');
  if (res.status === 403 || res.status === 404) throw new AccessError(`Notes doc not accessible (${res.status})`);
  if (res.status === 400 && /revision/i.test(await res.clone().text())) throw new ConflictError('Doc changed');
  if (!res.ok) throw new Error(`Google request failed (${res.status})`);
  return res.json();
}

/** Run fn(token) with a Notes-capable token; interactive may open Google sign-in (from a tap). */
async function withToken(fn, { interactive }) {
  let token = validToken(NOTES_SCOPE);
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!token) {
      if (!interactive) throw new NeedsAuthError('Sign in again to update notes');
      const need = grantedScopes().length ? [NOTES_SCOPE] : ALL_SCOPES; // first sign-in covers Calendar too
      const { accessToken, scopes } = await authorize(need);
      if (!scopes.includes(NOTES_SCOPE)) throw new Error('Google Docs access was not granted');
      token = accessToken;
    }
    try {
      return await fn(token);
    } catch (e) {
      if (e instanceof AuthError) {
        clearToken();
        token = null;
        continue;
      }
      throw e;
    }
  }
  throw new NeedsAuthError('Sign in again to update notes');
}

const DOC_FIELDS = 'documentId,title,revisionId,body.content(startIndex,endIndex,paragraph(elements(textRun(content))))';

function getDoc(token, id) {
  return api(token, `${DOCS}/${encodeURIComponent(id)}?fields=${encodeURIComponent(DOC_FIELDS)}`);
}

/** Use the stored doc, else the oldest "Bump Notes" doc Bump can see, else create one. */
async function ensureDoc(token) {
  const stored = getDocId();
  if (stored) return stored;
  const q = `name='${NOTES_DOC_TITLE}' and mimeType='application/vnd.google-apps.document' and trashed=false`;
  const params = new URLSearchParams({ q, orderBy: 'createdTime', pageSize: '10', spaces: 'drive', fields: 'files(id,name,createdTime)' });
  const found = await api(token, `${DRIVE}?${params}`);
  if (found.files?.length) {
    setDocId(found.files[0].id);
    return found.files[0].id;
  }
  const created = await api(token, DOCS, { method: 'POST', body: { title: NOTES_DOC_TITLE } });
  const title = `${NOTES_DOC_TITLE}\n`;
  const intro = 'Shared notes from the Bump app. New notes are added at the bottom: a bold date line, then the note.\n';
  await api(token, `${DOCS}/${created.documentId}:batchUpdate`, {
    method: 'POST',
    body: {
      requests: [
        { insertText: { location: { index: 1 }, text: title + intro } },
        { updateParagraphStyle: { range: { startIndex: 1, endIndex: 1 + title.length }, paragraphStyle: { namedStyleType: 'TITLE' }, fields: 'namedStyleType' } },
      ],
    },
  });
  setDocId(created.documentId);
  return created.documentId;
}

function saveCache(docId, doc) {
  const { notes } = parseDocument(doc);
  const slim = newestFirst(notes).map(({ key, header, when, dateLabel, author, text }) => ({ key, header, when, dateLabel, author, text }));
  writeJSON(CACHE_KEY, { docId, title: doc.title || NOTES_DOC_TITLE, notes: slim, fetchedAt: new Date().toISOString() });
}

/** Read the doc into the cache. If an auto-found doc vanished, find/create again once. */
async function load(token) {
  let id = await ensureDoc(token);
  try {
    const doc = await getDoc(token, id);
    saveCache(id, doc);
    return doc;
  } catch (e) {
    if (!(e instanceof AccessError)) throw e;
    localStorage.removeItem(DOC_KEY);
    id = await ensureDoc(token);
    const doc = await getDoc(token, id);
    saveCache(id, doc);
    return doc;
  }
}

/** Apply a change built from a fresh copy of the doc; retry once if the other phone edited meanwhile. */
async function edit(token, build) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const id = await ensureDoc(token);
    const doc = await getDoc(token, id);
    const requests = build(parseDocument(doc));
    try {
      await api(token, `${DOCS}/${encodeURIComponent(id)}:batchUpdate`, {
        method: 'POST',
        body: { requests, writeControl: { requiredRevisionId: doc.revisionId } },
      });
      return load(token);
    } catch (e) {
      if (e instanceof ConflictError && attempt === 0) continue;
      throw e;
    }
  }
  return null;
}

/** Refresh notes from the doc. Returns { ok, error?, offline?, needsAuth? }. */
export async function refresh({ interactive = false } = {}) {
  if (!isConfigured()) return { ok: false, error: 'Shared notes not set up' };
  if (navigator.onLine === false) return { ok: false, offline: true };
  try {
    await withToken(load, { interactive });
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

function failure(e) {
  if (e instanceof NeedsAuthError) return { ok: false, needsAuth: true, error: e.message };
  if (e instanceof TypeError) return { ok: false, offline: true }; // fetch network failure
  return { ok: false, error: e.message || 'Could not reach Google Docs' };
}

export async function addNote({ text, author }) {
  const body = cleanText(text);
  if (!body) return { ok: false, error: 'Write a note first' };
  try {
    await withToken((t) => edit(t, (parsed) => appendRequests(parsed, [{ date: new Date(), author, text: body }])), { interactive: true });
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

/** Copy notes kept only on this phone (oldest first, original dates) into the doc. */
export async function copyLocalNotes(localNotes) {
  const entries = [...localNotes]
    .filter((n) => cleanText(n.body))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((n) => ({ date: new Date(n.createdAt), author: n.author, text: n.body }));
  if (!entries.length) return { ok: true };
  try {
    await withToken((t) => edit(t, (parsed) => appendRequests(parsed, entries)), { interactive: true });
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

export async function deleteNote(key) {
  try {
    let missing = false;
    await withToken(
      (t) =>
        edit(t, (parsed) => {
          const note = parsed.notes.find((n) => n.key === key);
          if (!note) {
            missing = true;
            throw new Error('That note changed in the doc. Refresh and try again.');
          }
          return [deleteRequest(note)];
        }),
      { interactive: true }
    );
    return { ok: !missing };
  } catch (e) {
    return failure(e);
  }
}

/** Point this phone at a different doc (must be one Bump can open). */
export async function useDoc(input) {
  const id = parseDocId(input);
  if (!id) return { ok: false, error: 'Paste a Google Docs link or document ID' };
  try {
    await withToken(async (t) => {
      const doc = await getDoc(t, id);
      setDocId(id);
      saveCache(id, doc);
    }, { interactive: true });
    return { ok: true };
  } catch (e) {
    if (e instanceof AccessError) {
      return { ok: false, error: 'Bump can’t open that doc. It can only use docs it created (Google’s most limited Drive permission).' };
    }
    return failure(e);
  }
}
