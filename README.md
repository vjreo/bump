# Bump

Shared pregnancy tracker for Vince & Chantal — calm, mobile-first, **localStorage-first**.

**Live:** https://vjreo.github.io/bump/

## Features

- Due date + pregnancy week counter (America/New_York)
- Week-by-week card (NHS Best Start–inspired structure; original summaries + link out)
- Hydration log, evening wind-down, daily gentle movement
- Appointments with day-before buffer flag
- Shared notes
- Export / Import JSON to sync phones manually

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same network) or use desktop mobile viewport.

```bash
npm run build
npm run preview
```

## First-run

1. Open the app → **Create household**
2. Set **due date** + shared **PIN** (4+ characters)
3. You’re on **Today**
4. Other phone: unlock with the same PIN after **Settings → Export JSON** / **Import**, or **Import backup** on the gate screen

> No accounts or cloud sync. Export on phone A → share the file → Import on phone B.

## Design

Earthy palette: warm clay, sage green, sand/cream. Tabs: Today | Appts | Notes | Settings.

## Week content

Original short summaries structured like the [NHS Best Start in Life week-by-week guide](https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/). Each card links to the matching NHS week URL. **Not medical advice** and not a verbatim copy of NHS text.

## Hosting

GitHub Pages via Actions (`.github/workflows/deploy-pages.yml`). Vite `base` is `/bump/`.
