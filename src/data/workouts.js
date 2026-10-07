/**
 * Daily workout library (kettlebell + bodyweight) for a healthy, uncomplicated pregnancy.
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
 * Conservative choices made here: supine moves are swapped from SUPINE_SWAP_WEEK (16, earlier than
 * ACOG's 20), no crunch-style ab work or deep twisting, no jumping or ballistic lifts, exhale on
 * effort (no breath-holding / heavy Valsalva), and lighter loads + more support in the 3rd trimester.
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
  'Choose a kettlebell you can lift with good form and steady breathing, finishing each set with 2–3 reps left in the tank.';
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
 * Exercise library. Each move: name, dose, load (key of LOADS), cue.
 * Optional overrides: `from16` (week ≥ SUPINE_SWAP_WEEK) and `t3` (week ≥ THIRD_TRIMESTER_WEEK).
 */
const EX = {
  // Warm-up
  catCow: { name: 'Cat–cow', dose: '8 slow reps', load: 'bodyweight', cue: 'Move with your breath: exhale as you round, inhale as you lengthen.' },
  hipCircles: { name: 'Standing hip circles', dose: '8 each direction', load: 'bodyweight', cue: 'Hands on hips, smooth circles; hold a wall if you like.' },
  airSquat: { name: 'Bodyweight squat', dose: '10 reps', load: 'bodyweight', cue: 'Easy range to wake up hips and knees.', t3: { name: 'Squat to chair', cue: 'Tap a chair lightly each rep.' } },
  armCircles: { name: 'Arm circles + wall angels', dose: '10 each', load: 'bodyweight', cue: 'Back against a wall, slide arms up and down without arching.' },
  breathing: { name: '360° breathing', dose: '6 breaths', load: 'bodyweight', cue: 'Seated tall: inhale into ribs and belly, exhale and gently lift the pelvic floor.' },
  marching: { name: 'Marching in place', dose: '2 min', load: 'bodyweight', cue: 'Light marching with easy overhead reaches to raise your temperature.' },

  // Strength
  gobletSquat: {
    name: 'Goblet squat', dose: '3 × 8–10', load: 'moderate',
    cue: 'Bell at your chest, sit between your heels, exhale as you stand.',
    t3: { name: 'Goblet squat to box', dose: '2–3 × 8', cue: 'Sit back to a box or chair; comfortable depth and stance width.' },
  },
  kbRdl: {
    name: 'Kettlebell Romanian deadlift', dose: '3 × 10', load: 'moderate',
    cue: 'Soft knees, hinge at the hips with a long spine; squeeze glutes to stand.',
    t3: { dose: '2–3 × 8', cue: 'Wider stance to make room for the bump; stop where your back stays flat.' },
  },
  kbDeadlift: {
    name: 'Kettlebell deadlift', dose: '3 × 10', load: 'moderate',
    cue: 'Bell between your feet, hinge and stand tall; exhale on the way up.',
    t3: { dose: '2–3 × 8', cue: 'Wider stance; elevate the bell on a step if reaching the floor is awkward.' },
  },
  reverseLunge: {
    name: 'Reverse lunge', dose: '3 × 8 each side', load: 'bodyweight',
    cue: 'Step back softly, front knee over mid-foot; hold a light KB at your chest if steady.',
    t3: { name: 'Supported split squat', dose: '2 × 8 each side', cue: 'Stay in a split stance holding a wall or chair; no stepping, for balance.' },
  },
  gluteBridge: {
    name: 'Glute bridge', dose: '3 × 12', load: 'light',
    cue: 'Bell on your hips, press through heels, pause at the top.',
    from16: { name: 'Shoulders-elevated hip thrust', cue: 'Upper back on a couch or bench (not flat on the floor); bell on your hips.' },
  },
  suitcaseCarry: {
    name: 'Suitcase carry', dose: '3 × 30 sec each side', load: 'moderate',
    cue: 'Bell in one hand, walk tall without leaning.',
    t3: { dose: '2 × 20 sec each side' },
  },
  farmerCarry: {
    name: 'Kettlebell carry', dose: '3 × 40 sec', load: 'moderate',
    cue: 'Walk tall, ribs stacked over hips, steady breathing.',
    t3: { dose: '2 × 30 sec' },
  },
  kbRow: {
    name: 'Single-arm kettlebell row', dose: '3 × 10 each side', load: 'moderate',
    cue: 'Hand on a bench or chair, pull the bell toward your hip.',
    t3: { cue: 'Staggered stance with your hand on a counter; keep the bump supported and back flat.' },
  },
  kbPress: {
    name: 'Half-kneeling kettlebell press', dose: '3 × 8 each side', load: 'light',
    cue: 'Ribs down, glute of the down knee squeezed, press overhead.',
    t3: { name: 'Seated kettlebell press', dose: '2 × 8 each side', cue: 'Sit tall on a bench or chair with back support; light bell.' },
  },
  floorPress: {
    name: 'Kettlebell floor press', dose: '3 × 10 each side', load: 'moderate',
    cue: 'Lying on your back, press the bell up; elbow lightly touches the floor.',
    from16: { name: 'Incline kettlebell press', cue: 'Back propped at about 45° on a couch or wedge, then press.' },
  },
  inclinePushup: {
    name: 'Push-up', dose: '3 × 8–10', load: 'bodyweight',
    cue: 'Hands under shoulders, body in one line; use knees if needed.',
    from16: { name: 'Incline push-up', cue: 'Hands on a bench or counter so the bump stays clear of the floor.' },
    t3: { name: 'Incline push-up', dose: '2–3 × 8', cue: 'Hands on a counter or wall; keep a straight line.' },
  },
  halo: {
    name: 'Kettlebell halo', dose: '3 × 6 each direction', load: 'light',
    cue: 'Circle the bell around your head; keep ribs down and core quiet.',
    t3: { name: 'Seated kettlebell halo', dose: '2 × 6 each direction' },
  },
  birdDog: {
    name: 'Bird dog', dose: '3 × 8 each side', load: 'bodyweight',
    cue: 'On hands and knees, reach opposite arm and leg; exhale as you reach.',
  },
  deadBug: {
    name: 'Dead bug', dose: '3 × 8 each side', load: 'bodyweight',
    cue: 'On your back, lower opposite arm and leg slowly; back stays heavy.',
    from16: { name: 'Incline dead bug', cue: 'Propped at about 45° on a couch or wedge (not flat), slowly extend opposite arm and leg.' },
  },
  sidePlank: {
    name: 'Side plank (from knees)', dose: '3 × 20 sec each side', load: 'bodyweight',
    cue: 'Elbow under shoulder, hips lifted; stop if you feel belly doming.',
    t3: { name: 'Side-lying clamshell', dose: '2 × 12 each side', cue: 'Lying on your side with knees bent, open the top knee; pillow under the bump.' },
  },
  briskWalk: {
    name: 'Brisk walk', dose: '15–20 min', load: 'bodyweight',
    cue: 'Talk-test pace: you can chat but not sing. Flat, even routes.',
  },
  squatPry: {
    name: 'Goblet hold squat pry', dose: '3 × 30 sec', load: 'light',
    cue: 'Hold a light bell at your chest in a comfortable squat; gently shift side to side.',
    t3: { name: 'Supported squat hold', cue: 'Hold a counter or doorframe in a comfortable squat.' },
  },

  // Flexibility / mobility
  hipFlexor: { name: 'Half-kneeling hip flexor stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Tuck the pelvis slightly; pad under the knee.' },
  ninetyNinety: { name: '90/90 hip switches', dose: '6 each side', load: 'bodyweight', cue: 'Seated, rotate knees side to side; hands behind you for support.' },
  figureFour: { name: 'Seated figure-four stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Ankle over opposite knee, sit tall and lean gently.' },
  childsPose: { name: 'Wide-knee child’s pose', dose: '45 sec', load: 'bodyweight', cue: 'Knees wide to make room for the bump; rest your head on your hands.' },
  doorwayChest: { name: 'Doorway chest stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Forearm on the frame, step through gently.' },
  threadNeedle: { name: 'Thread the needle (gentle)', dose: '5 each side', load: 'bodyweight', cue: 'Small, easy rotation from hands and knees — no forcing.' },
  neckStretch: { name: 'Neck and upper-trap stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Ear toward shoulder, opposite hand reaching down.' },
  sideReach: { name: 'Standing side-body reach', dose: '5 each side', load: 'bodyweight', cue: 'Reach up and over with a long exhale.' },
  calfStretch: { name: 'Wall calf stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Back heel down, lean into the wall.' },
  hamstringStretch: { name: 'Standing hamstring stretch', dose: '30 sec each side', load: 'bodyweight', cue: 'Heel on a low step, hinge forward with a long spine.' },
};

/** Sessions rotate in this order, one per day (same on both phones). */
export const SESSIONS = [
  {
    id: 'lower',
    name: 'Lower body strength',
    focus: 'Legs and glutes',
    minutes: 30,
    warmup: ['catCow', 'hipCircles', 'airSquat'],
    strength: ['gobletSquat', 'kbRdl', 'reverseLunge', 'gluteBridge', 'suitcaseCarry'],
    mobility: ['hipFlexor', 'ninetyNinety', 'figureFour'],
  },
  {
    id: 'upper',
    name: 'Upper body & back',
    focus: 'Back, shoulders, and posture',
    minutes: 30,
    warmup: ['armCircles', 'catCow', 'marching'],
    strength: ['kbRow', 'floorPress', 'kbPress', 'inclinePushup', 'halo'],
    mobility: ['doorwayChest', 'threadNeedle', 'neckStretch'],
  },
  {
    id: 'recovery',
    name: 'Active recovery',
    focus: 'Easy cardio and mobility',
    minutes: 25,
    warmup: ['marching'],
    strength: ['briskWalk', 'gluteBridge', 'birdDog', 'squatPry'],
    mobility: ['catCow', 'calfStretch', 'childsPose', 'sideReach'],
  },
  {
    id: 'full',
    name: 'Full body strength',
    focus: 'Hinge, squat, push, pull, carry',
    minutes: 35,
    warmup: ['catCow', 'airSquat', 'armCircles'],
    strength: ['kbDeadlift', 'gobletSquat', 'kbRow', 'inclinePushup', 'farmerCarry'],
    mobility: ['hamstringStretch', 'hipFlexor', 'sideReach'],
  },
  {
    id: 'core',
    name: 'Mobility & core stability',
    focus: 'Breathing, core control, and hips',
    minutes: 25,
    warmup: ['breathing', 'catCow'],
    strength: ['birdDog', 'deadBug', 'sidePlank', 'squatPry'],
    mobility: ['ninetyNinety', 'figureFour', 'childsPose', 'threadNeedle'],
  },
];

function resolveMove(id, week) {
  const base = EX[id];
  let move = { id, ...base };
  if (week >= SUPINE_SWAP_WEEK && base.from16) move = { ...move, ...base.from16, swapped: true };
  if (week >= THIRD_TRIMESTER_WEEK && base.t3) move = { ...move, ...base.t3, swapped: true };
  let loadKey = move.load;
  if (week >= THIRD_TRIMESTER_WEEK && THIRD_TRIMESTER_LOAD[loadKey]) loadKey = THIRD_TRIMESTER_LOAD[loadKey];
  delete move.from16;
  delete move.t3;
  return { ...move, loadKey, loadLabel: LOADS[loadKey] };
}

/** Days since 2026-01-01 for a YYYY-MM-DD date (deterministic rotation index). */
function dayNumber(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 0, 1)) / 86400000);
}

/** The workout for a date (America/New_York YYYY-MM-DD) at a given pregnancy week. */
export function workoutFor(isoDate, week) {
  const n = SESSIONS.length;
  const session = SESSIONS[((dayNumber(isoDate) % n) + n) % n];
  const w = Number(week) || 1;
  const notes = [];
  if (w >= SUPINE_SWAP_WEEK) notes.push('No lying flat on your back: incline or side-lying swaps are built in.');
  if (w >= THIRD_TRIMESTER_WEEK) notes.push('3rd trimester: lighter loads, fewer sets, more support for balance.');
  const minutes = w >= THIRD_TRIMESTER_WEEK ? Math.max(20, session.minutes - 5) : session.minutes;
  return {
    id: session.id,
    name: session.name,
    focus: session.focus,
    minutes,
    notes,
    warmup: session.warmup.map((id) => resolveMove(id, w)),
    strength: session.strength.map((id) => resolveMove(id, w)),
    mobility: session.mobility.map((id) => resolveMove(id, w)),
  };
}
