/**
 * Pure rendering functions extracted from main.js for testability.
 * These functions generate HTML strings from data without side effects.
 */
import { getWeekContent } from '../data/weeks.js';
import { getPrepForWeek } from '../data/prep.js';
import {
  workoutFor,
  walkFor,
  LOAD_GUIDE,
  EFFORT_LINE,
  INTENSITY_LINE,
  STOP_SIGNS,
  CHECK_WITH_OB,
} from '../data/workouts.js';
import { CALENDAR_TAG, CALENDAR_PAST_LIMIT, NOTES_DOC_TITLE, PREP_CHECKLIST_URL } from '../config.js';
import {
  todayNY,
  pregnancyWeek,
  trimesterForWeek,
  formatDisplayDate,
  formatDisplayDateTime,
  formatMonthDay,
  formatNYDate,
  addDays,
} from '../utils/dates.js';
import { escapeHtml, formatLongDate, dueCountdown } from '../utils/helpers.js';

export const PIN_RULE = /^\d{4,}$/;
export const PIN_ERROR = 'PIN should be at least 4 digits (numbers only)';

export function getCalHelp() {
  return `Add ${CALENDAR_TAG} to an event title in your Google Calendar to show it here.`;
}

/**
 * Date field HTML: a styled display with hidden native date picker.
 */
export function dateField(id, value, ariaLabel = '') {
  return `
    <div class="date-field">
      <span class="date-display ${value ? '' : 'is-empty'}" aria-hidden="true">${escapeHtml(formatLongDate(value) || 'Choose a date')}</span>
      <svg class="date-ico" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <input class="date-input" type="date" id="${id}" value="${escapeHtml(value || '')}" ${ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : ''} />
    </div>`;
}

/**
 * Checkbox HTML component.
 */
export function checkbox(id, label, checked) {
  return `
    <label class="check" for="${id}">
      <input type="checkbox" class="check-box" id="${id}" ${checked ? 'checked' : ''} />
      <span>${escapeHtml(label)}</span>
    </label>`;
}

/**
 * Week card HTML for pregnancy week content.
 */
export function weekCardHtml(content, { compact = false, id = '' } = {}) {
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
        <h3>This week's tip</h3>
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

/**
 * Workout card HTML.
 */
export function workoutCard(week, log, workoutUi) {
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

/**
 * Classify a cached calendar event relative to now.
 */
export function eventTiming(ev, now, today, tomorrow) {
  if (ev.allDay) {
    const past = ev.end <= today;
    return { past, onToday: !past && ev.start <= today, isToday: !past && ev.start <= today, isTomorrow: !past && ev.start === tomorrow };
  }
  const day = formatNYDate(new Date(ev.start));
  const past = Date.parse(ev.end || ev.start) < now;
  return { past, onToday: day === today, isToday: !past && day <= today, isTomorrow: !past && day === tomorrow };
}

/**
 * Event item HTML.
 */
export function eventItemHtml(ev, t) {
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

/**
 * Render the invite gate screen.
 */
export function renderInviteGate() {
  return `
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
          <p class="hint">Ask Vince for an invite if you don't have one.</p>
        </div>
        <p class="err hidden" id="gateErr"></p>
        <button class="btn btn-primary" id="doInvite">Continue</button>
      </div>
    </div>`;
}

/**
 * Render the setup screen.
 */
export function renderSetupGate() {
  return `
    <div class="gate">
      <div class="gate-card">
        <div class="brand">
          <div class="brand-mark">🌱</div>
          <h1>Bump</h1>
          <p>Vince &amp; Chantal's shared pregnancy tracker</p>
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
            <p class="hint">You'll use this PIN to unlock Bump. Your data stays on this phone.</p>
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
}

/**
 * Render the unlock screen.
 */
export function renderUnlockGate() {
  return `
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
}

/**
 * Render the Today view.
 */
export function viewToday({ due, week, daysLeft, log, browseWeek, workoutUi, waterGoal }) {
  const content = getWeekContent(week);
  const shownWeek = browseWeek ?? week;
  const browseContent = getWeekContent(shownWeek);
  const countdown = dueCountdown(daysLeft);
  const waterOz = log.hydrationOz || 0;
  const waterPct = Math.min(100, Math.round((waterOz / waterGoal) * 100));
  const waterLeft = waterGoal - waterOz;

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
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife's plan.</p>
      <a class="prep-link" href="${escapeHtml(PREP_CHECKLIST_URL)}" target="_blank" rel="noopener noreferrer">See full checklist</a>
    </div>`;
    })()}

    <div class="card today-sec" id="sec-water">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
      </div>
      <div class="hydro">
        <div class="hydro-amt"><span class="hydro-count">${waterOz}</span><span class="hydro-of"> / ${waterGoal} oz</span></div>
        <div class="hydro-left meta">${waterLeft > 0 ? `${waterLeft} oz to go` : 'Goal reached 🎉'}</div>
      </div>
      <div class="hydro-bar${waterLeft > 0 ? '' : ' done'}" role="progressbar" aria-label="Water today" aria-valuemin="0" aria-valuemax="${waterGoal}" aria-valuenow="${Math.min(waterOz, waterGoal)}" aria-valuetext="${waterOz} of ${waterGoal} fluid ounces"><span style="width:${waterPct}%"></span></div>
      <div class="hydro-btns">
        <button class="btn btn-ghost btn-sm" id="hydroMinus" aria-label="Undo 8 ounces" ${waterOz ? '' : 'disabled'}>−8 oz</button>
        <button class="btn btn-sage btn-sm" id="hydroPlus" aria-label="Add 8 ounces">+8 oz</button>
        <button class="btn btn-sage btn-sm" id="hydroPlus16" aria-label="Add 16 ounces">+16 oz</button>
      </div>
    </div>

    ${workoutCard(week, log, workoutUi)}

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
 * Render appointments view.
 */
export function viewAppointments({ isConfigured, isConnected, cache, cal }) {
  const CAL_HELP = getCalHelp();
  
  if (!isConfigured) {
    return `
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="cal-lead">Calendar not set up yet</p>
        <p class="meta">Appointments will come from Google Calendar once it's connected. ${escapeHtml(CAL_HELP)}</p>
      </div>`;
  }

  if (!isConnected) {
    return `
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="meta" style="margin:0 0 12px">Show events from your Google Calendar here (read-only). ${escapeHtml(CAL_HELP)}</p>
        ${cal.error ? `<p class="err" style="margin:0 0 10px">${escapeHtml(cal.error)}</p>` : ''}
        <button class="btn btn-primary" id="calConnect" ${cal.loading ? 'disabled' : ''}>${cal.loading ? 'Connecting…' : 'Connect Google Calendar'}</button>
      </div>`;
  }

  const { events, fetchedAt } = cache;
  const now = Date.now();
  const today = todayNY();
  const tomorrow = addDays(today, 1);
  const timed = events.map((ev) => ({ ev, t: eventTiming(ev, now, today, tomorrow) }));
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
          <p>Couldn't refresh from Google Calendar${cal.error ? ` (${escapeHtml(cal.error)})` : ''}. Showing saved events.</p>
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

/**
 * Notes list card HTML.
 */
export function notesListCard(notes, fetchedAt, docId, readOnly, status = '', notesUi = {}, docUrl = '') {
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
      ${docId ? `<p class="notes-open"><a href="${escapeHtml(docUrl)}" target="_blank" rel="noopener">Open in Google Docs ↗</a></p>` : ''}
      ${items}
    </div>`;
}

/**
 * Render notes view.
 */
export function viewNotes({ isConfigured, isConnected, cache, notesUi, local, draft, docUrl }) {
  if (!isConfigured) {
    return `<div class="card"><div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      <div class="empty">Shared notes aren't set up yet.</div></div>`;
  }
  
  const { notes, fetchedAt, docId } = cache;
  const readOnly = !isConnected || notesUi.offline || notesUi.needsAuth;
  const busy = Boolean(notesUi.busy);

  if (!isConnected) {
    return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      <p class="meta" style="margin:0 0 12px">Notes are kept in a Google Doc called "${escapeHtml(NOTES_DOC_TITLE)}" in your Google Drive, so both phones see the same list. Bump can only open docs it creates.</p>
      ${notesUi.error ? `<p class="err" style="margin:0 0 10px">${escapeHtml(notesUi.error)}</p>` : ''}
      ${draft ? '<p class="meta" style="margin:0 0 10px">Your unsent note is kept on this phone and will be waiting after you connect.</p>' : ''}
      <button class="btn btn-primary" id="notesConnect" ${notesUi.loading ? 'disabled' : ''}>${notesUi.loading ? 'Connecting…' : 'Connect shared notes'}</button>
      ${local.length ? `<p class="meta" style="margin:12px 0 0">${local.length} note${local.length === 1 ? ' is' : 's are'} saved only on this phone. After connecting, you can copy ${local.length === 1 ? 'it' : 'them'} to the shared doc.</p>` : ''}
    </div>
    ${notes.length ? notesListCard(notes, fetchedAt, docId, true, '', notesUi, docUrl) : ''}`;
  }

  let status = notesUi.loading ? 'Updating…' : fetchedAt ? `Last updated ${formatDisplayDateTime(fetchedAt)}` : 'Not updated yet';
  const lastAuthor = '';
  const authorOpt = (v, label) => `<option value="${v}" ${lastAuthor === v ? 'selected' : ''}>${label}</option>`;
  return `
    ${notesUi.offline || notesUi.needsAuth ? `
    <div class="cal-alert notes-alert">
      <p>${notesUi.offline ? "You're offline. Showing notes saved on this phone (read-only)." : "Couldn't reach the shared notes doc. Showing saved notes (read-only)."}</p>
      ${notesUi.needsAuth ? '<button class="btn btn-soft btn-sm" id="notesReconnect">Sign in again</button>' : ''}
    </div>` : ''}
    ${local.length && !readOnly ? `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Notes on this phone</h3></div>
      <p class="meta" style="margin:0 0 12px">${local.length} note${local.length === 1 ? ' is' : 's are'} saved only on this phone. Copy ${local.length === 1 ? 'it' : 'them'} to the shared doc once; after that, Bump uses only the shared doc.</p>
      <button class="btn btn-sage btn-sm" id="notesMigrate" ${busy ? 'disabled' : ''}>${notesUi.busy === 'copy' ? 'Copying…' : "Copy my phone's notes to the shared doc"}</button>
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
    ${notesListCard(notes, fetchedAt, docId, readOnly, status, notesUi, docUrl)}`;
}

/**
 * Render settings view.
 */
export function viewSettings({ household, waterGoal, waterGoalMin, waterGoalMax, calendarConfigured, calendarConnected, notesConnected, notesDocId, notesDocUrl, notesUi }) {
  const calOn = calendarConnected;
  const notesOn = notesConnected;
  const docId = notesDocId;

  const googleSettingsCard = () => {
    if (!calendarConfigured) return '';
    return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google account</h3></div>
      <p class="meta" style="margin:0 0 4px"><strong>Calendar:</strong> ${calOn ? `connected (read-only), showing events with ${escapeHtml(CALENDAR_TAG)} in the title` : 'not connected. Use Connect on the Appts tab.'}</p>
      <p class="meta" style="margin:0 0 12px"><strong>Shared notes:</strong> ${notesOn ? (docId ? `<a href="${escapeHtml(notesDocUrl)}" target="_blank" rel="noopener">${escapeHtml(NOTES_DOC_TITLE)} ↗</a>` : 'connected') : 'not connected. Use Connect on the Notes tab.'}</p>
      ${notesOn ? `
      <form id="docForm" novalidate>
        <label class="label" for="docInput">Use a different notes doc</label>
        <div class="field doc-field">
          <input class="input" id="docInput" placeholder="Paste a Google Docs link or ID" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-soft btn-sm" type="submit" ${notesUi?.busy ? 'disabled' : ''}>${notesUi?.busy === 'doc' ? 'Checking…' : 'Use doc'}</button>
        </div>
        ${notesUi?.docError ? `<p class="err" style="margin:-8px 0 10px">${escapeHtml(notesUi.docError)}</p>` : ''}
        ${notesUi?.docMsg ? `<p class="meta" style="margin:-8px 0 10px">${escapeHtml(notesUi.docMsg)}</p>` : ''}
        <p class="meta" style="margin:0 0 12px">Bump can only open docs it created itself (Google's most limited Drive permission), such as a "${escapeHtml(NOTES_DOC_TITLE)}" doc made from the other phone.</p>
      </form>` : ''}
      ${calOn || notesOn ? '<button class="btn btn-ghost btn-sm" id="googleDisconnect">Disconnect Google</button>' : ''}
    </div>`;
  };

  return `
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        ${dateField('setDue', household.dueDate || '', 'Due date')}
      </div>
      <button class="btn btn-sage btn-sm" id="saveDue">Update due date</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Daily water goal</h3></div>
      <form id="waterGoalForm" novalidate>
        <div class="field goal-field">
          <input class="input" type="number" inputmode="numeric" pattern="[0-9]*" id="setWaterGoal" min="${waterGoalMin}" max="${waterGoalMax}" step="1" value="${waterGoal}" aria-label="Daily water goal in fluid ounces" />
          <span class="goal-unit">fl oz</span>
        </div>
        <p class="hint" style="margin:-6px 0 12px">ACOG suggests 8–12 cups (64–96 fl oz) of water a day during pregnancy. 1 cup = 8 fl oz.</p>
        <button class="btn btn-sage btn-sm" type="submit">Save goal</button>
      </form>
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
    ${googleSettingsCard()}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`;
}

/**
 * Render the main app shell.
 */
export function renderAppShell(today, activeTab) {
  return `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${escapeHtml(formatDisplayDate(today))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${activeTab === 'today' ? 'active' : ''}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${activeTab === 'appointments' ? 'active' : ''}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${activeTab === 'notes' ? 'active' : ''}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${activeTab === 'settings' ? 'active' : ''}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`;
}
