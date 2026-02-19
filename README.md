# IsuiHome Mission Control

Next.js App Router + TypeScript + Tailwind CSS + Convex project for IsuiHome.

## Core Components
- Tasks Board: Visual task dashboard sourced from `HEARTBEAT.md` and `tasks` in Convex.
- Calendar: Scheduled cron jobs and upcoming tasks.
- Memory: Searchable memories/logs view.
- Team: Agent roster for Isui, Jarvis, and MC.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Convex (realtime database)

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.local.example .env.local
   ```
3. Start Convex and generate files:
   ```bash
   npx convex dev
   ```
4. Start Next.js:
   ```bash
   npm run dev
   ```

## Notes
- `convex/_generated` is intentionally gitignored and will be created by `npx convex dev`.
- UI falls back to local seed constants when `NEXT_PUBLIC_CONVEX_URL` is not set.
