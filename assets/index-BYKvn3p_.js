(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const q="America/New_York";function N(){return V(new Date)}function V(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:q,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),a=t.find(s=>s.type==="year").value,n=t.find(s=>s.type==="month").value,i=t.find(s=>s.type==="day").value;return`${a}-${n}-${i}`}function te(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number),i=new Date(Date.UTC(t,a-1,n,12));return new Intl.DateTimeFormat("en-US",{timeZone:q,weekday:"short",month:"short",day:"numeric"}).format(i)}function ae(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number);return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric"}).format(new Date(Date.UTC(t,a-1,n,12)))}function j(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:q,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function G(e,t){const[a,n,i]=e.split("-").map(Number),[s,r,y]=t.split("-").map(Number),g=Date.UTC(a,n-1,i),k=Date.UTC(s,r-1,y);return Math.round((g-k)/864e5)}function ne(e,t=N()){if(!e)return null;const n=280-G(e,t);if(n<0)return 1;const i=Math.floor(n/7)+1;return Math.min(42,Math.max(1,i))}function ie(e){if(e==null||Number.isNaN(Number(e)))return null;const t=Number(e);return t<=13?{number:1,label:"1st"}:t<=27?{number:2,label:"2nd"}:{number:3,label:"3rd"}}function se(e,t=N()){return e?G(e,t):null}function oe(e,t){const[a,n,i]=e.split("-").map(Number);return new Date(Date.UTC(a,n-1,i+t)).toISOString().slice(0,10)}const $=[{type:"walk",title:"Neighborhood stroll",detail:"10–15 minutes at an easy pace. Fresh air counts."},{type:"walk",title:"After-meal walk",detail:"A short loop after lunch can ease bloating and stiffness."},{type:"walk",title:"Park path",detail:"Slow walk somewhere pleasant. Stop whenever you want."},{type:"stretch",title:"Cat–cow stretch",detail:"On hands and knees, gently arch and round. Breathe slowly."},{type:"stretch",title:"Hip opener",detail:"Seated figure-four or butterfly stretch — soft, no forcing."},{type:"stretch",title:"Side body stretch",detail:"Standing or seated, reach one arm overhead. Switch sides."},{type:"stretch",title:"Neck & shoulder release",detail:"Slow rolls and shrugs. Drop the shoulders away from ears."},{type:"strength",title:"Wall push-ups",detail:"5–10 easy reps against a wall. Keep breathing steady."},{type:"strength",title:"Sit-to-stand",detail:"From a sturdy chair, stand and sit 6–8 times. Use hands if needed."},{type:"strength",title:"Glute bridge (if comfortable)",detail:"On your back if still okay, or side-lying squeeze. Skip if it doesn’t feel right."},{type:"strength",title:"Band pull-aparts",detail:"Light resistance band, open arms wide. Posture-friendly."},{type:"walk",title:"Errand walk",detail:"Park farther away or take one extra block. Keep it easy."},{type:"stretch",title:"Child’s pose (wide knees)",detail:"Knees apart, fold forward if comfortable. Rest your head."},{type:"strength",title:"Calf raises",detail:"Hold a counter, rise onto toes 10 times. Helps circulation."}];function re(e){let t=0;for(let a=0;a<e.length;a++)t=t*31+e.charCodeAt(a)>>>0;return $[t%$.length]}function le(e){const t=$.filter(a=>a.title!==e);return t[Math.floor(Math.random()*t.length)]||$[0]}const x="bump.v1",z=1;function M(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function L(){return{schemaVersion:z,household:{id:M(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},appointments:[],notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function D(e,t=N()){if(!e.dailyLogs[t]){const a=re(t);e.dailyLogs[t]={date:t,hydrationCount:0,windDown:!1,movementDone:!1,movementSuggestion:a.title,movementDetail:a.detail,movementType:a.type}}return e.dailyLogs[t]}let h=null;function f(){h.updatedAt=new Date().toISOString();try{localStorage.setItem(x,JSON.stringify(h))}catch(e){console.warn("persist failed",e)}}function Y(){try{const e=localStorage.getItem(x);e?(h=JSON.parse(e),h.schemaVersion||(h.schemaVersion=z),h.household||(h=L())):h=L()}catch{h=L()}return D(h),h}function d(){return h||Y(),h}function E(){var t,a;const e=d();return!!((t=e.household)!=null&&t.pin&&((a=e.household)!=null&&a.dueDate))}function K(){return!!d().unlocked}function ce({pin:e,dueDate:t}){const a=d();return a.household.pin=String(e).trim(),a.household.dueDate=t,a.household.createdAt=a.household.createdAt||new Date().toISOString(),a.unlocked=!0,D(a),f(),a}function de(e){var a;const t=d();return!!((a=t.household)!=null&&a.pin)&&String(e??"").trim()===String(t.household.pin)}function ue(e){const t=d();return de(e)?(t.unlocked=!0,D(t),f(),!0):!1}function pe(){const e=d();e.unlocked=!1,f()}function me(e){const t=d();t.household.dueDate=e,f()}function he(e){const t=d();t.household.pin=String(e).trim(),f()}function T(){return D(d())}function P(e=1){const t=d(),a=D(t);return a.hydrationCount=Math.max(0,(a.hydrationCount||0)+e),f(),a}function fe(e){const t=d(),a=D(t);return a.windDown=!!e,f(),a}function ye(e){const t=d(),a=D(t);return a.movementDone=!!e,f(),a}function be(e){const t=d(),a=D(t);return a.movementSuggestion=e.title,a.movementDetail=e.detail,a.movementType=e.type,a.movementDone=!1,f(),a}function ge(){return[...d().appointments].sort((e,t)=>new Date(e.startsAt)-new Date(t.startsAt))}function ve({title:e,startsAt:t,location:a="",notes:n=""}){const i=d(),s={id:M(),title:e.trim(),startsAt:t,location:a.trim(),notes:n.trim(),createdAt:new Date().toISOString()};return i.appointments.push(s),f(),s}function we(e){const t=d();t.appointments=t.appointments.filter(a=>a.id!==e),f()}function ke(){return[...d().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function Se({body:e,author:t=""}){const a=d(),n={id:M(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return a.notes.unshift(n),f(),n}function De(e){const t=d();t.notes=t.notes.filter(a=>a.id!==e),f()}function Ae(){const e=d(),{pin:t,...a}=e.household,n={schemaVersion:z,exportedAt:new Date().toISOString(),app:"bump-tracker",household:a,dailyLogs:e.dailyLogs,appointments:e.appointments,notes:e.notes};return JSON.stringify(n,null,2)}function Ne(){localStorage.removeItem(x),h=L(),f()}const W="1db2ccd5ddc253b4eedee62ffecd522f2c5e9f49b16e2090a7fe1dab48164daa".toLowerCase(),_="bump.inviteOk.v1";async function Be(e){const t=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(a)).map(n=>n.toString(16).padStart(2,"0")).join("")}function J(){try{return localStorage.getItem(_)==="1"}catch{return!1}}function Le(){try{localStorage.setItem(_,"1")}catch(e){console.warn("invite flag persist failed",e)}}function Te(e){return String(e??"").trim().toLowerCase()}async function $e(e){if(!W)return console.warn("[bump] VITE_INVITE_HASH not set — invite gate cannot unlock"),!1;const t=Te(e);return t&&await Be(t)===W?(Le(),!0):!1}function Z(e){return Math.max(4,Math.min(41,Math.round(e)||4))}function Ee(e){const t=Z(e);return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const Ie={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you’re ready; share any medication list with your doctor or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That’s a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognizable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"Reflexes and fingerprints",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you’ve come a long way."},13:{title:"End of first trimester",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Last week of the first trimester — add a short outdoor walk if weather and energy allow."},14:{title:"Second trimester begins",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn’t a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You’re about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keepsake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"End of second trimester",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Last week of the second trimester. Fatigue may return; rest counts as progress.",tip:"Wind down: dim lights, phone away, short stretch."},28:{title:"Third trimester begins",size:"an eggplant",baby:"REM (dream) sleep may occur; baby packs on weight.",feel:"If you’re Rh-negative, an immune globulin shot may be offered.",tip:"Welcome to the third trimester — add third-trimester appointments to your shared list."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you’re unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it’s time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you’re a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You’re not ‘late’ at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function U(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e)));return{week:t,...Ie[t],nhsWeek:Z(t),nhsUrl:Ee(t)}}const Ce=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:13,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Start a shared list of questions for your OB or midwife in Notes"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:14,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add any follow-up labs to Appointments"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function qe(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),a=Ce.find(n=>t>=n.from&&t<=n.to);return{week:t,bandTitle:a.title,thisWeek:a.thisWeek,lookingAhead:a.comingUp}}const H=8,u=document.getElementById("app");let p="today",w=null,b="auto",C=null;const Q=/^\d{4,}$/,X="PIN should be at least 4 digits (numbers only)";Y();function l(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function c(){const e=d();if(!J()){b="invite",R();return}if(!E()||!K()){(b==="invite"||b==="auto")&&(b=E()?"unlock":"setup"),R();return}xe(e)}function R(){const e=E();if(b==="auto"&&(b=J()?e?"unlock":"setup":"invite"),b==="invite"){u.innerHTML=`
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
      </div>`;const a=u.querySelector("#inviteCode");a.focus();const n=async()=>{const i=u.querySelector("#gateErr");i.classList.add("hidden"),await $e(a.value)?(b="auto",c()):(i.textContent="That invite doesn’t match. Double-check and try again.",i.classList.remove("hidden"))};u.querySelector("#doInvite").onclick=n,a.onkeydown=i=>{i.key==="Enter"&&n()};return}if(b==="setup"){u.innerHTML=`
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
      </div>`,u.querySelector("#setupForm").onsubmit=a=>{a.preventDefault();const n=u.querySelector("#dueDate").value,i=u.querySelector("#pin").value.trim(),s=u.querySelector("#pin2").value.trim(),r=u.querySelector("#gateErr");if(!n){r.textContent="Pick a due date",r.classList.remove("hidden");return}if(!Q.test(i)){r.textContent=X,r.classList.remove("hidden");return}if(i!==s){r.textContent="PINs do not match",r.classList.remove("hidden");return}ce({pin:i,dueDate:n}),b="auto",p="today",c()};return}u.innerHTML=`
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
    </div>`;const t=u.querySelector("#pin");t.focus(),u.querySelector("#unlockForm").onsubmit=a=>{if(a.preventDefault(),ue(t.value))b="auto",c();else{const n=u.querySelector("#gateErr");n.textContent="Incorrect PIN",n.classList.remove("hidden")}}}function xe(e){const t=e.household.dueDate,a=ne(t),n=se(t),i=T(),s=N();C=s,u.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${l(te(s))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${p==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${p==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${p==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${p==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,u.querySelectorAll(".nav button").forEach(y=>{y.onclick=()=>{p=y.dataset.tab,c()}});const r=u.querySelector("#main");p==="today"?r.innerHTML=Oe({due:t,week:a,daysLeft:n,log:i}):p==="appointments"?r.innerHTML=Pe():p==="notes"?r.innerHTML=We():r.innerHTML=Ue(e),He(r),p==="today"&&ze(r)}function ze(e){const t=e.querySelector(".week-browser"),a=(t==null?void 0:t.querySelector(".week-pill.active"))||(t==null?void 0:t.querySelector(".week-pill.current"));if(!t||!a)return;const n=t.getBoundingClientRect(),i=a.getBoundingClientRect();t.scrollLeft+=i.left-n.left-(n.width-i.width)/2}function F(e,{compact:t=!1}={}){return e?`
    <article class="week-hero">
      <p class="eyebrow">Week ${e.week}</p>
      <h2>${l(e.title)}</h2>
      <p class="week-size">About the size of ${l(e.size)}</p>
      <div class="week-section">
        <h3>Your baby</h3>
        <p>${l(e.baby)}</p>
      </div>
      <div class="week-section">
        <h3>How you may feel</h3>
        <p>${l(e.feel)}</p>
      </div>
      <div class="week-section">
        <h3>This week’s tip</h3>
        <p>${l(e.tip)}</p>
      </div>
      <p class="week-attrib">
        Inspired by the
        <a href="${l(e.nhsUrl)}" target="_blank" rel="noopener noreferrer">NHS Best Start in Life week-by-week guide</a>
        (${e.nhsWeek===e.week?`Week ${e.week}`:`closest NHS page: Week ${e.nhsWeek}`}). Original summary — not medical advice.
        ${t?"":"Talk to your midwife or OB about anything that worries you."}
      </p>
    </article>`:""}function Me(e){return e==null?{n:"—",l:"Days to due"}:e>0?{n:e,l:"Days to due"}:e===0?{n:0,l:"Due today"}:{n:Math.abs(e),l:"Days past due"}}function Oe({due:e,week:t,daysLeft:a,log:n}){var A;const i=U(t),s=w??t,r=U(s),y=Me(a),g=Array.from({length:H},(m,v)=>`<div class="glass ${v<n.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),k=Array.from({length:42},(m,v)=>v+1).map(m=>`<button type="button" class="${["week-pill",m===s?"active":"",m===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${m}">${m}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${l(((A=ie(t))==null?void 0:A.label)??"—")}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${l(y.n)}</div><div class="l">${l(y.l)}</div></div>
      <div class="stat"><div class="n">${l(e?ae(e):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${F(i)}

    ${(()=>{const m=qe(t);if(!m)return"";const v=m.thisWeek.map(o=>`<li>${l(o)}</li>`).join(""),B=m.lookingAhead.map(o=>`<li>${l(o)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${l(m.bandTitle)}</span>
      </div>
      <ul class="prep-list">${v}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${B}</ul>
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
          <div class="meta">of ${H} glasses today</div>
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

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🚶 Daily movement</h3>
      </div>
      <div class="movement-type">${l(n.movementType||"")}</div>
      <div class="movement-title">${l(n.movementSuggestion||"")}</div>
      <p class="movement-detail">${l(n.movementDetail||"")}</p>
      <div class="btn-row">
        <button class="btn ${n.movementDone?"btn-sage":"btn-soft"} btn-sm" id="moveDone">
          ${n.movementDone?"✓ Done":"Mark done"}
        </button>
        <button class="btn btn-ghost btn-sm" id="moveRegen">Another idea</button>
      </div>
      <p class="disclaimer">Gentle suggestions only — not a workout plan. Skip anything that doesn’t feel right; check with your care team if unsure.</p>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${w&&w!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${k}</div>
      ${w&&w!==t?F(r,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `}function Pe(){const e=ge(),t=Date.now(),a=N(),n=oe(a,1);return`
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
      ${e.length?e.map(s=>{const r=new Date(s.startsAt),y=V(r),g=r.getTime()<t,k=!g&&y===a,A=!g&&y===n;return`
          <div class="list-item${g?" is-past":""}" data-appt="${s.id}">
            <h4>${l(s.title)}${k?' <span class="chip chip-today">Today</span>':""}</h4>
            <div class="meta">${l(j(s.startsAt))}${s.location?" · "+l(s.location):""}</div>
            ${s.notes?`<div class="meta" style="margin-top:4px">${l(s.notes)}</div>`:""}
            ${A?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
            <div class="btn-row" style="margin-top:8px">
              <button class="btn btn-ghost btn-sm appt-del" data-id="${s.id}">Remove</button>
            </div>
          </div>`}).join(""):'<div class="empty">No appointments yet. Add OB visits, paperwork deadlines, or classes.</div>'}
    </div>`}function We(){const e=ke();return`
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
          <div class="meta">${l(j(a.createdAt))}${a.author?" · "+l(a.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${l(a.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${a.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Ue(e){return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${l(e.household.dueDate||"")}" />
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
      <p class="meta" style="margin:0 0 12px">Save a copy of your due date, daily logs, appointments, and notes as a JSON file for safekeeping.</p>
      <button class="btn btn-primary btn-sm" id="doExport">Download a backup</button>
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`}function He(e){var t,a,n,i,s,r,y,g,k,A,m,v,B;p==="today"&&((t=e.querySelector("#hydroPlus"))==null||t.addEventListener("click",()=>{P(1),c()}),(a=e.querySelector("#hydroMinus"))==null||a.addEventListener("click",()=>{P(-1),c()}),(n=e.querySelector("#windToggle"))==null||n.addEventListener("click",()=>{fe(!T().windDown),c()}),(i=e.querySelector("#moveDone"))==null||i.addEventListener("click",()=>{const o=T();ye(!o.movementDone),c()}),(s=e.querySelector("#moveRegen"))==null||s.addEventListener("click",()=>{const o=T();be(le(o.movementSuggestion)),c()}),e.querySelectorAll("[data-browse-week]").forEach(o=>{o.addEventListener("click",()=>{w=Number(o.dataset.browseWeek),c()})}),(r=e.querySelector("#resetBrowse"))==null||r.addEventListener("click",()=>{w=null,c()})),p==="appointments"&&((y=e.querySelector("#apptAdd"))==null||y.addEventListener("click",()=>{const o=e.querySelector("#apptTitle").value.trim(),S=e.querySelector("#apptWhen").value;if(!o||!S)return alert("Title and date/time are required");ve({title:o,startsAt:new Date(S).toISOString(),location:e.querySelector("#apptLoc").value,notes:e.querySelector("#apptNotes").value}),c()}),e.querySelectorAll(".appt-del").forEach(o=>{o.addEventListener("click",()=>{confirm("Remove this appointment?")&&(we(o.dataset.id),c())})})),p==="notes"&&((g=e.querySelector("#noteAdd"))==null||g.addEventListener("click",()=>{const o=e.querySelector("#noteBody").value.trim();o&&(Se({body:o,author:e.querySelector("#noteAuthor").value}),c())}),e.querySelectorAll(".note-del").forEach(o=>{o.addEventListener("click",()=>{confirm("Delete this note?")&&(De(o.dataset.id),c())})})),p==="settings"&&((k=e.querySelector("#saveDue"))==null||k.addEventListener("click",()=>{const o=e.querySelector("#setDue").value;o&&(me(o),w=null,c())}),(A=e.querySelector("#pinForm"))==null||A.addEventListener("submit",o=>{o.preventDefault();const S=e.querySelector("#setPin").value.trim();if(!Q.test(S))return alert(X);he(S),alert("PIN updated"),c()}),(m=e.querySelector("#doExport"))==null||m.addEventListener("click",()=>{const o=Ae(),S=e.querySelector("#exportBox");S.classList.remove("hidden"),S.value=o;const ee=new Blob([o],{type:"application/json"}),O=URL.createObjectURL(ee),I=document.createElement("a");I.href=O,I.download=`bump-backup-${N()}.json`,I.click(),URL.revokeObjectURL(O)}),(v=e.querySelector("#doLock"))==null||v.addEventListener("click",()=>{pe(),b="unlock",c()}),(B=e.querySelector("#doReset"))==null||B.addEventListener("click",()=>{confirm("Erase all Bump data on this device?")&&(Ne(),b="setup",p="today",w=null,c())}))}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&C&&C!==N()&&E()&&K()&&c()});c();
