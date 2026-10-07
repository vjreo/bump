/** Gentle daily movement suggestions — complementary to gym, pregnancy-safe tone. */

export const MOVEMENTS = [
  { type: 'walk', title: 'Neighborhood stroll', detail: '10–15 minutes at an easy pace. Fresh air counts.' },
  { type: 'walk', title: 'After-meal walk', detail: 'A short loop after lunch can ease bloating and stiffness.' },
  { type: 'walk', title: 'Park path', detail: 'Slow walk somewhere pleasant. Stop whenever you want.' },
  { type: 'stretch', title: 'Cat–cow stretch', detail: 'On hands and knees, gently arch and round. Breathe slowly.' },
  { type: 'stretch', title: 'Hip opener', detail: 'Seated figure-four or butterfly stretch — soft, no forcing.' },
  { type: 'stretch', title: 'Side body stretch', detail: 'Standing or seated, reach one arm overhead. Switch sides.' },
  { type: 'stretch', title: 'Neck & shoulder release', detail: 'Slow rolls and shrugs. Drop the shoulders away from ears.' },
  { type: 'strength', title: 'Wall push-ups', detail: '5–10 easy reps against a wall. Keep breathing steady.' },
  { type: 'strength', title: 'Sit-to-stand', detail: 'From a sturdy chair, stand and sit 6–8 times. Use hands if needed.' },
  { type: 'strength', title: 'Glute bridge (if comfortable)', detail: 'On your back if still okay, or side-lying squeeze. Skip if it doesn’t feel right.' },
  { type: 'strength', title: 'Band pull-aparts', detail: 'Light resistance band, open arms wide. Posture-friendly.' },
  { type: 'walk', title: 'Errand walk', detail: 'Park farther away or take one extra block. Keep it easy.' },
  { type: 'stretch', title: 'Child’s pose (wide knees)', detail: 'Knees apart, fold forward if comfortable. Rest your head.' },
  { type: 'strength', title: 'Calf raises', detail: 'Hold a counter, rise onto toes 10 times. Helps circulation.' },
];

/** Deterministic pick for a given YYYY-MM-DD so both phones match. */
export function suggestionForDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return MOVEMENTS[hash % MOVEMENTS.length];
}

export function randomSuggestion(excludeTitle) {
  const pool = MOVEMENTS.filter((m) => m.title !== excludeTitle);
  return pool[Math.floor(Math.random() * pool.length)] || MOVEMENTS[0];
}
