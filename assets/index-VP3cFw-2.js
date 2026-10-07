(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const Y="America/New_York";function T(){return me(new Date)}function me(e){const t=new Intl.DateTimeFormat("en-US",{timeZone:Y,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(e),n=t.find(o=>o.type==="year").value,s=t.find(o=>o.type==="month").value,a=t.find(o=>o.type==="day").value;return`${n}-${s}-${a}`}function he(e){if(!e)return"";const[t,n,s]=e.split("-").map(Number),a=new Date(Date.UTC(t,n-1,s,12));return new Intl.DateTimeFormat("en-US",{timeZone:Y,weekday:"short",month:"short",day:"numeric"}).format(a)}function Ee(e){if(!e)return"";const[t,n,s]=e.split("-").map(Number);return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric"}).format(new Date(Date.UTC(t,n-1,s,12)))}function K(e){return e?new Intl.DateTimeFormat("en-US",{timeZone:Y,weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function fe(e,t){const[n,s,a]=e.split("-").map(Number),[o,i,d]=t.split("-").map(Number),g=Date.UTC(n,s-1,a),c=Date.UTC(o,i-1,d);return Math.round((g-c)/864e5)}function Ne(e,t=T()){if(!e)return null;const s=280-fe(e,t);if(s<0)return 1;const a=Math.floor(s/7)+1;return Math.min(42,Math.max(1,a))}function Le(e){if(e==null||Number.isNaN(Number(e)))return null;const t=Number(e);return t<=13?{number:1,label:"1st"}:t<=27?{number:2,label:"2nd"}:{number:3,label:"3rd"}}function Be(e,t=T()){return e?fe(e,t):null}function Ie(e,t){const[n,s,a]=e.split("-").map(Number);return new Date(Date.UTC(n,s-1,a+t)).toISOString().slice(0,10)}const U=[{type:"walk",title:"Neighborhood stroll",detail:"10–15 minutes at an easy pace. Fresh air counts."},{type:"walk",title:"After-meal walk",detail:"A short loop after lunch can ease bloating and stiffness."},{type:"walk",title:"Park path",detail:"Slow walk somewhere pleasant. Stop whenever you want."},{type:"stretch",title:"Cat–cow stretch",detail:"On hands and knees, gently arch and round. Breathe slowly."},{type:"stretch",title:"Hip opener",detail:"Seated figure-four or butterfly stretch — soft, no forcing."},{type:"stretch",title:"Side body stretch",detail:"Standing or seated, reach one arm overhead. Switch sides."},{type:"stretch",title:"Neck & shoulder release",detail:"Slow rolls and shrugs. Drop the shoulders away from ears."},{type:"strength",title:"Wall push-ups",detail:"5–10 easy reps against a wall. Keep breathing steady."},{type:"strength",title:"Sit-to-stand",detail:"From a sturdy chair, stand and sit 6–8 times. Use hands if needed."},{type:"strength",title:"Glute bridge (if comfortable)",detail:"On your back if still okay, or side-lying squeeze. Skip if it doesn’t feel right."},{type:"strength",title:"Band pull-aparts",detail:"Light resistance band, open arms wide. Posture-friendly."},{type:"walk",title:"Errand walk",detail:"Park farther away or take one extra block. Keep it easy."},{type:"stretch",title:"Child’s pose (wide knees)",detail:"Knees apart, fold forward if comfortable. Rest your head."},{type:"strength",title:"Calf raises",detail:"Hold a counter, rise onto toes 10 times. Helps circulation."}];function xe(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return U[t%U.length]}function Re(e){const t=U.filter(n=>n.title!==e);return t[Math.floor(Math.random()*t.length)]||U[0]}const V="bump.v1",J=1;function ge(){return crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function z(){return{schemaVersion:J,household:{id:ge(),pin:null,dueDate:null,createdAt:new Date().toISOString(),names:{partnerA:"Vince",partnerB:"Chantal"}},dailyLogs:{},notes:[],unlocked:!1,updatedAt:new Date().toISOString()}}function A(e,t=T()){if(!e.dailyLogs[t]){const n=xe(t);e.dailyLogs[t]={date:t,hydrationCount:0,windDown:!1,movementDone:!1,movementSuggestion:n.title,movementDetail:n.detail,movementType:n.type}}return e.dailyLogs[t]}let b=null;function w(){b.updatedAt=new Date().toISOString();try{localStorage.setItem(V,JSON.stringify(b))}catch(e){console.warn("persist failed",e)}}function ye(){try{const e=localStorage.getItem(V);e?(b=JSON.parse(e),b.schemaVersion||(b.schemaVersion=J),b.household||(b=z())):b=z()}catch{b=z()}return A(b),b}function h(){return b||ye(),b}function H(){var t,n;const e=h();return!!((t=e.household)!=null&&t.pin&&((n=e.household)!=null&&n.dueDate))}function be(){return!!h().unlocked}function Oe({pin:e,dueDate:t}){const n=h();return n.household.pin=String(e).trim(),n.household.dueDate=t,n.household.createdAt=n.household.createdAt||new Date().toISOString(),n.unlocked=!0,A(n),w(),n}function qe(e){var n;const t=h();return!!((n=t.household)!=null&&n.pin)&&String(e??"").trim()===String(t.household.pin)}function Pe(e){const t=h();return qe(e)?(t.unlocked=!0,A(t),w(),!0):!1}function ze(){const e=h();e.unlocked=!1,w()}function Me(e){const t=h();t.household.dueDate=e,w()}function Ue(e){const t=h();t.household.pin=String(e).trim(),w()}function M(){return A(h())}function ne(e=1){const t=h(),n=A(t);return n.hydrationCount=Math.max(0,(n.hydrationCount||0)+e),w(),n}function He(e){const t=h(),n=A(t);return n.windDown=!!e,w(),n}function We(e){const t=h(),n=A(t);return n.movementDone=!!e,w(),n}function _e(e){const t=h(),n=A(t);return n.movementSuggestion=e.title,n.movementDetail=e.detail,n.movementType=e.type,n.movementDone=!1,w(),n}function Ge(){return[...h().notes].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt))}function Fe({body:e,author:t=""}){const n=h(),s={id:ge(),body:e.trim(),author:t.trim(),createdAt:new Date().toISOString()};return n.notes.unshift(s),w(),s}function je(e){const t=h();t.notes=t.notes.filter(n=>n.id!==e),w()}function Ye(){const e=h(),{pin:t,...n}=e.household,s={schemaVersion:J,exportedAt:new Date().toISOString(),app:"bump-tracker",household:n,dailyLogs:e.dailyLogs,notes:e.notes};return JSON.stringify(s,null,2)}function Ke(){localStorage.removeItem(V),b=z(),w()}const ae="1db2ccd5ddc253b4eedee62ffecd522f2c5e9f49b16e2090a7fe1dab48164daa".toLowerCase(),ve="bump.inviteOk.v1";async function Ve(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(s=>s.toString(16).padStart(2,"0")).join("")}function we(){try{return localStorage.getItem(ve)==="1"}catch{return!1}}function Je(){try{localStorage.setItem(ve,"1")}catch(e){console.warn("invite flag persist failed",e)}}function Ze(e){return String(e??"").trim().toLowerCase()}async function Qe(e){if(!ae)return console.warn("[bump] VITE_INVITE_HASH not set — invite gate cannot unlock"),!1;const t=Ze(e);return t&&await Ve(t)===ae?(Je(),!0):!1}function ke(e){return Math.max(4,Math.min(41,Math.round(e)||4))}function Xe(e){const t=ke(e);return`https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${t<=12?"1st-trimester":t<=27?"2nd-trimester":"3rd-trimester"}/week-${t}/`}const et={1:{title:"Very early days",size:"just beginning",baby:"Conception may still be ahead. Cells that could become a pregnancy are preparing.",feel:"You likely feel as usual. No pregnancy signs yet.",tip:"Start prenatal vitamins if your clinician advised them; ease off alcohol."},2:{title:"Conception window",size:"a single cell",baby:"If fertilization happens, one cell begins dividing into a cluster.",feel:"Still no symptoms for most people. Cycle timing matters for later dating.",tip:"Note your last period date for your first prenatal visit."},3:{title:"Implantation",size:"a tiny ball of cells",baby:"The cluster may settle into the uterus and start making pregnancy hormones.",feel:"Light spotting or mild cramps can occur. Many feel nothing yet.",tip:"Rest if you need to; keep meals simple and gentle."},4:{title:"Missed period time",size:"a poppy seed",baby:"The neural tube is forming; the foundation for brain and spine is underway.",feel:"Tiredness and tender breasts are common. A test may turn positive.",tip:"Book prenatal care when you’re ready; share any medication list with your doctor or OB."},5:{title:"Heartbeat beginnings",size:"a sesame seed",baby:"A simple heart tube starts beating; major organ systems begin outlining.",feel:"Nausea, smell sensitivity, or fatigue may appear.",tip:"Keep water nearby and try small snacks rather than big meals."},6:{title:"Face and limbs",size:"a lentil",baby:"Limb buds appear; facial features begin to sketch in.",feel:"Mood swings and food aversions are common. Be kind to yourself.",tip:"Short rests beat pushing through — nap when you can."},7:{title:"Brain growing fast",size:"a blueberry",baby:"Brain development speeds up; arms and legs lengthen.",feel:"Waistbands may feel tight before a bump shows.",tip:"Choose comfort clothes; loosen anything that digs in."},8:{title:"Fingers and toes",size:"a raspberry",baby:"Fingers and toes are forming; the body is lengthening.",feel:"First prenatal visits often fall around now.",tip:"Write questions beforehand; bring a partner or notes if helpful."},9:{title:"Tiny movements",size:"a grape",baby:"Muscles start working; eyelids form. Movements are too small to feel.",feel:"Emotions can feel louder. That’s a hormone effect, not a failing.",tip:"A gentle 10-minute stretch after waking can ease stiffness."},10:{title:"More recognizable",size:"an apricot",baby:"Face looks more in proportion; ears and lips are forming. Heart beats quickly.",feel:"Bloating, burping, and tiredness are common as digestion slows.",tip:"Try smaller meals, eat slowly, and take a short stroll after eating."},11:{title:"Bones hardening",size:"a fig",baby:"Bones begin to harden; tooth buds appear.",feel:"Nausea may still be strong for some; others feel a slight lift.",tip:"Cold fruit, ginger tea, or bland foods can settle an uneasy stomach."},12:{title:"Reflexes and fingerprints",size:"a lime",baby:"Reflexes develop; fingerprints form. Risk of miscarriage drops for many.",feel:"Energy may start returning. You might share news if you want to.",tip:"Celebrate a small milestone — you’ve come a long way."},13:{title:"End of first trimester",size:"a lemon",baby:"Vocal cords form; movement becomes more fluid.",feel:"Energy often improves; appetite may pick up.",tip:"Last week of the first trimester — add a short outdoor walk if weather and energy allow."},14:{title:"Second trimester begins",size:"an apple",baby:"Facial muscles practice expressions; the neck lengthens.",feel:"Welcome to the second trimester. Round-ligament twinges can start as the uterus rises.",tip:"Change positions slowly; support your belly when you stand."},15:{title:"Senses awakening",size:"an avocado",baby:"Baby may sense light; legs grow longer than arms.",feel:"Congestion or mild nosebleeds can come from extra blood volume.",tip:"A cool-mist humidifier at night can feel soothing."},16:{title:"Quickening soon",size:"a large avocado",baby:"The skeleton keeps hardening; muscles strengthen.",feel:"You might feel fluttering soon, especially if this isn’t a first pregnancy.",tip:"Place a hand on your belly during quiet moments."},17:{title:"Fat stores begin",size:"a turnip",baby:"Brown fat starts forming to help with temperature later.",feel:"Backaches may show up. Supportive shoes help.",tip:"Swap heels for flats; gently stretch hip flexors."},18:{title:"Hearing develops",size:"a sweet potato",baby:"Ears are in position; muffled sounds may reach baby.",feel:"Anatomy scans are often booked around weeks 18–22.",tip:"Gather insurance cards and questions before the appointment."},19:{title:"Vernix coat",size:"a mango",baby:"A creamy protective coating (vernix) covers the skin.",feel:"Itchy stretch on the belly is common — moisturizer helps.",tip:"Use fragrance-free lotion after showers."},20:{title:"Halfway mark",size:"a banana",baby:"You’re about halfway. Hair and nails continue to grow.",feel:"The bump is often visible; Braxton Hicks may begin lightly.",tip:"Take a keepsake photo only if you want — no pressure."},21:{title:"Swallowing practice",size:"a carrot",baby:"Baby practices swallowing; taste buds are working.",feel:"Mild practice tightenings can come and go.",tip:"Hydrate and rest if tightenings feel frequent."},22:{title:"Features refining",size:"a papaya",baby:"Eyebrows and lips look more defined.",feel:"Night leg cramps are common.",tip:"Stretch calves before bed; point and flex if a cramp hits."},23:{title:"Rapid brain growth",size:"a grapefruit",baby:"Brain growth accelerates; lungs keep developing.",feel:"Shortness of breath can appear as the uterus rises.",tip:"Slow down on stairs; pause and breathe when you need to."},24:{title:"Lung progress",size:"an ear of corn",baby:"Lungs make surfactant; growth continues steadily.",feel:"Glucose screening is often discussed around now.",tip:"Keep snacks balanced — protein with complex carbs."},25:{title:"Responding to voice",size:"a cauliflower",baby:"Baby may respond to familiar voices.",feel:"Heartburn can intensify in the evenings.",tip:"Smaller evening meals; elevate your head slightly for sleep if reflux bothers you."},26:{title:"Eyes opening",size:"a head of lettuce",baby:"Eyes can open; eyelashes form.",feel:"Ankle or foot swelling can show up — elevate when resting.",tip:"Ask your clinician before trying compression socks."},27:{title:"End of second trimester",size:"a large cauliflower",baby:"Brain activity increases; senses keep maturing.",feel:"Last week of the second trimester. Fatigue may return; rest counts as progress.",tip:"Wind down: dim lights, phone away, short stretch."},28:{title:"Third trimester begins",size:"an eggplant",baby:"REM (dream) sleep may occur; baby packs on weight.",feel:"If you’re Rh-negative, an immune globulin shot may be offered.",tip:"Welcome to the third trimester — add third-trimester visits to your shared calendar."},29:{title:"Stronger kicks",size:"a butternut squash",baby:"Kicks feel stronger; lungs keep practicing breathing motions.",feel:"Left-side sleep is often suggested; pillows help hips.",tip:"Try a pillow between the knees for comfort."},30:{title:"Brain packing in",size:"a cabbage",baby:"Brain grows quickly; baby gains fat.",feel:"Braxton Hicks may feel more noticeable. Time them if you’re unsure.",tip:"Call your care team about any pattern that worries you."},31:{title:"All senses working",size:"a coconut",baby:"All five senses work; sound processing improves.",feel:"Nesting urges are real — pace cleaning and errands.",tip:"One small prep task per day beats a marathon."},32:{title:"Nearly complete nails",size:"a jicama",baby:"Nails are nearly complete; space is getting tighter.",feel:"Pelvic pressure increases. Sit when you need to.",tip:"Ask about pelvic-floor tips if your OB or PT suggested them."},33:{title:"Antibody transfer",size:"a pineapple",baby:"Antibodies transfer from you; skull bones stay soft for birth.",feel:"Hospital-bag brainstorming can start — no rush to pack fully.",tip:"List must-haves in Notes so both of you can add items."},34:{title:"Cheeks filling out",size:"a cantaloupe",baby:"Fat fills out cheeks; lungs are nearly ready.",feel:"Group B strep testing is often done around now.",tip:"Confirm pediatrician preference and birth notes together."},35:{title:"Less room to move",size:"a honeydew melon",baby:"Movements feel more like rolls than kicks as space tightens.",feel:"Bathroom trips increase. Night lights help.",tip:"Sip earlier in the evening; ease big drinks right before bed."},36:{title:"Engaging lower",size:"a romaine head",baby:"Baby may drop lower into the pelvis (engage).",feel:"Breathing can ease if baby drops; pelvic pressure rises.",tip:"Do a dry run of the hospital route and parking."},37:{title:"Early term",size:"a bunch of chard",baby:"Often called early term — organs are ready for life outside.",feel:"Watch for labor signs your clinician described. Rest while you can.",tip:"Charge devices, wash favorite PJs, freeze one simple meal."},38:{title:"Ready when it’s time",size:"a leek bunch",baby:"Vernix decreases; baby is ready when labor starts.",feel:"False alarms happen. When in doubt, call triage.",tip:"Keep the go-bag by the door and easy slip-on shoes."},39:{title:"Due any day",size:"a mini watermelon",baby:"Brain and body keep fine-tuning right up to birth.",feel:"Patience is hard. Gentle walks and rest both help.",tip:"Send each other one kind note tonight — you’re a team."},40:{title:"Due-date week",size:"a small pumpkin",baby:"Only a small share of babies arrive on the exact due date.",feel:"You’re not ‘late’ at 40 weeks yet — averages vary.",tip:"Trust your care team on next steps if you go past 40."},41:{title:"Past the due date",size:"still growing",baby:"Monitoring may increase; baby may gain a little more.",feel:"Induction conversations are common. Ask every question you have.",tip:"Pack patience and a calming playlist."},42:{title:"Late check-ins",size:"ready for arrival",baby:"Your care team watches closely; follow their plan.",feel:"Appointments may be more frequent. Take support when offered.",tip:"Lean on each other — the finish line is near."}};function se(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e)));return{week:t,...et[t],nhsWeek:ke(t),nhsUrl:Xe(t)}}const tt=[{from:1,to:7,title:"Early days",thisWeek:["Start or continue prenatal vitamins if your clinician advised them","Note last period date for dating the pregnancy","Ease off alcohol; keep a simple meds list for your first visit"],comingUp:["Book prenatal care / first OB or midwife visit","Ask about bloodwork and genetic screening options"]},{from:8,to:13,title:"First trimester wrap",thisWeek:["Confirm first prenatal appointment is on the calendar","Bring insurance card + questions list to the visit","Start a shared list of questions for your OB or midwife in Notes"],comingUp:["Discuss nuchal / early screening if offered","Plan when (or if) to share news with family"]},{from:14,to:17,title:"Second trimester settle-in",thisWeek:["Keep prenatal vitamins going","Comfortable shoes + light daily walk if energy allows","Add follow-up labs to Google Calendar with [Bump] in the title"],comingUp:["Anatomy scan usually booked ~18–22 weeks","Gather insurance + ID for the scan day"]},{from:18,to:22,title:"Anatomy scan window",thisWeek:["Confirm anatomy / mid-pregnancy scan details","Pack insurance card, ID, and snack for the appointment","Write questions (placenta, anatomy, next visits)"],comingUp:["Glucose screening often discussed mid–late 20s","Start a soft list of baby-must-haves (no rush to buy)"]},{from:23,to:27,title:"Mid–late second trimester",thisWeek:["Ask about glucose screening timing","Balanced snacks: protein + complex carbs","Note any kick patterns that feel new (optional log in Notes)"],comingUp:["Third-trimester visit cadence may increase","If Rh-negative, ask about immune globulin timing (~28)"]},{from:28,to:32,title:"Third trimester gear-up",thisWeek:["Confirm third-trimester appointment schedule","Rh-negative? Check immune globulin shot timing","One small prep task a day beats a nesting marathon"],comingUp:["Brainstorm hospital / birth-center bag (don’t pack fully yet)","Tour or virtual tour if your place offers one"]},{from:33,to:36,title:"Bag & paperwork",thisWeek:["Start a shared hospital-bag list in Notes","Confirm pediatrician preference + birth preferences notes","Ask about Group B strep testing timing","Dry-run the hospital route and parking"],comingUp:["Pack go-bag by ~37 weeks","Freeze 1–2 easy meals; charge devices"]},{from:37,to:42,title:"Ready when it’s time",thisWeek:["Go-bag by the door + easy slip-on shoes","Charge phones; wash favorite PJs","Know triage / labor-line numbers","Review labor signs your clinician described"],comingUp:["If past due date, follow your care team’s monitoring plan","Pack patience — only some babies arrive on the exact day"]}];function nt(e){if(e==null||Number.isNaN(e))return null;const t=Math.min(42,Math.max(1,Math.round(e))),n=tt.find(s=>t>=s.from&&t<=s.to);return{week:t,bandTitle:n.title,thisWeek:n.thisWeek,lookingAhead:n.comingUp}}const oe="1075531369147-ok2muis4jo4r0njb598gov309aoim30n.apps.googleusercontent.com".trim(),Se=oe.endsWith(".apps.googleusercontent.com")?oe:"",at="primary",x="[Bump]",ie="https://www.googleapis.com/auth/calendar.events.readonly",st=183,ot=60,it=10,rt="https://accounts.google.com/gsi/client",B="bump.gcal.token.v1",W="bump.gcal.cache.v1",re=864e5;function $(){return!!Se}function _(e){try{return JSON.parse(localStorage.getItem(e)||"null")}catch{return null}}function De(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(n){console.warn("[bump] calendar storage failed",n)}}function I(){return!!_(W)}function lt(){return _(W)||{events:[],fetchedAt:null}}function ct(){const e=_(B);return e&&e.accessToken&&e.expiresAt>Date.now()+6e4?e.accessToken:null}let O=null;function Z(){var e,t;return $()?(t=(e=window.google)==null?void 0:e.accounts)!=null&&t.oauth2?Promise.resolve():(O||(O=new Promise((n,s)=>{const a=document.createElement("script");a.src=rt,a.async=!0,a.defer=!0,a.onload=()=>n(),a.onerror=()=>{O=null,s(new Error("Could not load Google sign-in"))},document.head.appendChild(a)})),O):Promise.reject(new Error("Calendar not set up"))}let q=null,C=null;function dt(){return q||(q=window.google.accounts.oauth2.initTokenClient({client_id:Se,scope:ie,callback:e=>{const t=C;if(C=null,!t)return;if(!e||e.error||!e.access_token){t.reject(new Error((e==null?void 0:e.error_description)||(e==null?void 0:e.error)||"Authorization failed"));return}if(!window.google.accounts.oauth2.hasGrantedAllScopes(e,ie)){t.reject(new Error("Calendar access was not granted"));return}const n=Number(e.expires_in)||3600;De(B,{accessToken:e.access_token,expiresAt:Date.now()+n*1e3}),t.resolve(e.access_token)},error_callback:e=>{const t=C;C=null,t&&t.reject(new Error((e==null?void 0:e.type)==="popup_closed"?"Sign-in window closed":"Could not open Google sign-in"))}}),q)}function ut(e=""){return new Promise((t,n)=>{C&&C.reject(new Error("Superseded")),C={resolve:t,reject:n};try{dt().requestAccessToken({prompt:e})}catch(s){C=null,n(s)}})}const F=new RegExp(x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");function pt(e){return F.lastIndex=0,typeof e=="string"&&F.test(e)}function mt(e){return String(e).replace(F," ").replace(/\s{2,}/g," ").trim()||"Untitled"}function ht(e){return(e||[]).filter(t=>t&&t.status!=="cancelled"&&pt(t.summary)).map(t=>{var s,a,o,i,d,g;const n=!!((s=t.start)!=null&&s.date&&!((a=t.start)!=null&&a.dateTime));return{id:String(t.id||""),title:mt(t.summary),allDay:n,start:n?t.start.date:(o=t.start)==null?void 0:o.dateTime,end:n?((i=t.end)==null?void 0:i.date)||t.start.date:((d=t.end)==null?void 0:d.dateTime)||((g=t.start)==null?void 0:g.dateTime),location:String(t.location||"").trim()}}).filter(t=>t.start)}class Ce extends Error{}async function ft(e){const t=Date.now(),n=new URLSearchParams({singleEvents:"true",orderBy:"startTime",timeMin:new Date(t-ot*re).toISOString(),timeMax:new Date(t+st*re).toISOString(),maxResults:"250",q:x.replace(/[^\w\s]/g," ").trim(),fields:"items(id,status,summary,location,start,end),nextPageToken"}),s=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(at)}/events`,a=[];let o="";for(let i=0;i<5;i++){o&&n.set("pageToken",o);const d=await fetch(`${s}?${n}`,{headers:{Authorization:`Bearer ${e}`}});if(d.status===401)throw new Ce("Token expired");if(!d.ok)throw new Error(`Calendar request failed (${d.status})`);const g=await d.json();if(a.push(...ht(g.items)),o=g.nextPageToken||"",!o)break}return a}async function gt({interactive:e=!1,consent:t=!1}={}){if(!$())return{ok:!1,error:"Calendar not set up"};let n=t?null:ct();for(let s=0;s<2;s++){if(!n){if(!e)return{ok:!1,needsReconnect:!0};try{await Z(),n=await ut(t?"consent":"")}catch(a){return{ok:!1,needsReconnect:!0,error:a.message}}}try{const a=await ft(n);return De(W,{events:a,fetchedAt:new Date().toISOString()}),{ok:!0}}catch(a){if(a instanceof Ce){localStorage.removeItem(B),n=null;continue}return{ok:!1,error:a.message||"Could not reach Google Calendar"}}}return{ok:!1,needsReconnect:!0}}async function le(){const e=_(B);if(localStorage.removeItem(B),localStorage.removeItem(W),e!=null&&e.accessToken&&$())try{await Z(),await new Promise(t=>window.google.accounts.oauth2.revoke(e.accessToken,()=>t()))}catch{}}const ce=8,f=document.getElementById("app");let m="today",D=null,v="auto",j=null;const Ae=/^\d{4,}$/,Te="PIN should be at least 4 digits (numbers only)",l={loading:!1,error:"",needsReconnect:!1,stale:!1,pastOpen:!1},P=`Add ${x} to an event title in your Google Calendar to show it here.`;ye();function r(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(){const e=h();if(!we()){v="invite",de();return}if(!H()||!be()){(v==="invite"||v==="auto")&&(v=H()?"unlock":"setup"),de();return}yt(e)}function de(){const e=H();if(v==="auto"&&(v=we()?e?"unlock":"setup":"invite"),v==="invite"){f.innerHTML=`
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
      </div>`;const n=f.querySelector("#inviteCode");n.focus();const s=async()=>{const a=f.querySelector("#gateErr");a.classList.add("hidden"),await Qe(n.value)?(v="auto",p()):(a.textContent="That invite doesn’t match. Double-check and try again.",a.classList.remove("hidden"))};f.querySelector("#doInvite").onclick=s,n.onkeydown=a=>{a.key==="Enter"&&s()};return}if(v==="setup"){f.innerHTML=`
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
      </div>`,f.querySelector("#setupForm").onsubmit=n=>{n.preventDefault();const s=f.querySelector("#dueDate").value,a=f.querySelector("#pin").value.trim(),o=f.querySelector("#pin2").value.trim(),i=f.querySelector("#gateErr");if(!s){i.textContent="Pick a due date",i.classList.remove("hidden");return}if(!Ae.test(a)){i.textContent=Te,i.classList.remove("hidden");return}if(a!==o){i.textContent="PINs do not match",i.classList.remove("hidden");return}Oe({pin:a,dueDate:s}),v="auto",m="today",p()};return}f.innerHTML=`
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
    </div>`;const t=f.querySelector("#pin");t.focus(),f.querySelector("#unlockForm").onsubmit=n=>{if(n.preventDefault(),Pe(t.value))v="auto",p();else{const s=f.querySelector("#gateErr");s.textContent="Incorrect PIN",s.classList.remove("hidden")}}}function yt(e){const t=e.household.dueDate,n=Ne(t),s=Be(t),a=M(),o=T();j=o,f.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>Bump</h1>
          <div class="sub">${r(he(o))}</div>
        </div>
      </header>
      <main id="main"></main>
      <nav class="nav" aria-label="Main">
        <button data-tab="today" class="${m==="today"?"active":""}"><span class="ico">☀️</span>Today</button>
        <button data-tab="appointments" class="${m==="appointments"?"active":""}"><span class="ico">📅</span>Appts</button>
        <button data-tab="notes" class="${m==="notes"?"active":""}"><span class="ico">📝</span>Notes</button>
        <button data-tab="settings" class="${m==="settings"?"active":""}"><span class="ico">⚙️</span>Settings</button>
      </nav>
    </div>`,f.querySelectorAll(".nav button").forEach(d=>{d.onclick=()=>{m=d.dataset.tab,p(),m==="appointments"&&I()&&L({interactive:!0})}}),$()&&Z().catch(()=>{});const i=f.querySelector("#main");m==="today"?i.innerHTML=wt({due:t,week:n,daysLeft:s,log:a}):m==="appointments"?i.innerHTML=St():m==="notes"?i.innerHTML=Dt():i.innerHTML=Ct(e),At(i),m==="today"&&bt(i)}function bt(e){const t=e.querySelector(".week-browser"),n=(t==null?void 0:t.querySelector(".week-pill.active"))||(t==null?void 0:t.querySelector(".week-pill.current"));if(!t||!n)return;const s=t.getBoundingClientRect(),a=n.getBoundingClientRect();t.scrollLeft+=a.left-s.left-(s.width-a.width)/2}function ue(e,{compact:t=!1}={}){return e?`
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
    </article>`:""}function vt(e){return e==null?{n:"—",l:"Days to due"}:e>0?{n:e,l:"Days to due"}:e===0?{n:0,l:"Due today"}:{n:Math.abs(e),l:"Days past due"}}function wt({due:e,week:t,daysLeft:n,log:s}){var k;const a=se(t),o=D??t,i=se(o),d=vt(n),g=Array.from({length:ce},(y,S)=>`<div class="glass ${S<s.hydrationCount?"on":""}" aria-hidden="true"></div>`).join(""),c=Array.from({length:42},(y,S)=>S+1).map(y=>`<button type="button" class="${["week-pill",y===o?"active":"",y===t?"current":""].filter(Boolean).join(" ")}" data-browse-week="${y}">${y}</button>`).join("");return`
    <div class="progress-row">
      <div class="stat"><div class="n">${r(((k=Le(t))==null?void 0:k.label)??"—")}</div><div class="l">Trimester</div></div>
      <div class="stat"><div class="n">${r(d.n)}</div><div class="l">${r(d.l)}</div></div>
      <div class="stat"><div class="n">${r(e?Ee(e):"—")}</div><div class="l">Due ${e?e.slice(0,4):""}</div></div>
    </div>

    ${ue(a)}

    ${(()=>{const y=nt(t);if(!y)return"";const S=y.thisWeek.map(E=>`<li>${r(E)}</li>`).join(""),R=y.lookingAhead.map(E=>`<li>${r(E)}</li>`).join("");return`
    <div class="card prep-card">
      <div class="card-head">
        <h3 class="card-title">🧺 Prepare this week</h3>
        <span class="chip">${r(y.bandTitle)}</span>
      </div>
      <ul class="prep-list">${S}</ul>
      <div class="prep-coming">
        <h4 class="prep-coming-title">Looking ahead</h4>
        <ul class="prep-list muted">${R}</ul>
      </div>
      <p class="disclaimer">Practical household reminders — not medical advice. Follow your OB or midwife’s plan.</p>
    </div>`})()}

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">💧 Hydration</h3>
      </div>
      <div class="hydro">
        <div>
          <div class="hydro-count">${s.hydrationCount}</div>
          <div class="meta">of ${ce} glasses today</div>
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
        <button class="toggle ${s.windDown?"on":""}" id="windToggle" role="switch" aria-checked="${s.windDown}" aria-label="Wind-down done"></button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">🚶 Daily movement</h3>
      </div>
      <div class="movement-type">${r(s.movementType||"")}</div>
      <div class="movement-title">${r(s.movementSuggestion||"")}</div>
      <p class="movement-detail">${r(s.movementDetail||"")}</p>
      <div class="btn-row">
        <button class="btn ${s.movementDone?"btn-sage":"btn-soft"} btn-sm" id="moveDone">
          ${s.movementDone?"✓ Done":"Mark done"}
        </button>
        <button class="btn btn-ghost btn-sm" id="moveRegen">Another idea</button>
      </div>
      <p class="disclaimer">Gentle suggestions only — not a workout plan. Skip anything that doesn’t feel right; check with your care team if unsure.</p>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📚 Browse by week</h3>
        ${D&&D!==t?'<button class="btn btn-ghost btn-sm" id="resetBrowse">Back to current</button>':""}
      </div>
      <div class="week-browser">${c}</div>
      ${D&&D!==t?ue(i,{compact:!0}):'<p class="meta">Tap a week to peek ahead or look back. Current week is outlined in sage.</p>'}
    </div>

    <p class="disclaimer">Bump is a shared household helper, not medical advice. For health questions, talk to your OB, midwife, or doctor.</p>
  `}function kt(e,t,n,s){if(e.allDay){const i=e.end<=n;return{past:i,onToday:!i&&e.start<=n,isToday:!i&&e.start<=n,isTomorrow:!i&&e.start===s}}const a=me(new Date(e.start)),o=Date.parse(e.end||e.start)<t;return{past:o,onToday:a===n,isToday:!o&&a<=n,isTomorrow:!o&&a===s}}function pe(e,t){const n=e.allDay?`${he(e.start)} · All day`:K(e.start);return`
    <div class="list-item${t.past?" is-past":""}">
      <h4>${r(e.title)}${t.isToday?' <span class="chip chip-today">Today</span>':""}</h4>
      <div class="meta">${r(n)}${e.location?" · "+r(e.location):""}</div>
      ${t.isTomorrow?'<div class="buffer-flag">Day-before buffer — prep paperwork / plan travel</div>':""}
    </div>`}function St(){if(!$())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="cal-lead">Calendar not set up yet</p>
        <p class="meta">Appointments will come from Google Calendar once it’s connected. ${r(P)}</p>
      </div>`;if(!I())return`
      <div class="card">
        <div class="card-head"><h3 class="card-title">📅 Appointments</h3></div>
        <p class="meta" style="margin:0 0 12px">Show events from your Google Calendar here (read-only). ${r(P)}</p>
        ${l.error?`<p class="err" style="margin:0 0 10px">${r(l.error)}</p>`:""}
        <button class="btn btn-primary" id="calConnect" ${l.loading?"disabled":""}>${l.loading?"Connecting…":"Connect Google Calendar"}</button>
      </div>`;const{events:e,fetchedAt:t}=lt(),n=Date.now(),s=T(),a=Ie(s,1),o=e.map(c=>({ev:c,t:kt(c,n,s,a)})),i=o.filter(c=>!c.t.past||c.t.onToday).sort((c,k)=>c.ev.start<k.ev.start?-1:1),d=o.filter(c=>c.t.past&&!c.t.onToday).sort((c,k)=>c.ev.start<k.ev.start?1:-1).slice(0,it);let g;return l.loading?g="Updating…":g=t?`Last updated ${K(t)}`:"Not updated yet",`
    <div class="card">
      <div class="card-head">
        <h3 class="card-title">📅 Upcoming</h3>
        <button class="btn btn-ghost btn-sm" id="calRefresh" ${l.loading?"disabled":""}>Refresh</button>
      </div>
      <p class="meta cal-status">${r(g)}${l.stale&&!l.loading?" · Tap Refresh to update":""}</p>
      ${l.needsReconnect&&!l.loading?`
        <div class="cal-alert">
          <p>Couldn’t refresh from Google Calendar${l.error?` (${r(l.error)})`:""}. Showing saved events.</p>
          <button class="btn btn-soft btn-sm" id="calReconnect">Reconnect</button>
        </div>`:l.error&&!l.loading?`<p class="err" style="margin:0 0 8px">${r(l.error)}</p>`:""}
      ${i.length?i.map(c=>pe(c.ev,c.t)).join(""):`<div class="empty">No upcoming ${r(x)} events. ${r(P)}</div>`}
      ${d.length?`
        <details class="past-list" id="calPast" ${l.pastOpen?"open":""}>
          <summary>Past (${d.length})</summary>
          ${d.map(c=>pe(c.ev,c.t)).join("")}
        </details>`:""}
    </div>
    ${i.length?`<p class="disclaimer">${r(P)}</p>`:""}`}async function L({interactive:e=!1,consent:t=!1}={}){if(!$()||l.loading||!I()&&!e)return;l.loading=!0,l.error="",m==="appointments"&&p();const n=await gt({interactive:e,consent:t});l.loading=!1,n.ok?(l.needsReconnect=!1,l.stale=!1,l.error=""):n.needsReconnect&&!e?l.stale=!0:(l.needsReconnect=!!n.needsReconnect&&I(),l.error=n.error||"Could not reach Google Calendar"),(m==="appointments"||m==="settings")&&p()}function Dt(){const e=Ge();return`
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
          <div class="meta">${r(K(n.createdAt))}${n.author?" · "+r(n.author):""}</div>
          <p style="margin:6px 0 8px; white-space:pre-wrap">${r(n.body)}</p>
          <button class="btn btn-ghost btn-sm note-del" data-id="${n.id}">Delete</button>
        </div>`).join(""):'<div class="empty">Symptoms, questions for OB, grocery asks — shared here.</div>'}
    </div>`}function Ct(e){return`
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
    ${$()?`
    <div class="card">
      <div class="card-head"><h3 class="card-title">Google Calendar</h3></div>
      ${I()?`
      <p class="meta" style="margin:0 0 12px">Connected (read-only). Bump shows only events with ${r(x)} in the title.</p>
      <button class="btn btn-ghost btn-sm" id="calDisconnect">Disconnect</button>`:`
      <p class="meta" style="margin:0">Not connected. Use <strong>Connect Google Calendar</strong> on the Appts tab.</p>`}
    </div>`:""}
    <div class="card">
      <div class="card-head"><h3 class="card-title">Session</h3></div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="doLock">Lock</button>
        <button class="btn btn-danger btn-sm" id="doReset">Reset all data</button>
      </div>
    </div>`}function At(e){var t,n,s,a,o,i,d,g,c,k,y,S,R,E,Q,X,ee;m==="today"&&((t=e.querySelector("#hydroPlus"))==null||t.addEventListener("click",()=>{ne(1),p()}),(n=e.querySelector("#hydroMinus"))==null||n.addEventListener("click",()=>{ne(-1),p()}),(s=e.querySelector("#windToggle"))==null||s.addEventListener("click",()=>{He(!M().windDown),p()}),(a=e.querySelector("#moveDone"))==null||a.addEventListener("click",()=>{const u=M();We(!u.movementDone),p()}),(o=e.querySelector("#moveRegen"))==null||o.addEventListener("click",()=>{const u=M();_e(Re(u.movementSuggestion)),p()}),e.querySelectorAll("[data-browse-week]").forEach(u=>{u.addEventListener("click",()=>{D=Number(u.dataset.browseWeek),p()})}),(i=e.querySelector("#resetBrowse"))==null||i.addEventListener("click",()=>{D=null,p()})),m==="appointments"&&((d=e.querySelector("#calConnect"))==null||d.addEventListener("click",()=>L({interactive:!0})),(g=e.querySelector("#calRefresh"))==null||g.addEventListener("click",()=>L({interactive:!0})),(c=e.querySelector("#calReconnect"))==null||c.addEventListener("click",()=>L({interactive:!0,consent:!0})),(k=e.querySelector("#calPast"))==null||k.addEventListener("toggle",u=>{l.pastOpen=u.target.open})),m==="notes"&&((y=e.querySelector("#noteAdd"))==null||y.addEventListener("click",()=>{const u=e.querySelector("#noteBody").value.trim();u&&(Fe({body:u,author:e.querySelector("#noteAuthor").value}),p())}),e.querySelectorAll(".note-del").forEach(u=>{u.addEventListener("click",()=>{confirm("Delete this note?")&&(je(u.dataset.id),p())})})),m==="settings"&&((S=e.querySelector("#saveDue"))==null||S.addEventListener("click",()=>{const u=e.querySelector("#setDue").value;u&&(Me(u),D=null,p())}),(R=e.querySelector("#pinForm"))==null||R.addEventListener("submit",u=>{u.preventDefault();const N=e.querySelector("#setPin").value.trim();if(!Ae.test(N))return alert(Te);Ue(N),alert("PIN updated"),p()}),(E=e.querySelector("#doExport"))==null||E.addEventListener("click",()=>{const u=Ye(),N=e.querySelector("#exportBox");N.classList.remove("hidden"),N.value=u;const $e=new Blob([u],{type:"application/json"}),te=URL.createObjectURL($e),G=document.createElement("a");G.href=te,G.download=`bump-backup-${T()}.json`,G.click(),URL.revokeObjectURL(te)}),(Q=e.querySelector("#doLock"))==null||Q.addEventListener("click",()=>{ze(),v="unlock",p()}),(X=e.querySelector("#calDisconnect"))==null||X.addEventListener("click",async()=>{confirm("Disconnect Google Calendar? Saved events will be removed from this phone.")&&(await le(),Object.assign(l,{loading:!1,error:"",needsReconnect:!1,stale:!1}),p())}),(ee=e.querySelector("#doReset"))==null||ee.addEventListener("click",async()=>{confirm("Erase all Bump data on this device?")&&(await le(),Object.assign(l,{loading:!1,error:"",needsReconnect:!1,stale:!1}),Ke(),v="setup",m="today",D=null,p())}))}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(!H()||!be()||(j&&j!==T()&&p(),m==="appointments"&&L({interactive:!1})))});p();
