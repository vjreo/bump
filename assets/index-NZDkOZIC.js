(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=a(o);fetch(o.href,s)}})();const Y="America/New_York";function D(){return we(new Date)}function we(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:Y,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),a=t.find(s=>s.type==="year").value,n=t.find(s=>s.type==="month").value,o=t.find(s=>s.type==="day").value;return`${a}-${n}-${o}`}function ve(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number),o=new Date(Date.UTC(t,a-1,n,12));return new Intl.DateTimeFormat("en-US",{timeZone:Y,weekday:"short",month:"short",day:"numeric"}).format(o)}function Me(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number);return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric"}).format(new Date(Date.UTC(t,a-1,n,12)))}function V(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:Y,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function ke(e,t){const[a,n,o]=e.split("-").map(Number),[s,r,l]=t.split("-").map(Number),m=Date.UTC(a,n-1,o),u=Date.UTC(s,r-1,l);return Math.round((m-u)/864e5)}function Se(e,t=D()){if(!e)return null;const n=280-ke(e,t);if(n<0)return 1;const o=Math.floor(n/7)+1;return Math.min(42,Math.max(1,o))}function ze(e){if(e==null||Number.isNaN(Number(e)))return null;const t=Number(e);return t<=13?{number:1,label:"1st"}:t<=27?{number:2,label:"2nd"}:{number:3,label:"3rd"}}function We(e,t=D()){return e?ke(e,t):null}function He(e,t){const[a,n,o]=e.split("-").map(Number);return new Date(Date.UTC(a,n-1,o+t)).toISOString().slice(0,10)}const J="bump.v1",Z=1;function Ce(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function M(){return{schemaVersion:Z,household:{id:Ce(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function E(e,t=D()){return e.dailyLogs[t]||(e.dailyLogs[t]={date:t,hydrationCount:0,movementDone:!1,workoutId:null,walkDone:!1}),e.dailyLogs[t]}let b=null;function v(){b.updatedAt=new Date().toISOString();try{localStorage.setItem(J,JSON.stringify(b))}catch(e){console.warn("persist failed",e)}}function De(){try{const e=localStorage.getItem(J);e?(b=JSON.parse(e),b.schemaVersion||(b.schemaVersion=Z),b.household||(b=M())):b=M()}catch{b=M()}return E(b),b}function f(){return b||De(),b}function z(){var t,a;const e=f();return!!((t=e.household)!=null&&t.pin&&((a=e.household)!=null&&a.dueDate))}function $e(){return!!f().unlocked}function Ue({pin:e,dueDate:t}){const a=f();return a.household.pin=String(e).trim(),a.household.dueDate=t,a.household.createdAt=a.household.createdAt||new Date().toISOString(),a.unlocked=!0,E(a),v(),a}function _e(e){var a;const t=f();return!!((a=t.household)!=null&&a.pin)&&String(e??"").trim()===String(t.household.pin)}function Fe(e){const t=f();return _e(e)?(t.unlocked=!0,E(t),v(),!0):!1}function Ge(){const e=f();e.unlocked=!1,v()}function Ke(e){const t=f();t.household.dueDate=e,v()}function je(e){const t=f();t.household.pin=String(e).trim(),v()}function Ye(){return E(f())}function oe(e=1){const t=f(),a=E(t);return a.hydrationCount=Math.max(0,(a.hydrationCount||0)+e),v(),a}function Ve(e,t=null){const a=f(),n=E(a);return n.movementDone=!!e,n.workoutId=e?t:null,v(),n}function Je(e){const t=f(),a=E(t);return a.walkDone=!!e,v(),a}function Ze(){return[...f().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function Qe({body:e,author:t=""}){const a=f(),n={id:Ce(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return a.notes.unshift(n),v(),n}function Xe(e){const t=f();t.notes=t.notes.filter(a=>a.id!==e),v()}function et(){const e=f(),{pin:t,...a}=e.household,n={schemaVersion:Z,exportedAt:new Date().toISOString(),app:"bump-tracker",household:a,dailyLogs:Object.fromEntries(Object.entries(e.dailyLogs).map(([o,{windDown:s,...r}])=>[o,r])),notes:e.notes};return JSON.stringify(n,null,2)}function tt(){localStorage.removeItem(J),b=M(),v()}const se="1db2ccd5ddc253b4eedee62ffecd522f2c5e9f49b16e2090a7fe1dab48164daa".toLowerCase(),Ae="bump.inviteOk.v1";async function at(e){const t=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(a)).map(n=>n.toString(16).padStart(2,"0")).join("")}function Ee(){try{return localStorage.getItem(Ae)==="1"}catch{return!1}}function nt(){try{localStorage.setItem(Ae,"1")}catch(e){console.warn("invite flag persist failed",e)}}function ot(e){return String(e??"").trim().toLowerCase()}async function st(e){if(!se)return console.warn("[bump] VITE_INVITE_HASH not set — invite gate cannot unlock"),!1;const t=ot(e);return t&&await at(t)===se?(nt(),!0):!1}function Te(e){return Math.max(4,Math.min(41,Math.round(e)||4))}function it(e){const t=Te(e);return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const rt={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you’re ready; share any medication list with your doctor or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That’s a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognizable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"Reflexes and fingerprints",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you’ve come a long way."},13:{title:"End of first trimester",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Last week of the first trimester — add a short outdoor walk if weather and energy allow."},14:{title:"Second trimester begins",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn’t a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You’re about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keepsake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"End of second trimester",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Last week of the second trimester. Fatigue may return; rest counts as progress.",tip:"Protect your sleep: a consistent bedtime and a cool, dark room help."},28:{title:"Third trimester begins",size:"an eggplant",baby:"REM (dream) sleep may occur; baby packs on weight.",feel:"If you’re Rh-negative, an immune globulin shot may be offered.",tip:"Welcome to the third trimester — add third-trimester visits to your shared calendar."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you’re unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it’s time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you’re a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You’re not ‘late’ at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function ie(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e)));return{week:t,...rt[t],nhsWeek:Te(t),nhsUrl:it(t)}}const lt=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:13,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Start a shared list of questions for your OB or midwife in Notes"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:14,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add follow-up labs to Google Calendar with [Bump] in the title"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function ct(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),a=lt.find(n=>t>=n.from&&t<=n.to);return{week:t,bandTitle:a.title,thisWeek:a.thisWeek,lookingAhead:a.comingUp}}const Be=16,W=28,dt={bodyweight:"bodyweight",light:"light KB",moderate:"moderate KB"},re={moderate:"light",light:"light"},ut="Choose a kettlebell you can lift with good form and steady breathing, finishing each set with 2–3 reps left in the tank. Rest about 30–45 sec between sets.",pt="Somewhat hard, but you can still talk.",ht="Aim for “somewhat hard” (RPE 13–14): you can still talk in full sentences. Exhale on the effort — no breath-holding. Sip water and stay cool.",mt="Check with your OB or midwife before starting or changing your routine.",ft=["Vaginal bleeding","Abdominal pain","Regular painful contractions","Fluid leaking from the vagina","Shortness of breath before you start exercising","Dizziness","Headache","Chest pain","Muscle weakness affecting balance","Calf pain or swelling"],gt={catCow:{name:"Cat–cow",dose:"6 slow reps",load:"bodyweight",cue:"Exhale as you round, inhale as you lengthen."},hipCircles:{name:"Standing hip circles",dose:"5 each direction",load:"bodyweight",cue:"Hands on hips, smooth circles; hold a wall if you like."},airSquat:{name:"Bodyweight squat",dose:"8 reps",load:"bodyweight",cue:"Easy range to wake up hips and knees.",t3:{name:"Squat to chair",cue:"Tap a chair lightly each rep."}},armCircles:{name:"Arm circles + wall angels",dose:"30 sec",load:"bodyweight",cue:"Back against a wall, slide arms up and down without arching."},breathing:{name:"360° breathing",dose:"5 breaths",load:"bodyweight",cue:"Seated tall: inhale into ribs and belly, exhale and gently lift the pelvic floor."},gobletSquat:{name:"Goblet squat",dose:"2 × 8",load:"moderate",cue:"Bell at your chest, sit between your heels, exhale as you stand.",t3:{name:"Goblet squat to box",short:"Box squat",dose:"2 × 6",cue:"Sit back to a box or chair; comfortable depth and stance width."}},kbRdl:{name:"Kettlebell Romanian deadlift",short:"KB RDL",dose:"2 × 10",load:"moderate",cue:"Soft knees, hinge at the hips with a long spine; squeeze glutes to stand.",t3:{dose:"2 × 8",cue:"Wider stance to make room for the bump; stop where your back stays flat."}},kbDeadlift:{name:"Kettlebell deadlift",short:"KB deadlift",dose:"2 × 10",load:"moderate",cue:"Bell between your feet, hinge and stand tall; exhale on the way up.",t3:{dose:"2 × 8",cue:"Wider stance; elevate the bell on a step if reaching the floor is awkward."}},reverseLunge:{name:"Reverse lunge",dose:"2 × 6 each side",load:"bodyweight",cue:"Step back softly, front knee over mid-foot; hold a light KB at your chest if steady.",t3:{name:"Supported split squat",short:"Split squat",cue:"Stay in a split stance holding a wall or chair; no stepping, for balance."}},gluteBridge:{name:"Glute bridge",dose:"2 × 12",load:"light",cue:"Bell on your hips, press through heels, pause at the top.",from16:{name:"Shoulders-elevated hip thrust",short:"Hip thrust",cue:"Upper back on a couch or bench (not flat on the floor); bell on your hips."},t3:{dose:"2 × 10"}},clamshell:{name:"Side-lying clamshell",short:"Clamshell",dose:"2 × 12 each side",load:"bodyweight",cue:"Lying on your side, knees bent, open the top knee without rolling back.",t3:{dose:"2 × 10 each side",cue:"Pillow under the bump and between the knees if comfier."}},suitcaseCarry:{name:"Suitcase carry",dose:"2 × 20 sec each side",load:"moderate",cue:"Bell in one hand, walk tall without leaning.",t3:{dose:"2 × 15 sec each side"}},farmerCarry:{name:"Kettlebell carry",short:"KB carry",dose:"2 × 30 sec",load:"moderate",cue:"Walk tall, ribs stacked over hips, steady breathing.",t3:{dose:"2 × 20 sec"}},kbRow:{name:"Single-arm kettlebell row",short:"KB row",dose:"2 × 10 each side",load:"moderate",cue:"Hand on a bench or chair, pull the bell toward your hip.",t3:{dose:"2 × 8 each side",cue:"Staggered stance with your hand on a counter; back flat, bump supported."}},floorPress:{name:"Kettlebell floor press",short:"Floor press",dose:"2 × 10 each side",load:"moderate",cue:"Lying on your back, press the bell up; elbow lightly touches the floor.",from16:{name:"Incline kettlebell press",short:"Incline press",cue:"Back propped at about 45° on a couch or wedge, then press."},t3:{dose:"2 × 8 each side"}},halo:{name:"Kettlebell halo",short:"Halo",dose:"2 × 6 each direction",load:"light",cue:"Circle the bell around your head; keep ribs down and core quiet.",t3:{name:"Seated kettlebell halo",short:"Seated halo",dose:"2 × 5 each direction"}},pushup:{name:"Push-up",dose:"2 × 8",load:"bodyweight",cue:"Hands under shoulders, body in one line; use knees if needed.",from16:{name:"Incline push-up",cue:"Hands on a bench or counter so the bump stays clear of the floor."},t3:{dose:"2 × 6",cue:"Hands on a counter or wall; keep a straight line."}},birdDog:{name:"Bird dog",dose:"2 × 6 each side",load:"bodyweight",cue:"On hands and knees, reach opposite arm and leg; exhale as you reach."},deadBug:{name:"Dead bug",dose:"2 × 6 each side",load:"bodyweight",cue:"On your back, lower opposite arm and leg slowly; back stays heavy.",from16:{name:"Incline dead bug",cue:"Propped at about 45° on a couch or wedge (not flat), slowly extend opposite arm and leg."}},sidePlank:{name:"Side plank (from knees)",short:"Side plank",dose:"2 × 15 sec each side",load:"bodyweight",cue:"Elbow under shoulder, hips lifted; stop if you feel belly doming.",t3:{name:"Side-lying leg lift",short:"Side leg lift",dose:"2 × 10 each side",cue:"Lying on your side with a pillow under the bump, lift the top leg slowly."}},hipFlexor:{name:"Half-kneeling hip flexor stretch",short:"Hip flexor stretch",dose:"30 sec each side",load:"bodyweight",cue:"Tuck the pelvis slightly; pad under the knee."},ninetyNinety:{name:"90/90 hip switches",short:"90/90 hips",dose:"5 each side",load:"bodyweight",cue:"Seated, rotate knees side to side; hands behind you for support."},figureFour:{name:"Seated figure-four stretch",short:"Figure-four",dose:"30 sec each side",load:"bodyweight",cue:"Ankle over opposite knee, sit tall and lean gently."},childsPose:{name:"Wide-knee child’s pose",short:"Child’s pose",dose:"45 sec",load:"bodyweight",cue:"Knees wide to make room for the bump; rest your head on your hands."},doorwayChest:{name:"Doorway chest stretch",short:"Chest stretch",dose:"30 sec each side",load:"bodyweight",cue:"Forearm on the frame, step through gently."},sideReach:{name:"Standing side-body reach",short:"Side reach",dose:"4 each side",load:"bodyweight",cue:"Reach up and over with a long exhale."},hamstringStretch:{name:"Standing hamstring stretch",short:"Hamstring stretch",dose:"30 sec each side",load:"bodyweight",cue:"Heel on a low step, hinge forward with a long spine."}},le=[{id:"lower",name:"Lower body strength",minutes:12,t3Minutes:10,warmup:["hipCircles","airSquat"],strength:["gobletSquat","kbRdl","reverseLunge"],mobility:["hipFlexor"]},{id:"upper",name:"Upper body & back",minutes:12,t3Minutes:10,warmup:["armCircles","catCow"],strength:["kbRow","floorPress","halo"],mobility:["doorwayChest"]},{id:"core",name:"Core & mobility",minutes:12,t3Minutes:10,warmup:["breathing","catCow"],strength:["birdDog","sidePlank","deadBug"],mobility:["ninetyNinety","childsPose"]},{id:"full",name:"Full body strength",minutes:14,t3Minutes:12,warmup:["catCow","airSquat"],strength:["kbDeadlift","pushup","farmerCarry"],mobility:["hamstringStretch","sideReach"]},{id:"glutes",name:"Glutes & hips",minutes:12,t3Minutes:10,warmup:["catCow","hipCircles"],strength:["gluteBridge","clamshell","suitcaseCarry"],mobility:["figureFour","childsPose"]}],yt=[{id:"long",name:"Long relaxed walk",dose:"30–40 min",cue:"Unhurried weekend pace; bring water and company.",t3:{dose:"20–30 min",cue:"Flat route with places to sit; turn back when you’re tired."}},{id:"easy",name:"Easy walk",dose:"15–20 min",cue:"Comfortable pace to loosen up.",t3:{dose:"15 min"}},{id:"brisk",name:"Brisk walk",dose:"20 min",cue:"Talk-test pace: you can chat but not sing.",t3:{name:"Steady walk",dose:"15 min",cue:"Comfortable pace; slow down if you get breathless."}},{id:"meal",name:"After-meal stroll",dose:"10 min",cue:"A gentle stroll after lunch or dinner helps digestion."},{id:"hills",name:"Gentle hills or stairs",dose:"15–20 min",cue:"A few easy inclines or flights of stairs, holding the rail; take downhill slowly.",t3:{name:"Flat easy walk",dose:"15 min",cue:"No hills or stairs now; stick to flat, even paths."}},{id:"split",name:"Two short walks",dose:"2 × 10 min",cue:"One in the morning, one in the evening."},{id:"weekend",name:"Weekend walk somewhere new",dose:"30–40 min",cue:"A park or waterfront path with even footing, at an easy pace.",t3:{dose:"20–30 min",cue:"Flat, even path close to home, with places to rest."}}],bt="Go in the cooler part of the day and bring water.",wt="Flat routes and supportive shoes; bring water and skip the heat of the day.";function ce(e,t){return{...e,...t,short:t.short||(t.name?t.name:e.short),swapped:!0}}function G(e,t){const a=gt[e];let n={id:e,name:a.name,short:a.short||a.name,dose:a.dose,load:a.load,cue:a.cue};t>=Be&&a.from16&&(n=ce(n,a.from16)),t>=W&&a.t3&&(n=ce(n,a.t3));let o=n.load;return t>=W&&re[o]&&(o=re[o]),{...n,loadKey:o,loadLabel:dt[o]}}function Ie(e){const[t,a,n]=e.split("-").map(Number);return new Date(Date.UTC(t,a-1,n))}function vt(e){return Math.round((Ie(e)-Date.UTC(2026,0,1))/864e5)}function kt(e,t){const a=(Number(t)||1)>=W,{t3:n,...o}=yt[Ie(e).getUTCDay()];return{...a&&n?{...o,...n}:o,tip:a?wt:bt}}function Le(e,t){const a=le.length,n=le[(vt(e)%a+a)%a],o=Number(t)||1,s=o>=W,r=[];return o>=Be&&r.push("No lying flat on your back: incline or side-lying swaps are built in."),s&&r.push("3rd trimester: lighter loads, fewer reps, more support for balance."),{id:n.id,name:n.name,minutes:s?n.t3Minutes:n.minutes,notes:r,warmup:n.warmup.map(l=>G(l,o)),strength:n.strength.map(l=>G(l,o)),mobility:n.mobility.map(l=>G(l,o))}}const de="1075531369147-ok2muis4jo4r0njb598gov309aoim30n.apps.googleusercontent.com".trim(),Ne=de.endsWith(".apps.googleusercontent.com")?de:"",St="primary",x="[Bump]",ue="https://www.googleapis.com/auth/calendar.events.readonly",Ct=183,Dt=60,$t=10,At="https://accounts.google.com/gsi/client",L="bump.gcal.token.v1",U="bump.gcal.cache.v1",pe=864e5;function T(){return!!Ne}function _(e){try{return JSON.parse(localStorage.getItem(e)||"null")}catch{return null}}function xe(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(a){console.warn("[bump] calendar storage failed",a)}}function N(){return!!_(U)}function Et(){return _(U)||{events:[],fetchedAt:null}}function Tt(){const e=_(L);return e&&e.accessToken&&e.expiresAt>Date.now()+6e4?e.accessToken:null}let R=null;function Q(){var e,t;return T()?(t=(e=window.google)==null?void 0:e.accounts)!=null&&t.oauth2?Promise.resolve():(R||(R=new Promise((a,n)=>{const o=document.createElement("script");o.src=At,o.async=!0,o.defer=!0,o.onload=()=>a(),o.onerror=()=>{R=null,n(new Error("Could not load Google sign-in"))},document.head.appendChild(o)})),R):Promise.reject(new Error("Calendar not set up"))}let q=null,$=null;function Bt(){return q||(q=window.google.accounts.oauth2.initTokenClient({client_id:Ne,scope:ue,callback:e=>{const t=$;if($=null,!t)return;if(!e||e.error||!e.access_token){t.reject(new Error((e==null?void 0:e.error_description)||(e==null?void 0:e.error)||"Authorization failed"));return}if(!window.google.accounts.oauth2.hasGrantedAllScopes(e,ue)){t.reject(new Error("Calendar access was not granted"));return}const a=Number(e.expires_in)||3600;xe(L,{accessToken:e.access_token,expiresAt:Date.now()+a*1e3}),t.resolve(e.access_token)},error_callback:e=>{const t=$;$=null,t&&t.reject(new Error((e==null?void 0:e.type)==="popup_closed"?"Sign-in window closed":"Could not open Google sign-in"))}}),q)}function It(e=""){return new Promise((t,a)=>{$&&$.reject(new Error("Superseded")),$={resolve:t,reject:a};try{Bt().requestAccessToken({prompt:e})}catch(n){$=null,a(n)}})}const K=new RegExp(x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");function Lt(e){return K.lastIndex=0,typeof e=="string"&&K.test(e)}function Nt(e){return String(e).replace(K," ").replace(/\s{2,}/g," ").trim()||"Untitled"}function xt(e){return(e||[]).filter(t=>t&&t.status!=="cancelled"&&Lt(t.summary)).map(t=>{var n,o,s,r,l,m;const a=!!((n=t.start)!=null&&n.date&&!((o=t.start)!=null&&o.dateTime));return{id:String(t.id||""),title:Nt(t.summary),allDay:a,start:a?t.start.date:(s=t.start)==null?void 0:s.dateTime,end:a?((r=t.end)==null?void 0:r.date)||t.start.date:((l=t.end)==null?void 0:l.dateTime)||((m=t.start)==null?void 0:m.dateTime),location:String(t.location||"").trim()}}).filter(t=>t.start)}class Oe extends Error{}async function Ot(e){const t=Date.now(),a=new URLSearchParams({singleEvents:"true",orderBy:"startTime",timeMin:new Date(t-Dt*pe).toISOString(),timeMax:new Date(t+Ct*pe).toISOString(),maxResults:"250",q:x.replace(/[^\w\s]/g," ").trim(),fields:"items(id,status,summary,location,start,end),nextPageToken"}),n=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(St)}/events`,o=[];let s="";for(let r=0;r<5;r++){s&&a.set("pageToken",s);const l=await fetch(`${n}?${a}`,{headers:{Authorization:`Bearer ${e}`}});if(l.status===401)throw new Oe("Token expired");if(!l.ok)throw new Error(`Calendar request failed (${l.status})`);const m=await l.json();if(o.push(...xt(m.items)),s=m.nextPageToken||"",!s)break}return o}async function Rt({interactive:e=!1,consent:t=!1}={}){if(!T())return{ok:!1,error:"Calendar not set up"};let a=t?null:Tt();for(let n=0;n<2;n++){if(!a){if(!e)return{ok:!1,needsReconnect:!0};try{await Q(),a=await It(t?"consent":"")}catch(o){return{ok:!1,needsReconnect:!0,error:o.message}}}try{const o=await Ot(a);return xe(U,{events:o,fetchedAt:new Date().toISOString()}),{ok:!0}}catch(o){if(o instanceof Oe){localStorage.removeItem(L),a=null;continue}return{ok:!1,error:o.message||"Could not reach Google Calendar"}}}return{ok:!1,needsReconnect:!0}}async function he(){const e=_(L);if(localStorage.removeItem(L),localStorage.removeItem(U),e!=null&&e.accessToken&&T())try{await Q(),await new Promise(t=>window.google.accounts.oauth2.revoke(e.accessToken,()=>t()))}catch{}}const me=8,g=document.getElementById("app");let h="today",C=null,w="auto",j=null;const Re=/^\d{4,}$/,qe="PIN should be at least 4 digits (numbers only)",c={loading:!1,error:"",needsReconnect:!1,stale:!1,pastOpen:!1},H={detailsOpen:!1,stopOpen:!1},P=`Add ${x} to an event title in your Google Calendar to show it here.`;De();function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(){const e=f();if(!Ee()){w="invite",fe();return}if(!z()||!$e()){(w==="invite"||w==="auto")&&(w=z()?"unlock":"setup"),fe();return}qt(e)}function fe(){const e=z();if(w==="auto"&&(w=Ee()?e?"unlock":"setup":"invite"),w==="invite"){g.innerHTML=`
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Bump</h1>
            <p>Invite-only for now</p>
          </div>
          <div class="field">
            <label class="label" for="inviteCode">Invite code</label>
            <input class="input" type="text" id="inviteCode" placeholder="bump-…" autocomplete="off" autocapitalize="off" spellcheck="false" />
            <p class="hint">Ask Vince for an invite if you don’t have one.</p>
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" id="doInvite">Continue</button>
        </div>
      </div>`;const a=g.querySelector("#inviteCode");a.focus();const n=async()=>{const o=g.querySelector("#gateErr");o.classList.add("hidden"),await st(a.value)?(w="auto",p()):(o.textContent="That invite doesn’t match. Double-check and try again.",o.classList.remove("hidden"))};g.querySelector("#doInvite").onclick=n,a.onkeydown=o=>{o.key==="Enter"&&n()};return}if(w==="setup"){g.innerHTML=`
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Bump</h1>
            <p>Vince &amp; Chantal’s shared pregnancy tracker</p>
          </div>
          <form id="setupForm" novalidate>
            <div class="field">
              <label class="label" for="dueDate">Due date</label>
              <input class="input" type="date" id="dueDate" />
            </div>
            <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
            <div class="field">
              <label class="label" for="pin">Household PIN (at least 4 digits)</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin" placeholder="Shared secret" autocomplete="new-password" />
              <p class="hint">You’ll use this PIN to unlock Bump. Your data stays on this phone.</p>
            </div>
            <div class="field">
              <label class="label" for="pin2">Confirm PIN</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin2" autocomplete="new-password" />
            </div>
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Create household</button>
          </form>
        </div>
      </div>`,g.querySelector("#setupForm").onsubmit=a=>{a.preventDefault();const n=g.querySelector("#dueDate").value,o=g.querySelector("#pin").value.trim(),s=g.querySelector("#pin2").value.trim(),r=g.querySelector("#gateErr");if(!n){r.textContent="Pick a due date",r.classList.remove("hidden");return}if(!Re.test(o)){r.textContent=qe,r.classList.remove("hidden");return}if(o!==s){r.textContent="PINs do not match",r.classList.remove("hidden");return}Ue({pin:o,dueDate:n}),w="auto",h="today",p()};return}g.innerHTML=`
    <div class="gate">
      <div class="gate-card">
        <div class="brand">
          <div class="brand-mark">🌱</div>
          <h1>Welcome back</h1>
          <p>Enter your household PIN</p>
        </div>
        <form id="unlockForm">
          <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
          <div class="field">
            <label class="label" for="pin">PIN</label>
            <input class="input" type="password" inputmode="numeric" id="pin" autocomplete="current-password" />
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" type="submit">Unlock</button>
        </form>
      </div>
    </div>`;const t=g.querySelector("#pin");t.focus(),g.querySelector("#unlockForm").onsubmit=a=>{if(a.preventDefault(),Fe(t.value))w="auto",p();else{const n=g.querySelector("#gateErr");n.textContent="Incorrect PIN",n.classList.remove("hidden")}}}function qt(e){const t=e.household.dueDate,a=Se(t),n=We(t),o=Ye(),s=D();j=s,g.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${i(ve(s))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${h==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${h==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${h==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${h==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,g.querySelectorAll(".nav button").forEach(l=>{l.onclick=()=>{h=l.dataset.tab,p(),h==="appointments"&&N()&&I({interactive:!0})}}),T()&&Q().catch(()=>{});const r=g.querySelector("#main");h==="today"?r.innerHTML=Wt({due:t,week:a,daysLeft:n,log:o}):h==="appointments"?r.innerHTML=Ut():h==="notes"?r.innerHTML=_t():r.innerHTML=Ft(e),Gt(r),h==="today"&&Pt(r)}function Pt(e){const t=e.querySelector(".week-browser"),a=(t==null?void 0:t.querySelector(".week-pill.active"))||(t==null?void 0:t.querySelector(".week-pill.current"));if(!t||!a)return;const n=t.getBoundingClientRect(),o=a.getBoundingClientRect();t.scrollLeft+=o.left-n.left-(n.width-o.width)/2}function ge(e,{compact:t=!1}={}){return e?`
    <article class="week-hero">
      <p class="eyebrow">Week ${e.week}</p>
      <h2>${i(e.title)}</h2>
      <p class="week-size">About the size of ${i(e.size)}</p>
      <div class="week-section">
        <h3>Your baby</h3>
        <p>${i(e.baby)}</p>
      </div>
      <div class="week-section">
        <h3>How you may feel</h3>
        <p>${i(e.feel)}</p>
      </div>
      <div class="week-section">
        <h3>This week’s tip</h3>
        <p>${i(e.tip)}</p>
      </div>
      <p class="week-attrib">
        Inspired by the
        <a href="${i(e.nhsUrl)}" target="_blank" rel="noopener noreferrer">NHS Best Start in Life week-by-week guide</a>
        (${e.nhsWeek===e.week?`Week ${e.week}`:`closest NHS page: Week ${e.nhsWeek}`}). Original summary — not medical advice.
        ${t?"":"Talk to your midwife or OB about anything that worries you."}
      </p>
    </article>`:""}function Mt(e){return e==null?{n:"—",l:"Days to due"}:e>0?{n:e,l:"Days to due"}:e===0?{n:0,l:"Due today"}:{n:Math.abs(e),l:"Days past due"}}function ye(e,t,a){return`
    <label class="check" for="${e}">
      <input type="checkbox" class="check-box" id="${e}" ${a?"checked":""} />
      <span>${i(t)}</span>
    </label>`}function zt(e,t){const a=D(),n=Le(a,e),o=kt(a,e),s=l=>`
    <li>
      <div class="wo-move"><span class="wo-move-name">${i(l.name)}</span><span class="wo-dose">${i(l.dose)}</span></div>
      <div class="wo-cue">${l.loadKey!=="bodyweight"?`<span class="wo-load">${i(l.loadLabel)}</span> · `:""}${i(l.cue)}</div>
    </li>`,r=(l,m)=>`
    <h4 class="wo-section">${l}</h4>
    <ul class="wo-list">${m.map(s).join("")}</ul>`;return`
    <div class="card workout-card">
      <details class="wo-details" id="woDetails" ${H.detailsOpen?"open":""}>
        <summary>
          <div class="wo-head">
            <h3 class="card-title">💪 ${i(n.name)}</h3>
            <span class="wo-mins">${n.minutes} min</span>
            <span class="wo-toggle" aria-hidden="true"></span>
          </div>
          <div class="wo-line">${n.strength.map(l=>i(l.short)).join(" · ")}</div>
          <div class="wo-line wo-walk-line">🚶 ${i(o.name)} · ${i(o.dose)}</div>
        </summary>
        ${n.notes.length?`<ul class="wo-notes">${n.notes.map(l=>`<li>${i(l)}</li>`).join("")}</ul>`:""}
        ${r("Warm-up · 1–2 min",n.warmup)}
        ${r("Strength",n.strength)}
        ${r("Stretch",n.mobility)}
        <p class="wo-guide">${i(ut)}</p>
        <h4 class="wo-section">Walk</h4>
        <ul class="wo-list"><li>
          <div class="wo-move"><span class="wo-move-name">${i(o.name)}</span><span class="wo-dose">${i(o.dose)}</span></div>
          <div class="wo-cue">${i(o.cue)} ${i(o.tip)}</div>
        </li></ul>
        <p class="wo-guide">${i(ht)}</p>
      </details>
      <div class="wo-foot">
        ${ye("woDone","Workout",t.movementDone)}
        ${ye("walkDone","Walk",t.walkDone)}
      </div>
      <details class="wo-stop" id="woStop" ${H.stopOpen?"open":""}>
        <summary><span>${i(pt)}</span> <span class="wo-stop-link">When to stop</span></summary>
        <p>Stop and call your OB or midwife if you notice:</p>
        <ul>${ft.map(l=>`<li>${i(l)}</li>`).join("")}</ul>
        <p>${i(mt)}</p>
      </details>
    </div>`}function Wt({due:e,week:t,daysLeft:a,log:n}){var k;const o=ie(t),s=C??t,r=ie(s),l=Mt(a),m=Array.from({length:me},(y,S)=>`<div class="glass ${S<n.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),u=Array.from({length:42},(y,S)=>S+1).map(y=>`<button type="button" class="${["week-pill",y===s?"active":"",y===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${y}">${y}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${i(((k=ze(t))==null?void 0:k.label)??"—")}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${i(l.n)}</div><div class="l">${i(l.l)}</div></div>
      <div class="stat"><div class="n">${i(e?Me(e):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${ge(o)}

    ${(()=>{const y=ct(t);if(!y)return"";const S=y.thisWeek.map(B=>`<li>${i(B)}</li>`).join(""),O=y.lookingAhead.map(B=>`<li>${i(B)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${i(y.bandTitle)}</span>
      </div>
      <ul class="prep-list">${S}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${O}</ul>
      </div>
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife’s plan.</p>
    </div>`})()}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
      </div>
      <div class="hydro">
        <div>
          <div class="hydro-count">${n.hydrationCount}</div>
          <div class="meta">of ${me} glasses today</div>
        </div>
        <div class="btn-row">
          <button class="btn-icon" id="hydroMinus" aria-label="Remove glass">−</button>
          <button class="btn btn-sage btn-sm" id="hydroPlus">+ Glass</button>
        </div>
      </div>
      <div class="hydro-glasses">${m}</div>
    </div>

    ${zt(t,n)}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${C&&C!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${u}</div>
      ${C&&C!==t?ge(r,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `}function Ht(e,t,a,n){if(e.allDay){const r=e.end<=a;return{past:r,onToday:!r&&e.start<=a,isToday:!r&&e.start<=a,isTomorrow:!r&&e.start===n}}const o=we(new Date(e.start)),s=Date.parse(e.end||e.start)<t;return{past:s,onToday:o===a,isToday:!s&&o<=a,isTomorrow:!s&&o===n}}function be(e,t){const a=e.allDay?`${ve(e.start)} · All day`:V(e.start);return`
    <div class="list-item${t.past?" is-past":""}">
      <h4>${i(e.title)}${t.isToday?' <span class="chip chip-today">Today</span>':""}</h4>
      <div class="meta">${i(a)}${e.location?" · "+i(e.location):""}</div>
      ${t.isTomorrow?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
    </div>`}function Ut(){if(!T())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="cal-lead">Calendar not set up yet</p>
        <p class="meta">Appointments will come from Google Calendar once it’s connected. ${i(P)}</p>
      </div>`;if(!N())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="meta" style="margin:0 0 12px">Show events from your Google Calendar here (read-only). ${i(P)}</p>
        ${c.error?`<p class="err" style="margin:0 0 10px">${i(c.error)}</p>`:""}
        <button class="btn btn-primary" id="calConnect" ${c.loading?"disabled":""}>${c.loading?"Connecting…":"Connect Google Calendar"}</button>
      </div>`;const{events:e,fetchedAt:t}=Et(),a=Date.now(),n=D(),o=He(n,1),s=e.map(u=>({ev:u,t:Ht(u,a,n,o)})),r=s.filter(u=>!u.t.past||u.t.onToday).sort((u,k)=>u.ev.start<k.ev.start?-1:1),l=s.filter(u=>u.t.past&&!u.t.onToday).sort((u,k)=>u.ev.start<k.ev.start?1:-1).slice(0,$t);let m;return c.loading?m="Updating…":m=t?`Last updated ${V(t)}`:"Not updated yet",`
    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📅 Upcoming</h3>
        <button class="btn btn-ghost btn-sm" id="calRefresh" ${c.loading?"disabled":""}>Refresh</button>
      </div>
      <p class="meta cal-status">${i(m)}${c.stale&&!c.loading?" · Tap Refresh to update":""}</p>
      ${c.needsReconnect&&!c.loading?`
        <div class="cal-alert">
          <p>Couldn’t refresh from Google Calendar${c.error?` (${i(c.error)})`:""}. Showing saved events.</p>
          <button class="btn btn-soft btn-sm" id="calReconnect">Reconnect</button>
        </div>`:c.error&&!c.loading?`<p class="err" style="margin:0 0 8px">${i(c.error)}</p>`:""}
      ${r.length?r.map(u=>be(u.ev,u.t)).join(""):`<div class="empty">No upcoming ${i(x)} events. ${i(P)}</div>`}
      ${l.length?`
        <details class="past-list" id="calPast" ${c.pastOpen?"open":""}>
          <summary>Past (${l.length})</summary>
          ${l.map(u=>be(u.ev,u.t)).join("")}
        </details>`:""}
    </div>
    ${r.length?`<p class="disclaimer">${i(P)}</p>`:""}`}async function I({interactive:e=!1,consent:t=!1}={}){if(!T()||c.loading||!N()&&!e)return;c.loading=!0,c.error="",h==="appointments"&&p();const a=await Rt({interactive:e,consent:t});c.loading=!1,a.ok?(c.needsReconnect=!1,c.stale=!1,c.error=""):a.needsReconnect&&!e?c.stale=!0:(c.needsReconnect=!!a.needsReconnect&&N(),c.error=a.error||"Could not reach Google Calendar"),(h==="appointments"||h==="settings")&&p()}function _t(){const e=Ze();return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">New note</h3></div>
      <div class="field">
        <label class="label" for="noteBody">Note</label>
        <textarea class="textarea" id="noteBody" placeholder="Symptom, question, reminder…"></textarea>
      </div>
      <div class="field">
        <label class="label" for="noteAuthor">Who (optional)</label>
        <select class="select" id="noteAuthor">
          <option value="">Not set</option>
          <option value="Vince">Vince</option>
          <option value="Chantal">Chantal</option>
        </select>
      </div>
      <button class="btn btn-primary" id="noteAdd">Add note</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Shared notes</h3></div>
      ${e.length?e.map(a=>`
        <div class="list-item">
          <div class="meta">${i(V(a.createdAt))}${a.author?" · "+i(a.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${i(a.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${a.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Ft(e){return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${i(e.household.dueDate||"")}" />
      </div>
      <button class="btn btn-sage btn-sm" id="saveDue">Update due date</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Household PIN</h3></div>
      <form id="pinForm" novalidate>
        <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
        <div class="field">
          <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="setPin" placeholder="New PIN (at least 4 digits)" autocomplete="new-password" />
        </div>
        <button class="btn btn-soft btn-sm" type="submit">Change PIN</button>
      </form>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Backup</h3></div>
      <p class="meta" style="margin:0 0 12px">Save a copy of your due date, daily logs, and notes as a JSON file for safekeeping.</p>
      <button class="btn btn-primary btn-sm" id="doExport">Download a backup</button>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    ${T()?`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google Calendar</h3></div>
      ${N()?`
      <p class="meta" style="margin:0 0 12px">Connected (read-only). Bump shows only events with ${i(x)} in the title.</p>
      <button class="btn btn-ghost btn-sm" id="calDisconnect">Disconnect</button>`:`
      <p class="meta" style="margin:0">Not connected. Use <strong>Connect Google Calendar</strong> on the Appts tab.</p>`}
    </div>`:""}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`}function Gt(e){var t,a,n,o,s,r,l,m,u,k,y,S,O,B,X,ee,te,ae;h==="today"&&((t=e.querySelector("#hydroPlus"))==null||t.addEventListener("click",()=>{oe(1),p()}),(a=e.querySelector("#hydroMinus"))==null||a.addEventListener("click",()=>{oe(-1),p()}),(n=e.querySelector("#woDone"))==null||n.addEventListener("change",d=>{const A=Se(f().household.dueDate);Ve(d.target.checked,Le(D(),A).id),p()}),(o=e.querySelector("#walkDone"))==null||o.addEventListener("change",d=>{Je(d.target.checked),p()}),(s=e.querySelector("#woDetails"))==null||s.addEventListener("toggle",d=>{H.detailsOpen=d.target.open}),(r=e.querySelector("#woStop"))==null||r.addEventListener("toggle",d=>{H.stopOpen=d.target.open}),e.querySelectorAll("[data-browse-week]").forEach(d=>{d.addEventListener("click",()=>{C=Number(d.dataset.browseWeek),p()})}),(l=e.querySelector("#resetBrowse"))==null||l.addEventListener("click",()=>{C=null,p()})),h==="appointments"&&((m=e.querySelector("#calConnect"))==null||m.addEventListener("click",()=>I({interactive:!0})),(u=e.querySelector("#calRefresh"))==null||u.addEventListener("click",()=>I({interactive:!0})),(k=e.querySelector("#calReconnect"))==null||k.addEventListener("click",()=>I({interactive:!0,consent:!0})),(y=e.querySelector("#calPast"))==null||y.addEventListener("toggle",d=>{c.pastOpen=d.target.open})),h==="notes"&&((S=e.querySelector("#noteAdd"))==null||S.addEventListener("click",()=>{const d=e.querySelector("#noteBody").value.trim();d&&(Qe({body:d,author:e.querySelector("#noteAuthor").value}),p())}),e.querySelectorAll(".note-del").forEach(d=>{d.addEventListener("click",()=>{confirm("Delete this note?")&&(Xe(d.dataset.id),p())})})),h==="settings"&&((O=e.querySelector("#saveDue"))==null||O.addEventListener("click",()=>{const d=e.querySelector("#setDue").value;d&&(Ke(d),C=null,p())}),(B=e.querySelector("#pinForm"))==null||B.addEventListener("submit",d=>{d.preventDefault();const A=e.querySelector("#setPin").value.trim();if(!Re.test(A))return alert(qe);je(A),alert("PIN updated"),p()}),(X=e.querySelector("#doExport"))==null||X.addEventListener("click",()=>{const d=et(),A=e.querySelector("#exportBox");A.classList.remove("hidden"),A.value=d;const Pe=new Blob([d],{type:"application/json"}),ne=URL.createObjectURL(Pe),F=document.createElement("a");F.href=ne,F.download=`bump-backup-${D()}.json`,F.click(),URL.revokeObjectURL(ne)}),(ee=e.querySelector("#doLock"))==null||ee.addEventListener("click",()=>{Ge(),w="unlock",p()}),(te=e.querySelector("#calDisconnect"))==null||te.addEventListener("click",async()=>{confirm("Disconnect Google Calendar? Saved events will be removed from this phone.")&&(await he(),Object.assign(c,{loading:!1,error:"",needsReconnect:!1,stale:!1}),p())}),(ae=e.querySelector("#doReset"))==null||ae.addEventListener("click",async()=>{confirm("Erase all Bump data on this device?")&&(await he(),Object.assign(c,{loading:!1,error:"",needsReconnect:!1,stale:!1}),tt(),w="setup",h="today",C=null,p())}))}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(!z()||!$e()||(j&&j!==D()&&p(),h==="appointments"&&I({interactive:!1})))});p();
