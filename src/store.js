/**
 * Data layer — everything lives in localStorage on this device.
 * State: household, dailyLogs, notes. Settings can download a JSON backup.
 * (Appointments now come from Google Calendar — see calendar.js. Older stored
 * manual appointments are left untouched in storage but no longer used or exported.)
 */
import { todayNY } from './utils/dates.js';

const STORAGE_KEY = 'bump.v1';
const SCHEMA_VERSION = 1;

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    household: {
      id: uid(),
      pin: null, // shared household PIN (stored in plaintext locally)
      dueDate: null,
      createdAt: new Date().toISOString(),
      names: { partnerA: 'Vince', partnerB: 'Chantal' },
    },
    dailyLogs: {}, // keyed by YYYY-MM-DD
    notes: [],
    unlocked: false,
    updatedAt: new Date().toISOString(),
  };
}

function ensureDaily(state, date = todayNY()) {
  if (!state.dailyLogs[date]) {
    state.dailyLogs[date] = {
      date,
      hydrationCount: 0,
      movementDone: false, // today's workout marked done
      workoutId: null, // which session was done (see data/workouts.js)
      walkDone: false, // today's walk marked done
    };
  }
  return state.dailyLogs[date];
}

let state = null;

function persist() {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('persist failed', e);
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      if (!state.schemaVersion) state.schemaVersion = SCHEMA_VERSION;
      if (!state.household) state = emptyState();
    } else {
      state = emptyState();
    }
  } catch {
    state = emptyState();
  }
  ensureDaily(state);
  return state;
}

export function getState() {
  if (!state) load();
  return state;
}

export function isSetup() {
  const s = getState();
  return Boolean(s.household?.pin && s.household?.dueDate);
}

export function isUnlocked() {
  return Boolean(getState().unlocked);
}

export function setupHousehold({ pin, dueDate }) {
  const s = getState();
  s.household.pin = String(pin).trim();
  s.household.dueDate = dueDate;
  s.household.createdAt = s.household.createdAt || new Date().toISOString();
  s.unlocked = true;
  ensureDaily(s);
  persist();
  return s;
}

/** True if pin matches the current household PIN (no state change). */
function verifyPin(pin) {
  const s = getState();
  return Boolean(s.household?.pin) && String(pin ?? '').trim() === String(s.household.pin);
}

export function unlock(pin) {
  const s = getState();
  if (verifyPin(pin)) {
    s.unlocked = true;
    ensureDaily(s);
    persist();
    return true;
  }
  return false;
}

export function lock() {
  const s = getState();
  s.unlocked = false;
  persist();
}

export function setDueDate(dueDate) {
  const s = getState();
  s.household.dueDate = dueDate;
  persist();
}

export function setPin(pin) {
  const s = getState();
  s.household.pin = String(pin).trim();
  persist();
}

export function getTodayLog() {
  return ensureDaily(getState());
}

export function bumpHydration(delta = 1) {
  const s = getState();
  const log = ensureDaily(s);
  log.hydrationCount = Math.max(0, (log.hydrationCount || 0) + delta);
  persist();
  return log;
}

export function setWorkoutDone(done, workoutId = null) {
  const s = getState();
  const log = ensureDaily(s);
  log.movementDone = Boolean(done);
  log.workoutId = done ? workoutId : null;
  persist();
  return log;
}

export function setWalkDone(done) {
  const s = getState();
  const log = ensureDaily(s);
  log.walkDone = Boolean(done);
  persist();
  return log;
}

export function listNotes() {
  return [...getState().notes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function addNote({ body, author = '' }) {
  const s = getState();
  const note = {
    id: uid(),
    body: body.trim(),
    author: author.trim(),
    createdAt: new Date().toISOString(),
  };
  s.notes.unshift(note);
  persist();
  return note;
}

export function deleteNote(id) {
  const s = getState();
  s.notes = s.notes.filter((n) => n.id !== id);
  persist();
}

/** JSON backup of household data for safekeeping (excludes the PIN and unlock flag). */
export function exportJSON() {
  const s = getState();
  const { pin, ...household } = s.household;
  const payload = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'bump-tracker',
    household,
    // Older logs may still carry a retired `windDown` flag; leave it in storage but not in backups.
    dailyLogs: Object.fromEntries(
      Object.entries(s.dailyLogs).map(([date, { windDown, ...log }]) => [date, log])
    ),
    notes: s.notes,
  };
  return JSON.stringify(payload, null, 2);
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  state = emptyState();
  persist();
}
