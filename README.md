# Bump

Shared pregnancy tracker for Vince & Chantal — calm, mobile-first, **localStorage-first**.

**Live:** https://vjreo.github.io/bump/

## Features

- **Invite-only gate** before create/unlock (shared invite code, separate from household PIN)
- Due date + pregnancy week counter (America/New_York)
- Week-by-week card (NHS Best Start–inspired structure; original summaries + link out)
- Hydration log, evening wind-down, daily gentle movement
- Appointments with day-before buffer flag
- Shared notes
- Export / Import JSON to sync phones manually
- **Prepare this week / Coming up** — practical prep checklist from due-date week

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

1. Open the app → enter the **invite code** (ask Vince)
2. **Create household** — set **due date** + shared **PIN** (4+ characters)
3. You’re on **Today**
4. Other phone: same invite once (remembered in localStorage), then unlock with the household PIN after **Settings → Export JSON** / **Import**, or **Import backup** on the gate screen

> No accounts or cloud sync. Export on phone A → share the file → Import on phone B.

## Invite gate (honest limits)

This is a **client-side shared-secret** check on a **static public site**. A SHA-256 hash of the invite is baked into the JS bundle at build time (`VITE_INVITE_HASH`). After a correct invite, the browser remembers unlock in `localStorage` so you don’t retype daily — the household PIN still protects data as before.

**Security-through-obscurity:** determined people can extract the hash from the bundle and offline-brute short codes. For v1 that’s OK — it keeps casual visitors out. Plaintext invite is **not** in the repo (`INVITE.txt` is gitignored). Do not paste the invite into public README or commits.

To rotate: generate a new code, update `VITE_INVITE_HASH` / `.env.production`, rebuild & redeploy; ask people to clear site data or wait for a fresh device.

## Design

Earthy palette: warm clay, sage green, sand/cream. Tabs: Today | Appts | Notes | Settings.

## Week content

Original short summaries structured like the [NHS Best Start in Life week-by-week guide](https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/). Each card links to the matching NHS week URL. **Not medical advice** and not a verbatim copy of NHS text.

## Hosting

GitHub Pages from the `gh-pages` branch (`base: /bump/`). Source lives on `main`.
