import './style.css';
import * as store from './store.js';
import { isInviteOk, tryInvite } from './invite.js';
import { getWeekContent } from './data/weeks.js';
import { getPrepForWeek } from './data/prep.js';
import { randomSuggestion } from './data/movements.js';
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
let gateMode = 'auto'; // auto | invite | unlock | setup | import
let renderedAppDate = null; // date the unlocked app was last drawn for (midnight refresh)
const PIN_RULE = /^\d{4,}$/;
const PIN_ERROR = 'PIN should be at least 4 digits (numbers only)';
const IMPORT_CONFIRM = 'This replaces all Bump data on this phone (due date, PIN, logs, appointments, and notes) with the backup. Continue?';

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

  if (gateMode === 'import') {
    app.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Import backup</h1>
            <p>Paste a Bump JSON export from the other phone</p>
          </div>
          <form id="importForm" autocomplete="off">
            <div class="field">
              <label class="label" for="importText">Export JSON</label>
              <textarea class="textarea" id="importText" placeholder='{ "app": "bump-tracker", ... }'></textarea>
            </div>
            ${setup ? `
            <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
            <div class="field">
              <label class="label" for="importPin">Current PIN on this phone</label>
              <input class="input" type="password" inputmode="numeric" id="importPin" autocomplete="current-password" />
              <p class="hint">This phone already has Bump data. Importing replaces it.</p>
            </div>` : ''}
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Import &amp; unlock</button>
          </form>
          <button class="linkish" id="backGate">Back</button>
        </div>
      </div>`;
    app.querySelector('#importForm').onsubmit = (e) => {
      e.preventDefault();
      const err = app.querySelector('#gateErr');
      const showErr = (msg) => { err.textContent = msg; err.classList.remove('hidden'); };
      const text = app.querySelector('#importText').value;
      if (!text.trim()) return showErr('Paste the backup JSON first');
      if (setup) {
        if (!store.verifyPin(app.querySelector('#importPin').value)) return showErr('Incorrect PIN');
        if (!confirm(IMPORT_CONFIRM)) return;
      }
      try {
        store.importJSON(text);
        gateMode = 'auto';
        render();
      } catch (ex) {
        showErr(ex.message || 'Could not import');
      }
    };
    app.querySelector('#backGate').onclick = () => {
      gateMode = setup ? 'unlock' : 'setup';
      render();
    };
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
              <p class="hint">Same PIN on both phones. Data stays on this phone until you export/import.</p>
            </div>
            <div class="field">
              <label class="label" for="pin2">Confirm PIN</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin2" autocomplete="new-password" />
            </div>
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Create household</button>
          </form>
          <button class="linkish" id="toImport">Have a backup JSON? Import instead</button>
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
    app.querySelector('#toImport').onclick = () => { gateMode = 'import'; render(); };
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
        <button class="linkish" id="toImport">Import backup from other phone</button>
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
  app.querySelector('#toImport').onclick = () => { gateMode = 'import'; render(); };
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
    btn.onclick = () => { tab = btn.dataset.tab; render(); };
  });

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

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🚶 Daily movement</h3>
      </div>
      <div class="movement-type">${escapeHtml(log.movementType || '')}</div>
      <div class="movement-title">${escapeHtml(log.movementSuggestion || '')}</div>
      <p class="movement-detail">${escapeHtml(log.movementDetail || '')}</p>
      <div class="btn-row">
        <button class="btn ${log.movementDone ? 'btn-sage' : 'btn-soft'} btn-sm" id="moveDone">
          ${log.movementDone ? '✓ Done' : 'Mark done'}
        </button>
        <button class="btn btn-ghost btn-sm" id="moveRegen">Another idea</button>
      </div>
      <p class="disclaimer">Gentle suggestions only — not a workout plan. Skip anything that doesn’t feel right; check with your care team if unsure.</p>
    </div>

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

function viewAppointments() {
  const list = store.listAppointments();
  const now = Date.now();
  const today = todayNY();
  const tomorrow = addDays(today, 1);

  const items = list.length
    ? list.map((a) => {
        const start = new Date(a.startsAt);
        const day = formatNYDate(start);
        const past = start.getTime() < now;
        const isToday = !past && day === today;
        const isTomorrow = !past && day === tomorrow;
        return `
          <div class="list-item${past ? ' is-past' : ''}" data-appt="${a.id}">
            <h4>${escapeHtml(a.title)}${isToday ? ' <span class="chip chip-today">Today</span>' : ''}</h4>
            <div class="meta">${escapeHtml(formatDisplayDateTime(a.startsAt))}${a.location ? ' · ' + escapeHtml(a.location) : ''}</div>
            ${a.notes ? `<div class="meta" style="margin-top:4px">${escapeHtml(a.notes)}</div>` : ''}
            ${isTomorrow ? '<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>' : ''}
            <div class="btn-row" style="margin-top:8px">
              <button class="btn btn-ghost btn-sm appt-del" data-id="${a.id}">Remove</button>
            </div>
          </div>`;
      }).join('')
    : '<div class="empty">No appointments yet. Add OB visits, paperwork deadlines, or classes.</div>';

  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Add appointment</h3></div>
      <div class="field">
        <label class="label" for="apptTitle">Title</label>
        <input class="input" id="apptTitle" placeholder="OB checkup, anatomy scan…" />
      </div>
      <div class="field">
        <label class="label" for="apptWhen">Date &amp; time</label>
        <input class="input" type="datetime-local" id="apptWhen" />
      </div>
      <div class="field">
        <label class="label" for="apptLoc">Location (optional)</label>
        <input class="input" id="apptLoc" placeholder="Clinic name" />
      </div>
      <div class="field">
        <label class="label" for="apptNotes">Notes / paperwork</label>
        <input class="input" id="apptNotes" placeholder="Insurance card, questions…" />
      </div>
      <button class="btn btn-primary" id="apptAdd">Save appointment</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Upcoming &amp; past</h3></div>
      ${items}
    </div>`;
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
      <div class="card-head"><h3 class="card-title">Move data between phones</h3></div>
      <p class="meta" style="margin:0 0 12px">Your data stays on this phone. To copy it to the other phone, export it here and import it there.</p>
      <div class="btn-row btn-row-even">
        <button class="btn btn-primary btn-sm" id="doExport">Export JSON</button>
        <button class="btn btn-ghost btn-sm" id="doImportFile">Import file</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" class="hidden" />
      <form id="importConfirm" class="import-confirm hidden">
        <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
        <p class="meta" style="margin:0 0 8px" id="importFileName"></p>
        <div class="field">
          <label class="label" for="importPin">Current PIN to replace this phone’s data</label>
          <input class="input" type="password" inputmode="numeric" id="importPin" autocomplete="current-password" />
        </div>
        <p class="err hidden" id="importErr"></p>
        <div class="btn-row btn-row-even">
          <button class="btn btn-danger btn-sm" type="submit">Replace data</button>
          <button class="btn btn-ghost btn-sm" type="button" id="importCancel">Cancel</button>
        </div>
      </form>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
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
    main.querySelector('#moveDone')?.addEventListener('click', () => {
      const log = store.getTodayLog();
      store.setMovementDone(!log.movementDone);
      render();
    });
    main.querySelector('#moveRegen')?.addEventListener('click', () => {
      const log = store.getTodayLog();
      store.setMovementSuggestion(randomSuggestion(log.movementSuggestion));
      render();
    });
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
    main.querySelector('#apptAdd')?.addEventListener('click', () => {
      const title = main.querySelector('#apptTitle').value.trim();
      const when = main.querySelector('#apptWhen').value;
      if (!title || !when) return alert('Title and date/time are required');
      store.addAppointment({
        title,
        startsAt: new Date(when).toISOString(),
        location: main.querySelector('#apptLoc').value,
        notes: main.querySelector('#apptNotes').value,
      });
      render();
    });
    main.querySelectorAll('.appt-del').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('Remove this appointment?')) {
          store.deleteAppointment(btn.dataset.id);
          render();
        }
      });
    });
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
      a.download = `bump-export-${todayNY()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
    main.querySelector('#doImportFile')?.addEventListener('click', () => {
      main.querySelector('#importFile').click();
    });
    let pendingImport = null;
    const confirmForm = main.querySelector('#importConfirm');
    const doImport = (text) => {
      try {
        store.importJSON(text);
        alert('Import successful');
        render();
      } catch (err) {
        alert(err.message || 'Import failed');
      }
    };
    main.querySelector('#importFile')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      const text = await file.text();
      if (!store.isSetup()) return doImport(text);
      // Existing household: require the current PIN + confirmation before overwriting
      pendingImport = text;
      main.querySelector('#importFileName').textContent = `Selected: ${file.name}`;
      main.querySelector('#importErr').classList.add('hidden');
      confirmForm.classList.remove('hidden');
      main.querySelector('#importPin').focus();
    });
    confirmForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = main.querySelector('#importErr');
      if (!pendingImport) return;
      if (!store.verifyPin(main.querySelector('#importPin').value)) {
        err.textContent = 'Incorrect PIN';
        err.classList.remove('hidden');
        return;
      }
      if (!confirm(IMPORT_CONFIRM)) return;
      doImport(pendingImport);
    });
    main.querySelector('#importCancel')?.addEventListener('click', () => {
      pendingImport = null;
      confirmForm.classList.add('hidden');
    });
    main.querySelector('#doLock')?.addEventListener('click', () => {
      store.lock();
      gateMode = 'unlock';
      render();
    });
    main.querySelector('#doReset')?.addEventListener('click', () => {
      if (confirm('Erase all Bump data on this device?')) {
        store.resetAll();
        gateMode = 'setup';
        tab = 'today';
        browseWeek = null;
        render();
      }
    });
  }
}

// Redraw when the app comes back into view on a new day (e.g., left open past midnight)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (renderedAppDate && renderedAppDate !== todayNY() && store.isSetup() && store.isUnlocked()) {
    render();
  }
});

render();
