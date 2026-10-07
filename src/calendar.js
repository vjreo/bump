/**
 * Google Calendar (read-only). Sign-in lives in google.js (shared with Notes).
 * Only events tagged with CALENDAR_TAG are kept; nothing else is displayed or stored.
 */
import {
  CALENDAR_ID,
  CALENDAR_TAG,
  CALENDAR_SCOPE,
  ALL_SCOPES,
  CALENDAR_LOOKAHEAD_DAYS,
  CALENDAR_LOOKBACK_DAYS,
} from './config.js';
import { isConfigured, readJSON, writeJSON, validToken, clearToken, authorize, revokeAll, hasGranted, grantedScopes } from './google.js';

export { isConfigured };

const CACHE_KEY = 'bump.gcal.cache.v1'; // { events, fetchedAt } — tagged events only

const DAY_MS = 86400000;

/** Connected = Calendar access was granted (or events were fetched) and the user hasn't disconnected. */
export function isConnected() {
  return Boolean(readJSON(CACHE_KEY)) || hasGranted(CALENDAR_SCOPE);
}

export function getCache() {
  return readJSON(CACHE_KEY) || { events: [], fetchedAt: null };
}

// ---------- Calendar API ----------

const TAG_RE = new RegExp(CALENDAR_TAG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

export function hasTag(title) {
  TAG_RE.lastIndex = 0;
  return typeof title === 'string' && TAG_RE.test(title);
}

export function stripTag(title) {
  return String(title).replace(TAG_RE, ' ').replace(/\s{2,}/g, ' ').trim() || 'Untitled';
}

/** Keep only tagged events, reduced to the fields Bump displays. */
export function toTaggedEvents(items) {
  return (items || [])
    .filter((ev) => ev && ev.status !== 'cancelled' && hasTag(ev.summary))
    .map((ev) => {
      const allDay = Boolean(ev.start?.date && !ev.start?.dateTime);
      return {
        id: String(ev.id || ''),
        title: stripTag(ev.summary),
        allDay,
        start: allDay ? ev.start.date : ev.start?.dateTime,
        end: allDay ? ev.end?.date || ev.start.date : ev.end?.dateTime || ev.start?.dateTime,
        location: String(ev.location || '').trim(),
      };
    })
    .filter((ev) => ev.start);
}

class AuthError extends Error {}

async function fetchTagged(accessToken) {
  const now = Date.now();
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: new Date(now - CALENDAR_LOOKBACK_DAYS * DAY_MS).toISOString(),
    timeMax: new Date(now + CALENDAR_LOOKAHEAD_DAYS * DAY_MS).toISOString(),
    maxResults: '250',
    q: CALENDAR_TAG.replace(/[^\w\s]/g, ' ').trim(), // narrows server-side; exact tag check is done below
    fields: 'items(id,status,summary,location,start,end),nextPageToken',
  });
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`;
  const events = [];
  let pageToken = '';
  for (let page = 0; page < 5; page++) {
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`${base}?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (res.status === 401) throw new AuthError('Token expired');
    if (!res.ok) throw new Error(`Calendar request failed (${res.status})`);
    const data = await res.json();
    events.push(...toTaggedEvents(data.items));
    pageToken = data.nextPageToken || '';
    if (!pageToken) break;
  }
  return events;
}

/**
 * Refresh tagged events.
 * interactive=true (from a tap): may request a token (silently if already granted).
 * interactive=false (e.g., app regains focus): only uses a still-valid token.
 * The first connect asks for Calendar + Notes in one consent screen.
 * Returns { ok, needsReconnect?, error? }.
 */
export async function refresh({ interactive = false, consent = false } = {}) {
  if (!isConfigured()) return { ok: false, error: 'Calendar not set up' };
  let token = consent ? null : validToken(CALENDAR_SCOPE);
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!token) {
      if (!interactive) return { ok: false, needsReconnect: true };
      try {
        const need = grantedScopes().length ? [CALENDAR_SCOPE] : ALL_SCOPES; // first sign-in covers Notes too
        const { accessToken, scopes } = await authorize(need, { prompt: consent ? 'consent' : '' });
        if (!scopes.includes(CALENDAR_SCOPE)) throw new Error('Calendar access was not granted');
        token = accessToken;
      } catch (e) {
        return { ok: false, needsReconnect: true, error: e.message };
      }
    }
    try {
      const events = await fetchTagged(token);
      writeJSON(CACHE_KEY, { events, fetchedAt: new Date().toISOString() });
      return { ok: true };
    } catch (e) {
      if (e instanceof AuthError) {
        clearToken();
        token = null;
        continue; // retry once with a fresh token (interactive only)
      }
      return { ok: false, error: e.message || 'Could not reach Google Calendar' };
    }
  }
  return { ok: false, needsReconnect: true };
}

/** Forget cached events (used when disconnecting Google). */
export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

/** Revoke Google access and clear the token + cached events. */
export async function disconnect() {
  clearCache();
  await revokeAll();
}
