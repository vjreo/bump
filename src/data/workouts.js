/**
 * Daily 10–15 min workout (kettlebell + bodyweight) plus a daily walk, for a healthy, uncomplicated pregnancy.
 *
 * Guidance this follows (not medical advice; check with the OB/midwife before starting):
 * - ACOG Committee Opinion No. 804, "Physical Activity and Exercise During Pregnancy and the
 *   Postpartum Period" (Obstet Gynecol 2020;135:e178–88; still ACOG's current committee opinion):
 *   https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period
 *   · Encourages aerobic AND strength-conditioning exercise in uncomplicated pregnancies.
 *   · Monitor intensity with RPE 13–14 ("somewhat hard", Borg 6–20) or the talk test.
 *   · Avoid long periods lying flat on the back (supine after ~20 weeks can lower venous return).
 *   · Avoid contact / high fall-risk activities; stay hydrated and avoid overheating.
 *   · Warning signs to stop: see STOP_SIGNS below (ACOG Box 3).
 * - ACOG patient FAQ "Exercise During Pregnancy" (reviewed Nov 2025):
 *   https://www.acog.org/womens-health/faqs/exercise-during-pregnancy
 *
 *   · Walking is a recommended low-risk aerobic activity (goal: ~150 min/week of moderate activity).
 *
 * Conservative choices made here: supine moves are swapped from SUPINE_SWAP_WEEK (16, earlier than
 * ACOG's 20), no crunch-style ab work or deep twisting, no jumping or ballistic lifts, exhale on
 * effort (no breath-holding / heavy Valsalva), lighter loads + more support in the 3rd trimester,
 * and 3rd-trimester walks are shorter and flat (no hills/stairs), with hydration and heat cautions.
 *
 * ---- Everything tunable lives in this file. ----
 * Kettlebell weights are relative on purpose until specific numbers are provided: edit LOADS.
 */

/**
 * From this week on, moves done lying flat on the back (or face-down on the floor) use their
 * `from16` swap: incline, side-lying, or hands-elevated versions.
 */
export const SUPINE_SWAP_WEEK = 16;
/** US trimester boundaries (match trimesterForWeek in utils/dates.js). */
export const THIRD_TRIMESTER_WEEK = 28;

/** Relative kettlebell loads. Replace text (or add kg) here when exact weights are known. */
export const LOADS = {
  bodyweight: 'bodyweight',
  light: 'light KB',
  moderate: 'moderate KB',
};
/** In the 3rd trimester, loads step down one level. */
export const THIRD_TRIMESTER_LOAD = { moderate: 'light', light: 'light' };

export const LOAD_GUIDE =
  'Choose a kettlebell you can lift with good form and steady breathing, finishing each set with 2–3 reps left in the tank. Rest about 30–45 sec between sets.';
/** Always-visible one-liner on the card (ACOG: talk test / RPE 13–14, "somewhat hard"). */
export const EFFORT_LINE = 'Somewhat hard, but you can still talk.';
/** Fuller intensity guidance, shown in the expanded details. */
export const INTENSITY_LINE =
  'Aim for “somewhat hard” (RPE 13–14): you can still talk in full sentences. Exhale on the effort — no breath-holding. Sip water and stay cool.';
export const CHECK_WITH_OB = 'Check with your OB or midwife before starting or changing your routine.';

/** ACOG CO 804, Box 3: warning signs to discontinue exercise while pregnant. */
export const STOP_SIGNS = [
  'Vaginal bleeding',
  'Abdominal pain',
  'Regular painful contractions',
  'Fluid leaking from the vagina',
  'Shortness of breath before you start exercising',
  'Dizziness',
  'Headache',
  'Chest pain',
  'Muscle weakness affecting balance',
  'Calf pain or swelling',
];

/**
 * Exercise library. Each move: name, short (optional, for the one-line summary), dose,
 * load (key of LOADS), cue. Optional overrides: `from16` (week ≥ SUPINE_SWAP_WEEK) and
 * `t3` (week ≥ THIRD_TRIMESTER_WEEK).
 */
const EX = {
  // Warm-up (1–2 min total per session)
  catCow: { name: 'Cat–cow', dose: '6 slow reps', load: 'bodyweight', cue: 'Exhale as you round, inhale as you lengthen.' },
  hipCircles: { name: 'Standing hip circles', dose: '5 each direction', load: 'bodyweight', cue: 'Hands on hips, smooth circles; hold a wall if you like.' },
  airSquat: { name: 'Bodyweight squat', dose: '8 reps', load: 'bodyweight', cue: 'Easy range to wake up hips and knees.', t3: { name: 'Squat to chair', cue: 'Tap a chair lightly each rep.' } },
  armCircles: { name: 'Arm circles + wall angels', dose: '30 sec', load: 'bodyweight', cue: 'Back against a wall, slide arms up and down without arching.' },
  breathing: { name: '360° breathing', dose: '5 breaths', load: 'bodyweight', cue: 'Seated tall: inhale into ribs and belly, exhale and gently lift the pelvic floor.' },

  // Strength
  gobletSquat: {
    name: 'Goblet squat', dose: '2 × 8', load: 'moderate',
    cue: 'Bell at your chest, sit between your heels, exhale as you stand.',
    t3: { name: 'Goblet squat to box', short: 'Box squat', dose: '2 × 6', cue: 'Sit back to a box or chair; comfortable depth and stance width.' },
  },
  kbRdl: {
    name: 'Kettlebell Romanian deadlift', short: 'KB RDL', dose: '2 × 10', load: 'moderate',
    cue: 'Soft knees, hinge at the hips with a long spine; squeeze glutes to stand.',
    t3: { dose: '2 × 8', cue: 'Wider stance to make room for the bump; stop where your back stays flat.' },
  },
  kbDeadlift: {
    name: 'Kettlebell deadlift', short: 'KB deadlift', dose: '2 × 10', load: 'moderate',
    cue: 'Bell between your feet, hinge and stand tall; exhale on the way up.',
    t3: { dose: '2 × 8', cue: 'Wider stance; elevate the bell on a step if reaching the floor is awkward.' },
  },
  reverseLunge: {
    name: 'Reverse lunge', dose: '2 × 6 each side', load: 'bodyweight',
    cue: 'Step back softly, front knee over mid-foot; hold a light KB at your chest if steady.',
    t3: { name: 'Supported split squat', short: 'Split squat', cue: 'Stay in a split stance holding a wall or chair; no stepping, for balance.' },
  },
  gluteBridge: {
    name: 'Glute bridge', dose: '2 × 12', load: 'light',
    cue: 'Bell on your hips, press through heels, pause at the top.',
    from16: { name: 'Shoulders-elevated hip thrust', short: 'Hip thrust', cue: 'Upper back on a couch or bench (not flat on the floor); bell on your hips.' },
    t3: { dose: '2 × 10' },
  },
  clamshell: {
    name: 'Side-lying clamshell', short: 'Clamshell', dose: '2 × 12 each side', load: 'bodyweight',
    cue: 'Lying on your side, knees bent, open the top knee without rolling back.',
    t3: { dose: '2 × 10 each side', cue: 'Pillow under the bump and between the knees if comfier.' },
  },
  suitcaseCarry: {
    name: 'Suitcase carry', dose: '2 × 20 sec each side', load: 'moderate',
    cue: 'Bell in one hand, walk tall without leaning.',
    t3: { dose: '2 × 15 sec each side' },
  },
  farmerCarry: {
    name: 'Kettlebell carry', short: 'KB carry', dose: '2 × 30 sec', load: 'moderate',
    cue: 'Walk tall, ribs stacked over hips, steady breathing.',
    t3: { dose: '2 × 20 sec' },
  },
  kbRow: {
    name: 'Single-arm kettlebell row', short: 'KB row', dose: '2 × 10 each side', load: 'moderate',
    cue: 'Hand on a bench or chair, pull the bell toward your hip.',
    t3: { dose: '2 × 8 each side', cue: 'Staggered stance with your hand on a counter; back flat, bump supported.' },
  },
  floorPress: {
    name: 'Kettlebell floor press', short: 'Floor press', dose: '2 × 10 each side', load: 'moderate',
    cue: 'Lying on your back, press the bell up; elbow lightly touches the floor.',
    from16: { name: 'Incline kettlebell press', short: 'Incline press', cue: 'Back propped at about 45° on a couch or wedge, then press.' },
    t3: { dose: '2 × 8 each side' },
  },
  halo: {
    name: 'Kettlebell halo', short: 'Halo', dose: '2 × 6 each direction', load: 'light',
    cue: 'Circle the bell around your head; keep ribs down and core quiet.',
    t3: { name: 'Seated kettlebell halo', short: 'Seated halo', dose: '2 × 5 each direction' },
  },
  pushup: {
    name: 'Push-up', dose: '2 × 8', load: 'bodyweight',
    cue: 'Hands under shoulders, body in one line; use knees if needed.',
    from16: { name: 'Incline push-up', cue: 'Hands on a bench or counter so the bump stays clear of the floor.' },
    t3: { dose: '2 × 6', cue: 'Hands on a counter or wall; keep a straight line.' },
  },
  birdDog: {
    name: 'Bird dog', dose: '2 × 6 each side', load: 'bodyweight',
    cue: 'On hands and knees, reach opposite arm and leg; exhale as you reach.',
  },
  deadBug: {
    name: 'Dead bug', dose: '2 × 6 each side', load: 'bodyweight',
    cue: 'On your back, lower opposite arm and leg slowly; back stays heavy.',
    from16: { name: 'Incline dead bug', cue: 'Propped at about 45° on a couch or wedge (not flat), slowly extend opposite arm and leg.' },
  },
  sidePlank: {
    name: 'Side plank (from knees)', short: 'Side plank', dose: '2 × 15 sec each side', load: 'bodyweight',
    cue: 'Elbow under shoulder, hips lifted; stop if you feel belly doming.',
    t3: { name: 'Side-lying leg lift', short: 'Side leg lift', dose: '2 × 10 each side', cue: 'Lying on your side with a pillow under the bump, lift the top leg slowly.' },
  },

  // Flexibility / mobility
  hipFlexor: { name: 'Half-kneeling hip flexor stretch', short: 'Hip flexor stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Tuck the pelvis slightly; pad under the knee.' },
  ninetyNinety: { name: '90/90 hip switches', short: '90/90 hips', dose: '5 each side', load: 'bodyweight', cue: 'Seated, rotate knees side to side; hands behind you for support.' },
  figureFour: { name: 'Seated figure-four stretch', short: 'Figure-four', dose: '30 sec each side', load: 'bodyweight', cue: 'Ankle over opposite knee, sit tall and lean gently.' },
  childsPose: { name: 'Wide-knee child’s pose', short: 'Child’s pose', dose: '45 sec', load: 'bodyweight', cue: 'Knees wide to make room for the bump; rest your head on your hands.' },
  doorwayChest: { name: 'Doorway chest stretch', short: 'Chest stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Forearm on the frame, step through gently.' },
  sideReach: { name: 'Standing side-body reach', short: 'Side reach', dose: '4 each side', load: 'bodyweight', cue: 'Reach up and over with a long exhale.' },
  hamstringStretch: { name: 'Standing hamstring stretch', short: 'Hamstring stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Heel on a low step, hinge forward with a long spine.' },
};

/**
 * Sessions rotate in this order, one per day (same on both phones): 2 sets each, ~30–45 sec rest.
 * `minutes` = total incl. the 1–2 min warm-up (10–15); `t3Minutes` = 3rd-trimester total (10–12).
 */
export const SESSIONS = [
  { id: 'lower', name: 'Lower body strength', minutes: 12, t3Minutes: 10,
    warmup: ['hipCircles', 'airSquat'], strength: ['gobletSquat', 'kbRdl', 'reverseLunge'], mobility: ['hipFlexor'] },
  { id: 'upper', name: 'Upper body & back', minutes: 12, t3Minutes: 10,
    warmup: ['armCircles', 'catCow'], strength: ['kbRow', 'floorPress', 'halo'], mobility: ['doorwayChest'] },
  { id: 'core', name: 'Core & mobility', minutes: 12, t3Minutes: 10,
    warmup: ['breathing', 'catCow'], strength: ['birdDog', 'sidePlank', 'deadBug'], mobility: ['ninetyNinety', 'childsPose'] },
  { id: 'full', name: 'Full body strength', minutes: 14, t3Minutes: 12,
    warmup: ['catCow', 'airSquat'], strength: ['kbDeadlift', 'pushup', 'farmerCarry'], mobility: ['hamstringStretch', 'sideReach'] },
  { id: 'glutes', name: 'Glutes & hips', minutes: 12, t3Minutes: 10,
    warmup: ['catCow', 'hipCircles'], strength: ['gluteBridge', 'clamshell', 'suitcaseCarry'], mobility: ['figureFour', 'childsPose'] },
];

/**
 * Daily walk, by day of the week (index 0 = Sunday), alongside the workout.
 * `t3` overrides apply from THIRD_TRIMESTER_WEEK: shorter, flat routes, no hills or stairs.
 */
export const WALKS = [
  { id: 'long', name: 'Long relaxed walk', dose: '30–40 min', cue: 'Unhurried weekend pace; bring water and company.',
    t3: { dose: '20–30 min', cue: 'Flat route with places to sit; turn back when you’re tired.' } },
  { id: 'easy', name: 'Easy walk', dose: '15–20 min', cue: 'Comfortable pace to loosen up.', t3: { dose: '15 min' } },
  { id: 'brisk', name: 'Brisk walk', dose: '20 min', cue: 'Talk-test pace: you can chat but not sing.',
    t3: { name: 'Steady walk', dose: '15 min', cue: 'Comfortable pace; slow down if you get breathless.' } },
  { id: 'meal', name: 'After-meal stroll', dose: '10 min', cue: 'A gentle stroll after lunch or dinner helps digestion.' },
  { id: 'hills', name: 'Gentle hills or stairs', dose: '15–20 min', cue: 'A few easy inclines or flights of stairs, holding the rail; take downhill slowly.',
    t3: { name: 'Flat easy walk', dose: '15 min', cue: 'No hills or stairs now; stick to flat, even paths.' } },
  { id: 'split', name: 'Two short walks', dose: '2 × 10 min', cue: 'One in the morning, one in the evening.' },
  { id: 'weekend', name: 'Weekend walk somewhere new', dose: '30–40 min', cue: 'A park or waterfront path with even footing, at an easy pace.',
    t3: { dose: '20–30 min', cue: 'Flat, even path close to home, with places to rest.' } },
];
export const WALK_TIP = 'Go in the cooler part of the day and bring water.';
export const WALK_TIP_T3 = 'Flat routes and supportive shoes; bring water and skip the heat of the day.';

function applyOverride(move, o) {
  return { ...move, ...o, short: o.short || (o.name ? o.name : move.short), swapped: true };
}

function resolveMove(id, week) {
  const base = EX[id];
  let move = { id, name: base.name, short: base.short || base.name, dose: base.dose, load: base.load, cue: base.cue };
  if (week >= SUPINE_SWAP_WEEK && base.from16) move = applyOverride(move, base.from16);
  if (week >= THIRD_TRIMESTER_WEEK && base.t3) move = applyOverride(move, base.t3);
  let loadKey = move.load;
  if (week >= THIRD_TRIMESTER_WEEK && THIRD_TRIMESTER_LOAD[loadKey]) loadKey = THIRD_TRIMESTER_LOAD[loadKey];
  return { ...move, loadKey, loadLabel: LOADS[loadKey] };
}

function utcDay(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Days since 2026-01-01 for a YYYY-MM-DD date (deterministic rotation index). */
function dayNumber(isoDate) {
  return Math.round((utcDay(isoDate) - Date.UTC(2026, 0, 1)) / 86400000);
}

/** The walk for a date (America/New_York YYYY-MM-DD) at a given pregnancy week. */
export function walkFor(isoDate, week) {
  const t3 = (Number(week) || 1) >= THIRD_TRIMESTER_WEEK;
  const { t3: t3Override, ...base } = WALKS[utcDay(isoDate).getUTCDay()];
  const walk = t3 && t3Override ? { ...base, ...t3Override } : base;
  return { ...walk, tip: t3 ? WALK_TIP_T3 : WALK_TIP };
}

/** The workout for a date (America/New_York YYYY-MM-DD) at a given pregnancy week. */
export function workoutFor(isoDate, week) {
  const n = SESSIONS.length;
  const session = SESSIONS[((dayNumber(isoDate) % n) + n) % n];
  const w = Number(week) || 1;
  const t3 = w >= THIRD_TRIMESTER_WEEK;
  const notes = [];
  if (w >= SUPINE_SWAP_WEEK) notes.push('No lying flat on your back: incline or side-lying swaps are built in.');
  if (t3) notes.push('3rd trimester: lighter loads, fewer reps, more support for balance.');
  return {
    id: session.id,
    name: session.name,
    minutes: t3 ? session.t3Minutes : session.minutes,
    notes,
    warmup: session.warmup.map((id) => resolveMove(id, w)),
    strength: session.strength.map((id) => resolveMove(id, w)),
    mobility: session.mobility.map((id) => resolveMove(id, w)),
  };
}
