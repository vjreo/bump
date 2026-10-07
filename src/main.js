import './style.css';
import * as store from './store.js';
import { isInviteOk, tryInvite } from './invite.js';
import { getWeekContent } from './data/weeks.js';
import { getPrepForWeek } from './data/prep.js';
import {
  workoutFor,
  walkFor,
  LOAD_GUIDE,
  EFFORT_LINE,
  INTENSITY_LINE,
  STOP_SIGNS,
  CHECK_WITH_OB,
} from './data/workouts.js';
import * as calendar from './calendar.js';
import * as notesDoc from './notesDoc.js';
import { loadGis } from './google.js';
import { CALENDAR_TAG, CALENDAR_PAST_LIMIT, NOTES_DOC_TITLE } from './config.js';
import {
  todayNY,
  pregnancyWeek,
  trimesterForWeek,
  daysUntilDue,
  formatDisplayDate,
  formatDisplayDateTime,
  formatMonthDay,
  formatNYDate,
  addDays,
} from './utils/dates.js';

const HYDRATION_GOAL = 8;
const app = document.getElementById('app');

let tab = 'today';
let browseWeek = null;
let gateMode = 'auto'; // auto | invite | unlock | setup
let renderedAppDate = null; // date the unlocked app was last drawn for (midnight refresh)
const PIN_RULE = /^\d{4,}$/;
const PIN_ERROR = 'PIN should be at least 4 digits (numbers only)';
// Google Calendar sync status for the Appts tab (events themselves are cached by calendar.js)
const cal = { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false };
// Open/closed state of the workout card's expandable sections (kept across re-renders)
const workoutUi = { detailsOpen: false, stopOpen: false };
// Shared notes (Google Doc) status for the Notes tab (notes themselves are cached by notesDoc.js)
const notesUi = { loading: false, busy: '', error: '', offline: false, needsAuth: false, docError: '', docMsg: '' };
const NOTE_AUTHOR_KEY = 'bump.noteAuthor.v1';
const CAL_HELP = `Add ${CALENDAR_TAG} to an event title in your Google Calendar to show it here.`;

store.load();

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

/** "May 7, 2027" for a YYYY-MM-DD value. */
function formatLongDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })
    .format(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))));
}

/**
 * Date field: a styled "May 7, 2027" display with the real <input type="date"> laid invisibly on top,
 * so a tap opens the phone's native picker. (iOS Safari draws date inputs its own way — centered
 * text, its own height and gray styling — which clashed with the other fields.)
 */
function dateField(id, value, ariaLabel = '') {
  return `
    <div class="date-field">
      <span class="date-display ${value ? '' : 'is-empty'}" aria-hidden="true">${escapeHtml(formatLongDate(value) || 'Choose a date')}</span>
      <svg class="date-ico" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <input class="date-input" type="date" id="${id}" value="${escapeHtml(value || '')}" ${ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : ''} />
    </div>`;
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
    app.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Bump</h1>
            <p>Invite-only for now</p>
          </div>
          <div class="field">
            <label class="label" for="inviteCode">Invite code</label>
            <input class="input" type="text" id="inviteCode" placeholder="bump-…" autocomplete="off" autocapitalize="off" spellcheck="false" />
            <p class="hint">Ask Vince for an invite if you don’t have one.</p>
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" id="doInvite">Continue</button>
        </div>
      </div>`;
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
        err.textContent = 'That invite doesn’t match. Double-check and try again.';
        err.classList.remove('hidden');
      }
    };
    app.querySelector('#doInvite').onclick = tryUnlockInvite;
    inviteEl.onkeydown = (e) => { if (e.key === 'Enter') tryUnlockInvite(); };
    return;
  }

  if (gateMode === 'setup') {
    app.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Bump</h1>
            <p>Vince &amp; Chantal’s shared pregnancy tracker</p>
          </div>
          <form id="setupForm" novalidate>
            <div class="field">
              <label class="label" for="dueDate">Due date</label>
              ${dateField('dueDate', '')}
            </div>
            <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
            <div class="field">
              <label class="label" for="pin">Household PIN (at least 4 digits)</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin" placeholder="Shared secret" autocomplete="new-password" />
              <p class="hint">You’ll use this PIN to unlock Bump. Your data stays on this phone.</p>
            </div>
            <div class="field">
              <label class="label" for="pin2">Confirm PIN</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin2" autocomplete="new-password" />
            </div>
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Create household</button>
          </form>
        </div>
      </div>`;
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
  app.innerHTML = `
    <div class="gate">
      <div class="gate-card">
        <div class="brand">
          <div class="brand-mark">🌱</div>
          <h1>Welcome back</h1>
          <p>Enter your household PIN</p>
        </div>
        <form id="unlockForm">
          <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
          <div class="field">
            <label class="label" for="pin">PIN</label>
            <input class="input" type="password" inputmode="numeric" id="pin" autocomplete="current-password" />
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" type="submit">Unlock</button>
        </form>
      </div>
    </div>`;
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

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${escapeHtml(formatDisplayDate(today))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${tab === 'today' ? 'active' : ''}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${tab === 'appointments' ? 'active' : ''}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${tab === 'notes' ? 'active' : ''}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${tab === 'settings' ? 'active' : ''}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`;

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
  if (tab === 'today') main.innerHTML = viewToday({ due, week, daysLeft, log });
  else if (tab === 'appointments') main.innerHTML = viewAppointments();
  else if (tab === 'notes') main.innerHTML = viewNotes();
  else main.innerHTML = viewSettings(s);

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

function weekCardHtml(content, { compact = false, id = '' } = {}) {
  if (!content) return '';
  return `
    <article class="week-hero${id ? ' today-sec' : ''}"${id ? ` id="${id}"` : ''}>
      <p class="eyebrow">Week ${content.week}</p>
      <h2>${escapeHtml(content.title)}</h2>
      <p class="week-size">About the size of ${escapeHtml(content.size)}</p>
      <div class="week-section">
        <h3>Your baby</h3>
        <p>${escapeHtml(content.baby)}</p>
      </div>
      <div class="week-section">
        <h3>How you may feel</h3>
        <p>${escapeHtml(content.feel)}</p>
      </div>
      <div class="week-section">
        <h3>This week’s tip</h3>
        <p>${escapeHtml(content.tip)}</p>
      </div>
      <p class="week-attrib">
        Inspired by the
        <a href="${escapeHtml(content.nhsUrl)}" target="_blank" rel="noopener noreferrer">NHS Best Start in Life week-by-week guide</a>
        (${content.nhsWeek === content.week ? `Week ${content.week}` : `closest NHS page: Week ${content.nhsWeek}`}). Original summary — not medical advice.
        ${compact ? '' : 'Talk to your midwife or OB about anything that worries you.'}
      </p>
    </article>`;
}

function dueCountdown(daysLeft) {
  if (daysLeft == null) return { n: '—', l: 'Days to due' };
  if (daysLeft > 0) return { n: daysLeft, l: 'Days to due' };
  if (daysLeft === 0) return { n: 0, l: 'Due today' };
  return { n: Math.abs(daysLeft), l: 'Days past due' };
}

/** Shared "done" checkbox: a real checkbox inside a 44px-tall label (the label text toggles it too). */
function checkbox(id, label, checked) {
  return `
    <label class="check" for="${id}">
      <input type="checkbox" class="check-box" id="${id}" ${checked ? 'checked' : ''} />
      <span>${escapeHtml(label)}</span>
    </label>`;
}

/** Today's workout + walk card: compact summary; tap to expand the full plan and safety details. */
function workoutCard(week, log) {
  const day = todayNY();
  const w = workoutFor(day, week);
  const walk = walkFor(day, week);
  const moveItem = (m) => `
    <li>
      <div class="wo-move"><span class="wo-move-name">${escapeHtml(m.name)}</span><span class="wo-dose">${escapeHtml(m.dose)}</span></div>
      <div class="wo-cue">${m.loadKey !== 'bodyweight' ? `<span class="wo-load">${escapeHtml(m.loadLabel)}</span> · ` : ''}${escapeHtml(m.cue)}</div>
    </li>`;
  const section = (title, moves) => `
    <h4 class="wo-section">${title}</h4>
    <ul class="wo-list">${moves.map(moveItem).join('')}</ul>`;
  return `
    <div class="card workout-card today-sec" id="sec-workout">
      <details class="wo-details" id="woDetails" ${workoutUi.detailsOpen ? 'open' : ''}>
        <summary>
          <div class="wo-head">
            <h3 class="card-title">💪 ${escapeHtml(w.name)}</h3>
            <span class="wo-mins">${w.minutes} min</span>
            <span class="wo-toggle" aria-hidden="true"></span>
          </div>
          <div class="wo-line">${w.strength.map((m) => escapeHtml(m.short)).join(' · ')}</div>
          <div class="wo-line wo-walk-line">🚶 ${escapeHtml(walk.name)} · ${escapeHtml(walk.dose)}</div>
        </summary>
        ${w.notes.length ? `<ul class="wo-notes">${w.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join('')}</ul>` : ''}
        ${section('Warm-up · 1–2 min', w.warmup)}
        ${section('Strength', w.strength)}
        ${section('Stretch', w.mobility)}
        <p class="wo-guide">${escapeHtml(LOAD_GUIDE)}</p>
        <h4 class="wo-section">Walk</h4>
        <ul class="wo-list"><li>
          <div class="wo-move"><span class="wo-move-name">${escapeHtml(walk.name)}</span><span class="wo-dose">${escapeHtml(walk.dose)}</span></div>
          <div class="wo-cue">${escapeHtml(walk.cue)} ${escapeHtml(walk.tip)}</div>
        </li></ul>
        <p class="wo-guide">${escapeHtml(INTENSITY_LINE)}</p>
      </details>
      <div class="wo-foot">
        ${checkbox('woDone', 'Workout', log.movementDone)}
        ${checkbox('walkDone', 'Walk', log.walkDone)}
      </div>
      <details class="wo-stop" id="woStop" ${workoutUi.stopOpen ? 'open' : ''}>
        <summary><span>${escapeHtml(EFFORT_LINE)}</span> <span class="wo-stop-link">When to stop</span></summary>
        <p>Stop and call your OB or midwife if you notice:</p>
        <ul>${STOP_SIGNS.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
        <p>${escapeHtml(CHECK_WITH_OB)}</p>
      </details>
    </div>`;
}

function viewToday({ due, week, daysLeft, log }) {
  const content = getWeekContent(week);
  const shownWeek = browseWeek ?? week;
  const browseContent = getWeekContent(shownWeek);
  const countdown = dueCountdown(daysLeft);
  const glasses = Array.from({ length: HYDRATION_GOAL }, (_, i) =>
    `<div class="glass ${i < log.hydrationCount ? 'on' : ''}" aria-hidden="true"></div>`
  ).join('');

  const pills = Array.from({ length: 42 }, (_, i) => i + 1).map((w) => {
    const cls = [
      'week-pill',
      w === shownWeek ? 'active' : '',
      w === week ? 'current' : '',
    ].filter(Boolean).join(' ');
    return `<button type="button" class="${cls}" data-browse-week="${w}">${w}</button>`;
  }).join('');

  const prep = getPrepForWeek(week);
  const jumps = [
    content && ['sec-week', 'Week'],
    prep && ['sec-prep', 'Prep'],
    ['sec-water', 'Hydration'],
    ['sec-workout', 'Workout'],
    ['sec-browse', 'Browse'],
  ].filter(Boolean);

  return `
    <nav class="jump-row" aria-label="Jump to a card">
      ${jumps.map(([id, label]) => `<button type="button" class="jump" data-jump="${id}"><span>${label}</span></button>`).join('')}
    </nav>

    <div class="progress-row">
      <div class="stat"><div class="n">${escapeHtml(trimesterForWeek(week)?.label ?? '—')}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${escapeHtml(countdown.n)}</div><div class="l">${escapeHtml(countdown.l)}</div></div>
      <div class="stat"><div class="n">${escapeHtml(due ? formatMonthDay(due) : '—')}</div><div class="l">Due ${due ? due.slice(0, 4) : ''}</div></div>
    </div>

    ${weekCardHtml(content, { id: 'sec-week' })}

    ${(() => {
      if (!prep) return '';
      const thisItems = prep.thisWeek.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
      const aheadItems = prep.lookingAhead.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
      return `
    <div class="card prep-card today-sec" id="sec-prep">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${escapeHtml(prep.bandTitle)}</span>
      </div>
      <ul class="prep-list">${thisItems}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${aheadItems}</ul>
      </div>
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife’s plan.</p>
    </div>`;
    })()}

    <div class="card today-sec" id="sec-water">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
      </div>
      <div class="hydro">
        <div>
          <div class="hydro-count">${log.hydrationCount}</div>
          <div class="meta">of ${HYDRATION_GOAL} glasses today</div>
        </div>
        <div class="btn-row">
          <button class="btn-icon" id="hydroMinus" aria-label="Remove glass">−</button>
          <button class="btn btn-sage btn-sm" id="hydroPlus">+ Glass</button>
        </div>
      </div>
      <div class="hydro-glasses">${glasses}</div>
    </div>

    ${workoutCard(week, log)}

    <div class="card today-sec" id="sec-browse">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${browseWeek && browseWeek !== week ? '<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>' : ''}
      </div>
      <div class="week-browser">${pills}</div>
      ${browseWeek && browseWeek !== week ? weekCardHtml(browseContent, { compact: true }) : '<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `;
}

/**
 * Classify a cached calendar event relative to now (America/New_York days).
 * past = already ended; onToday = falls on today; isToday = "Today" tag; isTomorrow = day-before reminder.
 */
function eventTiming(ev, now, today, tomorrow) {
  if (ev.allDay) {
    const past = ev.end <= today; // all-day end date is exclusive
    return { past, onToday: !past && ev.start <= today, isToday: !past && ev.start <= today, isTomorrow: !past && ev.start === tomorrow };
  }
  const day = formatNYDate(new Date(ev.start));
  const past = Date.parse(ev.end || ev.start) < now;
  return { past, onToday: day === today, isToday: !past && day <= today, isTomorrow: !past && day === tomorrow };
}

function eventItemHtml(ev, t) {
  const when = ev.allDay
    ? `${formatDisplayDate(ev.start)} · All day`
    : formatDisplayDateTime(ev.start);
  return `
    <div class="list-item${t.past ? ' is-past' : ''}">
      <h4>${escapeHtml(ev.title)}${t.isToday ? ' <span class="chip chip-today">Today</span>' : ''}</h4>
      <div class="meta">${escapeHtml(when)}${ev.location ? ' · ' + escapeHtml(ev.location) : ''}</div>
      ${t.isTomorrow ? '<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>' : ''}
    </div>`;
}

function viewAppointments() {
  if (!calendar.isConfigured()) {
    return `
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="cal-lead">Calendar not set up yet</p>
        <p class="meta">Appointments will come from Google Calendar once it’s connected. ${escapeHtml(CAL_HELP)}</p>
      </div>`;
  }

  if (!calendar.isConnected()) {
    return `
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="meta" style="margin:0 0 12px">Show events from your Google Calendar here (read-only). ${escapeHtml(CAL_HELP)}</p>
        ${cal.error ? `<p class="err" style="margin:0 0 10px">${escapeHtml(cal.error)}</p>` : ''}
        <button class="btn btn-primary" id="calConnect" ${cal.loading ? 'disabled' : ''}>${cal.loading ? 'Connecting…' : 'Connect Google Calendar'}</button>
      </div>`;
  }

  const { events, fetchedAt } = calendar.getCache();
  const now = Date.now();
  const today = todayNY();
  const tomorrow = addDays(today, 1);
  const timed = events.map((ev) => ({ ev, t: eventTiming(ev, now, today, tomorrow) }));
  // Upcoming keeps all of today's events (earlier ones grayed); older ones go to the Past list
  const upcoming = timed.filter((x) => !x.t.past || x.t.onToday).sort((a, b) => (a.ev.start < b.ev.start ? -1 : 1));
  const past = timed.filter((x) => x.t.past && !x.t.onToday).sort((a, b) => (a.ev.start < b.ev.start ? 1 : -1)).slice(0, CALENDAR_PAST_LIMIT);

  let status;
  if (cal.loading) status = 'Updating…';
  else status = fetchedAt ? `Last updated ${formatDisplayDateTime(fetchedAt)}` : 'Not updated yet';

  return `
    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📅 Upcoming</h3>
        <button class="btn btn-ghost btn-sm" id="calRefresh" ${cal.loading ? 'disabled' : ''}>Refresh</button>
      </div>
      <p class="meta cal-status">${escapeHtml(status)}${cal.stale && !cal.loading ? ' · Tap Refresh to update' : ''}</p>
      ${cal.needsReconnect && !cal.loading ? `
        <div class="cal-alert">
          <p>Couldn’t refresh from Google Calendar${cal.error ? ` (${escapeHtml(cal.error)})` : ''}. Showing saved events.</p>
          <button class="btn btn-soft btn-sm" id="calReconnect">Reconnect</button>
        </div>` : cal.error && !cal.loading ? `<p class="err" style="margin:0 0 8px">${escapeHtml(cal.error)}</p>` : ''}
      ${upcoming.length
        ? upcoming.map((x) => eventItemHtml(x.ev, x.t)).join('')
        : `<div class="empty">No upcoming ${escapeHtml(CALENDAR_TAG)} events. ${escapeHtml(CAL_HELP)}</div>`}
      ${past.length ? `
        <details class="past-list" id="calPast" ${cal.pastOpen ? 'open' : ''}>
          <summary>Past (${past.length})</summary>
          ${past.map((x) => eventItemHtml(x.ev, x.t)).join('')}
        </details>` : ''}
    </div>
    ${upcoming.length ? `<p class="disclaimer">${escapeHtml(CAL_HELP)}</p>` : ''}`;
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
  notesUi.error = res.ok ? '' : res.offline ? 'You’re offline. Try again when you’re back online.' : res.error || 'Something went wrong';
  render();
  return res.ok;
}

function viewNotes() {
  if (!notesDoc.isConfigured()) {
    return `<div class="card"><div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      <div class="empty">Shared notes aren’t set up yet.</div></div>`;
  }
  const local = store.listNotes();
  const connected = notesDoc.isConnected();
  const { notes, fetchedAt, docId } = notesDoc.getCache();
  const readOnly = !connected || notesUi.offline || notesUi.needsAuth;
  const busy = Boolean(notesUi.busy);

  if (!connected) {
    return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      <p class="meta" style="margin:0 0 12px">Notes are kept in a Google Doc called “${escapeHtml(NOTES_DOC_TITLE)}” in your Google Drive, so both phones see the same list. Bump can only open docs it creates.</p>
      ${notesUi.error ? `<p class="err" style="margin:0 0 10px">${escapeHtml(notesUi.error)}</p>` : ''}
      <button class="btn btn-primary" id="notesConnect" ${notesUi.loading ? 'disabled' : ''}>${notesUi.loading ? 'Connecting…' : 'Connect shared notes'}</button>
      ${local.length ? `<p class="meta" style="margin:12px 0 0">${local.length} note${local.length === 1 ? ' is' : 's are'} saved only on this phone. After connecting, you can copy ${local.length === 1 ? 'it' : 'them'} to the shared doc.</p>` : ''}
    </div>
    ${notes.length ? notesListCard(notes, fetchedAt, docId, true) : ''}`;
  }

  let status = notesUi.loading ? 'Updating…' : fetchedAt ? `Last updated ${formatDisplayDateTime(fetchedAt)}` : 'Not updated yet';
  const lastAuthor = localStorage.getItem(NOTE_AUTHOR_KEY) || '';
  const authorOpt = (v, label) => `<option value="${v}" ${lastAuthor === v ? 'selected' : ''}>${label}</option>`;
  return `
    ${notesUi.offline || notesUi.needsAuth ? `
    <div class="cal-alert notes-alert">
      <p>${notesUi.offline ? 'You’re offline. Showing notes saved on this phone (read-only).' : 'Couldn’t reach the shared notes doc. Showing saved notes (read-only).'}</p>
      ${notesUi.needsAuth ? '<button class="btn btn-soft btn-sm" id="notesReconnect">Sign in again</button>' : ''}
    </div>` : ''}
    ${local.length && !readOnly ? `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Notes on this phone</h3></div>
      <p class="meta" style="margin:0 0 12px">${local.length} note${local.length === 1 ? ' is' : 's are'} saved only on this phone. Copy ${local.length === 1 ? 'it' : 'them'} to the shared doc once; after that, Bump uses only the shared doc.</p>
      <button class="btn btn-sage btn-sm" id="notesMigrate" ${busy ? 'disabled' : ''}>${notesUi.busy === 'copy' ? 'Copying…' : 'Copy my phone’s notes to the shared doc'}</button>
    </div>` : ''}
    <div class="card">
      <div class="card-head"><h3 class="card-title">New note</h3></div>
      <div class="field">
        <label class="label" for="noteBody">Note</label>
        <textarea class="textarea" id="noteBody" placeholder="Symptom, question, reminder…" ${readOnly ? 'disabled' : ''}></textarea>
      </div>
      <div class="field">
        <label class="label" for="noteAuthor">Who</label>
        <select class="select" id="noteAuthor" ${readOnly ? 'disabled' : ''}>
          ${authorOpt('', 'Not set')}${authorOpt('Vince', 'Vince')}${authorOpt('Chantal', 'Chantal')}
        </select>
      </div>
      ${notesUi.error ? `<p class="err" style="margin:0 0 10px">${escapeHtml(notesUi.error)}</p>` : ''}
      <button class="btn btn-primary" id="noteAdd" ${readOnly || busy ? 'disabled' : ''}>${notesUi.busy === 'add' ? 'Adding…' : 'Add note'}</button>
    </div>
    ${notesListCard(notes, fetchedAt, docId, readOnly, status)}`;
}

function notesListCard(notes, fetchedAt, docId, readOnly, status = '') {
  const items = notes.length
    ? notes.map((n, i) => `
        <div class="list-item">
          <div class="meta">${escapeHtml(n.dateLabel)}${n.author ? ' · ' + escapeHtml(n.author) : ''}</div>
          <p class="note-text">${escapeHtml(n.text)}</p>
          ${readOnly ? '' : `<button class="btn btn-ghost btn-sm note-del" data-i="${i}" ${notesUi.busy ? 'disabled' : ''}>Delete</button>`}
        </div>`).join('')
    : '<div class="empty">Symptoms, questions for the OB, grocery asks — shared here.</div>';
  return `
    <div class="card">
      <div class="card-head">
        <h3 class="card-title">Shared notes</h3>
        ${readOnly ? '' : `<button class="btn btn-ghost btn-sm" id="notesRefresh" ${notesUi.loading ? 'disabled' : ''}>Refresh</button>`}
      </div>
      ${status ? `<p class="meta cal-status">${escapeHtml(status)}</p>` : fetchedAt ? `<p class="meta cal-status">Saved copy from ${escapeHtml(formatDisplayDateTime(fetchedAt))}</p>` : ''}
      ${docId ? `<p class="notes-open"><a href="${escapeHtml(notesDoc.docUrl(docId))}" target="_blank" rel="noopener">Open in Google Docs ↗</a></p>` : ''}
      ${items}
    </div>`;
}

function viewSettings(s) {
  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        ${dateField('setDue', s.household.dueDate || '', 'Due date')}
      </div>
      <button class="btn btn-sage btn-sm" id="saveDue">Update due date</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Household PIN</h3></div>
      <form id="pinForm" novalidate>
        <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
        <div class="field">
          <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="setPin" placeholder="New PIN (at least 4 digits)" autocomplete="new-password" />
        </div>
        <button class="btn btn-soft btn-sm" type="submit">Change PIN</button>
      </form>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Backup</h3></div>
      <p class="meta" style="margin:0 0 12px">Save a copy of your due date and daily logs as a JSON file for safekeeping. Shared notes live in your Google Doc.</p>
      <button class="btn btn-primary btn-sm" id="doExport">Download a backup</button>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    ${calendar.isConfigured() ? googleSettingsCard() : ''}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`;
}

function googleSettingsCard() {
  const calOn = calendar.isConnected();
  const notesOn = notesDoc.isConnected();
  const docId = notesDoc.getDocId();
  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google account</h3></div>
      <p class="meta" style="margin:0 0 4px"><strong>Calendar:</strong> ${calOn ? `connected (read-only), showing events with ${escapeHtml(CALENDAR_TAG)} in the title` : 'not connected. Use Connect on the Appts tab.'}</p>
      <p class="meta" style="margin:0 0 12px"><strong>Shared notes:</strong> ${notesOn ? (docId ? `<a href="${escapeHtml(notesDoc.docUrl(docId))}" target="_blank" rel="noopener">${escapeHtml(NOTES_DOC_TITLE)} ↗</a>` : 'connected') : 'not connected. Use Connect on the Notes tab.'}</p>
      ${notesOn ? `
      <form id="docForm" novalidate>
        <label class="label" for="docInput">Use a different notes doc</label>
        <div class="field doc-field">
          <input class="input" id="docInput" placeholder="Paste a Google Docs link or ID" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-soft btn-sm" type="submit" ${notesUi.busy ? 'disabled' : ''}>${notesUi.busy === 'doc' ? 'Checking…' : 'Use doc'}</button>
        </div>
        ${notesUi.docError ? `<p class="err" style="margin:-8px 0 10px">${escapeHtml(notesUi.docError)}</p>` : ''}
        ${notesUi.docMsg ? `<p class="meta" style="margin:-8px 0 10px">${escapeHtml(notesUi.docMsg)}</p>` : ''}
        <p class="meta" style="margin:0 0 12px">Bump can only open docs it created itself (Google’s most limited Drive permission), such as a “${escapeHtml(NOTES_DOC_TITLE)}” doc made from the other phone.</p>
      </form>` : ''}
      ${calOn || notesOn ? '<button class="btn btn-ghost btn-sm" id="googleDisconnect">Disconnect Google</button>' : ''}
    </div>`;
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
    main.querySelector('#hydroPlus')?.addEventListener('click', () => { store.bumpHydration(1); render(); });
    main.querySelector('#hydroMinus')?.addEventListener('click', () => { store.bumpHydration(-1); render(); });
    main.querySelector('#woDone')?.addEventListener('change', (e) => {
      const week = pregnancyWeek(store.getState().household.dueDate);
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
      notesUi.draft = text;
      await notesAction('add', () => notesDoc.addNote({ text, author }), () => { notesUi.draft = ''; });
    });
    const bodyEl = main.querySelector('#noteBody');
    if (bodyEl && notesUi.draft) bodyEl.value = notesUi.draft; // keep the text if adding failed
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
