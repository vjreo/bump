/**
 * Google sign-in shared by Calendar and Notes: Google Identity Services (GIS) token flow.
 * One access token can cover several scopes; we remember which scopes the user granted so
 * silent re-requests ask for exactly those (incremental consent adds new ones on a tap).
 */
import { GOOGLE_CLIENT_ID, CALENDAR_SCOPE } from './config.js';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const TOKEN_KEY = 'bump.gcal.token.v1'; // { accessToken, expiresAt, scopes[] } — short-lived (about 1 hour)
const GRANTED_KEY = 'bump.google.scopes.v1'; // scopes the user has granted Bump (string[])
const LEGACY_CAL_CACHE = 'bump.gcal.cache.v1'; // calendar connected before scopes were tracked

export function isConfigured() {
  return Boolean(GOOGLE_CLIENT_ID);
}

export function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[bump] storage failed', e);
  }
}

/** Scopes granted so far (older installs only ever had Calendar). */
export function grantedScopes() {
  const list = readJSON(GRANTED_KEY);
  if (Array.isArray(list)) return list;
  return localStorage.getItem(LEGACY_CAL_CACHE) ? [CALENDAR_SCOPE] : [];
}

export function hasGranted(scope) {
  return grantedScopes().includes(scope);
}

/** A still-valid stored token that covers `scope`, or null. */
export function validToken(scope) {
  const t = readJSON(TOKEN_KEY);
  if (!t || !t.accessToken || !(t.expiresAt > Date.now() + 60000)) return null;
  const scopes = Array.isArray(t.scopes) ? t.scopes : [CALENDAR_SCOPE]; // legacy tokens were Calendar-only
  return scopes.includes(scope) ? t.accessToken : null;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Drop one scope from the remembered list (e.g. Google says the token doesn't really have it). */
export function forgetScope(scope) {
  writeJSON(GRANTED_KEY, grantedScopes().filter((s) => s !== scope));
}

// ---------- GIS ----------

let gisPromise = null;

/** Load the GIS script once (only when a client ID is configured). */
export function loadGis() {
  if (!isConfigured()) return Promise.reject(new Error('Google sign-in not set up'));
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
    scope: CALENDAR_SCOPE, // overridden per request
    callback: (resp) => {
      const p = pending;
      pending = null;
      if (!p) return;
      if (!resp || resp.error || !resp.access_token) {
        p.reject(new Error(resp?.error_description || resp?.error || 'Authorization failed'));
        return;
      }
      // Use GIS's own check when available (granular consent: the user may untick a scope).
      const oauth2 = window.google?.accounts?.oauth2;
      const listed = String(resp.scope || '').split(/\s+/).filter(Boolean);
      const granted = (sc) => (typeof oauth2?.hasGrantedAllScopes === 'function' ? oauth2.hasGrantedAllScopes(resp, sc) : listed.includes(sc));
      const scopes = p.asked.filter(granted).concat(listed.filter((sc) => !p.asked.includes(sc)));
      const expiresIn = Number(resp.expires_in) || 3600;
      writeJSON(TOKEN_KEY, { accessToken: resp.access_token, expiresAt: Date.now() + expiresIn * 1000, scopes });
      // Remember Bump scopes the user granted (they can untick one on the consent screen).
      writeJSON(GRANTED_KEY, [...new Set(scopes.filter((sc) => p.asked.includes(sc)))]);
      p.resolve({ accessToken: resp.access_token, scopes, granted: (sc) => scopes.includes(sc) });
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
 * Request a token covering `need` plus anything already granted (so one token serves both
 * features). prompt '' = no consent screen for scopes already granted; new scopes get a
 * consent screen. Call from a tap, or browsers may block the sign-in popup.
 */
export async function authorize(need, { prompt = '' } = {}) {
  await loadGis();
  const asked = [...new Set([...grantedScopes(), ...need])];
  return new Promise((resolve, reject) => {
    if (pending) pending.reject(new Error('Superseded'));
    pending = { resolve, reject, asked };
    try {
      getTokenClient().requestAccessToken({ prompt, scope: asked.join(' '), include_granted_scopes: true });
    } catch (e) {
      pending = null;
      reject(e);
    }
  });
}

/** Revoke Bump's Google access entirely (Calendar + Notes) and forget the token. */
export async function revokeAll() {
  const t = readJSON(TOKEN_KEY);
  clearToken();
  localStorage.removeItem(GRANTED_KEY);
  if (t?.accessToken && isConfigured()) {
    try {
      await loadGis();
      await new Promise((resolve) => window.google.accounts.oauth2.revoke(t.accessToken, () => resolve()));
    } catch {
      /* best effort — local data is already cleared */
    }
  }
}
