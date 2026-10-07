(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const W="America/New_York";function L(){return Q(new Date)}function Q(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:W,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),n=t.find(s=>s.type==="year").value,a=t.find(s=>s.type==="month").value,i=t.find(s=>s.type==="day").value;return`${n}-${a}-${i}`}function de(e){if(!e)return"";const[t,n,a]=e.split("-").map(Number),i=new Date(Date.UTC(t,n-1,a,12));return new Intl.DateTimeFormat("en-US",{timeZone:W,weekday:"short",month:"short",day:"numeric"}).format(i)}function ue(e){if(!e)return"";const[t,n,a]=e.split("-").map(Number);return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric"}).format(new Date(Date.UTC(t,n-1,a,12)))}function X(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:W,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function ee(e,t){const[n,a,i]=e.split("-").map(Number),[s,o,v]=t.split("-").map(Number),w=Date.UTC(n,a-1,i),N=Date.UTC(s,o-1,v);return Math.round((w-N)/864e5)}function pe(e,t=L()){if(!e)return null;const a=280-ee(e,t);if(a<0)return 1;const i=Math.floor(a/7)+1;return Math.min(42,Math.max(1,i))}function me(e){if(e==null||Number.isNaN(Number(e)))return null;const t=Number(e);return t<=13?{number:1,label:"1st"}:t<=27?{number:2,label:"2nd"}:{number:3,label:"3rd"}}function he(e,t=L()){return e?ee(e,t):null}function fe(e,t){const[n,a,i]=e.split("-").map(Number);return new Date(Date.UTC(n,a-1,i+t)).toISOString().slice(0,10)}const P=[{type:"walk",title:"Neighborhood stroll",detail:"10–15 minutes at an easy pace. Fresh air counts."},{type:"walk",title:"After-meal walk",detail:"A short loop after lunch can ease bloating and stiffness."},{type:"walk",title:"Park path",detail:"Slow walk somewhere pleasant. Stop whenever you want."},{type:"stretch",title:"Cat–cow stretch",detail:"On hands and knees, gently arch and round. Breathe slowly."},{type:"stretch",title:"Hip opener",detail:"Seated figure-four or butterfly stretch — soft, no forcing."},{type:"stretch",title:"Side body stretch",detail:"Standing or seated, reach one arm overhead. Switch sides."},{type:"stretch",title:"Neck & shoulder release",detail:"Slow rolls and shrugs. Drop the shoulders away from ears."},{type:"strength",title:"Wall push-ups",detail:"5–10 easy reps against a wall. Keep breathing steady."},{type:"strength",title:"Sit-to-stand",detail:"From a sturdy chair, stand and sit 6–8 times. Use hands if needed."},{type:"strength",title:"Glute bridge (if comfortable)",detail:"On your back if still okay, or side-lying squeeze. Skip if it doesn’t feel right."},{type:"strength",title:"Band pull-aparts",detail:"Light resistance band, open arms wide. Posture-friendly."},{type:"walk",title:"Errand walk",detail:"Park farther away or take one extra block. Keep it easy."},{type:"stretch",title:"Child’s pose (wide knees)",detail:"Knees apart, fold forward if comfortable. Rest your head."},{type:"strength",title:"Calf raises",detail:"Hold a counter, rise onto toes 10 times. Helps circulation."}];function be(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return P[t%P.length]}function ye(e){const t=P.filter(n=>n.title!==e);return t[Math.floor(Math.random()*t.length)]||P[0]}const F="bump.v1",O=1;function U(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function C(){return{schemaVersion:O,household:{id:U(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},appointments:[],notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function D(e,t=L()){if(!e.dailyLogs[t]){const n=be(t);e.dailyLogs[t]={date:t,hydrationCount:0,windDown:!1,movementDone:!1,movementSuggestion:n.title,movementDetail:n.detail,movementType:n.type}}return e.dailyLogs[t]}let g=null;function h(){g.updatedAt=new Date().toISOString();try{localStorage.setItem(F,JSON.stringify(g))}catch(e){console.warn("persist failed",e)}}function te(){try{const e=localStorage.getItem(F);e?(g=JSON.parse(e),g.schemaVersion||(g.schemaVersion=O),g.household||(g=C())):g=C()}catch{g=C()}return D(g),g}function u(){return g||te(),g}function T(){var t,n;const e=u();return!!((t=e.household)!=null&&t.pin&&((n=e.household)!=null&&n.dueDate))}function ne(){return!!u().unlocked}function ge({pin:e,dueDate:t}){const n=u();return n.household.pin=String(e).trim(),n.household.dueDate=t,n.household.createdAt=n.household.createdAt||new Date().toISOString(),n.unlocked=!0,D(n),h(),n}function H(e){var n;const t=u();return!!((n=t.household)!=null&&n.pin)&&String(e??"").trim()===String(t.household.pin)}function ve(e){const t=u();return H(e)?(t.unlocked=!0,D(t),h(),!0):!1}function we(){const e=u();e.unlocked=!1,h()}function ke(e){const t=u();t.household.dueDate=e,h()}function Se(e){const t=u();t.household.pin=String(e).trim(),h()}function $(){return D(u())}function G(e=1){const t=u(),n=D(t);return n.hydrationCount=Math.max(0,(n.hydrationCount||0)+e),h(),n}function De(e){const t=u(),n=D(t);return n.windDown=!!e,h(),n}function Ne(e){const t=u(),n=D(t);return n.movementDone=!!e,h(),n}function Ie(e){const t=u(),n=D(t);return n.movementSuggestion=e.title,n.movementDetail=e.detail,n.movementType=e.type,n.movementDone=!1,h(),n}function Ae(){return[...u().appointments].sort((e,t)=>new Date(e.startsAt)-new Date(t.startsAt))}function Le({title:e,startsAt:t,location:n="",notes:a=""}){const i=u(),s={id:U(),title:e.trim(),startsAt:t,location:n.trim(),notes:a.trim(),createdAt:new Date().toISOString()};return i.appointments.push(s),h(),s}function Ee(e){const t=u();t.appointments=t.appointments.filter(n=>n.id!==e),h()}function xe(){return[...u().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function Te({body:e,author:t=""}){const n=u(),a={id:U(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return n.notes.unshift(a),h(),a}function qe(e){const t=u();t.notes=t.notes.filter(n=>n.id!==e),h()}function Be(){const e=u(),t={schemaVersion:O,exportedAt:new Date().toISOString(),app:"bump-tracker",household:{...e.household},dailyLogs:e.dailyLogs,appointments:e.appointments,notes:e.notes};return JSON.stringify(t,null,2)}function ae(e){const t=JSON.parse(e);if(!t||!t.household)throw new Error("Invalid bump export");const n=u();return n.schemaVersion=t.schemaVersion||O,n.household={...t.household,id:t.household.id||n.household.id},n.dailyLogs=t.dailyLogs||{},n.appointments=t.appointments||[],n.notes=t.notes||[],n.unlocked=!0,D(n),h(),n}function Ce(){localStorage.removeItem(F),g=C(),h()}const J="1db2ccd5ddc253b4eedee62ffecd522f2c5e9f49b16e2090a7fe1dab48164daa".toLowerCase(),ie="bump.inviteOk.v1";async function $e(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(a=>a.toString(16).padStart(2,"0")).join("")}function se(){try{return localStorage.getItem(ie)==="1"}catch{return!1}}function Pe(){try{localStorage.setItem(ie,"1")}catch(e){console.warn("invite flag persist failed",e)}}function Oe(e){return String(e??"").trim().toLowerCase()}async function Me(e){if(!J)return console.warn("[bump] VITE_INVITE_HASH not set — invite gate cannot unlock"),!1;const t=Oe(e);return t&&await $e(t)===J?(Pe(),!0):!1}function oe(e){return Math.max(4,Math.min(41,Math.round(e)||4))}function ze(e){const t=oe(e);return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const We={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you’re ready; share any medication list with your doctor or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That’s a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognizable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"Reflexes and fingerprints",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you’ve come a long way."},13:{title:"End of first trimester",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Last week of the first trimester — add a short outdoor walk if weather and energy allow."},14:{title:"Second trimester begins",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn’t a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You’re about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keepsake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"End of second trimester",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Last week of the second trimester. Fatigue may return; rest counts as progress.",tip:"Wind down: dim lights, phone away, short stretch."},28:{title:"Third trimester begins",size:"an eggplant",baby:"REM (dream) sleep may occur; baby packs on weight.",feel:"If you’re Rh-negative, an immune globulin shot may be offered.",tip:"Welcome to the third trimester — add third-trimester appointments to your shared list."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you’re unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it’s time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you’re a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You’re not ‘late’ at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function Y(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e)));return{week:t,...We[t],nhsWeek:oe(t),nhsUrl:ze(t)}}const Fe=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:13,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Sync both phones: Settings → Export JSON, then import on the other phone"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:14,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add any follow-up labs to Appointments"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function Ue(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),n=Fe.find(a=>t>=a.from&&t<=a.to);return{week:t,bandTitle:n.title,thisWeek:n.thisWeek,lookingAhead:n.comingUp}}const _=8,l=document.getElementById("app");let m="today",S=null,p="auto",z=null;const re=/^\d{4,}$/,le="PIN should be at least 4 digits (numbers only)",ce="This replaces all Bump data on this phone (due date, PIN, logs, appointments, and notes) with the backup. Continue?";te();function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function r(){const e=u();if(!se()){p="invite",K();return}if(!T()||!ne()){(p==="invite"||p==="auto")&&(p=T()?"unlock":"setup"),K();return}He(e)}function K(){const e=T();if(p==="auto"&&(p=se()?e?"unlock":"setup":"invite"),p==="invite"){l.innerHTML=`
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
      </div>`;const n=l.querySelector("#inviteCode");n.focus();const a=async()=>{const i=l.querySelector("#gateErr");i.classList.add("hidden"),await Me(n.value)?(p="auto",r()):(i.textContent="That invite doesn’t match. Double-check and try again.",i.classList.remove("hidden"))};l.querySelector("#doInvite").onclick=a,n.onkeydown=i=>{i.key==="Enter"&&a()};return}if(p==="import"){l.innerHTML=`
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Import backup</h1>
            <p>Paste a Bump JSON export from the other phone</p>
          </div>
          <form id="importForm" autocomplete="off">
            <div class="field">
              <label class="label" for="importText">Export JSON</label>
              <textarea class="textarea" id="importText" placeholder='{ "app": "bump-tracker", ... }'></textarea>
            </div>
            ${e?`
            <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
            <div class="field">
              <label class="label" for="importPin">Current PIN on this phone</label>
              <input class="input" type="password" inputmode="numeric" id="importPin" autocomplete="current-password" />
              <p class="hint">This phone already has Bump data. Importing replaces it.</p>
            </div>`:""}
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Import &amp; unlock</button>
          </form>
          <button class="linkish" id="backGate">Back</button>
        </div>
      </div>`,l.querySelector("#importForm").onsubmit=n=>{n.preventDefault();const a=l.querySelector("#gateErr"),i=o=>{a.textContent=o,a.classList.remove("hidden")},s=l.querySelector("#importText").value;if(!s.trim())return i("Paste the backup JSON first");if(e){if(!H(l.querySelector("#importPin").value))return i("Incorrect PIN");if(!confirm(ce))return}try{ae(s),p="auto",r()}catch(o){i(o.message||"Could not import")}},l.querySelector("#backGate").onclick=()=>{p=e?"unlock":"setup",r()};return}if(p==="setup"){l.innerHTML=`
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
              <p class="hint">Same PIN on both phones. Data stays on this phone until you export/import.</p>
            </div>
            <div class="field">
              <label class="label" for="pin2">Confirm PIN</label>
              <input class="input" type="password" inputmode="numeric" pattern="[0-9]*" id="pin2" autocomplete="new-password" />
            </div>
            <p class="err hidden" id="gateErr"></p>
            <button class="btn btn-primary" type="submit">Create household</button>
          </form>
          <button class="linkish" id="toImport">Have a backup JSON? Import instead</button>
        </div>
      </div>`,l.querySelector("#setupForm").onsubmit=n=>{n.preventDefault();const a=l.querySelector("#dueDate").value,i=l.querySelector("#pin").value.trim(),s=l.querySelector("#pin2").value.trim(),o=l.querySelector("#gateErr");if(!a){o.textContent="Pick a due date",o.classList.remove("hidden");return}if(!re.test(i)){o.textContent=le,o.classList.remove("hidden");return}if(i!==s){o.textContent="PINs do not match",o.classList.remove("hidden");return}ge({pin:i,dueDate:a}),p="auto",m="today",r()},l.querySelector("#toImport").onclick=()=>{p="import",r()};return}l.innerHTML=`
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
        <button class="linkish" id="toImport">Import backup from other phone</button>
      </div>
    </div>`;const t=l.querySelector("#pin");t.focus(),l.querySelector("#unlockForm").onsubmit=n=>{if(n.preventDefault(),ve(t.value))p="auto",r();else{const a=l.querySelector("#gateErr");a.textContent="Incorrect PIN",a.classList.remove("hidden")}},l.querySelector("#toImport").onclick=()=>{p="import",r()}}function He(e){const t=e.household.dueDate,n=pe(t),a=he(t),i=$(),s=L();z=s,l.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${c(de(s))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${m==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${m==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${m==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${m==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,l.querySelectorAll(".nav button").forEach(v=>{v.onclick=()=>{m=v.dataset.tab,r()}});const o=l.querySelector("#main");m==="today"?o.innerHTML=je({due:t,week:n,daysLeft:a,log:i}):m==="appointments"?o.innerHTML=Ge():m==="notes"?o.innerHTML=Je():o.innerHTML=Ye(e),_e(o),m==="today"&&Re(o)}function Re(e){const t=e.querySelector(".week-browser"),n=(t==null?void 0:t.querySelector(".week-pill.active"))||(t==null?void 0:t.querySelector(".week-pill.current"));if(!t||!n)return;const a=t.getBoundingClientRect(),i=n.getBoundingClientRect();t.scrollLeft+=i.left-a.left-(a.width-i.width)/2}function Z(e,{compact:t=!1}={}){return e?`
    <article class="week-hero">
      <p class="eyebrow">Week ${e.week}</p>
      <h2>${c(e.title)}</h2>
      <p class="week-size">About the size of ${c(e.size)}</p>
      <div class="week-section">
        <h3>Your baby</h3>
        <p>${c(e.baby)}</p>
      </div>
      <div class="week-section">
        <h3>How you may feel</h3>
        <p>${c(e.feel)}</p>
      </div>
      <div class="week-section">
        <h3>This week’s tip</h3>
        <p>${c(e.tip)}</p>
      </div>
      <p class="week-attrib">
        Inspired by the
        <a href="${c(e.nhsUrl)}" target="_blank" rel="noopener noreferrer">NHS Best Start in Life week-by-week guide</a>
        (${e.nhsWeek===e.week?`Week ${e.week}`:`closest NHS page: Week ${e.nhsWeek}`}). Original summary — not medical advice.
        ${t?"":"Talk to your midwife or OB about anything that worries you."}
      </p>
    </article>`:""}function Ve(e){return e==null?{n:"—",l:"Days to due"}:e>0?{n:e,l:"Days to due"}:e===0?{n:0,l:"Due today"}:{n:Math.abs(e),l:"Days past due"}}function je({due:e,week:t,daysLeft:n,log:a}){var A;const i=Y(t),s=S??t,o=Y(s),v=Ve(n),w=Array.from({length:_},(f,k)=>`<div class="glass ${k<a.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),N=Array.from({length:42},(f,k)=>k+1).map(f=>`<button type="button" class="${["week-pill",f===s?"active":"",f===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${f}">${f}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${c(((A=me(t))==null?void 0:A.label)??"—")}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${c(v.n)}</div><div class="l">${c(v.l)}</div></div>
      <div class="stat"><div class="n">${c(e?ue(e):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${Z(i)}

    ${(()=>{const f=Ue(t);if(!f)return"";const k=f.thisWeek.map(E=>`<li>${c(E)}</li>`).join(""),q=f.lookingAhead.map(E=>`<li>${c(E)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${c(f.bandTitle)}</span>
      </div>
      <ul class="prep-list">${k}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${q}</ul>
      </div>
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife’s plan.</p>
    </div>`})()}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
      </div>
      <div class="hydro">
        <div>
          <div class="hydro-count">${a.hydrationCount}</div>
          <div class="meta">of ${_} glasses today</div>
        </div>
        <div class="btn-row">
          <button class="btn-icon" id="hydroMinus" aria-label="Remove glass">−</button>
          <button class="btn btn-sage btn-sm" id="hydroPlus">+ Glass</button>
        </div>
      </div>
      <div class="hydro-glasses">${w}</div>
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
        <button class="toggle ${a.windDown?"on":""}" id="windToggle" role="switch" aria-checked="${a.windDown}" aria-label="Wind-down done"></button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🚶 Daily movement</h3>
      </div>
      <div class="movement-type">${c(a.movementType||"")}</div>
      <div class="movement-title">${c(a.movementSuggestion||"")}</div>
      <p class="movement-detail">${c(a.movementDetail||"")}</p>
      <div class="btn-row">
        <button class="btn ${a.movementDone?"btn-sage":"btn-soft"} btn-sm" id="moveDone">
          ${a.movementDone?"✓ Done":"Mark done"}
        </button>
        <button class="btn btn-ghost btn-sm" id="moveRegen">Another idea</button>
      </div>
      <p class="disclaimer">Gentle suggestions only — not a workout plan. Skip anything that doesn’t feel right; check with your care team if unsure.</p>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${S&&S!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${N}</div>
      ${S&&S!==t?Z(o,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `}function Ge(){const e=Ae(),t=Date.now(),n=L(),a=fe(n,1);return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Add appointment</h3></div>
      <div class="field">
        <label class="label" for="apptTitle">Title</label>
        <input class="input" id="apptTitle" placeholder="OB checkup, anatomy scan…" />
      </div>
      <div class="field">
        <label class="label" for="apptWhen">Date &amp; time</label>
        <input class="input" type="datetime-local" id="apptWhen" />
      </div>
      <div class="field">
        <label class="label" for="apptLoc">Location (optional)</label>
        <input class="input" id="apptLoc" placeholder="Clinic name" />
      </div>
      <div class="field">
        <label class="label" for="apptNotes">Notes / paperwork</label>
        <input class="input" id="apptNotes" placeholder="Insurance card, questions…" />
      </div>
      <button class="btn btn-primary" id="apptAdd">Save appointment</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Upcoming &amp; past</h3></div>
      ${e.length?e.map(s=>{const o=new Date(s.startsAt),v=Q(o),w=o.getTime()<t,N=!w&&v===n,A=!w&&v===a;return`
          <div class="list-item${w?" is-past":""}" data-appt="${s.id}">
            <h4>${c(s.title)}${N?' <span class="chip chip-today">Today</span>':""}</h4>
            <div class="meta">${c(X(s.startsAt))}${s.location?" · "+c(s.location):""}</div>
            ${s.notes?`<div class="meta" style="margin-top:4px">${c(s.notes)}</div>`:""}
            ${A?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
            <div class="btn-row" style="margin-top:8px">
              <button class="btn btn-ghost btn-sm appt-del" data-id="${s.id}">Remove</button>
            </div>
          </div>`}).join(""):'<div class="empty">No appointments yet. Add OB visits, paperwork deadlines, or classes.</div>'}
    </div>`}function Je(){const e=xe();return`
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
      ${e.length?e.map(n=>`
        <div class="list-item">
          <div class="meta">${c(X(n.createdAt))}${n.author?" · "+c(n.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${c(n.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${n.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Ye(e){return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${c(e.household.dueDate||"")}" />
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
      <div class="card-head"><h3 class="card-title">Move data between phones</h3></div>
      <p class="meta" style="margin:0 0 12px">Your data stays on this phone. To copy it to the other phone, export it here and import it there.</p>
      <div class="btn-row btn-row-even">
        <button class="btn btn-primary btn-sm" id="doExport">Export JSON</button>
        <button class="btn btn-ghost btn-sm" id="doImportFile">Import file</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" class="hidden" />
      <form id="importConfirm" class="import-confirm hidden">
        <input type="text" name="username" autocomplete="username" value="Bump household" hidden readonly />
        <p class="meta" style="margin:0 0 8px" id="importFileName"></p>
        <div class="field">
          <label class="label" for="importPin">Current PIN to replace this phone’s data</label>
          <input class="input" type="password" inputmode="numeric" id="importPin" autocomplete="current-password" />
        </div>
        <p class="err hidden" id="importErr"></p>
        <div class="btn-row btn-row-even">
          <button class="btn btn-danger btn-sm" type="submit">Replace data</button>
          <button class="btn btn-ghost btn-sm" type="button" id="importCancel">Cancel</button>
        </div>
      </form>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`}function _e(e){var t,n,a,i,s,o,v,w,N,A,f,k,q,E,R,V;if(m==="today"&&((t=e.querySelector("#hydroPlus"))==null||t.addEventListener("click",()=>{G(1),r()}),(n=e.querySelector("#hydroMinus"))==null||n.addEventListener("click",()=>{G(-1),r()}),(a=e.querySelector("#windToggle"))==null||a.addEventListener("click",()=>{De(!$().windDown),r()}),(i=e.querySelector("#moveDone"))==null||i.addEventListener("click",()=>{const d=$();Ne(!d.movementDone),r()}),(s=e.querySelector("#moveRegen"))==null||s.addEventListener("click",()=>{const d=$();Ie(ye(d.movementSuggestion)),r()}),e.querySelectorAll("[data-browse-week]").forEach(d=>{d.addEventListener("click",()=>{S=Number(d.dataset.browseWeek),r()})}),(o=e.querySelector("#resetBrowse"))==null||o.addEventListener("click",()=>{S=null,r()})),m==="appointments"&&((v=e.querySelector("#apptAdd"))==null||v.addEventListener("click",()=>{const d=e.querySelector("#apptTitle").value.trim(),I=e.querySelector("#apptWhen").value;if(!d||!I)return alert("Title and date/time are required");Le({title:d,startsAt:new Date(I).toISOString(),location:e.querySelector("#apptLoc").value,notes:e.querySelector("#apptNotes").value}),r()}),e.querySelectorAll(".appt-del").forEach(d=>{d.addEventListener("click",()=>{confirm("Remove this appointment?")&&(Ee(d.dataset.id),r())})})),m==="notes"&&((w=e.querySelector("#noteAdd"))==null||w.addEventListener("click",()=>{const d=e.querySelector("#noteBody").value.trim();d&&(Te({body:d,author:e.querySelector("#noteAuthor").value}),r())}),e.querySelectorAll(".note-del").forEach(d=>{d.addEventListener("click",()=>{confirm("Delete this note?")&&(qe(d.dataset.id),r())})})),m==="settings"){(N=e.querySelector("#saveDue"))==null||N.addEventListener("click",()=>{const b=e.querySelector("#setDue").value;b&&(ke(b),S=null,r())}),(A=e.querySelector("#pinForm"))==null||A.addEventListener("submit",b=>{b.preventDefault();const y=e.querySelector("#setPin").value.trim();if(!re.test(y))return alert(le);Se(y),alert("PIN updated"),r()}),(f=e.querySelector("#doExport"))==null||f.addEventListener("click",()=>{const b=Be(),y=e.querySelector("#exportBox");y.classList.remove("hidden"),y.value=b;const B=new Blob([b],{type:"application/json"}),x=URL.createObjectURL(B),M=document.createElement("a");M.href=x,M.download=`bump-export-${L()}.json`,M.click(),URL.revokeObjectURL(x)}),(k=e.querySelector("#doImportFile"))==null||k.addEventListener("click",()=>{e.querySelector("#importFile").click()});let d=null;const I=e.querySelector("#importConfirm"),j=b=>{try{ae(b),alert("Import successful"),r()}catch(y){alert(y.message||"Import failed")}};(q=e.querySelector("#importFile"))==null||q.addEventListener("change",async b=>{var x;const y=(x=b.target.files)==null?void 0:x[0];if(b.target.value="",!y)return;const B=await y.text();if(!T())return j(B);d=B,e.querySelector("#importFileName").textContent=`Selected: ${y.name}`,e.querySelector("#importErr").classList.add("hidden"),I.classList.remove("hidden"),e.querySelector("#importPin").focus()}),I==null||I.addEventListener("submit",b=>{b.preventDefault();const y=e.querySelector("#importErr");if(d){if(!H(e.querySelector("#importPin").value)){y.textContent="Incorrect PIN",y.classList.remove("hidden");return}confirm(ce)&&j(d)}}),(E=e.querySelector("#importCancel"))==null||E.addEventListener("click",()=>{d=null,I.classList.add("hidden")}),(R=e.querySelector("#doLock"))==null||R.addEventListener("click",()=>{we(),p="unlock",r()}),(V=e.querySelector("#doReset"))==null||V.addEventListener("click",()=>{confirm("Erase all Bump data on this device?")&&(Ce(),p="setup",m="today",S=null,r())})}}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&z&&z!==L()&&T()&&ne()&&r()});r();
