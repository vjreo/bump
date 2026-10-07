/**
 * App configuration (all values here end up in the public site bundle).
 * A Google OAuth *web* client ID is public by design, so it's fine to ship it.
 */

/** Set VITE_GOOGLE_CLIENT_ID in .env.production (build) or .env (dev). Empty = Google features not set up. */
const rawClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
export const GOOGLE_CLIENT_ID = rawClientId.endsWith('.apps.googleusercontent.com') ? rawClientId : '';

/** Which calendar to read. 'primary' = the signed-in account's main calendar (or use a calendar's ID). */
export const CALENDAR_ID = 'primary';

/** Only events whose title contains this tag (case-insensitive) are shown; the tag is stripped. */
export const CALENDAR_TAG = '[Bump]';

/** Read-only access to events. */
export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events.readonly';

/**
 * Shared notes doc. drive.file is Google's least-privilege Drive scope: Bump can only see and
 * edit files it created (or that were opened with it), never the rest of the Drive. Access is
 * granted per Google Cloud project, so both phones (same account, same client ID) see the same doc.
 */
export const NOTES_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const NOTES_DOC_TITLE = 'Bump Notes';

/** One combined sign-in asks for everything Bump uses. */
export const ALL_SCOPES = [CALENDAR_SCOPE, NOTES_SCOPE];

/** How far ahead / back to fetch, and how many past events to list. */
export const CALENDAR_LOOKAHEAD_DAYS = 183;
export const CALENDAR_LOOKBACK_DAYS = 60;
export const CALENDAR_PAST_LIMIT = 10;
