/**
 * Integration tests for main.js rendering.
 * Vitest is configured with jsdom environment, so we test the render functions directly.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('main.js uses render.js functions', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('imports all rendering functions from render.js', async () => {
    const render = await import('./ui/render.js');
    
    // Verify all expected exports exist and match types
    expect(render.PIN_RULE).toBeInstanceOf(RegExp);
    expect(typeof render.PIN_ERROR).toBe('string');
    expect(typeof render.dateField).toBe('function');
    expect(typeof render.renderInviteGate).toBe('function');
    expect(typeof render.renderSetupGate).toBe('function');
    expect(typeof render.renderUnlockGate).toBe('function');
    expect(typeof render.viewToday).toBe('function');
    expect(typeof render.viewAppointments).toBe('function');
    expect(typeof render.viewNotes).toBe('function');
    expect(typeof render.viewSettings).toBe('function');
    expect(typeof render.renderAppShell).toBe('function');
  });
});

describe('Gate rendering functions', () => {
  it('renderInviteGate produces valid HTML structure', async () => {
    const { renderInviteGate } = await import('./ui/render.js');
    const html = renderInviteGate();
    
    // Check structure
    expect(html).toContain('class="gate"');
    expect(html).toContain('class="gate-card"');
    expect(html).toContain('id="inviteCode"');
    expect(html).toContain('id="doInvite"');
    expect(html).toContain('id="gateErr"');
    
    // Check content
    expect(html).toContain('Invite-only');
    expect(html).toContain('Invite code');
    expect(html).toContain('Continue');
  });

  it('renderSetupGate produces form with all required fields', async () => {
    const { renderSetupGate } = await import('./ui/render.js');
    const html = renderSetupGate();
    
    // Check form structure
    expect(html).toContain('id="setupForm"');
    expect(html).toContain('id="dueDate"');
    expect(html).toContain('id="pin"');
    expect(html).toContain('id="pin2"');
    expect(html).toContain('id="gateErr"');
    
    // Check date field is included
    expect(html).toContain('class="date-field"');
    expect(html).toContain('type="date"');
    
    // Check content
    expect(html).toContain('Due date');
    expect(html).toContain('Household PIN');
    expect(html).toContain('Create household');
  });

  it('renderUnlockGate produces unlock form', async () => {
    const { renderUnlockGate } = await import('./ui/render.js');
    const html = renderUnlockGate();
    
    // Check form structure
    expect(html).toContain('id="unlockForm"');
    expect(html).toContain('id="pin"');
    expect(html).toContain('id="gateErr"');
    
    // Check content
    expect(html).toContain('Welcome back');
    expect(html).toContain('PIN');
    expect(html).toContain('Unlock');
  });
});

describe('App shell rendering', () => {
  it('renderAppShell produces navigation with all tabs', async () => {
    const { renderAppShell } = await import('./ui/render.js');
    const html = renderAppShell('2027-05-15', 'today');
    
    // Check structure
    expect(html).toContain('class="app-shell"');
    expect(html).toContain('class="topbar"');
    expect(html).toContain('id="main"');
    expect(html).toContain('class="nav"');
    
    // Check all tab buttons
    expect(html).toContain('data-tab="today"');
    expect(html).toContain('data-tab="appointments"');
    expect(html).toContain('data-tab="notes"');
    expect(html).toContain('data-tab="settings"');
    
    // Check tab labels
    expect(html).toContain('Today');
    expect(html).toContain('Appts');
    expect(html).toContain('Notes');
    expect(html).toContain('Settings');
  });

  it('marks active tab correctly', async () => {
    const { renderAppShell } = await import('./ui/render.js');
    
    const todayHtml = renderAppShell('2027-05-15', 'today');
    expect(todayHtml).toContain('data-tab="today" class="active"');
    
    const appointmentsHtml = renderAppShell('2027-05-15', 'appointments');
    expect(appointmentsHtml).toContain('data-tab="appointments" class="active"');
    
    const notesHtml = renderAppShell('2027-05-15', 'notes');
    expect(notesHtml).toContain('data-tab="notes" class="active"');
    
    const settingsHtml = renderAppShell('2027-05-15', 'settings');
    expect(settingsHtml).toContain('data-tab="settings" class="active"');
  });
});

describe('View rendering functions', () => {
  it('viewToday renders all sections', async () => {
    const { viewToday } = await import('./ui/render.js');
    const html = viewToday({
      due: '2027-05-15',
      week: 20,
      daysLeft: 140,
      log: { hydrationOz: 32, movementDone: false, walkDone: true },
      browseWeek: null,
      workoutUi: { detailsOpen: false, stopOpen: false },
      waterGoal: 64,
    });
    
    // Check sections exist
    expect(html).toContain('id="sec-week"');
    expect(html).toContain('id="sec-water"');
    expect(html).toContain('id="sec-workout"');
    expect(html).toContain('id="sec-browse"');
    
    // Check hydration display
    expect(html).toContain('32');
    expect(html).toContain('64 oz');
    expect(html).toContain('hydroPlus');
    expect(html).toContain('hydroMinus');
  });

  it('viewAppointments renders not configured state', async () => {
    const { viewAppointments } = await import('./ui/render.js');
    const html = viewAppointments({
      isConfigured: false,
      isConnected: false,
      cache: { events: [], fetchedAt: null },
      cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
    });
    
    expect(html).toContain('Calendar not set up');
  });

  it('viewAppointments renders connect button when not connected', async () => {
    const { viewAppointments } = await import('./ui/render.js');
    const html = viewAppointments({
      isConfigured: true,
      isConnected: false,
      cache: { events: [], fetchedAt: null },
      cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
    });
    
    expect(html).toContain('id="calConnect"');
    expect(html).toContain('Connect Google Calendar');
  });

  it('viewAppointments renders events when connected', async () => {
    const { viewAppointments } = await import('./ui/render.js');
    const html = viewAppointments({
      isConfigured: true,
      isConnected: true,
      cache: {
        events: [
          { id: '1', title: 'OB Visit', start: '2027-05-20T10:00:00', end: '2027-05-20T11:00:00', allDay: false, location: 'Clinic' },
        ],
        fetchedAt: '2027-05-15T08:00:00Z',
      },
      cal: { loading: false, error: '', needsReconnect: false, stale: false, pastOpen: false },
    });
    
    expect(html).toContain('OB Visit');
    expect(html).toContain('Clinic');
    expect(html).toContain('id="calRefresh"');
  });

  it('viewNotes renders not configured state', async () => {
    const { viewNotes } = await import('./ui/render.js');
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

  it('viewNotes renders connect button when not connected', async () => {
    const { viewNotes } = await import('./ui/render.js');
    const html = viewNotes({
      isConfigured: true,
      isConnected: false,
      cache: { notes: [], fetchedAt: null, docId: '' },
      notesUi: { loading: false, error: '', offline: false, needsAuth: false, busy: '' },
      local: [],
      draft: '',
      docUrl: '',
    });
    
    expect(html).toContain('id="notesConnect"');
    expect(html).toContain('Connect shared notes');
  });

  it('viewNotes renders add note form when connected', async () => {
    const { viewNotes } = await import('./ui/render.js');
    const html = viewNotes({
      isConfigured: true,
      isConnected: true,
      cache: { notes: [], fetchedAt: '2027-05-15T08:00:00Z', docId: 'doc123' },
      notesUi: { loading: false, error: '', offline: false, needsAuth: false, busy: '' },
      local: [],
      draft: '',
      docUrl: 'https://docs.google.com/document/d/doc123/edit',
    });
    
    expect(html).toContain('id="noteBody"');
    expect(html).toContain('id="noteAuthor"');
    expect(html).toContain('id="noteAdd"');
    expect(html).toContain('Add note');
  });

  it('viewSettings renders all settings sections', async () => {
    const { viewSettings } = await import('./ui/render.js');
    const html = viewSettings({
      household: { dueDate: '2027-05-15' },
      waterGoal: 64,
      waterGoalMin: 32,
      waterGoalMax: 160,
      calendarConfigured: false,
      calendarConnected: false,
      notesConnected: false,
      notesDocId: '',
      notesDocUrl: '',
      notesUi: {},
    });
    
    // Check all settings cards
    expect(html).toContain('Due date');
    expect(html).toContain('Daily water goal');
    expect(html).toContain('Household PIN');
    expect(html).toContain('Backup');
    expect(html).toContain('Session');
    
    // Check buttons
    expect(html).toContain('id="saveDue"');
    expect(html).toContain('id="waterGoalForm"');
    expect(html).toContain('id="pinForm"');
    expect(html).toContain('id="doExport"');
    expect(html).toContain('id="doLock"');
    expect(html).toContain('id="doReset"');
  });
});

describe('PIN validation', () => {
  it('PIN_RULE matches valid PINs', async () => {
    const { PIN_RULE } = await import('./ui/render.js');
    
    expect(PIN_RULE.test('1234')).toBe(true);
    expect(PIN_RULE.test('12345678')).toBe(true);
    expect(PIN_RULE.test('0000')).toBe(true);
  });

  it('PIN_RULE rejects invalid PINs', async () => {
    const { PIN_RULE } = await import('./ui/render.js');
    
    expect(PIN_RULE.test('123')).toBe(false); // too short
    expect(PIN_RULE.test('abcd')).toBe(false); // not digits
    expect(PIN_RULE.test('12ab')).toBe(false); // mixed
    expect(PIN_RULE.test('')).toBe(false); // empty
  });

  it('PIN_ERROR contains helpful message', async () => {
    const { PIN_ERROR } = await import('./ui/render.js');
    
    expect(PIN_ERROR).toContain('4 digits');
    expect(PIN_ERROR).toContain('numbers only');
  });
});
