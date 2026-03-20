# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Treasure Box Game — a browser-based React game where players click on treasure chests to find hidden treasure. One of three chests contains treasure (+$100), the others contain skeletons (-$50). The game ends when the treasure is found or all chests are opened.

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on http://localhost:3000 (auto-opens browser)
npm run build      # Production build to ./build directory
```

No test runner or linter is configured.

## Architecture

- **Vite + React 18 + TypeScript** — uses `@vitejs/plugin-react-swc` for fast builds
- **Single-page app** — all game logic lives in `src/App.tsx` (state management via React hooks)
- **UI components** — `src/components/ui/` contains a full shadcn/ui component library (Radix UI primitives + Tailwind CSS + `class-variance-authority`)
- **Styling** — Tailwind CSS v4 with CSS variables defined in `src/styles/globals.css`; base styles imported via `src/index.css`
- **Animations** — uses `motion` (Framer Motion) for chest open/reveal animations
- **Path alias** — `@` maps to `./src` (configured in `vite.config.ts`)
- **Assets** — treasure chest images in `src/assets/`, sound effects in `src/audios/`
- **Build output** — `build/` directory (not the default `dist/`)
