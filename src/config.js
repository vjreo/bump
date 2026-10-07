/**
 * App configuration (all values here end up in the public site bundle).
 * A Google OAuth *web* client ID is public by design, so it's fine to ship it.
 */

/** Set VITE_GOOGLE_CLIENT_ID in .env.production (build) or .env (dev). Empty = calendar not set up. */
const rawClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
export const GOOGLE_CLIENT_ID = rawClientId.endsWith('.apps.googleusercontent.com') ? rawClientId : '';

/** Which calendar to read. 'primary' = the signed-in account's main calendar (or use a calendar's ID). */
export const CALENDAR_ID = 'primary';

/** Only events whose title contains this tag (case-insensitive) are shown; the tag is stripped. */
export const CALENDAR_TAG = '[Bump]';

/** Read-only access to events. */
export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events.readonly';

/** How far ahead / back to fetch, and how many past events to list. */
export const CALENDAR_LOOKAHEAD_DAYS = 183;
export const CALENDAR_LOOKBACK_DAYS = 60;
export const CALENDAR_PAST_LIMIT = 10;
