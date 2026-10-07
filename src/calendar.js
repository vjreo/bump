/**
 * Google Calendar (read-only) via Google Identity Services token flow.
 * Only events tagged with CALENDAR_TAG are kept; nothing else is displayed or stored.
 */
import {
  GOOGLE_CLIENT_ID,
  CALENDAR_ID,
  CALENDAR_TAG,
  CALENDAR_SCOPE,
  CALENDAR_LOOKAHEAD_DAYS,
  CALENDAR_LOOKBACK_DAYS,
} from './config.js';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const TOKEN_KEY = 'bump.gcal.token.v1'; // { accessToken, expiresAt } — short-lived (about 1 hour)
const CACHE_KEY = 'bump.gcal.cache.v1'; // { events, fetchedAt } — tagged events only

const DAY_MS = 86400000;

export function isConfigured() {
  return Boolean(GOOGLE_CLIENT_ID);
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[bump] calendar storage failed', e);
  }
}

/** Connected = the user has authorized at least once and hasn't disconnected. */
export function isConnected() {
  return Boolean(readJSON(CACHE_KEY));
}

export function getCache() {
  return readJSON(CACHE_KEY) || { events: [], fetchedAt: null };
}

function validToken() {
  const t = readJSON(TOKEN_KEY);
  return t && t.accessToken && t.expiresAt > Date.now() + 60000 ? t.accessToken : null;
}

// ---------- Google Identity Services ----------

let gisPromise = null;

/** Load the GIS script once (only when a client ID is configured). */
export function loadGis() {
  if (!isConfigured()) return Promise.reject(new Error('Calendar not set up'));
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = GIS_SRC;
      el.async = true;
      el.defer = true;
      el.onload = () => resolve();
      el.onerror = () => {
        gisPromise = null;
        reject(new Error('Could not load Google sign-in'));
      };
      document.head.appendChild(el);
    });
  }
  return gisPromise;
}

let tokenClient = null;
let pending = null;

function getTokenClient() {
  if (tokenClient) return tokenClient;
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: CALENDAR_SCOPE,
    callback: (resp) => {
      const p = pending;
      pending = null;
      if (!p) return;
      if (!resp || resp.error || !resp.access_token) {
        p.reject(new Error(resp?.error_description || resp?.error || 'Authorization failed'));
        return;
      }
      if (!window.google.accounts.oauth2.hasGrantedAllScopes(resp, CALENDAR_SCOPE)) {
        p.reject(new Error('Calendar access was not granted'));
        return;
      }
      const expiresIn = Number(resp.expires_in) || 3600;
      writeJSON(TOKEN_KEY, { accessToken: resp.access_token, expiresAt: Date.now() + expiresIn * 1000 });
      p.resolve(resp.access_token);
    },
    error_callback: (err) => {
      const p = pending;
      pending = null;
      if (p) p.reject(new Error(err?.type === 'popup_closed' ? 'Sign-in window closed' : 'Could not open Google sign-in'));
    },
  });
  return tokenClient;
}

/**
 * Ask GIS for an access token. prompt '' = no consent screen if already granted.
 * Must run from a user gesture (tap) or browsers may block the sign-in popup.
 */
function requestToken(prompt = '') {
  return new Promise((resolve, reject) => {
    if (pending) pending.reject(new Error('Superseded'));
    pending = { resolve, reject };
    try {
      getTokenClient().requestAccessToken({ prompt });
    } catch (e) {
      pending = null;
      reject(e);
    }
  });
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
 * Returns { ok, needsReconnect?, error? }.
 */
export async function refresh({ interactive = false, consent = false } = {}) {
  if (!isConfigured()) return { ok: false, error: 'Calendar not set up' };
  let token = consent ? null : validToken();
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!token) {
      if (!interactive) return { ok: false, needsReconnect: true };
      try {
        await loadGis();
        token = await requestToken(consent ? 'consent' : '');
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
        localStorage.removeItem(TOKEN_KEY);
        token = null;
        continue; // retry once with a fresh token (interactive only)
      }
      return { ok: false, error: e.message || 'Could not reach Google Calendar' };
    }
  }
  return { ok: false, needsReconnect: true };
}

/** Revoke access (if we still hold a token) and clear the token + cached events. */
export async function disconnect() {
  const t = readJSON(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CACHE_KEY);
  if (t?.accessToken && isConfigured()) {
    try {
      await loadGis();
      await new Promise((resolve) => window.google.accounts.oauth2.revoke(t.accessToken, () => resolve()));
    } catch {
      /* best effort — local data is already cleared */
    }
  }
}
