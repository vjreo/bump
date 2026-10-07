(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const z="America/New_York";function N(){return V(new Date)}function V(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:z,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),a=t.find(i=>i.type==="year").value,n=t.find(i=>i.type==="month").value,s=t.find(i=>i.type==="day").value;return`${a}-${n}-${s}`}function Q(e){if(!e)return"";const[t,a,n]=e.split("-").map(Number),s=new Date(Date.UTC(t,a-1,n,12));return new Intl.DateTimeFormat("en-US",{timeZone:z,weekday:"short",month:"short",day:"numeric"}).format(s)}function J(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:z,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function Y(e,t){const[a,n,s]=e.split("-").map(Number),[i,r,y]=t.split("-").map(Number),S=Date.UTC(a,n-1,s),D=Date.UTC(i,r-1,y);return Math.round((S-D)/864e5)}function X(e,t=N()){if(!e)return null;const n=280-Y(e,t);if(n<0)return 1;const s=Math.floor(n/7)+1;return Math.min(42,Math.max(1,s))}function ee(e,t=N()){return e?Y(e,t):null}function te(e,t){const[a,n,s]=e.split("-").map(Number);return new Date(Date.UTC(a,n-1,s+t)).toISOString().slice(0,10)}const q=[{type:"walk",title:"Neighborhood stroll",detail:"10–15 minutes at an easy pace. Fresh air counts."},{type:"walk",title:"After-meal walk",detail:"A short loop after lunch can ease bloating and stiffness."},{type:"walk",title:"Park path",detail:"Slow walk somewhere pleasant. Stop whenever you want."},{type:"stretch",title:"Cat–cow stretch",detail:"On hands and knees, gently arch and round. Breathe slowly."},{type:"stretch",title:"Hip opener",detail:"Seated figure-four or butterfly stretch — soft, no forcing."},{type:"stretch",title:"Side body stretch",detail:"Standing or seated, reach one arm overhead. Switch sides."},{type:"stretch",title:"Neck & shoulder release",detail:"Slow rolls and shrugs. Drop the shoulders away from ears."},{type:"strength",title:"Wall push-ups",detail:"5–10 easy reps against a wall. Keep breathing steady."},{type:"strength",title:"Sit-to-stand",detail:"From a sturdy chair, stand and sit 6–8 times. Use hands if needed."},{type:"strength",title:"Glute bridge (if comfortable)",detail:"On your back if still okay, or side-lying squeeze. Skip if it doesn’t feel right."},{type:"strength",title:"Band pull-aparts",detail:"Light resistance band, open arms wide. Posture-friendly."},{type:"walk",title:"Errand walk",detail:"Park farther away or take one extra block. Keep it easy."},{type:"stretch",title:"Child’s pose (wide knees)",detail:"Knees apart, fold forward if comfortable. Rest your head."},{type:"strength",title:"Calf raises",detail:"Hold a counter, rise onto toes 10 times. Helps circulation."}];function ae(e){let t=0;for(let a=0;a<e.length;a++)t=t*31+e.charCodeAt(a)>>>0;return q[t%q.length]}function se(e){const t=q.filter(a=>a.title!==e);return t[Math.floor(Math.random()*t.length)]||q[0]}const O="bump.v1",T=1;function M(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function B(){return{schemaVersion:T,household:{id:M(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},appointments:[],notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function w(e,t=N()){if(!e.dailyLogs[t]){const a=ae(t);e.dailyLogs[t]={date:t,hydrationCount:0,windDown:!1,movementDone:!1,movementSuggestion:a.title,movementDetail:a.detail,movementType:a.type}}return e.dailyLogs[t]}let h=null;const ne=new Set;function m(){h.updatedAt=new Date().toISOString();try{localStorage.setItem(O,JSON.stringify(h))}catch(e){console.warn("persist failed",e)}ne.forEach(e=>e(h))}function K(){try{const e=localStorage.getItem(O);e?(h=JSON.parse(e),h.schemaVersion||(h.schemaVersion=T),h.household||(h=B())):h=B()}catch{h=B()}return w(h),h}function d(){return h||K(),h}function _(){var t,a;const e=d();return!!((t=e.household)!=null&&t.pin&&((a=e.household)!=null&&a.dueDate))}function ie(){return!!d().unlocked}function oe({pin:e,dueDate:t}){const a=d();return a.household.pin=String(e).trim(),a.household.dueDate=t,a.household.createdAt=a.household.createdAt||new Date().toISOString(),a.unlocked=!0,w(a),m(),a}function re(e){const t=d();return String(e).trim()===String(t.household.pin)?(t.unlocked=!0,w(t),m(),!0):!1}function le(){const e=d();e.unlocked=!1,m()}function ce(e){const t=d();t.household.dueDate=e,m()}function de(e){const t=d();t.household.pin=String(e).trim(),m()}function I(){return w(d())}function H(e=1){const t=d(),a=w(t);return a.hydrationCount=Math.max(0,(a.hydrationCount||0)+e),m(),a}function pe(e){const t=d(),a=w(t);return a.windDown=!!e,m(),a}function ue(e){const t=d(),a=w(t);return a.movementDone=!!e,m(),a}function he(e){const t=d(),a=w(t);return a.movementSuggestion=e.title,a.movementDetail=e.detail,a.movementType=e.type,a.movementDone=!1,m(),a}function me(){return[...d().appointments].sort((e,t)=>new Date(e.startsAt)-new Date(t.startsAt))}function fe({title:e,startsAt:t,location:a="",notes:n=""}){const s=d(),i={id:M(),title:e.trim(),startsAt:t,location:a.trim(),notes:n.trim(),createdAt:new Date().toISOString()};return s.appointments.push(i),m(),i}function ye(e){const t=d();t.appointments=t.appointments.filter(a=>a.id!==e),m()}function be(){return[...d().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function ge({body:e,author:t=""}){const a=d(),n={id:M(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return a.notes.unshift(n),m(),n}function ve(e){const t=d();t.notes=t.notes.filter(a=>a.id!==e),m()}function we(){const e=d(),t={schemaVersion:T,exportedAt:new Date().toISOString(),app:"bump-tracker",household:{...e.household},dailyLogs:e.dailyLogs,appointments:e.appointments,notes:e.notes};return JSON.stringify(t,null,2)}function Z(e){const t=JSON.parse(e);if(!t||!t.household)throw new Error("Invalid bump export");const a=d();return a.schemaVersion=t.schemaVersion||T,a.household={...t.household,id:t.household.id||a.household.id},a.dailyLogs=t.dailyLogs||{},a.appointments=t.appointments||[],a.notes=t.notes||[],a.unlocked=!0,w(a),m(),a}function ke(){localStorage.removeItem(O),h=B(),m()}function Se(e){const t=Math.max(4,Math.min(41,Math.round(e)||4));return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const R={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you're ready; share any medication list with your GP or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That's a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognisable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"End of first trimester",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you've come a long way."},13:{title:"Second trimester begins",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Add a short outdoor walk if weather and energy allow."},14:{title:"Stretching out",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn't a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You're about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keep-sake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"Third trimester begins",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Fatigue may return. Rest counts as progress.",tip:"Wind down: dim lights, phone away, short stretch."},28:{title:"Dream sleep possible",size:"an eggplant",baby:"REM sleep may occur; baby packs on weight.",feel:"If you're Rh-negative, an immune globulin shot may be offered.",tip:"Add third-trimester appointments to your shared list."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you're unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it's time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you're a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You're not 'late' at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function F(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),a=R[t]||R[40];return{week:t,...a,nhsUrl:Se(t)}}const L=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:12,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Share the household PIN export path with your partner"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:13,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add any follow-up labs to Appointments"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function De(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),a=L.find(i=>t>=i.from&&t<=i.to)||L[L.length-1],n=L.indexOf(a),s=L[n+1]||null;return{week:t,bandTitle:a.title,thisWeek:a.thisWeek,comingUp:s?s.thisWeek.slice(0,3):a.comingUp,comingLabel:s?`Coming up (weeks ${s.from}–${s.to})`:"Coming up"}}const G=8,p=document.getElementById("app");let f="today",v=null,b="auto";K();function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function l(){const e=d();if(!_()||!ie()){Ae();return}Ne(e)}function Ae(){const e=_();if(b==="auto"&&(b=e?"unlock":"setup"),b==="import"){p.innerHTML=`
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Import backup</h1>
            <p>Paste a Bump JSON export from the other phone</p>
          </div>
          <div class="field">
            <label class="label" for="importText">Export JSON</label>
            <textarea class="textarea" id="importText" placeholder='{ "app": "bump-tracker", ... }'></textarea>
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" id="doImport">Import &amp; unlock</button>
          <button class="linkish" id="backGate">Back</button>
        </div>
      </div>`,p.querySelector("#doImport").onclick=()=>{try{Z(p.querySelector("#importText").value),b="auto",l()}catch(n){const s=p.querySelector("#gateErr");s.textContent=n.message||"Could not import",s.classList.remove("hidden")}},p.querySelector("#backGate").onclick=()=>{b=e?"unlock":"setup",l()};return}if(b==="setup"){p.innerHTML=`
      <div class="gate">
        <div class="gate-card">
          <div class="brand">
            <div class="brand-mark">🌱</div>
            <h1>Bump</h1>
            <p>Vince &amp; Chantal’s shared pregnancy tracker</p>
          </div>
          <div class="field">
            <label class="label" for="dueDate">Due date</label>
            <input class="input" type="date" id="dueDate" />
          </div>
          <div class="field">
            <label class="label" for="pin">Household PIN (4+ digits)</label>
            <input class="input" type="password" inputmode="numeric" id="pin" placeholder="Shared secret" autocomplete="new-password" />
            <p class="hint">Same PIN on both phones. Data stays on-device until you export/import.</p>
          </div>
          <div class="field">
            <label class="label" for="pin2">Confirm PIN</label>
            <input class="input" type="password" inputmode="numeric" id="pin2" autocomplete="new-password" />
          </div>
          <p class="err hidden" id="gateErr"></p>
          <button class="btn btn-primary" id="doSetup">Create household</button>
          <button class="linkish" id="toImport">Have a backup JSON? Import instead</button>
        </div>
      </div>`,p.querySelector("#doSetup").onclick=()=>{const n=p.querySelector("#dueDate").value,s=p.querySelector("#pin").value.trim(),i=p.querySelector("#pin2").value.trim(),r=p.querySelector("#gateErr");if(!n){r.textContent="Pick a due date",r.classList.remove("hidden");return}if(s.length<4){r.textContent="PIN should be at least 4 characters",r.classList.remove("hidden");return}if(s!==i){r.textContent="PINs do not match",r.classList.remove("hidden");return}oe({pin:s,dueDate:n}),b="auto",f="today",l()},p.querySelector("#toImport").onclick=()=>{b="import",l()};return}p.innerHTML=`
    <div class="gate">
      <div class="gate-card">
        <div class="brand">
          <div class="brand-mark">🌱</div>
          <h1>Welcome back</h1>
          <p>Enter your household PIN</p>
        </div>
        <div class="field">
          <label class="label" for="pin">PIN</label>
          <input class="input" type="password" inputmode="numeric" id="pin" autocomplete="current-password" />
        </div>
        <p class="err hidden" id="gateErr"></p>
        <button class="btn btn-primary" id="doUnlock">Unlock</button>
        <button class="linkish" id="toImport">Import backup from other phone</button>
      </div>
    </div>`;const t=p.querySelector("#pin");t.focus();const a=()=>{if(re(t.value))b="auto",l();else{const n=p.querySelector("#gateErr");n.textContent="Incorrect PIN",n.classList.remove("hidden")}};p.querySelector("#doUnlock").onclick=a,t.onkeydown=n=>{n.key==="Enter"&&a()},p.querySelector("#toImport").onclick=()=>{b="import",l()}}function Ne(e){const t=e.household.dueDate,a=X(t),n=ee(t),s=I(),i=N();p.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${c(Q(i))} · America/New_York</div>
        </div>
        <span class="chip chip-clay">Week ${a??"—"}</span>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${f==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${f==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${f==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${f==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,p.querySelectorAll(".nav button").forEach(y=>{y.onclick=()=>{f=y.dataset.tab,l()}});const r=p.querySelector("#main");f==="today"?r.innerHTML=Le({due:t,week:a,daysLeft:n,log:s,today:i}):f==="appointments"?r.innerHTML=$e():f==="notes"?r.innerHTML=xe():r.innerHTML=Ee(e),Be(r)}function j(e,{compact:t=!1}={}){return e?`
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
        (Week ${e.week}). Original summary — not medical advice.
        ${t?"":"Talk to your midwife or OB about anything that worries you."}
      </p>
    </article>`:""}function Le({due:e,week:t,daysLeft:a,log:n,today:s}){const i=F(t),r=v??t,y=F(r),S=Array.from({length:G},(u,g)=>`<div class="glass ${g<n.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),D=Array.from({length:42},(u,g)=>g+1).map(u=>`<button type="button" class="${["week-pill",u===r?"active":"",u===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${u}">${u}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${t??"—"}</div><div class="l">Week</div></div>
      <div class="stat"><div class="n">${a??"—"}</div><div class="l">Days to due</div></div>
      <div class="stat"><div class="n">${c(e?e.slice(5):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${j(i)}

    ${(()=>{const u=De(t);if(!u)return"";const g=u.thisWeek.map(A=>`<li>${c(A)}</li>`).join(""),$=u.comingUp.map(A=>`<li>${c(A)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${c(u.bandTitle)}</span>
      </div>
      <ul class="prep-list">${g}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">${c(u.comingLabel)}</h4>
        <ul class="prep-list muted">${$}</ul>
      </div>
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife’s plan.</p>
    </div>`})()}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
        <span class="chip">${n.hydrationCount} / ${G}</span>
      </div>
      <div class="hydro">
        <div>
          <div class="hydro-count">${n.hydrationCount}</div>
          <div class="meta">glasses today</div>
        </div>
        <div class="btn-row">
          <button class="btn-icon" id="hydroMinus" aria-label="Remove glass">−</button>
          <button class="btn btn-sage btn-sm" id="hydroPlus">+ Glass</button>
        </div>
      </div>
      <div class="hydro-glasses">${S}</div>
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
        <span class="chip">${c(n.movementType||"move")}</span>
      </div>
      <div class="movement-type">${c(n.movementType||"")}</div>
      <div class="movement-title">${c(n.movementSuggestion||"")}</div>
      <p class="movement-detail">${c(n.movementDetail||"")}</p>
      <div class="btn-row">
        <button class="btn ${n.movementDone?"btn-sage":"btn-soft"} btn-sm" id="moveDone">
          ${n.movementDone?"✓ Done":"Mark done"}
        </button>
        <button class="btn btn-ghost btn-sm" id="moveRegen">Another idea</button>
      </div>
      <p class="disclaimer">Gentle suggestions only — complementary to gym, not a workout plan. Skip anything that doesn’t feel right; check with your care team if unsure.</p>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${v&&v!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${D}</div>
      ${v&&v!==t?j(y,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or GP.</p>
  `}function $e(){const e=me(),t=N(),a=te(t,1);return`
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
      ${e.length?e.map(s=>{const i=V(new Date(s.startsAt)),r=i===a||i===t,y=i<t;return`
          <div class="list-item" data-appt="${s.id}">
            <h4 style="${y?"opacity:0.55":""}">${c(s.title)}</h4>
            <div class="meta">${c(J(s.startsAt))}${s.location?" · "+c(s.location):""}</div>
            ${s.notes?`<div class="meta" style="margin-top:4px">${c(s.notes)}</div>`:""}
            ${r&&!y?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
            <div class="btn-row" style="margin-top:8px">
              <button class="btn btn-ghost btn-sm appt-del" data-id="${s.id}">Remove</button>
            </div>
          </div>`}).join(""):'<div class="empty">No appointments yet. Add OB visits, paperwork deadlines, or classes.</div>'}
    </div>`}function xe(){const e=be();return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">New note</h3></div>
      <div class="field">
        <label class="label" for="noteBody">Note</label>
        <textarea class="textarea" id="noteBody" placeholder="Symptom, question, reminder…"></textarea>
      </div>
      <div class="field">
        <label class="label" for="noteAuthor">Who (optional)</label>
        <select class="select" id="noteAuthor">
          <option value="">Either</option>
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
          <div class="meta">${c(J(a.createdAt))}${a.author?" · "+c(a.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${c(a.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${a.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Ee(e){return`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Due date</h3></div>
      <div class="field">
        <input class="input" type="date" id="setDue" value="${c(e.household.dueDate||"")}" />
      </div>
      <button class="btn btn-sage btn-sm" id="saveDue">Update due date</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Household PIN</h3></div>
      <div class="field">
        <input class="input" type="password" inputmode="numeric" id="setPin" placeholder="New PIN" />
      </div>
      <button class="btn btn-soft btn-sm" id="savePin">Change PIN</button>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Sync between phones</h3></div>
      <p class="meta" style="margin:0 0 12px">Export JSON on one phone, import on the other. Cloud sync (Supabase) can be wired later — data shape is ready.</p>
      <div class="btn-row">
        <button class="btn btn-primary btn-sm" id="doExport">Export JSON</button>
        <button class="btn btn-ghost btn-sm" id="doImportFile">Import file</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" class="hidden" />
      <textarea class="textarea hidden" id="exportBox" style="margin-top:12px; min-height:120px" readonly></textarea>
    </div>
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>
    <p class="disclaimer">localStorage-first · schema ready for Supabase households / daily_logs / appointments / notes</p>`}function Be(e,t){var a,n,s,i,r,y,S,D,u,g,$,A,P,U,W;f==="today"&&((a=e.querySelector("#hydroPlus"))==null||a.addEventListener("click",()=>{H(1),l()}),(n=e.querySelector("#hydroMinus"))==null||n.addEventListener("click",()=>{H(-1),l()}),(s=e.querySelector("#windToggle"))==null||s.addEventListener("click",()=>{pe(!I().windDown),l()}),(i=e.querySelector("#moveDone"))==null||i.addEventListener("click",()=>{const o=I();ue(!o.movementDone),l()}),(r=e.querySelector("#moveRegen"))==null||r.addEventListener("click",()=>{const o=I();he(se(o.movementSuggestion)),l()}),e.querySelectorAll("[data-browse-week]").forEach(o=>{o.addEventListener("click",()=>{v=Number(o.dataset.browseWeek),l()})}),(y=e.querySelector("#resetBrowse"))==null||y.addEventListener("click",()=>{v=null,l()})),f==="appointments"&&((S=e.querySelector("#apptAdd"))==null||S.addEventListener("click",()=>{const o=e.querySelector("#apptTitle").value.trim(),k=e.querySelector("#apptWhen").value;if(!o||!k)return alert("Title and date/time are required");fe({title:o,startsAt:new Date(k).toISOString(),location:e.querySelector("#apptLoc").value,notes:e.querySelector("#apptNotes").value}),l()}),e.querySelectorAll(".appt-del").forEach(o=>{o.addEventListener("click",()=>{confirm("Remove this appointment?")&&(ye(o.dataset.id),l())})})),f==="notes"&&((D=e.querySelector("#noteAdd"))==null||D.addEventListener("click",()=>{const o=e.querySelector("#noteBody").value.trim();o&&(ge({body:o,author:e.querySelector("#noteAuthor").value}),l())}),e.querySelectorAll(".note-del").forEach(o=>{o.addEventListener("click",()=>{ve(o.dataset.id),l()})})),f==="settings"&&((u=e.querySelector("#saveDue"))==null||u.addEventListener("click",()=>{const o=e.querySelector("#setDue").value;o&&(ce(o),v=null,l())}),(g=e.querySelector("#savePin"))==null||g.addEventListener("click",()=>{const o=e.querySelector("#setPin").value.trim();if(o.length<4)return alert("PIN should be at least 4 characters");de(o),alert("PIN updated"),l()}),($=e.querySelector("#doExport"))==null||$.addEventListener("click",()=>{const o=we(),k=e.querySelector("#exportBox");k.classList.remove("hidden"),k.value=o;const x=new Blob([o],{type:"application/json"}),E=URL.createObjectURL(x),C=document.createElement("a");C.href=E,C.download=`bump-export-${N()}.json`,C.click(),URL.revokeObjectURL(E)}),(A=e.querySelector("#doImportFile"))==null||A.addEventListener("click",()=>{e.querySelector("#importFile").click()}),(P=e.querySelector("#importFile"))==null||P.addEventListener("change",async o=>{var x;const k=(x=o.target.files)==null?void 0:x[0];if(k)try{Z(await k.text()),alert("Import successful"),l()}catch(E){alert(E.message||"Import failed")}}),(U=e.querySelector("#doLock"))==null||U.addEventListener("click",()=>{le(),b="unlock",l()}),(W=e.querySelector("#doReset"))==null||W.addEventListener("click",()=>{confirm("Erase all Bump data on this device?")&&(ke(),b="setup",f="today",v=null,l())}))}window.addEventListener("online",()=>console.info("[bump] online — ready for future sync"));window.addEventListener("offline",()=>console.info("[bump] offline — local data still available"));l();
