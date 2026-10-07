# Bump

Shared pregnancy tracker for Vince & Chantal — calm, mobile-first, **localStorage-first**.

**Live:** https://vjreo.github.io/bump/

## Features

- **Invite-only gate** before create/unlock (shared invite code, separate from household PIN)
- **Today** stat cards: **trimester** (1st = weeks 1–13, 2nd = 14–27, 3rd = 28+), days to due (or days past due), and due date — all computed in America/New_York
- **Shortcut chips** under the header (Week, Prep, Hydration, Workout, Browse) stay pinned while you scroll, jump to each card, and highlight the card in view. Tapping **Today** again scrolls back to the top.
- Week-by-week card with the current week number (NHS Best Start–inspired structure; original summaries + link out), plus a browse-by-week strip
- **Prepare this week / Looking ahead** — practical household checklist for the current stage of pregnancy
- Hydration log
- **Today’s workout + walk**: a short daily kettlebell + bodyweight session (10–15 min) plus a daily walk suggestion, picked from the date so both phones match, with separate Workout and Walk checks. See [Daily workout](#daily-workout).
- **Appointments from Google Calendar** (read-only): only events with **[Bump]** in the title are shown (tag stripped). Upcoming ~6 months plus a collapsible list of recent past events; earlier ones grayed out, same-day ones tagged **Today**, day-before reminder for tomorrow’s. Last fetch is cached on the phone for offline viewing.
- **Shared notes in a Google Doc** (“Bump Notes”) so both phones see the same list, newest first. Add a note (who + text), open the doc in Google Docs, or delete a note. The last copy is cached on the phone for offline reading (read-only). See [Shared notes](#shared-notes-google-doc).
- **Settings → Download a backup** saves a JSON copy of your data (due date and daily logs; not the PIN, calendar events, or shared notes, which live in the Google Doc)

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
4. **Appts → Connect Google Calendar** (or **Notes → Connect shared notes**) and sign in with the shared Google account. One consent screen covers both calendar and notes. Add **[Bump]** to any event title you want to see in Bump.
5. **Another phone:** enter the same invite code and create a household there. Daily logs stay on each phone; appointments and notes come from the shared Google account on both.

> No Bump accounts or Bump servers. Due date, PIN, and logs live in each phone’s browser storage; appointments and notes come straight from Google; use **Settings → Download a backup** to keep a copy.

## Google setup (Calendar + shared notes)

Appointments are read in the browser with Google Identity Services (OAuth token flow, scope `calendar.events.readonly`) and the Calendar API `events.list` — no backend.

- Set `VITE_GOOGLE_CLIENT_ID` in `.env.production` (and `.env` for local dev) to the OAuth **Web application** client ID, then rebuild and deploy. A web client ID is public by design. While it’s empty, the Appts tab shows “Calendar not set up yet.”
- In the Google Cloud project, enable the **Google Calendar API**, **Google Drive API**, and **Google Docs API**, and add both scopes under **Google Auth Platform → Data Access**: `https://www.googleapis.com/auth/calendar.events.readonly` and `https://www.googleapis.com/auth/drive.file`.
- The OAuth client needs these **Authorized JavaScript origins**: `https://vjreo.github.io` and `http://localhost:5173` (dev).
- Calendar ID, tag, and fetch window live in `src/config.js` (`CALENDAR_ID` defaults to `primary`).
- Access tokens last about an hour and are kept only on the phone. Opening the Appts tab or tapping **Refresh** gets a new one without a prompt when possible; otherwise tap **Reconnect**.
- While the Google Cloud app is in **Testing** mode, each user’s authorization expires 7 days after consent, so expect to tap Reconnect and approve again about weekly.
- **Settings → Disconnect Google** revokes access and clears saved events and cached notes (the doc itself stays in Google Drive). You can also remove access at https://myaccount.google.com/permissions.

## Shared notes (Google Doc)

Notes are stored in a Google Doc in the shared account’s Drive, read and written in the browser with the Docs and Drive APIs — no backend.

- **Scope:** `drive.file`, Google’s most limited Drive permission. Bump can only see files it created (or that were opened with it); it can’t browse the rest of Drive. Files created with one OAuth client are available to any phone signed in to the same account through the same Google Cloud project, which is why both phones see the same doc.
- **First use:** Bump looks for a doc named **Bump Notes** that it created earlier (oldest wins if there are several) or creates one, then remembers its ID on the phone.
- **Consent:** first sign-in from Appts or Notes asks for calendar + notes together. Phones that connected Calendar before shared notes existed get the extra permission when you tap **Notes → Connect shared notes** (incremental consent; calendar keeps working if you untick notes).
- **Doc format:** each note is a bold date line (e.g. “Wed, Oct 7, 2026 at 6:30 PM — Chantal”) followed by the text, appended at the bottom. Entries typed by hand in the same format show up in the app too.
- **Delete:** confirm, then Bump re-reads the doc and removes that entry. Edits use the doc’s revision ID, so two phones writing at once won’t overwrite each other (Bump retries once, or asks you to refresh).
- **Offline:** shows the last copy saved on the phone, read-only.
- **Settings → Use a different notes doc:** paste a doc link or ID. Because of `drive.file`, this only works for docs Bump created; an arbitrary existing doc would need the Google Picker or a broader scope.
- **Migration:** notes saved on a phone before this feature show a one-time **Copy my phone’s notes to the shared doc** button (keeps original dates), then local notes are cleared.
- **Limits:** if both phones connect for the very first time simultaneously, two docs could be created; Bump uses the oldest one, and you can delete the extra one in Drive.

## Invite gate (honest limits)

This is a **client-side shared-secret** check on a **static public site**. A SHA-256 hash of the invite is baked into the JS bundle at build time (`VITE_INVITE_HASH`). After a correct invite, the browser remembers unlock in `localStorage` so you don’t retype daily — the household PIN still protects data as before.

**Security-through-obscurity:** determined people can extract the hash from the bundle and offline-brute short codes. For v1 that’s OK — it keeps casual visitors out. Plaintext invite is **not** in the repo (`INVITE.txt` is gitignored). Do not paste the invite into public README or commits.

To rotate: generate a new code, update `VITE_INVITE_HASH` / `.env.production`, rebuild & redeploy; ask people to clear site data or wait for a fresh device.

## Design

Earthy palette: warm clay, sage green, sand/cream. Tabs: Today | Appts | Notes | Settings.

## Daily workout

The Today card shows one short session a day, in a five-session rotation: **Lower body strength (12 min) → Upper body & back (12) → Core & mobility (12) → Full body strength (14) → Glutes & hips (12)**. In the 3rd trimester these drop to 10–12 minutes. Each session is a 1–2 minute warm-up, 2–3 strength moves (2 sets each), and 1–2 stretches.

Each day also gets a **walk**, chosen by day of the week: Sun long relaxed walk (30–40 min), Mon easy walk (15–20), Tue brisk talk-test walk (20), Wed after-meal stroll (10), Thu gentle hills or stairs (15–20), Fri two short walks (2 × 10), and Sat a weekend walk somewhere new (30–40).

Collapsed, the card shows just the session, its duration, a one-line move list, and the walk. Tapping opens the full plan, and “When to stop” opens the warning signs. Sessions and walks are picked from the America/New_York date, so both phones match. Everything is static and runs in the browser, with no backend.

Adjustments by US trimester:
- **From week 16:** moves done lying flat on the back (or face-down on the floor) switch to incline, hands-elevated, or side-lying versions. That’s earlier than ACOG’s 20-week note, to be cautious.
- **3rd trimester (week 28+):** loads drop one step (moderate → light), reps go down, sessions stay within 10–12 minutes, and balance-heavy moves get support (box squats, supported split squats, seated halos, side-lying leg lifts). Walks get shorter and flat, with no hills or stairs, plus reminders about supportive shoes, water, and avoiding the heat.
- **Always:** no contact, jumping, or ballistic lifts; no crunches or deep twisting; exhale on effort (no breath-holding). Core work is breathing, bird dogs, and side-plank variations.

Kettlebell weights are relative (“light” and “moderate”, meaning a weight you can lift with good form and steady breathing). To adjust them, or to change doses, durations, swaps, sessions, walks, or the safety copy, edit **`src/data/workouts.js`**; all the settings live there.

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
