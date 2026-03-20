# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Treasure Box Game — a browser-based React game where players click on treasure chests to find hidden treasure. One of three chests contains treasure (+$100), the others contain skeletons (-$50). The game ends when the treasure is found or all chests are opened. Includes user authentication and score tracking via a backend API.

## Development Commands

```bash
npm install           # Install dependencies
npm run dev           # Start both frontend (port 3000) and backend (port 3001) concurrently
npm run dev:frontend  # Start Vite dev server only (http://localhost:3000)
npm run dev:backend   # Start Express API server only (http://localhost:3001)
npm run build         # Production build to ./build directory
```

No test runner or linter is configured.

## Architecture

### Frontend
- **Vite + React 18 + TypeScript** — uses `@vitejs/plugin-react-swc` for fast builds
- **Single-page app** — all game logic lives in `src/App.tsx` (state management via React hooks)
- **UI components** — `src/components/ui/` contains a full shadcn/ui component library (Radix UI primitives + Tailwind CSS + `class-variance-authority`)
- **Styling** — Tailwind CSS v4 with CSS variables defined in `src/styles/globals.css`; base styles imported via `src/index.css`
- **Animations** — uses `motion` (Framer Motion) for chest open/reveal animations
- **Path alias** — `@` maps to `./src` (configured in `vite.config.ts`)
- **Assets** — treasure chest images in `src/assets/`, sound effects in `src/audios/`
- **API proxy** — Vite proxies `/api` requests to `http://localhost:3001`
- **Build output** — `build/` directory (not the default `dist/`)

### Backend
- **Express 5 + TypeScript** — runs via `tsx watch` for hot-reload during development
- **SQLite** — uses `better-sqlite3` with WAL mode; database file at `server/data.db`
- **Auth** — JWT-based authentication with bcrypt password hashing (`server/routes/auth.ts`, `server/middleware/auth.ts`)
- **API routes**:
  - `/api/auth` — user registration and login
  - `/api/scores` — game score recording and leaderboard
- **Database schema** — `users` table (email, password_hash) and `game_scores` table (user_id, score, result, chests_opened) defined in `server/db.ts`
