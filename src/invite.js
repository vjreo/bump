/**
 * Invite-only gate (client-side shared secret).
 * Hash is baked at build time via VITE_INVITE_HASH.
 * This is security-through-obscurity for a static site — not real auth.
 */

const INVITE_HASH = String(import.meta.env.VITE_INVITE_HASH || '').toLowerCase();
const FLAG_KEY = 'bump.inviteOk.v1';

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isInviteOk() {
  try {
    return localStorage.getItem(FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

export function rememberInviteOk() {
  try {
    localStorage.setItem(FLAG_KEY, '1');
  } catch (e) {
    console.warn('invite flag persist failed', e);
  }
}

/** Normalize invite for hashing: trim + lowercase */
export function normalizeInvite(code) {
  return String(code ?? '').trim().toLowerCase();
}

/**
 * Check invite code against baked hash.
 * On success, persists unlock flag in localStorage.
 */
export async function tryInvite(code) {
  if (!INVITE_HASH) {
    console.warn('[bump] VITE_INVITE_HASH not set — invite gate cannot unlock');
    return false;
  }
  const normalized = normalizeInvite(code);
  if (!normalized) return false;
  const hash = await sha256Hex(normalized);
  if (hash === INVITE_HASH) {
    rememberInviteOk();
    return true;
  }
  return false;
}
