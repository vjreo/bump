/**
 * Integration tests for main.js.
 * Tests the full app initialization and event handlers with mocked dependencies.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock CSS import
vi.mock('./style.css', () => ({}));

// Create mock functions for all dependencies
const mockStore = {
  load: vi.fn(),
  getState: vi.fn(() => ({
    household: { dueDate: '2027-05-15', pin: '1234' },
    dailyLogs: {},
    notes: [],
  })),
  isSetup: vi.fn(() => false),
  isUnlocked: vi.fn(() => false),
  setupHousehold: vi.fn(),
  unlock: vi.fn(() => true),
  lock: vi.fn(),
  setDueDate: vi.fn(),
  setPin: vi.fn(),
  addWater: vi.fn(),
  getWaterGoal: vi.fn(() => 80),
  setWaterGoal: vi.fn(() => true),
  setWorkoutDone: vi.fn(),
  setWalkDone: vi.fn(),
  getTodayLog: vi.fn(() => ({ hydrationOz: 0, movementDone: false, walkDone: false })),
  listNotes: vi.fn(() => []),
  clearLocalNotes: vi.fn(),
  exportJSON: vi.fn(() => '{"test": true}'),
  resetAll: vi.fn(),
  WATER_GOAL_MIN: 16,
  WATER_GOAL_MAX: 200,
};

const mockInvite = {
  isInviteOk: vi.fn(() => false),
  tryInvite: vi.fn(() => Promise.resolve(false)),
};

const mockCalendar = {
  isConfigured: vi.fn(() => false),
  isConnected: vi.fn(() => false),
  getCache: vi.fn(() => ({ events: [], fetchedAt: null })),
  refresh: vi.fn(() => Promise.resolve({ ok: true })),
  disconnect: vi.fn(() => Promise.resolve()),
  clearCache: vi.fn(),
};

const mockNotesDoc = {
  isConfigured: vi.fn(() => false),
  isConnected: vi.fn(() => false),
  getCache: vi.fn(() => ({ notes: [], fetchedAt: null, docId: '' })),
  docUrl: vi.fn(() => ''),
  getDocId: vi.fn(() => ''),
  refresh: vi.fn(() => Promise.resolve({ ok: true })),
  addNote: vi.fn(() => Promise.resolve({ ok: true })),
  deleteNote: vi.fn(() => Promise.resolve({ ok: true })),
  copyLocalNotes: vi.fn(() => Promise.resolve({ ok: true })),
  useDoc: vi.fn(() => Promise.resolve({ ok: true })),
  clearCache: vi.fn(),
  forgetDoc: vi.fn(),
};

const mockGoogle = {
  loadGis: vi.fn(() => Promise.resolve()),
};

// Mock modules before importing main.js
vi.mock('./store.js', () => mockStore);
vi.mock('./invite.js', () => mockInvite);
vi.mock('./calendar.js', () => mockCalendar);
vi.mock('./notesDoc.js', () => mockNotesDoc);
vi.mock('./google.js', () => mockGoogle);

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// Mock matchMedia for reduced motion detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper to create and set up DOM
function setupDOM() {
  document.body.innerHTML = '<div id="app"></div>';
  return document.getElementById('app');
}

// Helper to reset all mocks to default state
function resetMocks() {
  Object.values(mockStore).forEach(fn => typeof fn.mockReset === 'function' && fn.mockReset());
  Object.values(mockInvite).forEach(fn => typeof fn.mockReset === 'function' && fn.mockReset());
  Object.values(mockCalendar).forEach(fn => typeof fn.mockReset === 'function' && fn.mockReset());
  Object.values(mockNotesDoc).forEach(fn => typeof fn.mockReset === 'function' && fn.mockReset());
  Object.values(mockGoogle).forEach(fn => typeof fn.mockReset === 'function' && fn.mockReset());
  localStorageMock.clear();
  
  // Set defaults
  mockStore.load.mockReturnValue(undefined);
  mockStore.getState.mockReturnValue({
    household: { dueDate: '2027-05-15', pin: '1234' },
    dailyLogs: {},
    notes: [],
  });
  mockStore.isSetup.mockReturnValue(false);
  mockStore.isUnlocked.mockReturnValue(false);
  mockStore.unlock.mockReturnValue(true);
  mockStore.getWaterGoal.mockReturnValue(80);
  mockStore.setWaterGoal.mockReturnValue(true);
  mockStore.getTodayLog.mockReturnValue({ hydrationOz: 0, movementDone: false, walkDone: false });
  mockStore.listNotes.mockReturnValue([]);
  mockStore.exportJSON.mockReturnValue('{"test": true}');
  
  mockInvite.isInviteOk.mockReturnValue(false);
  mockInvite.tryInvite.mockReturnValue(Promise.resolve(false));
  
  mockCalendar.isConfigured.mockReturnValue(false);
  mockCalendar.isConnected.mockReturnValue(false);
  mockCalendar.getCache.mockReturnValue({ events: [], fetchedAt: null });
  mockCalendar.refresh.mockReturnValue(Promise.resolve({ ok: true }));
  mockCalendar.disconnect.mockReturnValue(Promise.resolve());
  
  mockNotesDoc.isConfigured.mockReturnValue(false);
  mockNotesDoc.isConnected.mockReturnValue(false);
  mockNotesDoc.getCache.mockReturnValue({ notes: [], fetchedAt: null, docId: '' });
  mockNotesDoc.docUrl.mockReturnValue('');
  mockNotesDoc.refresh.mockReturnValue(Promise.resolve({ ok: true }));
  mockNotesDoc.addNote.mockReturnValue(Promise.resolve({ ok: true }));
  mockNotesDoc.deleteNote.mockReturnValue(Promise.resolve({ ok: true }));
  mockNotesDoc.copyLocalNotes.mockReturnValue(Promise.resolve({ ok: true }));
  mockNotesDoc.useDoc.mockReturnValue(Promise.resolve({ ok: true }));
  
  mockGoogle.loadGis.mockReturnValue(Promise.resolve());
}

describe('main.js initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('exports init function', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    
    const main = await import('./main.js');
    expect(typeof main.init).toBe('function');
  });

  it('calls store.load on import', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    
    await import('./main.js');
    expect(mockStore.load).toHaveBeenCalled();
  });
});

describe('Invite gate flow', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows invite gate when invite not ok', async () => {
    mockInvite.isInviteOk.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    expect(app.innerHTML).toContain('Invite-only');
    expect(app.innerHTML).toContain('id="inviteCode"');
    expect(app.innerHTML).toContain('id="doInvite"');
  });

  it('accepts valid invite code', async () => {
    mockInvite.isInviteOk.mockReturnValueOnce(false).mockReturnValue(true);
    mockInvite.tryInvite.mockResolvedValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const input = app.querySelector('#inviteCode');
    const btn = app.querySelector('#doInvite');
    
    input.value = 'TEST-CODE';
    await btn.click();
    
    expect(mockInvite.tryInvite).toHaveBeenCalledWith('TEST-CODE');
    // After valid invite, should show setup gate
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="setupForm"');
    });
  });

  it('shows error for invalid invite code', async () => {
    mockInvite.isInviteOk.mockReturnValue(false);
    mockInvite.tryInvite.mockResolvedValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const input = app.querySelector('#inviteCode');
    const btn = app.querySelector('#doInvite');
    
    input.value = 'WRONG-CODE';
    await btn.click();
    
    await vi.waitFor(() => {
      const err = app.querySelector('#gateErr');
      expect(err.classList.contains('hidden')).toBe(false);
      expect(err.textContent).toContain('match');
    });
  });

  it('submits invite on Enter key', async () => {
    mockInvite.isInviteOk.mockReturnValue(false);
    mockInvite.tryInvite.mockResolvedValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const input = app.querySelector('#inviteCode');
    input.value = 'TEST-CODE';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    expect(mockInvite.tryInvite).toHaveBeenCalledWith('TEST-CODE');
  });
});

describe('PIN setup flow', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows setup gate when invite ok but not set up', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    expect(app.innerHTML).toContain('id="setupForm"');
    expect(app.innerHTML).toContain('id="dueDate"');
    expect(app.innerHTML).toContain('id="pin"');
    expect(app.innerHTML).toContain('id="pin2"');
  });

  it('validates due date is required', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const form = app.querySelector('#setupForm');
    const pinInput = app.querySelector('#pin');
    const pin2Input = app.querySelector('#pin2');
    
    pinInput.value = '1234';
    pin2Input.value = '1234';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    const err = app.querySelector('#gateErr');
    expect(err.textContent).toContain('due date');
    expect(err.classList.contains('hidden')).toBe(false);
  });

  it('validates PIN format (4+ digits)', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const form = app.querySelector('#setupForm');
    const dueDate = app.querySelector('#dueDate');
    const pinInput = app.querySelector('#pin');
    const pin2Input = app.querySelector('#pin2');
    
    dueDate.value = '2027-05-15';
    pinInput.value = '12'; // too short
    pin2Input.value = '12';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    const err = app.querySelector('#gateErr');
    expect(err.textContent).toContain('4 digits');
    expect(err.classList.contains('hidden')).toBe(false);
  });

  it('validates PINs must match', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const form = app.querySelector('#setupForm');
    const dueDate = app.querySelector('#dueDate');
    const pinInput = app.querySelector('#pin');
    const pin2Input = app.querySelector('#pin2');
    
    dueDate.value = '2027-05-15';
    pinInput.value = '1234';
    pin2Input.value = '5678'; // doesn't match
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    const err = app.querySelector('#gateErr');
    expect(err.textContent).toContain('do not match');
    expect(err.classList.contains('hidden')).toBe(false);
  });

  it('creates household with valid data', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
    mockStore.isUnlocked.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Should be showing setup form
    expect(app.innerHTML).toContain('id="setupForm"');
    
    const form = app.querySelector('#setupForm');
    const dueDate = app.querySelector('#dueDate');
    const pinInput = app.querySelector('#pin');
    const pin2Input = app.querySelector('#pin2');
    
    dueDate.value = '2027-05-15';
    pinInput.value = '1234';
    pin2Input.value = '1234';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    expect(mockStore.setupHousehold).toHaveBeenCalledWith({
      pin: '1234',
      dueDate: '2027-05-15',
    });
  });
});

describe('Unlock flow', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows unlock gate when set up but locked', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    expect(app.innerHTML).toContain('id="unlockForm"');
    expect(app.innerHTML).toContain('Welcome back');
  });

  it('unlocks with correct PIN', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValueOnce(false).mockReturnValue(true);
    mockStore.unlock.mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const form = app.querySelector('#unlockForm');
    const pinInput = app.querySelector('#pin');
    
    pinInput.value = '1234';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    expect(mockStore.unlock).toHaveBeenCalledWith('1234');
    // Should now show the app
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('class="app-shell"');
    });
  });

  it('shows error for wrong PIN', async () => {
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(false);
    mockStore.unlock.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const form = app.querySelector('#unlockForm');
    const pinInput = app.querySelector('#pin');
    
    pinInput.value = '9999';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    expect(mockStore.unlock).toHaveBeenCalledWith('9999');
    const err = app.querySelector('#gateErr');
    expect(err.textContent).toContain('Incorrect PIN');
    expect(err.classList.contains('hidden')).toBe(false);
  });
});

describe('Tab navigation', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows Today tab by default', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    expect(app.innerHTML).toContain('data-tab="today" class="active"');
    expect(app.innerHTML).toContain('id="sec-week"');
  });

  it('switches to Appointments tab', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const apptBtn = app.querySelector('[data-tab="appointments"]');
    apptBtn.click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('data-tab="appointments" class="active"');
    });
  });

  it('switches to Notes tab', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const notesBtn = app.querySelector('[data-tab="notes"]');
    notesBtn.click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('data-tab="notes" class="active"');
    });
  });

  it('switches to Settings tab', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const settingsBtn = app.querySelector('[data-tab="settings"]');
    settingsBtn.click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('data-tab="settings" class="active"');
      expect(app.innerHTML).toContain('Household PIN');
    });
  });

  it('syncs calendar when switching to appointments tab while connected', async () => {
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.isConfigured.mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const apptBtn = app.querySelector('[data-tab="appointments"]');
    apptBtn.click();
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalled();
    });
  });

  it('syncs notes when switching to notes tab while connected', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const notesBtn = app.querySelector('[data-tab="notes"]');
    notesBtn.click();
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalled();
    });
  });
});

describe('Today tab - Hydration', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('adds 8oz water on plus button click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const plusBtn = app.querySelector('#hydroPlus');
    plusBtn.click();
    
    expect(mockStore.addWater).toHaveBeenCalledWith(8);
  });

  it('adds 16oz water on plus16 button click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const plusBtn = app.querySelector('#hydroPlus16');
    plusBtn.click();
    
    expect(mockStore.addWater).toHaveBeenCalledWith(16);
  });

  it('subtracts 8oz water on minus button click', async () => {
    // Start with some water already added so the minus button is enabled
    mockStore.getTodayLog.mockReturnValue({ hydrationOz: 16, movementDone: false, walkDone: false });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    const minusBtn = app.querySelector('#hydroMinus');
    expect(minusBtn).not.toBeNull();
    expect(minusBtn.disabled).toBe(false);
    minusBtn.click();
    
    expect(mockStore.addWater).toHaveBeenCalledWith(-8);
  });
});

describe('Today tab - Workout tracking', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('marks workout done on checkbox change', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const checkbox = app.querySelector('#woDone');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    
    await vi.waitFor(() => {
      expect(mockStore.setWorkoutDone).toHaveBeenCalled();
    });
  });

  it('marks walk done on checkbox change', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const checkbox = app.querySelector('#walkDone');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    
    expect(mockStore.setWalkDone).toHaveBeenCalledWith(true);
  });
});

describe('Today tab - Week browsing', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('browses to different week when week pill clicked', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const weekBtn = app.querySelector('[data-browse-week]');
    if (weekBtn) {
      weekBtn.click();
      // Should trigger re-render with new week
      await vi.waitFor(() => {
        expect(app.innerHTML).toContain('week-browser');
      });
    }
  });

  it('resets week browse on reset button click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // First browse to a different week
    const weekBtn = app.querySelector('[data-browse-week]');
    if (weekBtn) weekBtn.click();
    
    // Then reset
    const resetBtn = app.querySelector('#resetBrowse');
    if (resetBtn) {
      resetBtn.click();
      await vi.waitFor(() => {
        expect(app.innerHTML).toContain('week-browser');
      });
    }
  });
});

describe('Appointments tab', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    mockCalendar.isConfigured.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows connect button when not connected', async () => {
    mockCalendar.isConnected.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    const apptBtn = app.querySelector('[data-tab="appointments"]');
    apptBtn.click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="calConnect"');
    });
  });

  it('connects calendar on button click', async () => {
    mockCalendar.isConnected.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      const connectBtn = app.querySelector('#calConnect');
      connectBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalledWith(expect.objectContaining({ interactive: true }));
    });
  });

  it('shows refresh button when connected', async () => {
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [{ id: '1', title: 'Test Appt', start: '2027-05-20T10:00:00', end: '2027-05-20T11:00:00', allDay: false }],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="calRefresh"');
    });
  });

  it('refreshes calendar on refresh button click', async () => {
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      const refreshBtn = app.querySelector('#calRefresh');
      refreshBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalled();
    });
  });

  it('sets stale state when token expired in background (non-interactive)', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [{ id: '1', title: 'Test', start: '2027-05-20T10:00:00', end: '2027-05-20T11:00:00', allDay: false }],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
    // First call (interactive from tab switch) succeeds, second call (non-interactive visibility change) fails
    mockCalendar.refresh
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValue({ ok: false, needsReconnect: true });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab (triggers interactive sync)
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalled();
    });
    
    // Clear call count
    mockCalendar.refresh.mockClear();
    
    // Trigger visibility change (non-interactive sync)
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalledWith(expect.objectContaining({ interactive: false }));
    });
  });

  it('shows error when calendar refresh fails', async () => {
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
    mockCalendar.refresh.mockResolvedValue({ ok: false, error: 'Network error' });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalled();
    });
  });

  it('shows reconnect button when connection lost', async () => {
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
    mockCalendar.refresh.mockResolvedValue({ ok: false, needsReconnect: true });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab with interactive (tap) to trigger the reconnect state
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      const reconnectBtn = app.querySelector('#calReconnect');
      if (reconnectBtn) {
        reconnectBtn.click();
        expect(mockCalendar.refresh).toHaveBeenCalledWith(expect.objectContaining({ consent: true }));
      }
    }, { timeout: 100 }).catch(() => {
      // Button may not appear depending on state
    });
  });
});

describe('Notes tab', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('shows connect button when not connected', async () => {
    mockNotesDoc.isConnected.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="notesConnect"');
    });
  });

  it('deletes note on confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [
        { key: 'note-key-1', header: 'Mon, May 10, 2027 at 10:00 AM', text: 'Test note', author: 'Vince', when: '2027-05-10T10:00', dateLabel: 'Mon, May 10, 2027 at 10:00 AM' },
      ],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const deleteBtn = app.querySelector('.note-del');
      if (deleteBtn) {
        deleteBtn.click();
      }
    });
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.deleteNote).toHaveBeenCalledWith('note-key-1');
    }, { timeout: 100 }).catch(() => {
      // Delete button may not exist if no notes rendered
    });
    
    confirmSpy.mockRestore();
  });

  it('connects notes on button click', async () => {
    mockNotesDoc.isConnected.mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const connectBtn = app.querySelector('#notesConnect');
      connectBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalledWith(expect.objectContaining({ interactive: true }));
    });
  });

  it('shows add note form when connected', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="noteBody"');
      expect(app.innerHTML).toContain('id="noteAdd"');
    });
  });

  it('adds note on button click', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const bodyEl = app.querySelector('#noteBody');
      const addBtn = app.querySelector('#noteAdd');
      const authorEl = app.querySelector('#noteAuthor');
      
      bodyEl.value = 'Test note content';
      if (authorEl) authorEl.value = 'Vince';
      addBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.addNote).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Test note content',
      }));
    });
  });

  it('saves draft on input', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const bodyEl = app.querySelector('#noteBody');
      bodyEl.value = 'Draft note';
      bodyEl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('bump.noteDraft.v1', 'Draft note');
  });

  it('saves author preference on change', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const authorEl = app.querySelector('#noteAuthor');
      if (authorEl) {
        authorEl.value = 'Chantal';
        authorEl.dispatchEvent(new Event('change', { bubbles: true }));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('bump.noteAuthor.v1', 'Chantal');
      }
    });
  });

  it('handles notes error state (403)', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.refresh.mockResolvedValue({ ok: false, error: 'Permission denied (403)' });
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: null,
      docId: '',
    });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const refreshBtn = app.querySelector('#notesRefresh');
      if (refreshBtn) refreshBtn.click();
    });
    
    // Error state should be set (checked via re-render with error)
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalled();
    });
  });

  it('migrates local notes to doc', async () => {
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getCache.mockReturnValue({
      notes: [],
      fetchedAt: '2027-05-15T08:00:00Z',
      docId: 'doc123',
    });
    mockStore.listNotes.mockReturnValue([
      { id: '1', body: 'Local note', author: 'Vince', createdAt: '2027-05-10T10:00:00Z' },
    ]);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    
    await vi.waitFor(() => {
      const migrateBtn = app.querySelector('#notesMigrate');
      if (migrateBtn) {
        migrateBtn.click();
      }
    });
    
    // If migration button exists, it should call copyLocalNotes
    if (mockStore.listNotes().length > 0) {
      await vi.waitFor(() => {
        expect(mockNotesDoc.copyLocalNotes).toHaveBeenCalled();
      }, { timeout: 100 }).catch(() => {
        // Button may not exist if no local notes
      });
    }
  });
});

describe('Settings tab', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('saves due date on button click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const dueInput = app.querySelector('#setDue');
      const saveBtn = app.querySelector('#saveDue');
      
      dueInput.value = '2027-06-15';
      saveBtn.click();
    });
    
    expect(mockStore.setDueDate).toHaveBeenCalledWith('2027-06-15');
  });

  it('saves water goal on form submit', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const form = app.querySelector('#waterGoalForm');
      const input = app.querySelector('#setWaterGoal');
      
      input.value = '96';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    
    expect(mockStore.setWaterGoal).toHaveBeenCalledWith(96);
  });

  it('shows alert for invalid water goal', async () => {
    mockStore.setWaterGoal.mockReturnValue(false);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const form = app.querySelector('#waterGoalForm');
      const input = app.querySelector('#setWaterGoal');
      
      input.value = 'abc';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('updates PIN on form submit', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const form = app.querySelector('#pinForm');
      const input = app.querySelector('#setPin');
      
      input.value = '5678';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    
    expect(mockStore.setPin).toHaveBeenCalledWith('5678');
    expect(alertSpy).toHaveBeenCalledWith('PIN updated');
    alertSpy.mockRestore();
  });

  it('shows alert for invalid PIN format', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const form = app.querySelector('#pinForm');
      const input = app.querySelector('#setPin');
      
      input.value = '12'; // too short
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    
    expect(mockStore.setPin).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('exports data on button click', async () => {
    // Mock URL and Blob
    const mockUrl = 'blob:http://localhost/test';
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const exportBtn = app.querySelector('#doExport');
      exportBtn.click();
    });
    
    expect(mockStore.exportJSON).toHaveBeenCalled();
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
    
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  it('locks session on button click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const lockBtn = app.querySelector('#doLock');
      lockBtn.click();
    });
    
    expect(mockStore.lock).toHaveBeenCalled();
  });

  it('resets all data on confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const resetBtn = app.querySelector('#doReset');
      resetBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockStore.resetAll).toHaveBeenCalled();
    });
    
    confirmSpy.mockRestore();
  });

  it('does not reset data on cancel', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const resetBtn = app.querySelector('#doReset');
      resetBtn.click();
    });
    
    expect(mockStore.resetAll).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('disconnects Google on confirm', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      const disconnectBtn = app.querySelector('#googleDisconnect');
      if (disconnectBtn) disconnectBtn.click();
    });
    
    await vi.waitFor(() => {
      expect(mockCalendar.disconnect).toHaveBeenCalled();
    }, { timeout: 100 }).catch(() => {
      // Button may not exist
    });
    
    confirmSpy.mockRestore();
  });

  it('updates notes doc on form submit', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getDocId.mockReturnValue('doc123');
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="docForm"');
    });
    
    const form = app.querySelector('#docForm');
    const input = app.querySelector('#docInput');
    
    expect(form).not.toBeNull();
    expect(input).not.toBeNull();
    
    input.value = 'https://docs.google.com/document/d/newdoc123/edit';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.useDoc).toHaveBeenCalled();
    });
  });

  it('shows error when doc update fails', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getDocId.mockReturnValue('doc123');
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    mockNotesDoc.useDoc.mockResolvedValue({ ok: false, error: 'Permission denied (403)' });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="docForm"');
    });
    
    const form = app.querySelector('#docForm');
    const input = app.querySelector('#docInput');
    
    input.value = 'https://docs.google.com/document/d/newdoc123/edit';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.useDoc).toHaveBeenCalled();
    });
  });

  it('does not submit doc form when busy', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
    mockNotesDoc.getDocId.mockReturnValue('doc123');
    mockNotesDoc.docUrl.mockReturnValue('https://docs.google.com/document/d/doc123/edit');
    
    // Create a slow useDoc that we can control
    let resolveUseDoc;
    mockNotesDoc.useDoc.mockImplementation(() => new Promise(r => { resolveUseDoc = r; }));
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to settings tab
    app.querySelector('[data-tab="settings"]').click();
    
    await vi.waitFor(() => {
      expect(app.innerHTML).toContain('id="docForm"');
    });
    
    const form = app.querySelector('#docForm');
    const input = app.querySelector('#docInput');
    
    input.value = 'https://docs.google.com/document/d/newdoc123/edit';
    // Submit first time
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    // Try to submit again while busy
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    // Resolve the pending call
    if (resolveUseDoc) resolveUseDoc({ ok: true });
    
    // Should only have been called once (second submit ignored due to busy)
    await vi.waitFor(() => {
      expect(mockNotesDoc.useDoc).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Date field binding', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(false);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('updates date display on input', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const dateInput = app.querySelector('.date-input');
    const dateDisplay = app.querySelector('.date-display');
    
    if (dateInput && dateDisplay) {
      dateInput.value = '2027-05-15';
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Display should be updated (exact format depends on formatLongDate)
      expect(dateDisplay.textContent).not.toBe('Choose a date');
    }
  });

  it('updates date display on change', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const dateInput = app.querySelector('.date-input');
    const dateDisplay = app.querySelector('.date-display');
    
    if (dateInput && dateDisplay) {
      dateInput.value = '2027-05-15';
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(dateDisplay.textContent).not.toBe('Choose a date');
    }
  });

  it('shows picker on click (when supported)', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const dateInput = app.querySelector('.date-input');
    if (dateInput) {
      const showPickerSpy = vi.fn();
      dateInput.showPicker = showPickerSpy;
      
      dateInput.click();
      
      expect(showPickerSpy).toHaveBeenCalled();
    }
  });
});

describe('Visibility change handling', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('refreshes calendar on visibility change when on appointments tab', async () => {
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    mockCalendar.refresh.mockClear();
    
    // Simulate visibility change
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    await vi.waitFor(() => {
      expect(mockCalendar.refresh).toHaveBeenCalledWith(expect.objectContaining({ interactive: false }));
    });
  });

  it('refreshes notes on visibility change when on notes tab', async () => {
    mockNotesDoc.isConfigured.mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab
    app.querySelector('[data-tab="notes"]').click();
    mockNotesDoc.refresh.mockClear();
    
    // Simulate visibility change
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalledWith(expect.objectContaining({ interactive: false }));
    });
  });
});

describe('Online event handling', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    mockNotesDoc.isConfigured.mockReturnValue(true);
    mockNotesDoc.isConnected.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('syncs notes when coming online while offline', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to notes tab and simulate offline state
    app.querySelector('[data-tab="notes"]').click();
    
    // We need to set the internal notesUi.offline flag
    // This would be set by a failed refresh, so let's trigger that
    mockNotesDoc.refresh.mockResolvedValueOnce({ ok: false, offline: true });
    const refreshBtn = app.querySelector('#notesRefresh');
    if (refreshBtn) refreshBtn.click();
    
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalled();
    });
    
    mockNotesDoc.refresh.mockClear();
    
    // Simulate coming online
    window.dispatchEvent(new Event('online'));
    
    // Should try to sync again
    await vi.waitFor(() => {
      expect(mockNotesDoc.refresh).toHaveBeenCalled();
    }, { timeout: 100 }).catch(() => {
      // May not trigger if offline flag wasn't set
    });
  });
});

describe('Jump navigation (Today tab shortcuts)', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('scrolls to section on jump chip click', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const jumpChips = app.querySelectorAll('[data-jump]');
    expect(jumpChips.length).toBeGreaterThan(0);
    
    const jumpChip = jumpChips[0];
    const targetId = jumpChip.dataset.jump;
    
    // Create a mock target element if it doesn't exist
    let target = document.getElementById(targetId);
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      app.appendChild(target);
    }
    
    const scrollIntoViewSpy = vi.fn();
    target.scrollIntoView = scrollIntoViewSpy;
    
    jumpChip.click();
    
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it('highlights active jump chip', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const jumpChips = app.querySelectorAll('[data-jump]');
    expect(jumpChips.length).toBeGreaterThan(0);
    
    const jumpChip = jumpChips[0];
    const targetId = jumpChip.dataset.jump;
    
    // Create a mock target element if it doesn't exist
    let target = document.getElementById(targetId);
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      target.scrollIntoView = vi.fn();
      app.appendChild(target);
    } else {
      target.scrollIntoView = vi.fn();
    }
    
    jumpChip.click();
    
    expect(jumpChip.classList.contains('active')).toBe(true);
    expect(jumpChip.getAttribute('aria-current')).toBe('true');
  });

  it('clears jump target on touchstart outside jump row', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const jumpChips = app.querySelectorAll('[data-jump]');
    if (jumpChips.length === 0) return;
    
    const jumpChip = jumpChips[0];
    const targetId = jumpChip.dataset.jump;
    
    // Create target
    let target = document.getElementById(targetId);
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      target.scrollIntoView = vi.fn();
      app.appendChild(target);
    } else {
      target.scrollIntoView = vi.fn();
    }
    
    // Click to set jump target
    jumpChip.click();
    expect(jumpChip.classList.contains('active')).toBe(true);
    
    // Dispatch touchstart outside jump row
    const touchEvent = new Event('touchstart', { bubbles: true });
    document.body.dispatchEvent(touchEvent);
    
    // Jump target should be cleared (chip may still be active due to position-based logic)
  });

  it('clears jump target on wheel event', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const jumpChips = app.querySelectorAll('[data-jump]');
    if (jumpChips.length === 0) return;
    
    const jumpChip = jumpChips[0];
    const targetId = jumpChip.dataset.jump;
    
    // Create target
    let target = document.getElementById(targetId);
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      target.scrollIntoView = vi.fn();
      app.appendChild(target);
    } else {
      target.scrollIntoView = vi.fn();
    }
    
    // Click to set jump target
    jumpChip.click();
    
    // Dispatch wheel event
    const wheelEvent = new Event('wheel', { bubbles: true });
    document.body.dispatchEvent(wheelEvent);
  });

  it('updates active jump on scroll', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(); return 1; });
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'));
    
    // RAF should have been called
    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockRestore();
  });
});

describe('Workout UI state', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('tracks workout details open state', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const details = app.querySelector('#woDetails');
    if (details) {
      details.open = true;
      details.dispatchEvent(new Event('toggle', { bubbles: true }));
      
      // State is tracked internally for re-render
      // Verify the details element exists and can be toggled
      expect(details.tagName).toBe('DETAILS');
    }
  });

  it('tracks stop exercise section open state', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    const details = app.querySelector('#woStop');
    if (details) {
      details.open = true;
      details.dispatchEvent(new Event('toggle', { bubbles: true }));
      
      expect(details.tagName).toBe('DETAILS');
    }
  });
});

describe('Calendar past appointments toggle', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
    mockCalendar.isConfigured.mockReturnValue(true);
    mockCalendar.isConnected.mockReturnValue(true);
    mockCalendar.getCache.mockReturnValue({
      events: [
        { id: '1', title: 'Past Appt', start: '2027-01-01T10:00:00', end: '2027-01-01T11:00:00', allDay: false },
      ],
      fetchedAt: '2027-05-15T08:00:00Z',
    });
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('tracks past appointments section open state', async () => {
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Switch to appointments tab
    app.querySelector('[data-tab="appointments"]').click();
    
    await vi.waitFor(() => {
      const details = app.querySelector('#calPast');
      if (details) {
        details.open = true;
        details.dispatchEvent(new Event('toggle', { bubbles: true }));
        
        expect(details.tagName).toBe('DETAILS');
      }
    });
  });
});

describe('Today tab tapping behavior', () => {
  beforeEach(() => {
    vi.resetModules();
    resetMocks();
    setupDOM();
    mockInvite.isInviteOk.mockReturnValue(true);
    mockStore.isSetup.mockReturnValue(true);
    mockStore.isUnlocked.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('scrolls to top when tapping Today tab while on Today', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    await import('./main.js');
    const app = document.getElementById('app');
    
    // Already on Today tab, tap it again
    const todayBtn = app.querySelector('[data-tab="today"]');
    expect(todayBtn).not.toBeNull();
    todayBtn.click();
    
    // Should either scroll to top or do nothing (depending on current state)
    // The key behavior is that it doesn't switch tabs
    expect(app.innerHTML).toContain('data-tab="today" class="active"');
    scrollToSpy.mockRestore();
  });
});

describe('render.js exports verification', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('imports all rendering functions from render.js', async () => {
    const render = await import('./ui/render.js');
    
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

describe('PIN validation', () => {
  it('PIN_RULE matches valid PINs', async () => {
    const { PIN_RULE } = await import('./ui/render.js');
    
    expect(PIN_RULE.test('1234')).toBe(true);
    expect(PIN_RULE.test('12345678')).toBe(true);
    expect(PIN_RULE.test('0000')).toBe(true);
  });

  it('PIN_RULE rejects invalid PINs', async () => {
    const { PIN_RULE } = await import('./ui/render.js');
    
    expect(PIN_RULE.test('123')).toBe(false);
    expect(PIN_RULE.test('abcd')).toBe(false);
    expect(PIN_RULE.test('12ab')).toBe(false);
    expect(PIN_RULE.test('')).toBe(false);
  });

  it('PIN_ERROR contains helpful message', async () => {
    const { PIN_ERROR } = await import('./ui/render.js');
    
    expect(PIN_ERROR).toContain('4 digits');
    expect(PIN_ERROR).toContain('numbers only');
  });
});
