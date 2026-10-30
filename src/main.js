import './style.css';
import * as store from './store.js';
import { isInviteOk, tryInvite } from './invite.js';
import * as calendar from './calendar.js';
import * as notesDoc from './notesDoc.js';
import { loadGis } from './google.js';
import {
  todayNY,
  pregnancyWeek,
  daysUntilDue,
} from './utils/dates.js';
import { formatLongDate } from './utils/helpers.js';
import {
  PIN_RULE,
  PIN_ERROR,
  dateField,
  renderInviteGate,
  renderSetupGate,
  renderUnlockGate,
  viewToday,
  viewAppointments,
  viewNotes,
  viewSettings,
  renderAppShell,
} from './ui/render.js';

const app = document.getElementById('app');

let tab = 'today';
let browseWeek = null;
let gateMode = 'auto'; // auto | invite | unlock | setup
let renderedAppDate = null; // date the unlocked app was last drawn for (midnight refresh)
// Google Calendar sync status for the Appts tab (events themselves are cached by calendar.js)
const cal = { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false };
// Open/closed state of the workout card's expandable sections (kept across re-renders)
const workoutUi = { detailsOpen: false, stopOpen: false };
// Shared notes (Google Doc) status for the Notes tab (notes themselves are cached by notesDoc.js)
const notesUi = { loading: false, busy: '', error: '', offline: false, needsAuth: false, docError: '', docMsg: '' };
const NOTE_AUTHOR_KEY = 'bump.noteAuthor.v1';
const NOTE_DRAFT_KEY = 'bump.noteDraft.v1'; // unsent note text, so a failed add or a re-render never loses it
const getDraft = () => localStorage.getItem(NOTE_DRAFT_KEY) || '';
const setDraft = (v) => (v ? localStorage.setItem(NOTE_DRAFT_KEY, v) : localStorage.removeItem(NOTE_DRAFT_KEY));

store.load();

function render() {
  const s = store.getState();
  if (!isInviteOk()) {
    gateMode = 'invite';
    renderGate();
    return;
  }
  if (!store.isSetup() || !store.isUnlocked()) {
    if (gateMode === 'invite' || gateMode === 'auto') {
      gateMode = store.isSetup() ? 'unlock' : 'setup';
    }
    renderGate();
    bindDateFields(app);
    return;
  }
  renderApp(s);
  bindDateFields(app);
}


function bindDateFields(root) {
  root.querySelectorAll('.date-input').forEach((input) => {
    const display = input.parentElement.querySelector('.date-display');
    const sync = () => {
      display.textContent = formatLongDate(input.value) || 'Choose a date';
      display.classList.toggle('is-empty', !input.value);
    };
    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    // Desktop browsers only open the picker from their tiny icon; phones open it on tap anyway.
    input.addEventListener('click', () => {
      try { input.showPicker?.(); } catch { /* not allowed here; native behavior applies */ }
    });
  });
}

function renderGate() {
  const setup = store.isSetup();
  if (gateMode === 'auto') gateMode = !isInviteOk() ? 'invite' : (setup ? 'unlock' : 'setup');

  if (gateMode === 'invite') {
    app.innerHTML = renderInviteGate();
    const inviteEl = app.querySelector('#inviteCode');
    inviteEl.focus();
    const tryUnlockInvite = async () => {
      const err = app.querySelector('#gateErr');
      err.classList.add('hidden');
      const ok = await tryInvite(inviteEl.value);
      if (ok) {
        gateMode = 'auto';
        render();
      } else {
        err.textContent = 'That invite doesn\u2019t match. Double-check and try again.';
        err.classList.remove('hidden');
      }
    };
    app.querySelector('#doInvite').onclick = tryUnlockInvite;
    inviteEl.onkeydown = (e) => { if (e.key === 'Enter') tryUnlockInvite(); };
    return;
  }

  if (gateMode === 'setup') {
    app.innerHTML = renderSetupGate();
    app.querySelector('#setupForm').onsubmit = (e) => {
      e.preventDefault();
      const dueDate = app.querySelector('#dueDate').value;
      const pin = app.querySelector('#pin').value.trim();
      const pin2 = app.querySelector('#pin2').value.trim();
      const err = app.querySelector('#gateErr');
      if (!dueDate) { err.textContent = 'Pick a due date'; err.classList.remove('hidden'); return; }
      if (!PIN_RULE.test(pin)) { err.textContent = PIN_ERROR; err.classList.remove('hidden'); return; }
      if (pin !== pin2) { err.textContent = 'PINs do not match'; err.classList.remove('hidden'); return; }
      store.setupHousehold({ pin, dueDate });
      gateMode = 'auto';
      tab = 'today';
      render();
    };
    return;
  }

  // unlock
  app.innerHTML = renderUnlockGate();
  const pinEl = app.querySelector('#pin');
  pinEl.focus();
  app.querySelector('#unlockForm').onsubmit = (e) => {
    e.preventDefault();
    if (store.unlock(pinEl.value)) {
      gateMode = 'auto';
      render();
    } else {
      const err = app.querySelector('#gateErr');
      err.textContent = 'Incorrect PIN';
      err.classList.remove('hidden');
    }
  };
}

function renderApp(s) {
  const due = s.household.dueDate;
  const week = pregnancyWeek(due);
  const daysLeft = daysUntilDue(due);
  const log = store.getTodayLog();
  const today = todayNY();
  renderedAppDate = today;

  app.innerHTML = renderAppShell(today, tab);

  app.querySelectorAll('.nav button').forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.tab === 'today' && tab === 'today') {
        jumpTarget = null;
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
        return;
      }
      tab = btn.dataset.tab;
      render();
      // Opening Appts is a tap, so a token can be re-requested silently if needed
      if (tab === 'appointments' && calendar.isConnected()) syncCalendar({ interactive: true });
      if (tab === 'notes' && notesDoc.isConnected()) syncNotes({ interactive: true });
    };
  });
  if (calendar.isConfigured()) loadGis().catch(() => {}); // preload so sign-in opens from the tap

  const main = app.querySelector('#main');
  if (tab === 'today') {
    main.innerHTML = viewToday({
      due,
      week,
      daysLeft,
      log,
      browseWeek,
      workoutUi,
      waterGoal: store.getWaterGoal(),
    });
  } else if (tab === 'appointments') {
    main.innerHTML = viewAppointments({
      isConfigured: calendar.isConfigured(),
      isConnected: calendar.isConnected(),
      cache: calendar.getCache(),
      cal,
    });
  } else if (tab === 'notes') {
    main.innerHTML = viewNotes({
      isConfigured: notesDoc.isConfigured(),
      isConnected: notesDoc.isConnected(),
      cache: notesDoc.getCache(),
      notesUi,
      local: store.listNotes(),
      draft: getDraft(),
      docUrl: notesDoc.docUrl(),
    });
  } else {
    main.innerHTML = viewSettings({
      household: s.household,
      waterGoal: store.getWaterGoal(),
      waterGoalMin: store.WATER_GOAL_MIN,
      waterGoalMax: store.WATER_GOAL_MAX,
      calendarConfigured: calendar.isConfigured(),
      calendarConnected: calendar.isConnected(),
      notesConnected: notesDoc.isConnected(),
      notesDocId: notesDoc.getDocId(),
      notesDocUrl: notesDoc.docUrl(),
      notesUi,
    });
  }

  bindView(main);
  if (tab === 'today') scrollWeekPickerToActive(main);
}

/** Center the selected (or current) week pill in the horizontal week strip. */
function scrollWeekPickerToActive(root) {
  const strip = root.querySelector('.week-browser');
  const pill = strip?.querySelector('.week-pill.active') || strip?.querySelector('.week-pill.current');
  if (!strip || !pill) return;
  const s = strip.getBoundingClientRect();
  const p = pill.getBoundingClientRect();
  strip.scrollLeft += p.left - s.left - (s.width - p.width) / 2;
}

/** Fetch tagged events and redraw the Appts tab when done. */
async function syncCalendar({ interactive = false, consent = false } = {}) {
  if (!calendar.isConfigured() || cal.loading) return;
  if (!calendar.isConnected() && !interactive) return;
  cal.loading = true;
  cal.error = '';
  if (tab === 'appointments') render();
  const res = await calendar.refresh({ interactive, consent });
  cal.loading = false;
  if (res.ok) {
    cal.needsReconnect = false;
    cal.stale = false;
    cal.error = '';
  } else if (res.needsReconnect && !interactive) {
    cal.stale = true; // token expired while in the background; keep showing the cache
  } else {
    cal.needsReconnect = Boolean(res.needsReconnect) && calendar.isConnected();
    cal.error = res.error || 'Could not reach Google Calendar';
  }
  if (tab === 'appointments' || tab === 'settings') render();
}

async function syncNotes({ interactive = false } = {}) {
  if (!notesDoc.isConfigured() || notesUi.loading) return;
  if (!notesDoc.isConnected() && !interactive) return;
  notesUi.loading = true;
  notesUi.error = '';
  if (tab === 'notes') render();
  const res = await notesDoc.refresh({ interactive });
  notesUi.loading = false;
  notesUi.offline = Boolean(res.offline);
  notesUi.needsAuth = Boolean(res.needsAuth);
  notesUi.error = res.ok || res.offline || res.needsAuth ? '' : res.error || 'Could not reach Google Docs';
  if (tab === 'notes' || tab === 'settings') render();
}

/** Run a doc change (add/delete/copy) with a busy label; refreshes the list on success. */
async function notesAction(label, fn, onOk = () => {}) {
  if (notesUi.busy) return false;
  notesUi.busy = label;
  notesUi.error = '';
  render();
  const res = await fn();
  notesUi.busy = '';
  notesUi.offline = Boolean(res.offline);
  notesUi.needsAuth = Boolean(res.needsAuth);
  if (res.ok) {
    notesUi.needsAuth = false;
    onOk();
  }
  notesUi.error = res.ok ? '' : res.offline ? 'You\u2019re offline. Try again when you\u2019re back online.' : res.error || 'Something went wrong';
  render();
  return res.ok;
}

// ---------- Today shortcut chips ----------
let jumpTarget = null; // chip just tapped: stays highlighted until the user scrolls by hand

function scrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function setActiveJump(id) {
  document.querySelectorAll('.jump').forEach((b) => {
    const on = b.dataset.jump === id;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
    if (on) {
      const row = b.parentElement;
      const left = b.offsetLeft - row.offsetLeft;
      if (left < row.scrollLeft || left + b.offsetWidth > row.scrollLeft + row.clientWidth) {
        row.scrollTo({ left: left - 16, behavior: scrollBehavior() });
      }
    }
  });
}

/** Highlight the chip for the card at the top of the screen (below the sticky chip row). */
function updateActiveJump() {
  if (tab !== 'today') return;
  const row = document.querySelector('.jump-row');
  if (!row) return;
  if (jumpTarget) return setActiveJump(jumpTarget);
  const line = row.getBoundingClientRect().bottom + 24;
  const secs = [...document.querySelectorAll('.today-sec')];
  let active = secs[0]?.id || null;
  for (const el of secs) if (el.getBoundingClientRect().top <= line) active = el.id;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom && secs.length) active = secs[secs.length - 1].id;
  setActiveJump(active);
}

let jumpRaf = 0;
window.addEventListener('scroll', () => {
  if (tab !== 'today' || jumpRaf) return;
  jumpRaf = requestAnimationFrame(() => { jumpRaf = 0; updateActiveJump(); });
}, { passive: true });
// A hand scroll ends the "just tapped" highlight (a programmatic smooth scroll doesn't).
['touchstart', 'wheel', 'keydown'].forEach((type) =>
  window.addEventListener(type, (e) => {
    if (!jumpTarget || e.target.closest?.('.jump-row')) return;
    jumpTarget = null;
    updateActiveJump();
  }, { passive: true })
);

function bindView(main) {
  if (tab === 'today') {
    main.querySelectorAll('[data-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.jump);
        if (!target) return;
        jumpTarget = btn.dataset.jump;
        setActiveJump(btn.dataset.jump);
        target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      });
    });
    updateActiveJump();
    main.querySelector('#hydroPlus')?.addEventListener('click', () => { store.addWater(8); render(); });
    main.querySelector('#hydroPlus16')?.addEventListener('click', () => { store.addWater(16); render(); });
    main.querySelector('#hydroMinus')?.addEventListener('click', () => { store.addWater(-8); render(); });
    main.querySelector('#woDone')?.addEventListener('change', async (e) => {
      const week = pregnancyWeek(store.getState().household.dueDate);
      const { workoutFor } = await import('./data/workouts.js');
      store.setWorkoutDone(e.target.checked, workoutFor(todayNY(), week).id);
      render();
    });
    main.querySelector('#walkDone')?.addEventListener('change', (e) => {
      store.setWalkDone(e.target.checked);
      render();
    });
    main.querySelector('#woDetails')?.addEventListener('toggle', (e) => { workoutUi.detailsOpen = e.target.open; });
    main.querySelector('#woStop')?.addEventListener('toggle', (e) => { workoutUi.stopOpen = e.target.open; });
    main.querySelectorAll('[data-browse-week]').forEach((btn) => {
      btn.addEventListener('click', () => {
        browseWeek = Number(btn.dataset.browseWeek);
        render();
      });
    });
    main.querySelector('#resetBrowse')?.addEventListener('click', () => {
      browseWeek = null;
      render();
    });
  }

  if (tab === 'appointments') {
    main.querySelector('#calConnect')?.addEventListener('click', () => syncCalendar({ interactive: true }));
    main.querySelector('#calRefresh')?.addEventListener('click', () => syncCalendar({ interactive: true }));
    main.querySelector('#calReconnect')?.addEventListener('click', () => syncCalendar({ interactive: true, consent: true }));
    main.querySelector('#calPast')?.addEventListener('toggle', (e) => { cal.pastOpen = e.target.open; });
  }

  if (tab === 'notes') {
    main.querySelector('#notesConnect')?.addEventListener('click', () => syncNotes({ interactive: true }));
    main.querySelector('#notesReconnect')?.addEventListener('click', () => syncNotes({ interactive: true }));
    main.querySelector('#notesRefresh')?.addEventListener('click', () => syncNotes({ interactive: true }));
    main.querySelector('#noteAuthor')?.addEventListener('change', (e) => localStorage.setItem(NOTE_AUTHOR_KEY, e.target.value));
    main.querySelector('#noteAdd')?.addEventListener('click', async () => {
      const bodyEl = main.querySelector('#noteBody');
      const text = bodyEl.value.trim();
      if (!text) return bodyEl.focus();
      const author = main.querySelector('#noteAuthor').value;
      setDraft(bodyEl.value);
      await notesAction('add', () => notesDoc.addNote({ text, author }), () => setDraft(''));
    });
    const bodyEl = main.querySelector('#noteBody');
    if (bodyEl) {
      bodyEl.value = getDraft(); // keep typed text across re-renders, failed adds, and reloads
      bodyEl.addEventListener('input', () => setDraft(bodyEl.value));
    }
    main.querySelector('#notesMigrate')?.addEventListener('click', async () => {
      await notesAction('copy', () => notesDoc.copyLocalNotes(store.listNotes()), () => store.clearLocalNotes());
    });
    main.querySelectorAll('.note-del').forEach((btn) => {
      btn.addEventListener('click', () => {
        const note = notesDoc.getCache().notes[Number(btn.dataset.i)];
        if (note && confirm('Delete this note from the shared doc?')) notesAction('delete', () => notesDoc.deleteNote(note.key));
      });
    });
  }

  if (tab === 'settings') {
    main.querySelector('#saveDue')?.addEventListener('click', () => {
      const v = main.querySelector('#setDue').value;
      if (v) { store.setDueDate(v); browseWeek = null; render(); }
    });
    main.querySelector('#waterGoalForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = main.querySelector('#setWaterGoal').value.trim();
      if (!/^\d+$/.test(v) || !store.setWaterGoal(Number(v))) {
        return alert(`Enter a goal from ${store.WATER_GOAL_MIN} to ${store.WATER_GOAL_MAX} fl oz (whole numbers).`);
      }
      render();
    });
    main.querySelector('#pinForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = main.querySelector('#setPin').value.trim();
      if (!PIN_RULE.test(v)) return alert(PIN_ERROR);
      store.setPin(v);
      alert('PIN updated');
      render();
    });
    main.querySelector('#doExport')?.addEventListener('click', () => {
      const json = store.exportJSON();
      const box = main.querySelector('#exportBox');
      box.classList.remove('hidden');
      box.value = json;
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bump-backup-${todayNY()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
    main.querySelector('#doLock')?.addEventListener('click', () => {
      store.lock();
      gateMode = 'unlock';
      render();
    });
    main.querySelector('#docForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = main.querySelector('#docInput').value;
      notesUi.docError = '';
      notesUi.docMsg = '';
      if (notesUi.busy) return;
      notesUi.busy = 'doc';
      render();
      const res = await notesDoc.useDoc(input);
      notesUi.busy = '';
      if (res.ok) notesUi.docMsg = 'Notes doc updated.';
      else notesUi.docError = res.error || 'Could not open that doc';
      render();
    });
    main.querySelector('#googleDisconnect')?.addEventListener('click', async () => {
      if (!confirm('Disconnect Google? Saved calendar events and the saved copy of shared notes will be removed from this phone. The notes doc itself stays in Google Drive.')) return;
      await calendar.disconnect();
      notesDoc.clearCache();
      Object.assign(cal, { loading: false, error: '', needsReconnect: false, stale: false });
      Object.assign(notesUi, { loading: false, busy: '', error: '', offline: false, needsAuth: false, docError: '', docMsg: '' });
      render();
    });
    main.querySelector('#doReset')?.addEventListener('click', async () => {
      if (confirm('Erase all Bump data on this device?')) {
        await calendar.disconnect();
        notesDoc.forgetDoc();
        setDraft('');
        Object.assign(cal, { loading: false, error: '', needsReconnect: false, stale: false });
        store.resetAll();
        gateMode = 'setup';
        tab = 'today';
        browseWeek = null;
        render();
      }
    });
  }
}

// When the app comes back into view: redraw on a new day (e.g., left open past midnight)
// and refresh calendar events / shared notes on their tabs (using a still-valid token only).
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (!store.isSetup() || !store.isUnlocked()) return;
  if (renderedAppDate && renderedAppDate !== todayNY()) render();
  if (tab === 'appointments') syncCalendar({ interactive: false });
  if (tab === 'notes') syncNotes({ interactive: false });
});
window.addEventListener('online', () => {
  if (tab === 'notes' && notesUi.offline) syncNotes({ interactive: false });
});

render();
