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

- `/` — marketing-style landing (hero, feature cards, CTA). Client component;
  pings `/ready` on mount for the status pill.
- `/dashboard` — quick stats, recent charts (`POST /api/dashboard/recent`),
  auto-loaded transit summary (`GET /api/transit/now`), and action cards.
- `/natal` — `POST /api/natal/compute`
- `/transit` — `GET /api/transit/now`
- `/synastry` — `POST /api/synastry/cross-aspects`
- `/branches` — `GET /api/branches/list`

All pages are client components (`"use client"`) since the app is built with
`output: "export"` for Capacitor packaging — there is no Next.js server at
runtime to do request-time SSR, so every fetch happens in the browser/webview.
Pages use `apiPath()`/`readyPath()` from `src/lib/api.ts` instead of hardcoded
`/api/...` strings: in a normal `next dev`/`next start` build those resolve to
the rewrite paths above, but in a static export they resolve to a full origin
via `NEXT_PUBLIC_API_BASE_URL` (the rewrites below don't exist once there's no
Next server — see `MOBILE_BUILD.md`).

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

## Business direction

Full detail lives in `MARKET_RESEARCH.md` and `PRODUCT_STRATEGY.md` — read
those before proposing roadmap/positioning changes. Summary:

- **Beachhead market: Thailand.** The identified gap is that global
  astrology apps (Co-Star, Nebula, Chani, The Pattern) don't localize
  beyond translated copy — none support Thai zodiac (ปีนักษัตร) or the
  Buddhist calendar. Astral's wedge is building those as first-class
  systems, not bolt-ons.
- **Core differentiators:** offline-first (Capacitor, local-first
  computation), native Thai-tradition support, the multi-tradition
  "branches" system, and privacy (birth data doesn't need to leave the
  device for core features). Voice/conversational AI reading is a roadmap
  item, not yet built.
- **First shipped slice of this strategy:** `src/lib/thaiZodiac.ts` +
  `src/components/ThaiZodiacWidget.tsx`, surfaced as a section on `/`.
  It's a working prototype (CE-year approximation of the animal cycle,
  EN/TH toggle scoped to that one widget) — not the full localization
  effort described in `PRODUCT_STRATEGY.md`.
- Market-size figures in `MARKET_RESEARCH.md` were supplied by the product
  team as strategy inputs and have not been independently re-verified —
  don't restate them externally without checking the source report.
