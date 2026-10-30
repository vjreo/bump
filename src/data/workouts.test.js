import { describe, it, expect } from 'vitest';
import {
  workoutFor,
  walkFor,
  SESSIONS,
  WALKS,
  SUPINE_SWAP_WEEK,
  THIRD_TRIMESTER_WEEK,
  LOADS,
  LOAD_GUIDE,
  EFFORT_LINE,
  INTENSITY_LINE,
  STOP_SIGNS,
  CHECK_WITH_OB,
} from './workouts.js';

describe('workouts data', () => {
  describe('constants', () => {
    it('has correct supine swap week', () => {
      expect(SUPINE_SWAP_WEEK).toBe(16);
    });

    it('has correct third trimester week', () => {
      expect(THIRD_TRIMESTER_WEEK).toBe(28);
    });

    it('has expected load types', () => {
      expect(LOADS).toHaveProperty('bodyweight');
      expect(LOADS).toHaveProperty('light');
      expect(LOADS).toHaveProperty('moderate');
    });

    it('has safety guidance strings', () => {
      expect(LOAD_GUIDE).toBeTruthy();
      expect(EFFORT_LINE).toBeTruthy();
      expect(INTENSITY_LINE).toBeTruthy();
      expect(CHECK_WITH_OB).toBeTruthy();
    });

    it('has stop signs list', () => {
      expect(Array.isArray(STOP_SIGNS)).toBe(true);
      expect(STOP_SIGNS.length).toBeGreaterThan(0);
      expect(STOP_SIGNS).toContain('Vaginal bleeding');
      expect(STOP_SIGNS).toContain('Dizziness');
    });
  });

  describe('SESSIONS', () => {
    it('has 5 sessions', () => {
      expect(SESSIONS.length).toBe(5);
    });

    it('each session has required fields', () => {
      for (const session of SESSIONS) {
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('name');
        expect(session).toHaveProperty('minutes');
        expect(session).toHaveProperty('t3Minutes');
        expect(session).toHaveProperty('warmup');
        expect(session).toHaveProperty('strength');
        expect(session).toHaveProperty('mobility');
        expect(Array.isArray(session.warmup)).toBe(true);
        expect(Array.isArray(session.strength)).toBe(true);
        expect(Array.isArray(session.mobility)).toBe(true);
      }
    });

    it('third trimester minutes are shorter', () => {
      for (const session of SESSIONS) {
        expect(session.t3Minutes).toBeLessThanOrEqual(session.minutes);
      }
    });
  });

  describe('WALKS', () => {
    it('has 7 walks (one for each day)', () => {
      expect(WALKS.length).toBe(7);
    });

    it('each walk has required fields', () => {
      for (const walk of WALKS) {
        expect(walk).toHaveProperty('id');
        expect(walk).toHaveProperty('name');
        expect(walk).toHaveProperty('dose');
        expect(walk).toHaveProperty('cue');
      }
    });
  });

  describe('workoutFor', () => {
    it('returns workout with expected shape', () => {
      const workout = workoutFor('2026-05-15', 20);
      expect(workout).toHaveProperty('id');
      expect(workout).toHaveProperty('name');
      expect(workout).toHaveProperty('minutes');
      expect(workout).toHaveProperty('notes');
      expect(workout).toHaveProperty('warmup');
      expect(workout).toHaveProperty('strength');
      expect(workout).toHaveProperty('mobility');
    });

    it('rotates through sessions deterministically', () => {
      const w1 = workoutFor('2026-05-15', 20);
      const w2 = workoutFor('2026-05-16', 20);
      const w3 = workoutFor('2026-05-17', 20);

      // Each day should get a different session (in rotation)
      expect(w1.id).not.toBe(w2.id);
      expect(w2.id).not.toBe(w3.id);
    });

    it('returns same workout for same date', () => {
      const w1 = workoutFor('2026-05-15', 20);
      const w2 = workoutFor('2026-05-15', 20);
      expect(w1.id).toBe(w2.id);
    });

    it('exercises have resolved move data', () => {
      const workout = workoutFor('2026-05-15', 20);
      for (const move of [...workout.warmup, ...workout.strength, ...workout.mobility]) {
        expect(move).toHaveProperty('id');
        expect(move).toHaveProperty('name');
        expect(move).toHaveProperty('dose');
        expect(move).toHaveProperty('cue');
        expect(move).toHaveProperty('loadKey');
        expect(move).toHaveProperty('loadLabel');
      }
    });

    it('adds supine swap note after week 16', () => {
      const beforeSwap = workoutFor('2026-05-15', 15);
      const afterSwap = workoutFor('2026-05-15', 16);

      expect(beforeSwap.notes.some((n) => n.includes('lying flat'))).toBe(false);
      expect(afterSwap.notes.some((n) => n.includes('lying flat'))).toBe(true);
    });

    it('adds third trimester note at week 28+', () => {
      const week27 = workoutFor('2026-05-15', 27);
      const week28 = workoutFor('2026-05-15', 28);

      expect(week27.notes.some((n) => n.includes('3rd trimester'))).toBe(false);
      expect(week28.notes.some((n) => n.includes('3rd trimester'))).toBe(true);
    });

    it('uses shorter minutes in third trimester', () => {
      const week20 = workoutFor('2026-05-15', 20);
      const week30 = workoutFor('2026-05-15', 30);

      expect(week30.minutes).toBeLessThanOrEqual(week20.minutes);
    });
  });

  describe('walkFor', () => {
    it('returns walk with expected shape', () => {
      const walk = walkFor('2026-05-15', 20);
      expect(walk).toHaveProperty('id');
      expect(walk).toHaveProperty('name');
      expect(walk).toHaveProperty('dose');
      expect(walk).toHaveProperty('cue');
      expect(walk).toHaveProperty('tip');
    });

    it('returns different walks for different days of week', () => {
      const sunday = walkFor('2026-05-10', 20);
      const monday = walkFor('2026-05-11', 20);
      expect(sunday.id).not.toBe(monday.id);
    });

    it('returns same walk for same day of week', () => {
      const w1 = walkFor('2026-05-10', 20); // Sunday
      const w2 = walkFor('2026-05-17', 20); // Also Sunday
      expect(w1.id).toBe(w2.id);
    });

    it('applies third trimester overrides at week 28+', () => {
      const week20 = walkFor('2026-05-10', 20); // Sunday - long walk
      const week30 = walkFor('2026-05-10', 30);

      // Third trimester walks should be shorter
      expect(week30.tip).toContain('Flat routes');
    });

    it('uses regular tip before third trimester', () => {
      const week20 = walkFor('2026-05-10', 20);
      expect(week20.tip).toContain('cooler part');
    });
  });
});
