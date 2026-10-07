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
import { CALENDAR_TAG, CALENDAR_PAST_LIMIT } from './config.js';
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
    return;
  }
  renderApp(s);
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
              <input class="input" type="date" id="dueDate" />
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
      tab = btn.dataset.tab;
      render();
      // Opening Appts is a tap, so a token can be re-requested silently if needed
      if (tab === 'appointments' && calendar.isConnected()) syncCalendar({ interactive: true });
    };
  });
  if (calendar.isConfigured()) calendar.loadGis().catch(() => {}); // preload so sign-in opens from the tap

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

function weekCardHtml(content, { compact = false } = {}) {
  if (!content) return '';
  return `
    <article class="week-hero">
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
  const check = (id, label, done) => `
    <button class="wo-check ${done ? 'on' : ''}" id="${id}" aria-pressed="${done}" aria-label="${label} done">
      <span class="wo-box" aria-hidden="true">${done ? '✓' : ''}</span>${label}
    </button>`;
  return `
    <div class="card workout-card">
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
        ${check('woDone', 'Workout', Boolean(log.movementDone))}
        ${check('walkDone', 'Walk', Boolean(log.walkDone))}
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

  return `
    <div class="progress-row">
      <div class="stat"><div class="n">${escapeHtml(trimesterForWeek(week)?.label ?? '—')}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${escapeHtml(countdown.n)}</div><div class="l">${escapeHtml(countdown.l)}</div></div>
      <div class="stat"><div class="n">${escapeHtml(due ? formatMonthDay(due) : '—')}</div><div class="l">Due ${due ? due.slice(0, 4) : ''}</div></div>
    </div>

    ${weekCardHtml(content)}

    ${(() => {
      const prep = getPrepForWeek(week);
      if (!prep) return '';
      const thisItems = prep.thisWeek.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
      const aheadItems = prep.lookingAhead.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
      return `
    <div class="card prep-card">
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

    <div class="card">
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

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🌙 Evening wind-down</h3>
      </div>
      <div class="toggle-row">
        <div>
          <div style="font-weight:650">Done for tonight?</div>
          <div class="meta">Dim lights, stretch, phone away</div>
        </div>
        <button class="toggle ${log.windDown ? 'on' : ''}" id="windToggle" role="switch" aria-checked="${log.windDown}" aria-label="Wind-down done"></button>
      </div>
    </div>

    ${workoutCard(week, log)}

    <div class="card">
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

function viewNotes() {
  const notes = store.listNotes();
  const items = notes.length
    ? notes.map((n) => `
        <div class="list-item">
          <div class="meta">${escapeHtml(formatDisplayDateTime(n.createdAt))}${n.author ? ' · ' + escapeHtml(n.author) : ''}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${escapeHtml(n.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${n.id}">Delete</button>
        </div>`).join('')
    : '<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>';

  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">New note</h3></div>
      <div class="field">
        <label class="label" for="noteBody">Note</label>
        <textarea class="textarea" id="noteBody" placeholder="Symptom, question, reminder…"></textarea>
      </div>
      <div class="field">
        <label class="label" for="noteAuthor">Who (optional)</label>
        <select class="select" id="noteAuthor">
          <option value="">Not set</option>
          <option value="Vince">Vince</option>
          <option value="Chantal">Chantal</option>
        </select>
      </div>
      <button class="btn btn-primary" id="noteAdd">Add note</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      ${items}
    </div>`;
}

function viewSettings(s) {
  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${escapeHtml(s.household.dueDate || '')}" />
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
      <p class="meta" style="margin:0 0 12px">Save a copy of your due date, daily logs, and notes as a JSON file for safekeeping.</p>
      <button class="btn btn-primary btn-sm" id="doExport">Download a backup</button>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    ${calendar.isConfigured() ? `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google Calendar</h3></div>
      ${calendar.isConnected() ? `
      <p class="meta" style="margin:0 0 12px">Connected (read-only). Bump shows only events with ${escapeHtml(CALENDAR_TAG)} in the title.</p>
      <button class="btn btn-ghost btn-sm" id="calDisconnect">Disconnect</button>` : `
      <p class="meta" style="margin:0">Not connected. Use <strong>Connect Google Calendar</strong> on the Appts tab.</p>`}
    </div>` : ''}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`;
}

function bindView(main) {
  if (tab === 'today') {
    main.querySelector('#hydroPlus')?.addEventListener('click', () => { store.bumpHydration(1); render(); });
    main.querySelector('#hydroMinus')?.addEventListener('click', () => { store.bumpHydration(-1); render(); });
    main.querySelector('#windToggle')?.addEventListener('click', () => {
      store.setWindDown(!store.getTodayLog().windDown);
      render();
    });
    main.querySelector('#woDone')?.addEventListener('click', () => {
      const today = todayNY();
      const log = store.getTodayLog();
      store.setWorkoutDone(!log.movementDone, workoutFor(today, pregnancyWeek(store.getState().household.dueDate)).id);
      render();
    });
    main.querySelector('#walkDone')?.addEventListener('click', () => {
      store.setWalkDone(!store.getTodayLog().walkDone);
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
    main.querySelector('#noteAdd')?.addEventListener('click', () => {
      const body = main.querySelector('#noteBody').value.trim();
      if (!body) return;
      store.addNote({ body, author: main.querySelector('#noteAuthor').value });
      render();
    });
    main.querySelectorAll('.note-del').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this note?')) {
          store.deleteNote(btn.dataset.id);
          render();
        }
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
    main.querySelector('#calDisconnect')?.addEventListener('click', async () => {
      if (!confirm('Disconnect Google Calendar? Saved events will be removed from this phone.')) return;
      await calendar.disconnect();
      Object.assign(cal, { loading: false, error: '', needsReconnect: false, stale: false });
      render();
    });
    main.querySelector('#doReset')?.addEventListener('click', async () => {
      if (confirm('Erase all Bump data on this device?')) {
        await calendar.disconnect();
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
// and refresh calendar events on the Appts tab (using a still-valid token only).
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (!store.isSetup() || !store.isUnlocked()) return;
  if (renderedAppDate && renderedAppDate !== todayNY()) render();
  if (tab === 'appointments') syncCalendar({ interactive: false });
});

render();
