/**
 * Week-by-week updates — original summaries inspired by the NHS
 * Best Start in Life week-by-week guide (structure & calm tone).
 * Not medical advice. Not a verbatim copy of NHS content.
 */

/** NHS guide covers weeks 4–41; earlier/later weeks link to the closest page. */
function nhsWeekFor(week) {
  return Math.max(4, Math.min(41, Math.round(week) || 4));
}

function nhsWeekUrl(week) {
  const w = nhsWeekFor(week);
  // NHS URL grouping only (NHS files week 13 under its 2nd-trimester pages).
  // The app itself uses US boundaries: 1st = 1–13, 2nd = 14–27, 3rd = 28+ (see trimesterForWeek).
  const tri = w <= 12 ? '1st-trimester' : w <= 27 ? '2nd-trimester' : '3rd-trimester';
  return `https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${tri}/week-${w}/`;
}

const WEEKS = {
  1: {"title": "Very early days", "size": "just beginning", "baby": "Conception may still be ahead. Cells that could become a pregnancy are preparing.", "feel": "You likely feel as usual. No pregnancy signs yet.", "tip": "Start prenatal vitamins if your clinician advised them; ease off alcohol."},
  2: {"title": "Conception window", "size": "a single cell", "baby": "If fertilization happens, one cell begins dividing into a cluster.", "feel": "Still no symptoms for most people. Cycle timing matters for later dating.", "tip": "Note your last period date for your first prenatal visit."},
  3: {"title": "Implantation", "size": "a tiny ball of cells", "baby": "The cluster may settle into the uterus and start making pregnancy hormones.", "feel": "Light spotting or mild cramps can occur. Many feel nothing yet.", "tip": "Rest if you need to; keep meals simple and gentle."},
  4: {"title": "Missed period time", "size": "a poppy seed", "baby": "The neural tube is forming; the foundation for brain and spine is underway.", "feel": "Tiredness and tender breasts are common. A test may turn positive.", "tip": "Book prenatal care when you’re ready; share any medication list with your doctor or OB."},
  5: {"title": "Heartbeat beginnings", "size": "a sesame seed", "baby": "A simple heart tube starts beating; major organ systems begin outlining.", "feel": "Nausea, smell sensitivity, or fatigue may appear.", "tip": "Keep water nearby and try small snacks rather than big meals."},
  6: {"title": "Face and limbs", "size": "a lentil", "baby": "Limb buds appear; facial features begin to sketch in.", "feel": "Mood swings and food aversions are common. Be kind to yourself.", "tip": "Short rests beat pushing through — nap when you can."},
  7: {"title": "Brain growing fast", "size": "a blueberry", "baby": "Brain development speeds up; arms and legs lengthen.", "feel": "Waistbands may feel tight before a bump shows.", "tip": "Choose comfort clothes; loosen anything that digs in."},
  8: {"title": "Fingers and toes", "size": "a raspberry", "baby": "Fingers and toes are forming; the body is lengthening.", "feel": "First prenatal visits often fall around now.", "tip": "Write questions beforehand; bring a partner or notes if helpful."},
  9: {"title": "Tiny movements", "size": "a grape", "baby": "Muscles start working; eyelids form. Movements are too small to feel.", "feel": "Emotions can feel louder. That’s a hormone effect, not a failing.", "tip": "A gentle 10-minute stretch after waking can ease stiffness."},
  10: {"title": "More recognizable", "size": "an apricot", "baby": "Face looks more in proportion; ears and lips are forming. Heart beats quickly.", "feel": "Bloating, burping, and tiredness are common as digestion slows.", "tip": "Try smaller meals, eat slowly, and take a short stroll after eating."},
  11: {"title": "Bones hardening", "size": "a fig", "baby": "Bones begin to harden; tooth buds appear.", "feel": "Nausea may still be strong for some; others feel a slight lift.", "tip": "Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},
  12: {"title": "Reflexes and fingerprints", "size": "a lime", "baby": "Reflexes develop; fingerprints form. Risk of miscarriage drops for many.", "feel": "Energy may start returning. You might share news if you want to.", "tip": "Celebrate a small milestone — you’ve come a long way."},
  13: {"title": "End of first trimester", "size": "a lemon", "baby": "Vocal cords form; movement becomes more fluid.", "feel": "Energy often improves; appetite may pick up.", "tip": "Last week of the first trimester — add a short outdoor walk if weather and energy allow."},
  14: {"title": "Second trimester begins", "size": "an apple", "baby": "Facial muscles practice expressions; the neck lengthens.", "feel": "Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.", "tip": "Change positions slowly; support your belly when you stand."},
  15: {"title": "Senses awakening", "size": "an avocado", "baby": "Baby may sense light; legs grow longer than arms.", "feel": "Congestion or mild nosebleeds can come from extra blood volume.", "tip": "A cool-mist humidifier at night can feel soothing."},
  16: {"title": "Quickening soon", "size": "a large avocado", "baby": "The skeleton keeps hardening; muscles strengthen.", "feel": "You might feel fluttering soon, especially if this isn’t a first pregnancy.", "tip": "Place a hand on your belly during quiet moments."},
  17: {"title": "Fat stores begin", "size": "a turnip", "baby": "Brown fat starts forming to help with temperature later.", "feel": "Backaches may show up. Supportive shoes help.", "tip": "Swap heels for flats; gently stretch hip flexors."},
  18: {"title": "Hearing develops", "size": "a sweet potato", "baby": "Ears are in position; muffled sounds may reach baby.", "feel": "Anatomy scans are often booked around weeks 18–22.", "tip": "Gather insurance cards and questions before the appointment."},
  19: {"title": "Vernix coat", "size": "a mango", "baby": "A creamy protective coating (vernix) covers the skin.", "feel": "Itchy stretch on the belly is common — moisturizer helps.", "tip": "Use fragrance-free lotion after showers."},
  20: {"title": "Halfway mark", "size": "a banana", "baby": "You’re about halfway. Hair and nails continue to grow.", "feel": "The bump is often visible; Braxton Hicks may begin lightly.", "tip": "Take a keepsake photo only if you want — no pressure."},
  21: {"title": "Swallowing practice", "size": "a carrot", "baby": "Baby practices swallowing; taste buds are working.", "feel": "Mild practice tightenings can come and go.", "tip": "Hydrate and rest if tightenings feel frequent."},
  22: {"title": "Features refining", "size": "a papaya", "baby": "Eyebrows and lips look more defined.", "feel": "Night leg cramps are common.", "tip": "Stretch calves before bed; point and flex if a cramp hits."},
  23: {"title": "Rapid brain growth", "size": "a grapefruit", "baby": "Brain growth accelerates; lungs keep developing.", "feel": "Shortness of breath can appear as the uterus rises.", "tip": "Slow down on stairs; pause and breathe when you need to."},
  24: {"title": "Lung progress", "size": "an ear of corn", "baby": "Lungs make surfactant; growth continues steadily.", "feel": "Glucose screening is often discussed around now.", "tip": "Keep snacks balanced — protein with complex carbs."},
  25: {"title": "Responding to voice", "size": "a cauliflower", "baby": "Baby may respond to familiar voices.", "feel": "Heartburn can intensify in the evenings.", "tip": "Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},
  26: {"title": "Eyes opening", "size": "a head of lettuce", "baby": "Eyes can open; eyelashes form.", "feel": "Ankle or foot swelling can show up — elevate when resting.", "tip": "Ask your clinician before trying compression socks."},
  27: {"title": "End of second trimester", "size": "a large cauliflower", "baby": "Brain activity increases; senses keep maturing.", "feel": "Last week of the second trimester. Fatigue may return; rest counts as progress.", "tip": "Protect your sleep: a consistent bedtime and a cool, dark room help."},
  28: {"title": "Third trimester begins", "size": "an eggplant", "baby": "REM (dream) sleep may occur; baby packs on weight.", "feel": "If you’re Rh-negative, an immune globulin shot may be offered.", "tip": "Welcome to the third trimester — add third-trimester visits to your shared calendar."},
  29: {"title": "Stronger kicks", "size": "a butternut squash", "baby": "Kicks feel stronger; lungs keep practicing breathing motions.", "feel": "Left-side sleep is often suggested; pillows help hips.", "tip": "Try a pillow between the knees for comfort."},
  30: {"title": "Brain packing in", "size": "a cabbage", "baby": "Brain grows quickly; baby gains fat.", "feel": "Braxton Hicks may feel more noticeable. Time them if you’re unsure.", "tip": "Call your care team about any pattern that worries you."},
  31: {"title": "All senses working", "size": "a coconut", "baby": "All five senses work; sound processing improves.", "feel": "Nesting urges are real — pace cleaning and errands.", "tip": "One small prep task per day beats a marathon."},
  32: {"title": "Nearly complete nails", "size": "a jicama", "baby": "Nails are nearly complete; space is getting tighter.", "feel": "Pelvic pressure increases. Sit when you need to.", "tip": "Ask about pelvic-floor tips if your OB or PT suggested them."},
  33: {"title": "Antibody transfer", "size": "a pineapple", "baby": "Antibodies transfer from you; skull bones stay soft for birth.", "feel": "Hospital-bag brainstorming can start — no rush to pack fully.", "tip": "List must-haves in Notes so both of you can add items."},
  34: {"title": "Cheeks filling out", "size": "a cantaloupe", "baby": "Fat fills out cheeks; lungs are nearly ready.", "feel": "Group B strep testing is often done around now.", "tip": "Confirm pediatrician preference and birth notes together."},
  35: {"title": "Less room to move", "size": "a honeydew melon", "baby": "Movements feel more like rolls than kicks as space tightens.", "feel": "Bathroom trips increase. Night lights help.", "tip": "Sip earlier in the evening; ease big drinks right before bed."},
  36: {"title": "Engaging lower", "size": "a romaine head", "baby": "Baby may drop lower into the pelvis (engage).", "feel": "Breathing can ease if baby drops; pelvic pressure rises.", "tip": "Do a dry run of the hospital route and parking."},
  37: {"title": "Early term", "size": "a bunch of chard", "baby": "Often called early term — organs are ready for life outside.", "feel": "Watch for labor signs your clinician described. Rest while you can.", "tip": "Charge devices, wash favorite PJs, freeze one simple meal."},
  38: {"title": "Ready when it’s time", "size": "a leek bunch", "baby": "Vernix decreases; baby is ready when labor starts.", "feel": "False alarms happen. When in doubt, call triage.", "tip": "Keep the go-bag by the door and easy slip-on shoes."},
  39: {"title": "Due any day", "size": "a mini watermelon", "baby": "Brain and body keep fine-tuning right up to birth.", "feel": "Patience is hard. Gentle walks and rest both help.", "tip": "Send each other one kind note tonight — you’re a team."},
  40: {"title": "Due-date week", "size": "a small pumpkin", "baby": "Only a small share of babies arrive on the exact due date.", "feel": "You’re not ‘late’ at 40 weeks yet — averages vary.", "tip": "Trust your care team on next steps if you go past 40."},
  41: {"title": "Past the due date", "size": "still growing", "baby": "Monitoring may increase; baby may gain a little more.", "feel": "Induction conversations are common. Ask every question you have.", "tip": "Pack patience and a calming playlist."},
  42: {"title": "Late check-ins", "size": "ready for arrival", "baby": "Your care team watches closely; follow their plan.", "feel": "Appointments may be more frequent. Take support when offered.", "tip": "Lean on each other — the finish line is near."},
};

export function getWeekContent(week) {
  if (week == null || Number.isNaN(week)) return null;
  const w = Math.min(42, Math.max(1, Math.round(week)));
  return { week: w, ...WEEKS[w], nhsWeek: nhsWeekFor(w), nhsUrl: nhsWeekUrl(w) };
}
