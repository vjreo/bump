import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as store from './store.js';

describe('store module', () => {
  const TEST_PIN = '1234';
  const TEST_DUE_DATE = '2027-01-15';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('constants', () => {
    it('exports water goal constants', () => {
      expect(store.DEFAULT_WATER_GOAL_OZ).toBe(80);
      expect(store.OZ_PER_GLASS).toBe(8);
      expect(store.WATER_GOAL_MIN).toBe(16);
      expect(store.WATER_GOAL_MAX).toBe(200);
    });
  });

  describe('load', () => {
    it('creates empty state when localStorage is empty', () => {
      const state = store.load();
      expect(state).toHaveProperty('household');
      expect(state).toHaveProperty('dailyLogs');
      expect(state).toHaveProperty('notes');
      expect(state).toHaveProperty('unlocked');
    });

    it('loads existing state from localStorage', () => {
      const savedState = {
        schemaVersion: 2,
        household: {
          id: 'test-id',
          pin: TEST_PIN,
          dueDate: TEST_DUE_DATE,
          createdAt: '2026-01-01T00:00:00Z',
          names: { partnerA: 'Vince', partnerB: 'Chantal' },
          waterGoalOz: 80,
        },
        dailyLogs: {},
        notes: [],
        unlocked: false,
        updatedAt: '2026-01-01T00:00:00Z',
      };
      localStorage.setItem('bump.v1', JSON.stringify(savedState));
      const state = store.load();
      expect(state.household.dueDate).toBe(TEST_DUE_DATE);
    });

    it('handles corrupt localStorage data', () => {
      localStorage.setItem('bump.v1', 'not-valid-json');
      const state = store.load();
      expect(state).toHaveProperty('household');
    });

    it('handles missing household in saved state', () => {
      localStorage.setItem('bump.v1', JSON.stringify({ notes: [] }));
      const state = store.load();
      expect(state.household).toBeDefined();
    });

    it('handles missing dailyLogs in saved state', () => {
      localStorage.setItem('bump.v1', JSON.stringify({ household: { pin: TEST_PIN } }));
      const state = store.load();
      expect(state.dailyLogs).toBeDefined();
    });
  });

  describe('migrations', () => {
    it('migrates v1 hydrationCount to v2 hydrationOz', () => {
      const v1State = {
        schemaVersion: 1,
        household: { pin: TEST_PIN, dueDate: TEST_DUE_DATE, names: {} },
        dailyLogs: {
          '2026-01-15': { date: '2026-01-15', hydrationCount: 5 },
        },
        notes: [],
        unlocked: false,
      };
      localStorage.setItem('bump.v1', JSON.stringify(v1State));
      store.load();
      const state = store.getState();
      expect(state.dailyLogs['2026-01-15'].hydrationOz).toBe(40);
      expect(state.dailyLogs['2026-01-15'].hydrationCount).toBeUndefined();
    });

    it('adds default waterGoalOz during migration', () => {
      const v1State = {
        schemaVersion: 1,
        household: { pin: TEST_PIN, dueDate: TEST_DUE_DATE, names: {} },
        dailyLogs: {},
        notes: [],
        unlocked: false,
      };
      localStorage.setItem('bump.v1', JSON.stringify(v1State));
      store.load();
      const state = store.getState();
      expect(state.household.waterGoalOz).toBe(store.DEFAULT_WATER_GOAL_OZ);
    });

    it('updates schemaVersion after migration', () => {
      const v1State = {
        schemaVersion: 1,
        household: { pin: TEST_PIN, dueDate: TEST_DUE_DATE, names: {} },
        dailyLogs: {},
        notes: [],
        unlocked: false,
      };
      localStorage.setItem('bump.v1', JSON.stringify(v1State));
      store.load();
      const state = store.getState();
      expect(state.schemaVersion).toBe(2);
    });
  });

  describe('getState', () => {
    it('returns current state', () => {
      store.load();
      const state = store.getState();
      expect(state).toHaveProperty('household');
      expect(state).toHaveProperty('dailyLogs');
    });

    it('loads state if not already loaded', () => {
      const state = store.getState();
      expect(state).toHaveProperty('household');
    });
  });

  describe('isSetup', () => {
    it('returns false when household has no PIN', () => {
      store.load();
      expect(store.isSetup()).toBe(false);
    });

    it('returns false when household has no due date', () => {
      store.load();
      store.getState().household.pin = TEST_PIN;
      expect(store.isSetup()).toBe(false);
    });

    it('returns true when household has both PIN and due date', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      expect(store.isSetup()).toBe(true);
    });
  });

  describe('isUnlocked', () => {
    it('returns false initially', () => {
      store.load();
      expect(store.isUnlocked()).toBe(false);
    });

    it('returns true after successful unlock', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      expect(store.isUnlocked()).toBe(true);
    });
  });

  describe('setupHousehold', () => {
    it('sets PIN and due date', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      const state = store.getState();
      expect(state.household.pin).toBe(TEST_PIN);
      expect(state.household.dueDate).toBe(TEST_DUE_DATE);
    });

    it('sets unlocked to true', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      expect(store.isUnlocked()).toBe(true);
    });

    it('persists to localStorage', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      const saved = JSON.parse(localStorage.getItem('bump.v1'));
      expect(saved.household.dueDate).toBe(TEST_DUE_DATE);
    });
  });

  describe('unlock', () => {
    beforeEach(() => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.lock();
    });

    it('returns true for correct PIN', () => {
      expect(store.unlock(TEST_PIN)).toBe(true);
    });

    it('returns false for incorrect PIN', () => {
      expect(store.unlock('0000')).toBe(false);
      expect(store.unlock('wrong')).toBe(false);
    });

    it('sets unlocked flag on success', () => {
      store.unlock(TEST_PIN);
      expect(store.isUnlocked()).toBe(true);
    });

    it('does not set unlocked flag on failure', () => {
      store.unlock('0000');
      expect(store.isUnlocked()).toBe(false);
    });

    it('handles null/undefined PIN', () => {
      expect(store.unlock(null)).toBe(false);
      expect(store.unlock(undefined)).toBe(false);
    });

    it('trims PIN before comparison', () => {
      expect(store.unlock(`  ${TEST_PIN}  `)).toBe(true);
    });
  });

  describe('lock', () => {
    it('sets unlocked to false', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      expect(store.isUnlocked()).toBe(true);
      store.lock();
      expect(store.isUnlocked()).toBe(false);
    });
  });

  describe('setDueDate', () => {
    it('updates due date', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.setDueDate('2027-02-15');
      expect(store.getState().household.dueDate).toBe('2027-02-15');
    });
  });

  describe('setPin', () => {
    it('updates PIN', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.setPin('5678');
      store.lock();
      expect(store.unlock('5678')).toBe(true);
      expect(store.unlock(TEST_PIN)).toBe(false);
    });

    it('trims PIN', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.setPin('  5678  ');
      store.lock();
      expect(store.unlock('5678')).toBe(true);
    });
  });

  describe('getTodayLog', () => {
    it('creates log entry for today if missing', () => {
      store.load();
      const log = store.getTodayLog();
      expect(log).toHaveProperty('date');
      expect(log).toHaveProperty('hydrationOz');
      expect(log).toHaveProperty('movementDone');
      expect(log).toHaveProperty('walkDone');
    });

    it('returns existing log entry', () => {
      store.load();
      const log1 = store.getTodayLog();
      log1.hydrationOz = 32;
      const log2 = store.getTodayLog();
      expect(log2.hydrationOz).toBe(32);
    });
  });

  describe('addWater', () => {
    beforeEach(() => {
      store.load();
    });

    it('adds water to today\'s log', () => {
      const log = store.addWater(8);
      expect(log.hydrationOz).toBe(8);
    });

    it('accumulates water', () => {
      store.addWater(8);
      store.addWater(16);
      const log = store.getTodayLog();
      expect(log.hydrationOz).toBe(24);
    });

    it('subtracts water with negative amount', () => {
      store.addWater(24);
      store.addWater(-8);
      const log = store.getTodayLog();
      expect(log.hydrationOz).toBe(16);
    });

    it('clamps to zero minimum', () => {
      store.addWater(8);
      store.addWater(-100);
      const log = store.getTodayLog();
      expect(log.hydrationOz).toBe(0);
    });
  });

  describe('getWaterGoal', () => {
    it('returns default goal when not set', () => {
      store.load();
      expect(store.getWaterGoal()).toBe(store.DEFAULT_WATER_GOAL_OZ);
    });

    it('returns custom goal when set', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.setWaterGoal(100);
      expect(store.getWaterGoal()).toBe(100);
    });
  });

  describe('setWaterGoal', () => {
    beforeEach(() => {
      store.load();
    });

    it('accepts valid goal', () => {
      expect(store.setWaterGoal(64)).toBe(true);
      expect(store.getWaterGoal()).toBe(64);
    });

    it('rejects goal below minimum', () => {
      expect(store.setWaterGoal(8)).toBe(false);
    });

    it('rejects goal above maximum', () => {
      expect(store.setWaterGoal(300)).toBe(false);
    });

    it('rejects non-integer goals', () => {
      expect(store.setWaterGoal(64.5)).toBe(false);
    });

    it('rejects NaN', () => {
      expect(store.setWaterGoal(NaN)).toBe(false);
    });
  });

  describe('setWorkoutDone', () => {
    beforeEach(() => {
      store.load();
    });

    it('marks workout as done', () => {
      store.setWorkoutDone(true, 'lower');
      const log = store.getTodayLog();
      expect(log.movementDone).toBe(true);
      expect(log.workoutId).toBe('lower');
    });

    it('unmarks workout', () => {
      store.setWorkoutDone(true, 'lower');
      store.setWorkoutDone(false);
      const log = store.getTodayLog();
      expect(log.movementDone).toBe(false);
      expect(log.workoutId).toBe(null);
    });
  });

  describe('setWalkDone', () => {
    beforeEach(() => {
      store.load();
    });

    it('marks walk as done', () => {
      store.setWalkDone(true);
      const log = store.getTodayLog();
      expect(log.walkDone).toBe(true);
    });

    it('unmarks walk', () => {
      store.setWalkDone(true);
      store.setWalkDone(false);
      const log = store.getTodayLog();
      expect(log.walkDone).toBe(false);
    });
  });

  describe('notes', () => {
    beforeEach(() => {
      store.load();
    });

    it('listNotes returns empty array initially', () => {
      expect(store.listNotes()).toEqual([]);
    });

    it('clearLocalNotes clears notes', () => {
      store.getState().notes.push({ body: 'Test', createdAt: new Date().toISOString() });
      store.clearLocalNotes();
      expect(store.listNotes()).toEqual([]);
    });
  });

  describe('exportJSON', () => {
    it('exports household data without PIN', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      const json = store.exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.household.dueDate).toBe(TEST_DUE_DATE);
      expect(parsed.household.pin).toBeUndefined();
    });

    it('includes daily logs', () => {
      store.load();
      store.addWater(16);
      const json = store.exportJSON();
      const parsed = JSON.parse(json);
      expect(Object.keys(parsed.dailyLogs).length).toBeGreaterThan(0);
    });

    it('includes app name and schema version', () => {
      store.load();
      const json = store.exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.app).toBe('bump-tracker');
      expect(parsed.schemaVersion).toBe(2);
    });
  });

  describe('resetAll', () => {
    it('clears localStorage and resets state', () => {
      store.load();
      store.setupHousehold({ pin: TEST_PIN, dueDate: TEST_DUE_DATE });
      store.resetAll();
      expect(store.isSetup()).toBe(false);
      expect(store.isUnlocked()).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles localStorage quota exceeded silently', () => {
      store.load();
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };
      expect(() => store.addWater(8)).not.toThrow();
      localStorage.setItem = originalSetItem;
    });

    it('handles invalid waterGoalOz in state', () => {
      const state = {
        schemaVersion: 2,
        household: { pin: TEST_PIN, dueDate: TEST_DUE_DATE, waterGoalOz: 'invalid' },
        dailyLogs: {},
        notes: [],
        unlocked: false,
      };
      localStorage.setItem('bump.v1', JSON.stringify(state));
      store.load();
      expect(store.getWaterGoal()).toBe(store.DEFAULT_WATER_GOAL_OZ);
    });

    it('listNotes sorts by date descending', () => {
      store.load();
      const state = store.getState();
      state.notes = [
        { body: 'Old', createdAt: '2026-01-01T00:00:00Z' },
        { body: 'New', createdAt: '2026-12-01T00:00:00Z' },
        { body: 'Middle', createdAt: '2026-06-01T00:00:00Z' },
      ];
      const notes = store.listNotes();
      expect(notes[0].body).toBe('New');
      expect(notes[1].body).toBe('Middle');
      expect(notes[2].body).toBe('Old');
    });
  });
});
