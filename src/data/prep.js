/**
 * Practical prep by pregnancy week (due-date week).
 * Short household checklists — not medical advice.
 */

const BANDS = [
  {
    from: 1,
    to: 7,
    title: 'Early days',
    thisWeek: [
      'Start or continue prenatal vitamins if your clinician advised them',
      'Note last period date for dating the pregnancy',
      'Ease off alcohol; keep a simple meds list for your first visit',
    ],
    comingUp: [
      'Book prenatal care / first OB or midwife visit',
      'Ask about bloodwork and genetic screening options',
    ],
  },
  {
    from: 8,
    to: 12,
    title: 'First trimester wrap',
    thisWeek: [
      'Confirm first prenatal appointment is on the calendar',
      'Bring insurance card + questions list to the visit',
      'Share the household PIN export path with your partner',
    ],
    comingUp: [
      'Discuss nuchal / early screening if offered',
      'Plan when (or if) to share news with family',
    ],
  },
  {
    from: 13,
    to: 17,
    title: 'Second trimester settle-in',
    thisWeek: [
      'Keep prenatal vitamins going',
      'Comfortable shoes + light daily walk if energy allows',
      'Add any follow-up labs to Appointments',
    ],
    comingUp: [
      'Anatomy scan usually booked ~18–22 weeks',
      'Gather insurance + ID for the scan day',
    ],
  },
  {
    from: 18,
    to: 22,
    title: 'Anatomy scan window',
    thisWeek: [
      'Confirm anatomy / mid-pregnancy scan details',
      'Pack insurance card, ID, and snack for the appointment',
      'Write questions (placenta, anatomy, next visits)',
    ],
    comingUp: [
      'Glucose screening often discussed mid–late 20s',
      'Start a soft list of baby-must-haves (no rush to buy)',
    ],
  },
  {
    from: 23,
    to: 27,
    title: 'Mid–late second trimester',
    thisWeek: [
      'Ask about glucose screening timing',
      'Balanced snacks: protein + complex carbs',
      'Note any kick patterns that feel new (optional log in Notes)',
    ],
    comingUp: [
      'Third-trimester visit cadence may increase',
      'If Rh-negative, ask about immune globulin timing (~28)',
    ],
  },
  {
    from: 28,
    to: 32,
    title: 'Third trimester gear-up',
    thisWeek: [
      'Confirm third-trimester appointment schedule',
      'Rh-negative? Check immune globulin shot timing',
      'One small prep task a day beats a nesting marathon',
    ],
    comingUp: [
      'Brainstorm hospital / birth-center bag (don’t pack fully yet)',
      'Tour or virtual tour if your place offers one',
    ],
  },
  {
    from: 33,
    to: 36,
    title: 'Bag & paperwork',
    thisWeek: [
      'Start a shared hospital-bag list in Notes',
      'Confirm pediatrician preference + birth preferences notes',
      'Ask about Group B strep testing timing',
      'Dry-run the hospital route and parking',
    ],
    comingUp: [
      'Pack go-bag by ~37 weeks',
      'Freeze 1–2 easy meals; charge devices',
    ],
  },
  {
    from: 37,
    to: 42,
    title: 'Ready when it’s time',
    thisWeek: [
      'Go-bag by the door + easy slip-on shoes',
      'Charge phones; wash favorite PJs',
      'Know triage / labor-line numbers',
      'Review labor signs your clinician described',
    ],
    comingUp: [
      'If past due date, follow your care team’s monitoring plan',
      'Pack patience — only some babies arrive on the exact day',
    ],
  },
];

export function getPrepForWeek(week) {
  if (week == null || Number.isNaN(week)) return null;
  const w = Math.min(42, Math.max(1, Math.round(week)));
  const band = BANDS.find((b) => w >= b.from && w <= b.to) || BANDS[BANDS.length - 1];
  const idx = BANDS.indexOf(band);
  const next = BANDS[idx + 1] || null;
  return {
    week: w,
    bandTitle: band.title,
    thisWeek: band.thisWeek,
    comingUp: next
      ? next.thisWeek.slice(0, 3)
      : band.comingUp,
    comingLabel: next ? `Coming up (weeks ${next.from}–${next.to})` : 'Coming up',
  };
}
