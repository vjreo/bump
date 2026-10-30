import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  PIN_RULE,
  PIN_ERROR,
  getCalHelp,
  dateField,
  checkbox,
  weekCardHtml,
  workoutCard,
  eventTiming,
  eventItemHtml,
  renderInviteGate,
  renderSetupGate,
  renderUnlockGate,
  viewToday,
  viewAppointments,
  notesListCard,
  viewNotes,
  viewSettings,
  renderAppShell,
} from './render.js';

describe('UI render functions', () => {
  describe('PIN_RULE', () => {
    it('matches 4+ digit PINs', () => {
      expect(PIN_RULE.test('1234')).toBe(true);
      expect(PIN_RULE.test('12345678')).toBe(true);
    });

    it('rejects short PINs', () => {
      expect(PIN_RULE.test('123')).toBe(false);
      expect(PIN_RULE.test('1')).toBe(false);
    });

    it('rejects non-numeric PINs', () => {
      expect(PIN_RULE.test('abcd')).toBe(false);
      expect(PIN_RULE.test('12ab')).toBe(false);
    });
  });

  describe('PIN_ERROR', () => {
    it('contains expected message', () => {
      expect(PIN_ERROR).toContain('at least 4 digits');
    });
  });

  describe('getCalHelp', () => {
    it('returns help text with [Bump] tag', () => {
      const help = getCalHelp();
      expect(help).toContain('[Bump]');
      expect(help).toContain('Google Calendar');
    });
  });

  describe('dateField', () => {
    it('renders date input with id', () => {
      const html = dateField('testDate', '');
      expect(html).toContain('id="testDate"');
      expect(html).toContain('type="date"');
    });

    it('shows "Choose a date" for empty value', () => {
      const html = dateField('testDate', '');
      expect(html).toContain('Choose a date');
      expect(html).toContain('is-empty');
    });

    it('formats date value', () => {
      const html = dateField('testDate', '2027-05-15');
      expect(html).toContain('May 15, 2027');
      expect(html).not.toContain('is-empty');
    });

    it('includes aria-label when provided', () => {
      const html = dateField('testDate', '', 'Select date');
      expect(html).toContain('aria-label="Select date"');
    });

    it('escapes HTML in value parameter', () => {
      const html = dateField('testDate', '<script>');
      expect(html).toContain('value="&lt;script&gt;"');
    });
  });

  describe('checkbox', () => {
    it('renders unchecked checkbox', () => {
      const html = checkbox('testCheck', 'Test Label', false);
      expect(html).toContain('id="testCheck"');
      expect(html).toContain('Test Label');
      expect(html).not.toContain('checked');
    });

    it('renders checked checkbox', () => {
      const html = checkbox('testCheck', 'Test Label', true);
      expect(html).toContain('checked');
    });

    it('escapes label HTML', () => {
      const html = checkbox('test', '<script>alert(1)</script>', false);
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('weekCardHtml', () => {
    const mockContent = {
      week: 20,
      title: 'Halfway mark',
      size: 'a banana',
      baby: 'Baby is developing.',
      feel: 'You may feel tired.',
      tip: 'Rest when needed.',
      nhsUrl: 'https://nhs.uk/week-20',
      nhsWeek: 20,
    };

    it('returns empty string for null content', () => {
      expect(weekCardHtml(null)).toBe('');
      expect(weekCardHtml(undefined)).toBe('');
    });

    it('renders week number', () => {
      const html = weekCardHtml(mockContent);
      expect(html).toContain('Week 20');
    });

    it('renders title and size', () => {
      const html = weekCardHtml(mockContent);
      expect(html).toContain('Halfway mark');
      expect(html).toContain('a banana');
    });

    it('renders baby and feel sections', () => {
      const html = weekCardHtml(mockContent);
      expect(html).toContain('Your baby');
      expect(html).toContain('Baby is developing.');
      expect(html).toContain('How you may feel');
    });

    it('includes NHS attribution link', () => {
      const html = weekCardHtml(mockContent);
      expect(html).toContain('href="https://nhs.uk/week-20"');
      expect(html).toContain('NHS Best Start');
    });

    it('adds id when provided', () => {
      const html = weekCardHtml(mockContent, { id: 'sec-week' });
      expect(html).toContain('id="sec-week"');
      expect(html).toContain('today-sec');
    });

    it('omits OB advice in compact mode', () => {
      const fullHtml = weekCardHtml(mockContent, { compact: false });
      const compactHtml = weekCardHtml(mockContent, { compact: true });
      expect(fullHtml).toContain('Talk to your midwife');
      expect(compactHtml).not.toContain('Talk to your midwife');
    });

    it('shows closest NHS page note when weeks differ', () => {
      const content = { ...mockContent, nhsWeek: 19 };
      const html = weekCardHtml(content);
      expect(html).toContain('closest NHS page: Week 19');
    });
  });

  describe('workoutCard', () => {
    const mockLog = { movementDone: false, walkDone: true, hydrationOz: 40 };
    const workoutUi = { detailsOpen: false, stopOpen: false };

    it('renders workout card with title', () => {
      const html = workoutCard(20, mockLog, workoutUi);
      expect(html).toContain('card-title');
      expect(html).toContain('💪');
    });

    it('includes checkboxes for workout and walk', () => {
      const html = workoutCard(20, mockLog, workoutUi);
      expect(html).toContain('id="woDone"');
      expect(html).toContain('id="walkDone"');
    });

    it('reflects movementDone state in checkbox', () => {
      const logDone = { ...mockLog, movementDone: true };
      const html = workoutCard(20, logDone, workoutUi);
      expect(html).toMatch(/id="woDone"[^>]*checked/);
    });

    it('includes safety stop signs section', () => {
      const html = workoutCard(20, mockLog, workoutUi);
      expect(html).toContain('When to stop');
      expect(html).toContain('Vaginal bleeding');
    });

    it('includes warmup, strength, and mobility sections', () => {
      const html = workoutCard(20, mockLog, workoutUi);
      expect(html).toContain('Warm-up');
      expect(html).toContain('Strength');
      expect(html).toContain('Stretch');
    });

    it('respects detailsOpen state', () => {
      const openUi = { detailsOpen: true, stopOpen: false };
      const html = workoutCard(20, mockLog, openUi);
      expect(html).toContain('id="woDetails" open');
    });
  });

  describe('eventTiming', () => {
    const now = new Date('2026-05-15T14:00:00').getTime();
    const today = '2026-05-15';
    const tomorrow = '2026-05-16';

    it('marks all-day event in past', () => {
      const ev = { allDay: true, start: '2026-05-14', end: '2026-05-15' };
      const t = eventTiming(ev, now, today, tomorrow);
      expect(t.past).toBe(true);
      expect(t.onToday).toBe(false);
    });

    it('marks all-day event on today', () => {
      const ev = { allDay: true, start: '2026-05-15', end: '2026-05-16' };
      const t = eventTiming(ev, now, today, tomorrow);
      expect(t.past).toBe(false);
      expect(t.onToday).toBe(true);
      expect(t.isToday).toBe(true);
    });

    it('marks all-day event as tomorrow', () => {
      const ev = { allDay: true, start: '2026-05-16', end: '2026-05-17' };
      const t = eventTiming(ev, now, today, tomorrow);
      expect(t.isTomorrow).toBe(true);
    });

    it('marks timed event in past', () => {
      const ev = { allDay: false, start: '2026-05-15T10:00:00', end: '2026-05-15T11:00:00' };
      const t = eventTiming(ev, now, today, tomorrow);
      expect(t.past).toBe(true);
    });

    it('marks timed event on today', () => {
      const ev = { allDay: false, start: '2026-05-15T16:00:00', end: '2026-05-15T17:00:00' };
      const t = eventTiming(ev, now, today, tomorrow);
      expect(t.onToday).toBe(true);
      expect(t.past).toBe(false);
    });
  });

  describe('eventItemHtml', () => {
    it('renders all-day event', () => {
      const ev = { allDay: true, start: '2026-05-15', title: 'All Day Event', location: '' };
      const t = { past: false, isToday: false, isTomorrow: false };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('All Day Event');
      expect(html).toContain('All day');
    });

    it('renders timed event with time', () => {
      const ev = { allDay: false, start: '2026-05-15T14:30:00', title: 'Meeting', location: '' };
      const t = { past: false, isToday: false, isTomorrow: false };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('Meeting');
    });

    it('adds is-past class for past events', () => {
      const ev = { allDay: false, start: '2026-05-14T10:00:00', title: 'Past Event', location: '' };
      const t = { past: true, isToday: false, isTomorrow: false };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('is-past');
    });

    it('adds Today chip for today events', () => {
      const ev = { allDay: false, start: '2026-05-15T10:00:00', title: 'Today Event', location: '' };
      const t = { past: false, isToday: true, isTomorrow: false };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('chip-today');
      expect(html).toContain('Today');
    });

    it('adds buffer flag for tomorrow events', () => {
      const ev = { allDay: false, start: '2026-05-16T10:00:00', title: 'Tomorrow Event', location: '' };
      const t = { past: false, isToday: false, isTomorrow: true };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('buffer-flag');
      expect(html).toContain('Day-before buffer');
    });

    it('includes location when present', () => {
      const ev = { allDay: false, start: '2026-05-15T10:00:00', title: 'Event', location: 'Office' };
      const t = { past: false, isToday: false, isTomorrow: false };
      const html = eventItemHtml(ev, t);
      expect(html).toContain('Office');
    });
  });

  describe('renderInviteGate', () => {
    it('renders invite form', () => {
      const html = renderInviteGate();
      expect(html).toContain('Invite code');
      expect(html).toContain('id="inviteCode"');
      expect(html).toContain('id="doInvite"');
    });

    it('includes error placeholder', () => {
      const html = renderInviteGate();
      expect(html).toContain('id="gateErr"');
      expect(html).toContain('hidden');
    });

    it('shows brand with emoji', () => {
      const html = renderInviteGate();
      expect(html).toContain('🌱');
      expect(html).toContain('Bump');
    });
  });

  describe('renderSetupGate', () => {
    it('renders setup form', () => {
      const html = renderSetupGate();
      expect(html).toContain('id="setupForm"');
      expect(html).toContain('Due date');
      expect(html).toContain('Household PIN');
    });

    it('includes PIN confirmation field', () => {
      const html = renderSetupGate();
      expect(html).toContain('id="pin"');
      expect(html).toContain('id="pin2"');
      expect(html).toContain('Confirm PIN');
    });

    it('has Create household button', () => {
      const html = renderSetupGate();
      expect(html).toContain('Create household');
    });
  });

  describe('renderUnlockGate', () => {
    it('renders unlock form', () => {
      const html = renderUnlockGate();
      expect(html).toContain('id="unlockForm"');
      expect(html).toContain('Welcome back');
    });

    it('includes PIN field', () => {
      const html = renderUnlockGate();
      expect(html).toContain('id="pin"');
      expect(html).toContain('type="password"');
    });

    it('has Unlock button', () => {
      const html = renderUnlockGate();
      expect(html).toContain('Unlock');
    });
  });

  describe('viewToday', () => {
    const mockLog = { movementDone: false, walkDone: false, hydrationOz: 24 };
    const workoutUi = { detailsOpen: false, stopOpen: false };

    it('renders jump navigation', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('jump-row');
      expect(html).toContain('data-jump="sec-week"');
    });

    it('renders progress stats', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('progress-row');
      expect(html).toContain('Trimester');
      expect(html).toContain('Days to due');
    });

    it('renders hydration card', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('Hydration');
      expect(html).toContain('24');
      expect(html).toContain('80 oz');
    });

    it('shows goal reached message when water goal met', () => {
      const fullLog = { ...mockLog, hydrationOz: 80 };
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: fullLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('Goal reached');
    });

    it('renders week browser pills', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('week-browser');
      expect(html).toContain('data-browse-week="1"');
      expect(html).toContain('data-browse-week="42"');
    });

    it('shows reset button when browsing different week', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: 25, workoutUi, waterGoal: 80 });
      expect(html).toContain('id="resetBrowse"');
      expect(html).toContain('Back to current');
    });

    it('includes prep card for the week', () => {
      const html = viewToday({ due: '2026-10-01', week: 20, daysLeft: 100, log: mockLog, browseWeek: null, workoutUi, waterGoal: 80 });
      expect(html).toContain('prep-card');
      expect(html).toContain('Prepare this week');
    });
  });

  describe('viewAppointments', () => {
    it('shows not configured message', () => {
      const html = viewAppointments({
        isConfigured: false,
        isConnected: false,
        cache: { events: [], fetchedAt: null },
        cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('Calendar not set up');
    });

    it('shows connect button when not connected', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: false,
        cache: { events: [], fetchedAt: null },
        cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('Connect Google Calendar');
      expect(html).toContain('id="calConnect"');
    });

    it('shows error message when present', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: false,
        cache: { events: [], fetchedAt: null },
        cal: { loading: false, error: 'Auth failed', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('Auth failed');
      expect(html).toContain('class="err"');
    });

    it('shows loading state', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: false,
        cache: { events: [], fetchedAt: null },
        cal: { loading: true, error: '', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('Connecting…');
      expect(html).toContain('disabled');
    });

    it('renders connected view with events', () => {
      const events = [
        { id: '1', title: 'OB Visit', allDay: false, start: '2026-12-01T10:00:00', end: '2026-12-01T11:00:00', location: '' },
      ];
      const html = viewAppointments({
        isConfigured: true,
        isConnected: true,
        cache: { events, fetchedAt: '2026-05-15T10:00:00Z' },
        cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('OB Visit');
      expect(html).toContain('Upcoming');
      expect(html).toContain('Last updated');
    });

    it('shows empty state when no events', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: true,
        cache: { events: [], fetchedAt: '2026-05-15T10:00:00Z' },
        cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
      });
      expect(html).toContain('No upcoming');
      expect(html).toContain('[Bump]');
    });

    it('shows reconnect alert when needed', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: true,
        cache: { events: [], fetchedAt: '2026-05-15T10:00:00Z' },
        cal: { loading: false, error: 'Token expired', needsReconnect: true, stale: false, pastOpen: false },
      });
      expect(html).toContain('cal-alert');
      expect(html).toContain('Reconnect');
    });

    it('shows stale message when stale', () => {
      const html = viewAppointments({
        isConfigured: true,
        isConnected: true,
        cache: { events: [], fetchedAt: '2026-05-15T10:00:00Z' },
        cal: { loading: false, error: '', needsReconnect: false, stale: true, pastOpen: false },
      });
      expect(html).toContain('Tap Refresh to update');
    });
  });

  describe('notesListCard', () => {
    it('shows empty state with no notes', () => {
      const html = notesListCard([], null, '', true);
      expect(html).toContain('Symptoms, questions for the OB');
    });

    it('renders notes list', () => {
      const notes = [
        { dateLabel: 'May 15, 2026', author: 'Vince', text: 'Feeling good' },
      ];
      const html = notesListCard(notes, '2026-05-15T10:00:00Z', 'doc123', false, 'Last updated', {});
      expect(html).toContain('Feeling good');
      expect(html).toContain('Vince');
      expect(html).toContain('May 15, 2026');
    });

    it('shows delete button in edit mode', () => {
      const notes = [{ dateLabel: 'May 15', author: '', text: 'Test' }];
      const html = notesListCard(notes, null, '', false, '', {});
      expect(html).toContain('note-del');
      expect(html).toContain('Delete');
    });

    it('hides delete button in read-only mode', () => {
      const notes = [{ dateLabel: 'May 15', author: '', text: 'Test' }];
      const html = notesListCard(notes, null, '', true, '', {});
      expect(html).not.toContain('note-del');
    });

    it('shows refresh button in edit mode', () => {
      const html = notesListCard([], null, '', false, '', {});
      expect(html).toContain('id="notesRefresh"');
    });

    it('includes Google Docs link when docId present', () => {
      const html = notesListCard([], null, 'doc123', false, '', {}, 'https://docs.google.com/document/d/doc123/edit');
      expect(html).toContain('Open in Google Docs');
      expect(html).toContain('https://docs.google.com/document/d/doc123/edit');
    });
  });

  describe('viewNotes', () => {
    it('shows not configured message', () => {
      const html = viewNotes({
        isConfigured: false,
        isConnected: false,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: {},
        local: [],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain("aren't set up yet");
    });

    it('shows connect button when not connected', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: false,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '' },
        local: [],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('Connect shared notes');
      expect(html).toContain('id="notesConnect"');
    });

    it('shows error message when present', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: false,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: 'Connection failed' },
        local: [],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('Connection failed');
    });

    it('shows draft saved message when draft exists', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: false,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '' },
        local: [],
        draft: 'My draft note',
        docUrl: '',
      });
      expect(html).toContain('unsent note');
    });

    it('shows local notes count when present', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: false,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '' },
        local: [{ body: 'Note 1' }, { body: 'Note 2' }],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('2 notes are saved only on this phone');
    });

    it('renders connected view with add form', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: true,
        cache: { notes: [], fetchedAt: '2026-05-15T10:00:00Z', docId: 'doc123' },
        notesUi: { loading: false, error: '', offline: false, needsAuth: false },
        local: [],
        draft: '',
        docUrl: 'https://docs.google.com/document/d/doc123/edit',
      });
      expect(html).toContain('New note');
      expect(html).toContain('id="noteBody"');
      expect(html).toContain('id="noteAuthor"');
      expect(html).toContain('id="noteAdd"');
    });

    it('shows offline alert when offline', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: true,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '', offline: true, needsAuth: false },
        local: [],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('offline');
      expect(html).toContain('notes-alert');
    });

    it('shows auth needed alert', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: true,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '', offline: false, needsAuth: true },
        local: [],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('Sign in again');
      expect(html).toContain('id="notesReconnect"');
    });

    it('shows migrate button when local notes exist and connected', () => {
      const html = viewNotes({
        isConfigured: true,
        isConnected: true,
        cache: { notes: [], fetchedAt: null, docId: '' },
        notesUi: { loading: false, error: '', offline: false, needsAuth: false },
        local: [{ body: 'Local note' }],
        draft: '',
        docUrl: '',
      });
      expect(html).toContain('id="notesMigrate"');
      expect(html).toContain('Copy my phone');
    });
  });

  describe('viewSettings', () => {
    const baseProps = {
      household: { dueDate: '2026-10-01' },
      waterGoal: 80,
      waterGoalMin: 16,
      waterGoalMax: 200,
      calendarConfigured: false,
      calendarConnected: false,
      notesConnected: false,
      notesDocId: '',
      notesDocUrl: '',
      notesUi: {},
    };

    it('renders due date field', () => {
      const html = viewSettings(baseProps);
      expect(html).toContain('Due date');
      expect(html).toContain('id="saveDue"');
    });

    it('renders water goal form', () => {
      const html = viewSettings(baseProps);
      expect(html).toContain('Daily water goal');
      expect(html).toContain('id="setWaterGoal"');
      expect(html).toContain('value="80"');
    });

    it('renders PIN change form', () => {
      const html = viewSettings(baseProps);
      expect(html).toContain('Household PIN');
      expect(html).toContain('id="setPin"');
    });

    it('renders backup section', () => {
      const html = viewSettings(baseProps);
      expect(html).toContain('Backup');
      expect(html).toContain('id="doExport"');
    });

    it('renders session controls', () => {
      const html = viewSettings(baseProps);
      expect(html).toContain('id="doLock"');
      expect(html).toContain('id="doReset"');
    });

    it('shows Google settings when calendar configured', () => {
      const html = viewSettings({ ...baseProps, calendarConfigured: true });
      expect(html).toContain('Google account');
      expect(html).toContain('Calendar');
    });

    it('shows connected status for calendar', () => {
      const html = viewSettings({ ...baseProps, calendarConfigured: true, calendarConnected: true });
      expect(html).toContain('connected (read-only)');
    });

    it('shows connected status for notes with doc link', () => {
      const html = viewSettings({
        ...baseProps,
        calendarConfigured: true,
        notesConnected: true,
        notesDocId: 'doc123',
        notesDocUrl: 'https://docs.google.com/document/d/doc123/edit',
      });
      expect(html).toContain('Bump Notes');
      expect(html).toContain('https://docs.google.com/document/d/doc123/edit');
    });

    it('shows doc form when notes connected', () => {
      const html = viewSettings({
        ...baseProps,
        calendarConfigured: true,
        notesConnected: true,
      });
      expect(html).toContain('id="docForm"');
      expect(html).toContain('Use a different notes doc');
    });

    it('shows disconnect button when connected', () => {
      const html = viewSettings({
        ...baseProps,
        calendarConfigured: true,
        calendarConnected: true,
      });
      expect(html).toContain('id="googleDisconnect"');
    });
  });

  describe('renderAppShell', () => {
    it('renders header with date', () => {
      const html = renderAppShell('2026-05-15', 'today');
      expect(html).toContain('Bump');
      expect(html).toContain('May');
    });

    it('renders navigation tabs', () => {
      const html = renderAppShell('2026-05-15', 'today');
      expect(html).toContain('data-tab="today"');
      expect(html).toContain('data-tab="appointments"');
      expect(html).toContain('data-tab="notes"');
      expect(html).toContain('data-tab="settings"');
    });

    it('marks active tab', () => {
      const todayHtml = renderAppShell('2026-05-15', 'today');
      expect(todayHtml).toContain('data-tab="today" class="active"');

      const settingsHtml = renderAppShell('2026-05-15', 'settings');
      expect(settingsHtml).toContain('data-tab="settings" class="active"');
    });

    it('includes main content area', () => {
      const html = renderAppShell('2026-05-15', 'today');
      expect(html).toContain('id="main"');
    });
  });
});
