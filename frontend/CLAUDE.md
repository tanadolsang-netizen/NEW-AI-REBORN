@AGENTS.md

# Astral frontend — architecture notes

Next.js 16 (App Router) + React 19 + Tailwind v4. Talks to a FastAPI-style
backend at `http://127.0.0.1:8000` — never call it directly from client code.

## Routing to the backend

`next.config.ts` rewrites requests so pages can just `fetch("/api/...")`:

- `/api/:path*` → `http://127.0.0.1:8000/v1/:path*`
- `/ready` → `http://127.0.0.1:8000/ready` (used for the health pill on `/`)

There is no `src/app/api/` directory — routing is handled entirely by the
rewrite above, not by Next.js route handlers. If a page needs a new backend
endpoint, it's already reachable at `/api/<path>`; nothing to scaffold on the
frontend side.

## Pages

- `/` — marketing-style landing (hero, feature cards, CTA). Server component;
  pings `/ready` at request time for the status pill.
- `/dashboard` — quick stats, recent charts (`POST /api/dashboard/recent`),
  auto-loaded transit summary (`GET /api/transit/now`), and action cards.
- `/natal` — `POST /api/natal/compute`
- `/transit` — `GET /api/transit/now`
- `/synastry` — `POST /api/synastry/cross-aspects`
- `/branches` — `GET /api/branches/list`

All data pages are client components (`"use client"`) since they're
form/fetch driven; `/` is the only server component.

## Design system (`src/app/globals.css`)

Colors are CSS variables swapped by a `.dark` class on `<html>`
(`--background`, `--foreground`, `--surface`, `--surface-hover`, `--border`,
`--muted`, `--accent`), toggled by `src/components/ThemeToggle.tsx` and
initialized pre-hydration by an inline script in `layout.tsx` (avoids
flash-of-wrong-theme). Don't hardcode `zinc-*`/`black`/`white` colors in new
UI — use the `bg-background` / `text-foreground` / `border-border` /
`text-muted` Tailwind tokens (mapped via `@theme inline`) so it respects dark
mode automatically.

Reusable component classes (`@layer components` in `globals.css`):

- `.card` — rounded-2xl bordered surface; pair with `.card-hover` for
  interactive/linked cards
- `.btn-primary` / `.btn-secondary` — pill buttons
- `.input-field` — form inputs
- `.pill` — small status/badge chip (used for the backend-health indicator)
- `.glass` — translucent blurred surface (used by `NavBar`)
- `.bg-hero-gradient` — subtle radial accent gradient for hero sections

Font: Inter (`next/font/google`, variable `--font-inter`) mapped to
`--font-sans`, with an `-apple-system`/`SF Pro` fallback stack in `body`.
Geist Mono (`--font-geist-mono`) is kept for monospace/JSON output (e.g. the
raw branch dump on `/branches`).

## Conventions

- Keep new pages consistent with the above: `.card` for content blocks,
  `.btn-primary`/`.btn-secondary` for actions, CSS-variable color tokens
  (never hardcoded palette colors), `rounded-2xl` for card-level radii.
- Read `AGENTS.md` (imported above) before assuming any Next.js API matches
  your training data — this repo pins a Next.js version with breaking
  changes from what you may expect.
