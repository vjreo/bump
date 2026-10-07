# Bump

Shared pregnancy tracker for Vince & Chantal — calm, mobile-first, **localStorage-first**.

**Live:** https://vjreo.github.io/bump/

## Features

- **Invite-only gate** before create/unlock (shared invite code, separate from household PIN)
- **Today** stat cards: **trimester** (1st = weeks 1–13, 2nd = 14–27, 3rd = 28+), days to due (or days past due), and due date — all computed in America/New_York
- Week-by-week card with the current week number (NHS Best Start–inspired structure; original summaries + link out), plus a browse-by-week strip
- **Prepare this week / Looking ahead** — practical household checklist for the current stage of pregnancy
- Hydration log and evening wind-down
- **Today’s workout** (kettlebell + bodyweight): one session per day, picked from the date so both phones match, with a “Done today” check. See [Daily workout](#daily-workout).
- **Appointments from Google Calendar** (read-only): only events with **[Bump]** in the title are shown (tag stripped). Upcoming ~6 months plus a collapsible list of recent past events; earlier ones grayed out, same-day ones tagged **Today**, day-before reminder for tomorrow’s. Last fetch is cached on the phone for offline viewing.
- Shared notes
- **Settings → Download a backup** saves a JSON copy of your data (due date, logs, notes; not the PIN or calendar events)

## Quick start

```bash
npm install
# Copy hash into .env (see .env.example / .env.production)
cp .env.production .env   # or set VITE_INVITE_HASH yourself
npm run dev
```

Open the printed local URL on your phone (same network) or use desktop mobile viewport.

```bash
npm run build
npm run preview
```

## First-run

1. Open the app → enter the **invite code** (ask Vince). It’s remembered on that phone afterward.
2. **Create household** — set the **due date** + a shared **PIN** (at least 4 digits)
3. You’re on **Today**
4. **Appts → Connect Google Calendar** and sign in with the Google account that has the shared calendar. Add **[Bump]** to any event title you want to see in Bump.
5. **Another phone:** enter the same invite code and create a household there. Notes and logs stay on each phone; appointments come from the shared Google Calendar on both.

> No Bump accounts or cloud sync. Data lives in each phone’s browser storage; use **Settings → Download a backup** to keep a copy.

## Google Calendar setup

Appointments are read in the browser with Google Identity Services (OAuth token flow, scope `calendar.events.readonly`) and the Calendar API `events.list` — no backend.

- Set `VITE_GOOGLE_CLIENT_ID` in `.env.production` (and `.env` for local dev) to the OAuth **Web application** client ID, then rebuild and deploy. A web client ID is public by design. While it’s empty, the Appts tab shows “Calendar not set up yet.”
- The OAuth client needs these **Authorized JavaScript origins**: `https://vjreo.github.io` and `http://localhost:5173` (dev).
- Calendar ID, tag, and fetch window live in `src/config.js` (`CALENDAR_ID` defaults to `primary`).
- Access tokens last about an hour and are kept only on the phone. Opening the Appts tab or tapping **Refresh** gets a new one without a prompt when possible; otherwise tap **Reconnect**.
- While the Google Cloud app is in **Testing** mode, each user’s authorization expires 7 days after consent, so expect to tap Reconnect and approve again about weekly.
- **Settings → Disconnect** revokes access and clears saved events. You can also remove access at https://myaccount.google.com/permissions.

## Invite gate (honest limits)

This is a **client-side shared-secret** check on a **static public site**. A SHA-256 hash of the invite is baked into the JS bundle at build time (`VITE_INVITE_HASH`). After a correct invite, the browser remembers unlock in `localStorage` so you don’t retype daily — the household PIN still protects data as before.

**Security-through-obscurity:** determined people can extract the hash from the bundle and offline-brute short codes. For v1 that’s OK — it keeps casual visitors out. Plaintext invite is **not** in the repo (`INVITE.txt` is gitignored). Do not paste the invite into public README or commits.

To rotate: generate a new code, update `VITE_INVITE_HASH` / `.env.production`, rebuild & redeploy; ask people to clear site data or wait for a fresh device.

## Design

Earthy palette: warm clay, sage green, sand/cream. Tabs: Today | Appts | Notes | Settings.

## Daily workout

The Today card rotates through five ~20–35 minute sessions, one per day: **Lower body strength → Upper body & back → Active recovery → Full body strength → Mobility & core stability**. Each has a short warm-up, 3–5 strength moves, and 2–4 mobility moves. The session is chosen from the America/New_York date, so both phones show the same workout. Everything is static and runs in the browser; no backend.

Adjustments by US trimester:
- **From week 16:** moves done lying flat on the back (or face-down on the floor) switch to incline, hands-elevated, or side-lying versions. That’s earlier than ACOG’s 20-week note, to be cautious.
- **3rd trimester (week 28+):** loads drop one step (moderate → light), there are fewer sets, and balance-heavy moves get support (box squats, supported split squats, seated presses, side-lying clamshells).
- **Always:** no contact, jumping, or ballistic lifts; no crunches or deep twisting; exhale on effort (no breath-holding). Core work is breathing, bird dogs, and side-plank variations.

Kettlebell weights are relative (“light” and “moderate”, meaning a weight you can lift with good form and steady breathing). To adjust them, or to change doses, swaps, sessions, or the safety copy, edit **`src/data/workouts.js`**; all the settings live there.

Not medical advice. The card says to check with an OB or midwife before starting, and it lists ACOG’s warning signs for stopping.

**Sources:**
- ACOG Committee Opinion No. 804, *Physical Activity and Exercise During Pregnancy and the Postpartum Period* (Obstet Gynecol 2020;135:e178–88): https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period
- ACOG FAQ, *Exercise During Pregnancy*: https://www.acog.org/womens-health/faqs/exercise-during-pregnancy

## Week content

Original short summaries structured like the [NHS Best Start in Life week-by-week guide](https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/). Each card links to the matching NHS week URL. **Not medical advice** and not a verbatim copy of NHS text.

## Hosting

GitHub Pages from the `gh-pages` branch (`base: /bump/`). Source lives on `main`. There’s no Actions workflow (the deploy token lacks the workflow scope), so deploys are manual:

```bash
# 1. Commit and push source
git push origin main

# 2. Build (needs VITE_INVITE_HASH in .env — see Quick start)
npm run build

# 3. Publish dist/ to gh-pages via a temporary worktree
git worktree add /tmp/bump-gh-pages gh-pages
cd /tmp/bump-gh-pages
git pull --ff-only origin gh-pages
git rm -rq .
cp -r /path/to/bump-tracker/dist/. .
touch .nojekyll
git add -A
git commit -m "Deploy <main sha>"
git push origin gh-pages
cd - && git worktree remove /tmp/bump-gh-pages
```

Pages usually updates within a minute. Check https://vjreo.github.io/bump/?cb=123 (any query string busts the cache) and confirm `index.html` references the new `assets/index-*.js`.
