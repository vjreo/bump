(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const V="America/New_York";function $(){return be(new Date)}function be(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:V,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),a=t.find(i=>i.type==="year").value,n=t.find(i=>i.type==="month").value,o=t.find(i=>i.type==="day").value;return`${a}-${n}-${o}`}function we(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number),o=new Date(Date.UTC(t,a-1,n,12));return new Intl.DateTimeFormat("en-US",{timeZone:V,weekday:"short",month:"short",day:"numeric"}).format(o)}function xe(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number);return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric"}).format(new Date(Date.UTC(t,a-1,n,12)))}function J(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:V,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function ve(e,t){const[a,n,o]=e.split("-").map(Number),[i,s,l]=t.split("-").map(Number),g=Date.UTC(a,n-1,o),d=Date.UTC(i,s-1,l);return Math.round((g-d)/864e5)}function Re(e,t=$()){if(!e)return null;const n=280-ve(e,t);if(n<0)return 1;const o=Math.floor(n/7)+1;return Math.min(42,Math.max(1,o))}function Pe(e){if(e==null||Number.isNaN(Number(e)))return null;const t=Number(e);return t<=13?{number:1,label:"1st"}:t<=27?{number:2,label:"2nd"}:{number:3,label:"3rd"}}function Oe(e,t=$()){return e?ve(e,t):null}function ze(e,t){const[a,n,o]=e.split("-").map(Number);return new Date(Date.UTC(a,n-1,o+t)).toISOString().slice(0,10)}const Z="bump.v1",Q=1;function ke(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function z(){return{schemaVersion:Q,household:{id:ke(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function E(e,t=$()){return e.dailyLogs[t]||(e.dailyLogs[t]={date:t,hydrationCount:0,windDown:!1,movementDone:!1,workoutId:null}),e.dailyLogs[t]}let b=null;function v(){b.updatedAt=new Date().toISOString();try{localStorage.setItem(Z,JSON.stringify(b))}catch(e){console.warn("persist failed",e)}}function Se(){try{const e=localStorage.getItem(Z);e?(b=JSON.parse(e),b.schemaVersion||(b.schemaVersion=Q),b.household||(b=z())):b=z()}catch{b=z()}return E(b),b}function f(){return b||Se(),b}function M(){var t,a;const e=f();return!!((t=e.household)!=null&&t.pin&&((a=e.household)!=null&&a.dueDate))}function Ce(){return!!f().unlocked}function Me({pin:e,dueDate:t}){const a=f();return a.household.pin=String(e).trim(),a.household.dueDate=t,a.household.createdAt=a.household.createdAt||new Date().toISOString(),a.unlocked=!0,E(a),v(),a}function He(e){var a;const t=f();return!!((a=t.household)!=null&&a.pin)&&String(e??"").trim()===String(t.household.pin)}function We(e){const t=f();return He(e)?(t.unlocked=!0,E(t),v(),!0):!1}function Ue(){const e=f();e.unlocked=!1,v()}function _e(e){const t=f();t.household.dueDate=e,v()}function Fe(e){const t=f();t.household.pin=String(e).trim(),v()}function j(){return E(f())}function se(e=1){const t=f(),a=E(t);return a.hydrationCount=Math.max(0,(a.hydrationCount||0)+e),v(),a}function Ge(e){const t=f(),a=E(t);return a.windDown=!!e,v(),a}function je(e,t=null){const a=f(),n=E(a);return n.movementDone=!!e,n.workoutId=e?t:null,v(),n}function Ke(){return[...f().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function Ye({body:e,author:t=""}){const a=f(),n={id:ke(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return a.notes.unshift(n),v(),n}function Ve(e){const t=f();t.notes=t.notes.filter(a=>a.id!==e),v()}function Je(){const e=f(),{pin:t,...a}=e.household,n={schemaVersion:Q,exportedAt:new Date().toISOString(),app:"bump-tracker",household:a,dailyLogs:e.dailyLogs,notes:e.notes};return JSON.stringify(n,null,2)}function Ze(){localStorage.removeItem(Z),b=z(),v()}const ie="1db2ccd5ddc253b4eedee62ffecd522f2c5e9f49b16e2090a7fe1dab48164daa".toLowerCase(),De="bump.inviteOk.v1";async function Qe(e){const t=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(a)).map(n=>n.toString(16).padStart(2,"0")).join("")}function $e(){try{return localStorage.getItem(De)==="1"}catch{return!1}}function Xe(){try{localStorage.setItem(De,"1")}catch(e){console.warn("invite flag persist failed",e)}}function et(e){return String(e??"").trim().toLowerCase()}async function tt(e){if(!ie)return console.warn("[bump] VITE_INVITE_HASH not set — invite gate cannot unlock"),!1;const t=et(e);return t&&await Qe(t)===ie?(Xe(),!0):!1}function Te(e){return Math.max(4,Math.min(41,Math.round(e)||4))}function at(e){const t=Te(e);return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const nt={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you’re ready; share any medication list with your doctor or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That’s a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognizable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"Reflexes and fingerprints",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you’ve come a long way."},13:{title:"End of first trimester",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Last week of the first trimester — add a short outdoor walk if weather and energy allow."},14:{title:"Second trimester begins",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn’t a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You’re about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keepsake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"End of second trimester",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Last week of the second trimester. Fatigue may return; rest counts as progress.",tip:"Wind down: dim lights, phone away, short stretch."},28:{title:"Third trimester begins",size:"an eggplant",baby:"REM (dream) sleep may occur; baby packs on weight.",feel:"If you’re Rh-negative, an immune globulin shot may be offered.",tip:"Welcome to the third trimester — add third-trimester visits to your shared calendar."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you’re unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it’s time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you’re a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You’re not ‘late’ at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function re(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e)));return{week:t,...nt[t],nhsWeek:Te(t),nhsUrl:at(t)}}const ot=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:13,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Start a shared list of questions for your OB or midwife in Notes"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:14,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add follow-up labs to Google Calendar with [Bump] in the title"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function st(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),a=ot.find(n=>t>=n.from&&t<=n.to);return{week:t,bandTitle:a.title,thisWeek:a.thisWeek,lookingAhead:a.comingUp}}const Ee=16,H=28,it={bodyweight:"bodyweight",light:"light KB",moderate:"moderate KB"},le={moderate:"light",light:"light"},rt="Choose a kettlebell you can lift with good form and steady breathing, finishing each set with 2–3 reps left in the tank.",lt="Aim for “somewhat hard” (RPE 13–14): you can still talk in full sentences. Exhale on the effort — no breath-holding. Sip water and stay cool.",ct="Check with your OB or midwife before starting or changing your routine.",dt=["Vaginal bleeding","Abdominal pain","Regular painful contractions","Fluid leaking from the vagina","Shortness of breath before you start exercising","Dizziness","Headache","Chest pain","Muscle weakness affecting balance","Calf pain or swelling"],ut={catCow:{name:"Cat–cow",dose:"8 slow reps",load:"bodyweight",cue:"Move with your breath: exhale as you round, inhale as you lengthen."},hipCircles:{name:"Standing hip circles",dose:"8 each direction",load:"bodyweight",cue:"Hands on hips, smooth circles; hold a wall if you like."},airSquat:{name:"Bodyweight squat",dose:"10 reps",load:"bodyweight",cue:"Easy range to wake up hips and knees.",t3:{name:"Squat to chair",cue:"Tap a chair lightly each rep."}},armCircles:{name:"Arm circles + wall angels",dose:"10 each",load:"bodyweight",cue:"Back against a wall, slide arms up and down without arching."},breathing:{name:"360° breathing",dose:"6 breaths",load:"bodyweight",cue:"Seated tall: inhale into ribs and belly, exhale and gently lift the pelvic floor."},marching:{name:"Marching in place",dose:"2 min",load:"bodyweight",cue:"Light marching with easy overhead reaches to raise your temperature."},gobletSquat:{name:"Goblet squat",dose:"3 × 8–10",load:"moderate",cue:"Bell at your chest, sit between your heels, exhale as you stand.",t3:{name:"Goblet squat to box",dose:"2–3 × 8",cue:"Sit back to a box or chair; comfortable depth and stance width."}},kbRdl:{name:"Kettlebell Romanian deadlift",dose:"3 × 10",load:"moderate",cue:"Soft knees, hinge at the hips with a long spine; squeeze glutes to stand.",t3:{dose:"2–3 × 8",cue:"Wider stance to make room for the bump; stop where your back stays flat."}},kbDeadlift:{name:"Kettlebell deadlift",dose:"3 × 10",load:"moderate",cue:"Bell between your feet, hinge and stand tall; exhale on the way up.",t3:{dose:"2–3 × 8",cue:"Wider stance; elevate the bell on a step if reaching the floor is awkward."}},reverseLunge:{name:"Reverse lunge",dose:"3 × 8 each side",load:"bodyweight",cue:"Step back softly, front knee over mid-foot; hold a light KB at your chest if steady.",t3:{name:"Supported split squat",dose:"2 × 8 each side",cue:"Stay in a split stance holding a wall or chair; no stepping, for balance."}},gluteBridge:{name:"Glute bridge",dose:"3 × 12",load:"light",cue:"Bell on your hips, press through heels, pause at the top.",from16:{name:"Shoulders-elevated hip thrust",cue:"Upper back on a couch or bench (not flat on the floor); bell on your hips."}},suitcaseCarry:{name:"Suitcase carry",dose:"3 × 30 sec each side",load:"moderate",cue:"Bell in one hand, walk tall without leaning.",t3:{dose:"2 × 20 sec each side"}},farmerCarry:{name:"Kettlebell carry",dose:"3 × 40 sec",load:"moderate",cue:"Walk tall, ribs stacked over hips, steady breathing.",t3:{dose:"2 × 30 sec"}},kbRow:{name:"Single-arm kettlebell row",dose:"3 × 10 each side",load:"moderate",cue:"Hand on a bench or chair, pull the bell toward your hip.",t3:{cue:"Staggered stance with your hand on a counter; keep the bump supported and back flat."}},kbPress:{name:"Half-kneeling kettlebell press",dose:"3 × 8 each side",load:"light",cue:"Ribs down, glute of the down knee squeezed, press overhead.",t3:{name:"Seated kettlebell press",dose:"2 × 8 each side",cue:"Sit tall on a bench or chair with back support; light bell."}},floorPress:{name:"Kettlebell floor press",dose:"3 × 10 each side",load:"moderate",cue:"Lying on your back, press the bell up; elbow lightly touches the floor.",from16:{name:"Incline kettlebell press",cue:"Back propped at about 45° on a couch or wedge, then press."}},inclinePushup:{name:"Push-up",dose:"3 × 8–10",load:"bodyweight",cue:"Hands under shoulders, body in one line; use knees if needed.",from16:{name:"Incline push-up",cue:"Hands on a bench or counter so the bump stays clear of the floor."},t3:{name:"Incline push-up",dose:"2–3 × 8",cue:"Hands on a counter or wall; keep a straight line."}},halo:{name:"Kettlebell halo",dose:"3 × 6 each direction",load:"light",cue:"Circle the bell around your head; keep ribs down and core quiet.",t3:{name:"Seated kettlebell halo",dose:"2 × 6 each direction"}},birdDog:{name:"Bird dog",dose:"3 × 8 each side",load:"bodyweight",cue:"On hands and knees, reach opposite arm and leg; exhale as you reach."},deadBug:{name:"Dead bug",dose:"3 × 8 each side",load:"bodyweight",cue:"On your back, lower opposite arm and leg slowly; back stays heavy.",from16:{name:"Incline dead bug",cue:"Propped at about 45° on a couch or wedge (not flat), slowly extend opposite arm and leg."}},sidePlank:{name:"Side plank (from knees)",dose:"3 × 20 sec each side",load:"bodyweight",cue:"Elbow under shoulder, hips lifted; stop if you feel belly doming.",t3:{name:"Side-lying clamshell",dose:"2 × 12 each side",cue:"Lying on your side with knees bent, open the top knee; pillow under the bump."}},briskWalk:{name:"Brisk walk",dose:"15–20 min",load:"bodyweight",cue:"Talk-test pace: you can chat but not sing. Flat, even routes."},squatPry:{name:"Goblet hold squat pry",dose:"3 × 30 sec",load:"light",cue:"Hold a light bell at your chest in a comfortable squat; gently shift side to side.",t3:{name:"Supported squat hold",cue:"Hold a counter or doorframe in a comfortable squat."}},hipFlexor:{name:"Half-kneeling hip flexor stretch",dose:"30 sec each side",load:"bodyweight",cue:"Tuck the pelvis slightly; pad under the knee."},ninetyNinety:{name:"90/90 hip switches",dose:"6 each side",load:"bodyweight",cue:"Seated, rotate knees side to side; hands behind you for support."},figureFour:{name:"Seated figure-four stretch",dose:"30 sec each side",load:"bodyweight",cue:"Ankle over opposite knee, sit tall and lean gently."},childsPose:{name:"Wide-knee child’s pose",dose:"45 sec",load:"bodyweight",cue:"Knees wide to make room for the bump; rest your head on your hands."},doorwayChest:{name:"Doorway chest stretch",dose:"30 sec each side",load:"bodyweight",cue:"Forearm on the frame, step through gently."},threadNeedle:{name:"Thread the needle (gentle)",dose:"5 each side",load:"bodyweight",cue:"Small, easy rotation from hands and knees — no forcing."},neckStretch:{name:"Neck and upper-trap stretch",dose:"30 sec each side",load:"bodyweight",cue:"Ear toward shoulder, opposite hand reaching down."},sideReach:{name:"Standing side-body reach",dose:"5 each side",load:"bodyweight",cue:"Reach up and over with a long exhale."},calfStretch:{name:"Wall calf stretch",dose:"30 sec each side",load:"bodyweight",cue:"Back heel down, lean into the wall."},hamstringStretch:{name:"Standing hamstring stretch",dose:"30 sec each side",load:"bodyweight",cue:"Heel on a low step, hinge forward with a long spine."}},ce=[{id:"lower",name:"Lower body strength",focus:"Legs and glutes",minutes:30,warmup:["catCow","hipCircles","airSquat"],strength:["gobletSquat","kbRdl","reverseLunge","gluteBridge","suitcaseCarry"],mobility:["hipFlexor","ninetyNinety","figureFour"]},{id:"upper",name:"Upper body & back",focus:"Back, shoulders, and posture",minutes:30,warmup:["armCircles","catCow","marching"],strength:["kbRow","floorPress","kbPress","inclinePushup","halo"],mobility:["doorwayChest","threadNeedle","neckStretch"]},{id:"recovery",name:"Active recovery",focus:"Easy cardio and mobility",minutes:25,warmup:["marching"],strength:["briskWalk","gluteBridge","birdDog","squatPry"],mobility:["catCow","calfStretch","childsPose","sideReach"]},{id:"full",name:"Full body strength",focus:"Hinge, squat, push, pull, carry",minutes:35,warmup:["catCow","airSquat","armCircles"],strength:["kbDeadlift","gobletSquat","kbRow","inclinePushup","farmerCarry"],mobility:["hamstringStretch","hipFlexor","sideReach"]},{id:"core",name:"Mobility & core stability",focus:"Breathing, core control, and hips",minutes:25,warmup:["breathing","catCow"],strength:["birdDog","deadBug","sidePlank","squatPry"],mobility:["ninetyNinety","figureFour","childsPose","threadNeedle"]}];function G(e,t){const a=ut[e];let n={id:e,...a};t>=Ee&&a.from16&&(n={...n,...a.from16,swapped:!0}),t>=H&&a.t3&&(n={...n,...a.t3,swapped:!0});let o=n.load;return t>=H&&le[o]&&(o=le[o]),delete n.from16,delete n.t3,{...n,loadKey:o,loadLabel:it[o]}}function pt(e){const[t,a,n]=e.split("-").map(Number);return Math.round((Date.UTC(t,a-1,n)-Date.UTC(2026,0,1))/864e5)}function ht(e,t){const a=ce.length,n=ce[(pt(e)%a+a)%a],o=Number(t)||1,i=[];o>=Ee&&i.push("No lying flat on your back: incline or side-lying swaps are built in."),o>=H&&i.push("3rd trimester: lighter loads, fewer sets, more support for balance.");const s=o>=H?Math.max(20,n.minutes-5):n.minutes;return{id:n.id,name:n.name,focus:n.focus,minutes:s,notes:i,warmup:n.warmup.map(l=>G(l,o)),strength:n.strength.map(l=>G(l,o)),mobility:n.mobility.map(l=>G(l,o))}}const de="1075531369147-ok2muis4jo4r0njb598gov309aoim30n.apps.googleusercontent.com".trim(),Ae=de.endsWith(".apps.googleusercontent.com")?de:"",mt="primary",q="[Bump]",ue="https://www.googleapis.com/auth/calendar.events.readonly",ft=183,gt=60,yt=10,bt="https://accounts.google.com/gsi/client",I="bump.gcal.token.v1",U="bump.gcal.cache.v1",pe=864e5;function A(){return!!Ae}function _(e){try{return JSON.parse(localStorage.getItem(e)||"null")}catch{return null}}function Ne(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(a){console.warn("[bump] calendar storage failed",a)}}function L(){return!!_(U)}function wt(){return _(U)||{events:[],fetchedAt:null}}function vt(){const e=_(I);return e&&e.accessToken&&e.expiresAt>Date.now()+6e4?e.accessToken:null}let R=null;function X(){var e,t;return A()?(t=(e=window.google)==null?void 0:e.accounts)!=null&&t.oauth2?Promise.resolve():(R||(R=new Promise((a,n)=>{const o=document.createElement("script");o.src=bt,o.async=!0,o.defer=!0,o.onload=()=>a(),o.onerror=()=>{R=null,n(new Error("Could not load Google sign-in"))},document.head.appendChild(o)})),R):Promise.reject(new Error("Calendar not set up"))}let P=null,D=null;function kt(){return P||(P=window.google.accounts.oauth2.initTokenClient({client_id:Ae,scope:ue,callback:e=>{const t=D;if(D=null,!t)return;if(!e||e.error||!e.access_token){t.reject(new Error((e==null?void 0:e.error_description)||(e==null?void 0:e.error)||"Authorization failed"));return}if(!window.google.accounts.oauth2.hasGrantedAllScopes(e,ue)){t.reject(new Error("Calendar access was not granted"));return}const a=Number(e.expires_in)||3600;Ne(I,{accessToken:e.access_token,expiresAt:Date.now()+a*1e3}),t.resolve(e.access_token)},error_callback:e=>{const t=D;D=null,t&&t.reject(new Error((e==null?void 0:e.type)==="popup_closed"?"Sign-in window closed":"Could not open Google sign-in"))}}),P)}function St(e=""){return new Promise((t,a)=>{D&&D.reject(new Error("Superseded")),D={resolve:t,reject:a};try{kt().requestAccessToken({prompt:e})}catch(n){D=null,a(n)}})}const K=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");function Ct(e){return K.lastIndex=0,typeof e=="string"&&K.test(e)}function Dt(e){return String(e).replace(K," ").replace(/\s{2,}/g," ").trim()||"Untitled"}function $t(e){return(e||[]).filter(t=>t&&t.status!=="cancelled"&&Ct(t.summary)).map(t=>{var n,o,i,s,l,g;const a=!!((n=t.start)!=null&&n.date&&!((o=t.start)!=null&&o.dateTime));return{id:String(t.id||""),title:Dt(t.summary),allDay:a,start:a?t.start.date:(i=t.start)==null?void 0:i.dateTime,end:a?((s=t.end)==null?void 0:s.date)||t.start.date:((l=t.end)==null?void 0:l.dateTime)||((g=t.start)==null?void 0:g.dateTime),location:String(t.location||"").trim()}}).filter(t=>t.start)}class Be extends Error{}async function Tt(e){const t=Date.now(),a=new URLSearchParams({singleEvents:"true",orderBy:"startTime",timeMin:new Date(t-gt*pe).toISOString(),timeMax:new Date(t+ft*pe).toISOString(),maxResults:"250",q:q.replace(/[^\w\s]/g," ").trim(),fields:"items(id,status,summary,location,start,end),nextPageToken"}),n=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(mt)}/events`,o=[];let i="";for(let s=0;s<5;s++){i&&a.set("pageToken",i);const l=await fetch(`${n}?${a}`,{headers:{Authorization:`Bearer ${e}`}});if(l.status===401)throw new Be("Token expired");if(!l.ok)throw new Error(`Calendar request failed (${l.status})`);const g=await l.json();if(o.push(...$t(g.items)),i=g.nextPageToken||"",!i)break}return o}async function Et({interactive:e=!1,consent:t=!1}={}){if(!A())return{ok:!1,error:"Calendar not set up"};let a=t?null:vt();for(let n=0;n<2;n++){if(!a){if(!e)return{ok:!1,needsReconnect:!0};try{await X(),a=await St(t?"consent":"")}catch(o){return{ok:!1,needsReconnect:!0,error:o.message}}}try{const o=await Tt(a);return Ne(U,{events:o,fetchedAt:new Date().toISOString()}),{ok:!0}}catch(o){if(o instanceof Be){localStorage.removeItem(I),a=null;continue}return{ok:!1,error:o.message||"Could not reach Google Calendar"}}}return{ok:!1,needsReconnect:!0}}async function he(){const e=_(I);if(localStorage.removeItem(I),localStorage.removeItem(U),e!=null&&e.accessToken&&A())try{await X(),await new Promise(t=>window.google.accounts.oauth2.revoke(e.accessToken,()=>t()))}catch{}}const me=8,m=document.getElementById("app");let h="today",C=null,w="auto",Y=null;const Ie=/^\d{4,}$/,Le="PIN should be at least 4 digits (numbers only)",c={loading:!1,error:"",needsReconnect:!1,stale:!1,pastOpen:!1},W={detailsOpen:!1,stopOpen:!1},O=`Add ${q} to an event title in your Google Calendar to show it here.`;Se();function r(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(){const e=f();if(!$e()){w="invite",fe();return}if(!M()||!Ce()){(w==="invite"||w==="auto")&&(w=M()?"unlock":"setup"),fe();return}At(e)}function fe(){const e=M();if(w==="auto"&&(w=$e()?e?"unlock":"setup":"invite"),w==="invite"){m.innerHTML=`
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
      </div>`;const a=m.querySelector("#inviteCode");a.focus();const n=async()=>{const o=m.querySelector("#gateErr");o.classList.add("hidden"),await tt(a.value)?(w="auto",p()):(o.textContent="That invite doesn’t match. Double-check and try again.",o.classList.remove("hidden"))};m.querySelector("#doInvite").onclick=n,a.onkeydown=o=>{o.key==="Enter"&&n()};return}if(w==="setup"){m.innerHTML=`
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
      </div>`,m.querySelector("#setupForm").onsubmit=a=>{a.preventDefault();const n=m.querySelector("#dueDate").value,o=m.querySelector("#pin").value.trim(),i=m.querySelector("#pin2").value.trim(),s=m.querySelector("#gateErr");if(!n){s.textContent="Pick a due date",s.classList.remove("hidden");return}if(!Ie.test(o)){s.textContent=Le,s.classList.remove("hidden");return}if(o!==i){s.textContent="PINs do not match",s.classList.remove("hidden");return}Me({pin:o,dueDate:n}),w="auto",h="today",p()};return}m.innerHTML=`
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
    </div>`;const t=m.querySelector("#pin");t.focus(),m.querySelector("#unlockForm").onsubmit=a=>{if(a.preventDefault(),We(t.value))w="auto",p();else{const n=m.querySelector("#gateErr");n.textContent="Incorrect PIN",n.classList.remove("hidden")}}}function At(e){const t=e.household.dueDate,a=Re(t),n=Oe(t),o=j(),i=$();Y=i,m.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${r(we(i))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${h==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${h==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${h==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${h==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,m.querySelectorAll(".nav button").forEach(l=>{l.onclick=()=>{h=l.dataset.tab,p(),h==="appointments"&&L()&&B({interactive:!0})}}),A()&&X().catch(()=>{});const s=m.querySelector("#main");h==="today"?s.innerHTML=Lt({due:t,week:a,daysLeft:n,log:o}):h==="appointments"?s.innerHTML=xt():h==="notes"?s.innerHTML=Rt():s.innerHTML=Pt(e),Ot(s),h==="today"&&Nt(s)}function Nt(e){const t=e.querySelector(".week-browser"),a=(t==null?void 0:t.querySelector(".week-pill.active"))||(t==null?void 0:t.querySelector(".week-pill.current"));if(!t||!a)return;const n=t.getBoundingClientRect(),o=a.getBoundingClientRect();t.scrollLeft+=o.left-n.left-(n.width-o.width)/2}function ge(e,{compact:t=!1}={}){return e?`
    <article class="week-hero">
      <p class="eyebrow">Week ${e.week}</p>
      <h2>${r(e.title)}</h2>
      <p class="week-size">About the size of ${r(e.size)}</p>
      <div class="week-section">
        <h3>Your baby</h3>
        <p>${r(e.baby)}</p>
      </div>
      <div class="week-section">
        <h3>How you may feel</h3>
        <p>${r(e.feel)}</p>
      </div>
      <div class="week-section">
        <h3>This week’s tip</h3>
        <p>${r(e.tip)}</p>
      </div>
      <p class="week-attrib">
        Inspired by the
        <a href="${r(e.nhsUrl)}" target="_blank" rel="noopener noreferrer">NHS Best Start in Life week-by-week guide</a>
        (${e.nhsWeek===e.week?`Week ${e.week}`:`closest NHS page: Week ${e.nhsWeek}`}). Original summary — not medical advice.
        ${t?"":"Talk to your midwife or OB about anything that worries you."}
      </p>
    </article>`:""}function Bt(e){return e==null?{n:"—",l:"Days to due"}:e>0?{n:e,l:"Days to due"}:e===0?{n:0,l:"Due today"}:{n:Math.abs(e),l:"Days past due"}}function It(e,t){const a=ht($(),e),n=s=>`
    <li>
      <div class="wo-move"><span class="wo-move-name">${r(s.name)}</span><span class="wo-dose">${r(s.dose)}</span></div>
      <div class="wo-cue">${s.loadKey!=="bodyweight"?`<span class="wo-load">${r(s.loadLabel)}</span> · `:""}${r(s.cue)}</div>
    </li>`,o=(s,l)=>`
    <h4 class="wo-section">${s}</h4>
    <ul class="wo-list">${l.map(n).join("")}</ul>`,i=!!t.movementDone;return`
    <div class="card workout-card">
      <div class="card-head">
        <h3 class="card-title">💪 Today’s workout</h3>
        <span class="meta">~${a.minutes} min</span>
      </div>
      <details class="wo-details" id="woDetails" ${W.detailsOpen?"open":""}>
        <summary>
          <div class="wo-name">${r(a.name)}</div>
          <div class="meta">${r(a.focus)} · kettlebell + bodyweight</div>
          <ul class="wo-compact">${a.strength.map(s=>`<li>${r(s.name)} <span>${r(s.dose)}</span></li>`).join("")}</ul>
          <span class="wo-toggle" aria-hidden="true"></span>
        </summary>
        ${a.notes.length?`<ul class="wo-notes">${a.notes.map(s=>`<li>${r(s)}</li>`).join("")}</ul>`:""}
        ${o("Warm-up",a.warmup)}
        ${o("Main set",a.strength)}
        ${o("Mobility",a.mobility)}
        <p class="wo-guide">${r(rt)}</p>
      </details>
      <div class="btn-row">
        <button class="btn ${i?"btn-sage":"btn-soft"} btn-sm" id="moveDone" data-workout-id="${a.id}" aria-pressed="${i}">
          ${i?"✓ Done today":"Done today"}
        </button>
      </div>
      <p class="wo-safety">${r(lt)}</p>
      <details class="wo-stop" id="woStop" ${W.stopOpen?"open":""}>
        <summary>When to stop</summary>
        <p>Stop and call your OB or midwife if you notice:</p>
        <ul>${dt.map(s=>`<li>${r(s)}</li>`).join("")}</ul>
        <p>${r(ct)}</p>
      </details>
    </div>`}function Lt({due:e,week:t,daysLeft:a,log:n}){var k;const o=re(t),i=C??t,s=re(i),l=Bt(a),g=Array.from({length:me},(y,S)=>`<div class="glass ${S<n.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),d=Array.from({length:42},(y,S)=>S+1).map(y=>`<button type="button" class="${["week-pill",y===i?"active":"",y===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${y}">${y}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${r(((k=Pe(t))==null?void 0:k.label)??"—")}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${r(l.n)}</div><div class="l">${r(l.l)}</div></div>
      <div class="stat"><div class="n">${r(e?xe(e):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${ge(o)}

    ${(()=>{const y=st(t);if(!y)return"";const S=y.thisWeek.map(N=>`<li>${r(N)}</li>`).join(""),x=y.lookingAhead.map(N=>`<li>${r(N)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${r(y.bandTitle)}</span>
      </div>
      <ul class="prep-list">${S}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${x}</ul>
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
      <div class="hydro-glasses">${g}</div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🌙 Evening wind-down</h3>
      </div>
      <div class="toggle-row">
        <div>
          <div style="font-weight:650">Done for tonight?</div>
          <div class="meta">Dim lights, stretch, phone away</div>
        </div>
        <button class="toggle ${n.windDown?"on":""}" id="windToggle" role="switch" aria-checked="${n.windDown}" aria-label="Wind-down done"></button>
      </div>
    </div>

    ${It(t,n)}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${C&&C!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${d}</div>
      ${C&&C!==t?ge(s,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `}function qt(e,t,a,n){if(e.allDay){const s=e.end<=a;return{past:s,onToday:!s&&e.start<=a,isToday:!s&&e.start<=a,isTomorrow:!s&&e.start===n}}const o=be(new Date(e.start)),i=Date.parse(e.end||e.start)<t;return{past:i,onToday:o===a,isToday:!i&&o<=a,isTomorrow:!i&&o===n}}function ye(e,t){const a=e.allDay?`${we(e.start)} · All day`:J(e.start);return`
    <div class="list-item${t.past?" is-past":""}">
      <h4>${r(e.title)}${t.isToday?' <span class="chip chip-today">Today</span>':""}</h4>
      <div class="meta">${r(a)}${e.location?" · "+r(e.location):""}</div>
      ${t.isTomorrow?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
    </div>`}function xt(){if(!A())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="cal-lead">Calendar not set up yet</p>
        <p class="meta">Appointments will come from Google Calendar once it’s connected. ${r(O)}</p>
      </div>`;if(!L())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="meta" style="margin:0 0 12px">Show events from your Google Calendar here (read-only). ${r(O)}</p>
        ${c.error?`<p class="err" style="margin:0 0 10px">${r(c.error)}</p>`:""}
        <button class="btn btn-primary" id="calConnect" ${c.loading?"disabled":""}>${c.loading?"Connecting…":"Connect Google Calendar"}</button>
      </div>`;const{events:e,fetchedAt:t}=wt(),a=Date.now(),n=$(),o=ze(n,1),i=e.map(d=>({ev:d,t:qt(d,a,n,o)})),s=i.filter(d=>!d.t.past||d.t.onToday).sort((d,k)=>d.ev.start<k.ev.start?-1:1),l=i.filter(d=>d.t.past&&!d.t.onToday).sort((d,k)=>d.ev.start<k.ev.start?1:-1).slice(0,yt);let g;return c.loading?g="Updating…":g=t?`Last updated ${J(t)}`:"Not updated yet",`
    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📅 Upcoming</h3>
        <button class="btn btn-ghost btn-sm" id="calRefresh" ${c.loading?"disabled":""}>Refresh</button>
      </div>
      <p class="meta cal-status">${r(g)}${c.stale&&!c.loading?" · Tap Refresh to update":""}</p>
      ${c.needsReconnect&&!c.loading?`
        <div class="cal-alert">
          <p>Couldn’t refresh from Google Calendar${c.error?` (${r(c.error)})`:""}. Showing saved events.</p>
          <button class="btn btn-soft btn-sm" id="calReconnect">Reconnect</button>
        </div>`:c.error&&!c.loading?`<p class="err" style="margin:0 0 8px">${r(c.error)}</p>`:""}
      ${s.length?s.map(d=>ye(d.ev,d.t)).join(""):`<div class="empty">No upcoming ${r(q)} events. ${r(O)}</div>`}
      ${l.length?`
        <details class="past-list" id="calPast" ${c.pastOpen?"open":""}>
          <summary>Past (${l.length})</summary>
          ${l.map(d=>ye(d.ev,d.t)).join("")}
        </details>`:""}
    </div>
    ${s.length?`<p class="disclaimer">${r(O)}</p>`:""}`}async function B({interactive:e=!1,consent:t=!1}={}){if(!A()||c.loading||!L()&&!e)return;c.loading=!0,c.error="",h==="appointments"&&p();const a=await Et({interactive:e,consent:t});c.loading=!1,a.ok?(c.needsReconnect=!1,c.stale=!1,c.error=""):a.needsReconnect&&!e?c.stale=!0:(c.needsReconnect=!!a.needsReconnect&&L(),c.error=a.error||"Could not reach Google Calendar"),(h==="appointments"||h==="settings")&&p()}function Rt(){const e=Ke();return`
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
          <div class="meta">${r(J(a.createdAt))}${a.author?" · "+r(a.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${r(a.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${a.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Pt(e){return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${r(e.household.dueDate||"")}" />
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
    ${A()?`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google Calendar</h3></div>
      ${L()?`
      <p class="meta" style="margin:0 0 12px">Connected (read-only). Bump shows only events with ${r(q)} in the title.</p>
      <button class="btn btn-ghost btn-sm" id="calDisconnect">Disconnect</button>`:`
      <p class="meta" style="margin:0">Not connected. Use <strong>Connect Google Calendar</strong> on the Appts tab.</p>`}
    </div>`:""}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`}function Ot(e){var t,a,n,o,i,s,l,g,d,k,y,S,x,N,ee,te,ae,ne;h==="today"&&((t=e.querySelector("#hydroPlus"))==null||t.addEventListener("click",()=>{se(1),p()}),(a=e.querySelector("#hydroMinus"))==null||a.addEventListener("click",()=>{se(-1),p()}),(n=e.querySelector("#windToggle"))==null||n.addEventListener("click",()=>{Ge(!j().windDown),p()}),(o=e.querySelector("#moveDone"))==null||o.addEventListener("click",u=>{const T=j();je(!T.movementDone,u.currentTarget.dataset.workoutId),p()}),(i=e.querySelector("#woDetails"))==null||i.addEventListener("toggle",u=>{W.detailsOpen=u.target.open}),(s=e.querySelector("#woStop"))==null||s.addEventListener("toggle",u=>{W.stopOpen=u.target.open}),e.querySelectorAll("[data-browse-week]").forEach(u=>{u.addEventListener("click",()=>{C=Number(u.dataset.browseWeek),p()})}),(l=e.querySelector("#resetBrowse"))==null||l.addEventListener("click",()=>{C=null,p()})),h==="appointments"&&((g=e.querySelector("#calConnect"))==null||g.addEventListener("click",()=>B({interactive:!0})),(d=e.querySelector("#calRefresh"))==null||d.addEventListener("click",()=>B({interactive:!0})),(k=e.querySelector("#calReconnect"))==null||k.addEventListener("click",()=>B({interactive:!0,consent:!0})),(y=e.querySelector("#calPast"))==null||y.addEventListener("toggle",u=>{c.pastOpen=u.target.open})),h==="notes"&&((S=e.querySelector("#noteAdd"))==null||S.addEventListener("click",()=>{const u=e.querySelector("#noteBody").value.trim();u&&(Ye({body:u,author:e.querySelector("#noteAuthor").value}),p())}),e.querySelectorAll(".note-del").forEach(u=>{u.addEventListener("click",()=>{confirm("Delete this note?")&&(Ve(u.dataset.id),p())})})),h==="settings"&&((x=e.querySelector("#saveDue"))==null||x.addEventListener("click",()=>{const u=e.querySelector("#setDue").value;u&&(_e(u),C=null,p())}),(N=e.querySelector("#pinForm"))==null||N.addEventListener("submit",u=>{u.preventDefault();const T=e.querySelector("#setPin").value.trim();if(!Ie.test(T))return alert(Le);Fe(T),alert("PIN updated"),p()}),(ee=e.querySelector("#doExport"))==null||ee.addEventListener("click",()=>{const u=Je(),T=e.querySelector("#exportBox");T.classList.remove("hidden"),T.value=u;const qe=new Blob([u],{type:"application/json"}),oe=URL.createObjectURL(qe),F=document.createElement("a");F.href=oe,F.download=`bump-backup-${$()}.json`,F.click(),URL.revokeObjectURL(oe)}),(te=e.querySelector("#doLock"))==null||te.addEventListener("click",()=>{Ue(),w="unlock",p()}),(ae=e.querySelector("#calDisconnect"))==null||ae.addEventListener("click",async()=>{confirm("Disconnect Google Calendar? Saved events will be removed from this phone.")&&(await he(),Object.assign(c,{loading:!1,error:"",needsReconnect:!1,stale:!1}),p())}),(ne=e.querySelector("#doReset"))==null||ne.addEventListener("click",async()=>{confirm("Erase all Bump data on this device?")&&(await he(),Object.assign(c,{loading:!1,error:"",needsReconnect:!1,stale:!1}),Ze(),w="setup",h="today",C=null,p())}))}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(!M()||!Ce()||(Y&&Y!==$()&&p(),h==="appointments"&&B({interactive:!1})))});p();
